/* =========================================================================
   CLARTÉ OVERSEAS — Homepage interactions
   ========================================================================= */

/* ----------------------------------------------------------------------
   CONFIG — edit these values (placeholders for now)
   ---------------------------------------------------------------------- */
const CONFIG = {
  // Dummy WhatsApp link — replace 910000000000 with the real number (country code, no +)
  whatsapp: "https://wa.me/910000000000?text=Hi%20Clart%C3%A9%20Overseas%2C%20I%27d%20like%20a%20quote.",
};

document.addEventListener("DOMContentLoaded", () => {
  /* ---- WhatsApp links ------------------------------------------------- */
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.setAttribute("href", CONFIG.whatsapp);
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
  const open = () => menu.classList.remove("hidden-menu");
  const close = () => menu.classList.add("hidden-menu");
  document.getElementById("menuBtn").addEventListener("click", open);
  document.getElementById("menuClose").addEventListener("click", close);
  document.querySelectorAll(".mobile-link, #mobileMenu a").forEach((a) =>
    a.addEventListener("click", close)
  );

  /* ---- Placeholder nav links (dedicated pages come later) ------------ */
  document.querySelectorAll("[data-nolink]").forEach((el) =>
    el.addEventListener("click", (e) => e.preventDefault())
  );

  /* ---- Language picker (Google Translate) ---------------------------- */
  (function () {
    const readCookie = (n) => {
      const m = document.cookie.match(new RegExp("(?:^|; )" + n + "=([^;]*)"));
      return m ? decodeURIComponent(m[1]) : "";
    };
    const currentLang = () => {
      const parts = (readCookie("googtrans") || "").split("/"); // /en/<lang>
      return parts.length === 3 && parts[2] ? parts[2] : "en";
    };
    const setLabel = (lang) => {
      const item = document.querySelector('.lang-dd-item[data-lang="' + lang + '"]');
      const label = document.getElementById("langLabel");
      if (label) label.textContent = item ? item.getAttribute("data-short") || "EN" : "EN";
      document.querySelectorAll(".lang-dd-item").forEach((b) =>
        b.classList.toggle("active", b.getAttribute("data-lang") === lang)
      );
      const sel = document.getElementById("langSelect");
      if (sel) sel.value = lang;
    };
    const clearCookie = () => {
      const host = location.hostname;
      const exp = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "googtrans=; path=/" + exp;
      document.cookie = "googtrans=; path=/; domain=" + host + exp;
      document.cookie = "googtrans=; path=/; domain=." + host + exp;
    };
    const translateTo = (lang) => {
      if (!lang || lang === "en") {
        clearCookie();
        location.reload();
        return;
      }
      const host = location.hostname;
      const val = "/en/" + lang;
      document.cookie = "googtrans=" + val + "; path=/";
      try { document.cookie = "googtrans=" + val + "; path=/; domain=." + host; } catch (e) {}
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        combo.value = lang;
        combo.dispatchEvent(new Event("change"));
        setLabel(lang);
      } else {
        location.reload();
      }
    };
    document.querySelectorAll(".lang-dd-item").forEach((b) =>
      b.addEventListener("click", () => translateTo(b.getAttribute("data-lang")))
    );
    const sel = document.getElementById("langSelect");
    if (sel) sel.addEventListener("change", () => translateTo(sel.value));
    setLabel(currentLang());
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

  /* ---- Hero photo (online enhancement) ------------------------------- */
  const heroPhoto = document.querySelector(".hero-photo");
  if (heroPhoto && heroPhoto.dataset.src) {
    const img = new Image();
    img.onload = () => {
      heroPhoto.src = heroPhoto.dataset.src;
      heroPhoto.classList.add("loaded");
    };
    img.src = heroPhoto.dataset.src;
  }

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
    { name: "USA", lon: -98, lat: 39, origin: false, label: "below" },
    { name: "UK", lon: -2, lat: 54, origin: false, label: "above" },
    { name: "Europe", lon: 12, lat: 49, origin: false, label: "below" },
    { name: "UAE", lon: 54, lat: 24, origin: false, label: "below" },
    { name: "India", lon: 78, lat: 22, origin: true, label: "below" },
    { name: "Australia", lon: 134, lat: -25, origin: false, label: "below" },
  ];

  host.classList.add("map-wrap");

  // borderless terrain base (true equirectangular). If it fails to load,
  // the dotted brand panel (CSS) remains — pins stay accurate either way.
  const base = new Image();
  base.alt = "World map";
  base.className = "map-img";
  base.onload = () => base.classList.add("loaded");
  base.src =
    "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg";
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
    path.setAttribute("stroke", "rgba(255,77,79,.45)");
    path.setAttribute("stroke-width", "0.35");
    path.setAttribute("stroke-dasharray", "1.4 1.4");
    lines.appendChild(path);
  });
  host.appendChild(lines);

  // pins
  markets.forEach((m, i) => {
    const { x, y } = pos(m.lon, m.lat);
    const color = "#ff4d4f"; // vivid coral-red — high contrast on the terrain map
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
        <circle cx="12" cy="12" r="${r}" fill="${color}"></circle>
        <circle cx="12" cy="12" r="${r}" fill="none" stroke="#fff" stroke-width="1.4"></circle>
        <circle class="map-ping" cx="12" cy="12" r="${r}" fill="none" stroke="${color}" stroke-width="2" style="r:${r}"></circle>
      </svg>
      <span style="position:absolute;left:50%;${labelStyle};transform:translateX(-50%);
        font:700 11px Sora,sans-serif;color:${m.origin ? "#1f4693" : "#334155"};
        background:rgba(255,255,255,.85);padding:1px 6px;border-radius:6px;white-space:nowrap;">${m.name}</span>`;
    host.appendChild(pin);
  });
  // Pins + routes animate in via the .reveal wrapper around the map (see CSS).
}
