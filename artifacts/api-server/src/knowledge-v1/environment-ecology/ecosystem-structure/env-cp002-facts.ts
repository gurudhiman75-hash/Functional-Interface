export type EnvCp002FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const ECO_SOURCE = "NCERT-BIOLOGY-XII-ECOSYSTEM";

export const ENV_CP002_FACT_ROWS_V1: readonly EnvCp002FactRow[] = Object.freeze([
  {
    id: "env-cp002-biotic-components",
    label: "Biotic components",
    statement: "living parts of an ecosystem, including plants, animals and microorganisms",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-abiotic-components",
    label: "Abiotic components",
    statement: "non-living physical and chemical factors such as light, temperature, water, soil and minerals",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-producers",
    label: "Producers",
    statement: "autotrophic organisms that synthesize organic matter from inorganic substances using an external energy source",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-consumers",
    label: "Consumers",
    statement: "heterotrophic organisms that obtain organic food by feeding on other organisms or their products",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-decomposers",
    label: "Decomposers",
    statement: "mainly bacteria and fungi that chemically break down dead organic matter into simpler substances",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-nutrient-return",
    label: "Nutrient return",
    statement: "decomposition releases simpler inorganic nutrients from dead organic matter for reuse in the ecosystem",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-autotrophs",
    label: "Autotrophs",
    statement: "organisms that synthesize their own organic food from inorganic substances",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-heterotrophs",
    label: "Heterotrophs",
    statement: "organisms that depend on organic matter made by other organisms",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-herbivores",
    label: "Herbivores",
    statement: "consumers that feed mainly on plant material",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-carnivores",
    label: "Carnivores",
    statement: "consumers that feed on other animals",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-omnivores",
    label: "Omnivores",
    statement: "consumers that use both plant and animal food",
    sourceIds: [ECO_SOURCE],
  },
  {
    id: "env-cp002-detritivores",
    label: "Detritivores",
    statement: "organisms that ingest dead organic matter and help fragment detritus",
    sourceIds: [ECO_SOURCE],
  },
]);

export const ENV_CP002_FACT_IDS_V1 = new Set(
  ENV_CP002_FACT_ROWS_V1.map((row) => row.id),
);
