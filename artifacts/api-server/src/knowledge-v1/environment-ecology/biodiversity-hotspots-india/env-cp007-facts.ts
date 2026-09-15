export type EnvCp007FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
  factStability: "stable" | "updateSensitive";
};

const CI_SOURCE = "CONSERVATION-INTERNATIONAL-BIODIVERSITY-HOTSPOTS";
const MOEFCC_SOURCE = "MOEFCC-INDIA-BIODIVERSITY-HOTSPOTS";

export const ENV_CP007_FACT_ROWS_V1: readonly EnvCp007FactRow[] = Object.freeze([
  { id: "env-cp007-hotspot-concept", label: "Biodiversity hotspot", statement: "region with exceptional biological endemism that has also suffered severe habitat loss", sourceIds: [CI_SOURCE], factStability: "stable" },
  { id: "env-cp007-endemic-threshold", label: "Endemic plant criterion", statement: "a hotspot must contain at least 1,500 endemic vascular plant species", sourceIds: [CI_SOURCE], factStability: "stable" },
  { id: "env-cp007-loss-threshold", label: "Habitat-loss criterion", statement: "a hotspot must have lost at least 70 percent of its original natural vegetation", sourceIds: [CI_SOURCE], factStability: "stable" },
  { id: "env-cp007-remaining-threshold", label: "Vegetation remaining", statement: "losing at least 70 percent means 30 percent or less of original natural vegetation remains", sourceIds: [CI_SOURCE], factStability: "stable" },
  { id: "env-cp007-both-criteria", label: "Both criteria required", statement: "a region must meet both the endemic-plant threshold and the habitat-loss threshold to qualify", sourceIds: [CI_SOURCE], factStability: "stable" },
  { id: "env-cp007-india-four", label: "India hotspot representation", statement: "India is represented in the Himalaya, Indo-Burma, Western Ghats-Sri Lanka and Sundaland global biodiversity hotspots", sourceIds: [MOEFCC_SOURCE], factStability: "stable" },
  { id: "env-cp007-himalaya", label: "Himalaya", statement: "the Himalaya global biodiversity hotspot is represented in India", sourceIds: [MOEFCC_SOURCE], factStability: "stable" },
  { id: "env-cp007-indo-burma", label: "Indo-Burma", statement: "parts of north-eastern India, including areas of Assam and Meghalaya, form part of the Indo-Burma global biodiversity hotspot", sourceIds: [MOEFCC_SOURCE], factStability: "stable" },
  { id: "env-cp007-western-ghats", label: "Western Ghats-Sri Lanka", statement: "the Western Ghats in India form part of the Western Ghats-Sri Lanka global biodiversity hotspot", sourceIds: [MOEFCC_SOURCE], factStability: "stable" },
  { id: "env-cp007-sundaland", label: "Sundaland", statement: "the Nicobar Islands form the Indian representation of the Sundaland global biodiversity hotspot", sourceIds: [MOEFCC_SOURCE], factStability: "stable" },
  { id: "env-cp007-global-count", label: "Worldwide hotspot count", statement: "the worldwide count of recognized hotspots can change with future framework updates and must not be a direct V1 review target", sourceIds: [CI_SOURCE], factStability: "updateSensitive" },
]);

export const ENV_CP007_FACT_IDS_V1 = new Set(ENV_CP007_FACT_ROWS_V1.map((row) => row.id));
