/* ---- CURSOR ---- */
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const cursorHoverTargetSelector = "a, button, summary";
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
const heroGalleryImages = Array.from(
  document.querySelectorAll(".hero__gallery-img"),
);
if (heroGalleryImages.length > 1) {
  let activeHeroImage = heroGalleryImages.findIndex((img) =>
    img.classList.contains("hero__gallery-img--active"),
  );

  if (activeHeroImage < 0) {
    activeHeroImage = 0;
    heroGalleryImages[activeHeroImage].classList.add("hero__gallery-img--active");
  }

  heroGalleryImages.forEach((img, index) => {
    img.setAttribute("aria-hidden", String(index !== activeHeroImage));
  });

  window.setInterval(() => {
    heroGalleryImages[activeHeroImage].classList.remove(
      "hero__gallery-img--active",
    );
    heroGalleryImages[activeHeroImage].setAttribute("aria-hidden", "true");

    activeHeroImage = (activeHeroImage + 1) % heroGalleryImages.length;

    heroGalleryImages[activeHeroImage].classList.add("hero__gallery-img--active");
    heroGalleryImages[activeHeroImage].setAttribute("aria-hidden", "false");
  }, 5200);
}

/* ---- TEAM GALLERY ---- */
const teamGallery = document.querySelector("[data-team-gallery]");
if (teamGallery) {
  const teamSlides = Array.from(teamGallery.querySelectorAll(".team__slide"));
  const prevTeamSlide = teamGallery.querySelector(".team__gallery-btn--prev");
  const nextTeamSlide = teamGallery.querySelector(".team__gallery-btn--next");
  const teamGalleryText = teamGallery.querySelector("[data-team-gallery-text]");
  const teamGalleryIndex = teamGallery.querySelector("[data-team-gallery-index]");
  const teamGalleryTotal = teamGallery.querySelector("[data-team-gallery-total]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTeamSlide = teamSlides.findIndex((slide) =>
    slide.classList.contains("is-active"),
  );
  let teamGalleryTimer;
  const minTeamGalleryDuration = 6500;
  const maxTeamGalleryDuration = 18000;
  const baseTeamGalleryDuration = 2400;
  const msPerTeamGalleryWord = 320;

  if (activeTeamSlide < 0) {
    activeTeamSlide = 0;
  }

  const getTeamSlideDuration = (slide) => {
    const caption = (slide.dataset.caption || "").trim();
    const words = caption ? caption.split(/\s+/).length : 0;
    const sentenceCount = Math.max(1, (caption.match(/[.!?]+/g) || []).length);
    const calculatedDuration =
      baseTeamGalleryDuration + words * msPerTeamGalleryWord + sentenceCount * 350;

    return Math.min(
      maxTeamGalleryDuration,
      Math.max(minTeamGalleryDuration, calculatedDuration),
    );
  };

  const setTeamGalleryCopy = (slide) => {
    if (teamGalleryText) {
      teamGalleryText.style.opacity = "0";
      window.setTimeout(() => {
        teamGalleryText.textContent = slide.dataset.caption || "";
        teamGalleryText.style.opacity = "1";
      }, 160);
    }
  };

  const showTeamSlide = (index) => {
    if (!teamSlides.length) {
      return;
    }

    activeTeamSlide = (index + teamSlides.length) % teamSlides.length;

    teamSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeTeamSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    if (teamGalleryIndex) {
      teamGalleryIndex.textContent = String(activeTeamSlide + 1).padStart(2, "0");
    }

    setTeamGalleryCopy(teamSlides[activeTeamSlide]);
  };

  const stopTeamGallery = () => {
    window.clearTimeout(teamGalleryTimer);
  };

  const startTeamGallery = () => {
    stopTeamGallery();
    if (teamSlides.length < 2 || reducedMotion.matches) {
      return;
    }

    teamGalleryTimer = window.setTimeout(() => {
      showTeamSlide(activeTeamSlide + 1);
      startTeamGallery();
    }, getTeamSlideDuration(teamSlides[activeTeamSlide]));
  };

  const changeTeamSlide = (direction) => {
    showTeamSlide(activeTeamSlide + direction);
    startTeamGallery();
  };

  if (teamGalleryTotal) {
    teamGalleryTotal.textContent = String(teamSlides.length).padStart(2, "0");
  }

  showTeamSlide(activeTeamSlide);

  if (teamSlides.length > 1 && prevTeamSlide && nextTeamSlide) {
    prevTeamSlide.addEventListener("click", () => changeTeamSlide(-1));
    nextTeamSlide.addEventListener("click", () => changeTeamSlide(1));
    teamGallery.addEventListener("mouseenter", stopTeamGallery);
    teamGallery.addEventListener("mouseleave", startTeamGallery);
    teamGallery.addEventListener("focusin", stopTeamGallery);
    teamGallery.addEventListener("focusout", startTeamGallery);
    if (reducedMotion.addEventListener) {
      reducedMotion.addEventListener("change", startTeamGallery);
    } else {
      reducedMotion.addListener(startTeamGallery);
    }
    startTeamGallery();
  }
}

/* ---- TEAM PROFILES ---- */
const teamProfilesCarousel = document.querySelector("[data-team-profiles]");
if (teamProfilesCarousel) {
  const teamProfilesTrack = teamProfilesCarousel.querySelector(".team__profiles");
  const teamProfileCards = Array.from(
    teamProfilesCarousel.querySelectorAll(".team__profile"),
  );
  const prevTeamProfile = teamProfilesCarousel.querySelector(
    ".team__profile-btn--prev",
  );
  const nextTeamProfile = teamProfilesCarousel.querySelector(
    ".team__profile-btn--next",
  );
  const profileReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTeamProfile = 0;
  let profileScrollTimer;

  const updateTeamProfileState = (index) => {
    activeTeamProfile = (index + teamProfileCards.length) % teamProfileCards.length;
    teamProfileCards.forEach((card, cardIndex) => {
      card.setAttribute("aria-current", String(cardIndex === activeTeamProfile));
    });
  };

  const closestTeamProfileIndex = () => {
    const trackCenter =
      teamProfilesTrack.scrollLeft + teamProfilesTrack.clientWidth / 2;

    return teamProfileCards.reduce((closestIndex, card, cardIndex) => {
      const currentCard = teamProfileCards[closestIndex];
      const currentCenter = currentCard.offsetLeft + currentCard.offsetWidth / 2;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      return Math.abs(cardCenter - trackCenter) <
        Math.abs(currentCenter - trackCenter)
        ? cardIndex
        : closestIndex;
    }, 0);
  };

  const showTeamProfile = (index) => {
    if (!teamProfilesTrack || !teamProfileCards.length) {
      return;
    }

    const nextIndex = (index + teamProfileCards.length) % teamProfileCards.length;
    teamProfileCards[nextIndex].scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: profileReducedMotion.matches ? "auto" : "smooth",
    });
    updateTeamProfileState(nextIndex);
  };

  if (
    teamProfilesTrack &&
    teamProfileCards.length > 1 &&
    prevTeamProfile &&
    nextTeamProfile
  ) {
    updateTeamProfileState(0);

    prevTeamProfile.addEventListener("click", () =>
      showTeamProfile(activeTeamProfile - 1),
    );
    nextTeamProfile.addEventListener("click", () =>
      showTeamProfile(activeTeamProfile + 1),
    );

    teamProfilesTrack.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(profileScrollTimer);
        profileScrollTimer = window.setTimeout(
          () => updateTeamProfileState(closestTeamProfileIndex()),
          120,
        );
      },
      { passive: true },
    );

    window.addEventListener("resize", () => showTeamProfile(activeTeamProfile));
  }
}
