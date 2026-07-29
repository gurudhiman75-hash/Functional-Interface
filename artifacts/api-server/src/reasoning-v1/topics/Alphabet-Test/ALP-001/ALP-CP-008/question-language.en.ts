import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

function make(qlId: string, ruleId: string, taskKind: string, solveMode: AlpSolveMode, presentationMode: string, answerType: AlpAnswerType, renderer: AlpRenderer): AlpQuestionLogic {
  return { qlId, checkpointId: "ALP-CP-008", ruleId, taskKind, solveMode, presentationMode, answerType, renderer, localeMode: "TRANSLATABLE", difficultyProfile: "INSTANCE_DERIVED", status: "IMPLEMENTED" };
}

export const ALP_CP008_QLS: readonly AlpQuestionLogic[] = [
  make("ALP-QL-119", "ALP008-DIGIT-LEFT", "digit-at-left-position", "DIGIT_AT_LEFT_POSITION", "DIRECT_LEFT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-120", "ALP008-DIGIT-RIGHT", "digit-at-right-position", "DIGIT_AT_RIGHT_POSITION", "DIRECT_RIGHT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-121", "ALP008-DIGIT-LEFT-POSITION", "left-position-of-digit", "DIGIT_LEFT_POSITION", "INVERSE_LEFT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-122", "ALP008-DIGIT-RIGHT-POSITION", "right-position-of-digit", "DIGIT_RIGHT_POSITION", "INVERSE_RIGHT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-123", "ALP008-DIGIT-GAP-COUNT", "count-digit-gap-pairs", "COUNT_DIGIT_GAP_PAIRS", "PAIR_COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-124", "ALP008-DIGIT-GAP-IDENTIFY", "identify-digit-gap-pair", "IDENTIFY_DIGIT_GAP_PAIR", "PAIR_IDENTIFY", "TOKEN_PAIR", "TOKEN_ROW"),
  make("ALP-QL-125", "ALP008-DIGIT-ASC-POSITION", "digit-after-ascending-position", "DIGIT_AFTER_ASC_POSITION", "ASC_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-126", "ALP008-DIGIT-DESC-POSITION", "digit-after-descending-position", "DIGIT_AFTER_DESC_POSITION", "DESC_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-127", "ALP008-DIGIT-REVERSE-POSITION", "digit-after-reversal-position", "DIGIT_AFTER_REVERSE_POSITION", "REVERSE_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-128", "ALP008-DIGIT-ADJACENT-SWAP", "digit-after-adjacent-swap", "DIGIT_AFTER_ADJACENT_SWAP_POSITION", "SWAP_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-129", "ALP008-DIGIT-UNCHANGED-ASC", "count-unchanged-ascending", "DIGIT_COUNT_UNCHANGED_ASC", "COUNT_UNCHANGED", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-130", "ALP008-DIGIT-UNCHANGED-TRANSFORM", "count-unchanged-selected-transform", "DIGIT_COUNT_UNCHANGED_SELECTED_TRANSFORM", "COUNT_UNCHANGED_COMPOSITE", "NUMBER", "TOKEN_ROW"),
];
