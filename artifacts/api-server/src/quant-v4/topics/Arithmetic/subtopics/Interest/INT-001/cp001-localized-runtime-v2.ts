import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001ApprovedLocaleParity,
  generateIntCp001ApprovedLocalizedQuestion,
  type IntCp001ApprovedLocalizedQuestion,
} from "./cp001-localized-runtime-approved";
import {
  alignIntCp001StemCashFlow,
  validateIntCp001StemCashFlow,
  type IntCp001CashFlowDirection,
} from "./cp001-cash-flow-direction";
import {
  alignIntCp001ContextLeadV2,
  getIntCp001CashFlowContextV2,
  validateIntCp001ContextLeadV2,
} from "./cp001-cash-flow-context-v2";
import {
  alignIntCp001LoanAmountWordingV2,
  validateIntCp001LoanAmountWordingV2,
} from "./cp001-cash-flow-amount-v2";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  getIntCp001LocaleReleaseV2Id,
  INT_CP001_CASH_FLOW_PATCH_ID,
} from "./cp001-multilingual-release-v2";

export type IntCp001DirectionAwareLocalizedQuestion = Omit<
  IntCp001ApprovedLocalizedQuestion,
  | "releaseId"
  | "maturity"
  | "reviewStatus"
  | "localeReviewStatus"
  | "stem"
  | "validation"
> & {
  releaseId: ReturnType<typeof getIntCp001LocaleReleaseV2Id>;
  maturity: "MULTILINGUAL_EDITORIAL_PATCH_CANDIDATE";
  reviewStatus: "PENDING_MULTILINGUAL_REVIEW";
  localeReviewStatus: "PENDING_HUMAN_REVIEW";
  stem: string;
  validation: IntCp001ApprovedLocalizedQuestion["validation"];
  localeEditorialTrace: {
    patchId: typeof INT_CP001_CASH_FLOW_PATCH_ID;
    supersedesReleaseId: IntCp001ApprovedLocalizedQuestion["releaseId"];
    scenarioId: string;
    cashFlowDirection: IntCp001CashFlowDirection;
  };
};

export function generateIntCp001DirectionAwareLocalizedQuestion(
  qlId: IntCp001FinalQlId,
  seed: string,
  locale: IntCp001Locale,
): IntCp001DirectionAwareLocalizedQuestion {
  const approvedV1 = generateIntCp001ApprovedLocalizedQuestion(qlId, seed, locale);
  const sourceParameters = approvedV1.internalProvenance.sourceParameters;
  const cashFlow = getIntCp001CashFlowContextV2(sourceParameters);
  const contextAlignedStem = alignIntCp001ContextLeadV2(
    approvedV1.stem,
    sourceParameters,
    locale,
    cashFlow.scenarioId,
  );
  const interestAlignedStem = alignIntCp001StemCashFlow(
    contextAlignedStem,
    locale,
    cashFlow.direction,
  );
  const stem = alignIntCp001LoanAmountWordingV2(
    interestAlignedStem,
    approvedV1.solveContract,
    locale,
    cashFlow.direction,
  );
  const errors = [
    ...approvedV1.validation.errors,
    ...validateIntCp001ContextLeadV2(stem, locale, cashFlow),
    ...validateIntCp001StemCashFlow(stem, approvedV1.solveContract, locale, cashFlow.direction),
    ...validateIntCp001LoanAmountWordingV2(stem, approvedV1.solveContract, locale, cashFlow.direction),
  ];

  if (
    cashFlow.direction === "BORROWER_PAYS"
    && stem === approvedV1.stem
  ) {
    errors.push("Borrowing stem was not changed by the cash-flow patch.");
  }

  return {
    ...approvedV1,
    releaseId: getIntCp001LocaleReleaseV2Id(locale),
    maturity: "MULTILINGUAL_EDITORIAL_PATCH_CANDIDATE",
    reviewStatus: "PENDING_MULTILINGUAL_REVIEW",
    localeReviewStatus: "PENDING_HUMAN_REVIEW",
    stem,
    validation: {
      ...approvedV1.validation,
      ok: errors.length === 0,
      errors,
    },
    localeEditorialTrace: {
      patchId: INT_CP001_CASH_FLOW_PATCH_ID,
      supersedesReleaseId: approvedV1.releaseId,
      scenarioId: cashFlow.scenarioId,
      cashFlowDirection: cashFlow.direction,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function assertIntCp001DirectionAwareLocaleParity(
  english: IntCp001FinalEditorialV3Question,
  localized: IntCp001DirectionAwareLocalizedQuestion,
): void {
  assertIntCp001ApprovedLocaleParity(
    english,
    localized as unknown as IntCp001ApprovedLocalizedQuestion,
  );
}
