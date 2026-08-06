import {
  BLR_CP007_V3_MISSING_PERSON_BASE,
  type BlrCp007V3MissingPersonTemplate,
} from "./cp007-editorial-v3-scenarios";

const templates = BLR_CP007_V3_MISSING_PERSON_BASE as BlrCp007V3MissingPersonTemplate[];

// Exact reverse queries need explicit endpoint gender. These clues are
// candidate-neutral and do not reveal the missing person.
templates[2]!.clues = [
  ...templates[2]!.clues,
  { leftId: "F", relationId: "HUSBAND", rightId: "GF" },
];
templates[3]!.clues = [
  ...templates[3]!.clues,
  { leftId: "G", relationId: "WIFE", rightId: "GG" },
];

// Parent-in-law reversals are necessarily exact son/daughter-in-law because
// the spouse clue establishes endpoint gender. Use parent completion scenarios
// here so the same authority can support forward and reversed endpoint forms
// without broad/exact answer mismatch.
templates[4] = {
  id: "MP-FATHER-P",
  clues: [
    { leftId: "P", relationId: "BROTHER", rightId: "H" },
    { leftId: "Q", relationId: "BROTHER", rightId: "X" },
    { leftId: "R", relationId: "HUSBAND", rightId: "Y" },
    { leftId: "S", relationId: "SON", rightId: "Z" },
    { leftId: "H", relationId: "HUSBAND", rightId: "GH" },
  ],
  blankStatement: { leftId: "A", relationId: "FATHER", rightId: "P" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "FATHER", referenceId: "H" },
  correctCandidate: "P",
  topology: "CANDIDATE-SIBLING-PARENT-BRIDGE",
};

templates[5] = {
  id: "MP-MOTHER-Q",
  clues: [
    { leftId: "Q", relationId: "SISTER", rightId: "J" },
    { leftId: "P", relationId: "SISTER", rightId: "X" },
    { leftId: "R", relationId: "WIFE", rightId: "Y" },
    { leftId: "S", relationId: "DAUGHTER", rightId: "Z" },
    { leftId: "J", relationId: "WIFE", rightId: "GJ" },
  ],
  blankStatement: { leftId: "A", relationId: "MOTHER", rightId: "Q" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "MOTHER", referenceId: "J" },
  correctCandidate: "Q",
  topology: "CANDIDATE-SIBLING-PARENT-BRIDGE",
};
