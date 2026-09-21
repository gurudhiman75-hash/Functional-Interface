export type Di009ExamProfile = "SSC_CGL_TIER_I" | "SSC_CGL_TIER_II";

export type Di009TaskKind =
  | "DIRECT_CLASS_FREQUENCY"
  | "TOTAL_FREQUENCY"
  | "COMBINED_RANGE_TOTAL"
  | "ABOVE_BOUNDARY_TOTAL"
  | "BELOW_BOUNDARY_TOTAL"
  | "RANGE_RATIO"
  | "CLASS_SHARE_OF_TOTAL"
  | "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES"
  | "MODAL_CLASS_IDENTIFICATION"
  | "MEDIAN_CLASS_IDENTIFICATION"
  | "KTH_OBSERVATION_CLASS"
  | "APPROX_GROUPED_MEAN_FROM_HISTOGRAM"
  | "APPROX_GROUPED_MODE_FROM_HISTOGRAM";

export type Di009Difficulty = "Easy" | "Medium" | "Hard";

export type Di009DistributionShape =
  | "UNIMODAL"
  | "RIGHT_SKEWED"
  | "LEFT_SKEWED"
  | "ASCENDING"
  | "DESCENDING"
  | "CONTROLLED_IRREGULAR";

export type Di009HistogramBin = Readonly<{
  lower: number;
  upper: number;
  frequency: number;
}>;

/**
 * Semantic histogram stimulus only. Presentation surfaces render this model
 * through the shared DataInterpretation visual layer.
 */
export type Di009Stimulus = Readonly<{
  kind: "HISTOGRAM";
  title: string;
  instruction: string;
  bins: readonly Di009HistogramBin[];
  classWidth: number;
  shape: Di009DistributionShape;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
}>;

export type Di009Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di009WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di009Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di009WorkingTable;
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
    presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS";
    questionLogicVersion: "DI-009-QUESTION-LOGIC-V3";
    setContractVersion: "DI-009-SET-CONTRACT-V3";
    arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING";
    reviewStatus: "UNREVIEWED";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}>;
