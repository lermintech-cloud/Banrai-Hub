# Ban Rai School Hub

เว็บรวมลิงก์ระบบงานโรงเรียนบ้านไร่ ดีไซน์ Soft UI / Premium Dashboard พร้อมการ์ดแยกสี ค้นหาระบบ รายการโปรด และรองรับ PWA

## ไฟล์ในโปรเจกต์
- `index.html` — โครงหน้าเว็บ
- `style.css` — ดีไซน์ responsive
- `app.js` — รายการระบบ ค้นหา และรายการโปรด
- `manifest.json` — ข้อมูล PWA
- `service-worker.js` — แคชไฟล์หน้าเว็บ
- `icons/` — ไอคอน

## วิธีนำขึ้น GitHub Pages
1. ดาวน์โหลดและแตกไฟล์ ZIP
2. สร้าง repository ใหม่บน GitHub (หรือใช้ repository ที่ต้องการ)
3. อัปโหลดไฟล์และโฟลเดอร์ทั้งหมด โดยให้ `index.html` อยู่ที่ root ของ repository
4. เข้า Settings → Pages
5. เลือก Deploy from a branch → เลือก `main` และ `/ (root)` → Save
6. เปิด URL ที่ GitHub Pages แสดงให้ และทดสอบปุ่มทุกระบบ

## การติดตั้ง PWA
- เปิดเว็บจาก HTTPS
- Android/Chrome และ Desktop Chrome/Edge: ใช้ปุ่ม “ติดตั้งแอป” เมื่อเบราว์เซอร์แสดงตัวเลือก
- iPhone/iPad: เปิดด้วย Safari → Share → Add to Home Screen
- หากไม่มีปุ่มติดตั้ง ให้ใช้คำแนะนำ “วิธีติดตั้ง” ในเว็บ

## หมายเหตุ
- รายการโปรดบันทึกใน localStorage ของเบราว์เซอร์แต่ละเครื่อง จึงไม่ซิงก์อัตโนมัติข้ามอุปกรณ์
- Service worker แคชเฉพาะไฟล์หน้า Hub เพื่อช่วยเปิดหน้าเว็บเมื่อออฟไลน์ ไม่ได้ทำให้ระบบปลายทางหรือ Google Apps Script ทำงานออฟไลน์
- ตรวจสอบสิทธิ์และการเข้าถึงระบบปลายทางตามการตั้งค่าของแต่ละระบบ
