import { NS_LASTDIG_001_MATHJAX_KEYS } from "./math";
import { validateNsLastdig001Libraries } from "./library";
import type { NsLastdig001QuestionPackage, NsLastdig001ValidationResult } from "./types";

export function validateNsLastdig001QuestionPackage(pkg: NsLastdig001QuestionPackage): NsLastdig001ValidationResult {
  const library = validateNsLastdig001Libraries();
  const explanationText = pkg.explanation.lines.join("\n");
  const checks = [
    { name: "libraries", passed: library.valid, message: library.valid ? "Libraries valid." : library.failures.join("; ") },
    { name: "stem-rendered", passed: !hasUnresolvedPlaceholder(pkg.stem), message: "Stem has no unresolved placeholders." },
    { name: "explanation-rendered", passed: !hasUnresolvedPlaceholder(explanationText), message: "Explanation has no unresolved placeholders." },
    { name: "solver", passed: Object.values(pkg.solver.verification).every(Boolean), message: "Solver verification passes." },
    { name: "traceability", passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer && pkg.traceability.graphId === pkg.reasoningGraph.graphId, message: "Traceability matches package." },
    { name: "mathjax", passed: NS_LASTDIG_001_MATHJAX_KEYS.every((key) => pkg[key].length > 0), message: "MathJax placeholders populated." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{(?:answer|base|exponent|powerProduct|towerExpression|targetLastDigit|options|cycleLatex|cyclePositionLatex|effectiveExponentLatex|productLastDigitLatex|towerReductionLatex)\}/.test(text);
}
