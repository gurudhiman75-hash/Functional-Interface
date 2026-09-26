export type Di002V2ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di002V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di002V2TaskKind =
  | "SELECTED_DIFFERENCE"
  | "COMBINED_SELECTED"
  | "MISSING_APPLICANTS_FROM_RATE"
  | "REJECTED_COUNT"
  | "SELECTED_SHARE_OF_TOTAL"
  | "COMBINED_REJECTED"
  | "APPLICANTS_RATIO"
  | "AVERAGE_SELECTED_THREE_ROWS"
  | "COMBINED_SELECTED_RATIO"
  | "RELATIVE_SELECTED_PERCENT_EXCESS"
  | "COMBINED_SELECTION_RATE"
  | "REJECTED_TO_SELECTED_RATIO";

export type Di002V2Row = Readonly<{
  label: string;
  applicants: number | "?";
  selected: number;
  selectionPercent: number;
}>;

export type Di002V2Stimulus = Readonly<{
  kind: "TABLE";
  contextId: string;
  title: string;
  instruction: string;
  rowHeader: string;
  columns: readonly string[];
  rows: readonly Di002V2Row[];
  hiddenApplicantIndex: number;
  unit: "candidates";
}>;

export type Di002V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di002V2WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di002V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di002V2WorkingTable;
}>;

export type Di002V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di002V2TaskKind;
  difficulty: Di002V2Difficulty;
  stemSurfaceId: "S1" | "S2" | "S3";
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di002V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di002V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

export type Di002V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di002V2QuestionSet = Readonly<{
  packageId: "DI-002";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di002V2ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "ADVANCED_TABLE_MIXED_V2";
  stimulus: Di002V2Stimulus;
  questions: readonly Di002V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di002V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-002";
    representation: "TABLE";
    parentFoundation: "DI-001";
    setContractVersion: "DI-002-SET-CONTRACT-V2";
    questionLogicVersion: "DI-002-QUESTION-LOGIC-V2";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL_WITH_EXPLICIT_WHOLE_PERCENT_ROUNDING";
    reviewStatus: "ENGLISH_REVIEW_APPROVED";
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
