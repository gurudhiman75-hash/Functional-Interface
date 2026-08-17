import {
  buildSylProfilePlanV1,
  type SylPlanningProfileV1,
  type SylProfilePlanSlotV1,
} from "./profile-plan-v1";

export type SylPlanSlotReadinessV3 =
  | "ACTIVE_CANONICAL"
  | "CANDIDATE_INACTIVE"
  | "BLOCKED_REMODEL"
  | "PRACTICE_ONLY";

export interface SylProfilePlanSlotV3 extends Omit<SylProfilePlanSlotV1, "readiness"> {
  readiness: SylPlanSlotReadinessV3;
  candidateAuthorities: readonly string[];
  registrationRequired: boolean;
}

export interface SylProfilePlanV3 {
  authority: "SYL_001_PROFILE_PLAN_V3";
  profile: SylPlanningProfileV1;
  seed: number;
  requestedCount: number;
  slots: readonly SylProfilePlanSlotV3[];
  readinessCounts: Readonly<Record<SylPlanSlotReadinessV3, number>>;
  familyCounts: Readonly<Record<string, number>>;
  connectedToGenerator: false;
  activationPermitted: false;
}

const BANKING_CANDIDATE_FAMILY = "BANK_POSSIBILITY_IN_CONCLUSION_SET";
const BANKING_CANDIDATE_AUTHORITIES = Object.freeze([
  "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
] as const);

function readinessFor(slot: SylProfilePlanSlotV1): SylPlanSlotReadinessV3 {
  if (slot.familyId === BANKING_CANDIDATE_FAMILY) return "CANDIDATE_INACTIVE";
  return slot.readiness;
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function buildSylProfilePlanV3(
  profile: SylPlanningProfileV1,
  seed: number,
  requestedCount: number,
): SylProfilePlanV3 {
  const base = buildSylProfilePlanV1(profile, seed, requestedCount);
  const readinessCounts: Record<SylPlanSlotReadinessV3, number> = {
    ACTIVE_CANONICAL: 0,
    CANDIDATE_INACTIVE: 0,
    BLOCKED_REMODEL: 0,
    PRACTICE_ONLY: 0,
  };
  const familyCounts: Record<string, number> = {};

  const slots = base.slots.map((slot): SylProfilePlanSlotV3 => {
    const readiness = readinessFor(slot);
    increment(readinessCounts, readiness);
    increment(familyCounts, slot.familyId);
    const isCandidate = slot.familyId === BANKING_CANDIDATE_FAMILY;
    return {
      ...slot,
      readiness,
      candidateAuthorities: isCandidate ? BANKING_CANDIDATE_AUTHORITIES : [],
      registrationRequired: isCandidate,
    };
  });

  return {
    authority: "SYL_001_PROFILE_PLAN_V3",
    profile,
    seed,
    requestedCount,
    slots,
    readinessCounts,
    familyCounts,
    connectedToGenerator: false,
    activationPermitted: false,
  };
}

export const SYL_PROFILE_PLAN_V3 = Object.freeze({
  authorityId: "SYL_001_PROFILE_PLAN_V3",
  status: "PLANNER_ONLY_BANKING_CANDIDATE_FAMILY_MODELED_NOT_CONNECTED",
  supersedes: "SYL_001_PROFILE_PLAN_V2",
  candidateFamily: BANKING_CANDIDATE_FAMILY,
  candidateAuthorities: BANKING_CANDIDATE_AUTHORITIES,
  candidateSemanticAuthorities: [
    "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
    "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  ] as const,
  candidateRegistrationStatus: "NOT_REGISTERED",
  candidateHumanReviewStatus: "PENDING",
  candidateSourceProfileStatus: "PENDING_SOURCE_PROFILE_FREEZE",
  connectedToGenerator: false,
  activationPermitted: false,
});
