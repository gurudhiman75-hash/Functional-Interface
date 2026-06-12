import { hasApplicableMathJax } from "./math";
import type { NsExp001QuestionPackage, NsExp001ValidationResult } from "./types";

export function validateNsExp001QuestionPackage(pkg: NsExp001QuestionPackage): NsExp001ValidationResult {
  const checks = [
    { name: "answer present", passed: pkg.answer.length > 0, message: "Answer must be non-empty." },
    { name: "solver verification", passed: pkg.solver.verification.inputValid && pkg.solver.verification.answerRecomputed, message: "Solver verification must pass." },
    { name: "stem rendered", passed: pkg.stem.length > 0, message: "Stem must be rendered." },
    { name: "traceability", passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer, message: "Traceability must match package." },
    { name: "mathjax populated", passed: hasApplicableMathJax(pkg), message: "Applicable MathJax field must be populated." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
