export const NUM_CP007_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP007-PROT-009",
  "NUM-CP007-PROT-010",
  "NUM-CP007-PROT-011",
  "NUM-CP007-PROT-012",
  "NUM-CP007-PROT-013",
  "NUM-CP007-PROT-014",
  "NUM-CP007-PROT-015",
  "NUM-CP007-PROT-016",
] as const;

export type NumCp007Wave02PrototypeId = (typeof NUM_CP007_WAVE02_PROTOTYPE_IDS)[number];
export type NumCp007Wave02Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp007Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp007Wave02Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp007Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly temporaryPrototypeId: NumCp007Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp007Wave02Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Wave02Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Wave02Explanation;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    maturity: "EXECUTABLE_DISCOVERY_PROOF";
    reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}
