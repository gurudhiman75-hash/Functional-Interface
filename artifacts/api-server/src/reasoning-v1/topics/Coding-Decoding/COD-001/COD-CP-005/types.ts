import type { CodAnswerType, CodDifficulty, CodRenderer, ExplanationTrace, GeneratedOption } from "../foundation/types";

export type CodCp005RuleId =
  | "REVERSE_SEQUENCE"
  | "CYCLIC_POSITION_ROTATION"
  | "HALF_SWAP"
  | "ODD_THEN_EVEN_EXTRACTION"
  | "EVEN_THEN_ODD_EXTRACTION"
  | "OUTER_INNER_INTERLEAVING";

export type CodCp005TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "INFER_AND_ENCODE"
  | "RECOVER_MISSING_LETTER"
  | "CHOOSE_MATCHING_CODE";

export interface CodCp005RuleContext {
  direction?: "LEFT" | "RIGHT";
  amount?: 1 | 2;
  startSide?: "LEFT" | "RIGHT";
}

export interface CodCp005QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-005";
  ruleId: CodCp005RuleId;
  taskKind: CodCp005TaskKind;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  status: "IMPLEMENTED";
}

export interface RearrangementEvidence {
  source: string;
  code: string;
}

export interface RearrangementPrompt {
  taskKind: CodCp005TaskKind;
  evidence: readonly RearrangementEvidence[];
  targetWord: string;
  encodedTarget?: string;
  missingIndex?: number;
  displayedTargetCode?: string;
}

export interface GeneratedCodCp005Question {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-005";
  ruleId: CodCp005RuleId;
  ruleContext: CodCp005RuleContext;
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: RearrangementPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp005-v1";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    ambiguityAccepted: boolean;
    matchingRuleCount: number;
    permutationOrder: readonly number[];
    inverseUnique: true;
  };
}
