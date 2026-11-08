// RFC 6238 TOTP (the 6-digit codes Google Authenticator shows): HMAC-SHA1,
// 30-second steps. No dependency — node:crypto only.
import crypto from "node:crypto";

const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Buffer {
  const s = input.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0, val = 0;
  const out: number[] = [];
  for (const c of s) {
    const i = B32.indexOf(c);
    if (i < 0) throw new Error("invalid base32 secret");
    val = (val << 5) | i;
    bits += 5;
    if (bits >= 8) { out.push((val >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(out);
}

export function hotp(key: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac("sha1", key).update(msg).digest();
  const o = h[h.length - 1] & 0x0f;
  const n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 10 ** digits).padStart(digits, "0");
}

function sameString(a: string, b: string): boolean {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/**
 * Checks a 6-digit code against the current step and one step either side
 * (covers phone clock drift). Returns the matching time-step counter — the
 * caller must record it so the same code can't be replayed — or null.
 */
export function verifyTotp(secretB32: string, code: string, nowMs = Date.now(), window = 1): number | null {
  const clean = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return null;
  const key = base32Decode(secretB32);
  const step = Math.floor(nowMs / 1000 / 30);
  let match: number | null = null;
  // Check every step (no early exit) so timing doesn't reveal which matched.
  for (let w = -window; w <= window; w++) {
    if (sameString(hotp(key, step + w), clean) && match === null) match = step + w;
  }
  return match;
}
