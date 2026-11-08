# Whole-site versions (plan)

Started Nov 2026. The owner wants each "version" to restyle the **entire
site** — colours, design elements, animation, vector illustrations, every
section and page — not just the home hero. Designs are previewed on the
"Clarté Hero & Theme Options" canvas (claude.ai artifact, boards HeroV1–V8,
Vector kit, "Plan · whole-site versions"). Build them **one version at a
time**, in the order below. Admin + config are described in
[admin.md](admin.md).

## What a version is

One preset that switches all of these together:

1. Palette and type tokens (CSS custom properties)
2. Navbar — **same colour as the hero** (owner's favourite detail of V4/V5)
3. Home hero
4. Section headings and dividers
5. Cards, buttons, chips, forms
6. Motion library (only that version's library is loaded)
7. Vector kit colours (same SVGs, version palette)
8. Page moments: products list, category, product page, How We Export,
   certifications, about, contact / thank-you, blog, 404

The **edition** (copy: ingredients vs multi-category) and the **CTA gradient**
stay separate admin switches, so any version can run either copy set.

## The versions

| ID | Name | Look | Motion library | Signature elements across the site |
|---|---|---|---|---|
| V1 | Classic Harvest | Today's site | CSS only | Unchanged; default and fallback |
| V4 | Trade Atlas | Lavender-white, ink #15123a, violet/blue/pink | cobe (globe, ~5 KB) + GSAP | Globe hero with arcs from India + waving farmer; route line farm → mill → lab → port drawn on scroll (How We Export); origin pins on category cards; "farm to port" strip on product pages; contact globe with buyer-port pin; ship on thank-you |
| V5 | Kinetic Harvest | Warm paper #fbf9f4, ink, magenta/violet | GSAP ScrollTrigger + SplitText | Photo-filled page titles; pinned line-by-line reveals; sideways category rail; magazine layout with thin rules; scribble underlines drawn on scroll |
| V6 | Powder Lab | Midnight #0c0a1f, powder-colour accents | Three.js (Points morph) | Particle hero (leaf → mound → container → globe); product page as "spec lab" with gauges in mono type; glowing certification badges; count-up numbers; line-art lab icons |
| V7 | Departures | Ink board #14112e, amber #fcd34d | anime.js | Split-flap product board hero (data from `products.ts`); flip-in headings and counters; shipping-label product cards (perforation, barcode, stamp); board view for products; booking-slip quote form |
| V8 | Ingredient Drop | Pastel lavender / blush / sky | Matter.js (+ springy CSS) | Category photo "balls" drop and pile, drag to toss; sticker-style vectors with white outlines; bouncy chips/cards; footer ball pile |

V2 (rotating collage) and V3 (midnight arch) remain hero-only options.

## Vector kit

Source SVGs: `docs/design/vector-kit/` — farmer, container ship, export sack,
herb sprig (flat, 1–3 KB each). When building, move them into
`src/components/vectors/*.astro` as inline SVG with `currentColor`/CSS vars so
each version recolours them, and animate with CSS (or GSAP in V4). Planned
additions: lab technician, delivery truck, drying racks, mill, warehouse,
port crane.

## Architecture (when building)

- `site-config.json` gains `version`; `BaseLayout` sets
  `<html data-version="v4">`. Version tokens live in one stylesheet per
  version, loaded only for the active one. Keep it inside the
  `defer-site-css.mjs` capture (see CLAUDE.md) and verify with
  `npm run build`, not dev.
- Version-specific markup: `src/components/versions/<id>/…`, chosen at build
  time from `siteConfig` — pages stay static, no client flag, no flicker.
- Libraries load **after first paint** (dynamic import on idle / in view),
  only on pages that use them. The hero's static first frame must be real
  HTML/CSS/image with `data-splash-hero` so the splash and LCP rules still
  hold. Budgets: ≤ 60 KB gz JS per page except V6 (Three.js, desktop gets
  more particles than mobile).
- `prefers-reduced-motion`: every version renders a still, complete state.
- Admin: add a "Site version" group to `site-options.ts` (`ready: false`
  until built). Hero options V6–V8 are already listed, not ready.

## Build order and per-version checklist

1. Foundation: `version` config, token files, vector components, library
   loader, admin group.
2. V4 → V5 → V6 → V7 → V8, one PR each. For each: navbar, hero, section
   headings, cards/buttons/forms, footer, then pages (home, products,
   category, product, How We Export, certifications, about, contact, blog,
   404), mobile pass, reduced motion, Lighthouse vs V1, flip `ready: true`.
