import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityShellV1,
  type BankingPossibilityShellQuestionV1,
} from "./banking-possibility-shell-v1";
import {
  renderBankingPossibilityCombinedDiagramV3,
  type BankingPossibilityCombinedDiagramV3,
} from "./banking-possibility-combined-diagram-v3";

export type BankingPossibilityReviewQuestionV3 = BankingPossibilityShellQuestionV1 & {
  diagram: BankingPossibilityCombinedDiagramV3;
};

export function generateBankingPossibilityReviewQuestionV3(
  seed: number,
  locale: SylLocale,
): BankingPossibilityReviewQuestionV3 {
  const question = generateBankingPossibilityShellV1(seed, locale);
  return {
    ...question,
    diagram: renderBankingPossibilityCombinedDiagramV3(question),
  };
}
