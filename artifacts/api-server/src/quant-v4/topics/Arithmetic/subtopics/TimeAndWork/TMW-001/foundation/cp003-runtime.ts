import { getTmwCp003Entry } from "./cp003-registry";
import { buildTmwCp003Options } from "./cp003-options";
import { buildTmwCp003Parameters } from "./cp003-parameters";
import { renderTmwCp003Stem, tmwCp003Conclusion, tmwCp003ExplanationOpening } from "./cp003-presentation";
import { solveTmwCp003, verifyTmwCp003 } from "./cp003-solver";
import { divide, rationalKey, toLatex } from "./rational";
import type { Rational } from "./types";
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

export function runTmwCp003Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | "hi" | "pa" }): TmwCp003GeneratedQuestion {
  if (input.language && input.language !== "en") throw new Error("TMW-CP-003 is English only at the current runtime-proof stage");
  const entry = getTmwCp003Entry(input.questionLanguageId);
  const parameters = buildTmwCp003Parameters(entry, input.seed);
  const solution = solveTmwCp003(entry, parameters);
  const optionSet = buildTmwCp003Options(entry, parameters, solution, input.seed);
  const renderedStem = renderTmwCp003Stem(entry, parameters);
  const workedLatex = visibleWorkedLatex(entry, parameters, solution);
  const explanationFormula = inlineMath(solution.formulaLatex);
  const explanationSteps = workedLatex.map(inlineMath);
  const errors: string[] = [];

  if (!verifyTmwCp003(entry, parameters, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!renderedStem.trim()) errors.push("Stem is empty");
  if (/\{\{[^}]+\}\}|\$\{[^}]+\}/.test(renderedStem)) errors.push("Stem contains an unresolved placeholder");
  if (optionSet.options.length !== 4) errors.push("Question does not contain exactly four options");
  if (new Set(optionSet.options.map((item) => item.text)).size !== 4) errors.push("Options are not textually unique");
  if (optionSet.correctIndex < 0 || optionSet.correctIndex > 3) errors.push("Correct answer is missing from options");
  if (optionSet.options.filter((item) => item.misconceptionId === "CORRECT").length !== 1) errors.push("Option contract does not contain exactly one correct answer");
  if (!/^\\\(.+\\\)$/.test(explanationFormula)) errors.push("Explanation formula lacks inline MathJax delimiters");
  if (explanationSteps.some((step) => !/^\\\(.+\\\)$/.test(step))) errors.push("Explanation step lacks inline MathJax delimiters");

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
    explanation: {
      opening: tmwCp003ExplanationOpening(entry),
      formula: explanationFormula,
      steps: explanationSteps,
      conclusion: tmwCp003Conclusion(entry, parameters, solution.answerText),
    },
    mathematicalFingerprint: fingerprint(parameters, entry.solveMode),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
