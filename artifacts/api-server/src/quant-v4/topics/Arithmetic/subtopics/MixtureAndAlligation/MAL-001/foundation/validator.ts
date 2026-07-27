import { verifyMalCp001ResultIndependently } from "./independent-verifier";
import { malCp001ResultKey, sameMalCp001Result } from "./cp001-options";
import type { MalCp001GeneratedPrototype, VerificationResult } from "./types";

function balancedMathJax(text: string): boolean {
  return (text.match(/\\\(/gu) ?? []).length === (text.match(/\\\)/gu) ?? []).length &&
    (text.match(/\\\[/gu) ?? []).length === (text.match(/\\\]/gu) ?? []).length;
}

export function validateMalCp001GeneratedPrototype(
  question: MalCp001GeneratedPrototype,
): VerificationResult {
  const errors: string[] = [];
  const independent = verifyMalCp001ResultIndependently(
    question.parameters.request,
    question.solution,
  );
  errors.push(...independent.errors);

  if (question.permanentQlId !== null) errors.push("Prototype must not have a permanent QL ID.");
  if (question.publiclyPublishable !== false) errors.push("Prototype must remain non-publishable.");
  if (question.questionStudioDiscoverable !== false) errors.push("Prototype must remain hidden from Question Studio.");
  if (!question.stem.trim().endsWith("?")) errors.push("Stem must end with a question mark.");
  if (/\{\{|\}\}|TODO|PLACEHOLDER|undefined|null/iu.test(question.stem)) {
    errors.push("Stem contains unresolved or internal placeholder text.");
  }
  if (question.options.length !== 4 || question.optionAudit.length !== 4) {
    errors.push("Prototype must contain exactly four options.");
  }
  if (new Set(question.options).size !== question.options.length) {
    errors.push("Options must be visibly unique.");
  }
  if (question.correctIndex < 0 || question.correctIndex >= question.options.length) {
    errors.push("Correct option index is outside the option array.");
  } else {
    const keyed = question.optionAudit[question.correctIndex];
    if (keyed.misconceptionId !== "CORRECT") errors.push("Correct index is not labelled CORRECT.");
    if (!sameMalCp001Result(keyed.result, question.solution)) {
      errors.push("Correct option result does not equal the canonical solution.");
    }
  }
  const resultKeys = question.optionAudit.map((option) => malCp001ResultKey(option.result));
  if (new Set(resultKeys).size !== resultKeys.length) {
    errors.push("Option semantics are not unique.");
  }
  const wrongCorrectCount = question.optionAudit.filter(
    (option, index) => index !== question.correctIndex && sameMalCp001Result(option.result, question.solution),
  ).length;
  if (wrongCorrectCount > 0) errors.push("At least one distractor equals the correct mathematical answer.");

  const explanationText = [
    question.explanation.formula,
    ...question.explanation.steps,
    question.explanation.verification,
  ].join("\n");
  if (!balancedMathJax(explanationText)) errors.push("Explanation contains unbalanced MathJax delimiters.");
  if (question.explanation.steps.length < 2) errors.push("Explanation is too short for executable discovery.");
  if (!question.explanation.verification.trim()) errors.push("Independent verification prose is missing.");
  if (!question.explanation.commonTrap.toLowerCase().includes("trap")) {
    errors.push("Common-trap explanation is missing.");
  }
  if (question.reasoningGraph.nodes.length < 4) errors.push("Reasoning graph is incomplete.");
  if (question.diagram?.type === "ALLIGATION_CROSS" && !question.diagram.ratioText.includes(":")) {
    errors.push("Alligation diagram does not expose a reduced ratio.");
  }

  return { ok: errors.length === 0, errors };
}
