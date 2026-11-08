// Admin secrets come only from the runtime environment (Vercel → Settings →
// Environment Variables). Nothing here has a default for a secret: a missing
// value means the admin refuses to work rather than running unprotected.
// Generate them with `node scripts/admin-setup.mjs` (see docs/handoff/admin.md).

const get = (k: string) => (process.env[k] ?? "").trim();

export const adminEnv = {
  /** Unguessable path segment: the admin lives at /admin/<urlKey>. */
  urlKey: () => get("ADMIN_URL_KEY"),
  /** Base32 TOTP secret shared with Google Authenticator. */
  totpSecret: () => get("ADMIN_TOTP_SECRET"),
  /** Random key that signs the session cookie. Rotating it signs everyone out. */
  sessionSecret: () => get("ADMIN_SESSION_SECRET"),
  /** Fine-grained GitHub token: Contents read & write on this one repo only. */
  githubToken: () => get("ADMIN_GITHUB_TOKEN"),
  githubRepo: () => get("ADMIN_GITHUB_REPO") || "Goutamchoudhary/clarte-overseas-website",
  githubBranch: () => get("ADMIN_GITHUB_BRANCH") || "main",
  /** Upstash Redis REST (Vercel Marketplace → Upstash). Either naming works. */
  redisUrl: () => get("UPSTASH_REDIS_REST_URL") || get("KV_REST_API_URL"),
  redisToken: () => get("UPSTASH_REDIS_REST_TOKEN") || get("KV_REST_API_TOKEN"),
};

/** Names of required settings that are missing (names only — never values). */
export function missingAdminEnv(): string[] {
  const miss: string[] = [];
  if (adminEnv.urlKey().length < 24) miss.push("ADMIN_URL_KEY");
  if (adminEnv.totpSecret().length < 16) miss.push("ADMIN_TOTP_SECRET");
  if (adminEnv.sessionSecret().length < 32) miss.push("ADMIN_SESSION_SECRET");
  if (!adminEnv.githubToken()) miss.push("ADMIN_GITHUB_TOKEN");
  // `astro dev` falls back to an in-memory store (see store.ts); production never does.
  if (!import.meta.env.DEV && (!adminEnv.redisUrl() || !adminEnv.redisToken())) miss.push("UPSTASH_REDIS_REST_URL / _TOKEN");
  return miss;
}
