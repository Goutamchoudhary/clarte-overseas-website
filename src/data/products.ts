// =============================================================================
// Product catalogue — categories + products.
// Images: self-hosted WebP in public/assets/img/products/<slug>.webp (see the
// README there for how to add one). Missing ones fall back to a styled
// placeholder (emoji + gradient). HSN codes are standard Indian ITC-HS codes.
// Drying method is flexible (spray / freeze / drum / air) and chosen to suit
// the buyer's use-case and grade. All copy is original.
// =============================================================================

// Flexible drying lines by category — we supply the method the buyer's grade needs.
const DRY = {
  fruit: "Spray, freeze or drum-dried — to your grade",
  culinary: "Air, spray or freeze-dried — to your grade",
  functional: "Air, spray or freeze-dried — to your grade",
  herbal: "Shade, air or freeze-dried — to your grade",
  milled: "Mechanically milled to specification",
  // Seeds are not dried or milled at all — they are cleaned and graded, so the
  // "Processing" row on their pages describes that instead.
  seeds: "Machine-cleaned, colour-sorted and graded",
};

export interface Category {
  slug: string;
  name: string;
  navName: string;
  emoji: string;
  /** Optional inline SVG icon shown instead of the emoji on /products. */
  icon?: string;
  tagline: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  heroImage?: string; // optional right-side hero photo (replaces the emoji motif)
  bgImage?: string; // optional full-bleed hero photo, washed out behind the accent gradient
  thumbSlugs?: string[]; // optional: pin which products appear in the 4-image preview grid
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  /** Square photo for the product's own page (and related-product tiles). */
  image?: string;
  /** Landscape photo for the category list card. Products that have one get
   *  the full-bleed photo layout on both the card and the product page. */
  listImage?: string;
  /** Extra photos shown as a thumbnail gallery under the main product photo. */
  gallery?: { src: string; alt: string }[];
  emoji: string;
  hsn: string;
  botanical?: string;
  tagline: string;
  description: string;
  features: string[];
  uses: string[];
  grades: string[];
  forms?: string[];
  drying?: string;
}

export const categories: Category[] = [
  {
    slug: "ayurvedic-herbal-powders",
    name: "Ayurvedic & Herbal Powders",
    navName: "Ayurvedic & Herbal Powders",
    emoji: "🌿",
    tagline: "Classic Ayurvedic roots, leaves and blends",
    description:
      "Roots, leaves and traditional blends from Ayurveda's core formulary — ashwagandha, shatavari, brahmi, triphala, giloy, neem, tulsi and moringa among them — dried low and slow to protect their natural actives, then milled into clean, consistent powders for supplements, nutraceuticals and herbal formulations.",
    thumbSlugs: ["ashwagandha-powder", "shatavari-powder", "moringa-powder", "triphala-powder"],
    accentFrom: "#1f7a4d",
    accentTo: "#0f6b4a",
    bgImage: "/assets/img/categories/herbal-leaf-hero.webp",
  },
  {
    slug: "culinary-spice-powders",
    name: "Culinary & Spice Powders",
    navName: "Dehydrated Vegetable Powders – Culinary & Spice",
    emoji: "🧅",
    tagline: "The savoury backbone of every kitchen",
    description:
      "Onion, garlic, ginger, chilli, mint, coriander and curry leaf — the workhorses of kitchens and food plants worldwide. Consistent pungency, clean flavour and a full range of cuts, from fine powder to kibbled flakes.",
    thumbSlugs: ["red-onion-powder", "ginger-powder", "garlic-powder", "green-chilli-powder"],
    accentFrom: "#c2410c",
    accentTo: "#9a3412",
    bgImage: "/assets/img/categories/culinary-spice-category-hero.webp",
  },
  {
    slug: "functional-nutritional-powders",
    name: "Functional & Nutritional Powders",
    navName: "Dehydrated Vegetable Powders – Functional & Nutritional",
    emoji: "🍋",
    tagline: "Colour, nutrition and clean-label function",
    description:
      "Beetroot, lemon, amla and more — fruit and herb powders chosen for natural colour, nutrition and clean-label functionality in supplements, seasonings, soups and ready meals.",
    accentFrom: "#be185d",
    accentTo: "#9d174d",
    bgImage: "/assets/img/categories/functional-nutritional-powder-hero.webp",
  },
  {
    slug: "dehydrated-vegetable-powders",
    name: "Dehydrated Vegetable Powders",
    navName: "Dehydrated Vegetable Powders",
    emoji: "🍅",
    tagline: "Everyday vegetables, dried and milled for colour and depth",
    description:
      "Tomato, carrot, jackfruit and more — dehydrated vegetable powders that concentrate natural colour, flavour and nutrition into a shelf-stable form for soups, sauces, seasonings and ready meals.",
    accentFrom: "#0d9488",
    accentTo: "#0f766e",
    thumbSlugs: ["tomato-powder", "carrot-powder"],
    bgImage: "/assets/img/categories/dehydrated-veg-powder-hero.webp",
  },
  {
    slug: "fruit-powders",
    name: "Dehydrated Fruit Powders",
    navName: "Dehydrated Fruit Powder Ingredients",
    emoji: "🥭",
    tagline: "India's fruit, locked into a free-flowing powder",
    description:
      "Single-origin Indian fruits, gently dried and milled into free-flowing powders that hold their colour, tang and natural sweetness — built for beverages, bakery, dairy, confectionery and nutraceuticals.",
    thumbSlugs: ["guava-powder", "papaya-powder", "banana-powder", "tamarind-powder"],
    accentFrom: "#d97706",
    accentTo: "#b45309",
    bgImage: "/assets/img/categories/dehydrated-fruits-powder.webp",
  },
  {
    slug: "seed-spices-sesame",
    name: "Seed Spices & Sesame",
    navName: "Seed Spices & Sesame",
    emoji: "🫘",
    icon: '<svg viewBox="0 0 32 32" aria-hidden="true"><g transform="rotate(-28 11 15)"><ellipse cx="11" cy="15" rx="3.6" ry="9" fill="#9b7a4a"/><path d="M11 7v16M8.6 9v12M13.4 9v12" stroke="#6e5530" stroke-width="1" fill="none"/></g><circle cx="22" cy="21" r="6" fill="#cfae72"/><path d="M22 15v12M18.4 16.6c-1.4 2.8-1.4 6 0 8.8M25.6 16.6c1.4 2.8 1.4 6 0 8.8" stroke="#a8874f" stroke-width="1" fill="none"/><path d="M23 8c3.2 1.8 4 4.6 3 7-3-1-4-3.6-3-7z" fill="#efe4cf" stroke="#c9b48c" stroke-width=".8"/></svg>',
    tagline: "Whole Indian seed spices and sesame, graded to export purity",
    description:
      "Whole Indian seed spices and sesame, machine-cleaned, sorted and graded to export purity. Sourced from the main growing belts of Gujarat, Rajasthan and Madhya Pradesh.",
    accentFrom: "#8a6a2b",
    accentTo: "#5e4818",
    bgImage: "/assets/img/categories/seed-spices-sesame-hero.webp",
  },
  {
    slug: "hydrocolloids-food-additives",
    name: "Hydrocolloids & Food Additives",
    navName: "Hydrocolloids & Food Additives",
    emoji: "🌾",
    tagline: "Plant-based thickeners, stabilisers & fibres",
    description:
      "India is the world's hub for plant-based gums and fibres. We supply guar gum, psyllium and tamarind kernel derivatives for food, beverage, pharma and industrial applications.",
    accentFrom: "#1f4693",
    accentTo: "#16306e",
    bgImage: "/assets/img/categories/hydrocolloids-additives.webp",
  },
];

const POWDER_FORMS = ["Powder", "Granules", "Minced", "Chopped / Kibbled", "Flakes"];

// Shared closing features used across products (kept short, appended per item)
const F_DRY = "Drying method chosen to suit your application";
const F_CUSTOM = "Custom mesh, packing and private label on request";

// Seeds close on their own pair: they are graded and sorted rather than dried,
// and "mesh" is meaningless for a whole kernel.
const F_SEED_SORT = "Gravity-separated, de-stoned and colour-sorted";
const F_SEED_CUSTOM = "Custom grades, packing and private label on request";

export const products: Product[] = [
  // ---------------------------------------------------------------- FRUIT
  {
    slug: "guava-powder", name: "Guava Powder", category: "fruit-powders",
    image: "/assets/img/products/guava-powder.webp", emoji: "🍐", hsn: "1106 30 10", botanical: "Psidium guajava",
    tagline: "Tropical aroma and a soft pink-cream colour, ready to disperse.",
    description:
      "Made from ripe Indian guavas, our guava powder carries the fruit's musky-sweet aroma and gentle acidity into any formulation. It rehydrates cleanly and blends without clumping, so you get true guava character without the moisture or short shelf life of the fresh fruit.",
    features: ["100% fruit, no added sugar or colour", "Bright, natural guava aroma", "Free-flowing and easy to disperse", "Long, stable shelf life", F_DRY, F_CUSTOM],
    uses: ["Juices, nectars and smoothie mixes", "Bakery fillings and confectionery", "Flavoured dairy and ice cream", "Nutraceutical and infant-food blends"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "pineapple-powder", name: "Pineapple Powder", category: "fruit-powders",
    image: "/assets/img/products/pineapple-powder.webp", emoji: "🍍", hsn: "1106 30 10", botanical: "Ananas comosus",
    tagline: "Sun-sweet tang and golden colour in a stable powder.",
    description:
      "Our pineapple powder captures the bright, tangy-sweet profile of tropical pineapple in a shelf-stable form. It is ideal wherever liquid pineapple is impractical, delivering authentic flavour and a warm golden tone to your product.",
    features: ["True pineapple tang and aroma", "Natural golden colour", "Dissolves quickly in water", "No artificial additives", F_DRY, F_CUSTOM],
    uses: ["Beverage and cocktail premixes", "Bakery, desserts and toppings", "Yoghurt and dairy flavouring", "Seasonings and marinades"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "banana-powder", name: "Banana Powder", category: "fruit-powders",
    image: "/assets/img/products/banana-powder.webp", emoji: "🍌", hsn: "1106 30 10", botanical: "Musa paradisiaca",
    tagline: "Smooth, mellow sweetness with natural body.",
    description:
      "Milled from ripe bananas, this powder brings mellow sweetness and a creamy mouthfeel to recipes, plus natural thickening. It is a favourite in infant nutrition and sports formulations for its gentle flavour and easy digestibility.",
    features: ["Naturally sweet, no added sugar", "Adds body and smooth texture", "Easy to reconstitute", "Versatile across sweet and savoury", F_DRY, F_CUSTOM],
    uses: ["Infant and toddler nutrition", "Smoothies and protein blends", "Bakery and pancake mixes", "Cereal and snack coatings"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "apple-powder", name: "Apple Powder", category: "fruit-powders",
    image: "/assets/img/products/apple-powder.webp", emoji: "🍎", hsn: "1106 30 10", botanical: "Malus domestica",
    tagline: "Crisp, orchard-fresh sweetness that keeps.",
    description:
      "Our apple powder delivers the familiar sweet-tart taste of fresh apples in a convenient dry format. It folds easily into dry blends and bakes, adding fruit content, natural flavour and a touch of pectin-rich body.",
    features: ["Sweet-tart apple character", "Clean label, single ingredient", "Blends evenly in dry mixes", "Long shelf life", F_DRY, F_CUSTOM],
    uses: ["Cereals, mueslis and bars", "Bakery and crumble mixes", "Teas and instant beverages", "Sauces and baby food"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "mango-powder", name: "Mango Powder", category: "fruit-powders",
    image: "/assets/img/products/mango-powder.webp", emoji: "🥭", hsn: "1106 30 10", botanical: "Mangifera indica",
    tagline: "The king of fruits, captured at peak ripeness.",
    description:
      "Pressed from sweet, fully ripe Indian mangoes, this powder carries the rich aroma and deep golden colour the fruit is loved for. It is a natural fit for beverages, desserts and dairy that need real mango identity.",
    features: ["Ripe Alphonso / Totapuri character", "Vivid natural colour", "Excellent solubility", "No added sugar or flavour", F_DRY, F_CUSTOM],
    uses: ["Mango lassi, juices and shakes", "Ice cream and dairy desserts", "Bakery, fillings and confectionery", "Nutrition and breakfast blends"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "amla-powder", name: "Amla Powder", category: "functional-nutritional-powders",
    image: "/assets/img/products/amla-powder-v2.webp", emoji: "🫒", hsn: "0813 40 90", botanical: "Phyllanthus emblica",
    listImage: "/assets/img/products/amla-powder-wide.webp",
    gallery: [{ src: "/assets/img/products/amla-powder-dried.webp", alt: "Dried amla (Indian gooseberry) pieces" }],
    tagline: "Indian gooseberry — a vitamin-C powerhouse.",
    description:
      "Amla, or Indian gooseberry, is one of the most prized fruits in Ayurveda. Our amla powder retains its natural tartness and is widely used in supplements, hair and skin care, and functional foods for its antioxidant reputation.",
    features: ["Naturally rich in vitamin C", "Sharp, characteristic tartness", "Trusted Ayurvedic ingredient", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Dietary supplements and tablets", "Hair oils and cosmetics", "Functional drinks and churnas", "Herbal blends and teas"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "beetroot-powder", name: "Beetroot Powder", category: "functional-nutritional-powders",
    image: "/assets/img/products/beetroot-powder-v2.webp", emoji: "🟣", hsn: "0712 90 90", botanical: "Beta vulgaris",
    listImage: "/assets/img/products/beetroot-powder-wide.webp",
    tagline: "Deep natural crimson and earthy nutrition.",
    description:
      "Beetroot powder delivers a striking natural crimson colour along with the root's earthy sweetness and nutrients. It is a clean-label favourite for natural colouring, sports nutrition and functional foods.",
    features: ["Vivid natural red colour", "Clean-label colourant", "Earthy, mildly sweet taste", "Popular in sports nutrition", F_DRY, F_CUSTOM],
    uses: ["Natural food colouring", "Sports and nutrition blends", "Bakery, pasta and snacks", "Smoothies and lattes"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "amchur-powder", name: "Amchur Powder", category: "functional-nutritional-powders",
    image: "/assets/img/products/amchur-powder-v2.webp",
    listImage: "/assets/img/products/amchur-powder-wide.webp",
    emoji: "🥭", hsn: "0813 40 90", botanical: "Mangifera indica (unripe)",
    tagline: "Dried green mango — a traditional Ayurvedic digestive.",
    description:
      "Amchur is made from sun-dried unripe green mango, long valued in Ayurveda for its sharp, cooling character and digestive (deepana-pachana) properties. Unlike the ripe mango powder used as a sweet flavouring, our amchur is positioned for herbal and nutraceutical formulations — naturally rich in vitamin C, antioxidants and plant acids that support digestion and the absorption of nutrients like iron.",
    features: ["From sun-dried unripe green mango", "Trusted Ayurvedic digestive", "Naturally rich in vitamin C & antioxidants", "Sharp, cooling tartness", F_DRY, F_CUSTOM],
    uses: ["Digestive churnas and supplements", "Ayurvedic and herbal formulations", "Nutraceutical tablets and capsules", "Functional blends and tonics"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "tamarind-powder", name: "Tamarind Pulp Powder", category: "fruit-powders",
    image: "/assets/img/products/tamarind-powder.webp", emoji: "🟤", hsn: "0813 40 90", botanical: "Tamarindus indica",
    tagline: "Deep, sour-sweet tang for sauces and seasonings.",
    description:
      "Our tamarind powder concentrates the bold, sour-sweet flavour of tamarind pulp into an easy-to-dose dry form. It removes the mess of paste and seeds while delivering consistent acidity to sauces, chutneys and spice blends.",
    features: ["Concentrated sour-sweet flavour", "Consistent acidity, no seeds", "Easy to weigh and disperse", "Long shelf life", F_DRY, F_CUSTOM],
    uses: ["Sauces, chutneys and ketchups", "Spice and seasoning blends", "Soups, broths and instant mixes", "Confectionery and beverages"],
    grades: ["Food grade", "60–80 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "papaya-powder", name: "Papaya Powder", category: "fruit-powders",
    image: "/assets/img/products/papaya-powder.webp", emoji: "🟠", hsn: "1106 30 10", botanical: "Carica papaya",
    tagline: "Mild, sweet tropical fruit with natural enzymes.",
    description:
      "Papaya powder offers a soft, sweet tropical flavour along with the fruit's naturally occurring enzymes. It works well in nutrition blends and digestive formulations, and adds a gentle fruitiness to beverages and desserts.",
    features: ["Mild, sweet papaya taste", "Source of natural enzymes", "Smooth, fine texture", "Clean single-ingredient label", F_DRY, F_CUSTOM],
    uses: ["Digestive and nutrition blends", "Smoothies and beverages", "Skincare and cosmetics", "Desserts and bakery"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "pomegranate-powder", name: "Pomegranate Powder", category: "fruit-powders",
    image: "/assets/img/products/pomegranate-powder.webp", emoji: "🔴", hsn: "0813 40 90", botanical: "Punica granatum",
    tagline: "Premium antioxidant fruit for nutraceutical formulations.",
    description:
      "Made from carefully dried pomegranate, our powder is positioned as a premium antioxidant ingredient for nutraceuticals and functional nutrition. Pomegranate is prized for its polyphenols and ellagitannins (punicalagins), giving formulators a clean, plant-based source of antioxidant activity with a naturally tart, ruby-red character.",
    features: ["Rich in polyphenols & punicalagins", "Premium antioxidant positioning", "Naturally tart, ruby-red colour", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Antioxidant supplements and capsules", "Functional and sports nutrition", "Nutraceutical and wellness blends", "Premium beverages and smoothies"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.fruit,
  },

  // ----------------------------------------------------- CULINARY & SPICE
  {
    slug: "red-onion-powder", name: "Red Onion Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/red-onion-powder.webp", emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
    tagline: "Bold, deeply flavoured Indian red onion — rich savouriness in every form.",
    description:
      "Our red onion powder is made from India's robust, dark-red onions, prized for their strong pungency and deep colour. It delivers rich, complex onion flavour to seasonings, sauces and ready meals — available as fine powder right through to kibbled flakes for consistent results with no prep or waste.",
    features: ["Strong, complex red-onion pungency", "Deep colour, batch-to-batch consistency", "Available in five cut sizes", "No peeling, chopping or spoilage", F_DRY, F_CUSTOM],
    uses: ["Seasoning and spice blends", "Snacks, sauces and dressings", "Ready meals, soups and gravies", "Meat rubs and marinades"],
    grades: ["Food grade", "Custom mesh / cut sizes", "Moisture ≤ 6%", "Private label / bulk"],
    forms: POWDER_FORMS,
    drying: DRY.culinary,
  },
  {
    slug: "pink-onion-powder", name: "Pink Onion Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/pink-onion-powder.webp", emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
    tagline: "India's delicate pink onion — mild, sweet and universally versatile.",
    description:
      "Made from India's prized pink onions — lighter in colour and milder in flavour than deep red varieties — this powder brings a gentle, balanced sweetness to products where subtlety matters more than bold pungency. Its pale blush tone suits light-coloured seasonings, dressings and cream sauces where a dark onion powder would show.",
    features: ["Mild, balanced sweetness", "Pale blush colour — won't darken products", "Available in five cut sizes", "Gentle flavour for refined seasonings", F_DRY, F_CUSTOM],
    uses: ["Dressings, dips and light sauces", "Seasoning and spice blends", "Soups and cream-based dishes", "Snacks and savoury coatings"],
    grades: ["Food grade", "Custom mesh / cut sizes", "Moisture ≤ 6%", "Private label / bulk"],
    forms: POWDER_FORMS,
    drying: DRY.culinary,
  },
  {
    slug: "white-onion-powder", name: "White Onion Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/white-onion-powder.webp", emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
    tagline: "Clean, milder onion with a pale, neutral colour.",
    description:
      "White onion powder offers a cleaner, slightly milder profile and a pale colour that won't tint light-coloured products. It is the go-to choice for white sauces, soups, dressings and seasoning blends where appearance matters as much as taste.",
    features: ["Milder, clean onion flavour", "Pale colour for light products", "Five cut sizes available", "Uniform, reliable supply", F_DRY, F_CUSTOM],
    uses: ["White sauces and creamy soups", "Dressings and dips", "Seasoning and snack mixes", "Bakery and savoury fillings"],
    grades: ["Food grade", "Custom mesh / cut sizes", "Moisture ≤ 6%", "Private label / bulk"],
    forms: POWDER_FORMS,
    drying: DRY.culinary,
  },
  {
    slug: "garlic-powder", name: "Garlic Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/garlic-powder.webp", emoji: "🧄", hsn: "0712 90 04", botanical: "Allium sativum",
    tagline: "Bold Indian garlic in dried, flake and powder forms.",
    description:
      "Our garlic is dehydrated to lock in its sharp, savoury punch and then offered as whole dried cloves, flakes or fine powder. It brings instant garlic flavour to any recipe with consistent strength and a clean, white appearance.",
    features: ["Pungent, true garlic flavour", "Dried, flakes and powder forms", "Clean white colour", "Long, stable shelf life", F_DRY, F_CUSTOM],
    uses: ["Seasonings and spice mixes", "Sauces, gravies and marinades", "Snacks and savoury coatings", "Ready meals and instant foods"],
    grades: ["Food grade", "Custom mesh / cut sizes", "Moisture ≤ 6%", "Private label / bulk"],
    forms: ["Powder", "Granules", "Flakes", "Minced", "Dried (whole)"],
    drying: DRY.culinary,
  },
  {
    slug: "ginger-powder", name: "Ginger Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/ginger-powder.webp", emoji: "🫚", hsn: "0910 12 00", botanical: "Zingiber officinale",
    tagline: "Warm, fiery aroma from Indian ginger.",
    description:
      "Indian ginger is known worldwide for its warmth and high pungency. We supply it dried and as a fine powder that carries the root's spicy heat and citrusy aroma into beverages, bakery, spice blends and wellness products.",
    features: ["Warm, pungent and aromatic", "Dried and powder forms", "High volatile-oil content", "Versatile in food and wellness", F_DRY, F_CUSTOM],
    uses: ["Spice blends and curry powders", "Teas, lattes and beverages", "Bakery, biscuits and gingerbread", "Supplements and herbal mixes"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 8%", "Private label / bulk"],
    forms: ["Powder", "Dried (sliced / whole)"],
    drying: DRY.culinary,
  },
  {
    slug: "green-chilli-powder", name: "Green Chilli Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/green-chilli-powder.webp", emoji: "🌶️", hsn: "0904 22 00", botanical: "Capsicum annuum",
    tagline: "Fresh green heat in flakes and fine powder.",
    description:
      "Dehydrated green chillies retain their bright, grassy heat and natural green colour. Offered as flakes or fine powder, they bring clean, controllable spice to seasonings, snacks and sauces without the moisture of fresh chillies.",
    features: ["Bright green colour, fresh heat", "Flakes and powder forms", "Controllable, consistent pungency", "No fresh-chilli spoilage", F_DRY, F_CUSTOM],
    uses: ["Seasonings and snack coatings", "Sauces, dips and chutneys", "Marinades and rubs", "Instant and ready meals"],
    grades: ["Food grade", "Flakes / 60–80 mesh", "Moisture ≤ 8%", "Private label / bulk"],
    forms: ["Powder", "Flakes"],
    drying: DRY.culinary,
  },
  {
    slug: "turmeric-powder", name: "Turmeric Powder", category: "culinary-spice-powders",
    emoji: "🟡", hsn: "0910 30 30", botanical: "Curcuma longa",
    tagline: "Bright Indian turmeric from Nizamabad, Sangli and Erode, graded by curcumin.",
    description:
      "India grows most of the world's turmeric, and the Nizamabad, Sangli and Erode markets set its grades. The powder is milled to 60–80 mesh and graded by curcumin content (2–5%), giving the deep golden colour and earthy warmth that curry powders, seasonings, natural-colour applications and wellness drinks rely on. Whole fingers are available on request.",
    features: ["Graded by curcumin (2–5%)", "Deep golden colour, earthy aroma", "60–80 mesh, whole fingers on request", "From Nizamabad, Sangli and Erode", "Tested for lead chromate and Sudan dyes", F_CUSTOM],
    uses: ["Curry powders and seasonings", "Natural yellow colour", "Wellness drinks and golden milk", "Sauces, soups and ready meals"],
    grades: ["Food grade", "Curcumin 2–5% (by grade)", "Moisture ≤ 10%", "25 kg paper / PP bags with liner"],
    forms: ["Powder", "Whole fingers (on request)"],
    drying: DRY.milled,
  },
  {
    slug: "red-chilli-powder", name: "Red Chilli Powder", category: "culinary-spice-powders",
    emoji: "🌶️", hsn: "0904 22 11", botanical: "Capsicum annuum",
    tagline: "Guntur and Byadgi chilli, graded for heat and colour.",
    description:
      "Red chilli from Guntur in Andhra Pradesh, from Telangana and from Byadgi in Karnataka covers the full range, from fiery heat to deep red colour with mild pungency. It is supplied as powder (40–60 mesh) or crushed flakes, graded by ASTA colour and Scoville heat on request, for seasonings, sauces, snacks and spice blends.",
    features: ["Graded by heat (SHU) and ASTA colour", "Guntur heat or Byadgi colour", "Powder or crushed flakes", "40–60 mesh, custom on request", "Tested for aflatoxins and Sudan dyes", F_CUSTOM],
    uses: ["Seasonings and snack coatings", "Sauces, pastes and marinades", "Spice blends and curry powders", "Ready meals and soups"],
    grades: ["Food grade", "ASTA colour and SHU on request", "Moisture ≤ 11%", "25 kg paper / PP bags with liner"],
    forms: ["Powder", "Crushed flakes"],
    drying: DRY.milled,
  },
  {
    slug: "fried-onion", name: "Fried Onion", category: "culinary-spice-powders",
    image: "/assets/img/products/fried-onion.webp", emoji: "🧅", hsn: "2005 99 90", botanical: "Allium cepa",
    tagline: "Crispy, golden and intensely savoury — ready to garnish or blend.",
    description:
      "Our fried onion is made from select Indian onions, sliced and fried to a deep golden colour that delivers a rich, caramelised flavour without any bitterness. Available as crispy flakes for garnishing or as a fine powder for blending into seasonings, sauces and ready meals, it adds instant depth with no cooking required.",
    features: ["Deep golden colour, caramelised flavour", "Flakes and powder forms", "Ready-to-use, no cooking needed", "Long shelf life", F_CUSTOM],
    uses: ["Garnish for rice, biryani and noodles", "Seasoning and spice blends", "Ready meals and instant soups", "Sauces, gravies and dressings"],
    grades: ["Food grade", "Flakes / 60–80 mesh powder", "Moisture ≤ 5%", "Private label / bulk"],
    forms: ["Flakes", "Powder"],
    drying: DRY.culinary,
  },

  // ------------------------------------------------ FUNCTIONAL & NUTRITIONAL
  {
    slug: "lemon-powder", name: "Lemon Powder", category: "functional-nutritional-powders",
    image: "/assets/img/products/lemon-powder-v2.webp", emoji: "🍋", hsn: "1106 30 10", botanical: "Citrus limon",
    listImage: "/assets/img/products/lemon-powder-wide.webp",
    tagline: "Zesty citrus brightness, ready to dose.",
    description:
      "Lemon powder brings clean, zesty citrus acidity and aroma to dry blends without added liquid. It is perfect for seasonings, beverages and bakery where a precise, consistent lemon note is needed.",
    features: ["Bright, natural citrus tang", "Convenient dry dosing", "Disperses readily", "No added acidulants", F_DRY, F_CUSTOM],
    uses: ["Seasonings and spice rubs", "Instant drinks and teas", "Bakery and confectionery", "Marinades and dressings"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "tomato-powder", name: "Tomato Powder", category: "dehydrated-vegetable-powders",
    image: "/assets/img/products/tomato-powder.webp", emoji: "🍅", hsn: "0712 90 90", botanical: "Solanum lycopersicum",
    tagline: "Concentrated tomato flavour and colour.",
    description:
      "Made from ripe red tomatoes, this powder concentrates their savoury-sweet flavour and rich colour into a shelf-stable form. It rehydrates into paste or sauce and is a staple for soups, seasonings and ready meals.",
    features: ["Rich umami tomato flavour", "Deep red natural colour", "Rehydrates to paste or sauce", "Space- and cost-efficient", F_DRY, F_CUSTOM],
    uses: ["Soups, sauces and ketchups", "Seasonings and snack dusts", "Ready meals and instant foods", "Bakery and savoury blends"],
    grades: ["Food grade", "60–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "carrot-powder", name: "Carrot Powder", category: "dehydrated-vegetable-powders",
    image: "/assets/img/products/carrot-powder.webp", emoji: "🥕", hsn: "0712 90 90", botanical: "Daucus carota",
    tagline: "Sweet, orange and rich in natural beta-carotene.",
    description:
      "Carrot powder carries the vegetable's natural sweetness and warm orange colour, plus its well-known beta-carotene. It is widely used in baby food, soups, seasonings and natural colouring applications.",
    features: ["Natural orange colour", "Source of beta-carotene", "Sweet, mild flavour", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Baby food and nutrition", "Soups, purées and sauces", "Bakery and snacks", "Natural colouring"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "jackfruit-powder", name: "Jackfruit Powder", category: "dehydrated-vegetable-powders",
    image: "/assets/img/products/jackfruit-powder.webp", emoji: "🟡", hsn: "1106 30 10", botanical: "Artocarpus heterophyllus",
    tagline: "India's super-fruit — sweet, filling, on-trend.",
    description:
      "Jackfruit powder turns one of India's most talked-about fruits into a versatile ingredient. Ripe jackfruit gives a sweet, tropical flavour for beverages and nutrition, while the fruit's fibre and resistant starch make it a popular functional and flour ingredient.",
    features: ["Sweet, tropical flavour", "Good source of fibre", "On-trend functional fruit", "Gluten-free flour alternative", F_DRY, F_CUSTOM],
    uses: ["Nutrition and meal blends", "Bakery and gluten-free flours", "Smoothies and beverages", "Snacks and cereals"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "coriander-leaf-powder", name: "Coriander Leaf Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/coriander-leaf-powder.webp",
    emoji: "🌱", hsn: "0712 90 90", botanical: "Coriandrum sativum",
    tagline: "Fresh, citrusy coriander leaf in a stable powder.",
    description:
      "Coriander leaf powder captures the bright, citrusy character of fresh coriander (cilantro) in a dried, easy-to-dose form. It brings the same clean green colour and herbaceous flavour to seasonings, sauces and nutrition blends without the shelf life limits of fresh leaf.",
    features: ["Bright, citrusy coriander flavour", "Retained green colour", "No chopping or spoilage", "Consistent batch to batch", F_DRY, F_CUSTOM],
    uses: ["Spice and seasoning blends", "Sauces, chutneys and marinades", "Soups and ready meals", "Nutrition and green blends"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.culinary,
  },
  {
    slug: "mint-powder", name: "Mint Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/mint-powder.webp",
    emoji: "🌿", hsn: "1211 90 99", botanical: "Mentha spicata",
    tagline: "Cooling mint leaf, dried to hold its aroma.",
    description:
      "Mint powder is made from carefully dried mint (pudina) leaves, milled to preserve the cooling aroma and fresh flavour buyers expect. It is a versatile functional ingredient for chutneys, beverages, confectionery and wellness blends.",
    features: ["Cooling, fresh mint aroma", "Vivid green colour", "Concentrated, easy to dose", "Long shelf life", F_DRY, F_CUSTOM],
    uses: ["Chutneys, dips and marinades", "Beverages and mocktails", "Confectionery and desserts", "Herbal and wellness blends"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.culinary,
  },

  // -------------------------------------------------- AYURVEDIC & HERBAL
  {
    slug: "moringa-powder", name: "Moringa Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/moringa-powder-v2.webp",
    listImage: "/assets/img/products/moringa-powder-wide.webp",
    emoji: "🌿", hsn: "1211 90 99", botanical: "Moringa oleifera",
    tagline: "The 'miracle tree' leaf, dried to keep it green.",
    description:
      "Moringa leaves are among the most nutrient-dense greens on earth. The leaves are dried carefully to protect their vivid colour and nutrition, then milled into a fine powder used worldwide in supplements, green blends and functional foods.",
    features: ["Vibrant green, carefully dried", "Naturally nutrient-dense", "Fine, even particle size", "Trusted superfood ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Green and smoothie blends", "Functional foods and bars", "Teas and herbal mixes"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "curry-leaf-powder", name: "Curry Leaf Powder", category: "culinary-spice-powders",
    image: "/assets/img/products/curry-leaf-powder.webp",
    emoji: "🍃", hsn: "1211 90 99", botanical: "Murraya koenigii",
    tagline: "Aromatic South-Indian leaf, dried and milled.",
    description:
      "Curry leaf powder preserves the distinctive aroma of fresh curry leaves in a stable, easy-to-use form. It is valued both as a culinary seasoning and as a traditional wellness ingredient, especially for hair and digestive care.",
    features: ["Authentic curry-leaf aroma", "Retained green colour", "Culinary and wellness use", "Long shelf life", F_DRY, F_CUSTOM],
    uses: ["Spice blends and seasonings", "Hair care and cosmetics", "Herbal and wellness mixes", "Snacks and savoury foods"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "kasuri-methi", name: "Kasuri Methi (Dried Fenugreek Leaves)", category: "culinary-spice-powders",
    emoji: "🌿", hsn: "0910 99 90", botanical: "Trigonella foenum-graecum",
    tagline: "Aromatic dried fenugreek leaves from Nagaur, Rajasthan.",
    description:
      "Kasuri methi takes its name from the fenugreek leaves of Nagaur in Rajasthan, prized for their strong, sweet-bitter aroma. The leaves are dried to keep their green colour and supplied whole or as powder for curries, breads, gravies and seasoning blends.",
    features: ["Strong, sweet-bitter aroma", "Natural green colour", "Dried leaves or powder", "From Nagaur, Rajasthan", F_DRY, F_CUSTOM],
    uses: ["Curries and gravies", "Breads, naan and parathas", "Seasoning and spice blends", "Sauces and marinades"],
    grades: ["Food grade", "Green colour, cleaned leaf", "Moisture ≤ 10%", "10 / 20 kg cartons or bags with liner"],
    forms: ["Dried leaves", "Powder"],
    drying: DRY.culinary,
  },
  {
    slug: "tulsi-powder", name: "Tulsi (Holy Basil) Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/tulsi-powder-v2.webp",
    listImage: "/assets/img/products/tulsi-powder-wide.webp",
    emoji: "🌱", hsn: "1211 90 99", botanical: "Ocimum sanctum",
    tagline: "India's sacred adaptogenic herb.",
    description:
      "Tulsi, or holy basil, is one of the most revered herbs in Ayurveda, known as an adaptogen. Our gently dried tulsi powder keeps its aroma and actives for use in teas, supplements and wellness blends.",
    features: ["Classic Ayurvedic adaptogen", "Aromatic and herbaceous", "Gently dried for actives", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Herbal teas and infusions", "Supplements and capsules", "Wellness and immunity blends", "Cosmetics"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "ashwagandha-powder", name: "Ashwagandha Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/ashwagandha-powder-v2.webp",
    listImage: "/assets/img/products/ashwagandha-powder-wide.webp",
    emoji: "🌿", hsn: "1211 90 99", botanical: "Withania somnifera",
    tagline: "India's premier adaptogen root, milled for consistent potency.",
    description:
      "Ashwagandha root is one of Ayurveda's most widely used adaptogens, valued for supporting stress resilience, vitality and restful sleep. The dried root is milled into a fine, consistent powder that holds its characteristic earthy aroma and withanolide-rich profile batch after batch.",
    features: ["Root-only, no leaf or stem fillers", "Consistent withanolide-rich profile", "Fine, even particle size", "Trusted adaptogen ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Functional foods and beverages", "Ayurvedic and herbal formulations", "Sports nutrition and recovery blends"],
    grades: ["Food / nutraceutical grade", "80–120 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "shatavari-powder", name: "Shatavari Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/shatavari-powder-v2.webp",
    listImage: "/assets/img/products/shatavari-powder-wide.webp",
    emoji: "🌱", hsn: "1211 90 99", botanical: "Asparagus racemosus",
    tagline: "The classic Ayurvedic root tonic for women's wellness.",
    description:
      "Shatavari root is a cornerstone of Ayurvedic women's-health formulations, traditionally used to support reproductive wellness and lactation. The dried root is milled into a fine, pale powder that keeps its mild, slightly sweet character for consistent formulation.",
    features: ["Root-only, carefully dried", "Mild, slightly sweet profile", "Fine, even particle size", "Trusted women's-wellness ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Women's-wellness formulations", "Functional foods and beverages", "Ayurvedic and herbal blends"],
    grades: ["Food / nutraceutical grade", "80–120 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "brahmi-powder", name: "Brahmi Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/brahmi-powder-v2.webp",
    listImage: "/assets/img/products/brahmi-powder-wide.webp",
    emoji: "🍃", hsn: "1211 90 99", botanical: "Bacopa monnieri",
    tagline: "The Ayurvedic memory herb, dried to hold its actives.",
    description:
      "Brahmi is Ayurveda's leading cognitive-support herb, traditionally used to support memory and mental clarity. The whole herb is dried gently and milled into a fine green powder that keeps its characteristic bitter profile and bacoside content intact.",
    features: ["Whole-herb powder", "Naturally bacoside-rich", "Vivid green colour", "Trusted cognitive-support ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Cognitive-support formulations", "Functional foods and beverages", "Ayurvedic and herbal blends"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "triphala-powder", name: "Triphala Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/triphala-powder-v2.webp",
    listImage: "/assets/img/products/triphala-powder-wide.webp",
    emoji: "🟤", hsn: "1211 90 99", botanical: "Terminalia chebula, Terminalia bellirica, Phyllanthus emblica",
    tagline: "The classic three-fruit Ayurvedic digestive blend.",
    description:
      "Triphala is Ayurveda's best-known digestive formula, a traditional blend of amalaki (Indian gooseberry), bibhitaki and haritaki in equal proportion. Each fruit is milled separately to spec before blending, so the finished powder holds a consistent tart, astringent profile batch after batch.",
    features: ["Traditional 1:1:1 three-fruit blend", "Consistent tart, astringent profile", "Fine, even particle size", "Trusted digestive-wellness formula", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Digestive-wellness formulations", "Functional foods and beverages", "Ayurvedic and herbal blends"],
    grades: ["Food / nutraceutical grade", "80–120 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "giloy-powder", name: "Giloy Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/giloy-powder-v2.webp",
    listImage: "/assets/img/products/giloy-powder-wide.webp",
    emoji: "🌿", hsn: "1211 90 99", botanical: "Tinospora cordifolia",
    tagline: "The Ayurvedic immunity vine, stem-milled for potency.",
    description:
      "Giloy, also known as guduchi, is a widely used Ayurvedic immunity herb. The dried stem is milled into a fine, bitter powder that holds its characteristic profile for consistent formulation batch after batch.",
    features: ["Stem-only, no leaf fillers", "Naturally bitter, potent profile", "Fine, even particle size", "Trusted immunity-support ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Immunity-support formulations", "Functional foods and beverages", "Ayurvedic and herbal blends"],
    grades: ["Food / nutraceutical grade", "80–120 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "neem-powder", name: "Neem Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/neem-powder-v2.webp",
    listImage: "/assets/img/products/neem-powder-wide.webp",
    emoji: "🍃", hsn: "1211 90 99", botanical: "Azadirachta indica",
    tagline: "The Ayurvedic bitter leaf, dried for skin and wellness use.",
    description:
      "Neem leaf is one of Ayurveda's most versatile bitters, traditionally used in skin-care and general-wellness formulations. The leaf is dried gently and milled into a fine green powder that keeps its characteristic bitter aroma intact.",
    features: ["Leaf-only powder", "Naturally bitter profile", "Vivid green colour", "Trusted skin- and wellness-care ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Skin-care and cosmetic formulations", "Functional foods and beverages", "Ayurvedic and herbal blends"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "trikatu-powder", name: "Trikatu Powder", category: "ayurvedic-herbal-powders",
    image: "/assets/img/products/trikatu-powder-v2.webp",
    listImage: "/assets/img/products/trikatu-powder-wide.webp",
    emoji: "🌶️", hsn: "1211 90 99", botanical: "Piper nigrum, Zingiber officinale, Piper longum",
    tagline: "The three-spice Ayurvedic blend for digestion and bioavailability.",
    description:
      "Trikatu is a classic Ayurvedic formula combining black pepper, ginger and long pepper (pippali) in equal proportion, traditionally used to support digestion and the bioavailability of other herbs. Each spice is milled separately to spec before blending for a consistent, pungent profile.",
    features: ["Traditional 1:1:1 three-spice blend", "Consistent pungent, warming profile", "Fine, even particle size", "Trusted digestive-formulation blend", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Digestive-wellness formulations", "Ayurvedic and herbal blends", "Functional foods and beverages"],
    grades: ["Food / nutraceutical grade", "80–120 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },

  // ------------------------------------------- HYDROCOLLOIDS & FOOD ADDITIVES
  {
    slug: "guar-gum-powder", name: "Guar Gum Powder", category: "hydrocolloids-food-additives",
    image: "/assets/img/products/guar-gum-powder.webp", emoji: "🧪", hsn: "1302 32 30", botanical: "Cyamopsis tetragonoloba",
    tagline: "India's flagship thickener — from ice cream to oil wells.",
    description:
      "Guar gum is a natural galactomannan extracted from the guar bean, and India produces the majority of the world's supply. It is a highly efficient cold-water thickener and stabiliser, available in food, pharma and industrial grades — including the high-viscosity, derivatised grades used in oil & gas well drilling and hydraulic fracturing.",
    features: ["High viscosity at low dosage", "Cold-water soluble, natural", "Food, pharma & industrial grades", "Oil-field / fracturing grades available", "Derivatised grades (hydroxypropyl, carboxymethyl)", F_CUSTOM],
    uses: ["Dairy, ice cream, sauces and bakery", "Beverages, dressings and gluten-free foods", "Oil & gas well drilling and hydraulic fracturing", "Textiles, paper, mining, explosives and pet food"],
    grades: ["Food / pharma grade", "Industrial / oil-field grade", "Various viscosities", "100–200 mesh · Moisture ≤ 12%"],
    drying: DRY.milled,
  },
  {
    slug: "psyllium-husk-powder", name: "Psyllium Husk Powder (Isabgol)", category: "hydrocolloids-food-additives",
    image: "/assets/img/products/psyllium-husk-powder.webp", emoji: "🌾", hsn: "1211 90 12", botanical: "Plantago ovata",
    tagline: "The world's go-to soluble-fibre, grown in India.",
    description:
      "India grows almost all of the world's psyllium. The husk is an exceptional source of soluble dietary fibre that forms a gel in water, making it a staple in digestive health products, fibre supplements and gluten-free baking.",
    features: ["Very high soluble-fibre content", "Forms a gel in water", "Clean-label digestive aid", "Gluten-free baking binder", "85%–99% purity grades", F_CUSTOM],
    uses: ["Fibre and laxative supplements", "Functional foods and drinks", "Gluten-free bakery", "Pharma formulations"],
    grades: ["Food / pharma grade", "85%–99% purity", "Husk / powder", "Moisture ≤ 10%"],
    drying: DRY.milled,
  },
  {
    slug: "tamarind-kernel-powder", name: "Tamarind Kernel Powder", category: "hydrocolloids-food-additives",
    image: "/assets/img/products/tamarind-kernel-powder.webp", emoji: "🟤", hsn: "1302 32 90", botanical: "Tamarindus indica",
    tagline: "A versatile natural thickener and sizing agent.",
    description:
      "Tamarind kernel powder (TKP) is a polysaccharide gum milled from tamarind seeds. It is a cost-effective thickening, gelling and sizing agent used in food, textiles and other industries, and pairs well with other hydrocolloids.",
    features: ["Natural polysaccharide gum", "Good thickening and gelling", "Cost-effective", "Plain & de-oiled grades", "Synergistic with other gums", F_CUSTOM],
    uses: ["Food thickening and gelling", "Textile and jute sizing", "Paper and adhesives", "Industrial applications"],
    grades: ["Food / technical grade", "Plain & de-oiled", "100–200 mesh", "Moisture ≤ 10%"],
    drying: DRY.milled,
  },

  // ------------------------------------------------- SEED SPICES & SESAME
  // Indian produce only (Nov 2026 brief): the imported watermelon, melon,
  // pumpkin and chia seeds were delisted; old URLs 301 to this category.
  {
    slug: "cumin-seeds", name: "Cumin Seeds", category: "seed-spices-sesame",
    emoji: "🌾", hsn: "0909 31 29", botanical: "Cuminum cyminum",
    tagline: "Bold, aromatic Indian cumin from Gujarat and Rajasthan, cleaned to 98–99% purity.",
    description:
      "India grows most of the world's cumin, and seed traded through Unjha in Gujarat sets the global benchmark. Lots are machine-cleaned and sorted to Singapore (98%) or Europe (99%) purity, with the warm, earthy aroma that carries spice blends, curry powders and meat seasonings. Powder is available on request.",
    features: ["Singapore 98% and Europe 99% purity grades", "Warm, earthy aroma with high volatile oil", "Whole seed, powder on request", "From Gujarat (Unjha) and Rajasthan", F_SEED_SORT, F_SEED_CUSTOM],
    uses: ["Spice blends and curry powders", "Seasonings and snack coatings", "Meat and sausage seasoning", "Breads, pickles and sauces"],
    grades: ["Food grade", "Purity 98–99%", "Moisture ≤ 10%", "25 / 50 kg PP or paper bags with liner"],
    forms: ["Whole", "Powder (on request)"],
    drying: DRY.seeds,
  },
  {
    slug: "coriander-seeds", name: "Coriander Seeds", category: "seed-spices-sesame",
    emoji: "🟤", hsn: "0909 21 90", botanical: "Coriandrum sativum",
    tagline: "Whole and split Indian coriander with a fresh, citrusy aroma.",
    description:
      "Indian coriander from the Kota and Ramganj Mandi belt of Rajasthan, and from Madhya Pradesh and Gujarat, is traded in the familiar Eagle and Scooter grades. It is supplied whole or split and cleaned to 98–99% purity, with the fresh, citrusy aroma that defines curry powders, pickling spice and sausage seasoning.",
    features: ["Eagle and Scooter grades", "Fresh, citrusy aroma", "Whole or split, powder on request", "From Rajasthan, Madhya Pradesh and Gujarat", F_SEED_SORT, F_SEED_CUSTOM],
    uses: ["Curry powders and spice blends", "Pickling spice", "Sausages and meat products", "Bakery and confectionery"],
    grades: ["Food grade", "Purity 98–99%", "Moisture ≤ 10%", "25 / 40 kg PP bags"],
    forms: ["Whole", "Split", "Powder (on request)"],
    drying: DRY.seeds,
  },
  {
    slug: "fenugreek-seeds", name: "Fenugreek Seeds", category: "seed-spices-sesame",
    emoji: "🟡", hsn: "0910 99 12", botanical: "Trigonella foenum-graecum",
    tagline: "Clean, golden Indian fenugreek for curry blends and nutraceuticals.",
    description:
      "India is the world's largest grower of fenugreek, with most of the crop coming from Rajasthan, Madhya Pradesh and Gujarat. The hard, golden seeds bring the bittersweet, maple-like note behind curry blends and spice mixes, and are widely used in nutraceutical formulations. Supplied whole and cleaned to 98–99% purity, with powder on request.",
    features: ["Golden, uniform whole seeds", "Bittersweet, maple-like aroma", "Whole seed, powder on request", "From Rajasthan, Madhya Pradesh and Gujarat", F_SEED_SORT, F_SEED_CUSTOM],
    uses: ["Curry blends and spice mixes", "Pickles and chutneys", "Nutraceuticals and supplements", "Seasonings and sauces"],
    grades: ["Food grade", "Purity 98–99%", "Moisture ≤ 10%", "25 / 50 kg PP bags"],
    forms: ["Whole", "Powder (on request)"],
    drying: DRY.seeds,
  },
  {
    slug: "ajwain-seeds", name: "Ajwain (Carom) Seeds", category: "seed-spices-sesame",
    emoji: "🌱", hsn: "0910 99 14", botanical: "Trachyspermum ammi",
    tagline: "Pungent, thymol-rich Indian carom seeds for snacks and savoury blends.",
    description:
      "Ajwain, or carom, is a small, ridged seed whose sharp, thyme-like bite comes from its high thymol content. Grown mainly in Gujarat, Rajasthan and Madhya Pradesh, it is supplied whole and cleaned to 98–99% purity for snacks, breads, savoury blends and digestive products, with powder on request.",
    features: ["High thymol, sharp thyme-like aroma", "Small, uniform ridged seeds", "Whole seed, powder on request", "From Gujarat, Rajasthan and Madhya Pradesh", F_SEED_SORT, F_SEED_CUSTOM],
    uses: ["Snacks, namkeen and crackers", "Breads, parathas and biscuits", "Savoury spice blends", "Digestive and herbal products"],
    grades: ["Food grade", "Purity 98–99%", "Moisture ≤ 10%", "25 kg PP bags"],
    forms: ["Whole", "Powder (on request)"],
    drying: DRY.seeds,
  },
  {
    slug: "sesame-seeds", name: "Sesame Seeds", category: "seed-spices-sesame",
    emoji: "⚪", hsn: "1207 40 90", botanical: "Sesamum indicum",
    tagline: "Natural, hulled and black Indian sesame, sorted to export purity.",
    description:
      "India is one of the world's largest sesame exporters, with crops from Gujarat, Rajasthan, Madhya Pradesh, Uttar Pradesh and West Bengal. Natural white, hulled white and black seed is cleaned and sorted to 99.90–99.95% purity for bakery toppings, tahini, confectionery and snack bars, and lots are tested against EU ethylene oxide and Salmonella limits before shipping.",
    features: ["Natural white, hulled white and black", "Purity 99.90–99.95%", "Low moisture for long storage", "From Gujarat, Rajasthan and Madhya Pradesh", F_SEED_SORT, F_SEED_CUSTOM],
    uses: ["Bakery toppings and buns", "Tahini and sesame pastes", "Confectionery and snack bars", "Oil extraction"],
    grades: ["Food grade", "Purity 99.90–99.95%", "Moisture ≤ 6%", "25 kg paper / PP bags with liner"],
    forms: ["Natural white", "Hulled white", "Black"],
    drying: DRY.seeds,
  },
];

// ---- helpers ----------------------------------------------------------------
export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
