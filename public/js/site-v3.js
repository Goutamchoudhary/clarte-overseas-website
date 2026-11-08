/* Home page "The Journey": plays the falling items once when they scroll into
   view, and parts the hero words on scroll (desktop). The page is complete
   without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var plays = document.querySelectorAll("[data-j-play]");
  if (still || !("IntersectionObserver" in window)) return;

  root.classList.add("j-armed");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.25 });
  plays.forEach(function (el) { io.observe(el); });

  function partWords() {
    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024) return;
    var hero = document.getElementById("home");
    var offset = [-90, 90, -50];
    document.querySelectorAll(".j-w").forEach(function (w, i) {
      gsap.to(w, { x: offset[i], ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
    });
  }
  if (document.readyState === "complete") partWords();
  else window.addEventListener("load", partWords, { once: true });
})();
