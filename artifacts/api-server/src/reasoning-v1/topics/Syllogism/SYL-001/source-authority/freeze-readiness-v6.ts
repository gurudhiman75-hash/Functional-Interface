import { SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1 } from "../runtime/banking-modal-candidate-overlay-v1";
import {
  SYL_FREEZE_REQUIREMENTS_V4,
  type SylFreezeRequirementStatusV4,
  type SylFreezeRequirementV4,
} from "./freeze-readiness-v4";
import { SYL_FREEZE_READINESS_V5 } from "./freeze-readiness-v5";

export type SylFreezeRequirementStatusV6 = SylFreezeRequirementStatusV4;
export type SylFreezeRequirementV6 = SylFreezeRequirementV4;

function supersedeRequirement(requirement: SylFreezeRequirementV4): SylFreezeRequirementV6 {
  if (requirement.requirementId === "BANKING_FAMILY_SOURCE_COVERAGE") {
    return {
      requirementId: requirement.requirementId,
      status: "MET",
      evidence: `${SYL_FREEZE_READINESS_V5.bankingEvidenceItemCount} question-level Banking evidence items satisfy the coverage gate; exact historical percentage weighting remains explicitly unfrozen.`,
      unblockAction: null,
    };
  }

  if (requirement.requirementId === "PROFILE_PLANNER_CONNECTED_TO_GENERATOR") {
    return {
      requirementId: "INACTIVE_PROFILE_CANDIDATE_ADAPTER_PROVEN",
      status: "MET",
      evidence: `${SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.authorityId} deterministically binds the Banking candidate-inactive planner slots to both modal candidate authorities without creating a permanent QL ID or connecting the production generator.`,
      unblockAction: null,
    };
  }

  if (requirement.requirementId === "SOURCE_PROFILE_FROZEN") {
    return {
      ...requirement,
      evidence: `Banking family coverage is closed with ${SYL_FREEZE_READINESS_V5.bankingEvidenceItemCount} question-level items, but exact percentage weighting remains unfrozen and broader paper-level sampling/product-owner sign-off are still required.`,
    };
  }

  return requirement;
}

export const SYL_FREEZE_REQUIREMENTS_V6: readonly SylFreezeRequirementV6[] = Object.freeze(
  SYL_FREEZE_REQUIREMENTS_V4.map(supersedeRequirement),
);

const counts = SYL_FREEZE_REQUIREMENTS_V6.reduce<Record<SylFreezeRequirementStatusV6, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V6 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V6",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: [
    "SYL_001_FREEZE_READINESS_V4",
    "SYL_001_FREEZE_READINESS_V5",
  ] as const,
  requirementCount: SYL_FREEZE_REQUIREMENTS_V6.length,
  counts,
  bankingRemodelBlockerClosed: true,
  bankingFamilySourceCoverageClosed: true,
  inactiveProfileCandidateAdapterProven: true,
  inactiveAdapterAuthority: SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.authorityId,
  bankingCandidateSlotsPerHundred: SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.expectedCandidateSlotsPerBankingHundred,
  bankingEvaluationCoveragePerHundred: SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.evaluationCoverageSplitPerBankingHundred,
  bankingEvaluationCoverageIsExamFrequencyClaim: false,
  permanentQl019Created: false,
  bankingExactWeightingFrozen: false,
  exactPercentageWeightingPermitted: false,
  connectedToProductionGenerator: false,
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
    "Complete human EN/HI/PA editorial review and visual review of ordinary Banking possibility and can-never candidates.",
    "Expand Banking evidence to systematic paper-level sampling before freezing exact percentage weights.",
    "Resolve SSC adapted-practice and Punjab source-coverage gaps before broader profile freeze.",
    "Calibrate difficulty after controlled learner accuracy and solve-time evidence exists.",
    "Only after the remaining gates are approved, design compatibility-safe registration/production integration as a separate activation change.",
  ] as const,
});
