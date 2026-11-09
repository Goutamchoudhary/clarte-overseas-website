// Which design the site builds with. Change "version" in site-config.json to
// switch: v1 is the original site, v3 is "The Journey". An unknown value falls
// back to v1, so a bad edit can't break a build.
import raw from "./site-config.json";

const KNOWN = ["v1", "v2", "v3"];
const DEFAULT_VERSION = "v1";
const clean = (v: unknown) => (typeof v === "string" && KNOWN.includes(v) ? v : DEFAULT_VERSION);

// Local and Vercel preview builds can show another version, through the
// SITE_VERSION env var or site-config.preview.json. Production ignores both and
// uses site-config.json alone.
const env = (typeof process !== "undefined" ? process.env : {}) as Record<string, string | undefined>;
function previewVersion(): string | undefined {
  if (env.VERCEL_ENV === "production") return undefined;
  if (env.SITE_VERSION) return env.SITE_VERSION;
  const files = import.meta.glob("./site-config.preview.json", { eager: true, import: "default" }) as Record<string, { version?: string }>;
  return Object.values(files)[0]?.version;
}

/** The version this build was made with. */
export const siteConfig = { version: clean(previewVersion() ?? raw.version) };

/** True when the active version is `id` (e.g. isVersion("v3")). */
export const isVersion = (id: string) => siteConfig.version === id;
