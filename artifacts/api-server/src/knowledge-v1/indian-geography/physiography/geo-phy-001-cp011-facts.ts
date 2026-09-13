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
    fact: "The Himalayas are young fold mountains in northern India.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-himalayan-young-fold"],
  },
  {
    id: "northern-plains-alluvial",
    fact: "The Northern Plains are wide alluvial plains made by deposits of the Indus, Ganga and Brahmaputra river systems and their tributaries.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-northern-plains-alluvial"],
  },
  {
    id: "plateau-old-tableland",
    fact: "The Peninsular Plateau is an old plateau made mainly of crystalline, igneous and metamorphic rocks.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-peninsular-old-tableland"],
  },
  {
    id: "desert-arid-sandy",
    fact: "The Indian Desert is a dry sandy region lying mainly west of the Aravali Hills.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-indian-desert-arid", "geo-phy-001-cp005-west-aravali", "geo-phy-001-cp005-sandy-undulating-plain"],
  },
  {
    id: "desert-rain-vegetation",
    fact: "The Indian Desert gets very little rain, so natural vegetation is sparse.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-rainfall-below-150mm", "geo-phy-001-cp005-arid-sparse-vegetation"],
  },
  {
    id: "desert-seasonal-drainage",
    fact: "Many desert streams flow only in the rainy season. They may disappear into sand or end inland instead of reaching the sea.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp005-seasonal-streams", "geo-phy-001-cp005-inland-drainage"],
  },
  {
    id: "coastal-plains-margins",
    fact: "The Coastal Plains are lowlands along the Arabian Sea and Bay of Bengal on the two sides of the Peninsular Plateau.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-coastal-plains-margins", "geo-phy-001-cp006-coastal-strips-two-seas"],
  },
  {
    id: "west-coast",
    fact: "The Western Coastal Plain is generally narrow and lies along the Arabian Sea. It is a submerged coast and has good natural ports.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-west-between-ghats-arabian", "geo-phy-001-cp006-west-narrow", "geo-phy-001-cp006-west-submerged"],
  },
  {
    id: "east-coast",
    fact: "The Eastern Coastal Plain lies along the Bay of Bengal. It is wider and flatter, and is an emergent coast with large river deltas.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-east-wide-level", "geo-phy-001-cp006-east-emergent", "geo-phy-001-cp006-east-delta-rivers"],
  },
  {
    id: "west-sections",
    fact: "Konkan, Kannad Plain and Malabar Coast are parts of the Western Coastal Plain.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-west-sections"],
  },
  {
    id: "east-sections",
    fact: "Northern Circar and Coromandel Coast are parts of the Eastern Coastal Plain.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-east-sections"],
  },
  {
    id: "island-groups",
    fact: "India has two major island groups: Lakshadweep in the Arabian Sea and Andaman and Nicobar in the Bay of Bengal.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp001-island-groups", "geo-phy-001-cp007-major-island-groups", "geo-phy-001-cp007-lakshadweep-arabian-malabar", "geo-phy-001-cp007-andaman-bay-bengal"],
  },
  {
    id: "lakshadweep-coral",
    fact: "Lakshadweep is a group of small coral islands near the Malabar Coast.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-lakshadweep-coral", "geo-phy-001-cp007-lakshadweep-arabian-malabar"],
  },
  {
    id: "andaman-submarine",
    fact: "Andaman and Nicobar have more and larger islands than Lakshadweep. They are raised parts of underwater mountains.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class9, GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-andaman-size-number", "geo-phy-001-cp007-submarine-mountains"],
  },
  {
    id: "andaman-volcano-channel",
    fact: "Barren Island has an active volcano. The Ten Degree Channel separates the Andaman group from the Nicobar group.",
    sourceIds: [GEO_PHY_001_CP011_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-barren-active-volcano", "geo-phy-001-cp007-ten-degree-channel"],
  },
]);

export const GEO_PHY_001_CP011_FACT_BY_ID_V1 = Object.freeze(
  Object.fromEntries(GEO_PHY_001_CP011_FACTS_V1.map((fact) => [fact.id, fact])) as Record<string, GeoPhy001Cp011FactRow>,
);
