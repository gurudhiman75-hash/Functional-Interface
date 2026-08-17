import type { SylLocale } from "../foundation/types";
import {
  buildBankingModalCandidateReviewOverlayV3,
  type BankingModalCandidateReviewBindingV3,
} from "./banking-modal-candidate-review-overlay-v3";
import type { BankingPossibilityEditorialV4Question } from "./banking-possibility-editorial-v4";
import {
  generateBankingCanNeverEditorialV6,
  type BankingCanNeverEditorialV6Question,
} from "./banking-can-never-be-editorial-v6";

export type BankingModalReviewQuestionV4 =
  | BankingPossibilityEditorialV4Question
  | BankingCanNeverEditorialV6Question;

export type BankingModalCandidateReviewBindingV4 = Omit<
  BankingModalCandidateReviewBindingV3,
  "authority" | "candidateAuthority" | "question"
> & {
  authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4";
  candidateAuthority:
    | "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4"
    | "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6";
  question: BankingModalReviewQuestionV4;
};

export function buildBankingModalCandidateReviewOverlayV4(
  seed: number,
  requestedCount: number,
  locale: SylLocale,
): readonly BankingModalCandidateReviewBindingV4[] {
  return buildBankingModalCandidateReviewOverlayV3(seed, requestedCount, locale).map((binding) => {
    if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
      return {
        ...binding,
        authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4",
        candidateAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
      } satisfies BankingModalCandidateReviewBindingV4;
    }

    return {
      ...binding,
      authority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4",
      candidateAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
      question: generateBankingCanNeverEditorialV6(binding.candidateSeed, locale),
    } satisfies BankingModalCandidateReviewBindingV4;
  });
}

export const SYL_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4 = Object.freeze({
  authorityId: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V4",
  plannerAuthority: "SYL_001_PROFILE_PLAN_V3",
  priorReviewAuthority: "SYL_001_BANKING_MODAL_CANDIDATE_REVIEW_OVERLAY_V3",
  ordinaryEditorialAuthority: "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
  canNeverEditorialAuthority: "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
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
