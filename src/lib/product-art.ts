// The cute per-product drawing (scripts/gen-product-art.mjs), used wherever a
// product has no photo yet instead of an emoji. Undefined if none was drawn.
import fs from "node:fs";
import path from "node:path";
export const artFor = (slug: string): string | undefined => {
  const src = `/assets/img/products/art/${slug}.svg`;
  return fs.existsSync(path.join(process.cwd(), "public", src)) ? src : undefined;
};
