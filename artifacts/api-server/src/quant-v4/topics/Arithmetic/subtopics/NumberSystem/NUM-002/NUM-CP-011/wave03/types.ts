export const NUM_CP011_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP011-PROT-012",
  "NUM-CP011-PROT-013",
] as const;

export type NumCp011Wave03PrototypeId = typeof NUM_CP011_WAVE03_PROTOTYPE_IDS[number];
export type NumCp011Wave03Difficulty = "MEDIUM" | "HARD";

export interface NumCp011Wave03Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp011Wave03Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-011";
  readonly temporaryPrototypeId: NumCp011Wave03PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp011Wave03Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp011Wave03Option[];
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
    reviewStatus: "WAVE03_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
