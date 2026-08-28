export const NUM_CP013_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP013-PROT-001",
  "NUM-CP013-PROT-002",
  "NUM-CP013-PROT-003",
  "NUM-CP013-PROT-004",
  "NUM-CP013-PROT-005",
  "NUM-CP013-PROT-006",
  "NUM-CP013-PROT-007",
  "NUM-CP013-PROT-008",
] as const;

export type NumCp013Wave01PrototypeId = typeof NUM_CP013_WAVE01_PROTOTYPE_IDS[number];
export type NumCp013Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp013Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp013Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-013";
  readonly temporaryPrototypeId: NumCp013Wave01PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp013Difficulty;
  readonly taskKind: string;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp013Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    standard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1";
    fullDerivation: readonly string[];
    examShortcut: readonly string[];
    finalAnswer: string;
  }>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    maturity: "DISCOVERY_PROTOTYPE";
    reviewStatus: "WAVE01_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}
