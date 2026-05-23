/* ---- CURSOR ---- */
const cursor = document.getElementById("cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  let rx = 0,
    ry = 0;
  document.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
  });
  let animId;
  function smoothRing(e) {
    cancelAnimationFrame(animId);
    function step() {
      rx += (parseFloat(dot.style.left) - rx) * 0.12;
      ry += (parseFloat(dot.style.top) - ry) * 0.12;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      animId = requestAnimationFrame(step);
    }
    step();
  }
  smoothRing();
  document
    .querySelectorAll(
      "a, button, .svc-card, .team__member, .review, .trust__item",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("cursor-hover"),
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("cursor-hover"),
      );
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
  .querySelectorAll(".fade-up, .reveal-image")
  .forEach((el) => observer.observe(el));
