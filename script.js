/* ============================================================
   PIXEL VIKAS — Main JavaScript
   ============================================================ */

// ── Nav scroll behavior ──
const nav = document.querySelector("nav");
const handleNavScroll = () => {
  if (window.scrollY > 60) nav?.classList.add("scrolled");
  else nav?.classList.remove("scrolled");
};
window.addEventListener("scroll", handleNavScroll, { passive: true });
handleNavScroll();

// ── Active nav link ──
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
    link.classList.add("active");
  }
});

// ── Hamburger / Mobile Menu ──
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  mobileMenu?.classList.toggle("open");
  document.body.style.overflow = mobileMenu?.classList.contains("open")
    ? "hidden"
    : "";
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("open");
    mobileMenu?.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ── Back to top ──
const backToTop = document.querySelector(".back-to-top");
window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 400) backToTop?.classList.add("visible");
    else backToTop?.classList.remove("visible");
  },
  { passive: true },
);

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── Counter Animation ──
const counters = document.querySelectorAll(".stat-num[data-target]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || "";
        const duration = 1800;
        const start = performance.now();

        const update = (timestamp) => {
          const elapsed = timestamp - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);

counters.forEach((c) => counterObserver.observe(c));

// ── Projects Filter ──
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card[data-category]");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.opacity = "1";
        card.style.transform = "";
        card.style.pointerEvents = "";
      } else {
        card.style.opacity = "0.15";
        card.style.transform = "scale(0.96)";
        card.style.pointerEvents = "none";
      }
    });
  });
});

// ── Contact Form ──
const contactForm = document.querySelector("#contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = "Sending...";
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = "✓ Message Sent!";
    btn.style.background = "#2d8b4e";
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = "";
    }, 3000);
  }, 1200);
});

// ── Smooth cursor effect (desktop only) ──
// ── Smooth cursor effect (desktop only) ──
if (window.innerWidth > 768) {
  const cursor = document.createElement("div");
  cursor.style.cssText = `
    position: fixed; width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,168,41,0.8); pointer-events: none; z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, opacity 0.3s;
    mix-blend-mode: screen;
    will-change: left, top;
  `;
  document.body.appendChild(cursor);

  const cursorRing = document.createElement("div");
  cursorRing.style.cssText = `
    position: fixed; width: 28px; height: 28px; border-radius: 50%;
    border: 1px solid rgba(255,168,41,0.3); pointer-events: none; z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
    will-change: left, top;
  `;
  document.body.appendChild(cursorRing);

  let mx = 0,
    my = 0;
  let ringX = 0,
    ringY = 0;
  let rafId;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;

    // Dot: instant — set directly, no transition on position
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  // Ring: smooth lag via lerp in rAF
  const lerp = (a, b, t) => a + (b - a) * t;

  const animateRing = () => {
    ringX = lerp(ringX, mx, 0.18);
    ringY = lerp(ringY, my, 0.18);
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    rafId = requestAnimationFrame(animateRing);
  };
  animateRing();

  document
    .querySelectorAll("a, button, .project-card, .service-card")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
        cursorRing.style.width = "48px";
        cursorRing.style.height = "48px";
        cursorRing.style.borderColor = "rgba(255,168,41,0.5)";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursorRing.style.width = "28px";
        cursorRing.style.height = "28px";
        cursorRing.style.borderColor = "rgba(255,168,41,0.3)";
      });
    });
}

// ── Parallax on hero ──
const heroSection = document.querySelector(".hero");
if (heroSection) {
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      const heroBg = heroSection.querySelector(".hero-bg");
      if (heroBg) heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    },
    { passive: true },
  );
}

// ── Typed text effect (hero) ──
const typedEl = document.querySelector(".typed-text");
if (typedEl) {
  const words = [
    "Digital Marketing",
    "Web Development",
    "Mobile Apps",
    "SEO Solutions",
    "Brand Design",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const word = words[wordIndex];
    if (isDeleting) {
      typedEl.textContent = word.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = word.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;
    if (!isDeleting && charIndex === word.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  };
  type();
}

// ── Newsletter form ──
document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input");
    const btn = form.querySelector("button");
    if (input.value) {
      btn.textContent = "✓";
      input.value = "";
      setTimeout(() => {
        btn.textContent = "→";
      }, 2000);
    }
  });
});
