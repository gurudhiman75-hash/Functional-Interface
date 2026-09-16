export type EnvCp014FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const IPCC_SYR = "IPCC-AR6-SYNTHESIS";
const IPCC_WGI = "IPCC-AR6-WGI-SPM";
const NASA_EVIDENCE = "NASA-CLIMATE-EVIDENCE";
const NASA_SEA_LEVEL = "NASA-SEA-LEVEL";
const UNFCCC_MITIGATION = "UNFCCC-MITIGATION";
const UNFCCC_ADAPTATION = "UNFCCC-ADAPTATION";

export const ENV_CP014_FACT_ROWS_V1: readonly EnvCp014FactRow[] = Object.freeze([
  { id:"env-cp014-human-warming", label:"Human-caused warming", statement:"human activities, principally through greenhouse-gas emissions, have unequivocally caused global warming", sourceIds:[IPCC_SYR, IPCC_WGI] },
  { id:"env-cp014-ghg-sources", label:"Human greenhouse-gas sources", statement:"fossil-fuel use and land-use change are major human sources of greenhouse-gas emissions", sourceIds:[IPCC_SYR] },
  { id:"env-cp014-system-warming", label:"Climate-system warming", statement:"human influence has warmed the atmosphere, ocean and land", sourceIds:[IPCC_WGI] },
  { id:"env-cp014-temperature-evidence", label:"Rising global temperature", statement:"global average surface temperature has risen since the late nineteenth century", sourceIds:[NASA_EVIDENCE] },
  { id:"env-cp014-sea-level-causes", label:"Sea-level rise causes", statement:"global sea-level rise is driven mainly by warming seawater expanding and by added water from melting land ice", sourceIds:[NASA_SEA_LEVEL] },
  { id:"env-cp014-land-ice", label:"Land ice and sea level", statement:"melting glaciers and ice sheets on land add water to the ocean and raise sea level", sourceIds:[NASA_SEA_LEVEL, NASA_EVIDENCE] },
  { id:"env-cp014-sea-ice-distinction", label:"Sea ice distinction", statement:"melting floating sea ice is not a main direct cause of global sea-level rise, unlike melting land ice", sourceIds:[NASA_SEA_LEVEL] },
  { id:"env-cp014-glacier-loss", label:"Glacier and ice-sheet loss", statement:"shrinking glaciers and loss of ice-sheet mass are observed indicators of a warming climate", sourceIds:[NASA_EVIDENCE] },
  { id:"env-cp014-hot-extremes", label:"Hot extremes", statement:"hot extremes including heatwaves have become more frequent and intense across most land regions, with human influence a main driver", sourceIds:[IPCC_WGI] },
  { id:"env-cp014-heavy-rain", label:"Heavy precipitation", statement:"heavy precipitation generally becomes more intense with increasing global warming", sourceIds:[IPCC_WGI] },
  { id:"env-cp014-ocean-warming", label:"Ocean warming", statement:"the ocean has warmed as part of human-caused climate change", sourceIds:[IPCC_WGI, NASA_EVIDENCE] },
  { id:"env-cp014-ocean-acidification", label:"Ocean acidification", statement:"absorption of carbon dioxide by seawater increases acidity and lowers ocean pH", sourceIds:[IPCC_WGI, NASA_EVIDENCE] },
  { id:"env-cp014-impacts", label:"Climate impacts", statement:"climate change is already affecting ecosystems, water, food security, human health and societies", sourceIds:[IPCC_SYR] },
  { id:"env-cp014-mitigation-definition", label:"Mitigation", statement:"climate-change mitigation reduces greenhouse-gas emissions or enhances greenhouse-gas sinks", sourceIds:[UNFCCC_MITIGATION] },
  { id:"env-cp014-mitigation-examples", label:"Mitigation examples", statement:"renewable energy, energy efficiency and protecting or restoring forests can reduce emissions or enhance sinks", sourceIds:[UNFCCC_MITIGATION, IPCC_SYR] },
  { id:"env-cp014-adaptation-definition", label:"Adaptation", statement:"adaptation adjusts ecological, social or economic systems to actual or expected climate impacts in order to reduce harm or vulnerability", sourceIds:[UNFCCC_ADAPTATION] },
  { id:"env-cp014-adaptation-examples", label:"Adaptation examples", statement:"flood defences, early-warning systems and drought-resilient crops are examples of climate adaptation", sourceIds:[UNFCCC_ADAPTATION] },
  { id:"env-cp014-mitigation-adaptation", label:"Mitigation versus adaptation", statement:"mitigation acts mainly on the causes of climate change, while adaptation acts mainly on its impacts and vulnerability", sourceIds:[UNFCCC_MITIGATION, UNFCCC_ADAPTATION] },
  { id:"env-cp014-carbon-sinks", label:"Carbon sinks", statement:"forests and oceans are important carbon sinks because they remove carbon dioxide from the atmosphere", sourceIds:[IPCC_SYR, UNFCCC_MITIGATION] },
  { id:"env-cp014-enhance-sinks", label:"Enhancing sinks", statement:"increasing or protecting carbon sinks is a form of mitigation", sourceIds:[UNFCCC_MITIGATION] },
]);

export const ENV_CP014_FACT_IDS_V1 = new Set(ENV_CP014_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP014_FACT_BY_ID_V1 = new Map(ENV_CP014_FACT_ROWS_V1.map((row) => [row.id, row] as const));
