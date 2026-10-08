// Post-build step: stamp the serverless function(s) with the Node runtime the
// site was actually built on.
//
// @astrojs/vercel 7.x (the last line that supports Astro 4) only knows Node 18
// and 20. Built on anything newer it falls back to "nodejs18.x", which Vercel
// has retired — and Vercel itself now only builds on Node 24 ("engines" in
// package.json). Left alone, every deploy would ship a function pinned to a
// runtime that no longer exists. Upgrading the adapter means moving to Astro 5,
// so until then this rewrites .vc-config.json to match the build's own Node.
import { readdir, readFile, writeFile } from "node:fs/promises";

const FUNCS = ".vercel/output/functions";
const runtime = `nodejs${process.versions.node.split(".")[0]}.x`;

async function main() {
  let dirs;
  try {
    dirs = (await readdir(FUNCS)).filter((d) => d.endsWith(".func"));
  } catch {
    console.warn(`[vercel-runtime] ${FUNCS} not found — skipping`);
    return;
  }
  for (const d of dirs) {
    const file = `${FUNCS}/${d}/.vc-config.json`;
    const cfg = JSON.parse(await readFile(file, "utf8"));
    if (typeof cfg.runtime !== "string" || !cfg.runtime.startsWith("nodejs")) continue; // edge etc.
    if (cfg.runtime !== runtime) {
      console.log(`[vercel-runtime] ${d}: ${cfg.runtime} → ${runtime}`);
      cfg.runtime = runtime;
      await writeFile(file, JSON.stringify(cfg, null, "\t") + "\n", "utf8");
    }
  }
}

main().catch((err) => {
  console.error("[vercel-runtime] failed:", err);
  process.exit(1);
});
