import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

type Row = readonly [AlpSolveMode, string, string, AlpAnswerType, AlpRenderer, string, string];
const rows: readonly Row[] = [
  ["WORD_PAIR_COUNT_ALL", "WORD_ALPHABET_PAIR_MATCH", "countMatchingWordPairs", "NUMBER", "POSITION_TRACK", "PAIR_COUNT_ALL", "PAIR_SCAN"],
  ["WORD_PAIR_COUNT_FORWARD", "WORD_ALPHABET_PAIR_MATCH", "countForwardMatchingWordPairs", "NUMBER", "POSITION_TRACK", "PAIR_COUNT_FORWARD", "PAIR_SCAN"],
  ["WORD_PAIR_COUNT_BACKWARD", "WORD_ALPHABET_PAIR_MATCH", "countBackwardMatchingWordPairs", "NUMBER", "POSITION_TRACK", "PAIR_COUNT_BACKWARD", "PAIR_SCAN"],
  ["WORD_PAIR_IDENTIFY_ALL", "WORD_ALPHABET_PAIR_MATCH", "identifyMatchingWordPairs", "PAIR_SET", "POSITION_TRACK", "PAIR_IDENTIFY_ALL", "PAIR_SCAN"],
  ["WORD_PAIR_IDENTIFY_FORWARD", "WORD_ALPHABET_PAIR_MATCH", "identifyForwardMatchingWordPairs", "PAIR_SET", "POSITION_TRACK", "PAIR_IDENTIFY_FORWARD", "PAIR_SCAN"],
  ["WORD_PAIR_IDENTIFY_BACKWARD", "WORD_ALPHABET_PAIR_MATCH", "identifyBackwardMatchingWordPairs", "PAIR_SET", "POSITION_TRACK", "PAIR_IDENTIFY_BACKWARD", "PAIR_SCAN"],
  ["WORD_PAIR_SELECT_EXACT_COUNT", "WORD_ALPHABET_PAIR_SELECTION", "selectWordByMatchingPairCount", "WORD", "STRUCTURED_TEXT", "PAIR_WORD_SELECTION", "PAIR_COMPARISON"],
  ["WORD_PAIR_COMPARE_COUNTS", "WORD_ALPHABET_PAIR_COMPARISON", "compareMatchingPairCounts", "NUMBER", "STRUCTURED_TEXT", "PAIR_COUNT_COMPARISON", "PAIR_COMPARISON"],
];

export const ALP_CP006_QLS: readonly AlpQuestionLogic[] = rows.map((row, index) => ({
  qlId: `ALP-QL-${String(index + 105).padStart(3, "0")}`,
  checkpointId: "ALP-CP-006",
  solveMode: row[0],
  ruleId: row[1],
  taskKind: row[2],
  answerType: row[3],
  renderer: row[4],
  presentationMode: row[5],
  localeMode: "TRANSLATABLE",
  difficultyProfile: row[6],
  status: "FROZEN",
}));
