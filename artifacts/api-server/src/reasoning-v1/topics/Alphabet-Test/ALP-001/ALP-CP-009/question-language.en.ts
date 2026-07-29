import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

function make(qlId: string, ruleId: string, taskKind: string, solveMode: AlpSolveMode, presentationMode: string, answerType: AlpAnswerType, renderer: AlpRenderer): AlpQuestionLogic {
  return { qlId, checkpointId: "ALP-CP-009", ruleId, taskKind, solveMode, presentationMode, answerType, renderer, localeMode: "TRANSLATABLE", difficultyProfile: "INSTANCE_DERIVED", status: "IMPLEMENTED" };
}

export const ALP_CP009_QLS: readonly AlpQuestionLogic[] = [
  make("ALP-QL-131", "ALP009-MIXED-LEFT", "mixed-element-left-position", "MIXED_ELEMENT_FROM_LEFT", "DIRECT_LEFT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-132", "ALP009-MIXED-RIGHT", "mixed-element-right-position", "MIXED_ELEMENT_FROM_RIGHT", "DIRECT_RIGHT", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-133", "ALP009-MIXED-RIGHT-FROM-LEFT", "mixed-relative-right-from-left", "MIXED_RELATIVE_RIGHT_FROM_LEFT", "RELATIVE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-134", "ALP009-MIXED-LEFT-FROM-LEFT", "mixed-relative-left-from-left", "MIXED_RELATIVE_LEFT_FROM_LEFT", "RELATIVE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-135", "ALP009-MIXED-RIGHT-FROM-RIGHT", "mixed-relative-right-from-right", "MIXED_RELATIVE_RIGHT_FROM_RIGHT", "RELATIVE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-136", "ALP009-MIXED-LEFT-FROM-RIGHT", "mixed-relative-left-from-right", "MIXED_RELATIVE_LEFT_FROM_RIGHT", "RELATIVE", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-137", "ALP009-LETTER-FOLLOWED-SYMBOL", "count-letter-followed-symbol", "COUNT_LETTER_FOLLOWED_BY_SYMBOL", "ADJACENCY_COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-138", "ALP009-SYMBOL-PRECEDED-LETTER", "count-symbol-preceded-letter", "COUNT_SYMBOL_PRECEDED_BY_LETTER", "ADJACENCY_COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-139", "ALP009-DIGIT-FOLLOWED-LETTER", "count-digit-followed-letter", "COUNT_DIGIT_FOLLOWED_BY_LETTER", "ADJACENCY_COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-140", "ALP009-LETTER-PRECEDED-DIGIT", "count-letter-preceded-digit", "COUNT_LETTER_PRECEDED_BY_DIGIT", "ADJACENCY_COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-141", "ALP009-VOWEL-FOLLOWED-DIGIT", "count-vowel-followed-digit", "COUNT_VOWEL_FOLLOWED_BY_DIGIT", "FILTERED_ADJACENCY", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-142", "ALP009-EVEN-DIGIT-PRECEDED-SYMBOL", "count-even-digit-preceded-symbol", "COUNT_EVEN_DIGIT_PRECEDED_BY_SYMBOL", "FILTERED_ADJACENCY", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-143", "ALP009-NTH-LETTER", "nth-letter-from-left", "NTH_LETTER_FROM_LEFT", "CATEGORY_POSITION", "TOKEN", "TOKEN_ROW"),
  make("ALP-QL-144", "ALP009-NTH-SYMBOL", "nth-symbol-from-right", "NTH_SYMBOL_FROM_RIGHT", "CATEGORY_POSITION", "TOKEN", "TOKEN_ROW"),
];
