import type { SylLocale } from "../foundation/types";
import {
  generateBankingCanNeverEditorialV4,
  type BankingCanNeverEditorialV4Question,
} from "./banking-can-never-be-editorial-v4";
import {
  generateBankingPossibilityShellV2,
  type BankingPossibilityShellQuestionV2,
} from "./banking-possibility-shell-v2";
import {
  buildSylProfilePlanV3,
  type SylProfilePlanV3,
  type SylProfilePlanSlotV3,
} from "./profile-plan-v3";

export type BankingModalCandidateKindV1 = "ORDINARY_POSSIBILITY" | "CAN_NEVER";
export type BankingModalCandidateQuestionV1 =
  | BankingPossibilityShellQuestionV2
  | BankingCanNeverEditorialV4Question;

export interface BankingModalCandidateBindingV1 {
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1";
  profile: "BANKING";
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3";
  plannerSeed: number;
  plannerSlotIndex: number;
  candidateOrdinal: number;
  sourcePercentileSlot: number;
  familyId: "BANK_POSSIBILITY_IN_CONCLUSION_SET";
  readiness: "CANDIDATE_INACTIVE";
  canonicalQlId: null;
  candidateKind: BankingModalCandidateKindV1;
  candidateAuthority:
    | "SYL_001_BANKING_POSSIBILITY_SHELL_V2"
    | "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4";
  candidateSeed: number;
  locale: SylLocale;
  question: BankingModalCandidateQuestionV1;
  policy: {
    selection: "DETERMINISTIC_EVALUATION_COVERAGE_NOT_SOURCE_FREQUENCY_V1";
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
const ORDINARY_AUTHORITY = "SYL_001_BANKING_POSSIBILITY_SHELL_V2" as const;
const CAN_NEVER_AUTHORITY = "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4" as const;

const LOCKS = Object.freeze({
  selection: "DETERMINISTIC_EVALUATION_COVERAGE_NOT_SOURCE_FREQUENCY_V1",
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
  slot: SylProfilePlanSlotV3,
  candidateOrdinal: number,
): number {
  const value = `SYL-001:BANK-MODAL-CANDIDATE:${plannerSeed}:${slot.index}:${slot.sourcePercentileSlot}:${candidateOrdinal}`;
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function assertCandidateSlot(slot: SylProfilePlanSlotV3): asserts slot is SylProfilePlanSlotV3 & {
  familyId: typeof CANDIDATE_FAMILY;
  readiness: "CANDIDATE_INACTIVE";
  canonicalQlId: null;
} {
  if (slot.familyId !== CANDIDATE_FAMILY) {
    throw new Error(`Slot ${slot.index} is ${slot.familyId}; Banking modal overlay only accepts ${CANDIDATE_FAMILY}.`);
  }
  if (slot.readiness !== "CANDIDATE_INACTIVE") {
    throw new Error(`Slot ${slot.index} must remain CANDIDATE_INACTIVE.`);
  }
  if (slot.canonicalQlId !== null || !slot.registrationRequired) {
    throw new Error(`Slot ${slot.index} must remain unregistered with canonicalQlId=null.`);
  }
  if (
    !slot.candidateAuthorities.includes(ORDINARY_AUTHORITY)
    || !slot.candidateAuthorities.includes(CAN_NEVER_AUTHORITY)
  ) {
    throw new Error(`Slot ${slot.index} is missing one or more Banking modal candidate authorities.`);
  }
}

function candidateKindForOrdinal(candidateOrdinal: number): BankingModalCandidateKindV1 {
  return candidateOrdinal % 2 === 0 ? "ORDINARY_POSSIBILITY" : "CAN_NEVER";
}

function bindCandidateSlot(
  plan: SylProfilePlanV3,
  slot: SylProfilePlanSlotV3,
  candidateOrdinal: number,
  locale: SylLocale,
): BankingModalCandidateBindingV1 {
  if (plan.profile !== "BANKING") throw new Error("Banking modal overlay accepts only the BANKING profile.");
  assertCandidateSlot(slot);
  const candidateKind = candidateKindForOrdinal(candidateOrdinal);
  const candidateSeed = deterministicCandidateSeed(plan.seed, slot, candidateOrdinal);
  const candidateAuthority = candidateKind === "ORDINARY_POSSIBILITY"
    ? ORDINARY_AUTHORITY
    : CAN_NEVER_AUTHORITY;
  const question = candidateKind === "ORDINARY_POSSIBILITY"
    ? generateBankingPossibilityShellV2(candidateSeed, locale)
    : generateBankingCanNeverEditorialV4(candidateSeed, locale);

  return {
    authority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1",
    profile: "BANKING",
    plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
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

export function bindBankingModalCandidatesV1(
  plan: SylProfilePlanV3,
  locale: SylLocale,
): readonly BankingModalCandidateBindingV1[] {
  if (plan.profile !== "BANKING") throw new Error("Banking modal overlay accepts only the BANKING profile.");
  if (plan.authority !== "SYL_001_PROFILE_PLAN_V3") throw new Error("Banking modal overlay requires profile planner V3.");
  if (plan.connectedToGenerator || plan.activationPermitted) {
    throw new Error("Banking modal overlay requires an inactive, non-generator-connected plan.");
  }

  const candidates = plan.slots.filter((slot) => slot.familyId === CANDIDATE_FAMILY);
  return candidates.map((slot, candidateOrdinal) =>
    bindCandidateSlot(plan, slot, candidateOrdinal, locale));
}

export function buildBankingModalCandidateOverlayV1(
  seed: number,
  requestedCount: number,
  locale: SylLocale,
): readonly BankingModalCandidateBindingV1[] {
  return bindBankingModalCandidatesV1(buildSylProfilePlanV3("BANKING", seed, requestedCount), locale);
}

export const SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1 = Object.freeze({
  authorityId: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1",
  status: "EVALUATION_ONLY_CANDIDATE_BINDING_NOT_REGISTERED_NOT_ACTIVE",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  familyId: CANDIDATE_FAMILY,
  candidateAuthorities: [ORDINARY_AUTHORITY, CAN_NEVER_AUTHORITY] as const,
  selectionPolicy: "DETERMINISTIC_EVALUATION_COVERAGE_NOT_SOURCE_FREQUENCY_V1",
  expectedCandidateSlotsPerBankingHundred: 20,
  evaluationCoverageSplitPerBankingHundred: {
    ORDINARY_POSSIBILITY: 10,
    CAN_NEVER: 10,
  } as const,
  evaluationCoverageIsExamFrequencyClaim: false,
  permanentQlIdCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
