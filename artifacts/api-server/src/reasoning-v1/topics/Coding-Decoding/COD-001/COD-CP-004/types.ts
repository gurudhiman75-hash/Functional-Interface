import type { CodAnswerType, CodDifficulty, CodRenderer, ExplanationTrace, GeneratedOption } from "../foundation/types";

export type CodCp004RuleId =
  | "INCREMENTAL_FORWARD_SHIFT"
  | "INCREMENTAL_BACKWARD_SHIFT"
  | "ALTERNATING_SIGNED_SHIFT"
  | "ODD_EVEN_POSITION_SHIFT"
  | "VOWEL_CONSONANT_CLASS_SHIFT"
  | "ENDPOINT_INTERIOR_SHIFT";

export type CodCp004TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "INFER_AND_ENCODE"
  | "RECOVER_MISSING_LETTER"
  | "CHOOSE_MATCHING_CODE";

export interface CodCp004RuleContext {
  baseShift?: number;
  magnitude?: number;
  firstDirection?: 1 | -1;
  oddShift?: number;
  evenShift?: number;
  vowelShift?: number;
  consonantShift?: number;
  endpointShift?: number;
  interiorShift?: number;
}

export interface CodCp004QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-004";
  ruleId: CodCp004RuleId;
  taskKind: CodCp004TaskKind;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  requireWrap: boolean;
  status: "IMPLEMENTED";
}

export interface PositionTransformEvidence {
  source: string;
  code: string;
}

export interface PositionTransformPrompt {
  taskKind: CodCp004TaskKind;
  evidence: readonly PositionTransformEvidence[];
  targetWord: string;
  encodedTarget?: string;
  missingIndex?: number;
}

export interface GeneratedCodCp004Question {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-004";
  ruleId: CodCp004RuleId;
  ruleContext: CodCp004RuleContext;
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: PositionTransformPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp004-v1";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    ambiguityAccepted: boolean;
    matchingRuleCount: number;
    wrapUsed: boolean;
    branchesActivated: boolean;
  };
}
