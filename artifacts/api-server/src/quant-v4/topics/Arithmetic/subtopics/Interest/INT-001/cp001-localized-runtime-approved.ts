import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001LocaleParity,
  generateIntCp001ReleaseLocalizedQuestion,
  type IntCp001LocalizedQuestion,
} from "./cp001-localized-runtime-release";
import type { IntCp001Locale } from "./cp001-multilingual-release";

export type IntCp001ApprovedLocalizedQuestion = Omit<
  IntCp001LocalizedQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: "APPROVED_MULTILINGUAL_CONTRACT";
  reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT";
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
};

export function generateIntCp001ApprovedLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001ApprovedLocalizedQuestion {
  const item = generateIntCp001ReleaseLocalizedQuestion(qlId, seed, locale);
  return {
    ...item,
    maturity: "APPROVED_MULTILINGUAL_CONTRACT",
    reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT",
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function assertIntCp001ApprovedLocaleParity(
  english: IntCp001FinalEditorialV3Question,
  localized: IntCp001ApprovedLocalizedQuestion,
): void {
  assertIntCp001LocaleParity(
    english,
    localized as unknown as IntCp001LocalizedQuestion,
  );
}
