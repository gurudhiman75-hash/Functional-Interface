export const PGK_001_CP001_SOURCE_IDS = Object.freeze({
  knowPunjab: "GOV-PUNJAB-KNOW-PUNJAB",
  atAGlance2022: "GOV-PUNJAB-AT-A-GLANCE-2022",
  psebAgriculture8: "PSEB-AGRICULTURE-CLASS8-NURSERY",
  bsiShishamNdf: "GOV-INDIA-BSI-DALBERGIA-SISSOO-NDF",
  punjabOfficialPaper2024: "GOV-PUNJAB-MRSAFPI-QUESTION-PAPER-2024",
  sutlejDprBlackbuck: "GOV-HP-SUTLEJ-DPR-PUNJAB-BLACKBUCK",
  goshawkAuthority: "CZA-BNHS-NORTHERN-GOSHAWK-PUNJAB",
  nfdbStateAquatic: "GOV-INDIA-NFDB-STATE-FISHES-AQUATIC-ANIMALS",
} as const);

export const PGK_001_CP001_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP001_SOURCE_IDS.knowPunjab]: {
    title: "Know Punjab — Government of Punjab",
    url: "https://punjab.gov.in/know-punjab/",
    authority: "Government of Punjab",
  },
  [PGK_001_CP001_SOURCE_IDS.atAGlance2022]: {
    title: "Punjab at a Glance 2022",
    url: "https://punjab.gov.in/wp-content/uploads/2023/10/Punjab-at-Glance-2022-Punjabi-English.pdf",
    authority: "Government of Punjab",
  },
  [PGK_001_CP001_SOURCE_IDS.psebAgriculture8]: {
    title: "Agriculture Class 8 — Punjab School Education Board",
    url: "https://psebfiles.s3.ap-south-1.amazonaws.com/media/1724151829_Agriculture%208%20%28E%29.pdf",
    authority: "Punjab School Education Board",
  },
  [PGK_001_CP001_SOURCE_IDS.bsiShishamNdf]: {
    title: "Non-Detriment Findings of Dalbergia sissoo in India",
    url: "https://bsi.gov.in/uploads/documents/Non-Detriment%20Findings%20%28NDFs%29/NDF%20report%20-%20Dalbergia%20sissoo-low-final%20%281%29.pdf",
    authority: "Botanical Survey of India, Government of India",
  },
  [PGK_001_CP001_SOURCE_IDS.punjabOfficialPaper2024]: {
    title: "Official Punjab Government Question Paper 2024 — MRSAFPI",
    url: "https://www.mrsafpi.punjab.gov.in/wp-content/uploads/2024/02/Question-Paper-2024-Code-A.pdf",
    authority: "Government of Punjab",
  },
  [PGK_001_CP001_SOURCE_IDS.sutlejDprBlackbuck]: {
    title: "Sutlej River Basin Detailed Project Report — Wildlife section",
    url: "https://hpforest.gov.in/storage/files/1/pdf/DPR/Satluj/Sutlej%20Volume-I.pdf",
    authority: "Forest Department, Government of Himachal Pradesh",
  },
  [PGK_001_CP001_SOURCE_IDS.goshawkAuthority]: {
    title: "Northern Goshawk state-bird authority",
    authority: "Central Zoo Authority / Bombay Natural History Society",
    locator: "Government of Punjab declaration dated 18-09-2015",
  },
  [PGK_001_CP001_SOURCE_IDS.nfdbStateAquatic]: {
    title: "State Fishes and Aquatic Animals of India",
    url: "https://nfdb.gov.in/PDF/E%20Publications/15_State_fishes_and_aquatic_animals_of_India_english_final_48%20pages.pdf",
    authority: "National Fisheries Development Board, Government of India",
  },
} as const);

export type Pgk001Cp001FactScope =
  | "CURRENT_PUNJAB"
  | "UNDIVIDED_PUNJAB"
  | "POST_1966_PUNJAB";

export type Pgk001Cp001Freshness = "IMMUTABLE" | "SLOW_MUTABLE" | "VERSIONED";

export type Pgk001Cp001FactRow = {
  id: string;
  fact: string;
  shortFact: string;
  scope: Pgk001Cp001FactScope;
  freshness: Pgk001Cp001Freshness;
  asOf?: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const S = PGK_001_CP001_SOURCE_IDS;

export const PGK_001_CP001_FACTS_V1: readonly Pgk001Cp001FactRow[] = Object.freeze([
  {
    id: "name-etymology",
    fact: "The name Punjab is commonly explained from Punj (five) and Aab (water), giving the sense 'land of five rivers'.",
    shortFact: "Punjab means land of five rivers",
    scope: "UNDIVIDED_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-name-punj-aab"],
  },
  {
    id: "historical-five-rivers",
    fact: "The five rivers named in the Punjab identity are Sutlej, Beas, Ravi, Chenab and Jhelum.",
    shortFact: "Historical five: Sutlej, Beas, Ravi, Chenab, Jhelum",
    scope: "UNDIVIDED_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-five-rivers"],
  },
  {
    id: "current-three-rivers",
    fact: "Of the traditional five Punjab rivers, Sutlej, Beas and Ravi flow through present-day Indian Punjab; Chenab and Jhelum are not rivers of the present Indian state.",
    shortFact: "Present Indian Punjab: Sutlej, Beas and Ravi",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-current-three-rivers"],
  },
  {
    id: "traditional-regions",
    fact: "Punjab is traditionally divided into the three broad regions Majha, Doaba and Malwa.",
    shortFact: "Traditional regions: Majha, Doaba, Malwa",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-regions"],
  },
  {
    id: "area",
    fact: "The geographical area of Punjab is 50,362 square kilometres.",
    shortFact: "Area: 50,362 sq km",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab, S.atAGlance2022],
    sourceFactIds: ["pgk-001-cp001-area-50362"],
  },
  {
    id: "latitude-span",
    fact: "The Punjab government profile gives the state's latitude span as about 29.30°N to 32.32°N.",
    shortFact: "Latitude: 29.30°N–32.32°N",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-latitude"],
  },
  {
    id: "longitude-span",
    fact: "The Punjab government profile gives the state's longitude span as about 73.55°E to 76.50°E.",
    shortFact: "Longitude: 73.55°E–76.50°E",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-longitude"],
  },
  {
    id: "west-border",
    fact: "Punjab is bounded by Pakistan on the west.",
    shortFact: "West: Pakistan",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-border-west"],
  },
  {
    id: "north-border",
    fact: "Punjab is bounded by Jammu and Kashmir on the north.",
    shortFact: "North: Jammu and Kashmir",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-border-north"],
  },
  {
    id: "northeast-border",
    fact: "Punjab is bounded by Himachal Pradesh on the northeast.",
    shortFact: "Northeast: Himachal Pradesh",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-border-northeast"],
  },
  {
    id: "south-border",
    fact: "Punjab is bounded by Haryana and Rajasthan on the south.",
    shortFact: "South: Haryana and Rajasthan",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-border-south"],
  },
  {
    id: "official-language",
    fact: "Punjabi is the official language of Punjab.",
    shortFact: "Official language: Punjabi",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-official-language"],
  },
  {
    id: "gurmukhi-script",
    fact: "Punjabi is written in the Gurmukhi script in the Punjab government profile.",
    shortFact: "Punjabi script: Gurmukhi",
    scope: "CURRENT_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-gurmukhi"],
  },
  {
    id: "capital-chandigarh",
    fact: "Chandigarh serves as the capital of Punjab.",
    shortFact: "Capital: Chandigarh",
    scope: "CURRENT_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-capital"],
  },
  {
    id: "chandigarh-joint-capital",
    fact: "Chandigarh is a Union Territory and serves as the capital of both Punjab and Haryana.",
    shortFact: "Chandigarh: UT and joint capital of Punjab and Haryana",
    scope: "POST_1966_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-chandigarh-joint-capital"],
  },
  {
    id: "reorganisation-1966",
    fact: "The reorganisation that created the present Punjab-Haryana arrangement took effect on 1 November 1966; Chandigarh became a Union Territory and the capital of both states.",
    shortFact: "Reorganisation reference date: 1 November 1966",
    scope: "POST_1966_PUNJAB",
    freshness: "IMMUTABLE",
    sourceIds: [S.knowPunjab],
    sourceFactIds: ["pgk-001-cp001-reorganisation-1966"],
  },
  {
    id: "district-count-2022",
    fact: "Punjab at a Glance 2022 records 23 districts in Punjab.",
    shortFact: "23 districts (2022 official snapshot)",
    scope: "CURRENT_PUNJAB",
    freshness: "VERSIONED",
    asOf: "2022",
    sourceIds: [S.atAGlance2022],
    sourceFactIds: ["pgk-001-cp001-districts-2022"],
  },
  {
    id: "state-animal-blackbuck",
    fact: "Blackbuck is the state animal of Punjab.",
    shortFact: "State animal: Blackbuck",
    scope: "CURRENT_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.punjabOfficialPaper2024, S.sutlejDprBlackbuck],
    sourceFactIds: ["pgk-001-cp001-state-animal-blackbuck"],
  },
  {
    id: "state-tree-shisham",
    fact: "Shisham (Indian Rosewood; Dalbergia sissoo), also called Tahli in Punjabi, is the state tree of Punjab.",
    shortFact: "State tree: Shisham / Tahli (Dalbergia sissoo)",
    scope: "CURRENT_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.psebAgriculture8, S.bsiShishamNdf],
    sourceFactIds: ["pgk-001-cp001-state-tree-shisham"],
  },
  {
    id: "state-bird-northern-goshawk",
    fact: "The Northern Goshawk is the state bird of Punjab; BNHS records the Government of Punjab declaration date as 18 September 2015.",
    shortFact: "State bird: Northern Goshawk",
    scope: "CURRENT_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.goshawkAuthority],
    sourceFactIds: ["pgk-001-cp001-state-bird-northern-goshawk"],
  },
  {
    id: "state-aquatic-indus-dolphin",
    fact: "The Indus River dolphin (Platanista minor) is the state aquatic animal of Punjab; it was declared by the Government of Punjab in 2019.",
    shortFact: "State aquatic animal: Indus River dolphin",
    scope: "CURRENT_PUNJAB",
    freshness: "SLOW_MUTABLE",
    sourceIds: [S.nfdbStateAquatic],
    sourceFactIds: ["pgk-001-cp001-state-aquatic-indus-dolphin"],
  },
]);

export const PGK_001_CP001_FACT_BY_ID = new Map(
  PGK_001_CP001_FACTS_V1.map((fact) => [fact.id, fact] as const),
);
