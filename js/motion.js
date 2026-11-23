/* =========================================================
   MOTION: intro + scroll reveals (GSAP).
   Skipped entirely when the visitor prefers reduced motion,
   or if GSAP failed to load. Content is never left hidden.
   ========================================================= */

(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce || typeof gsap === "undefined") {
    root.classList.remove("motion");
    return;
  }

  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.6 });

  const q = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const done = () => root.classList.remove("motion");

  /* ---------- Intro: home hero ---------- */
  const hero = document.querySelector(".hero");
  if (hero) {
    gsap.timeline({ onComplete: done })
      .fromTo(q(".hero__copy > *", hero),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, stagger: 0.08, clearProps: "transform" })
      .fromTo(".player-wrap",
        { autoAlpha: 0, y: 40, rotate: -6, scale: 0.92 },
        { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 0.75, ease: "back.out(1.6)", clearProps: "transform" },
        0.2);
  }

  /* ---------- Intro: page heading (category + about pages) ---------- */
  const head = document.querySelector(".page-head");
  if (!hero && head) {
    const icon = head.querySelector(".page-head__icon");
    const rest = q(".page-head__title, .page-head__intro, .page-head__count, .about-bio, .about-intro__copy > .btn-row, .facts", head);
    const tl = gsap.timeline({ onComplete: done });
    if (icon) {
      tl.fromTo(icon,
        { autoAlpha: 0, scale: 0.4, rotate: -40 },
        { autoAlpha: 1, scale: 1, rotate: -6, duration: 0.55, ease: "back.out(2)" });
    }
    tl.fromTo(rest,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, stagger: 0.07, clearProps: "transform" },
      icon ? 0.12 : 0);
  }

  if (!hero && !head) done();

  /* ---------- Scroll reveals ---------- */
  if (typeof ScrollTrigger === "undefined") return;

  const targets = q([
    ".section__head",
    ".featured",
    ".tile",
    ".pcard",
    ".scard",
    ".slot",
    ".vrow",
    ".timeline__item",
    ".skill",
    ".side-quests > li",
    ".cta",
    ".contact",
    ".switcher"
  ].join(","));

  if (!targets.length) return;

  gsap.set(targets, { autoAlpha: 0, y: 32 });

  ScrollTrigger.batch(targets, {
    start: "top 92%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        overwrite: true,
        // hand transforms back to CSS so hover effects keep working
        clearProps: "transform"
      })
  });

  // Images loading in can shift the layout; keep trigger points accurate
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
