// Post-build step: minify the hand-written stylesheet in the build output.
//
// public/css/styles.css is served as-is by Astro (public/ is a pure
// passthrough), so it ships to production completely unminified. We keep it
// that way on disk deliberately — it's the file everyone edits, and an
// unminified source is much easier to work in — and instead minify only the
// copy that lands in the build output, after `astro build` has already
// copied it there.
import { readFile, writeFile, stat } from "node:fs/promises";
import { transform } from "esbuild";

const SOURCE = "public/css/styles.css";
// Astro (hybrid output, Vercel adapter) copies public/ straight into
// .vercel/output/static/ at the same relative path.
const OUTPUT = ".vercel/output/static/css/styles.css";

async function main() {
  try {
    await stat(OUTPUT);
  } catch {
    console.warn(`[minify-css] ${OUTPUT} not found — skipping (did the build output path change?)`);
    return;
  }

  const css = await readFile(SOURCE, "utf8");
  const before = Buffer.byteLength(css, "utf8");
  const { code, warnings } = await transform(css, { loader: "css", minify: true });
  warnings.forEach((w) => console.warn("[minify-css]", w.text));

  await writeFile(OUTPUT, code, "utf8");
  const after = Buffer.byteLength(code, "utf8");
  const pct = (100 * (1 - after / before)).toFixed(1);
  console.log(`[minify-css] ${SOURCE} → ${OUTPUT}: ${(before / 1024).toFixed(1)} KiB → ${(after / 1024).toFixed(1)} KiB (-${pct}%)`);
}

main().catch((err) => {
  console.error("[minify-css] failed:", err);
  process.exit(1);
});
