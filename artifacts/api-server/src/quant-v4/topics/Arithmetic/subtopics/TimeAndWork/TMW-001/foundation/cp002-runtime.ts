import { buildTmwCp002Options } from "./cp002-options";
import { buildTmwCp002Parameters } from "./cp002-parameters";
import { buildTmwCp002CommonTrap, buildTmwCp002Shortcut, buildTmwCp002WorkingLatex } from "./cp002-learning";
import { renderTmwCp002Stem, tmwCp002Conclusion, tmwCp002ExplanationOpening } from "./cp002-presentation";
import { getTmwCp002Entry } from "./cp002-registry";
import { solveTmwCp002, sumTmwRates, verifyTmwCp002 } from "./cp002-solver";
import { compare, rational, rationalKey, reciprocal, subtract } from "./rational";
import { required } from "./cp001-helpers";
import { localizeTmwCp002Question } from "./localization-cp002";
import { polishTmwCp002LocalizedQuestion } from "./localization-cp002-polish";
import { finalizeTmwCp002LocalizedQuestion } from "./localization-cp002-final-polish";
import type { Rational } from "./types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import type { TmwCp002GeneratedQuestion, TmwCp002Option, TmwCp002Parameters, TmwCp002RegistryEntry, TmwCp002Solution } from "./cp002-types";

function fingerprint(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters): string {
  const rationals: Array<Rational | undefined> = [p.totalWork, p.duration, p.combinedTime, p.thirdTime, p.destructiveTime, p.netTime, p.netRate];
  const arrays = [p.individualTimes, p.individualRates, p.knownPositiveTimes ?? [], p.explicitRates ?? [], p.teamATimes ?? [], p.teamBTimes ?? []];
  const pairwise = p.pairwiseTimes ? [p.pairwiseTimes.ab, p.pairwiseTimes.bc, p.pairwiseTimes.ca].map(rationalKey).join(",") : "-";
  const signed = p.signedKnownRates ? p.signedKnownRates.map((item) => `${item.sign}:${rationalKey(item.rate)}`).join(",") : "-";
  return [entry.solveMode, ...rationals.map((value) => value ? rationalKey(value) : "-"), ...arrays.map((values) => values.map(rationalKey).join(",") || "-"), pairwise, signed, p.targetAgentIndex ?? "-", p.identicalAgentCount ?? "-", p.missingRateSign ?? "-", p.timeUnit].join("|");
}

function positive(value: Rational): boolean {
  return compare(value, rational(0)) > 0;
}

function balancedInlineMath(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

function outsideInlineMath(value: string): string {
  return value.replace(/\\\([\s\S]*?\\\)/g, "");
}

function validate(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution, stem: string, options: TmwCp002Option[], correctIndex: number): string[] {
  const errors: string[] = [];
  const visibleText = [stem, solution.answerText, ...options.map((option) => option.text)].join("\n");
  if (!verifyTmwCp002(entry, p, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!stem.trim()) errors.push("Stem is empty");
  if (/undefined|null|NaN|Infinity|\{\{|\$\{/.test(visibleText)) errors.push("Learner text contains an unresolved value");
  if (!balancedInlineMath(visibleText)) errors.push("Learner text contains unbalanced inline MathJax");
  if (/\\frac/.test(outsideInlineMath(visibleText))) errors.push("Learner text contains a raw LaTeX fraction outside MathJax");
  if (/\b(?:\d+\s+)?\d+\/\d+\s+(?:minutes?|hours?|days?|shifts?)\b/i.test(visibleText)) errors.push("Learner text contains an ASCII fractional time");
  if (!solution.formulaLatex.trim()) errors.push("Formula is empty");
  if (solution.workedLatex.length === 0) errors.push("Worked solution is empty");
  if (!positive(solution.answer)) errors.push("Answer must be positive");
  if (options.length !== 4) errors.push("Exactly four options are required");
  if (new Set(options.map((option) => option.text)).size !== 4) errors.push("Options are not unique");
  if (correctIndex < 0 || correctIndex >= 4) errors.push("Correct answer is missing from options");
  if (options.filter((option) => option.misconceptionId === "CORRECT").length !== 1) errors.push("Exactly one option must be marked correct");
  if (entry.answerType === "FRACTION" && compare(solution.answer, rational(1)) > 0) errors.push("Completed fraction exceeds the whole assignment");
  if (entry.answerType === "COUNT" && solution.answer.denominator !== 1) errors.push("Agent count must be an integer");
  if (entry.solveMode === "findCombinedTimeFromIndividualTimes") {
    for (const time of p.individualTimes) if (compare(solution.answer, time) >= 0) errors.push("Positive-agent combined time is not below an individual time");
  }
  if (entry.solveMode === "findCombinedWorkInGivenTime" && compare(solution.answer, rational(1)) >= 0) errors.push("Duration does not leave a partial assignment");
  if (entry.solveMode === "findNetTimeWithDestructiveAgent") {
    const netRate = subtract(sumTmwRates(p.individualRates), reciprocal(required(p.destructiveTime, "destructiveTime")));
    if (!positive(netRate)) errors.push("Signed net rate does not complete the target");
  }
  if (["findDestructiveTimeFromPositiveAndNetTimes", "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes"].includes(entry.solveMode)) {
    if (!positive(reciprocal(required(p.netTime, "netTime")))) errors.push("Net completion rate must be positive");
  }
  return errors;
}

function buildEnglishQuestion(input: { questionLanguageId: string; seed: string }): TmwCp002GeneratedQuestion {
  const entry = getTmwCp002Entry(input.questionLanguageId);
  const parameters = buildTmwCp002Parameters(entry, input.seed);
  const solution = solveTmwCp002(entry, parameters);
  const stem = renderTmwCp002Stem(entry, parameters);
  const optionSet = buildTmwCp002Options(entry, parameters, solution.answer, input.seed);
  const steps = buildTmwCp002WorkingLatex(entry, parameters, solution).map((line) => `\\(${line}\\)`);
  const shortcut = buildTmwCp002Shortcut(entry, parameters, solution);
  const commonTrap = buildTmwCp002CommonTrap(entry, optionSet.optionAudit);
  const explanation = {
    opening: tmwCp002ExplanationOpening(entry),
    formula: `\\(${solution.formulaLatex}\\)`,
    steps,
    shortcut,
    commonTrap,
    conclusion: tmwCp002Conclusion(entry, parameters, solution),
  };
  const errors = validate(entry, parameters, solution, stem, optionSet.optionAudit, optionSet.correctIndex);
  const explanationText = [
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
  if (explanation.steps.length < 3) errors.push("Explanation does not provide setup, calculation and verification stages");
  if (!explanation.shortcut.title.startsWith("10-Second ") || explanation.shortcut.steps.length < 1) errors.push("Explanation does not contain a solve-mode-specific exam shortcut");
  if (!optionSet.optionAudit.some((option) => option.text === explanation.commonTrap.optionText && option.misconceptionId === explanation.commonTrap.misconceptionId)) errors.push("Common-trap callout is not tied to an actual distractor");
  if (/Do not choose|Don't choose/i.test(explanation.commonTrap.explanation)) errors.push("Common-trap explanation uses a negative command");
  if (/[A-Z]{3,}_[A-Z_]{3,}/.test(explanation.commonTrap.explanation)) errors.push("Common-trap explanation leaks an internal misconception identifier");
  if (!balancedInlineMath(explanationText)) errors.push("Explanation contains unbalanced inline MathJax");
  if (/\\frac/.test(outsideInlineMath(explanationText))) errors.push("Explanation contains a raw LaTeX fraction outside MathJax");
  if (/(^|[^\\])\$/.test(explanationText)) errors.push("Explanation uses an unsupported dollar-sign MathJax delimiter");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-002",
    questionLanguageId: entry.qlId,
    solveMode: entry.solveMode,
    language: "en",
    seed: input.seed,
    stem,
    parameters,
    solution,
    options: optionSet.optionAudit.map((option) => option.text),
    optionAudit: optionSet.optionAudit,
    correctIndex: optionSet.correctIndex,
    explanation,
    mathematicalFingerprint: fingerprint(entry, parameters),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}

export function runTmwCp002Pipeline(input: { questionLanguageId: string; seed: string; language: TmwLocalizedLanguage }): TmwLocalizedQuestion;
export function runTmwCp002Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" }): TmwCp002GeneratedQuestion;
export function runTmwCp002Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | TmwLocalizedLanguage }): TmwCp002GeneratedQuestion | TmwLocalizedQuestion {
  const english = buildEnglishQuestion(input);
  if (!input.language || input.language === "en") return english;
  const localized = localizeTmwCp002Question(english, input.language);
  const polished = polishTmwCp002LocalizedQuestion(localized, input.language);
  return finalizeTmwCp002LocalizedQuestion(polished, input.language);
}
