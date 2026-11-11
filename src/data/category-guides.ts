// Closing "Inside this range" section on each category page (v3).
// English copy here is the fallback; translations live in public/i18n under
// cat.guide_<slug_underscored>_{title,intro,regions,uses,spec} and the shared
// cat.guide_* labels. Each category has its own vector (no reuse).
export interface CategoryGuide {
  art: string;
  shelf: "24" | "18" | "12" | "1224"; // → cat.guide_shelf_<n>, mirrors categoryDefaults in specs.ts
  title: string;
  intro: string;
  regions: string;
  uses: string;
  spec: string;
}

export const categoryGuides: Record<string, CategoryGuide> = {
  "ayurvedic-herbal-powders": {
    art: "herbal-apothecary", shelf: "24",
    title: "Ayurveda's core herbs, ready for formulation",
    intro: "Single herbs and classic blends, matched to the botanical identity and active profile your formulation needs, with COA, heavy-metal and microbial results on every lot.",
    regions: "Madhya Pradesh, Rajasthan, Uttarakhand, Kerala",
    uses: "Capsules, tablets, herbal teas, wellness drinks and personal care",
    spec: "Herb and plant part, mesh size, any active marker and your target market",
  },
  "culinary-spice-powders": {
    art: "savoury-kit", shelf: "24",
    title: "The savoury base of the food industry",
    intro: "Onion, garlic, ginger, chilli and leafy herbs in powder, granule and flake cuts, graded for pungency, colour and flavour so every batch behaves the same on your line.",
    regions: "Gujarat, Maharashtra, Madhya Pradesh, Kerala",
    uses: "Seasonings, snacks, soups, sauces, ready meals and spice blends",
    spec: "Product, cut size or mesh, pungency or colour level, and pack size",
  },
  "functional-nutritional-powders": {
    art: "nutrient-shake", shelf: "18",
    title: "Nutrient-dense powders for better-for-you products",
    intro: "Amla, beetroot, amchur and lemon, dried to keep their colour, acidity and natural nutrients, for brands building clean-label nutrition into every serving.",
    regions: "Uttar Pradesh, Gujarat, Maharashtra, Tamil Nadu",
    uses: "Supplements, smoothie mixes, health drinks, bakery and natural colour",
    spec: "Product, mesh, colour or acidity target, and any nutrient claim you need supported",
  },
  "dehydrated-vegetable-powders": {
    art: "veg-crate", shelf: "18",
    title: "Vegetables in a shelf-stable, easy-dose form",
    intro: "Tomato, carrot and jackfruit powders that bring real vegetable colour, body and flavour without cold storage or prep, in grades for dry mixes and wet systems alike.",
    regions: "Maharashtra, Karnataka, Kerala, Gujarat",
    uses: "Soups, sauces, instant mixes, snacks, bakery and baby food",
    spec: "Product, mesh, colour or solubility need, and whether it goes into a dry or wet application",
  },
  "fruit-powders": {
    art: "fruit-cooler", shelf: "18",
    title: "Tropical fruit flavour without the logistics of fresh",
    intro: "Guava, mango, banana, pineapple, papaya, pomegranate and tamarind, dried and milled into free-flowing powders that hold natural colour, tang and sweetness.",
    regions: "Maharashtra, Andhra Pradesh, Tamil Nadu, Kerala",
    uses: "Beverages, dairy, ice cream, confectionery, bakery and nutraceuticals",
    spec: "Fruit, mesh, carrier preference and how free-flowing it needs to be",
  },
  "seed-spices-sesame": {
    art: "seed-grader", shelf: "1224",
    title: "India's seed spices and sesame, cleaned to export purity",
    intro: "Cumin, coriander, fenugreek, ajwain and sesame, machine-cleaned, sorted and graded to Singapore, Europe or your own purity spec so every lot blends and packs the same way.",
    regions: "Gujarat, Rajasthan, Madhya Pradesh",
    uses: "Spice blends, seasonings, bakery, tahini and confectionery",
    spec: "Seed, purity grade, moisture limit, destination market and packing",
  },
  "hydrocolloids-food-additives": {
    art: "gel-beaker", shelf: "24",
    title: "Texture and fibre you can specify precisely",
    intro: "Guar gum, psyllium husk and tamarind kernel powder, graded by viscosity, purity and mesh so they thicken, bind and stabilise the same way every time.",
    regions: "Rajasthan, Gujarat, Karnataka, Tamil Nadu",
    uses: "Dairy, sauces, bakery, fibre supplements and industrial applications",
    spec: "Product, viscosity or purity grade, mesh and end use",
  },
};

export const guideShelf = {
  "24": "24 months, unopened",
  "18": "18–24 months, unopened",
  "12": "12 months, unopened",
  "1224": "12–24 months, unopened",
};
