import { NS_DIGIT_001_MATHJAX_KEYS } from "./math";
import { validateNsDigit001Libraries } from "./library";
import type { NsDigit001QuestionPackage, NsDigit001ValidationResult } from "./types";

export function validateNsDigit001QuestionPackage(pkg: NsDigit001QuestionPackage): NsDigit001ValidationResult {
  const library = validateNsDigit001Libraries();
  const explanationText = pkg.explanation.lines.join("\n");
  const checks = [
    { name: "libraries", passed: library.valid, message: library.valid ? "Libraries valid." : library.failures.join("; ") },
    { name: "stem-rendered", passed: !hasUnresolvedPlaceholder(pkg.stem), message: "Stem has no unresolved placeholders." },
    { name: "explanation-rendered", passed: !hasUnresolvedPlaceholder(explanationText), message: "Explanation has no unresolved placeholders." },
    { name: "solver", passed: Object.values(pkg.solver.verification).every(Boolean), message: "Solver verification passes." },
    { name: "traceability", passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer && pkg.traceability.graphId === pkg.reasoningGraph.graphId, message: "Traceability matches package." },
    { name: "mathjax", passed: NS_DIGIT_001_MATHJAX_KEYS.every((key) => pkg[key].length > 0), message: "MathJax placeholders populated." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}

function hasUnresolvedPlaceholder(text: string) {
  return /\{(?:number|base|exponent|expression|digitCount|answer|digitCountFormulaLatex|logarithmExpansionLatex|productDigitFormulaLatex|nDigitNumberFormulaLatex|exponentDigitFormulaLatex)\}/.test(text);
}
