# Project status and open items

Snapshot as of 27 Oct 2026. Production (`main`) is at `970fa98`; branch
`feat/self-host-assets-i18n-fonts` holds the self-hosting, translation and
font-preload work below (not yet merged). Re-check counts against the code
before acting — they drift.

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

## Done on `feat/self-host-assets-i18n-fonts` (27 Oct 2026)

- **No asset loads from the old site builder's CDN any more**
  (`lsmedia.linker-cdn.net`): the 25 product photos are local WebP
  (20.2 MB → 3.6 MB), and the 7 certificates are in
  `public/assets/certifications/docs/` (signed PDFs byte-for-byte; FSSAI
  image wrapped as a PDF).
- **Amchur and pomegranate translated** into all 16 languages; every
  product is now fully translated.
- **Homepage fonts preloaded** — homepage splash wait and LCP down on slow
  connections (see first-visit-splash.md).

## Open items

### Product photos
- **11 products have no photo** (emoji placeholder) — to be supplied:
  ashwagandha, shatavari, brahmi, triphala, giloy, neem, trikatu (Ayurvedic
  & herbal); watermelon, chia, pumpkin, melon seeds (edible seeds). Process:
  `public/assets/img/products/README.txt`.
- The tamarind powder photo has a small sparkle mark bottom-right (looks
  like an AI generator's watermark) — consider replacing.

### Certificates
- FSSAI licence is valid until **12 Apr 2027**; renewal can be filed 180
  days earlier. When renewed (any certificate), add the new file under a
  new name and update `src/pages/certifications.astro`.
- Ideally replace the FSSAI image-PDF with the signed PDF from FoSCoS.

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
- Splash still waits ~2.7–4.8 s on slow 4G desktop and ~9.6 s on slow 3G
  on the homepage (bandwidth-bound). Speed Index regressed ~0.8–1.2 s with
  the splash; LCP/TBT/CLS fine.

### Platform
- **Astro upgrade (4 → 7)** — assessed, trial-built, zero-downtime plan in
  [astro-upgrade.md](astro-upgrade.md). Recommended: Astro 4 has had no
  fixes since Aug 2025 and carries a critical advisory affecting the
  spec-sheet function.

### Minor
- `/404` page's canonical/og:url point at `/404/` (pre-existing, harmless).
