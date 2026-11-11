Local product photos, referenced from src/data/products.ts. All product photos
are self-hosted here (nothing loads from the old site builder's CDN).

PHOTO MIGRATION (Nov 2026 onwards) — each product gets a new photo set:
  image:     "/assets/img/products/<slug>-v2.webp"    1:1, product page
  listImage: "/assets/img/products/<slug>-wide.webp"  landscape, category list
                                                       card + related tiles
  gallery:   [{ src: "/assets/img/products/<slug>-<extra>.webp", alt: "..." }]
             optional extra product-page photos (thumbnail gallery)
A product with a listImage automatically gets the full-bleed photo layout;
products without one keep the old centred cut-out layout.

Done: functional-nutritional-powders (amla + dried-amla gallery, amchur,
lemon, beetroot); ayurvedic-herbal-powders: all nine (moringa, tulsi,
ashwagandha, shatavari, brahmi, triphala, giloy, neem, trikatu).

How to add a set:
  1. Drop the originals (any format) in the git-ignored folder
       incoming/product-photos/<category-slug>/landscape/<slug>.png
       incoming/product-photos/<category-slug>/square/<slug>.png
  2. Convert with sharp (already installed) — max 1200px on the long side,
     WebP quality 78 (~100-200 KB):
       sharp(input).rotate().resize({ width: 1200, height: 1200, fit: "inside",
         withoutEnlargement: true }).webp({ quality: 78, effort: 6 })
  3. ALWAYS a new filename (-v2, -wide, -v3 ...) — images here are cached for a
     year (see CLAUDE.md); never overwrite a file in place. Delete the replaced
     file (and its -480/-800 copies) once nothing references it.
  4. Make the phone-sized copies (-480, -800) for every new file:
       node scripts/gen-image-variants.mjs
     The templates pick them up automatically via srcset (src/lib/responsive-img.ts).
  5. Set image / listImage / gallery in products.ts, run `npm run build`, and
     check the category list, the product page and the related tiles.

Still without any photo as of 11 Nov 2026 (their drawing from
scripts/gen-product-art.mjs stands in on cards, tiles and the product page):
  seed-spices-sesame: cumin-seeds, coriander-seeds, fenugreek-seeds,
  ajwain-seeds, sesame-seeds
  culinary-spice-powders: turmeric-powder, red-chilli-powder, kasuri-methi
The seed-spices-sesame category image (categories/collage/seed-spices-sesame-*.webp
and categories/seed-spices-sesame*.webp) is an illustrated stand-in; replace it
with a real photo under a new filename.
