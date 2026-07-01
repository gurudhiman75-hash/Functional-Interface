import { extractPlaceholders, getQuestionEntry, renderTemplate, validatePct007Libraries } from "./library";
import type { Pct007QuestionPackage, Pct007ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

function getNumericVariables(pkg: Pct007QuestionPackage) {
  return Object.entries(pkg.parameters.variables).filter(([, value]) => typeof value === "number") as Array<[string, number]>;
}

export function validatePct007QuestionPackage(pkg: Pct007QuestionPackage): Pct007ValidationResult {
  const { parameters } = pkg;
  const checks = [
    check("archetype", parameters.archetypeId === pkg.archetypeId, "Archetype ID must match."),
    check("cp", parameters.canonicalProblemId === pkg.canonicalProblemId, "Canonical problem ID must match."),
    check("difficulty", parameters.difficultyBand === pkg.difficultyBand, "Difficulty must match the package."),
    check("answer", typeof pkg.answer === "string" && pkg.answer.length > 0, "Answer must be non-empty."),
    check("stem", typeof pkg.stem === "string" && pkg.stem.length > 0, "Stem must be non-empty."),
    check("explanation", pkg.explanation.lines.length >= 4, "Explanation must contain statement and math pairs."),
    check(
      "explanation-pairs",
      pkg.explanation.lines.every((line, index) => index % 2 === 0 || line.includes("\\Rightarrow")),
      "Every explanatory statement must be followed by a MathJax consequence.",
    ),
  ];

  for (const variable of parameters.requiredVariables) {
    checks.push(
      check(`required:${variable}`, Object.hasOwn(parameters.variables, variable), `Missing required variable ${variable}.`),
    );
  }

  for (const [key, value] of getNumericVariables(pkg)) {
    checks.push(check(`finite:${key}`, Number.isFinite(value), `${key} must be finite.`));
  }

  const template = getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, parameters.language).template;
  const placeholders = extractPlaceholders(template);

  checks.push(
    check(
      "placeholders",
      placeholders.every((placeholder) => Object.hasOwn(parameters.variables, placeholder)),
      "All placeholders used in the template must be supplied by the generator.",
    ),
  );

  const renderedStem = renderTemplate(template, parameters.variables);
  checks.push(check("render", !renderedStem.includes("{"), "Rendered stem must not contain unresolved placeholders."));
  checks.push(check("rendered-stem", !renderedStem.includes("undefined") && !renderedStem.includes("NaN"), "Rendered stem must be clean."));
  checks.push(check("rendered-answer", !pkg.answer.includes("undefined") && !pkg.answer.includes("NaN"), "Rendered answer must be clean."));

  if (pkg.solver.numericAnswer !== null) {
    checks.push(check("numeric-answer", Number.isFinite(pkg.solver.numericAnswer), "Numeric answer must be finite."));
  }

  const positiveKeys = [
    "baseValue",
    "value1",
    "value2",
    "totalValue",
    "totalMarks",
    "marksObtained",
    "totalVoters",
    "wrongValue",
    "correctValue",
    "baseValue1",
    "baseValue2",
  ];

  for (const key of positiveKeys) {
    const value = parameters.variables[key];
    if (typeof value === "number") {
      checks.push(check(`positive:${key}`, value > 0, `${key} must be positive.`));
    }
  }

  const rateKeys = [
    "percentageRate",
    "passRate",
    "turnoutRate",
    "invalidRate",
    "candidateRate",
    "componentRate",
    "waterRate",
    "dryWaterRate",
    "oldRate",
    "newRate",
    "discountRate",
    "commissionRate",
    "rate1",
    "rate2",
  ];

  for (const key of rateKeys) {
    const value = parameters.variables[key];
    if (typeof value === "number") {
      checks.push(check(`rate:${key}`, value > 0, `${key} must be greater than zero.`));
    }
  }

  if (typeof parameters.variables["invalidRate"] === "number") {
    checks.push(check("invalid-rate-bound", Number(parameters.variables["invalidRate"]) < 100, "Invalid vote rate must be below 100."));
  }

  if (typeof parameters.variables["componentRate"] === "number") {
    checks.push(check("component-rate-bound", Number(parameters.variables["componentRate"]) < 100, "Component rate must be below 100."));
  }

  if (typeof parameters.variables["waterRate"] === "number" && typeof parameters.variables["dryWaterRate"] === "number") {
    const waterRate = Number(parameters.variables["waterRate"]);
    const dryWaterRate = Number(parameters.variables["dryWaterRate"]);
    checks.push(check("drying-rate-order", dryWaterRate < waterRate, "Dry water rate must be below fresh water rate."));
  }

  if (typeof parameters.variables["oldRate"] === "number" && typeof parameters.variables["newRate"] === "number") {
    const oldRate = Number(parameters.variables["oldRate"]);
    const newRate = Number(parameters.variables["newRate"]);
    checks.push(check("evaporation-rate-order", newRate > oldRate, "Final concentration must be above initial concentration."));
  }

  if (parameters.solveMode === "findTotalFromFailMargin") {
    const percentageRate = Number(parameters.variables["percentageRate"] ?? 0);
    const passRate = Number(parameters.variables["passRate"] ?? 0);
    checks.push(check("fail-margin-order", passRate > percentageRate, "Pass rate must exceed score rate in fail-margin questions."));
  }

  if (parameters.solveMode === "findTotalFromPassMargin") {
    const percentageRate = Number(parameters.variables["percentageRate"] ?? 0);
    const passRate = Number(parameters.variables["passRate"] ?? 0);
    checks.push(check("pass-margin-order", percentageRate > passRate, "Score rate must exceed pass rate in pass-margin questions."));
  }

  if (parameters.solveMode === "findCorrectValueFromUnderstatement") {
    const percentageRate = Number(parameters.variables["percentageRate"] ?? 0);
    checks.push(check("understatement-bound", percentageRate < 100, "Understatement rate must be below 100."));
  }

  if (parameters.taskKind === "replacementRepeatedPercentageApplication") {
    const rate1 = Number(parameters.variables["rate1"] ?? 0);
    const rate2 = Number(parameters.variables["rate2"] ?? 0);
    checks.push(check("replacement-rate1", !Number.isNaN(rate1) ? rate1 < 100 || rate1 === 0 : true, "First reduction rate must stay below 100."));
    checks.push(check("replacement-rate2", !Number.isNaN(rate2) ? rate2 < 100 || rate2 === 0 : true, "Second reduction rate must stay below 100."));
  }

  const libraryValidation = validatePct007Libraries();
  checks.push(check("library", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries are valid."));

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}
