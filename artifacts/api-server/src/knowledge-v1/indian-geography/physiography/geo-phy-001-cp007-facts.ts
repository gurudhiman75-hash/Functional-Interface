export const GEO_PHY_001_CP007_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
} as const);

export type GeoPhy001Cp007FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP007_FACTS_V1: readonly GeoPhy001Cp007FactRow[] = Object.freeze([
  {
    id: "major-groups",
    fact: "India has two major island groups: Lakshadweep and the Andaman and Nicobar Islands.",
    shortFact: "Lakshadweep and Andaman and Nicobar are the two major island groups",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-major-island-groups"],
  },
  {
    id: "lakshadweep-location",
    fact: "Lakshadweep lies in the Arabian Sea, close to the Malabar Coast of Kerala.",
    shortFact: "Lakshadweep lies in the Arabian Sea near the Malabar Coast",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-lakshadweep-arabian-malabar"],
  },
  {
    id: "lakshadweep-coral",
    fact: "Lakshadweep is a group of small coral islands.",
    shortFact: "Lakshadweep is made of small coral islands",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-lakshadweep-coral"],
  },
  {
    id: "kavaratti",
    fact: "Kavaratti is the administrative headquarters of Lakshadweep.",
    shortFact: "Kavaratti is the administrative headquarters of Lakshadweep",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-kavaratti-headquarters"],
  },
  {
    id: "pitti",
    fact: "Pitti island in Lakshadweep has a bird sanctuary.",
    shortFact: "Pitti island has a bird sanctuary",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-pitti-bird-sanctuary"],
  },
  {
    id: "andaman-location",
    fact: "The Andaman and Nicobar Islands form a long chain in the Bay of Bengal.",
    shortFact: "Andaman and Nicobar lie in the Bay of Bengal",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-andaman-bay-bengal"],
  },
  {
    id: "north-south",
    fact: "In the island chain, the Andaman group lies to the north and the Nicobar group lies to the south.",
    shortFact: "Andaman north, Nicobar south",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9, GEO_PHY_001_CP007_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-andaman-north-nicobar-south"],
  },
  {
    id: "ten-degree",
    fact: "The Ten Degree Channel separates the Andaman group from the Nicobar group.",
    shortFact: "Ten Degree Channel separates Andaman and Nicobar",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-ten-degree-channel"],
  },
  {
    id: "size-number",
    fact: "Compared with Lakshadweep, the Andaman and Nicobar Islands are larger, more numerous and more widely scattered.",
    shortFact: "Andaman and Nicobar are larger, more numerous and more scattered",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-andaman-size-number"],
  },
  {
    id: "submarine-mountains",
    fact: "The Andaman and Nicobar Islands are considered elevated parts of submarine mountains.",
    shortFact: "Andaman and Nicobar are elevated parts of submarine mountains",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9, GEO_PHY_001_CP007_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-submarine-mountains"],
  },
  {
    id: "barren-island",
    fact: "Barren Island in the Andaman and Nicobar group is associated with an active volcano.",
    shortFact: "Barren Island has an active volcano",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp007-barren-active-volcano"],
  },
  {
    id: "equatorial-forest",
    fact: "The Andaman and Nicobar Islands have an equatorial climate and thick forest cover.",
    shortFact: "Andaman and Nicobar have equatorial climate and thick forests",
    sourceIds: [GEO_PHY_001_CP007_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp007-equatorial-forest"],
  },
]);
