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

## Verification results (26 Oct 2026, commit `f772189`)

Run with `scripts/verify-splash.mjs` (headless Chrome over CDP, fresh
profile per run, third-party trackers blocked). "Local" = production build
served uncompressed by `python3 -m http.server` from `.vercel/output/static`;
"live" = https://www.clarteoverseas.com/ (real CDN + compression).

**Splash marks (ms from navigation start)**

| Run | `page-loaded` | `logo-finished` | `exit-start` | Splash on screen after logo done |
|---|---|---|---|---|
| Live, desktop, no throttle | 547 | 2133 | 2133 | 0 |
| Live, desktop, 4x CPU + slow 4G | ~6210 | ~2120 | ~6215 | **~4.1 s** |
| Live, 375px, 4x CPU + slow 4G | ~4750 | ~2130 | ~4755 | **~2.6 s** |
| Live, 375px, 4x CPU + slow 3G | never (< 15 s) | ~2500 | ~15780 (backstop) | **~13 s** |

Unthrottled, the logo animation (≈2.1 s) is the long pole, as designed.
Throttled, `load` is — and on slow 3G the 15s backstop is what ends it.

**Why `load` is late:** `public/js/script.js` preloads every `.img-ph` photo
(8 category cards + the industries image) with `new Image()` at
DOMContentLoaded, and `buildWorldMap()` does the same for the 96 KB world
map. None are lazy, so ~400 KB of below-the-fold imagery must finish before
`load` fires (≈846 KB total transfers before `load` on the live home page).
Fix proposed, not yet applied: append each `<img>` to its placeholder
immediately with `loading="lazy"` (the CSS already keeps it absolutely
positioned at `opacity:0` until `.loaded`), same for `.map-img`. Lazy
images outside the viewport don't hold `load`, so the splash would exit
close to the end of the logo even on slow connections.

**Frame gaps (rAF), crossfade window = exit-start −100 ms … +800 ms**

| Run | Max gap | Gaps > 33.4 ms |
|---|---|---|
| Live, desktop, no throttle | 16.8 ms | 0 |
| Live, desktop, 4x CPU + slow 4G | 33.3 ms | 0 |
| Live, 375px, 4x CPU + slow 4G | 33.4 ms | 0–1 (at the threshold) |
| Live, 375px, 4x CPU + slow 3G | 33.3 ms | 0 |
| Local, desktop, 4x CPU + slow 4G | 50–250 ms | 1–2 |

The crossfade holds ~30 fps on a 4x-throttled CPU against the live site.
The local-desktop gaps coincide with the late `load` work on an uncompressed
server and didn't reproduce live. During the *logo* animation (before
exit) there are 5–7 gaps > 33 ms under 4x CPU (up to ~130–300 ms) — page
parsing/scripts competing with the animation on a slow CPU; not seen
unthrottled.

**Lighthouse, home page, median of 3 (local production builds;
"before" = `8f8a020`, the last commit without the splash)**

| | Score | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|---|
| Desktop before | 97 | 684 | 1227 | 0 | 0.011 | 765 |
| Desktop after | 96 | 445 | 1150 | 0 | 0.011 | **1575** |
| Mobile before | 71 | 3454 | 5528 | 128 | 0.013 | 3454 |
| Mobile after | 73 | 3454 | 4810 | 0 | 0.010 | **4624** |

LCP/TBT/CLS are unchanged or better. Caveat: the LCP element (the hero
`h1`) paints *under* the opaque splash, so LCP doesn't capture the delay a
visitor actually sees — **Speed Index does, and it regressed** (desktop
+0.8 s, mobile +1.2 s). Absolute mobile numbers are inflated by the
uncompressed local server; the before/after delta is the meaningful part.
"Before" also predates the third-party/PageSpeed changes in this same
stretch, so it isn't a splash-only comparison.

**Centring (on-screen ink bounds, reduced motion = resting state)**

| Viewport | Icon centre − 50% vw | Wordmark centre − 50% vw | Group centre − 47% vh | Icon→word gap |
|---|---|---|---|---|
| 1366×768 | +0.01 px | +0.03 px | 0.00 px | 14.00 px |
| 1920×1080 | +0.01 px | +0.03 px | 0.00 px | 14.00 px |
| 375×812 | +0.01 px | +0.02 px | −0.02 px | 10.98 px |
| 390×844 | +0.01 px | +0.02 px | −0.01 px | 10.98 px |

The hand-computed offsets in `SplashHead.astro` are exact. Ink sizes match
the comments (icon 77.2 px tall, wordmark 196 × 18.7 px desktop; 62.8 px /
160 × 15.3 px on phones).

**Screenshots:** captured (midway, logo drawn, after) at 1366×768 and
375×812; all as intended. The "mid-crossfade" capture can't be caught
reliably — Splash.astro's 650 ms timer sets `data-boot-gone`
(`display:none`) regardless of how far the fade has got, so slowing CSS
animations for the screenshot doesn't slow the exit. Frame timing covers
the crossfade instead. Re-capture with `node scripts/verify-splash.mjs
<url> shots <dir>`.

## What's left

- [ ] **Stop below-the-fold images holding `load`** (see "Why `load` is
      late" above) — the splash currently sits on a finished logo for
      2.6–4 s on slow 4G and ~13 s on slow 3G.
- [ ] Consider whether the 15s backstop should be shorter (e.g. ~6–8 s
      after the logo finishes) once the image fix lands and slow-3G timings
      are re-measured.
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
- **The 15s backstop does fire on slow 3G** (measured Oct 2026 against the
  live site, 375px + 4x CPU): `load` hadn't fired by 15 s, so the splash
  forced its exit at ~15.8 s and revealed a still-loading page. See
  "Verification results" — the cause is eagerly preloaded below-the-fold
  images, not anything the visitor needs up front.
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
| `scripts/verify-splash.mjs` | Verification harness (CDP, no deps): marks, frame gaps, centring, screenshots, with CPU/network throttling. Not part of the build. |
| `public/assets/logo/wordmark.png` | **Deleted** mid-session — replaced by an inline vector wordmark in `Splash.astro`. If you see references to it anywhere, they're stale. |
| `/favicon.svg` | Source of truth for the icon's path data; the splash's SVG paths were copied/regrouped from here, not generated — if the favicon's artwork changes, the splash will drift out of sync and needs re-copying by hand. |
