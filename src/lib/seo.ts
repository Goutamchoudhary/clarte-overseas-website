// Trim text for meta descriptions: keep whole sentences when they fit,
// otherwise cut at the last word boundary and end cleanly.
export function clipText(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > max * 0.6) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:—–-]+$/, "") + "…";
}
