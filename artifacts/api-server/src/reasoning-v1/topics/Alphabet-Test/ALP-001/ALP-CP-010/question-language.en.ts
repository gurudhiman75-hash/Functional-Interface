import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

function make(qlId: string, ruleId: string, taskKind: string, solveMode: AlpSolveMode, presentationMode: string, answerType: AlpAnswerType, renderer: AlpRenderer): AlpQuestionLogic {
  return { qlId, checkpointId: "ALP-CP-010", ruleId, taskKind, solveMode, presentationMode, answerType, renderer, localeMode: "TRANSLATABLE", difficultyProfile: "INSTANCE_DERIVED", status: "IMPLEMENTED" };
}

export const ALP_CP010_QLS: readonly AlpQuestionLogic[] = [
  make("ALP-QL-145", "ALP010-GROUP-LDS", "group-letters-digits-symbols", "MIXED_GROUP_LETTERS_DIGITS_SYMBOLS_POSITION", "GROUP_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-146", "ALP010-GROUP-SDL", "group-symbols-digits-letters", "MIXED_GROUP_SYMBOLS_DIGITS_LETTERS_POSITION", "GROUP_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-147", "ALP010-SORT-LETTERS-IN-PLACE", "sort-letters-in-place", "MIXED_SORT_LETTERS_IN_PLACE_POSITION", "IN_PLACE_SORT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-148", "ALP010-SORT-DIGITS-IN-PLACE", "sort-digits-in-place", "MIXED_SORT_DIGITS_IN_PLACE_POSITION", "IN_PLACE_SORT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-149", "ALP010-REVERSE-LETTERS-IN-PLACE", "reverse-letters-in-place", "MIXED_REVERSE_LETTERS_IN_PLACE_POSITION", "IN_PLACE_REVERSE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-150", "ALP010-REVERSE-DIGITS-IN-PLACE", "reverse-digits-in-place", "MIXED_REVERSE_DIGITS_IN_PLACE_POSITION", "IN_PLACE_REVERSE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-151", "ALP010-SWAP-ADJACENT", "mixed-swap-adjacent", "MIXED_SWAP_ADJACENT_POSITION", "SWAP_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-152", "ALP010-REVERSE-ALL", "mixed-reverse-all", "MIXED_REVERSE_ALL_POSITION", "REVERSE_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-153", "ALP010-REMOVE-CATEGORY", "mixed-remove-category", "MIXED_REMOVE_CATEGORY_POSITION", "FILTER_DIRECT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-154", "ALP010-POSITION-AFTER-GROUP", "mixed-position-after-group", "MIXED_POSITION_OF_TOKEN_AFTER_GROUP", "GROUP_INVERSE", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-155", "ALP010-COUNT-UNCHANGED", "mixed-count-unchanged", "MIXED_COUNT_UNCHANGED_AFTER_TRANSFORM", "COUNT_UNCHANGED", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-156", "ALP010-COUNT-ADJACENCY-AFTER", "mixed-count-adjacency-after-transform", "MIXED_COUNT_ADJACENCY_AFTER_TRANSFORM", "COMPOSITE_COUNT", "NUMBER", "TOKEN_ROW"),
];
