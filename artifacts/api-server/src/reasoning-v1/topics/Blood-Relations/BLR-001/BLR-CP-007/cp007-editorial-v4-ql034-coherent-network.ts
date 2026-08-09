import {
  BLR_CP007_V3_MISSING_PERSON_BASE,
  type BlrCp007V3DirectSpec,
  type BlrCp007V3MissingPersonTemplate,
} from "./cp007-editorial-v3-scenarios";

const d = (
  leftId: string,
  relationId: BlrCp007V3DirectSpec["relationId"],
  rightId: string,
): BlrCp007V3DirectSpec => ({ leftId, relationId, rightId });

const templates = BLR_CP007_V3_MISSING_PERSON_BASE as BlrCp007V3MissingPersonTemplate[];

/**
 * V3 guaranteed that P/Q/R/S appeared somewhere, but each candidate usually
 * belonged to a separate clue component. V4 Wave 2 replaces those records with
 * one connected family network. The four candidates stay graph-valid under
 * substitution, but only the named candidate completes the requested path.
 *
 * N is deliberately connected to the network. The INTERNAL prototype adds an
 * M–N spouse clue; using a female N on even seeds and a male N on odd seeds
 * keeps that added clue valid and connected.
 */
const coherent: readonly BlrCp007V3MissingPersonTemplate[] = [
  {
    id: "V4-MP-UNCLE-P-CONNECTED",
    clues: [
      d("P", "FATHER", "D"),
      d("Q", "SON", "P"),
      d("R", "SON", "Q"),
      d("S", "SON", "R"),
      d("N", "DAUGHTER", "S"),
      d("A", "HUSBAND", "T"),
    ],
    blankStatement: d("A", "BROTHER", "P"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "UNCLE", referenceId: "D" },
    correctCandidate: "P",
    topology: "CONNECTED-CANDIDATE-PARENT-BRIDGE",
  },
  {
    id: "V4-MP-AUNT-Q-CONNECTED",
    clues: [
      d("Q", "MOTHER", "E"),
      d("P", "DAUGHTER", "Q"),
      d("R", "DAUGHTER", "P"),
      d("S", "DAUGHTER", "R"),
      d("N", "SON", "S"),
      d("A", "WIFE", "T"),
    ],
    blankStatement: d("A", "SISTER", "Q"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "AUNT", referenceId: "E" },
    correctCandidate: "Q",
    topology: "CONNECTED-CANDIDATE-PARENT-BRIDGE",
  },
  {
    id: "V4-MP-GRANDFATHER-R-CONNECTED",
    clues: [
      d("R", "FATHER", "F"),
      d("P", "HUSBAND", "U"),
      d("U", "SISTER", "R"),
      d("Q", "BROTHER", "P"),
      d("S", "HUSBAND", "V"),
      d("V", "SISTER", "Q"),
      d("N", "DAUGHTER", "S"),
      d("F", "HUSBAND", "GF"),
      d("A", "HUSBAND", "T"),
    ],
    blankStatement: d("A", "FATHER", "R"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "F" },
    correctCandidate: "R",
    topology: "CONNECTED-CANDIDATE-GENERATION-BRIDGE",
  },
  {
    id: "V4-MP-GRANDMOTHER-S-CONNECTED",
    clues: [
      d("S", "MOTHER", "G"),
      d("P", "WIFE", "U"),
      d("U", "BROTHER", "S"),
      d("Q", "SISTER", "P"),
      d("R", "WIFE", "V"),
      d("V", "BROTHER", "Q"),
      d("N", "SON", "R"),
      d("G", "WIFE", "GG"),
      d("A", "WIFE", "T"),
    ],
    blankStatement: d("A", "MOTHER", "S"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "GRANDMOTHER", referenceId: "G" },
    correctCandidate: "S",
    topology: "CONNECTED-CANDIDATE-GENERATION-BRIDGE",
  },
  {
    id: "V4-MP-FATHER-P-CONNECTED",
    clues: [
      d("P", "BROTHER", "H"),
      d("Q", "HUSBAND", "U"),
      d("U", "SISTER", "P"),
      d("R", "BROTHER", "Q"),
      d("S", "HUSBAND", "V"),
      d("V", "SISTER", "R"),
      d("N", "DAUGHTER", "S"),
      d("H", "HUSBAND", "GH"),
      d("A", "HUSBAND", "T"),
    ],
    blankStatement: d("A", "FATHER", "P"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "FATHER", referenceId: "H" },
    correctCandidate: "P",
    topology: "CONNECTED-CANDIDATE-SIBLING-PARENT-BRIDGE",
  },
  {
    id: "V4-MP-MOTHER-Q-CONNECTED",
    clues: [
      d("Q", "SISTER", "J"),
      d("P", "WIFE", "U"),
      d("U", "BROTHER", "Q"),
      d("R", "SISTER", "P"),
      d("S", "WIFE", "V"),
      d("V", "BROTHER", "R"),
      d("N", "SON", "S"),
      d("J", "WIFE", "GJ"),
      d("A", "WIFE", "T"),
    ],
    blankStatement: d("A", "MOTHER", "Q"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "MOTHER", referenceId: "J" },
    correctCandidate: "Q",
    topology: "CONNECTED-CANDIDATE-SIBLING-PARENT-BRIDGE",
  },
  {
    id: "V4-MP-NEPHEW-R-CONNECTED",
    clues: [
      d("R", "BROTHER", "K"),
      d("P", "HUSBAND", "U"),
      d("U", "SISTER", "R"),
      d("Q", "BROTHER", "P"),
      d("S", "HUSBAND", "V"),
      d("V", "SISTER", "Q"),
      d("N", "DAUGHTER", "S"),
      d("A", "HUSBAND", "T"),
    ],
    blankStatement: d("A", "SON", "R"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "NEPHEW", referenceId: "K" },
    correctCandidate: "R",
    topology: "CONNECTED-CANDIDATE-CHILD-BRIDGE",
  },
  {
    id: "V4-MP-NIECE-S-CONNECTED",
    clues: [
      d("S", "SISTER", "L"),
      d("P", "WIFE", "U"),
      d("U", "BROTHER", "S"),
      d("Q", "SISTER", "P"),
      d("R", "WIFE", "V"),
      d("V", "BROTHER", "Q"),
      d("N", "SON", "R"),
      d("A", "WIFE", "T"),
    ],
    blankStatement: d("A", "DAUGHTER", "S"),
    blankSide: "RIGHT",
    target: { subjectId: "A", relationId: "NIECE", referenceId: "L" },
    correctCandidate: "S",
    topology: "CONNECTED-CANDIDATE-CHILD-BRIDGE",
  },
] as const;

coherent.forEach((template, index) => {
  templates[index] = template;
});
