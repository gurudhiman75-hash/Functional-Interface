import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

type Row = readonly [AlpSolveMode, string, string, AlpAnswerType, AlpRenderer];
const rows: readonly Row[] = [
  ["EXCLUSIVE_GAP", "ALPHA_EXCLUSIVE_GAP", "countLettersBetween", "NUMBER", "POSITION_TRACK"],
  ["INCLUSIVE_SPAN", "ALPHA_INCLUSIVE_SPAN", "countOccupiedPositions", "NUMBER", "POSITION_TRACK"],
  ["ABSOLUTE_POSITION_DISTANCE", "ALPHA_POSITION_DISTANCE", "findDistance", "NUMBER", "POSITION_TRACK"],
  ["MIDPOINT_SINGLE", "ALPHA_SINGLE_MIDPOINT", "findMiddleLetter", "LETTER", "POSITION_TRACK"],
  ["MIDPOINT_PAIR", "ALPHA_DOUBLE_MIDPOINT", "findMiddlePair", "LETTER_PAIR", "POSITION_TRACK"],
  ["IDENTIFY_PAIR_WITH_GAP", "ALPHA_PAIR_BY_GAP", "identifyPair", "PAIR_SELECTION", "STRUCTURED_TEXT"],
  ["IDENTIFY_PAIR_WITH_DISTANCE", "ALPHA_PAIR_BY_DISTANCE", "identifyPair", "PAIR_SELECTION", "STRUCTURED_TEXT"],
  ["RECOVER_RIGHT_ENDPOINT_FROM_GAP", "ALPHA_ENDPOINT_FROM_GAP", "recoverEndpoint", "LETTER", "POSITION_TRACK"],
  ["RECOVER_LEFT_ENDPOINT_FROM_GAP", "ALPHA_ENDPOINT_FROM_GAP", "recoverEndpoint", "LETTER", "POSITION_TRACK"],
  ["RECOVER_ENDPOINT_FROM_DISTANCE_AND_DIRECTION", "ALPHA_ENDPOINT_FROM_DISTANCE", "recoverEndpoint", "LETTER", "POSITION_TRACK"],
  ["MIDPOINT_DISTANCE_FROM_ENDPOINTS", "ALPHA_MIDPOINT_DISTANCE", "findDistanceToMiddle", "NUMBER", "POSITION_TRACK"],
  ["RECOVER_ENDPOINTS_FROM_MIDPOINT_AND_DISTANCE", "ALPHA_ENDPOINTS_FROM_MIDPOINT", "recoverEndpoints", "LETTER_PAIR", "POSITION_TRACK"],
  ["COMPARE_TWO_GAPS", "ALPHA_COMPARE_GAPS", "compareIntervals", "NUMBER", "STRUCTURED_TEXT"],
  ["COUNT_LETTERS_OUTSIDE_INTERVAL", "ALPHA_OUTSIDE_INTERVAL", "countOutside", "NUMBER", "POSITION_TRACK"],
  ["COUNT_LETTERS_BEFORE_AND_AFTER", "ALPHA_BEFORE_AFTER_COUNTS", "countBeforeAfter", "NUMBER_PAIR", "POSITION_TRACK"],
  ["EQUAL_SIDE_GAP", "ALPHA_EQUAL_SIDE_GAP", "findEqualSideGap", "NUMBER", "POSITION_TRACK"],
];

export const ALP_CP003_QLS: readonly AlpQuestionLogic[] = rows.map((row, index) => ({
  qlId: `ALP-QL-${String(index + 31).padStart(3, "0")}`,
  checkpointId: "ALP-CP-003",
  solveMode: row[0],
  ruleId: row[1],
  taskKind: row[2],
  answerType: row[3],
  renderer: row[4],
  presentationMode: index < 5 ? "DIRECT_INTERVAL" : index < 7 ? "PAIR_SELECTION" : index < 12 ? "INVERSE_INTERVAL" : "INTERVAL_COMPARISON",
  localeMode: "TRANSLATABLE",
  difficultyProfile: index < 5 ? "DIRECT_INTERVAL" : index < 12 ? "PAIR_OR_INVERSE" : "COMPARATIVE_INTERVAL",
  status: "IMPLEMENTED",
}));
