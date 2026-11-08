// Signed, HttpOnly session cookie. Stateless: <payload>.<HMAC-SHA256>.
// __Host- prefix forces Secure + Path=/ + no Domain, so no subdomain (e.g.
// app.clarteoverseas.com) can set or read it.
import crypto from "node:crypto";
import { adminEnv } from "./env";

export const SESSION_COOKIE = "__Host-clarte_admin";
export const SESSION_HOURS = 8;

const b64u = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (data: string) => crypto.createHmac("sha256", adminEnv.sessionSecret()).update(data).digest();

export function createSession(nowMs = Date.now()): string {
  const payload = b64u(JSON.stringify({ iat: nowMs, exp: nowMs + SESSION_HOURS * 3600_000, n: crypto.randomBytes(8).toString("hex") }));
  return `${payload}.${b64u(sign(payload))}`;
}

export function verifySession(token: string | undefined, nowMs = Date.now()): boolean {
  if (!token || !adminEnv.sessionSecret()) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  const given = Buffer.from(mac, "base64url"), want = sign(payload);
  if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > nowMs;
  } catch { return false; }
}

export const sessionCookieOptions = {
  httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", maxAge: SESSION_HOURS * 3600,
};
