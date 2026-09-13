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
    fact: "The Indian Desert lies mainly to the west of the Aravali Hills.",
    shortFact: "west of the Aravali Hills",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-west-aravali"],
  },
  {
    id: "surface",
    fact: "It is a sandy plain with an uneven surface and many sand dunes.",
    shortFact: "sandy uneven plain with dunes",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-sandy-undulating-plain"],
  },
  {
    id: "rainfall",
    fact: "The Indian Desert receives very little rain, usually less than 150 mm a year.",
    shortFact: "annual rainfall below 150 mm",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-rainfall-below-150mm"],
  },
  {
    id: "vegetation",
    fact: "The climate is very dry (arid), so natural vegetation is sparse.",
    shortFact: "dry arid climate with sparse vegetation",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-arid-sparse-vegetation"],
  },
  {
    id: "seasonal-streams",
    fact: "Many streams flow only during the rainy season and then disappear into the sand before reaching the sea.",
    shortFact: "seasonal streams often disappear into sand",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-seasonal-streams"],
  },
  {
    id: "luni",
    fact: "The Luni is the only large river of this desert and flows through its southern part.",
    shortFact: "Luni is the desert's major river",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9, GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-luni"],
  },
  {
    id: "barchans",
    fact: "Barchans are crescent-shaped sand dunes. They cover large parts of the Indian Desert.",
    shortFact: "barchans are crescent-shaped dunes",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-barchans"],
  },
  {
    id: "longitudinal-dunes",
    fact: "Longitudinal dunes are especially common near the India-Pakistan border.",
    shortFact: "longitudinal dunes common near India-Pakistan border",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp005-longitudinal-dunes"],
  },
  {
    id: "wind-landforms",
    fact: "The desert is very dry, so wind and physical weathering strongly shape its surface.",
    shortFact: "wind and physical weathering shape the surface",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-wind-weathering"],
  },
  {
    id: "desert-landforms",
    fact: "Common desert features include mushroom rocks, shifting dunes and oases.",
    shortFact: "mushroom rocks, shifting dunes and oases",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-arid-landforms"],
  },
  {
    id: "regional-slope",
    fact: "The northern desert slopes towards Sindh, while the southern part slopes towards the Rann of Kachchh.",
    shortFact: "north towards Sindh; south towards Rann of Kachchh",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-regional-slope"],
  },
  {
    id: "ephemeral",
    fact: "Most rivers in the Indian Desert are seasonal (ephemeral), not perennial.",
    shortFact: "most desert rivers are seasonal or ephemeral",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-ephemeral-rivers"],
  },
  {
    id: "inland-drainage",
    fact: "Some desert streams disappear into the sand or end in inland lakes and playas instead of reaching the sea.",
    shortFact: "streams may end within the desert in lakes or playas",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-inland-drainage"],
  },
  {
    id: "playa",
    fact: "Water in many desert playas is slightly salty (brackish), and salt is often obtained from them.",
    shortFact: "playas have slightly salty water and yield salt",
    sourceIds: [GEO_PHY_001_CP005_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-playa-brackish-salt"],
  },
]);