export type EnvCp004FactRow={id:string;label:string;statement:string;sourceIds:readonly string[]};
const SRC="NCERT-BIOLOGY-XII-ECOSYSTEM";
export const ENV_CP004_FACT_ROWS_V1:readonly EnvCp004FactRow[]=Object.freeze([
{id:"env-cp004-carbon-photosynthesis",label:"Carbon uptake",statement:"photosynthesis removes carbon dioxide from air or water and incorporates carbon into organic matter",sourceIds:[SRC]},
{id:"env-cp004-carbon-respiration",label:"Carbon release",statement:"respiration releases carbon dioxide back to the environment",sourceIds:[SRC]},
{id:"env-cp004-carbon-decomposition",label:"Decomposition",statement:"decomposition returns carbon from dead organic matter to the environment",sourceIds:[SRC]},
{id:"env-cp004-water-evaporation",label:"Evaporation",statement:"liquid water changes to water vapour",sourceIds:[SRC]},
{id:"env-cp004-water-condensation",label:"Condensation",statement:"water vapour changes into liquid droplets",sourceIds:[SRC]},
{id:"env-cp004-water-precipitation",label:"Precipitation",statement:"water falls from the atmosphere as rain, snow or similar forms",sourceIds:[SRC]},
{id:"env-cp004-water-transpiration",label:"Transpiration",statement:"plants release water vapour mainly through leaves",sourceIds:[SRC]},
{id:"env-cp004-oxygen-photosynthesis",label:"Oxygen release",statement:"photosynthesis releases oxygen",sourceIds:[SRC]},
{id:"env-cp004-oxygen-respiration",label:"Oxygen use",statement:"aerobic respiration consumes oxygen",sourceIds:[SRC]},
{id:"env-cp004-nitrogen-fixation",label:"Nitrogen fixation",statement:"atmospheric nitrogen is converted into biologically usable nitrogen compounds",sourceIds:[SRC]},
{id:"env-cp004-ammonification",label:"Ammonification",statement:"organic nitrogen in dead matter and wastes is converted to ammonia or ammonium",sourceIds:[SRC]},
{id:"env-cp004-nitrification",label:"Nitrification",statement:"ammonia or ammonium is oxidised first to nitrite and then to nitrate",sourceIds:[SRC]},
{id:"env-cp004-denitrification",label:"Denitrification",statement:"nitrate is reduced to gaseous nitrogen and returned to the atmosphere",sourceIds:[SRC]},
{id:"env-cp004-phosphorus",label:"Phosphorus cycle",statement:"the phosphorus cycle is mainly sedimentary and has no major atmospheric gaseous phase",sourceIds:[SRC]},
]);
export const ENV_CP004_FACT_IDS_V1=new Set(ENV_CP004_FACT_ROWS_V1.map(r=>r.id));