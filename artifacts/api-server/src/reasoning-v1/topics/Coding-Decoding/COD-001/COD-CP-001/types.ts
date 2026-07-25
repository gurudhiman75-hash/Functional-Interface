import type { CodAnswerType, CodDifficulty, CodRenderer, CodTokenKind } from "../foundation/types";

export type CodCp001RuleId =
  | "DIRECT_LETTER_TO_LETTER_MAP"
  | "DIRECT_LETTER_TO_DIGIT_MAP"
  | "DIRECT_LETTER_TO_SYMBOL_MAP"
  | "DIRECT_PARTIAL_MAPPING_INFERENCE";

export type CodCp001TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "RECOVER_MISSING_CODE"
  | "INFER_FROM_OVERLAP";

export interface CodCp001QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-001";
  ruleId: CodCp001RuleId;
  taskKind: CodCp001TaskKind;
  outputKind: CodTokenKind;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  evidenceMode: "EXPLICIT_TABLE" | "WORD_EXAMPLES" | "OVERLAPPING_EXAMPLES";
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  status: "IMPLEMENTED";
}
