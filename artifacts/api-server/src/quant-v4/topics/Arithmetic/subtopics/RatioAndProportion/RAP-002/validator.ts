import type { Rap002QuestionPackage, Rap002ValidationResult } from "./types";

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

function hasReducibleClaimedRatio(pkg: Rap002QuestionPackage) {
  if (pkg.questionLanguageId !== "RAP-QL-217" || !/\bsimplified\b/i.test(pkg.stem)) return false;
  const left = Number(pkg.parameters.variables.endpointA);
  const right = Number(pkg.parameters.variables.endpointC);
  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
  return gcd(left, right) > 1;
}

function hasHiddenConditionalTarget(pkg: Rap002QuestionPackage) {
  if (pkg.questionLanguageId !== "RAP-QL-512") return false;
  const values = pkg.parameters.variables;
  return !pkg.stem.includes(String(values.personA)) || !pkg.stem.includes(String(values.personC));
}

export function validateRap002QuestionPackage(pkg: Rap002QuestionPackage): Rap002ValidationResult {
  const numericVariables = Object.entries(pkg.parameters.variables).filter(([, value]) => typeof value === "number") as [string, number][];
  const numericAnswer = Number(pkg.solver.answerValue);
  const checks = [
    {
      name: "stem-present",
      passed: pkg.stem.trim().length > 0,
      message: "Stem must be present.",
    },
    {
      name: "answer-present",
      passed: pkg.answer.trim().length > 0,
      message: "Answer must be present.",
    },
    {
      name: "no-unresolved-placeholders",
      passed: !hasUnresolvedPlaceholder(pkg.stem) && !pkg.explanation.lines.some(hasUnresolvedPlaceholder),
      message: "Stem and explanation must not contain unresolved placeholders.",
    },
    {
      name: "required-variables-present",
      passed: pkg.parameters.requiredVariables.every((key) => pkg.parameters.variables[key] !== undefined),
      message: "All required variables must be present.",
    },
    {
      name: "language-supported",
      passed: pkg.language === "en" || pkg.language === "hi" || pkg.language === "pa",
      message: "RAP-002 supports en, hi, and pa.",
    },
    {
      name: "finite-nonnegative-variables",
      passed: numericVariables.every(([, value]) => Number.isFinite(value) && value >= 0),
      message: "Numeric variables must be finite and non-negative.",
    },
    {
      name: "nonzero-denominators",
      passed: numericVariables.every(([key, value]) => !/denominator/i.test(key) || value !== 0),
      message: "Denominators must be non-zero.",
    },
    {
      name: "integer-count-answer",
      passed: pkg.parameters.answerType !== "COUNT" || (Number.isFinite(numericAnswer) && Number.isInteger(numericAnswer) && numericAnswer >= 0),
      message: "COUNT answers must be non-negative whole numbers.",
    },
    {
      name: "ratio-answer-format",
      passed: pkg.parameters.answerType !== "RATIO" || /^\d+(?::\d+)+$/.test(String(pkg.solver.answerValue)),
      message: "RATIO answers must contain positive integer parts.",
    },
    {
      name: "claimed-simplified-ratio",
      passed: !hasReducibleClaimedRatio(pkg),
      message: "A ratio described as simplified must be in lowest terms.",
    },
    {
      name: "explicit-conditional-target",
      passed: !hasHiddenConditionalTarget(pkg),
      message: "Conditional partition stems must state the selected branch and requested subshare.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
