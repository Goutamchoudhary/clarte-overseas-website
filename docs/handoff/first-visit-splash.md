# First-visit splash screen ("Harvest sets sail")

Status: **live on production** (clarteoverseas.com), as of commit `6a6d3a4`.

## Goal

Add a branded loading screen that plays the Clarté Overseas logo ("ship +
growth bars" mark, built from `/favicon.svg`) once per browsing session, then
crossfades into the real page — without slowing the site down, hurting SEO,
or flashing on every subsequent page view on a multi-page site.

## Decisions made, and why

- **Built from `/favicon.svg`'s own paths**, regrouped into semantic parts
  (wave, hull, smoke, mast/bob group, 7 containers, 8 growth bars), rather
  than a new asset. One inline `<svg>`, no new network request, can't become
  a separate LCP candidate.
- **Wordmark is also inline SVG** (vector-traced from
  `/assets/logo/logo-horizontal.svg`), not a PNG. An earlier version used a
  PNG (`public/assets/logo/wordmark.png`); it was replaced and the PNG
  deleted so the wordmark matches the icon's weight/sharpness exactly and
  needs no extra request.
- **Exit condition is "last of two wins, no fixed delay":** the tallest
  growth bar's CSS animation (`cs-rise-final`) firing `animationend`, AND
  `window.load`. Whichever finishes last triggers the exit immediately. A
  15s `setTimeout` backstop guarantees it always leaves even if something
  hangs.
- **Exit is opacity/transform only** (scale to 1.05 + fade over 0.3s for the
  mark/text, a 0.55s veil fade with `cubic-bezier(.4,0,.2,1)`), so it stays
  smooth even while third-party scripts are busy on the main thread.
- **First page of the browsing session only**, via a `sessionStorage` flag
  (`clarte_splash_seen`) checked by an inline script at the very top of
  `<head>` — before first paint, so later page navigations never flash it.
  **Deliberate exception:** a browser **refresh** always replays the splash
  (reads as "a fresh start"), detected via the Navigation Timing API
  (`performance.getEntriesByType("navigation")[0].type === "reload"`).
- **`document.hidden` is intentionally ignored.** A new tab opened in the
  background reports `hidden` until its first paint; gating on that would
  have cut the animation short for exactly the tabs it was meant for.
- **Reduced motion:** every CSS rule's resting state is already the
  *finished* logo; animations use `backwards` fill, so `animation: none`
  under `prefers-reduced-motion: reduce` just shows the completed mark, and
  it exits as soon as `load` fires.
- **Page's own entrance effects (Lenis, GSAP/ScrollTrigger reveals) wait for
  the splash.** A global `window.onSplashExit(fn)` queues callbacks and
  fires them when the veil's `transitionend` (opacity) lands — not at
  `data-booted`, deliberately, so their setup work doesn't compete with the
  fade's own main-thread budget.
- **Third-party scripts (Leadsy, Calendly) were moved off `window.load`
  entirely** and are now injected only *after* `load` fires. Reason: an
  `async` tag still holds the `load` event open until it finishes
  downloading, and Leadsy has been observed taking 15s+ — which would have
  held the splash on screen for that long. GTM/GA4/Clarity were already
  consent-gated and already deferred past initial load (see
  `src/components/Analytics.astro`'s `schedule()`), so they didn't need
  changing for this.
- **CSS had to move out of `<head>` in the production build** so the splash
  can paint before `styles.css` arrives (was blocking first paint ~2s on
  slow 3G). This is **not** a hand-edit to `BaseLayout.astro` — see
  "Known bugs and gotchas" below, this one bit us once already.
- **Vercel build runtime bump (Node 24)** happened in the middle of this
  work because Vercel stopped allowing Node 20 builds mid-session and the
  build started failing outright. Unrelated to the splash in intent, but
  landed in the same session and blocks every deploy if reverted
  incorrectly — documented here so it isn't lost.

## What's done

- Splash markup, styles, and exit script: `src/components/Splash.astro` +
  `src/components/SplashHead.astro`.
- Wired into every page via `src/layouts/BaseLayout.astro` (shared layout,
  so no per-page edits needed).
- Lenis and GSAP/ScrollTrigger held during the splash, released via
  `window.onSplashExit()` — `public/js/home-fx.js`.
- `.reveal` entrance animations also wait on `onSplashExit()` —
  `public/js/script.js`.
- Third-party widget loading moved to after `window.load` —
  `src/layouts/BaseLayout.astro`.
- Production-only CSS reordering so the splash isn't blocked by
  `styles.css` — `scripts/defer-site-css.mjs`, wired into `postbuild`.
- Node 24 build/runtime fix so Vercel deploys succeed at all —
  `scripts/fix-vercel-runtime.mjs`, `package.json` (`engines.node`).
- Verified live: `curl https://www.clarteoverseas.com/` returns the splash
  markup and the `clarte_splash_seen` sessionStorage key name; the
  spec-sheet serverless function responds (confirms the Node 24 runtime
  stamp deployed correctly, not just locally).

## What's left

- [ ] **Run the actual verification the original spec asked for** — this
      was never completed/recorded in this session:
  - [ ] `performance.mark()` timings for `splash:logo-finished`,
        `splash:page-loaded`, `splash:exit-start` on a fresh session,
        reported back (the marks exist in the code — just needs capturing).
  - [ ] `requestAnimationFrame` timestamp recording through the exit
        crossfade, confirming no frame gap > 33ms.
  - [ ] Lighthouse on the home page, before/after, confirming LCP/CLS/TBT
        are unchanged by the splash.
  - [ ] Screenshots: animation midway, logo fully drawn, mid-crossfade,
        page after.
  - [ ] Centring measurements (icon/wordmark centres) at desktop and 375px
        — the current offsets (`#cs .cs-mark` / `#cs .cs-word` top values in
        `SplashHead.astro`) are computed from the icon's own path bounds by
        hand/math, not confirmed by an on-page measurement.
- [ ] Decide whether `scripts/fix-vercel-runtime.mjs` can be retired once/if
      `@astrojs/vercel` is upgraded past the Astro-4-compatible 7.x line (it
      currently only knows Node 18/20 — see Known bugs below).
- [ ] If the i18n system should translate the splash caption text (the
      original spec mentioned this as optional) — currently English-only,
      not wired to `/js/i18n.js`.

## Known bugs and gotchas

- **Do not move the `styles.css` `<link>` in `BaseLayout.astro` without
  touching `scripts/defer-site-css.mjs`.** This already broke production
  once: moving the link alone (to let the splash paint first) put it
  *after* Astro's inlined Tailwind `<style>` in the final HTML, which
  flipped an equal-specificity tie (`.nav-bar{position:relative}` vs
  Tailwind's `.sticky`) and silently unstuck the navbar from the top of the
  page (commit `f00b358` → regression → fixed in `6a6d3a4`). The fix moves
  the stylesheet **and every Astro `<style>` block that followed it, in
  their original relative order**, to the `<!--clarte:site-css-->` marker
  in `<body>`. If you add a new global stylesheet or `<style>` block to
  `BaseLayout.astro`'s `<head>`, check whether `defer-site-css.mjs`'s regex
  (`LINK_RE`) and marker logic still capture it correctly.
- **This CSS move is a production-build-only step.** `astro dev` always
  serves the plain head `<link>`, so a cascade bug like the one above
  **will not reproduce in dev** — it only shows up in `npm run build` +
  preview/deploy. Always sanity-check sticky/z-index-sensitive UI (navbar,
  this splash, dropdowns) against a real production build before shipping
  head/style changes.
- **`scripts/fix-vercel-runtime.mjs` is a workaround, not a real fix.**
  `@astrojs/vercel@7.x` (last version compatible with Astro 4, which this
  site is pinned to) only emits `nodejs18.x`/`nodejs20.x` function configs.
  Vercel retired both. The postbuild step rewrites
  `.vercel/output/functions/*.func/.vc-config.json` to the Node major
  version the build actually ran on. If Vercel changes its supported
  runtimes again, or if the adapter is upgraded, this script may need
  updating or removing — check `.vc-config.json` in the build output if a
  deploy fails with a runtime error again.
- **The 15s backstop is unverified under real slow-network conditions.** If
  a visitor's `load` event genuinely takes longer than 15s, the splash will
  force an exit while the page is still mid-load, revealing a part-loaded
  page underneath. Not expected to be common (most blocking work finishes
  well under this), but not load-tested either.
- **Refresh always replays the splash by design** — if someone reports
  "the splash shows every time I reload," that's intentional, not a bug.
  Only `sessionStorage` + non-reload navigations suppress it.
- **`sessionStorage` failures (private browsing in some browsers) fall back
  to showing the splash every time** — also intentional (see
  `SplashHead.astro` comments), not a bug to "fix" by suppressing it harder.
- Postbuild script order matters: `minify-css.mjs` → `fix-vercel-runtime.mjs`
  → `defer-site-css.mjs` (see `package.json`'s `postbuild` script).
  `defer-site-css.mjs` operates on the *built* HTML output, so it must run
  after Astro's build step, and its marker-replacement logic assumes the
  CSS hasn't been minified-and-moved already by anything else.

## Files involved

| File | Role |
|---|---|
| `src/components/Splash.astro` | Splash markup (inline SVG mark + wordmark) and the exit-timing script. Placed first in `<body>`. |
| `src/components/SplashHead.astro` | Session-check script (must run first in `<head>`) + all splash CSS/keyframes/positioning, inlined. |
| `src/layouts/BaseLayout.astro` | Wires both halves into every page; moved third-party widget loading (Leadsy/Calendly) to after `window.load`; holds the `<!--clarte:site-css-->` marker. |
| `public/js/home-fx.js` | Holds Lenis + the GSAP global timeline paused while `window.__splashActive`; resumes via `window.onSplashExit()`. |
| `public/js/script.js` | `.reveal` intersection-observer entrances wait on `window.onSplashExit()`. |
| `src/components/Analytics.astro` | Unchanged in intent this session, but documented/confirmed as already keeping GTM/GA4/Clarity off the critical path (relevant because the splash also now depends on `load` timing). |
| `scripts/defer-site-css.mjs` | **New.** Postbuild step: moves `styles.css` + the Astro `<style>` blocks that followed it (in original order) to just after the splash, so the splash paints first without breaking cascade order. |
| `scripts/fix-vercel-runtime.mjs` | **New.** Postbuild step: rewrites each Vercel function's `.vc-config.json` to the Node major version the build ran on (needed once Vercel stopped accepting Node 20 builds and the adapter's own default runtime was retired). |
| `package.json` | `engines.node: "24.x"`; `postbuild` now chains three scripts in order. |
| `public/assets/logo/wordmark.png` | **Deleted** mid-session — replaced by an inline vector wordmark in `Splash.astro`. If you see references to it anywhere, they're stale. |
| `/favicon.svg` | Source of truth for the icon's path data; the splash's SVG paths were copied/regrouped from here, not generated — if the favicon's artwork changes, the splash will drift out of sync and needs re-copying by hand. |
