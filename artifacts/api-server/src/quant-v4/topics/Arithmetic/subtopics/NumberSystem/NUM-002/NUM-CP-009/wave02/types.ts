export const NUM_CP009_WAVE02_PROTOTYPE_IDS = [
  "NUM-CP009-PROT-009",
  "NUM-CP009-PROT-010",
  "NUM-CP009-PROT-011",
  "NUM-CP009-PROT-012",
  "NUM-CP009-PROT-013",
  "NUM-CP009-PROT-014",
] as const;

export type NumCp009Wave02PrototypeId = (typeof NUM_CP009_WAVE02_PROTOTYPE_IDS)[number];
export type NumCp009Wave02Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp009Wave02Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp009Wave02Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp009Wave02Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-009";
  readonly temporaryPrototypeId: NumCp009Wave02PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp009Wave02Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stemFamily: string;
  readonly stem: string;
  readonly options: readonly NumCp009Wave02Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp009Wave02Explanation;
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
