import type { CodAnswerType, CodRenderer } from "../foundation/types";
import type { CodCp003ContextMode, CodCp003QuestionLogic, CodCp003RuleId, CodCp003TaskKind } from "./types";

function answerType(taskKind: CodCp003TaskKind): CodAnswerType {
  return taskKind === "RECOVER_MISSING_LETTER" ? "SINGLE_CODE_TOKEN" : "LETTER_CLUSTER";
}

function renderer(taskKind: CodCp003TaskKind): CodRenderer {
  if (taskKind === "RECOVER_MISSING_LETTER") return "MAPPING_TABLE";
  if (taskKind === "INFER_AND_ENCODE" || taskKind === "CHOOSE_MATCHING_CODE") return "EXAMPLE_TARGET_BLOCK";
  return "INLINE_CODE_PAIR";
}

function logic(input: {
  number: number;
  ruleId: CodCp003RuleId;
  taskKind: CodCp003TaskKind;
  contextMode: CodCp003ContextMode;
  requireWrap?: boolean;
  examples?: readonly [number, number];
  targetLength?: readonly [number, number];
}): CodCp003QuestionLogic {
  return {
    qlId: `COD-QL-${String(input.number).padStart(3, "0")}`,
    checkpointId: "COD-CP-003",
    ruleId: input.ruleId,
    taskKind: input.taskKind,
    contextMode: input.contextMode,
    answerType: answerType(input.taskKind),
    renderer: renderer(input.taskKind),
    allowedDifficulties: ["EASY", "MEDIUM", "HARD"],
    targetLength: input.targetLength ?? [3, 6],
    exampleCount: input.examples ?? [2, 3],
    requireWrap: input.requireWrap ?? false,
    status: "IMPLEMENTED",
  };
}

export const COD_CP003_QUESTION_LOGICS: readonly CodCp003QuestionLogic[] = [
  logic({ number: 53, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "FORWARD" }),
  logic({ number: 54, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "FORWARD" }),
  logic({ number: 55, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "FORWARD", targetLength: [4, 6] }),
  logic({ number: 56, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "FORWARD", targetLength: [4, 6] }),
  logic({ number: 57, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "FORWARD", examples: [3, 4] }),
  logic({ number: 58, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "FORWARD", examples: [3, 4] }),

  logic({ number: 59, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "BACKWARD" }),
  logic({ number: 60, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "BACKWARD" }),
  logic({ number: 61, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "BACKWARD", targetLength: [4, 6] }),
  logic({ number: 62, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "BACKWARD", targetLength: [4, 6] }),
  logic({ number: 63, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "BACKWARD", examples: [3, 4] }),
  logic({ number: 64, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "BACKWARD", examples: [3, 4] }),

  logic({ number: 65, ruleId: "OPPOSITE_ALPHABET_MAP", taskKind: "ENCODE_TARGET", contextMode: "OPPOSITE" }),
  logic({ number: 66, ruleId: "OPPOSITE_ALPHABET_MAP", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "OPPOSITE" }),
  logic({ number: 67, ruleId: "OPPOSITE_ALPHABET_MAP", taskKind: "ENCODE_TARGET", contextMode: "OPPOSITE", targetLength: [4, 6] }),
  logic({ number: 68, ruleId: "OPPOSITE_ALPHABET_MAP", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "OPPOSITE", examples: [3, 4] }),

  logic({ number: 69, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "DECODE_TARGET", contextMode: "FORWARD" }),
  logic({ number: 70, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "DECODE_TARGET", contextMode: "BACKWARD" }),
  logic({ number: 71, ruleId: "OPPOSITE_ALPHABET_MAP", taskKind: "DECODE_TARGET", contextMode: "OPPOSITE" }),
  logic({ number: 72, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "DECODE_TARGET", contextMode: "SIGNED", examples: [3, 4] }),

  logic({ number: 73, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "INFER_AND_ENCODE", contextMode: "FORWARD", examples: [3, 4] }),
  logic({ number: 74, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "INFER_AND_ENCODE", contextMode: "BACKWARD", examples: [3, 4] }),
  logic({ number: 75, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "INFER_AND_ENCODE", contextMode: "SIGNED", examples: [3, 4], targetLength: [4, 6] }),
  logic({ number: 76, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "CHOOSE_MATCHING_CODE", contextMode: "SIGNED", examples: [4, 4], targetLength: [4, 6] }),

  logic({ number: 77, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "FORWARD", requireWrap: true }),
  logic({ number: 78, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "ENCODE_TARGET", contextMode: "BACKWARD", requireWrap: true }),
  logic({ number: 79, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "RECOVER_MISSING_LETTER", contextMode: "FORWARD", requireWrap: true }),
  logic({ number: 80, ruleId: "UNIFORM_CYCLIC_SHIFT", taskKind: "RECOVER_MISSING_LETTER", contextMode: "BACKWARD", requireWrap: true }),
];

export function getCodCp003QuestionLogic(qlId: string): CodCp003QuestionLogic {
  const logicEntry = COD_CP003_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!logicEntry) throw new Error(`Unknown COD-CP-003 QL '${qlId}'`);
  return logicEntry;
}
