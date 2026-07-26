import type { Rational, TmwCp001Parameters, TmwCp001SolverResult } from "../types";
import { formatTmwAnswer } from "./solver.cp001";
import { hashSeed } from "./prng";
import { add, divide, equals, isPositive, multiply, percentOf, rational, subtract } from "./rational";

function q(parameters: TmwCp001Parameters, key: string): Rational {
  const value = parameters.quantities[key];
  if (!value) throw new Error(`${parameters.qlId}: missing distractor quantity ${key}.`);
  return value;
}

function candidateRationals(parameters: TmwCp001Parameters): Rational[] {
  switch (parameters.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime": {
      const rate = q(parameters, "rate");
      const time = q(parameters, "time");
      return [add(rate, time), multiply(rate, subtract(time, rational(1))), multiply(rate, add(time, rational(1)))];
    }
    case "findRateFromWorkAndTime": {
      const work = q(parameters, "work");
      const time = q(parameters, "time");
      return [divide(work, subtract(time, rational(1))), divide(work, add(time, rational(1))), subtract(work, time)];
    }
    case "findUnitRateFromOutputAndTime": {
      const output = q(parameters, "output");
      const time = q(parameters, "time");
      return [divide(output, subtract(time, rational(1))), divide(output, add(time, rational(1))), subtract(output, time)];
    }
    case "findTimeFromWorkAndRate":
    case "findTimeFromOutputAndUnitRate": {
      const time = q(parameters, "time");
      return [subtract(time, rational(1)), add(time, rational(1)), q(parameters, "rate")];
    }
    case "findOneUnitWorkFromCompletionTime": {
      const time = q(parameters, "completionTime");
      return [divide(rational(1), subtract(time, rational(1))), divide(rational(1), add(time, rational(1))), divide(subtract(time, rational(1)), time)];
    }
    case "findCompletionTimeFromOneUnitWork": {
      const time = q(parameters, "completionTime");
      return [subtract(time, rational(1)), add(time, rational(1)), add(time, rational(2))];
    }
    case "findFractionCompletedInGivenTime": {
      const elapsed = q(parameters, "elapsedTime");
      const total = q(parameters, "completionTime");
      return [divide(subtract(total, elapsed), total), divide(elapsed, subtract(total, rational(1))), divide(elapsed, add(total, rational(1)))];
    }
    case "findPercentCompletedInGivenTime": {
      const elapsed = q(parameters, "elapsedTime");
      const total = q(parameters, "completionTime");
      return [percentOf(divide(subtract(total, elapsed), total)), elapsed, subtract(rational(100), elapsed)];
    }
    case "findTimeForGivenFraction": {
      const elapsed = q(parameters, "elapsedTime");
      return [subtract(elapsed, rational(1)), add(elapsed, rational(1)), q(parameters, "completionTime")];
    }
    case "findTimeForGivenPercent": {
      const elapsed = q(parameters, "elapsedTime");
      const total = q(parameters, "completionTime");
      return [subtract(elapsed, rational(1)), add(elapsed, rational(1)), subtract(total, elapsed)];
    }
    case "findRemainingFractionAfterTime": {
      const elapsed = q(parameters, "elapsedTime");
      const total = q(parameters, "completionTime");
      return [divide(elapsed, total), divide(subtract(total, elapsed), subtract(total, rational(1))), divide(subtract(total, elapsed), add(total, rational(1)))];
    }
    case "findRemainingPercentAfterTime": {
      const elapsed = q(parameters, "elapsedTime");
      const total = q(parameters, "completionTime");
      return [percentOf(divide(elapsed, total)), subtract(rational(100), elapsed), elapsed];
    }
    case "recoverWholeWorkFromCompletedPart": {
      const part = q(parameters, "partWork");
      const fraction = q(parameters, "completedFraction");
      return [multiply(part, fraction), divide(part, subtract(rational(1), fraction)), part];
    }
    case "recoverWholeTimeFromPartCompletion": {
      const wholeTime = q(parameters, "wholeTime");
      return [subtract(wholeTime, rational(1)), add(wholeTime, rational(1)), q(parameters, "elapsedTime")];
    }
    case "convertRateAcrossTimeUnits": {
      const hourly = q(parameters, "hourlyRate");
      return [hourly, divide(hourly, rational(30)), divide(hourly, rational(120))];
    }
    case "compareWorkCompletedAtEqualTime": {
      const rateA = q(parameters, "rateA");
      const rateB = q(parameters, "rateB");
      const time = q(parameters, "time");
      return [subtract(rateA, rateB), multiply(rateA, time), multiply(rateB, time)];
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const rate = q(parameters, "rate");
      return [divide(q(parameters, "workA"), rate), divide(q(parameters, "workB"), rate), subtract(q(parameters, "workB"), q(parameters, "workA"))];
    }
    case "findRequiredRateForTargetCompletion": {
      const required = q(parameters, "requiredRate");
      return [subtract(required, rational(5)), add(required, rational(5)), q(parameters, "time")];
    }
    case "findDelayFromReducedUniformRate":
    case "findTimeSavedFromIncreasedUniformRate": {
      const oldTime = q(parameters, "originalTime");
      const percent = q(parameters, "percent");
      return [divide(multiply(oldTime, percent), rational(100)), oldTime, q(parameters, "newTime")];
    }
  }
}

export interface BuiltTmwOptions {
  options: string[];
  correctIndex: number;
  optionErrorLabels: Array<string | null>;
}

export function buildTmwCp001Options(parameters: TmwCp001Parameters, solver: TmwCp001SolverResult): BuiltTmwOptions {
  const candidates = candidateRationals(parameters);
  const labels = parameters.distractorStrategyIds;
  if (candidates.length !== 3 || labels.length !== 3) throw new Error(`${parameters.qlId}: option builder requires exactly three declared misconceptions.`);
  const wrong: Array<{ value: Rational; label: string }> = [];
  for (let index = 0; index < candidates.length; index += 1) {
    const value = candidates[index]!;
    if (!isPositive(value)) throw new Error(`${parameters.qlId}: ${labels[index]} produced a non-positive option.`);
    if (equals(value, solver.exactAnswer)) throw new Error(`${parameters.qlId}: ${labels[index]} reproduced the correct answer.`);
    if (wrong.some((item) => equals(item.value, value))) throw new Error(`${parameters.qlId}: misconception options are mathematically duplicated.`);
    wrong.push({ value, label: labels[index]! });
  }
  const correctIndex = hashSeed(`${parameters.qlId}|${parameters.seed}|option-position`) % 4;
  const options: string[] = [];
  const optionErrorLabels: Array<string | null> = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(solver.answer);
      optionErrorLabels.push(null);
    } else {
      const item = wrong[wrongIndex]!;
      options.push(formatTmwAnswer(item.value, parameters.answerType, parameters.answerUnit));
      optionErrorLabels.push(item.label);
      wrongIndex += 1;
    }
  }
  if (new Set(options).size !== 4) throw new Error(`${parameters.qlId}: formatted options are not unique.`);
  return { options, correctIndex, optionErrorLabels };
}
