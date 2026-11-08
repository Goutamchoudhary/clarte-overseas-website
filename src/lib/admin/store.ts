// Login lockout + code-replay protection, kept in Upstash Redis (REST API, no
// SDK). Serverless instances share no memory, so this has to live outside the
// function. Lockout is GLOBAL, not per-IP: an attacker rotating IPs still gets
// only 5 guesses per 15 minutes at a 1-in-a-million code — and they'd first
// need the secret admin URL.
//
// In production a missing store makes login refuse (fail closed). Only
// `astro dev` falls back to process memory.
import { adminEnv } from "./env";

export const MAX_FAILS = 5;
export const LOCK_SECONDS = 15 * 60;

const mem = new Map<string, { v: string; until: number }>();
const isDev = () => !!import.meta.env.DEV;

async function redis(cmd: (string | number)[]): Promise<unknown> {
  const url = adminEnv.redisUrl(), token = adminEnv.redisToken();
  if (!url || !token) {
    if (isDev()) return memCmd(cmd);
    throw new Error("rate-limit store not configured");
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) throw new Error(`rate-limit store error ${res.status}`);
  const data = (await res.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error("rate-limit store error");
  return data.result;
}

function memCmd([op, key, ...rest]: (string | number)[]): unknown {
  const k = String(key), now = Date.now(), e = mem.get(k);
  const live = e && e.until > now ? e : undefined;
  switch (op) {
    case "GET": return live?.v ?? null;
    case "DEL": mem.delete(k); return 1;
    case "INCR": { const v = Number(live?.v ?? 0) + 1; mem.set(k, { v: String(v), until: live?.until ?? Infinity }); return v; }
    case "EXPIRE": if (live) live.until = now + Number(rest[0]) * 1000; return 1;
    case "SET": { // SET key val [NX] EX secs
      const nx = rest.includes("NX"), ex = Number(rest[rest.indexOf("EX") + 1]);
      if (nx && live) return null;
      mem.set(k, { v: String(rest[0]), until: now + ex * 1000 }); return "OK";
    }
  }
  return null;
}

const K = { fails: "clarte:admin:fails", lock: "clarte:admin:lock", used: (c: number) => `clarte:admin:totp:${c}` };

export async function isLocked(): Promise<boolean> {
  return (await redis(["GET", K.lock])) !== null;
}

export async function recordFailure(): Promise<void> {
  const n = Number(await redis(["INCR", K.fails]));
  if (n === 1) await redis(["EXPIRE", K.fails, LOCK_SECONDS]);
  if (n >= MAX_FAILS) {
    await redis(["SET", K.lock, "1", "EX", LOCK_SECONDS]);
    await redis(["DEL", K.fails]);
  }
}

export async function clearFailures(): Promise<void> {
  await redis(["DEL", K.fails]);
}

/** True the first time a time-step is used; false on any replay of that code. */
export async function claimTotpStep(step: number): Promise<boolean> {
  return (await redis(["SET", K.used(step), "1", "NX", "EX", 180])) === "OK";
}
