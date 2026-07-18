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
  // LinkedIn Insight Tag partner ID — get this from LinkedIn Campaign Manager
  // → Analyze → Insight Tag → copy the 7-digit partner ID. Leave "" to disable.
  linkedinPartnerId: "",
};

export const CONTACT = {
  email: "info@clarteoverseas.com",
  // Founder's personal alias — shown alongside the general inbox on the
  // contact page's "Talk to a real person" panel.
  personalEmail: "goutam@clarteoverseas.com",
  whatsapp: "https://wa.me/919818915310",
  // Web3Forms access key — paste the key emailed to you from web3forms.com
  web3formsKey: "c15bc0d8-19b2-42dd-a385-5a15dd3a7883",
  // Cloudflare Turnstile site key (optional spam protection) — leave empty to disable
  turnstileSiteKey: "",
  // Google Apps Script Web App URL (saves leads to a Sheet + WhatsApp alert) — paste the /exec URL
  sheetWebhook: "",
  // Calendly link for "Book a discovery call" button — e.g. https://calendly.com/yourname/15min
  // Leave "" to hide the button until you've set up your Calendly account.
  calendlyUrl: "https://calendly.com/goutamchoudhary4053/discovery-call",
  address: "1st Floor, CW-59, Sanjay Gandhi Transport Nagar, Delhi, India. 110042",
};

export const SOCIAL = {
  instagram: "https://www.instagram.com/clarte_overseas/",
  linkedin: "https://www.linkedin.com/company/clart%C3%A9-overseas/",
  facebook: "https://www.facebook.com/share/1EqVT8eMpo/",
};

// Product availability flags — drive the badge on the product page and the
// dot on category listing cards. Use the product slug (URL segment).
//   UNAVAILABLE  → red "Currently Unavailable" (temporarily out of stock)
//   COMING_SOON  → orange "Coming Soon" (not launched yet)
// A slug should appear in at most one set.
export const UNAVAILABLE_PRODUCTS = new Set([
  "apple-powder",
]);
export const COMING_SOON_PRODUCTS = new Set([
  "curry-leaf-powder",
  "tulsi-powder",
  "cassia-gum-powder",
  "tamarind-kernel-powder",
]);

// Languages offered in the navbar translator (Google Translate codes).
// Native labels stay in their own script so they're recognizable in any locale.
// `en` holds the English name so non-native speakers can identify each language.
export const LANGUAGES = [
  { code: "en",    short: "EN", label: "English",     en: "English",              flag: "🇬🇧" },
  { code: "es",    short: "ES", label: "Español",     en: "Spanish",              flag: "🇪🇸" },
  { code: "fr",    short: "FR", label: "Français",    en: "French",               flag: "🇫🇷" },
  { code: "de",    short: "DE", label: "Deutsch",     en: "German",               flag: "🇩🇪" },
  { code: "it",    short: "IT", label: "Italiano",    en: "Italian",              flag: "🇮🇹" },
  { code: "pt",    short: "PT", label: "Português",   en: "Portuguese",           flag: "🇵🇹" },
  { code: "nl",    short: "NL", label: "Nederlands",  en: "Dutch",                flag: "🇳🇱" },
  { code: "ru",    short: "RU", label: "Русский",     en: "Russian",              flag: "🇷🇺" },
  { code: "ar",    short: "AR", label: "العربية",     en: "Arabic",               flag: "🇸🇦" },
  { code: "tr",    short: "TR", label: "Türkçe",      en: "Turkish",              flag: "🇹🇷" },
  { code: "zh-CN", short: "ZH", label: "中文",         en: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ja",    short: "JA", label: "日本語",        en: "Japanese",             flag: "🇯🇵" },
  { code: "ko",    short: "KO", label: "한국어",        en: "Korean",               flag: "🇰🇷" },
  { code: "vi",    short: "VI", label: "Tiếng Việt",  en: "Vietnamese",           flag: "🇻🇳" },
  { code: "th",    short: "TH", label: "ไทย",          en: "Thai",                 flag: "🇹🇭" },
  { code: "id",    short: "ID", label: "Indonesia",   en: "Indonesian",           flag: "🇮🇩" },
  { code: "sv",    short: "SV", label: "Svenska",     en: "Swedish",              flag: "🇸🇪" },
];
