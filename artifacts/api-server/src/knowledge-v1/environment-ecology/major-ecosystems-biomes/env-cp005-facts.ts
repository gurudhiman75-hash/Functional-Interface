export type EnvCp005FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const BIO_SOURCE = "NCERT-BIOLOGY-XII-ECOLOGY";

export const ENV_CP005_FACT_ROWS_V1: readonly EnvCp005FactRow[] = Object.freeze([
  { id: "env-cp005-forest", label: "Forest ecosystem", statement: "terrestrial ecosystem dominated by trees and other woody vegetation", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-grassland", label: "Grassland ecosystem", statement: "terrestrial ecosystem dominated mainly by grasses with relatively fewer trees", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-desert", label: "Desert ecosystem", statement: "ecosystem characterised mainly by very low precipitation and sparse vegetation", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-freshwater", label: "Freshwater ecosystem", statement: "aquatic ecosystem with low salinity, including lakes, ponds, rivers and streams", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-marine", label: "Marine ecosystem", statement: "saltwater ecosystem including seas and oceans", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-tundra", label: "Tundra biome", statement: "very cold, largely treeless biome with a short growing season and commonly permafrost", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-taiga", label: "Taiga biome", statement: "cold boreal forest biome dominated largely by coniferous trees", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-permafrost", label: "Permafrost", statement: "ground that remains frozen for long periods and is a characteristic feature of tundra regions", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-salinity", label: "Salinity contrast", statement: "freshwater ecosystems have low salinity while marine ecosystems have much higher salinity", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-desert-temperature", label: "Desert climate", statement: "deserts are defined primarily by low precipitation and may be hot or cold", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-grassland-trees", label: "Grassland vegetation", statement: "grasses dominate because tree cover is limited compared with forests", sourceIds: [BIO_SOURCE] },
  { id: "env-cp005-forest-tree-cover", label: "Forest vegetation", statement: "trees form the dominant structural vegetation in forest ecosystems", sourceIds: [BIO_SOURCE] },
]);

export const ENV_CP005_FACT_IDS_V1 = new Set(ENV_CP005_FACT_ROWS_V1.map((row) => row.id));
