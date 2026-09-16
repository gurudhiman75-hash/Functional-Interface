export type EnvCp019FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const MOEF_WETLANDS = "MOEFCC-WETLANDS-DEFINITION";
const MOEF_RAMSAR = "MOEFCC-RAMSAR-INDIA";
const MOEF_FACTSHEETS = "MOEFCC-RAMSAR-FACTSHEETS";
const RSIS_INDIA = "RAMSAR-RSIS-INDIA";
const RSIS_CHILIKA = "RAMSAR-RSIS-CHILIKA";
const RSIS_KEOLADEO = "RAMSAR-RSIS-KEOLADEO";
const RSIS_LOKTAK = "RAMSAR-RSIS-LOKTAK";
const RSIS_WULAR = "RAMSAR-RSIS-WULAR";
const RSIS_EKW = "RAMSAR-RSIS-EAST-KOLKATA";
const RSIS_DEEPOR = "RAMSAR-RSIS-DEEPOR-BEEL";

export const ENV_CP019_FACT_ROWS_V1: readonly EnvCp019FactRow[] = Object.freeze([
  { id:"env-cp019-wetland-definition", label:"Ramsar wetland definition", statement:"Wetlands include natural or artificial, permanent or temporary areas of marsh, fen, peatland or water, with static or flowing fresh, brackish or salt water; shallow marine areas up to six metres deep at low tide are also included", sourceIds:[MOEF_WETLANDS] },
  { id:"env-cp019-wetland-types", label:"Broad wetland types", statement:"Wetlands may be inland, coastal/marine or human-made; examples include lakes, rivers, floodplains, mangroves, lagoons, rice fields and salt pans", sourceIds:[MOEF_WETLANDS] },
  { id:"env-cp019-wetland-services", label:"Wetland ecosystem services", statement:"Wetlands provide ecosystem services such as water storage, flood moderation, biodiversity habitat, nutrient cycling and livelihood support", sourceIds:[MOEF_WETLANDS] },

  { id:"env-cp019-india-party", label:"India joins Ramsar", statement:"India became a Contracting Party to the Ramsar Convention on 1 February 1982", sourceIds:[MOEF_RAMSAR] },
  { id:"env-cp019-first-sites", label:"India first Ramsar sites", statement:"Chilika Lake in Odisha and Keoladeo National Park in Rajasthan were the first two Indian sites placed on the Ramsar List", sourceIds:[MOEF_RAMSAR,RSIS_INDIA] },
  { id:"env-cp019-first-date", label:"First Indian designation date", statement:"Chilika Lake and Keoladeo National Park carry the designation date 1 October 1981 in the Ramsar Sites Information Service", sourceIds:[RSIS_CHILIKA,RSIS_KEOLADEO] },

  { id:"env-cp019-chilika-location", label:"Chilika location", statement:"Chilika Lake is a Ramsar Site in Odisha", sourceIds:[RSIS_CHILIKA,MOEF_FACTSHEETS] },
  { id:"env-cp019-chilika-type", label:"Chilika type", statement:"Chilika is a brackish lagoon separated from the Bay of Bengal by a sandy ridge and connected to the sea", sourceIds:[RSIS_CHILIKA] },
  { id:"env-cp019-chilika-montreux", label:"Chilika Montreux history", statement:"Chilika Lake was added to the Montreux Record in 1993 because of ecological degradation and was removed in 2002 after rehabilitation", sourceIds:[RSIS_CHILIKA] },

  { id:"env-cp019-keoladeo-location", label:"Keoladeo location", statement:"Keoladeo National Park is a Ramsar Site in Rajasthan", sourceIds:[RSIS_KEOLADEO,MOEF_FACTSHEETS] },
  { id:"env-cp019-keoladeo-montreux", label:"Keoladeo Montreux history", statement:"Keoladeo National Park was placed on the Montreux Record in 1990 because of ecological-character concerns including water-management problems", sourceIds:[RSIS_KEOLADEO] },

  { id:"env-cp019-loktak-location", label:"Loktak location", statement:"Loktak Lake is a Ramsar Site in Manipur", sourceIds:[RSIS_LOKTAK,MOEF_FACTSHEETS] },
  { id:"env-cp019-loktak-phumdis", label:"Loktak phumdis", statement:"Loktak Lake is noted for floating masses of vegetation and organic matter known as phumdis", sourceIds:[RSIS_LOKTAK] },
  { id:"env-cp019-loktak-keibul", label:"Loktak Keibul Lamjao", statement:"Keibul Lamjao National Park lies in the Loktak Lake system and is associated with the Sangai deer", sourceIds:[RSIS_LOKTAK] },

  { id:"env-cp019-wular-location", label:"Wular location", statement:"Wular Lake is a Ramsar Site in Jammu and Kashmir", sourceIds:[RSIS_WULAR,MOEF_FACTSHEETS] },
  { id:"env-cp019-wular-type", label:"Wular type", statement:"Wular is a large freshwater lake associated with the Jhelum River system", sourceIds:[RSIS_WULAR] },

  { id:"env-cp019-harike-location", label:"Harike location", statement:"Harike Lake is a Ramsar Site in Punjab", sourceIds:[MOEF_FACTSHEETS,RSIS_INDIA] },
  { id:"env-cp019-harike-confluence", label:"Harike confluence", statement:"Harike Wetland lies near the confluence of the Beas and Sutlej rivers in Punjab", sourceIds:[MOEF_FACTSHEETS] },
  { id:"env-cp019-punjab-sites", label:"Punjab Ramsar examples", statement:"Harike Lake, Kanjli, Ropar, Beas Conservation Reserve, Keshopur-Miani Community Reserve and Nangal Wildlife Sanctuary are Ramsar Sites in Punjab", sourceIds:[MOEF_FACTSHEETS,RSIS_INDIA] },

  { id:"env-cp019-deepor-location", label:"Deepor Beel location", statement:"Deepor Beel is a Ramsar Site in Assam near Guwahati", sourceIds:[RSIS_DEEPOR,MOEF_FACTSHEETS] },
  { id:"env-cp019-deepor-type", label:"Deepor Beel type", statement:"Deepor Beel is a permanent freshwater lake in a former channel of the Brahmaputra River", sourceIds:[RSIS_DEEPOR] },
  { id:"env-cp019-ekw-location", label:"East Kolkata Wetlands location", statement:"East Kolkata Wetlands is a Ramsar Site in West Bengal", sourceIds:[RSIS_EKW,MOEF_FACTSHEETS] },
  { id:"env-cp019-ekw-wastewater", label:"East Kolkata Wetlands function", statement:"East Kolkata Wetlands is noted for large-scale use of urban wastewater in fisheries and agriculture through resource-recovery practices", sourceIds:[RSIS_EKW] },

  { id:"env-cp019-sambhar", label:"Sambhar Lake", statement:"Sambhar Lake is a Ramsar Site in Rajasthan and is a large inland saline lake", sourceIds:[RSIS_INDIA,MOEF_FACTSHEETS] },
  { id:"env-cp019-kolleru", label:"Kolleru Lake", statement:"Kolleru Lake is a Ramsar Site in Andhra Pradesh and is a major freshwater wetland", sourceIds:[RSIS_INDIA,MOEF_FACTSHEETS] },
  { id:"env-cp019-vembanad", label:"Vembanad-Kol", statement:"Vembanad-Kol Wetland is a Ramsar Site in Kerala", sourceIds:[RSIS_INDIA,MOEF_FACTSHEETS] },
  { id:"env-cp019-tsomoriri", label:"Tsomoriri", statement:"Tsomoriri is a high-altitude Ramsar wetland in Ladakh", sourceIds:[RSIS_INDIA,MOEF_FACTSHEETS] },

  { id:"env-cp019-montreux-concept", label:"Montreux Record", statement:"The Montreux Record identifies Ramsar Sites where changes in ecological character have occurred, are occurring or are likely to occur, helping focus conservation attention", sourceIds:["RAMSAR-MONTREUX-GUIDELINES"] },
]);

export const ENV_CP019_FACT_IDS_V1 = new Set(ENV_CP019_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP019_FACT_BY_ID_V1 = new Map(ENV_CP019_FACT_ROWS_V1.map((row) => [row.id, row] as const));
