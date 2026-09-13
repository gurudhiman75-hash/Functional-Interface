export const GEO_PHY_001_CP003_SOURCE_ID = "NCERT-CONTEMPORARY-INDIA-I-PHYSICAL-FEATURES";

export type GeoPhy001Cp003RegionalPlain = {
  id: string;
  name: string;
  extent: string;
  definingFact: string;
  sourceFactIds: readonly string[];
};

export type GeoPhy001Cp003ReliefBelt = {
  id: string;
  name: string;
  position: string;
  definingFact: string;
  secondaryFact: string;
  sourceFactIds: readonly string[];
};

export const GEO_PHY_001_CP003_FOUNDATION_FACTS_V1 = Object.freeze([
  {
    id: "formation",
    fact: "The Northern Plains were formed by the interplay of the Indus, Ganga and Brahmaputra river systems and their tributaries depositing alluvium over a vast basin.",
    sourceFactIds: ["geo-phy-001-cp003-northern-plains-formation"],
  },
  {
    id: "alluvial",
    fact: "The Northern Plains are formed of alluvial soil deposited over millions of years by river systems descending from the Himalayas.",
    sourceFactIds: ["geo-phy-001-cp003-northern-plains-alluvium"],
  },
  {
    id: "fertility",
    fact: "The Northern Plains are agriculturally productive because of fertile alluvial soils, adequate water supply and a favourable climate.",
    sourceFactIds: ["geo-phy-001-cp003-northern-plains-fertility"],
  },
  {
    id: "flat-relief",
    fact: "Although the Northern Plains appear flat, relief differences allow them to be divided into Bhabar, Terai, Bhangar and Khadar belts.",
    sourceFactIds: ["geo-phy-001-cp003-northern-plains-relief-belts"],
  },
  {
    id: "three-sections",
    fact: "The Northern Plains are commonly divided into the Punjab Plains, Ganga Plain and Brahmaputra Plain.",
    sourceFactIds: ["geo-phy-001-cp003-regional-divisions"],
  },
  {
    id: "depositional",
    fact: "The Northern Plains are a depositional landform built by river-borne sediments rather than an old crystalline tableland.",
    sourceFactIds: ["geo-phy-001-cp003-depositional-character"],
  },
] as const);

export const GEO_PHY_001_CP003_REGIONAL_PLAINS_V1: readonly GeoPhy001Cp003RegionalPlain[] = Object.freeze([
  {
    id: "punjab",
    name: "Punjab Plains",
    extent: "the western part of the Northern Plains",
    definingFact: "formed largely by the Indus and its tributaries and characterised by doabs",
    sourceFactIds: ["geo-phy-001-cp003-punjab-plains"],
  },
  {
    id: "ganga",
    name: "Ganga Plain",
    extent: "between the Ghaggar and Teesta rivers",
    definingFact: "extends across a broad east–west belt and is drained by the Ganga and its tributaries",
    sourceFactIds: ["geo-phy-001-cp003-ganga-plain"],
  },
  {
    id: "brahmaputra",
    name: "Brahmaputra Plain",
    extent: "primarily in Assam",
    definingFact: "forms the easternmost major regional section of the Northern Plains",
    sourceFactIds: ["geo-phy-001-cp003-brahmaputra-plain"],
  },
]);

export const GEO_PHY_001_CP003_RELIEF_BELTS_V1: readonly GeoPhy001Cp003ReliefBelt[] = Object.freeze([
  {
    id: "bhabar",
    name: "Bhabar",
    position: "a narrow belt along the foothills of the Shiwaliks",
    definingFact: "pebbles are deposited by streams and many streams disappear into the porous surface",
    secondaryFact: "lies immediately south of the Shiwaliks and north of the Terai",
    sourceFactIds: ["geo-phy-001-cp003-bhabar"],
  },
  {
    id: "terai",
    name: "Terai",
    position: "south of the Bhabar belt",
    definingFact: "streams re-emerge, creating a wet, swampy and marshy region",
    secondaryFact: "was historically thickly forested and rich in wildlife",
    sourceFactIds: ["geo-phy-001-cp003-terai"],
  },
  {
    id: "bhangar",
    name: "Bhangar",
    position: "on older, slightly elevated alluvial terraces above the floodplains",
    definingFact: "represents older alluvium and commonly contains calcareous deposits known as kankar",
    secondaryFact: "is less frequently renewed by present-day river floods than Khadar",
    sourceFactIds: ["geo-phy-001-cp003-bhangar"],
  },
  {
    id: "khadar",
    name: "Khadar",
    position: "in the newer floodplain deposits along rivers",
    definingFact: "represents newer alluvium renewed almost every year by floods",
    secondaryFact: "is generally very fertile because fresh alluvium is deposited repeatedly",
    sourceFactIds: ["geo-phy-001-cp003-khadar"],
  },
]);
