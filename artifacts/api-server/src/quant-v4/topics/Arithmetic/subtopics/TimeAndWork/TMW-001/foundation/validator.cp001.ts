import type { TmwCp001QuestionPackage } from "../types";
import { isPositive } from "./rational";

export function validateTmwCp001QuestionPackage(
  question: Omit<TmwCp001QuestionPackage, "validation">,
): { valid: boolean; failures: string[] } {
  const failures: string[] = [];
  if (question.packageId !== "TMW-001") failures.push("Wrong package identity.");
  if (question.canonicalProblemId !== "TMW-CP-001") failures.push("Wrong CP ownership.");
  if (!/^TMW-001-QL-\d{3,}$/.test(question.qlId)) failures.push("Malformed QL identity.");
  if (!question.stem.trim().endsWith("?")) failures.push("Stem must end with a question mark.");
  if (/\{[A-Za-z0-9_]+\}/.test(question.stem)) failures.push("Rendered stem contains unresolved placeholders.");
  if (question.options.length !== 4) failures.push("Exactly four options are required.");
  if (new Set(question.options).size !== 4) failures.push("Options must be unique after rendering.");
  if (question.correctIndex < 0 || question.correctIndex > 3) failures.push("Correct option index is out of range.");
  if (question.options[question.correctIndex] !== question.correctAnswer) failures.push("Correct option index does not point to the canonical answer.");
  if (question.options.filter((option) => option === question.correctAnswer).length !== 1) failures.push("The canonical answer must occur exactly once.");
  if (question.correctAnswer !== question.solver.answer) failures.push("Pipeline and solver answers differ.");
  if (!isPositive(question.solver.exactAnswer)) failures.push("CP-001 answer must be positive.");
  if (!question.independentVerification.valid) failures.push("Independent verification failed.");
  if (!question.explanation.contextualOpening.trim()) failures.push("Explanation opening is missing.");
  if (!question.explanation.keyRule.latex.trim()) failures.push("Governing formula is missing from the explanation.");
  if (question.explanation.steps.length === 0) failures.push("Explanation has no meaningful worked steps.");
  if (!question.explanation.conclusion.answerLatex.includes("\\boxed")) failures.push("Explanation conclusion must visibly box the answer.");
  if (question.publiclyPublishable !== false) failures.push("Runtime candidate must remain non-publishable.");
  if (question.lifecycle.generationSurface !== "QUESTION_STUDIO") failures.push("Candidate must originate in Question Studio.");
  if (question.lifecycle.reviewStatus !== "UNREVIEWED") failures.push("New candidate must begin unreviewed.");
  if (question.lifecycle.questionBankStatus !== "NOT_STORED") failures.push("Unapproved candidate cannot be stored in the Question Bank.");
  if (question.lifecycle.testEligibility !== "INELIGIBLE") failures.push("Unapproved candidate cannot be test-eligible.");
  if (question.traceability.distractorStrategyIds.length !== 3) failures.push("Three distractor labels are required.");
  if (question.traceability.optionErrorLabels.length !== 4) failures.push("Every rendered option needs an aligned error-label slot.");
  if (question.traceability.optionErrorLabels[question.correctIndex] !== null) failures.push("The correct option must have no misconception label.");
  for (let index = 0; index < question.traceability.optionErrorLabels.length; index += 1) {
    const label = question.traceability.optionErrorLabels[index];
    if (index !== question.correctIndex && (!label || !question.traceability.distractorStrategyIds.includes(label))) failures.push(`Option ${index + 1} has an undeclared or missing misconception label.`);
  }
  if (!question.traceability.fingerprint.trim()) failures.push("Mathematical fingerprint is missing.");
  return { valid: failures.length === 0, failures };
}
