// =============================================================================
// Central site config. Edit IDs / links here — they flow into every page.
// =============================================================================

export const SITE = {
  url: "https://www.clarteoverseas.com",
  name: "Clarté Overseas",
  defaultTitle:
    "Clarté Overseas — Premium Dehydrated Fruits, Vegetables & Powders | Indian Exporter",
  defaultDescription:
    "Clarté Overseas is an India-based merchant exporter of premium dehydrated fruits, vegetables, flakes and powders — supplying food manufacturers, flavour houses and distributors worldwide.",
  // Replace with a real 1200x630 social-share image when available
  defaultImage: "/assets/logo/logo-icon.svg",
  locale: "en_US",
};

export const ANALYTICS = {
  ga4: "G-D8GZTVSLZX", // Google Analytics 4 measurement ID
  googleTag: "GT-WB72GKFN", // Google tag (gtag) ID
  clarity: "", // TODO: Microsoft Clarity project ID (Settings → Setup)
};

export const CONTACT = {
  email: "info@clarteoverseas.com",
  // TODO: replace with the real WhatsApp number (country code, no +)
  whatsapp:
    "https://wa.me/910000000000?text=Hi%20Clart%C3%A9%20Overseas%2C%20I%27d%20like%20a%20quote.",
  // Web3Forms access key — paste the key emailed to you from web3forms.com
  web3formsKey: "c15bc0d8-19b2-42dd-a385-5a15dd3a7883",
  // Cloudflare Turnstile site key (optional spam protection) — leave empty to disable
  turnstileSiteKey: "",
  // Google Apps Script Web App URL (saves leads to a Sheet + WhatsApp alert) — paste the /exec URL
  sheetWebhook: "",
  address: "1st Floor, CW-59, Sanjay Gandhi Transport Nagar, Delhi, India. 110042",
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/clarte_overseas/",
  linkedin: "https://www.linkedin.com/company/clart%C3%A9-overseas/",
  facebook: "https://www.facebook.com/share/1EqVT8eMpo/",
};
