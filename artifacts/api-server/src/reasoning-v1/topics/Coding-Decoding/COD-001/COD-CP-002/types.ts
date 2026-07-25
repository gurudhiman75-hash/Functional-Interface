import type { CodAnswerType, CodDifficulty, CodRenderer } from "../foundation/types";

export type CodCp002RuleId =
  | "A1Z26_SEQUENCE_CODE"
  | "Z1A26_SEQUENCE_CODE"
  | "RANK_PLUS_CONSTANT_SEQUENCE"
  | "RANK_MINUS_CONSTANT_SEQUENCE"
  | "SUM_OF_FORWARD_RANKS"
  | "SUM_PLUS_WORD_LENGTH"
  | "SUM_MINUS_WORD_LENGTH"
  | "POSITION_WEIGHTED_SUM"
  | "ODD_EVEN_POSITION_DIFFERENCE";

export type CodCp002TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "RECOVER_MISSING_VALUE"
  | "INFER_AND_ENCODE"
  | "CHOOSE_MATCHING_CODE";

export type CodCp002OutputShape = "SEQUENCE" | "SCALAR";

export interface CodCp002QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-002";
  ruleId: CodCp002RuleId;
  taskKind: CodCp002TaskKind;
  outputShape: CodCp002OutputShape;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  status: "IMPLEMENTED";
}

export interface CodCp002RuleContext {
  constant?: number;
}

export interface NumericCodeEvidence {
  word: string;
  code: string;
}

export interface NumericCodingPrompt {
  taskKind: CodCp002TaskKind;
  outputShape: CodCp002OutputShape;
  evidence: readonly NumericCodeEvidence[];
  targetWord: string;
  encodedTarget?: string;
  missingIndex?: number;
  displayedTargetCode?: string;
  separator: string;
}

export interface GeneratedCodCp002Question {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-002";
  ruleId: CodCp002RuleId;
  ruleContext: CodCp002RuleContext;
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: NumericCodingPrompt;
  options: readonly import("../foundation/types").GeneratedOption[];
  correctIndex: number;
  explanation: import("../foundation/types").ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp002-v2";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    ambiguityAccepted: boolean;
    matchingRuleCount: number;
  };
}
