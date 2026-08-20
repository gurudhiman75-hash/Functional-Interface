export const NUM_CP009_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP009-PROT-001",
  "NUM-CP009-PROT-002",
  "NUM-CP009-PROT-003",
  "NUM-CP009-PROT-004",
  "NUM-CP009-PROT-005",
  "NUM-CP009-PROT-006",
  "NUM-CP009-PROT-007",
  "NUM-CP009-PROT-008",
] as const;

export type NumCp009Wave01PrototypeId = (typeof NUM_CP009_WAVE01_PROTOTYPE_IDS)[number];
export type NumCp009Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp009Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp009Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp009Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-009";
  readonly temporaryPrototypeId: NumCp009Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp009Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stemFamily: string;
  readonly stem: string;
  readonly options: readonly NumCp009Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp009Explanation;
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
