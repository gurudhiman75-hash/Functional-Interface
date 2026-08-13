import { SYL_DIFFICULTY_CALIBRATION_V1 } from "../runtime/difficulty-calibration-v1";
import { buildSylProfilePlanV3, SYL_PROFILE_PLAN_V3 } from "../runtime/profile-plan-v3";
import { SYL_QL_ARCHETYPE_CONSOLIDATION_V2 } from "./ql-archetype-consolidation-v2";
import { SYL_SOURCE_PROFILE_CLOSEOUT_V2 } from "./source-profile-closeout-v2";

export type SylFreezeRequirementStatusV3 = "MET" | "PARTIAL" | "BLOCKED";

export interface SylFreezeRequirementV3 {
  requirementId: string;
  status: SylFreezeRequirementStatusV3;
  evidence: string;
  unblockAction: string | null;
}

const sscPlan = buildSylProfilePlanV3("SSC", 0, 100);
const bankingPlan = buildSylProfilePlanV3("BANKING", 0, 100);
const punjabPolicePlan = buildSylProfilePlanV3("PUNJAB_POLICE", 0, 100);
const crossExamPlan = buildSylProfilePlanV3("CROSS_EXAM_PRACTICE", 0, 100);

export const SYL_FREEZE_REQUIREMENTS_V3: readonly SylFreezeRequirementV3[] = Object.freeze([
  {
    requirementId: "LEARNER_CONTENT_APPROVED_BASELINE",
    status: "MET",
    evidence: "The approved baseline learner content remains preserved; Banking possibility-family candidates are additive and still human-gated.",
    unblockAction: null,
  },
  {
    requirementId: "QL_ARCHETYPE_BOUNDARY_DEFINED",
    status: "MET",
    evidence: `${SYL_QL_ARCHETYPE_CONSOLIDATION_V2.canonicalArchetypeCount} canonical archetypes remain defined without deleting or renumbering legacy QL IDs.`,
    unblockAction: null,
  },
  {
    requirementId: "DETERMINISTIC_PROFILE_PLANNER_PROVEN",
    status: "MET",
    evidence: "Profile planner V3 preserves deterministic 100-slot expansion while distinguishing inactive candidates from unresolved remodels.",
    unblockAction: null,
  },
  {
    requirementId: "SSC_PROFILE_MOCK_READY",
    status: "PARTIAL",
    evidence: `${sscPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${sscPlan.readinessCounts.PRACTICE_ONLY}% adapted practice in the current provisional mix.`,
    unblockAction: "Remove, relabel or directly source the 10% advanced three-conclusion SSC component before mock activation.",
  },
  {
    requirementId: "BANKING_PROFILE_MOCK_READY",
    status: "PARTIAL",
    evidence: `${bankingPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${bankingPlan.readinessCounts.CANDIDATE_INACTIVE}% candidate-inactive. The prior remodel blocker is closed by the ordinary possibility and can-never candidate authorities, but no permanent QL is registered and human/source-profile review is pending.`,
    unblockAction: "Complete human editorial/diagram review and Banking source-profile weighting, then prove compatibility-safe inactive QL registration before any activation.",
  },
  {
    requirementId: "PUNJAB_PROFILE_SOURCE_SATURATED",
    status: "PARTIAL",
    evidence: `${punjabPolicePlan.readinessCounts.ACTIVE_CANONICAL}% of the provisional Punjab Police plan maps structurally, but the source authority remains a 12-question secondary official-paper-tagged sample and is not statewide.`,
    unblockAction: "Archive or independently verify official papers and add PSSSB, Patwari and Punjab Police SI question-level evidence.",
  },
  {
    requirementId: "CROSS_EXAM_PROFILE_MOCK_READY",
    status: "PARTIAL",
    evidence: `${crossExamPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${crossExamPlan.readinessCounts.PRACTICE_ONLY}% explicitly practice-only.`,
    unblockAction: "Keep this as a practice profile or collect direct target-exam evidence for the mixed component.",
  },
  {
    requirementId: "DIFFICULTY_CALIBRATED",
    status: "BLOCKED",
    evidence: `Structural calibration status is ${SYL_DIFFICULTY_CALIBRATION_V1.status}; learner accuracy and solve-time calibration has not occurred.`,
    unblockAction: "Keep structural labels audit-only until controlled learner accuracy and solve-time data is available.",
  },
  {
    requirementId: "PROFILE_PLANNER_CONNECTED_TO_GENERATOR",
    status: "BLOCKED",
    evidence: `Planner V3 status is ${SYL_PROFILE_PLAN_V3.status}; connectedToGenerator=${SYL_PROFILE_PLAN_V3.connectedToGenerator}.`,
    unblockAction: "Add a separately gated inactive profile-generation adapter with deterministic scenario bindings and regression proof.",
  },
  {
    requirementId: "SOURCE_PROFILE_FROZEN",
    status: "BLOCKED",
    evidence: `Source closeout remains ${SYL_SOURCE_PROFILE_CLOSEOUT_V2.status}; mockWeightingFrozen=${SYL_SOURCE_PROFILE_CLOSEOUT_V2.mockWeightingFrozen}.`,
    unblockAction: "Expand target-exam source evidence and obtain product-owner sign-off on final production weighting.",
  },
]);

const counts = SYL_FREEZE_REQUIREMENTS_V3.reduce<Record<SylFreezeRequirementStatusV3, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V3 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V3",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: "SYL_001_FREEZE_READINESS_V2",
  requirementCount: SYL_FREEZE_REQUIREMENTS_V3.length,
  counts,
  bankingRemodelBlockerClosed: true,
  bankingCandidateInactive: true,
  bankingCandidateAuthorities: SYL_PROFILE_PLAN_V3.candidateAuthorities,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  difficultyActivationPermitted: false,
  generatorIntegrationPermitted: false,
  prMergeRecommended: false,
  nextCriticalPath: [
    "Complete human review of ordinary Banking possibility and Banking can-never candidate wording, localization and combined diagrams.",
    "Expand and freeze Banking source/profile weighting without treating prototype generation counts as exam frequencies.",
    "Resolve the SSC 10% adapted-practice component.",
    "Expand and strengthen Punjab and other target-exam source ledgers.",
    "Add inactive scenario bindings and generated profile-pack audits before any registration or activation.",
    "Calibrate difficulty only after controlled learner data exists.",
  ],
});
