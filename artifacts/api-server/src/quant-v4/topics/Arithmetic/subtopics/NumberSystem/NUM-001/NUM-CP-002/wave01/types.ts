export const NUM_CP002_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP002-PROT-001",
  "NUM-CP002-PROT-002",
  "NUM-CP002-PROT-003",
  "NUM-CP002-PROT-004",
  "NUM-CP002-PROT-005",
  "NUM-CP002-PROT-006",
  "NUM-CP002-PROT-007",
  "NUM-CP002-PROT-008",
  "NUM-CP002-PROT-009",
  "NUM-CP002-PROT-010",
  "NUM-CP002-PROT-011",
  "NUM-CP002-PROT-012",
] as const;

export type NumCp002Wave01PrototypeId = (typeof NUM_CP002_WAVE01_PROTOTYPE_IDS)[number];
export type NumCp002Difficulty = "EASY" | "MEDIUM" | "HARD";
export type NumCp002AnswerSemantic =
  | "REDUCED_FRACTION"
  | "MIXED_FRACTION"
  | "IMPROPER_FRACTION"
  | "DECIMAL_REPRESENTATION"
  | "ORDERED_LIST"
  | "COMPARISON_RELATION"
  | "DECIMAL_NATURE"
  | "COUNT";

export interface NumCp002Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
}

export interface NumCp002Explanation {
  readonly concept?: string;
  readonly solution: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp002Lifecycle {
  readonly permanentQlId: null;
  readonly maturity: "EXECUTABLE_DISCOVERY_PROOF";
  readonly reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligible: false;
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
}

export interface NumCp002Wave01Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-002";
  readonly temporaryPrototypeId: NumCp002Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp002Difficulty;
  readonly answerSemantic: NumCp002AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp002Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp002Explanation;
  readonly lifecycle: NumCp002Lifecycle;
}
