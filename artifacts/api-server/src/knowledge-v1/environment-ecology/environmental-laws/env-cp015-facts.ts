export type EnvCp015FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const EPA = "INDIA-CODE-EPA-1986";
const WATER = "INDIA-CODE-WATER-1974";
const AIR = "INDIA-CODE-AIR-1981";
const WILDLIFE = "INDIA-CODE-WILDLIFE-1972";
const FOREST = "INDIA-CODE-VAN-1980";
const BIODIVERSITY = "INDIA-CODE-BDA-2002";
const NGT = "INDIA-CODE-NGT-2010";
const CPCB = "CPCB-AIR-ACT-MANDATE";

export const ENV_CP015_FACT_ROWS_V1: readonly EnvCp015FactRow[] = Object.freeze([
  { id:"env-cp015-epa-purpose", label:"Environment Protection Act purpose", statement:"the Environment (Protection) Act, 1986 provides for protection and improvement of the environment", sourceIds:[EPA] },
  { id:"env-cp015-epa-central-powers", label:"Environment Protection Act powers", statement:"the Environment (Protection) Act gives broad environmental protection powers to the Central Government, including power to take measures and issue directions within the Act", sourceIds:[EPA] },
  { id:"env-cp015-water-purpose", label:"Water Act purpose", statement:"the Water Act, 1974 provides for prevention and control of water pollution and maintaining or restoring the wholesomeness of water", sourceIds:[WATER] },
  { id:"env-cp015-water-boards", label:"Water pollution boards", statement:"the Water Act provides for boards for prevention and control of water pollution", sourceIds:[WATER] },
  { id:"env-cp015-air-purpose", label:"Air Act purpose", statement:"the Air Act, 1981 provides for prevention, control and abatement of air pollution", sourceIds:[AIR] },
  { id:"env-cp015-air-boards", label:"Air pollution boards", statement:"the Air Act assigns major air-pollution functions to the Central Pollution Control Board and State Pollution Control Boards", sourceIds:[AIR, CPCB] },
  { id:"env-cp015-cpcb-role", label:"CPCB role", statement:"CPCB has national-level planning, coordination, technical guidance and Central Government advisory functions for pollution control", sourceIds:[CPCB, AIR] },
  { id:"env-cp015-spcb-role", label:"SPCB role", statement:"State Pollution Control Boards plan and implement state-level pollution-control programmes and advise State Governments", sourceIds:[CPCB, AIR] },
  { id:"env-cp015-wildlife-purpose", label:"Wildlife law purpose", statement:"the Wild Life (Protection) Act, 1972 provides for protection of wild animals, birds and plants and related ecological security", sourceIds:[WILDLIFE] },
  { id:"env-cp015-wildlife-protected-areas", label:"Wildlife protected areas", statement:"the Wild Life (Protection) Act provides the statutory framework for protected-area categories such as national parks and wildlife sanctuaries", sourceIds:[WILDLIFE] },
  { id:"env-cp015-forest-title", label:"Current forest law title", statement:"the law historically known as the Forest (Conservation) Act, 1980 now has the short title Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980", sourceIds:[FOREST] },
  { id:"env-cp015-forest-prior-approval", label:"Forest land approval", statement:"the 1980 forest-conservation law requires prior Central Government approval for specified dereservation or non-forest-use decisions involving covered forest land", sourceIds:[FOREST] },
  { id:"env-cp015-biodiversity-objectives", label:"Biological Diversity Act objectives", statement:"the Biological Diversity Act, 2002 covers conservation of biological diversity, sustainable use of its components and fair and equitable sharing of benefits", sourceIds:[BIODIVERSITY] },
  { id:"env-cp015-ngt-establishment", label:"NGT establishment", statement:"the National Green Tribunal Act, 2010 establishes the National Green Tribunal", sourceIds:[NGT] },
  { id:"env-cp015-ngt-purpose", label:"NGT purpose", statement:"the NGT Act provides for effective and expeditious disposal of specified environmental cases involving environmental protection, forests, natural resources and environmental legal rights", sourceIds:[NGT] },
  { id:"env-cp015-ngt-relief", label:"NGT relief and compensation", statement:"the NGT framework includes relief and compensation for environmental damage within its statutory jurisdiction", sourceIds:[NGT] },
  { id:"env-cp015-years", label:"Key environmental law years", statement:"Wild Life Act 1972, Water Act 1974, forest-conservation law 1980, Air Act 1981, Environment Protection Act 1986, Biological Diversity Act 2002 and NGT Act 2010", sourceIds:[WILDLIFE, WATER, FOREST, AIR, EPA, BIODIVERSITY, NGT] },
]);

export const ENV_CP015_FACT_IDS_V1 = new Set(ENV_CP015_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP015_FACT_BY_ID_V1 = new Map(ENV_CP015_FACT_ROWS_V1.map((row) => [row.id, row] as const));
