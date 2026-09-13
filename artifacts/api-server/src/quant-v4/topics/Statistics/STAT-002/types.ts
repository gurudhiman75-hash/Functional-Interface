export type Stat002ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";

export type Stat002ContractId =
  | "STAT-002-TEMP-001-RAW-SD"
  | "STAT-002-TEMP-002-MEAN-SQUARES-SD"
  | "STAT-002-TEMP-003-TRANSLATION-INVARIANCE"
  | "STAT-002-TEMP-004-SCALE-TRANSFORMATION"
  | "STAT-002-TEMP-005-REVERSE-SCALE"
  | "STAT-002-TEMP-006-AFFINE-FROM-MOMENTS";

export type Stat002SolveMode =
  | "DIRECT_POPULATION_SD"
  | "SD_FROM_MEAN_AND_MEAN_SQUARES"
  | "TRANSLATION_INVARIANCE"
  | "SCALE_STANDARD_DEVIATION"
  | "INFER_SCALE_FROM_STANDARD_DEVIATION"
  | "AFFINE_SD_FROM_MOMENTS";

export type Stat002Difficulty = "Easy" | "Medium" | "Hard";

export type Stat002State =
  | Readonly<{ kind: "RAW_POPULATION_SD"; values: readonly number[] }>
  | Readonly<{ kind: "MEAN_AND_MEAN_SQUARES"; mean: number; meanOfSquares: number }>
  | Readonly<{ kind: "TRANSLATED_DATA"; values: readonly number[]; additiveConstant: number }>
  | Readonly<{ kind: "SCALED_DATA"; values: readonly number[]; multiplier: number }>
  | Readonly<{ kind: "REVERSE_SCALE"; originalStandardDeviation: number; transformedStandardDeviation: number }>
  | Readonly<{
      kind: "AFFINE_FROM_MOMENTS";
      mean: number;
      meanOfSquares: number;
      multiplier: number;
      additiveConstant: number;
    }>;

export type Stat002Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Stat002Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
}>;

export type Stat002ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Stat002Question = Readonly<{
  packageId: "STAT-002";
  questionId: string;
  seed: string;
  examProfile: Stat002ExamProfile;
  contractId: Stat002ContractId;
  solveMode: Stat002SolveMode;
  difficulty: Stat002Difficulty;
  language: "en";
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Stat002Option[];
  correctIndex: number;
  answer: string;
  state: Stat002State;
  explanation: Stat002Explanation;
  validation: Readonly<{
    valid: boolean;
    checks: readonly Stat002ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "STAT-002";
    topic: "Statistics";
    subtopic: "Standard Deviation";
    officialScope: "SSC_CGL_PAPER_I_STANDARD_DEVIATION_FOUNDATION";
    contractStatus: "TEMPORARY_REVIEW_CONTRACT";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}>;
