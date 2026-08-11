import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001DirectionAwareLocaleParity,
  generateIntCp001DirectionAwareLocalizedQuestion,
  type IntCp001DirectionAwareLocalizedQuestion,
} from "./cp001-localized-runtime-v2";
import type { IntCp001Locale } from "./cp001-multilingual-release";

export type IntCp001ApprovedV2LocalizedQuestion = Omit<
  IntCp001DirectionAwareLocalizedQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: "APPROVED_MULTILINGUAL_CONTRACT_V2";
  reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT_V2";
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
};

export function generateIntCp001ApprovedV2LocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001ApprovedV2LocalizedQuestion {
  const candidate = generateIntCp001DirectionAwareLocalizedQuestion(qlId, seed, locale);
  return {
    ...candidate,
    maturity: "APPROVED_MULTILINGUAL_CONTRACT_V2",
    reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT_V2",
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function assertIntCp001ApprovedV2LocaleParity(
  english: IntCp001FinalEditorialV3Question,
  localized: IntCp001ApprovedV2LocalizedQuestion,
): void {
  assertIntCp001DirectionAwareLocaleParity(
    english,
    localized as unknown as IntCp001DirectionAwareLocalizedQuestion,
  );
}
