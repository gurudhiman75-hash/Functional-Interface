import { getTmwCp005Entry } from "./cp005-registry";
import { buildTmwCp005Options } from "./cp005-options";
import { buildTmwCp005Parameters } from "./cp005-parameters";
import {
  buildTmwCp005CommonTrap,
  buildTmwCp005Shortcut,
  buildTmwCp005WorkingLatex,
} from "./cp005-learning";
import {
  renderTmwCp005Stem,
  tmwCp005Conclusion,
  tmwCp005ExplanationOpening,
} from "./cp005-presentation";
import { solveTmwCp005, verifyTmwCp005 } from "./cp005-solver";
import { rationalKey } from "./rational";
import { polishTmwEnglishQuestionForManualReview } from "./english-manual-polish";
import { localizeTmwCp005Question } from "./localization-cp005";
import { remediateTmwCp005CriticalParameters } from "./critical-remediation-r1";
import type { Rational } from "./types";
import type {
  TmwLocalizedLanguage,
  TmwLocalizedQuestion,
  TmwLocalizedValue,
} from "./localization-types";
import type { TmwCp005GeneratedQuestion, TmwCp005Parameters } from "./cp005-types";

function key(value: Rational | undefined): string {
  return value ? rationalKey(value) : "-";
}

function fingerprint(p: TmwCp005Parameters, mode: string): string {
  return [
    mode,
    p.cycle.map((segment) => `${segment.label}:${rationalKey(segment.rate)}:${rationalKey(segment.duration)}`).join(";"),
    p.startOffset ?? 0,
    p.givenCycles ?? "-",
    key(p.givenTime),
    key(p.targetWork),
    key(p.knownCompletionTime),
    p.knownTerminalLabel ?? "-",
    p.unknownSegmentIndex ?? "-",
    key(p.deadline),
    p.patternNumber ?? "-",
    p.timeUnit,
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

function buildEnglishQuestion(input: { questionLanguageId: string; seed: string }): TmwCp005GeneratedQuestion {
  const entry = getTmwCp005Entry(input.questionLanguageId);
  const rawParameters = buildTmwCp005Parameters(entry, input.seed);
  const parameters = remediateTmwCp005CriticalParameters(entry, rawParameters, input.seed);
  const solution = solveTmwCp005(entry, parameters);
  const optionSet = buildTmwCp005Options(entry, parameters, solution, input.seed);
  const stem = renderTmwCp005Stem(entry, parameters);
  const formula = inlineMath(solution.formulaLatex);
  const steps = buildTmwCp005WorkingLatex(entry, parameters, solution).map(inlineMath);
  const shortcut = buildTmwCp005Shortcut(entry, parameters, solution);
  const commonTrap = buildTmwCp005CommonTrap(entry, optionSet.options);
  const errors: string[] = [];
  const explanation = {
    opening: tmwCp005ExplanationOpening(entry),
    formula,
    steps,
    shortcut,
    commonTrap,
    conclusion: tmwCp005Conclusion(entry, parameters, solution.answerText),
  };
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

  if (!verifyTmwCp005(entry, parameters, solution)) errors.push("Independent verifier disagrees with canonical solver");
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

  const raw: TmwCp005GeneratedQuestion = {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-005",
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
  return polishTmwEnglishQuestionForManualReview(raw) as TmwCp005GeneratedQuestion;
}

export function runTmwCp005Pipeline(input: { questionLanguageId: string; seed: string; language: TmwLocalizedLanguage }): TmwLocalizedQuestion<TmwLocalizedValue>;
export function runTmwCp005Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" }): TmwCp005GeneratedQuestion;
export function runTmwCp005Pipeline(
  input: { questionLanguageId: string; seed: string; language?: "en" | TmwLocalizedLanguage },
): TmwCp005GeneratedQuestion | TmwLocalizedQuestion<TmwLocalizedValue> {
  const english = buildEnglishQuestion(input);
  if (!input.language || input.language === "en") return english;
  return localizeTmwCp005Question(english, input.language);
}
