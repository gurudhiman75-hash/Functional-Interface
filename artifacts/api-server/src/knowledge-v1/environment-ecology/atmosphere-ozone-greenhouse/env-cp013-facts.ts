export type EnvCp013FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const NASA_LAYERS = "NASA-EARTH-ATMOSPHERE-LAYERS";
const NASA_GHG = "NASA-GREENHOUSE-EFFECT";
const NASA_AIR = "NASA-ATMOSPHERE-COMPOSITION";
const EPA_OZONE = "US-EPA-OZONE-GOOD-BAD";
const EPA_ODS = "US-EPA-OZONE-DEPLETING-SUBSTANCES";
const UNEP_OZONE = "UNEP-OZONE-SECRETARIAT";

export const ENV_CP013_FACT_ROWS_V1: readonly EnvCp013FactRow[] = Object.freeze([
  { id: "env-cp013-layer-order", label: "Major atmospheric layers", statement: "from lowest to highest, the five major layers are troposphere, stratosphere, mesosphere, thermosphere and exosphere", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-troposphere-lowest", label: "Troposphere", statement: "the troposphere is the lowest major atmospheric layer and most weather occurs there", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-troposphere-water", label: "Tropospheric water vapour", statement: "the troposphere contains about 99 percent of atmospheric water vapour and aerosols", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-air-nitrogen", label: "Dry-air nitrogen", statement: "dry air is about 78 percent nitrogen by volume", sourceIds: [NASA_AIR] },
  { id: "env-cp013-air-oxygen", label: "Dry-air oxygen", statement: "dry air is about 21 percent oxygen by volume", sourceIds: [NASA_AIR] },
  { id: "env-cp013-stratosphere-ozone", label: "Stratospheric ozone", statement: "the stratosphere contains Earth's protective ozone layer", sourceIds: [NASA_LAYERS, EPA_OZONE] },
  { id: "env-cp013-stratosphere-temp", label: "Stratospheric temperature", statement: "temperature generally increases with altitude in the stratosphere because ozone absorbs ultraviolet radiation", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-mesosphere-meteors", label: "Mesosphere", statement: "most meteors burn up in the mesosphere", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-thermosphere-aurora", label: "Thermosphere", statement: "auroras can occur in the thermosphere", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-thermosphere-iss", label: "ISS orbit", statement: "the International Space Station orbits in the thermosphere", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-exosphere-highest", label: "Exosphere", statement: "the exosphere is the highest major atmospheric layer and merges gradually with space", sourceIds: [NASA_LAYERS] },
  { id: "env-cp013-ozone-formula", label: "Ozone formula", statement: "ozone consists of three oxygen atoms and has the chemical formula O3", sourceIds: [EPA_OZONE] },
  { id: "env-cp013-ozone-uv", label: "Ozone UV protection", statement: "stratospheric ozone absorbs harmful ultraviolet radiation from the Sun", sourceIds: [EPA_OZONE, UNEP_OZONE] },
  { id: "env-cp013-ground-ozone", label: "Ground-level ozone", statement: "ground-level ozone is harmful to breathe and is a major component of smog", sourceIds: [EPA_OZONE] },
  { id: "env-cp013-ground-ozone-formation", label: "Ground-level ozone formation", statement: "ground-level ozone forms from reactions involving nitrogen oxides and volatile organic compounds in sunlight", sourceIds: [EPA_OZONE] },
  { id: "env-cp013-ods-mechanism", label: "ODS mechanism", statement: "many ozone-depleting substances are stable in the troposphere, break down under intense ultraviolet light in the stratosphere, and release chlorine or bromine that depletes ozone", sourceIds: [EPA_ODS] },
  { id: "env-cp013-ods-examples", label: "ODS examples", statement: "ozone-depleting substances include CFCs, HCFCs, halons and methyl bromide", sourceIds: [EPA_ODS, UNEP_OZONE] },
  { id: "env-cp013-cfc", label: "CFCs", statement: "chlorofluorocarbons are ozone-depleting substances", sourceIds: [EPA_ODS, UNEP_OZONE] },
  { id: "env-cp013-halon", label: "Halons", statement: "halons are ozone-depleting substances that contain bromine", sourceIds: [EPA_ODS, UNEP_OZONE] },
  { id: "env-cp013-hfc-distinction", label: "HFC distinction", statement: "hydrofluorocarbons do not deplete the ozone layer but are powerful greenhouse gases", sourceIds: [UNEP_OZONE] },
  { id: "env-cp013-greenhouse-effect", label: "Greenhouse effect", statement: "the greenhouse effect is the process by which greenhouse gases trap heat near Earth's surface", sourceIds: [NASA_GHG] },
  { id: "env-cp013-natural-greenhouse", label: "Natural greenhouse effect", statement: "the natural greenhouse effect keeps Earth warmer than it would otherwise be and is important for life", sourceIds: [NASA_GHG] },
  { id: "env-cp013-ghg-list", label: "Greenhouse gases", statement: "greenhouse gases include water vapour, carbon dioxide, methane, nitrous oxide, ozone and chlorofluorocarbons", sourceIds: [NASA_GHG] },
  { id: "env-cp013-water-vapour-feedback", label: "Water-vapour feedback", statement: "water vapour is an important greenhouse gas and acts mainly as a feedback that amplifies warming", sourceIds: [NASA_GHG] },
  { id: "env-cp013-co2-role", label: "Carbon dioxide", statement: "carbon dioxide is a greenhouse gas that absorbs outgoing heat and contributes to the greenhouse effect", sourceIds: [NASA_GHG] },
]);

export const ENV_CP013_FACT_IDS_V1 = new Set(ENV_CP013_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP013_FACT_BY_ID_V1 = new Map(ENV_CP013_FACT_ROWS_V1.map((row) => [row.id, row] as const));