import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

function make(
  qlId: string,
  ruleId: string,
  taskKind: string,
  solveMode: AlpSolveMode,
  presentationMode: string,
  answerType: AlpAnswerType,
  renderer: AlpRenderer,
): AlpQuestionLogic {
  return {
    qlId,
    checkpointId: "ALP-CP-007",
    ruleId,
    taskKind,
    solveMode,
    presentationMode,
    answerType,
    renderer,
    localeMode: "TRANSLATABLE",
    difficultyProfile: "INSTANCE_DERIVED",
    status: "IMPLEMENTED",
  };
}

export const ALP_CP007_QLS: readonly AlpQuestionLogic[] = [
  make("ALP-QL-111", "ALP007-CLASS-SHIFT-POSITION", "class-shift-letter-position", "CLASS_SHIFT_LETTER_AT_POSITION", "DIRECT", "LETTER", "TOKEN_ROW"),
  make("ALP-QL-112", "ALP007-CLASS-SHIFT-WORD", "class-shift-complete-word", "CLASS_SHIFT_TRANSFORMED_WORD", "COMPLETE", "TOKEN_SEQUENCE", "TOKEN_ROW"),
  make("ALP-QL-113", "ALP007-CLASS-SHIFT-UNCHANGED", "class-shift-count-unchanged", "CLASS_SHIFT_COUNT_UNCHANGED", "COUNT_UNCHANGED", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-114", "ALP007-CLASS-SHIFT-VOWELS", "class-shift-count-vowels", "CLASS_SHIFT_COUNT_VOWELS", "COUNT_CLASS", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-115", "ALP007-CLASS-SHIFT-SORT-POSITION", "class-shift-sort-letter-position", "CLASS_SHIFT_SORTED_LETTER_AT_POSITION", "TRANSFORM_SORT_DIRECT", "LETTER", "TOKEN_ROW"),
  make("ALP-QL-116", "ALP007-CLASS-SHIFT-SORT-INVERSE", "class-shift-sort-position-letter", "CLASS_SHIFT_SORTED_POSITION_OF_LETTER", "TRANSFORM_SORT_INVERSE", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-117", "ALP007-CLASS-OPPOSITE", "class-opposite-letter-position", "CLASS_OPPOSITE_LETTER_AT_POSITION", "CLASS_OPPOSITE", "LETTER", "TOKEN_ROW"),
  make("ALP-QL-118", "ALP007-CLASS-TWO-STAGE", "class-two-stage-position", "CLASS_TWO_STAGE_LETTER_AT_POSITION", "COMPOSITE", "LETTER", "TOKEN_ROW"),
];
