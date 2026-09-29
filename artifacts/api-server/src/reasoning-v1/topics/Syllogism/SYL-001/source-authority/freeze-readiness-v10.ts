import { SYL_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1 } from "../runtime/banking-factorized-profile-candidate-v1";
import { SYL_PROFILE_PLAN_V4 } from "../runtime/profile-plan-v4";
import { SYL_PROFILE_BOUNDARY_V1 } from "./profile-boundary-v1";
import {
  SYL_FREEZE_REQUIREMENTS_V9,
  SYL_FREEZE_READINESS_V9,
  type SylFreezeRequirementStatusV9,
  type SylFreezeRequirementV9,
} from "./freeze-readiness-v9";

export type SylFreezeRequirementStatusV10 = SylFreezeRequirementStatusV9;
export type SylFreezeRequirementV10 = SylFreezeRequirementV9;

function supersedeRequirement(requirement: SylFreezeRequirementV9): SylFreezeRequirementV10 {
  if (requirement.requirementId === "PROFILE_PLANNER_CONNECTED_TO_GENERATOR"
    || requirement.requirementId === "INACTIVE_PROFILE_CANDIDATE_ADAPTER_PROVEN") {
    return {
      ...requirement,
      requirementId: "INACTIVE_PROFILE_ARCHITECTURE_PROVEN",
      status: "MET",
      evidence:
        `${SYL_PROFILE_PLAN_V4.authorityId} references current Banking editorial candidates and ${SYL_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1.authorityId} proves the required inactive four-factor Banking architecture without production connection or activation.`,
      unblockAction: null,
    };
  }

  if (requirement.requirementId === "SSC_SOURCE_PROFILE") {
    return {
      ...requirement,
      status: "MET",
      evidence:
        `${SYL_PROFILE_BOUNDARY_V1.ssc.authorityId} removes cross-exam three-conclusion adapted practice from SSC mock weight while retaining it as labelled practice only.`,
      unblockAction: null,
    };
  }

  if (requirement.requirementId === "PUNJAB_SOURCE_PROFILE") {
    return {
      ...requirement,
      status: "PARTIAL",
      evidence:
        `${SYL_PROFILE_BOUNDARY_V1.punjab.authorityId} safely bounds current evidence to a provisional Punjab Police Constable task-shape profile. Statewide Punjab, PSSSB, Patwari and Police SI generalization remain prohibited.`,
      unblockAction:
        "Add direct or independently archived PSSSB/Patwari/Police SI evidence before any statewide Punjab syllogism profile is frozen.",
    };
  }

  if (requirement.requirementId === "SOURCE_PROFILE_FROZEN") {
    return {
      ...requirement,
      status: "BLOCKED",
      evidence:
        `The four-factor Banking planner architecture is now implemented and inactive, but exact factor weights remain unfrozen because broader systematic sampling and known source-conflict handling are still incomplete. Current provisional percentages remain evaluation-only.`,
      unblockAction:
        "Complete broader systematic Banking paper-day sampling, retain or reconcile known count conflicts, and obtain explicit product-owner sign-off on inactive factor weights before any production-profile change.",
    };
  }

  return requirement;
}

const byId = new Map<string, SylFreezeRequirementV10>();
for (const requirement of SYL_FREEZE_REQUIREMENTS_V9.map(supersedeRequirement)) {
  byId.set(requirement.requirementId, requirement);
}
export const SYL_FREEZE_REQUIREMENTS_V10: readonly SylFreezeRequirementV10[] = Object.freeze(
  [...byId.values()],
);

const counts = SYL_FREEZE_REQUIREMENTS_V10.reduce<Record<SylFreezeRequirementStatusV10, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V10 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V10",
  status: "QUESTION_STUDIO_READY__PROFILE_FREEZE_STILL_BLOCKED",
  supersedes: SYL_FREEZE_READINESS_V9.authorityId,
  requirementCount: SYL_FREEZE_REQUIREMENTS_V10.length,
  counts,

  currentBankingPlannerAuthority: SYL_PROFILE_PLAN_V4.authorityId,
  bankingFactorizedCandidateAuthority: SYL_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1.authorityId,
  bankingFactorizedPlannerImplemented: true,
  bankingFactorDimensions: SYL_BANKING_FACTORIZED_PROFILE_CANDIDATE_V1.dimensions,
  bankingExactWeightingFrozen: false,
  bankingSourceConflictsRemain: true,

  sscAdaptedPracticeMockWeight: SYL_PROFILE_BOUNDARY_V1.ssc.adaptedPracticeMockWeight,
  sscProfileBoundaryResolved: true,

  punjabPoliceProfileBounded: true,
  punjabStatewideProfileFrozen: false,
  punjabExactFrequencyFrozen: false,

  bankingModalLatestEditorialAuthoritiesReferenced: true,
  bankingModalHumanProductApprovalRecorded: false,
  permanentQl019Created: false,

  questionStudioCurrentAuthorityValid: true,
  questionStudioGenerationPermitted: true,
  questionBankWritePermitted: false,
  testDeliveryPermitted: false,
  mockDeliveryPermitted: false,
  publicPublishingPermitted: false,

  difficultyCalibrationFrozen: false,
  difficultyActivationPermitted: false,

  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  generatorProfileIntegrationPermitted: false,

  remainingCriticalPath: [
    "Record explicit human/product approval for the latest Banking ordinary-possibility V4 and can-never V6 review surfaces.",
    "Complete broader systematic Banking paper-day sampling using the four-factor model and retain/reconcile known source-count conflicts.",
    "Obtain explicit product-owner sign-off on factorized Banking weights before profile activation.",
    "Expand Punjab evidence beyond Punjab Police Constable only if a statewide Punjab profile is desired.",
    "Calibrate difficulty only after learner accuracy and solve-time evidence exists; do not invent calibrated production bands from structural score alone.",
  ] as const,
});
