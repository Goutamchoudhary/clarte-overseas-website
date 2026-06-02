// Blog posts for Clarté Overseas. Add new posts to this array; the list page
// and the /blogs/[id] detail pages are generated from it automatically.

export interface Post {
  id: string;          // slug used in /blogs/<id>
  title: string;
  excerpt: string;
  category: string;
  date: string;        // human readable
  read: string;
  author: string;
  emoji: string;       // placeholder accent until real cover images are added
  accent: string;      // banner gradient
  body: string;        // article HTML
}

export const posts: Post[] = [
  {
    id: "dehydrated-foods-future-of-food-manufacturing",
    title: "Why dehydrated foods are quietly becoming the backbone of food manufacturing",
    excerpt:
      "Powders and flakes used to be the compromise option. Today they sit at the centre of how modern food is made. Here is why that shift happened.",
    category: "Industry Trends",
    date: "28 May 2026",
    read: "6 min read",
    author: "Gautam Choudhary",
    emoji: "📈",
    accent: "linear-gradient(135deg,#1f4693,#4f46e5)",
    body: `
<p>For a long time, dehydrated ingredients had an image problem. They were the budget choice, the thing you reached for when fresh or frozen was not practical. That picture is well out of date. Look at how a modern sauce, snack or supplement is actually made and you will find dried flakes and fine powders doing a lot of the heavy lifting.</p>
<h2>A quiet shift on the ingredient deck</h2>
<p>Two things changed. Processing got far better, so colour, aroma and nutrients survive drying much more intact than they used to. And formulators began designing around powders on purpose, because they are easier to dose, blend and store than wet ingredients. The result is that dehydrated forms are no longer a substitute. For many products they are now the first choice.</p>
<h2>Shelf life without the cold chain</h2>
<p>Removing water removes most of what microbes need to grow. A properly dried vegetable powder can stay stable for a year or more at ambient temperature, with no refrigeration in the warehouse or the container. For a buyer importing across oceans, that is the difference between a simple shipment and a logistical headache. It also cuts weight, which cuts freight.</p>
<h2>Clean label and consistency</h2>
<p>Brands under pressure to shorten ingredient lists like dehydrated produce because it is, in the end, just the fruit or vegetable with the water taken out. No additives required. And because a powder is milled to a defined particle size, every batch behaves the same way on the line. Consistency is underrated until a variable ingredient ruins a production run.</p>
<h2>What it means for buyers</h2>
<p>If you are sourcing ingredients today, it is worth revisiting categories you might still think of as fresh-only. Onion, garlic, tomato, beetroot, spinach, mango and dozens of others are available as dependable powders and flakes, often at a better landed cost once you factor in shelf life and shipping. The future of a lot of food is, quietly, dried.</p>
`,
  },
  {
    id: "india-dehydrated-food-exports-growth",
    title: "India's dehydrated food exports are climbing fast. Here is what is behind it",
    excerpt:
      "From crop diversity to better processing, several forces are pushing India up the global table for dehydrated fruit, vegetable and powder ingredients.",
    category: "Market Outlook",
    date: "14 May 2026",
    read: "7 min read",
    author: "Gautam Choudhary",
    emoji: "🌏",
    accent: "linear-gradient(135deg,#1f4693,#0284c7)",
    body: `
<p>India has exported spices and farm produce for centuries. What is newer is its growing share of the global market for dehydrated fruits, vegetables and food-grade powders. Buyers who used to default to a familiar handful of origins are increasingly adding India to the shortlist. A few forces explain why.</p>
<h2>The crop advantage</h2>
<p>India grows an unusually wide range of produce across very different climates, which means one country can supply onion, garlic, chilli, tomato, ginger, beetroot, banana, mango and far more. For an importer, that breadth is valuable. Consolidating several ingredients with one dependable origin is simpler than juggling a different country for each line.</p>
<h2>Processing has caught up</h2>
<p>The bigger change is on the factory floor. Investment in better dryers, milling, metal detection and lab testing has lifted the quality of what leaves the country. Many units now run to international food-safety standards and hold consistent moisture, mesh and microbial specs across batches. Quality, not only price, is now part of the pitch.</p>
<h2>Where the demand is coming from</h2>
<p>Pull is coming from food and beverage manufacturers, seasoning houses, nutraceutical brands and private-label retailers, especially across the UK, Europe, the Gulf and Australia. Clean-label reformulation, plant-based products and the steady rise of functional foods all lean on exactly the kind of dried, traceable ingredients India is well placed to supply.</p>
<h2>The road ahead</h2>
<p>Growth is not guaranteed by geography alone. The exporters who win are the ones who treat documentation, traceability and communication as seriously as the product itself. For buyers, the takeaway is simple: India is worth a closer look, as long as you pick a partner who can prove consistency rather than just promise it.</p>
`,
  },
  {
    id: "flake-granule-or-powder-choosing-the-right-form",
    title: "Flake, granule or powder? How to choose the right form for your formulation",
    excerpt:
      "The same vegetable can ship as a flake, a granule or a fine powder. Picking the right one saves cost, waste and a fair bit of trouble.",
    category: "Buyer's Guide",
    date: "2 May 2026",
    read: "5 min read",
    author: "Gautam Choudhary",
    emoji: "🧂",
    accent: "linear-gradient(135deg,#0e7490,#1f4693)",
    body: `
<p>One of the first questions a good supplier should ask is not "how much do you need" but "what are you making". The reason is simple. The same vegetable can be supplied as a coarse flake, a granule or a fine powder, and the right choice depends entirely on the end product.</p>
<h2>Start with the end product</h2>
<p>Think about where the ingredient ends up and how it needs to behave. Should it stay visible in the finished product, rehydrate quickly, disperse evenly in a liquid, or disappear into a blend? That answer points you to a form before you ever talk price.</p>
<h2>Flakes</h2>
<p>Flakes and kibbled pieces keep a visible, recognisable texture. They suit soups, ready meals, seasoning toppings and anything where a buyer wants to see real pieces of vegetable. They rehydrate well and look honest on a label.</p>
<h2>Granules</h2>
<p>Granules sit in the middle. They flow and dose more predictably than flakes, dissolve faster, and are a common pick for dry seasoning blends, spice mixes and savoury bases where you want flavour without large visible pieces.</p>
<h2>Powders</h2>
<p>Fine powders are for even dispersion and strong, uniform flavour or colour. They are the form of choice for beverages, sauces, nutraceuticals, bakery and anything where you cannot have grit or visible specks. Mesh size matters here, so always confirm the particle size you need.</p>
<h2>A quick rule of thumb</h2>
<p>If you want texture, lean to flakes. If you want flow and dosing, granules. If you want a clean, uniform result, powder. When in doubt, ask for samples in two forms and test them on your own line before you commit to a volume.</p>
`,
  },
  {
    id: "how-to-read-a-dehydrated-ingredient-spec-sheet",
    title: "How to read a dehydrated ingredient spec sheet (without a lab coat)",
    excerpt:
      "Moisture, mesh, microbial counts. A plain-English guide to the numbers that actually decide whether an ingredient is right for you.",
    category: "Buyer's Guide",
    date: "18 Apr 2026",
    read: "6 min read",
    author: "Gautam Choudhary",
    emoji: "📋",
    accent: "linear-gradient(135deg,#4338ca,#7c3aed)",
    body: `
<p>A specification sheet is the most useful document a supplier will send you, and the easiest to skim past. It is, in effect, a promise about what every batch will look like. Here is how to read the numbers that matter without needing a food-science degree.</p>
<h2>Moisture</h2>
<p>Moisture is usually the headline figure, given as a percentage. Lower moisture generally means longer shelf life and lower microbial risk, though pushing it too low can affect colour and cost. What you really want is a tight, consistent range, not just a low number on one lucky batch.</p>
<h2>Mesh size</h2>
<p>Mesh, or particle size, tells you how fine a powder is, often described by the sieve it passes through. It affects how the ingredient flows, mixes and feels. If your process needs a specific fineness, state it clearly, because "powder" can mean very different things to different suppliers.</p>
<h2>Microbial counts</h2>
<p>Total plate count, yeast and mould, and tests for organisms like E. coli and Salmonella tell you how cleanly the product was made and handled. These limits often have to meet your own market's rules, so check them against the standard you are required to hit, not just the supplier's default.</p>
<h2>Colour, taste and the rest</h2>
<p>Good spec sheets also cover colour, flavour, foreign matter and sometimes pesticide residues or allergen statements. None of it is exotic, but together it is what separates a reliable ingredient from a gamble.</p>
<h2>Questions worth asking</h2>
<ul>
<li>Is this spec typical, or a best case from one good batch?</li>
<li>Can you share a recent certificate of analysis?</li>
<li>Which tests are run in-house versus at an accredited lab?</li>
<li>How do you handle a batch that falls out of spec?</li>
</ul>
<p>A supplier who answers these comfortably is usually one worth working with.</p>
`,
  },
  {
    id: "building-a-reliable-india-sourcing-strategy",
    title: "Building a reliable India sourcing strategy for food ingredients",
    excerpt:
      "Sourcing from India can be smooth or stressful. The difference usually comes down to a few decisions made early, before the first order ships.",
    category: "Sourcing",
    date: "4 Apr 2026",
    read: "8 min read",
    author: "Gautam Choudhary",
    emoji: "🤝",
    accent: "linear-gradient(135deg,#0d9488,#047857)",
    body: `
<p>Sourcing dehydrated ingredients from India can be remarkably smooth or quietly stressful. The difference rarely comes down to luck. It comes down to a handful of decisions made early, before the first order ever ships.</p>
<h2>Decide what "reliable" means for you</h2>
<p>Reliability looks different for every buyer. For some it is rock-steady specs, for others it is on-time delivery or responsive communication. Get specific about your own non-negotiables and say them out loud at the start, so a supplier can tell you honestly whether they can meet them.</p>
<h2>Check the paperwork that matters</h2>
<p>Registration and documentation are not bureaucracy for its own sake. An exporter set up properly will hold the registrations to trade and the food-safety credentials your market expects, and will produce clean export documents without drama. If basic paperwork is a struggle at the quote stage, it rarely improves later.</p>
<h2>Insist on traceability</h2>
<p>Ask how a batch is coded and whether it can be traced back from your warehouse to the raw material. Traceability is what makes audits, recalls and customer questions manageable instead of frightening. A supplier who can show it is telling you something about how they run.</p>
<h2>Plan for lead times and logistics</h2>
<p>Build realistic timelines that include production, documentation and freight, then agree them in writing. Understand who is responsible at each step and which port your goods move through. Surprises in logistics are expensive and almost always avoidable with a clear plan.</p>
<h2>Start small, then scale</h2>
<p>There is no substitute for a trial order. Test the product, the paperwork and the communication on a small volume first. If all three hold up, scale with confidence. If one wobbles, you have learned it cheaply. The best long-term partnerships almost always begin this way.</p>
`,
  },
];

export const faqs = [
  {
    q: "What products does Clarté Overseas export?",
    a: "Dehydrated fruits and vegetables in flake and powder form, herbal and leaf powders, culinary and spice powders, functional and nutritional powders, fruit powder ingredients, and hydrocolloids and food additives.",
  },
  {
    q: "Do you send samples before a bulk order?",
    a: "Yes. We encourage a trial order or samples so you can test the product, the documentation and our communication on a small volume before committing to a container.",
  },
  {
    q: "What forms and grades can you supply?",
    a: "Flakes, granules and fine powders, with custom mesh sizes and specs built around your formulation. If you are unsure which form suits your product, we are happy to advise.",
  },
  {
    q: "Which markets do you serve?",
    a: "We work with buyers across the UK, Europe, the Gulf and Australia, and we are actively opening up more markets across the world.",
  },
  {
    q: "What certifications and documentation do you provide?",
    a: "We are GST, IEC and RCMC registered, with FSSAI and ISO 9001 in place, and we handle full export documentation including the commercial invoice, packing list and certificate of origin.",
  },
  {
    q: "What about minimum order quantities and lead times?",
    a: "We keep MOQs trial-friendly so you can start small, with a typical despatch window of two to four weeks from a confirmed order. Private label and custom packaging are available on request.",
  },
];
