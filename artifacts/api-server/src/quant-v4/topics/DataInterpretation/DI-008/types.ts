export type Di008ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export type Di008TaskKind =
  | "UNITS_PERCENT_CHANGE"
  | "REVENUE_RATIO"
  | "PROFIT_PERCENT"
  | "AVERAGE_PROFIT_PER_PRODUCT"
  | "REVENUE_SHARE_OF_TOTAL";

export type Di008Difficulty = "Medium" | "Hard";

export type Di008Row = Readonly<{
  product: string;
  unitsPrevious: number;
  unitsCurrent: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
}>;

export type Di008Stimulus = Readonly<{
  kind: "ARITHMETIC_TABLE";
  title: string;
  instruction: string;
  rows: readonly Di008Row[];
  unit: "units";
  currency: "INR";
}>;

export type Di008Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di008Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Di008Evidence = Readonly<{
  primaryIndices: readonly number[];
  secondaryIndices?: readonly number[];
}>;

export type Di008Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di008TaskKind;
  difficulty: Di008Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di008Option[];
  correctIndex: number;
  answer: string;
  explanation: Di008Explanation;
  evidence: Di008Evidence;
}>;

export type Di008ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di008QuestionSet = Readonly<{
  packageId: "DI-008";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di008ExamProfile;
  optionCount: 5;
  setDifficulty: "MIXED_ARITHMETIC_DI";
  stimulus: Di008Stimulus;
  questions: readonly Di008Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di008ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-008";
    representation: "ARITHMETIC_DI";
    parentFoundation: "DI-001";
    missingDiSibling: "DI-007";
    setContractVersion: "DI-008-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;