import { SYL_BANKING_CROSS_EXAM_CENSUS_V5 } from "./banking-cross-exam-census-v5";
import {
  SYL_FREEZE_REQUIREMENTS_V7,
  SYL_FREEZE_READINESS_V7,
  type SylFreezeRequirementStatusV7,
  type SylFreezeRequirementV7,
} from "./freeze-readiness-v7";

export type SylFreezeRequirementStatusV8 = SylFreezeRequirementStatusV7;
export type SylFreezeRequirementV8 = SylFreezeRequirementV7;

function supersedeRequirement(requirement: SylFreezeRequirementV7): SylFreezeRequirementV8 {
  if (requirement.requirementId === "SOURCE_PROFILE_FROZEN") {
    return {
      ...requirement,
      status: "BLOCKED",
      evidence: `${SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId} now spans ${SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesCount} Banking exam series and ${SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsObserved} structural question records, including ${SYL_BANKING_CROSS_EXAM_CENSUS_V5.archiveCompleteOfficerLevelShiftCount} archive-complete officer-level shifts. The second complete RRB PO shift also proves that complementary Either/Or is an independent conclusion-set relationship rather than a conclusion semantic feature, increasing the minimum factorized weighting architecture from three to ${SYL_BANKING_CROSS_EXAM_CENSUS_V5.minimumIndependentDimensions} independent dimensions. Exact source-profile percentages remain blocked pending broader systematic sampling, independent count corroboration where missing, conflict resolution where possible, and product-owner sign-off.`,
      unblockAction: "Complete broader systematic paper-day sampling using separate conclusion-structure, conclusion-semantic-feature, premise-overlay and conclusion-set-relationship dimensions; independently corroborate single-source complete-shift counts where possible; reconcile known source conflicts; then obtain product-owner sign-off on a separate inactive factorized weighting model before any production-profile change.",
    };
  }

  return requirement;
}

export const SYL_FREEZE_REQUIREMENTS_V8: readonly SylFreezeRequirementV8[] = Object.freeze(
  SYL_FREEZE_REQUIREMENTS_V7.map(supersedeRequirement),
);

const counts = SYL_FREEZE_REQUIREMENTS_V8.reduce<Record<SylFreezeRequirementStatusV8, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V8 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V8",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: SYL_FREEZE_READINESS_V7.authorityId,
  requirementCount: SYL_FREEZE_REQUIREMENTS_V8.length,
  counts,
  bankingCrossExamCensusAuthority: SYL_BANKING_CROSS_EXAM_CENSUS_V5.authorityId,
  bankingCrossExamSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.examSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V5.structuralQuestionRecordsObserved,
  bankingArchiveCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.archiveCompleteOfficerLevelShiftCount,
  bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V5.independentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  bankingFactorizedWeightModelRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V5.factorizedWeightModelRequired,
  bankingMinimumIndependentWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V5.minimumIndependentDimensions,
  bankingWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V5.factorDimensions,
  bankingEitherOrIndependentConclusionSetRelationshipDimensionRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V5.eitherOrRequiresIndependentConclusionSetRelationshipDimension,
  bankingLegacyProvisionalFamiliesMixIndependentDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V5.legacyProvisionalFamiliesMixIndependentDimensions,
  bankingWeightModelArchitectureClarified: true,
  bankingSystematicCrossSeriesWeightSampleComplete: false,
  bankingKnownSourceConflictsRemain: true,
  bankingSingleCountSourceCompleteShiftNeedsIndependentCorroboration: true,
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
    "Expand the four-factor Banking census across additional SBI PO and IBPS PO paper-days; retain unresolved or conflicting source counts explicitly instead of imputing them.",
    "Seek independent count corroboration for the archive-complete IBPS RRB PO 04-Aug-2024 Shift-4 sample.",
    "After systematic sampling is sufficient, design a separate inactive four-factor Banking planner candidate; do not mutate the current provisional production mix inside source-evidence work.",
    "Resolve SSC adapted-practice and Punjab source-coverage gaps before broader profile freeze.",
    "Calibrate difficulty after controlled learner accuracy and solve-time evidence exists.",
    "Only after all remaining gates are approved, design compatibility-safe registration/production integration as a separate activation change.",
  ] as const,
});
