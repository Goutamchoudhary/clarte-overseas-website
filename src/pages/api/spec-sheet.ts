// =============================================================================
// Gated spec-sheet delivery.  POST { slug, name, email, company, requirement }
//   → validates the fields → streams the PDF back.
// The PDFs live in /spec-pdfs (outside public/), so there is NO public URL to
// guess or share — this function is the only way to obtain a sheet.
// GET is refused, so the endpoint can't be browsed to.
//
// Lead logging happens on the CLIENT (SpecSheetDialog → Web3Forms): Web3Forms'
// free plan rejects server-side POSTs, so the browser submits the lead the same
// way the enquiry form does.
// =============================================================================
import type { APIRoute } from "astro";
import fs from "node:fs";
import path from "node:path";
import { products } from "../../data/products";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const slugs = new Set(products.map((p) => p.slug));

// Resolve a spec PDF from the private dir. cwd is the project root in `astro dev`
// and (with includeFiles) in the Vercel function; a URL-relative path is the
// fallback for any other runtime.
function readPdf(slug: string): Buffer | null {
  const file = `${slug}-spec-sheet.pdf`;
  const candidates = [
    path.join(process.cwd(), "spec-pdfs", file),
    path.join(process.cwd(), ".vercel/output/functions", "spec-pdfs", file),
    new URL(`../../../spec-pdfs/${file}`, import.meta.url).pathname,
  ];
  for (const p of candidates) {
    try { if (fs.existsSync(p)) return fs.readFileSync(p); } catch { /* try next */ }
  }
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, string> = {};
  try {
    const ct = request.headers.get("content-type") || "";
    if (ct.includes("application/json")) body = await request.json();
    else body = Object.fromEntries((await request.formData()) as any);
  } catch {
    return json({ ok: false, error: "Malformed request." }, 400);
  }

  // Honeypot — bots fill hidden fields; humans never see them.
  if ((body.website || body.company_url || "").trim()) {
    return json({ ok: false, error: "Rejected." }, 400);
  }

  const slug = String(body.slug || "").trim();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const company = String(body.company || "").trim();
  const requirement = String(body.requirement || "").trim();

  if (!slugs.has(slug)) return json({ ok: false, error: "Unknown product." }, 400);
  if (!name || !company || !requirement) return json({ ok: false, error: "Please complete all fields." }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email." }, 400);

  const product = products.find((p) => p.slug === slug)!;
  const pdf = readPdf(slug);
  if (!pdf) return json({ ok: false, error: "Spec sheet is temporarily unavailable." }, 404);

  // The lead is logged client-side (Web3Forms rejects server-side POSTs); this
  // function's job is to validate and serve the gated file.
  const safe = product.name.replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Clarte-Overseas-${safe}-Spec-Sheet.pdf"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
};

// Anything other than POST is refused, so the file can't be reached by browsing.
export const GET: APIRoute = () =>
  json({ ok: false, error: "Method not allowed. Request a spec sheet from the product page." }, 405);
export const ALL: APIRoute = () => json({ ok: false, error: "Method not allowed." }, 405);

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
