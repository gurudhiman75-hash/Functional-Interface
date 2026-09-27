export type Di004V2ExamProfile = "SSC_CGL_TIER_I" | "BANKING_PRELIMS";

export type Di004V2Difficulty = "Easy" | "Medium" | "Hard";

export type Di004V2TaskKind =
  | "CROSS_SERIES_DIFFERENCE"
  | "COMBINED_PERIOD_TOTAL"
  | "FIRST_OVERTAKE_PERIOD"
  | "CLOSEST_LINES_PERIOD"
  | "THREE_PERIOD_AVERAGE"
  | "CONSECUTIVE_PERCENT_INCREASE"
  | "TWO_PERIOD_SERIES_RATIO"
  | "TWO_PERIOD_COMBINED_TOTAL"
  | "TOTAL_SERIES_RATIO"
  | "COMBINED_PERIOD_PERCENT_EXCESS"
  | "TOTAL_SERIES_PERCENT_EXCESS"
  | "THREE_VS_THREE_RATIO";

export type Di004V2LinePoint = Readonly<{
  period: string;
  seriesA: number;
  seriesB: number;
}>;

export type Di004V2Stimulus = Readonly<{
  kind: "LINE";
  contextId: string;
  title: string;
  instruction: string;
  categories: readonly string[];
  series: readonly [
    Readonly<{ id: "SERIES_A"; label: string }>,
    Readonly<{ id: "SERIES_B"; label: string }>,
  ];
  points: readonly Di004V2LinePoint[];
  yAxisLabel: string;
  unitLabel: string;
}>;

export type Di004V2Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di004V2WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di004V2Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di004V2WorkingTable;
}>;

export type Di004V2Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di004V2TaskKind;
  difficulty: Di004V2Difficulty;
  stemSurfaceId: "S1" | "S2" | "S3";
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di004V2Option[];
  correctIndex: number;
  answer: string;
  explanation: Di004V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

export type Di004V2ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di004V2QuestionSet = Readonly<{
  packageId: "DI-004";
  reviewVersion: "V2";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di004V2ExamProfile;
  optionCount: 4 | 5;
  setDifficulty: "LINE_MIXED_V2";
  stimulus: Di004V2Stimulus;
  questions: readonly Di004V2Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di004V2ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-004";
    representation: "LINE";
    parentFoundation: "DI-001";
    setContractVersion: "DI-004-SET-CONTRACT-V2";
    questionLogicVersion: "DI-004-QUESTION-LOGIC-V2";
    arithmeticAuthority: "INTEGER_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING";
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
