export const NUM_CP007_WAVE03_PROTOTYPE_IDS = [
  "NUM-CP007-PROT-017",
  "NUM-CP007-PROT-018",
  "NUM-CP007-PROT-019",
  "NUM-CP007-PROT-020",
  "NUM-CP007-PROT-021",
  "NUM-CP007-PROT-022",
  "NUM-CP007-PROT-023",
  "NUM-CP007-PROT-024",
] as const;

export type NumCp007Wave03PrototypeId = (typeof NUM_CP007_WAVE03_PROTOTYPE_IDS)[number];
export type NumCp007Wave03Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp007Wave03Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp007Wave03Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp007Wave03Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly temporaryPrototypeId: NumCp007Wave03PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp007Wave03Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Wave03Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Wave03Explanation;
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
