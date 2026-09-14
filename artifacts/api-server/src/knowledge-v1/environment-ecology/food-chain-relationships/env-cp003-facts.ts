export type EnvCp003FactRow = { id: string; label: string; statement: string; sourceIds: readonly string[] };
const SRC = "NCERT-BIOLOGY-XII-ECOSYSTEM";
export const ENV_CP003_FACT_ROWS_V1: readonly EnvCp003FactRow[] = Object.freeze([
  {id:"env-cp003-food-chain",label:"Food chain",statement:"a linear sequence showing transfer of food and energy from one organism to another",sourceIds:[SRC]},
  {id:"env-cp003-food-web",label:"Food web",statement:"a network of interconnected food chains",sourceIds:[SRC]},
  {id:"env-cp003-grazing-chain",label:"Grazing food chain",statement:"a food chain that starts with living green plants",sourceIds:[SRC]},
  {id:"env-cp003-detritus-chain",label:"Detritus food chain",statement:"a food chain that starts with dead organic matter",sourceIds:[SRC]},
  {id:"env-cp003-producer-trophic",label:"First trophic level",statement:"producers occupy the first trophic level",sourceIds:[SRC]},
  {id:"env-cp003-primary-consumer",label:"Second trophic level",statement:"primary consumers generally occupy the second trophic level",sourceIds:[SRC]},
  {id:"env-cp003-secondary-consumer",label:"Third trophic level",statement:"secondary consumers generally occupy the third trophic level",sourceIds:[SRC]},
  {id:"env-cp003-energy-flow",label:"Energy flow",statement:"energy flows one way from producers to consumers and is lost as heat at successive transfers",sourceIds:[SRC]},
  {id:"env-cp003-energy-pyramid",label:"Pyramid of energy",statement:"the pyramid of energy is always upright",sourceIds:[SRC]},
  {id:"env-cp003-number-pyramid",label:"Pyramid of numbers",statement:"the pyramid of numbers may be upright or inverted depending on the ecosystem",sourceIds:[SRC]},
  {id:"env-cp003-biomass-pyramid",label:"Pyramid of biomass",statement:"the biomass pyramid may be upright or inverted depending on the ecosystem",sourceIds:[SRC]},
  {id:"env-cp003-predation",label:"Predation",statement:"an interaction in which one organism kills and feeds on another",sourceIds:[SRC]},
]);
export const ENV_CP003_FACT_IDS_V1 = new Set(ENV_CP003_FACT_ROWS_V1.map((row)=>row.id));