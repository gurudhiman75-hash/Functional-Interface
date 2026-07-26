import type {
  Rational,
  Tmw001AnswerType,
  TmwCp001Parameters,
  TmwCp001SolverResult,
} from "../types";
import {
  add,
  divide,
  formatImproperFraction,
  formatRational,
  multiply,
  percentOf,
  rational,
  reciprocal,
  subtract,
} from "./rational";

function requireQuantity(parameters: TmwCp001Parameters, key: string): Rational {
  const value = parameters.quantities[key];
  if (!value) throw new Error(`${parameters.qlId}: missing canonical quantity ${key}.`);
  return value;
}

export function formatTmwAnswer(
  value: Rational,
  answerType: Tmw001AnswerType,
  unit: string,
): string {
  if (answerType === "PERCENT") return `${formatRational(value)}%`;
  const number = answerType === "FRACTION" ? formatImproperFraction(value) : formatRational(value);
  return unit ? `${number} ${unit}` : number;
}

function result(
  parameters: TmwCp001Parameters,
  exactAnswer: Rational,
  equation: string,
  formulaLatex: string,
  workingValues: Record<string, string | number>,
): TmwCp001SolverResult {
  return {
    exactAnswer,
    answer: formatTmwAnswer(exactAnswer, parameters.answerType, parameters.answerUnit),
    unit: parameters.answerUnit,
    equation,
    formulaLatex,
    workingValues,
  };
}

export function solveTmwCp001(parameters: TmwCp001Parameters): TmwCp001SolverResult {
  switch (parameters.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime": {
      const rate = requireQuantity(parameters, "rate");
      const time = requireQuantity(parameters, "time");
      const answer = multiply(rate, time);
      return result(parameters, answer, `${formatRational(rate)} × ${formatRational(time)} = ${formatRational(answer)}`, "W=r\\times t", { rate: formatRational(rate), time: formatRational(time), work: formatRational(answer) });
    }
    case "findRateFromWorkAndTime": {
      const work = requireQuantity(parameters, "work");
      const time = requireQuantity(parameters, "time");
      const answer = divide(work, time);
      return result(parameters, answer, `${formatRational(work)} ÷ ${formatRational(time)} = ${formatRational(answer)}`, "r=\\frac{W}{t}", { work: formatRational(work), time: formatRational(time), rate: formatRational(answer) });
    }
    case "findTimeFromWorkAndRate": {
      const work = requireQuantity(parameters, "work");
      const rate = requireQuantity(parameters, "rate");
      const answer = divide(work, rate);
      return result(parameters, answer, `${formatRational(work)} ÷ ${formatRational(rate)} = ${formatRational(answer)}`, "t=\\frac{W}{r}", { work: formatRational(work), rate: formatRational(rate), time: formatRational(answer) });
    }
    case "findOneUnitWorkFromCompletionTime": {
      const completionTime = requireQuantity(parameters, "completionTime");
      const answer = reciprocal(completionTime);
      return result(parameters, answer, `1 ÷ ${formatRational(completionTime)} = ${formatImproperFraction(answer)}`, "r=\\frac{1}{T}", { completionTime: formatRational(completionTime), unitWork: formatImproperFraction(answer) });
    }
    case "findCompletionTimeFromOneUnitWork": {
      const unitWork = requireQuantity(parameters, "unitWork");
      const answer = reciprocal(unitWork);
      return result(parameters, answer, `1 ÷ ${formatImproperFraction(unitWork)} = ${formatRational(answer)}`, "T=\\frac{1}{r}", { unitWork: formatImproperFraction(unitWork), completionTime: formatRational(answer) });
    }
    case "findFractionCompletedInGivenTime": {
      const elapsedTime = requireQuantity(parameters, "elapsedTime");
      const completionTime = requireQuantity(parameters, "completionTime");
      const answer = divide(elapsedTime, completionTime);
      return result(parameters, answer, `${formatRational(elapsedTime)} ÷ ${formatRational(completionTime)} = ${formatImproperFraction(answer)}`, "W_{done}=\\frac{t_{elapsed}}{T}", { elapsedTime: formatRational(elapsedTime), completionTime: formatRational(completionTime), fraction: formatImproperFraction(answer) });
    }
    case "findPercentCompletedInGivenTime": {
      const elapsedTime = requireQuantity(parameters, "elapsedTime");
      const completionTime = requireQuantity(parameters, "completionTime");
      const fraction = divide(elapsedTime, completionTime);
      const answer = percentOf(fraction);
      return result(parameters, answer, `(${formatRational(elapsedTime)} ÷ ${formatRational(completionTime)}) × 100 = ${formatRational(answer)}%`, "\\%W_{done}=\\frac{t_{elapsed}}{T}\\times100", { elapsedTime: formatRational(elapsedTime), completionTime: formatRational(completionTime), percent: formatRational(answer) });
    }
    case "findTimeForGivenFraction": {
      const completionTime = requireQuantity(parameters, "completionTime");
      const fraction = requireQuantity(parameters, "completedFraction");
      const answer = multiply(completionTime, fraction);
      return result(parameters, answer, `${formatRational(completionTime)} × ${formatImproperFraction(fraction)} = ${formatRational(answer)}`, "t=T\\times f", { completionTime: formatRational(completionTime), fraction: formatImproperFraction(fraction), elapsedTime: formatRational(answer) });
    }
    case "findTimeForGivenPercent": {
      const completionTime = requireQuantity(parameters, "completionTime");
      const percent = requireQuantity(parameters, "percent");
      const answer = divide(multiply(completionTime, percent), rational(100));
      return result(parameters, answer, `${formatRational(completionTime)} × ${formatRational(percent)}/100 = ${formatRational(answer)}`, "t=T\\times\\frac{p}{100}", { completionTime: formatRational(completionTime), percent: formatRational(percent), elapsedTime: formatRational(answer) });
    }
    case "findRemainingFractionAfterTime": {
      const elapsedTime = requireQuantity(parameters, "elapsedTime");
      const completionTime = requireQuantity(parameters, "completionTime");
      const completed = divide(elapsedTime, completionTime);
      const answer = subtract(rational(1), completed);
      return result(parameters, answer, `1 - ${formatImproperFraction(completed)} = ${formatImproperFraction(answer)}`, "W_{remaining}=1-\\frac{t_{elapsed}}{T}", { completedFraction: formatImproperFraction(completed), remainingFraction: formatImproperFraction(answer) });
    }
    case "findRemainingPercentAfterTime": {
      const elapsedTime = requireQuantity(parameters, "elapsedTime");
      const completionTime = requireQuantity(parameters, "completionTime");
      const completedPercent = percentOf(divide(elapsedTime, completionTime));
      const answer = subtract(rational(100), completedPercent);
      return result(parameters, answer, `100 - ${formatRational(completedPercent)} = ${formatRational(answer)}%`, "\\%W_{remaining}=100-\\frac{t_{elapsed}}{T}\\times100", { completedPercent: formatRational(completedPercent), remainingPercent: formatRational(answer) });
    }
    case "findUnitRateFromOutputAndTime": {
      const output = requireQuantity(parameters, "output");
      const time = requireQuantity(parameters, "time");
      const answer = divide(output, time);
      return result(parameters, answer, `${formatRational(output)} ÷ ${formatRational(time)} = ${formatRational(answer)}`, "r=\\frac{Q}{t}", { output: formatRational(output), time: formatRational(time), rate: formatRational(answer) });
    }
    case "findTimeFromOutputAndUnitRate": {
      const output = requireQuantity(parameters, "output");
      const rate = requireQuantity(parameters, "rate");
      const answer = divide(output, rate);
      return result(parameters, answer, `${formatRational(output)} ÷ ${formatRational(rate)} = ${formatRational(answer)}`, "t=\\frac{Q}{r}", { output: formatRational(output), rate: formatRational(rate), time: formatRational(answer) });
    }
    case "recoverWholeWorkFromCompletedPart": {
      const partWork = requireQuantity(parameters, "partWork");
      const fraction = requireQuantity(parameters, "completedFraction");
      const answer = divide(partWork, fraction);
      return result(parameters, answer, `${formatRational(partWork)} ÷ ${formatImproperFraction(fraction)} = ${formatRational(answer)}`, "W_{total}=\\frac{W_{part}}{f}", { partWork: formatRational(partWork), fraction: formatImproperFraction(fraction), totalWork: formatRational(answer) });
    }
    case "recoverWholeTimeFromPartCompletion": {
      const elapsedTime = requireQuantity(parameters, "elapsedTime");
      const fraction = requireQuantity(parameters, "completedFraction");
      const answer = divide(elapsedTime, fraction);
      return result(parameters, answer, `${formatRational(elapsedTime)} ÷ ${formatImproperFraction(fraction)} = ${formatRational(answer)}`, "T=\\frac{t_{part}}{f}", { elapsedTime: formatRational(elapsedTime), fraction: formatImproperFraction(fraction), totalTime: formatRational(answer) });
    }
    case "convertRateAcrossTimeUnits": {
      const hourlyRate = requireQuantity(parameters, "hourlyRate");
      const minutesPerHour = requireQuantity(parameters, "minutesPerHour");
      const answer = divide(hourlyRate, minutesPerHour);
      return result(parameters, answer, `${formatRational(hourlyRate)} ÷ 60 = ${formatRational(answer)}`, "r_{minute}=\\frac{r_{hour}}{60}", { hourlyRate: formatRational(hourlyRate), minuteRate: formatRational(answer) });
    }
    case "compareWorkCompletedAtEqualTime": {
      const rateA = requireQuantity(parameters, "rateA");
      const rateB = requireQuantity(parameters, "rateB");
      const time = requireQuantity(parameters, "time");
      const answer = multiply(subtract(rateA, rateB), time);
      return result(parameters, answer, `(${formatRational(rateA)} - ${formatRational(rateB)}) × ${formatRational(time)} = ${formatRational(answer)}`, "\\Delta W=(r_A-r_B)t", { rateDifference: formatRational(subtract(rateA, rateB)), time: formatRational(time), workDifference: formatRational(answer) });
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const workA = requireQuantity(parameters, "workA");
      const workB = requireQuantity(parameters, "workB");
      const rate = requireQuantity(parameters, "rate");
      const answer = divide(subtract(workB, workA), rate);
      return result(parameters, answer, `(${formatRational(workB)} - ${formatRational(workA)}) ÷ ${formatRational(rate)} = ${formatRational(answer)}`, "\\Delta t=\\frac{W_B-W_A}{r}", { workDifference: formatRational(subtract(workB, workA)), rate: formatRational(rate), timeDifference: formatRational(answer) });
    }
    case "findRequiredRateForTargetCompletion": {
      const work = requireQuantity(parameters, "work");
      const time = requireQuantity(parameters, "time");
      const answer = divide(work, time);
      return result(parameters, answer, `${formatRational(work)} ÷ ${formatRational(time)} = ${formatRational(answer)}`, "r_{required}=\\frac{W}{t_{target}}", { targetWork: formatRational(work), targetTime: formatRational(time), requiredRate: formatRational(answer) });
    }
    case "findDelayFromReducedUniformRate": {
      const originalTime = requireQuantity(parameters, "originalTime");
      const percent = requireQuantity(parameters, "percent");
      const changedRateFactor = divide(subtract(rational(100), percent), rational(100));
      const newTime = divide(originalTime, changedRateFactor);
      const answer = subtract(newTime, originalTime);
      return result(parameters, answer, `${formatRational(newTime)} - ${formatRational(originalTime)} = ${formatRational(answer)}`, "t_{new}=\\frac{t_{old}}{1-p/100},\\quad delay=t_{new}-t_{old}", { originalTime: formatRational(originalTime), percent: formatRational(percent), newTime: formatRational(newTime), delay: formatRational(answer) });
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const originalTime = requireQuantity(parameters, "originalTime");
      const percent = requireQuantity(parameters, "percent");
      const changedRateFactor = divide(add(rational(100), percent), rational(100));
      const newTime = divide(originalTime, changedRateFactor);
      const answer = subtract(originalTime, newTime);
      return result(parameters, answer, `${formatRational(originalTime)} - ${formatRational(newTime)} = ${formatRational(answer)}`, "t_{new}=\\frac{t_{old}}{1+p/100},\\quad saved=t_{old}-t_{new}", { originalTime: formatRational(originalTime), percent: formatRational(percent), newTime: formatRational(newTime), timeSaved: formatRational(answer) });
    }
  }
}
