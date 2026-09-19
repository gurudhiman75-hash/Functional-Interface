export type Di008V2ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export type Di008V2TaskKind =
  | "UNIT_INCREASE"
  | "REVENUE_AMOUNT"
  | "PERCENT_CHANGE"
  | "PROFIT_AMOUNT"
  | "PROFIT_PERCENT"
  | "REVENUE_SHARE"
  | "PROFIT_RATIO"
  | "AVERAGE_PROFIT"
  | "COMBINED_PERCENT_CHANGE"
  | "COMBINED_PROFIT_PERCENT"
  | "GROUP_REVENUE_RATIO"
  | "WEIGHTED_AVERAGE_SELLING_PRICE";

export type Di008V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di008V2ContextId =
  | "STATIONERY_WHOLESALE"
  | "PACKAGED_FOODS"
  | "SPORTS_GOODS"
  | "ELECTRONIC_ACCESSORIES"
  | "HOUSEHOLD_ITEMS"
  | "OFFICE_SUPPLIES";

export type Di008V2Row = Readonly<{
  label: string;
  unitsPrevious: number;
  unitsCurrent: number;
  costPerUnit: number;
  sellingPricePerUnit: number;
}>;

export type Di008V2Stimulus = Readonly<{
  kind: "ARITHMETIC_TABLE";
  contextId: Di008V2ContextId;
  title: string;
  instruction: string;
  rowLabel: string;
  rows: readonly Di008V2Row[];
  currency: "INR";
}>;

export type Di008V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di008V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
}>;

export type Di008V2Evidence = Readonly<{
  primaryIndices: readonly number[];
  secondaryIndices?: readonly number[];
}>;

export type Di008V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di008V2TaskKind;
  difficulty: Di008V2Difficulty;
  stemVariant: 0 | 1 | 2;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di008V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di008V2Explanation;
  evidence: Di008V2Evidence;
}>;

export type Di008V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di008V2QuestionSet = Readonly<{
  packageId: "DI-008";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di008V2ExamProfile;
  optionCount: 5;
  setDifficulty: "MIXED_ARITHMETIC_DI_V2";
  stimulus: Di008V2Stimulus;
  questions: readonly Di008V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di008V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-008";
    representation: "ARITHMETIC_DI";
    sourceFoundation: "DI-008-PHASE7";
    setContractVersion: "DI-008-SET-CONTRACT-V2";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "HUMAN_REVIEW_PENDING";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligibility: "INELIGIBLE";
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
    productionReleaseAuthorized: false;
  }>;
}>;
