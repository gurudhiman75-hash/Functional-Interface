export const PGK_001_CP006_SOURCE_IDS = Object.freeze({
  knowPunjab: "GOV-PUNJAB-KNOW-PUNJAB-CLIMATE",
  psebClass9: "PSEB-SOCIAL-SCIENCE-IX-PLAINS-SOILS",
  pauSouthWest: "PAU-SOUTH-WESTERN-AGROCLIMATIC-ZONE",
  soilWaterRti: "GOV-PUNJAB-SOIL-WATER-CONSERVATION-RTI",
  agriculturePolicy: "GOV-PUNJAB-AGRICULTURE-POLICY-NATURAL-RESOURCES",
} as const);


export const PGK_001_CP006_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP006_SOURCE_IDS.knowPunjab]: {
    authority: "Government of Punjab",
    title: "Know Punjab — Climate",
    url: "https://punjab.gov.in/know-punjab/",
  },
  [PGK_001_CP006_SOURCE_IDS.psebClass9]: {
    authority: "Punjab School Education Board",
    title: "Social Science IX Part I",
    url: "https://static.pseb.ac.in/media/1670479881_Social%20Science-9%28english%29%20Part-I.pdf",
  },
  [PGK_001_CP006_SOURCE_IDS.pauSouthWest]: {
    authority: "Punjab Agricultural University",
    title: "Regional Research Station, Bathinda — South-Western Zone",
    url: "https://pau.edu/outstations/index.php?DO=viewHomePage&_act=manageOutstationData&intLinkID=3",
  },
  [PGK_001_CP006_SOURCE_IDS.soilWaterRti]: {
    authority: "Department of Soil & Water Conservation, Government of Punjab",
    title: "RTI Manual — Organisation and Functions",
    url: "https://punjab.gov.in/wp-content/uploads/2021/10/rti_manual.pdf",
  },
  [PGK_001_CP006_SOURCE_IDS.agriculturePolicy]: {
    authority: "Government of Punjab",
    title: "Agriculture Policy for Punjab",
    url: "https://punjab.gov.in/wp-content/uploads/2019/04/Agriculture-policy-of-punjab.pdf",
  },
} as const);
export const PGK_001_CP006_CLIMATE = Object.freeze({
  summer: Object.freeze({ start: "mid-April", end: "end-June" }),
  monsoon: Object.freeze({ start: "early July", end: "end-September" }),
  winterStart: "October",
  colderFrom: "December",
  rainfallGradient: "heavier toward the Himalayan/Shivalik foothill side and generally lower away from the hills toward the southwest",
  temperaturePattern: "very hot summers and cold winters",
});

export type Pgk001Cp006SoilFact = Readonly<{
  id: string;
  term: string;
  description: string;
  aliases?: readonly string[];
}>;

export const PGK_001_CP006_SOILS: readonly Pgk001Cp006SoilFact[] = Object.freeze([
  {
    id: "alluvial-dominant",
    term: "Alluvial soil",
    description: "The broad Punjab plains are predominantly alluvial in origin.",
  },
  {
    id: "bangar-old-alluvium",
    term: "Bangar",
    description: "Older alluvium occurring on higher ground away from active annual flooding.",
  },
  {
    id: "khadar-new-alluvium",
    term: "Khadar",
    description: "Newer alluvium in low-lying river floodplains that can receive fresh sediment during floods.",
    aliases: Object.freeze(["Bet", "Bela"]),
  },
  {
    id: "southwest-alkaline",
    term: "South-western alkaline soils",
    description: "Parts of south-western Punjab have predominantly alkaline soil reaction, often with pH above 7.5.",
  },
  {
    id: "southwest-brackish-water",
    term: "Brackish/saline sub-soil water",
    description: "Parts of south-western Punjab have brackish or saline sub-soil water that may be unsuitable for direct irrigation.",
  },
]);

export type Pgk001Cp006ResourceProblem = Readonly<{
  id: string;
  problem: string;
  relation: string;
}>;

export const PGK_001_CP006_RESOURCE_PROBLEMS: readonly Pgk001Cp006ResourceProblem[] = Object.freeze([
  { id: "soil-erosion", problem: "Soil erosion", relation: "removal of fertile topsoil, especially where runoff is strong" },
  { id: "salt-affected-soils", problem: "Salt-affected soils", relation: "excess salts or alkalinity reduce soil productivity" },
  { id: "waterlogging", problem: "Waterlogging", relation: "water table rises close to the surface and reduces aeration of the root zone" },
  { id: "groundwater-overuse", problem: "Groundwater over-extraction", relation: "persistent pumping can lower groundwater levels" },
  { id: "brackish-groundwater", problem: "Brackish groundwater", relation: "poor-quality groundwater can limit safe irrigation use" },
]);

export type Pgk001Cp006ConservationFact = Readonly<{
  id: string;
  measure: string;
  purpose: string;
}>;

export const PGK_001_CP006_CONSERVATION: readonly Pgk001Cp006ConservationFact[] = Object.freeze([
  { id: "land-levelling", measure: "Land levelling", purpose: "improves uniform water distribution and reduces avoidable irrigation loss" },
  { id: "field-drainage", measure: "Field drainage", purpose: "removes excess water and helps control waterlogging" },
  { id: "rainwater-harvesting", measure: "Rainwater harvesting", purpose: "stores runoff for later use and reduces pressure on other water sources" },
  { id: "watershed-treatment", measure: "Watershed treatment", purpose: "slows runoff, reduces erosion and improves local water conservation" },
  { id: "drip-irrigation", measure: "Drip irrigation", purpose: "applies water close to the root zone and improves water-use efficiency" },
  { id: "contour-bunding", measure: "Contour bunding", purpose: "slows runoff on sloping land and reduces soil erosion" },
]);

export const PGK_001_CP006_FACT_IDS = Object.freeze([
  "summer-season",
  "monsoon-season",
  "winter-season",
  "rainfall-gradient",
  "temperature-extremes",
  ...PGK_001_CP006_SOILS.map((row) => row.id),
  ...PGK_001_CP006_RESOURCE_PROBLEMS.map((row) => row.id),
  ...PGK_001_CP006_CONSERVATION.map((row) => row.id),
]);
