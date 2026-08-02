import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import type { GeneratedIneCp001ConclusionQuestion } from "./types";

export function validateIneCp001ConclusionQuestion(
  question: GeneratedIneCp001ConclusionQuestion,
): { valid: boolean; errors: readonly string[] } {
  const errors: string[] = [];
  if (question.options.length !== 4)
    errors.push("Exactly four options are required.");
  if (question.options.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Exactly one option must be marked correct.");
  }
  if (question.options[question.correctIndex]?.isCorrect !== true) {
    errors.push("correctIndex must identify the correct option.");
  }
  if (new Set(question.options.map((option) => option.value)).size !== 4) {
    errors.push("Conclusion options must be unique.");
  }
  for (const option of question.options) {
    if (!option.conclusion) continue;
    const evaluation = evaluateConclusion(
      question.structuredStatements,
      option.conclusion,
    );
    if (evaluation.truth !== option.truth)
      errors.push(`Stored truth mismatch for ${option.value}.`);
    const agreement = verifySolverAgreement(
      question.structuredStatements,
      option.conclusion.leftId,
      option.conclusion.rightId,
    );
    if (!agreement.agreed)
      errors.push(`Solver disagreement for ${option.value}.`);
  }
  return { valid: errors.length === 0, errors };
}
