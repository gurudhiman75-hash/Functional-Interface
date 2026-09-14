export type EnvCp001TermRow = {
  id: string;
  term: string;
  definition: string;
  compactDefinition: string;
  contrastHint: string;
  levelRank?: number;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

export type EnvCp001ScenarioRow = {
  id: string;
  scenario: string;
  answerTerm: "Organism" | "Population" | "Community" | "Ecosystem";
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
};

const POP_SOURCE = "NCERT-BIOLOGY-XII-ORGANISMS-POPULATIONS";
const ECO_SOURCE = "NCERT-BIOLOGY-XII-ECOSYSTEM";

export const ENV_CP001_TERM_ROWS_V1: readonly EnvCp001TermRow[] = Object.freeze([
  {
    id: "ecology",
    term: "Ecology",
    definition: "the study of interactions among organisms and between organisms and their environment",
    compactDefinition: "study of organisms and their interactions with the environment",
    contrastHint: "It is a field of study, not a level of ecological organisation.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-ecology-definition"],
  },
  {
    id: "environment",
    term: "Environment",
    definition: "the biotic and abiotic surroundings and conditions that influence an organism",
    compactDefinition: "biotic and abiotic surroundings affecting an organism",
    contrastHint: "It includes both living and non-living surroundings.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-environment-definition"],
  },
  {
    id: "organism",
    term: "Organism",
    definition: "an individual living entity",
    compactDefinition: "one individual living entity",
    contrastHint: "It is the smallest level used in the ecological organisation sequence in this CP.",
    levelRank: 1,
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-organism-definition"],
  },
  {
    id: "species",
    term: "Species",
    definition: "a group of similar organisms whose members can interbreed naturally and produce fertile offspring",
    compactDefinition: "interbreeding group capable of producing fertile offspring",
    contrastHint: "A species is a biological grouping; a population is the members of one species in a particular area at a given time.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-species-definition"],
  },
  {
    id: "population",
    term: "Population",
    definition: "individuals of the same species living in a particular area at a given time",
    compactDefinition: "members of the same species living in one area",
    contrastHint: "Population requires the same species; a community contains populations of different species.",
    levelRank: 2,
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-population-definition"],
  },
  {
    id: "community",
    term: "Community",
    definition: "populations of different species living and interacting in the same area",
    compactDefinition: "different species populations living and interacting in one area",
    contrastHint: "A community includes living populations but does not by itself include the physical environment as a component.",
    levelRank: 3,
    sourceIds: [POP_SOURCE, ECO_SOURCE],
    sourceFactIds: ["env-cp001-community-definition"],
  },
  {
    id: "ecosystem",
    term: "Ecosystem",
    definition: "a functional unit in which a community of organisms interacts with the physical environment",
    compactDefinition: "a community interacting with its physical environment",
    contrastHint: "Unlike a community alone, an ecosystem explicitly includes interaction with abiotic surroundings.",
    levelRank: 4,
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-ecosystem-definition"],
  },
  {
    id: "biome",
    term: "Biome",
    definition: "a large ecological region characterised mainly by its climate and dominant vegetation",
    compactDefinition: "large ecological region defined mainly by climate and vegetation",
    contrastHint: "A biome contains many ecosystems; it is smaller in scope than the biosphere.",
    levelRank: 5,
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-biome-definition"],
  },
  {
    id: "biosphere",
    term: "Biosphere",
    definition: "the global zone of life containing all ecosystems on Earth",
    compactDefinition: "global zone of life containing all ecosystems",
    contrastHint: "It is the broadest ecological level in this CP.",
    levelRank: 6,
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-biosphere-definition"],
  },
  {
    id: "habitat",
    term: "Habitat",
    definition: "the natural place or surroundings in which an organism lives",
    compactDefinition: "place where an organism lives",
    contrastHint: "Habitat describes where an organism lives; niche describes how it lives and functions there.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-habitat-definition"],
  },
  {
    id: "ecological-niche",
    term: "Ecological niche",
    definition: "the functional role and position of an organism in its environment, including its resource use and interactions",
    compactDefinition: "functional role, resource use and interactions of an organism",
    contrastHint: "Niche is a role or way of life, not simply the physical place occupied.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-niche-definition"],
  },
  {
    id: "ecotone",
    term: "Ecotone",
    definition: "a transition zone where two ecological communities or ecosystems meet",
    compactDefinition: "transition zone between adjoining ecological communities or ecosystems",
    contrastHint: "The ecotone is the boundary zone itself; edge effect describes ecological changes seen at such a boundary.",
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-ecotone-definition"],
  },
  {
    id: "edge-effect",
    term: "Edge effect",
    definition: "the change in community structure at the boundary of two habitats, often including greater diversity or abundance than in adjoining areas",
    compactDefinition: "boundary-related change in community structure, often with greater diversity or abundance",
    contrastHint: "It describes an ecological pattern at an edge; it is not the name of the transition zone itself.",
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-edge-effect-definition"],
  },
]);

export const ENV_CP001_ORGANISATION_ROWS_V1 = Object.freeze(
  ENV_CP001_TERM_ROWS_V1
    .filter((row) => row.levelRank !== undefined)
    .sort((a, b) => (a.levelRank ?? 0) - (b.levelRank ?? 0)),
);

export const ENV_CP001_SCENARIO_ROWS_V1: readonly EnvCp001ScenarioRow[] = Object.freeze([
  {
    id: "single-tiger",
    scenario: "A single tiger living in a forest is considered at which ecological level?",
    answerTerm: "Organism",
    explanation: "One individual tiger is an organism. A population would require multiple tigers of the same species in the area.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-organism-definition", "env-cp001-population-definition"],
  },
  {
    id: "deer-in-grassland",
    scenario: "All chital deer living in one grassland at the same time form a:",
    answerTerm: "Population",
    explanation: "They are members of the same species living in the same area, so together they form a population.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-population-definition"],
  },
  {
    id: "fish-species-pond",
    scenario: "All individuals of one fish species living in a pond form a:",
    answerTerm: "Population",
    explanation: "Individuals of the same species occupying one area form a population.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-population-definition"],
  },
  {
    id: "forest-living-populations",
    scenario: "Trees, birds, insects and mammals living and interacting in a forest, considered without the soil, water and climate, form a:",
    answerTerm: "Community",
    explanation: "The living populations of different species together form a community. Adding their physical environment would make the unit an ecosystem.",
    sourceIds: [POP_SOURCE, ECO_SOURCE],
    sourceFactIds: ["env-cp001-community-definition", "env-cp001-ecosystem-definition"],
  },
  {
    id: "pond-living-plus-water",
    scenario: "The organisms in a pond together with water, minerals and other physical factors are considered as a:",
    answerTerm: "Ecosystem",
    explanation: "An ecosystem includes the living community and its interaction with the physical environment.",
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-ecosystem-definition"],
  },
  {
    id: "grassland-living-plus-soil",
    scenario: "Plants and animals of a grassland together with its soil, water and climate form a:",
    answerTerm: "Ecosystem",
    explanation: "Living organisms plus the physical environment and their interactions make an ecosystem.",
    sourceIds: [ECO_SOURCE],
    sourceFactIds: ["env-cp001-ecosystem-definition"],
  },
  {
    id: "mangrove-living-only",
    scenario: "Mangrove plants, fish, crabs and birds living together are considered only as living populations. This level is a:",
    answerTerm: "Community",
    explanation: "Different species populations living together make a community when the abiotic environment is not included as part of the unit.",
    sourceIds: [POP_SOURCE, ECO_SOURCE],
    sourceFactIds: ["env-cp001-community-definition"],
  },
  {
    id: "single-banyan",
    scenario: "One banyan tree in a park represents which ecological level?",
    answerTerm: "Organism",
    explanation: "A single living individual is an organism.",
    sourceIds: [POP_SOURCE],
    sourceFactIds: ["env-cp001-organism-definition"],
  },
]);

export const ENV_CP001_DISTINCTION_PAIRS_V1 = Object.freeze([
  ["Population", "Community"],
  ["Community", "Ecosystem"],
  ["Ecosystem", "Biome"],
  ["Biome", "Biosphere"],
  ["Habitat", "Ecological niche"],
  ["Ecotone", "Edge effect"],
] as const);

export function getEnvCp001TermByName(term: string) {
  const row = ENV_CP001_TERM_ROWS_V1.find((candidate) => candidate.term === term);
  if (!row) throw new Error(`Unknown ENV-CP-001 term: ${term}`);
  return row;
}
