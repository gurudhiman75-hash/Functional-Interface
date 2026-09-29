import type { Stat005ContractId, Stat005Difficulty, Stat005ExamProfile } from "./types";

export const STAT005_PERMANENT_RELEASE_ID = "STAT-005-PERMANENT-ENGLISH-REVIEW-P0" as const;
export type Stat005PermanentQlDescriptor = Readonly<{
  qlId: `STAT-QL-${string}`; contractId: Stat005ContractId; label: string; semanticContract: string;
  difficulty: Stat005Difficulty; supportedProfiles: readonly Stat005ExamProfile[];
}>;
const PROFILES = ["SSC_CGL_TIER_II", "SSC_CGL_JSO"] as const;
const row = (qlId: `STAT-QL-${string}`, contractId: Stat005ContractId, label: string, semanticContract: string, difficulty: Stat005Difficulty): Stat005PermanentQlDescriptor => ({ qlId, contractId, label, semanticContract, difficulty, supportedProfiles: PROFILES });

// STAT-001..004 own STAT-QL-001..035. This registry reserves the next contiguous
// block; generators and adapters resolve permanent IDs from this table.
export const STAT005_PERMANENT_QLS: readonly Stat005PermanentQlDescriptor[] = Object.freeze([
  row("STAT-QL-036", "QUARTILE_FROM_RAW_DATA", "Quartile from raw observations", "Find a requested quartile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.", "Medium"),
  row("STAT-QL-037", "DECILE_FROM_RAW_DATA", "Decile from raw observations", "Find a requested decile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.", "Medium"),
  row("STAT-QL-038", "PERCENTILE_FROM_RAW_DATA", "Percentile from raw observations", "Find a requested percentile in ordered raw observations using the explicitly stated (n+1) position convention and linear interpolation when required.", "Hard"),
  row("STAT-QL-039", "QUARTILE_FROM_DISCRETE_FREQUENCY", "Quartile from a discrete frequency distribution", "Locate a specified quartile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.", "Medium"),
  row("STAT-QL-040", "DECILE_FROM_DISCRETE_FREQUENCY", "Decile from a discrete frequency distribution", "Locate a specified decile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.", "Medium"),
  row("STAT-QL-041", "PERCENTILE_FROM_DISCRETE_FREQUENCY", "Percentile from a discrete frequency distribution", "Locate a specified percentile by its nearest-rank position in an ordered discrete frequency distribution using cumulative frequencies.", "Hard"),
  row("STAT-QL-042", "QUARTILE_FROM_GROUPED_DATA", "Quartile from grouped data", "Interpolate a requested quartile in a grouped continuous frequency distribution from its quartile class, lower boundary, cumulative frequency, class frequency and width.", "Hard"),
  row("STAT-QL-043", "DECILE_FROM_GROUPED_DATA", "Decile from grouped data", "Interpolate a requested decile in a grouped continuous frequency distribution from its decile class and displayed frequency data.", "Hard"),
  row("STAT-QL-044", "PERCENTILE_FROM_GROUPED_DATA", "Percentile from grouped data", "Interpolate a requested percentile in a grouped continuous frequency distribution from its percentile class and displayed frequency data.", "Hard"),
  row("STAT-QL-045", "RANGE_OF_RAW_DATA", "Range of raw observations", "Calculate the absolute range as the difference between the largest and smallest observations.", "Easy"),
  row("STAT-QL-046", "COEFFICIENT_OF_RANGE", "Coefficient of range", "Calculate the relative range (largest minus smallest) divided by (largest plus smallest), and express it as a percentage when requested.", "Medium"),
  row("STAT-QL-047", "QUARTILE_DEVIATION_OF_RAW_DATA", "Quartile deviation of raw observations", "Find Q1 and Q3 with the stated (n+1) linear-interpolation convention and calculate half their difference.", "Medium"),
  row("STAT-QL-048", "COEFFICIENT_OF_QUARTILE_DEVIATION", "Coefficient of quartile deviation", "Calculate (Q3 minus Q1) divided by (Q3 plus Q1), using quartiles provided in the question.", "Medium"),
  row("STAT-QL-049", "MEAN_DEVIATION_ABOUT_MEAN", "Mean deviation about the arithmetic mean", "Calculate the arithmetic mean of absolute deviations from the mean for a small raw data set.", "Hard"),
  row("STAT-QL-050", "MEAN_DEVIATION_ABOUT_MEDIAN", "Mean deviation about the median", "Calculate the arithmetic mean of absolute deviations from the median for a small raw data set.", "Hard"),
  row("STAT-QL-051", "COEFFICIENT_OF_VARIATION", "Coefficient of variation", "Calculate the coefficient of variation from a stated mean and population standard deviation, or compare relative consistency from given means and standard deviations.", "Medium"),
] as const);

const BY_QL = new Map(STAT005_PERMANENT_QLS.map((item) => [item.qlId, item] as const));
const BY_CONTRACT = new Map(STAT005_PERMANENT_QLS.map((item) => [item.contractId, item] as const));
export function getStat005PermanentQl(qlId: string) { return BY_QL.get(qlId as `STAT-QL-${string}`); }
export function getStat005PermanentQlForContract(contractId: Stat005ContractId) {
  const item = BY_CONTRACT.get(contractId);
  if (!item) throw new Error(`STAT-005 permanent ownership is missing for ${contractId}.`);
  return item;
}
export const STAT005_PERMANENT_OWNERSHIP = Object.freeze({
  packageId: "STAT-005" as const, releaseId: STAT005_PERMANENT_RELEASE_ID, qlCount: STAT005_PERMANENT_QLS.length,
  lifecycle: Object.freeze({ questionStudioDiscoverable: true, questionStudioMode: "CONTROLLED_REVIEW" as const,
    questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const, mockTestEligible: false as const, publiclyPublishable: false as const,
    automaticStudentPublication: false as const, productionReleaseAuthorized: false as const }),
});
