// Post-build step: let the first-visit splash paint before the site CSS lands.
//
// A stylesheet in <head> blocks the first paint of the whole page, splash
// included, so on slow connections visitors saw a blank white screen until
// /css/styles.css arrived (~2s on slow 3G). This moves that stylesheet — and
// every Astro-inlined <style> that followed it in <head> (Tailwind and
// component styles) — to the <!--clarte:site-css--> marker just after the
// splash in <body>, in their ORIGINAL order:
//
//   * Order is the point. styles.css and Tailwind share equal-specificity
//     rules (e.g. .nav-bar{position:relative} vs .sticky), so whichever comes
//     later wins. Moving only the link flipped those ties and unstuck the
//     navbar; moving the whole block together keeps every tie as it was.
//   * The splash's own CSS and the @font-face rules are is:inline <style>s
//     placed BEFORE the link, so they stay in <head> and still apply from the
//     first byte.
//   * An empty <script> after the moved block makes the parser (in every
//     browser — Firefox included) wait for styles.css before parsing, let
//     alone painting, anything after it. No unstyled flash.
//   * The head keeps a <link rel="preload"> so the download still starts at
//     the very top of the document, at full priority.
//
// Source and `astro dev` keep the plain head link; only built HTML changes.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = ".vercel/output/static";
const MARKER = "<!--clarte:site-css-->";
const LINK_RE = /<link rel="stylesheet" href="(\/css\/styles\.css\?v=[^"]+)"\s*\/?>/;

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

async function main() {
  let moved = 0, skipped = 0;
  for await (const file of htmlFiles(ROOT)) {
    let html = await readFile(file, "utf8");
    const headEnd = html.indexOf("</head>");
    const m = LINK_RE.exec(html);
    if (!m || m.index > headEnd || !html.includes(MARKER)) { skipped++; continue; }

    // Astro-inlined <style> blocks between the link and </head>.
    const tail = html.slice(m.index + m[0].length, headEnd);
    const styles = tail.match(/<style>[\s\S]*?<\/style>/g) || [];
    const tailWithout = styles.reduce((t, s) => t.replace(s, ""), tail);

    const head = html.slice(0, m.index) + `<link rel="preload" as="style" href="${m[1]}">` + tailWithout;
    let body = html.slice(headEnd);
    body = body.replace(MARKER, m[0] + styles.join("") + "<script> </script>");
    html = head + body;
    await writeFile(file, html, "utf8");
    moved++;
  }
  console.log(`[defer-site-css] ${moved} pages updated, ${skipped} skipped`);
}

main().catch((err) => {
  console.error("[defer-site-css] failed:", err);
  process.exit(1);
});
