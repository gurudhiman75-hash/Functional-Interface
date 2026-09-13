export const GEO_PHY_001_CP005_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
} as const);

export type GeoPhy001Cp005FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP005_FACTS_V1: readonly GeoPhy001Cp005FactRow[] = Object.freeze([
  {
    id: "location",
    fact: "The Indian Desert lies towards the western margins of the Aravali Hills.",
    shortFact: "west of the Aravali Hills",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-west-aravali"],
  },
  {
    id: "surface",
    fact: "It is an undulating sandy plain covered with sand dunes.",
    shortFact: "undulating sandy plain with dunes",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-sandy-undulating-plain"],
  },
  {
    id: "rainfall",
    fact: "The region receives very low rainfall, below 150 mm per year.",
    shortFact: "annual rainfall below 150 mm",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-rainfall-below-150mm"],
  },
  {
    id: "vegetation",
    fact: "Its climate is arid and the natural vegetation cover is low.",
    shortFact: "arid climate with sparse vegetation",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-arid-sparse-vegetation"],
  },
  {
    id: "seasonal-streams",
    fact: "Many streams appear during the rainy season and soon disappear into the sand because they lack enough water to reach the sea.",
    shortFact: "seasonal streams often disappear into sand",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-seasonal-streams"],
  },
  {
    id: "luni",
    fact: "The Luni is the only large river identified in the Indian Desert in the Class 9 description and flows through the southern desert region.",
    shortFact: "Luni is the desert's major river",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-luni"],
  },
  {
    id: "barchans",
    fact: "Barchans are crescent-shaped sand dunes and cover larger areas of the Indian Desert.",
    shortFact: "barchans are crescent-shaped dunes",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-barchans"],
  },
  {
    id: "longitudinal-dunes",
    fact: "Longitudinal dunes become more prominent near the Indo-Pakistan boundary.",
    shortFact: "longitudinal dunes prominent near Indo-Pakistan boundary",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-longitudinal-dunes"],
  },
  {
    id: "wind-landforms",
    fact: "Extreme aridity allows physical weathering and wind action to strongly shape the desert surface.",
    shortFact: "wind action and physical weathering shape the surface",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-wind-weathering"],
  },
  {
    id: "desert-landforms",
    fact: "Common arid landforms include mushroom rocks, shifting dunes and oasis.",
    shortFact: "mushroom rocks, shifting dunes and oasis",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-arid-landforms"],
  },
  {
    id: "regional-slope",
    fact: "Broadly, the northern desert slopes towards Sindh while the southern part slopes towards the Rann of Kachchh.",
    shortFact: "north towards Sindh; south towards Rann of Kachchh",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-regional-slope"],
  },
  {
    id: "ephemeral",
    fact: "Most rivers of the Indian Desert are ephemeral rather than perennial.",
    shortFact: "most desert rivers are ephemeral",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-ephemeral-rivers"],
  },
  {
    id: "inland-drainage",
    fact: "Some desert streams disappear after flowing for a distance or end in inland lakes and playas instead of reaching the sea.",
    shortFact: "inland drainage into lakes/playas",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-inland-drainage"],
  },
  {
    id: "playa",
    fact: "Desert playas commonly contain brackish water and are important sources of salt.",
    shortFact: "playas have brackish water and yield salt",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-playa-brackish-salt"],
  },
]);
