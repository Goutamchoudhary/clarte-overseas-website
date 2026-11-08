// Photo + label data for the V2 "Living Collage" pieces (home hero collage,
// product-range bento, page-hero collages). Images come from
// scripts/gen-collage-images.mjs; a category without a -900 copy uses -520 only.
import fs from "node:fs";
import path from "node:path";
import { categories, productsByCategory } from "../data/products";

const DIR = "/assets/img/categories/collage";
const has = (p: string) => fs.existsSync(path.join(process.cwd(), "public", p));

export type CollageCat = {
  slug: string;
  name: string;
  i18n: string; // data-i18n key for the category name
  count: number;
  href: string;
  src: string; // default src (smallest)
  srcset: string; // "…-520.webp 520w, …-900.webp 900w" (or just 520w)
  big: string; // largest available
  /** Landscape product photos in this category (for in-tile cycling). */
  products: { src: string; name: string }[];
};

export const collageCats: CollageCat[] = categories.map((c) => {
  const s520 = `${DIR}/${c.slug}-520.webp`;
  const s900 = `${DIR}/${c.slug}-900.webp`;
  const big = has(s900) ? s900 : s520;
  const items = productsByCategory(c.slug);
  return {
    slug: c.slug,
    name: c.name,
    i18n: `products.cat_${c.slug.replace(/-/g, "_")}_name`,
    count: items.length,
    href: `/products/${c.slug}`,
    src: s520,
    srcset: has(s900) ? `${s520} 520w, ${s900} 900w` : `${s520} 500w`,
    big,
    products: items.filter((p) => p.listImage).map((p) => ({ src: p.listImage!, name: p.name })),
  };
});

export const totalProducts = collageCats.reduce((n, c) => n + c.count, 0);
