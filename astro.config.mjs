// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.clarteoverseas.com",
  integrations: [tailwind(), sitemap()],
  // 'directory' format → clean URLs (/about-us/ instead of /about-us.html)
  build: { format: "directory" },
});
