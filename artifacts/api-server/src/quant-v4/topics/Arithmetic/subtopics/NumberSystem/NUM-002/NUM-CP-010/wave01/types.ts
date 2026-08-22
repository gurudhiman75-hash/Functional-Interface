export const NUM_CP010_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP010-PROT-001",
  "NUM-CP010-PROT-002",
  "NUM-CP010-PROT-003",
  "NUM-CP010-PROT-004",
  "NUM-CP010-PROT-005",
  "NUM-CP010-PROT-006",
  "NUM-CP010-PROT-007",
  "NUM-CP010-PROT-008",
] as const;

export type NumCp010Wave01PrototypeId = typeof NUM_CP010_WAVE01_PROTOTYPE_IDS[number];
export type NumCp010Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp010Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp010Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp010Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-010";
  readonly temporaryPrototypeId: NumCp010Wave01PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp010Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp010Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp010Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    maturity: "DISCOVERY_PROTOTYPE";
    reviewStatus: "WAVE01_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
