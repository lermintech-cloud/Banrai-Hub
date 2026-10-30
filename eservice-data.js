/* ค่าเริ่มต้นของ "บริการ สพป.เชียงใหม่ เขต 5" (E-Service)
   แก้ไขได้ 2 ทาง:
   1) ในแอป: ตั้งค่า → 🏛 บริการ สพป. (บันทึกไว้เฉพาะเครื่องนั้น)
   2) แก้ไฟล์นี้แล้วอัปโหลดขึ้น Git → ทุกเครื่องที่ยังไม่เคยแก้เองจะเห็นค่าใหม่
      (ในแอปกด "คัดลอกเป็นไฟล์ค่าเริ่มต้น" แล้ววางทับไฟล์นี้ได้เลย)
   icon = ชื่อไอคอนใน app.js (iconPaths) • pin:true = แสดงเป็นทางลัดหน้าแรก */
window.ESERVICE_DEFAULT = {
  title: "บริการ สพป.เชียงใหม่ เขต 5",
  cats: [
    {id:"office",  name:"สำนักงานและเอกสาร",          icon:"folder",        color:"#0A84FF"},
    {id:"finance", name:"การเงิน พัสดุ งบประมาณ",     icon:"wallet",        color:"#16B364"},
    {id:"student", name:"ข้อมูลนักเรียนและโรงเรียน",  icon:"users",         color:"#FF8A00"},
    {id:"supervise",name:"นิเทศและแบบฟอร์ม",          icon:"clipboard",     color:"#8B5CF6"},
    {id:"request", name:"ขอเอกสารและจอง",             icon:"calendarcheck", color:"#E02CC0"}
  ],
  links: [
    {id:"amss",   cat:"office",  name:"ระบบสำนักงานอิเล็กทรอนิกส์ (AMSS++)", short:"AMSS++",   url:"http://1.179.155.142/amssplus/", icon:"folder", color:"#0A84FF", pin:true},
    {id:"smart",  cat:"office",  name:"ระบบสำนักงานอิเล็กทรอนิกส์ (Smart OBEC)", short:"Smart OBEC", url:"https://smart.obec.go.th/", icon:"laptop", color:"#3D5AFE", pin:false},
    {id:"mail",   cat:"office",  name:"ระบบจดหมายอิเล็กทรอนิกส์ (OBEC Mail)", short:"OBEC Mail", url:"https://www.obecmail.obec.go.th/", icon:"mail", color:"#00B3E6", pin:true},
    {id:"eseass", cat:"office",  name:"ระบบบริหารโรงเรียนและเขตพื้นที่การศึกษา (e-SEASS)", short:"e-SEASS", url:"http://eme3.obec.go.th/~eme53/index.php", icon:"school", color:"#6B7A90", pin:false},

    {id:"salary", cat:"finance", name:"ระบบพิมพ์บัญชีจ่ายเงินรายเดือน (E-Salary)", short:"E-Salary", url:"http://www2.chiangmaiarea5.go.th/salary/", icon:"wallet", color:"#16B364", pin:true},
    {id:"egp",    cat:"finance", name:"ระบบการจัดซื้อจัดจ้างภาครัฐ (e-GP)", short:"e-GP", url:"http://www.gprocurement.go.th/new_index.html", icon:"truck", color:"#00BFA5", pin:true},
    {id:"budget", cat:"finance", name:"ระบบบัญชีการศึกษาขั้นพื้นฐาน (E-Budget)", short:"E-Budget", url:"https://e-budget.jobobec.in.th/", icon:"chart", color:"#7CB518", pin:false},
    {id:"asset",  cat:"finance", name:"ระบบข้อมูลสินทรัพย์ สพฐ. (OBEC asset)", short:"OBEC asset", url:"https://asset.bopp-obec.info/", icon:"blocks", color:"#E5B800", pin:false},

    {id:"dmc",    cat:"student", name:"ระบบจัดเก็บข้อมูลนักเรียนรายบุคคล (DMC) ปีการศึกษา 2569 รอบที่ 2", short:"DMC", url:"https://portal.bopp-obec.info/obec69/", icon:"users", color:"#FF8A00", pin:true},
    {id:"schoolmis",cat:"student",name:"ระบบบริหารจัดการสถานศึกษา (SchoolMIS)", short:"SchoolMIS", url:"https://schoolmis.obec.expert/", icon:"school", color:"#FF6B2C", pin:false},
    {id:"cct",    cat:"student", name:"ระบบปัจจัยพื้นฐานนักเรียนยากจน (CCT)", short:"CCT", url:"https://cct.thaieduforall.org/", icon:"heart", color:"#FF3D81", pin:false},
    {id:"bigdata",cat:"student", name:"ระบบบริการข้อมูลภาครัฐ (BIG DATA)", short:"BIG DATA", url:"http://www.bigdata.chiangmaiarea5.go.th/", icon:"globe", color:"#00B3E6", pin:false},
    {id:"upright",cat:"student", name:"ระบบข้อมูลฯ โรงเรียนสุจริต", short:"โรงเรียนสุจริต", url:"http://www.uprightcode.xyz/index.php", icon:"shield", color:"#16B364", pin:false},

    {id:"sup1",   cat:"supervise",name:"แบบบันทึกการนิเทศ กำกับ ติดตาม โรงเรียน", short:"บันทึกนิเทศ", url:"https://docs.google.com/forms/d/e/1FAIpQLSeXKV1I3HebFwDawIdOLPbaomLGlbWQkc1mARReTbMZnUMZ2w/viewform", icon:"clipboard", color:"#8B5CF6", pin:false},
    {id:"sup2",   cat:"supervise",name:"แบบรายงานการตอบรับการนิเทศฯ โรงเรียน", short:"ตอบรับนิเทศ", url:"https://docs.google.com/forms/d/e/1FAIpQLScm_iPcmVx2bsnpEVUbRtuo9JmMZF_lJeAq6xtae602dfofPg/viewform", icon:"filecheck", color:"#3D5AFE", pin:false},
    {id:"stat",   cat:"supervise",name:"ข้อมูลสถิติการขอรับบริการผ่านช่องทางออนไลน์ (E-Service)", short:"สถิติบริการ", url:"http://www2.chiangmaiarea5.go.th/th/public/standard-service/show/11", icon:"chart", color:"#E02CC0", pin:false},

    {id:"cmarea5",cat:"request", name:"ระบบแจ้งความประสงค์ขอเอกสาร Online (cmare5)", short:"ขอเอกสาร", url:"https://www.cmarea5.com/", icon:"file", color:"#E02CC0", pin:false},
    {id:"room",   cat:"request", name:"จองห้องประชุม สำหรับหน่วยงานภายนอก (Meeting Room)", short:"จองห้องประชุม", url:"https://docs.google.com/forms/d/e/1FAIpQLSe75AYtmitRj-2QV_yH_nnAPAHVrimt9oJvJjd7smj7iPCwIQ/viewform", icon:"calendarcheck", color:"#0A84FF", pin:false},
    {id:"car",    cat:"request", name:"จองรถ สำหรับหน่วยงานภายนอก (Car Reserve)", short:"จองรถ", url:"https://obec-cc.my.canva.site/carcma5", icon:"truck", color:"#FF8A00", pin:false}
  ]
};
