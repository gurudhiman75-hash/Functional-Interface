import { assignNamesForClues } from "../foundation/name-registry";
import { relationLabel } from "../foundation/relation-ontology";
import { SeededRandom } from "../foundation/prng";
import type { BlrRelationId, DirectRelationClue } from "../foundation/types";
import type { BlrCp001AdvancedPrototypeId } from "./advanced-prototype-types";

export interface BlrCp001AdvancedScenarioTemplate {
  scenarioId: string;
  clues: readonly DirectRelationClue[];
  branchingQuery?: {
    subjectId: string;
    referenceId: string;
    expectedRelationId: BlrRelationId;
  };
}

function clue(
  subjectId: string,
  relationId: DirectRelationClue["relationId"],
  referenceId: string,
): DirectRelationClue {
  return { subjectId, relationId, referenceId };
}

const BRANCHING_PATERNAL: BlrCp001AdvancedScenarioTemplate = {
  scenarioId: "branching-paternal-cousins",
  clues: [
    clue("B", "SON", "A"),
    clue("C", "DAUGHTER", "A"),
    clue("D", "SON", "B"),
    clue("E", "DAUGHTER", "C"),
  ],
  branchingQuery: {
    subjectId: "D",
    referenceId: "E",
    expectedRelationId: "COUSIN",
  },
};

const BRANCHING_MATERNAL: BlrCp001AdvancedScenarioTemplate = {
  scenarioId: "branching-maternal-cousins",
  clues: [
    clue("B", "DAUGHTER", "A"),
    clue("C", "SON", "A"),
    clue("D", "DAUGHTER", "B"),
    clue("E", "SON", "C"),
  ],
  branchingQuery: {
    subjectId: "D",
    referenceId: "E",
    expectedRelationId: "COUSIN",
  },
};

const IN_LAW_BRANCH: BlrCp001AdvancedScenarioTemplate = {
  scenarioId: "in-law-two-child-branch",
  clues: [
    clue("A", "FATHER", "B"),
    clue("C", "HUSBAND", "B"),
    clue("D", "SON", "B"),
    clue("E", "DAUGHTER", "B"),
    clue("D", "SON", "C"),
    clue("E", "DAUGHTER", "C"),
  ],
};

const UNCLE_SPOUSE_BRANCH: BlrCp001AdvancedScenarioTemplate = {
  scenarioId: "brothers-spouse-cousin-branch",
  clues: [
    clue("B", "SON", "A"),
    clue("C", "SON", "A"),
    clue("D", "WIFE", "B"),
    clue("E", "DAUGHTER", "B"),
    clue("F", "SON", "C"),
  ],
};

const AUNT_SPOUSE_BRANCH: BlrCp001AdvancedScenarioTemplate = {
  scenarioId: "sisters-spouse-cousin-branch",
  clues: [
    clue("B", "DAUGHTER", "A"),
    clue("C", "DAUGHTER", "A"),
    clue("D", "HUSBAND", "B"),
    clue("E", "SON", "B"),
    clue("F", "DAUGHTER", "C"),
  ],
};

const ALL_SCENARIOS = [
  BRANCHING_PATERNAL,
  BRANCHING_MATERNAL,
  IN_LAW_BRANCH,
  UNCLE_SPOUSE_BRANCH,
  AUNT_SPOUSE_BRANCH,
] as const;

export function advancedScenariosFor(
  prototypeId: BlrCp001AdvancedPrototypeId,
): readonly BlrCp001AdvancedScenarioTemplate[] {
  if (prototypeId === "BLR-CP001-PROT-BRANCHING-RELATION") {
    return [BRANCHING_PATERNAL, BRANCHING_MATERNAL];
  }
  return ALL_SCENARIOS;
}

export function assignAdvancedNames(
  template: BlrCp001AdvancedScenarioTemplate,
  random: SeededRandom,
): Readonly<Record<string, string>> {
  return assignNamesForClues(template.clues, random);
}

export function formatAdvancedClue(
  entry: DirectRelationClue,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[entry.subjectId]} is the ${relationLabel(entry.relationId).toLocaleLowerCase("en-IN")} of ${names[entry.referenceId]}.`;
}

export function buildAdvancedStem(
  clues: readonly DirectRelationClue[],
  names: Readonly<Record<string, string>>,
  question: string,
  random: SeededRandom,
): string {
  const openings = [
    "Study the following family information carefully.",
    "Read the statements about this family and answer the question.",
    "Use the family relations given below.",
    "Consider the following information about a family.",
  ] as const;

  return [
    random.pick(openings),
    ...clues.map((entry) => formatAdvancedClue(entry, names)),
    question,
  ].join(" ");
}
