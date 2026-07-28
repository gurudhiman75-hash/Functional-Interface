import type { AlpAnswerType, AlpQuestionLogic, AlpRenderer, AlpSolveMode } from "../types";

type Row = readonly [AlpSolveMode, string, string, AlpAnswerType, AlpRenderer];
const rows: readonly Row[] = [
  ["SHIFT_RIGHT_FROM_LETTER_BOUNDED", "ALPHA_RELATIVE_OFFSET", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["SHIFT_LEFT_FROM_LETTER_BOUNDED", "ALPHA_RELATIVE_OFFSET", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["SHIFT_RIGHT_FROM_LEFT_RANK", "ALPHA_OFFSET_FROM_LEFT_RANK", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["SHIFT_LEFT_FROM_LEFT_RANK", "ALPHA_OFFSET_FROM_LEFT_RANK", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["SHIFT_RIGHT_FROM_RIGHT_RANK", "ALPHA_OFFSET_FROM_RIGHT_RANK", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["SHIFT_LEFT_FROM_RIGHT_RANK", "ALPHA_OFFSET_FROM_RIGHT_RANK", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["RECOVER_ANCHOR_FROM_RIGHT_SHIFT", "ALPHA_INVERSE_OFFSET", "recoverAnchor", "LETTER", "STRUCTURED_TEXT"],
  ["RECOVER_ANCHOR_FROM_LEFT_SHIFT", "ALPHA_INVERSE_OFFSET", "recoverAnchor", "LETTER", "STRUCTURED_TEXT"],
  ["FIND_FORWARD_OFFSET", "ALPHA_FIND_OFFSET", "findOffset", "NUMBER", "STRUCTURED_TEXT"],
  ["FIND_BACKWARD_OFFSET", "ALPHA_FIND_OFFSET", "findOffset", "NUMBER", "STRUCTURED_TEXT"],
  ["FIND_SIGNED_DIRECTION_AND_OFFSET", "ALPHA_FIND_DIRECTION_OFFSET", "findDirectionAndOffset", "DIRECTION_OFFSET", "STRUCTURED_TEXT"],
  ["TWO_STAGE_RIGHT_THEN_LEFT", "ALPHA_COMPOSITE_OFFSET", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["TWO_STAGE_LEFT_THEN_RIGHT", "ALPHA_COMPOSITE_OFFSET", "findRelativeLetter", "LETTER", "POSITION_TRACK"],
  ["POSITION_AFTER_SHIFT_FROM_LEFT", "ALPHA_POSITION_AFTER_OFFSET", "findPosition", "NUMBER", "STRUCTURED_TEXT"],
  ["POSITION_AFTER_SHIFT_FROM_RIGHT", "ALPHA_POSITION_AFTER_OFFSET", "findPosition", "NUMBER", "STRUCTURED_TEXT"],
  ["CYCLIC_SHIFT_RIGHT_FROM_LETTER", "ALPHA_CYCLIC_OFFSET", "findRelativeLetter", "LETTER", "TOKEN_ROW"],
  ["CYCLIC_SHIFT_LEFT_FROM_LETTER", "ALPHA_CYCLIC_OFFSET", "findRelativeLetter", "LETTER", "TOKEN_ROW"],
  ["RECOVER_ANCHOR_CYCLIC", "ALPHA_CYCLIC_INVERSE_OFFSET", "recoverAnchor", "LETTER", "TOKEN_ROW"],
];

export const ALP_CP002_QLS: readonly AlpQuestionLogic[] = rows.map((row, index) => ({
  qlId: `ALP-QL-${String(index + 13).padStart(3, "0")}`,
  checkpointId: "ALP-CP-002",
  solveMode: row[0],
  ruleId: row[1],
  taskKind: row[2],
  answerType: row[3],
  renderer: row[4],
  presentationMode: index < 6 ? "DIRECT_OFFSET" : index < 11 ? "INVERSE_OFFSET" : index < 15 ? "COMPOSITE_OFFSET" : "EXPLICIT_CYCLIC_OFFSET",
  localeMode: "TRANSLATABLE",
  difficultyProfile: index < 6 ? "REFERENCE_PLUS_OFFSET" : index < 11 ? "INVERSE_OR_COMPARISON" : "COMPOSITE_OR_WRAP",
  status: "IMPLEMENTED",
}));
