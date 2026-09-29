import type { Stat006ContractId, Stat006Difficulty, Stat006ExamProfile } from "./types";
export const STAT006_PERMANENT_RELEASE_ID = "STAT-006-PERMANENT-ENGLISH-REVIEW-P0" as const;
export type Stat006PermanentQlDescriptor = Readonly<{ qlId: `STAT-QL-${string}`; contractId: Stat006ContractId; label: string; semanticContract: string; difficulty: Stat006Difficulty; supportedProfiles: readonly Stat006ExamProfile[] }>;
const profiles = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"] as const;
const row = (qlId: `STAT-QL-${string}`, contractId: Stat006ContractId, label: string, semanticContract: string, difficulty: Stat006Difficulty): Stat006PermanentQlDescriptor => ({ qlId, contractId, label, semanticContract, difficulty, supportedProfiles: profiles });
// STAT-001..005 own STAT-QL-001..051. This registry reserves the next contiguous block.
export const STAT006_PERMANENT_QLS: readonly Stat006PermanentQlDescriptor[] = Object.freeze([
  row("STAT-QL-052", "SECOND_RAW_MOMENT", "Second raw moment", "Calculate the second moment about the origin, the arithmetic mean of squared observations, from a small raw data set.", "Medium"),
  row("STAT-QL-053", "THIRD_RAW_MOMENT", "Third raw moment", "Calculate the third moment about the origin, the arithmetic mean of cubed observations, from a small raw data set.", "Hard"),
  row("STAT-QL-054", "FOURTH_RAW_MOMENT", "Fourth raw moment", "Calculate the fourth moment about the origin, the arithmetic mean of fourth powers, from a small raw data set.", "Hard"),
  row("STAT-QL-055", "SECOND_CENTRAL_MOMENT", "Second central moment", "Calculate the population second central moment by averaging squared deviations from the arithmetic mean; do not take the square root.", "Medium"),
  row("STAT-QL-056", "THIRD_CENTRAL_MOMENT", "Third central moment", "Calculate the population third central moment by averaging cubed deviations from the arithmetic mean and preserve the sign.", "Hard"),
  row("STAT-QL-057", "FOURTH_CENTRAL_MOMENT", "Fourth central moment", "Calculate the population fourth central moment by averaging fourth powers of deviations from the arithmetic mean.", "Hard"),
  row("STAT-QL-058", "RAW_TO_CENTRAL_SECOND", "Second central moment from raw moments", "Recover μ2 from the first two raw moments using μ2 = μ′2 − (μ′1)^2.", "Medium"),
  row("STAT-QL-059", "RAW_TO_CENTRAL_THIRD", "Third central moment from raw moments", "Recover μ3 from the first three raw moments using μ3 = μ′3 − 3μ′2μ′1 + 2(μ′1)^3.", "Hard"),
  row("STAT-QL-060", "RAW_TO_CENTRAL_FOURTH", "Fourth central moment from raw moments", "Recover μ4 from the first four raw moments using the expanded raw-to-central-moment identity.", "Hard"),
  row("STAT-QL-061", "CENTRAL_MOMENT_AFFINE_TRANSFORM", "Central moment under an affine transformation", "Use μr(aX+b) = a^r μr(X) for r = 2, 3 or 4; a shift does not change the central moment and scaling changes it by the rth power.", "Medium"),
  row("STAT-QL-062", "SKEWNESS_BETA_ONE", "Moment coefficient of skewness β1", "Calculate β1 = μ3^2 / μ2^3 from the second and third central moments.", "Hard"),
  row("STAT-QL-063", "SKEWNESS_GAMMA_ONE", "Standardized moment coefficient of skewness γ1", "Calculate γ1 = μ3 / μ2^(3/2), retaining the sign of μ3.", "Hard"),
  row("STAT-QL-064", "SKEWNESS_BOWLEY", "Bowley coefficient of skewness", "Calculate (Q3 + Q1 − 2Median) / (Q3 − Q1) from quartiles and median supplied in the question.", "Medium"),
  row("STAT-QL-065", "SKEWNESS_PEARSON_FIRST", "Pearson's first coefficient of skewness", "Calculate (mean − mode) / standard deviation using all three stated summary values.", "Medium"),
  row("STAT-QL-066", "SKEWNESS_PEARSON_SECOND", "Pearson's second coefficient of skewness", "Calculate 3(mean − median) / standard deviation using all three stated summary values.", "Medium"),
  row("STAT-QL-067", "SKEWNESS_FROM_THIRD_MOMENT_SIGN", "Direction of skewness from the third central moment", "Infer the direction of skewness from the sign of the third central moment: positive, negative or zero.", "Easy"),
  row("STAT-QL-068", "KURTOSIS_BETA_TWO", "Moment coefficient of kurtosis β2", "Calculate β2 = μ4 / μ2^2 from the fourth and second central moments.", "Hard"),
  row("STAT-QL-069", "KURTOSIS_EXCESS_CLASSIFICATION", "Excess kurtosis and distribution type", "Calculate excess kurtosis γ2 = β2 − 3 or classify the distribution as mesokurtic, leptokurtic or platykurtic by comparing β2 with 3.", "Medium"),
] as const);
const byQl = new Map(STAT006_PERMANENT_QLS.map((item) => [item.qlId, item] as const));
export function getStat006PermanentQl(qlId: string) { return byQl.get(qlId as `STAT-QL-${string}`); }
export const STAT006_PERMANENT_OWNERSHIP = Object.freeze({ packageId: "STAT-006" as const, releaseId: STAT006_PERMANENT_RELEASE_ID, qlCount: STAT006_PERMANENT_QLS.length, lifecycle: Object.freeze({ questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW" as const, questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const, testEligibility: "INELIGIBLE" as const, mockTestEligible: false as const, publiclyPublishable: false as const, automaticStudentPublication: false as const, productionReleaseAuthorized: false as const }) });
