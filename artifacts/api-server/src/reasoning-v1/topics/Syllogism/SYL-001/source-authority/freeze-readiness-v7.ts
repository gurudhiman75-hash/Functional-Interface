import { SYL_BANKING_CROSS_EXAM_CENSUS_V4 } from "./banking-cross-exam-census-v4";
import {
  SYL_FREEZE_REQUIREMENTS_V6,
  SYL_FREEZE_READINESS_V6,
  type SylFreezeRequirementStatusV6,
  type SylFreezeRequirementV6,
} from "./freeze-readiness-v6";

export type SylFreezeRequirementStatusV7 = SylFreezeRequirementStatusV6;
export type SylFreezeRequirementV7 = SylFreezeRequirementV6;

function supersedeRequirement(requirement: SylFreezeRequirementV6): SylFreezeRequirementV7 {
  if (requirement.requirementId === "SOURCE_PROFILE_FROZEN") {
    return {
      ...requirement,
      status: "BLOCKED",
      evidence: `${SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId} now spans ${SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesCount} Banking exam series and ${SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsObserved} structural question records, including ${SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount} complete officer-level shift. The evidence also proves that the provisional Banking families mix independent dimensions, so a factorized weighting model and broader systematic paper sampling are required before exact source-profile percentages can be frozen.`,
      unblockAction: "Complete broader systematic paper-day sampling using separate conclusion-structure, conclusion-semantic-feature and premise-overlay dimensions; reconcile known source-count conflicts where possible; then obtain product-owner sign-off on a factorized inactive weighting model before any production-profile change.",
    };
  }

  return requirement;
}

export const SYL_FREEZE_REQUIREMENTS_V7: readonly SylFreezeRequirementV7[] = Object.freeze(
  SYL_FREEZE_REQUIREMENTS_V6.map(supersedeRequirement),
);

const counts = SYL_FREEZE_REQUIREMENTS_V7.reduce<Record<SylFreezeRequirementStatusV7, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V7 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V7",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: SYL_FREEZE_READINESS_V6.authorityId,
  requirementCount: SYL_FREEZE_REQUIREMENTS_V7.length,
  counts,
  bankingCrossExamCensusAuthority: SYL_BANKING_CROSS_EXAM_CENSUS_V4.authorityId,
  bankingCrossExamSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.examSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V4.structuralQuestionRecordsObserved,
  bankingCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V4.completeOfficerLevelShiftCount,
  bankingFactorizedWeightModelRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V4.factorizedWeightModelRequired,
  bankingMinimumIndependentWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V4.minimumIndependentDimensions,
  bankingWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V4.factorDimensions,
  bankingLegacyProvisionalFamiliesMixIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V4.legacyProvisionalFamiliesMixIndependentDimensions,
  bankingWeightModelArchitectureClarified: true,
  bankingSystematicCrossSeriesWeightSampleComplete: false,
  bankingKnownSourceConflictsRemain: true,
  bankingExactWeightingFrozen: false,
  exactPercentageWeightingPermitted: false,
  currentProvisionalBankingMixChanged: false,
  factorizedPlannerRedesignImplemented: false,
  connectedToProductionGenerator: false,
  connectedToProductionPlanner: false,
  permanentQl019Created: false,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  generatorIntegrationPermitted: false,
  questionStudioActivationPermitted: false,
  questionBankWritePermitted: false,
  testDeliveryPermitted: false,
  publicPublishingPermitted: false,
  difficultyActivationPermitted: false,
  prMergeRecommended: false,
  nextCriticalPath: [
    "Complete human EN/HI/PA editorial and visual review of ordinary Banking possibility and can-never candidates.",
    "Expand the factorized Banking census across additional SBI PO, IBPS PO and IBPS RRB PO paper-days; retain unresolved or conflicting source counts explicitly instead of imputing them.",
    "After systematic sampling is sufficient, design a separate inactive factorized Banking planner candidate; do not mutate the current provisional production mix inside the source-evidence checkpoint.",
    "Resolve SSC adapted-practice and Punjab source-coverage gaps before broader profile freeze.",
    "Calibrate difficulty after controlled learner accuracy and solve-time evidence exists.",
    "Only after all remaining gates are approved, design compatibility-safe registration/production integration as a separate activation change.",
  ] as const,
});
