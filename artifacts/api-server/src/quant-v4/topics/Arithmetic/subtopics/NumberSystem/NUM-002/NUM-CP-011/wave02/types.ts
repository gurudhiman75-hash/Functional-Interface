export const NUM_CP011_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP011-PROT-007",
  "NUM-CP011-PROT-008",
  "NUM-CP011-PROT-009",
  "NUM-CP011-PROT-010",
  "NUM-CP011-PROT-011",
] as const;

export type NumCp011Wave02PrototypeId = typeof NUM_CP011_WAVE02_PROTOTYPE_IDS[number];
export type NumCp011Wave02Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp011Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp011Wave02Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp011Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-011";
  readonly temporaryPrototypeId: NumCp011Wave02PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp011Wave02Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp011Wave02Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp011Wave02Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    maturity: "DISCOVERY_PROTOTYPE";
    reviewStatus: "WAVE02_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
