import { getTmwCp004Entry } from "./cp004-registry";
import { buildTmwCp004Options } from "./cp004-options";
import { buildTmwCp004Parameters } from "./cp004-parameters";
import {
  buildTmwCp004CommonTrap,
  buildTmwCp004Shortcut,
  buildTmwCp004WorkingLatex,
} from "./cp004-learning";
import {
  renderTmwCp004Stem,
  tmwCp004Conclusion,
  tmwCp004ExplanationOpening,
} from "./cp004-presentation";
import { solveTmwCp004, verifyTmwCp004 } from "./cp004-solver";
import { rationalKey } from "./rational";
import { localizeTmwCp004Question } from "./localization-cp004";
import type { Rational } from "./types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import type { TmwCp004GeneratedQuestion, TmwCp004Parameters } from "./cp004-types";

function key(value: Rational | undefined): string {
  return value ? rationalKey(value) : "-";
}

function fingerprint(p: TmwCp004Parameters, mode: string): string {
  return [
    mode,
    key(p.timeA), key(p.timeB), key(p.timeC),
    key(p.rateA), key(p.rateB), key(p.rateC),
    key(p.durationA), key(p.durationB), key(p.durationC),
    key(p.totalCompletionTime), key(p.idleDuration),
    key(p.targetFraction), key(p.deadline),
    key(p.originalDailyHours), key(p.changedDailyHours),
    key(p.efficiencyMultiplier), key(p.perWorkerTime),
    p.initialWorkerCount ?? "-", p.changedWorkerCount ?? "-", p.timeUnit,
  ].join("|");
}

function inlineMath(latex: string): string {
  return `\\(${latex}\\)`;
}

function balancedInlineMath(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

function outsideInlineMath(value: string): string {
  return value.replace(/\\\([\s\S]*?\\\)/g, "");
}

function buildEnglishQuestion(input: { questionLanguageId: string; seed: string }): TmwCp004GeneratedQuestion {
  const entry = getTmwCp004Entry(input.questionLanguageId);
  const parameters = buildTmwCp004Parameters(entry, input.seed);
  const solution = solveTmwCp004(entry, parameters);
  const optionSet = buildTmwCp004Options(entry, parameters, solution, input.seed);
  const stem = renderTmwCp004Stem(entry, parameters);
  const formula = inlineMath(solution.formulaLatex);
  const steps = buildTmwCp004WorkingLatex(entry, parameters, solution).map(inlineMath);
  const shortcut = buildTmwCp004Shortcut(entry, parameters, solution);
  const commonTrap = buildTmwCp004CommonTrap(entry, optionSet.options);
  const explanation = {
    opening: tmwCp004ExplanationOpening(entry),
    formula,
    steps,
    shortcut,
    commonTrap,
    conclusion: tmwCp004Conclusion(entry, parameters, solution.answerText),
  };
  const errors: string[] = [];
  const learnerText = [
    stem,
    ...optionSet.options.map((option) => option.text),
    solution.answerText,
    explanation.opening,
    explanation.formula,
    ...explanation.steps,
    explanation.shortcut.title,
    ...explanation.shortcut.steps,
    explanation.commonTrap.optionLabel,
    explanation.commonTrap.optionText,
    explanation.commonTrap.explanation,
    explanation.conclusion,
  ].join(" ");

  if (!verifyTmwCp004(entry, parameters, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!stem.trim()) errors.push("Stem is empty");
  if (/\{\{[^}]+\}\}|\$\{[^}]+\}|undefined|null|NaN|Infinity/.test(learnerText)) errors.push("Learner text contains an unresolved value");
  if (optionSet.options.length !== 4) errors.push("Question does not contain exactly four options");
  if (new Set(optionSet.options.map((option) => option.text)).size !== 4) errors.push("Options are not textually unique");
  if (optionSet.correctIndex < 0 || optionSet.correctIndex > 3) errors.push("Correct answer is missing from options");
  if (optionSet.options.filter((option) => option.misconceptionId === "CORRECT").length !== 1) errors.push("Option contract does not contain exactly one correct answer");
  if (optionSet.options[optionSet.correctIndex]?.text !== solution.answerText) errors.push("Correct option does not match the solved answer");
  if (!/^\\\(.+\\\)$/.test(formula)) errors.push("Explanation formula lacks inline MathJax delimiters");
  if (steps.length < 3) errors.push("Explanation does not provide setup, calculation and verification stages");
  if (steps.some((step) => !/^\\\(.+\\\)$/.test(step))) errors.push("Explanation step lacks inline MathJax delimiters");
  if (!shortcut.title.startsWith("10-Second ") || shortcut.steps.length < 1) errors.push("Explanation does not contain a solve-mode-specific exam shortcut");
  if (!optionSet.options.some((option) => option.text === commonTrap.optionText && option.misconceptionId === commonTrap.misconceptionId)) errors.push("Common-trap callout is not tied to an actual distractor");
  if (/Do not choose|Don't choose/i.test(commonTrap.explanation)) errors.push("Common-trap explanation uses a negative command");
  if (/[A-Z]{3,}_[A-Z_]{3,}/.test(commonTrap.explanation)) errors.push("Common-trap explanation leaks an internal misconception identifier");
  if (!balancedInlineMath(learnerText)) errors.push("Learner text contains unbalanced inline MathJax");
  if (/\\frac/.test(outsideInlineMath(learnerText))) errors.push("Learner text contains a raw LaTeX fraction outside MathJax");
  if (/(^|[^\\])\$/.test(learnerText)) errors.push("Learner text uses an unsupported dollar-sign MathJax delimiter");
  if (/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(learnerText)) errors.push("Learner text contains an ASCII fractional time");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-004",
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: "en",
    seed: input.seed,
    stem,
    parameters,
    solution,
    options: optionSet.options.map((option) => option.text),
    optionAudit: optionSet.options,
    correctIndex: optionSet.correctIndex,
    explanation,
    mathematicalFingerprint: fingerprint(parameters, entry.solveMode),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}

export function runTmwCp004Pipeline(input: { questionLanguageId: string; seed: string; language: TmwLocalizedLanguage }): TmwLocalizedQuestion;
export function runTmwCp004Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" }): TmwCp004GeneratedQuestion;
export function runTmwCp004Pipeline(
  input: { questionLanguageId: string; seed: string; language?: "en" | TmwLocalizedLanguage },
): TmwCp004GeneratedQuestion | TmwLocalizedQuestion {
  const english = buildEnglishQuestion(input);
  if (!input.language || input.language === "en") return english;
  return localizeTmwCp004Question(english, input.language);
}
