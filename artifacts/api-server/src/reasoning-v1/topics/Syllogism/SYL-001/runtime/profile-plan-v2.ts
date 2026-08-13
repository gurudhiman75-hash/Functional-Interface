import {
  buildSylProfilePlanV1,
  type SylPlanningProfileV1,
  type SylProfilePlanSlotV1,
} from "./profile-plan-v1";

export type SylPlanSlotReadinessV2 =
  | "ACTIVE_CANONICAL"
  | "CANDIDATE_INACTIVE"
  | "BLOCKED_REMODEL"
  | "PRACTICE_ONLY";

export interface SylProfilePlanSlotV2 extends Omit<SylProfilePlanSlotV1, "readiness"> {
  readiness: SylPlanSlotReadinessV2;
  candidateAuthority: string | null;
  registrationRequired: boolean;
}

export interface SylProfilePlanV2 {
  authority: "SYL_001_PROFILE_PLAN_V2";
  profile: SylPlanningProfileV1;
  seed: number;
  requestedCount: number;
  slots: readonly SylProfilePlanSlotV2[];
  readinessCounts: Readonly<Record<SylPlanSlotReadinessV2, number>>;
  familyCounts: Readonly<Record<string, number>>;
  connectedToGenerator: false;
  activationPermitted: false;
}

const BANKING_CANDIDATE_FAMILY = "BANK_POSSIBILITY_IN_CONCLUSION_SET";
const BANKING_CANDIDATE_AUTHORITY = "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4";

function readinessFor(slot: SylProfilePlanSlotV1): SylPlanSlotReadinessV2 {
  if (slot.familyId === BANKING_CANDIDATE_FAMILY) return "CANDIDATE_INACTIVE";
  return slot.readiness;
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function buildSylProfilePlanV2(
  profile: SylPlanningProfileV1,
  seed: number,
  requestedCount: number,
): SylProfilePlanV2 {
  const base = buildSylProfilePlanV1(profile, seed, requestedCount);
  const readinessCounts: Record<SylPlanSlotReadinessV2, number> = {
    ACTIVE_CANONICAL: 0,
    CANDIDATE_INACTIVE: 0,
    BLOCKED_REMODEL: 0,
    PRACTICE_ONLY: 0,
  };
  const familyCounts: Record<string, number> = {};

  const slots = base.slots.map((slot): SylProfilePlanSlotV2 => {
    const readiness = readinessFor(slot);
    increment(readinessCounts, readiness);
    increment(familyCounts, slot.familyId);
    const isCandidate = slot.familyId === BANKING_CANDIDATE_FAMILY;
    return {
      ...slot,
      readiness,
      candidateAuthority: isCandidate ? BANKING_CANDIDATE_AUTHORITY : null,
      registrationRequired: isCandidate,
    };
  });

  return {
    authority: "SYL_001_PROFILE_PLAN_V2",
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

export const SYL_PROFILE_PLAN_V2 = Object.freeze({
  authorityId: "SYL_001_PROFILE_PLAN_V2",
  status: "PLANNER_ONLY_CANDIDATE_MODELED_NOT_CONNECTED",
  supersedes: "SYL_001_PROFILE_PLAN_V1",
  candidateFamily: BANKING_CANDIDATE_FAMILY,
  candidateAuthority: BANKING_CANDIDATE_AUTHORITY,
  candidateRegistrationStatus: "NOT_REGISTERED",
  candidateHumanReviewStatus: "PENDING",
  candidateSourceProfileStatus: "PENDING_SOURCE_PROFILE_FREEZE",
  connectedToGenerator: false,
  activationPermitted: false,
});
