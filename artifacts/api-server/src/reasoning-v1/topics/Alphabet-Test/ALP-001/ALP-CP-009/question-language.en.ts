import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

type Row = readonly [AlpSolveMode, string, string, AlpAnswerType, AlpRenderer, string, string];
const rows: readonly Row[] = [
  ["COMPOSITE_CLASS_SHIFT_SORT_POSITION", "COMPOSITE_CLASS_PIPELINE", "findLetterAfterClassShiftThenSort", "LETTER", "TOKEN_ROW", "SHIFT_THEN_SORT", "COMPOSITE_WORD"],
  ["COMPOSITE_CLASS_SHIFT_REVERSE_POSITION", "COMPOSITE_CLASS_PIPELINE", "findLetterAfterClassShiftThenReverse", "LETTER", "TOKEN_ROW", "SHIFT_THEN_REVERSE", "COMPOSITE_WORD"],
  ["COMPOSITE_CLASS_SHIFT_UNCHANGED_COUNT", "COMPOSITE_CLASS_PIPELINE", "countUnchangedAfterShiftAndSort", "NUMBER", "TOKEN_ROW", "SHIFT_SORT_UNCHANGED", "COMPOSITE_WORD"],
  ["COMPOSITE_PAIR_COUNT_AFTER_CLASS_SHIFT", "COMPOSITE_PAIR_PIPELINE", "countPairsAfterClassShift", "NUMBER", "POSITION_TRACK", "SHIFT_THEN_PAIR_COUNT", "COMPOSITE_PAIR"],
  ["COMPOSITE_MIXED_FILTER_SORT_POSITION", "COMPOSITE_MIXED_PIPELINE", "findTokenAfterFilterAndSort", "TOKEN", "TOKEN_ROW", "FILTER_THEN_SORT", "COMPOSITE_MIXED"],
  ["COMPOSITE_MIXED_SORT_THEN_PATTERN_COUNT", "COMPOSITE_MIXED_PIPELINE", "countPatternsAfterPartialSort", "NUMBER", "TOKEN_ROW", "SORT_THEN_CONTEXT_SCAN", "COMPOSITE_MIXED"],
  ["COMPOSITE_MIXED_GROUP_RELATIVE", "COMPOSITE_MIXED_PIPELINE", "findRelativeTokenAfterGrouping", "TOKEN", "TOKEN_ROW", "GROUP_THEN_RELATIVE", "COMPOSITE_MIXED"],
  ["COMPOSITE_COMPARE_PAIR_COUNT_BEFORE_AFTER", "COMPOSITE_PAIR_PIPELINE", "comparePairCountBeforeAfterTransform", "NUMBER", "POSITION_TRACK", "PAIR_COUNT_BEFORE_AFTER", "COMPOSITE_PAIR"],
];

export const ALP_CP009_QLS: readonly AlpQuestionLogic[] = rows.map((row, index) => ({
  qlId: `ALP-QL-${String(index + 141).padStart(3, "0")}`,
  checkpointId: "ALP-CP-009",
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
