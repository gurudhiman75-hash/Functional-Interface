import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityEditorialV4,
  type BankingPossibilityEditorialV4Question,
} from "./banking-possibility-editorial-v4";
import {
  generateBankingCanNeverEditorialV6,
  type BankingCanNeverEditorialV6Question,
} from "./banking-can-never-be-editorial-v6";
import {
  buildSylProfilePlanV4,
  type SylProfilePlanSlotV4,
  type SylProfilePlanV4,
} from "./profile-plan-v4";

export type BankingModalCandidateKindV2 = "ORDINARY_POSSIBILITY" | "CAN_NEVER";
export type BankingModalCandidateQuestionV2 =
  | BankingPossibilityEditorialV4Question
  | BankingCanNeverEditorialV6Question;

export interface BankingModalCandidateBindingV2 {
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V2";
  profile: "BANKING";
  plannerAuthority: "SYL_001_PROFILE_PLAN_V4";
  plannerSeed: number;
  plannerSlotIndex: number;
  candidateOrdinal: number;
  sourcePercentileSlot: number;
  familyId: "BANK_POSSIBILITY_IN_CONCLUSION_SET";
  readiness: "CANDIDATE_INACTIVE";
  canonicalQlId: null;
  candidateKind: BankingModalCandidateKindV2;
  candidateAuthority:
    | "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4"
    | "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6";
  candidateSeed: number;
  locale: SylLocale;
  question: BankingModalCandidateQuestionV2;
  policy: {
    selection: "DETERMINISTIC_EVALUATION_COVERAGE_NOT_SOURCE_FREQUENCY_V2";
    registeredQlCreated: false;
    connectedToProductionGenerator: false;
    questionStudioVisible: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    sourceFrequencyClaim: false;
    activationPermitted: false;
  };
}

const CANDIDATE_FAMILY = "BANK_POSSIBILITY_IN_CONCLUSION_SET" as const;
const ORDINARY_AUTHORITY = "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4" as const;
const CAN_NEVER_AUTHORITY = "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6" as const;

const LOCKS = Object.freeze({
  selection: "DETERMINISTIC_EVALUATION_COVERAGE_NOT_SOURCE_FREQUENCY_V2",
  registeredQlCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  sourceFrequencyClaim: false,
  activationPermitted: false,
} as const);

function deterministicCandidateSeed(
  plannerSeed: number,
  slot: SylProfilePlanSlotV4,
  candidateOrdinal: number,
): number {
  const value = `SYL-001:BANK-MODAL-CANDIDATE-V2:${plannerSeed}:${slot.index}:${slot.sourcePercentileSlot}:${candidateOrdinal}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function assertCandidateSlot(slot: SylProfilePlanSlotV4): asserts slot is SylProfilePlanSlotV4 & {
  familyId: typeof CANDIDATE_FAMILY;
  readiness: "CANDIDATE_INACTIVE";
  canonicalQlId: null;
} {
  if (slot.familyId !== CANDIDATE_FAMILY) throw new Error(`Unexpected family ${slot.familyId}`);
  if (slot.readiness !== "CANDIDATE_INACTIVE") throw new Error("Banking modal slot must remain inactive.");
  if (slot.canonicalQlId !== null || !slot.registrationRequired) {
    throw new Error("Banking modal slot must remain unregistered.");
  }
  if (
    !slot.candidateAuthorities.includes(ORDINARY_AUTHORITY)
    || !slot.candidateAuthorities.includes(CAN_NEVER_AUTHORITY)
  ) {
    throw new Error("Banking modal slot does not point at the current reviewed editorial authorities.");
  }
}

function candidateKindForOrdinal(candidateOrdinal: number): BankingModalCandidateKindV2 {
  return candidateOrdinal % 2 === 0 ? "ORDINARY_POSSIBILITY" : "CAN_NEVER";
}

function bindCandidate(
  plan: SylProfilePlanV4,
  slot: SylProfilePlanSlotV4,
  candidateOrdinal: number,
  locale: SylLocale,
): BankingModalCandidateBindingV2 {
  if (plan.profile !== "BANKING") throw new Error("Banking modal candidate overlay accepts only BANKING.");
  assertCandidateSlot(slot);
  const candidateKind = candidateKindForOrdinal(candidateOrdinal);
  const candidateSeed = deterministicCandidateSeed(plan.seed, slot, candidateOrdinal);
  const candidateAuthority = candidateKind === "ORDINARY_POSSIBILITY" ? ORDINARY_AUTHORITY : CAN_NEVER_AUTHORITY;
  const question = candidateKind === "ORDINARY_POSSIBILITY"
    ? generateBankingPossibilityEditorialV4(candidateSeed, locale)
    : generateBankingCanNeverEditorialV6(candidateSeed, locale);

  return {
    authority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V2",
    profile: "BANKING",
    plannerAuthority: "SYL_001_PROFILE_PLAN_V4",
    plannerSeed: plan.seed,
    plannerSlotIndex: slot.index,
    candidateOrdinal,
    sourcePercentileSlot: slot.sourcePercentileSlot,
    familyId: CANDIDATE_FAMILY,
    readiness: "CANDIDATE_INACTIVE",
    canonicalQlId: null,
    candidateKind,
    candidateAuthority,
    candidateSeed,
    locale,
    question,
    policy: LOCKS,
  };
}

export function buildBankingModalCandidateOverlayV2(
  seed: number,
  requestedCount: number,
  locale: SylLocale,
): readonly BankingModalCandidateBindingV2[] {
  const plan = buildSylProfilePlanV4("BANKING", seed, requestedCount);
  const candidates = plan.slots.filter((slot) => slot.familyId === CANDIDATE_FAMILY);
  return candidates.map((slot, candidateOrdinal) => bindCandidate(plan, slot, candidateOrdinal, locale));
}

export const SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V2",
  status: "CURRENT_EDITORIAL_EVALUATION_ONLY_NOT_REGISTERED_NOT_ACTIVE",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V4",
  familyId: CANDIDATE_FAMILY,
  candidateAuthorities: [ORDINARY_AUTHORITY, CAN_NEVER_AUTHORITY] as const,
  permanentQlIdCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
