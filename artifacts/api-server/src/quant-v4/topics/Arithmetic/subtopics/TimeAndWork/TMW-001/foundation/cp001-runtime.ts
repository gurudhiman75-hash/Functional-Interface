import { createHash } from "node:crypto";
import { getTmwCp001Entry } from "./cp001-registry";
import { add, compare, divide, equals, formatRational, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry, TmwCp001Solution, TmwGeneratedQuestion } from "./types";

function seedNumber(seed: string, salt: string): number {
  const hex = createHash("sha256").update(`${seed}:${salt}`).digest("hex").slice(0, 8);
  return Number.parseInt(hex, 16);
}

function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[seedNumber(seed, salt) % values.length];
}

const contexts = {
  production: [
    { actor: "A packaging machine", action: "packs", object: "cartons", unit: "items" as const },
    { actor: "A printing unit", action: "prints", object: "booklets", unit: "items" as const },
  ],
  document_work: [
    { actor: "A data-entry operator", action: "processes", object: "forms", unit: "forms" as const },
    { actor: "A typist", action: "types", object: "pages", unit: "pages" as const },
  ],
  inspection: [
    { actor: "An inspection team", action: "checks", object: "files", unit: "items" as const },
    { actor: "A verification clerk", action: "verifies", object: "applications", unit: "forms" as const },
  ],
  painting: [
    { actor: "A painter", action: "paints", object: "a boundary wall", unit: "metres" as const },
    { actor: "A maintenance worker", action: "finishes", object: "a repair assignment", unit: "items" as const },
  ],
} as const;

function buildParameters(entry: TmwCp001RegistryEntry, seed: string): TmwCp001Parameters {
  const completionTime = pick([8, 10, 12, 15, 16, 18, 20, 24, 25, 30], seed, "completion");
  const elapsed = pick([2, 3, 4, 5, 6, 8], seed, "elapsed");
  const rateValue = pick([4, 5, 6, 8, 10, 12, 15], seed, "rate");
  const timeValue = pick([3, 4, 5, 6, 8, 10], seed, "time");
  const context = pick(contexts[entry.scenarioFamily], seed, "context");
  const requestedFraction = pick([rational(1, 4), rational(1, 3), rational(2, 5), rational(1, 2), rational(3, 5), rational(3, 4)], seed, "fraction");

  if (["findOneUnitWorkFromCompletionTime", "findCompletionTimeFromOneUnitWork", "findFractionCompletedInGivenTime", "findPercentCompletedInGivenTime", "findTimeForGivenFraction", "findTimeForGivenPercent", "findRemainingFractionAfterTime", "findRemainingPercentAfterTime"].includes(entry.solveMode)) {
    const safeElapsed = Math.min(elapsed, completionTime - 1);
    return {
      totalWork: rational(1),
      rate: rational(1, completionTime),
      time: rational(safeElapsed),
      requestedFraction,
      outputUnit: context.unit,
      context,
    };
  }

  return {
    totalWork: rational(rateValue * timeValue),
    rate: rational(rateValue),
    time: rational(timeValue),
    requestedFraction,
    outputUnit: context.unit,
    context,
  };
}

function percent(value: Rational): Rational {
  return multiply(value, rational(100));
}

function solve(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): TmwCp001Solution {
  let answer: Rational;
  let formulaLatex = "W=r\\times t";
  let workedLatex: string[] = [];
  let answerText = "";

  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      answer = multiply(p.rate, p.time);
      workedLatex = [`W=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} ${p.outputUnit}`;
      break;
    case "findRateFromWorkAndTime":
      answer = divide(p.totalWork, p.time);
      workedLatex = [`r=\\frac{W}{t}=\\frac{${toLatex(p.totalWork)}}{${toLatex(p.time)}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} ${p.outputUnit} per day`;
      break;
    case "findTimeFromWorkAndRate":
      answer = divide(p.totalWork, p.rate);
      workedLatex = [`t=\\frac{W}{r}=\\frac{${toLatex(p.totalWork)}}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} days`;
      break;
    case "findOneUnitWorkFromCompletionTime":
      formulaLatex = "r=\\frac{1}{T}";
      answer = p.rate;
      workedLatex = [`r=\\frac{1}{${toLatex(p.time.denominator === 1 ? reciprocal(p.rate) : reciprocal(p.rate))}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} of the work per day`;
      break;
    case "findCompletionTimeFromOneUnitWork":
      formulaLatex = "T=\\frac{1}{r}";
      answer = reciprocal(p.rate);
      workedLatex = [`T=\\frac{1}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} days`;
      break;
    case "findFractionCompletedInGivenTime":
      formulaLatex = "W_{done}=r\\times t";
      answer = multiply(p.rate, p.time);
      workedLatex = [`W_{done}=${toLatex(p.rate)}\\times${toLatex(p.time)}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} of the work`;
      break;
    case "findPercentCompletedInGivenTime": {
      formulaLatex = "\\%W_{done}=r\\times t\\times100";
      const fractionDone = multiply(p.rate, p.time);
      answer = percent(fractionDone);
      workedLatex = [`W_{done}=${toLatex(fractionDone)}`, `\\%W_{done}=${toLatex(fractionDone)}\\times100=${toLatex(answer)}\\%`];
      answerText = `${formatRational(answer)}%`;
      break;
    }
    case "findTimeForGivenFraction":
      formulaLatex = "t=\\frac{W_{target}}{r}";
      answer = divide(p.requestedFraction ?? rational(1, 2), p.rate);
      workedLatex = [`t=\\frac{${toLatex(p.requestedFraction ?? rational(1, 2))}}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} days`;
      break;
    case "findTimeForGivenPercent": {
      formulaLatex = "t=\\frac{W_{target}}{r}";
      const target = p.requestedFraction ?? rational(1, 2);
      answer = divide(target, p.rate);
      workedLatex = [`W_{target}=${toLatex(percent(target))}\\%=${toLatex(target)}`, `t=\\frac{${toLatex(target)}}{${toLatex(p.rate)}}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} days`;
      break;
    }
    case "findRemainingFractionAfterTime": {
      formulaLatex = "W_{remaining}=1-r\\times t";
      const completed = multiply(p.rate, p.time);
      answer = subtract(rational(1), completed);
      workedLatex = [`W_{done}=${toLatex(completed)}`, `W_{remaining}=1-${toLatex(completed)}=${toLatex(answer)}`];
      answerText = `${formatRational(answer)} of the work`;
      break;
    }
    case "findRemainingPercentAfterTime": {
      formulaLatex = "\\%W_{remaining}=(1-r\\times t)\\times100";
      const completed = multiply(p.rate, p.time);
      const remaining = subtract(rational(1), completed);
      answer = percent(remaining);
      workedLatex = [`W_{remaining}=1-${toLatex(completed)}=${toLatex(remaining)}`, `\\%W_{remaining}=${toLatex(remaining)}\\times100=${toLatex(answer)}\\%`];
      answerText = `${formatRational(answer)}%`;
      break;
    }
    default:
      throw new Error(`Unsupported solve mode: ${entry.solveMode}`);
  }

  return { answer, answerType: entry.answerType, formulaLatex, workedLatex, answerText };
}

function verify(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, solution: TmwCp001Solution): boolean {
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      return equals(solution.answer, multiply(p.rate, p.time));
    case "findRateFromWorkAndTime":
      return equals(multiply(solution.answer, p.time), p.totalWork);
    case "findTimeFromWorkAndRate":
      return equals(multiply(solution.answer, p.rate), p.totalWork);
    case "findOneUnitWorkFromCompletionTime":
      return equals(multiply(solution.answer, reciprocal(p.rate)), rational(1));
    case "findCompletionTimeFromOneUnitWork":
      return equals(multiply(solution.answer, p.rate), rational(1));
    case "findFractionCompletedInGivenTime":
      return equals(solution.answer, multiply(p.rate, p.time));
    case "findPercentCompletedInGivenTime":
      return equals(solution.answer, percent(multiply(p.rate, p.time)));
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent":
      return equals(multiply(solution.answer, p.rate), p.requestedFraction ?? rational(1, 2));
    case "findRemainingFractionAfterTime":
      return equals(add(solution.answer, multiply(p.rate, p.time)), rational(1));
    case "findRemainingPercentAfterTime":
      return equals(add(divide(solution.answer, rational(100)), multiply(p.rate, p.time)), rational(1));
  }
}

function stem(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): string {
  const c = p.context;
  const completion = formatRational(reciprocal(p.rate));
  const fraction = p.requestedFraction ?? rational(1, 2);
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime": return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per day. How many will be completed in ${formatRational(p.time)} days?`;
    case "findRateFromWorkAndTime": return `${c.actor} ${c.action} ${formatRational(p.totalWork)} ${c.object} in ${formatRational(p.time)} days. Find the daily rate of work.`;
    case "findTimeFromWorkAndRate": return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per day. How many days are required to complete ${formatRational(p.totalWork)} ${c.object}?`;
    case "findOneUnitWorkFromCompletionTime": return `${c.actor} can complete ${c.object} in ${completion} days. What fraction of the work is completed in one day?`;
    case "findCompletionTimeFromOneUnitWork": return `${c.actor} completes ${formatRational(p.rate)} of ${c.object} in one day. In how many days will the whole work be completed?`;
    case "findFractionCompletedInGivenTime": return `${c.actor} can complete ${c.object} in ${completion} days. What fraction of the work will be completed in ${formatRational(p.time)} days?`;
    case "findPercentCompletedInGivenTime": return `${c.actor} can complete ${c.object} in ${completion} days. What percentage of the work will be completed in ${formatRational(p.time)} days?`;
    case "findTimeForGivenFraction": return `${c.actor} can complete ${c.object} in ${completion} days. How many days are needed to complete ${formatRational(fraction)} of the work?`;
    case "findTimeForGivenPercent": return `${c.actor} can complete ${c.object} in ${completion} days. How many days are needed to complete ${formatRational(percent(fraction))}% of the work?`;
    case "findRemainingFractionAfterTime": return `${c.actor} can complete ${c.object} in ${completion} days. What fraction of the work remains after ${formatRational(p.time)} days?`;
    case "findRemainingPercentAfterTime": return `${c.actor} can complete ${c.object} in ${completion} days. What percentage of the work remains after ${formatRational(p.time)} days?`;
    case "findOutputFromUnitRateAndTime": return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} in one day. Find the output in ${formatRational(p.time)} days.`;
  }
}

function answerLabel(answer: Rational, entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): string {
  const value = formatRational(answer);
  if (entry.answerType === "PERCENT") return `${value}%`;
  if (entry.answerType === "TIME") return `${value} days`;
  if (entry.answerType === "RATE") return entry.solveMode === "findOneUnitWorkFromCompletionTime" ? `${value} of the work per day` : `${value} ${p.outputUnit} per day`;
  if (entry.answerType === "FRACTION") return `${value} of the work`;
  return `${value} ${p.outputUnit}`;
}

function options(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, answer: Rational, seed: string): { values: string[]; correctIndex: number } {
  const candidates: Rational[] = [
    answer,
    multiply(answer, rational(2)),
    divide(answer, rational(2)),
    add(answer, rational(1)),
    subtract(answer, rational(1, Math.max(2, answer.denominator))),
  ].filter((value) => compare(value, rational(0)) > 0);
  const unique = Array.from(new Map(candidates.map((value) => [formatRational(value), value])).values()).slice(0, 4);
  while (unique.length < 4) unique.push(add(answer, rational(unique.length + 2)));
  const rotation = seedNumber(seed, "options") % 4;
  const rotated = unique.map((_, index) => unique[(index + rotation) % 4]);
  return { values: rotated.map((value) => answerLabel(value, entry, p)), correctIndex: rotated.findIndex((value) => equals(value, answer)) };
}

export function runTmwCp001Pipeline(input: { questionLanguageId: string; seed: string; language?: "en" | "hi" | "pa" }): TmwGeneratedQuestion {
  if (input.language && input.language !== "en") throw new Error("TMW-CP-001 is English only at the current runtime-proof stage");
  const entry = getTmwCp001Entry(input.questionLanguageId);
  const parameters = buildParameters(entry, input.seed);
  const solution = solve(entry, parameters);
  const optionSet = options(entry, parameters, solution.answer, input.seed);
  const errors: string[] = [];
  if (!verify(entry, parameters, solution)) errors.push("Independent verifier disagrees with canonical solver");
  if (optionSet.correctIndex < 0) errors.push("Correct answer is missing from options");
  if (new Set(optionSet.values).size !== 4) errors.push("Options are not unique");
  const renderedStem = stem(entry, parameters);
  if (!renderedStem.trim()) errors.push("Stem is empty");

  return {
    archetypeId: "TMW-001",
    canonicalProblemId: "TMW-CP-001",
    questionLanguageId: entry.qlId,
    language: "en",
    seed: input.seed,
    stem: renderedStem,
    parameters,
    solution,
    options: optionSet.values,
    correctIndex: optionSet.correctIndex,
    explanation: {
      opening: entry.ruleId === "TMW_RATE_RECIPROCAL" ? "Convert the completion time into one-day work before using the required fraction." : "Relate the completed work directly to the rate and the working time.",
      formula: `\\(${solution.formulaLatex}\\)`,
      steps: solution.workedLatex.map((line) => `\\(${line}\\)`),
      conclusion: `Therefore, the required answer is ${solution.answerText}.`,
    },
    mathematicalFingerprint: `${entry.solveMode}|${parameters.totalWork.numerator}/${parameters.totalWork.denominator}|${parameters.rate.numerator}/${parameters.rate.denominator}|${parameters.time.numerator}/${parameters.time.denominator}|${parameters.requestedFraction?.numerator ?? 0}/${parameters.requestedFraction?.denominator ?? 1}`,
    validation: { valid: errors.length === 0, errors },
    publiclyPublishable: false,
  };
}
