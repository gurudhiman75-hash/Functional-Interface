import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001CalculationRichQuestion,
  type IntCp001CalculationRichLanguage,
  type IntCp001CalculationRichQuestion,
} from "./cp001-calculation-rich-explanation-runtime";

export const INT_CP001_CALCULATION_RICH_APPROVAL_ID =
  "INT-CP-001-CALCULATION-RICH-EXPLANATIONS-V1-APPROVED" as const;
export const INT_CP001_CALCULATION_RICH_APPROVED_MATURITY =
  "APPROVED_CALCULATION_RICH_EXPLANATIONS_V1" as const;
export const INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS =
  "APPROVED_CALCULATION_RICH_EXPLANATIONS_V1" as const;

export type IntCp001ApprovedCalculationRichQuestion = Omit<
  IntCp001CalculationRichQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: typeof INT_CP001_CALCULATION_RICH_APPROVED_MATURITY;
  reviewStatus: typeof INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS;
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
  calculationRichApprovalTrace: {
    approvalId: typeof INT_CP001_CALCULATION_RICH_APPROVAL_ID;
    candidateReleaseId: "INT-CP-001-EN-v6" | "INT-CP-001-HI-v6" | "INT-CP-001-PA-v6";
    candidateContentChanged: false;
    approvalLifecycleOnly: true;
    approvedForActiveStaging: true;
  };
};

export function generateIntCp001ApprovedCalculationRichQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  language: IntCp001CalculationRichLanguage,
): IntCp001ApprovedCalculationRichQuestion {
  const candidate = generateIntCp001CalculationRichQuestion(qlId, seed, language);
  if (!candidate.validation.ok) {
    throw new Error(`${qlId}/${seed}/${language}: ${candidate.validation.errors.join(" | ")}`);
  }

  return {
    ...candidate,
    maturity: INT_CP001_CALCULATION_RICH_APPROVED_MATURITY,
    reviewStatus: INT_CP001_CALCULATION_RICH_APPROVED_REVIEW_STATUS,
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    calculationRichApprovalTrace: {
      approvalId: INT_CP001_CALCULATION_RICH_APPROVAL_ID,
      candidateReleaseId: candidate.releaseId,
      candidateContentChanged: false,
      approvalLifecycleOnly: true,
      approvedForActiveStaging: true,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
