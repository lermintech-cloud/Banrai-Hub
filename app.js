const CFG = window.HUB_CONFIG || {};
const API = String(CFG.API_URL || "").trim();
const BASE = "https://script.google.com/macros/s/AKfycbyNCNM0vR7VSt-RYQB8ukOGwYa1WVgvjsohiC1MoLw1pk-aC5lO5hA7h2DNywaCLagiVQ/exec";

const GROUPS = {student:"งานนักเรียนและดูแลช่วยเหลือ",academic:"งานวิชาการและประเมินผล",operations:"ระบบสนับสนุนการทำงาน"};
const GROUP_ORDER = ["student","academic","operations"];
const PASTELS = ["#FF9DBB","#FFB38A","#FFD86B","#B5E48C","#8FE3CF","#8CCBFF","#B8A9FF","#F0A6E8"];
const COLORS = ["#0A84FF","#00B3E6","#00BFA5","#16B364","#7CB518","#E5B800","#FF8A00","#FF6B2C","#F0284A","#FF3D81","#E02CC0","#8B5CF6","#3D5AFE","#6B7A90"];

/* รายการเริ่มต้น (ใช้เมื่อยังไม่ได้เชื่อมต่อออนไลน์ หรือกด "รีเซ็ต") */
const DEFAULT_SYSTEMS = [
 {id:"attendance",name:"เช็คชื่อนักเรียน",desc:"บันทึกและจัดการการเข้าเรียนของนักเรียน",group:"student",tag:"งานนักเรียน",url:BASE,icon:"users",color:"#0A84FF"},
 {id:"homevisit",name:"เยี่ยมบ้าน",desc:"บันทึกข้อมูลและติดตามการเยี่ยมบ้านนักเรียน",group:"student",tag:"ดูแลช่วยเหลือ",url:BASE+"?page=HomeVisit",icon:"home",color:"#FF6B2C"},
 {id:"curriculum",name:"หลักสูตรสถานศึกษา",desc:"เข้าถึงข้อมูลและงานหลักสูตรสถานศึกษา",group:"academic",tag:"งานวิชาการ",url:BASE+"?page=curriculum",icon:"book",color:"#8B5CF6"},
 {id:"gradeentry",name:"ระบบลงคะแนน",desc:"บันทึกคะแนนและผลการเรียนรายวิชา",group:"academic",tag:"ลงคะแนน",url:BASE+"?page=gradeentry",icon:"edit",color:"#F0284A"},
 {id:"grade5",name:"ผล ปพ.5",desc:"ตรวจดูผลและข้อมูลรายงาน ปพ.5",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_grade",icon:"chart",color:"#00B3E6"},
 {id:"individual",name:"กรอก ปพ.6",desc:"กรอกข้อมูลผลการเรียนรายบุคคล",group:"academic",tag:"กรอกข้อมูล",url:BASE+"?page=individual",icon:"file",color:"#E02CC0"},
 {id:"reportindi",name:"ผล ปพ.6",desc:"ดูรายงานผลการเรียนรายบุคคล",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_indi",icon:"filecheck",color:"#E5B800"},
 {id:"kindergarten",name:"กรอก อนุบาล",desc:"กรอกข้อมูลประเมินพัฒนาการเด็กปฐมวัย",group:"academic",tag:"ปฐมวัย",url:BASE+"?page=kindergarten",icon:"blocks",color:"#16B364"},
 {id:"reportkind",name:"ผล อนุบาล",desc:"ตรวจดูผลการประเมินเด็กปฐมวัย",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_kind",icon:"clipboard",color:"#FF8A00"},
 {id:"kinderbook",name:"เล่ม อนุบาล",desc:"จัดการและเข้าถึงเล่มรายงานอนุบาล",group:"academic",tag:"เอกสารปฐมวัย",url:BASE+"?page=kinderbook",icon:"bookcheck",color:"#3D5AFE"},
 {id:"semis",name:"SEMIS",desc:"ระบบบริหารจัดการโรงเรียน (SEMIS)",group:"operations",tag:"บริหารโรงเรียน",url:"https://script.google.com/macros/s/AKfycbytXB6CZ2qjXceoY3iW3jvirOFVGChJmhG2t0yVGoMyCKd4vrfyjjqi-9dNmb8l-HpErQ/exec?school=S003",icon:"school",color:"#7CB518"},
 {id:"janitor",name:"ระบบภารโรง",desc:"แจ้งงานและติดตามงานอาคารสถานที่",group:"operations",tag:"อาคารสถานที่",url:"https://lermintech-cloud.github.io/SATID/",icon:"wrench",color:"#E5B800"},
 {id:"calendar",name:"ปฏิทินวิชาการ",desc:"ดูปฏิทินและกิจกรรมสำคัญของโรงเรียน",group:"operations",tag:"ปฏิทิน",url:"https://lermintech-cloud.github.io/school-smart-miniapp/",icon:"calendar",color:"#00BFA5"},
 {id:"leave",name:"ระบบลา",desc:"เข้าสู่ระบบจัดการการลาของบุคลากร",group:"operations",tag:"งานบุคลากร",url:"https://script.google.com/macros/s/AKfycbzs09_lWx4swr4Zy_r1QTFGsjiwWIPmLujKLoXlRrriPuOxOiSHGmMaml8azHi1FmAE/exec",icon:"calendarcheck",color:"#FF3D81"}
];

const iconPaths={
 edit:'<path d="M4 20h4.5L20 8.5 15.5 4 4 15.5z"/><path d="m13 6.5 4.5 4.5M12 20h8"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20v-1.5a5.5 5.5 0 0 1 11 0V20"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.7M17 14a5 5 0 0 1 4 4.8V20"/>',
 home:'<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
 book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 6h8M8 10h7"/>',
 chart:'<path d="M3 3v18h18"/><rect x="6" y="12" width="3.5" height="6" rx="1"/><rect x="12" y="8" width="3.5" height="10" rx="1"/><rect x="18" y="4" width="3" height="14" rx="1"/>',
 file:'<path d="M6 2h8l5 5v15H6z"/><path d="M14 2v6h5M9 13h7M9 17h7"/>',
 filecheck:'<path d="M6 2h8l5 5v7M14 2v6h5M9 13h4M9 17h3"/><path d="m14 19 2.5 2.5L22 16"/>',
 blocks:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="5" rx="2"/><rect x="13" y="10" width="8" height="11" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/>',
 clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8M8 14h8M8 18h4"/>',
 bookcheck:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 6h8M8 10h5"/><path d="m13 15 2 2 4-4"/>',
 wrench:'<path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L2.5 18.5a2.1 2.1 0 0 0 3 3l5.3-5.3a5 5 0 0 0 6.7-6.7l-3 3-3.2-3.2z"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M7 14h3M7 17h6"/>',
 calendarcheck:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/><path d="m8 15 2.2 2.2L15 13"/>',
 school:'<path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6M12 10.5v.01"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
 bell:'<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 8H4c0-1 2-2 2-8z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 wallet:'<path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z"/><path d="M4 7l11-3v3M16 14h2"/>',
 truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
 utensils:'<path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-2 2-3 5-3 8h3v10"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 folder:'<path d="M3 6h6l2 2h10v11H3z"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
 laptop:'<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M3 19h18"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a3 3 0 0 0 4 3M16 6h4v1a3 3 0 0 1-4 3M12 13v4M8 20h8"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>'
};

/* ===== ตัวช่วย ===== */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const safeUrl = u => /^https?:\/\//i.test(u) ? u : "#";
const svgIcon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.link}</svg>`;
const newId = () => "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

function normalize(list){
 if(!Array.isArray(list)) return [];
 const seen = new Set(), out = [];
 for(const s of list){
  if(!s || !s.id || !s.name || !/^https?:\/\//i.test(String(s.url||"")) || !GROUPS[s.group] || seen.has(s.id)) continue;
  seen.add(s.id);
  out.push({id:String(s.id),name:String(s.name),desc:String(s.desc||""),group:s.group,tag:String(s.tag||""),url:String(s.url),
   icon:iconPaths[s.icon]?s.icon:"link",color:/^#[0-9a-f]{6}$/i.test(s.color||"")?s.color:"#8A6CFF"});
 }
 return out;
}

/* ===== สถานะข้อมูล (ออนไลน์) ===== */
const CACHE_KEY = "banrai-hub-systems-cache-v1";   // แคชไว้แสดงผลเร็วเท่านั้น ไม่ใช่ที่เก็บข้อมูลจริง
function readCache(){ try{ const c = JSON.parse(localStorage.getItem(CACHE_KEY)); const l = c && normalize(c.systems); return l && l.length ? {systems:l, version:c.version||null} : null; }catch{ return null; } }
function writeCache(list, ver){ try{ localStorage.setItem(CACHE_KEY, JSON.stringify({systems:list, version:ver})); }catch{} }
let systems = [], sysVersion = null, source = "default", lastLoad = 0;
let activeFilter = "all", deferredPrompt = null;

async function fetchJson(url, opts, ms){
 const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), ms);
 try{ const r = await fetch(url, {...opts, signal: ctl.signal}); return await r.json(); }
 finally{ clearTimeout(t); }
}
async function loadSystems(silent){
 if(!API){ systems = clone(DEFAULT_SYSTEMS); source = "default"; return; }
 try{
  const j = await fetchJson(API + "?action=list&_=" + Date.now(), {}, 7000);
  if(!j || !j.ok) throw new Error("bad");
  const list = normalize(j.systems);
  sysVersion = j.version || null;
  if(list.length){ systems = list; source = "online"; writeCache(list, sysVersion); }
  else { systems = clone(DEFAULT_SYSTEMS); source = "empty"; }
 }catch(e){
  if(!silent || !systems.length){ systems = clone(DEFAULT_SYSTEMS); source = "offline"; }
 }
 lastLoad = Date.now();
}
async function apiPost(payload){
 try{ return await fetchJson(API, {method:"POST", body: JSON.stringify(payload)}, 20000); }
 catch(e){ return {ok:false, error:"network"}; }
}

/* ===== การ์ดหน้าหลัก ===== */
const grids = {student:$("studentGrid"),academic:$("academicGrid"),operations:$("operationsGrid")};
const searchInput = $("searchInput"), clearSearch = $("clearSearch"), emptyState = $("emptyState");
const favoritesKey = "banrai-school-hub-favorites-v1";
function getFavorites(){try{return JSON.parse(localStorage.getItem(favoritesKey)||"[]")}catch{return []}}
function saveFavorites(ids){try{localStorage.setItem(favoritesKey,JSON.stringify(ids))}catch{}}

function cardInner(s){
 return `<div class="card-head"><span class="card-icon">${svgIcon(s.icon)}</span><button type="button" class="favorite-btn" title="รายการโปรด">☆</button></div><h4 class="card-title">${esc(s.name)}</h4><p class="card-description">${esc(s.desc)}</p><div class="card-footer"><span class="card-tag"${s.tag?"":" hidden"}>${esc(s.tag)}</span><span class="card-open" aria-hidden="true">↗</span></div>`;
}
function showSkeleton(){
 const n = {student:2,academic:4,operations:3};
 Object.entries(grids).forEach(([k,g]) => g.innerHTML = '<div class="skeleton-card"><i></i><b></b><b></b></div>'.repeat(n[k]));
}
function renderCards(){
 Object.values(grids).forEach(g => g.innerHTML = "");
 systems.forEach((s, idx) => {
  const c = document.createElement("a");
  c.className = "system-card"; c.href = safeUrl(s.url); c.target = "_blank"; c.rel = "noopener noreferrer";
  c.dataset.id = s.id; c.style.setProperty("--i", Math.min(idx, 10)); c.style.setProperty("--accent", s.color);
  c.innerHTML = cardInner(s);
  c.querySelector(".favorite-btn").addEventListener("click", e => {
   e.preventDefault(); e.stopPropagation();
   const fav = getFavorites(), i = fav.indexOf(s.id);
   if(i >= 0) fav.splice(i,1); else fav.push(s.id);
   saveFavorites(fav); applyFilters(); showToast(i >= 0 ? "นำออกจากรายการโปรดแล้ว" : "เพิ่มในรายการโปรดแล้ว");
  });
  grids[s.group].appendChild(c);
 });
 updateCounts(); applyFilters();
}
function updateFavoriteButtons(){
 const fav = getFavorites();
 document.querySelectorAll(".system-card[data-id]").forEach(card => {
  const b = card.querySelector(".favorite-btn"), yes = fav.includes(card.dataset.id);
  b.classList.toggle("is-favorite", yes); b.textContent = yes ? "★" : "☆";
  b.setAttribute("aria-pressed", String(yes)); b.setAttribute("aria-label", yes ? "นำออกจากรายการโปรด" : "เพิ่มในรายการโปรด");
 });
}
function updateCounts(){
 const chip = document.querySelector('.filter-chip[data-filter="all"] span'); if(chip) chip.textContent = systems.length;
 Object.entries(grids).forEach(([key,grid]) => {
  const n = systems.filter(s => s.group === key).length, el = grid.previousElementSibling.querySelector(".category-count");
  if(el) el.textContent = String(n).padStart(2,"0") + " ระบบ";
 });
}
function applyFilters(){
 const q = searchInput.value.trim().toLocaleLowerCase("th"); let visible = 0;
 const fav = getFavorites();
 document.querySelectorAll(".system-card[data-id]").forEach(card => {
  const s = systems.find(x => x.id === card.dataset.id); if(!s) return;
  const okText = !q || (s.name+" "+s.desc+" "+s.tag).toLocaleLowerCase("th").includes(q);
  const okFilter = activeFilter === "all" || (activeFilter === "favorite" ? fav.includes(s.id) : s.group === activeFilter);
  const show = okText && okFilter; card.hidden = !show; if(show) visible++;
 });
 Object.entries(grids).forEach(([key,grid]) => {
  const heading = grid.previousElementSibling, has = [...grid.children].some(c => !c.hidden);
  heading.hidden = !has; grid.hidden = !has;
 });
 emptyState.hidden = visible !== 0; clearSearch.hidden = !searchInput.value; animateNumber($("totalCount"), visible);
 document.querySelectorAll(".filter-chip").forEach(b => b.classList.toggle("active", b.dataset.filter === activeFilter));
 updateFavoriteButtons();
}
function animateNumber(el,to){
 const from = parseInt(el.textContent) || 0;
 if(from === to || matchMedia("(prefers-reduced-motion: reduce)").matches){ el.textContent = to; return; }
 const t0 = performance.now(), d = 450; cancelAnimationFrame(animateNumber.raf);
 const step = t => { const p = Math.min((t-t0)/d,1), e = 1-Math.pow(1-p,3); el.textContent = Math.round(from+(to-from)*e); if(p<1) animateNumber.raf = requestAnimationFrame(step); };
 animateNumber.raf = requestAnimationFrame(step); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump");
}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2800)}

/* ===== ตั้งค่า (เพิ่ม/แก้ไข/ลบ/เรียงปุ่ม — บันทึกออนไลน์) ===== */
const dlg = $("settingsDialog");
const views = ["vSetup","vLogin","vList","vForm","vTheme"];
let stTab = "manage";
const admin = {pass:"", draft:[], dirty:false, editing:null, icon:"link", color:COLORS[0]};
const ERR = {
 wrong_password:"รหัสผ่านไม่ถูกต้อง", password_not_set:"ยังไม่ได้ตั้งรหัสผ่านผู้ดูแลในสคริปต์ (Code.gs)", locked:"ใส่รหัสผิดหลายครั้ง ถูกล็อกชั่วคราว ลองใหม่ใน 10 นาที",
 network:"เชื่อมต่อออนไลน์ไม่ได้ ตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", busy:"ระบบกำลังบันทึกให้ผู้อื่น ลองใหม่อีกครั้ง", version_conflict:"ข้อมูลถูกแก้ไขโดยผู้อื่นไปก่อนแล้ว",
 invalid_url:"ลิงก์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)", invalid_name:"ชื่อปุ่มไม่ถูกต้อง", too_many_items:"จำนวนปุ่มเกินกำหนด (สูงสุด 60)"
};
function showView(name){
 views.forEach(v => $(v).hidden = v !== name); dlg.scrollTop = 0;
 $("stTabs").hidden = name === "vForm";
 if(name !== "vForm"){ stTab = name === "vTheme" ? "theme" : "manage"; $("stTabs").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.tab === stTab)); }
 $("stTitle").textContent = name === "vForm" ? (admin.editing ? "แก้ไขปุ่ม" : "เพิ่มปุ่มใหม่") : "ตั้งค่า";
}
function showManage(){
 if(!API) showView("vSetup");
 else if(!admin.pass){ $("loginError").hidden = true; $("adminPass").value = ""; showView("vLogin"); if(dlg.open && stTab === "manage") setTimeout(() => $("adminPass").focus(), 60); }
 else showView("vList");
}
function openSettings(){
 if(typeof dlg.showModal !== "function"){ showToast("เบราว์เซอร์นี้ไม่รองรับหน้าตั้งค่า"); return; }
 dlg.showModal();
 if(stTab === "theme") showView("vTheme"); else showManage();
}
$("stTabs").addEventListener("click", e => {
 const b = e.target.closest("button[data-tab]"); if(!b) return;
 if(b.dataset.tab === "theme") showView("vTheme"); else showManage();
});
function requestClose(){
 if(admin.dirty && !confirm("มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึกขึ้นออนไลน์ ต้องการปิดและทิ้งการแก้ไขหรือไม่?")) return;
 admin.pass = ""; admin.dirty = false; admin.draft = []; dlg.close();
}
function setBusy(btn, busy, label){ btn.disabled = busy; if(label !== undefined) btn.textContent = busy ? label : btn.dataset.label; }

$("loginForm").addEventListener("submit", async e => {
 e.preventDefault();
 const btn = $("loginBtn"), err = $("loginError"), pw = $("adminPass").value;
 btn.dataset.label = btn.dataset.label || btn.textContent; setBusy(btn,true,"กำลังตรวจสอบ..."); err.hidden = true;
 const r = await apiPost({action:"verify", password:pw});
 if(!r.ok){ err.textContent = ERR[r.error] || "เข้าสู่ระบบไม่สำเร็จ"; err.hidden = false; setBusy(btn,false,""); return; }
 admin.pass = pw;
 await loadSystems(false);                       // โหลดข้อมูลล่าสุดก่อนแก้ไขเสมอ
 if(source === "offline"){ admin.pass = ""; renderCards(); err.textContent = ERR.network; err.hidden = false; setBusy(btn,false,""); return; }
 renderCards(); admin.draft = clone(systems); admin.dirty = false; setBusy(btn,false,"");
 renderManager(); showView("vList");
});
$("stClose").addEventListener("click", requestClose);
$("setupClose").addEventListener("click", requestClose);
dlg.addEventListener("cancel", e => { e.preventDefault(); requestClose(); });

function renderManager(){
 const box = $("mgList"); let html = "";
 GROUP_ORDER.forEach(g => {
  const items = admin.draft.filter(s => s.group === g);
  html += `<div class="mg-group"><h4>${esc(GROUPS[g])} <small>${items.length}</small></h4>`;
  if(!items.length) html += '<p class="mg-empty">ยังไม่มีปุ่มในหมวดนี้</p>';
  items.forEach((s,i) => {
   html += `<div class="mg-row" data-id="${esc(s.id)}"><span class="mg-ic" style="--c:${esc(s.color)}">${svgIcon(s.icon)}</span><div class="mg-txt"><b>${esc(s.name)}</b><small>${esc(s.tag || "—")}</small></div><div class="mg-act"><button type="button" data-act="up" title="เลื่อนขึ้น" ${i===0?"disabled":""}>↑</button><button type="button" data-act="down" title="เลื่อนลง" ${i===items.length-1?"disabled":""}>↓</button><button type="button" data-act="edit" title="แก้ไข">✎</button><button type="button" data-act="del" class="danger" title="ลบ">✕</button></div></div>`;
  });
  html += "</div>";
 });
 box.innerHTML = html;
 $("saveOnlineBtn").disabled = !canSave();
 $("dirtyNote").textContent = admin.dirty ? "● มีการเปลี่ยนแปลงที่ยังไม่บันทึก" : (source === "empty" ? "ยังไม่มีข้อมูลออนไลน์" : "ข้อมูลตรงกับที่อยู่ออนไลน์");
 $("dirtyNote").classList.toggle("is-dirty", admin.dirty);
 $("stNotice").hidden = source !== "empty";
}
function canSave(){ return admin.dirty || source === "empty"; }
function markDirty(){ admin.dirty = true; renderManager(); }

$("mgList").addEventListener("click", e => {
 const b = e.target.closest("button[data-act]"); if(!b) return;
 const id = b.closest(".mg-row").dataset.id, act = b.dataset.act, i = admin.draft.findIndex(s => s.id === id); if(i < 0) return;
 if(act === "edit") openForm(id);
 else if(act === "del"){ if(confirm(`ลบปุ่ม “${admin.draft[i].name}” ใช่หรือไม่?\n(ยังไม่หายจากเว็บจริงจนกว่าจะกด “บันทึกขึ้นออนไลน์”)`)){ admin.draft.splice(i,1); markDirty(); } }
 else{
  const dir = act === "up" ? -1 : 1; let j = i + dir;
  while(j >= 0 && j < admin.draft.length && admin.draft[j].group !== admin.draft[i].group) j += dir;
  if(j >= 0 && j < admin.draft.length){ [admin.draft[i], admin.draft[j]] = [admin.draft[j], admin.draft[i]]; markDirty(); }
 }
});
$("addBtn").addEventListener("click", () => openForm(null));
$("resetDefaultsBtn").addEventListener("click", () => {
 if(confirm("รีเซ็ตรายการปุ่มทั้งหมดเป็นค่าเริ่มต้น? (ปุ่มที่เพิ่ม/แก้ไขไว้จะถูกแทนที่ในฉบับร่าง และยังไม่มีผลจนกว่าจะบันทึก)")){ admin.draft = clone(DEFAULT_SYSTEMS); markDirty(); }
});
$("saveOnlineBtn").addEventListener("click", async () => {
 const btn = $("saveOnlineBtn"); btn.dataset.label = "บันทึกขึ้นออนไลน์"; setBusy(btn,true,"กำลังบันทึก...");
 const r = await apiPost({action:"save", password:admin.pass, systems:admin.draft, baseVersion:sysVersion});
 if(r.ok){
  systems = normalize(r.systems); sysVersion = r.version || null; source = "online"; writeCache(systems, sysVersion); admin.draft = clone(systems); admin.dirty = false;
  renderCards(); renderManager(); showToast("บันทึกขึ้นออนไลน์เรียบร้อยแล้ว ✓");
 }else if(r.error === "version_conflict"){
  setBusy(btn,false,"");
  if(confirm("ข้อมูลออนไลน์ถูกแก้ไขโดยผู้อื่นไปก่อนแล้ว\nต้องการโหลดข้อมูลล่าสุดมาแทนที่การแก้ไขของคุณหรือไม่?")){
   await loadSystems(false); renderCards(); admin.draft = clone(systems); admin.dirty = false; renderManager();
  }
  return;
 }else{
  if(r.error === "wrong_password" || r.error === "locked"){ admin.pass = ""; }
  alert("บันทึกไม่สำเร็จ: " + (ERR[r.error] || r.error || "ไม่ทราบสาเหตุ"));
 }
 setBusy(btn,false,""); btn.disabled = !canSave();
});

/* --- ฟอร์มเพิ่ม/แก้ไข --- */
function buildPickers(){
 $("iconPicker").innerHTML = Object.keys(iconPaths).filter(k => k !== "gear").map(k => `<button type="button" data-icon="${k}" title="${k}" aria-label="ไอคอน ${k}">${svgIcon(k)}</button>`).join("");
 const colorBtn = c => `<button type="button" data-color="${c}" style="--c:${c}" aria-label="สี ${c}"></button>`;
 $("colorPicker").innerHTML = COLORS.map(colorBtn).join("") + '<span class="pal-sep"></span>' + PASTELS.map(colorBtn).join("");
}
function syncPickers(){
 $("iconPicker").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.icon === admin.icon));
 $("colorPicker").querySelectorAll("button").forEach(b => b.classList.toggle("on", b.dataset.color.toLowerCase() === admin.color.toLowerCase()));
 $("fColorCustom").value = admin.color; updatePreview();
}
function formData(){
 return {name:$("fName").value.trim(), desc:$("fDesc").value.trim(), url:$("fUrl").value.trim(), group:$("fGroup").value, tag:$("fTag").value.trim(), icon:admin.icon, color:admin.color};
}
function updatePreview(){
 const d = formData(), p = $("itemPreview");
 p.style.setProperty("--accent", d.color);
 p.innerHTML = cardInner({...d, name:d.name || "ชื่อปุ่ม", desc:d.desc || "คำอธิบายสั้นๆ ของระบบ", tag:d.tag});
}
function openForm(id){
 admin.editing = id; const s = id ? admin.draft.find(x => x.id === id) : null;
 $("fName").value = s ? s.name : ""; $("fDesc").value = s ? s.desc : ""; $("fUrl").value = s ? s.url : ""; $("fTag").value = s ? s.tag : "";
 $("fGroup").value = s ? s.group : "academic"; admin.icon = s ? s.icon : "link"; admin.color = s ? s.color : COLORS[11];
 $("formError").hidden = true; syncPickers(); showView("vForm");
}
$("iconPicker").addEventListener("click", e => { const b = e.target.closest("button[data-icon]"); if(b){ admin.icon = b.dataset.icon; syncPickers(); } });
$("colorPicker").addEventListener("click", e => { const b = e.target.closest("button[data-color]"); if(b){ admin.color = b.dataset.color; syncPickers(); } });
$("fColorCustom").addEventListener("input", e => { admin.color = e.target.value; syncPickers(); });
["fName","fDesc","fTag"].forEach(id => $(id).addEventListener("input", updatePreview));
$("fCancel").addEventListener("click", () => { showView("vList"); });
$("itemForm").addEventListener("submit", e => {
 e.preventDefault(); const d = formData(), err = $("formError");
 if(!d.name){ err.textContent = "กรุณาใส่ชื่อปุ่ม"; err.hidden = false; return; }
 if(!/^https?:\/\/\S+$/i.test(d.url)){ err.textContent = "ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https://"; err.hidden = false; return; }
 if(admin.editing){ const i = admin.draft.findIndex(s => s.id === admin.editing); if(i >= 0) admin.draft[i] = {...admin.draft[i], ...d}; }
 else admin.draft.push({id:newId(), ...d});
 admin.dirty = true; renderManager(); showView("vList");
 showToast("อัปเดตฉบับร่างแล้ว — กด “บันทึกขึ้นออนไลน์” เพื่อให้ทุกเครื่องเห็น");
});

/* ===== ติดตั้งแอป (ไอคอนลอย) ===== */
const installFab = $("installFab");
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
if(isStandalone()) installFab.hidden = true;
function showInstallHelp(){const d=$("installDialog");if(typeof d.showModal==="function")d.showModal();else showToast("เปิดเมนูเบราว์เซอร์ แล้วเลือกเพิ่มลงในหน้าจอหลัก")}
async function installApp(){ if(!deferredPrompt){ showInstallHelp(); return; } deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
installFab.addEventListener("click", installApp);
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });
window.addEventListener("appinstalled", () => { installFab.hidden = true; showToast("ติดตั้ง School Hub เรียบร้อยแล้ว"); });
$("dialogDone").addEventListener("click", () => $("installDialog").close());

/* ===== เหตุการณ์หน้าหลัก ===== */
searchInput.addEventListener("input", applyFilters);
clearSearch.addEventListener("click", () => { searchInput.value = ""; applyFilters(); searchInput.focus(); });
document.querySelectorAll(".filter-chip").forEach(b => b.addEventListener("click", () => { activeFilter = b.dataset.filter; applyFilters(); }));
$("resetFilters").addEventListener("click", () => { activeFilter = "all"; searchInput.value = ""; applyFilters(); });
$("favoritesNav").addEventListener("click", () => { activeFilter = "favorite"; applyFilters(); document.querySelector(".welcome-row").scrollIntoView({behavior:"smooth"}); });
$("searchFab").addEventListener("click", () => { searchInput.focus(); window.scrollTo({top:document.querySelector(".search-panel").getBoundingClientRect().top+window.scrollY-20,behavior:"smooth"}); });
$("settingsNav").addEventListener("click", openSettings);
$("settingsBtn").addEventListener("click", openSettings);
document.addEventListener("visibilitychange", async () => {
 if(document.visibilityState === "visible" && API && !dlg.open && Date.now() - lastLoad > 60000) await refreshSystems();
});

if("serviceWorker" in navigator && location.protocol !== "file:"){ window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {})); }

async function refreshSystems(){
 const before = JSON.stringify(systems);
 await loadSystems(true);
 if(JSON.stringify(systems) !== before) renderCards();
}

/* ===== หน้าตา: การ์ดพาสเทล / เทกเจอร์ / โคมลอย (จำในเครื่องนี้) ===== */
const THEME_KEY = "banrai-hub-theme-v1";
const THEME_OPTS = {cards:["pastel","plain"],tint:["soft","mid","vivid"],tex:["none","dots","grain","gingham","linen"],lantern:["on","off"],count:["low","mid","high"],wig:["soft","mid","strong"]};
const THEME_DEFAULT = {cards:"pastel",tint:"mid",tex:"dots",lantern:"on",count:"mid",wig:"mid"};
const LANTERN_N = {low:5,mid:8,high:12}, LANTERN_WIG = {soft:.6,mid:1,strong:1.7};
function readTheme(){
 let o = {}; try{ o = JSON.parse(localStorage.getItem(THEME_KEY)) || {}; }catch{}
 const t = {}; for(const k in THEME_DEFAULT) t[k] = THEME_OPTS[k].includes(o[k]) ? o[k] : THEME_DEFAULT[k];
 return t;
}
let theme = readTheme();
function saveTheme(){ try{ localStorage.setItem(THEME_KEY, JSON.stringify(theme)); }catch{} }

/* ตัวอย่างการ์ดในหน้าตั้งค่า */
const THEME_SAMPLES = [
 {name:"เช็คชื่อนักเรียน",desc:"บันทึกการเข้าเรียน",tag:"งานนักเรียน",icon:"users",color:"#0A84FF"},
 {name:"ระบบลา",desc:"จัดการการลาบุคลากร",tag:"งานบุคลากร",icon:"calendarcheck",color:"#FF3D81"},
 {name:"ปฏิทินวิชาการ",desc:"กิจกรรมสำคัญของโรงเรียน",tag:"ปฏิทิน",icon:"calendar",color:"#16B364"}
];
function buildThemePreview(){
 $("themePreview").innerHTML = THEME_SAMPLES.map(s => `<div class="system-card preview" style="--accent:${s.color}">${cardInner(s)}</div>`).join("");
}

/* โคมลอยดิ้นในแบนเนอร์ */
const lanternLayer = $("lanternLayer"), heroEl = document.querySelector(".hero");
let lanternKey = "";
const rng = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647;
function lanternSvg(fill, face){
 return `<svg viewBox="0 0 60 84" aria-hidden="true"><circle class="lantern-glow" cx="30" cy="46" r="44" fill="url(#lnGlow)"/>`
  + `<path d="M17 9C9 22 5 40 9 66h42c4-26 0-44-8-57z" fill="url(#${fill})" stroke="rgba(255,255,255,.75)" stroke-width="1.4" stroke-linejoin="round"/>`
  + `<path d="M30 12v54M23 11C17 30 15 50 16 66M37 11c6 19 8 39 7 55" fill="none" stroke="rgba(190,110,60,.26)" stroke-width="1.2"/>`
  + `<ellipse cx="30" cy="9" rx="13" ry="4.5" fill="#FFF0C9" stroke="rgba(255,255,255,.8)" stroke-width="1.2"/>`
  + (face ? `<ellipse cx="23" cy="41" rx="1.9" ry="2.5" fill="#6B3B2A"/><ellipse cx="37" cy="41" rx="1.9" ry="2.5" fill="#6B3B2A"/><path d="M26.5 47q3.5 3.6 7 0" fill="none" stroke="#6B3B2A" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="18.5" cy="46" rx="3" ry="1.8" fill="#FF8FB0" opacity=".65"/><ellipse cx="41.5" cy="46" rx="3" ry="1.8" fill="#FF8FB0" opacity=".65"/>` : "")
  + `<rect x="8" y="65" width="44" height="5.5" rx="2.7" fill="#D9A06B"/><ellipse cx="30" cy="66" rx="20" ry="1.8" fill="#FFEFC2" opacity=".85"/>`
  + `<path class="lantern-flame" d="M30 82c-6-5-4-11 0-15 4 4 6 10 0 15z" fill="#FFD24D"/><path class="lantern-flame in" d="M30 79c-3-3-2-6 0-8 2 2 3 5 0 8z" fill="#FF8A3D"/></svg>`;
}
function buildLanterns(){
 if(!lanternLayer) return;
 const small = innerWidth < 760;
 const n = theme.lantern === "on" ? Math.round(LANTERN_N[theme.count] * (small ? .7 : 1)) : 0;
 const key = n + (small ? "s" : "l");
 if(key === lanternKey) return; lanternKey = key;
 const r = rng(20261022), fills = ["lnA","lnB","lnC"]; let html = "";
 for(let i = 0; i < n; i++){
  const size = Math.round((small ? 22 : 28) + r() * (small ? 18 : 26));
  const x = ((i + .5) / n * 100 + (r() - .5) * (60 / n)).toFixed(1);
  const dur = 24 - size * .2 + r() * 6;
  const o = (.72 + (size - 22) / 32 * .28).toFixed(2);
  html += `<div class="lantern" style="--x:${x}%;--s:${size}px;--d:${dur.toFixed(1)}s;--dl:-${(r() * dur).toFixed(1)}s;--sw:${(8 + r() * 14).toFixed(0)}px;--wd:${(2.2 + r() * 1.6).toFixed(2)}s;--wl:-${(r() * 3).toFixed(2)}s;--r:${(.12 + r() * .7).toFixed(2)};--o:${Math.min(o,1)}">`
   + `<div class="lantern-sway">${lanternSvg(fills[i % 3], i % 3 === 0)}</div></div>`;
 }
 lanternLayer.innerHTML = html;
}
function sizeLanternLayer(){ if(lanternLayer && heroEl) lanternLayer.style.setProperty("--h", heroEl.offsetHeight + "px"); }
let lanternResizeT;
window.addEventListener("resize", () => { clearTimeout(lanternResizeT); lanternResizeT = setTimeout(() => { sizeLanternLayer(); buildLanterns(); }, 150); });
if(window.ResizeObserver && heroEl) new ResizeObserver(sizeLanternLayer).observe(heroEl);

function syncThemeUI(){
 document.querySelectorAll("#vTheme .seg").forEach(seg => seg.querySelectorAll("button").forEach(b => {
  const on = theme[seg.dataset.key] === b.dataset.v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on));
 }));
 $("cardOpts").classList.toggle("is-off", theme.cards === "plain");
 $("lanternOpts").classList.toggle("is-off", theme.lantern === "off");
}
function applyTheme(){
 const r = document.documentElement;
 r.dataset.cards = theme.cards; r.dataset.tint = theme.tint; r.dataset.tex = theme.tex; r.dataset.lantern = theme.lantern;
 if(lanternLayer) lanternLayer.style.setProperty("--wig", LANTERN_WIG[theme.wig]);
 sizeLanternLayer(); buildLanterns(); syncThemeUI();
}
document.querySelectorAll("#vTheme .seg").forEach(seg => seg.addEventListener("click", e => {
 const b = e.target.closest("button[data-v]"); if(!b) return;
 theme[seg.dataset.key] = b.dataset.v; saveTheme(); applyTheme();
}));
$("themeReset").addEventListener("click", () => { theme = {...THEME_DEFAULT}; saveTheme(); applyTheme(); showToast("คืนค่าหน้าตาเริ่มต้นแล้ว"); });
$("themeDone").addEventListener("click", requestClose);

/* ===== เริ่มทำงาน ===== */
buildPickers(); buildThemePreview(); applyTheme();
const cached = API ? readCache() : null;
if(cached){            // มีของเดิม: แสดงทันที แล้วอัปเดตจากออนไลน์เงียบๆ ข้างหลัง
 systems = cached.systems; sysVersion = cached.version; source = "cache"; renderCards();
 refreshSystems();
}else{                 // เปิดครั้งแรก: โชว์โครงกระดูกระหว่างรอ
 showSkeleton();
 loadSystems(false).then(() => {
  renderCards();
  if(source === "offline") showToast("เชื่อมต่อออนไลน์ไม่ได้ แสดงรายการเริ่มต้นแทน");
 });
}
