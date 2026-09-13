export const GEO_PHY_001_CP011_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
} as const);

export type GeoPhy001Cp011FactRow = {
  id: string;
  fact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP011_FACTS_V1: readonly GeoPhy001Cp011FactRow[] = Object.freeze([
  {
    id: "himalaya-young-fold",
    fact: "The Himalayan Mountains are geologically young fold mountains along the north of India.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-himalayan-young-fold"],
  },
  {
    id: "northern-plains-alluvial",
    fact: "The Northern Plains are extensive alluvial plains formed by the Indus, Ganga and Brahmaputra river systems and their tributaries.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-northern-plains-alluvial"],
  },
  {
    id: "plateau-old-tableland",
    fact: "The Peninsular Plateau is an ancient tableland made largely of old crystalline, igneous and metamorphic rocks.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-peninsular-old-tableland"],
  },
  {
    id: "desert-arid-sandy",
    fact: "The Indian Desert is an arid sandy region lying mainly to the west of the Aravali Hills.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-indian-desert-arid", "geo-phy-001-cp005-west-aravali", "geo-phy-001-cp005-sandy-undulating-plain"],
  },
  {
    id: "desert-rain-vegetation",
    fact: "The Indian Desert receives very little rain and has sparse natural vegetation.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-rainfall-below-150mm", "geo-phy-001-cp005-arid-sparse-vegetation"],
  },
  {
    id: "desert-seasonal-drainage",
    fact: "Many desert streams are seasonal and may disappear into sand or end inland instead of reaching the sea.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-seasonal-streams", "geo-phy-001-cp005-inland-drainage"],
  },
  {
    id: "coastal-plains-margins",
    fact: "The Coastal Plains are lowlands along the Arabian Sea and Bay of Bengal margins of the Peninsular Plateau.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-coastal-plains-margins", "geo-phy-001-cp006-coastal-strips-two-seas"],
  },
  {
    id: "west-coast",
    fact: "The Western Coastal Plain is generally narrow, lies by the Arabian Sea and is a submerged coast that favours natural ports.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-west-between-ghats-arabian", "geo-phy-001-cp006-west-narrow", "geo-phy-001-cp006-west-submerged"],
  },
  {
    id: "east-coast",
    fact: "The Eastern Coastal Plain lies by the Bay of Bengal, is wider and more level, and is an emergent coast with large river deltas.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-east-wide-level", "geo-phy-001-cp006-east-emergent", "geo-phy-001-cp006-east-delta-rivers"],
  },
  {
    id: "west-sections",
    fact: "Konkan, Kannad Plain and Malabar Coast are sections of the Western Coastal Plain.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-west-sections"],
  },
  {
    id: "east-sections",
    fact: "Northern Circar and Coromandel Coast are sections of the Eastern Coastal Plain.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-east-sections"],
  },
  {
    id: "island-groups",
    fact: "India's two major island groups are Lakshadweep in the Arabian Sea and Andaman and Nicobar in the Bay of Bengal.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-island-groups", "geo-phy-001-cp007-major-island-groups", "geo-phy-001-cp007-lakshadweep-arabian-malabar", "geo-phy-001-cp007-andaman-bay-bengal"],
  },
  {
    id: "lakshadweep-coral",
    fact: "Lakshadweep is a group of small coral islands close to the Malabar Coast.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-lakshadweep-coral", "geo-phy-001-cp007-lakshadweep-arabian-malabar"],
  },
  {
    id: "andaman-submarine",
    fact: "The Andaman and Nicobar Islands are larger and more scattered than Lakshadweep and are considered elevated parts of submarine mountains.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-andaman-size-number", "geo-phy-001-cp007-submarine-mountains"],
  },
  {
    id: "andaman-volcano-channel",
    fact: "Barren Island has an active volcano, and the Ten Degree Channel separates the Andaman group from the Nicobar group.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-barren-active-volcano", "geo-phy-001-cp007-ten-degree-channel"],
  },
]);

export const GEO_PHY_001_CP011_FACT_BY_ID_V1 = Object.freeze(
  Object.fromEntries(GEO_PHY_001_CP011_FACTS_V1.map((fact) => [fact.id, fact])) as Record<string, GeoPhy001Cp011FactRow>,
);
