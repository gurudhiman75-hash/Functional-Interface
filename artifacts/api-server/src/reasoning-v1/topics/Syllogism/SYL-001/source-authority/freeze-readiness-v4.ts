import { SYL_DIFFICULTY_CALIBRATION_V1 } from "../runtime/difficulty-calibration-v1";
import { buildSylProfilePlanV3, SYL_PROFILE_PLAN_V3 } from "../runtime/profile-plan-v3";
import { SYL_BANKING_COVERAGE_POLICY_V3 } from "./banking-source-profile-v3";
import { SYL_QL_ARCHETYPE_CONSOLIDATION_V2 } from "./ql-archetype-consolidation-v2";
import { SYL_SOURCE_PROFILE_CLOSEOUT_V2 } from "./source-profile-closeout-v2";

export type SylFreezeRequirementStatusV4 = "MET" | "PARTIAL" | "BLOCKED";
export interface SylFreezeRequirementV4 { requirementId: string; status: SylFreezeRequirementStatusV4; evidence: string; unblockAction: string | null; }

const sscPlan = buildSylProfilePlanV3("SSC", 0, 100);
const bankingPlan = buildSylProfilePlanV3("BANKING", 0, 100);
const punjabPolicePlan = buildSylProfilePlanV3("PUNJAB_POLICE", 0, 100);
const crossExamPlan = buildSylProfilePlanV3("CROSS_EXAM_PRACTICE", 0, 100);

export const SYL_FREEZE_REQUIREMENTS_V4: readonly SylFreezeRequirementV4[] = Object.freeze([
  { requirementId: "LEARNER_CONTENT_APPROVED_BASELINE", status: "MET", evidence: "Approved baseline learner content remains preserved; Banking possibility-family candidates are additive and human-gated.", unblockAction: null },
  { requirementId: "QL_ARCHETYPE_BOUNDARY_DEFINED", status: "MET", evidence: `${SYL_QL_ARCHETYPE_CONSOLIDATION_V2.canonicalArchetypeCount} canonical archetypes remain defined without deleting or renumbering legacy QL IDs.`, unblockAction: null },
  { requirementId: "DETERMINISTIC_PROFILE_PLANNER_PROVEN", status: "MET", evidence: "Profile planner V3 preserves deterministic 100-slot expansion and keeps Banking candidate slots inactive and unregistered.", unblockAction: null },
  { requirementId: "BANKING_FAMILY_SOURCE_COVERAGE", status: "MET", evidence: `${SYL_BANKING_COVERAGE_POLICY_V3.evidenceItemCount ?? 9} reviewed Banking evidence items support all five planned Banking source families; exact historical percentages remain explicitly unfrozen.`, unblockAction: null },
  { requirementId: "SSC_PROFILE_MOCK_READY", status: "PARTIAL", evidence: `${sscPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${sscPlan.readinessCounts.PRACTICE_ONLY}% adapted practice in the current provisional mix.`, unblockAction: "Remove, relabel or directly source the 10% advanced three-conclusion SSC component before mock activation." },
  { requirementId: "BANKING_PROFILE_MOCK_READY", status: "PARTIAL", evidence: `${bankingPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${bankingPlan.readinessCounts.CANDIDATE_INACTIVE}% candidate-inactive. Family presence is source-backed, but human review, exact weighting freeze and inactive registration remain open.`, unblockAction: "Complete human editorial/diagram review, freeze defensible Banking weighting, then prove compatibility-safe inactive QL registration before activation." },
  { requirementId: "PUNJAB_PROFILE_SOURCE_SATURATED", status: "PARTIAL", evidence: `${punjabPolicePlan.readinessCounts.ACTIVE_CANONICAL}% maps structurally, but source authority remains a 12-question secondary official-paper-tagged Punjab Police sample and is not statewide.`, unblockAction: "Archive or independently verify official papers and add PSSSB, Patwari and Punjab Police SI question-level evidence." },
  { requirementId: "CROSS_EXAM_PROFILE_MOCK_READY", status: "PARTIAL", evidence: `${crossExamPlan.readinessCounts.ACTIVE_CANONICAL}% active canonical and ${crossExamPlan.readinessCounts.PRACTICE_ONLY}% explicitly practice-only.`, unblockAction: "Keep this as practice-only or collect direct target-exam evidence for the mixed component." },
  { requirementId: "DIFFICULTY_CALIBRATED", status: "BLOCKED", evidence: `Structural calibration status is ${SYL_DIFFICULTY_CALIBRATION_V1.status}; learner accuracy and solve-time calibration has not occurred.`, unblockAction: "Keep structural labels audit-only until controlled learner accuracy and solve-time data is available." },
  { requirementId: "PROFILE_PLANNER_CONNECTED_TO_GENERATOR", status: "BLOCKED", evidence: `Planner V3 status is ${SYL_PROFILE_PLAN_V3.status}; connectedToGenerator=${SYL_PROFILE_PLAN_V3.connectedToGenerator}.`, unblockAction: "Add a separately gated inactive profile-generation adapter with deterministic scenario bindings and regression proof." },
  { requirementId: "SOURCE_PROFILE_FROZEN", status: "BLOCKED", evidence: `Banking coverage status is ${SYL_BANKING_COVERAGE_POLICY_V3.status}; sourceMixFrozen=${SYL_BANKING_COVERAGE_POLICY_V3.sourceMixFrozen}. Global source closeout remains ${SYL_SOURCE_PROFILE_CLOSEOUT_V2.status}.`, unblockAction: "Expand to a broader paper-level ledger and obtain product-owner sign-off on final production weighting; do not infer frequency from generated counts." },
]);

const counts = SYL_FREEZE_REQUIREMENTS_V4.reduce<Record<SylFreezeRequirementStatusV4, number>>((result, requirement) => { result[requirement.status] += 1; return result; }, { MET: 0, PARTIAL: 0, BLOCKED: 0 });

export const SYL_FREEZE_READINESS_V4 = Object.freeze({
  authorityId: "SYL_001_FREEZE_READINESS_V4",
  status: "NOT_READY_FOR_PROFILE_OR_QL_FREEZE",
  supersedes: "SYL_001_FREEZE_READINESS_V3",
  requirementCount: SYL_FREEZE_REQUIREMENTS_V4.length,
  counts,
  bankingRemodelBlockerClosed: true,
  bankingFamilySourceCoverageClosed: true,
  bankingExactWeightingFrozen: false,
  permanentQlFreezePermitted: false,
  profileActivationPermitted: false,
  difficultyActivationPermitted: false,
  generatorIntegrationPermitted: false,
  prMergeRecommended: false,
  nextCriticalPath: [
    "Complete human review of ordinary Banking possibility and can-never wording, localization and combined diagrams.",
    "Expand the Banking ledger to paper-level sampling and freeze exact product weighting only after product-owner review.",
    "Add inactive scenario bindings and generated profile-pack audits before any QL registration or activation.",
    "Resolve SSC adapted-practice and Punjab source-coverage gaps.",
    "Calibrate difficulty after controlled learner data exists."
  ] as const,
});
