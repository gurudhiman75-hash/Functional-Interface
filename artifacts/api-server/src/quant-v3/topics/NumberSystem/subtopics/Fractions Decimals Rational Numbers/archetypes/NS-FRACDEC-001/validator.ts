import { NS_FRACDEC_001_MATHJAX_KEYS } from "./math";
import type { NsFracdec001QuestionPackage, NsFracdec001ValidationResult } from "./types";

export function validateNsFracdec001QuestionPackage(pkg: NsFracdec001QuestionPackage): NsFracdec001ValidationResult {
  const checks = [
    { name: "answer present", passed: pkg.answer.length > 0, message: "Answer must be non-empty." },
    { name: "solver verification", passed: pkg.solver.verification.inputValid && pkg.solver.verification.answerRecomputed, message: "Solver verification must pass." },
    { name: "stem rendered", passed: !pkg.stem.includes("{"), message: "Stem must not contain unresolved placeholders." },
    { name: "explanation rendered", passed: !pkg.explanation.lines.join("\n").includes("{answer}"), message: "Explanation must not contain unresolved answer placeholder." },
    { name: "traceability", passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer, message: "Traceability must match package." },
    { name: "mathjax populated", passed: NS_FRACDEC_001_MATHJAX_KEYS.some((key) => pkg[key].length > 0), message: "At least one applicable MathJax field must be populated." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
