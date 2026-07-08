// =============================================================================
// Spec-sheet PDF generator.
//
//   Run:  npm run specs        (see package.json — uses Node 22 type stripping)
//
// Reads product data (src/data/products.ts) + technical specs (src/data/specs.ts)
// and writes one branded, product-specific PDF per product into
// public/assets/specs/<slug>-spec-sheet.pdf.
//
// Pure Node + pdfkit — no headless browser, no network. Safe to re-run any time
// the catalogue or specs change; output is deterministic.
// =============================================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import { products, getCategory } from "../src/data/products.ts";
import { productSpecs, categoryDefaults, type KV } from "../src/data/specs.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// PRIVATE — outside public/ so the PDFs have no guessable URL. They are served
// only by the gated /api/spec-sheet function (bundled via includeFiles).
const OUT_DIR = path.join(ROOT, "spec-pdfs");
const LOGO_SVG = path.join(ROOT, "public", "assets", "logo", "logo-horizontal-white.svg");

// --- Brand palette -----------------------------------------------------------
const BRAND = "#1f4693";
const BRAND_DARK = "#16306e";
const GOLD = "#e0a234";
const INK = "#1f2937";
const MUTED = "#64748b";
const LINE = "#e4e8f0";
const ROW_ALT = "#f5f7fb";
const WHITE = "#ffffff";

// --- Company block ------------------------------------------------------------
const CO = {
  name: "Clarté Overseas",
  site: "www.clarteoverseas.com",
  email: "info@clarteoverseas.com",
  phone: "+91 98189 15310",
  address: "1st Floor, CW-59, Sanjay Gandhi Transport Nagar, Delhi 110042, India",
};

// --- Page geometry ------------------------------------------------------------
const PAGE = { w: 595.28, h: 841.89 };
const M = { top: 40, bottom: 62, left: 44, right: 44 };
const CW = PAGE.w - M.left - M.right; // content width
const BOTTOM_LIMIT = PAGE.h - M.bottom;

const ISSUE = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

// pdfkit's built-in Helvetica is WinAnsi-encoded — it has no glyph for the
// Unicode math operators (≤ U+2264 / ≥ U+2265) or subscript digits (SO₂).
// Convert them to clean, spec-sheet-standard ASCII so nothing renders as tofu.
const SUBS: Record<string, string> = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
function sx(s: string): string {
  return String(s)
    .replace(/≤\s*/g, "max. ")
    .replace(/≥\s*/g, "min. ")
    .replace(/[₀-₉]/g, (d) => SUBS[d] || d);
}

function moistureOf(grades: string[]): string {
  for (const g of grades) {
    const m = g.match(/Moisture\s*≤\s*([\d.]+)\s*%/i);
    if (m) return `≤ ${m[1]}%`;
  }
  return "≤ 8%";
}

type Doc = InstanceType<typeof PDFDocument>;

// ---- low-level helpers ------------------------------------------------------
function ensure(doc: Doc, needed: number) {
  if (doc.y + needed > BOTTOM_LIMIT) {
    doc.addPage();
    doc.y = M.top;
  }
}

function sectionTitle(doc: Doc, label: string) {
  ensure(doc, 34);
  const y = doc.y;
  doc.save();
  doc.rect(M.left, y + 2, 3.5, 13).fill(GOLD);
  doc.fillColor(BRAND).font("Helvetica-Bold").fontSize(11)
    .text(label.toUpperCase(), M.left + 10, y, { characterSpacing: 0.6 });
  doc.restore();
  doc.moveTo(M.left, y + 20).lineTo(M.left + CW, y + 20).lineWidth(0.6).strokeColor(LINE).stroke();
  doc.y = y + 28;
}

// A key/value card with a titled bar and zebra rows. Returns the bottom y.
function kvCard(doc: Doc, x: number, y: number, w: number, title: string, rows: KV[]): number {
  const titleH = 20;
  const rowH = 16;
  const padX = 9;
  // title bar
  doc.rect(x, y, w, titleH).fill(BRAND);
  doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(8.5)
    .text(title.toUpperCase(), x + padX, y + 6, { width: w - padX * 2, characterSpacing: 0.4 });
  let ry = y + titleH;
  const kW = Math.round(w * 0.52);
  rows.forEach((r, i) => {
    // dynamic height for wrapping values
    doc.font("Helvetica").fontSize(8);
    const vH = doc.heightOfString(sx(r.v), { width: w - kW - padX * 2 });
    const h = Math.max(rowH, vH + 6);
    if (i % 2 === 1) { doc.rect(x, ry, w, h).fill(ROW_ALT); }
    doc.fillColor(MUTED).font("Helvetica").fontSize(8)
      .text(sx(r.k), x + padX, ry + 4, { width: kW - padX });
    doc.fillColor(INK).font("Helvetica-Bold").fontSize(8)
      .text(sx(r.v), x + kW, ry + 4, { width: w - kW - padX });
    ry += h;
  });
  // border
  doc.rect(x, y, w, ry - y).lineWidth(0.6).strokeColor(LINE).stroke();
  return ry;
}

// Two cards side by side; returns the taller bottom y (adds a page if needed).
function kvCardsRow(doc: Doc, left: { title: string; rows: KV[] }, right: { title: string; rows: KV[] }) {
  const gap = 16;
  const w = (CW - gap) / 2;
  const estL = 20 + left.rows.length * 16 + 8;
  const estR = 20 + right.rows.length * 16 + 8;
  ensure(doc, Math.max(estL, estR));
  const y = doc.y;
  const by1 = kvCard(doc, M.left, y, w, left.title, left.rows);
  const by2 = kvCard(doc, M.left + w + gap, y, w, right.title, right.rows);
  doc.y = Math.max(by1, by2) + 14;
}

function fullCard(doc: Doc, title: string, rows: KV[]) {
  const est = 20 + rows.length * 16 + 8;
  ensure(doc, est);
  const by = kvCard(doc, M.left, doc.y, CW, title, rows);
  doc.y = by + 14;
}

function paragraph(doc: Doc, text: string, opts: { size?: number; color?: string } = {}) {
  const size = opts.size ?? 9;
  const t = sx(text);
  doc.font("Helvetica").fontSize(size);
  const h = doc.heightOfString(t, { width: CW, lineGap: 2 });
  ensure(doc, h + 4);
  doc.fillColor(opts.color ?? INK).text(t, M.left, doc.y, { width: CW, lineGap: 2 });
  doc.y += 12;
}

// Pill chips that wrap onto new lines when they run past the content width.
function chipRow(doc: Doc, items: string[]) {
  const chipH = 16, gapX = 7, gapY = 7, padX = 8;
  doc.fontSize(8).font("Helvetica-Bold");
  ensure(doc, chipH + 8);
  let x = M.left, y = doc.y;
  items.forEach((raw) => {
    const t = sx(raw);
    const tw = Math.min(doc.widthOfString(t) + padX * 2, CW);
    if (x + tw > M.left + CW) { x = M.left; y += chipH + gapY; ensure(doc, chipH + 8); if (doc.y > y) y = doc.y; }
    doc.roundedRect(x, y, tw, chipH, 8).fill(ROW_ALT);
    doc.fillColor(BRAND).font("Helvetica-Bold").fontSize(8).text(t, x + padX, y + 4, { lineBreak: false });
    x += tw + gapX;
  });
  doc.y = y + chipH + 10;
}

// ---- header band + footer ---------------------------------------------------
function header(doc: Doc, productName: string, sub: string) {
  const bandH = 84;
  doc.rect(0, 0, PAGE.w, bandH).fill(BRAND);
  doc.rect(0, bandH, PAGE.w, 3).fill(GOLD);
  // logo (SVG, white) with graceful fallback to a wordmark
  try {
    const svg = fs.readFileSync(LOGO_SVG, "utf8");
    SVGtoPDF(doc, svg, M.left, 20, { width: 190, assumePt: true });
  } catch {
    doc.fillColor(WHITE).font("Helvetica-Bold").fontSize(20)
      .text("CLARTÉ OVERSEAS", M.left, 30, { characterSpacing: 1 });
  }
  // right-side document label
  doc.fillColor("#cdd9f5").font("Helvetica-Bold").fontSize(9)
    .text("PRODUCT SPECIFICATION", PAGE.w - M.right - 200, 26, { width: 200, align: "right", characterSpacing: 1.2 });
  doc.fillColor("#9fb6e6").font("Helvetica").fontSize(8)
    .text("Technical Data Sheet · Typical values", PAGE.w - M.right - 200, 40, { width: 200, align: "right" });
  // product title strip
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(19)
    .text(sx(productName), M.left, bandH + 16, { width: CW });
  doc.fillColor(MUTED).font("Helvetica").fontSize(9.5)
    .text(sx(sub), M.left, doc.y + 1, { width: CW });
  doc.y += 12;
}

function footer(doc: Doc, pageNo: number, pageCount: number) {
  // Writing inside the bottom margin makes pdfkit auto-add a page; zero the
  // page's bottom margin and disable line-breaking so the footer stays put.
  doc.page.margins.bottom = 0;
  const o = { lineBreak: false } as const;
  const y = PAGE.h - M.bottom + 12;
  doc.moveTo(M.left, y).lineTo(M.left + CW, y).lineWidth(0.6).strokeColor(LINE).stroke();
  doc.fillColor(MUTED).font("Helvetica").fontSize(7)
    .text(`${CO.name}  ·  ${CO.address}`, M.left, y + 5, { width: CW, align: "left", ...o });
  doc.fillColor(MUTED).font("Helvetica").fontSize(7)
    .text(`${CO.site}  ·  ${CO.email}  ·  ${CO.phone}`, M.left, y + 15, { width: CW - 90, align: "left", ...o });
  doc.fillColor(MUTED).font("Helvetica").fontSize(7)
    .text(`Page ${pageNo} of ${pageCount}`, M.left + CW - 90, y + 15, { width: 90, align: "right", ...o });
  doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(6.5)
    .text(`Issued ${ISSUE} · Rev 1 · Typical specification, not a Certificate of Analysis.`, M.left, y + 25, { width: CW, align: "left", ...o });
}

// ---- one product ------------------------------------------------------------
function buildProduct(slug: string) {
  const p = products.find((x) => x.slug === slug)!;
  const cat = getCategory(p.category)!;
  const s = productSpecs[slug];
  const cd = categoryDefaults[p.category];

  const doc = new PDFDocument({
    size: [PAGE.w, PAGE.h], bufferPages: true,
    margins: { top: M.top, bottom: M.bottom, left: M.left, right: M.right },
    info: {
      Title: `${p.name} — Product Specification`,
      Author: CO.name,
      Subject: `Technical data sheet for ${p.name} (HSN ${p.hsn})`,
      Keywords: `${p.name}, ${cat.name}, spec sheet, dehydrated, powder, export, Clarté Overseas`,
    },
  });

  header(doc, p.name, `${cat.name}${p.botanical ? "  ·  " + p.botanical : ""}`);
  chipRow(doc, [
    `HSN ${p.hsn}`,
    cd.gradeLabel,
    "Origin: India",
    s.mesh.split("(")[0].trim(),
  ]);

  // Description
  paragraph(doc, p.description);

  // Identification + Organoleptic (side by side)
  const idRows: KV[] = [
    { k: "Product name", v: p.name },
    { k: "Botanical name", v: p.botanical || "—" },
    { k: "Category", v: cat.name },
    { k: "HSN code", v: p.hsn },
    { k: "Country of origin", v: "India" },
    { k: "Grade", v: cd.gradeLabel },
    { k: "Processing", v: p.drying || "Dehydrated" },
    { k: "Available forms", v: p.forms ? p.forms.join(", ") : "Powder" },
  ];
  const organo: KV[] = [
    { k: "Appearance", v: s.appearance },
    { k: "Colour", v: s.colour },
    { k: "Odour", v: s.odour },
    { k: "Taste / flavour", v: s.taste },
  ];
  sectionTitle(doc, "Product identification & sensory");
  kvCardsRow(doc, { title: "Identification", rows: idRows }, { title: "Organoleptic", rows: organo });

  // Physico-chemical
  const physico: KV[] = [
    { k: "Moisture", v: moistureOf(p.grades) },
    { k: "Granulation / mesh", v: s.mesh },
    ...(s.params || []),
  ];
  sectionTitle(doc, "Physico-chemical & quality");
  fullCard(doc, "Physico-chemical parameters", physico);

  // Micro + heavy metals (side by side)
  sectionTitle(doc, "Microbiological & contaminants");
  kvCardsRow(doc,
    { title: "Microbiological (limits)", rows: cd.micro },
    { title: "Heavy metals (max)", rows: cd.heavyMetals });

  // Nutrition
  const n = s.nutrition;
  const nutrition: KV[] = [
    { k: "Energy", v: `${n.energy} kcal` },
    { k: "Protein", v: `${n.protein} g` },
    { k: "Total fat", v: `${n.fat} g` },
    { k: "Carbohydrate", v: `${n.carb} g` },
    { k: "— of which sugars", v: `${n.sugars} g` },
    { k: "Dietary fibre", v: `${n.fibre} g` },
    { k: "Sodium", v: `${n.sodium} mg` },
  ];
  sectionTitle(doc, "Nutritional information (typical, per 100 g)");
  fullCard(doc, "Typical values per 100 g", nutrition);
  if (s.nutritionNote) paragraph(doc, s.nutritionNote, { size: 8.5, color: MUTED });

  // Applications
  sectionTitle(doc, "Applications");
  chipRow(doc, p.uses);

  // Handling / compliance
  sectionTitle(doc, "Allergen, packaging & compliance");
  fullCard(doc, "Handling & compliance", [
    { k: "Allergen & dietary", v: cd.allergen },
    { k: "Packaging", v: cd.packaging },
    { k: "Storage", v: cd.storage },
    { k: "Shelf life", v: cd.shelfLife },
    { k: "Quality & compliance", v: cd.compliance },
  ]);

  // Disclaimer box
  ensure(doc, 46);
  {
    const y = doc.y;
    doc.roundedRect(M.left, y, CW, 40, 6).fill("#fbfaf4").strokeColor(GOLD).lineWidth(0.8).stroke();
    doc.fillColor("#8a6d1f").font("Helvetica-Bold").fontSize(7.5)
      .text("DISCLAIMER", M.left + 10, y + 7);
    doc.fillColor("#6b5a2a").font("Helvetica").fontSize(7.5)
      .text(
        "This document states typical / indicative specifications for guidance only and is not a Certificate of Analysis. Figures vary with crop, grade and drying method. Each shipment is accompanied by a batch-specific COA from the processing unit, which governs the actual delivered specification. Specifications can be tailored to your formulation on request.",
        M.left + 10, y + 18, { width: CW - 20, lineGap: 1 });
    doc.y = y + 46;
  }

  // footers on all buffered pages
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(range.start + i);
    footer(doc, i + 1, range.count);
  }
  doc.flushPages();

  const outPath = path.join(OUT_DIR, `${slug}-spec-sheet.pdf`);
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);
  doc.end();
  return new Promise<string>((resolve, reject) => {
    stream.on("finish", () => resolve(outPath));
    stream.on("error", reject);
  });
}

// ---- run --------------------------------------------------------------------
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const p of products) {
    const out = await buildProduct(p.slug);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log(`  ✓ ${path.basename(out)}  (${kb} KB)`);
    ok++;
  }
  console.log(`\nGenerated ${ok}/${products.length} spec sheets → spec-pdfs/ (private)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
