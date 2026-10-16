(() => {
  const root = document.getElementById("managedGalleryGrid");
  if (!root) return;
  let data = {photos:[], memories:[], teachers:[]};
  try { data = JSON.parse(localStorage.getItem("milonMemoriesAdminData_v1") || '{"photos":[],"memories":[],"teachers":[]}'); } catch (_) {}
  if (!Array.isArray(data.photos) || !data.photos.length) {
    root.innerHTML = '<p>এখনো Admin Panel থেকে ছবি যোগ করা হয়নি।</p>';
    return;
  }
  root.innerHTML = data.photos.map(p => {
    const safe = typeof p.image === "string" && (/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(p.image) || /^https?:\/\//i.test(p.image)) ? p.image : "";
    const img = safe ? '<img src="' + safe.replace(/"/g, "&quot;") + '" alt="স্মৃতির ছবি" loading="lazy">' : "";
    const title = String(p.title || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const desc = String(p.description || "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    return '<article class="managed-photo">' + img + '<h3>' + title + '</h3><p>' + desc + '</p></article>';
  }).join("");
})();