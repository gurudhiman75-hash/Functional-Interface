import type { CodAnswerType, CodDifficulty, CodRenderer, ExplanationTrace, GeneratedOption } from "../foundation/types";
import type { CodCp003RuleContext, CodCp003RuleId } from "../COD-CP-003/types";
import type { CodCp004RuleContext, CodCp004RuleId } from "../COD-CP-004/types";
import type { CodCp005RuleContext, CodCp005RuleId } from "../COD-CP-005/types";

export type CodCp006RuleId =
  | "REVERSE_THEN_INDEXED_SHIFT"
  | "PAIR_SWAP_THEN_ALTERNATING_SHIFT"
  | "HALF_SWAP_THEN_ODD_EVEN_SHIFT"
  | "ROTATE_THEN_CLASS_SHIFT"
  | "OPPOSITE_MAP_WITH_POSITION_PERMUTATION"
  | "TRANSFORM_THEN_RANK_SEQUENCE";

export type CodCp006TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "INFER_AND_ENCODE"
  | "RECOVER_MISSING_TOKEN"
  | "CHOOSE_MATCHING_CODE";

export type EarlierTransformCheckpoint = "COD-CP-003" | "COD-CP-004";

export interface CodCp006RuleContext {
  baseShift?: 1 | 2;
  direction?: 1 | -1;
  magnitude?: 1 | 2 | 3;
  firstDirection?: 1 | -1;
  oddShift?: number;
  evenShift?: number;
  rotationDirection?: "LEFT" | "RIGHT";
  rotationAmount?: 1 | 2;
  vowelShift?: number;
  consonantShift?: number;
  permutationRuleId?: CodCp005RuleId;
  permutationContext?: CodCp005RuleContext;
  transformCheckpoint?: EarlierTransformCheckpoint;
  transformRuleId?: CodCp003RuleId | CodCp004RuleId;
  transformContext?: CodCp003RuleContext | CodCp004RuleContext;
  separator?: "-";
}

export interface CodCp006QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-006";
  ruleId: CodCp006RuleId;
  taskKind: CodCp006TaskKind;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  requireWrap: boolean;
  requireMixedLengths: boolean;
  status: "IMPLEMENTED";
}

export interface CompositeEvidence {
  source: string;
  code: string;
}

export interface CompositePrompt {
  taskKind: CodCp006TaskKind;
  evidence: readonly CompositeEvidence[];
  targetWord: string;
  encodedTarget?: string;
  missingIndex?: number;
  displayedTargetCode?: string;
  separator: string;
}

export interface CompositeStageResult {
  stage1: string;
  finalCode: string;
}

export interface GeneratedCodCp006Question {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-006";
  ruleId: CodCp006RuleId;
  ruleContext: CodCp006RuleContext;
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: CompositePrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp006-v1";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    ambiguityAccepted: boolean;
    matchingRuleCount: number;
    stage1Output: string;
    stage1Active: true;
    stage2Active: true;
    stageOrderNormalized: boolean;
    inverseUnique: true;
    wrapUsed: boolean;
  };
}
