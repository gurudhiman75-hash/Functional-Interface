import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  generateIntCp001CloseDistractorEnglishQuestion as generateCandidateEnglish,
  generateIntCp001CloseDistractorLocalizedQuestion as generateCandidateLocalized,
} from "./cp001-close-distractor-runtime-v2";
import type {
  IntCp001CloseDistractorEnglishQuestion,
  IntCp001CloseDistractorLocalizedQuestion,
} from "./cp001-close-distractor-runtime";

export const INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS = "APPROVED_CLOSE_DISTRACTOR_CONTRACT" as const;

export type IntCp001ApprovedCloseDistractorEnglishQuestion = Omit<
  IntCp001CloseDistractorEnglishQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  reviewStatus: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
};

export type IntCp001ApprovedCloseDistractorLocalizedQuestion = Omit<
  IntCp001CloseDistractorLocalizedQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  reviewStatus: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
};

function approvedLifecycle<T extends {
  questionBankStatus: string;
  testEligibility: string;
  publiclyPublishable: boolean;
  questionStudioDiscoverable: boolean;
}>(item: T): Omit<T, "maturity" | "reviewStatus" | "localeReviewStatus"> & {
  maturity: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  reviewStatus: typeof INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS;
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
} {
  return {
    ...item,
    maturity: INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS,
    reviewStatus: INT_CP001_APPROVED_CLOSE_DISTRACTOR_STATUS,
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateIntCp001ApprovedCloseDistractorEnglishQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
): IntCp001ApprovedCloseDistractorEnglishQuestion {
  return approvedLifecycle(generateCandidateEnglish(qlId, seed)) as IntCp001ApprovedCloseDistractorEnglishQuestion;
}

export function generateIntCp001ApprovedCloseDistractorLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001ApprovedCloseDistractorLocalizedQuestion {
  return approvedLifecycle(generateCandidateLocalized(qlId, seed, locale)) as IntCp001ApprovedCloseDistractorLocalizedQuestion;
}
