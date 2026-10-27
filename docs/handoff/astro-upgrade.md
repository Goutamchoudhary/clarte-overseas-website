# Astro upgrade: assessment and zero-downtime plan

Status: **assessed and trial-built, not applied** (27 Oct 2026). Production
still runs Astro 4.16.19. Replaces the earlier "Astro 5" plan — going
straight to Astro 7 turned out to be the better target (see below).

## Should we upgrade? Yes — for maintenance and security, not for speed

| | Today (Astro 4) | After (Astro 7) |
|---|---|---|
| Last release of our major | 4.16.19, **Aug 2025** (14 months, no fixes) | 7.4.2, Oct 2026 (current) |
| `npm audit` | **19** (1 critical, 14 high) | **9** (0 critical, 7 high) |
| Runtime-relevant advisories | Astro: `X-Forwarded-Host` reflection / URL manipulation (critical); adapter: `x-astro-path` override (moderate) — both touch the spec-sheet function | none in Astro itself; the rest are transitive build-time packages, mostly Vercel's own |
| Vercel Node runtime | needs `scripts/fix-vercel-runtime.mjs` to rewrite `nodejs18.x` → `nodejs24.x` after every build | adapter emits `nodejs24.x` itself; workaround deleted |
| Cross-site form POSTs to `/api/spec-sheet` | accepted | rejected with 403 by Astro's built-in origin check (our dialog sends JSON from our own origin — unaffected, verified) |

What visitors see does **not** change: same pages, same CSS, same scripts
behaviour (verified below). There's no performance gain to expect; the value
is getting back onto a maintained, patched release before Vercel's next
runtime change or a new Astro advisory forces a rushed upgrade.

### Why Astro 7 and not Astro 5

Astro 5's last release was May 2026 and it's now two majors behind, so it's
unlikely to keep receiving fixes — we'd be repeating this exercise soon. The
only extra work for 7 over 5 is replacing the Tailwind integration (below),
which trial-built cleanly. Astro 5 + adapter 9.0.5 remains the fallback if
7 ever shows a problem on preview.

## Is it stable? Evidence from the trial build

Trial = scratch worktree of `feat/self-host-assets-i18n-fonts` @ `f393d18`,
Node 24, Astro 7.4.2 + `@astrojs/vercel` 11.0.16 + `@astrojs/sitemap`
3.7.4, compared file-by-file with the same commit built on Astro 4.

- `npm run build`: clean, no warnings/deprecations; postbuild unchanged
  (`defer-site-css`: 156 updated, 1 skipped — same as today).
- Function `.vc-config.json` → `"runtime": "nodejs24.x"` natively.
- Same 157 HTML pages; same non-bundle file list; 41 spec PDFs bundled into
  the function, 0 leaked to static.
- **CSS:** every inline rule on home, contact, product, certifications and
  blog pages compared declaration-by-declaration after splitting merged
  rules: all differences are minifier formatting with identical meaning
  (`ease` default dropped, shorthand reordering, `skew(x)`≡`skewX(x)`,
  `#0000`≡`transparent`, `0px`≡`0`, unitless≡`px` stroke widths). Only real
  loss: a `-webkit-text-decoration` prefix on `abbr[title]` (very old Safari
  only).
- **Cascade order:** `<style>`/`<link>` order and the
  `<!--clarte:site-css-->` move identical; splash markup position identical.
- **Scripts:** the one structural change — Astro 5+ no longer hoists the 7
  processed `<script>`s (CookieBanner, EnquiryDialog, SpecSheetDialog,
  contact/certifications/how-we-export/product page scripts) into one
  bundle in `<head>`; each renders where it's written as a `type="module"`
  script. Module scripts are deferred either way. On the Astro 5 trial
  (same behaviour): navbar sticky, spec dialog opens, cookie banner renders,
  splash timings identical.
- **Sitemap:** same 155 URLs and entries; 3.7.4 adds `<lastmod>` to the
  sitemap index (harmless).
- **Head/SEO tags:** identical except `&#38;` vs `&amp;` (same character).
- **Spec-sheet API (dev server):** GET 405; unknown slug / honeypot
  rejected; valid JSON and form-encoded POSTs return the byte-identical PDF.

## The change

1. Dependencies:
   - `astro` ^4.16 → ^7.4, `@astrojs/vercel` ^7.8 → ^11.0,
     `@astrojs/sitemap` 3.2.1 → ^3.7.
   - **Remove `@astrojs/tailwind`** (supports Astro ≤ 5 only). Keep
     `tailwindcss` 3.4 and add devDependencies `postcss` ^8 and
     `autoprefixer` ^10 (the integration used to bring autoprefixer).
2. Tailwind without the integration (keeps Tailwind 3 — no class changes):
   - `postcss.config.mjs`: `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };`
   - `src/styles/tailwind.css`: `@tailwind base; @tailwind components; @tailwind utilities;`
   - First line of `src/layouts/BaseLayout.astro` frontmatter:
     `import "../styles/tailwind.css";` — the integration injected exactly
     this file into every page in the same slot, which is why the CSS order
     comes out identical. Every page uses BaseLayout.
3. `astro.config.mjs`: drop the `tailwind` import and `tailwind()`;
   `import vercel from "@astrojs/vercel"` (no `/serverless`);
   `output: "hybrid"` → `output: "static"` (the API route already has
   `export const prerender = false`).
4. Delete `scripts/fix-vercel-runtime.mjs`; `postbuild` becomes
   `node scripts/minify-css.mjs && node scripts/defer-site-css.mjs`.
5. Docs: CLAUDE.md (Build section), first-visit-splash.md (the runtime
   gotcha), this file → "applied".

## Zero-downtime rollout

Production is never touched until the very last step, and the previous
production deployment stays one click away.

1. **Branch** `chore/astro-7` from up-to-date `main`; apply the change.
2. **Local gate** (all must pass, same as this trial):
   `npm run build` clean → `.vc-config.json` says `nodejs24.x` → link crawl
   (0 broken apart from the known `/404/` canonical) → CSS/cascade/head-tag
   comparison script against a `main` build → splash + sticky-navbar checks
   with `scripts/verify-splash.mjs` → spec API on `astro dev`.
3. **Push the branch only** → Vercel builds a **Preview deployment** (its
   own URL; production keeps serving `main`). On the preview URL check:
   - Home, a category, 3 product pages, certifications (download a PDF),
     contact, blog index + a post, `/sitemap-index.xml`, `/robots.txt`.
   - A redirect from `vercel.json` (e.g. `/our-products` → `/products`).
   - Response headers: `/css/styles.css?v=…` and `/assets/img/…` still
     `immutable`.
   - Spec-sheet dialog end to end in a browser (logs one test lead to
     Web3Forms — label it TEST).
   - Language switch, cookie banner, enquiry dialog opens, WhatsApp/Calendly
     links.
   - Vercel dashboard → the deployment's Functions tab shows Node 24 and no
     errors.
4. **Merge to `main` at a quiet hour** (fast-forward) → production deploy.
5. **Post-deploy smoke test** (5 minutes): same list against
   www.clarteoverseas.com, plus the live `verify-splash.mjs` runs.
6. **Rollback if anything is off:** Vercel dashboard → Deployments →
   previous production deployment → **Instant Rollback** (seconds, no
   rebuild). Then `git revert` the merge on `main` so the next push doesn't
   re-deploy it. The old Astro 4 build keeps working exactly as before,
   workaround script included.

Risk left after all that: something that only shows under real production
traffic — mitigated by the instant rollback, not eliminated.
