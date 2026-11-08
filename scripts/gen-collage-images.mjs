// Collage-sized copies of each category photo for the V2 "Living Collage"
// version (home hero + product-range bento + page-hero collages):
//   public/assets/img/categories/collage/<slug>-520.webp  (phones, small tiles)
//   public/assets/img/categories/collage/<slug>-900.webp  (desktop tiles)
// Source = the category's big hero photo when it has one, else its card photo.
// Never upscales; a 500px source only gets a -520 copy (at its own size).
// Re-run after replacing a category photo:  node scripts/gen-collage-images.mjs
import fs from "node:fs";
import sharp from "sharp";

const SRC = {
  "ayurvedic-herbal-powders": "herbal-leaf-hero.webp",
  "culinary-spice-powders": "culinary-spice-category-hero.webp",
  "functional-nutritional-powders": "functional-nutritional-powder-hero.webp",
  "dehydrated-vegetable-powders": "dehydrated-veg-powder-hero.webp",
  "fruit-powders": "dehydrated-fruits-powder.webp",
  "edible-seeds-kernels": "edible-seeds-kernels-hero.webp",
  "hydrocolloids-food-additives": "hydrocolloids-additives.webp",
};
const DIR = "public/assets/img/categories";
fs.mkdirSync(`${DIR}/collage`, { recursive: true });
for (const [slug, file] of Object.entries(SRC)) {
  const meta = await sharp(`${DIR}/${file}`).metadata();
  for (const w of [520, 900]) {
    if (w === 900 && meta.width < 900) continue;
    const out = `${DIR}/collage/${slug}-${w}.webp`;
    await sharp(`${DIR}/${file}`).resize({ width: Math.min(w, meta.width), withoutEnlargement: true }).webp({ quality: 76, effort: 6 }).toFile(out);
    console.log(out, fs.statSync(out).size);
  }
}
