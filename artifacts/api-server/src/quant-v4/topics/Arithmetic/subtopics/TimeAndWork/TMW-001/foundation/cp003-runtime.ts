import { getTmwCp003Entry } from "./cp003-registry";
import { buildTmwCp003Options } from "./cp003-options";
import { buildTmwCp003Parameters } from "./cp003-parameters";
import { buildTmwCp003CommonTrap, buildTmwCp003Shortcut, buildTmwCp003WorkingLatex } from "./cp003-learning";
import { renderTmwCp003Stem, tmwCp003Conclusion, tmwCp003ExplanationOpening } from "./cp003-presentation";
import { solveTmwCp003, verifyTmwCp003 } from "./cp003-solver";
import { divide, rationalKey, toLatex } from "./rational";
import { localizeTmwCp003Question } from "./localization-cp003";
import { polishTmwCp003LocalizedQuestion } from "./localization-cp003-polish";
import { finalizeTmwCp003LocalizedQuestion } from "./localization-cp003-final-polish";
import { cleanTmwCp003LocalizedLanguage } from "./localization-cp003-language-cleanup";
import type { Rational } from "./types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import type {
  TmwCp003GeneratedQuestion,
  TmwCp003Parameters,
  TmwCp003RegistryEntry,
  TmwCp003Solution,
} from "./cp003-types";

function key(value: Rational | undefined): string {
  return value ? rationalKey(value) : "-";
}

function fingerprint(p: TmwCp003Parameters, solveMode: string): string {
  return [
    solveMode,
    key(p.efficiencyA), key(p.efficiencyB), key(p.efficiencyC),
    key(p.timeA), key(p.timeB), key(p.timeC),
    key(p.workA), key(p.workB),
    key(p.durationA), key(p.durationB),
    key(p.outputA), key(p.outputB),
    key(p.combinedTime), key(p.timeDifference), key(p.timeSum),
    key(p.percentAOverB), key(p.percentBOverC),
    key(p.originalTime), key(p.changedTime),
    p.targetAgentIndex ?? "-", p.timeUnit,
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

function visibleWorkedLatex(
  entry: TmwCp003RegistryEntry,
  parameters: TmwCp003Parameters,
  solution: TmwCp003Solution,
): string[] {
  if (
    entry.solveMode === "findComparativeDurationFromDifferentWorkAndEfficiencies"
    && parameters.workA
    && parameters.workB
    && parameters.timeB
  ) {
    const reducedWorkRatio = divide(parameters.workA, parameters.workB);
    return [
      `T_A=${toLatex(parameters.timeB)}\\times\\frac{${Math.abs(reducedWorkRatio.numerator)}\\times${toLatex(parameters.efficiencyB)}}{${reducedWorkRatio.denominator}\\times${toLatex(parameters.efficiencyA)}}=${toLatex(solution.answer)}`,
    ];
  }
  return solution.workedLatex;
}

function buildEnglishQuestion(input: { questionLanguageId: string; seed: string }): TmwCp003GeneratedQuestion {
  const entry = getTmwCp003Entry(input.questionLanguageId);
  const parameters = buildTmwCp003Parameters(entry, input.seed);
  const solution = solveTmwCp003(entry, parameters);
  const optionSet = buildTmwCp003Options(entry, parameters, solution, input.seed);
  const renderedStem = renderTmwCp003Stem(entry, parameters);
  const workedLatex = visibleWorkedLatex(entry, parameters, solution);
  const explanationFormula = inlineMath(solution.formulaLatex);
  const explanationSteps = buildTmwCp003WorkingLatex(entry, parameters, solution, workedLatex).map(inlineMath);
  const shortcut = buildTmwCp003Shortcut(entry, parameters, solution);
  const commonTrap = buildTmwCp003CommonTrap(entry, optionSet.options);
  const explanation = {
    opening: tmwCp003ExplanationOpening(entry),
    formula: explanationFormula,
    steps: explanationSteps,
    shortcut,
    commonTrap,
    conclusion: tmwCp003Conclusion(entry, parameters, solution.answerText),
  };
  const errors: string[] = [];
  const learnerText = [
    renderedStem,
    ...optionSet.options.map((item) => item.text),
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

  if (!verifyTmwCp003(entry, parameters, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!renderedStem.trim()) errors.push("Stem is empty");
  if (/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(learnerText)) errors.push("Learner text contains an unresolved placeholder");
  if (optionSet.options.length !== 4) errors.push("Question does not contain exactly four options");
  if (new Set(optionSet.options.map((item) => item.text)).size !== 4) errors.push("Options are not textually unique");
  if (optionSet.correctIndex < 0 || optionSet.correctIndex > 3) errors.push("Correct answer is missing from options");
  if (optionSet.options.filter((item) => item.misconceptionId === "CORRECT").length !== 1) errors.push("Option contract does not contain exactly one correct answer");
  if (!/^\\\(.+\\\)$/.test(explanationFormula)) errors.push("Explanation formula lacks inline MathJax delimiters");
  if (explanationSteps.length < 3) errors.push("Explanation does not provide setup, calculation and verification stages");
  if (explanationSteps.some((step) => !/^\\\(.+\\\)$/.test(step))) errors.push("Explanation step lacks inline MathJax delimiters");
  if (!explanation.shortcut.title.startsWith("10-Second ") || explanation.shortcut.steps.length < 1) errors.push("Explanation does not contain a solve-mode-specific exam shortcut");
  if (!optionSet.options.some((item) => item.text === explanation.commonTrap.optionText && item.misconceptionId === explanation.commonTrap.misconceptionId)) errors.push("Common-trap callout is not tied to an actual distractor");
  if (/Do not choose|Don't choose/i.test(explanation.commonTrap.explanation)) errors.push("Common-trap explanation uses a negative command");
  if (/[A-Z]{3,}_[A-Z_]{3,}/.test(explanation.commonTrap.explanation)) errors.push("Common-trap explanation leaks an internal misconception identifier");
  if (!balancedInlineMath(learnerText)) errors.push("Learner text contains unbalanced inline MathJax");
  if (/\\frac/.test(outsideInlineMath(learnerText))) errors.push("Learner text contains a raw LaTeX fraction outside MathJax");
  if (/(^|[^\\])\$/.test(learnerText)) errors.push("Learner text uses an unsupported dollar-sign MathJax delimiter");
  if (/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(learnerText)) errors.push("Learner text contains an ASCII fractional time");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-003",
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: "en",
    seed: input.seed,
    stem: renderedStem,
    parameters,
    solution,
    options: optionSet.options.map((item) => item.text),
    optionAudit: optionSet.options,
    correctIndex: optionSet.correctIndex,
    explanation,
    mathematicalFingerprint: fingerprint(parameters, entry.solveMode),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}

export function runTmwCp003Pipeline(input: { questionLanguageId: string; seed: string; language: TmwLocalizedLanguage }): TmwLocalizedQuestion;
export function runTmwCp003Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" }): TmwCp003GeneratedQuestion;
export function runTmwCp003Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | TmwLocalizedLanguage }): TmwCp003GeneratedQuestion | TmwLocalizedQuestion {
  const english = buildEnglishQuestion(input);
  if (!input.language || input.language === "en") return english;
  const localized = localizeTmwCp003Question(english, input.language);
  const polished = polishTmwCp003LocalizedQuestion(localized, input.language);
  const finalized = finalizeTmwCp003LocalizedQuestion(polished, input.language);
  return cleanTmwCp003LocalizedLanguage(finalized, input.language);
}
