// @ts-check
import fs from "node:fs";
import crypto from "node:crypto";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { sitemapSerialize } from "./scripts/sitemap-meta.mjs";

// Private spec-sheet PDFs live OUTSIDE public/ so they have no guessable URL —
// they're only served by the gated /api/spec-sheet function. Bundle them into
// that serverless function via includeFiles.
const specPdfs = fs.existsSync("./spec-pdfs")
  ? fs.readdirSync("./spec-pdfs").filter((f) => f.endsWith(".pdf")).map((f) => `./spec-pdfs/${f}`)
  : [];

// Content hash of the hand-written static assets in public/. Appended to their
// URLs (?v=...) so they can be served with a year-long immutable cache: any edit
// changes the hash, which changes the URL, which busts every visitor's cache.
const ASSET_V = crypto
  .createHash("sha1")
  .update(
    ["css/styles.css", "fonts/fonts.css", "js/script.js", "js/i18n.js", "js/home-fx.js"]
      .map((f) => fs.readFileSync(`./public/${f}`))
      .join("\n"),
  )
  .digest("hex")
  .slice(0, 10);

// https://astro.build/config
export default defineConfig({
  site: "https://www.clarteoverseas.com",
  // Pages stay prerendered (static, SEO-safe); only routes that opt out with
  // `export const prerender = false` (the spec-sheet API) run as functions.
  output: "hybrid",
  adapter: vercel({ includeFiles: specPdfs }),
  integrations: [
    tailwind(),
    // serialize() adds <lastmod> to every known route and <image:image> to
    // product pages — see scripts/sitemap-meta.mjs.
    sitemap({ serialize: sitemapSerialize }),
  ],
  // 'directory' format → clean URLs (/about-us/ instead of /about-us.html)
  build: { format: "directory", inlineStylesheets: "always" },
  vite: { define: { __ASSET_V__: JSON.stringify(ASSET_V) } },
});
