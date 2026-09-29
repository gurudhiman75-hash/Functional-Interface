export const STAT007_CONTRACTS = [
  "SCATTER_DIAGRAM_TREND", "PEARSON_FROM_RAW_PAIRS", "PEARSON_FROM_COVARIANCE", "CORRELATION_BOUNDS",
  "COVARIANCE_FROM_PAIRS", "REGRESSION_Y_ON_X", "REGRESSION_X_ON_Y", "REGRESSION_PREDICTION",
  "REGRESSION_COEFFICIENT_RELATION", "SPEARMAN_NO_TIES", "SPEARMAN_WITH_TIES", "YULE_ASSOCIATION",
  "PARTIAL_CORRELATION_THREE_VARIABLES", "MULTIPLE_CORRELATION_THREE_VARIABLES",
] as const;
export type Stat007ContractId = typeof STAT007_CONTRACTS[number];
export type Stat007ExamProfile = "SSC_CGL_TIER_II" | "SSC_CGL_JSO";
export type Stat007State =
  | { kind: "CLASSIFY"; result: string }
  | { kind: "PAIRS"; x: number[]; y: number[]; output: "pearson" | "covariance" | "reg-yx" | "reg-xy" }
  | { kind: "COV_CORR"; covariance: number; sdX: number; sdY: number }
  | { kind: "CORRELATION_VALUE"; r: number }
  | { kind: "PREDICT"; slope: number; intercept: number; x: number }
  | { kind: "REG_COEFFICIENTS"; bxy: number; byx: number }
  | { kind: "RANKS"; x: number[]; y: number[] }
  | { kind: "YULE"; a: number; b: number; c: number; d: number }
  | { kind: "PARTIAL"; r12: number; r13: number; r23: number }
  | { kind: "MULTIPLE"; r12: number; r13: number; r23: number };
export type Stat007Question = Readonly<{
  packageId: "STAT-007"; questionId: string; qlId: string; contractId: Stat007ContractId; seed: string;
  examProfile: Stat007ExamProfile; stem: string; options: readonly [string,string,string,string]; correctIndex: number;
  answer: string; explanation: string; state: Stat007State;
  questionBankWritable: false; testEligible: false; mockTestEligible: false; publiclyPublishable: false;
  automaticStudentPublication: false; productionReleaseAuthorized: false;
}>;
