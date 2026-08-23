export const NUM_CP011_WAVE04_PROTOTYPE_IDS = [
  "NUM-CP011-PROT-014",
  "NUM-CP011-PROT-015",
] as const;

export type NumCp011Wave04PrototypeId = typeof NUM_CP011_WAVE04_PROTOTYPE_IDS[number];
export type NumCp011Wave04Difficulty = "MEDIUM" | "HARD";

export interface NumCp011Wave04Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp011Wave04Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-011";
  readonly temporaryPrototypeId: NumCp011Wave04PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp011Wave04Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly statements: readonly string[];
  readonly options: readonly NumCp011Wave04Option[];
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
    reviewStatus: "WAVE04_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
