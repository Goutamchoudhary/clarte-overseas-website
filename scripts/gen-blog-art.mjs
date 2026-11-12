// Draws one flat vector cover per blog post into public/assets/img/blog/<id>-v2.svg (v2 = navy and turmeric palette, Nov 2026).
// Run: node scripts/gen-blog-art.mjs
// A new post needs a line in ART below. Images are served immutable, so once a
// cover has shipped, change it under a new filename rather than in place.
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public/assets/img/blog");

const G = (x, y, s, inner, r = 0) => `<g transform="translate(${x} ${y})${r ? ` rotate(${r})` : ""} scale(${s})">${inner}</g>`;
const circ = (x, y, r, f, extra = "") => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${extra}/>`;
const ell = (x, y, rx, ry, f, extra = "") => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${extra}/>`;
const rect = (x, y, w, h, r, f, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" ${extra}/>`;
const P = (d, f, extra = "") => `<path d="${d}" fill="${f}" ${extra}/>`;
const L = (d, c, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const leaf = (len, w, f, rib = "#ffffff55") => P(`M0 0C${w} ${-len * 0.3} ${w} ${-len * 0.75} 0 ${-len}C${-w} ${-len * 0.75} ${-w} ${-len * 0.3} 0 0Z`, f) + L(`M0 -4V${-len + 8}`, rib, 2);
const serrated = (len, w, f, rib = "#ffffff66") => {
  let a = "M0 0", b = "";
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const t = i / n, sp = Math.sin(Math.PI * Math.min(1, t * 1.05)) * w;
    a += `L${(sp * 1.14).toFixed(1)} ${(-len * (t - 0.08)).toFixed(1)}L${(sp * 0.82).toFixed(1)} ${(-len * t).toFixed(1)}`;
    b = `L${(-sp * 0.82).toFixed(1)} ${(-len * t).toFixed(1)}L${(-sp * 1.14).toFixed(1)} ${(-len * (t - 0.08)).toFixed(1)}` + b;
  }
  return P(`${a}L0 ${-len}${b}Z`, f) + L(`M0 -4V${-len + 10}`, rib, 2);
};
const seeds = (pts, f, r = 4) => pts.map(([x, y]) => circ(x, y, r, f)).join("");
const ring = (n, R, cb) => Array.from({ length: n }, (_, i) => cb((i * 2 * Math.PI) / n, R)).join("");

// ---- Ingredients: centred on 0,0, roughly 200 units across ----
const roundFruit = (body, shade) => circ(0, 0, 66, body) + P("M40 -52A66 66 0 0 1 -50 43A74 74 0 0 0 40 -52Z", shade) + ell(-24, -28, 13, 19, "#ffffff55", 'transform="rotate(35 -24 -28)"');
const halfSlice = (x, y, s, rim, flesh, core, seedC) => G(x, y, s, circ(0, 0, 58, rim) + circ(0, 0, 50, flesh) + circ(0, 0, 26, core) + seedC);

const S = {
  guava: { bg: "#eff7dc", powder: "#f3b6b0", draw: G(-28, -14, 1, roundFruit("#b2d564", "#92bc47") + P("M-6 -66L0 -80L8 -66Z", "#6d8f30")) + halfSlice(62, 42, 0.92, "#a4cb57", "#f7a6a9", "#fbc8c5", seeds([[-10, -8], [10, -10], [0, 10], [14, 8], [-14, 10]], "#e7d9a5"))},
  pineapple: { bg: "#fff4d4", powder: "#f4cf63", draw: ring(1, 0, () => "") + [-46, -26, -8, 12, 34, 52].map((a, i) => G(0, -36, 1, leaf(72 - Math.abs(i - 2.5) * 9, 11, i % 2 ? "#3f9d50" : "#2f8341"), a * 0.9)).join("") + ell(0, 28, 56, 70, "#f3b733") + L("M-44 -14L34 88M-52 22L0 92M-16 -40L54 54M22 -38L54 8M44 -14L-34 88M52 22L0 92M16 -40L-54 54M-22 -38L-54 8", "#d9911f", 3) + ell(-22, 8, 9, 22, "#ffffff44")},
  banana: { bg: "#fff6cf", powder: "#efdb9a", draw: P("M-70 -44C-58 34 8 74 78 58C86 52 84 42 74 42C22 44 -32 16 -50 -52C-54 -62 -70 -58 -70 -44Z", "#f6cf3e") + P("M-44 -74C-20 6 34 42 88 22C96 16 92 6 84 8C42 16 0 -10 -24 -80C-28 -92 -48 -86 -44 -74Z", "#f9dc5c") + P("M-44 -74L-52 -96L-36 -98L-24 -80Z", "#8a6a2b") + L("M-34 -66C-12 0 36 30 80 14", "#e0ba34", 3)},
  apple: { bg: "#ffe9e6", powder: "#efd6a8", draw: P("M0 -44C-24 -66 -82 -56 -82 4C-82 52 -44 92 -20 86C-10 84 -6 80 0 80C6 80 10 84 20 86C44 92 82 52 82 4C82 -56 24 -66 0 -44Z", "#df3b3f") + P("M48 -48C78 -36 88 16 66 54C54 74 34 88 20 86C60 56 66 -8 48 -48Z", "#bb2a33") + ell(-40, -14, 12, 24, "#ffffff55", 'transform="rotate(18 -40 -14)"') + L("M0 -46C0 -62 4 -72 12 -80", "#6e4a22", 6) + G(10, -62, 1, leaf(52, 15, "#4f9e3f"), 62)},
  mango: { bg: "#fff0d6", powder: "#f7c04a", draw: P("M-14 -86C42 -92 86 -34 72 24C60 74 8 96 -38 76C-84 54 -92 -2 -68 -44C-58 -66 -38 -84 -14 -86Z", "#f8a62a") + P("M-14 -86C42 -92 86 -34 72 24C66 50 50 68 30 76C62 30 48 -50 -14 -86Z", "#e8742f") + P("M-66 -40C-92 2 -82 54 -38 76C-64 40 -70 -8 -66 -40Z", "#f9cf45") + L("M-14 -86C-14 -96 -8 -102 -2 -106", "#6e4a22", 6) + G(-6, -96, 1, leaf(66, 15, "#3f9d50"), -68)},
  tamarind: { bg: "#f6ebdd", powder: "#a9673a", draw: G(0, -30, 1, P("M-92 -6C-76 -36 -56 -18 -38 -28C-18 -40 2 -20 22 -30C42 -40 60 -18 84 -30C100 -38 104 -18 92 -8C74 10 56 2 36 12C16 22 -4 2 -24 12C-44 22 -62 6 -80 16C-96 22 -102 10 -92 -6Z", "#a06a38") + L("M-74 -8C-56 -14 -40 -6 -22 -14C0 -22 20 -6 42 -14C58 -18 72 -14 84 -18", "#7c4c26", 3)) + G(6, 42, 1, P("M-78 -8C-58 -26 -32 -10 -8 -18C20 -28 54 -16 78 -22C90 -18 86 2 70 8C44 18 16 8 -10 16C-36 22 -62 16 -80 12C-90 8 -88 0 -78 -8Z", "#6e3d1e") + seeds([[-50, -2], [-14, 0], [24, -6], [56, -6]], "#3f2212", 8))},
  papaya: { bg: "#ffeedd", powder: "#f7a14e", draw: P("M0 -92C50 -88 76 -24 72 26C68 76 34 96 0 96C-34 96 -68 76 -72 26C-76 -24 -50 -88 0 -92Z", "#7fb04b") + P("M0 -82C42 -78 64 -22 60 26C56 68 28 84 0 84C-28 84 -56 68 -60 26C-64 -22 -42 -78 0 -82Z", "#f58a3c") + P("M0 -34C18 -32 28 2 26 28C24 50 12 58 0 58C-12 58 -24 50 -26 28C-28 2 -18 -32 0 -34Z", "#c9531e") + seeds([[-9, -6], [8, -10], [-12, 16], [12, 12], [0, 2], [-8, 36], [9, 34], [0, 20], [0, 46]], "#23180f", 5.5)},
  guar: { bg: "#e9f5dc", powder: "#ece2bf", draw: L("M-58 -82C-18 -66 18 -62 66 -84", "#5d8f3f", 6) + [[-40, -68, 8, 152], [-22, -66, 3, 170], [-4, -64, -2, 158], [14, -66, -6, 172], [32, -70, -10, 150], [-12, -62, 12, 118], [24, -66, -14, 122]].map(([x, y, a, l], i) => G(x, y, 1, P(`M-6 0C-10 ${l * 0.4} -9 ${l * 0.8} 0 ${l}C9 ${l * 0.8} 10 ${l * 0.4} 6 0Z`, i % 2 ? "#74b344" : "#5fa03a") + seeds([0.2, 0.38, 0.56, 0.74].map((t) => [0, l * t]), "#9bd066", 3.6), a)).join("") + [[-58, -84, -62], [-58, -84, 8], [-58, -84, 66], [66, -86, -58], [66, -86, 12], [66, -86, 70]].map(([x, y, a], i) => G(x, y, 1, leaf(i % 3 === 1 ? 62 : 52, 17, i % 2 ? "#3d8a41" : "#4b9a48"), a)).join("")},
  moringa: { bg: "#e4f4de", powder: "#8fb54a", draw: L("M0 92C-4 30 2 -30 0 -92", "#6d8f30", 5) + [-70, -40, -10, 20, 50, 78].map((y, i) => G(0, y, 1, [1, -1].map((d) => [34, 62, 88].map((x, j) => ell(d * x, -j * 6 - 8, 13, 8, i % 2 ? "#5fa83f" : "#4b9636", `transform="rotate(${d * -22} ${d * x} ${-j * 6 - 8})"`)).join("") + L(`M0 0Q${d * 50} -10 ${d * 100} -18`, "#6d8f30", 2.5)).join(""))).join("")},
  pomegranate: { bg: "#ffe5e8", powder: "#d7415f", draw: G(-20, -10, 1, P("M-16 -68L-24 -94L-6 -84L0 -98L8 -84L24 -94L16 -68Z", "#a81f3c") + circ(0, 0, 72, "#d32b4a") + P("M46 -56A72 72 0 0 1 -56 46A80 80 0 0 0 46 -56Z", "#ad1f3d") + ell(-28, -30, 13, 20, "#ffffff55", 'transform="rotate(35 -28 -30)"')) + halfSlice(62, 50, 0.85, "#c9304e", "#f8d7c6", "#f8d7c6", [[-26, -16], [-8, -26], [12, -24], [28, -10], [-30, 6], [-12, -4], [8, -6], [28, 10], [-20, 24], [0, 18], [18, 28], [-4, 36]].map(([x, y]) => ell(x, y, 8, 9.5, "#c81d43")).join(""))},
  tulsi: { bg: "#e9eef6", powder: "#7a8f46", draw: L("M0 96C-6 40 4 -16 0 -66", "#6a4a7a", 6) + [[-14, 62, 62], [-6, 8, 52], [-2, -38, 42]].map(([, y, l], i) => [1, -1].map((d) => G(0, y, 1, leaf(l + 18, l * 0.45, i === 1 ? "#6e9b45" : "#5a8a3c"), d * 70)).join("")).join("") + G(0, -64, 1, L("M0 0V-50", "#7a4f8e", 5) + [-44, -32, -20, -10].map((y, i) => circ(-7, y, 5, "#9a6bbd") + circ(7, y - 4, 5, "#b48ad1")).join(""))},
  ashwagandha: { bg: "#f5ecdc", powder: "#cdb07f", draw: G(0, -28, 1, P("M-24 -14C-14 -24 14 -24 24 -14C22 22 18 48 28 92C14 76 8 62 4 100C0 76 -6 64 -18 104C-16 70 -20 44 -34 72C-26 34 -24 14 -24 -14Z", "#c9a06b") + L("M-10 4C-8 30 -8 44 -8 66M10 0C10 24 12 38 12 58", "#a57c49", 3) + G(0, -16, 1, leaf(70, 20, "#5f8f42"), -38) + G(0, -16, 1, leaf(76, 21, "#6fa04d"), 34) + G(0, -16, 1, L("M0 0C10 -24 18 -40 40 -52", "#6d8f30", 3) + circ(42, -54, 10, "#e0512d") + circ(30, -66, 8, "#ef6b3c")))},
  shatavari: { bg: "#eef2f9", powder: "#e9d9b3", draw: G(0, 8, 1, [[-46, 74, 20], [-22, 88, -10], [2, 92, 4], [24, 88, 14], [48, 72, -18]].map(([x, l, a]) => G(x * 0.24, -24, 1, P(`M-11 0C-16 ${l * 0.4} -9 ${l * 0.9} 0 ${l}C9 ${l * 0.9} 16 ${l * 0.4} 11 0Z`, "#e0c58e") + L(`M-4 ${l * 0.3}Q-2 ${l * 0.5} -3 ${l * 0.72}`, "#c5a66b", 2), a * 1.6)).join("") + ell(0, -26, 28, 12, "#b08d55") + [-36, -18, 0, 18, 36].map((a) => G(0, -30, 1, L("M0 0C-4 -30 -2 -60 0 -82", "#5d8f3f", 3) + [-22, -38, -54, -68].map((y) => L(`M0 ${y}L-14 ${y - 9}M0 ${y}L14 ${y - 9}`, "#6fa04d", 2.4)).join(""), a)).join(""))},
  brahmi: { bg: "#e5f5ef", powder: "#7fa257", draw: L("M-88 66C-46 26 -14 54 18 22C44 -4 62 -6 90 -40", "#7a9b49", 5) + [[-70, 50], [-42, 40], [-16, 46], [12, 26], [38, 6], [64, -14], [86, -36]].map(([x, y], i) => [1, -1].map((d) => ell(x + d * 4, y + d * 22 * (i % 2 ? -1 : 1) - 8, 20, 15, d > 0 ? "#57a06a" : "#3f8b58", `transform="rotate(${d * 24} ${x} ${y})"`)).join("")).join("") + circ(54, -58, 7, "#eef2fa") + circ(54, -58, 3, "#b7c6e6") + circ(-22, 8, 7, "#eef2fa") + circ(-22, 8, 3, "#b7c6e6")},
  triphala: { bg: "#f1f2d9", powder: "#b19549", draw: G(-46, 36, 0.78, roundFruit("#bed37a", "#9db75a") + L("M0 -64C-24 -24 -24 24 0 64M0 -64C24 -24 24 24 0 64", "#9db75a", 3)) + G(52, 42, 0.78, P("M0 -80C42 -62 60 -10 44 34C32 64 12 76 0 76C-12 76 -32 64 -44 34C-60 -10 -42 -62 0 -80Z", "#c99c3f") + P("M0 -80C42 -62 60 -10 44 34C36 56 22 70 10 74C42 34 34 -46 0 -80Z", "#a57c2b") + L("M-16 -50C-24 -8 -24 34 -10 66", "#a57c2b", 3)) + G(4, -46, 0.78, circ(0, 0, 60, "#8a5f35") + P("M36 -48A60 60 0 0 1 -44 40A66 66 0 0 0 36 -48Z", "#6d4826") + ell(-20, -24, 11, 16, "#ffffff44", 'transform="rotate(35 -20 -24)"'))},
  giloy: { bg: "#e6f3e4", powder: "#a5a56c", draw: L("M-20 100C60 60 -60 26 14 -14C72 -44 -8 -70 18 -102", "#9b8350", 9) + L("M-20 100C60 60 -60 26 14 -14C72 -44 -8 -70 18 -102", "#b89f68", 3) + [[-46, 64, -70, 50], [50, 44, 70, 56], [-34, 6, -60, 56], [54, -40, 62, 46], [-24, -66, -46, 42]].map(([x, y, a, l]) => G(x * 0.5, y, 1, P(`M0 0C${l * 0.5} ${-l * 0.08} ${l * 0.68} ${-l * 0.7} 0 ${-l * 1.08}C${-l * 0.68} ${-l * 0.7} ${-l * 0.5} ${-l * 0.08} 0 0Z`, a > 0 ? "#57a047" : "#469038") + L(`M0 -6V${-l * 0.9}`, "#ffffff66", 2), a)).join("")},
  neem: { bg: "#e4f2dc", powder: "#7c9848", draw: G(0, 90, 1, L("M0 0C-6 -60 0 -120 4 -176", "#6d8f30", 5) + [24, 52, 80, 108, 136].map((y, i) => [1, -1].map((d) => G(d * 2, -y, 1, serrated(64 - i * 5, 12, i % 2 ? "#4f9a3d" : "#3f8a35"), d * 62)).join("")).join("") + G(4, -174, 1, serrated(46, 11, "#5ca649")) + circ(-26, -18, 8, "#d9c04f") + circ(-14, -8, 7, "#e4cf63"))},
  trikatu: { bg: "#fbeedb", powder: "#b9823f", draw: G(-30, -30, 0.78, ginger()) + G(66, -38, 1, ["M0 -56C13 -56 15 -30 13 0C12 24 8 44 0 52C-8 44 -12 24 -13 0C-15 -30 -13 -56 0 -56Z"].map((d) => P(d, "#4a3a2a")).join("") + Array.from({ length: 7 }, (_, i) => L(`M-11 ${-44 + i * 13}Q0 ${-38 + i * 13} 11 ${-44 + i * 13}`, "#6c5740", 2.4)).join("") + L("M0 -56V-74", "#6d8f30", 4), 24) + seeds([[-32, 62], [-10, 72], [14, 62], [34, 76], [-46, 80], [6, 86], [-22, 88], [28, 92]], "#2c2118", 11) + seeds([[-35, 59], [-13, 69], [11, 59], [31, 73]], "#5a4a3a", 3)},
  redonion: { bg: "#f7e4f0", powder: "#c98aa6", draw: onion("#8d2a63", "#6e1d4c", "#d58cb4", "#f6e3ee") },
  pinkonion: { bg: "#ffe9f1", powder: "#eab7c5", draw: onion("#dc7ea3", "#c15f88", "#f1b9cd", "#fdeef3") },
  whiteonion: { bg: "#f1f3fa", powder: "#f3ecd8", draw: onion("#f6efd9", "#ddd2ae", "#e8e0c6", "#ffffff") },
  garlic: { bg: "#eef1f7", powder: "#eee0b8", draw: G(-16, -8, 1, P("M0 -86C8 -60 30 -52 56 -30C88 -2 78 58 40 72C24 78 10 74 0 70C-10 74 -24 78 -40 72C-78 58 -88 -2 -56 -30C-30 -52 -8 -60 0 -86Z", "#f7f2ea") + L("M0 -60C-22 -28 -32 28 -14 66M0 -60C22 -28 32 28 14 66", "#d9c9e8", 3) + L("M-48 -22C-68 8 -62 44 -38 62M48 -22C68 8 62 44 38 62", "#b89ad0", 4) + L("M-26 76L-30 88M-8 76V92M12 76L14 90M30 74L34 86", "#c7b995", 3)) + G(68, 54, 0.9, P("M0 -46C26 -20 34 14 22 36C14 46 -14 46 -22 36C-34 14 -26 -20 0 -46Z", "#fbf6e6") + P("M0 -46C26 -20 34 14 22 36C18 42 10 44 2 44C20 12 16 -22 0 -46Z", "#ecdfbd"), 18)},
  ginger: { bg: "#fbf0dc", powder: "#dfb765", draw: ginger() },
  greenchilli: { bg: "#e5f6dd", powder: "#7ea83f", draw: G(-14, 0, 1, P("M-46 -70C-60 -14 -38 56 62 88C74 90 76 80 66 74C8 40 -14 -8 -18 -64C-18 -76 -42 -80 -46 -70Z", "#4ca63c") + L("M-36 -60C-34 -8 -10 44 56 80", "#7bc95f", 4) + P("M-48 -70C-46 -84 -18 -82 -16 -66C-26 -60 -40 -62 -48 -70Z", "#3a7f2e") + L("M-32 -80C-30 -92 -22 -98 -12 -100", "#5f7f2e", 6)) + G(40, -4, 0.82, P("M-46 -70C-60 -14 -38 56 62 88C74 90 76 80 66 74C8 40 -14 -8 -18 -64C-18 -76 -42 -80 -46 -70Z", "#62b84a") + P("M-48 -70C-46 -84 -18 -82 -16 -66C-26 -60 -40 -62 -48 -70Z", "#3a7f2e") + L("M-32 -80C-30 -92 -22 -98 -12 -100", "#5f7f2e", 6), 14)},
  friedonion: { bg: "#fff1da", powder: "#c98b35", draw: G(0, 30, 1, P("M-88 -6C-82 56 -44 72 0 72C44 72 82 56 88 -6Z", "#1f4693") + rect(-34, 70, 68, 9, 4, "#16346f") + ell(0, -6, 88, 16, "#2c5bb0") + ell(0, -10, 80, 12, "#a9651f")) + [[-54, -4], [-28, -22], [2, -32], [32, -20], [58, -6], [-40, 14], [-12, 2], [18, 6], [44, 12], [0, -8]].map(([x, y], i) => L(`M${x - 18} ${y + 8}C${x - 10} ${y - 12} ${x + 12} ${y - 10} ${x + 18} ${y + 6}`, ["#c98b35", "#e2a94b", "#a9651f"][i % 3], 7)).join("")},
  curryleaf: { bg: "#e3f2df", powder: "#4f7a33", draw: G(0, 92, 1, L("M0 0C-2 -60 2 -120 0 -176", "#6d7f2e", 5) + [20, 48, 76, 104, 132, 156].map((y, i) => [1, -1].map((d) => G(0, -y, 1, leaf(66 - i * 6, 15, i % 2 ? "#3c8a3a" : "#2f7a33"), d * 58)).join("")).join("") + G(0, -176, 1, leaf(44, 13, "#46963f")))},
  coriander: { bg: "#e9f7dd", powder: "#5f9a40", draw: G(0, 92, 1, L("M0 0C-4 -40 -2 -80 0 -96M0 -70C-20 -90 -36 -100 -50 -108M0 -62C20 -82 38 -94 54 -100", "#6fa04d", 4) + [[-52, -118, -16, 52], [58, -110, 22, 50], [0, -104, 0, 62]].map(([x, y, a, r]) => G(x, y, 1, P(`M0 ${r * 0.42}C${-r} ${r * 0.34} ${-r * 0.9} ${-r * 0.32} ${-r * 0.54} ${-r * 0.3}C${-r * 0.56} ${-r * 0.72} ${-r * 0.16} ${-r * 0.9} 0 ${-r * 0.66}C${r * 0.16} ${-r * 0.9} ${r * 0.56} ${-r * 0.72} ${r * 0.54} ${-r * 0.3}C${r * 0.9} ${-r * 0.32} ${r} ${r * 0.34} 0 ${r * 0.42}Z`, x === 0 ? "#57a747" : "#449638") + L(`M0 ${r * 0.34}V${-r * 0.5}M0 ${r * 0.1}L${-r * 0.42} ${-r * 0.16}M0 ${r * 0.1}L${r * 0.42} ${-r * 0.16}`, "#ffffff66", 2), a)).join(""))},
  mint: { bg: "#dff6ec", powder: "#63ab7b", draw: G(0, 92, 1, L("M0 0V-112", "#5f9a60", 6) + [[30, 78, 1], [30, 78, -1], [78, 66, 1], [78, 66, -1]].map(([y, l, d]) => G(0, -y, 1, serrated(l, 24, y === 30 ? "#2f9a68" : "#3cae7a"), d * 62)).join("") + G(0, -106, 1, serrated(72, 24, "#46bd86") + G(0, 0, 1, serrated(58, 19, "#35a874"), -34) + G(0, 0, 1, serrated(58, 19, "#35a874"), 34)))},
  amla: { bg: "#eef6d6", powder: "#c8cf88", draw: G(-30, -12, 1.05, roundFruit("#c5d980", "#a7c05f") + L("M0 -64C-26 -24 -26 24 0 64M0 -64C26 -24 26 24 0 64M-44 -46C-66 -14 -66 16 -46 44M44 -46C66 -14 66 16 46 44", "#a7c05f", 3) + L("M0 -66V-82", "#7c6a3a", 5)) + G(62, 56, 0.62, roundFruit("#d3e38f", "#b4cb6c") + L("M0 -64C-26 -24 -26 24 0 64M0 -64C26 -24 26 24 0 64", "#b4cb6c", 3))},
  amchur: { bg: "#f3f3d8", powder: "#d9bf7a", draw: G(-30, -20, 0.8, P("M-14 -86C42 -92 86 -34 72 24C60 74 8 96 -38 76C-84 54 -92 -2 -68 -44C-58 -66 -38 -84 -14 -86Z", "#90b94a") + P("M-14 -86C42 -92 86 -34 72 24C66 50 50 68 30 76C62 30 48 -50 -14 -86Z", "#6f9b36") + G(-6, -96, 1, leaf(66, 15, "#3f9d50"), -68)) + [[50, 34, 24, "#dcbf78"], [18, 68, -18, "#c9a65d"], [78, 74, 40, "#e6cf8f"]].map(([x, y, a, f]) => G(x, y, 1, P("M-42 12C-34 -22 22 -28 44 -8C24 8 -12 22 -42 12Z", f) + L("M-30 8C-10 -6 12 -12 34 -8", "#b08c47", 2.5), a)).join("")},
  lemon: { bg: "#fff9cc", powder: "#f3e27a", draw: G(-26, -14, 1, P("M-74 0C-70 -44 -34 -68 8 -64C42 -60 66 -38 76 -14C84 -14 90 -6 90 0C90 6 84 14 76 14C66 38 42 60 8 64C-34 68 -70 44 -74 0Z", "#f7d62f") + P("M36 -56C60 -46 72 -28 76 -14C84 -14 90 -6 90 0C90 6 84 14 76 14C66 38 42 60 8 64C50 44 56 -26 36 -56Z", "#e6b91f") + ell(-34, -26, 12, 18, "#ffffff66", 'transform="rotate(35 -34 -26)"')) + halfSlice(64, 54, 0.82, "#f2c81f", "#fff4bb", "#fff4bb", ring(8, 0, (a) => P(`M${(Math.cos(a) * 8).toFixed(1)} ${(Math.sin(a) * 8).toFixed(1)}L${(Math.cos(a - 0.3) * 44).toFixed(1)} ${(Math.sin(a - 0.3) * 44).toFixed(1)}L${(Math.cos(a + 0.3) * 44).toFixed(1)} ${(Math.sin(a + 0.3) * 44).toFixed(1)}Z`, "#f9dd5a")))},
  beetroot: { bg: "#fbe2ee", powder: "#a51c55", draw: G(-16, 22, 1, [-30, -6, 22].map((a, i) => G(0, -50, 1, L("M0 0C-4 -30 -2 -52 0 -68", "#b3224f", 6) + G(0, -60, 1, leaf(64, 22, i === 1 ? "#4e9a42" : "#3f8a39", "#c8426f")), a)).join("") + P("M-68 -8C-68 -44 -34 -56 0 -56C34 -56 68 -44 68 -8C68 34 28 58 6 86C2 92 -2 92 -6 86C-28 58 -68 34 -68 -8Z", "#8f5c10") + P("M42 -46C76 -18 66 30 30 62C22 70 14 78 6 86C36 40 56 0 42 -46Z", "#7d1441") + ell(-30, -18, 11, 19, "#ffffff44", 'transform="rotate(26 -30 -18)"')) + G(70, 62, 0.62, circ(0, 0, 54, "#8f5c10") + circ(0, 0, 44, "#d43f7c", 'stroke="#f2cf8e" stroke-width="3"') + circ(0, 0, 26, "#c02c6a", 'stroke="#f2cf8e" stroke-width="3"') + circ(0, 0, 8, "#f2cf8e"))},
  tomato: { bg: "#ffe6df", powder: "#d9492f", draw: G(-20, -10, 1, roundFruit("#e23f2d", "#bd2e22") + P("M0 -62L-8 -78L-30 -74L-20 -60L-40 -50L-16 -48L-14 -30L0 -44L14 -30L16 -48L40 -50L20 -60L30 -74L8 -78Z", "#3f8a3a")) + halfSlice(62, 52, 0.86, "#d33a2a", "#f26b4f", "#f79a7d", ring(5, 0, (a) => ell((Math.cos(a) * 30).toFixed(1), (Math.sin(a) * 30).toFixed(1), 11, 8, "#fde0a6")))},
  carrot: { bg: "#fff0dd", powder: "#f39a2e", draw: [[-26, 10, -24, 1], [28, 14, 22, 0.86]].map(([x, y, a, s]) => G(x, y, s, [-20, 0, 20].map((b) => G(0, -56, 1, leaf(58, 12, b ? "#4f9e3f" : "#3f8a39"), b)).join("") + P("M-26 -58C-22 -66 22 -66 26 -58C30 -26 12 58 0 90C-12 58 -30 -26 -26 -58Z", "#f58a1f") + L("M-22 -30H-4M10 -12H22M-18 12H-4M6 36H14", "#d36d10", 3.5), a)).join("")},
  jackfruit: { bg: "#eef4d4", powder: "#e9c86a", draw: G(-20, -8, 1, P("M0 -92C48 -88 70 -40 68 8C66 58 40 90 0 90C-40 90 -66 58 -68 8C-70 -40 -48 -88 0 -92Z", "#96b84a") + Array.from({ length: 34 }, (_, i) => { const x = ((i * 37) % 112) - 56, y = ((i * 53) % 150) - 72; return x * x / 3136 + y * y / 7056 < 0.88 ? P(`M${x - 4} ${y + 3}L${x} ${y - 5}L${x + 4} ${y + 3}Z`, "#7a9d37") : ""; }).join("") + L("M0 -92V-108", "#6e4a22", 7)) + [[60, 46, 18, "#f4c84a"], [84, 66, -24, "#e7b530"], [52, 80, 52, "#f8d76a"]].map(([x, y, a, f]) => G(x, y, 1, P("M0 -30C20 -26 26 8 16 24C8 34 -8 34 -16 24C-26 8 -20 -26 0 -30Z", f), a)).join("")},
  psyllium: { bg: "#f2f0e8", powder: "#f0e7d2", draw: G(-30, 8, 1, [-12, 12].map((a, i) => G(i * 40 - 10, 86, 1, L("M0 0C0 -60 0 -90 0 -120", "#7a9b49", 5) + ell(0, -146, 13, 40, "#a7b87a") + Array.from({ length: 8 }, (_, j) => ell(j % 2 ? 11 : -11, -112 - j * 9, 6, 4, "#d9d3a8")).join(""), a)).join("") + G(14, 90, 1, leaf(84, 12, "#5f8f42"), 60) + G(0, 90, 1, leaf(84, 12, "#4f7f38"), -58)) + [[42, 58], [64, 40], [84, 64], [58, 78], [92, 86], [30, 86], [74, 92]].map(([x, y], i) => G(x, y, 1, P("M-20 2C-10 -14 12 -14 20 0C8 6 -8 8 -20 2Z", i % 2 ? "#fbf7ea" : "#e6dcc2"), i * 40)).join("")},
  kernel: { bg: "#f3e9dd", powder: "#d7c6a2", draw: [[-46, -24, 20, 1.3], [32, -42, -30, 1.1], [-8, 36, 60, 1.25], [62, 30, 10, 1], [-64, 56, -50, 0.95]].map(([x, y, a, s]) => G(x, y, s, P("M-26 -12C-14 -32 22 -30 30 -8C34 12 14 30 -6 28C-24 26 -36 6 -26 -12Z", "#5d3218") + P("M-16 -8C-8 -20 12 -20 18 -6C20 6 8 18 -6 16C-16 14 -22 2 -16 -8Z", "#7c4a26") + ell(-6, -8, 7, 4, "#b98a5e", 'transform="rotate(-20 -6 -8)"'), a)).join("")},
};
function ginger() {
  return P("M-92 18C-92 -8 -62 -16 -42 -8C-44 -32 -22 -50 0 -38C8 -60 44 -66 54 -40C58 -26 48 -14 40 -8C62 -14 90 -2 92 22C94 46 66 56 46 44C36 62 8 68 -8 52C-24 68 -56 62 -60 42C-78 48 -92 36 -92 18Z", "#d9ad63") + P("M92 22C94 46 66 56 46 44C36 62 8 68 -8 52C-24 68 -56 62 -60 42C-30 48 30 40 92 22Z", "#ba8a43") + L("M-66 8Q-52 2 -42 12M-14 -16Q0 -24 14 -14M26 20Q44 12 62 22M-30 30Q-16 22 0 32", "#b4843d", 3) + ell(-58, 14, 11, 6, "#f2d79c");
}
function onion(skin, shade, line, slice) {
  return G(-22, 2, 1, P("M0 -96C4 -70 18 -60 42 -42C86 -8 74 62 22 74C8 78 -8 78 -22 74C-74 62 -86 -8 -42 -42C-18 -60 -4 -70 0 -96Z", skin) + P("M42 -42C86 -8 74 62 22 74C60 42 62 -8 34 -48Z", shade) + L("M0 -80C-30 -40 -42 26 -12 74M0 -80C30 -40 42 26 12 74M-2 -80C-4 -30 -4 30 0 76", line, 2.6) + L("M-22 76L-26 90M-6 78L-8 94M10 78L12 92M26 74L30 88", "#c9b98f", 3)) + G(66, 60, 0.66, circ(0, 0, 54, skin) + [46, 36, 26, 16, 7].map((r, i) => `<circle r="${r}" fill="${i % 2 ? slice : line}" stroke="${shade}" stroke-width="2"/>`).join(""));
}

// ---- Props: centred on 0,0, roughly 110 units across ----
const pile = (c) => ell(0, 36, 74, 10, "#00000014") + P("M-70 36C-54 6 -26 -30 0 -32C26 -30 54 6 70 36Z", c) + P("M0 -32C26 -30 54 6 70 36H22C30 6 16 -18 0 -32Z", "#00000018") + seeds([[-30, 14], [-8, 2], [12, 22], [34, 20], [-46, 28]], "#ffffff40", 2.5);
const scoop = (c) => P("M-34 -12C-34 22 34 22 34 -12Z", "#d9dcea") + ell(0, -12, 34, 9, c) + rect(30, -20, 54, 12, 6, "#8d93ad");
const Pr = {
  factory: P("M-54 44V-6L-26 -24V-6L2 -24V-6H54V44Z", "#1f4693") + rect(14, -44, 14, 44, 2, "#c7861c") + rect(34, -56, 14, 56, 2, "#1f4693") + circ(20, -56, 6, "#b7c6e6") + circ(42, -70, 7, "#b7c6e6") + seeds([[-34, 18], [-10, 18], [14, 18], [36, 18]], "#fde68a", 6) + rect(-58, 44, 116, 4, 2, "#16346f"),
  pouch: P("M-32 -52H32L38 46Q0 58 -38 46Z", "#1f4693") + rect(-32, -52, 64, 11, 2, "#14306b") + circ(0, 2, 22, "#fff") + G(0, 16, 1, leaf(28, 9, "#4f9e3f")),
  chart: rect(-52, -52, 104, 104, 12, "#fff") + rect(-36, 12, 16, 26, 3, "#b7c6e6") + rect(-12, -6, 16, 44, 3, "#4f74c4") + rect(12, -28, 16, 66, 3, "#1f4693") + L("M-38 -8L-10 -28L8 -18L38 -44M24 -44H38V-30", "#c7861c", 4),
  ship: P("M-62 14H62L48 44H-48Z", "#1f4693") + rect(-62, 12, 124, 5, 2, "#c7861c") + [[-52, -8, "#4f74c4"], [-30, -8, "#c7861c"], [-8, -8, "#e0a526"], [14, -8, "#60a5fa"], [-52, -26, "#60a5fa"], [-30, -26, "#1f4693"], [-8, -26, "#4f74c4"]].map(([x, y, f]) => rect(x, y, 20, 17, 2, f)).join("") + rect(38, -34, 18, 46, 2, "#fff") + rect(44, -44, 7, 11, 1, "#c7861c") + L("M-72 52q9 -7 18 0t18 0t18 0t18 0t18 0t18 0t18 0t18 0", "#60a5fa", 3),
  globe: circ(0, 0, 54, "#bfdbfe") + P("M-20 -44C-6 -36 -24 -22 -36 -24C-48 -26 -36 -42 -20 -44ZM14 -30C32 -34 44 -18 36 -6C26 8 16 2 16 18C14 34 -2 26 0 6C2 -8 -2 -24 14 -30ZM-40 10C-26 6 -18 22 -28 34C-38 34 -48 20 -40 10Z", "#3b82f6") + L("M-54 0Q0 -18 54 0M0 -54C-28 -26 -28 26 0 54M0 -54C28 -26 28 26 0 54", "#ffffff99", 2),
  forms: G(-62, 2, 1, P("M-30 26C-22 -2 22 -2 30 26Z", "#f3d98a") + [[-14, 0, 30], [8, -4, -20], [18, 12, 60], [-6, 14, 10]].map(([x, y, a]) => G(x, y, 1, rect(-13, -5, 26, 10, 3, "#e0a526"), a)).join("")) + G(0, 2, 1, P("M-30 26C-22 -2 22 -2 30 26Z", "#f3d98a") + seeds([[-12, 10], [0, 4], [12, 10], [-6, 18], [8, 18], [-18, 20], [18, 20], [1, 12]], "#d08a1e", 4.2)) + G(62, 2, 1, P("M-32 26C-22 -6 22 -6 32 26Z", "#f0c869")),
  sieve: ell(0, 0, 54, 54, "#c7cce0") + ell(0, 0, 46, 46, "#eef0f8") + L("M-40 -20H40M-46 0H46M-40 20H40M-20 -40V40M0 -46V46M20 -40V40", "#a9b0ca", 2) + seeds([[-14, -6], [12, 8], [28, -14], [-30, 12]], "#e0a526", 3),
  flask: (c = "#4f74c4") => P("M-13 -58H13V-22L46 40C52 52 44 60 34 60H-34C-44 60 -52 52 -46 40L-13 -22Z", "#e6e9f6") + P("M-24 10H24L44 44C48 52 42 56 34 56H-34C-42 56 -48 52 -44 44Z", c) + rect(-17, -64, 34, 9, 3, "#a9b0ca") + circ(-10, 34, 4, "#ffffff77") + circ(12, 26, 3, "#ffffff77") + circ(8, 44, 5, "#ffffff55"),
  clipboard: rect(-44, -58, 88, 118, 9, "#a9713f") + rect(-37, -48, 74, 100, 4, "#fff") + rect(-18, -66, 36, 15, 5, "#14213d") + [-28, -8, 12, 32].map((y) => L(`M-28 ${y}l5 5l9 -10`, "#1f4693", 3.5) + L(`M-4 ${y + 1}H${26 - ((y + 28) % 3) * 5}`, "#b7c6e6", 5)).join(""),
  magnifier: L("M18 18L48 48", "#14213d", 11) + circ(-4, -4, 32, "#dbeafe", 'stroke="#1f4693" stroke-width="8"') + P("M-22 -8A20 20 0 0 1 -2 -24", "none", 'stroke="#fff" stroke-width="4" stroke-linecap="round"'),
  drop: (c = "#60a5fa") => P("M0 -54C20 -24 38 -2 38 18C38 40 20 54 0 54C-20 54 -38 40 -38 18C-38 -2 -20 -24 0 -54Z", c) + P("M-20 18C-20 32 -10 38 -2 40", "none", 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"'),
  sprout: P("M-40 42C-24 26 24 26 40 42Z", "#8a5f35") + L("M0 34C2 12 0 -8 0 -24", "#4f9e3f", 6) + G(0, -14, 1, leaf(52, 17, "#57a747"), 56) + G(0, -14, 1, leaf(52, 17, "#3f8a39"), -56),
  container: rect(-62, -36, 124, 74, 4, "#1f4693") + Array.from({ length: 9 }, (_, i) => rect(-52 + i * 12, -26, 5, 54, 1, "#4f74c4")).join("") + rect(-62, 38, 124, 6, 1, "#14306b"),
  glass: (c = "#f7b733") => P("M-30 -52H30L22 54H-22Z", "#e6e9f6") + P("M-27 -24H27L21 50H-21Z", c) + L("M8 -74L14 -22", "#c7861c", 6) + circ(-30, -50, 13, "#f7d62f") + circ(-30, -50, 8, "#fff4bb"),
  sun: ring(10, 0, (a) => L(`M${(Math.cos(a) * 42).toFixed(1)} ${(Math.sin(a) * 42).toFixed(1)}L${(Math.cos(a) * 56).toFixed(1)} ${(Math.sin(a) * 56).toFixed(1)}`, "#f4a71d", 6)) + circ(0, 0, 33, "#f9c33c"),
  muffin: P("M-36 0H36L26 48H-26Z", "#c7861c") + L("M-20 6L-14 46M0 6V46M20 6L14 46", "#9a6512", 3) + P("M-46 2C-54 -24 -28 -32 -24 -36C-16 -56 16 -56 24 -36C30 -32 54 -24 46 2C20 12 -20 12 -46 2Z", "#c98b45") + seeds([[-16, -22], [8, -32], [22, -12], [-4, -8]], "#5a3216", 4),
  loaf: P("M-62 -22C-62 -46 -36 -48 -24 -40C-8 -50 24 -50 36 -40C50 -48 66 -40 62 -20C62 -10 56 -8 52 -6V40C52 46 48 48 44 48H-44C-48 48 -52 46 -52 40V-6C-58 -8 -62 -12 -62 -22Z", "#d39a55") + P("M-52 -6V40C-52 46 -48 48 -44 48H-22C-30 30 -32 2 -24 -40C-36 -48 -62 -46 -62 -22C-62 -12 -58 -8 -52 -6Z", "#f0d6a8"),
  babyfood: P("M-30 -16H30V44C30 50 26 54 20 54H-20C-26 54 -30 50 -30 44Z", "#fbd9a5") + rect(-34, -32, 68, 18, 5, "#1f4693") + circ(0, 18, 19, "#fff") + circ(-6, 14, 2.5, "#14213d") + circ(6, 14, 2.5, "#14213d") + L("M-6 23Q0 29 6 23", "#c7861c", 2.5),
  milk: P("M-30 -14L-14 -44H14L30 -14V54H-30Z", "#fff") + P("M-30 -14L-14 -44H14L30 -14Z", "#bfdbfe") + rect(-14, -56, 28, 13, 2, "#1f4693") + P("M-30 12Q-15 4 0 12T30 12V54H-30Z", "#60a5fa"),
  sauce: rect(-24, -14, 48, 68, 9, "#be3a2c") + P("M-24 -8C-22 -26 -10 -32 -10 -44H10C10 -32 22 -26 24 -8Z", "#d9492f") + rect(-13, -62, 26, 19, 3, "#1f4693") + rect(-24, 12, 48, 26, 0, "#fff") + G(0, 34, 1, leaf(18, 7, "#4f9e3f")),
  chips: P("M-40 -56L-30 -48L-20 -56L-10 -48L0 -56L10 -48L20 -56L30 -48L40 -56V56L30 48L20 56L10 48L0 56L-10 48L-20 56L-30 48L-40 56Z", "#e0a526") + circ(0, 2, 26, "#fff4bb") + P("M-16 2C-8 -14 8 -14 16 2C8 10 -8 10 -16 2Z", "#d08a1e"),
  flame: P("M0 -56C10 -30 38 -16 38 16C38 42 18 54 0 54C-18 54 -38 42 -38 16C-38 -2 -26 -12 -20 -24C-16 -12 -10 -10 -6 -10C-10 -28 -6 -44 0 -56Z", "#f97316") + P("M0 -4C6 10 20 16 20 30C20 44 8 50 0 50C-8 50 -20 44 -20 30C-20 18 -6 12 0 -4Z", "#fcd34d"),
  testtubes: [[-34, "#4f74c4", -6], [0, "#c7861c", 0], [34, "#e0a526", 6]].map(([x, c, a]) => G(x, 0, 1, rect(-12, -54, 24, 106, 11, "#e6e9f6") + P("M-12 -6H12V40C12 48 6 52 0 52C-6 52 -12 48 -12 40Z", c) + rect(-16, -58, 32, 8, 3, "#a9b0ca"), a)).join(""),
  oilrig: P("M-44 54L-14 -56H14L44 54H28L10 -30H-10L-28 54Z", "#1f4693") + L("M-34 22H34M-24 -12H24M-34 22L24 -12M34 22L-24 -12", "#3b6fd1", 4) + rect(-58, 50, 116, 9, 2, "#14213d") + P("M-6 -56L0 -76L6 -56Z", "#c7861c") + P("M-8 -86C-2 -76 12 -74 12 -62C12 -56 6 -52 0 -52C-6 -52 -12 -56 -12 -62C-12 -68 -8 -74 -8 -86Z", "#f97316", 'transform="translate(0 -6) scale(.55)"'),
  dropdark: P("M0 -54C20 -24 38 -2 38 18C38 40 20 54 0 54C-20 54 -38 40 -38 18C-38 -2 -20 -24 0 -54Z", "#14213d") + P("M-20 18C-20 32 -10 38 -2 40", "none", 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"'),
  burger: P("M-54 -6C-54 -38 -26 -48 0 -48C26 -48 54 -38 54 -6Z", "#d39a55") + seeds([[-22, -28], [0, -36], [20, -26], [-6, -20]], "#fbecc7", 3.5) + P("M-58 -4Q-44 8 -30 -4T0 -4T30 -4T58 -4V6H-58Z", "#57a747") + rect(-54, 8, 108, 18, 8, "#6e3d1e") + P("M-54 28H54V34C54 46 44 50 30 50H-30C-44 50 -54 46 -54 34Z", "#c98b45"),
  capsule: G(0, 0, 1, P("M-40 -18H0V18H-40A18 18 0 0 1 -40 -18Z", "#1f4693") + P("M0 -18H40A18 18 0 0 1 40 18H0Z", "#f3dcb0") + rect(-46, -12, 34, 5, 2, "#ffffff55"), -32),
  tablets: G(-22, 18, 1, circ(0, 0, 25, "#fff", 'stroke="#b7c6e6" stroke-width="3"') + L("M-15 0H15", "#b7c6e6", 3)) + G(26, -18, 1, circ(0, 0, 25, "#fff", 'stroke="#b7c6e6" stroke-width="3"') + L("M-15 0H15", "#b7c6e6", 3), 40) + G(-20, -32, 0.7, circ(0, 0, 25, "#b7c6e6")),
  coins: [36, 20, 4, -12].map((y) => ell(-14, y, 36, 13, "#d4971c") + ell(-14, y - 6, 36, 13, "#f4c23f")).join("") + G(34, 16, 1, ell(0, 22, 26, 10, "#d4971c") + ell(0, 16, 26, 10, "#f4c23f") + ell(0, 6, 26, 10, "#d4971c") + ell(0, 0, 26, 10, "#f4c23f")),
  thermo: rect(-11, -56, 22, 86, 11, "#e6e9f6") + circ(0, 34, 22, "#c7861c") + rect(-5, -30, 10, 60, 5, "#c7861c") + L("M16 -40H26M16 -22H26M16 -4H26", "#a9b0ca", 3),
  shaker: P("M-30 -18H30L24 54H-24Z", "#1f4693") + rect(-34, -32, 68, 16, 5, "#14213d") + rect(-12, -48, 24, 17, 4, "#c7861c") + L("M-24 8H24M-23 24H23", "#b7c6e6", 3),
  dumbbell: G(0, 0, 1, rect(-30, -7, 60, 14, 5, "#a9b0ca") + rect(-54, -28, 18, 56, 5, "#1f4693") + rect(-38, -20, 12, 40, 4, "#3b6fd1") + rect(36, -28, 18, 56, 5, "#1f4693") + rect(26, -20, 12, 40, 4, "#3b6fd1"), -22),
  badge: ring(12, 0, (a) => circ((Math.cos(a) * 42).toFixed(1), (Math.sin(a) * 42).toFixed(1), 12, "#e0a526")) + circ(0, 0, 42, "#f4c23f") + L("M-18 0L-5 14L20 -14", "#fff", 8),
  stamp: rect(-44, 26, 88, 14, 4, "#c7861c") + P("M-30 26C-30 8 -14 6 -12 -8C-16 -18 -22 -24 -22 -36C-22 -52 22 -52 22 -36C22 -24 16 -18 12 -8C14 6 30 8 30 26Z", "#1f4693") + rect(-50, 44, 100, 7, 3, "#b7c6e6"),
  swatches: [[-34, "#fde68a", -12], [0, "#f97316", 0], [34, "#b91c1c", 12]].map(([x, c, a]) => G(x, 10, 1, rect(-22, -46, 44, 86, 6, "#fff") + rect(-17, -40, 34, 54, 3, c), a)).join(""),
  gauge: P("M-54 22A54 54 0 0 1 -22 -27", "none", 'stroke="#57a747" stroke-width="15"') + P("M-22 -27A54 54 0 0 1 22 -27", "none", 'stroke="#f4c23f" stroke-width="15"') + P("M22 -27A54 54 0 0 1 54 22", "none", 'stroke="#dc2626" stroke-width="15"') + L("M0 22L28 -22", "#14213d", 6) + circ(0, 22, 9, "#14213d"),
  teacup: P("M-46 -18H34V10C34 36 16 48 -6 48C-28 48 -46 36 -46 10Z", "#fff") + P("M-42 -14H30V-4H-42Z", "#a06a38") + L("M34 -6C56 -8 58 24 30 24", "#fff", 8) + ell(-6, 52, 56, 7, "#b7c6e6") + L("M-20 -30C-12 -40 -28 -46 -20 -58M6 -30C14 -40 -2 -46 6 -58", "#ffffffcc", 4),
  mortar: P("M-52 -10H52C50 34 26 52 0 52C-26 52 -50 34 -52 -10Z", "#7c8299") + ell(0, -10, 52, 11, "#a9b0ca") + ell(0, -10, 42, 7, "#d6b87b") + rect(-40, 52, 80, 7, 3, "#5f6480") + G(22, -36, 1, rect(-8, -34, 16, 60, 8, "#5f6480"), 34),
  heart: P("M0 46C-54 10 -58 -30 -32 -42C-16 -48 -6 -38 0 -28C6 -38 16 -48 32 -42C58 -30 54 10 0 46Z", "#ec4899") + P("M-34 -22C-30 -32 -22 -34 -16 -32", "none", 'stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"'),
  brain: P("M-6 -48C-20 -56 -38 -46 -38 -32C-54 -28 -58 -4 -46 6C-52 24 -34 40 -20 34C-14 46 -6 44 -6 34Z", "#f3a4c6") + P("M6 -48C20 -56 38 -46 38 -32C54 -28 58 -4 46 6C52 24 34 40 20 34C14 46 6 44 6 34Z", "#ec86b4") + L("M-36 -18C-26 -22 -18 -14 -20 -4M-40 12C-30 6 -20 12 -18 20M36 -18C26 -22 18 -14 20 -4M40 12C30 6 20 12 18 20", "#c7861c", 3),
  scale: L("M0 -44V40M-46 -32H46", "#1f4693", 6) + P("M-30 46H30L24 36H-24Z", "#14213d") + L("M-46 -32L-62 8M-46 -32L-30 8M46 -32L30 8M46 -32L62 8", "#a9b0ca", 2.5) + P("M-66 8H-26C-28 26 -64 26 -66 8Z", "#4f74c4") + P("M26 8H66C64 26 28 26 26 8Z", "#e0a526") + circ(0, -46, 7, "#c7861c"),
  shield: P("M0 -56L46 -40V4C46 36 22 52 0 60C-22 52 -46 36 -46 4V-40Z", "#1f4693") + P("M0 -56L46 -40V4C46 36 22 52 0 60Z", "#1f4693") + L("M-18 2L-4 16L20 -12", "#fff", 8),
  jar: rect(-40, -14, 80, 54, 12, "#fff") + rect(-46, -36, 92, 24, 8, "#1f4693") + G(0, 34, 1, leaf(34, 12, "#4f9e3f")) + ell(0, 44, 42, 5, "#00000012"),
  spice: P("M-26 -22H26L32 50C32 54 28 56 24 56H-24C-28 56 -32 54 -32 50Z", "#e0a526") + rect(-30, -44, 60, 24, 6, "#c7861c") + seeds([[-12, -32], [0, -32], [12, -32], [-6, -38], [6, -38]], "#fff", 2.6) + rect(-24, 2, 48, 28, 3, "#fff4bb") + G(0, 27, 1, leaf(20, 7, "#4f9e3f")),
  soup: P("M-58 -4C-54 38 -28 50 0 50C28 50 54 38 58 -4Z", "#1f4693") + ell(0, -4, 58, 13, "#e8723a") + seeds([[-22, -6], [14, -8], [28, -2], [-4, -1]], "#fbe3a0", 4) + L("M-16 -24C-10 -34 -24 -40 -16 -50M12 -24C18 -34 4 -40 12 -50", "#a9b0ca", 4),
  truck: rect(-58, -32, 76, 58, 5, "#1f4693") + P("M18 -14H42L58 6V26H18Z", "#c7861c") + rect(28, -8, 16, 12, 2, "#fff") + rect(-58, 24, 116, 5, 1, "#14213d") + [[-40], [-8], [36]].map(([x]) => circ(x, 32, 12, "#14213d") + circ(x, 32, 5, "#b7c6e6")).join(""),
  pan: rect(40, -18, 60, 13, 6, "#14213d") + P("M-58 -18H46C44 18 30 30 -6 30C-42 30 -56 18 -58 -18Z", "#1e2a40") + ell(-6, -18, 52, 9, "#f3c04a") + [[-30, -20], [-8, -22], [12, -18]].map(([x, y]) => L(`M${x - 8} ${y}q8 -8 16 0`, "#a9651f", 5)).join("") + L("M-20 -36q6 -8 0 -16M6 -36q6 -8 0 -16", "#a9b0ca", 4),
  parcel: rect(-48, -38, 96, 84, 6, "#c98f4e") + P("M-48 -38L-30 -56H30L48 -38Z", "#e6bd85") + rect(-9, -38, 18, 84, 0, "#f6e3bd") + P("M-9 -38L-3 -56H3L9 -38Z", "#f6e3bd") + L("M24 8V34M16 16L24 8L32 16", "#6b431a", 4),
  candy: G(0, 0, 1, P("M-30 0L-60 -22V22Z", "#f0c97e") + P("M30 0L60 -22V22Z", "#f0c97e") + circ(0, 0, 32, "#10b981") + L("M-20 -14C-4 -2 4 -2 20 -14M-20 14C-4 2 4 2 20 14", "#ecfdf5", 5), -18),
  tooth: P("M0 -38C14 -50 46 -50 46 -14C46 8 34 22 30 44C28 56 18 56 14 44C10 28 6 22 0 22C-6 22 -10 28 -14 44C-18 56 -28 56 -30 44C-34 22 -46 8 -46 -14C-46 -50 -14 -50 0 -38Z", "#fff") + P("M-30 -24C-26 -34 -18 -36 -12 -34", "none", 'stroke="#bfdbfe" stroke-width="5" stroke-linecap="round"'),
  vitc: circ(0, 0, 54, "#f97316") + circ(0, 0, 45, "#fff1dc") + ring(8, 0, (a) => P(`M${(Math.cos(a) * 7).toFixed(1)} ${(Math.sin(a) * 7).toFixed(1)}L${(Math.cos(a - 0.31) * 40).toFixed(1)} ${(Math.sin(a - 0.31) * 40).toFixed(1)}Q${(Math.cos(a) * 45).toFixed(1)} ${(Math.sin(a) * 45).toFixed(1)} ${(Math.cos(a + 0.31) * 40).toFixed(1)} ${(Math.sin(a + 0.31) * 40).toFixed(1)}Z`, "#fb923c")),
  textile: P("M-50 -34H30V34H-50Z", "#4f74c4") + L("M-50 -14H30M-50 14H30M-22 -34V34M6 -34V34", "#b7c6e6", 3) + ell(-50, 0, 12, 34, "#1f4693") + ell(30, 0, 12, 34, "#8ea6d8") + P("M30 34C44 34 56 44 62 58H4C14 46 20 38 30 34Z", "#4f74c4"),
  doc: rect(-42, -56, 84, 112, 6, "#fff") + P("M42 -56V-30H16Z", "#b7c6e6") + L("M-28 -32H6M-28 -14H28M-28 4H28M-28 22H10", "#b7c6e6", 5) + circ(20, 34, 16, "#c7861c") + L("M12 34L18 40L28 28", "#fff", 4),
  labelbox: rect(-50, -30, 100, 80, 6, "#e6bd85") + P("M-50 -30L-32 -50H32L50 -30Z", "#f0d3a6") + rect(-34, -12, 68, 44, 5, "#fff") + L("M-22 2H22M-22 14H10", "#b7c6e6", 5) + circ(26, -38, 13, "#c7861c"),
  barcode: rect(-54, -34, 108, 68, 8, "#fff") + [-42, -35, -28, -20, -10, -3, 6, 14, 22, 32, 42].map((x, i) => rect(x, -24, i % 3 ? 3 : 6, 40, 0, "#14213d")).join("") + L("M-66 -10H-54M54 -10H66", "#4f74c4", 5) + circ(-72, -10, 8, "#4f74c4") + circ(72, -10, 8, "#4f74c4"),
  plane: G(0, 0, 1, P("M-58 8L52 -34C64 -38 72 -28 60 -20L-40 26C-48 30 -54 28 -58 22Z", "#fff") + P("M-2 -14L-36 -50H-20L28 -22Z", "#1f4693") + P("M2 8L-8 44H6L34 -6Z", "#1f4693") + P("M-52 10L-66 -14H-54L-40 6Z", "#c7861c"), 0),
  phone: rect(-30, -56, 60, 112, 10, "#14213d") + rect(-24, -46, 48, 88, 3, "#eef0f8") + rect(-16, -36, 32, 30, 3, "#c98f4e") + L("M-16 6H16M-16 18H6", "#b7c6e6", 5) + rect(-16, 28, 32, 9, 4, "#1f4693"),
  layers: [[-24, "#b7c6e6", 0], [-6, "#4f74c4", 0], [12, "#1f4693", 0], [30, "#1f4693", 0]].map(([y, c]) => P(`M-54 ${y}L0 ${y - 18}L54 ${y}L0 ${y + 18}Z`, c, 'stroke="#fff" stroke-width="2.5" stroke-linejoin="round"')).join(""),
};
const prop = (n, c) => (typeof Pr[n] === "function" ? Pr[n](c) : Pr[n]);

// ---- Compositions on an 800 x 450 canvas ----
const ground = (c) => P("M0 372C150 332 300 356 430 362C580 368 690 330 800 348V450H0Z", c, 'opacity=".55"');
const decor = (c) => circ(690, 74, 3, c) + circ(716, 96, 5, c) + circ(120, 72, 5, c) + circ(92, 104, 3, c) + `<path d="M60 150a90 90 0 0 1 120 -80" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round"/>` + `<path d="M640 58a90 90 0 0 1 106 60" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="2 11" stroke-linecap="round"/>`;
function compose(layout, key, a, b, c) {
  const topic = layout === "topic";
  const bg = topic ? key : S[key].bg;
  const pow = topic ? "#b7c6e6" : S[key].powder;
  let out = rect(0, 0, 800, 450, 0, bg) + ground("#ffffff") + decor(pow);
  if (layout === "spot") {
    out += circ(265, 225, 148, "#ffffff", 'opacity=".6"') + G(265, 225, 1.42, S[key].draw);
    out += G(575, 322, 1.3, pile(pow)) + G(548, 266, 0.9, scoop(pow), -16) + G(605, 118, 1, prop(a)) + G(722, 246, 0.72, prop(b));
  } else if (layout === "guide") {
    out += circ(210, 232, 124, "#ffffff", 'opacity=".6"') + G(210, 232, 1.08, S[key].draw);
    out += G(428, 225, 1.72, prop("clipboard")) + G(522, 300, 1.05, prop("magnifier")) + G(650, 128, 1, prop(a)) + G(686, 318, 0.92, prop(b));
  } else if (layout === "form") {
    out += circ(208, 228, 124, "#ffffff", 'opacity=".6"') + G(208, 228, 1.12, S[key].draw);
    out += G(436, 232, 1.75, prop("flask", pow)) + G(630, 132, 1.08, prop(a)) + G(668, 322, 1, prop(b));
  } else if (layout === "feature") {
    out += circ(208, 232, 128, "#ffffff", 'opacity=".6"') + G(208, 232, 1.15, S[key].draw);
    out += circ(498, 226, 112, "#ffffff", 'opacity=".75"') + G(498, 226, 1.75, prop(a)) + G(692, 316, 1.08, prop(b));
  } else {
    out += circ(400, 226, 150, "#ffffff", 'opacity=".7"') + G(400, 226, 2.2, prop(a)) + G(146, 276, 1.35, prop(b)) + G(654, 276, 1.35, prop(c));
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">${out}</svg>\n`;
}

// One line per post: layout, ingredient (or background for "topic"), then what the article is about.
const ART = {
  "dehydrated-foods-future-of-food-manufacturing": ["topic", "#e9eefc", "factory", "pouch", "chart"],
  "india-dehydrated-food-exports-growth": ["topic", "#e6f1ff", "ship", "chart", "globe"],
  "flake-granule-or-powder-choosing-the-right-form": ["topic", "#fff3e0", "forms", "sieve", "flask"],
  "how-to-read-a-dehydrated-ingredient-spec-sheet": ["topic", "#eef0ff", "clipboard", "magnifier", "drop"],
  "building-a-reliable-india-sourcing-strategy": ["topic", "#e8f6ee", "globe", "sprout", "container"],
  "guava-powder-tropical-orchard": ["spot", "guava", "glass", "sun"],
  "pineapple-powder-tropical-tang": ["spot", "pineapple", "glass", "drop"],
  "banana-powder-nutrition-bakery": ["spot", "banana", "muffin", "babyfood"],
  "apple-powder-orchard-fresh": ["spot", "apple", "muffin", "glass"],
  "mango-powder-king-of-fruits": ["spot", "mango", "glass", "milk"],
  "tamarind-pulp-powder-sour-sweet": ["spot", "tamarind", "sauce", "chips"],
  "papaya-powder-natural-enzymes": ["spot", "papaya", "testtubes", "glass"],
  "guar-gum-oil-and-gas-biggest-application": ["feature", "guar", "oilrig", "dropdark"],
  "guar-gum-plant-based-dairy-meat": ["feature", "guar", "burger", "milk"],
  "pharma-grade-guar-gum-phgg-soluble-fibre": ["feature", "guar", "tablets", "capsule"],
  "gluten-free-baking-with-guar-gum-formulator-guide": ["feature", "guar", "loaf", "muffin"],
  "guar-gum-economics-why-india-sets-the-world-price": ["feature", "guar", "chart", "coins"],
  "moringa-powder-nutritional-reality-what-survives-drying": ["spot", "moringa", "sun", "thermo"],
  "moringa-in-plant-based-protein-sports-nutrition": ["feature", "moringa", "shaker", "dumbbell"],
  "moringa-powder-quality-differentiators-premium-vs-commodity": ["guide", "moringa", "badge", "sieve"],
  "moringa-global-regulatory-map-eu-us-asia": ["feature", "moringa", "globe", "stamp"],
  "moringa-beyond-supplements-food-applications": ["feature", "moringa", "glass", "loaf"],
  "guava-powder-sourcing-spec-guide": ["guide", "guava", "sieve", "drop"],
  "pineapple-powder-sourcing-spec-guide": ["guide", "pineapple", "drop", "thermo"],
  "banana-powder-sourcing-spec-guide": ["guide", "banana", "babyfood", "shaker"],
  "apple-powder-sourcing-spec-guide": ["guide", "apple", "sieve", "drop"],
  "mango-powder-sourcing-spec-guide": ["guide", "mango", "swatches", "sieve"],
  "tamarind-pulp-powder-sourcing-spec-guide": ["guide", "tamarind", "gauge", "sieve"],
  "papaya-powder-sourcing-spec-guide": ["guide", "papaya", "testtubes", "drop"],
  "pomegranate-powder-antioxidant-superfruit": ["spot", "pomegranate", "shield", "glass"],
  "pomegranate-powder-formulation-guide": ["form", "pomegranate", "capsule", "gauge"],
  "tulsi-powder-sacred-adaptogen-herb": ["spot", "tulsi", "teacup", "sun"],
  "tulsi-powder-tea-supplement-sourcing": ["guide", "tulsi", "teacup", "capsule"],
  "ashwagandha-powder-adaptogen-root-spotlight": ["spot", "ashwagandha", "capsule", "mortar"],
  "ashwagandha-powder-withanolides-sourcing-guide": ["guide", "ashwagandha", "testtubes", "badge"],
  "shatavari-powder-womens-wellness-root-tonic": ["spot", "shatavari", "capsule", "heart"],
  "shatavari-powder-supplement-sourcing-guide": ["guide", "shatavari", "capsule", "shaker"],
  "brahmi-powder-memory-herb-spotlight": ["spot", "brahmi", "brain", "sun"],
  "brahmi-powder-nootropic-formulation-guide": ["form", "brahmi", "brain", "capsule"],
  "triphala-powder-three-fruit-blend-explained": ["spot", "triphala", "mortar", "teacup"],
  "triphala-powder-sourcing-blend-consistency": ["guide", "triphala", "scale", "sieve"],
  "giloy-powder-immunity-vine-spotlight": ["spot", "giloy", "shield", "mortar"],
  "giloy-powder-nutraceutical-formulation-sourcing": ["form", "giloy", "shield", "capsule"],
  "neem-powder-bitter-leaf-spotlight": ["spot", "neem", "jar", "sun"],
  "neem-powder-skincare-wellness-sourcing": ["guide", "neem", "jar", "sprout"],
  "trikatu-powder-three-spice-blend-explained": ["spot", "trikatu", "mortar", "flame"],
  "trikatu-powder-digestive-formula-sourcing": ["guide", "trikatu", "scale", "capsule"],
  "red-onion-powder-pungency-colour-grades": ["spot", "redonion", "swatches", "gauge"],
  "red-onion-powder-food-plant-sourcing": ["guide", "redonion", "container", "sieve"],
  "pink-onion-powder-mild-versatile-sourcing": ["spot", "pinkonion", "soup", "chips"],
  "pink-onion-powder-seasoning-snack-applications": ["form", "pinkonion", "chips", "spice"],
  "white-onion-powder-clean-flavour-profile": ["spot", "whiteonion", "swatches", "sauce"],
  "white-onion-powder-sauce-dressing-dairy-use": ["form", "whiteonion", "sauce", "milk"],
  "garlic-powder-allicin-cut-grades-explained": ["spot", "garlic", "forms", "gauge"],
  "garlic-powder-consistency-qc-manufacturers": ["guide", "garlic", "testtubes", "factory"],
  "ginger-powder-pungency-aroma-indian-ginger": ["spot", "ginger", "teacup", "flame"],
  "ginger-powder-beverage-bakery-wellness-formulation": ["form", "ginger", "glass", "muffin"],
  "green-chilli-powder-colour-heat-grading": ["spot", "greenchilli", "swatches", "gauge"],
  "green-chilli-powder-shu-consistency-blend-applications": ["guide", "greenchilli", "gauge", "scale"],
  "fried-onion-oil-process-considerations": ["spot", "friedonion", "pan", "drop"],
  "fried-onion-topping-rte-food-service-supply": ["guide", "friedonion", "soup", "parcel"],
  "curry-leaf-powder-drying-colour-retention": ["spot", "curryleaf", "sun", "swatches"],
  "curry-leaf-powder-nutraceutical-flavour-applications": ["form", "curryleaf", "capsule", "soup"],
  "coriander-leaf-powder-colour-aroma-retention": ["spot", "coriander", "sun", "soup"],
  "coriander-leaf-powder-seasoning-rte-meal-supply": ["guide", "coriander", "spice", "soup"],
  "mint-powder-menthol-drying-trade-offs": ["spot", "mint", "thermo", "drop"],
  "mint-powder-beverage-confectionery-oral-care-use": ["form", "mint", "candy", "tooth"],
  "amla-powder-vitamin-c-nutritional-profile": ["spot", "amla", "vitc", "shield"],
  "amla-powder-supplement-functional-food-formulation": ["form", "amla", "vitc", "capsule"],
  "amchur-powder-ayurvedic-digestive-culinary-role": ["spot", "amchur", "mortar", "spice"],
  "amchur-powder-seasoning-house-sourcing-spec": ["guide", "amchur", "spice", "gauge"],
  "lemon-powder-acidity-flavour-capture": ["spot", "lemon", "glass", "drop"],
  "lemon-powder-beverage-seasoning-formulation": ["form", "lemon", "glass", "spice"],
  "beetroot-powder-colour-nitrate-profile": ["spot", "beetroot", "swatches", "testtubes"],
  "beetroot-powder-natural-colour-sports-nutrition-use": ["form", "beetroot", "swatches", "dumbbell"],
  "tomato-powder-lycopene-drying-method": ["spot", "tomato", "soup", "sun"],
  "tomato-powder-soup-sauce-snack-seasoning-supply": ["guide", "tomato", "soup", "chips"],
  "carrot-powder-beta-carotene-retention": ["spot", "carrot", "babyfood", "sun"],
  "carrot-powder-baby-food-bakery-blend-applications": ["form", "carrot", "babyfood", "muffin"],
  "jackfruit-powder-plant-based-nutrition-spotlight": ["spot", "jackfruit", "sprout", "burger"],
  "jackfruit-powder-meat-analogue-bakery-formulation": ["form", "jackfruit", "burger", "loaf"],
  "psyllium-husk-powder-soluble-fibre-purity-grades": ["spot", "psyllium", "sieve", "drop"],
  "psyllium-husk-powder-supplement-pharma-gluten-free-baking-use": ["form", "psyllium", "capsule", "loaf"],
  "tamarind-kernel-powder-thickening-sizing-chemistry": ["spot", "kernel", "textile", "flask"],
  "tamarind-kernel-powder-food-textile-grades-gum-synergy": ["guide", "kernel", "textile", "sauce"],
  "incoterms-for-first-time-importers": ["topic", "#e6f1ff", "ship", "doc", "truck"],
  "private-label-vs-branded-sourcing": ["topic", "#eef2fa", "labelbox", "pouch", "clipboard"],
  "batch-traceability-in-dehydration": ["topic", "#e8f6ee", "barcode", "sprout", "parcel"],
  "clean-label-movements-next-wave": ["topic", "#effaf3", "pouch", "sprout", "badge"],
  "d2c-ecommerce-export-logistics": ["topic", "#fdf6e8", "parcel", "plane", "phone"],
  "functional-beverage-ingredient-trends": ["topic", "#fff7e0", "glass", "shaker", "shield"],
  "packaging-innovations-for-powders": ["topic", "#eef2fa", "layers", "drop", "sun"],
  "navigating-eu-us-gulf-import-documentation-changes": ["topic", "#eef0ff", "doc", "stamp", "globe"],
};

const ids = [...fs.readFileSync("src/data/blogs.ts", "utf8").matchAll(/\n    id: "([^"]+)"/g)].map((m) => m[1]);
const missing = ids.filter((id) => !ART[id]);
const stale = Object.keys(ART).filter((id) => !ids.includes(id));
if (missing.length || stale.length) throw new Error(`Art map out of step. Missing: ${missing.join(", ")} Stale: ${stale.join(", ")}`);

fs.mkdirSync(OUT, { recursive: true });
for (const id of ids) fs.writeFileSync(path.join(OUT, `${id}-v2.svg`), compose(...ART[id]));
console.log(`${ids.length} covers written`);
