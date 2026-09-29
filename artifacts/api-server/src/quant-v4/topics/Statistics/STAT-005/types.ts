export type Stat005ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";
export type Stat005Difficulty = "Easy" | "Medium" | "Hard";

export const STAT005_CONTRACTS = [
  "QUARTILE_FROM_RAW_DATA", "DECILE_FROM_RAW_DATA", "PERCENTILE_FROM_RAW_DATA",
  "QUARTILE_FROM_DISCRETE_FREQUENCY", "DECILE_FROM_DISCRETE_FREQUENCY", "PERCENTILE_FROM_DISCRETE_FREQUENCY",
  "QUARTILE_FROM_GROUPED_DATA", "DECILE_FROM_GROUPED_DATA", "PERCENTILE_FROM_GROUPED_DATA",
  "RANGE_OF_RAW_DATA", "COEFFICIENT_OF_RANGE", "QUARTILE_DEVIATION_OF_RAW_DATA",
  "COEFFICIENT_OF_QUARTILE_DEVIATION", "MEAN_DEVIATION_ABOUT_MEAN", "MEAN_DEVIATION_ABOUT_MEDIAN",
  "COEFFICIENT_OF_VARIATION",
] as const;
export type Stat005ContractId = (typeof STAT005_CONTRACTS)[number];

export type Stat005State =
  | Readonly<{ kind: "RAW_PARTITION"; values: readonly number[]; numerator: number; denominator: number; convention: "N_PLUS_1_LINEAR" }>
  | Readonly<{ kind: "DISCRETE_PARTITION"; rows: readonly Readonly<{ value: number; frequency: number }>[]; numerator: number; denominator: number; convention: "CEILING_KN_OVER_M" }>
  | Readonly<{ kind: "GROUPED_PARTITION"; classes: readonly Readonly<{ lower: number; upper: number; frequency: number }>[]; numerator: number; denominator: number; convention: "K_N_OVER_M_INTERPOLATION" }>
  | Readonly<{ kind: "RAW_RANGE"; values: readonly number[] }>
  | Readonly<{ kind: "RAW_QUARTILE_DEVIATION"; values: readonly number[] }>
  | Readonly<{ kind: "COEFFICIENT_QUARTILE_DEVIATION"; q1: number; q3: number }>
  | Readonly<{ kind: "RAW_MEAN_DEVIATION"; values: readonly number[]; about: "mean" | "median" }>
  | Readonly<{ kind: "COEFFICIENT_OF_VARIATION"; mean: number; populationStandardDeviation: number }>;

export type Stat005Question = Readonly<{
  packageId: "STAT-005"; questionId: string; qlId: string; contractId: Stat005ContractId;
  seed: string; examProfile: Stat005ExamProfile; difficulty: Stat005Difficulty; language: "en";
  stem: string; options: readonly [string, string, string, string]; correctIndex: number; answer: string;
  state: Stat005State; explanation: string;
  questionBankWritable: false; testEligible: false; mockTestEligible: false; publiclyPublishable: false;
  automaticStudentPublication: false; productionReleaseAuthorized: false;
}>;
