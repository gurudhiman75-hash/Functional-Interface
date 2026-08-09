import type { SylLocale } from "../foundation/types";
import { analyzeScenario } from "./analysis";
import {
  generateBankingPossibilityShellV1,
  type BankingPossibilityShellQuestionV1,
} from "./banking-possibility-shell-v1";
import {
  renderBankingPossibilityDiagramsV1,
  type BankingPossibilityDiagramV1,
} from "./banking-possibility-diagram-v1";
import { scenariosForGroup } from "./scenarios";
import { assignTerms } from "./term-assignment";

export type BankingPossibilityReviewQuestionV1 = BankingPossibilityShellQuestionV1 & {
  diagrams: readonly [BankingPossibilityDiagramV1, BankingPossibilityDiagramV1];
};

export function generateBankingPossibilityReviewQuestionV1(
  seed: number,
  locale: SylLocale,
): BankingPossibilityReviewQuestionV1 {
  const question = generateBankingPossibilityShellV1(seed, locale);
  const scenario = scenariosForGroup(question.scenarioGroup).find((entry) =>
    entry.scenarioId === question.scenarioId);
  if (!scenario) {
    throw new Error(`${question.scenarioId}: scenario missing while restoring diagrams.`);
  }

  const analysis = analyzeScenario(scenario);
  const assignment = assignTerms("SYL-QL-005", seed, analysis.termOrder);
  const conclusions = question.conclusions as readonly [
    typeof question.conclusions[number],
    typeof question.conclusions[number],
  ];
  const diagrams = renderBankingPossibilityDiagramsV1(
    seed,
    locale,
    analysis.premises,
    question.statements,
    conclusions,
    assignment,
  );

  return {
    ...question,
    diagrams,
  };
}
