export const PGK_001_CP007_SOURCE_IDS = Object.freeze({
  sapccPunjab: "MOEFCC-PUNJAB-SAPCC-FOREST-WILDLIFE",
  ramsarPunjab2024: "MOEFCC-RAMSAR-PUNJAB-2024",
  ramsarNewPunjabSites: "RAMSAR-PUNJAB-BEAS-NANGAL-KESHOPUR",
  kanjliRis: "RAMSAR-KANJLI-RIS",
  paList: "MOEFCC-PUNJAB-WILDLIFE-SANCTUARIES",
} as const);


export const PGK_001_CP007_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP007_SOURCE_IDS.sapccPunjab]: {
    authority: "Ministry of Environment, Forest and Climate Change, Government of India",
    title: "Punjab State Action Plan for Climate Change",
    url: "https://www.moef.gov.in/uploads/2017/09/Punjab.pdf",
  },
  [PGK_001_CP007_SOURCE_IDS.ramsarPunjab2024]: {
    authority: "Ministry of Environment, Forest and Climate Change, Government of India",
    title: "Ramsar Sites of India as on 24 January 2024",
    url: "https://www.moef.gov.in/uploads/2024/03/80-Ramsar-sites-of-India-31-01-2024.pdf",
  },
  [PGK_001_CP007_SOURCE_IDS.ramsarNewPunjabSites]: {
    authority: "Convention on Wetlands (Ramsar)",
    title: "India designates ten wetlands for World Wetlands Day",
    url: "https://www.ramsar.org/news/india-designates-ten-wetlands-world-wetlands-day",
  },
  [PGK_001_CP007_SOURCE_IDS.kanjliRis]: {
    authority: "Ramsar Sites Information Service",
    title: "Kanjli — Ramsar Information Sheet",
    url: "https://rsis.ramsar.org/RISapp/files/RISrep/IN1160RIS.pdf",
  },
  [PGK_001_CP007_SOURCE_IDS.paList]: {
    authority: "Wildlife Institute of India EIACP / ENVIS",
    title: "Wildlife Sanctuaries of India — Punjab",
    url: "https://wiienvis.nic.in/Database/wls_8230.aspx",
  },
} as const);
export type Pgk001Cp007ForestFact = Readonly<{
  id: string;
  formation: string;
  relation: string;
  locations: readonly string[];
}>;

export const PGK_001_CP007_FOREST_FACTS: readonly Pgk001Cp007ForestFact[] = Object.freeze([
  { id: "forest-tropical-subtropical", formation: "Punjab forests", relation: "mainly tropical and sub-tropical", locations: ["Punjab"] },
  { id: "forest-chir-pine", formation: "Chir pine forests", relation: "Shivalik higher foothill forest", locations: ["Pathankot", "Gurdaspur", "Hoshiarpur"] },
  { id: "forest-bamboo", formation: "Bamboo forests", relation: "Shivalik forest pockets", locations: ["Dasuya", "Hoshiarpur", "Gurdaspur"] },
  { id: "forest-scrub", formation: "Scrub forests", relation: "Shivalik hills and various Birs", locations: ["Shivalik belt", "Bir tracts"] },
  { id: "forest-bir", formation: "Bir forests", relation: "plain forest tracts", locations: ["Patiala"] },
  { id: "forest-mand", formation: "Mand forests", relation: "riverine/wetland-side forest tracts", locations: ["Amritsar", "Tarn Taran", "Kapurthala"] },
]);

export type Pgk001Cp007ProtectedAreaFact = Readonly<{
  id: string;
  name: string;
  category: "Wildlife Sanctuary" | "Community Reserve" | "Conservation Reserve";
  districtOrSetting: string;
}>;

export const PGK_001_CP007_PROTECTED_AREAS: readonly Pgk001Cp007ProtectedAreaFact[] = Object.freeze([
  { id: "wls-abohar", name: "Abohar", category: "Wildlife Sanctuary", districtOrSetting: "south-western Punjab / Abohar tract" },
  { id: "wls-harike", name: "Harike", category: "Wildlife Sanctuary", districtOrSetting: "Beas-Sutlej confluence" },
  { id: "wls-nangal", name: "Nangal", category: "Wildlife Sanctuary", districtOrSetting: "Rupnagar / Shivalik foothills" },
  { id: "wls-takhni-rehampur", name: "Takhni-Rehampur", category: "Wildlife Sanctuary", districtOrSetting: "Hoshiarpur" },
  { id: "wls-jhajjar-bacholi", name: "Jhajjar-Bacholi", category: "Wildlife Sanctuary", districtOrSetting: "Rupnagar" },
  { id: "wls-kathlaur-kushlian", name: "Kathlaur-Kaushlian", category: "Wildlife Sanctuary", districtOrSetting: "Pathankot-Gurdaspur belt" },
  { id: "wls-bir-moti-bagh", name: "Bir Moti Bagh", category: "Wildlife Sanctuary", districtOrSetting: "Patiala" },
  { id: "reserve-keshopur-miani", name: "Keshopur-Miani", category: "Community Reserve", districtOrSetting: "Gurdaspur" },
  { id: "reserve-beas", name: "Beas", category: "Conservation Reserve", districtOrSetting: "Beas River" },
]);

export type Pgk001Cp007WetlandFact = Readonly<{
  id: string;
  name: string;
  relation: string;
  location: string;
  protectedCategory?: string;
}>;

export const PGK_001_CP007_WETLAND_FACTS: readonly Pgk001Cp007WetlandFact[] = Object.freeze([
  { id: "wetland-harike", name: "Harike", relation: "Beas-Sutlej confluence", location: "Tarn Taran/Ferozepur/Kapurthala belt", protectedCategory: "Ramsar Site / Wildlife Sanctuary" },
  { id: "wetland-kanjli", name: "Kanjli", relation: "Kali Bein", location: "Kapurthala", protectedCategory: "Ramsar Site" },
  { id: "wetland-ropar", name: "Ropar", relation: "Sutlej", location: "Rupnagar", protectedCategory: "Ramsar Site" },
  { id: "wetland-beas", name: "Beas Conservation Reserve", relation: "protected stretch of the Beas River", location: "Punjab Beas river corridor", protectedCategory: "Ramsar Site / Conservation Reserve" },
  { id: "wetland-keshopur", name: "Keshopur-Miani", relation: "marshes, ponds and agricultural wetland mosaic", location: "Gurdaspur", protectedCategory: "Ramsar Site / Community Reserve" },
  { id: "wetland-nangal", name: "Nangal", relation: "human-made reservoir in the Bhakra-Nangal system", location: "Rupnagar / Shivalik foothills", protectedCategory: "Ramsar Site / Wildlife Sanctuary" },
]);

export const PGK_001_CP007_SPECIES_RELATIONS = Object.freeze([
  { id: "species-indus-dolphin-beas", species: "Indus river dolphin", relation: "Beas Conservation Reserve" },
  { id: "species-blackbuck-abohar", species: "Blackbuck", relation: "Abohar Wildlife Sanctuary" },
  { id: "species-pangolin-nangal", species: "Indian pangolin", relation: "Nangal Wildlife Sanctuary" },
] as const);

export const PGK_001_CP007_FACT_IDS = Object.freeze([
  ...PGK_001_CP007_FOREST_FACTS.map((row) => row.id),
  ...PGK_001_CP007_PROTECTED_AREAS.map((row) => row.id),
  ...PGK_001_CP007_WETLAND_FACTS.map((row) => row.id),
  ...PGK_001_CP007_SPECIES_RELATIONS.map((row) => row.id),
]);
