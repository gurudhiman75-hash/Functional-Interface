import type { CodAnswerType, CodRenderer } from "../foundation/types";
import type { CodCp002OutputShape, CodCp002QuestionLogic, CodCp002RuleId, CodCp002TaskKind } from "./types";

const sequenceTasks: readonly CodCp002TaskKind[] = ["ENCODE_TARGET", "DECODE_TARGET", "RECOVER_MISSING_VALUE", "INFER_AND_ENCODE"];
const scalarTasks: readonly CodCp002TaskKind[] = ["ENCODE_TARGET", "INFER_AND_ENCODE", "CHOOSE_MATCHING_CODE", "RECOVER_MISSING_VALUE"];

function answerType(shape: CodCp002OutputShape, taskKind: CodCp002TaskKind): CodAnswerType {
  if (taskKind === "DECODE_TARGET") return "LETTER_CLUSTER";
  if (taskKind === "RECOVER_MISSING_VALUE") return "NUMBER";
  return shape === "SEQUENCE" ? "DIGIT_SEQUENCE" : "NUMBER";
}

function renderer(taskKind: CodCp002TaskKind): CodRenderer {
  if (taskKind === "RECOVER_MISSING_VALUE") return "MAPPING_TABLE";
  return taskKind === "INFER_AND_ENCODE" || taskKind === "CHOOSE_MATCHING_CODE" ? "EXAMPLE_TARGET_BLOCK" : "INLINE_CODE_PAIR";
}

function block(
  start: number,
  count: number,
  ruleId: CodCp002RuleId,
  outputShape: CodCp002OutputShape,
  taskPattern: readonly CodCp002TaskKind[],
): CodCp002QuestionLogic[] {
  return Array.from({ length: count }, (_, offset) => {
    const taskKind = taskPattern[offset % taskPattern.length]!;
    const qlId = `COD-QL-${String(start + offset).padStart(3, "0")}` as const;
    return {
      qlId,
      checkpointId: "COD-CP-002",
      ruleId,
      taskKind,
      outputShape,
      answerType: answerType(outputShape, taskKind),
      renderer: renderer(taskKind),
      allowedDifficulties: outputShape === "SEQUENCE" ? ["EASY", "MEDIUM", "HARD"] : ["MEDIUM", "HARD", "EASY"],
      targetLength: taskKind === "DECODE_TARGET" ? [3, 5] : [3, 6],
      exampleCount: outputShape === "SCALAR" ? [3, 4] : taskKind === "ENCODE_TARGET" ? [2, 3] : [2, 4],
      status: "IMPLEMENTED",
    } satisfies CodCp002QuestionLogic;
  });
}

export const COD_CP002_QUESTION_LOGICS: readonly CodCp002QuestionLogic[] = [
  ...block(25, 4, "A1Z26_SEQUENCE_CODE", "SEQUENCE", sequenceTasks),
  ...block(29, 4, "Z1A26_SEQUENCE_CODE", "SEQUENCE", sequenceTasks),
  ...block(33, 4, "RANK_PLUS_CONSTANT_SEQUENCE", "SEQUENCE", sequenceTasks),
  ...block(37, 4, "RANK_MINUS_CONSTANT_SEQUENCE", "SEQUENCE", sequenceTasks),
  ...block(41, 4, "SUM_OF_FORWARD_RANKS", "SCALAR", scalarTasks),
  ...block(45, 2, "SUM_PLUS_WORD_LENGTH", "SCALAR", scalarTasks),
  ...block(47, 2, "SUM_MINUS_WORD_LENGTH", "SCALAR", scalarTasks.slice(1)),
  ...block(49, 2, "POSITION_WEIGHTED_SUM", "SCALAR", ["ENCODE_TARGET", "INFER_AND_ENCODE"]),
  ...block(51, 2, "ODD_EVEN_POSITION_DIFFERENCE", "SCALAR", ["ENCODE_TARGET", "INFER_AND_ENCODE"]),
];

export function getCodCp002QuestionLogic(qlId: string): CodCp002QuestionLogic {
  const logic = COD_CP002_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!logic) throw new Error(`Unknown COD-CP-002 QL '${qlId}'`);
  return logic;
}
