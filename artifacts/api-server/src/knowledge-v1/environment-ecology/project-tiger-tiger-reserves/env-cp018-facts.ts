export type EnvCp018FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const NTCA_ABOUT = "NTCA-ABOUT-PROJECT-TIGER";
const NTCA_RESERVES = "NTCA-TIGER-RESERVES";
const NTCA_MSTRIPES = "NTCA-MSTRIPES";
const NTCA_MONITORING = "NTCA-MONITORING";
const NTCA_DOCS = "NTCA-PROJECT-TIGER-DOCUMENTS";
const NTCA_FAQ = "NTCA-FAQ-STPF-REINTRODUCTION";

export const ENV_CP018_FACT_ROWS_V1: readonly EnvCp018FactRow[] = Object.freeze([
  { id:"env-cp018-launch", label:"Project Tiger launch", statement:"Project Tiger was launched by the Government of India in April 1973", sourceIds:[NTCA_ABOUT, NTCA_DOCS] },
  { id:"env-cp018-objective", label:"Project Tiger objective", statement:"Project Tiger aims to maintain a viable tiger population and preserve biologically important areas as national heritage", sourceIds:[NTCA_DOCS] },
  { id:"env-cp018-css", label:"Centrally Sponsored Scheme", statement:"Project Tiger is an ongoing Centrally Sponsored Scheme of the Ministry of Environment, Forest and Climate Change", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-in-situ", label:"In-situ tiger conservation", statement:"Project Tiger provides support to tiger range States for in-situ conservation of tigers in designated tiger reserves", sourceIds:[NTCA_ABOUT] },

  { id:"env-cp018-original-nine", label:"Original nine reserves", statement:"The original Project Tiger network began with nine reserves: Bandipur, Corbett, Kanha, Manas, Melghat, Palamau, Ranthambore, Similipal and Sundarban", sourceIds:[NTCA_ABOUT, NTCA_RESERVES] },
  { id:"env-cp018-bandipur", label:"Bandipur location", statement:"Bandipur Tiger Reserve is in Karnataka", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-corbett", label:"Corbett location", statement:"Corbett Tiger Reserve is in Uttarakhand", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-kanha", label:"Kanha location", statement:"Kanha Tiger Reserve is in Madhya Pradesh", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-manas", label:"Manas location", statement:"Manas Tiger Reserve is in Assam", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-melghat", label:"Melghat location", statement:"Melghat Tiger Reserve is in Maharashtra", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-palamau", label:"Palamau location", statement:"Palamau Tiger Reserve is in Jharkhand", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-ranthambore", label:"Ranthambore location", statement:"Ranthambore Tiger Reserve is in Rajasthan", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-similipal", label:"Similipal location", statement:"Similipal Tiger Reserve is in Odisha", sourceIds:[NTCA_RESERVES] },
  { id:"env-cp018-sundarban", label:"Sundarban location", statement:"Sundarban Tiger Reserve is in West Bengal", sourceIds:[NTCA_RESERVES] },

  { id:"env-cp018-core-buffer", label:"Core-buffer strategy", statement:"Tiger reserves are managed through a core and buffer strategy", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-core-status", label:"Core legal status", statement:"The core area of a tiger reserve has the legal status of a national park or wildlife sanctuary", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-buffer-character", label:"Buffer character", statement:"The buffer or peripheral area may include forest and non-forest land and is managed as a multiple-use area", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-core-agenda", label:"Core management emphasis", statement:"Project Tiger follows an exclusive tiger-conservation agenda in core areas", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-buffer-agenda", label:"Buffer management emphasis", statement:"Project Tiger follows a more inclusive people-oriented approach in buffer areas", sourceIds:[NTCA_ABOUT] },

  { id:"env-cp018-ntca-statutory", label:"NTCA statutory authority", statement:"NTCA provides statutory authority to Project Tiger under the Wild Life (Protection) Act framework", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-tcp", label:"Tiger Conservation Plan", statement:"State Governments prepare Tiger Conservation Plans for tiger reserves and NTCA approves them", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-unsustainable-use", label:"Unsustainable land use", statement:"NTCA may assess ecological sustainability and disallow ecologically unsustainable land use such as mining or industry within tiger reserves", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-tourism-guidelines", label:"Tourism standards", statement:"NTCA lays down normative standards for tourism activities and Project Tiger guidelines for core and buffer areas", sourceIds:[NTCA_ABOUT] },
  { id:"env-cp018-conflict", label:"Conflict management", statement:"NTCA's statutory role includes measures for human-wildlife conflict management and coexistence around tiger landscapes", sourceIds:[NTCA_ABOUT] },

  { id:"env-cp018-mstripes-full", label:"M-STrIPES full form", statement:"M-STrIPES stands for Monitoring System for Tigers: Intensive Protection and Ecological Status", sourceIds:[NTCA_MSTRIPES] },
  { id:"env-cp018-mstripes-purpose", label:"M-STrIPES purpose", statement:"M-STrIPES uses modern technology to support patrolling, ecological-status assessment and human-wildlife conflict management in tiger reserves", sourceIds:[NTCA_MSTRIPES] },
  { id:"env-cp018-mstripes-tools", label:"M-STrIPES tools", statement:"M-STrIPES uses GPS, mobile data, remote sensing, GIS and statistical tools for field monitoring and management", sourceIds:[NTCA_MSTRIPES] },
  { id:"env-cp018-mstripes-modules", label:"M-STrIPES modules", statement:"M-STrIPES includes patrol, ecological and conflict modules", sourceIds:[NTCA_FAQ] },
  { id:"env-cp018-patrol", label:"Patrol module", statement:"The M-STrIPES patrol module records patrol tracks, crime scenes and field observations with geospatial information", sourceIds:[NTCA_MSTRIPES] },

  { id:"env-cp018-assessment-cycle", label:"Tiger assessment cycle", statement:"NTCA and Project Tiger conduct a country-level assessment of tigers, prey and habitat on a four-year cycle", sourceIds:[NTCA_ABOUT, NTCA_MONITORING] },
  { id:"env-cp018-monitoring-tech", label:"Tiger monitoring technology", statement:"Tiger monitoring uses camera traps, digital field data, GPS and analytical tools rather than relying on one method alone", sourceIds:[NTCA_MONITORING] },
  { id:"env-cp018-stpf", label:"Special Tiger Protection Force", statement:"The Special Tiger Protection Force is deployed in selected tiger reserves for focused anti-poaching protection", sourceIds:[NTCA_FAQ] },
  { id:"env-cp018-reintroduction", label:"Tiger reintroduction", statement:"Sariska and Panna are established examples of tiger reintroduction in India", sourceIds:[NTCA_FAQ] },
]);

export const ENV_CP018_FACT_IDS_V1 = new Set(ENV_CP018_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP018_FACT_BY_ID_V1 = new Map(ENV_CP018_FACT_ROWS_V1.map((row) => [row.id, row] as const));
