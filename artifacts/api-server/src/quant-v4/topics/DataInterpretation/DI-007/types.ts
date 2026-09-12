export type Di007ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export type Di007RecoveryMode =
  | "COLUMN_TOTAL"
  | "COLUMN_AVERAGE"
  | "COMBINED_TOTAL"
  | "TOTAL_RATIO_TO_A"
  | "DIFFERENCE_FROM_A_TOTAL";

export type Di007TaskKind =
  | "RECOVER_MISSING_VALUE"
  | "MISSING_TO_PAIRED_RATIO"
  | "B_TOTAL_AS_PERCENT_OF_A_TOTAL"
  | "HIDDEN_ROW_COMBINED_TOTAL"
  | "MISSING_SHARE_OF_B_TOTAL";

export type Di007Difficulty = "Medium" | "Hard";

export type Di007Point = Readonly<{
  period: string;
  seriesA: number;
  seriesB: number;
  displaySeriesB: number | "?";
}>;

export type Di007AggregateCondition = Readonly<{
  mode: Di007RecoveryMode;
  learnerText: string;
  value?: number;
  numerator?: number;
  denominator?: number;
  direction?: "ABOVE" | "BELOW";
}>;

export type Di007Stimulus = Readonly<{
  kind: "MISSING_TABLE";
  title: string;
  instruction: string;
  periods: readonly string[];
  points: readonly Di007Point[];
  hiddenIndex: number;
  aggregateCondition: Di007AggregateCondition;
  unit: "accounts";
}>;

export type Di007Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di007Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di007Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di007TaskKind;
  difficulty: Di007Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di007Option[];
  correctIndex: number;
  answer: string;
  explanation: Di007Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di007ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di007QuestionSet = Readonly<{
  packageId: "DI-007";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di007ExamProfile;
  optionCount: 5;
  setDifficulty: "MISSING_DI_RECONSTRUCTION_MIXED";
  stimulus: Di007Stimulus;
  questions: readonly Di007Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di007ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-007";
    representation: "MISSING_DI";
    parentFoundation: "DI-001";
    caseletSibling: "DI-006";
    setContractVersion: "DI-007-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;