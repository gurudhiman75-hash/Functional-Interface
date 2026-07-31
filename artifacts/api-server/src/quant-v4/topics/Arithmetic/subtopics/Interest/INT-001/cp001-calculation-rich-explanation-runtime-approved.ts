import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  generateIntCp001CalculationRichQuestion,
  type IntCp001CalculationRichLanguage,
  type IntCp001CalculationRichQuestion,
} from "./cp001-calculation-rich-explanation-runtime";

export const INT_CP001_CALCULATION_RICH_APPROVAL_ID =
  "INT-CP-001-CALCULATION-RICH-V6-APPROVED" as const;
export const INT_CP001_CALCULATION_RICH_APPROVED_STATUS =
  "APPROVED_CALCULATION_RICH_EXPLANATION_CONTRACT" as const;

export type IntCp001ApprovedCalculationRichQuestion = Omit<
  IntCp001CalculationRichQuestion,
  "maturity" | "reviewStatus" | "localeReviewStatus"
> & {
  maturity: typeof INT_CP001_CALCULATION_RICH_APPROVED_STATUS;
  reviewStatus: typeof INT_CP001_CALCULATION_RICH_APPROVED_STATUS;
  localeReviewStatus: "APPROVED_HUMAN_REVIEW";
  calculationRichApprovalTrace: {
    approvalId: typeof INT_CP001_CALCULATION_RICH_APPROVAL_ID;
    candidateReleaseId: IntCp001CalculationRichQuestion["releaseId"];
    learnerContentChangedDuringApproval: false;
  };
};

export function generateIntCp001ApprovedCalculationRichQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  language: IntCp001CalculationRichLanguage,
): IntCp001ApprovedCalculationRichQuestion {
  const candidate = generateIntCp001CalculationRichQuestion(qlId, seed, language);
  return {
    ...candidate,
    maturity: INT_CP001_CALCULATION_RICH_APPROVED_STATUS,
    reviewStatus: INT_CP001_CALCULATION_RICH_APPROVED_STATUS,
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    calculationRichApprovalTrace: {
      approvalId: INT_CP001_CALCULATION_RICH_APPROVAL_ID,
      candidateReleaseId: candidate.releaseId,
      learnerContentChangedDuringApproval: false,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}
