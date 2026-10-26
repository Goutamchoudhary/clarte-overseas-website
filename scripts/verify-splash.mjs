// Splash verification harness (see docs/handoff/first-visit-splash.md,
// "Verification results"). Drives a fresh headless Chrome over CDP — no npm deps,
// needs Node 22+ (global WebSocket) and a local Chrome.
//
//   node scripts/verify-splash.mjs <url> <mode> <outdir> [width height] [cpu] [net]
//
//   mode   frames — splash marks, FCP/LCP/CLS, rAF frame gaps through the
//                   logo animation and the exit crossfade
//          shots  — midway / logo drawn / crossfade / after PNGs into <outdir>
//                   (animations slowed to 20% so each stage is catchable)
//          centre — on-screen ink bounds of icon + wordmark vs the intended
//                   centre (x = 50%, group y = 47%), reduced motion = at rest
//   cpu    CPU slowdown factor (4 ≈ mid-range phone)
//   net    none | slow4g | slow3g
//
// Test against a production build (npm run build, then serve
// .vercel/output/static) or the live site — never astro dev (see CLAUDE.md).
// Third-party trackers are blocked so runs don't register as visitors/leads.
// Set CHROME_PATH if Chrome isn't at the default macOS location.
import { spawn } from "node:child_process";
import fs from "node:fs";

const [url, mode, out, W = "1366", H = "768", cpu = "1", net = "none"] = process.argv.slice(2);
const w = +W, h = +H;
const port = 9300 + Math.floor(Math.random() * 500);
const prof = `${out}/prof-${port}`;
const chrome = spawn(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`,
  "--no-first-run", "--disable-renderer-backgrounding", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--no-default-browser-check", `--window-size=${w},${h}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ver;
for (let i = 0; i < 50; i++) {
  try { ver = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (ver.length) break; } catch {}
  await sleep(200);
}
const page = ver.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id; pending.set(i, (m) => m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result));
  ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result.value;

await send("Page.enable"); await send("Page.bringToFront"); await send("Emulation.setFocusEmulationEnabled", { enabled: true }); await send("Runtime.enable"); await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Network.setBlockedURLs", { urls: ["*leadsy*", "*calendly*", "*googletagmanager*", "*google-analytics*", "*clarity.ms*", "*/_vercel/insights/*", "*/_vercel/speed-insights/*", "*web3forms*", "*instantly*"] });
await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
if (+cpu > 1) await send("Emulation.setCPUThrottlingRate", { rate: +cpu });
if (net === "slow4g") await send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
if (net === "slow3g") await send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 400e3 / 8, uploadThroughput: 400e3 / 8 });
if (mode === "shots") { await send("Animation.enable"); await send("Animation.setPlaybackRate", { playbackRate: 0.2 }); }
if (mode === "centre") await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

// Recorder injected before any page script runs.
await send("Page.addScriptToEvaluateOnNewDocument", { source: `
  window.__frames = [];
  (function loop(t){ window.__frames.push(t); requestAnimationFrame(loop); })(performance.now());
  window.__cls = 0;
  try { new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({type:"layout-shift", buffered:true}); } catch(e){}
  window.__lcp = 0;
  try { new PerformanceObserver(l => { const e = l.getEntries().at(-1); if (e) window.__lcp = e.startTime; }).observe({type:"largest-contentful-paint", buffered:true}); } catch(e){}
  window.__centre = null;
  document.addEventListener("DOMContentLoaded", function () {
    function ink(sel) {
      var s = document.querySelector(sel); if (!s) return null;
      var b = s.getBBox(), m = s.getScreenCTM();
      var p1 = new DOMPoint(b.x, b.y).matrixTransform(m), p2 = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(m);
      return { left: p1.x, top: p1.y, right: p2.x, bottom: p2.y };
    }
    var mk = ink("#cs .cs-mark"), wd = ink("#cs .cs-word");
    window.__centre = mk && wd ? { vw: innerWidth, vh: innerHeight, mark: mk, word: wd } : null;
  });
` });

const t0 = Date.now();
await send("Page.navigate", { url });
const shots = [];
const shot = async (label) => {
  const r = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(`${out}/${label}.png`, Buffer.from(r.data, "base64")); shots.push(label);
};
const marks = () => evaluate(`JSON.stringify(Object.fromEntries(performance.getEntriesByType("mark").filter(m=>m.name.startsWith("splash")).map(m=>[m.name, Math.round(m.startTime)])))`).then((s) => s ? JSON.parse(s) : {}).catch(() => ({}));

if (mode === "shots") {
  // Midway through the logo, then fully drawn, mid-crossfade and after.
  await sleep(5000); await shot("1-midway");
  for (;;) { const m = await marks(); if (m["splash:logo-finished"]) break; await sleep(25); }
  await shot("2-logo-drawn");
  for (;;) { const b = await evaluate(`document.documentElement.hasAttribute("data-booted")`).catch(() => false); if (b) break; await sleep(10); }
  await sleep(700); await shot("3-mid-crossfade");
  for (;;) { const g = await evaluate(`document.documentElement.hasAttribute("data-boot-gone")`).catch(() => false); if (g) break; await sleep(50); }
  await sleep(1200); await shot("4-after");
} else {
  for (;;) {
    const g = await evaluate(`document.documentElement.hasAttribute("data-boot-gone") || (document.readyState==="complete" && !document.getElementById("cs"))`).catch(() => false);
    if (g) break;
    if (Date.now() - t0 > 40000) break;
    await sleep(100);
  }
  await sleep(1500);
}

const res = JSON.parse(await evaluate(`JSON.stringify({ marks: Object.fromEntries(performance.getEntriesByType("mark").filter(m=>m.name.startsWith("splash")).map(m=>[m.name, Math.round(m.startTime)])), frames: window.__frames, cls: window.__cls, lcp: Math.round(window.__lcp), fcp: Math.round((performance.getEntriesByName("first-contentful-paint")[0]||{}).startTime||0), load: Math.round(performance.getEntriesByType("navigation")[0].loadEventStart), centre: window.__centre })`));

const out2 = { url, mode, viewport: `${w}x${h}`, cpu: +cpu, net, marks: res.marks, fcp: res.fcp, lcp: res.lcp, load: res.load, cls: +res.cls.toFixed(4) };
if (mode === "frames") {
  const ex = res.marks["splash:exit-start"];
  const win = res.frames.filter((t) => t >= ex - 100 && t <= ex + 800);
  const gaps = win.slice(1).map((t, i) => t - win[i]);
  out2.crossfade = { window: "exit-start −100ms … +800ms", frames: win.length, maxGapMs: +Math.max(...gaps).toFixed(1), over33: gaps.filter((g) => g > 33.4).length, over20: gaps.filter((g) => g > 20).length };
  const anim = res.frames.filter((t) => t <= ex);
  const ag = anim.slice(1).map((t, i) => t - anim[i]).filter((_, i) => anim[i] > (res.fcp || 0));
  out2.logoAnimation = { maxGapMs: +Math.max(...ag).toFixed(1), over33: ag.filter((g) => g > 33.4).length };
}
if (mode === "centre" && res.centre) {
  const c = res.centre, r = (n) => +n.toFixed(2);
  const groupMid = (c.mark.top + c.word.bottom) / 2;
  out2.centre = {
    iconCentreX_minus_vwHalf: r((c.mark.left + c.mark.right) / 2 - c.vw / 2),
    wordCentreX_minus_vwHalf: r((c.word.left + c.word.right) / 2 - c.vw / 2),
    groupCentreY_minus_47pct: r(groupMid - 0.47 * c.vh),
    iconInkHeight: r(c.mark.bottom - c.mark.top), iconInkWidth: r(c.mark.right - c.mark.left),
    wordInkWidth: r(c.word.right - c.word.left), wordInkHeight: r(c.word.bottom - c.word.top),
    gapIconToWord: r(c.word.top - c.mark.bottom),
  };
}
if (shots.length) out2.shots = shots;
console.log(JSON.stringify(out2));
ws.close(); chrome.kill();
await sleep(500);
fs.rmSync(prof, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
