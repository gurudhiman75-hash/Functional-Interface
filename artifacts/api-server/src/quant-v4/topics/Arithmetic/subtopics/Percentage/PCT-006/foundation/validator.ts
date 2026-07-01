import { extractPlaceholders, getQuestionEntry, renderTemplate, validatePct006Libraries } from "./library";
import type { Pct006QuestionPackage, Pct006ValidationResult } from "./types";

function check(name: string, passed: boolean, message: string) {
  return { name, passed, message };
}

export function validatePct006QuestionPackage(pkg: Pct006QuestionPackage): Pct006ValidationResult {
  const { parameters } = pkg;
  const checks = [
    check("archetype", parameters.archetypeId === pkg.archetypeId, "Archetype ID must match."),
    check("cp", parameters.canonicalProblemId === pkg.canonicalProblemId, "Canonical problem ID must match."),
    check("difficulty", parameters.difficultyBand === pkg.difficultyBand, "Difficulty must match the package."),
    check("answer", typeof pkg.answer === "string" && pkg.answer.length > 0, "Answer must be non-empty."),
    check("stem", typeof pkg.stem === "string" && pkg.stem.length > 0, "Stem must be non-empty."),
    check("explanation", pkg.explanation.lines.length >= 4, "Explanation must have multiple pedagogical lines."),
  ];

  for (const variable of parameters.requiredVariables) {
    checks.push(
      check(
        `required:${variable}`,
        Object.hasOwn(parameters.variables, variable),
        `Missing required variable ${variable}.`,
      ),
    );
  }

  for (const [key, value] of Object.entries(parameters.variables)) {
    if (typeof value === "number") {
      checks.push(check(`finite:${key}`, Number.isFinite(value), `${key} must be finite.`));
    }
  }

  if (parameters.taskKind === "directLessThanComparison") {
    const rate = Number(parameters.variables["percentageRate"] ?? 0);
    checks.push(check("less-rate", rate > 0 && rate < 100, "Less-than rate must be between 0 and 100."));
  }

  if (parameters.taskKind === "percentagePointsVsPercentageChange") {
    const oldRate = Number(parameters.variables["oldRate"] ?? 0);
    checks.push(check("oldRate", oldRate > 0, "Old rate must be greater than zero."));
  }

  if (parameters.taskKind === "ratioBasedPercentageComparison") {
    const ratioA = Number(parameters.variables["ratioA"] ?? 0);
    const ratioB = Number(parameters.variables["ratioB"] ?? 0);
    checks.push(check("ratioA", ratioA > 0, "ratioA must be positive."));
    checks.push(check("ratioB", ratioB > 0, "ratioB must be positive."));
  }

  if (["compareAfterDifferentPercentageChanges", "chainPercentageComparison", "crossBasePercentageComparison"].includes(parameters.taskKind)) {
    checks.push(check("comparison-answer", !pkg.answer.includes("undefined"), "Comparison answer must resolve labels."));
  }

  const template = getQuestionEntry(parameters.canonicalProblemId, parameters.questionLanguageId, parameters.language).template;
  const placeholders = extractPlaceholders(template);
  checks.push(
    check(
      "placeholders",
      placeholders.every((placeholder) => Object.hasOwn(parameters.variables, placeholder)),
      "All placeholders must be supplied by the parameter generator.",
    ),
  );

  const rendered = renderTemplate(template, parameters.variables);
  checks.push(check("render", !rendered.includes("{"), "Rendered stem must not contain unresolved placeholders."));
  checks.push(check("no-nan", !pkg.answer.includes("NaN") && !pkg.stem.includes("NaN"), "Stem and answer must not contain NaN."));

  const libraryValidation = validatePct006Libraries();
  checks.push(check("library", libraryValidation.valid, libraryValidation.failures.join("; ") || "Libraries are valid."));

  return {
    valid: checks.every((item) => item.passed),
    checks,
  };
}
