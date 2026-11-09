# Site admin (design / theme / edition switcher)

Started Nov 2026. Lets the owner switch the home hero, the site's colour
version, the CTA gradient and the "site edition" (copy set) without a code
change. Design options are previewed on the "Clarté Hero & Theme Options"
canvas (claude.ai artifact).

## How it works

- `src/data/site-config.json` holds the live choices. `src/data/site-options.ts`
  lists every option, marks which are `ready`, and exports `siteConfig` —
  `normalizeConfig()` drops anything unknown or not ready, so a bad config
  can never break a build.
- **Publishing = a commit.** The admin writes `site-config.json` through the
  GitHub Contents API (`src/lib/admin/github.ts`) to `ADMIN_GITHUB_BRANCH`
  (default `main`); Vercel rebuilds (~2 min). Pages stay static — no runtime
  flag, no flicker, no SEO cost. History and one-click revert come from the
  commit log of that file.
- Admin page: `src/pages/admin/[key].astro`, the only SSR page besides the
  spec-sheet API. It is **not** built on `BaseLayout` on purpose — that layout
  loads GTM/analytics, which would ship the secret URL to third parties.

## Security model

| Layer | What |
|---|---|
| Secret URL | Lives at `/admin/<ADMIN_URL_KEY>` (32 random chars). Any other key → plain 404, compared in constant time. Not linked anywhere. |
| Sign-in | 6-digit Google Authenticator code only (RFC 6238 TOTP, ±30 s drift). Verified against RFC test vectors. |
| Replay | Each 30-s code works once (`SET NX` in Redis). |
| Brute force | 5 wrong codes → sign-in locked 15 min, **globally** (not per IP), stored in Upstash Redis. Production fails closed if Redis isn't configured. |
| Session | `__Host-clarte_admin` cookie: HMAC-SHA256 signed, HttpOnly, Secure, SameSite=Strict, 8 h. Rotate `ADMIN_SESSION_SECRET` to sign everyone out. |
| CSRF | POSTs must be same-origin (`Origin` / `Sec-Fetch-Site`) plus SameSite=Strict. |
| Indexing | `robots.txt` Disallow, `<meta robots noindex>`, `X-Robots-Tag` (page + `vercel.json`), not in the sitemap (SSR route). |
| Leakage | `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, strict CSP (no scripts at all), `X-Frame-Options: DENY`. |
| GitHub | Fine-grained token, **this repo only, Contents read/write only**. |

Trade-off: the global lockout means someone who learned the URL could keep
the owner locked out (not in). Fix = rotate `ADMIN_URL_KEY`.

## Setup (owner does this; secrets never go in code, chat or commits)

1. In your own terminal: `node scripts/admin-setup.mjs`. It prints
   `ADMIN_URL_KEY`, `ADMIN_TOTP_SECRET`, `ADMIN_SESSION_SECRET`, the
   Authenticator setup key and your admin URL.
2. Google Authenticator → + → Enter a setup key → paste the key (time based).
3. Vercel → Storage / Marketplace → **Upstash for Redis** (free) → connect to
   this project. It adds `KV_REST_API_URL` / `KV_REST_API_TOKEN` (or
   `UPSTASH_REDIS_REST_*`; either is read).
4. GitHub → Settings → Developer settings → Fine-grained tokens → repo
   `clarte-overseas-website` only → Repository permissions → Contents: Read
   and write. Save as `ADMIN_GITHUB_TOKEN`.
5. Add the three `ADMIN_*` values + the token to Vercel (Production), redeploy,
   open the bookmarked URL. Missing settings are listed by name on the page.

## Local testing

`.claude/launch.json` → `astro-admin-test` runs `astro dev` on :4322 with
`--env-file-if-exists=.env.admin-test` (git-ignored; throwaway test secrets,
never the real ones). In dev the lockout store falls back to memory. The
end-to-end checks used (wrong key 404, headers, cross-origin 403, replay,
tampered cookie, lockout) all passed on 8 Nov 2026.

## Two versions (Nov 2026)

The portal offers one choice: **Version 1 (original)** or **The Journey** (`v3`).
A setting appears only when it has two or more `ready` options; the others keep
their current value in hidden fields. V2 Living Collage is no longer selectable.

`site-config.json` stays on `v1` so that merging design work can't change the
live site; only publishing from the portal does. `site-config.preview.json`
(`v3`) makes local and Vercel preview builds show the new design, and production
ignores it. To see production's result locally: `VERCEL_ENV=production npm run build`.

The portal publishes to `ADMIN_GITHUB_BRANCH` (default `main`), so the code for a
design must be merged to that branch before switching to it.

## Status / next stages

- Done: admin, auth, publish/history/revert, config file. Only the current
  options (V1, Classic Navy, Ingredients, theme CTA) are `ready`; nothing on
  the public site reads the config yet.
- Next: (1) theme + CTA-gradient CSS variables keyed off `siteConfig`;
  (2) hero V2 (rotating category collage) and V3 (arch + photo pins);
  (3) bold heroes V4 (cobe globe) / V5 (GSAP kinetic type) if approved;
  (4) multi-category edition copy. Flip `ready: true` as each lands.
- Superseded in scope by whole-site versions (V2, V4, V5, V6, V8) — see
  [site-versions.md](site-versions.md). Those hero options are listed, not ready.
