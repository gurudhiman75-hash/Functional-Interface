export type EnvCp016FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const CPCB = "CPCB-OFFICIAL-MANDATE";
const NBA = "NBA-OFFICIAL";
const NTCA = "NTCA-OFFICIAL-ABOUT";
const CZA = "CZA-OFFICIAL-INTRODUCTION";
const WCCB = "WCCB-OFFICIAL-MANDATE";
const FSI = "FSI-OFFICIAL-OBJECTIVES";
const BSI = "BSI-OFFICIAL-MANDATE";
const ZSI = "ZSI-OFFICIAL-FAUNA";
const WII = "WII-OFFICIAL-MANDATE";

export const ENV_CP016_FACT_ROWS_V1: readonly EnvCp016FactRow[] = Object.freeze([
  { id:"env-cp016-cpcb-level", label:"CPCB national role", statement:"CPCB performs apex national pollution-control functions and coordinates with State Pollution Control Boards and Pollution Control Committees", sourceIds:[CPCB] },
  { id:"env-cp016-spcb-level", label:"SPCB state role", statement:"State Pollution Control Boards plan and implement pollution-control programmes and advise State Governments", sourceIds:[CPCB] },
  { id:"env-cp016-cpcb-guidance", label:"CPCB technical guidance", statement:"CPCB provides technical assistance and guidance to State Pollution Control Boards", sourceIds:[CPCB] },
  { id:"env-cp016-pcc-ut", label:"PCC Union Territory role", statement:"Pollution Control Committees perform pollution-control functions in Union Territories within the statutory framework", sourceIds:[CPCB] },

  { id:"env-cp016-nba-status", label:"National Biodiversity Authority", statement:"The National Biodiversity Authority is a statutory body under the Ministry of Environment, Forest and Climate Change for implementation of the Biological Diversity Act", sourceIds:[NBA] },
  { id:"env-cp016-nba-role", label:"NBA role", statement:"NBA supports national biodiversity governance including conservation, sustainable use and fair and equitable benefit sharing", sourceIds:[NBA] },
  { id:"env-cp016-sbb", label:"State Biodiversity Boards", statement:"State Biodiversity Boards operate at state level and advise State Governments on biodiversity conservation, sustainable use and benefit sharing", sourceIds:[NBA] },
  { id:"env-cp016-bmc", label:"Biodiversity Management Committees", statement:"Biodiversity Management Committees are constituted at local level and promote conservation, sustainable use and documentation of biodiversity", sourceIds:[NBA] },
  { id:"env-cp016-pbr", label:"People's Biodiversity Registers", statement:"Biodiversity Management Committees are closely associated with documenting local biodiversity through People's Biodiversity Registers", sourceIds:[NBA] },

  { id:"env-cp016-ntca-status", label:"National Tiger Conservation Authority", statement:"NTCA is a statutory body under the Ministry of Environment, Forest and Climate Change constituted under the Wildlife (Protection) Act for strengthening tiger conservation", sourceIds:[NTCA] },
  { id:"env-cp016-ntca-role", label:"NTCA role", statement:"NTCA has an overarching supervisory and coordination role in tiger conservation and tiger-reserve management within its statutory mandate", sourceIds:[NTCA] },

  { id:"env-cp016-cza-status", label:"Central Zoo Authority", statement:"Central Zoo Authority is a statutory body under the Ministry of Environment, Forest and Climate Change established under the Wildlife (Protection) Act framework", sourceIds:[CZA] },
  { id:"env-cp016-cza-zoos", label:"CZA zoo regulation", statement:"CZA specifies zoo standards, evaluates zoos and may recognize or derecognize zoos", sourceIds:[CZA] },
  { id:"env-cp016-cza-breeding", label:"CZA captive breeding", statement:"CZA coordinates captive-breeding related functions including identifying endangered species for captive breeding and supporting scientific zoo management", sourceIds:[CZA] },

  { id:"env-cp016-wccb-status", label:"Wildlife Crime Control Bureau", statement:"WCCB is a statutory multi-disciplinary body under the Ministry of Environment, Forest and Climate Change created to combat organized wildlife crime", sourceIds:[WCCB] },
  { id:"env-cp016-wccb-intelligence", label:"WCCB intelligence role", statement:"WCCB collects and collates intelligence on organized wildlife crime and disseminates it to enforcement agencies", sourceIds:[WCCB] },
  { id:"env-cp016-wccb-coordination", label:"WCCB coordination", statement:"WCCB coordinates enforcement action among agencies in relation to wildlife crime", sourceIds:[WCCB] },

  { id:"env-cp016-fsi-role", label:"Forest Survey of India", statement:"Forest Survey of India surveys and assesses forest resources and regularly monitors forest cover in India", sourceIds:[FSI] },
  { id:"env-cp016-fsi-isfr", label:"India State of Forest Report", statement:"FSI prepares the India State of Forest Report on a biennial basis and assesses forest cover using remote-sensing and related methods", sourceIds:[FSI] },
  { id:"env-cp016-fsi-hq", label:"FSI headquarters", statement:"Forest Survey of India has its headquarters at Dehradun", sourceIds:[FSI] },

  { id:"env-cp016-bsi-role", label:"Botanical Survey of India", statement:"BSI explores, inventories, documents and conducts taxonomic work on India's plant diversity", sourceIds:[BSI] },
  { id:"env-cp016-bsi-flora", label:"BSI flora publications", statement:"BSI prepares national, state and district floras and maintains plant-related scientific collections and databases", sourceIds:[BSI] },
  { id:"env-cp016-bsi-hq", label:"BSI headquarters", statement:"Botanical Survey of India headquarters is in Kolkata", sourceIds:[BSI] },

  { id:"env-cp016-zsi-role", label:"Zoological Survey of India", statement:"ZSI is India's premier taxonomic research organization for survey, exploration, documentation and research on animal diversity", sourceIds:[ZSI] },
  { id:"env-cp016-zsi-fauna", label:"ZSI fauna documentation", statement:"ZSI documents the diversity and distribution of India's fauna and publishes faunal information", sourceIds:[ZSI] },
  { id:"env-cp016-zsi-hq", label:"ZSI headquarters", statement:"Zoological Survey of India headquarters is in Kolkata", sourceIds:[ZSI] },

  { id:"env-cp016-wii-status", label:"Wildlife Institute of India", statement:"WII is an autonomous institution of the Ministry of Environment, Forest and Climate Change established in Dehradun", sourceIds:[WII] },
  { id:"env-cp016-wii-role", label:"WII research and training", statement:"WII is a national institution for wildlife research, training, academic programmes and advisory work in wildlife conservation", sourceIds:[WII] },
  { id:"env-cp016-wii-hq", label:"WII location", statement:"Wildlife Institute of India is located at Dehradun, Uttarakhand", sourceIds:[WII] },
]);

export const ENV_CP016_FACT_IDS_V1 = new Set(ENV_CP016_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP016_FACT_BY_ID_V1 = new Map(ENV_CP016_FACT_ROWS_V1.map((row) => [row.id, row] as const));
