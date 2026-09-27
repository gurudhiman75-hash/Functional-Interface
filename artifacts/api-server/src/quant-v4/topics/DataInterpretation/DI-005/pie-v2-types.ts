export type Di005V2ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di005V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di005V2TaskKind =
  | "DIRECT_SECTOR_PERCENT"
  | "LARGEST_SECTOR_IDENTIFICATION"
  | "SMALLEST_SECTOR_IDENTIFICATION"
  | "MISSING_SECTOR_PERCENT"
  | "SECTOR_ANGLE_DEGREES"
  | "SECTOR_COUNT_FROM_TOTAL"
  | "COMBINED_SECTOR_PERCENT"
  | "DIFFERENCE_IN_COUNTS"
  | "RATIO_OF_TWO_SECTORS"
  | "RELATIVE_SECTOR_PERCENT_EXCESS"
  | "COMBINED_SECTOR_ANGLE"
  | "REMAINDER_AFTER_TWO_SECTORS_COUNT";

export type Di005V2Slice = Readonly<{
  category: string;
  percent: number;
  displayPercent: number | "?";
  angleDegrees: number;
}>;

export type Di005V2Stimulus = Readonly<{
  kind: "PIE";
  contextId: string;
  title: string;
  instruction: string;
  totalValue: number;
  totalLabel: string;
  unit: string;
  description?: string;
  slices: readonly Di005V2Slice[];
  hiddenPercentIndex: number;
}>;

export type Di005V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di005V2WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di005V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di005V2WorkingTable;
}>;

export type Di005V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di005V2TaskKind;
  difficulty: Di005V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di005V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di005V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

export type Di005V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di005V2QuestionSet = Readonly<{
  packageId: "DI-005";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di005V2ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "PIE_MIXED_V2";
  stimulus: Di005V2Stimulus;
  questions: readonly Di005V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di005V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-005";
    representation: "PIE";
    parentFoundation: "DI-001";
    setContractVersion: "DI-005-SET-CONTRACT-V2";
    questionLogicVersion: "DI-005-QUESTION-LOGIC-V2";
    presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
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
