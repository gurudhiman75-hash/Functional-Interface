import type { DirectRelationClue } from "../foundation/types";
import type { BlrCp001ScenarioTemplate } from "./scenario-library";

function clue(
  subjectId: string,
  relationId: DirectRelationClue["relationId"],
  referenceId: string,
): DirectRelationClue {
  return { subjectId, relationId, referenceId };
}

/**
 * Added by the second source-and-gap audit.
 *
 * These are not new prototype or QL authorities. They extend the existing
 * three-edge named-relation authority with source-backed ancestor and
 * descendant outputs at generation distance three.
 */
export const BLR_CP001_SECOND_GAP_THREE_EDGE_SCENARIOS: readonly BlrCp001ScenarioTemplate[] = [
  {
    scenarioId: "great-grandfather-three-parent-chain",
    clues: [
      clue("A", "FATHER", "B"),
      clue("B", "FATHER", "C"),
      clue("C", "FATHER", "D"),
    ],
    query: { subjectId: "A", referenceId: "D" },
    expectedRelationId: "GREAT_GRANDFATHER",
  },
  {
    scenarioId: "great-grandmother-three-parent-chain",
    clues: [
      clue("A", "MOTHER", "B"),
      clue("B", "MOTHER", "C"),
      clue("C", "MOTHER", "D"),
    ],
    query: { subjectId: "A", referenceId: "D" },
    expectedRelationId: "GREAT_GRANDMOTHER",
  },
  {
    scenarioId: "great-grandson-three-child-chain",
    clues: [
      clue("A", "SON", "B"),
      clue("B", "SON", "C"),
      clue("C", "SON", "D"),
    ],
    query: { subjectId: "A", referenceId: "D" },
    expectedRelationId: "GREAT_GRANDSON",
  },
  {
    scenarioId: "great-granddaughter-three-child-chain",
    clues: [
      clue("A", "DAUGHTER", "B"),
      clue("B", "DAUGHTER", "C"),
      clue("C", "DAUGHTER", "D"),
    ],
    query: { subjectId: "A", referenceId: "D" },
    expectedRelationId: "GREAT_GRANDDAUGHTER",
  },
] as const;

export function scenariosWithSecondGapCoverage(
  prototypeId: string,
  baseScenarios: readonly BlrCp001ScenarioTemplate[],
): readonly BlrCp001ScenarioTemplate[] {
  return prototypeId === "BLR-CP001-PROT-COMPOSED-THREE-EDGE"
    ? [...baseScenarios, ...BLR_CP001_SECOND_GAP_THREE_EDGE_SCENARIOS]
    : baseScenarios;
}
