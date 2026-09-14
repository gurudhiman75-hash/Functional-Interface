export const PGK_001_CP003_SOURCE_IDS = Object.freeze({
  knowPunjab: "GOV-PUNJAB-KNOW-PUNJAB",
  gmrRegionalPlan: "PUDA-GMR-REGIONAL-PLAN",
  tarnTaranPlan: "PUDA-TARN-TARAN-MASTER-PLAN",
  jalandharPlan: "PUDA-JALANDHAR-MASTER-PLAN",
  nawanshahrPlan: "PUDA-NAWANSHAHR-MASTER-PLAN",
  ludhianaPlan: "PUDA-LUDHIANA-MASTER-PLAN",
  bathindaPlan: "PUDA-BATHINDA-MASTER-PLAN",
  sangrurPlan: "PUDA-SANGRUR-MASTER-PLAN",
  aboharPlan: "PUDA-ABOHAR-MASTER-PLAN",
  fatehgarhPlan: "PUDA-FATEHGARH-SAHIB-MASTER-PLAN",
  patialaPlan: "PUDA-PATIALA-MASTER-PLAN",
  rajpuraPlan: "PUDA-RAJPURA-MASTER-PLAN",
  hargobindpurPlan: "PUDA-SRI-HARGOBINDPUR-MASTER-PLAN",
  pathankotPlan: "PUDA-PATHANKOT-MASTER-PLAN",
  pauKandi: "PAU-BALLOWAL-SAUNKHRI-KANDI",
} as const);

export const PGK_001_CP003_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP003_SOURCE_IDS.knowPunjab]: {
    authority: "Government of Punjab",
    title: "Know Punjab",
    url: "https://punjab.gov.in/know-punjab/",
  },
  [PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Greater Mohali Regional Plan 2008-2058",
    url: "https://puda.punjab.gov.in/sites/default/files/Regional_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.tarnTaranPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Master Plan for Tarn Taran LPA",
    url: "https://www.puda.punjab.gov.in/sites/default/files/TT_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.jalandharPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Jalandhar Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Jal_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.nawanshahrPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Nawanshahr Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Report_nwn.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.ludhianaPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Ludhiana Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Ldh_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.bathindaPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Bathinda Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/BTD_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.sangrurPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Sangrur Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Sangrur_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.aboharPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Abohar Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Abohar_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.fatehgarhPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Fatehgarh Sahib-Sirhind Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/FGS_report.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.patialaPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Patiala Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Ptl_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.rajpuraPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Rajpura Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/rajpura_report.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.hargobindpurPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Sri Hargobindpur Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/Hargobindpur_rpt_2011.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.pathankotPlan]: {
    authority: "Punjab Urban Planning & Development Authority",
    title: "Pathankot Master Plan",
    url: "https://puda.punjab.gov.in/sites/default/files/pathankot_report.pdf",
  },
  [PGK_001_CP003_SOURCE_IDS.pauKandi]: {
    authority: "Punjab Agricultural University",
    title: "Dr D R Bhumbla Regional Research Station, Ballowal Saunkhri",
    url: "https://pau.edu/outstations/index.php?DO=viewHomePage&_act=manageOutstationData&intLinkID=4",
  },
} as const);

export type Pgk001Cp003RegionScheme = Readonly<{
  id: string;
  label: string;
  regions: readonly string[];
  sourceId: string;
}>;

export const PGK_001_CP003_REGION_SCHEMES_V1: readonly Pgk001Cp003RegionScheme[] = Object.freeze([
  {
    id: "gov-punjab-three-region",
    label: "Government of Punjab broad-region scheme",
    regions: Object.freeze(["Majha", "Doaba", "Malwa"]),
    sourceId: PGK_001_CP003_SOURCE_IDS.knowPunjab,
  },
  {
    id: "puda-four-natural-region",
    label: "PUDA Greater Mohali natural-region scheme",
    regions: Object.freeze(["Majha", "Doaba", "Malwa", "Puadh"]),
    sourceId: PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan,
  },
]);

export type Pgk001Cp003RegionPlaceFact = Readonly<{
  id: string;
  place: string;
  region: "Majha" | "Doaba" | "Malwa";
  sourceId: string;
}>;

export const PGK_001_CP003_REGION_PLACE_FACTS_V1: readonly Pgk001Cp003RegionPlaceFact[] = Object.freeze([
  { id: "tarn-taran-majha", place: "Tarn Taran", region: "Majha", sourceId: PGK_001_CP003_SOURCE_IDS.tarnTaranPlan },
  { id: "jalandhar-doaba", place: "Jalandhar", region: "Doaba", sourceId: PGK_001_CP003_SOURCE_IDS.jalandharPlan },
  { id: "nawanshahr-doaba", place: "Nawanshahr", region: "Doaba", sourceId: PGK_001_CP003_SOURCE_IDS.nawanshahrPlan },
  { id: "ludhiana-malwa", place: "Ludhiana", region: "Malwa", sourceId: PGK_001_CP003_SOURCE_IDS.ludhianaPlan },
  { id: "bathinda-malwa", place: "Bathinda", region: "Malwa", sourceId: PGK_001_CP003_SOURCE_IDS.bathindaPlan },
  { id: "sangrur-malwa", place: "Sangrur", region: "Malwa", sourceId: PGK_001_CP003_SOURCE_IDS.sangrurPlan },
  { id: "abohar-malwa", place: "Abohar", region: "Malwa", sourceId: PGK_001_CP003_SOURCE_IDS.aboharPlan },
]);

export const PGK_001_CP003_RELIEF_PROFILE_V1 = Object.freeze({
  id: "punjab-elevation-profile",
  averageElevationMetres: 300,
  southwestApproxMetres: 180,
  northeastRelation: "more than 500 metres around the northeast border",
  sourceId: PGK_001_CP003_SOURCE_IDS.knowPunjab,
});

export type Pgk001Cp003PhysiographyFact = Readonly<{
  id: string;
  statement: string;
  tags: readonly string[];
  sourceIds: readonly string[];
}>;

export const PGK_001_CP003_PHYSIOGRAPHY_FACTS_V1: readonly Pgk001Cp003PhysiographyFact[] = Object.freeze([
  {
    id: "punjab-indo-gangetic-plain",
    statement: "The Punjab plain forms part of the great plains of North India / Indo-Gangetic plain and is predominantly alluvial.",
    tags: Object.freeze(["plain", "alluvial"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.fatehgarhPlan]),
  },
  {
    id: "alluvial-plain-flat",
    statement: "Much of the Punjab plain is flat to gently sloping and was built by alluvial deposits brought by Himalayan river systems.",
    tags: Object.freeze(["plain", "alluvial", "relief"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.fatehgarhPlan]),
  },
  {
    id: "alluvial-soil-fertile",
    statement: "The alluvial plain soils described in the Fatehgarh Sahib planning area are well drained and fertile.",
    tags: Object.freeze(["plain", "soil"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.fatehgarhPlan]),
  },
  {
    id: "gmr-landform-set",
    statement: "The Greater Mohali regional physiographic map distinguishes Shivalik Hills, Piedmont Plain, Old Alluvial Plain and Recent Alluvial Plain.",
    tags: Object.freeze(["shivalik", "piedmont", "alluvial"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.gmrRegionalPlan]),
  },
  {
    id: "pathankot-three-tracts",
    statement: "The Pathankot master plan describes three broad physical tracts: Sub-Mountainous, Kandi and Plain.",
    tags: Object.freeze(["kandi", "sub-mountainous", "plain"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.pathankotPlan]),
  },
  {
    id: "pau-kandi-shivalik",
    statement: "PAU's Ballowal Saunkhri research station is in the Shivalik foothills and is described as being in the heart of Kandi area.",
    tags: Object.freeze(["kandi", "shivalik"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.pauKandi]),
  },
  {
    id: "rajpura-three-landforms",
    statement: "Rajpura's official plan distinguishes Upland Plain, Choe-Infested Foothill Plain and the Ghaggar Flood Plain.",
    tags: Object.freeze(["upland", "foothill", "floodplain"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.rajpuraPlan]),
  },
  {
    id: "upland-relative-height",
    statement: "In the Rajpura/Patiala physiographic sequence, the upland plain lies above the floodplain but below the choe-infested foothill plain.",
    tags: Object.freeze(["upland", "foothill", "floodplain", "relief"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.rajpuraPlan, PGK_001_CP003_SOURCE_IDS.patialaPlan]),
  },
  {
    id: "floodplain-silt",
    statement: "Flooding on the Ghaggar floodplain can deposit silt and renew the soil surface.",
    tags: Object.freeze(["floodplain", "silt"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.rajpuraPlan]),
  },
  {
    id: "bari-doab-alluvial-to-floodplain",
    statement: "The Sri Hargobindpur area is part of the alluvial plain of Bari Doab and falls toward the Beas floodplain.",
    tags: Object.freeze(["alluvial", "floodplain"]),
    sourceIds: Object.freeze([PGK_001_CP003_SOURCE_IDS.hargobindpurPlan]),
  },
]);

export const PGK_001_CP003_VALID_FACT_IDS = Object.freeze([
  ...PGK_001_CP003_REGION_SCHEMES_V1.map((row) => row.id),
  ...PGK_001_CP003_REGION_PLACE_FACTS_V1.map((row) => row.id),
  PGK_001_CP003_RELIEF_PROFILE_V1.id,
  ...PGK_001_CP003_PHYSIOGRAPHY_FACTS_V1.map((row) => row.id),
]);
