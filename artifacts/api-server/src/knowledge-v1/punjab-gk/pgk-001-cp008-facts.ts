export const PGK_001_CP008_SOURCE_IDS = Object.freeze({
  pauRabi: "PAU-PACKAGE-RABI",
  pauKharif: "PAU-PACKAGE-KHARIF",
  pauInstitution: "PAU-INSTITUTION-GREEN-REVOLUTION",
  pauSouthwest: "PAU-SOUTHWEST-ZONE",
  pauCotton: "PAU-COTTON-SOUTHWEST",
  pauFruits: "PAU-PACKAGE-FRUITS-ZONES",
  pauMaizeKandi: "PAU-MAIZE-KANDI",
  punjabAgPolicy: "PUNJAB-AGRICULTURE-POLICY",
} as const);

export const PGK_001_CP008_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP008_SOURCE_IDS.pauRabi]: { authority: "Punjab Agricultural University", title: "Package of Practices for Rabi Crops", url: "https://pau.edu/content/ccil/pf/pp_rabi.pdf" },
  [PGK_001_CP008_SOURCE_IDS.pauKharif]: { authority: "Punjab Agricultural University", title: "Package of Practices for Kharif Crops", url: "https://old.pau.edu/content/ccil/pf/pp_kharif.pdf" },
  [PGK_001_CP008_SOURCE_IDS.pauInstitution]: { authority: "Punjab Agricultural University", title: "Education and Service / Green Revolution role", url: "https://pau.edu/index.php?DO=firstLink&_act=manageLink&intSubID=13" },
  [PGK_001_CP008_SOURCE_IDS.pauSouthwest]: { authority: "Punjab Agricultural University", title: "Regional Research Station Faridkot / South-Western Zone", url: "https://pau.edu/outstations/index.php?DO=viewHomePage&_act=manageOutstationData&intLinkID=3" },
  [PGK_001_CP008_SOURCE_IDS.pauCotton]: { authority: "Punjab Agricultural University", title: "Cotton in South-Western Punjab", url: "https://pau.edu/content/ccil/pf/6.pdf" },
  [PGK_001_CP008_SOURCE_IDS.pauFruits]: { authority: "Punjab Agricultural University", title: "Package of Practices for Fruit Crops", url: "https://www.pau.edu/content/ccil/pf/pp_fruits.pdf" },
  [PGK_001_CP008_SOURCE_IDS.pauMaizeKandi]: { authority: "Punjab Agricultural University", title: "Kharif maize recommendations for Kandi", url: "https://pau.edu/index.php?DO=viewEventDetail&_act=manageEvent&intID=6549" },
  [PGK_001_CP008_SOURCE_IDS.punjabAgPolicy]: { authority: "Government of Punjab", title: "Agriculture Policy of Punjab", url: "https://punjab.gov.in/wp-content/uploads/2019/04/Agriculture-policy-of-punjab.pdf" },
} as const);

export const PGK_001_CP008_SEASON_FACTS = Object.freeze([
  { id: "wheat-rabi", crop: "Wheat", season: "Rabi" },
  { id: "mustard-rabi", crop: "Rapeseed-mustard", season: "Rabi" },
  { id: "gram-rabi", crop: "Gram/Chickpea", season: "Rabi" },
  { id: "rice-kharif", crop: "Rice/Paddy", season: "Kharif" },
  { id: "cotton-kharif", crop: "Cotton", season: "Kharif" },
  { id: "maize-kharif", crop: "Maize", season: "Kharif" },
]);

export const PGK_001_CP008_CORE_FACTS = Object.freeze({
  dominantRotation: "Rice-Wheat",
  pauLocation: "Ludhiana",
  cottonCoreDistricts: Object.freeze(["Bathinda", "Mansa", "Fazilka", "Sri Muktsar Sahib"]),
  aboharDistrict: "Fazilka",
  aboharMajorFruit: "Kinnow",
  maizeKandiRelation: "Kharif maize has varieties recommended for Kandi areas",
  aridIrrigatedMainFruit: "Kinnow",
  kandiFruitSet: Object.freeze(["Guava", "Ber", "Amla", "Mango", "Galgal"]),
});

export const PGK_001_CP008_INNOVATION_FACTS = Object.freeze([
  { id: "pau-green-revolution", statement: "Punjab Agricultural University at Ludhiana played a major role in India's Green Revolution." },
  { id: "pau-pearl-millet-hybrid", statement: "PAU produced the world's first hybrid grain pearl millet." },
  { id: "pau-bt1", statement: "PAU Bt 1 was India's first Bt cotton variety developed by a public-sector university and released for Punjab and Haryana." },
  { id: "pau-kinnow1", statement: "PAU Kinnow 1 is a low-seeded kinnow variety developed by PAU." },
  { id: "diversification-water", statement: "Crop diversification can reduce excessive dependence on the rice-wheat cycle and pressure on groundwater." },
  { id: "dsr-water", statement: "Direct-seeded rice is promoted as a water-saving rice establishment method." },
]);

export const PGK_001_CP008_FACT_IDS = Object.freeze([
  ...PGK_001_CP008_SEASON_FACTS.map((row) => row.id),
  "rice-wheat-rotation",
  "cotton-southwest",
  "cotton-core-districts",
  "abohar-kinnow",
  "maize-kandi",
  "sugarcane-commercial",
  "arid-irrigated-kinnow",
  "kandi-fruits",
  ...PGK_001_CP008_INNOVATION_FACTS.map((row) => row.id),
]);
