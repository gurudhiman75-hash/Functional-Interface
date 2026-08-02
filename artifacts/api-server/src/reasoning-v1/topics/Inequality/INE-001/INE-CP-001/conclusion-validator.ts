import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { normalizeConstraintDirection } from "../foundation/relations";
import type { ComparisonConstraint } from "../foundation/types";
import { verifySolverAgreement } from "../foundation/solver-agreement";
import type { GeneratedIneCp001ConclusionQuestion } from "./types";

function canonicalConclusionKey(conclusion: ComparisonConstraint): string {
  if (conclusion.relation === "EQUAL_TO") {
    const [leftId, rightId] = [conclusion.leftId, conclusion.rightId].sort();
    return `${leftId}|EQUAL_TO|${rightId}`;
  }
  const normalized = normalizeConstraintDirection(conclusion);
  return `${normalized.leftId}|${normalized.relation}|${normalized.rightId}`;
}

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
  const conclusionOptions = question.options.filter(
    (option) => option.conclusion,
  );
  if (
    conclusionOptions.length > 0 &&
    new Set(
      conclusionOptions.map((option) =>
        canonicalConclusionKey(option.conclusion!),
      ),
    ).size !== conclusionOptions.length
  ) {
    errors.push(
      "Conclusion options must not repeat an equivalent relation in reversed form.",
    );
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

  const expectedCorrect = question.options.filter((option) => {
    if (question.authorityId === "SELECT_VALID_CONCLUSION") {
      return option.truth === "DEFINITELY_TRUE";
    }
    if (question.authorityId === "SELECT_INVALID_CONCLUSION") {
      return option.truth !== "DEFINITELY_TRUE";
    }
    return option.truth === question.metadata.conclusionTruths[0];
  });
  if (expectedCorrect.length !== 1 || !expectedCorrect[0]!.isCorrect) {
    errors.push(
      "The marked option does not match the question's answer contract.",
    );
  }
  return { valid: errors.length === 0, errors };
}
