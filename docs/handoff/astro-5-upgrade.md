# Astro 4 → 5 upgrade (retires the Vercel runtime workaround)

Status: **scoped and trial-built, not applied** (26 Oct 2026). Nothing in
`main` or any branch has been upgraded yet.

## Why

`@astrojs/vercel@7.x` — the last adapter line for Astro 4 — only knows the
Node 18/20 runtimes, both retired by Vercel. `scripts/fix-vercel-runtime.mjs`
papers over that by rewriting `.vc-config.json` after every build (see
[first-visit-splash.md](first-visit-splash.md), "Known bugs"). If Vercel
changes runtimes again, deploys break. Astro 4 is also now tagged `legacy`
on npm (current: Astro 7.4.x, adapter 11.0.x).

## Target: Astro 5.18 + `@astrojs/vercel` 9.0.5

Adapter runtime support by major (read from each package's
`SUPPORTED_NODE_VERSIONS`):

| Adapter | Astro peer | Highest Node runtime |
|---|---|---|
| 7.8.2 (current) | 4 | 20 → falls back to `nodejs18.x` on Node 24 |
| 8.2.11 | 5 | 22 |
| **9.0.5** | **5** | **24** |
| 10.0.8 | 6 | 24 |
| 11.0.16 | 7 | 24 (default) |

9.x is the smallest step that emits `nodejs24.x` natively. Astro 6/7 are
further hops and have **not** been evaluated — do them as separate pieces
of work after this one is live.

## The change (trial-verified)

1. `npm install astro@5 @astrojs/vercel@9.0.5` (resolved to astro 5.18.2).
   `@astrojs/tailwind@5.1.5` already allows Astro 5 — no change.
   `@astrojs/sitemap` stays at 3.2.1 (pinned since the original migration;
   no reason found to move it in this step).
2. `astro.config.mjs`:
   - `import vercel from "@astrojs/vercel/serverless"` → `"@astrojs/vercel"`
   - `output: "hybrid"` → `output: "static"` (Astro 5 removed `hybrid`;
     `static` + `export const prerender = false` on
     `src/pages/api/spec-sheet.ts`, which is already there, is the same
     thing).
3. Delete `scripts/fix-vercel-runtime.mjs` and drop it from `postbuild`
   (→ `minify-css.mjs && defer-site-css.mjs`). Update CLAUDE.md and
   first-visit-splash.md to match.

## Trial results (scratch worktree, Node 24)

- `npm run build`: clean, no warnings or deprecations.
- `.vercel/output/functions/_render.func/.vc-config.json` →
  `"runtime": "nodejs24.x"` straight from the adapter;
  `fix-vercel-runtime.mjs` found nothing to change.
- Same 157 HTML pages, same 41 spec PDFs bundled into the function, 0 PDFs
  leaked to static.
- `defer-site-css.mjs`: 156 pages updated, 1 skipped (the Google
  verification file) — identical to Astro 4.
- **Only structural HTML difference:** Astro 4 hoisted the processed
  `<script>`s (CookieBanner, EnquiryDialog, SpecSheetDialog, and page
  scripts in contact / certifications / how-we-export / product pages) into
  one bundled `<script type="module" src="/_astro/hoisted.*.js">` in
  `<head>`. Astro 5 renders each where it's written in the component, as
  inline (or small external) `type="module"` scripts in `<body>`. Module
  scripts are deferred either way, so execution timing is unchanged in
  practice. `<style>`/`<link>` order, the `<!--clarte:site-css-->` marker
  and the splash's position are identical.
- Behaviour checked on the trial's production build: navbar sticky at
  `top: 0` after scrolling, spec-sheet dialog opens, cookie banner renders,
  splash marks/crossfade (max gap 16.8 ms) and centring identical to
  Astro 4. Only console errors: `/_vercel/insights` and
  `/_vercel/speed-insights` 404s, which exist only on Vercel.

## Not verifiable locally — check on a Vercel preview deploy before merging

- `/api/spec-sheet` actually runs on the Node 24 function and streams a PDF
  (POST from a product page's "Download spec sheet" dialog).
- Vercel Analytics / Speed Insights scripts load.
- `vercel.json` headers and redirects still apply (unchanged file, but the
  build output layout changed adapter versions).

## Rollback

Revert the upgrade commit. The workaround script comes back with it, so
the Astro 4 build keeps deploying exactly as before.
