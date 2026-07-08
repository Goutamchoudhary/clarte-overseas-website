// @ts-check
import fs from "node:fs";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";

// Private spec-sheet PDFs live OUTSIDE public/ so they have no guessable URL —
// they're only served by the gated /api/spec-sheet function. Bundle them into
// that serverless function via includeFiles.
const specPdfs = fs.existsSync("./spec-pdfs")
  ? fs.readdirSync("./spec-pdfs").filter((f) => f.endsWith(".pdf")).map((f) => `./spec-pdfs/${f}`)
  : [];

// https://astro.build/config
export default defineConfig({
  site: "https://www.clarteoverseas.com",
  // Pages stay prerendered (static, SEO-safe); only routes that opt out with
  // `export const prerender = false` (the spec-sheet API) run as functions.
  output: "hybrid",
  adapter: vercel({ includeFiles: specPdfs }),
  integrations: [tailwind(), sitemap()],
  // 'directory' format → clean URLs (/about-us/ instead of /about-us.html)
  build: { format: "directory" },
});
