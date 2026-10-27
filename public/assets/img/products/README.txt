Local product photos, one per product, referenced from src/data/products.ts as
  image: "/assets/img/products/<slug>.webp"

All product photos are self-hosted here (nothing is loaded from the old site
builder's CDN any more). To add or replace one:

  1. Start from the best original you have (PNG/JPG/AVIF).
  2. Convert to <slug>.webp: max 1200px on the long side, WebP quality 78
     (~100-200 KB). sharp is already installed:
       sharp(input).rotate().resize({ width: 1200, height: 1200, fit: "inside",
         withoutEnlargement: true }).webp({ quality: 78, effort: 6 })
  3. REPLACING an existing photo? Give it a NEW filename (e.g. <slug>-v2.webp)
     and update products.ts — images here are cached for a year (see CLAUDE.md).

Still without a photo (emoji placeholder) as of Oct 2026:
  ashwagandha-powder, shatavari-powder, brahmi-powder, triphala-powder,
  giloy-powder, neem-powder, trikatu-powder, watermelon-seeds, chia-seeds,
  pumpkin-seeds, melon-seeds
