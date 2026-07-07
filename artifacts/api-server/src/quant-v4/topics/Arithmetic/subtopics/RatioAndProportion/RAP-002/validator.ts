import type { Rap002QuestionPackage, Rap002ValidationResult } from "./types";

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

export function validateRap002QuestionPackage(pkg: Rap002QuestionPackage): Rap002ValidationResult {
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
      passed: pkg.language === "en",
      message: "RAP-002 MVP supports English only.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
