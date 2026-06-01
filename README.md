# Clarté Overseas — Homepage

A self-contained, responsive homepage for **Clarté Overseas** (merchant exporter of
dehydrated fruits, vegetables & powders). Built with semantic HTML + Tailwind (CDN) +
vanilla JS — no build step. Design inspired by the structure/feel of bluedotexports.com,
with original content and Clarté branding (`#1f4693`).

## Run it
```bash
python3 -m http.server 4173
# open http://localhost:4173
```
Or just open `index.html` in a browser.

## Structure
```
index.html        all sections (nav, hero, products, portfolio, advantage,
                  sustainability, markets map, certifications, CTA, footer)
css/styles.css    design tokens, components, animations
js/script.js      config + interactions (nav, reveal, counters, filter, map)
assets/logo/      logo-horizontal(.svg / -white.svg), logo-icon(.svg / -white.svg)
```

## ⚠️ Placeholders to fill in
| What | Where |
|------|-------|
| **WhatsApp number** | `js/script.js` → `CONFIG.whatsapp` (currently dummy `910000000000`) |
| **Product photos** | `index.html` → `data-img="..."` on each `.img-ph` (Unsplash dummies now; swap for your real photos in `assets/img/`) |
| **Hero photo** | `index.html` → `.hero-photo` `data-src` |
| **Certification logos/links** | Certifications section chips (text only for now) |
| **Company address / email** | Footer `Contact` block (`[full address — TBD]`) |
| **Stats numbers** | Hero & sustainability `data-count` values |
| **Product names / status badges** | "What We Export" & "Portfolio" cards |
| **Target markets** | `js/script.js` → `markets[]` (pins) + map legend in `index.html` |

## Notes
- All product/hero images load from Unsplash when online and **fall back to a branded
  gradient + emoji** if offline or blocked — nothing ever looks broken.
- Animations respect `prefers-reduced-motion`.
- Alternate **variants** (hero, product cards, markets, etc.) can be swapped in on request.
