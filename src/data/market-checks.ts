// "What importers test this product for" — the residue, contaminant and micro
// limits buyers in the EU / US / Japan check a product against, shown on every
// product page. Facts here are regulatory (EU limits quoted, the strictest most
// buyers apply); keep them sourced. English text is the fallback; translations
// are mkt.<id>_t / mkt.<id>_b in public/i18n.
export interface MarketCheck { id: string; title: string; body: string; }

export const CHECKS: Record<string, MarketCheck> = {
  mrl: { id: "mrl", title: "Pesticide residues within EU MRLs", body: "Regulation (EU) 396/2005, with a 0.01 mg/kg default wherever no specific limit is set. US EPA tolerances and Japan's positive list on request." },
  eto: { id: "eto", title: "Free from ethylene oxide (EtO)", body: "EU limits for spices, seeds and gums sit at the lab detection limit, strictly enforced since the 2020 alerts on Indian sesame. Only untreated or steam-sterilised lots ship." },
  afla_spice: { id: "afla_spice", title: "Aflatoxins within EU limits", body: "Aflatoxin B1 ≤ 5 µg/kg and total aflatoxins ≤ 10 µg/kg for chilli, ginger and turmeric (Regulation (EU) 2023/915)." },
  afla_sesame: { id: "afla_sesame", title: "Aflatoxins within EU limits", body: "Aflatoxin B1 ≤ 2 µg/kg and total aflatoxins ≤ 4 µg/kg for oilseeds eaten as they are (Regulation (EU) 2023/915)." },
  ota: { id: "ota", title: "Ochratoxin A within EU limits", body: "≤ 20 µg/kg for chilli and ≤ 15 µg/kg for other spices such as ginger and turmeric (Regulation (EU) 2023/915)." },
  sudan: { id: "sudan", title: "Free from Sudan and other illegal dyes", body: "No Sudan I–IV or other non-permitted colours, a check the EU has applied to Indian chilli and turmeric since the 2005 Sudan dye alerts." },
  lead: { id: "lead", title: "Lead and lead chromate screened", body: "Lead within EU limits for spices, and no lead chromate, the adulterant some buyers' labs screen every turmeric lot for." },
  pa: { id: "pa", title: "Pyrrolizidine alkaloids under control", body: "≤ 400 µg/kg for cumin seeds and dried herbs, the EU limit since 2022 (Regulation (EU) 2023/915)." },
  micro: { id: "micro", title: "Microbiology to import standards", body: "Salmonella absent in 25 g and E. coli absent. Salmonella is one of the most common reasons spices and seeds are rejected at EU borders or refused by the US FDA." },
  steam: { id: "steam", title: "Steam sterilisation on request", body: "Cuts the microbial load without chemicals, for buyers with tight micro specs or ready-to-eat use." },
  heavy: { id: "heavy", title: "Heavy metals within limits", body: "Lead, cadmium, arsenic and mercury within EU limits (Regulation (EU) 2023/915), which matters most for supplements and herbal products." },
  clean: { id: "clean", title: "Cleanliness to ASTA and ESA specs", body: "Purity, extraneous matter and moisture to American Spice Trade Association or European Spice Association specs on request." },
  nosulph: { id: "nosulph", title: "No added sulphites, colours or preservatives", body: "Nothing that needs an allergen or E-number declaration on an EU or US label." },
};

const BY_CATEGORY: Record<string, string[]> = {
  "culinary-spice-powders": ["mrl", "eto", "micro", "steam"],
  "seed-spices-sesame": ["mrl", "eto", "micro", "clean"],
  "ayurvedic-herbal-powders": ["mrl", "heavy", "eto", "micro"],
  "functional-nutritional-powders": ["mrl", "heavy", "micro", "nosulph"],
  "fruit-powders": ["mrl", "heavy", "micro", "nosulph"],
  "dehydrated-vegetable-powders": ["mrl", "heavy", "micro", "nosulph"],
  "hydrocolloids-food-additives": ["mrl", "eto", "heavy", "micro"],
};

const HERB_LEAF = ["mrl", "pa", "eto", "micro"];
const BY_PRODUCT: Record<string, string[]> = {
  "red-chilli-powder": ["mrl", "afla_spice", "ota", "sudan", "eto", "micro"],
  "green-chilli-powder": ["mrl", "afla_spice", "sudan", "eto", "micro"],
  "turmeric-powder": ["mrl", "afla_spice", "ota", "sudan", "lead", "eto"],
  "ginger-powder": ["mrl", "afla_spice", "ota", "eto", "micro"],
  "kasuri-methi": HERB_LEAF,
  "curry-leaf-powder": HERB_LEAF,
  "coriander-leaf-powder": HERB_LEAF,
  "mint-powder": HERB_LEAF,
  "cumin-seeds": ["mrl", "pa", "eto", "micro", "clean"],
  "sesame-seeds": ["mrl", "afla_sesame", "eto", "micro", "clean"],
  "moringa-powder": ["mrl", "heavy", "pa", "eto", "micro"],
  "tulsi-powder": ["mrl", "heavy", "pa", "eto", "micro"],
  "brahmi-powder": ["mrl", "heavy", "pa", "eto", "micro"],
  "neem-powder": ["mrl", "heavy", "pa", "eto", "micro"],
};

export const checksFor = (slug: string, category: string): MarketCheck[] =>
  (BY_PRODUCT[slug] ?? BY_CATEGORY[category] ?? ["mrl", "heavy", "micro"]).map((id) => CHECKS[id]);
