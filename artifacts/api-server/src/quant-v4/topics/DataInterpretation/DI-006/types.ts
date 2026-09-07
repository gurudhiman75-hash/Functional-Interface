export type Di006ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di006TaskKind =
  | "DERIVE_PRIMARY_FROM_PERCENT"
  | "DERIVE_CHAINED_RELATION"
  | "REMAINDER_FROM_TOTAL"
  | "COMBINED_INFERRED_SHARE"
  | "REMAINDER_TO_DIRECT_RATIO";

export type Di006Difficulty = "Medium" | "Hard";

export type Di006Relation = Readonly<{
  targetIndex: number;
  sourceIndex: number;
  numerator: number;
  denominator: number;
  learnerText: string;
}>;

export type Di006Stimulus = Readonly<{
  kind: "CASELET";
  title: string;
  instruction: string;
  learnerText: string;
  categories: readonly string[];
  totalCases: number;
  directIndex: number;
  directValue: number;
  relations: readonly Di006Relation[];
  remainderIndex: number;
  unit: "requests";
}>;

export type Di006Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di006Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di006Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di006TaskKind;
  difficulty: Di006Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di006Option[];
  correctIndex: number;
  answer: string;
  explanation: Di006Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di006ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di006QuestionSet = Readonly<{
  packageId: "DI-006";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di006ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "CASELET_RELATIONAL_MIXED";
  stimulus: Di006Stimulus;
  questions: readonly Di006Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di006ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-006";
    representation: "CASELET";
    parentFoundation: "DI-001";
    tableSibling: "DI-002";
    groupedBarSibling: "DI-003";
    lineSibling: "DI-004";
    pieSibling: "DI-005";
    setContractVersion: "DI-006-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;