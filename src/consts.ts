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
  // GTM container — the single source of truth. GA4, the Custom HTML tag and
  // Microsoft Clarity all fire from inside this container, so the site only
  // needs the GTM snippet (no direct gtag/clarity, to avoid double-counting).
  gtm: "GTM-N9SZ4WPZ",
  ga4: "G-D8GZTVSLZX", // (managed inside GTM — kept for reference)
  googleTag: "GT-WB72GKFN", // (managed inside GTM — kept for reference)
  clarity: "vt1zxn7czc", // Microsoft Clarity project (fired via GTM — kept for reference)
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

// Languages offered in the navbar translator (Google Translate codes).
// Native labels stay in their own script so they're recognizable in any locale.
export const LANGUAGES = [
  { code: "en",    short: "EN", label: "English",     flag: "🇬🇧" },
  { code: "es",    short: "ES", label: "Español",     flag: "🇪🇸" },
  { code: "fr",    short: "FR", label: "Français",    flag: "🇫🇷" },
  { code: "de",    short: "DE", label: "Deutsch",     flag: "🇩🇪" },
  { code: "it",    short: "IT", label: "Italiano",    flag: "🇮🇹" },
  { code: "pt",    short: "PT", label: "Português",   flag: "🇵🇹" },
  { code: "nl",    short: "NL", label: "Nederlands",  flag: "🇳🇱" },
  { code: "ru",    short: "RU", label: "Русский",     flag: "🇷🇺" },
  { code: "ar",    short: "AR", label: "العربية",     flag: "🇸🇦" },
  { code: "tr",    short: "TR", label: "Türkçe",      flag: "🇹🇷" },
  { code: "zh-CN", short: "ZH", label: "中文",         flag: "🇨🇳" },
  { code: "ja",    short: "JA", label: "日本語",        flag: "🇯🇵" },
  { code: "ko",    short: "KO", label: "한국어",        flag: "🇰🇷" },
  { code: "vi",    short: "VI", label: "Tiếng Việt",  flag: "🇻🇳" },
  { code: "th",    short: "TH", label: "ไทย",          flag: "🇹🇭" },
  { code: "id",    short: "ID", label: "Indonesia",   flag: "🇮🇩" },
  { code: "hi",    short: "HI", label: "हिन्दी",        flag: "🇮🇳" },
  { code: "sv",    short: "SV", label: "Svenska",     flag: "🇸🇪" },
];
