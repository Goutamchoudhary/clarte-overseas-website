/* V2 "Living Collage" — loaded only when the V2 site version is active
   (BaseLayout). Two jobs, both progressive: the server-rendered first frame is
   complete without this file.

   1. [data-v2-collage]: every few seconds each tile wipes (fades, on phones)
      to the next category — photo, name, count and link together.
   2. [data-v2-cycle]: bento tiles slowly cross-fade through their category's
      product photos.

   Both pause while hovered / focused / touched, while off-screen and while the
   tab is hidden, and never start for prefers-reduced-motion. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var COLLAGE_MS = 2600, STAGGER_MS = 240, CYCLE_MS = 4200;

  // Something that ticks only while its element is visible, the tab is
  // shown, and the user isn't interacting with it.
  function ticker(el, ms, step) {
    var visible = false, held = false, timer = null, holdT = null;
    function run() {
      stop();
      if (visible && !held && !document.hidden) timer = setInterval(step, ms);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function hold() { held = true; run(); }
    function release() { held = false; run(); }
    el.addEventListener("mouseenter", hold);
    el.addEventListener("mouseleave", release);
    el.addEventListener("focusin", hold);
    el.addEventListener("focusout", release);
    el.addEventListener("touchstart", function () {
      hold();
      clearTimeout(holdT);
      holdT = setTimeout(release, 6000);
    }, { passive: true });
    document.addEventListener("visibilitychange", run);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[es.length - 1].isIntersecting;
        run();
      }, { threshold: 0.25 }).observe(el);
    } else { visible = true; run(); }
  }

  // Swap the "next" layer in over the "current" one once its image is ready.
  function swap(cur, next, setSrc, after) {
    setSrc(next);
    var ready = next.decode ? next.decode() : Promise.resolve();
    // A photo that fails to load is skipped (the tile keeps its current one)
    // rather than wiping in as a broken image.
    ready.then(function () {
      next.classList.add("is-enter");
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        cur.classList.remove("is-cur");
        next.classList.remove("is-enter", "is-next");
        next.classList.add("is-cur");
        cur.classList.add("is-next");
        cur.removeAttribute("srcset");
        cur.removeAttribute("src");
        if (after) after();
      }
      next.addEventListener("transitionend", finish, { once: true });
      setTimeout(finish, 1400);
    }, function () {
      next.removeAttribute("srcset");
      next.removeAttribute("src");
    });
  }

  /* ---- 1 · rotating category tiles --------------------------------- */
  function collage(root) {
    var data;
    try { data = JSON.parse(root.querySelector("[data-v2-cats]").textContent); } catch (e) { return; }
    var n = data.length;
    var tiles = Array.prototype.slice.call(root.querySelectorAll("[data-v2-tile]"));
    if (!tiles.length || n < tiles.length * 2) return;
    var start = +root.getAttribute("data-start") || 0;
    var step = 0;
    // Translated names (i18n.js fills the hidden templates like any other text).
    function nameOf(href, fallback) {
      var t = root.querySelector('[data-v2-name="' + href + '"]');
      return (t && t.textContent.trim()) || fallback;
    }
    // Warm the cache for the upcoming photos after the page has loaded, one
    // request per category (sized like the largest tile), a few at a time.
    window.addEventListener("load", function () {
      var probe = tiles[0].querySelector(".is-cur");
      var queue = data.slice();
      function next() {
        var c = queue.shift();
        if (!c) return;
        var img = new Image();
        img.onload = img.onerror = next;
        img.sizes = (probe && probe.getAttribute("sizes")) || "";
        img.srcset = c.srcset;
        img.src = c.src;
      }
      setTimeout(function () { next(); next(); }, 800);
    }, { once: true });

    ticker(root, COLLAGE_MS, function () {
      step++;
      tiles.forEach(function (tile, t) {
        setTimeout(function () {
          var c = data[(start + step + t * 2) % n];
          var cur = tile.querySelector(".v2-tile-img.is-cur");
          var next = tile.querySelector(".v2-tile-img.is-next");
          if (!cur || !next) return;
          swap(cur, next, function (img) {
            img.setAttribute("srcset", c.srcset);
            img.setAttribute("src", c.src);
          });
          tile.href = c.href;
          var name = nameOf(c.href, c.name);
          tile.setAttribute("aria-label", name);
          var label = tile.querySelector(".v2-tile-label");
          label.classList.add("is-swapping");
          setTimeout(function () {
            var nm = tile.querySelector(".v2-tile-name");
            nm.textContent = name;
            nm.setAttribute("data-i18n", c.i18n);
            tile.querySelector("[data-v2-count]").textContent = c.count;
            label.classList.remove("is-swapping");
          }, 260);
        }, t * STAGGER_MS);
      });
    });
  }

  /* ---- 2 · product photos cycling inside bento tiles --------------- */
  function cycle(tile, k) {
    var frames;
    try { frames = JSON.parse(tile.getAttribute("data-v2-cycle")); } catch (e) { return; }
    var first = tile.querySelector(".v2-bento-img.is-cur");
    if (!frames.length || !first) return;
    var all = [{ src: first.getAttribute("src"), srcset: first.getAttribute("srcset") }].concat(
      frames.map(function (f) { return { src: f, srcset: null }; })
    );
    var i = 0;
    // Stagger tiles so they don't all change at once.
    setTimeout(function () {
      ticker(tile, CYCLE_MS, function () {
        i = (i + 1) % all.length;
        var cur = tile.querySelector(".v2-bento-img.is-cur");
        var next = tile.querySelector(".v2-bento-img.is-next");
        if (!cur || !next) return;
        swap(cur, next, function (img) {
          if (all[i].srcset) img.setAttribute("srcset", all[i].srcset); else img.removeAttribute("srcset");
          img.setAttribute("src", all[i].src);
        });
      });
    }, 700 * k);
  }

  function init() {
    document.querySelectorAll("[data-v2-collage]").forEach(collage);
    document.querySelectorAll("[data-v2-cycle]").forEach(cycle);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
