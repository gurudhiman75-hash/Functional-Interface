import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateOverlayV1,
  type BankingModalCandidateBindingV1,
} from "./banking-modal-candidate-overlay-v1";
import {
  generateBankingCanNeverEditorialV5,
  type BankingCanNeverEditorialV5Question,
} from "./banking-can-never-be-editorial-v5";
import type { BankingPossibilityEditorialV3Question } from "./banking-possibility-editorial-v3";

export type BankingModalReviewQuestionV2 =
  | BankingPossibilityEditorialV3Question
  | BankingCanNeverEditorialV5Question;

export type BankingModalCandidateReviewBindingV2 = Omit<
  BankingModalCandidateBindingV1,
  "authority" | "candidateAuthority" | "question"
> & {
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2";
  candidateAuthority:
    | "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3"
    | "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5";
  question: BankingModalReviewQuestionV2;
};

export function buildBankingModalCandidateReviewOverlayV2(
  seed: number,
  requestedCount: number,
  locale: SylLocale,
): readonly BankingModalCandidateReviewBindingV2[] {
  return buildBankingModalCandidateOverlayV1(seed, requestedCount, locale).map((binding) => {
    if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
      return {
        ...binding,
        authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2",
        candidateAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
      } satisfies BankingModalCandidateReviewBindingV2;
    }

    return {
      ...binding,
      authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2",
      candidateAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
      question: generateBankingCanNeverEditorialV5(binding.candidateSeed, locale),
    } satisfies BankingModalCandidateReviewBindingV2;
  });
}

export const SYL_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2 = Object.freeze({
  authorityId: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  baseBindingAuthority: "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1",
  ordinaryEditorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  canNeverEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  purpose: "HUMAN_REVIEW_ONLY",
  changesPlannerSlots: false,
  changesCandidateSeeds: false,
  permanentQlCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
