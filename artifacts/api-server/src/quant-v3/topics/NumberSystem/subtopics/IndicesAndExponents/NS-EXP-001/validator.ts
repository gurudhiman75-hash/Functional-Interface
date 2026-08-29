import { hasApplicableMathJax } from "./math";
import type { NsExp001QuestionPackage, NsExp001ValidationResult } from "./types";

const UNRESOLVED_TOKEN = /\b(base|firstExponent|secondExponent|thirdExponent|targetExponent|visibleBase1|visibleBase2|visibleBase3|negativeExponent|rootDegree|fractionalExponentNumerator|fractionalExponentDenominator|knownValue|increment|decrement|multiplier|coefficient|constant|divisor|shift)\b/;

export function validateNsExp001QuestionPackage(pkg: NsExp001QuestionPackage): NsExp001ValidationResult {
  const checks = [
    { name: "answer present", passed: pkg.answer.length > 0, message: "Answer must be non-empty." },
    {
      name: "solver recomputed answer",
      passed: pkg.solver.verification.inputValid && pkg.solver.verification.answerRecomputed,
      message: "Solver must recompute the answer from structured variables.",
    },
    {
      name: "independent mathematical verification",
      passed: pkg.solver.verification.independentlyVerified && pkg.answer === pkg.solver.verification.referenceAnswer,
      message: `Runtime answer must equal independent reference answer. runtime=${pkg.answer}; reference=${pkg.solver.verification.referenceAnswer}`,
    },
    { name: "stem rendered", passed: pkg.stem.length > 0, message: "Stem must be rendered." },
    {
      name: "stem has no unresolved variables",
      passed: !UNRESOLVED_TOKEN.test(pkg.stem),
      message: "Rendered stem must not expose template-variable tokens.",
    },
    {
      name: "structured state present",
      passed: Object.keys(pkg.parameters.variables).length > 0 && pkg.parameters.stemTemplate.length > 0,
      message: "Question must retain structured variables and the source stem template.",
    },
    {
      name: "traceability",
      passed: pkg.traceability.questionId === pkg.questionId && pkg.traceability.answer === pkg.answer,
      message: "Traceability must match package.",
    },
    { name: "mathjax populated", passed: hasApplicableMathJax(pkg), message: "Applicable MathJax field must be populated." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
