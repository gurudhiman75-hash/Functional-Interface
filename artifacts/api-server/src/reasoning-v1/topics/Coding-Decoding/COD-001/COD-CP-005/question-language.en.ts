import type { CodAnswerType, CodRenderer } from "../foundation/types";
import type { CodCp005QuestionLogic, CodCp005RuleId, CodCp005TaskKind } from "./types";

function answerType(taskKind: CodCp005TaskKind): CodAnswerType {
  return taskKind === "RECOVER_MISSING_LETTER" ? "SINGLE_CODE_TOKEN" : "LETTER_CLUSTER";
}

function renderer(taskKind: CodCp005TaskKind): CodRenderer {
  if (taskKind === "RECOVER_MISSING_LETTER") return "MAPPING_TABLE";
  if (taskKind === "INFER_AND_ENCODE" || taskKind === "CHOOSE_MATCHING_CODE") return "EXAMPLE_TARGET_BLOCK";
  return "INLINE_CODE_PAIR";
}

function logic(
  number: number,
  ruleId: CodCp005RuleId,
  taskKind: CodCp005TaskKind,
  input: { examples?: readonly [number, number]; targetLength?: readonly [number, number] } = {},
): CodCp005QuestionLogic {
  return {
    qlId: `COD-QL-${String(number).padStart(3, "0")}`,
    checkpointId: "COD-CP-005",
    ruleId,
    taskKind,
    answerType: answerType(taskKind),
    renderer: renderer(taskKind),
    allowedDifficulties: ["EASY", "MEDIUM", "HARD"],
    targetLength: input.targetLength ?? [4, 6],
    exampleCount: input.examples ?? [2, 3],
    status: "IMPLEMENTED",
  };
}

export const COD_CP005_QUESTION_LOGICS: readonly CodCp005QuestionLogic[] = [
  logic(113, "REVERSE_SEQUENCE", "ENCODE_TARGET"),
  logic(114, "REVERSE_SEQUENCE", "DECODE_TARGET"),
  logic(115, "REVERSE_SEQUENCE", "INFER_AND_ENCODE", { examples: [3, 4] }),
  logic(116, "REVERSE_SEQUENCE", "RECOVER_MISSING_LETTER", { examples: [3, 4] }),

  logic(117, "CYCLIC_POSITION_ROTATION", "ENCODE_TARGET"),
  logic(118, "CYCLIC_POSITION_ROTATION", "CHOOSE_MATCHING_CODE"),
  logic(119, "CYCLIC_POSITION_ROTATION", "DECODE_TARGET"),
  logic(120, "CYCLIC_POSITION_ROTATION", "INFER_AND_ENCODE", { examples: [3, 4] }),

  logic(121, "HALF_SWAP", "ENCODE_TARGET"),
  logic(122, "HALF_SWAP", "DECODE_TARGET"),
  logic(123, "HALF_SWAP", "INFER_AND_ENCODE", { examples: [3, 4] }),
  logic(124, "HALF_SWAP", "RECOVER_MISSING_LETTER", { examples: [3, 4] }),

  logic(125, "ODD_THEN_EVEN_EXTRACTION", "ENCODE_TARGET"),
  logic(126, "ODD_THEN_EVEN_EXTRACTION", "CHOOSE_MATCHING_CODE"),
  logic(127, "ODD_THEN_EVEN_EXTRACTION", "DECODE_TARGET"),
  logic(128, "ODD_THEN_EVEN_EXTRACTION", "RECOVER_MISSING_LETTER", { examples: [3, 4] }),

  logic(129, "EVEN_THEN_ODD_EXTRACTION", "ENCODE_TARGET"),
  logic(130, "EVEN_THEN_ODD_EXTRACTION", "DECODE_TARGET"),
  logic(131, "EVEN_THEN_ODD_EXTRACTION", "INFER_AND_ENCODE", { examples: [3, 4] }),
  logic(132, "EVEN_THEN_ODD_EXTRACTION", "CHOOSE_MATCHING_CODE"),

  logic(133, "OUTER_INNER_INTERLEAVING", "ENCODE_TARGET"),
  logic(134, "OUTER_INNER_INTERLEAVING", "DECODE_TARGET"),
  logic(135, "OUTER_INNER_INTERLEAVING", "INFER_AND_ENCODE", { examples: [3, 4] }),
  logic(136, "OUTER_INNER_INTERLEAVING", "RECOVER_MISSING_LETTER", { examples: [3, 4] }),
];

export function getCodCp005QuestionLogic(qlId: string): CodCp005QuestionLogic {
  const found = COD_CP005_QUESTION_LOGICS.find((entry) => entry.qlId === qlId);
  if (!found) throw new Error(`Unknown COD-CP-005 QL '${qlId}'`);
  return found;
}
