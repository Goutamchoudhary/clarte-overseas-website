/* Home page "The Journey": plays the falling items once when they scroll into
   view, and parts the hero words on scroll (desktop). The page is complete
   without this file. */
(function () {
  "use strict";
  var root = document.documentElement;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var plays = document.querySelectorAll("[data-j-play]");

  // The full-screen hero is sized from the navbar's real height (it can wrap).
  function syncNav() {
    var nav = document.getElementById("navbar");
    if (nav) root.style.setProperty("--nav-h", nav.offsetHeight + "px");
  }
  syncNav();
  window.addEventListener("resize", syncNav);
  // Navbar: out of the way while reading down the page, back the moment the
  // visitor scrolls up, and always shown at the very top.
  (function () {
    var nav = document.getElementById("navbar");
    if (!nav) return;
    var last = window.scrollY, ticking = false;
    function busy() {
      var menu = document.getElementById("mobileMenu");
      return nav.matches(":hover") || nav.querySelector(".lang-dd.open") || (menu && !menu.classList.contains("hidden-menu"));
    }
    function update() {
      ticking = false;
      var y = window.scrollY, dy = y - last;
      if (y <= nav.offsetHeight) { nav.classList.remove("nav-away"); last = y; return; }
      if (Math.abs(dy) < 6) return;
      if (dy < 0) nav.classList.remove("nav-away");
      else if (!busy()) nav.classList.add("nav-away");
      last = y;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  })();

  // The range's lifted shadow only appears once scrolling starts, so nothing
  // of the next section shows on the first screen.
  function lifted() { root.classList.toggle("j-scrolled", window.scrollY > 4); }
  lifted();
  window.addEventListener("scroll", lifted, { passive: true });

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

  // Three product photos per category, shuffling through the whole category.
  function shuffle(root) {
    var items, tiles = root.querySelectorAll("[data-j-sh]");
    try { items = JSON.parse(root.querySelector("[data-j-items]").textContent); } catch (e) { return; }
    var n = items.length, gap = +root.getAttribute("data-step") || 1, step = 0, visible = false, held = false;
    function tick() {
      if (!visible || held || document.hidden) return;
      step++;
      tiles.forEach(function (tile, t) {
        setTimeout(function () {
          var k = (step + t * gap) % n, item = items[k];
          var cur = tile.querySelector(".is-cur"), next = tile.querySelector(".is-next"), label = tile.querySelector(".j-sh-name");
          if (!cur || !next) return;
          if (item.srcset) next.setAttribute("srcset", item.srcset); else next.removeAttribute("srcset");
          next.setAttribute("src", item.src);
          (next.decode ? next.decode() : Promise.resolve()).then(function () {
            next.classList.add("is-enter");
            label.classList.add("is-swap");
            setTimeout(function () {
              var nm = (window.i18n && window.i18n.t(item.key)) || item.name;
              label.textContent = nm;
              label.setAttribute("data-i18n", item.key);
              tile.href = item.href;
              tile.setAttribute("aria-label", nm);
              label.classList.remove("is-swap");
            }, 280);
            setTimeout(function () {
              cur.className = "j-sh-img is-next";
              cur.removeAttribute("src"); cur.removeAttribute("srcset");
              next.className = "j-sh-img is-cur";
            }, 950);
          }, function () { next.removeAttribute("src"); next.removeAttribute("srcset"); });
        }, t * 260);
      });
    }
    root.addEventListener("mouseenter", function () { held = true; });
    root.addEventListener("mouseleave", function () { held = false; });
    root.addEventListener("focusin", function () { held = true; });
    root.addEventListener("focusout", function () { held = false; });
    new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting; }, { threshold: 0.3 }).observe(root);
    setInterval(tick, 2800);
  }
  document.querySelectorAll("[data-j-shuffle]").forEach(shuffle);

  // Stage by Stage: a route drawn through the stops, with the container riding it.
  function journey() {
    var sec = document.querySelector("[data-opt]");
    if (!sec || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var route = sec.querySelector("[data-route]"), view = sec.querySelector(".j-cam-view");
    var stops = Array.prototype.slice.call(sec.querySelectorAll("[data-stop]"));
    var pins = stops.map(function (s) { return s.querySelector("[data-pin]"); });
    var svg = route.querySelector(".j-route-svg"), base = svg.querySelector(".j-route-base"), live = svg.querySelector(".j-route-live");
    var rider = route.querySelector(".j-rider"), riderIn = rider.querySelector(".j-rider-set");
    var forms = rider.querySelectorAll("[data-form]"), pulse = rider.querySelector(".j-rider-pulse"), formNow = -1;
    // Which form the goods take once each stop is reached: cartons for stops
    // 1-3, packed at 4, on the truck at 5, craned aboard at 6, the ship last.
    var formAt = [0, 0, 0, 1, 2, 3, 4];
    function setForm(n) {
      if (n === formNow) return;
      var first = formNow < 0;
      formNow = n;
      forms.forEach(function (f, i) { f.classList.toggle("now", i === n); });
      if (!first && pulse.animate) pulse.animate([{ transform: "scale(.5)", opacity: 0.9 }, { transform: "scale(1.5)", opacity: 0 }], { duration: 620, easing: "ease-out" });
    }
    var cam = route.hasAttribute("data-cam") && window.innerWidth >= 1024;
    var total = 0, marks = [], shipAt = 1, trigger;
    if (cam) sec.classList.add("j-cam-live");
    root.classList.add("j-route-on");

    function draw() {
      var box = route.getBoundingClientRect();
      var pts = pins.map(function (p) { var r = p.getBoundingClientRect(); return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]; });
      var d = "M" + pts[0][0] + " " + pts[0][1], segs = [d];
      for (var i = 0; i < pts.length - 1; i++) {
        var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += " C" + (p1[0] + (p2[0] - p0[0]) / 5) + " " + (p1[1] + (p2[1] - p0[1]) / 5) + " " + (p2[0] - (p3[0] - p1[0]) / 5) + " " + (p2[1] - (p3[1] - p1[1]) / 5) + " " + p2[0] + " " + p2[1];
        segs.push(d);
      }
      base.setAttribute("d", d); live.setAttribute("d", d);
      total = live.getTotalLength();
      live.style.strokeDasharray = total;
      var probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      marks = segs.map(function (s) { probe.setAttribute("d", s); return probe.getTotalLength() / total; });
      // Desktop: where the route last touches the stop 6 card is where the ship takes
      // over. Phones stack the cards, so that point is almost the end; use mid-leg.
      var card = stops[5].getBoundingClientRect(), from = marks[5] * total, to = marks[6] * total, last = -1;
      for (var l = from; l <= to; l += 4) {
        var q = live.getPointAtLength(l), x = q.x + box.left, y = q.y + box.top;
        if (x >= card.left && x <= card.right && y >= card.top && y <= card.bottom) last = l;
      }
      shipAt = !cam || last < 0 ? (marks[5] + marks[6]) / 2 : last / total;
    }
    function show(p) {
      live.style.strokeDashoffset = total * (1 - p);
      var at = live.getPointAtLength(total * p), next = live.getPointAtLength(Math.min(total, total * p + 5));
      var w = rider.offsetWidth, h = rider.offsetHeight;
      var dx = next.x - at.x, tilt = Math.max(-9, Math.min(9, Math.atan2(next.y - at.y, Math.abs(dx) + 0.01) * 57.3 * (dx < 0 ? -1 : 1)));
      rider.style.transform = "translate(" + (at.x - w / 2) + "px," + (at.y - h * 0.55) + "px)";
      riderIn.style.transform = "rotate(" + tilt + "deg)";
      var reached = 0;
      stops.forEach(function (s, i) { var hit = p >= marks[i] - 0.012; s.classList.toggle("on", hit); if (hit) reached = i; });
      // The crane stays until it has left the stop 6 card behind; then the ship sails on.
      if (p >= shipAt) reached = 6;
      setForm(formAt[reached]);
      rider.classList.toggle("back", dx < -0.2);
      if (cam) {
        var vw = view.clientWidth, vh = view.clientHeight;
        gsap.set(route, { x: Math.min(0, Math.max(vw - route.offsetWidth, vw / 2 - at.x)), y: Math.min(0, Math.max(vh - route.offsetHeight, vh / 2 - at.y - 130)) });
      }
    }
    draw();
    show(0);
    trigger = cam
      ? ScrollTrigger.create({ trigger: view, pin: true, start: "top top", end: "+=" + stops.length * 115 + "%", scrub: 0.6, anticipatePin: 1, onUpdate: function (s) { show(s.progress); } })
      : ScrollTrigger.create({ trigger: route, start: "top 62%", end: "bottom 78%", scrub: 0.5, onUpdate: function (s) { show(s.progress); } });
    function redraw() { if (cam) gsap.set(route, { x: 0, y: 0 }); draw(); ScrollTrigger.refresh(); show(trigger.progress); }
    window.addEventListener("load", redraw, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(redraw, 200); });
  }
  // Waits for DOMContentLoaded: GSAP is deferred later in the document on this page.
  if (document.querySelector("[data-opt]")) document.addEventListener("DOMContentLoaded", journey, { once: true });

  // As the product range slides over the hero, the hero recedes; on desktop the
  // three words also drift apart.
  function partWords() {
    var hero = document.getElementById("home"), grid = document.querySelector(".j-hero-grid");
    if (!window.gsap || !window.ScrollTrigger || !grid || !document.querySelector(".j-curtain")) return;
    var tl = gsap.timeline({ scrollTrigger: { start: 0, end: function () { return hero.offsetHeight; }, scrub: 0.5, invalidateOnRefresh: true } });
    tl.to(grid, { scale: 0.93, autoAlpha: 0.2, ease: "none" }, 0);
    if (window.innerWidth >= 1024) {
      var offset = [-90, 90, -50];
      document.querySelectorAll(".j-w").forEach(function (w, i) { tl.to(w, { x: offset[i], ease: "none" }, 0); });
    }
  }
  if (document.readyState === "complete") partWords();
  else window.addEventListener("load", partWords, { once: true });
})();

/* Premium touches (Nov 2026): count-up figures, a sliding navbar highlight,
   cursor-following glow on category cards and smooth FAQ open/close. Each is
   an enhancement only — the page reads the same without it, and all of them
   stay off when the visitor asks for reduced motion. */
(function () {
  "use strict";
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) return;
  var finePointer = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;

  // 1. Numbers inside [data-countup] count up from zero the first time the
  //    element scrolls into view. Works on whatever language is showing.
  var countEls = document.querySelectorAll("[data-countup]");
  if (countEls.length && "IntersectionObserver" in window) {
    var run = function (el) {
      var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [], n;
      while ((n = walker.nextNode())) if (/\d/.test(n.nodeValue)) nodes.push(n);
      var spans = [];
      nodes.forEach(function (node) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\d+)/).forEach(function (part) {
          if (/^\d+$/.test(part)) {
            var s = document.createElement("span");
            s.className = "cu"; s.textContent = "0"; s.setAttribute("data-n", part);
            frag.appendChild(s); spans.push(s);
          } else if (part) frag.appendChild(document.createTextNode(part));
        });
        node.parentNode.replaceChild(frag, node);
      });
      var t0 = performance.now(), dur = 1300;
      (function step(now) {
        var p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        spans.forEach(function (s) { s.textContent = Math.round(+s.getAttribute("data-n") * e); });
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    };
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { cio.unobserve(e.target); run(e.target); } });
    }, { threshold: 0.7 });
    countEls.forEach(function (el) { cio.observe(el); });
  }

  // 2. Navbar: a soft pill slides to the hovered link and rests on the
  //    current page's link.
  var links = document.querySelector("#navbar .nav-links");
  if (links && finePointer) {
    var pill = document.createElement("span");
    pill.className = "nav-pill"; pill.setAttribute("aria-hidden", "true");
    links.insertBefore(pill, links.firstChild);
    var items = Array.prototype.slice.call(links.querySelectorAll(":scope > .nav-link, :scope > .nav-dd > .nav-link"));
    var place = function (a, instant) {
      if (!a) { pill.style.opacity = "0"; return; }
      var box = links.getBoundingClientRect(), r = a.getBoundingClientRect();
      if (instant) pill.style.transition = "none";
      pill.style.width = r.width + 24 + "px";
      pill.style.transform = "translate(" + (r.left - box.left - 12) + "px,-50%)";
      pill.style.opacity = "1";
      if (instant) { pill.offsetWidth; pill.style.transition = ""; }
    };
    var current = function () { return links.querySelector(".nav-link.active"); };
    links.classList.add("has-pill");
    var settle = function () { place(current(), true); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle); else settle();
    window.addEventListener("resize", settle);
    items.forEach(function (a) { a.addEventListener("mouseenter", function () { place(a); }); });
    links.addEventListener("mouseleave", function () { place(current()); });
  }

  // 3. Category product cards: a glow on the border follows the cursor.
  if (finePointer) {
    document.querySelectorAll(".j-cat-list .prod-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--gx", e.clientX - r.left + "px");
        card.style.setProperty("--gy", e.clientY - r.top + "px");
      });
    });
  }

  // 4. FAQs open and close smoothly instead of snapping.
  document.querySelectorAll("details.faq-item").forEach(function (d) {
    var sum = d.querySelector("summary");
    if (!sum) return;
    var anim = null;
    var animate = function (from, to, opening) {
      d.style.overflow = "hidden";
      if (anim) anim.cancel();
      anim = d.animate({ height: [from + "px", to + "px"] }, { duration: opening ? 320 : 260, easing: "cubic-bezier(.22,.61,.36,1)" });
      anim.onfinish = function () {
        anim = null; d.style.height = ""; d.style.overflow = "";
        if (!opening) d.open = false;
      };
      anim.oncancel = function () { anim = null; };
    };
    sum.addEventListener("click", function (e) {
      e.preventDefault();
      var start = d.offsetHeight;
      if (!d.open || d.classList.contains("faq-closing")) {
        d.classList.remove("faq-closing");
        d.open = true;
        animate(start, d.offsetHeight, true);
      } else {
        d.classList.add("faq-closing");
        animate(start, sum.offsetHeight + (d.offsetHeight - d.clientHeight), false);
        var done = function () { d.classList.remove("faq-closing"); };
        setTimeout(done, 300);
      }
    });
  });
})();
