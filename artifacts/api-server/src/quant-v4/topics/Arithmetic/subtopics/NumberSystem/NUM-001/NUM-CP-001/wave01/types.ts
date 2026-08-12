export const NUM_CP001_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP001-PROT-001",
  "NUM-CP001-PROT-002",
  "NUM-CP001-PROT-003",
  "NUM-CP001-PROT-004",
  "NUM-CP001-PROT-005",
  "NUM-CP001-PROT-006",
  "NUM-CP001-PROT-007",
  "NUM-CP001-PROT-008",
] as const;

export type NumCp001Wave01PrototypeId =
  (typeof NUM_CP001_WAVE01_PROTOTYPE_IDS)[number];

export type NumCp001Difficulty = "EASY" | "MEDIUM" | "HARD";

export type NumCp001AnswerSemantic =
  | "NUMBER_SET"
  | "BOOLEAN_CLAIM"
  | "ORDERED_LIST"
  | "DISTANCE"
  | "COUNT"
  | "PARITY_CLASS"
  | "NUMBER_TUPLE";

export type NumCp001NumberSet =
  | "NATURAL"
  | "WHOLE"
  | "INTEGER"
  | "RATIONAL"
  | "IRRATIONAL"
  | "REAL";

export type NumCp001ClaimClass =
  | "ALWAYS_TRUE"
  | "TRUE_FOR_EVEN_N_ONLY"
  | "TRUE_FOR_ODD_N_ONLY"
  | "NEVER_TRUE";

export interface NumCp001Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
}

export interface NumCp001Explanation {
  readonly coreConcept: readonly string[];
  readonly givenDataAndStrategy: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: readonly string[];
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp001Lifecycle {
  readonly permanentQlId: null;
  readonly maturity: "EXECUTABLE_DISCOVERY_PROOF";
  readonly reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp001Wave01Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-001";
  readonly temporaryPrototypeId: NumCp001Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp001Difficulty;
  readonly answerSemantic: NumCp001AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp001Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp001Explanation;
  readonly lifecycle: NumCp001Lifecycle;
}