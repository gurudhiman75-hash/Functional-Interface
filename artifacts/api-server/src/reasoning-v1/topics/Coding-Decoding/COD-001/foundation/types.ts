export type CodDifficulty = "EASY" | "MEDIUM" | "HARD";
export type CodLocale = "en-IN" | "hi-IN" | "pa-IN";
export type CodRenderer = "INLINE_CODE_PAIR" | "EXAMPLE_TARGET_BLOCK" | "MAPPING_TABLE";
export type CodAnswerType = "LETTER_CLUSTER" | "DIGIT_SEQUENCE" | "SYMBOL_SEQUENCE" | "SINGLE_CODE_TOKEN" | "NUMBER";
export type CodTokenKind = "LETTER" | "DIGIT" | "SYMBOL";

export interface ExplanationTrace {
  ruleStatement: string;
  referenceAid?: readonly string[];
  quickMethod?: string;
  sourceDemonstration: readonly string[];
  targetApplication: readonly string[];
  conclusion: string;
  commonTrapAlert?: string;
  closestTrapRejection?: string;
}

export interface GeneratedOption {
  value: string;
  isCorrect: boolean;
  errorLabel?: string;
}

export interface MappingEvidence {
  source: string;
  code: string;
}

export interface MappingTableEntry {
  source: string;
  code: string | null;
}

export interface DirectMappingPrompt {
  taskKind: "ENCODE_TARGET" | "DECODE_TARGET" | "RECOVER_MISSING_CODE" | "INFER_FROM_OVERLAP";
  outputKind: CodTokenKind;
  evidence: readonly MappingEvidence[];
  mappingTable?: readonly MappingTableEntry[];
  target: string;
  encodedTarget?: string;
  missingSource?: string;
  separator: string;
}

export interface GeneratedCodQuestion {
  packageId: "COD-001";
  qlId: string;
  checkpointId: "COD-CP-001";
  ruleId: string;
  seed: number;
  locale: CodLocale;
  difficulty: CodDifficulty;
  renderer: CodRenderer;
  answerType: CodAnswerType;
  stem: string;
  structuredPrompt: DirectMappingPrompt;
  options: readonly GeneratedOption[];
  correctIndex: number;
  explanation: ExplanationTrace;
  metadata: {
    runtimeVersion: "cod-001-cp001-v2";
    publiclyPublishable: false;
    maturity: "RUNTIME_PROOF";
    hiddenFingerprint: string;
    evidenceCoversTarget: boolean;
    mappingInjective: boolean;
    ambiguityAccepted: boolean;
  };
}
