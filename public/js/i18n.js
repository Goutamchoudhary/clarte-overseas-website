/* =========================================================================
   CLARTÉ OVERSEAS — Client-side JSON i18n
   No URL changes. English is default (indexed). French swaps text via JS.
   ========================================================================= */
(function () {
  "use strict";

  const STORAGE_KEY = "site-lang";
  let _originals = null; // Map<element, {textContent|innerHTML|placeholder}>
  let _strings = null;   // last-loaded translations object (null when English)

  /* Save originals from data-i18n, data-i18n-html, data-i18n-ph */
  function saveOriginals() {
    if (_originals) return;
    _originals = new Map();
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      _originals.set(el, { type: "text", val: el.textContent });
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      _originals.set(el, { type: "html", val: el.innerHTML });
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      _originals.set(el, { type: "ph", val: el.getAttribute("placeholder") });
    });
  }

  /* Restore a single element to its saved English original */
  function restoreOne(el) {
    if (!_originals || !_originals.has(el)) return;
    const o = _originals.get(el);
    if (o.type === "text") el.textContent = o.val;
    else if (o.type === "html") el.innerHTML = o.val;
    else if (o.type === "ph") el.setAttribute("placeholder", o.val);
  }

  /* Apply a translations object to the DOM. Any key missing from the
     supplied strings falls back to the element's English original. */
  function applyTranslations(strings) {
    _strings = strings;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (strings[key] !== undefined) el.textContent = strings[key];
      else restoreOne(el);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (strings[key] !== undefined) el.innerHTML = strings[key];
      else restoreOne(el);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      if (strings[key] !== undefined) el.setAttribute("placeholder", strings[key]);
      else restoreOne(el);
    });
  }

  /* Restore English originals */
  function restoreOriginals() {
    _strings = null;
    if (!_originals) return;
    _originals.forEach((orig, el) => {
      if (!document.contains(el)) return;
      if (orig.type === "text") el.textContent = orig.val;
      else if (orig.type === "html") el.innerHTML = orig.val;
      else if (orig.type === "ph") el.setAttribute("placeholder", orig.val);
    });
  }

  /* Fetch a JSON file and apply it */
  function fetchAndApply(lang, callback) {
    fetch("/i18n/" + lang + ".json?v=" + (window._i18nBust || "1"))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        applyTranslations(data);
        document.dispatchEvent(new CustomEvent("i18nApplied", { detail: { lang: lang } }));
        if (callback) callback();
      })
      .catch(function (e) {
        // No translation file (or it failed to parse): fall back to English
        // so the page never shows a half-translated or stale state.
        console.warn("[i18n] Failed to load", lang, "— falling back to English", e);
        restoreOriginals();
        document.dispatchEvent(new CustomEvent("i18nApplied", { detail: { lang: "en" } }));
        if (callback) callback();
      });
  }

  /* Update the navbar flag/label (hook into existing setLabel in script.js) */
  function updateNavLabel(lang) {
    // script.js exposes setLabel via the lang-dd-item buttons
    const item = document.querySelector('.lang-dd-item[data-lang="' + lang + '"]');
    const label = document.getElementById("langLabel");
    const flagEl = document.getElementById("langFlag");
    const globeEl = document.getElementById("langGlobe");
    const isNonDefault = lang && lang !== "en";
    if (label) label.textContent = item ? (item.getAttribute("data-short") || "EN") : "EN";
    const flag = item ? (item.querySelector(".lang-flag") || {}).textContent : null;
    if (flagEl) {
      flagEl.textContent = flag || "🌐";
      flagEl.classList.toggle("hidden", !isNonDefault);
    }
    if (globeEl) globeEl.classList.toggle("hidden", isNonDefault);
    document.querySelectorAll(".lang-dd-item").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    const sel = document.getElementById("langSelect");
    if (sel) sel.value = lang;
  }

  /* Public API */
  function setLang(lang) {
    saveOriginals();
    localStorage.setItem(STORAGE_KEY, lang);
    if (!lang || lang === "en") {
      restoreOriginals();
      // Notify dynamic widgets (e.g. Incoterms explorer) so they re-render
      // their English fallback — restoreOriginals only resets [data-i18n] nodes.
      document.dispatchEvent(new CustomEvent("i18nApplied", { detail: { lang: "en" } }));
    } else {
      fetchAndApply(lang);
    }
    updateNavLabel(lang);
  }

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || "en";
  }

  /* Look up a single translated string for the active language.
     Returns undefined when English (default) or when the key is missing,
     so callers can fall back to their own English text. */
  function t(key) {
    return _strings ? _strings[key] : undefined;
  }

  window.i18n = { setLang: setLang, getLang: getLang, t: t };

  /* On DOMContentLoaded: save originals, then apply saved language if not English */
  function init() {
    saveOriginals();
    const saved = getLang();
    if (saved && saved !== "en") {
      fetchAndApply(saved, function () { updateNavLabel(saved); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
