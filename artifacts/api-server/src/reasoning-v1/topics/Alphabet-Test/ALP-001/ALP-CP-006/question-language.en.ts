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
    checkpointId: "ALP-CP-006",
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

export const ALP_CP006_QLS: readonly AlpQuestionLogic[] = [
  make("ALP-QL-105", "ALP006-WORD-PAIR-BOTH", "count-word-pairs-both", "COUNT_WORD_ALPHA_PAIRS_BOTH", "COUNT", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-106", "ALP006-WORD-PAIR-FORWARD", "count-word-pairs-forward", "COUNT_WORD_ALPHA_PAIRS_FORWARD", "COUNT_FORWARD", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-107", "ALP006-WORD-PAIR-BACKWARD", "count-word-pairs-backward", "COUNT_WORD_ALPHA_PAIRS_BACKWARD", "COUNT_BACKWARD", "NUMBER", "TOKEN_ROW"),
  make("ALP-QL-108", "ALP006-WORD-PAIR-IDENTIFY", "identify-word-pair", "IDENTIFY_WORD_ALPHA_PAIR", "IDENTIFY_PAIR", "TOKEN_PAIR", "TOKEN_ROW"),
  make("ALP-QL-109", "ALP006-WORD-BY-PAIR-COUNT", "identify-word-by-pair-count", "IDENTIFY_WORD_BY_ALPHA_PAIR_COUNT", "IDENTIFY_WORD", "TOKEN_SEQUENCE", "STRUCTURED_TEXT"),
  make("ALP-QL-110", "ALP006-REVERSED-WORD-PAIR-COUNT", "count-reversed-word-pairs", "COUNT_WORD_ALPHA_PAIRS_AFTER_REVERSE", "REVERSE_COMPOSITE", "NUMBER", "TOKEN_ROW"),
];
