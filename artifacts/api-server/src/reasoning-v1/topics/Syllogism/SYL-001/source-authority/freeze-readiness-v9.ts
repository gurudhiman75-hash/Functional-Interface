import { SYL_BANKING_CROSS_EXAM_CENSUS_V6 } from "./banking-cross-exam-census-v6";
import {
  SYL_FREEZE_REQUIREMENTS_V8,
  SYL_FREEZE_READINESS_V8,
  type SylFreezeRequirementStatusV8,
  type SylFreezeRequirementV8,
} from "./freeze-readiness-v8";

export type SylFreezeRequirementStatusV9 = SylFreezeRequirementStatusV8;
export type SylFreezeRequirementV9 = SylFreezeRequirementV8;

function supersedeRequirement(requirement: SylFreezeRequirementV8): SylFreezeRequirementV9 {
  if (requirement.requirementId === "SOURCE_PROFILE_FROZEN") {
    return {
      ...requirement,
      status: "BLOCKED",
      evidence: `${SYL_BANKING_CROSS_EXAM_CENSUS_V6.authorityId} now spans ${SYL_BANKING_CROSS_EXAM_CENSUS_V6.examSeriesCount} Banking exam series and ${SYL_BANKING_CROSS_EXAM_CENSUS_V6.structuralQuestionRecordsObserved} structural question records. The four-factor weighting architecture remains required, and the SBI PO 01-Nov-2023 sample additionally proves that premise-vocabulary overlay features are multi-label within their existing dimension because one recovered question contains both Only and Only-a-few premises. The same shift has a 3-to-6 topic-count conflict across analysis sources, so its three recovered questions remain structural evidence only. Exact source-profile percentages remain blocked pending broader systematic sampling, explicit retention or resolution of known source conflicts, and product-owner sign-off.`,
      unblockAction: "Complete broader systematic paper-day sampling using the four independent dimensions while allowing multi-label conclusion-semantic and premise-overlay features; explicitly retain or reconcile known SBI PO, IBPS PO and IBPS Clerk source conflicts; then obtain product-owner sign-off on a separate inactive factorized weighting model before any production-profile change.",
    };
  }

  return requirement;
}

export const SYL_FREEZE_REQUIREMENTS_V9: readonly SylFreezeRequirementV9[] = Object.freeze(
  SYL_FREEZE_REQUIREMENTS_V8.map(supersedeRequirement),
);

const counts = SYL_FREEZE_REQUIREMENTS_V9.reduce<Record<SylFreezeRequirementStatusV9, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V9 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V9",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: SYL_FREEZE_READINESS_V8.authorityId,
  requirementCount: SYL_FREEZE_REQUIREMENTS_V9.length,
  counts,
  bankingCrossExamCensusAuthority: SYL_BANKING_CROSS_EXAM_CENSUS_V6.authorityId,
  bankingCrossExamSeriesCount: SYL_BANKING_CROSS_EXAM_CENSUS_V6.examSeriesCount,
  bankingStructuralQuestionRecordsObserved: SYL_BANKING_CROSS_EXAM_CENSUS_V6.structuralQuestionRecordsObserved,
  bankingCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V6.completeOfficerLevelShiftCount,
  bankingIndependentlyCountCorroboratedCompleteOfficerLevelShiftCount: SYL_BANKING_CROSS_EXAM_CENSUS_V6.independentlyCountCorroboratedCompleteOfficerLevelShiftCount,
  bankingFactorizedWeightModelRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V6.factorizedWeightModelRequired,
  bankingMinimumIndependentWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V6.minimumIndependentDimensions,
  bankingWeightDimensions: SYL_BANKING_CROSS_EXAM_CENSUS_V6.factorDimensions,
  bankingConclusionSemanticFeaturesRemainMultiLabel: SYL_BANKING_CROSS_EXAM_CENSUS_V6.conclusionSemanticFeaturesRemainMultiLabel,
  bankingPremiseVocabularyOverlayFeaturesRemainMultiLabel: SYL_BANKING_CROSS_EXAM_CENSUS_V6.premiseVocabularyOverlayFeaturesRemainMultiLabel,
  bankingPremiseOverlayMultiLabelCreatesAdditionalDimension: false,
  bankingConclusionSetRelationshipIndependentDimensionRequired: SYL_BANKING_CROSS_EXAM_CENSUS_V6.conclusionSetRelationshipRemainsIndependentDimension,
  bankingWeightModelArchitectureClarified: true,
  bankingSystematicCrossSeriesWeightSampleComplete: false,
  bankingKnownSourceConflictsRemain: true,
  bankingSbiPoNov1CountConflictRetained: true,
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
    "Expand the four-factor Banking census across another IBPS PO paper-day, using multi-label semantic and premise-overlay features and retaining unresolved source counts explicitly.",
    "Reconcile or explicitly retain the SBI PO 01-Nov-2023 Shift-1, IBPS PO 23-Sep-2023 Shift-2 and IBPS Clerk 25-Aug-2024 source conflicts.",
    "After systematic sampling is sufficient, design a separate inactive four-factor Banking planner candidate; do not mutate the current provisional production mix inside source-evidence work.",
    "Resolve SSC adapted-practice and Punjab source-coverage gaps before broader profile freeze.",
    "Calibrate difficulty after controlled learner accuracy and solve-time evidence exists.",
    "Only after all remaining gates are approved, design compatibility-safe registration/production integration as a separate activation change.",
  ] as const,
});
