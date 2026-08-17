import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateReviewOverlayV2,
  type BankingModalCandidateReviewBindingV2,
} from "./banking-modal-candidate-review-overlay-v2";
import {
  generateBankingPossibilityEditorialV4,
  type BankingPossibilityEditorialV4Question,
} from "./banking-possibility-editorial-v4";
import type { BankingCanNeverEditorialV5Question } from "./banking-can-never-be-editorial-v5";

export type BankingModalReviewQuestionV3 =
  | BankingPossibilityEditorialV4Question
  | BankingCanNeverEditorialV5Question;

export type BankingModalCandidateReviewBindingV3 = Omit<
  BankingModalCandidateReviewBindingV2,
  "authority" | "candidateAuthority" | "question"
> & {
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3";
  candidateAuthority:
    | "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4"
    | "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5";
  question: BankingModalReviewQuestionV3;
};

export function buildBankingModalCandidateReviewOverlayV3(
  seed: number,
  requestedCount: number,
  locale: SylLocale,
): readonly BankingModalCandidateReviewBindingV3[] {
  return buildBankingModalCandidateReviewOverlayV2(seed, requestedCount, locale).map((binding) => {
    if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
      return {
        ...binding,
        authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
        candidateAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
        question: generateBankingPossibilityEditorialV4(binding.candidateSeed, locale),
      } satisfies BankingModalCandidateReviewBindingV3;
    }

    return {
      ...binding,
      authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
      candidateAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
    } satisfies BankingModalCandidateReviewBindingV3;
  });
}

export const SYL_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3 = Object.freeze({
  authorityId: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  priorReviewAuthority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V2",
  ordinaryEditorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  canNeverEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V5",
  purpose: "HUMAN_REVIEW_ONLY",
  changesPlannerSlots: false,
  changesCandidateSeeds: false,
  changesSemantics: false,
  changesDiagrams: false,
  permanentQlCreated: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
});
