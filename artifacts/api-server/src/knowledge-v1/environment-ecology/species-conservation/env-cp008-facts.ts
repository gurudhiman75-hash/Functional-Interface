export type EnvCp008FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
  factStability: "stable";
  sourceVerifiedAt: "2026-09-15";
};

const IUCN = "IUCN-RED-LIST-CATEGORIES";
const CBD = "CBD-IN-SITU-EX-SITU";
const IUCN_EX_SITU = "IUCN-EX-SITU-GUIDELINES";

export const ENV_CP008_FACT_ROWS_V1: readonly EnvCp008FactRow[] = Object.freeze([
  { id:"env-cp008-red-list-purpose", label:"IUCN Red List", statement:"system for classifying species according to extinction risk", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-threatened", label:"Threatened categories", statement:"Critically Endangered, Endangered and Vulnerable are collectively the threatened IUCN categories", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-cr", label:"Critically Endangered", statement:"CR indicates an extremely high risk of extinction in the wild", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-en", label:"Endangered", statement:"EN indicates a very high risk of extinction in the wild", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-vu", label:"Vulnerable", statement:"VU indicates a high risk of extinction in the wild", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-risk-order", label:"Threatened risk order", statement:"among CR, EN and VU, extinction risk decreases from CR to EN to VU", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-ex", label:"Extinct", statement:"EX means there is no reasonable doubt that the last individual has died", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-ew", label:"Extinct in the Wild", statement:"EW means the taxon survives only in cultivation, captivity or qualifying populations outside its past range", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-nt", label:"Near Threatened", statement:"NT does not qualify as threatened now but is close to qualifying or likely to qualify in the near future", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-lc", label:"Least Concern", statement:"LC has been evaluated and does not qualify for CR, EN, VU or NT", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-dd", label:"Data Deficient", statement:"DD means available information is inadequate for a proper extinction-risk assessment", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-ne", label:"Not Evaluated", statement:"NE means the taxon has not yet been evaluated against the IUCN criteria", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-abbreviations", label:"IUCN abbreviations", statement:"official abbreviations include EX, EW, CR, EN, VU, NT, LC, DD and NE", sourceIds:[IUCN], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-in-situ", label:"In-situ conservation", statement:"conservation of ecosystems and natural habitats and maintenance or recovery of viable populations in natural surroundings", sourceIds:[CBD], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-ex-situ", label:"Ex-situ conservation", statement:"conservation of components of biological diversity outside their natural habitats", sourceIds:[CBD,IUCN_EX_SITU], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-ex-situ-examples", label:"Ex-situ examples", statement:"zoos, botanical gardens, seed or gene banks and captive breeding are standard ex-situ approaches", sourceIds:[CBD,IUCN_EX_SITU], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
  { id:"env-cp008-complement", label:"Conservation relationship", statement:"ex-situ measures can complement in-situ conservation and support recovery or reintroduction", sourceIds:[CBD,IUCN_EX_SITU], factStability:"stable", sourceVerifiedAt:"2026-09-15" },
]);

export const ENV_CP008_FACT_IDS_V1 = new Set(ENV_CP008_FACT_ROWS_V1.map((row) => row.id));
