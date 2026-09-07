export type Sta001ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";

export type Sta001ContractId =
  | "STA-TEMP-001-SIMPLE-MEAN"
  | "STA-TEMP-002-MISSING-OBSERVATION"
  | "STA-TEMP-003-CORRECTED-MEAN"
  | "STA-TEMP-004-COMBINED-MEAN"
  | "STA-TEMP-005-MEDIAN-RAW"
  | "STA-TEMP-006-MODE-RAW";

export type Sta001SolveMode =
  | "DIRECT_MEAN"
  | "REVERSE_MEAN_TOTAL"
  | "MEAN_CORRECTION"
  | "WEIGHTED_GROUP_MEAN"
  | "ORDER_STATISTIC_MEDIAN"
  | "FREQUENCY_MODE";

export type Sta001Difficulty = "Easy" | "Medium" | "Hard";

export type Sta001State =
  | Readonly<{ kind: "SIMPLE_MEAN_RAW"; values: readonly number[] }>
  | Readonly<{ kind: "MISSING_OBSERVATION"; observationCount: number; mean: number; knownValues: readonly number[] }>
  | Readonly<{ kind: "CORRECTED_MEAN"; observationCount: number; reportedMean: number; wrongValue: number; correctValue: number }>
  | Readonly<{ kind: "COMBINED_MEAN"; group1Count: number; group1Mean: number; group2Count: number; group2Mean: number }>
  | Readonly<{ kind: "MEDIAN_RAW"; values: readonly number[] }>
  | Readonly<{ kind: "MODE_RAW"; values: readonly number[] }>;

export type Sta001Option = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Sta001Explanation = Readonly<{
  keyIdea: string;
  steps: readonly string[];
  shortcut: string;
  trap: string;
}>;

export type Sta001ValidationCheck = Readonly<{
  id: string;
  passed: boolean;
  message: string;
}>;

export type Sta001Question = Readonly<{
  packageId: "STA-001";
  questionId: string;
  seed: string;
  examProfile: Sta001ExamProfile;
  contractId: Sta001ContractId;
  solveMode: Sta001SolveMode;
  difficulty: Sta001Difficulty;
  language: "en";
  stem: string;
  options: readonly string[];
  optionMetadata: readonly Sta001Option[];
  correctIndex: number;
  answer: string;
  state: Sta001State;
  explanation: Sta001Explanation;
  validation: Readonly<{
    valid: boolean;
    checks: readonly Sta001ValidationCheck[];
  }>;
  traceability: Readonly<{
    packageId: "STA-001";
    topic: "Statistics";
    subtopic: "Measures of Central Tendency";
    officialScope: "SSC_CGL_2026_STATISTICS_CENTRAL_TENDENCY";
    contractStatus: "TEMPORARY_REVIEW_CONTRACT";
    questionStudioDiscoverable: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;
