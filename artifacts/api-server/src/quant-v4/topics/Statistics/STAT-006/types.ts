export type Stat006ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";
export type Stat006Difficulty = "Easy" | "Medium" | "Hard";
export const STAT006_CONTRACTS = [
  "SECOND_RAW_MOMENT", "THIRD_RAW_MOMENT", "FOURTH_RAW_MOMENT",
  "SECOND_CENTRAL_MOMENT", "THIRD_CENTRAL_MOMENT", "FOURTH_CENTRAL_MOMENT",
  "RAW_TO_CENTRAL_SECOND", "RAW_TO_CENTRAL_THIRD", "RAW_TO_CENTRAL_FOURTH",
  "CENTRAL_MOMENT_AFFINE_TRANSFORM", "SKEWNESS_BETA_ONE", "SKEWNESS_GAMMA_ONE",
  "SKEWNESS_BOWLEY", "SKEWNESS_PEARSON_FIRST", "SKEWNESS_PEARSON_SECOND",
  "SKEWNESS_FROM_THIRD_MOMENT_SIGN", "KURTOSIS_BETA_TWO", "KURTOSIS_EXCESS_CLASSIFICATION",
] as const;
export type Stat006ContractId = (typeof STAT006_CONTRACTS)[number];
export type Stat006State =
  | Readonly<{ kind: "RAW_MOMENT"; values: readonly number[]; order: 2 | 3 | 4 }>
  | Readonly<{ kind: "CENTRAL_MOMENT"; values: readonly number[]; order: 2 | 3 | 4 }>
  | Readonly<{ kind: "RAW_CENTRAL_RELATION"; rawMoments: readonly [number, number, number, number]; order: 2 | 3 | 4 }>
  | Readonly<{ kind: "AFFINE_MOMENT"; centralMoment: number; order: 2 | 3 | 4; multiplier: number; shift: number }>
  | Readonly<{ kind: "MOMENT_SKEWNESS"; mu2: number; mu3: number; coefficient: "beta1" | "gamma1" }>
  | Readonly<{ kind: "BOWLEY_SKEWNESS"; q1: number; median: number; q3: number }>
  | Readonly<{ kind: "PEARSON_SKEWNESS"; mean: number; reference: number; standardDeviation: number; version: 1 | 2 }>
  | Readonly<{ kind: "THIRD_MOMENT_SIGN"; mu3: number }>
  | Readonly<{ kind: "KURTOSIS"; mu2: number; mu4: number; output: "beta2" | "excess" | "shape" }>;
export type Stat006Question = Readonly<{
  packageId: "STAT-006"; questionId: string; qlId: string; contractId: Stat006ContractId;
  seed: string; examProfile: Stat006ExamProfile; difficulty: Stat006Difficulty; language: "en";
  stem: string; options: readonly [string, string, string, string]; correctIndex: number; answer: string;
  state: Stat006State; explanation: string; questionBankWritable: false; testEligible: false;
  mockTestEligible: false; publiclyPublishable: false; automaticStudentPublication: false; productionReleaseAuthorized: false;
}>;
