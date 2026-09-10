// Per-URL <lastmod> and <image:image> data for the sitemap.
//
// Astro's default sitemap emits a bare <loc> list with no dates, so every page
// looks equally fresh (or equally stale) to Google. That slows re-crawling of
// pages that actually changed — which matters a lot as the blog grows. This
// module resolves an honest last-modified date per route and, for product
// pages, the product photo, and astro.config.mjs feeds them in via serialize().
//
// Dates come from git, not file mtimes: on a CI checkout every file's mtime is
// the clone time, so mtimes would make the whole site look modified on every
// deploy. `git log -1 --format=%cI -- <file>` gives the real date the source
// behind a route last changed. Blog posts override that with their own
// published date, which is the more meaningful signal for an article.

import { execFileSync } from "node:child_process";
import { products, categories } from "../src/data/products.ts";
import { sortedPosts } from "../src/data/blogs.ts";

const BUILD_DATE = new Date().toISOString();

function gitDate(file) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      encoding: "utf8",
    }).trim();
    return out || BUILD_DATE;
  } catch {
    // No git history (shallow clone, tarball deploy) — fall back to build time.
    return BUILD_DATE;
  }
}

// One git call per source file, cached — there are only a handful.
const dateCache = new Map();
function dateFor(file) {
  if (!dateCache.has(file)) dateCache.set(file, gitDate(file));
  return dateCache.get(file);
}

const PRODUCTS_TS = "src/data/products.ts";
const BLOGS_TS = "src/data/blogs.ts";

// route pathname (no host, trailing slash) -> { lastmod, images: string[] }
const meta = new Map();
const set = (path, lastmod, images = []) => meta.set(path, { lastmod, images });

// --- static pages: date each from its own .astro file ------------------------
set("/", dateFor("src/pages/index.astro"));
set("/about/", dateFor("src/pages/about.astro"));
set("/certifications/", dateFor("src/pages/certifications.astro"));
set("/how-we-export/", dateFor("src/pages/how-we-export.astro"));
set("/contact/", dateFor("src/pages/contact.astro"));

// --- product catalogue ------------------------------------------------------
const productsDate = dateFor(PRODUCTS_TS);
set("/products/", productsDate);
for (const c of categories) {
  set(`/products/${c.slug}/`, productsDate);
}
for (const p of products) {
  set(
    `/products/${p.category}/${p.slug}/`,
    productsDate,
    p.image ? [p.image] : [],
  );
}

// --- blog -----------------------------------------------------------------
const blogsDate = dateFor(BLOGS_TS);
// list pages: newest post's date is the freshest thing on /blogs/
const newestPost = sortedPosts[0];
const listDate = newestPost ? isoFromHuman(newestPost.date) || blogsDate : blogsDate;
set("/blogs/", listDate);
// paginated list pages (/blogs/2/, /blogs/3/, ...) share the list date
// (the sitemap already contains whatever pages Astro generated).
for (const post of sortedPosts) {
  set(`/blogs/${post.id}/`, isoFromHuman(post.date) || blogsDate);
}

// "28 May 2026" -> ISO 8601, or null if it doesn't parse.
function isoFromHuman(s) {
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * serialize() hook for @astrojs/sitemap. Adds lastmod, and img for product
 * pages. The `img` key isn't in Astro's SitemapItem type but the underlying
 * `sitemap` package emits <image:image> from it — verified against 3.2.1.
 */
export function sitemapSerialize(item) {
  const { pathname } = new URL(item.url);
  let m = meta.get(pathname);
  // Paginated blog list pages (/blogs/2/, /blogs/3/, ...) — Astro generates
  // them, they aren't in the map; give them the /blogs/ date.
  if (!m && /^\/blogs\/\d+\/$/.test(pathname)) m = meta.get("/blogs/");
  if (!m) return item;
  item.lastmod = m.lastmod;
  if (m.images.length) {
    item.img = m.images.map((url) => ({ url }));
  }
  return item;
}
