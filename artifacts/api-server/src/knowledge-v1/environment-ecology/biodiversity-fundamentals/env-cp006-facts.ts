export type EnvCp006FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const BIO_SOURCE = "NCERT-BIOLOGY-XII-BIODIVERSITY";

export const ENV_CP006_FACT_ROWS_V1: readonly EnvCp006FactRow[] = Object.freeze([
  { id: "env-cp006-biodiversity", label: "Biodiversity", statement: "variety and variability of living organisms considered at genetic, species and ecosystem levels", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-genetic-diversity", label: "Genetic diversity", statement: "variation in genes within a species or among its populations", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-species-diversity", label: "Species diversity", statement: "diversity expressed at the level of species in a community or region", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-ecosystem-diversity", label: "Ecosystem diversity", statement: "variety of ecosystems, habitats and ecological communities within a region", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-species-richness", label: "Species richness", statement: "number of different species present in a defined area", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-native", label: "Native species", statement: "species that occurs naturally in a region without human introduction", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-endemic", label: "Endemic species", statement: "native species naturally restricted to a particular geographic area", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-alien", label: "Alien or exotic species", statement: "species introduced outside its natural range", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-invasive", label: "Invasive alien species", statement: "alien species whose establishment or spread causes or is likely to cause ecological harm", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-alien-not-always-invasive", label: "Alien versus invasive", statement: "not every alien species becomes invasive", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-keystone", label: "Keystone species", statement: "species with an ecological effect disproportionately large relative to its abundance", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-flagship", label: "Flagship species", statement: "species selected as a symbol to build public awareness and support for conservation", sourceIds: [BIO_SOURCE] },
  { id: "env-cp006-flagship-keystone-distinction", label: "Flagship versus keystone", statement: "flagship status concerns conservation communication, whereas keystone status concerns ecological effect", sourceIds: [BIO_SOURCE] },
]);

export const ENV_CP006_FACT_IDS_V1 = new Set(ENV_CP006_FACT_ROWS_V1.map((row) => row.id));
