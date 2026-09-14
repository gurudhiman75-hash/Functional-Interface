export type Di010ExamProfile = "SSC_CGL_TIER_I" | "SSC_CGL_TIER_II";

export type Di010TaskKind =
  | "GRAPH_TYPE_IDENTIFICATION"
  | "CLASS_MARK_FROM_INTERVAL"
  | "POINT_COORDINATE_FOR_CLASS"
  | "READ_FREQUENCY_AT_CLASS_MARK"
  | "ZERO_CLOSING_ENDPOINTS"
  | "TOTAL_FREQUENCY_FROM_POLYGON"
  | "MODAL_CLASS_FROM_POLYGON"
  | "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES"
  | "COMBINED_RANGE_TOTAL_FROM_POLYGON"
  | "RANGE_RATIO_FROM_POLYGON";

export type Di010Difficulty = "Easy" | "Medium" | "Hard";

export type Di010DistributionShape =
  | "UNIMODAL"
  | "RIGHT_SKEWED"
  | "LEFT_SKEWED"
  | "ASCENDING"
  | "DESCENDING"
  | "CONTROLLED_IRREGULAR";

export type Di010Class = Readonly<{
  lower: number;
  upper: number;
  classMark: number;
  frequency: number;
}>;

export type Di010Stimulus = Readonly<{
  kind: "FREQUENCY_POLYGON";
  title: string;
  instruction: string;
  classes: readonly Di010Class[];
  classWidth: number;
  shape: Di010DistributionShape;
  xAxisLabel: string;
  yAxisLabel: string;
  unit: string;
}>;

export type Di010Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di010WorkingTable = Readonly<{
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}>;

export type Di010Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  workingTable?: Di010WorkingTable;
}>;

export type Di010Question = Readonly<{
  questionId: string;
  setId: string;
  kind: Di010TaskKind;
  difficulty: Di010Difficulty;
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Di010Option[];
  correctIndex: number;
  answer: string;
  explanation: Di010Explanation;
  evidence: Readonly<Record<string, number | string>>;
}>;

export type Di010ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Di010QuestionSet = Readonly<{
  packageId: "DI-010";
  setId: string;
  seed: string;
  language: "en";
  examProfile: Di010ExamProfile;
  optionCount: 4;
  setDifficulty: "FREQUENCY_POLYGON_MIXED";
  stimulus: Di010Stimulus;
  questions: readonly Di010Question[];
  validation: Readonly<{
    valid: boolean;
    checks: readonly Di010ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "DI-010";
    representation: "FREQUENCY_POLYGON";
    histogramSibling: "DI-009";
    statisticsSibling: "STAT-003";
    presentationAuthority: "DATA_INTERPRETATION_SHARED_VISUALS";
    questionLogicVersion: "DI-010-QUESTION-LOGIC-P0";
    setContractVersion: "DI-010-SET-CONTRACT-P0";
    arithmeticAuthority: "EXACT_INTEGER_MIDPOINT";
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
