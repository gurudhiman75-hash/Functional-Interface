import type { CodAnswerType, CodDifficulty, CodRenderer, ExplanationTrace, GeneratedOption } from "../foundation/types";

export type CodCp003RuleId = "UNIFORM_CYCLIC_SHIFT" | "OPPOSITE_ALPHABET_MAP";

export type CodCp003TaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "INFER_AND_ENCODE"
  | "RECOVER_MISSING_LETTER"
  | "CHOOSE_MATCHING_CODE";

export type CodCp003ContextMode = "FORWARD" | "BACKWARD" | "SIGNED" | "OPPOSITE";

export interface CodCp003RuleContext {
  shift?: number;
}

export interface CodCp003QuestionLogic {
  qlId: `COD-QL-${string}`;
  checkpointId: "COD-CP-003";
  ruleId: CodCp003RuleId;
  taskKind: CodCp003TaskKind;
  contextMode: CodCp003ContextMode;
  answerType: CodAnswerType;
  renderer: CodRenderer;
  allowedDifficulties: readonly CodDifficulty[];
  targetLength: readonly [number, number];
  exampleCount: readonly [number, number];
  requireWrap: boolean;
  status: "IMPLEMENTED";
}

export interface AlphabetTransformEvidence {
  source: string;
  code: string;
}

export interface AlphabetTransformPrompt {
  taskKind: CodCp003TaskKind;
  evidence: readonly AlphabetTransformEvidence[];
  targetWord: string;
  encodedTarget?: string;
  missingIndex?: number;
  displayedTargetCode?: string;
}

export interface GeneratedCodCp003Question {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-003";
  ruleId: CodCp003RuleId;
  ruleContext: CodCp003RuleContext;
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: AlphabetTransformPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp003-v2";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    ambiguityAccepted: boolean;
    matchingRuleCount: number;
    wrapUsed: boolean;
  };
}
