# CLAUDE.md

Project rules for working in this repo. See also `docs/handoff/` for
write-ups of specific pieces of work (read the relevant one before touching
that area).

## Build

- Local machine (macOS) uses **nvm**; Node 24 is installed. Shell state
  doesn't persist between commands, so prefix with
  `source ~/.nvm/nvm.sh && nvm use 24 &&`.
- Build on **Node 24** (`engines.node` in `package.json` is pinned to
  `24.x` because Vercel stopped accepting Node 20 builds). If a Vercel
  deploy fails with a runtime error, check
  `.vercel/output/functions/*.func/.vc-config.json` — see
  `scripts/fix-vercel-runtime.mjs` and
  [docs/handoff/first-visit-splash.md](docs/handoff/first-visit-splash.md)
  for why that script exists. The upgrade that retires it (Astro 5 +
  `@astrojs/vercel` 9.0.5) is scoped in
  [docs/handoff/astro-5-upgrade.md](docs/handoff/astro-5-upgrade.md).
- The first-visit splash exits once the logo has finished AND the page is
  ready (CSS applied, fonts loaded, every `img[data-splash-hero]` decoded) —
  not on `window.load`. Put `data-splash-hero` on the above-the-fold photo
  of any new page template, and keep below-the-fold images
  `loading="lazy"`. Details in
  [docs/handoff/first-visit-splash.md](docs/handoff/first-visit-splash.md).
- To check splash/load-timing changes, use `scripts/verify-splash.mjs`
  against a production build (`.claude/launch.json` → `prod-static`
  serves `.vercel/output/static` on port 4330) or the live site.
- `postbuild` runs three scripts in a specific order (`minify-css.mjs` →
  `fix-vercel-runtime.mjs` → `defer-site-css.mjs`). Don't reorder them —
  `defer-site-css.mjs` operates on the already-built HTML output.
- **Always verify head/stylesheet changes against a real production build**
  (`npm run build`, not just `astro dev`). A postbuild step
  (`scripts/defer-site-css.mjs`) moves `styles.css` and the Astro-inlined
  `<style>` blocks that follow it to a marker in `<body>` so the first-visit
  splash can paint before the stylesheet arrives — `astro dev` never does
  this, so a cascade-order bug there will not reproduce in dev. This already
  broke the sticky navbar once (equal-specificity tie flipped when the
  stylesheet moved without its neighboring `<style>` blocks moving with it,
  in order). If you add a new global stylesheet or `<style>` block to
  `src/layouts/BaseLayout.astro`'s `<head>`, check that
  `scripts/defer-site-css.mjs`'s regex/marker logic still captures it.

## Static assets (CSS/JS)

- `public/css/styles.css` and `public/js/{script,i18n,home-fx}.js` are
  served with a **content-hash query param** (`?v=...`, computed in
  `astro.config.mjs` as `__ASSET_V__`) and cached `immutable` for a year.
  Editing one of these files is enough — the hash (and therefore the URL)
  changes automatically on the next build. You do not need to rename files
  to bust the cache for *these* assets.
- `public/fonts/fonts.css` is **not** linked — `BaseLayout.astro` inlines it
  into every page (`?raw` import → `<style is:inline>`), so edits ship with
  the HTML. It's still part of the `__ASSET_V__` hash input, so editing it
  also re-versions the files above (harmless). The `.woff2` files it points
  to are cached `immutable` with no versioning — same rule as images below.
- Images under `public/assets/img/` are also served `immutable` for a year,
  but have **no** content-hash versioning. If you overwrite an existing
  image file in place (same filename, new content), visitors who already
  loaded the page will keep seeing the old cached image for up to a year.
  **Give the new image a new filename** (e.g. append `-v2`) and update every
  reference, rather than overwriting in place.

## i18n

- `public/i18n/*.json` (17 locales) are flat dotted-key JSON files that use
  **blank lines to separate sections** — editing them with
  `json.load()`/`json.dump()` in Python (or similar round-trip tools)
  destroys that formatting. Edit them with **surgical regex substitution**
  for existing keys and **block-append** for new keys, then validate with
  `json.loads()` before writing back.
- Key naming conventions already in use — follow them for new content:
  `products.cat_<slug_underscored>_name` / `_desc`,
  `cat.prod_<slug>_name` / `_tagline`,
  `prod.<slug>_desc`, `_f1`–`_f6` (features), `_u1`–`_u4` (uses),
  `_g1`–`_g4` (grades), `home.card<N>_title` / `_desc`.
- After editing any locale file, diff key sets across all 17 locales (and
  against the keys actually referenced via `data-i18n*` attributes in
  `src/`) before shipping — a missing key fails silently in the UI (falls
  back to the hardcoded English in the markup) rather than erroring.

## Spec sheet PDFs

- Generated via `npm run specs` (`scripts/gen-spec-sheets.ts`, pdfkit),
  driven by `src/data/specs.ts` (`categoryDefaults` keyed by category slug —
  a stale/missing key here silently crashes the generator for that
  category's products). Output goes to `spec-pdfs/` (git-tracked, **not**
  inside `public/` — served only via the gated `/api/spec-sheet` function so
  the PDFs have no guessable public URL).
- Runs on Node 24 (same as the build) or Node 22; both give byte-identical
  output. Locally: `nvm use 24`.
- Output is **deterministic**: the footer's "Issued <month>" and the PDF
  `CreationDate` both come from the fixed `ISSUE_DATE` constant in the
  script, not the clock. Re-running only changes sheets whose data changed.
  When specs are genuinely revised, bump `ISSUE_DATE` (and the "Rev" in the
  footer) deliberately.
- The generator **never deletes** PDFs. When you remove a product from
  `src/data/products.ts`, delete `spec-pdfs/<slug>-spec-sheet.pdf` by hand —
  otherwise it stays bundled into the serverless function as dead weight
  (the API's slug allowlist already refuses to serve it).

## Git / workflow

- **Always ask before pushing** — commit freely, but confirm before
  `git push`.
- Keep responses action-and-result focused; don't narrate internal
  reasoning/interpretation in replies.
- Before any command that could discard uncommitted work (`git checkout`,
  `restore`, `reset`, `clean`, `rm -rf` in the repo), run `git status` first
  and stash or commit anything sitting there.

## Repo scope

- This repo (`Website-1`, the clarteoverseas.com marketing site) is
  separate from the LadeOps trade-ops app (`~/code/ladeops`, live at
  app.clarteoverseas.com). Don't cross-edit, commit, or push between them
  unless explicitly asked to.
