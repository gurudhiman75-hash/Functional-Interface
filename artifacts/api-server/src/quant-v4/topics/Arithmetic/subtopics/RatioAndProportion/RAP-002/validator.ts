import type { Rap002QuestionPackage, Rap002ValidationResult } from "./types";

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
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
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
