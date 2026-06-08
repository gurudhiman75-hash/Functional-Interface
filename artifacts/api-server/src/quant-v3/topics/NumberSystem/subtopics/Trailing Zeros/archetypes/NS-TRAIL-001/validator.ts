import { NS_TRAIL_001_MATHJAX_KEYS } from "./math";
import { validateNsTrail001Libraries } from "./library";
import type { NsTrail001QuestionPackage, NsTrail001ValidationResult } from "./types";

export function validateNsTrail001QuestionPackage(questionPackage: NsTrail001QuestionPackage): NsTrail001ValidationResult {
  const libraryValidation = validateNsTrail001Libraries();
  const explanationText = questionPackage.explanation.lines.join("\n");
  const checks = [
    {
      name: "library-validation",
      passed: libraryValidation.valid,
      message: libraryValidation.valid ? "Approved libraries are valid." : libraryValidation.failures.join("; "),
    },
    {
      name: "stem-rendered",
      passed: !hasUnresolvedPlaceholder(questionPackage.stem),
      message: "Question stem must not contain unresolved placeholders.",
    },
    {
      name: "explanation-rendered",
      passed: !hasUnresolvedPlaceholder(explanationText),
      message: "Explanation must not contain unresolved placeholders.",
    },
    {
      name: "solver-verification",
      passed: Object.values(questionPackage.solver.verification).every(Boolean),
      message: "Solver verification flags must all pass.",
    },
    {
      name: "traceability",
      passed:
        questionPackage.traceability.questionId === questionPackage.questionId &&
        questionPackage.traceability.questionLanguageId === questionPackage.questionLanguageId &&
        questionPackage.traceability.explanationStyleId === questionPackage.explanationStyleId &&
        questionPackage.traceability.answer === questionPackage.answer &&
        questionPackage.traceability.graphId === questionPackage.reasoningGraph.graphId,
      message: "Traceability fields must match the rendered package.",
    },
    {
      name: "mathjax-presence",
      passed: NS_TRAIL_001_MATHJAX_KEYS.every((key) => questionPackage[key].length > 0),
      message: "Every required MathJax object must be present.",
    },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{[A-Za-z]+(?:[A-Za-z0-9]+)?\}/.test(text);
}
