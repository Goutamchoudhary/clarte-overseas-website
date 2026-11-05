// Responsive srcset for product photos. Smaller copies (<name>-480.webp,
// <name>-800.webp) are made by scripts/gen-image-variants.mjs and committed;
// the full file is 1200px wide. If the copies are missing we return
// undefined and the <img> just uses its plain src.
import fs from "node:fs";
import path from "node:path";

const WIDTHS = [480, 800];
const FULL = 1200;
const cache = new Map<string, string | undefined>();

const variant = (src: string, w: number) => src.replace(/\.webp$/, `-${w}.webp`);
const exists = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

export function srcsetFor(src?: string): string | undefined {
  if (!src || !src.endsWith(".webp")) return undefined;
  if (cache.has(src)) return cache.get(src);
  const ok = WIDTHS.every((w) => exists(variant(src, w)));
  const set = ok ? [...WIDTHS.map((w) => `${variant(src, w)} ${w}w`), `${src} ${FULL}w`].join(", ") : undefined;
  cache.set(src, set);
  return set;
}

/** Smallest copy, for tiny thumbnails. */
export const smallest = (src: string) => (exists(variant(src, WIDTHS[0])) ? variant(src, WIDTHS[0]) : src);

// `sizes` for each slot (CSS px the image occupies at that viewport).
export const SIZES = {
  // .prod-grid: one column below ~600px (card ≈ 100vw − 50px), two columns
  // up to ~1100px, then 250px+ columns (measured 285px at 1440px)
  card: "(max-width: 600px) calc(100vw - 3rem), (max-width: 1100px) 45vw, 320px",
  // .pd-grid: full width below 900px, half of a ~1200px container above
  detail: "(max-width: 899px) calc(100vw - 2.5rem), 600px",
};
