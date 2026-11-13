# Whole-site versions (plan)

> **Direction changed on 8 Nov 2026: one combined design, not switchable themes.**
> The owner wants a single site that uses V2, V3, V4, V5, V6 and V8 together,
> each with its own job, and all 30 vector illustrations in large and small
> sizes. Canvas boards "Home A / B / C" are the three proposed home pages;
> "Page ·" boards show the other pages; "Where every design and vector goes"
> maps them. Fixed requirements:
>
> - Home hero stays V5 (Grown / Milled / Shipped) with a designed Request a
>   Quote button (three options on the boards).
> - "From India to your port" replaces or absorbs the Export Footprint section.
> - Inner-page headers keep the light watermark word + dark heading, but take
>   a third to half of the screen (330 px on the boards, about 640 today) with
>   a smaller heading; colours can vary by page.
> - At most 2 pinned scroll moments per page, none on phones; every section
>   has a finished still state for reduced motion.
>
> **Home A "The Journey" chosen (8 Nov 2026).** Build notes from the owner:
>
> - Our Process reel: product photos only, read from the same product records
>   as `/products` (`image` field via `smallest()`, skipping coming-soon and
>   unavailable products), never copied, so new photos appear automatically.
> - Who We Serve: V1's `industries-we-serve-v2.webp`, plus the existing
>   `home.industries_sub` line.
> - Clarté Edge: arch stays; no photo. Each reason lights up in turn and its
>   illustration fills the arch.
> - Standards & Trust: the 14 official logos, compact, in two labelled rows.
>   Testimonials are a separate section with their own heading.
> - Closing CTA: WhatsApp, Calendly and a compact Request a Quote; truck, crane
>   and ship drop from above onto road and water, with clear space under the
>   buttons. No falling photos here.
> - Footer: same layout, links and content as V1, recoloured to the home page
>   palette (midnight background, gradient top line, lavender accents).
> - Closing CTA vectors are medium size (truck 200, crane 210, ship 270 px wide)
>   and the plane vector flies right to left across the sky. Calendly button
>   uses the V1 lavender `.btn-calendly` colour everywhere.
> - Testimonials: two compact cards, person's name and country only. Quote,
>   name and country must come from real buyers; the section stays hidden until
>   they exist. The live site's four quotes are not from real buyers and need
>   removing (raised with the owner 9 Nov 2026).
> - Who We Serve photo: colour-corrected to remove the green cast
>   (`sharp` recomb R 1.0 / G 0.985 / B 1.07, linear 1.1/-14, saturation 1.1,
>   brightness 1.08). Save as a new filename when building (immutable cache).
> - Owner will send feedback on the other pages before implementation starts.
>
> **Status (9 Nov 2026): Home A is built but NOT live.** Production runs V1
> (`version: "v1"` on main); the owner reviews on the `feat/site-admin` preview and
> switches production from the admin portal. Built as site version `v3`
> (`src/components/home/HomeJourney.astro`, `public/css/site-v3.css`,
> `public/js/site-v3.js`, inline vectors via `src/components/Vector.astro`).
> Navbar hides on scroll down and returns on scroll up, on every page
> (`#navbar.nav-away`, in `site-v3.js`).
> `/products` done: page colour runs navbar → header → first category (fade
> via `.j-flow-first::before`), `ProductShuffle.astro` shuffles three photos per
> category from the product records, and the five-document section (`products.doc*`).
> `/how-we-export`: Stage by Stage is the night sea chart (`StageJourney.astro`):
> desktop pins and travels the chart right, down, left, down, right.
> `/products` has an FAQ reusing
> `export.faq*`.
> v3 assets now load on every page: navbar and footer colours everywhere, and
> compact `PageHero` headers (330 px, tint per page via `data-ph`). Section
> order: Hero (full screen, sticky) with Range sliding over it, then Who We Serve, Why Dehydrated, Process, Edge, From
> India, Sourcing, Certifications, CTA. New copy is in all 17 locales
> (`home.j_*`). Not done: Matter.js drag-to-toss (circles use a CSS drop), a
> real cobe globe (SVG dome). `buyerFeedback` in HomeJourney stays empty.
> About still renders the old unverified `Testimonials` component.
>
> The version switch and V2 build below (commit b740ba8, not merged) are still
> on `feat/site-admin`. Reuse the V2 collage parts in the combined design. The
> rest of this document is the earlier per-version plan, kept for its phone
> rules and architecture notes.

Started Nov 2026. Each "version" restyles the **entire site**: colours,
design elements, animation, vector illustrations, every section and page. It
is more than a home-hero swap. Designs are previewed on the
"Clarté Hero & Theme Options" canvas (claude.ai artifact). The canvas has
these boards:

- Heroes V1–V6 and V8
- Phone versions of the heroes
- Vector kit + vector library
- Six product-range section ideas
- "Plan · whole-site versions"

Build **one version at a time**. Admin and config are described in
[admin.md](admin.md).

The owner picked **V2, V4, V5, V8** as the versions to redesign the site
around, plus **V6** as the dark-mode version. **V7 (split-flap board) was
dropped** on 8 Nov 2026. V3 stays a hero-only option.

## Status

- **V2 Living Collage — built (Nov 2026), publishable from the admin.**
  Production still runs V1 until the owner switches "Site version" to V2.
- V4, V5, V6, V8: planned below.

## How versions are wired (built with V2)

- `site-config.json` → `version` (`v1` default). Options + `ready` flags in
  `src/data/site-options.ts` (`VERSIONS`); `isVersion("v2")` in templates.
- `BaseLayout` sets `<html data-version="…">` and, for any version other than
  V1, links `/css/site-<v>.css` right after styles.css and defers
  `/js/site-<v>.js`. `defer-site-css.mjs` moves that stylesheet with
  styles.css (same order); `minify-css.mjs` minifies both; both feed the
  `__ASSET_V__` hash. V1 pages contain no V2 bytes at all.
- Every rule in `site-<v>.css` is scoped `[data-version="<v>"] …`.
- Version-only markup: `src/components/versions/<v>/`. V2 swaps the home
  hero (`HeroCollage`) and product range (`CategoryBento`), and
  `PageHero` renders a split layout with rotating tiles (`CollageTiles`).
  Everything else is restyled by CSS. V2 adds **no new i18n keys** — it
  reuses existing ones, so all 17 languages work.
- Collage photos: `public/assets/img/categories/collage/<slug>-{520,900}.webp`
  from `node scripts/gen-collage-images.mjs`. Fruit and Hydrocolloids only
  have 500 px sources (no -900); give them 1600 px category photos to sharpen
  their desktop tiles.
- **Previewing a version without publishing it:**
  - local: `SITE_VERSION=v2 npm run build` then the `prod-static` server;
  - Vercel preview deployments (never production) read
    `src/data/site-config.preview.json` (`{"version":"v2"}` on
    `feat/site-admin`) or a `SITE_VERSION` env var. Production ignores both.

## What a version is

One preset that switches all of these together:

1. Palette and type tokens (CSS custom properties)
2. Navbar: **same colour as the hero** (the owner's favourite detail of V4/V5)
3. Home hero
4. Section headings and dividers
5. Cards, buttons, chips, forms
6. Motion library (only that version's library is loaded)
7. Vector kit colours (same SVGs, version palette)
8. Page moments: products list, category, product page, How We Export,
   certifications, about, contact / thank-you, blog, 404

The **edition** (ingredients vs multi-category copy) and the **CTA gradient**
stay separate admin switches.

## The versions

| ID | Name | Look | Motion library | Signature elements across the site |
|---|---|---|---|---|
| V1 | Classic Harvest | Today's site | CSS only | Unchanged; default and fallback |
| V2 | Living Collage | White, ink, navy → violet → pink CTA | GSAP Flip + CSS | Photo tiles that quietly swap; bento grids; the hero collage unfolds into the product range; dark "Explore all" tile as the recurring CTA |
| V4 | Trade Atlas | Lavender-white, ink #15123a, violet/blue/pink | cobe (globe, ~5 KB) + GSAP | Globe hero with arcs from India and a waving farmer. Scroll draws a route farm → mill → lab → port. Origin pins on category cards. "Farm to port" strip on the product page. Contact globe pins the buyer's port. |
| V5 | Kinetic Harvest | Warm paper #fbf9f4, ink, magenta/violet | GSAP ScrollTrigger + SplitText | Photo-filled page titles ("Grown." pans the photo's top strip); pinned line-by-line reveals; magazine layout with thin rules; scribble underlines |
| V6 | Midnight Reel (dark) | Midnight #0c0a1f, violet/pink glow | GSAP (marquee, DrawSVG, Observer) | Two film reels of real category photos run in opposite directions and speed up with scroll. The export journey (harvester → drying → mill → lab → container → crane) lights up node by node. **Replaces the old particle morph, which the owner felt had no purpose.** |
| V8 | Ingredient Drop | Pastel lavender / blush / sky | Matter.js (+ springy CSS) | Category photo "balls" drop and pile, drag to toss; sticker-style vectors with white outlines; bouncy chips/cards |

## Phones (every version)

Each hero has a 390 × 844 phone board on the canvas. Rules that apply to all
versions:

- The design must be complete with **no JS animation**. Animation is an
  extra loaded after first paint; `prefers-reduced-motion` shows the
  finished still state.
- No scroll-pinning on phones. Pinned sections fight the mobile browser
  toolbar. Pinned desktop sections become a stacked or swipe layout.
- Tap targets ≥ 44 px, 16 px side gutters, no horizontal page scroll. Any
  marquees or reels are decorative and `aria-hidden`.
- Heavy libraries are desktop-only or lighter on phones:

| Version | Phone treatment |
|---|---|
| V2 | 2×2 grid (3 tiles + Explore). Tiles fade instead of wipe. Rotation pauses while touched. |
| V4 | cobe at 1× pixel ratio with ~40% fewer dots and no drag (it would fight scrolling). The farmer stands on the horizon. A poster image is the LCP element. |
| V5 | Words drop to 80 px and stack; photos still pan (CSS only). The split-on-scroll becomes a simple reveal. |
| V6 | Reels become two horizontal CSS marquee rows (no JS). The journey becomes a 3×2 grid of vectors that light up in view. |
| V8 | A CSS bounce of 5 balls, with no physics engine (saves ~80 KB and battery). Tilt-to-roll is optional, only after a tap. |

Check every version at 360, 390 and 430 px wide, and on a real phone,
before flipping `ready: true`.

## Next home section: product range (6 ideas)

The canvas has an autoplaying preview of each idea that simulates scrolling.
The owner picks one per version (or one shared idea).

| # | Idea | Pairs with | Desktop | Phone |
|---|---|---|---|---|
| 1 | Unfolding collage | V2 | GSAP Flip: the hero's 3 tiles open into a 7-category bento plus an Explore tile | 2-column grid, stagger reveal |
| 2 | Route of categories | V4 | Pinned; a truck follows a curved route (MotionPath); each stop pops a category card. Farmer at the start, ship at the end. | Vertical route down the left edge, cards to its right |
| 3 | Kinetic index | V5 | Outline category names. The one in focus fills with its photo and slides right; product chips slide in beside it. | Accordion: names open an inline photo + chips |
| 4 | Seven jars | V8 | Jars fill with each category's powder colour. The focused jar pops its lid and product stickers tumble out (Matter.js). | Swipeable jar row (scroll-snap) |
| 5 | Midnight film reel | V6 | Pinned horizontal scrub. The frame in the "gate" grows and regains colour. | Swipe strip with a larger centre frame |
| 6 | Stacking deck | V2 + V5 | Full-width category cards stack as you scroll, each earlier card stepping back | Same deck, photo on top |

## Vector kit

Source SVGs live in `docs/design/vector-kit/`: 30 flat illustrations in one
palette, with loop animations in `animations.css` (`vl-*` / `vk-*` classes).

- **Original four:** farmer, container ship, export sack, herb sprig.
- **Export story:**
  - harvester
  - sun-drying racks
  - pulveriser mill
  - mesh sieve
  - quality analyst
  - wrapped pallet
  - loaded container
  - port crane
  - delivery truck
  - air samples
- **Trust and documents:**
  - certificate and seal
  - spec sheet
  - quality shield
  - port compass
  - inquiry envelope
- **Category still lifes:**
  - mortar and pestle
  - scoop of turmeric
  - chilli, garlic and ginger
  - moringa branch
  - fruit-to-powder
  - bowl of seeds
- **Places and other:**
  - warehouse
  - sample pouch
  - farm landscape
  - trade globe
  - "beyond food" crate (multi-category edition)

Each file's comment says where it is meant to be used. When building, move
them into `src/components/vectors/*.astro` as inline SVG, with colours from
CSS variables so each version recolours them.

## Architecture (when building)

- **Config:** `site-config.json` gains `version`, and `BaseLayout` sets
  `<html data-version="v4">`.
- **Stylesheets:** one per version, holding its tokens, loaded only for the
  active version. Keep it inside the `defer-site-css.mjs` capture (see
  CLAUDE.md), and verify with `npm run build`, not dev.
- **Markup:** version-specific markup goes in
  `src/components/versions/<id>/…`, chosen at build time from `siteConfig`.
  Pages stay static: no client-side flag, no flicker.
- **Libraries** load after first paint (dynamic import on idle or when in
  view), and only on pages that use them. The hero's first frame must be real
  HTML/CSS/image with `data-splash-hero`. JS budget: ≤ 60 KB gzipped per page.
- **Admin:** add a "Site version" group to `site-options.ts`, with
  `ready: false` until it's built. Hero options V2, V4, V5, V6 and V8 are
  listed already, but none are ready yet.

## Build order and per-version checklist

1. **Foundation:**
   - `version` config
   - token files
   - vector components
   - library loader
   - admin group
2. **Versions,** one PR each: ~~V2~~ (done) → V4 → V5 → V8 → V6 (or in the
   owner's chosen order). For each:
   - navbar, hero, product-range section, section headings,
     cards/buttons/forms, footer
   - pages: home, products, category, product, How We Export,
     certifications, about, contact, blog, 404
   - phone pass (360/390/430)
   - reduced motion
   - Lighthouse vs V1
   - flip `ready: true`

## Certifications page on v3 (Nov 2026)

`src/components/CertJourney.astro` replaces everything between the hero and the
CTA when the version is v3; the old markup in `certifications.astro` still
renders for v1. Order: own credentials, partner standards, requirements by
market, FAQ. In the market tabs, keep what Clarté holds apart from what comes
through partner facilities (FSSAI, IEC, APEDA and ISO 9001 are ours; Halal,
ISO 22000, HACCP, BRCGS and US FDA are partner-held). Certificate names stay
untranslated; the rest uses `cert.mkt_*` in all 17 locales.

## Blog on v3 (Nov 2026)

List and article templates keep their markup; `BlogBanner.astro` swaps the emoji
banner for the post's vector cover, and styles live at the end of `site-v3.css`.
Covers come from `scripts/gen-blog-art.mjs`. Page headers on Certifications and
Blog have no side vectors because the owner found them crowded.

## Contact on v3 (Nov 2026)

Same markup and form script as v1, restyled at the end of `site-v3.css`
(`.j-contact`, `.cc-*`, `.map-*`). The only v3 addition is one vector in the info
panel. Don't submit the form when testing: it posts to the live Web3Forms inbox.

## About on v3 (Nov 2026)

`AboutJourney.astro` replaces everything between the hero and the CTA; the old
markup still renders for v1. The `Testimonials` component is left out on v3: its
quotes are not from identifiable buyers. The category count comes from
`categories.length`, and the `about.glance_categories_val` strings carry the
number by hand, so update them in all 17 locales if a category is added.

## Admin removed (Nov 2026)

The admin portal is gone; older mentions of it above are history. To go live with
the new design, set `version` to `v3` in `src/data/site-config.json` on `main`.

## Category pages on v3 (Nov 2026)

`[category]/index.astro` swaps its hero for an arch photo layout on v3 and restyles
the shared product grid. Each category has a muted palette, set with
`body:has(.j-cat-hero[data-cat=...])` at the end of `site-v3.css`. No vectors here.

## Product pages on v3 (Nov 2026)

`ProductJourney.astro` replaces the page body on v3 and uses the category palette.
The hero holds only what a buyer decides on (name, HSN, stock, form, actions). The
description, features, uses, specs and grades each appear once below it. Keep the
`pd*` ids and classes: the gallery, zoom and form scripts in `[product].astro` use them.

The spec sheet panel shows a blurred, padlocked preview and opens the existing
lead form; the PDF itself stays behind `/api/spec-sheet`. The enquiry and spec
sheet dialogs take the category palette, falling back to violet elsewhere.

## Premium touches (Nov 2026)

Five effects, rebuilt in plain JS/CSS (ideas from Vengeance UI / Skiper UI,
no React added). Code is the last block of `public/js/site-v3.js` and the
"Premium touches" block at the end of `public/css/site-v3.css`; all are off
under `prefers-reduced-motion`.

- `data-countup` on any element: its digits count up from 0 the first time it
  scrolls into view (works on translated text). Used on the home "Speed &
  Availability" line and the "15–21 Day Dispatch" card.
- Home certification logos are two continuous strips (`.j-marquee`), each list
  rendered twice; the copy is `aria-hidden` with empty alt.
- Navbar `.nav-links` gets a sliding `.nav-pill` (desktop, fine pointer only);
  it replaces the underline there.
- Category product cards: border glow follows the cursor (`--gx`/`--gy`).
- Every `details.faq-item` opens and closes with a height animation.
- Tilting cards: `.prod-card`, `.j-card` and `.j-doc` lean toward the cursor
  (max ~5°) and a soft light sweeps across (`.tilt-shine`, added by
  site-v3.js). Desktop mouse only; off under reduced motion. The owner
  turned down the 3D globe and opening-container ideas (Nov 2026).
- Home hero entrance, "Rise from the line" (owner's pick of six prototypes,
  Nov 2026): the three words slide up from behind their baselines (staggered
  0 / .14 / .28s) and the side column fades up after them. Pure CSS in
  `site-v3.css` (`j-rise`, `j-rise-in`), keyed on `html[data-booted]` (first
  visit, as the splash lifts) or `html[data-boot-gone]` (every later arrival,
  set before first paint), so it plays each time a visitor lands on Home.
  Uses the `translate` property so it never fights GSAP's scroll parting.
  Off under reduced motion; without JS the hero just shows.
