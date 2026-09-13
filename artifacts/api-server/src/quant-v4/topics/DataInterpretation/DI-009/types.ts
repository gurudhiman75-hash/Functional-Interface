export type Di009ExamProfile = "SSC_CGL_TIER_I" | "SSC_CGL_TIER_II";

export type Di009TaskKind =
  | "DIRECT_CLASS_FREQUENCY"
  | "COMBINED_RANGE_TOTAL"
  | "RANGE_RATIO"
  | "CLASS_SHARE_OF_TOTAL"
  | "MODAL_CLASS_IDENTIFICATION"
  | "APPROX_GROUPED_MEAN_FROM_HISTOGRAM";

export type Di009Difficulty = "Easy" | "Medium" | "Hard";

export type Di009HistogramBin = Readonly<{
  lower: number;
  upper: number;
  frequency: number;
}>;

export type Di009Stimulus = Readonly<{
  kind: "HISTOGRAM";
  title: string;
  instruction: string;
  bins: readonly Di009HistogramBin[];
  classWidth: number;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
  svg: string;
}>;

export type Di009Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di009Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
}>;

export type Di009Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di009TaskKind;
  difficulty: Di009Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di009Option[];
  correctIndex: number;
  answer: string;
  explanation: Di009Explanation;
  evidence: Readonly<Record<string, number | string>>;
}>;

export type Di009ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di009QuestionSet = Readonly<{
  packageId: "DI-009";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di009ExamProfile;
  optionCount: 4;
  setDifficulty: "HISTOGRAM_MIXED";
  stimulus: Di009Stimulus;
  questions: readonly Di009Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di009ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-009";
    representation: "HISTOGRAM";
    groupedBarSibling: "DI-003";
    statisticsSibling: "STAT-003";
    frequencyPolygonSibling: "DI-010_PLANNED";
    setContractVersion: "DI-009-SET-CONTRACT-V1";
    arithmeticAuthority: "EXACT_INTEGER_RATIONAL";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}>;
