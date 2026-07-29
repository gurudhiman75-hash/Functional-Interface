import type { IntCp001FinalQlId } from "./cp001-final-registry";
import type { IntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001ApprovedLocaleParity,
  generateIntCp001ApprovedLocalizedQuestion,
  type IntCp001ApprovedLocalizedQuestion,
} from "./cp001-localized-runtime-approved";
import {
  alignIntCp001StemCashFlow,
  getIntCp001CashFlowContext,
  validateIntCp001StemCashFlow,
  type IntCp001CashFlowDirection,
} from "./cp001-cash-flow-direction";
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
  const cashFlow = getIntCp001CashFlowContext(approvedV1.internalProvenance.sourceParameters);
  const stem = alignIntCp001StemCashFlow(approvedV1.stem, locale, cashFlow.direction);
  const errors = [
    ...approvedV1.validation.errors,
    ...validateIntCp001StemCashFlow(stem, approvedV1.solveContract, locale, cashFlow.direction),
  ];

  if (
    cashFlow.direction === "BORROWER_PAYS"
    && /FIND_(?:SIMPLE_INTEREST|PRINCIPAL_FROM_INTEREST|RATE_FROM_INTEREST|TIME_FROM_INTEREST|INTEREST_FOR_TARGET_DURATION|TIME_FROM_INTEREST_RATIO|RATE_FROM_INTEREST_RATIO|ANNUAL_INTEREST_FROM_TWO_AMOUNTS|INTEREST_RATIO_FROM_RATE_TIME|LATER_TIME_FROM_TWO_AMOUNT_RATIO)/u.test(approvedV1.solveContract)
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
