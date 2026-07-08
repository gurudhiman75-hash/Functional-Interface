import type { Rap003QuestionPackage, Rap003ValidationResult } from "./types";

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

export function validateRap003QuestionPackage(pkg: Rap003QuestionPackage): Rap003ValidationResult {
  const numericAnswer = Number(pkg.solver.answerValue);
  const finiteAnswer = pkg.solver.answerType === "RATIO"
    ? /^\d+(?::\d+)+$/.test(String(pkg.solver.answerValue))
    : Number.isFinite(numericAnswer) && numericAnswer > 0;
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
      message: "RAP-003 supports en, hi, and pa.",
    },
    {
      name: "positive-finite-answer",
      passed: finiteAnswer,
      message: "Numeric answers must be positive and finite; ratio answers must be valid ratio strings.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
