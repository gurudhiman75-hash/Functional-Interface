export const GEO_PHY_001_CP006_SOURCE_IDS = Object.freeze({
  class9: "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES",
  class11: "NCERT-INDIA-PHYSICAL-ENVIRONMENT-STRUCTURE-PHYSIOGRAPHY",
} as const);

export type GeoPhy001Cp006FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP006_FACTS_V1: readonly GeoPhy001Cp006FactRow[] = Object.freeze([
  {
    id: "coastal-strips",
    fact: "India has coastal plains along the Arabian Sea in the west and the Bay of Bengal in the east.",
    shortFact: "coastal plains lie along the Arabian Sea and Bay of Bengal",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-coastal-strips-two-seas"],
  },
  {
    id: "west-location",
    fact: "The Western Coastal Plain lies between the Western Ghats and the Arabian Sea.",
    shortFact: "west coast lies between Western Ghats and Arabian Sea",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-west-between-ghats-arabian"],
  },
  {
    id: "west-narrow",
    fact: "The Western Coastal Plain is generally narrow.",
    shortFact: "western coastal plain is narrow",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9, GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-west-narrow"],
  },
  {
    id: "west-sections",
    fact: "From north to south, the Western Coastal Plain is divided into the Konkan, Kannad Plain and Malabar Coast.",
    shortFact: "Konkan–Kannad–Malabar from north to south",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-west-sections"],
  },
  {
    id: "konkan",
    fact: "The Konkan is the northern section of the Western Coastal Plain and includes the Mumbai–Goa stretch.",
    shortFact: "Konkan is the northern western-coast section",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-konkan"],
  },
  {
    id: "kannad",
    fact: "The Kannad Plain is the central section of the Western Coastal Plain.",
    shortFact: "Kannad Plain is the central western-coast section",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-kannad"],
  },
  {
    id: "malabar",
    fact: "The Malabar Coast is the southern section of the Western Coastal Plain.",
    shortFact: "Malabar is the southern western-coast section",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-malabar"],
  },
  {
    id: "east-form",
    fact: "The Eastern Coastal Plain lies along the Bay of Bengal and is wider and more level than the western coastal plain.",
    shortFact: "eastern coastal plain is wide and level along Bay of Bengal",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9, GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-east-wide-level"],
  },
  {
    id: "east-sections",
    fact: "The northern part of the Eastern Coastal Plain is called the Northern Circar and the southern part is the Coromandel Coast.",
    shortFact: "Northern Circar in north; Coromandel in south",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-east-sections"],
  },
  {
    id: "east-deltas",
    fact: "The Mahanadi, Godavari, Krishna and Kaveri form large deltas on the eastern coast.",
    shortFact: "Mahanadi, Godavari, Krishna and Kaveri form east-coast deltas",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9, GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-east-delta-rivers"],
  },
  {
    id: "chilika-east",
    fact: "Chilika Lake is an important feature of the eastern coast.",
    shortFact: "Chilika is on the eastern coast",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-chilika-east"],
  },
  {
    id: "chilika-odisha",
    fact: "Chilika Lake is in Odisha, south of the Mahanadi delta.",
    shortFact: "Chilika is in Odisha south of Mahanadi delta",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-chilika-odisha-mahanadi"],
  },
  {
    id: "chilika-salt",
    fact: "Chilika is identified as India’s largest salt-water lake.",
    shortFact: "Chilika is India’s largest salt-water lake",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class9],
    sourceFactIds: ["geo-phy-001-cp006-chilika-largest-saltwater"],
  },
  {
    id: "west-submerged",
    fact: "The western coast is a submerged coast, which gives good conditions for natural ports and harbours.",
    shortFact: "western coast is submerged and favours natural ports",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-west-submerged"],
  },
  {
    id: "east-emergent",
    fact: "The eastern coast is an emergent coast and has well-developed river deltas.",
    shortFact: "eastern coast is emergent with developed deltas",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-east-emergent"],
  },
  {
    id: "west-no-deltas",
    fact: "Rivers crossing the Western Coastal Plain generally do not form deltas.",
    shortFact: "western-coast rivers generally do not form deltas",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-west-rivers-no-deltas"],
  },
  {
    id: "malabar-kayals",
    fact: "The Malabar Coast is known for kayals, or backwaters, used for fishing and inland navigation.",
    shortFact: "Malabar has kayals or backwaters",
    sourceIds: [GEO_PHY_001_CP006_SOURCE_IDS.class11],
    sourceFactIds: ["geo-phy-001-cp006-malabar-kayals"],
  },
]);
