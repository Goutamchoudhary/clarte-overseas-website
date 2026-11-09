/* Home page "The Journey": plays the falling items once when they scroll into
   view, and parts the hero words on scroll (desktop). The page is complete
   without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var plays = document.querySelectorAll("[data-j-play]");

  // Translated hero words can be longer than the English ones: shrink all
  // three together so the longest always fits its column.
  function fitWords() {
    var box = document.querySelector("[data-j-words]");
    if (!box) return;
    var words = box.querySelectorAll(".j-w");
    words.forEach(function (w) { w.style.fontSize = ""; });
    var size = parseFloat(getComputedStyle(words[0]).fontSize), scale = 1, range = document.createRange(), room = box.clientWidth;
    words.forEach(function (w) {
      range.selectNodeContents(w);
      var text = range.getBoundingClientRect().width, pad = parseFloat(getComputedStyle(w).paddingLeft);
      if (text > 0) scale = Math.min(scale, (room - pad) / text);
    });
    if (scale < 1) words.forEach(function (w) { w.style.fontSize = Math.floor(size * scale * 0.98) + "px"; });
  }
  var wordBox = document.querySelector("[data-j-words]");
  if (wordBox) {
    fitWords();
    new MutationObserver(fitWords).observe(wordBox, { subtree: true, childList: true, characterData: true });
    window.addEventListener("resize", fitWords);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWords);
  }
  if (still || !("IntersectionObserver" in window)) return;

  root.classList.add("j-armed");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  plays.forEach(function (el) { io.observe(el); });

  function partWords() {
    if (!window.gsap || !window.ScrollTrigger || window.innerWidth < 1024 || !document.querySelector(".j-w")) return;
    var hero = document.getElementById("home");
    var offset = [-90, 90, -50];
    document.querySelectorAll(".j-w").forEach(function (w, i) {
      gsap.to(w, { x: offset[i], ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } });
    });
  }
  if (document.readyState === "complete") partWords();
  else window.addEventListener("load", partWords, { once: true });
})();
