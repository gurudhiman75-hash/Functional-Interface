export const NUM_CP007_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP007-PROT-001",
  "NUM-CP007-PROT-002",
  "NUM-CP007-PROT-003",
  "NUM-CP007-PROT-004",
  "NUM-CP007-PROT-005",
  "NUM-CP007-PROT-006",
  "NUM-CP007-PROT-007",
  "NUM-CP007-PROT-008",
] as const;

export type NumCp007Wave01PrototypeId = (typeof NUM_CP007_WAVE01_PROTOTYPE_IDS)[number];
export type NumCp007Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp007Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp007Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp007Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-007";
  readonly temporaryPrototypeId: NumCp007Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp007Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp007Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp007Explanation;
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
