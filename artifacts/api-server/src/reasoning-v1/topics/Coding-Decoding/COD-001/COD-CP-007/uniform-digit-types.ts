import type {
  CodDifficulty,
  CodRenderer,
  ExplanationTrace,
  GeneratedOption,
} from "../foundation/types";

export type DecimalDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type UniformDigitPrototypeId =
  | "COD-CP007-PROT-UNIFORM-DIGIT-ENCODE"
  | "COD-CP007-PROT-UNIFORM-DIGIT-DECODE"
  | "COD-CP007-PROT-UNIFORM-DIGIT-MISSING"
  | "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE"
  | "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING";

export type UniformDigitTaskKind =
  | "ENCODE_TARGET"
  | "DECODE_TARGET"
  | "RECOVER_MISSING_TOKEN"
  | "INFER_AND_ENCODE"
  | "CHOOSE_MATCHING_CODE";

export interface UniformDigitPrototypeContract {
  prototypeId: UniformDigitPrototypeId;
  taskKind: UniformDigitTaskKind;
  queryDirection: "FORWARD" | "INVERSE";
  answerType: "DIGIT_SEQUENCE" | "SINGLE_CODE_TOKEN";
  status: "PROTOTYPE";
}

export interface UniformDigitEvidence {
  source: string;
  code: string;
}

export interface UniformDigitStructuredPrompt {
  taskKind: UniformDigitTaskKind;
  evidence: readonly UniformDigitEvidence[];
  targetSource: string;
  targetCode: string;
  displayedTargetCode?: string;
  missingIndex?: number;
  ruleDisclosure: "EXPLICIT" | "INFER_FROM_EVIDENCE";
}

export interface UniformDigitAmbiguityAudit {
  accepted: boolean;
  intendedShift: number;
  uniformShiftSurvivors: readonly number[];
  wholeNumberDeltaSurvives: boolean;
  reversedUniformShiftSurvivors: readonly number[];
  arbitraryDigitMapConsistent: boolean;
  canonicalWinner: string | null;
  reason?: string;
}

export interface GeneratedUniformDigitPrototypeQuestion {
  packageId: "COD-001";
  checkpointId: "COD-CP-007";
  prototypeId: UniformDigitPrototypeId;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  ruleId: "UNIFORM_MODULAR_DIGIT_TRANSLATION";
  seed: number;
  locale: "en-IN";
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: "DIGIT_SEQUENCE" | "SINGLE_CODE_TOKEN";
  stem: string;
  structuredPrompt: UniformDigitStructuredPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-cp007-uniform-digit-prototype-v1";
    shift: number;
    hiddenFingerprint: string;
    ambiguityAccepted: true;
    uniformShiftSurvivors: readonly number[];
    wholeNumberDeltaSurvives: false;
    reversedUniformShiftSurvivors: readonly number[];
    arbitraryDigitMapConsistent: boolean;
    evidenceCount: number;
    sourceLengths: readonly number[];
    targetLength: number;
    wrapCount: number;
    leadingZeroInSource: boolean;
    leadingZeroInCode: boolean;
    repeatedDigitInTarget: boolean;
    inverseUnique: true;
    correctAnswer: string;
  };
}
