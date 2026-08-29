export const NUM_CP008_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP008-PROT-001",
  "NUM-CP008-PROT-002",
  "NUM-CP008-PROT-003",
  "NUM-CP008-PROT-004",
  "NUM-CP008-PROT-005",
  "NUM-CP008-PROT-006",
  "NUM-CP008-PROT-007",
  "NUM-CP008-PROT-008",
] as const;

export type NumCp008Wave01PrototypeId = (typeof NUM_CP008_WAVE01_PROTOTYPE_IDS)[number];
export type NumCp008Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface NumCp008Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string;
}

export interface NumCp008Explanation {
  readonly coreConcept: string;
  readonly strategy: string;
  readonly steps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp008Wave01Package {
  readonly packageId: "NUM-002";
  readonly checkpointId: "NUM-CP-008";
  readonly temporaryPrototypeId: NumCp008Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp008Difficulty;
  readonly answerSemantic: string;
  readonly representation: string;
  readonly stem: string;
  readonly options: readonly NumCp008Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp008Explanation;
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
