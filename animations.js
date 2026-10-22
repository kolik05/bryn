/* =========================================================
   ANIMATIONS.JS — Jungle Safari 1st Birthday (Briyan)
   Vanilla JS, tanpa dependency tambahan.

   Fitur:
   1. Dekorasi daun melayang (ambient)
   2. Hewan jalan melintas layar (walker) + burung/kupu terbang (flyer)
   3. Scroll-reveal untuk section/card
   4. Image slide-in dari samping + idle float tiap section muncul
   5. Navbar shadow saat scroll
   6. Confetti saat klik tombol buka undangan / RSVP
   7. Parallax ringan foto hero (desktop only)
   8. Countdown acara (opsional via data attribute)
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  let decorContainer = null;
  let resizeTimer = null;

  /* ---------------------------------------------------
     1 & 2. DEKORASI JUNGLE (daun, hewan jalan, burung terbang)
  --------------------------------------------------- */
  function clearDecor() {
    if (decorContainer) {
      decorContainer.remove();
      decorContainer = null;
    }
  }

  function buildDecor() {
    if (prefersReducedMotion) return;

    clearDecor();

    decorContainer = document.createElement("div");
    decorContainer.className = "jungle-bg-decor";
    decorContainer.setAttribute("aria-hidden", "true");
    document.body.appendChild(decorContainer);

    const width = window.innerWidth;

    /* --- Daun melayang (ambient, banyak & lembut) --- */
    const leaves = ["🍃", "🌿", "🍂", "🌴"];
    const leafCount = width < 576 ? 7 : width < 992 ? 11 : 16;

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement("span");
      leaf.className = "jungle-leaf";
      leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];

      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 12; // 9s - 21s
      const delay = Math.random() * 14;
      const size = 1 + Math.random() * 1.3;
      const drift = (Math.random() * 140 - 70).toFixed(0) + "px";

      leaf.style.left = left + "vw";
      leaf.style.fontSize = size + "rem";
      leaf.style.animationDuration = duration + "s";
      leaf.style.animationDelay = "-" + delay + "s";
      leaf.style.setProperty("--drift", drift);

      decorContainer.appendChild(leaf);
    }

    /* --- Hewan "nongkrong" mengambang lembut di pojok --- */
    const ambientAnimals = ["🐾", "🦋", "⭐"];
    const ambientCount = width < 576 ? 3 : width < 992 ? 5 : 6;

    for (let i = 0; i < ambientCount; i++) {
      const animal = document.createElement("span");
      animal.className = "jungle-animal";
      animal.textContent =
        ambientAnimals[Math.floor(Math.random() * ambientAnimals.length)];

      const side = i % 2 === 0 ? Math.random() * 10 : 88 + Math.random() * 10;
      const top = 8 + Math.random() * 78;
      const duration = 3.5 + Math.random() * 3;
      const delay = Math.random() * 4;

      animal.style.left = side + "vw";
      animal.style.top = top + "vh";
      animal.style.animationDuration = duration + "s";
      animal.style.animationDelay = "-" + delay + "s";

      decorContainer.appendChild(animal);
    }

    /* --- Hewan jalan melintas layar (walker) --- */
    const walkerAnimals = ["🦁", "🐘", "🦒", "🐒"];
    const walkerCount = width < 576 ? 2 : width < 992 ? 3 : 4;

    for (let i = 0; i < walkerCount; i++) {
      const reverse = i % 2 === 1;
      const outer = document.createElement("span");
      outer.className =
        "jungle-walker" + (reverse ? " jungle-walker--reverse" : "");

      const inner = document.createElement("span");
      inner.className = "jungle-walker-inner";
      inner.textContent =
        walkerAnimals[Math.floor(Math.random() * walkerAnimals.length)];

      const bottom = 2 + Math.random() * 10; // 2% - 12% dari bawah
      const walkDuration = 22 + Math.random() * 20; // 22s - 42s
      const walkDelay = Math.random() * 20;
      const bounceDuration = 0.5 + Math.random() * 0.3;
      const fontSize = 1.8 + Math.random() * 0.8;

      outer.style.bottom = bottom + "%";
      outer.style.fontSize = fontSize + "rem";
      outer.style.animationDuration = walkDuration + "s";
      outer.style.animationDelay = "-" + walkDelay + "s";
      inner.style.animationDuration = bounceDuration + "s";

      outer.appendChild(inner);
      decorContainer.appendChild(outer);
    }

    /* --- Burung / kupu-kupu terbang di langit --- */
    const flyerAnimals = ["🐦", "🦜", "🦋"];
    const flyerCount = width < 576 ? 1 : width < 992 ? 2 : 3;

    for (let i = 0; i < flyerCount; i++) {
      const outer = document.createElement("span");
      outer.className = "jungle-flyer";

      const inner = document.createElement("span");
      inner.className = "jungle-flyer-inner";
      inner.textContent =
        flyerAnimals[Math.floor(Math.random() * flyerAnimals.length)];

      const top = 4 + Math.random() * 22; // area langit atas
      const flyDuration = 14 + Math.random() * 14;
      const flyDelay = Math.random() * 14;
      const bobDuration = 2 + Math.random() * 1.5;

      outer.style.top = top + "%";
      outer.style.animationDuration = flyDuration + "s";
      outer.style.animationDelay = "-" + flyDelay + "s";
      inner.style.animationDuration = bobDuration + "s";

      outer.appendChild(inner);
      decorContainer.appendChild(outer);
    }
  }

  function initJungleDecor() {
    buildDecor();

    // Regenerate saat resize (debounce) biar jumlah elemen tetap pas
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildDecor, 400);
      },
      { passive: true },
    );
  }

  /* ---------------------------------------------------
     3. SCROLL REVEAL (section/card/head)
  --------------------------------------------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      ".section, .panel, .card, .section-head",
    );

    targets.forEach((el) => {
      if (
        !el.classList.contains("reveal") &&
        !el.classList.contains("reveal-pop")
      ) {
        el.classList.add("reveal");
      }
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal, .reveal-pop")
        .forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    document
      .querySelectorAll(".reveal, .reveal-pop")
      .forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------
     4. IMAGE SLIDE-IN DARI SAMPING + IDLE FLOAT
     Target: elemen dengan class .reveal-img
     Arah (left/right) otomatis selang-seling berdasar urutan,
     kecuali sudah diberi atribut data-dir manual di HTML.
  --------------------------------------------------- */
  function initImageReveal() {
    const images = document.querySelectorAll(".reveal-img");
    if (!images.length) return;

    images.forEach((img, index) => {
      if (!img.hasAttribute("data-dir")) {
        img.setAttribute("data-dir", index % 2 === 0 ? "left" : "right");
      }
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      images.forEach((img) => {
        img.classList.add("in-view");
        img.style.opacity = "1";
        img.style.transform = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // beri sedikit delay bertahap kalau berdekatan (efek gallery)
            const delay = parseFloat(el.dataset.revealDelay || "0");
            setTimeout(() => {
              el.classList.add("in-view");
              // nyalakan idle float setelah animasi masuk selesai
              setTimeout(() => el.classList.add("idle-float"), 950);
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" },
    );

    // beri delay bertahap untuk grid gallery biar muncul berurutan
    let galleryIndex = 0;
    images.forEach((img) => {
      if (img.closest(".gallery")) {
        img.dataset.revealDelay = (galleryIndex % 4) * 90;
        galleryIndex++;
      }
      observer.observe(img);
    });
  }

  /* ---------------------------------------------------
     5. NAVBAR SHADOW ON SCROLL
  --------------------------------------------------- */
  function initNavbarScroll() {
    const nav = document.querySelector(".mynavbar");
    if (!nav) return;

    const toggle = () => {
      nav.classList.toggle("navbar-scrolled", window.scrollY > 10);
    };

    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* ---------------------------------------------------
     6. CONFETTI (klik tombol undangan / RSVP)
  --------------------------------------------------- */
  const CONFETTI_COLORS = [
    "#2f7d32",
    "#f2a65a",
    "#f6c445",
    "#b5452b",
    "#9aa5b1",
    "#fff8ea",
  ];

  function burstConfetti(x, y) {
    if (prefersReducedMotion) return;

    const count = 26;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.left = x + "px";
      piece.style.top = y + "px";

      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 140;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 60;
      const rotate = Math.random() * 540 - 270;
      const duration = 700 + Math.random() * 500;

      document.body.appendChild(piece);

      const anim = piece.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: "cubic-bezier(.17,.89,.32,1.49)" },
      );

      anim.onfinish = () => piece.remove();
    }
  }

  function initConfettiTriggers() {
    document
      .querySelectorAll(".hero-open, .btn-hero, [data-confetti]")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const rect = btn.getBoundingClientRect();
          burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
      });
  }

  /* ---------------------------------------------------
     7. PARALLAX RINGAN FOTO HERO (desktop only)
  --------------------------------------------------- */
  function initHeroParallax() {
    if (isTouch || prefersReducedMotion) return;

    const hero = document.querySelector(".hero");
    const img = document.querySelector(".hero > main > img");
    if (!hero || !img) return;

    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      img.style.transform = `translate(${relX * 10}px, ${relY * 10}px) rotate(${relX * 4}deg)`;
    });

    hero.addEventListener("mouseleave", () => {
      img.style.transform = "translate(0,0) rotate(0deg)";
    });
  }

  /* ---------------------------------------------------
     8. COUNTDOWN ACARA (opsional, tidak bentrok dgn simplyCountdown)
  --------------------------------------------------- */
  function initCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return;

    const eventDateStr = el.getAttribute("data-event-date");
    if (!eventDateStr) return;

    const eventDate = new Date(eventDateStr);
    if (isNaN(eventDate.getTime())) return;

    const dayNameEl = el.querySelector('[data-cd="dayname"]');
    const dayNumEl = el.querySelector('[data-cd="day"]');
    const monthEl = el.querySelector('[data-cd="month"]');
    const timeEl = el.querySelector('[data-cd="time"]');
    const untilEl = el.querySelector('[data-cd="until"]');

    const dayNames = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    if (dayNameEl) dayNameEl.textContent = dayNames[eventDate.getDay()];
    if (dayNumEl) dayNumEl.textContent = eventDate.getDate();
    if (monthEl) monthEl.textContent = monthNames[eventDate.getMonth()];
    if (timeEl) {
      const h = String(eventDate.getHours()).padStart(2, "0");
      const m = String(eventDate.getMinutes()).padStart(2, "0");
      timeEl.textContent = `${h}:${m}`;
    }

    function updateUntil() {
      if (!untilEl) return;
      const diff = eventDate - new Date();
      if (diff <= 0) {
        untilEl.textContent = "Hari H! 🎉";
        clearInterval(timer);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      untilEl.textContent = days > 0 ? `${days} hari lagi` : "Hari ini!";
    }

    updateUntil();
    const timer = setInterval(updateUntil, 60000);
  }
  /* ---------------------------------------------------
   9. SECTION WATERMARK (hewan besar transparan per panel)
--------------------------------------------------- */
  function initSectionWatermarks() {
    const map = {
      home: { icon: "🌿", pos: "br" },
      event: { icon: "🦁", pos: "tr" },
      gallery: { icon: "📸", pos: "bl" },
      rsvp: { icon: "🐘", pos: "br" },
    };

    Object.keys(map).forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      if (section.querySelector(".panel-watermark")) return;

      const { icon, pos } = map[id];
      const wm = document.createElement("span");
      wm.className = `panel-watermark panel-watermark--${pos}`;
      wm.textContent = icon;
      wm.setAttribute("aria-hidden", "true");
      section.prepend(wm);
    });
  }
  /* ---------------------------------------------------
     INIT ALL
  --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[jungle-theme] animations.js loaded ✅");

    initJungleDecor();
    initScrollReveal();
    initImageReveal();
    initNavbarScroll();
    initConfettiTriggers();
    initHeroParallax();
    initCountdown();
    initSectionWatermarks(); // ← tambahkan ini

    const heroH1 = document.querySelector(".hero h1");
    if (heroH1 && !prefersReducedMotion) {
      heroH1.classList.add("bounce-in");
    }
  });
})();
