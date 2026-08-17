import { SYL_BANKING_SOURCE_LEDGER_SUMMARY_V1 } from "./banking-source-question-ledger-v1";

export const SYL_BANKING_SOURCE_WEIGHT_POLICY_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_SOURCE_WEIGHT_POLICY_V1",
  status: "COVERAGE_PROVEN_PERCENTAGES_UNFROZEN",
  ledgerAuthority: SYL_BANKING_SOURCE_LEDGER_SUMMARY_V1.authorityId,
  questionCount: SYL_BANKING_SOURCE_LEDGER_SUMMARY_V1.questionCount,
  examSeriesCount: SYL_BANKING_SOURCE_LEDGER_SUMMARY_V1.examSeriesCount,
  preserveCurrentProvisionalFamilyMix: true,
  requiredCoverage: [
    "ORDINARY_POSSIBILITY",
    "CAN_NEVER_BE",
    "EITHER_OR",
    "ONLY_A_FEW",
    "ONLY",
    "MULTI_CONCLUSION_ADVANCED",
  ] as const,
  systematicPaperCensusComplete: false,
  productionPercentagesFrozen: false,
  activationPermitted: false,
});
