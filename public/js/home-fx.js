/* =========================================================================
   CLARTÉ OVERSEAS — Homepage immersive scroll experience
   GSAP + ScrollTrigger + Lenis, all served locally from /js/vendor/.

   Progressive enhancement: if these libs fail to load, or the visitor
   prefers reduced motion, the page falls back to the legacy .reveal
   IntersectionObserver styling and stays fully readable.
   ========================================================================= */
(() => {
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const html = document.documentElement;

  /* ======================================================================
     1 · HERO — load intro, floating depth objects, pinned scrub exit
     ====================================================================== */
  function heroScene() {
    const hero = $("#home");
    if (!hero) return;

    // Load intro: one quick, unified fade-in rather than a long sequential
    // reveal. The photo settles from a barely-there zoom, the veil/warm
    // center shade fade in alongside it, and the copy + CTAs + stats bar
    // rise and fade in together as a single wave (a hair of stagger for
    // smoothness, not a multi-second cascade). Whole thing wraps in ~1s.
    // Runs on every full page load of the homepage (first visit or
    // arriving from any other page), since this is a classic multi-page
    // site with no client-side routing to persist state across navigations.
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from("#home .hero-photo", { scale: 1.04, duration: 0.6 }, 0)
      // The veil + brown center shade are background layers, not content —
      // they fade in place (no y-movement) right under everything else.
      .from("#home .hero-flatlay-veil, #home .hero-center-shade", { autoAlpha: 0, duration: 0.55 }, 0)
      // clearProps is essential here: without it GSAP leaves an inline
      // `transform: translate(0, 14px)` on these elements after the intro
      // finishes, which (being inline) permanently outranks CSS `:hover`
      // transform rules (e.g. `.btn:hover { transform: translateY(-2px) }`).
      .from(
        [
          "#home .badge-pill",
          "#home h1",
          "#home p",
          "#home .hero-cta-row",
          "#home .hero-stats-row",
        ],
        { y: 14, autoAlpha: 0, duration: 0.55, stagger: 0.05, clearProps: "transform" },
        0.08,
      )
      // Stat cards get one last, brief micro-stagger so the bar doesn't
      // feel like a flat cut — but it overlaps heavily with the copy above
      // instead of waiting for it, so it still reads as one smooth beat.
      .from(".hero-stat", {
        y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.05, clearProps: "transform",
      }, "-=0.35");

    const mm = gsap.matchMedia();

    // Desktop: pin the hero briefly while its layers separate at different
    // speeds — the "camera pulling away from a 3D scene" moment
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: "top top", end: "+=55%",
          scrub: true, pin: true, anticipatePin: 1,
        },
      });
      tl.to("#home .hero-photo", { scale: 1.15, ease: "none" }, 0)
        .to("#home .max-w-7xl", { yPercent: -16, autoAlpha: 0, ease: "power1.in" }, 0)
        // Fade the brown center shade out with the text — it sits behind the
        // copy, not inside .max-w-7xl, so without this it would be left
        // visibly floating over the photo once the text has scrolled away.
        .to("#home .hero-center-shade", { autoAlpha: 0, ease: "power1.in" }, 0);
    });

    // Mobile / tablet: light parallax only, no pinning
    mm.add("(max-width: 1023px)", () => {
      gsap.to("#home .hero-photo", {
        yPercent: 14, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      });
    });
  }

  /* ======================================================================
     2 · ENTRANCES — every section element rises out of z-depth, staggered
     ====================================================================== */
  function entrances() {
    const skip = (el) => el.closest("#home") || el.classList.contains("proc-step");
    const items = $$(".reveal").filter((el) => !skip(el));
    if (!items.length) return;
    gsap.set(items, {
      autoAlpha: 0, y: 72, rotateX: 7,
      transformPerspective: 1000, transformOrigin: "50% 100%",
    });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      once: true,
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, y: 0, rotateX: 0,
        duration: 0.95, stagger: 0.09, ease: "power3.out",
        overwrite: true,
        clearProps: "transform,perspective", // keep CSS hover transforms alive
      }),
    });
  }

  /* ======================================================================
     3 · PROCESS STEPS — scrub-linked: each QC step slides in as you scroll
     ====================================================================== */
  function processScrub() {
    const steps = $$("#process .proc-step");
    if (!steps.length) return;
    gsap.set(steps, { autoAlpha: 0, x: 46 });
    gsap.to(steps, {
      autoAlpha: 1, x: 0, stagger: 0.35, ease: "power2.out",
      scrollTrigger: {
        trigger: "#process .proc-card",
        start: "top 78%", end: "top 22%", scrub: 0.5,
      },
    });
  }

  /* ======================================================================
     4 · PARALLAX ACCENTS — image drift + watermark slide
     ====================================================================== */
  function parallaxScenes() {
    if ($("#industries .img-ph")) {
      gsap.fromTo("#industries .img-ph", { y: 46 }, {
        y: -46, ease: "none",
        scrollTrigger: { trigger: "#industries", start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    if ($(".sec-wm-word")) {
      gsap.fromTo(".sec-wm-word", { xPercent: -12 }, {
        xPercent: 12, ease: "none",
        scrollTrigger: { trigger: "#markets", start: "top bottom", end: "bottom top", scrub: true },
      });
    }
  }

  /* ======================================================================
     5 · CTA BAND — tilts up out of the page like a card being dealt
     ====================================================================== */
  function ctaScene() {
    const panel = $("#quote .hero");
    if (!panel) return;
    gsap.from(panel, {
      rotateX: 16, y: 90, scale: 0.94, autoAlpha: 0,
      transformPerspective: 1100, transformOrigin: "50% 100%",
      duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: "#quote", start: "top 82%", once: true },
    });
  }

  /* ======================================================================
     6 · CERTIFICATION CHIPS — pop in from the centre outwards
     ====================================================================== */
  function chipsScene() {
    const chips = $$("#certifications .cert-chip");
    if (!chips.length) return;
    gsap.set(chips, { autoAlpha: 0, scale: 0.6, y: 18 });
    ScrollTrigger.batch(chips, {
      start: "top 92%",
      once: true,
      onEnter: (b) => gsap.to(b, {
        autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.7)",
        stagger: { each: 0.04, from: "center" },
      }),
    });
  }

  /* ====================================================================== */
  try {
    html.classList.add("fx-on"); // hands .reveal control from CSS to GSAP

    // Smooth inertial scroll — the "buttery" feel under everything
    if (window.Lenis) {
      const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      window.lenis = lenis; // programmatic scrolls must go through Lenis
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      const toTop = document.getElementById("toTop");
      if (toTop) toTop.addEventListener("click", () => lenis.scrollTo(0, { duration: 1.2 }));
    }

    // Scroll progress bar
    const bar = document.createElement("div");
    bar.className = "fx-progress";
    document.body.appendChild(bar);
    gsap.to(bar, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
    });

    heroScene();
    entrances();
    processScrub();
    parallaxScenes();
    ctaScene();
    chipsScene();

    // Layout can shift once photos land — recalculate trigger positions
    // and Lenis's scroll limit
    window.addEventListener("load", () => {
      ScrollTrigger.refresh();
      if (window.lenis) window.lenis.resize();
    });
  } catch (err) {
    // Fail open: clear inline styles and fall back to the legacy reveal CSS
    console.warn("home-fx disabled:", err);
    gsap.set(".reveal, .cert-chip, .proc-step", { clearProps: "all" });
    html.classList.remove("fx-on");
  }
})();
