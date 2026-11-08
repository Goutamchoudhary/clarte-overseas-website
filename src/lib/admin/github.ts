// Publishing = committing src/data/site-config.json to the repo through the
// GitHub Contents API. Vercel sees the commit and rebuilds the site (~2 min),
// so every page stays a pre-built static page. Every publish is a commit, which
// gives free history and one-click revert.
import { adminEnv } from "./env";

export const CONFIG_PATH = "src/data/site-config.json";

const api = (p: string) => `https://api.github.com/repos/${adminEnv.githubRepo()}${p}`;
const headers = () => ({
  Authorization: `Bearer ${adminEnv.githubToken()}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "clarte-site-admin",
});

async function gh<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(api(path), { ...init, headers: { ...headers(), ...(init?.headers || {}) } });
  if (!res.ok) throw new Error(`GitHub ${res.status}`);
  return (await res.json()) as T;
}

type FileResp = { sha: string; content: string };

export async function readConfigAt(ref: string): Promise<{ sha: string; json: unknown }> {
  const f = await gh<FileResp>(`/contents/${CONFIG_PATH}?ref=${encodeURIComponent(ref)}`);
  return { sha: f.sha, json: JSON.parse(Buffer.from(f.content, "base64").toString("utf8")) };
}

export async function writeConfig(json: unknown, message: string): Promise<string> {
  const branch = adminEnv.githubBranch();
  const { sha } = await readConfigAt(branch);
  const body = {
    message,
    content: Buffer.from(JSON.stringify(json, null, 2) + "\n").toString("base64"),
    sha, branch,
  };
  const r = await gh<{ commit: { sha: string } }>(`/contents/${CONFIG_PATH}`, { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
  return r.commit.sha;
}

export type HistoryItem = { sha: string; message: string; date: string };

export async function configHistory(limit = 10): Promise<HistoryItem[]> {
  const list = await gh<{ sha: string; commit: { message: string; committer: { date: string } } }[]>(
    `/commits?path=${encodeURIComponent(CONFIG_PATH)}&sha=${encodeURIComponent(adminEnv.githubBranch())}&per_page=${limit}`,
  );
  return list.map((c) => ({ sha: c.sha, message: c.commit.message.split("\n")[0], date: c.commit.committer.date }));
}
