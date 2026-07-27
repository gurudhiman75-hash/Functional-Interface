import type { CodAnswerType, CodRenderer } from "../foundation/types";
import type { CodCp006QuestionLogic, CodCp006RuleId, CodCp006TaskKind } from "./types";

function answerType(ruleId: CodCp006RuleId, taskKind: CodCp006TaskKind): CodAnswerType {
  if (taskKind === "DECODE_TARGET") return "LETTER_CLUSTER";
  if (taskKind === "RECOVER_MISSING_TOKEN") {
    return ruleId === "TRANSFORM_THEN_RANK_SEQUENCE" ? "NUMBER" : "SINGLE_CODE_TOKEN";
  }
  return ruleId === "TRANSFORM_THEN_RANK_SEQUENCE" ? "DIGIT_SEQUENCE" : "LETTER_CLUSTER";
}

function renderer(taskKind: CodCp006TaskKind): CodRenderer {
  if (taskKind === "RECOVER_MISSING_TOKEN") return "MAPPING_TABLE";
  if (taskKind === "INFER_AND_ENCODE" || taskKind === "CHOOSE_MATCHING_CODE") return "EXAMPLE_TARGET_BLOCK";
  return "INLINE_CODE_PAIR";
}

function logic(
  number: number,
  ruleId: CodCp006RuleId,
  taskKind: CodCp006TaskKind,
  input: {
    examples?: readonly [number, number];
    targetLength?: readonly [number, number];
    requireWrap?: boolean;
    requireMixedLengths?: boolean;
  } = {},
): CodCp006QuestionLogic {
  return {
    qlId: `COD-QL-${String(number).padStart(3, "0")}`,
    checkpointId: "COD-CP-006",
    ruleId,
    taskKind,
    answerType: answerType(ruleId, taskKind),
    renderer: renderer(taskKind),
    allowedDifficulties: ["EASY", "MEDIUM", "HARD"],
    targetLength: input.targetLength ?? [4, 6],
    exampleCount: input.examples ?? [2, 3],
    requireWrap: input.requireWrap ?? false,
    requireMixedLengths: input.requireMixedLengths ?? false,
    status: "IMPLEMENTED",
  };
}

function sixQlBlock(start: number, ruleId: CodCp006RuleId): CodCp006QuestionLogic[] {
  return [
    logic(start, ruleId, "ENCODE_TARGET"),
    logic(start + 1, ruleId, "CHOOSE_MATCHING_CODE"),
    logic(start + 2, ruleId, "DECODE_TARGET"),
    logic(start + 3, ruleId, "INFER_AND_ENCODE", { examples: [3, 3], requireMixedLengths: true }),
    logic(start + 4, ruleId, "RECOVER_MISSING_TOKEN", { examples: [3, 3] }),
    logic(start + 5, ruleId, "ENCODE_TARGET", { examples: [3, 3], targetLength: [6, 6], requireWrap: true }),
  ];
}

function fourQlBlock(start: number, ruleId: CodCp006RuleId): CodCp006QuestionLogic[] {
  return [
    logic(start, ruleId, "ENCODE_TARGET"),
    logic(start + 1, ruleId, "DECODE_TARGET"),
    logic(start + 2, ruleId, "INFER_AND_ENCODE", { examples: [3, 3], requireMixedLengths: true }),
    logic(start + 3, ruleId, "RECOVER_MISSING_TOKEN", { examples: [3, 3] }),
  ];
}

export const COD_CP006_QUESTION_LOGICS: readonly CodCp006QuestionLogic[] = [
  ...sixQlBlock(137, "REVERSE_THEN_INDEXED_SHIFT"),
  ...sixQlBlock(143, "PAIR_SWAP_THEN_ALTERNATING_SHIFT"),
  ...sixQlBlock(149, "HALF_SWAP_THEN_ODD_EVEN_SHIFT"),
  logic(155, "ROTATE_THEN_CLASS_SHIFT", "ENCODE_TARGET"),
  logic(156, "ROTATE_THEN_CLASS_SHIFT", "CHOOSE_MATCHING_CODE"),
  logic(157, "ROTATE_THEN_CLASS_SHIFT", "RECOVER_MISSING_TOKEN", { examples: [3, 3] }),
  logic(158, "ROTATE_THEN_CLASS_SHIFT", "INFER_AND_ENCODE", { examples: [3, 3], requireMixedLengths: true }),
  logic(159, "ROTATE_THEN_CLASS_SHIFT", "ENCODE_TARGET", { examples: [3, 3], requireMixedLengths: true }),
  logic(160, "ROTATE_THEN_CLASS_SHIFT", "ENCODE_TARGET", { examples: [3, 3], targetLength: [6, 6], requireWrap: true }),
  ...fourQlBlock(161, "OPPOSITE_MAP_WITH_POSITION_PERMUTATION"),
  ...fourQlBlock(165, "TRANSFORM_THEN_RANK_SEQUENCE"),
];

export function getCodCp006QuestionLogic(qlId: string): CodCp006QuestionLogic {
  const found = COD_CP006_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error(`Unknown COD-CP-006 QL '${qlId}'`);
  return found;
}
