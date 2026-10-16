(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const welcome = $("#welcomeModal");
  const lightbox = $("#lightbox");
  const cards = $$(".gallery-card");
  let visibleCards = cards.filter(card => !card.hidden);
  let currentIndex = 0;
  let toastTimer;

  // Welcome popup: shows once per browser session.
  try {
    if (!sessionStorage.getItem("milonMemoriesWelcomeSeen")) {
      window.setTimeout(() => { welcome.hidden = false; document.body.classList.add("modal-open"); }, 650);
    }
  } catch (_) {
    window.setTimeout(() => { welcome.hidden = false; document.body.classList.add("modal-open"); }, 650);
  }
  function closeWelcome() {
    welcome.hidden = true;
    document.body.classList.remove("modal-open");
    try { sessionStorage.setItem("milonMemoriesWelcomeSeen", "yes"); } catch (_) {}
  }
  $("#closeWelcome").addEventListener("click", closeWelcome);
  $$("[data-close-welcome]").forEach(el => el.addEventListener("click", closeWelcome));
  $("#startMemories").addEventListener("click", () => { closeWelcome(); $("#journey").scrollIntoView({behavior:"smooth"}); });

  // Mobile navigation
  const nav = $("#mainNav"), menuToggle = $("#menuToggle");
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  $$("nav a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false"); menuToggle.textContent="☰";
  }));

  // Scroll reveal, with fallback for older browsers.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
      });
    }, {threshold: 0.12});
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));

  // Gallery filters
  $$(".filter-btn").forEach(button => button.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.toggle("active", b === button));
    const filter = button.dataset.filter;
    cards.forEach(card => { card.hidden = !(filter === "all" || card.dataset.category === filter); });
    visibleCards = cards.filter(card => !card.hidden);
  }));

  function getCardImage(card) {
    const img = card.querySelector("img");
    return img ? img.src : "";
  }
  function openLightbox(card) {
    visibleCards = cards.filter(c => !c.hidden);
    currentIndex = visibleCards.indexOf(card);
    renderLightbox();
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
  }
  function renderLightbox() {
    const card = visibleCards[currentIndex];
    if (!card) return;
    const imageBox = $("#lightboxImage");
    const imageSrc = getCardImage(card);
    imageBox.replaceChildren();
    if (imageSrc) {
      const img = document.createElement("img");
      img.src = imageSrc; img.alt = card.dataset.title || "স্মৃতির ছবি";
      imageBox.appendChild(img);
    } else {
      const icon = document.createElement("span"); icon.textContent = "▧"; imageBox.appendChild(icon);
    }
    $("#lightboxTitle").textContent = card.dataset.title || "আমাদের স্মৃতি";
    $("#lightboxDescription").textContent = card.dataset.description || "একসঙ্গে কাটানো কিছু মুহূর্ত।";
  }
  cards.forEach(card => card.addEventListener("click", () => {
    if (card.dataset.placeholder === "true" && !card.querySelector("img")) {
      showToast("এটি নমুনা কার্ড। README-BN.txt দেখে এখানে নিজের ছবি যোগ করুন।");
    }
    openLightbox(card);
  }));
  function closeLightbox() { lightbox.hidden = true; document.body.classList.remove("modal-open"); }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  $("#lightboxPrev").addEventListener("click", () => { currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length; renderLightbox(); });
  $("#lightboxNext").addEventListener("click", () => { currentIndex = (currentIndex + 1) % visibleCards.length; renderLightbox(); });
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeLightbox(); closeWelcome(); }
    if (!lightbox.hidden && e.key === "ArrowRight") $("#lightboxNext").click();
    if (!lightbox.hidden && e.key === "ArrowLeft") $("#lightboxPrev").click();
  });

  function showToast(message) {
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }
})();