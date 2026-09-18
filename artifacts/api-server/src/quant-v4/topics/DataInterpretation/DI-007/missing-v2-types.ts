export type Di007V2ExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

export type Di007V2RecoveryMode =
  | "COLUMN_TOTAL"
  | "COLUMN_AVERAGE"
  | "COMBINED_TOTAL"
  | "TOTAL_RATIO_TO_A"
  | "DIFFERENCE_FROM_A_TOTAL";

export type Di007V2TaskKind =
  | "DIRECT_VISIBLE_VALUE"
  | "VISIBLE_ROW_DIFFERENCE"
  | "RECOVER_MISSING_VALUE"
  | "HIDDEN_ROW_COMBINED_TOTAL"
  | "MISSING_TO_PAIRED_RATIO"
  | "B_TOTAL_AS_PERCENT_OF_A_TOTAL"
  | "MISSING_SHARE_OF_B_TOTAL"
  | "VISIBLE_TWO_ROW_B_TOTAL"
  | "MISSING_AS_PERCENT_OF_PAIRED_A"
  | "COMBINED_HIDDEN_VISIBLE_SHARE_OF_B_TOTAL"
  | "HIDDEN_VS_VISIBLE_B_PERCENT_EXCESS"
  | "HIDDEN_ROW_TO_VISIBLE_ROW_TOTAL_RATIO";

export type Di007V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di007V2ContextId =
  | "BANK_BRANCH_APPLICATIONS"
  | "INSURANCE_POLICIES"
  | "FACTORY_OUTPUT"
  | "COURSE_ENROLMENT"
  | "ONLINE_ORDERS"
  | "BOOK_ISSUES";

export type Di007V2Point = Readonly<{
  label: string;
  seriesA: number;
  seriesB: number;
  displaySeriesB: number | "?";
}>;

export type Di007V2AggregateCondition = Readonly<{
  mode: Di007V2RecoveryMode;
  learnerText: string;
  value?: number;
  numerator?: number;
  denominator?: number;
  direction?: "ABOVE" | "BELOW";
}>;

export type Di007V2Stimulus = Readonly<{
  kind: "MISSING_TABLE";
  contextId: Di007V2ContextId;
  title: string;
  instruction: string;
  rowLabel: string;
  seriesALabel: string;
  seriesBLabel: string;
  unit: string;
  points: readonly Di007V2Point[];
  hiddenIndex: number;
  aggregateCondition: Di007V2AggregateCondition;
}>;

export type Di007V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di007V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
}>;

export type Di007V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di007V2TaskKind;
  difficulty: Di007V2Difficulty;
  stemVariant: 0 | 1 | 2;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di007V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di007V2Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

export type Di007V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di007V2QuestionSet = Readonly<{
  packageId: "DI-007";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di007V2ExamProfile;
  optionCount: 5;
  setDifficulty: "MISSING_DI_RECONSTRUCTION_V2";
  stimulus: Di007V2Stimulus;
  questions: readonly Di007V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di007V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-007";
    representation: "MISSING_DI";
    sourceFoundation: "DI-007-PHASE6";
    setContractVersion: "DI-007-SET-CONTRACT-V2";
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
