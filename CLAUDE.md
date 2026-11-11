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
  for why that script exists. The upgrade that retires it (Astro 7 +
  `@astrojs/vercel` 11, with a zero-downtime rollout plan) is assessed in
  [docs/handoff/astro-upgrade.md](docs/handoff/astro-upgrade.md).
- The first-visit splash exits once the logo has finished AND the page is
  ready (CSS applied, fonts loaded, every `img[data-splash-hero]` decoded) —
  not on `window.load`. Put `data-splash-hero` on the above-the-fold photo
  of any new page template, and keep below-the-fold images
  `loading="lazy"`. Details in
  [docs/handoff/first-visit-splash.md](docs/handoff/first-visit-splash.md).
- Font preloads are **opt-in per page** (`preloadFonts` prop on
  `BaseLayout`; only the homepage uses it, and only on screens ≤ 1024px via
  `preloadFontsMedia`). Preloads were measured to push back LCP on product
  and contact pages and on desktop — measure before adding one, with
  compression on (see first-visit-splash.md).
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
- **Product photo migration (Nov 2026 →):** each product gets a 1:1
  `image` (`<slug>-v2.webp`, product page) and a landscape `listImage`
  (`<slug>-wide.webp`, category list + related tiles), optionally a
  `gallery`. Having a `listImage` switches that product to the full-bleed
  layout; unmigrated products keep the old cut-out layout. Originals go in
  the git-ignored `incoming/product-photos/<category>/{landscape,square}/`.
  Process and progress: `public/assets/img/products/README.txt`.
- **Mobile image sizes:** after adding or replacing any product photo, run
  `node scripts/gen-image-variants.mjs` — it writes `<name>-480.webp` and
  `<name>-800.webp` copies, and the templates (`src/lib/responsive-img.ts`)
  add a `srcset` only when both exist. Forget it and the photo still works,
  but phones download the full 1200px file.
- **Don't reuse a vector.** Check `docs/design/vector-kit/` usage first; a new
  section gets its own artwork rather than one already shown on another page.
  The one deliberate exception: every FAQ section uses `buyer-questions`
  (owner's choice, Nov 2026).
- **Blog covers** are generated vectors: `node scripts/gen-blog-art.mjs` writes
  `public/assets/img/blog/<id>-v2.svg` from its `ART` map, one line per post. A new
  post needs a line there (the script fails if one is missing; until then the
  page falls back to the post's emoji). Once a cover has shipped, change it
  under a new filename, as with any image here.
- **Product mascots:** `node scripts/gen-product-art.mjs` writes
  `public/assets/img/products/art/<slug>.svg`; a new product needs an entry in
  its `ART` map, and the page simply shows none until then.
- **Self-host every asset.** Product photos live in
  `public/assets/img/products/` (recipe in the README there) and
  certificates in `public/assets/certifications/docs/`. Nothing should load
  from the old site builder's CDN (`lsmedia.linker-cdn.net`) — that
  dependency was removed in Oct 2026. Keep signed certificate PDFs
  byte-for-byte as issued (re-compressing breaks the signature); a renewed
  certificate gets a new filename.

## Colour

- Brand palette (Nov 2026): **navy** `#1f4693` (the logo colour) for buttons,
  links and dark sections, and **turmeric** `#c7861c` (ink `#8a5a0f`, tint
  `#f7eedb`) as the warm accent (eyebrow labels, highlights). Tokens live at the
  top of `public/css/site-v3.css` (`--violet` and `--pink` keep their old names
  but now hold navy and turmeric). **No purple or lavender anywhere** — the owner
  replaced it so the site doesn't read as AI-generated. Buttons are solid navy
  (`--bloom` is a navy two-tone), not multicolour gradients. Purple-red food
  colours in drawings (beetroot, pomegranate, red onion, tulsi) are fine.

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
- **Any new visible text gets a `data-i18n` key and a translation in all 17
  locale files in the same change.** Never ship English-only copy.
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

## Copy / positioning

- Clarté Overseas is a **merchant exporter**: it sources through a vetted
  network of audited Indian processors and owns quality checks, documentation
  and shipping. Don't write copy claiming farm-direct buying, "no middlemen",
  own farms/factories, or that "we" dry/mill/process the goods — describe
  processing in the passive ("the dried root is milled…"). Reworded site-wide
  in Nov 2026 (home "Vetted Supplier Network" card, herbal product descriptions,
  two blog posts).

## SEO

- `BaseLayout.astro` enforces lengths for every page: a title over 65
  characters drops its ` | Clarté Overseas` suffix, and the meta/OG
  description goes through `clipText()` (`src/lib/seo.ts`, 160 chars, cut at a
  sentence or word). Still write titles ≤ 65 and descriptions ≤ 160 with the
  keywords first; the clipping is a safety net.
- Default share image: `SITE.defaultImage` (1200×630 JPG). Category pages pass
  their collage photo, product pages their own photo.
- No `meta keywords` (Google ignores it). Translations switch client-side on the
  same URL, so search engines index the English copy only and there is no
  hreflang.
- Category pages end with an "Inside this range" guide: copy in
  `src/data/category-guides.ts`, keys `cat.guide_*`, one vector per category.
  A new category needs an entry there (the section is skipped without one).

## Git / workflow

- **Always ask before pushing** — commit freely, but confirm before
  `git push`.
- Keep responses action-and-result focused; don't narrate internal
  reasoning/interpretation in replies.
- Before any command that could discard uncommitted work (`git checkout`,
  `restore`, `reset`, `clean`, `rm -rf` in the repo), run `git status` first
  and stash or commit anything sitting there.

## Site versions

- Which design the site builds with is set by `version` in
  `src/data/site-config.json`: `v1` is the original site, `v3` is "The Journey".
  Changing that value on `main` changes the live site, so confirm first.
- Whole-site **versions** (V2, V4, V5, V8 + V6 dark; V7 dropped — palette,
  components, motion library, vector kit, phone rules per version) are
  planned in [docs/handoff/site-versions.md](docs/handoff/site-versions.md) —
  read it before building any of them. Vector source SVGs (30) and their loop
  animations: `docs/design/vector-kit/`.
- Site versions are wired through `site-config.json` → `version` and
  `public/{css,js}/site-v<N>.{css,js}` (scoped `[data-version="vN"]`, linked
  only for that version). Local and preview builds show the version in
  `src/data/site-config.preview.json`; production uses `site-config.json` only
  (live on `v3` since 9 Nov 2026; `v1` stays in the code as the fallback).
  If you add a version stylesheet, keep it directly after styles.css — the
  defer script relies on that order.

## Repo scope

- This repo (`Website-1`, the clarteoverseas.com marketing site) is
  separate from the LadeOps trade-ops app (`~/code/ladeops`, live at
  app.clarteoverseas.com). Don't cross-edit, commit, or push between them
  unless explicitly asked to.
