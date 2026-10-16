const CACHE_NAME = "banrai-school-hub-v7";
const APP_SHELL = ["./", "./index.html", "./style.css", "./app.js", "./config.js", "./manifest.json", "./icons/logo.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon.png"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// ไฟล์หน้าเว็บ: ลองโหลดจากเน็ตก่อนเสมอ (ได้ของใหม่ทันทีหลังอัปเดตบน Git) ถ้าออฟไลน์ค่อยใช้แคช
// คำขอไปยังโดเมนอื่น (เช่น Apps Script API) ไม่ผ่านตัวนี้ จึงไม่ถูกแคช
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(request).then(response => {
    if (response && response.status === 200) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(hit => hit || caches.match("./index.html"))));
});
