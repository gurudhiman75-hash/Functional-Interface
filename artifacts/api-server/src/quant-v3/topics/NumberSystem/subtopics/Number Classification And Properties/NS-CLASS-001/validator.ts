import { hasValidPropertyWorking } from "./math";
import type { NsClass001QuestionPackage, NsClass001ValidationResult } from "./types";

export function validateNsClass001QuestionPackage(pkg: NsClass001QuestionPackage): NsClass001ValidationResult {
  const checks = [
    { name: "answer present", passed: pkg.answer.length > 0, message: "Answer must be non-empty." },
    { name: "independent property verification", passed: pkg.solver.verification.answerRecomputed, message: "Property result must verify independently." },
    { name: "stem rendered", passed: pkg.stem.length > 0, message: "Stem must be rendered." },
    { name: "explanation rendered", passed: !pkg.explanation.lines.join("\n").includes("{answer}"), message: "Explanation answer placeholder must be rendered." },
    { name: "traceability", passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer, message: "Traceability must match package." },
    { name: "mathjax populated", passed: hasValidPropertyWorking(pkg), message: "Property working MathJax must be populated." },
    { name: "missing answer validity", passed: pkg.canonicalProblemId !== "CP06" || pkg.solver.verification.uniqueWhenRequired, message: "Missing-number answer must be valid for the approved stem." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
