// Every switchable design choice the admin page offers. `ready: false` options
// are shown in admin as "in progress" and can't be published yet; the site
// falls back to the default for anything unknown, so a stale or hand-edited
// site-config.json can never break a build.
import raw from "./site-config.json";

export type Option = { id: string; label: string; note: string; ready: boolean };

export const HEROES: Option[] = [
  { id: "v1", label: "V1 · Current flat-lay", note: "Today's photo, curtain scroll and torn edge, unchanged.", ready: true },
  { id: "v2", label: "V2 · Living Collage", note: "Three category tiles that slide every 2 s + Explore-all tile.", ready: false },
  { id: "v3", label: "V3 · Midnight arch + photo pins", note: "Dark hero; today's photo in an arch with category pins.", ready: false },
  { id: "v4", label: "V4 · Trade Atlas", note: "Rising WebGL globe (cobe) with arcs from India + waving farmer (vector kit).", ready: false },
  { id: "v5", label: "V5 · Kinetic Harvest", note: "Photo-filled headline, GSAP scroll split.", ready: false },
  { id: "v6", label: "V6 · Midnight Reel", note: "Dark; two film reels of category photos + the export journey drawn with the vector kit (GSAP).", ready: false },
  { id: "v8", label: "V8 · Ingredient Drop", note: "Category photos drop and pile up; drag to toss (Matter.js).", ready: false },
];

export const THEMES: Option[] = [
  { id: "classic", label: "1 · Classic Navy", note: "Today's colours.", ready: true },
  { id: "royal-bloom", label: "2 · Royal Bloom", note: "Navy brand, navy→purple→pink CTAs.", ready: false },
  { id: "lavender-mist", label: "3 · Lavender Mist", note: "Lavender ground, violet headings.", ready: false },
  { id: "blush-sky", label: "4 · Blush Sky", note: "Blush ground, pastel CTAs.", ready: false },
  { id: "midnight-orchid", label: "5 · Midnight Orchid", note: "Dark navbar and hero.", ready: false },
];

export const EDITIONS: Option[] = [
  { id: "ingredients", label: "Ingredients exporter (today)", note: "Current mission, vision and copy.", ready: true },
  { id: "multi-category", label: "Multi-category trade house", note: "New copy across every page.", ready: false },
];

export const CTAS: Option[] = [
  { id: "theme", label: "Theme default", note: "Whatever the colour version uses.", ready: true },
  { id: "orchid-sky", label: "Orchid Sky", note: "purple → blue", ready: false },
  { id: "aurora-pink", label: "Aurora Pink", note: "purple → dark pink", ready: false },
  { id: "royal-bloom", label: "Royal Bloom", note: "navy → purple → pink", ready: false },
  { id: "twilight-iris", label: "Twilight Iris", note: "indigo → violet", ready: false },
  { id: "lavender-blush", label: "Lavender Blush", note: "lavender → light pink", ready: false },
  { id: "periwinkle-dawn", label: "Periwinkle Dawn", note: "light blue → lavender → pink", ready: false },
];

export const GROUPS = [
  { key: "hero", title: "Home hero", options: HEROES },
  { key: "theme", title: "Colour version", options: THEMES },
  { key: "edition", title: "Site edition (copy & content)", options: EDITIONS },
  { key: "cta", title: "CTA gradient", options: CTAS },
] as const;

export type SiteConfig = { hero: string; theme: string; edition: string; cta: string };
export const DEFAULT_CONFIG: SiteConfig = { hero: "v1", theme: "classic", edition: "ingredients", cta: "theme" };

/** Keep only known, ready values; anything else becomes the default. */
export function normalizeConfig(input: unknown): SiteConfig {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out = { ...DEFAULT_CONFIG };
  for (const g of GROUPS) {
    const v = src[g.key];
    if (typeof v === "string" && g.options.some((o) => o.id === v && o.ready)) out[g.key] = v;
  }
  return out;
}

/** The config this build was made with. */
export const siteConfig: SiteConfig = normalizeConfig(raw);
