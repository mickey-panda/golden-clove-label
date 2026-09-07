export const PAGE = { w: 4, h: 6 };

export const STATIC_TEXT = {
  headerText: "A Product Of",
  brandName: "GOLDEN CLOVE",
  companyInfo: [
    "Carefully manufactured and packaged by Golden Clove Spices,",
    "Berhampur, Odisha."
  ],
  rangeHeading: "Our Range Of Products",
  fssaiText: "Licence Number : 12025011000100"
};

export const SECTIONS = {
  header: 0.35,
  brand: 0.60,
  ruleY: 0.72,
  companyInfo: 0.88,
  ingredients: 1.22,               // Left-aligned dynamic baseline hook
  ingredientsLineHeight: 0.14,
  ingredientsToCatalogGap: 0.22,  // Balanced padding layout window
  footerRuleY: 4.52,
  footerLine1: 4.68,
  footerLine2: 4.84,
  fssaiTop: 4.96,
  fssaiHeight: 0.20,
  barcodeTop: 5.25,
  barcodeW: 1.6,
  barcodeH: 0.48,
  netWtY: 5.42,
  mrpY: 5.66,
};

export const CATALOG_COLUMNS = {
  col1X: 0.25,
  col2X: 2.10,
  width: 1.65,
  itemFontSize: 7.2,
  titleLineHeight: 0.13,
  itemLineHeight: 0.10,
  groupGap: 0.06,
  groups: [
    {
      title: "Authentic Powdered Spices",
      items: ["Turmeric Powder", "Red Chilli Powder", "Curry Masala Blend Powder", "Cumin Powder", "Coriander Powder", "Methi Powder"],
      col: 1
    },
    {
      title: "Whole Spices",
      items: [
        "Green Cardamom (Elaichi)", "Clove (Labang)", "Black Pepper", "Cumin seeds",
        "Coriander seeds", "Nutmeg", "Mace", "Star Anise",
        "Black Cardamom (Badi Elaichi)", "Cinnamon", "Fennel Seeds"
      ],
      col: 1
    },
    {
      title: "Premium Whole Spice",
      items: ["Real Ceylone Cinnamon (Sri Lankan)"],
      col: 2
    },
    {
      title: "Healthy Dried Seeds",
      items: ["Pumpkin Seeds", "Sunflower Seeds", "Chia Seeds", "Basil Seeds (Sabja)", "Flax Seeds"],
      col: 2
    },
    {
      title: "Flours (Atta)",
      items: ["Wheat Flour", "Bajra Flour", "Jawar Flour", "Multigrain Flour", "Barley Flour (Jou)"],
      col: 2
    },
    {
      title: "Cold Pressed Oils",
      items: ["Groundnut Oil", "Coconut Oil", "Mustard Oil", "Sesame seed Oil"],
      col: 2
    }
  ]
};
