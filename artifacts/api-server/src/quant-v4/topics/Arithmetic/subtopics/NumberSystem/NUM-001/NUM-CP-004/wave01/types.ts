export const NUM_CP004_WAVE01_PROTOTYPE_IDS = [
  "NUM-CP004-PROT-001",
  "NUM-CP004-PROT-002",
  "NUM-CP004-PROT-003",
  "NUM-CP004-PROT-004",
  "NUM-CP004-PROT-005",
  "NUM-CP004-PROT-006",
  "NUM-CP004-PROT-007",
  "NUM-CP004-PROT-008",
] as const;

export type NumCp004Wave01PrototypeId =
  (typeof NUM_CP004_WAVE01_PROTOTYPE_IDS)[number];

export type NumCp004Difficulty = "EASY" | "MEDIUM" | "HARD";

export type NumCp004AnswerSemantic =
  | "PRIME_CLASS"
  | "PRIME_SET"
  | "COUNT"
  | "FACTORISATION"
  | "PRIME_FACTOR"
  | "PRIME"
  | "PRIME_EXPONENT"
  | "PAIR"
  | "COPRIME_CLASS";

export type PrimeClass = "PRIME" | "COMPOSITE" | "UNIT" | "NEITHER";

export type CoprimeClass =
  | "PAIRWISE_AND_COLLECTIVELY_COPRIME"
  | "COLLECTIVELY_BUT_NOT_PAIRWISE"
  | "NOT_COLLECTIVELY_COPRIME"
  | "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME";

export type PrimeFactorPropertyTarget =
  | "SMALLEST_PRIME_FACTOR"
  | "LARGEST_PRIME_FACTOR"
  | "DISTINCT_PRIME_FACTOR_COUNT"
  | "TOTAL_PRIME_FACTOR_COUNT";

export interface PrimePower {
  readonly prime: number;
  readonly exponent: number;
}

export interface NumCp004Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId?: string;
}

export interface NumCp004Explanation {
  readonly coreConcept: readonly string[];
  readonly givenDataAndStrategy: readonly string[];
  readonly stepByStep: readonly string[];
  readonly examSpeedMethod: readonly string[];
  readonly commonTraps: readonly string[];
  readonly finalAnswer: string;
}

export interface NumCp004Lifecycle {
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

export interface NumCp004Wave01Package {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-004";
  readonly temporaryPrototypeId: NumCp004Wave01PrototypeId;
  readonly permanentQlId: null;
  readonly seed: number;
  readonly locale: "en-IN";
  readonly difficulty: NumCp004Difficulty;
  readonly answerSemantic: NumCp004AnswerSemantic;
  readonly stem: string;
  readonly options: readonly NumCp004Option[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly verifierAnswer: string;
  readonly hiddenState: Readonly<Record<string, unknown>>;
  readonly sourceAncestry: readonly string[];
  readonly prototypeAncestry: readonly string[];
  readonly mathematicalFingerprint: string;
  readonly explanation: NumCp004Explanation;
  readonly lifecycle: NumCp004Lifecycle;
}
