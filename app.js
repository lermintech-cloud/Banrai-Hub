const BASE = "https://script.google.com/macros/s/AKfycbyNCNM0vR7VSt-RYQB8ukOGwYa1WVgvjsohiC1MoLw1pk-aC5lO5hA7h2DNywaCLagiVQ/exec";
const systems = [
 {id:"attendance",name:"เช็คชื่อนักเรียน",desc:"บันทึกและจัดการการเข้าเรียนของนักเรียน",category:"student",group:"student",tag:"งานนักเรียน",url:BASE,icon:"users",colors:["#3478D4","#EAF2FF","#D6E5FF"]},
 {id:"homevisit",name:"เยี่ยมบ้าน",desc:"บันทึกข้อมูลและติดตามการเยี่ยมบ้านนักเรียน",category:"student",group:"student",tag:"ดูแลช่วยเหลือ",url:BASE+"?page=HomeVisit",icon:"home",colors:["#D56C46","#FFF0E8","#F7D9CB"]},
 {id:"curriculum",name:"หลักสูตรสถานศึกษา",desc:"เข้าถึงข้อมูลและงานหลักสูตรสถานศึกษา",category:"academic",group:"academic",tag:"งานวิชาการ",url:BASE+"?page=curriculum",icon:"book",colors:["#805AD5","#F1EBFF","#E2D6FF"]},
 {id:"grade5",name:"ผล ปพ.5",desc:"ตรวจดูผลและข้อมูลรายงาน ปพ.5",category:"academic",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_grade",icon:"chart",colors:["#247EAD","#E5F6FF","#CBEAF8"]},
 {id:"individual",name:"กรอก ปพ.6",desc:"กรอกข้อมูลผลการเรียนรายบุคคล",category:"academic",group:"academic",tag:"กรอกข้อมูล",url:BASE+"?page=individual",icon:"file",colors:["#C45C91","#FCEAF3","#F6D5E5"]},
 {id:"reportindi",name:"ผล ปพ.6",desc:"ดูรายงานผลการเรียนรายบุคคล",category:"academic",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_indi",icon:"filecheck",colors:["#B87928","#FFF4DE","#F5E4B8"]},
 {id:"kindergarten",name:"กรอก อบ.",desc:"กรอกข้อมูลประเมินพัฒนาการเด็กปฐมวัย",category:"academic",group:"academic",tag:"ปฐมวัย",url:BASE+"?page=kindergarten",icon:"blocks",colors:["#198B78","#E2F8F1","#C5EEE1"]},
 {id:"reportkind",name:"ผล อบ.",desc:"ตรวจดูผลการประเมินเด็กปฐมวัย",category:"academic",group:"academic",tag:"รายงานผล",url:BASE+"?page=report_kind",icon:"clipboard",colors:["#D17C38","#FFF0E0","#F8DCC1"]},
 {id:"kinderbook",name:"เล่ม อบ.",desc:"จัดการและเข้าถึงเล่มรายงาน อบ.",category:"academic",group:"academic",tag:"เอกสารปฐมวัย",url:BASE+"?page=kinderbook",icon:"bookcheck",colors:["#5476C8","#E9EEFF","#D4DFFF"]},
 {id:"janitor",name:"ระบบภารโรง",desc:"แจ้งงานและติดตามงานอาคารสถานที่",category:"operations",group:"operations",tag:"อาคารสถานที่",url:"https://lermintech-cloud.github.io/SATID/",icon:"wrench",colors:["#B78326","#FFF5D9","#F4E6B5"]},
 {id:"calendar",name:"ปฏิทินวิชาการ",desc:"ดูปฏิทินและกิจกรรมสำคัญของโรงเรียน",category:"operations",group:"operations",tag:"ปฏิทิน",url:"https://lermintech-cloud.github.io/school-smart-miniapp/",icon:"calendar",colors:["#248C9A","#E0F7F7","#C4EBED"]},
 {id:"leave",name:"ระบบลา",desc:"เข้าสู่ระบบจัดการการลาของบุคลากร",category:"operations",group:"operations",tag:"งานบุคลากร",url:"https://script.google.com/macros/s/AKfycbzs09_lWx4swr4Zy_r1QTFGsjiwWIPmLujKLoXlRrriPuOxOiSHGmMaml8azHi1FmAE/exec",icon:"calendarcheck",colors:["#C45772","#FCEAF0","#F5D5DF"]}
];
const iconPaths={
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
 calendarcheck:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/><path d="m8 15 2.2 2.2L15 13"/>'
};
const grids={student:document.getElementById("studentGrid"),academic:document.getElementById("academicGrid"),operations:document.getElementById("operationsGrid")};
const searchInput=document.getElementById("searchInput"),clearSearch=document.getElementById("clearSearch"),emptyState=document.getElementById("emptyState");
let activeFilter="all", deferredPrompt=null;
const favoritesKey="banrai-school-hub-favorites-v1";
function getFavorites(){try{return JSON.parse(localStorage.getItem(favoritesKey)||"[]")}catch{return []}}
function saveFavorites(ids){try{localStorage.setItem(favoritesKey,JSON.stringify(ids))}catch{}}
function svgIcon(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.file}</svg>`}
function renderCards(){
 Object.values(grids).forEach(g=>g.innerHTML="");
 systems.forEach(s=>{
  const c=document.createElement("a");c.className="system-card";c.href=s.url;c.target="_blank";c.rel="noopener noreferrer";c.dataset.id=s.id;c.dataset.group=s.group;
  c.style.setProperty("--accent",s.colors[0]);c.style.setProperty("--tint",s.colors[1]);c.style.setProperty("--edge",s.colors[2]);
  c.innerHTML=`<div class="card-head"><span class="card-icon">${svgIcon(s.icon)}</span><button type="button" class="favorite-btn" aria-label="เพิ่ม ${s.name} ในรายการโปรด" title="รายการโปรด">☆</button></div><h4 class="card-title">${s.name}</h4><p class="card-description">${s.desc}</p><div class="card-footer"><span class="card-tag">${s.tag}</span><span class="card-open" aria-hidden="true">↗</span></div>`;
  c.querySelector(".favorite-btn").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();const fav=getFavorites();const i=fav.indexOf(s.id);if(i>=0)fav.splice(i,1);else fav.push(s.id);saveFavorites(fav);applyFilters();showToast(i>=0?"นำออกจากรายการโปรดแล้ว":"เพิ่มในรายการโปรดแล้ว")});
  grids[s.group].appendChild(c);
 });
 updateFavoriteButtons();applyFilters();
}
function updateFavoriteButtons(){const fav=getFavorites();document.querySelectorAll(".system-card").forEach(card=>{const b=card.querySelector(".favorite-btn"),yes=fav.includes(card.dataset.id);b.classList.toggle("is-favorite",yes);b.textContent=yes?"★":"☆";b.setAttribute("aria-pressed",String(yes));b.setAttribute("aria-label",yes?"นำออกจากรายการโปรด":"เพิ่มในรายการโปรด")})}
function applyFilters(){
 const q=searchInput.value.trim().toLocaleLowerCase("th");let visible=0;
 document.querySelectorAll(".system-card").forEach(card=>{const s=systems.find(x=>x.id===card.dataset.id);const matchesText=!q||(s.name+" "+s.desc+" "+s.tag).toLocaleLowerCase("th").includes(q);const matchesFilter=activeFilter==="all"||(activeFilter==="favorite"?getFavorites().includes(s.id):s.group===activeFilter);const show=matchesText&&matchesFilter;card.hidden=!show;if(show)visible++});
 Object.entries(grids).forEach(([key,grid])=>{const heading=grid.previousElementSibling;const has=[...grid.children].some(c=>!c.hidden);heading.hidden=!has;grid.hidden=!has});
 emptyState.hidden=visible!==0;clearSearch.hidden=!searchInput.value;document.getElementById("totalCount").textContent=visible;
 document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeFilter));
 updateFavoriteButtons();
}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),2300)}
function showInstallHelp(){const d=document.getElementById("installDialog");if(typeof d.showModal==="function")d.showModal();else showToast("เปิดเมนูเบราว์เซอร์ แล้วเลือกเพิ่มลงในหน้าจอหลัก")}
searchInput.addEventListener("input",applyFilters);
clearSearch.addEventListener("click",()=>{searchInput.value="";applyFilters();searchInput.focus()});
document.querySelectorAll(".filter-chip").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;applyFilters()}));
document.getElementById("resetFilters").addEventListener("click",()=>{activeFilter="all";searchInput.value="";applyFilters()});
document.getElementById("favoritesNav").addEventListener("click",()=>{activeFilter="favorite";applyFilters();document.querySelector(".welcome-row").scrollIntoView({behavior:"smooth"})});
document.getElementById("searchFab").addEventListener("click",()=>{searchInput.focus();window.scrollTo({top:document.querySelector(".search-panel").getBoundingClientRect().top+window.scrollY-20,behavior:"smooth"})});
document.getElementById("installNav").addEventListener("click",()=>{if(deferredPrompt)installApp();else showInstallHelp()});
document.getElementById("installBannerBtn").addEventListener("click",showInstallHelp);
document.getElementById("dialogDone").addEventListener("click",()=>document.getElementById("installDialog").close());
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installBtn").hidden=false});
async function installApp(){if(!deferredPrompt){showInstallHelp();return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;document.getElementById("installBtn").hidden=true}
document.getElementById("installBtn").addEventListener("click",installApp);
window.addEventListener("appinstalled",()=>{document.getElementById("installBtn").hidden=true;showToast("ติดตั้ง School Hub เรียบร้อยแล้ว")});
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}
renderCards();
