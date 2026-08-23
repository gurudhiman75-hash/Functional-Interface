export const NUM_CP012_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP012-PROT-001",
  "NUM-CP012-PROT-002",
  "NUM-CP012-PROT-003",
  "NUM-CP012-PROT-004",
  "NUM-CP012-PROT-005",
  "NUM-CP012-PROT-006",
  "NUM-CP012-PROT-007",
  "NUM-CP012-PROT-008",
] as const;

export type NumCp012Wave01PrototypeId = typeof NUM_CP012_WAVE01_PROTOTYPE_IDS[number];
export type NumCp012Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp012Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp012Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-012";
  readonly temporaryPrototypeId: NumCp012Wave01PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp012Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp012Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    coreConcept: string;
    strategy: string;
    steps: readonly string[];
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
    publiclyPublishable: false;
  }>;
}
