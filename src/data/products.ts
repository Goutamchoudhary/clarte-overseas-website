// =============================================================================
// Product catalogue — categories + products.
// Images: client-supplied CDN links. Missing ones fall back to a styled
// placeholder (emoji + gradient). HSN codes are standard Indian ITC-HS codes.
// Drying method is flexible (spray / freeze / drum / air) and chosen to suit
// the buyer's use-case and grade. All copy is original.
// =============================================================================

const IMG = (id: string) => `https://lsmedia.linker-cdn.net/1059756/2026/${id}.png`;

// Flexible drying lines by category — we supply the method the buyer's grade needs.
const DRY = {
  fruit: "Spray, freeze or drum-dried — to your grade",
  culinary: "Air, spray or freeze-dried — to your grade",
  functional: "Air, spray or freeze-dried — to your grade",
  herbal: "Shade, air or freeze-dried — to your grade",
  milled: "Mechanically milled to specification",
};

export interface Category {
  slug: string;
  name: string;
  navName: string;
  emoji: string;
  tagline: string;
  description: string;
  accentFrom: string;
  accentTo: string;
  heroImage?: string; // optional right-side hero photo (replaces the emoji motif)
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  image?: string;
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
    slug: "herbal-leaf-powders",
    name: "Herbal & Leaf Powders",
    navName: "Herbal & Leaf Powders",
    emoji: "🌿",
    tagline: "Nutrient-dense Indian botanicals",
    description:
      "Leaves and herbs grown across India, dried low and slow to protect their deep green colour and natural actives, then milled into clean, even powders for supplements, functional foods and seasonings.",
    accentFrom: "#1f7a4d",
    accentTo: "#0f6b4a",
  },
  {
    slug: "culinary-spice-powders",
    name: "Culinary & Spice Powders",
    navName: "Dehydrated Vegetable Powders – Culinary & Spice",
    emoji: "🧅",
    tagline: "The savoury backbone of every kitchen",
    description:
      "Onion, garlic, ginger and chilli — the workhorses of kitchens and food plants worldwide. Consistent pungency, clean flavour and a full range of cuts, from fine powder to kibbled flakes.",
    accentFrom: "#c2410c",
    accentTo: "#9a3412",
    heroImage: "/assets/img/categories/culinary-spice.jpg",
  },
  {
    slug: "functional-nutritional-powders",
    name: "Functional & Nutritional Powders",
    navName: "Dehydrated Vegetable Powders – Functional & Nutritional",
    emoji: "🥕",
    tagline: "Colour, nutrition and clean-label function",
    description:
      "Beetroot, tomato, carrot, lemon and more — vegetable and fruit powders chosen for natural colour, nutrition and clean-label functionality in supplements, seasonings, soups and ready meals.",
    accentFrom: "#be185d",
    accentTo: "#9d174d",
  },
  {
    slug: "fruit-powders",
    name: "Dehydrated Fruit Powders",
    navName: "Dehydrated Fruit Powder Ingredients",
    emoji: "🥭",
    tagline: "India's fruit, locked into a free-flowing powder",
    description:
      "Single-origin Indian fruits, gently dried and milled into free-flowing powders that hold their colour, tang and natural sweetness — built for beverages, bakery, dairy, confectionery and nutraceuticals.",
    accentFrom: "#d97706",
    accentTo: "#b45309",
  },
  {
    slug: "hydrocolloids-food-additives",
    name: "Hydrocolloids & Food Additives",
    navName: "Hydrocolloids & Food Additives",
    emoji: "🧪",
    tagline: "Plant-based thickeners, stabilisers & fibres",
    description:
      "India is the world's hub for plant-based gums and fibres. We supply guar gum, psyllium, tamarind kernel and cassia derivatives for food, beverage, pharma and industrial applications.",
    accentFrom: "#1f4693",
    accentTo: "#16306e",
  },
];

const POWDER_FORMS = ["Powder", "Granules", "Minced", "Chopped / Kibbled", "Flakes"];

// Shared closing features used across products (kept short, appended per item)
const F_DRY = "Drying method chosen to suit your application";
const F_CUSTOM = "Custom mesh, packing and private label on request";

export const products: Product[] = [
  // ---------------------------------------------------------------- FRUIT
  {
    slug: "guava-powder", name: "Guava Powder", category: "fruit-powders",
    image: IMG("14909744"), emoji: "🍐", hsn: "1106 30 10", botanical: "Psidium guajava",
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
    image: IMG("14850503"), emoji: "🍍", hsn: "1106 30 10", botanical: "Ananas comosus",
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
    image: IMG("14850495"), emoji: "🍌", hsn: "1106 30 10", botanical: "Musa paradisiaca",
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
    image: IMG("14850493"), emoji: "🍎", hsn: "1106 30 10", botanical: "Malus domestica",
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
    image: IMG("14854059"), emoji: "🥭", hsn: "1106 30 10", botanical: "Mangifera indica",
    tagline: "The king of fruits, captured at peak ripeness.",
    description:
      "Pressed from sweet, fully ripe Indian mangoes, this powder carries the rich aroma and deep golden colour the fruit is loved for. It is a natural fit for beverages, desserts and dairy that need real mango identity.",
    features: ["Ripe Alphonso / Totapuri character", "Vivid natural colour", "Excellent solubility", "No added sugar or flavour", F_DRY, F_CUSTOM],
    uses: ["Mango lassi, juices and shakes", "Ice cream and dairy desserts", "Bakery, fillings and confectionery", "Nutrition and breakfast blends"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },
  {
    slug: "amla-powder", name: "Amla Powder", category: "herbal-leaf-powders",
    image: IMG("14909743"), emoji: "🫒", hsn: "0813 40 90", botanical: "Phyllanthus emblica",
    tagline: "Indian gooseberry — a vitamin-C powerhouse.",
    description:
      "Amla, or Indian gooseberry, is one of the most prized fruits in Ayurveda. Our amla powder retains its natural tartness and is widely used in supplements, hair and skin care, and functional foods for its antioxidant reputation.",
    features: ["Naturally rich in vitamin C", "Sharp, characteristic tartness", "Trusted Ayurvedic ingredient", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Dietary supplements and tablets", "Hair oils and cosmetics", "Functional drinks and churnas", "Herbal blends and teas"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "tamarind-powder", name: "Tamarind Pulp Powder", category: "fruit-powders",
    image: IMG("14909745"), emoji: "🟤", hsn: "0813 40 90", botanical: "Tamarindus indica",
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
    emoji: "🟠", hsn: "1106 30 10", botanical: "Carica papaya",
    tagline: "Mild, sweet tropical fruit with natural enzymes.",
    description:
      "Papaya powder offers a soft, sweet tropical flavour along with the fruit's naturally occurring enzymes. It works well in nutrition blends and digestive formulations, and adds a gentle fruitiness to beverages and desserts.",
    features: ["Mild, sweet papaya taste", "Source of natural enzymes", "Smooth, fine texture", "Clean single-ingredient label", F_DRY, F_CUSTOM],
    uses: ["Digestive and nutrition blends", "Smoothies and beverages", "Skincare and cosmetics", "Desserts and bakery"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.fruit,
  },

  // ----------------------------------------------------- CULINARY & SPICE
  {
    slug: "red-onion-powder", name: "Red Onion Powder", category: "culinary-spice-powders",
    image: IMG("14850506"), emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
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
    emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
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
    emoji: "🧅", hsn: "0712 20 00", botanical: "Allium cepa",
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
    image: IMG("14850504"), emoji: "🧄", hsn: "0712 90 04", botanical: "Allium sativum",
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
    image: IMG("14850462"), emoji: "🫚", hsn: "0910 12 00", botanical: "Zingiber officinale",
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
    image: IMG("14898383"), emoji: "🌶️", hsn: "0904 22 00", botanical: "Capsicum annuum",
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
    slug: "fried-onion", name: "Fried Onion", category: "culinary-spice-powders",
    emoji: "🧅", hsn: "2005 99 90", botanical: "Allium cepa",
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
    image: IMG("14850470"), emoji: "🍋", hsn: "1106 30 10", botanical: "Citrus limon",
    tagline: "Zesty citrus brightness, ready to dose.",
    description:
      "Lemon powder brings clean, zesty citrus acidity and aroma to dry blends without added liquid. It is perfect for seasonings, beverages and bakery where a precise, consistent lemon note is needed.",
    features: ["Bright, natural citrus tang", "Convenient dry dosing", "Disperses readily", "No added acidulants", F_DRY, F_CUSTOM],
    uses: ["Seasonings and spice rubs", "Instant drinks and teas", "Bakery and confectionery", "Marinades and dressings"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "beetroot-powder", name: "Beetroot Powder", category: "functional-nutritional-powders",
    image: IMG("14850468"), emoji: "🟣", hsn: "0712 90 90", botanical: "Beta vulgaris",
    tagline: "Deep natural crimson and earthy nutrition.",
    description:
      "Beetroot powder delivers a striking natural crimson colour along with the root's earthy sweetness and nutrients. It is a clean-label favourite for natural colouring, sports nutrition and functional foods.",
    features: ["Vivid natural red colour", "Clean-label colourant", "Earthy, mildly sweet taste", "Popular in sports nutrition", F_DRY, F_CUSTOM],
    uses: ["Natural food colouring", "Sports and nutrition blends", "Bakery, pasta and snacks", "Smoothies and lattes"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "tomato-powder", name: "Tomato Powder", category: "functional-nutritional-powders",
    image: IMG("14850464"), emoji: "🍅", hsn: "0712 90 90", botanical: "Solanum lycopersicum",
    tagline: "Concentrated tomato flavour and colour.",
    description:
      "Made from ripe red tomatoes, this powder concentrates their savoury-sweet flavour and rich colour into a shelf-stable form. It rehydrates into paste or sauce and is a staple for soups, seasonings and ready meals.",
    features: ["Rich umami tomato flavour", "Deep red natural colour", "Rehydrates to paste or sauce", "Space- and cost-efficient", F_DRY, F_CUSTOM],
    uses: ["Soups, sauces and ketchups", "Seasonings and snack dusts", "Ready meals and instant foods", "Bakery and savoury blends"],
    grades: ["Food grade", "60–100 mesh (custom available)", "Moisture ≤ 5%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "carrot-powder", name: "Carrot Powder", category: "functional-nutritional-powders",
    image: IMG("14850477"), emoji: "🥕", hsn: "0712 90 90", botanical: "Daucus carota",
    tagline: "Sweet, orange and rich in natural beta-carotene.",
    description:
      "Carrot powder carries the vegetable's natural sweetness and warm orange colour, plus its well-known beta-carotene. It is widely used in baby food, soups, seasonings and natural colouring applications.",
    features: ["Natural orange colour", "Source of beta-carotene", "Sweet, mild flavour", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Baby food and nutrition", "Soups, purées and sauces", "Bakery and snacks", "Natural colouring"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },
  {
    slug: "jackfruit-powder", name: "Jackfruit Powder", category: "functional-nutritional-powders",
    emoji: "🟡", hsn: "1106 30 10", botanical: "Artocarpus heterophyllus",
    tagline: "India's super-fruit — sweet, filling, on-trend.",
    description:
      "Jackfruit powder turns one of India's most talked-about fruits into a versatile ingredient. Ripe jackfruit gives a sweet, tropical flavour for beverages and nutrition, while the fruit's fibre and resistant starch make it a popular functional and flour ingredient.",
    features: ["Sweet, tropical flavour", "Good source of fibre", "On-trend functional fruit", "Gluten-free flour alternative", F_DRY, F_CUSTOM],
    uses: ["Nutrition and meal blends", "Bakery and gluten-free flours", "Smoothies and beverages", "Snacks and cereals"],
    grades: ["Food grade", "80–100 mesh (custom available)", "Moisture ≤ 6%", "Private label / bulk"],
    drying: DRY.functional,
  },

  // ------------------------------------------------------- HERBAL & LEAF
  {
    slug: "moringa-powder", name: "Moringa Powder", category: "herbal-leaf-powders",
    image: IMG("14850451"), emoji: "🌿", hsn: "1211 90 99", botanical: "Moringa oleifera",
    tagline: "The 'miracle tree' leaf, dried to keep it green.",
    description:
      "Moringa leaves are among the most nutrient-dense greens on earth. We dry them carefully to protect their vivid colour and nutrition, then mill them into a fine powder used worldwide in supplements, green blends and functional foods.",
    features: ["Vibrant green, carefully dried", "Naturally nutrient-dense", "Fine, even particle size", "Trusted superfood ingredient", F_DRY, F_CUSTOM],
    uses: ["Capsules, tablets and supplements", "Green and smoothie blends", "Functional foods and bars", "Teas and herbal mixes"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },
  {
    slug: "curry-leaf-powder", name: "Curry Leaf Powder", category: "herbal-leaf-powders",
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
    slug: "tulsi-powder", name: "Tulsi (Holy Basil) Powder", category: "herbal-leaf-powders",
    emoji: "🌱", hsn: "1211 90 99", botanical: "Ocimum sanctum",
    tagline: "India's sacred adaptogenic herb.",
    description:
      "Tulsi, or holy basil, is one of the most revered herbs in Ayurveda, known as an adaptogen. Our gently dried tulsi powder keeps its aroma and actives for use in teas, supplements and wellness blends.",
    features: ["Classic Ayurvedic adaptogen", "Aromatic and herbaceous", "Gently dried for actives", "Clean single ingredient", F_DRY, F_CUSTOM],
    uses: ["Herbal teas and infusions", "Supplements and capsules", "Wellness and immunity blends", "Cosmetics"],
    grades: ["Food / nutraceutical grade", "80–100 mesh (custom available)", "Moisture ≤ 7%", "Private label / bulk"],
    drying: DRY.herbal,
  },

  // ------------------------------------------- HYDROCOLLOIDS & FOOD ADDITIVES
  {
    slug: "guar-gum-powder", name: "Guar Gum Powder", category: "hydrocolloids-food-additives",
    image: IMG("14850461"), emoji: "🧪", hsn: "1302 32 30", botanical: "Cyamopsis tetragonoloba",
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
    emoji: "🌾", hsn: "1211 90 12", botanical: "Plantago ovata",
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
    emoji: "🟤", hsn: "1302 32 90", botanical: "Tamarindus indica",
    tagline: "A versatile natural thickener and sizing agent.",
    description:
      "Tamarind kernel powder (TKP) is a polysaccharide gum milled from tamarind seeds. It is a cost-effective thickening, gelling and sizing agent used in food, textiles and other industries, and pairs well with other hydrocolloids.",
    features: ["Natural polysaccharide gum", "Good thickening and gelling", "Cost-effective", "Plain & de-oiled grades", "Synergistic with other gums", F_CUSTOM],
    uses: ["Food thickening and gelling", "Textile and jute sizing", "Paper and adhesives", "Industrial applications"],
    grades: ["Food / technical grade", "Plain & de-oiled", "100–200 mesh", "Moisture ≤ 10%"],
    drying: DRY.milled,
  },
  {
    slug: "cassia-gum-powder", name: "Cassia Gum Powder", category: "hydrocolloids-food-additives",
    emoji: "🟡", hsn: "1302 32 90", botanical: "Cassia tora / obtusifolia",
    tagline: "A gelling and stabilising gum for food and pet food.",
    description:
      "Cassia gum is a galactomannan derived from the cassia tora seed, often used in synergy with other gums for gelling and stabilising. It is widely approved as a thickener in pet food and selected food applications.",
    features: ["Synergistic with other gums", "Strong gelling / stabilising", "Plant-based galactomannan", "Pet-food and food grades", "Various viscosities", F_CUSTOM],
    uses: ["Pet food and animal feed", "Cheese, dairy and frozen desserts", "Meat and poultry products", "Industrial uses"],
    grades: ["Food / pet-food grade", "Various viscosities", "100–200 mesh", "Moisture ≤ 12%"],
    drying: DRY.milled,
  },
];

// ---- helpers ----------------------------------------------------------------
export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const getCategory = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
