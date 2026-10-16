(() => {
  const $ = s => document.querySelector(s);
  const STORE_KEY = "milonMemoriesAdminData_v1";
  const PASS_KEY = "milonMemoriesDemoPass_v1";
  const SESSION_KEY = "milonMemoriesDemoSession_v1";
  const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
  let selectedImage = "";
  let toastTimer;

  const blankData = () => ({ photos: [], memories: [], teachers: [] });
  function readData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return blankData();
      const data = JSON.parse(raw);
      return { photos: Array.isArray(data.photos) ? data.photos : [], memories: Array.isArray(data.memories) ? data.memories : [], teachers: Array.isArray(data.teachers) ? data.teachers : [] };
    } catch (_) { return blankData(); }
  }
  function saveData(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch (_) { showToast("ব্রাউজারের স্টোরেজ পূর্ণ হয়েছে। ছবির সাইজ কমিয়ে আবার চেষ্টা করো।"); return false; }
    renderAll(); return true;
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  }
  function showToast(message) {
    const el = $("#toast"); el.textContent = message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }
  function setLoggedIn(on) {
    $("#loginScreen").hidden = on;
    $("#dashboard").hidden = !on;
    $("#logoutBtn").hidden = !on;
    if (on) renderAll();
  }
  function initLogin() {
    const hasSession = sessionStorage.getItem(SESSION_KEY) === "yes";
    if (hasSession) { setLoggedIn(true); return; }
    setLoggedIn(false);
  }
  $("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#adminName").value.trim();
    const pass = $("#adminPass").value;
    if (name.toUpperCase() !== "MILON") { $("#loginError").textContent = "এই ডেমো প্যানেলটি শুধু MILON অ্যাডমিনের জন্য।"; return; }
    let saved = localStorage.getItem(PASS_KEY);
    if (!saved) {
      if (pass.length < 4) { $("#loginError").textContent = "কমপক্ষে ৪ অক্ষরের ডেমো পাসকোড দাও।"; return; }
      localStorage.setItem(PASS_KEY, pass);
      saved = pass;
      showToast("এই ব্রাউজারে ডেমো পাসকোড সেট হয়েছে।");
    }
    if (pass !== saved) { $("#loginError").textContent = "পাসকোড মিলেনি। আবার চেষ্টা করো।"; return; }
    $("#loginError").textContent = "";
    sessionStorage.setItem(SESSION_KEY, "yes");
    $("#adminPass").value = "";
    setLoggedIn(true);
  });
  $("#logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    setLoggedIn(false);
    showToast("ডেমো প্যানেল থেকে লগআউট হয়েছে।");
  });

  // Tabs
  document.querySelectorAll(".side-link").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".side-link").forEach(b => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".tab-panel").forEach(p => p.hidden = p.id !== "tab-" + btn.dataset.tab);
  }));

  // File selection with size/type validation and base64 demo storage.
  $("#photoFile").addEventListener("change", async e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("শুধু image ফাইল নির্বাচন করো।"); e.target.value = ""; return; }
    if (file.size > MAX_IMAGE_BYTES) { showToast("ডেমো মোডে ছবির সাইজ সর্বোচ্চ 2 MB হতে পারে।"); e.target.value = ""; return; }
    try {
      selectedImage = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      $("#previewImage").src = selectedImage;
      $("#uploadPreview").hidden = false;
    } catch (_) { showToast("ছবিটি পড়া যায়নি। আবার চেষ্টা করো।"); }
  });
  function clearSelectedImage() {
    selectedImage = "";
    $("#photoFile").value = "";
    $("#photoUrl").value = "";
    $("#uploadPreview").hidden = true;
    $("#previewImage").removeAttribute("src");
  }
  $("#clearImage").addEventListener("click", clearSelectedImage);
  $("#photoUrl").addEventListener("input", () => {
    if ($("#photoUrl").value.trim()) {
      selectedImage = "";
      $("#photoFile").value = "";
      $("#uploadPreview").hidden = true;
    }
  });
  $("#resetPhoto").addEventListener("click", () => setTimeout(clearSelectedImage, 0));

  $("#photoForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = $("#photoTitle").value.trim();
    const url = $("#photoUrl").value.trim();
    if (!title) return;
    if (!selectedImage && !url) { showToast("একটি ছবির URL দাও অথবা ফোন থেকে ছবি নির্বাচন করো।"); return; }
    if (url && !selectedImage && !/^https?:\/\//i.test(url)) { showToast("ছবির URL অবশ্যই http:// অথবা https:// দিয়ে শুরু হবে।"); return; }
    const data = readData();
    data.photos.unshift({ id: cryptoId(), title, category: $("#photoCategory").value, description: $("#photoDescription").value.trim(), image: selectedImage || url, createdAt: new Date().toISOString() });
    if (saveData(data)) { $("#photoForm").reset(); clearSelectedImage(); showToast("ডেমো গ্যালারিতে ছবি যোগ হয়েছে।"); }
  });
  $("#memoryForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = readData();
    data.memories.unshift({ id: cryptoId(), title: $("#memoryTitle").value.trim(), date: $("#memoryDate").value, text: $("#memoryText").value.trim(), createdAt: new Date().toISOString() });
    if (saveData(data)) { $("#memoryForm").reset(); showToast("স্মৃতির পোস্ট সংরক্ষিত হয়েছে।"); }
  });
  $("#teacherForm").addEventListener("submit", e => {
    e.preventDefault();
    const data = readData();
    data.teachers.unshift({ id: cryptoId(), name: $("#teacherName").value.trim(), subject: $("#teacherSubject").value.trim(), message: $("#teacherMessage").value.trim(), createdAt: new Date().toISOString() });
    if (saveData(data)) { $("#teacherForm").reset(); showToast("শিক্ষক পরিচিতি যোগ হয়েছে।"); }
  });

  function cryptoId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }
  function safeImage(image) {
    // Image data URLs are accepted only for locally selected images; external URLs must be HTTP(S).
    if (typeof image !== "string") return "";
    if (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(image)) return image;
    try { const u = new URL(image); if (u.protocol === "https:" || u.protocol === "http:") return u.href; } catch (_) {}
    return "";
  }
  function renderList(containerId, items, kind) {
    const el = $("#" + containerId);
    if (!items.length) { el.innerHTML = '<div class="empty-state">এখনো কিছু যোগ করা হয়নি। উপরের ফর্ম ব্যবহার করে যোগ করো।</div>'; return; }
    el.innerHTML = items.map(item => {
      let thumb = "✦", meta = "", title = "";
      if (kind === "photos") {
        title = item.title; meta = ({"class":"ক্লাস","friends":"বন্ধুরা","teachers":"স্যার-ম্যাম","lab":"কম্পিউটার ল্যাব","other":"অন্যান্য"}[item.category] || "স্মৃতি") + (item.description ? " · " + item.description : "");
        const src = safeImage(item.image);
        thumb = src ? '<img src="' + escapeHtml(src) + '" alt="" loading="lazy">' : "▧";
      } else if (kind === "memories") {
        title = item.title; meta = (item.date || "তারিখ দেওয়া হয়নি") + " · " + item.text;
      } else {
        title = item.name; meta = item.subject || "বিষয় / পদবি দেওয়া হয়নি";
        thumb = "♙";
      }
      return '<article class="item-card"><div class="item-thumb">' + thumb + '</div><div class="item-copy"><b>' + escapeHtml(title) + '</b><small>' + escapeHtml(meta) + '</small></div><div class="item-actions"><button class="icon-btn" data-action="edit" data-kind="' + kind + '" data-id="' + escapeHtml(item.id) + '" aria-label="সম্পাদনা">✎</button><button class="icon-btn delete" data-action="delete" data-kind="' + kind + '" data-id="' + escapeHtml(item.id) + '" aria-label="মুছে ফেলুন">×</button></div></article>';
    }).join("");
  }
  function renderAll() {
    const data = readData();
    $("#statPhotos").textContent = data.photos.length;
    $("#statMemories").textContent = data.memories.length;
    $("#statTeachers").textContent = data.teachers.length;
    $("#photoCount").textContent = data.photos.length + " items";
    $("#photoListNote").textContent = data.photos.length ? data.photos.length + "টি ছবি" : "এখনো কোনো ছবি যোগ করা হয়নি";
    renderList("photoList", data.photos, "photos");
    renderList("memoryList", data.memories, "memories");
    renderList("teacherList", data.teachers, "teachers");
  }
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, kind, id } = btn.dataset;
    const data = readData();
    const arr = data[kind];
    const item = arr.find(x => x.id === id);
    if (!item) return;
    if (action === "delete") {
      if (!confirm("এই আইটেমটি মুছে ফেলতে চাও?")) return;
      data[kind] = arr.filter(x => x.id !== id);
      if (saveData(data)) showToast("আইটেমটি মুছে ফেলা হয়েছে।");
    } else if (action === "edit") {
      if (kind === "photos") {
        $("#photoTitle").value = item.title || "";
        $("#photoCategory").value = item.category || "other";
        $("#photoDescription").value = item.description || "";
        if (/^https?:\/\//i.test(item.image || "")) $("#photoUrl").value = item.image;
        else if ((item.image || "").startsWith("data:image/")) {
          selectedImage = item.image; $("#previewImage").src = selectedImage; $("#uploadPreview").hidden = false;
        }
        document.querySelector('[data-tab="photos"]').click();
        $("#photoTitle").focus();
      } else if (kind === "memories") {
        $("#memoryTitle").value = item.title || ""; $("#memoryDate").value = item.date || ""; $("#memoryText").value = item.text || "";
        document.querySelector('[data-tab="memories"]').click(); $("#memoryTitle").focus();
      } else {
        $("#teacherName").value = item.name || ""; $("#teacherSubject").value = item.subject || ""; $("#teacherMessage").value = item.message || "";
        document.querySelector('[data-tab="teachers"]').click(); $("#teacherName").focus();
      }
      if (confirm("এডিট ফর্মে তথ্য বসানো হয়েছে। সংরক্ষণের পর পুরোনো আইটেমটি আলাদাভাবে মুছে ফেলবে। এখন পুরোনো আইটেম মুছে ফেলতে চাও?")) {
        data[kind] = arr.filter(x => x.id !== id); saveData(data);
      }
    }
  });

  $("#exportData").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(readData(), null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "milon-memories-backup.json"; a.click();
    URL.revokeObjectURL(url); showToast("JSON ব্যাকআপ ডাউনলোড শুরু হয়েছে।");
  });
  $("#importFile").addEventListener("change", async e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || !Array.isArray(parsed.photos) || !Array.isArray(parsed.memories) || !Array.isArray(parsed.teachers)) throw new Error("invalid");
      if (!confirm("ব্যাকআপ ইমপোর্ট করলে বর্তমান ডেমো ডেটা প্রতিস্থাপিত হবে। চালিয়ে যাবে?")) { e.target.value = ""; return; }
      if (saveData(parsed)) showToast("ব্যাকআপ পুনরুদ্ধার করা হয়েছে।");
    } catch (_) { showToast("ব্যাকআপ ফাইলটি সঠিক JSON নয় বা ফরম্যাট মেলেনি।"); }
    e.target.value = "";
  });
  $("#clearAll").addEventListener("click", () => {
    if (!confirm("সত্যিই কি সব ডেমো ডেটা মুছে ফেলতে চাও?")) return;
    saveData(blankData()); showToast("সব ডেমো কনটেন্ট মুছে ফেলা হয়েছে।");
  });
  $("#changePassForm").addEventListener("submit", e => {
    e.preventDefault();
    const pass = $("#newPass").value;
    if (pass.length < 4) { showToast("কমপক্ষে ৪ অক্ষরের পাসকোড দাও।"); return; }
    localStorage.setItem(PASS_KEY, pass); $("#newPass").value = ""; showToast("এই ব্রাউজারের ডেমো পাসকোড পরিবর্তন হয়েছে।");
  });

  // Public page reads this same-browser local data. Static visitors on other devices will not share it.
  initLogin();
})();