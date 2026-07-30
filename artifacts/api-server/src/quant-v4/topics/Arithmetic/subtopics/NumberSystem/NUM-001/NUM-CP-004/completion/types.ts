
export const NUM_CP004_RETAINED_TEMPLATE_IDS = [
  "NUM-CP004-QLT-01",
  "NUM-CP004-QLT-02",
  "NUM-CP004-QLT-03",
  "NUM-CP004-QLT-04",
  "NUM-CP004-QLT-05",
  "NUM-CP004-QLT-06",
  "NUM-CP004-QLT-07",
  "NUM-CP004-QLT-08",
  "NUM-CP004-QLT-09",
  "NUM-CP004-QLT-10",
  "NUM-CP004-QLT-11",
  "NUM-CP004-QLT-12",
  "NUM-CP004-QLT-13",
  "NUM-CP004-QLT-14",
  "NUM-CP004-QLT-15",
  "NUM-CP004-QLT-16",
  "NUM-CP004-QLT-17",
  "NUM-CP004-QLT-18",
  "NUM-CP004-QLT-19",
  "NUM-CP004-QLT-20",
  "NUM-CP004-QLT-21",
  "NUM-CP004-QLT-22",
  "NUM-CP004-QLT-23",
  "NUM-CP004-QLT-24",
  "NUM-CP004-QLT-25",
  "NUM-CP004-QLT-26",
  "NUM-CP004-QLT-27",
  "NUM-CP004-QLT-28",
] as const;

export type NumCp004RetainedTemplateId =
  (typeof NUM_CP004_RETAINED_TEMPLATE_IDS)[number];

export type NumCp004Difficulty = "EASY" | "MEDIUM" | "HARD";

export type NumCp004AnswerSemantic =
  | "PRIME_CLASS"
  | "PRIME"
  | "PRIME_SET"
  | "COUNT"
  | "BOOLEAN_CLAIM"
  | "FACTORISATION"
  | "PRIME_FACTOR"
  | "PRIME_EXPONENT"
  | "INTEGER"
  | "COMPARISON_CLASS"
  | "PAIR"
  | "TRIPLE"
  | "COPRIME_SET"
  | "COPRIME_CLASS"
  | "SOLUTION_CLASS"
  | "SUFFICIENCY_CLASS"
  | "PRIME_ADJUSTMENT_SET";

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

export interface NumCp004DiscoveryLifecycle {
  readonly permanentQlId: null;
  readonly maturity: "RETAINED_ENGLISH_FREEZE_CANDIDATE";
  readonly reviewStatus: "PRODUCT_OWNER_COMPLETION_INSTRUCTION";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export interface NumCp004RetainedQuestion {
  readonly packageId: "NUM-001";
  readonly checkpointId: "NUM-CP-004";
  readonly temporaryTemplateId: NumCp004RetainedTemplateId;
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
  readonly lifecycle: NumCp004DiscoveryLifecycle;
}
