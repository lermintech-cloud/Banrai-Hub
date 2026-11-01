const CACHE_NAME = "banrai-school-hub-v15";
const APP_SHELL = ["./", "./index.html", "./style.css", "./themes.css", "./eservice.css", "./eservice-data.js", "./app.js", "./config.js", "./manifest.json", "./icons/logo.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon.png", "./icons/fur-tile.png", "./icons/fur-edge.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// ไฟล์หน้าเว็บ: แสดงจากแคชทันที (เปิดเร็ว) แล้วโหลดฉบับใหม่มาเก็บไว้ข้างหลัง — เปิดครั้งถัดไปจะได้ฉบับล่าสุด
// คำขอไปยังโดเมนอื่น (เช่น Apps Script API) ไม่ผ่านตัวนี้ จึงไม่ถูกแคช
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE_NAME).then(cache => cache.match(request, {ignoreSearch: true}).then(cached => {
    const network = fetch(request).then(response => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    }).catch(() => cached || cache.match("./index.html"));
    return cached || network;
  })));
});
