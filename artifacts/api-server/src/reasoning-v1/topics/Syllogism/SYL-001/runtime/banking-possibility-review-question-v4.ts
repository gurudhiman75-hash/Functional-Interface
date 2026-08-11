import type { SylLocale } from "../foundation/types";
import { renderBankingFourTermPremiseVennV4 } from "./banking-possibility-four-term-venn-v4";
import {
  generateBankingPossibilityReviewQuestionV3,
  type BankingPossibilityReviewQuestionV3,
} from "./banking-possibility-review-question-v3";

export type BankingPossibilityCombinedDiagramV4 =
  | BankingPossibilityReviewQuestionV3["diagram"]
  | ReturnType<typeof renderBankingFourTermPremiseVennV4>;

export type BankingPossibilityReviewQuestionV4 = Omit<BankingPossibilityReviewQuestionV3, "diagram"> & {
  diagram: BankingPossibilityCombinedDiagramV4;
};

export function generateBankingPossibilityReviewQuestionV4(
  seed: number,
  locale: SylLocale,
): BankingPossibilityReviewQuestionV4 {
  const prior = generateBankingPossibilityReviewQuestionV3(seed, locale);
  if (prior.diagram.enabled) return prior;
  if (prior.scenarioId !== "SYL-SC-CORE-009") {
    throw new Error(
      `${seed}/${locale}: V4 may only replace the known CORE-009 four-term omission; got ${prior.scenarioId}.`,
    );
  }

  return {
    ...prior,
    diagram: renderBankingFourTermPremiseVennV4(prior),
  };
}
