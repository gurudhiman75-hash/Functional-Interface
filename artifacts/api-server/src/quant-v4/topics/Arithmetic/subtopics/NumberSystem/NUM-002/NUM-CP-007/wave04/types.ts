export const NUM_CP007_WAVE04_PROTOTYPE_IDS = [
  "NUM-CP007-PROT-025",
  "NUM-CP007-PROT-026",
  "NUM-CP007-PROT-027",
  "NUM-CP007-PROT-028",
  "NUM-CP007-PROT-029",
  "NUM-CP007-PROT-030",
  "NUM-CP007-PROT-031",
  "NUM-CP007-PROT-032",
] as const;

export type NumCp007Wave04PrototypeId = (typeof NUM_CP007_WAVE04_PROTOTYPE_IDS)[number];
export type NumCp007Wave04Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp007Wave04Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp007Wave04Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp007Wave04Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly temporaryPrototypeId: NumCp007Wave04PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp007Wave04Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Wave04Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Wave04Explanation;
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
