import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

type Row = readonly [AlpSolveMode, string, string, AlpAnswerType, AlpRenderer];
const rows: readonly Row[] = [
  ["LETTER_AT_LEFT_RANK", "ALPHA_LETTER_AT_LEFT_RANK", "findLetter", "LETTER", "POSITION_TRACK"],
  ["LETTER_AT_RIGHT_RANK", "ALPHA_LETTER_AT_RIGHT_RANK", "findLetter", "LETTER", "POSITION_TRACK"],
  ["LEFT_RANK_OF_LETTER", "ALPHA_LEFT_RANK", "findPosition", "NUMBER", "POSITION_TRACK"],
  ["RIGHT_RANK_OF_LETTER", "ALPHA_RIGHT_RANK", "findPosition", "NUMBER", "POSITION_TRACK"],
  ["RIGHT_RANK_FROM_LEFT_RANK", "ALPHA_RANK_CONVERSION", "convertPosition", "NUMBER", "STRUCTURED_TEXT"],
  ["LEFT_RANK_FROM_RIGHT_RANK", "ALPHA_RANK_CONVERSION", "convertPosition", "NUMBER", "STRUCTURED_TEXT"],
  ["OPPOSITE_OF_LETTER", "ALPHA_OPPOSITE_LETTER", "findOppositeLetter", "LETTER", "POSITION_TRACK"],
  ["OPPOSITE_OF_LEFT_RANK", "ALPHA_OPPOSITE_FROM_RANK", "findOppositeLetter", "LETTER", "POSITION_TRACK"],
  ["OPPOSITE_OF_RIGHT_RANK", "ALPHA_OPPOSITE_FROM_RANK", "findOppositeLetter", "LETTER", "POSITION_TRACK"],
  ["BOTH_RANKS_OF_LETTER", "ALPHA_BOTH_RANKS", "findBothPositions", "NUMBER_PAIR", "STRUCTURED_TEXT"],
  ["IDENTIFY_LETTER_FROM_RANK_PAIR", "ALPHA_LETTER_FROM_RANK_PAIR", "findLetter", "LETTER", "STRUCTURED_TEXT"],
  ["IDENTIFY_OPPOSITE_PAIR", "ALPHA_OPPOSITE_PAIR", "identifyPair", "PAIR_SELECTION", "STRUCTURED_TEXT"],
];

export const ALP_CP001_QLS: readonly AlpQuestionLogic[] = rows.map((row, index) => ({
  qlId: `ALP-QL-${String(index + 1).padStart(3, "0")}`,
  checkpointId: "ALP-CP-001",
  solveMode: row[0],
  ruleId: row[1],
  taskKind: row[2],
  answerType: row[3],
  renderer: row[4],
  presentationMode: index === 11 ? "PAIR_SELECTION" : index % 2 === 0 ? "DIRECT_QUERY" : "REVERSE_REFERENCE_QUERY",
  localeMode: "TRANSLATABLE",
  difficultyProfile: index < 4 ? "DIRECT_SINGLE_STEP" : index < 9 ? "ONE_CONVERSION" : "RELATION_SELECTION",
  status: "IMPLEMENTED",
}));
