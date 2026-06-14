/* ---- CURSOR ---- */
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const cursorHoverTargetSelector = "a, button";
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let cursorVisible = false;
  let cursorSuppressed = false;

  const moveElement = (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const setCursorVisible = (visible) => {
    cursorVisible = visible;
    document.body.classList.toggle("cursor-visible", visible);
    if (!visible) {
      document.body.classList.remove("cursor-hover");
    }
  };

  const setCursorSuppressed = (suppressed) => {
    cursorSuppressed = suppressed;
    if (suppressed) {
      setCursorVisible(false);
    }
  };

  const updateCursor = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    if (cursorVisible) {
      moveElement(dot, mouseX, mouseY);
      moveElement(ring, ringX, ringY);
    }

    requestAnimationFrame(updateCursor);
  };

  document.addEventListener(
    "pointermove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const isCursorSuppressedTarget = e.target.closest?.(".kontakt__map");

      if (isCursorSuppressedTarget) {
        setCursorSuppressed(true);
      } else if (cursorSuppressed) {
        setCursorSuppressed(false);
      }

      if (cursorSuppressed) {
        setCursorVisible(false);
        return;
      }

      document.body.classList.toggle(
        "cursor-hover",
        Boolean(e.target.closest?.(cursorHoverTargetSelector)),
      );

      if (!cursorVisible) {
        ringX = mouseX;
        ringY = mouseY;
        moveElement(dot, mouseX, mouseY);
        moveElement(ring, ringX, ringY);
      }

      setCursorVisible(true);
    },
    { passive: true },
  );

  document.querySelectorAll(".kontakt__map, .kontakt__map iframe").forEach((el) => {
    el.addEventListener("pointerenter", () => setCursorSuppressed(true));
    el.addEventListener("mouseenter", () => setCursorSuppressed(true));
    el.addEventListener("pointerleave", () => setCursorSuppressed(false));
    el.addEventListener("mouseleave", () => setCursorSuppressed(false));
  });

  document.addEventListener("pointerleave", () => setCursorVisible(false));
  window.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) {
      setCursorVisible(false);
    }
  });
  window.addEventListener("mouseout", (e) => {
    if (!e.relatedTarget && !e.toElement) {
      setCursorVisible(false);
    }
  });
  window.addEventListener("blur", () => setCursorVisible(false));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setCursorVisible(false);
    }
  });

  updateCursor();
  document
    .querySelectorAll(
      cursorHoverTargetSelector,
    )
    .forEach((el) => {
      const setCursorHover = () => document.body.classList.add("cursor-hover");
      const unsetCursorHover = () => document.body.classList.remove("cursor-hover");

      el.addEventListener("pointerenter", setCursorHover);
      el.addEventListener("mouseenter", setCursorHover);
      el.addEventListener("pointerleave", unsetCursorHover);
      el.addEventListener("mouseleave", unsetCursorHover);
    });
}

/* ---- LOADER ---- */
const loader = document.getElementById("loader");
const fill = document.getElementById("loaderFill");
let pct = 0;
const iv = setInterval(() => {
  pct += Math.random() * 18;
  if (pct >= 100) {
    pct = 100;
    clearInterval(iv);
  }
  fill.style.width = pct + "%";
  if (pct === 100) setTimeout(() => loader.classList.add("hidden"), 300);
}, 60);

/* ---- NAV SCROLL ---- */
const nav = document.getElementById("nav");
window.addEventListener(
  "scroll",
  () => {
    nav.classList.toggle("scrolled", window.scrollY > 50);
  },
  { passive: true },
);

/* ---- MOBILE NAV ---- */
const toggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks
  .querySelectorAll("a")
  .forEach((a) =>
    a.addEventListener("click", () => navLinks.classList.remove("open")),
  );

/* ---- SCROLL REVEAL ---- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".fade-up")
  .forEach((el) => observer.observe(el));

/* ---- HERO GALLERY ---- */
const heroGalleryImages = document.querySelectorAll(".hero__gallery-img");
if (heroGalleryImages.length > 1) {
  let activeHeroImage = 0;

  setInterval(() => {
    heroGalleryImages[activeHeroImage].classList.remove(
      "hero__gallery-img--active",
    );
    activeHeroImage = (activeHeroImage + 1) % heroGalleryImages.length;
    heroGalleryImages[activeHeroImage].classList.add(
      "hero__gallery-img--active",
    );
  }, 4800);
}

/* ---- PORTRAIT GALLERY ---- */
const portraitGallery = document.querySelector("[data-portrait-gallery]");
if (portraitGallery) {
  const portraitItems = portraitGallery.querySelectorAll(".konzept__portrait");
  const prevPortrait = portraitGallery.querySelector(".konzept__gallery-btn--prev");
  const nextPortrait = portraitGallery.querySelector(".konzept__gallery-btn--next");
  const portraitMedia = window.matchMedia("(max-width: 860px)");
  let activePortrait = Array.from(portraitItems).findIndex((item) =>
    item.classList.contains("is-active"),
  );

  if (activePortrait < 0) {
    activePortrait = 0;
  }

  const showPortrait = (index) => {
    activePortrait = (index + portraitItems.length) % portraitItems.length;

    portraitItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === activePortrait;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-hidden", String(portraitMedia.matches && !isActive));
    });
  };

  if (portraitItems.length > 1 && prevPortrait && nextPortrait) {
    showPortrait(activePortrait);
    prevPortrait.addEventListener("click", () => showPortrait(activePortrait - 1));
    nextPortrait.addEventListener("click", () => showPortrait(activePortrait + 1));
    if (portraitMedia.addEventListener) {
      portraitMedia.addEventListener("change", () => showPortrait(activePortrait));
    } else {
      portraitMedia.addListener(() => showPortrait(activePortrait));
    }
  }
}
