import {
  buildSylProfilePlanV3,
  type SylPlanSlotReadinessV3,
  type SylProfilePlanSlotV3,
  type SylProfilePlanV3,
} from "./profile-plan-v3";
import type { SylPlanningProfileV1 } from "./profile-plan-v1";

export interface SylProfilePlanSlotV4 extends Omit<SylProfilePlanSlotV3, "candidateAuthorities"> {
  candidateAuthorities: readonly string[];
}

export interface SylProfilePlanV4 extends Omit<SylProfilePlanV3, "authority" | "slots"> {
  authority: "SYL_001_PROFILE_PLAN_V4";
  slots: readonly SylProfilePlanSlotV4[];
}

const BANKING_CANDIDATE_FAMILY = "BANK_POSSIBILITY_IN_CONCLUSION_SET";
const CURRENT_BANKING_CANDIDATE_AUTHORITIES = Object.freeze([
  "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
] as const);

export function buildSylProfilePlanV4(
  profile: SylPlanningProfileV1,
  seed: number,
  requestedCount: number,
): SylProfilePlanV4 {
  const base = buildSylProfilePlanV3(profile, seed, requestedCount);
  return {
    ...base,
    authority: "SYL_001_PROFILE_PLAN_V4",
    slots: base.slots.map((slot): SylProfilePlanSlotV4 => ({
      ...slot,
      candidateAuthorities:
        slot.familyId === BANKING_CANDIDATE_FAMILY
          ? CURRENT_BANKING_CANDIDATE_AUTHORITIES
          : slot.candidateAuthorities,
    })),
  };
}

export const SYL_PROFILE_PLAN_V4 = Object.freeze({
  authorityId: "SYL_001_PROFILE_PLAN_V4",
  status: "PLANNER_ONLY_CURRENT_BANKING_EDITORIAL_AUTHORITIES_NOT_CONNECTED",
  supersedes: "SYL_001_PROFILE_PLAN_V3",
  candidateFamily: BANKING_CANDIDATE_FAMILY,
  candidateAuthorities: CURRENT_BANKING_CANDIDATE_AUTHORITIES,
  candidateSemanticAuthorities: [
    "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
    "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
  ] as const,
  changesFamilyWeights: false,
  changesPlannerSlotOrder: false,
  changesReadiness: false,
  changesCanonicalQlIds: false,
  permanentQlCreated: false,
  connectedToGenerator: false,
  activationPermitted: false,
});
