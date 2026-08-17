import { SYL_DIFFICULTY_CALIBRATION_V1 } from "../runtime/difficulty-calibration-v1";
import { SYL_PROFILE_PLAN_V1, buildSylProfilePlanV1 } from "../runtime/profile-plan-v1";
import { SYL_QL_ARCHETYPE_CONSOLIDATION_V2 } from "./ql-archetype-consolidation-v2";
import { SYL_SOURCE_PROFILE_CLOSEOUT_V2 } from "./source-profile-closeout-v2";

export type SylFreezeRequirementStatusV1 = "MET" | "PARTIAL" | "BLOCKED";

export interface SylFreezeRequirementV1 {
  requirementId: string;
  status: SylFreezeRequirementStatusV1;
  evidence: string;
  unblockAction: string | null;
}

const sscPlan = buildSylProfilePlanV1("SSC", 0, 100);
const bankingPlan = buildSylProfilePlanV1("BANKING", 0, 100);
const punjabPolicePlan = buildSylProfilePlanV1("PUNJAB_POLICE", 0, 100);
const crossExamPlan = buildSylProfilePlanV1("CROSS_EXAM_PRACTICE", 0, 100);

export const SYL_FREEZE_REQUIREMENTS_V1: readonly SylFreezeRequirementV1[] = Object.freeze([
  {
    requirementId: "LEARNER_CONTENT_APPROVED",
    status: "MET",
    evidence: "Question, explanation, diagram and viewport content was approved and merged before this closeout branch.",
    unblockAction: null,
  },
  {
    requirementId: "QL_ARCHETYPE_BOUNDARY_DEFINED",
    status: "MET",
    evidence: `${SYL_QL_ARCHETYPE_CONSOLIDATION_V2.canonicalArchetypeCount} canonical archetypes and ${SYL_QL_ARCHETYPE_CONSOLIDATION_V2.legacyQlCount} compatibility decisions are defined without deleting legacy IDs.`,
    unblockAction: null,
  },
  {
    requirementId: "DETERMINISTIC_PROFILE_PLANNER_PROVEN",
    status: "MET",
    evidence: `${SYL_PROFILE_PLAN_V1.supportedProfiles.length} profiles expand deterministically in exact 100-slot cycles.`,
    unblockAction: null,
  },
  {
    requirementId: "SSC_PROFILE_MOCK_READY",
    status: "PARTIAL",
    evidence: `${sscPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${sscPlan.readinessCounts.PRACTICE_ONLY}% adapted practice in the current target mix.`,
    unblockAction: "Remove, relabel or directly source the 10% advanced three-conclusion SSC component before mock activation.",
  },
  {
    requirementId: "BANKING_PROFILE_MOCK_READY",
    status: "BLOCKED",
    evidence: `${bankingPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${bankingPlan.readinessCounts.BLOCKED_REMODEL}% blocked because the possibility-in-conclusion-set shell is not implemented.`,
    unblockAction: "Implement and validate the standard Banking possibility conclusion-combination archetype.",
  },
  {
    requirementId: "PUNJAB_PROFILE_SOURCE_SATURATED",
    status: "PARTIAL",
    evidence: `${punjabPolicePlan.readinessCounts.ACTIVE_CANONICAL}% of the provisional Punjab Police plan maps to canonical QLs, but the source authority is a 12-question secondary official-paper-tagged sample and is not statewide.`,
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
    evidence: `Structural calibration status is ${SYL_DIFFICULTY_CALIBRATION_V1.status}; it has not been calibrated against learner accuracy or solve time.`,
    unblockAction: "Review generated distributions, then calibrate score bands with controlled beta response data.",
  },
  {
    requirementId: "PROFILE_PLANNER_CONNECTED_TO_GENERATOR",
    status: "BLOCKED",
    evidence: `Planner status is ${SYL_PROFILE_PLAN_V1.status}.`,
    unblockAction: "Add a separately gated profile-generation adapter with deterministic scenario bindings and regression proof.",
  },
  {
    requirementId: "SOURCE_PROFILE_FROZEN",
    status: "BLOCKED",
    evidence: `Source closeout status is ${SYL_SOURCE_PROFILE_CLOSEOUT_V2.status}; mockWeightingFrozen=${SYL_SOURCE_PROFILE_CLOSEOUT_V2.mockWeightingFrozen}.`,
    unblockAction: "Complete source saturation and product-owner sign-off on final target mixes.",
  },
]);

const counts = SYL_FREEZE_REQUIREMENTS_V1.reduce<Record<SylFreezeRequirementStatusV1, number>>(
  (result, requirement) => {
    result[requirement.status] += 1;
    return result;
  },
  { MET: 0, PARTIAL: 0, BLOCKED: 0 },
);

export const SYL_FREEZE_READINESS_V1 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V1",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  requirementCount: SYL_FREEZE_REQUIREMENTS_V1.length,
  counts,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  difficultyActivationPermitted: false,
  generatorIntegrationPermitted: false,
  prMergeRecommended: false,
  nextCriticalPath: [
    "Implement the Banking possibility-in-conclusion-set archetype.",
    "Resolve the SSC 10% adapted-practice component.",
    "Expand and strengthen Punjab and other target-exam source ledgers.",
    "Add inactive scenario bindings and generated profile-pack audits.",
    "Calibrate difficulty only after controlled learner data exists.",
  ],
});
