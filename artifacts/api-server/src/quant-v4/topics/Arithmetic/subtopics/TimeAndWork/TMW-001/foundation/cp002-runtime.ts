import { buildTmwCp002Options } from "./cp002-options";
import { buildTmwCp002Parameters } from "./cp002-parameters";
import { renderTmwCp002Stem, tmwCp002Conclusion, tmwCp002ExplanationOpening } from "./cp002-presentation";
import { getTmwCp002Entry } from "./cp002-registry";
import { solveTmwCp002, sumTmwRates, verifyTmwCp002 } from "./cp002-solver";
import { compare, rational, rationalKey, reciprocal, subtract } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
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

function validate(entry: TmwCp002RegistryEntry, p: TmwCp002Parameters, solution: TmwCp002Solution, stem: string, options: TmwCp002Option[], correctIndex: number): string[] {
  const errors: string[] = [];
  if (!verifyTmwCp002(entry, p, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (!stem.trim()) errors.push("Stem is empty");
  if (/undefined|null|\{[^}]+\}/.test(stem)) errors.push("Stem contains an unresolved value");
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

export function runTmwCp002Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | "hi" | "pa" }): TmwCp002GeneratedQuestion {
  if (input.language && input.language !== "en") throw new Error("TMW-CP-002 is English only at the current runtime-proof stage");
  const entry = getTmwCp002Entry(input.questionLanguageId);
  const parameters = buildTmwCp002Parameters(entry, input.seed);
  const solution = solveTmwCp002(entry, parameters);
  const stem = renderTmwCp002Stem(entry, parameters);
  const optionSet = buildTmwCp002Options(entry, parameters, solution.answer, input.seed);
  const errors = validate(entry, parameters, solution, stem, optionSet.optionAudit, optionSet.correctIndex);

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
    explanation: {
      opening: tmwCp002ExplanationOpening(entry),
      formula: `\\(${solution.formulaLatex}\\)`,
      steps: solution.workedLatex.map((line) => `\\(${line}\\)`),
      conclusion: tmwCp002Conclusion(entry, parameters, solution),
    },
    mathematicalFingerprint: fingerprint(entry, parameters),
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
