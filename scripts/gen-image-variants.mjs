// Generates smaller copies of the product photos for phones and 1x screens:
//   public/assets/img/products/<name>.webp  →  <name>-480.webp, <name>-800.webp
// The product templates (src/lib/responsive-img.ts) add a srcset only when both
// copies exist, so a photo without them still works (it just isn't resized).
//
// Run after adding or replacing a photo:  node scripts/gen-image-variants.mjs
// Existing copies are left alone (images are cached immutable — a new photo
// always gets a new filename, so its copies are new files too).
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = "public/assets/img/products";
export const WIDTHS = [480, 800];
const isVariant = (f) => /-(\d+)\.webp$/.test(f) && WIDTHS.includes(+f.match(/-(\d+)\.webp$/)[1]);

let made = 0;
for (const f of fs.readdirSync(DIR).filter((f) => f.endsWith(".webp") && !isVariant(f)).sort()) {
  const src = path.join(DIR, f);
  const { width } = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (w >= width) continue; // never upscale; the template then skips the srcset
    const out = src.replace(/\.webp$/, `-${w}.webp`);
    if (fs.existsSync(out)) continue;
    const r = await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(out);
    console.log(`${path.basename(out)}  ${r.width}x${r.height}  ${Math.round(r.size / 1024)} KB`);
    made++;
  }
}
console.log(made ? `${made} variant(s) written` : "all variants up to date");
