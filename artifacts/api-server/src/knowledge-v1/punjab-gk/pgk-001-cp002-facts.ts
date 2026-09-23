export const PGK_001_CP002_SOURCE_IDS = Object.freeze({
  atGlance2022: "GOV-PUNJAB-AT-A-GLANCE-2022",
  epos2026: "GOV-PUNJAB-EPOS-DISTRICT-LIST-2026",
  civilList2020: "GOV-PUNJAB-CIVIL-LIST-DIVISIONS-2020",
  moga: "GOV-PUNJAB-MOGA-DISTRICT-HISTORY",
  malerkotla: "NIC-PUNJAB-MALERKOTLA-ABOUT",
  barnala: "NIC-PUNJAB-BARNALA-HISTORY",
  tarnTaran: "NIC-PUNJAB-TARN-TARAN-DEMOGRAPHY",
  pathankot: "NIC-PUNJAB-PATHANKOT-ABOUT",
  fazilka: "NIC-PUNJAB-FAZILKA-HOW-TO-REACH",
  sasNagar: "NIC-PUNJAB-SAS-NAGAR-HISTORY",
} as const);


export const PGK_001_CP002_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP002_SOURCE_IDS.atGlance2022]: {
    authority: "Government of Punjab",
    title: "Punjab at a Glance 2022",
    url: "https://punjab.gov.in/wp-content/uploads/2023/10/Punjab-at-Glance-2022-Punjabi-English.pdf",
  },
  [PGK_001_CP002_SOURCE_IDS.epos2026]: {
    authority: "Department of Food, Civil Supplies & Consumer Affairs, Government of Punjab",
    title: "AePDS Punjab — Districts in Punjab",
    url: "https://www.epos.punjab.gov.in/",
  },
  [PGK_001_CP002_SOURCE_IDS.civilList2020]: {
    authority: "Department of Personnel, Government of Punjab",
    title: "Civil List as on 17 August 2020",
    url: "https://punjab.gov.in/wp-content/uploads/2020/04/Civil-List-as-on-17-08-2020_Compressed.pdf",
  },
  [PGK_001_CP002_SOURCE_IDS.moga]: {
    authority: "District Moga, Government of Punjab",
    title: "History",
    url: "https://moga.nic.in/history/",
  },
  [PGK_001_CP002_SOURCE_IDS.malerkotla]: {
    authority: "District Malerkotla, Government of Punjab",
    title: "About District",
    url: "https://malerkotla.nic.in/about-district/",
  },
  [PGK_001_CP002_SOURCE_IDS.barnala]: {
    authority: "District Barnala, Government of Punjab",
    title: "About District / History",
    url: "https://barnala.gov.in/about-district/history/",
    supportingUrls: Object.freeze(["https://barnala.gov.in/about-district/"]),
  },
  [PGK_001_CP002_SOURCE_IDS.tarnTaran]: {
    authority: "District Tarn Taran, Government of Punjab",
    title: "History / About District",
    url: "https://tarntaran.nic.in/history/",
    supportingUrls: Object.freeze(["https://tarntaran.nic.in/"]),
  },
  [PGK_001_CP002_SOURCE_IDS.pathankot]: {
    authority: "District Pathankot, Government of Punjab",
    title: "About District",
    url: "https://pathankot.nic.in/about-district/",
  },
  [PGK_001_CP002_SOURCE_IDS.fazilka]: {
    authority: "District Fazilka, Government of Punjab",
    title: "How to Reach — district formation note",
    url: "https://fazilka.nic.in/how-to-reach/",
  },
  [PGK_001_CP002_SOURCE_IDS.sasNagar]: {
    authority: "District S.A.S. Nagar, Government of Punjab",
    title: "History",
    url: "https://sasnagar.nic.in/history/",
  },
} as const);
export type Pgk001Cp002DistrictRow = Readonly<{
  id: string;
  district: string;
  headquarters: string;
  division: "Faridkot" | "Ferozepur" | "Jalandhar" | "Patiala" | "Rupnagar";
  aliases?: readonly string[];
}>;

export const PGK_001_CP002_DIVISIONS_V1 = Object.freeze([
  "Faridkot",
  "Ferozepur",
  "Jalandhar",
  "Patiala",
  "Rupnagar",
] as const);

export const PGK_001_CP002_DISTRICTS_V1: readonly Pgk001Cp002DistrictRow[] = Object.freeze([
  { id: "amritsar", district: "Amritsar", headquarters: "Amritsar", division: "Jalandhar" },
  { id: "barnala", district: "Barnala", headquarters: "Barnala", division: "Patiala" },
  { id: "bathinda", district: "Bathinda", headquarters: "Bathinda", division: "Faridkot" },
  { id: "faridkot", district: "Faridkot", headquarters: "Faridkot", division: "Faridkot" },
  { id: "fatehgarh-sahib", district: "Fatehgarh Sahib", headquarters: "Fatehgarh Sahib", division: "Patiala" },
  { id: "fazilka", district: "Fazilka", headquarters: "Fazilka", division: "Ferozepur" },
  { id: "ferozepur", district: "Ferozepur", headquarters: "Ferozepur", division: "Ferozepur", aliases: ["Firozpur"] },
  { id: "gurdaspur", district: "Gurdaspur", headquarters: "Gurdaspur", division: "Jalandhar" },
  { id: "hoshiarpur", district: "Hoshiarpur", headquarters: "Hoshiarpur", division: "Jalandhar" },
  { id: "jalandhar", district: "Jalandhar", headquarters: "Jalandhar", division: "Jalandhar" },
  { id: "kapurthala", district: "Kapurthala", headquarters: "Kapurthala", division: "Jalandhar" },
  { id: "ludhiana", district: "Ludhiana", headquarters: "Ludhiana", division: "Patiala" },
  { id: "malerkotla", district: "Malerkotla", headquarters: "Malerkotla", division: "Patiala" },
  { id: "mansa", district: "Mansa", headquarters: "Mansa", division: "Faridkot" },
  { id: "moga", district: "Moga", headquarters: "Moga", division: "Ferozepur" },
  { id: "pathankot", district: "Pathankot", headquarters: "Pathankot", division: "Jalandhar" },
  { id: "patiala", district: "Patiala", headquarters: "Patiala", division: "Patiala" },
  { id: "rupnagar", district: "Rupnagar", headquarters: "Rupnagar", division: "Rupnagar", aliases: ["Ropar", "Roopnagar"] },
  { id: "sas-nagar", district: "Sahibzada Ajit Singh Nagar", headquarters: "Mohali", division: "Rupnagar", aliases: ["SAS Nagar", "Mohali"] },
  { id: "sangrur", district: "Sangrur", headquarters: "Sangrur", division: "Patiala" },
  { id: "sbs-nagar", district: "Shaheed Bhagat Singh Nagar", headquarters: "Nawanshahr", division: "Rupnagar", aliases: ["SBS Nagar", "Nawanshahr"] },
  { id: "sri-muktsar-sahib", district: "Sri Muktsar Sahib", headquarters: "Sri Muktsar Sahib", division: "Ferozepur", aliases: ["Muktsar"] },
  { id: "tarn-taran", district: "Tarn Taran", headquarters: "Tarn Taran", division: "Jalandhar", aliases: ["Tarn Taran Sahib"] },
]);

export type Pgk001Cp002FormationFact = Readonly<{
  id: string;
  district: string;
  dateText: string;
  year: number;
  parent: string;
  ordinal?: string;
  sourceId: string;
}>;

export const PGK_001_CP002_FORMATION_FACTS_V1: readonly Pgk001Cp002FormationFact[] = Object.freeze([
  { id: "moga-1995", district: "Moga", dateText: "24 November 1995", year: 1995, parent: "Faridkot", sourceId: PGK_001_CP002_SOURCE_IDS.moga },
  { id: "sas-nagar-2006", district: "Sahibzada Ajit Singh Nagar", dateText: "14 April 2006", year: 2006, parent: "Ropar and Patiala", ordinal: "18th", sourceId: PGK_001_CP002_SOURCE_IDS.sasNagar },
  { id: "tarn-taran-2006", district: "Tarn Taran", dateText: "16 June 2006", year: 2006, parent: "Amritsar", ordinal: "19th", sourceId: PGK_001_CP002_SOURCE_IDS.tarnTaran },
  { id: "barnala-2006", district: "Barnala", dateText: "19 November 2006", year: 2006, parent: "Sangrur", sourceId: PGK_001_CP002_SOURCE_IDS.barnala },
  { id: "pathankot-2011", district: "Pathankot", dateText: "27 July 2011", year: 2011, parent: "Gurdaspur", sourceId: PGK_001_CP002_SOURCE_IDS.pathankot },
  { id: "fazilka-2011", district: "Fazilka", dateText: "July 2011", year: 2011, parent: "Ferozepur", ordinal: "21st", sourceId: PGK_001_CP002_SOURCE_IDS.fazilka },
  { id: "malerkotla-2021", district: "Malerkotla", dateText: "2 June 2021", year: 2021, parent: "Sangrur", ordinal: "23rd", sourceId: PGK_001_CP002_SOURCE_IDS.malerkotla },
]);

export const PGK_001_CP002_ADMIN_SNAPSHOT_V1 = Object.freeze({
  sourceYear: 2022,
  districtCount: 23,
  divisionCount: 5,
  sourceIds: [PGK_001_CP002_SOURCE_IDS.atGlance2022, PGK_001_CP002_SOURCE_IDS.epos2026],
});

export const PGK_001_CP002_DISTRICT_BY_ID = Object.freeze(
  Object.fromEntries(PGK_001_CP002_DISTRICTS_V1.map((row) => [row.id, row])) as Record<string, Pgk001Cp002DistrictRow>,
);
