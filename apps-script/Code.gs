/**
 * Ban Rai School Hub — ระบบหลังบ้าน (Google Apps Script)
 * เก็บข้อมูลไว้ใน Google Sheets ที่สคริปต์นี้ผูกอยู่:
 *   - ชีต "Systems"  = ปุ่มระบบงานของโรงเรียน
 *   - ชีต "EsCats"   = หมวดของ "บริการ สพป." (สร้างให้อัตโนมัติตอนบันทึกครั้งแรก)
 *   - ชีต "EsLinks"  = ลิงก์ของ "บริการ สพป."
 *   - หน้าตาส่วนกลาง (ทุกคนเห็น) เก็บใน Script Properties คีย์ THEME (ไม่ต้องมีชีต)
 *
 * วิธีติดตั้ง/อัปเดต อยู่ในไฟล์ apps-script/SETUP.md และ apps-script/UPDATE-ESERVICE.md
 */

// ====== ตั้งค่า: เปลี่ยนรหัสผ่านผู้ดูแลก่อนใช้งานจริง ======
const ADMIN_PASSWORD = '123456';
// ==========================================================

const SHEET_NAME = 'Systems';
const HEADERS = ['id', 'name', 'desc', 'group', 'tag', 'url', 'icon', 'color'];
const GROUPS = ['student', 'academic', 'operations'];
const MAX_ITEMS = 60;
const MAX_FAILS = 10;          // ใส่รหัสผิดได้กี่ครั้ง
const LOCK_SECONDS = 600;     // แล้วล็อกกี่วินาที

// ----- บริการ สพป. (E-Service) -----
const ES_CATS_SHEET = 'EsCats';
const ES_LINKS_SHEET = 'EsLinks';
const ES_CAT_HEADERS = ['id', 'name', 'icon', 'color'];
const ES_LINK_HEADERS = ['id', 'cat', 'name', 'short', 'desc', 'url', 'icon', 'color', 'pin'];
const MAX_ES_CATS = 20;

// ----- หน้าตาส่วนกลาง (ต้องตรงกับ THEME_OPTS ใน app.js) -----
const THEME_OPTS = {
  cards: ['pastel', 'plain'], tint: ['soft', 'mid', 'vivid'],
  tex: ['none', 'dots', 'grain', 'gingham', 'linen'],
  lantern: ['on', 'off'], count: ['low', 'mid', 'high'], wig: ['soft', 'mid', 'strong'],
  skin: ['classic', 'auto', 'midnight', 'aurora', 'candy', 'sakura', 'forest', 'sunset', 'graphite'],
  layout: ['card', 'grid', 'list', 'tile'],
  ics: ['classic', 'ios', 'glass', 'jelly', 'tonal', 'neu', 'neon', 'outline'],
  shape: ['auto', 'squircle', 'circle', 'rounded', 'square', 'leaf'],
  isize: ['s', 'm', 'l'], iw: ['thin', 'reg', 'bold'], accent: ['own', 'theme'], motion: ['on', 'calm']
};
const MAX_ES_LINKS = 150;

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'list';
  if (action === 'list') {
    return json_({
      ok: true,
      systems: readAll_(), version: getVersion_(),
      eservice: readEs_(), esVersion: getEsVersion_(),
      theme: readTheme_(), themeVersion: getThemeVersion_()
    });
  }
  return json_({ ok: false, error: 'unknown_action' });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch (err) { return json_({ ok: false, error: 'bad_request' }); }

  const auth = checkPassword_(body.password);
  if (auth !== 'ok') return json_({ ok: false, error: auth });

  if (body.action === 'verify') return json_({ ok: true });

  if (body.action === 'save') {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
    try {
      const current = getVersion_();
      if (current && body.baseVersion && String(body.baseVersion) !== current) {
        return json_({ ok: false, error: 'version_conflict' });
      }
      const clean = validate_(body.systems);
      if (typeof clean === 'string') return json_({ ok: false, error: clean });
      writeAll_(clean);
      const version = String(Date.now());
      PropertiesService.getScriptProperties().setProperty('VERSION', version);
      return json_({ ok: true, systems: clean, version: version });
    } finally {
      lock.releaseLock();
    }
  }

  if (body.action === 'esSave') {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
    try {
      const current = getEsVersion_();
      if (current && body.baseVersion && String(body.baseVersion) !== current) {
        return json_({ ok: false, error: 'version_conflict' });
      }
      const clean = validateEs_(body.eservice);
      if (typeof clean === 'string') return json_({ ok: false, error: clean });
      writeEs_(clean);
      const version = String(Date.now());
      PropertiesService.getScriptProperties().setProperty('ES_VERSION', version);
      return json_({ ok: true, eservice: clean, version: version });
    } finally {
      lock.releaseLock();
    }
  }

  if (body.action === 'themeSave') {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return json_({ ok: false, error: 'busy' });
    try {
      const current = getThemeVersion_();
      if (current && body.baseVersion && String(body.baseVersion) !== current) {
        return json_({ ok: false, error: 'version_conflict' });
      }
      const clean = validateTheme_(body.theme);
      if (typeof clean === 'string') return json_({ ok: false, error: clean });
      const p = PropertiesService.getScriptProperties();
      const version = String(Date.now());
      p.setProperty('THEME', JSON.stringify(clean));
      p.setProperty('THEME_VERSION', version);
      return json_({ ok: true, theme: clean, version: version });
    } finally {
      lock.releaseLock();
    }
  }

  return json_({ ok: false, error: 'unknown_action' });
}

// ---------- รหัสผ่าน + กันเดารหัส ----------
function checkPassword_(pw) {
  if (ADMIN_PASSWORD === 'เปลี่ยนรหัสนี้') return 'password_not_set';
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('fails') || 0);
  if (fails >= MAX_FAILS) return 'locked';
  if (typeof pw === 'string' && pw === ADMIN_PASSWORD) {
    cache.remove('fails');
    return 'ok';
  }
  cache.put('fails', String(fails + 1), LOCK_SECONDS);
  return 'wrong_password';
}

// ---------- อ่าน/เขียนชีต: ปุ่มระบบ ----------
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function readAll_() {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const rows = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return rows
    .filter(r => r[0] && r[1] && r[5])
    .map(r => ({
      id: String(r[0]), name: String(r[1]), desc: String(r[2]),
      group: String(r[3]), tag: String(r[4]), url: String(r[5]),
      icon: String(r[6]), color: String(r[7])
    }));
}

function writeAll_(items) {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, HEADERS.length).clearContent();
  if (!items.length) return;
  const values = items.map(s => HEADERS.map(h => s[h]));
  const range = sh.getRange(2, 1, values.length, HEADERS.length);
  range.setNumberFormat('@');          // เก็บเป็นข้อความล้วน กันถูกตีความเป็นสูตร
  range.setValues(values);
}

function getVersion_() {
  return PropertiesService.getScriptProperties().getProperty('VERSION') || '';
}

// ---------- อ่าน/เขียนชีต: บริการ สพป. ----------
function esSheet_(name, headers) {            // สร้างชีตให้เมื่อจำเป็น (ใช้ตอนบันทึก)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function esRows_(name, headers) {             // อ่านอย่างเดียว ไม่สร้างชีต
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) return [];
  const last = sh.getLastRow();
  if (last < 2) return [];
  return sh.getRange(2, 1, last - 1, headers.length).getValues().map(r => {
    const o = {};
    headers.forEach((h, i) => { o[h] = r[i]; });
    return o;
  });
}

function readEs_() {
  const cats = esRows_(ES_CATS_SHEET, ES_CAT_HEADERS)
    .filter(r => r.id && r.name)
    .map(r => ({ id: String(r.id), name: String(r.name), icon: String(r.icon), color: String(r.color) }));
  if (!cats.length) return null;              // ยังไม่เคยบันทึกออนไลน์
  const links = esRows_(ES_LINKS_SHEET, ES_LINK_HEADERS)
    .filter(r => r.id && r.name && r.url)
    .map(r => ({
      id: String(r.id), cat: String(r.cat), name: String(r.name), short: String(r.short),
      desc: String(r.desc), url: String(r.url), icon: String(r.icon), color: String(r.color),
      pin: String(r.pin) === '1'
    }));
  const p = PropertiesService.getScriptProperties();
  return { title: p.getProperty('ES_TITLE') || '', show: p.getProperty('ES_SHOW') !== '0', cats: cats, links: links };
}

function writeEsRows_(name, headers, items) {
  const sh = esSheet_(name, headers);
  const last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, headers.length).clearContent();
  if (!items.length) return;
  const values = items.map(o => headers.map(h => o[h]));
  const range = sh.getRange(2, 1, values.length, headers.length);
  range.setNumberFormat('@');                 // ข้อความล้วน กันถูกตีความเป็นสูตร
  range.setValues(values);
}

function writeEs_(es) {
  writeEsRows_(ES_CATS_SHEET, ES_CAT_HEADERS, es.cats);
  writeEsRows_(ES_LINKS_SHEET, ES_LINK_HEADERS, es.links.map(l => Object.assign({}, l, { pin: l.pin ? '1' : '0' })));
  const p = PropertiesService.getScriptProperties();
  p.setProperty('ES_TITLE', es.title);
  p.setProperty('ES_SHOW', es.show ? '1' : '0');
}

function getEsVersion_() {
  return PropertiesService.getScriptProperties().getProperty('ES_VERSION') || '';
}

// ---------- หน้าตาส่วนกลาง ----------
function readTheme_() {
  const s = PropertiesService.getScriptProperties().getProperty('THEME');
  if (!s) return null;                        // ยังไม่เคยตั้ง → หน้าเว็บใช้ค่าเริ่มต้น
  try { return JSON.parse(s); } catch (err) { return null; }
}

function getThemeVersion_() {
  return PropertiesService.getScriptProperties().getProperty('THEME_VERSION') || '';
}

function validateTheme_(o) {
  if (!o || typeof o !== 'object') return 'invalid_theme';
  const out = {};
  for (const k in THEME_OPTS) {
    if (THEME_OPTS[k].indexOf(o[k]) < 0) return 'invalid_theme';
    out[k] = o[k];
  }
  const bn = validateBanner_(o.banner);
  if (typeof bn === 'string') return bn;
  out.banner = bn;
  return out;
}

// แบนเนอร์ส่วนกลาง: ใช้ได้เฉพาะลิงก์ https หรือพาธไฟล์ในเว็บ (ไม่รับ data: เพื่อไม่ให้ข้อมูลใหญ่)
const BN_URL_OK = /^(?:https?:\/\/[^\s"'()\\]+|(?!\/)(?!.*\.\.)[A-Za-z0-9_\-.\/]+\.(?:png|jpe?g|webp|gif|svg|avif))$/i;
function validateBanner_(b) {
  b = (b && typeof b === 'object') ? b : {};
  const url = String(b.url || '').trim();
  if (url && (url.length > 1000 || !BN_URL_OK.test(url))) return 'invalid_banner';
  const num = function (v, lo, hi, d, dec) {
    v = Number(v);
    if (!isFinite(v)) return d;
    v = Math.min(hi, Math.max(lo, v));
    return dec ? Math.round(v * 10) / 10 : Math.round(v);
  };
  return {
    url: url, x: num(b.x, 0, 100, 50, true), y: num(b.y, 0, 100, 50, true),
    zoom: num(b.zoom, 100, 300, 100), h: num(b.h, 0, 420, 0), ov: num(b.ov, -60, 60, 0)
  };
}

// ---------- ตรวจข้อมูลก่อนบันทึก ----------
function validate_(list) {
  if (!Array.isArray(list)) return 'invalid_data';
  if (list.length > MAX_ITEMS) return 'too_many_items';
  const seen = {};
  const out = [];
  for (let i = 0; i < list.length; i++) {
    const s = list[i] || {};
    const id = String(s.id || '');
    const name = String(s.name || '').trim();
    const url = String(s.url || '').trim();
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(id) || seen[id]) return 'invalid_id';
    if (!name || name.length > 60) return 'invalid_name';
    if (!/^https?:\/\/\S+$/i.test(url) || url.length > 1000) return 'invalid_url';
    if (GROUPS.indexOf(s.group) < 0) return 'invalid_group';
    if (!/^#[0-9a-fA-F]{6}$/.test(String(s.color || ''))) return 'invalid_color';
    if (!/^[a-z0-9]{1,20}$/.test(String(s.icon || ''))) return 'invalid_icon';
    seen[id] = true;
    out.push({
      id: id, name: name,
      desc: String(s.desc || '').trim().slice(0, 120),
      group: s.group,
      tag: String(s.tag || '').trim().slice(0, 30),
      url: url, icon: s.icon, color: s.color
    });
  }
  return out;
}

function validateEs_(o) {
  if (!o || typeof o !== 'object' || !Array.isArray(o.cats) || !Array.isArray(o.links)) return 'invalid_data';
  if (o.cats.length < 1) return 'invalid_cats';
  if (o.cats.length > MAX_ES_CATS) return 'too_many_cats';
  if (o.links.length > MAX_ES_LINKS) return 'too_many_links';
  const idOk = v => /^[A-Za-z0-9_-]{1,40}$/.test(v);
  const iconOk = v => /^[a-z0-9]{1,20}$/.test(String(v || ''));
  const colorOk = v => /^#[0-9a-fA-F]{6}$/.test(String(v || ''));
  const catIds = {};
  const cats = [];
  for (let i = 0; i < o.cats.length; i++) {
    const c = o.cats[i] || {};
    const id = String(c.id || '');
    const name = String(c.name || '').trim();
    if (!idOk(id) || catIds[id]) return 'invalid_id';
    if (!name || name.length > 40) return 'invalid_name';
    if (!iconOk(c.icon)) return 'invalid_icon';
    if (!colorOk(c.color)) return 'invalid_color';
    catIds[id] = true;
    cats.push({ id: id, name: name, icon: c.icon, color: c.color });
  }
  const linkIds = {};
  const links = [];
  for (let i = 0; i < o.links.length; i++) {
    const l = o.links[i] || {};
    const id = String(l.id || '');
    const name = String(l.name || '').trim();
    const url = String(l.url || '').trim();
    if (!idOk(id) || linkIds[id]) return 'invalid_id';
    if (!catIds[String(l.cat || '')]) return 'invalid_group';
    if (!name || name.length > 90) return 'invalid_name';
    if (!/^https?:\/\/\S+$/i.test(url) || url.length > 1000) return 'invalid_url';
    if (!iconOk(l.icon)) return 'invalid_icon';
    if (!colorOk(l.color)) return 'invalid_color';
    linkIds[id] = true;
    links.push({
      id: id, cat: String(l.cat), name: name,
      short: String(l.short || '').trim().slice(0, 24),
      desc: String(l.desc || '').trim().slice(0, 120),
      url: url, icon: l.icon, color: l.color, pin: l.pin === true
    });
  }
  return {
    title: String(o.title || '').trim().slice(0, 60) || 'บริการ สพป.',
    show: o.show !== false,
    cats: cats, links: links
  };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
