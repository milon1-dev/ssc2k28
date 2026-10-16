// Firebase configuration: replace the placeholder values with your project's Web App config.
const firebaseConfig = {
  apiKey: "AIzaSyDjWtqdtFlyN9V9UCkblpg4OuY8YsRNnqc",
  authDomain: "ssc2k28-932a2.firebaseapp.com",
  databaseURL: "https://ssc2k28-932a2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ssc2k28-932a2",
  storageBucket: "ssc2k28-932a2.firebasestorage.app",
  messagingSenderId: "524333888785",
  appId: "1:524333888785:web:8058cab006cf04e1b708b0"
};
const configured = true;
let db = null;
if (configured) {
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const { getDatabase } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js");
    const app = initializeApp(firebaseConfig); db = getDatabase(app);
  } catch (e) { console.error("Firebase setup error", e); }
}
const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const categories = ["ক্লাসরুম","বন্ধুদের মুহূর্ত","শিক্ষক","অনুষ্ঠান","শিক্ষা সফর","বিশেষ স্মৃতি","অন্যান্য"];
let galleryItems = [], activeCategory = "all", lightboxIndex = 0;
const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function validHttps(url){try{return new URL(url).protocol === "https:"}catch{return false}}
function renderGallery(){
 const query = ($('#gallerySearch').value || '').trim().toLowerCase(); const sort = $('#sortGallery').value;
 let list = galleryItems.filter(x => (activeCategory === 'all' || x.category === activeCategory) && `${x.title||''} ${x.caption||''} ${x.description||''}`.toLowerCase().includes(query));
 list.sort((a,b) => (Number(a.dateValue||a.createdAt||0)-Number(b.dateValue||b.createdAt||0))*(sort==='oldest'?1:-1));
 $('#galleryCount').textContent = `${list.length.toLocaleString('bn-BD')}টি স্মৃতি`;
 const grid = $('#galleryGrid');
 if(!list.length){grid.innerHTML='<div class="empty-state">✧<h3>এখনো কোনো স্মৃতি যোগ করা হয়নি</h3><p>বাস্তব ছবি ও স্মৃতি অ্যাডমিন প্যানেল থেকে যোগ করা হলে এখানে দেখা যাবে।</p></div>';return;}
 grid.innerHTML = list.map((x,i)=>`<article class="memory-card"><button class="memory-open" data-index="${galleryItems.indexOf(x)}" aria-label="${escapeHTML(x.title||'ছবি দেখুন')}" style="display:block;width:100%;padding:0;border:0;background:none;cursor:pointer">${validHttps(x.imageUrl)?`<img class="memory-image" loading="lazy" src="${escapeHTML(x.imageUrl)}" alt="${escapeHTML(x.title||'স্মৃতির ছবি')}" onerror="this.outerHTML='<div class=&quot;memory-image image-placeholder&quot; role=&quot;img&quot; aria-label=&quot;ছবি পাওয়া যায়নি&quot;>✧<small>ছবি পাওয়া যায়নি</small></div>'">`:`<div class="memory-image image-placeholder">✧<small>ছবি পরে যোগ হবে</small></div>`}</button><div class="memory-body"><h3>${escapeHTML(x.title||'শিরোনাম নেই')}</h3><p>${escapeHTML(x.description||x.caption||'এই স্মৃতির বর্ণনা পরে যোগ করা হবে।')}</p><div class="memory-meta"><span class="category-tag">${escapeHTML(x.category||'অন্যান্য')}</span><span>${escapeHTML(x.date||'তারিখ যোগ হয়নি')}</span></div></div></article>`).join('');
 $$('.memory-open').forEach(b=>b.addEventListener('click',()=>openLightbox(Number(b.dataset.index))));
}
function renderTeachers(items){const grid=$('#teacherGrid');if(!items.length){grid.innerHTML='<div class="empty-state">শিক্ষক পরিচিতি পরে যোগ করা হবে।</div>';return;}grid.innerHTML=items.map(x=>`<article class="teacher-card">${validHttps(x.imageUrl)?`<img class="teacher-avatar" style="object-fit:cover" loading="lazy" src="${escapeHTML(x.imageUrl)}" alt="${escapeHTML(x.name||'শিক্ষক')}" onerror="this.style.display='none'">`:`<div class="teacher-avatar">✧</div>`}<h3>${escapeHTML(x.name||'শিক্ষকের নাম পরে যোগ করা হবে')}</h3><p>${escapeHTML([x.designation,x.subject].filter(Boolean).join(' · ')||'পদবি ও বিষয় পরে যোগ হবে')}</p>${x.introduction?`<p>${escapeHTML(x.introduction)}</p>`:''}${x.quote?`<blockquote>“${escapeHTML(x.quote)}”</blockquote>`:''}</article>`).join('');}
function renderTimeline(items){const el=$('#timelineList');if(!items.length){el.innerHTML='<div class="empty-state">আমাদের পথচলার ঘটনা পরে যোগ করা হবে।</div>';return;}el.innerHTML=items.map(x=>`<article class="timeline-item"><span class="timeline-dot"></span><div class="timeline-card"><span class="date-label">${escapeHTML(x.date||x.year||'তারিখ পরে যোগ হবে')}</span><h3>${escapeHTML(x.title||'শিরোনাম')}</h3><p>${escapeHTML(x.description||'বর্ণনা পরে যোগ করা হবে।')}</p>${x.location?`<span class="placeholder-tag">⌖ ${escapeHTML(x.location)}</span>`:''}${validHttps(x.imageUrl)?`<img class="memory-image" loading="lazy" src="${escapeHTML(x.imageUrl)}" alt="${escapeHTML(x.title||'ইভেন্টের ছবি')}">`:''}</div></article>`).join('');}
function openLightbox(index){const x=galleryItems[index];if(!x)return;lightboxIndex=index;const img=$('#lightboxImage');if(validHttps(x.imageUrl)){img.src=x.imageUrl;img.alt=x.title||'স্মৃতির ছবি';}else{img.removeAttribute('src');img.alt='এই স্মৃতির ছবি যোগ করা হয়নি';}$('#lightboxCaption').textContent=[x.title,x.caption,x.date].filter(Boolean).join(' · ');$('#lightbox').hidden=false;$('#lightboxClose').focus();}
function moveLightbox(step){if(!galleryItems.length)return;lightboxIndex=(lightboxIndex+step+galleryItems.length)%galleryItems.length;openLightbox(lightboxIndex)}
$('#lightboxClose').addEventListener('click',()=>$('#lightbox').hidden=true);$('#lightboxPrev').addEventListener('click',()=>moveLightbox(-1));$('#lightboxNext').addEventListener('click',()=>moveLightbox(1));$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')e.currentTarget.hidden=true});document.addEventListener('keydown',e=>{if($('#lightbox').hidden)return;if(e.key==='Escape')$('#lightbox').hidden=true;if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1)});
$('#gallerySearch').addEventListener('input',renderGallery);$('#sortGallery').addEventListener('change',renderGallery);$('#filters').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;activeCategory=b.dataset.category;$$('.filter').forEach(x=>x.classList.toggle('active',x===b));renderGallery()});
$('#menuToggle').addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open));$('#menuToggle').textContent=open?'×':'☰'});$$('#nav a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').textContent='☰'}));
const modal=$('#welcomeModal');try{if(!sessionStorage.getItem('milonWelcomeDismissed'))modal.hidden=false}catch{}function dismissWelcome(){modal.hidden=true;try{sessionStorage.setItem('milonWelcomeDismissed','1')}catch{}}$('#modalClose').addEventListener('click',dismissWelcome);$('#laterMemories').addEventListener('click',dismissWelcome);$('#startMemories').addEventListener('click',()=>{dismissWelcome();$('#gallery').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});modal.addEventListener('click',e=>{if(e.target===modal)dismissWelcome()});
async function loadFirebaseContent(){if(!db){$('#galleryStatus').textContent='Firebase সংযোগ এখনো সেটআপ করা হয়নি। অ্যাডমিন প্যানেলে যোগ করা কনটেন্ট দেখাতে Firebase config যোগ করুন।';renderGallery();return;}try{const {ref,onValue}=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js');onValue(ref(db,'gallery'),snap=>{const data=snap.val()||{};galleryItems=Object.entries(data).map(([id,v])=>({id,...v}));renderGallery();$('#galleryStatus').textContent='';},err=>{$('#galleryStatus').textContent=err.code==='PERMISSION_DENIED'?'ডেটা দেখার অনুমতি নেই। Firebase Database Rules পরীক্ষা করুন।':'নেটওয়ার্ক সমস্যা: স্মৃতি লোড করা যায়নি।';});onValue(ref(db,'teachers'),snap=>renderTeachers(Object.values(snap.val()||{})),()=>{});onValue(ref(db,'timeline'),snap=>renderTimeline(Object.values(snap.val()||{})),()=>{});onValue(ref(db,'siteSettings'),snap=>{const settings=snap.val()||{};const title=Object.values(settings).find(x=>x&&x.siteTitle)?.siteTitle;if(title)document.title=title;},()=>{});}catch(e){$('#galleryStatus').textContent='ডেটা লোড করা যায়নি। Firebase সেটিংস পরীক্ষা করুন।';console.error(e)}}
loadFirebaseContent();
