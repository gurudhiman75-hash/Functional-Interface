import {
  BLR_CP007_V3_MISSING_PERSON_BASE,
  BLR_CP007_V3_THREE_LINK,
  type BlrCp007V3MissingPersonTemplate,
  type BlrCp007V3RelationTemplate,
} from "./cp007-editorial-v3-scenarios";

// The scenario catalogue is exported as readonly so consumers cannot casually
// alter it. This module is the explicit editorial correction authority loaded
// before the V3 bank is generated.
const threeLink = BLR_CP007_V3_THREE_LINK as BlrCp007V3RelationTemplate[];
const missingPerson = BLR_CP007_V3_MISSING_PERSON_BASE as BlrCp007V3MissingPersonTemplate[];

threeLink[6] = {
  id: "THREE-BROTHER-IN-LAW",
  statements: [
    { leftId: "A", relationId: "BROTHER", rightId: "B" },
    { leftId: "B", relationId: "HUSBAND", rightId: "C" },
    { leftId: "C", relationId: "MOTHER", rightId: "D" },
  ],
  target: { subjectId: "A", relationId: "BROTHER_IN_LAW", referenceId: "C" },
  topology: "AFFINAL-WITH-CHILD-CONTEXT",
};

threeLink[7] = {
  id: "THREE-SISTER-IN-LAW",
  statements: [
    { leftId: "E", relationId: "SISTER", rightId: "F" },
    { leftId: "F", relationId: "WIFE", rightId: "G" },
    { leftId: "G", relationId: "FATHER", rightId: "H" },
  ],
  target: { subjectId: "E", relationId: "SISTER_IN_LAW", referenceId: "G" },
  topology: "AFFINAL-WITH-CHILD-CONTEXT",
};

// QL-034 candidates must remain graph-valid even when the candidate occupies
// the gender-bearing side of a coded relation. Each scenario therefore gives
// all four candidates compatible explicit genders while preserving one unique
// path to the requested answer.
missingPerson[0] = {
  id: "MP-UNCLE-P",
  clues: [
    { leftId: "P", relationId: "FATHER", rightId: "D" },
    { leftId: "Q", relationId: "BROTHER", rightId: "D" },
    { leftId: "R", relationId: "BROTHER", rightId: "X" },
    { leftId: "S", relationId: "HUSBAND", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "BROTHER", rightId: "P" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "UNCLE", referenceId: "D" },
  correctCandidate: "P",
  topology: "CANDIDATE-PARENT-BRIDGE",
};

missingPerson[1] = {
  id: "MP-AUNT-Q",
  clues: [
    { leftId: "Q", relationId: "MOTHER", rightId: "E" },
    { leftId: "P", relationId: "SISTER", rightId: "E" },
    { leftId: "R", relationId: "WIFE", rightId: "X" },
    { leftId: "S", relationId: "DAUGHTER", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "SISTER", rightId: "Q" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "AUNT", referenceId: "E" },
  correctCandidate: "Q",
  topology: "CANDIDATE-PARENT-BRIDGE",
};

missingPerson[2] = {
  id: "MP-GRANDFATHER-R",
  clues: [
    { leftId: "R", relationId: "FATHER", rightId: "F" },
    { leftId: "P", relationId: "BROTHER", rightId: "F" },
    { leftId: "Q", relationId: "HUSBAND", rightId: "X" },
    { leftId: "S", relationId: "SON", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "FATHER", rightId: "R" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "GRANDFATHER", referenceId: "F" },
  correctCandidate: "R",
  topology: "CANDIDATE-GENERATION-BRIDGE",
};

missingPerson[3] = {
  id: "MP-GRANDMOTHER-S",
  clues: [
    { leftId: "S", relationId: "MOTHER", rightId: "G" },
    { leftId: "P", relationId: "SISTER", rightId: "G" },
    { leftId: "Q", relationId: "WIFE", rightId: "X" },
    { leftId: "R", relationId: "DAUGHTER", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "MOTHER", rightId: "S" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "GRANDMOTHER", referenceId: "G" },
  correctCandidate: "S",
  topology: "CANDIDATE-GENERATION-BRIDGE",
};

missingPerson[4] = {
  id: "MP-FATHER-IN-LAW-P",
  clues: [
    { leftId: "P", relationId: "HUSBAND", rightId: "H" },
    { leftId: "Q", relationId: "BROTHER", rightId: "H" },
    { leftId: "R", relationId: "SON", rightId: "H" },
    { leftId: "S", relationId: "HUSBAND", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "FATHER", rightId: "P" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "FATHER_IN_LAW", referenceId: "H" },
  correctCandidate: "P",
  topology: "CANDIDATE-AFFINAL-BRIDGE",
};

missingPerson[5] = {
  id: "MP-MOTHER-IN-LAW-Q",
  clues: [
    { leftId: "Q", relationId: "WIFE", rightId: "J" },
    { leftId: "P", relationId: "SISTER", rightId: "J" },
    { leftId: "R", relationId: "DAUGHTER", rightId: "J" },
    { leftId: "S", relationId: "WIFE", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "MOTHER", rightId: "Q" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "MOTHER_IN_LAW", referenceId: "J" },
  correctCandidate: "Q",
  topology: "CANDIDATE-AFFINAL-BRIDGE",
};

missingPerson[6] = {
  id: "MP-NEPHEW-R",
  clues: [
    { leftId: "R", relationId: "BROTHER", rightId: "K" },
    { leftId: "P", relationId: "FATHER", rightId: "K" },
    { leftId: "Q", relationId: "HUSBAND", rightId: "X" },
    { leftId: "S", relationId: "SON", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "SON", rightId: "R" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "NEPHEW", referenceId: "K" },
  correctCandidate: "R",
  topology: "CANDIDATE-CHILD-BRIDGE",
};

missingPerson[7] = {
  id: "MP-NIECE-S",
  clues: [
    { leftId: "S", relationId: "SISTER", rightId: "L" },
    { leftId: "P", relationId: "MOTHER", rightId: "L" },
    { leftId: "Q", relationId: "WIFE", rightId: "X" },
    { leftId: "R", relationId: "DAUGHTER", rightId: "Y" },
  ],
  blankStatement: { leftId: "A", relationId: "DAUGHTER", rightId: "S" },
  blankSide: "RIGHT",
  target: { subjectId: "A", relationId: "NIECE", referenceId: "L" },
  correctCandidate: "S",
  topology: "CANDIDATE-CHILD-BRIDGE",
};
