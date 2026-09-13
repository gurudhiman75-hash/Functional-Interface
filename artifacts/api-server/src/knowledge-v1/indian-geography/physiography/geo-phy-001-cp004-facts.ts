export const GEO_PHY_001_CP004_SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES";

export type GeoPhy001Cp004FactRow = {
  id: string;
  subject: string;
  fact: string;
  shortFact: string;
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP004_FOUNDATION_FACTS_V1: readonly GeoPhy001Cp004FactRow[] = Object.freeze([
  {
    id: "old-tableland",
    subject: "Peninsular Plateau",
    fact: "It is an old tableland made mainly of crystalline, igneous and metamorphic rocks.",
    shortFact: "old tableland of crystalline, igneous and metamorphic rocks",
    sourceFactIds: ["geo-phy-001-cp004-old-tableland"],
  },
  {
    id: "gondwana",
    subject: "Peninsular Plateau",
    fact: "It formed from the breaking and drifting of Gondwana land and is part of India's oldest landmass.",
    shortFact: "formed from the breaking and drifting of Gondwana land",
    sourceFactIds: ["geo-phy-001-cp004-gondwana-origin"],
  },
  {
    id: "landforms",
    subject: "Peninsular Plateau",
    fact: "Broad, shallow valleys and rounded hills are common features of this plateau.",
    shortFact: "broad shallow valleys and rounded hills",
    sourceFactIds: ["geo-phy-001-cp004-rounded-hills-valleys"],
  },
  {
    id: "two-divisions",
    subject: "Peninsular Plateau",
    fact: "Its two broad divisions are the Central Highlands and the Deccan Plateau.",
    shortFact: "Central Highlands and Deccan Plateau are its two broad divisions",
    sourceFactIds: ["geo-phy-001-cp004-two-divisions"],
  },
]);

export const GEO_PHY_001_CP004_CENTRAL_HIGHLANDS_FACTS_V1: readonly GeoPhy001Cp004FactRow[] = Object.freeze([
  {
    id: "central-narmada",
    subject: "Central Highlands",
    fact: "They lie mainly north of the Narmada River and include a large part of the Malwa Plateau.",
    shortFact: "lie mainly north of the Narmada River",
    sourceFactIds: ["geo-phy-001-cp004-central-highlands-narmada"],
  },
  {
    id: "central-width",
    subject: "Central Highlands",
    fact: "They are wider in the west and narrower in the east.",
    shortFact: "wider in the west and narrower in the east",
    sourceFactIds: ["geo-phy-001-cp004-central-highlands-width"],
  },
  {
    id: "bundelkhand-baghelkhand",
    subject: "Central Highlands",
    fact: "Their eastward extensions are locally called Bundelkhand and Baghelkhand.",
    shortFact: "extend eastward as Bundelkhand and Baghelkhand",
    sourceFactIds: ["geo-phy-001-cp004-bundelkhand-baghelkhand"],
  },
  {
    id: "chotanagpur",
    subject: "Chotanagpur Plateau",
    fact: "It forms the further eastward extension of the Central Highlands and is drained by the Damodar River.",
    shortFact: "further eastward extension drained by the Damodar River",
    sourceFactIds: ["geo-phy-001-cp004-chotanagpur-damodar"],
  },
  {
    id: "central-rivers",
    subject: "Central Highlands",
    fact: "The Chambal, Sind, Betwa and Ken generally flow from southwest to northeast across this region.",
    shortFact: "Chambal, Sind, Betwa and Ken flow southwest to northeast",
    sourceFactIds: ["geo-phy-001-cp004-central-highlands-rivers"],
  },
]);

export const GEO_PHY_001_CP004_DECCAN_FACTS_V1: readonly GeoPhy001Cp004FactRow[] = Object.freeze([
  {
    id: "deccan-south-narmada",
    subject: "Deccan Plateau",
    fact: "It is a triangular landmass lying south of the Narmada River.",
    shortFact: "triangular plateau south of the Narmada River",
    sourceFactIds: ["geo-phy-001-cp004-deccan-south-narmada"],
  },
  {
    id: "deccan-satpura",
    subject: "Deccan Plateau",
    fact: "The Satpura Range forms the broad northern base of the plateau.",
    shortFact: "Satpura Range along its broad northern base",
    sourceFactIds: ["geo-phy-001-cp004-deccan-satpura"],
  },
  {
    id: "deccan-slope",
    subject: "Deccan Plateau",
    fact: "It is higher in the west and slopes gently eastwards.",
    shortFact: "higher in the west and slopes eastwards",
    sourceFactIds: ["geo-phy-001-cp004-deccan-slope"],
  },
  {
    id: "deccan-ne-extension",
    subject: "Deccan Plateau",
    fact: "Its northeastern extension includes the Meghalaya and Karbi-Anglong plateaus and the North Cachar Hills.",
    shortFact: "northeastern extension includes Meghalaya and Karbi-Anglong plateaus and North Cachar Hills",
    sourceFactIds: ["geo-phy-001-cp004-deccan-northeast-extension"],
  },
  {
    id: "garo-khasi-jaintia",
    subject: "Northeastern plateau extension",
    fact: "The Garo, Khasi and Jaintia Hills are prominent ranges in this northeastern extension from west to east.",
    shortFact: "Garo, Khasi and Jaintia Hills occur from west to east",
    sourceFactIds: ["geo-phy-001-cp004-garo-khasi-jaintia"],
  },
]);

export type GeoPhy001Cp004GhatRow = {
  id: "western" | "eastern";
  name: string;
  edge: string;
  continuity: string;
  height: string;
  extra: string;
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP004_GHATS_V1: readonly GeoPhy001Cp004GhatRow[] = Object.freeze([
  {
    id: "western",
    name: "Western Ghats",
    edge: "western edge of the Deccan Plateau",
    continuity: "continuous and crossed mainly through passes",
    height: "generally higher, with an average elevation of about 900–1,600 metres",
    extra: "run roughly parallel to the western coast",
    sourceFactIds: ["geo-phy-001-cp004-western-ghats-edge", "geo-phy-001-cp004-western-ghats-continuity", "geo-phy-001-cp004-western-ghats-height"],
  },
  {
    id: "eastern",
    name: "Eastern Ghats",
    edge: "eastern edge of the Deccan Plateau",
    continuity: "discontinuous and irregular because rivers cut through them",
    height: "generally lower, with an average elevation of about 600 metres",
    extra: "extend from the Mahanadi Valley towards the Nilgiris",
    sourceFactIds: ["geo-phy-001-cp004-eastern-ghats-edge", "geo-phy-001-cp004-eastern-ghats-continuity", "geo-phy-001-cp004-eastern-ghats-height"],
  },
]);
