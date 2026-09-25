export type Di003V2ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di003V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di003V2TaskKind =
  | "DIRECT_BAR_VALUE"
  | "HIGHEST_CATEGORY_FOR_SERIES"
  | "LOWEST_CATEGORY_FOR_SERIES"
  | "CROSS_SERIES_DIFFERENCE"
  | "COMBINED_CATEGORY_TOTAL"
  | "WITHIN_SERIES_DIFFERENCE"
  | "CATEGORY_RATIO_WITHIN_SERIES"
  | "SERIES_AVERAGE"
  | "COMBINED_CATEGORY_RATIO"
  | "PERCENT_CHANGE_WITHIN_SERIES"
  | "CATEGORY_SHARE_OF_SERIES_TOTAL"
  | "TOTAL_SERIES_PERCENT_EXCESS";

export type Di003V2BarPoint = Readonly<{
  category: string;
  seriesA: number;
  seriesB: number;
}>;

export type Di003V2Stimulus = Readonly<{
  kind: "GROUPED_BAR";
  contextId: string;
  title: string;
  instruction: string;
  categories: readonly string[];
  series: readonly [
    Readonly<{ id: "SERIES_A"; label: string }>,
    Readonly<{ id: "SERIES_B"; label: string }>,
  ];
  points: readonly Di003V2BarPoint[];
  yAxisLabel: string;
  unit: string;
}>;

export type Di003V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di003V2WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di003V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di003V2WorkingTable;
}>;

export type Di003V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di003V2TaskKind;
  difficulty: Di003V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di003V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di003V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

export type Di003V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di003V2QuestionSet = Readonly<{
  packageId: "DI-003";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di003V2ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "GROUPED_BAR_MIXED_V2";
  stimulus: Di003V2Stimulus;
  questions: readonly Di003V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di003V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-003";
    representation: "GROUPED_BAR";
    parentFoundation: "DI-001";
    setContractVersion: "DI-003-SET-CONTRACT-V2";
    arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING";
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
