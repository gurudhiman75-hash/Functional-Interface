export const NUM_CP012_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP012-PROT-009",
  "NUM-CP012-PROT-010",
  "NUM-CP012-PROT-011",
  "NUM-CP012-PROT-012",
  "NUM-CP012-PROT-013",
  "NUM-CP012-PROT-014",
] as const;

export type NumCp012Wave02PrototypeId = typeof NUM_CP012_WAVE02_PROTOTYPE_IDS[number];
export type NumCp012Wave02Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp012Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp012Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-012";
  readonly temporaryPrototypeId: NumCp012Wave02PrototypeId;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp012Wave02Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp012Wave02Option[];
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
    reviewStatus: "WAVE02_REVIEW_REQUIRED";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
