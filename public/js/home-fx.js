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
  // Mobile browsers fire resize every time the URL bar slides in or out, and
  // a ScrollTrigger refresh mid-scroll snaps every scrubbed tween to freshly
  // measured positions — which reads as the page juddering while you drag.
  ScrollTrigger.config({ ignoreMobileResize: true });
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

    /* Curtain reveal.

       The photo holds still while the section scrolls up over it, so the torn
       bottom edge rises like a curtain being drawn up. No pinning and no
       scroll-jacking — the page scrolls at its normal 1:1 rate, the section's
       clip-path does the revealing, and the visible slice of the photo shrinks
       from the bottom as the section's lower edge (and the torn strip pinned
       to it) travels up the screen.

       The photo itself is held still by CSS position:fixed rather than by a
       scrubbed counter-transform. The transform version wobbled badly on
       phones: touch scrolling runs on the compositor, the tween ran on the
       main thread, and the gap between them showed up as the "still" image
       vibrating on every flick. See the .hero-photo rule in styles.css.

       All that's left for JS is telling the fixed photo where the hero is,
       and fading the copy. */
    const syncHeroBox = () => {
      hero.style.setProperty("--hero-top", `${hero.offsetTop}px`);
      hero.style.setProperty("--hero-h", `${hero.offsetHeight}px`);
    };
    syncHeroBox();
    // A ResizeObserver rather than a window resize listener, for two reasons.
    // It fires when the boxes genuinely change — including late settling from
    // fonts and image decode, which a one-off measurement at startup misses —
    // and it stays quiet while the mobile URL bar slides in and out, because
    // the hero is sized in svh and so doesn't actually move when that chrome
    // does. Re-measuring on every one of those resize events would put the
    // mid-scroll jump straight back. The navbar is observed too: it sits above
    // the hero in normal flow, so its height is the hero's top offset, and it
    // can rewrap without the hero's own height changing.
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(syncHeroBox);
      ro.observe(hero);
      const nav = $("#navbar");
      if (nav) ro.observe(nav);
    }
    // Belt and braces alongside the observer, which is delivered as part of
    // the rendering steps and so can't run in a tab that isn't being painted.
    // These are event-driven, cover the cases that actually move the hero, and
    // syncHeroBox is two style writes, so running it twice costs nothing.
    // The resize handler is deliberately gated on a real width change: on
    // mobile the URL bar sliding away fires resize continuously at a stable
    // width, and re-measuring mid-scroll is what the fixed photo exists to
    // avoid.
    window.addEventListener("load", syncHeroBox);
    window.addEventListener("orientationchange", syncHeroBox);
    let lastW = window.innerWidth;
    window.addEventListener("resize", () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      syncHeroBox();
    });

    // Copy fades out over the first two-thirds of the hero's travel, so it's
    // gone before the curtain closes rather than clipping mid-word at the
    // torn edge.
    gsap.to("#home .max-w-7xl", {
      autoAlpha: 0, y: -40, ease: "none",
      scrollTrigger: {
        trigger: hero, start: "top top", end: "66% top",
        scrub: true,
      },
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
    const chips = $$("#certifications .cert-logo-tile");
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
      // lerp is how much of the remaining distance the page covers each
      // frame — lower means more smoothing but more perceptible lag between
      // the wheel moving and the page moving. 0.09 read as floaty; 0.2 keeps
      // the smoothing without the delay.
      const lenis = new Lenis({ lerp: 0.2, smoothWheel: true });
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
