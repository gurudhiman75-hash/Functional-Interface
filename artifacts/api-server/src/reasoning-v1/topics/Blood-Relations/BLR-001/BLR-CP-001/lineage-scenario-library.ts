import { assignNamesForClues } from "../foundation/name-registry";
import { relationLabel } from "../foundation/relation-ontology";
import { SeededRandom } from "../foundation/prng";
import type { DirectRelationClue } from "../foundation/types";
import type {
  BlrCp001LineagePrototypeId,
  BlrExactLineageRelationId,
} from "./lineage-prototype-types";

export interface BlrCp001LineageScenarioTemplate {
  scenarioId: string;
  clues: readonly DirectRelationClue[];
  exactQuery?: {
    subjectId: string;
    referenceId: string;
    expectedRelationId: BlrExactLineageRelationId;
  };
}

function clue(
  subjectId: string,
  relationId: DirectRelationClue["relationId"],
  referenceId: string,
): DirectRelationClue {
  return { subjectId, relationId, referenceId };
}

const GENDER_BALANCED_HOUSEHOLD: BlrCp001LineageScenarioTemplate = {
  scenarioId: "gender-balanced-household",
  clues: [
    clue("A", "FATHER", "B"),
    clue("C", "MOTHER", "B"),
    clue("D", "BROTHER", "A"),
    clue("E", "SISTER", "A"),
    clue("F", "SON", "C"),
    clue("G", "DAUGHTER", "C"),
    clue("H", "HUSBAND", "E"),
    clue("I", "WIFE", "D"),
  ],
};

const GENDER_REFERENCE_INFERENCE: BlrCp001LineageScenarioTemplate = {
  scenarioId: "gender-reference-inference",
  clues: [
    clue("A", "HUSBAND", "B"),
    clue("C", "WIFE", "D"),
    clue("E", "BROTHER", "A"),
    clue("F", "SISTER", "B"),
    clue("G", "SON", "C"),
    clue("H", "DAUGHTER", "D"),
    clue("I", "FATHER", "G"),
    clue("J", "MOTHER", "H"),
  ],
};

function exactScenario(
  scenarioId: string,
  clues: readonly DirectRelationClue[],
  subjectId: string,
  referenceId: string,
  expectedRelationId: BlrExactLineageRelationId,
): BlrCp001LineageScenarioTemplate {
  return {
    scenarioId,
    clues,
    exactQuery: { subjectId, referenceId, expectedRelationId },
  };
}

const EXACT_LINEAGE_SCENARIOS: readonly BlrCp001LineageScenarioTemplate[] = [
  exactScenario(
    "paternal-grandfather",
    [clue("A", "FATHER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "PATERNAL_GRANDFATHER",
  ),
  exactScenario(
    "paternal-grandmother",
    [clue("A", "MOTHER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "PATERNAL_GRANDMOTHER",
  ),
  exactScenario(
    "maternal-grandfather",
    [clue("A", "FATHER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "MATERNAL_GRANDFATHER",
  ),
  exactScenario(
    "maternal-grandmother",
    [clue("A", "MOTHER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "MATERNAL_GRANDMOTHER",
  ),
  exactScenario(
    "paternal-uncle",
    [clue("A", "BROTHER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "PATERNAL_UNCLE",
  ),
  exactScenario(
    "paternal-aunt",
    [clue("A", "SISTER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "PATERNAL_AUNT",
  ),
  exactScenario(
    "maternal-uncle",
    [clue("A", "BROTHER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "MATERNAL_UNCLE",
  ),
  exactScenario(
    "maternal-aunt",
    [clue("A", "SISTER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "MATERNAL_AUNT",
  ),
] as const;

const GENDER_SCENARIOS = [
  GENDER_BALANCED_HOUSEHOLD,
  GENDER_REFERENCE_INFERENCE,
] as const;

export function lineageScenariosFor(
  prototypeId: BlrCp001LineagePrototypeId,
): readonly BlrCp001LineageScenarioTemplate[] {
  return prototypeId === "BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER"
    ? GENDER_SCENARIOS
    : EXACT_LINEAGE_SCENARIOS;
}

export function assignLineageNames(
  template: BlrCp001LineageScenarioTemplate,
  random: SeededRandom,
): Readonly<Record<string, string>> {
  return assignNamesForClues(template.clues, random);
}

export function formatLineageClue(
  entry: DirectRelationClue,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[entry.subjectId]} is the ${relationLabel(entry.relationId).toLocaleLowerCase("en-IN")} of ${names[entry.referenceId]}.`;
}

export function buildLineageStem(
  clues: readonly DirectRelationClue[],
  names: Readonly<Record<string, string>>,
  question: string,
  random: SeededRandom,
): string {
  const openings = [
    "Study the following family information carefully.",
    "Read the family statements and answer the question.",
    "Use the relations given below to reconstruct the family.",
    "Consider the following information about a family.",
  ] as const;

  return [
    random.pick(openings),
    ...clues.map((entry) => formatLineageClue(entry, names)),
    question,
  ].join(" ");
}
