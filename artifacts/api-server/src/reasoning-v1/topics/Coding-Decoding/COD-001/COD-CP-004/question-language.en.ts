import type { CodAnswerType, CodRenderer } from "../foundation/types";
import type { CodCp004QuestionLogic, CodCp004RuleId, CodCp004TaskKind } from "./types";

function answerType(taskKind: CodCp004TaskKind): CodAnswerType {
  return taskKind === "RECOVER_MISSING_LETTER" ? "SINGLE_CODE_TOKEN" : "LETTER_CLUSTER";
}

function renderer(taskKind: CodCp004TaskKind): CodRenderer {
  if (taskKind === "RECOVER_MISSING_LETTER") return "MAPPING_TABLE";
  if (taskKind === "INFER_AND_ENCODE" || taskKind === "CHOOSE_MATCHING_CODE") return "EXAMPLE_TARGET_BLOCK";
  return "INLINE_CODE_PAIR";
}

function logic(number: number, ruleId: CodCp004RuleId, taskKind: CodCp004TaskKind, input: {
  examples?: readonly [number, number];
  targetLength?: readonly [number, number];
  requireWrap?: boolean;
} = {}): CodCp004QuestionLogic {
  return {
    qlId: `COD-QL-${String(number).padStart(3, "0")}`,
    checkpointId: "COD-CP-004",
    ruleId,
    taskKind,
    answerType: answerType(taskKind),
    renderer: renderer(taskKind),
    allowedDifficulties: ["EASY", "MEDIUM", "HARD"],
    targetLength: input.targetLength ?? [4, 6],
    exampleCount: input.examples ?? [2, 3],
    requireWrap: input.requireWrap ?? false,
    status: "IMPLEMENTED",
  };
}

function sixQlBlock(start: number, ruleId: CodCp004RuleId): CodCp004QuestionLogic[] {
  return [
    logic(start, ruleId, "ENCODE_TARGET"),
    logic(start + 1, ruleId, "CHOOSE_MATCHING_CODE"),
    logic(start + 2, ruleId, "DECODE_TARGET"),
    logic(start + 3, ruleId, "INFER_AND_ENCODE", { examples: [3, 4] }),
    logic(start + 4, ruleId, "RECOVER_MISSING_LETTER", { examples: [3, 4] }),
    logic(start + 5, ruleId, "ENCODE_TARGET", { examples: [3, 4], requireWrap: true }),
  ];
}

function fourQlBlock(start: number, ruleId: CodCp004RuleId): CodCp004QuestionLogic[] {
  return [
    logic(start, ruleId, "ENCODE_TARGET"),
    logic(start + 1, ruleId, "DECODE_TARGET"),
    logic(start + 2, ruleId, "INFER_AND_ENCODE", { examples: [3, 4] }),
    logic(start + 3, ruleId, "RECOVER_MISSING_LETTER", { examples: [3, 4] }),
  ];
}

export const COD_CP004_QUESTION_LOGICS: readonly CodCp004QuestionLogic[] = [
  ...sixQlBlock(81, "INCREMENTAL_FORWARD_SHIFT"),
  ...sixQlBlock(87, "INCREMENTAL_BACKWARD_SHIFT"),
  ...sixQlBlock(93, "ALTERNATING_SIGNED_SHIFT"),
  ...sixQlBlock(99, "ODD_EVEN_POSITION_SHIFT"),
  ...fourQlBlock(105, "VOWEL_CONSONANT_CLASS_SHIFT"),
  ...fourQlBlock(109, "ENDPOINT_INTERIOR_SHIFT"),
];

export function getCodCp004QuestionLogic(qlId: string): CodCp004QuestionLogic {
  const found = COD_CP004_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error(`Unknown COD-CP-004 QL '${qlId}'`);
  return found;
}
