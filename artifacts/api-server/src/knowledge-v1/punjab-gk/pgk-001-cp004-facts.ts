export const PGK_001_CP004_SOURCE_IDS = Object.freeze({
  knowPunjab: "GOV-PUNJAB-KNOW-PUNJAB",
  bbmbFormation: "BBMB-FORMATION-RAVI-BEAS-SUTLEJ",
  tarnTaranPlan: "PUDA-TARN-TARAN-HARIKE",
  rajpuraPlan: "PUDA-RAJPURA-GHAGGAR",
  jalandharPlan: "PUDA-JALANDHAR-HYDROGRAPHY",
  amritsarPlan: "PUDA-AMRITSAR-BEAS-RAVI",
  psebClass9Geography: "PSEB-SOCIAL-SCIENCE-IX-PUNJAB-PLAINS-DOABS",
  psebClass9PunjabIntro: "PSEB-SOCIAL-SCIENCE-IX-PUNJAB-INTRO-RIVER-NAMES",
} as const);

export const PGK_001_CP004_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP004_SOURCE_IDS.knowPunjab]: {
    authority: "Government of Punjab",
    title: "Know Punjab",
    url: "https://punjab.gov.in/know-punjab/",
  },
  [PGK_001_CP004_SOURCE_IDS.bbmbFormation]: {
    authority: "Bhakra Beas Management Board",
    title: "Formation of BBMB",
    url: "https://bbmb.gov.in/formation-of-bbmb.htm",
  },
  [PGK_001_CP004_SOURCE_IDS.tarnTaranPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Master Plan for Tarn Taran LPA",
    url: "https://www.puda.punjab.gov.in/sites/default/files/TT_rpt_2011.pdf",
  },
  [PGK_001_CP004_SOURCE_IDS.rajpuraPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Rajpura Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/rajpura_report.pdf",
  },
  [PGK_001_CP004_SOURCE_IDS.jalandharPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Jalandhar Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Jal_rpt_2011.pdf",
  },
  [PGK_001_CP004_SOURCE_IDS.amritsarPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Amritsar Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/AMT_rpt_2011.pdf",
  },
  [PGK_001_CP004_SOURCE_IDS.psebClass9Geography]: {
    authority: "Punjab School Education Board",
    title: "Social Science IX Part I — Plains of Punjab and Haryana",
    url: "https://static.pseb.ac.in/media/1670479881_Social%20Science-9%28english%29%20Part-I.pdf",
  },
  [PGK_001_CP004_SOURCE_IDS.psebClass9PunjabIntro]: {
    authority: "Punjab School Education Board",
    title: "Social Science IX Part I — Punjab: An Introduction",
    url: "https://static.pseb.ac.in/media/1670479881_Social%20Science-9%28english%29%20Part-I.pdf",
  },
} as const);

export const PGK_001_CP004_RIVER_SETS = Object.freeze({
  historicalFive: Object.freeze(["Sutlej", "Beas", "Ravi", "Chenab", "Jhelum"]),
  presentPunjabFromHistoricalFive: Object.freeze(["Sutlej", "Beas", "Ravi"]),
  easternRivers: Object.freeze(["Sutlej", "Beas", "Ravi"]),
});

export type Pgk001Cp004AncientRiverName = Readonly<{
  id: string;
  modernName: string;
  canonicalAncientName: string;
  acceptedAncientSpellings: readonly string[];
}>;

export const PGK_001_CP004_ANCIENT_RIVER_NAMES: readonly Pgk001Cp004AncientRiverName[] = Object.freeze([
  {
    id: "ancient-sutlej-shutudri",
    modernName: "Sutlej",
    canonicalAncientName: "Shutudri",
    acceptedAncientSpellings: Object.freeze(["Shutudri", "Sutudri", "Shatudri", "Shatadru"]),
  },
  {
    id: "ancient-beas-vipasa",
    modernName: "Beas",
    canonicalAncientName: "Vipasa",
    acceptedAncientSpellings: Object.freeze(["Vipasa", "Vipasha", "Vipas"]),
  },
  {
    id: "ancient-ravi-purushni",
    modernName: "Ravi",
    canonicalAncientName: "Purushni",
    acceptedAncientSpellings: Object.freeze(["Purushni", "Parushni"]),
  },
  {
    id: "ancient-chenab-askini",
    modernName: "Chenab",
    canonicalAncientName: "Askini",
    acceptedAncientSpellings: Object.freeze(["Askini", "Asikni"]),
  },
  {
    id: "ancient-jhelum-vitasta",
    modernName: "Jhelum",
    canonicalAncientName: "Vitasta",
    acceptedAncientSpellings: Object.freeze(["Vitasta"]),
  },
]);

export type Pgk001Cp004Doab = Readonly<{
  id: string;
  name: string;
  rivers: readonly [string, string];
}>;

export const PGK_001_CP004_DOABS: readonly Pgk001Cp004Doab[] = Object.freeze([
  { id: "bist-doab", name: "Bist Doab", rivers: ["Sutlej", "Beas"] },
  { id: "bari-doab", name: "Bari Doab", rivers: ["Beas", "Ravi"] },
  { id: "rachna-doab", name: "Rachna Doab", rivers: ["Ravi", "Chenab"] },
  { id: "chaj-doab", name: "Chaj Doab", rivers: ["Chenab", "Jhelum"] },
  { id: "sind-sagar-doab", name: "Sind Sagar Doab", rivers: ["Jhelum", "Indus"] },
]);

export const PGK_001_CP004_RELATIONS = Object.freeze({
  beasJoinsSutlejAt: "Harike",
  ghaggarType: "Seasonal",
  doabMeaning: "Land between two rivers",
  doabaRiverPair: Object.freeze(["Beas", "Sutlej"]),
  bariDoabRiverPair: Object.freeze(["Ravi", "Beas"]),
});

export const PGK_001_CP004_FACT_IDS = Object.freeze([
  "historical-five-rivers",
  "present-punjab-three-from-five",
  "eastern-rivers",
  "beas-sutlej-harike",
  "ghaggar-seasonal",
  "doab-meaning",
  ...PGK_001_CP004_ANCIENT_RIVER_NAMES.map((row) => row.id),
  ...PGK_001_CP004_DOABS.map((row) => row.id),
]);
