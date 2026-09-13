export type Stat003ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";
export type Stat003ContractId =
  | "STAT-003-TEMP-001-DISCRETE-FREQUENCY-MEAN"
  | "STAT-003-TEMP-002-GROUPED-FREQUENCY-MEAN"
  | "STAT-003-TEMP-003-DISCRETE-FREQUENCY-MEDIAN"
  | "STAT-003-TEMP-004-GROUPED-FREQUENCY-MEDIAN"
  | "STAT-003-TEMP-005-GROUPED-FREQUENCY-MODE"
  | "STAT-003-TEMP-006-EMPIRICAL-MODE"
  | "STAT-003-TEMP-007-EMPIRICAL-DIFFERENCE"
  | "STAT-003-TEMP-008-MISSING-VALUE-FROM-MEAN";
export type Stat003SolveMode =
  | "MEAN_FROM_DISCRETE_FREQUENCY"
  | "MEAN_FROM_GROUPED_FREQUENCY"
  | "MEDIAN_FROM_DISCRETE_FREQUENCY"
  | "MEDIAN_FROM_GROUPED_FREQUENCY"
  | "MODE_FROM_GROUPED_FREQUENCY"
  | "MODE_FROM_EMPIRICAL_RELATION"
  | "DIFFERENCE_FROM_EMPIRICAL_RELATION"
  | "MISSING_VALUE_FROM_FREQUENCY_MEAN";
export type Stat003Difficulty = "Easy" | "Medium" | "Hard";
export type Stat003DiscreteRow = Readonly<{ value: number; frequency: number }>;
export type Stat003GroupedClass = Readonly<{ lower: number; upper: number; frequency: number }>;
export type Stat003State =
  | Readonly<{ kind: "DISCRETE_FREQUENCY_MEAN"; rows: readonly Stat003DiscreteRow[] }>
  | Readonly<{ kind: "GROUPED_FREQUENCY_MEAN"; classes: readonly Stat003GroupedClass[] }>
  | Readonly<{ kind: "DISCRETE_FREQUENCY_MEDIAN"; rows: readonly Stat003DiscreteRow[] }>
  | Readonly<{ kind: "GROUPED_FREQUENCY_MEDIAN"; classes: readonly Stat003GroupedClass[] }>
  | Readonly<{ kind: "GROUPED_FREQUENCY_MODE"; classes: readonly Stat003GroupedClass[] }>
  | Readonly<{ kind: "EMPIRICAL_MODE"; mean: number; median: number }>
  | Readonly<{ kind: "EMPIRICAL_DIFFERENCE"; meanModeDifference: number }>
  | Readonly<{ kind: "MISSING_VALUE_FROM_MEAN"; values: readonly (number | null)[]; frequencies: readonly number[]; missingIndex: number; statedMean: number }>;
export type Stat003Option = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
export type Stat003Explanation = Readonly<{ keyIdea: string; steps: readonly string[] }>;
export type Stat003ValidationCheck = Readonly<{ id: string; passed: boolean; message: string }>;
export type Stat003Question = Readonly<{
  packageId: "STAT-003"; questionId: string; seed: string; examProfile: Stat003ExamProfile;
  contractId: Stat003ContractId; solveMode: Stat003SolveMode; difficulty: Stat003Difficulty; language: "en";
  stem: string; options: readonly string[]; optionMetadata: readonly Stat003Option[]; correctIndex: number; answer: string;
  state: Stat003State; explanation: Stat003Explanation;
  validation: Readonly<{ valid: boolean; checks: readonly Stat003ValidationCheck[] }>;
  traceability: Readonly<{
    packageId: "STAT-003"; topic: "Statistics"; subtopic: "Frequency Distribution & Central Tendency";
    officialScope: "SSC_CGL_PAPER_I_ELEMENTARY_FREQUENCY_STATISTICS";
    contractStatus: "TEMPORARY_REVIEW_CONTRACT"; questionStudioDiscoverable: false; questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE"; mockTestEligible: false; publiclyPublishable: false; automaticStudentPublication: false;
  }>;
}>;
