// One-time admin setup. Run it YOURSELF in your own terminal:
//
//   node scripts/admin-setup.mjs
//
// It prints three fresh secrets for Vercel's Environment Variables and the
// key to add to Google Authenticator. Nothing is written to disk or sent
// anywhere. Don't paste the output into chat, commits or docs.
// Re-running makes NEW secrets: replace all three in Vercel, re-add the
// account in Google Authenticator, and your admin URL changes.
import crypto from "node:crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32(buf) {
  let bits = 0, val = 0, out = "";
  for (const b of buf) {
    val = (val << 8) | b; bits += 8;
    while (bits >= 5) { out += B32[(val >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits > 0) out += B32[(val << (5 - bits)) & 31];
  return out;
}

const totp = base32(crypto.randomBytes(20));
const session = crypto.randomBytes(32).toString("base64url");
const urlKey = crypto.randomBytes(24).toString("base64url");
const label = encodeURIComponent("Clarté Overseas:Site admin");
const uri = `otpauth://totp/${label}?secret=${totp}&issuer=${encodeURIComponent("Clarté Overseas")}&algorithm=SHA1&digits=6&period=30`;

console.log(`
1) Vercel → Project → Settings → Environment Variables (Production), add:

   ADMIN_URL_KEY=${urlKey}
   ADMIN_TOTP_SECRET=${totp}
   ADMIN_SESSION_SECRET=${session}

2) Google Authenticator → + → "Enter a setup key":
   Account: Clarté site admin
   Key:     ${totp.match(/.{1,4}/g).join(" ")}
   Type:    Time based

   (or, if your app can import a URI: ${uri})

3) Your admin page (bookmark it, keep it private):
   https://www.clarteoverseas.com/admin/${urlKey}
`);
