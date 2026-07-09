import type { Rap003QuestionPackage, Rap003ValidationResult } from "./types";

function hasUnresolvedPlaceholder(text: string) {
  const withoutLatexCommandArgs = text.replace(/\\[A-Za-z]+\{[^}]*\}/g, "");
  return /\{[A-Za-z][A-Za-z0-9_]*\}/.test(withoutLatexCommandArgs);
}

function visibleText(pkg: Rap003QuestionPackage) {
  return [
    pkg.stem,
    pkg.answer,
    pkg.explanation.lines.join("\n"),
    JSON.stringify(pkg.solver.workingValues),
  ].join("\n");
}

function hasInternalLeakage(text: string) {
  return /\b(undefined|null|NaN|Infinity)\b|\[object Object\]|\b(taskKind|canonicalProblemId|questionLanguageId)\b/i.test(text);
}

function numericVariableValues(pkg: Rap003QuestionPackage) {
  return Object.values(pkg.parameters.variables)
    .filter((value): value is number => typeof value === "number");
}

function isIntegerLike(value: unknown) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && Number.isInteger(numeric);
}

function ageValues(pkg: Rap003QuestionPackage) {
  const working = pkg.solver.workingValues;
  const presentA =
    working.presentAgeA !== undefined
      ? Number(working.presentAgeA)
      : pkg.parameters.variables.presentAgeA !== undefined
        ? Number(pkg.parameters.variables.presentAgeA)
        : undefined;
  const presentB =
    working.presentAgeB !== undefined
      ? Number(working.presentAgeB)
      : pkg.parameters.variables.presentAgeB !== undefined
        ? Number(pkg.parameters.variables.presentAgeB)
        : undefined;
  return { presentA, presentB };
}

function hasUnrealisticAgeScenario(pkg: Rap003QuestionPackage) {
  if (!pkg.parameters.taskKind.startsWith("age")) return false;

  const { presentA, presentB } = ageValues(pkg);
  if (presentA === undefined || presentB === undefined) return true;
  if (![presentA, presentB].every((value) => Number.isInteger(value) && value > 0)) return true;

  const personA = String(pkg.parameters.variables.personA ?? "").toLowerCase();
  const personB = String(pkg.parameters.variables.personB ?? "").toLowerCase();
  const isParentChild =
    /\b(father|mother|parent|teacher)\b/.test(personA) ||
    /\b(son|daughter|student)\b/.test(personB);
  if (presentA > 95 || presentB > 95) return true;
  if (isParentChild) {
    if (presentA < 30) return true;
    if (presentB < 1 || presentB > 25) return true;
    if (presentA - presentB < 18) return true;
  }

  if (pkg.parameters.taskKind === "agePresentFromPastRatio") {
    const shift = Number(pkg.parameters.variables.shiftYears);
    if (Number.isFinite(shift) && (presentA - shift <= 0 || presentB - shift <= 0)) {
      return true;
    }
  }

  return false;
}

function hasPopulationGrammarIssue(text: string) {
  return /\b(literate|illiterate)\s+(male|female)\b/i.test(text);
}

function hasInvalidRatio(value: unknown) {
  return !/^\d+(?::\d+)+$/.test(String(value ?? ""));
}

export function validateRap003QuestionPackage(pkg: Rap003QuestionPackage): Rap003ValidationResult {
  const numericAnswer = Number(pkg.solver.answerValue);
  const finiteAnswer = pkg.solver.answerType === "RATIO"
    ? /^\d+(?::\d+)+$/.test(String(pkg.solver.answerValue))
    : Number.isFinite(numericAnswer) && numericAnswer > 0;
  const text = visibleText(pkg);
  const numericValues = numericVariableValues(pkg);
  const answerBody = pkg.answer.replace(/^\$\$\s*/, "").replace(/\s*\$\$$/, "").trim();
  const isCountAnswer = pkg.solver.answerType === "COUNT";
  const isAgeAnswer = pkg.solver.answerType === "AGE";
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
      message: "RAP-003 internal runtime supports en, hi, and pa; Question Studio exposes English only.",
    },
    {
      name: "positive-finite-answer",
      passed: finiteAnswer,
      message: "Numeric answers must be positive and finite; ratio answers must be valid ratio strings.",
    },
    {
      name: "no-internal-leakage",
      passed: !hasInternalLeakage(text),
      message: "Visible output must not contain undefined/null/NaN/Infinity or internal field names.",
    },
    {
      name: "positive-finite-numeric-variables",
      passed: numericValues.every((value) => Number.isFinite(value) && value > 0),
      message: "Numeric variables must be positive and finite.",
    },
    {
      name: "integer-count-answer",
      passed: !isCountAnswer || isIntegerLike(pkg.solver.answerValue),
      message: "COUNT answers must be whole numbers.",
    },
    {
      name: "integer-age-answer",
      passed: !isAgeAnswer || isIntegerLike(pkg.solver.answerValue),
      message: "AGE answers must be whole numbers.",
    },
    {
      name: "percentage-answer-format",
      passed: pkg.solver.answerType !== "PERCENT" || /%/.test(answerBody),
      message: "PERCENT answers must include a percent sign in the rendered answer.",
    },
    {
      name: "ratio-answer-format",
      passed: pkg.solver.answerType !== "RATIO" || !hasInvalidRatio(pkg.solver.answerValue),
      message: "RATIO answers must use a colon-separated positive integer ratio.",
    },
    {
      name: "realistic-age-scenario",
      passed: !hasUnrealisticAgeScenario(pkg),
      message: "Age scenarios must avoid unrealistic parent/child ages or invalid past ages.",
    },
    {
      name: "population-grammar",
      passed: !hasPopulationGrammarIssue(pkg.stem),
      message: "Population cell labels must use plural display labels such as literate males.",
    },
  ];

  return { valid: checks.every((check) => check.passed), checks };
}
