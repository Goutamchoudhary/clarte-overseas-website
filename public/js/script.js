/* =========================================================================
   CLARTÉ OVERSEAS — Homepage interactions
   ========================================================================= */

/* ----------------------------------------------------------------------
   CONFIG
   ---------------------------------------------------------------------- */
const WA_NUMBER = "919818915310"; // India country code + number, no +
const WA_DEFAULT = "Hi Clarté Overseas, I'd like to know more about your products.";

document.addEventListener("DOMContentLoaded", () => {
  /* ---- WhatsApp links (per-CTA pre-filled messages) ------------------- */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    let msg = el.dataset.waMsg || WA_DEFAULT;
    const product = el.dataset.waProduct;
    if (product) msg = msg.replace("{product}", product);
    el.setAttribute("href", `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---- Year ----------------------------------------------------------- */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- Navbar: solid on scroll --------------------------------------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
    document.getElementById("toTop").classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---------------------------------------------------- */
  const menu = document.getElementById("mobileMenu");
  const catToggle = document.getElementById("mobileCatToggle");
  const catList = document.getElementById("mobileCatList");
  const catNav = catList ? catList.closest("nav") : null;
  const collapseCats = () => {
    if (!catToggle || !catList) return;
    catToggle.setAttribute("aria-expanded", "false");
    catList.classList.remove("open");
    if (catNav) catNav.classList.remove("cats-open");
  };
  const open = () => menu.classList.remove("hidden-menu");
  const close = () => {
    menu.classList.add("hidden-menu");
    // Reset Products back to collapsed so it doesn't reopen pre-expanded
    // (and pushing Home off-screen again) next time the menu is opened.
    collapseCats();
  };
  document.getElementById("menuBtn").addEventListener("click", open);
  document.getElementById("menuClose").addEventListener("click", close);
  document.querySelectorAll(".mobile-link, #mobileMenu a").forEach((a) =>
    a.addEventListener("click", close)
  );
  if (catToggle && catList) {
    catToggle.addEventListener("click", () => {
      const expanded = catToggle.getAttribute("aria-expanded") === "true";
      catToggle.setAttribute("aria-expanded", String(!expanded));
      catList.classList.toggle("open", !expanded);
      // Expanding the list can make the menu's content taller than its box
      // on shorter screens — switch that one state to a top-aligned,
      // scrollable nav so nothing goes behind the header, instead of
      // letting the centered layout overflow upward. Collapsed (the
      // default) stays exactly as it was: centered, no scroll.
      if (catNav) catNav.classList.toggle("cats-open", !expanded);
    });
  }

  /* ---- Placeholder nav links (dedicated pages come later) ------------ */
  document.querySelectorAll("[data-nolink]").forEach((el) =>
    el.addEventListener("click", (e) => e.preventDefault())
  );

  /* ---- Language picker (JSON i18n — no reload) ----------------------- */
  (function () {
    const dd = document.querySelector(".lang-dd");
    const btn = document.getElementById("langBtn");
    const closeDD = () => dd && dd.classList.remove("open");

    // Hint that points at the language selector (shown on each home visit)
    const hint = document.getElementById("langHint");
    const dismissHint = () => { if (hint) hint.hidden = true; };

    if (btn) btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissHint();
      dd && dd.classList.toggle("open");
    });
    document.addEventListener("click", closeDD);

    // Wire up desktop dropdown buttons
    document.querySelectorAll(".lang-dd-item").forEach((b) =>
      b.addEventListener("click", () => {
        const lang = b.getAttribute("data-lang");
        if (window.i18n) window.i18n.setLang(lang);
        dismissHint();
        closeDD();
      })
    );
    // Wire up mobile select
    const sel = document.getElementById("langSelect");
    if (sel) sel.addEventListener("change", () => {
      if (window.i18n) window.i18n.setLang(sel.value);
    });
    // Sync label/flag on load from saved preference (i18n.js also calls this,
    // but script.js runs after DOMContentLoaded so we refresh to be safe)
    const saved = (window.i18n && window.i18n.getLang()) || localStorage.getItem("site-lang") || "en";
    const item = document.querySelector('.lang-dd-item[data-lang="' + saved + '"]');
    const label = document.getElementById("langLabel");
    const flagEl = document.getElementById("langFlag");
    const globeEl = document.getElementById("langGlobe");
    const isNonDefault = saved && saved !== "en";
    if (label) label.textContent = item ? (item.getAttribute("data-short") || "EN") : "EN";
    const flag = item ? (item.querySelector(".lang-flag") || {}).textContent : null;
    if (flagEl) { flagEl.textContent = flag || "🌐"; flagEl.classList.toggle("hidden", !isNonDefault); }
    if (globeEl) globeEl.classList.toggle("hidden", isNonDefault);
    document.querySelectorAll(".lang-dd-item").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-lang") === saved)
    );
    if (sel) sel.value = saved;

    // Show the "choose your language" hint on the home page, only while the
    // visitor is still on the default language and hasn't dismissed it this
    // session. Auto-hides after a few seconds.
    (function () {
      if (!hint) return;
      const onHome = location.pathname === "/" || location.pathname === "/index.html";
      if (!onHome || saved !== "en") return;

      const closeBtn = document.getElementById("langHintClose");
      if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); dismissHint(); });

      setTimeout(() => { hint.hidden = false; }, 900);
      setTimeout(dismissHint, 8000);
    })();
  })();

  /* ---- Scroll-to-top -------------------------------------------------- */
  document.getElementById("toTop").addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---- Scroll reveal -------------------------------------------------- */
  const revealer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

  /* ---- Image placeholders: load real photo, fall back to gradient ---- */
  document.querySelectorAll(".img-ph").forEach((ph) => {
    const emoji = ph.dataset.emoji || "🌿";
    const span = document.createElement("span");
    span.className = "emoji";
    span.textContent = emoji;
    ph.appendChild(span);

    const src = ph.dataset.img;
    if (src) {
      const img = new Image();
      img.alt = "";
      img.onload = () => {
        ph.appendChild(img);
        requestAnimationFrame(() => img.classList.add("loaded"));
      };
      img.onerror = () => {}; // keep gradient + emoji
      img.src = src;
    }
  });

  /* Hero photo now loads eagerly via a plain <img src> with an inline
     onload handler (see index.astro) so the browser's preload scanner can
     fetch it immediately instead of waiting on this script — no JS needed
     here any more. */

  /* ---- Animated stat counters ---------------------------------------- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));

  /* ---- Portfolio filter ---------------------------------------------- */
  const filters = document.getElementById("portfolioFilters");
  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-tab");
      if (!btn) return;
      filters.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll(".portfolio-item").forEach((item) => {
        const show = f === "all" || item.dataset.cat === f;
        item.style.display = show ? "" : "none";
      });
    });
  }

  /* ---- World map ------------------------------------------------------ */
  buildWorldMap();
});

/* ----------------------------------------------------------------------
   World map: equirectangular base image + pulsing market pins.
   Falls back to a soft dotted panel if the base image is unavailable.
   ---------------------------------------------------------------------- */
function buildWorldMap() {
  const host = document.getElementById("worldMap");
  if (!host) return;

  // lon/lat -> percentage on an equirectangular map
  const pos = (lon, lat) => ({
    x: ((lon + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  });

  // accurate lon/lat on a full-extent equirectangular (plate carrée) map
  const markets = [
    { name: "United States", flag: "🇺🇸", lon: -98, lat: 39, origin: false, label: "below" },
    { name: "United Kingdom", flag: "🇬🇧", lon: -2, lat: 54, origin: false, label: "above" },
    { name: "UAE", flag: "🇦🇪", lon: 54, lat: 24, origin: false, label: "below" },
    { name: "India", flag: "🇮🇳", lon: 78, lat: 22, origin: true, label: "above" },
    { name: "Australia", flag: "🇦🇺", lon: 134, lat: -25, origin: false, label: "below" },
    { name: "South East Asia", flag: "🌏", lon: 108, lat: 14, origin: false, label: "below" },
  ];

  host.classList.add("map-wrap");

  // borderless terrain base (true equirectangular), self-hosted — this used
  // to be fetched from upload.wikimedia.org, which is blocked outright in
  // some countries and slow to reach from many more. If it fails to load,
  // the dotted brand panel (CSS) remains — pins stay accurate either way.
  const base = new Image();
  base.alt = "World map";
  base.className = "map-img";
  base.onload = () => base.classList.add("loaded");
  base.src = "/assets/img/misc/world-map.webp";
  host.appendChild(base);

  // connecting lines from India (origin) to each market — subtle, modern
  const svgNS = "http://www.w3.org/2000/svg";
  const lines = document.createElementNS(svgNS, "svg");
  lines.setAttribute("viewBox", "0 0 100 50");
  lines.setAttribute("preserveAspectRatio", "none");
  lines.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;";
  lines.setAttribute("class", "map-route");
  const O = pos(78, 22); // India origin
  const ox = O.x, oy = O.y / 2; // viewBox is 100 x 50 → y is halved
  markets.filter((m) => !m.origin).forEach((m) => {
    const p = pos(m.lon, m.lat);
    const px = p.x, py = p.y / 2;
    const midX = (ox + px) / 2;
    const midY = Math.min(oy, py) - 6; // arc upward
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", `M ${ox} ${oy} Q ${midX} ${midY} ${px} ${py}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(224,162,52,.6)");
    path.setAttribute("stroke-width", "0.35");
    path.setAttribute("stroke-dasharray", "1.4 1.4");
    lines.appendChild(path);
  });
  host.appendChild(lines);

  // pins
  markets.forEach((m, i) => {
    const { x, y } = pos(m.lon, m.lat);
    // India (origin) = brand gold; destinations = brand blue
    const color = m.origin ? "#e0a234" : "#1f4693";
    const r = m.origin ? 5 : 4;
    const pin = document.createElement("div");
    pin.title = m.name;
    pin.className = "map-pin";
    pin.style.cssText = `position:absolute;left:${x}%;top:${y}%;z-index:2;transition-delay:${i * 90}ms;`;
    const labelStyle =
      m.label === "above"
        ? "bottom:135%"
        : "top:135%";
    pin.innerHTML = `
      <svg width="${r * 5}" height="${r * 5}" viewBox="0 0 24 24" style="overflow:visible;display:block">
        <circle cx="12" cy="12" r="${r + 1.3}" fill="#fff"></circle>
        <circle cx="12" cy="12" r="${r}" fill="${color}"></circle>
        <circle class="map-ping" cx="12" cy="12" r="${r}" fill="none" stroke="${color}" stroke-width="2" style="r:${r}"></circle>
      </svg>
      <span style="position:absolute;left:50%;${labelStyle};transform:translateX(-50%);
        display:inline-flex;align-items:center;gap:3px;
        font:700 11px Sora,sans-serif;color:${m.origin ? "#1f4693" : "#334155"};
        background:rgba(255,255,255,.92);padding:2px 7px;border-radius:7px;white-space:nowrap;
        box-shadow:0 4px 10px -4px rgba(13,26,54,.35);"><span style="font-size:12px;line-height:1">${m.flag}</span>${m.name}</span>`;
    host.appendChild(pin);
  });
  // Pins + routes animate in via the .reveal wrapper around the map (see CSS).
}
