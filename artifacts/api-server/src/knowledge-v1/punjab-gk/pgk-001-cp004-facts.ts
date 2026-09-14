export const PGK_001_CP004_SOURCE_IDS = Object.freeze({
  knowPunjab: "GOV-PUNJAB-KNOW-PUNJAB",
  bbmbFormation: "BBMB-FORMATION-RAVI-BEAS-SUTLEJ",
  tarnTaranPlan: "PUDA-TARN-TARAN-HARIKE",
  rajpuraPlan: "PUDA-RAJPURA-GHAGGAR",
  jalandharPlan: "PUDA-JALANDHAR-HYDROGRAPHY",
  amritsarPlan: "PUDA-AMRITSAR-BEAS-RAVI",
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
} as const);

export const PGK_001_CP004_RIVER_SETS = Object.freeze({
  historicalFive: Object.freeze(["Sutlej", "Beas", "Ravi", "Chenab", "Jhelum"]),
  presentPunjab: Object.freeze(["Sutlej", "Beas", "Ravi"]),
  easternRivers: Object.freeze(["Sutlej", "Beas", "Ravi"]),
});

export const PGK_001_CP004_RELATIONS = Object.freeze({
  beasJoinsSutlejAt: "Harike",
  ghaggarType: "Seasonal",
  doabMeaning: "Land between two rivers",
  doabaRiverPair: Object.freeze(["Beas", "Sutlej"]),
  bariDoabRiverPair: Object.freeze(["Ravi", "Beas"]),
});

export const PGK_001_CP004_FACT_IDS = Object.freeze([
  "historical-five-rivers",
  "present-punjab-three-rivers",
  "eastern-rivers",
  "beas-sutlej-harike",
  "ghaggar-seasonal",
  "doab-meaning",
  "doaba-beas-sutlej",
  "bari-doab-ravi-beas",
]);
