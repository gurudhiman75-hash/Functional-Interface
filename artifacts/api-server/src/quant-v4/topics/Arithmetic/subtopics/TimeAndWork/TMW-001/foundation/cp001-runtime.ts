import { getTmwCp001Entry } from "./cp001-registry";
import { buildTmwCp001Options } from "./cp001-options";
import { buildTmwCp001Parameters } from "./cp001-parameters";
import { buildTmwCp001CommonTrap, buildTmwCp001Shortcut, buildTmwCp001WorkingLatex } from "./cp001-learning";
import { renderTmwCp001Stem, tmwCp001Conclusion, tmwCp001ExplanationOpening } from "./cp001-presentation";
import { solveTmwCp001, verifyTmwCp001 } from "./cp001-solver";
import { compare, rational, rationalKey } from "./rational";
import { required } from "./cp001-helpers";
import { localizeTmwCp001Question } from "./localization-cp001";
import { polishTmwCp001LocalizedQuestion } from "./localization-cp001-editorial";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry, TmwCp001Solution, TmwGeneratedQuestion, TmwOption } from "./types";

function fingerprint(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): string {
  const values: Array<Rational | undefined> = [p.totalWork, p.rate, p.time, p.requestedFraction, p.partWork, p.partTime, p.secondaryRate, p.secondaryWork, p.sourceDuration, p.targetDuration, p.originalRate, p.changedRate, p.originalTime, p.changePercent];
  return `${entry.solveMode}|${values.map((value) => (value ? rationalKey(value) : "-")).join("|")}|${p.timeUnit}`;
}

function validate(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, solution: TmwCp001Solution, renderedStem: string, optionAudit: TmwOption[], correctIndex: number): string[] {
  const errors: string[] = [];
  if (!verifyTmwCp001(entry, p, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!renderedStem.trim()) errors.push("Stem is empty");
  if (renderedStem.includes("undefined") || renderedStem.includes("{")) errors.push("Stem contains an unresolved value");
  if (!solution.formulaLatex.trim()) errors.push("Formula is empty");
  if (solution.workedLatex.length === 0) errors.push("Worked solution is empty");
  if (compare(solution.answer, rational(0)) <= 0) errors.push("Answer must be positive");
  if (optionAudit.length !== 4) errors.push("Exactly four options are required");
  if (new Set(optionAudit.map((option) => option.text)).size !== 4) errors.push("Options are not unique");
  if (correctIndex < 0 || correctIndex >= optionAudit.length) errors.push("Correct answer is missing from options");
  if (optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) errors.push("Exactly one option must be marked correct");
  if (["findFractionCompletedInGivenTime", "findRemainingFractionAfterTime"].includes(entry.solveMode) && compare(solution.answer, rational(1)) > 0) errors.push("Fraction answer exceeds one");
  if (["findPercentCompletedInGivenTime", "findRemainingPercentAfterTime"].includes(entry.solveMode) && compare(solution.answer, rational(100)) > 0) errors.push("Percentage answer exceeds 100");
  if (entry.solveMode === "findDelayFromReducedUniformRate" && compare(required(p.changedRate, "changedRate"), required(p.originalRate, "originalRate")) >= 0) errors.push("Reduced-rate question does not reduce the rate");
  if (entry.solveMode === "findTimeSavedFromIncreasedUniformRate" && compare(required(p.changedRate, "changedRate"), required(p.originalRate, "originalRate")) <= 0) errors.push("Increased-rate question does not increase the rate");
  return errors;
}

function buildEnglishQuestion(input: { questionLanguageId: string; seed: string }): TmwGeneratedQuestion {
  const entry = getTmwCp001Entry(input.questionLanguageId);
  const parameters = buildTmwCp001Parameters(entry, input.seed);
  const solution = solveTmwCp001(entry, parameters);
  const renderedStem = renderTmwCp001Stem(entry, parameters);
  const optionSet = buildTmwCp001Options(entry, parameters, solution.answer, input.seed);
  const shortcut = buildTmwCp001Shortcut(entry, parameters, solution);
  const commonTrap = buildTmwCp001CommonTrap(entry, optionSet.optionAudit);
  const steps = buildTmwCp001WorkingLatex(entry, parameters, solution).map((line) => `\\(${line}\\)`);
  const errors = validate(entry, parameters, solution, renderedStem, optionSet.optionAudit, optionSet.correctIndex);
  if (steps.length < 3) errors.push("Explanation does not contain setup, working and verification steps");
  if (!shortcut.title.startsWith("10-Second ") || shortcut.steps.length < 1) errors.push("Explanation shortcut is incomplete");
  if (!optionSet.optionAudit.some((option) => option.text === commonTrap.optionText && option.misconceptionId === commonTrap.misconceptionId)) errors.push("Common trap is not linked to an actual distractor");
  if (/Do not choose|Don't choose/i.test(commonTrap.explanation)) errors.push("Common trap uses a negative command");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-001",
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: "en",
    seed: input.seed,
    stem: renderedStem,
    parameters,
    solution,
    options: optionSet.optionAudit.map((option) => option.text),
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    explanation: {
      opening: tmwCp001ExplanationOpening(entry),
      formula: `\\(${solution.formulaLatex}\\)`,
      steps,
      shortcut,
      commonTrap,
      conclusion: tmwCp001Conclusion(entry, parameters, solution),
    },
    mathematicalFingerprint: fingerprint(entry, parameters),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}

export function runTmwCp001Pipeline(input: { questionLanguageId: string; seed: string; language: TmwLocalizedLanguage }): TmwLocalizedQuestion;
export function runTmwCp001Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" }): TmwGeneratedQuestion;
export function runTmwCp001Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | TmwLocalizedLanguage }): TmwGeneratedQuestion | TmwLocalizedQuestion {
  const english = buildEnglishQuestion(input);
  if (!input.language || input.language === "en") return english;
  return polishTmwCp001LocalizedQuestion(localizeTmwCp001Question(english, input.language), input.language);
}
