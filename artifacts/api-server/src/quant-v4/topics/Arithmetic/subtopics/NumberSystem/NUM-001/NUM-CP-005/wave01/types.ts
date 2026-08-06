export const NUM_CP005_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP005-PROT-001",
  "NUM-CP005-PROT-002",
  "NUM-CP005-PROT-003",
  "NUM-CP005-PROT-004",
  "NUM-CP005-PROT-005",
  "NUM-CP005-PROT-006",
  "NUM-CP005-PROT-007",
  "NUM-CP005-PROT-008",
] as const;

export type NumCp005Wave01PrototypeId =
  (typeof NUM_CP005_WAVE01_PROTOTYPE_IDS)[number];

export type NumCp005Difficulty = "EASY" | "MEDIUM" | "HARD";
export type NumCp005AnswerSemantic =
  | "DIVISOR_COUNT"
  | "DIVISOR_SUM"
  | "PRIME_EXPONENT";

export interface NumCp005PrimePower {
  readonly prime: number;
  readonly exponent: number;
}

export interface NumCp005Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface NumCp005Explanation {
  readonly coreConcept: string;
  readonly givenDataAndStrategy: string;
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: string;
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp005Wave01Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-005";
  readonly temporaryPrototypeId: NumCp005Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp005Difficulty;
  readonly answerSemantic: NumCp005AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp005Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp005Explanation;
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
