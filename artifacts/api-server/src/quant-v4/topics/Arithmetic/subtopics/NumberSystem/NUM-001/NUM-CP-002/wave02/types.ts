export const NUM_CP002_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP002-PROT-013",
  "NUM-CP002-PROT-014",
  "NUM-CP002-PROT-015",
  "NUM-CP002-PROT-016",
  "NUM-CP002-PROT-017",
  "NUM-CP002-PROT-018",
  "NUM-CP002-PROT-019",
  "NUM-CP002-PROT-020",
  "NUM-CP002-PROT-021",
  "NUM-CP002-PROT-022",
] as const;

export type NumCp002Wave02PrototypeId = (typeof NUM_CP002_WAVE02_PROTOTYPE_IDS)[number];
export type NumCp002Wave02Difficulty = "EASY" | "MEDIUM" | "HARD";
export type NumCp002Wave02AnswerSemantic =
  | "INTEGER"
  | "COUNT"
  | "DENOMINATOR_SET"
  | "DIGIT"
  | "DECIMAL_REPRESENTATION";

export interface NumCp002Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
}

export interface NumCp002Wave02Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-002";
  readonly temporaryPrototypeId: NumCp002Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp002Wave02Difficulty;
  readonly answerSemantic: NumCp002Wave02AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp002Wave02Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: Readonly<{
    concept?: string;
    solution: readonly string[];
    finalAnswer: string;
  }>;
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    questionBankStatus: "NOT_STORED";
    testEligible: false;
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}
