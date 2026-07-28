import { assignNamesForClues } from "../foundation/name-registry";
import { relationLabel } from "../foundation/relation-ontology";
import { SeededRandom } from "../foundation/prng";
import type {
  BlrCp001PrototypeId,
  BlrRelationId,
  BlrStructuredPrompt,
  DirectRelationClue,
} from "../foundation/types";

export interface BlrCp001ScenarioTemplate {
  scenarioId: string;
  clues: readonly DirectRelationClue[];
  query: { subjectId: string; referenceId: string };
  expectedRelationId: BlrRelationId;
}

function clue(
  subjectId: string,
  relationId: DirectRelationClue["relationId"],
  referenceId: string,
): DirectRelationClue {
  return { subjectId, relationId, referenceId };
}

function scenario(
  scenarioId: string,
  clues: readonly DirectRelationClue[],
  subjectId: string,
  referenceId: string,
  expectedRelationId: BlrRelationId,
): BlrCp001ScenarioTemplate {
  return {
    scenarioId,
    clues,
    query: { subjectId, referenceId },
    expectedRelationId,
  };
}

function direct(
  name: string,
  relationId: DirectRelationClue["relationId"],
): BlrCp001ScenarioTemplate {
  return scenario(
    `direct-${name}`,
    [clue("A", relationId, "B")],
    "A",
    "B",
    relationId,
  );
}

const DIRECT_FORWARD_SCENARIOS: readonly BlrCp001ScenarioTemplate[] = [
  direct("father", "FATHER"),
  direct("mother", "MOTHER"),
  direct("son", "SON"),
  direct("daughter", "DAUGHTER"),
  direct("brother", "BROTHER"),
  direct("sister", "SISTER"),
  direct("husband", "HUSBAND"),
  direct("wife", "WIFE"),
];

const DIRECT_REVERSE_SCENARIOS: readonly BlrCp001ScenarioTemplate[] = [
  scenario(
    "reverse-father-to-son",
    [clue("A", "FATHER", "B"), clue("B", "BROTHER", "C")],
    "B",
    "A",
    "SON",
  ),
  scenario(
    "reverse-mother-to-daughter",
    [clue("A", "MOTHER", "B"), clue("B", "SISTER", "C")],
    "B",
    "A",
    "DAUGHTER",
  ),
  scenario(
    "reverse-brother",
    [clue("A", "BROTHER", "B"), clue("B", "FATHER", "C")],
    "B",
    "A",
    "BROTHER",
  ),
  scenario(
    "reverse-sister",
    [clue("A", "SISTER", "B"), clue("B", "MOTHER", "C")],
    "B",
    "A",
    "SISTER",
  ),
  scenario(
    "reverse-husband-to-wife",
    [clue("A", "HUSBAND", "B")],
    "B",
    "A",
    "WIFE",
  ),
  scenario(
    "reverse-wife-to-husband",
    [clue("A", "WIFE", "B")],
    "B",
    "A",
    "HUSBAND",
  ),
];

const TWO_EDGE_SCENARIOS: readonly BlrCp001ScenarioTemplate[] = [
  scenario(
    "grandfather",
    [clue("A", "FATHER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "GRANDFATHER",
  ),
  scenario(
    "grandmother",
    [clue("A", "MOTHER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "GRANDMOTHER",
  ),
  scenario(
    "uncle",
    [clue("A", "BROTHER", "B"), clue("B", "FATHER", "C")],
    "A",
    "C",
    "UNCLE",
  ),
  scenario(
    "aunt",
    [clue("A", "SISTER", "B"), clue("B", "MOTHER", "C")],
    "A",
    "C",
    "AUNT",
  ),
  scenario(
    "nephew",
    [clue("A", "SON", "B"), clue("B", "BROTHER", "C")],
    "A",
    "C",
    "NEPHEW",
  ),
  scenario(
    "niece",
    [clue("A", "DAUGHTER", "B"), clue("B", "SISTER", "C")],
    "A",
    "C",
    "NIECE",
  ),
  scenario(
    "father-in-law",
    [clue("A", "FATHER", "B"), clue("B", "HUSBAND", "C")],
    "A",
    "C",
    "FATHER_IN_LAW",
  ),
  scenario(
    "mother-in-law",
    [clue("A", "MOTHER", "B"), clue("B", "WIFE", "C")],
    "A",
    "C",
    "MOTHER_IN_LAW",
  ),
  scenario(
    "son-in-law",
    [clue("A", "HUSBAND", "B"), clue("B", "DAUGHTER", "C")],
    "A",
    "C",
    "SON_IN_LAW",
  ),
  scenario(
    "daughter-in-law",
    [clue("A", "WIFE", "B"), clue("B", "SON", "C")],
    "A",
    "C",
    "DAUGHTER_IN_LAW",
  ),
];

const THREE_EDGE_SCENARIOS: readonly BlrCp001ScenarioTemplate[] = [
  scenario(
    "male-cousin-through-paternal-branch",
    [
      clue("A", "SON", "B"),
      clue("B", "BROTHER", "C"),
      clue("C", "FATHER", "D"),
    ],
    "A",
    "D",
    "COUSIN",
  ),
  scenario(
    "female-cousin-through-maternal-branch",
    [
      clue("A", "DAUGHTER", "B"),
      clue("B", "SISTER", "C"),
      clue("C", "MOTHER", "D"),
    ],
    "A",
    "D",
    "COUSIN",
  ),
  scenario(
    "male-cousin-through-maternal-branch",
    [
      clue("A", "SON", "B"),
      clue("B", "SISTER", "C"),
      clue("C", "MOTHER", "D"),
    ],
    "A",
    "D",
    "COUSIN",
  ),
  scenario(
    "female-cousin-through-paternal-branch",
    [
      clue("A", "DAUGHTER", "B"),
      clue("B", "BROTHER", "C"),
      clue("C", "FATHER", "D"),
    ],
    "A",
    "D",
    "COUSIN",
  ),
];

export function scenariosFor(
  prototypeId: BlrCp001PrototypeId,
): readonly BlrCp001ScenarioTemplate[] {
  if (prototypeId === "BLR-CP001-PROT-DIRECT-FORWARD") {
    return DIRECT_FORWARD_SCENARIOS;
  }
  if (prototypeId === "BLR-CP001-PROT-DIRECT-REVERSE") {
    return DIRECT_REVERSE_SCENARIOS;
  }
  if (prototypeId === "BLR-CP001-PROT-COMPOSED-TWO-EDGE") {
    return TWO_EDGE_SCENARIOS;
  }
  return THREE_EDGE_SCENARIOS;
}

export function assignNames(
  template: BlrCp001ScenarioTemplate,
  random: SeededRandom,
): Readonly<Record<string, string>> {
  return assignNamesForClues(template.clues, random);
}

export function formatClue(
  entry: DirectRelationClue,
  names: Readonly<Record<string, string>>,
): string {
  return `${names[entry.subjectId]} is the ${relationLabel(entry.relationId).toLocaleLowerCase("en-IN")} of ${names[entry.referenceId]}.`;
}

export function buildStem(
  prompt: BlrStructuredPrompt,
  random: SeededRandom,
): string {
  const openings = [
    "Read the following family information carefully.",
    "Study the relations given below.",
    "Consider the following statements about a family.",
    "Use the information below to answer the question.",
  ] as const;
  const questionForms = [
    (subject: string, reference: string) =>
      `How is ${subject} related to ${reference}?`,
    (subject: string, reference: string) =>
      `What is ${subject}'s relation to ${reference}?`,
    (subject: string, reference: string) =>
      `${subject} is related to ${reference} in which of the following ways?`,
  ] as const;
  const subjectName = prompt.personNames[prompt.query.subjectId]!;
  const referenceName = prompt.personNames[prompt.query.referenceId]!;

  return [
    random.pick(openings),
    ...prompt.clues.map((entry) => formatClue(entry, prompt.personNames)),
    random.pick(questionForms)(subjectName, referenceName),
  ].join(" ");
}
