export const PGK_001_CP009_SOURCE_IDS = Object.freeze({
  punjabIndustryPolicy: "GOV-PUNJAB-INDUSTRIAL-POLICY-2017",
  ludhianaPlan: "PUDA-LUDHIANA-INDUSTRIES",
  jalandharPlan: "PUDA-JALANDHAR-INDUSTRIES",
  mandiGobindgarhPlan: "PUDA-MANDI-GOBINDGARH-INDUSTRIES",
  batalaMunicipal: "MC-BATALA-INDUSTRY-PROFILE",
  hmel: "HMEL-GURU-GOBIND-SINGH-REFINERY",
  markfed: "MARKFED-CORPORATE-PROFILE",
  milkfed: "MILKFED-VERKA-ABOUT",
  psiec: "PSIEC-ABOUT",
} as const);

export const PGK_001_CP009_SOURCE_REGISTRY = Object.freeze({
  [PGK_001_CP009_SOURCE_IDS.punjabIndustryPolicy]: { authority: "Government of Punjab", title: "Industrial and Business Development Policy", url: "https://punjab.gov.in/wp-content/uploads/2021/10/Industrial-and-Business-Development-Policy-PDF-1.66MB.pdf" },
  [PGK_001_CP009_SOURCE_IDS.ludhianaPlan]: { authority: "Punjab Urban Planning & Development Authority", title: "Ludhiana Master Plan Report", url: "https://puda.punjab.gov.in/sites/default/files/Ldh_rpt_2011.pdf" },
  [PGK_001_CP009_SOURCE_IDS.jalandharPlan]: { authority: "Punjab Urban Planning & Development Authority", title: "Jalandhar Master Plan Report", url: "https://puda.punjab.gov.in/sites/default/files/Jal_rpt_2011.pdf" },
  [PGK_001_CP009_SOURCE_IDS.mandiGobindgarhPlan]: { authority: "Punjab Urban Planning & Development Authority", title: "Mandi Gobindgarh Master Plan Report", url: "https://www.puda.punjab.gov.in/sites/default/files/MG_rpt_2011.pdf" },
  [PGK_001_CP009_SOURCE_IDS.batalaMunicipal]: { authority: "Municipal Council Batala", title: "Batala City Profile", url: "https://mcbatala.punjab.gov.in/Home" },
  [PGK_001_CP009_SOURCE_IDS.hmel]: { authority: "HPCL-Mittal Energy Limited", title: "Guru Gobind Singh Refinery", url: "https://www.hmel.in/gurugobindsinghrefinery/" },
  [PGK_001_CP009_SOURCE_IDS.markfed]: { authority: "Punjab Markfed", title: "Corporate Profile", url: "https://markfedpunjab.com/markfed/corporate-profile/" },
  [PGK_001_CP009_SOURCE_IDS.milkfed]: { authority: "Punjab MILKFED", title: "Verka About Us", url: "https://verka.coop/about-us/" },
  [PGK_001_CP009_SOURCE_IDS.psiec]: { authority: "Punjab Small Industries & Export Corporation", title: "PSIEC About", url: "https://psiecems.punjab.gov.in/" },
} as const);

export const PGK_001_CP009_INDUSTRIAL_CENTRES = Object.freeze([
  { city: "Ludhiana", products: Object.freeze(["Hosiery and knitwear", "Bicycles", "Sewing machines", "Hand tools", "Auto components"]) },
  { city: "Jalandhar", products: Object.freeze(["Sports goods", "Hand tools", "Leather and tanning", "Casting", "Surgical goods"]) },
  { city: "Mandi Gobindgarh", products: Object.freeze(["Secondary steel", "Steel re-rolling"]) },
  { city: "Batala", products: Object.freeze(["Casting iron", "Machine tools"]) },
  { city: "Bathinda", products: Object.freeze(["Petroleum refining", "Petrochemicals"]) },
] as const);

export const PGK_001_CP009_INSTITUTIONS = Object.freeze({
  MARKFED: { fullName: "Punjab State Cooperative Supply and Marketing Federation Limited", year: 1954, role: "Farm-input supply, procurement, processing and marketing" },
  MILKFED: { fullName: "Punjab State Cooperative Milk Producers' Federation Limited", year: 1973, brand: "Verka", role: "Milk procurement, processing and marketing" },
  PSIEC: { fullName: "Punjab Small Industries & Export Corporation Limited", year: 1962, role: "Industrial infrastructure and focal points" },
  HMEL: { fullName: "HPCL-Mittal Energy Limited", role: "Operates Guru Gobind Singh Refinery at Bathinda" },
} as const);

export const PGK_001_CP009_FACT_IDS = Object.freeze([
  "centre-ludhiana-hosiery-bicycles",
  "centre-jalandhar-sports-handtools",
  "centre-mandi-gobindgarh-secondary-steel",
  "centre-batala-casting-machine-tools",
  "centre-bathinda-refinery",
  "refinery-guru-gobind-singh-bathinda",
  "hmel-joint-venture",
  "markfed-fullform-1954",
  "milkfed-fullform-1973-verka",
  "psiec-fullform-1962-role",
]);
