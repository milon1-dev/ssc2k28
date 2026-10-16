document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Reveal animations: make page sections visible while scrolling.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "মেনু বন্ধ করুন" : "মেনু খুলুন");
      menuToggle.textContent = open ? "×" : "☰";
    });
    $$("a", mainNav).forEach(link => link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }));
  }

  // Toast message.
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // Welcome modal.
  const welcomeModal = $("#welcomeModal");
  const closeWelcome = $("#closeWelcome");
  const startMemories = $("#startMemories");
  function hideWelcome() {
    if (welcomeModal) welcomeModal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  if (welcomeModal) {
    try {
      if (!sessionStorage.getItem("milonMemoriesWelcomed")) {
        welcomeModal.hidden = false;
        document.body.classList.add("modal-open");
      }
    } catch (_) {}
    if (closeWelcome) closeWelcome.addEventListener("click", hideWelcome);
    const backdrop = $("[data-close-welcome]", welcomeModal);
    if (backdrop) backdrop.addEventListener("click", hideWelcome);
    if (startMemories) startMemories.addEventListener("click", () => {
      hideWelcome();
      try { sessionStorage.setItem("milonMemoriesWelcomed", "yes"); } catch (_) {}
      $("#journey")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Gallery filtering.
  const filterButtons = $$(".filter-btn");
  const galleryCards = $$(".gallery-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => item.classList.toggle("active", item === button));
      galleryCards.forEach(card => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
    });
  });

  // Gallery lightbox.
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxTitle = $("#lightboxTitle");
  const lightboxDescription = $("#lightboxDescription");
  let currentIndex = 0;

  function showGalleryItem(index) {
    if (!galleryCards.length || !lightbox) return;
    currentIndex = (index + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentIndex];
    const image = $("img", card);
    if (lightboxImage) {
      lightboxImage.replaceChildren();
      if (image && image.src) {
        const copy = document.createElement("img");
        copy.src = image.src;
        copy.alt = image.alt || card.dataset.title || "স্মৃতির ছবি";
        lightboxImage.appendChild(copy);
      } else {
        const placeholder = $(".placeholder-photo", card);
        const copy = placeholder ? placeholder.cloneNode(true) : document.createElement("span");
        if (!placeholder) copy.textContent = "▧";
        lightboxImage.appendChild(copy);
      }
    }
    if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || "আমাদের স্মৃতি";
    if (lightboxDescription) lightboxDescription.textContent = card.dataset.description || "";
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      showGalleryItem(index);
      if (lightbox) lightbox.hidden = false;
    });
  });

  function closeLightbox() {
    if (lightbox) lightbox.hidden = true;
  }
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => showGalleryItem(currentIndex - 1));
  $("#lightboxNext")?.addEventListener("click", () => showGalleryItem(currentIndex + 1));

  // Close dialogs using Escape.
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      hideWelcome();
      closeLightbox();
      mainNav?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.textContent = "☰";
    }
  });

  // Demo notices for gallery placeholders.
  galleryCards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.dataset.placeholder === "true" && !$("img", card)) {
        showToast("এটি ডেমো ছবি। আসল ছবি যোগ করতে HTML-এ ছবির পাথ বসাও।");
      }
    });
  });

  console.log("MILON Our Memories: JavaScript loaded successfully.");
});
