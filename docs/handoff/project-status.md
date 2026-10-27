# Project status and open items

Snapshot as of 27 Oct 2026 (`main` at `5bb6388` live, plus doc commits).
Re-check counts against the code before acting — they drift.

## What the site is

- clarteoverseas.com — B2B marketing site for Clarté Overseas, an Indian
  merchant exporter of dehydrated fruit, vegetable, herbal and spice
  powders, seeds and hydrocolloids.
- Astro 4 (static pages + one serverless function) + Tailwind 3, deployed on
  Vercel from `main` (Node 24 runtime via `scripts/fix-vercel-runtime.mjs`).
  Repo: `Goutamchoudhary/clarte-overseas-website`.
- Catalogue: **7 categories, 41 products** (`src/data/products.ts`), each
  with a product page, a lead-gated spec-sheet PDF (`spec-pdfs/`, served by
  `/api/spec-sheet`), and SEO/structured data.
- ~93 blog posts (`src/data/blogs.ts`), 100 blog pages incl. pagination.
- 17 languages via `public/i18n/*.json` + `public/js/i18n.js`.
- Lead capture: enquiry + spec-sheet forms post from the browser to
  Web3Forms; Calendly "discovery call"; WhatsApp link.
- Analytics: GTM container (GA4 + Clarity inside it), consent-gated;
  Vercel Analytics + Speed Insights.
- First-visit splash — see [first-visit-splash.md](first-visit-splash.md).

## Open items

### Product photos
- **11 products have no photo** (show an emoji placeholder):
  ashwagandha, shatavari, brahmi, triphala, giloy, neem, trikatu (Ayurvedic
  & herbal); watermelon, chia, pumpkin, melon seeds (edible seeds).
- **25 products use photos on the old site builder's CDN**
  (`lsmedia.linker-cdn.net`, account `1059756`, via `IMG()`/`IMGJ()` in
  `products.ts`): 350 KB–1.2 MB each, slow on mobile, and they'd break if
  that account lapses. Migrate to local `.webp` (~100–150 KB) following
  `public/assets/img/products/README.txt`, with new filenames (images are
  cached immutable — see CLAUDE.md).
- Only 5 products have local photos: amchur, coriander leaf, curry leaf,
  mint, tulsi.

### Certificates
- 7 certificate documents on `/certifications` (PDFs/PNG) are also hosted
  on the old CDN (`src/pages/certifications.astro`). Same lapse risk — move
  them into the repo (`public/`) or another host you control.

### Translations
- **Amchur powder and pomegranate powder have no product translations** in
  any of the 17 locales (0 of 17 keys each: name, tagline, description,
  features, uses, grades). Their pages fall back to English when another
  language is chosen. All other products, and all locale files, are
  complete and in sync (1,432 keys each).
- Optional: splash caption isn't wired to i18n.

### Availability flags (`src/consts.ts`) — confirm these are still true
- Unavailable: apple powder.
- Coming soon: curry leaf, tulsi, tamarind kernel powder.

### Config placeholders (`src/consts.ts`)
- `SITE.defaultImage` is the logo SVG — needs a real 1200×630 PNG/JPG
  social-share image (many platforms don't render SVG previews).
- `ANALYTICS.linkedinPartnerId` empty (LinkedIn Insight Tag off).
- Optional, empty: `turnstileSiteKey` (form spam protection),
  `sheetWebhook` (leads → Google Sheet + WhatsApp alert).

### Performance / splash
- Preload first-screen fonts (biggest remaining splash/LCP lever).
- Re-measure the splash on the live site (fixes are deployed).
- Speed Index regressed ~0.8–1.2 s with the splash; LCP/TBT/CLS fine.

### Platform
- Astro 5 + `@astrojs/vercel` 9.0.5 upgrade to retire the runtime
  workaround — trial-built, see [astro-5-upgrade.md](astro-5-upgrade.md).
  Astro 4 is tagged `legacy` on npm.

### Minor
- `/404` page's canonical/og:url point at `/404/` (pre-existing, harmless).
