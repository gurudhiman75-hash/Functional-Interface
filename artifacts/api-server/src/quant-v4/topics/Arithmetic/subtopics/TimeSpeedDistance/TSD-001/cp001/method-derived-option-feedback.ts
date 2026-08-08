import {
  add,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001Explanation, TsdCp001OptionAnalysis } from "./runtime-types";
import { formatExamNumber, ratioText } from "./runtime-support";

function scalarValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function absolute(value: Rational): Rational {
  return value.numerator < 0n ? rational(-value.numerator, value.denominator) : value;
}

function componentWiseRatioSum(first: Rational, second: Rational): Rational {
  return rational(
    first.numerator + second.numerator,
    first.denominator + second.denominator,
  );
}

function optionText(value: Rational, unit: string): string {
  return `${formatExamNumber(value)} ${unit}`;
}

function hourText(value: Rational): string {
  return equals(value, rational(1)) ? "1 hour" : `${formatExamNumber(value)} hours`;
}

function ratioWorking(first: Rational, second: Rational): string {
  const raw = `${formatExamNumber(first)}:${formatExamNumber(second)}`;
  const reduced = ratioText(divide(first, second));
  return raw === reduced ? reduced : `${raw} = ${reduced}`;
}

function directReason(
  input: Extract<TsdCp001SolveInput, {
    solveMode: "speedFromDistanceAndTime" | "timeFromDistanceAndSpeed";
  }>,
  option: TsdCp001OptionAnalysis,
): string {
  if (input.solveMode === "speedFromDistanceAndTime") {
    const distance = formatExamNumber(input.distanceMetres);
    const time = formatExamNumber(input.durationSeconds);
    if (option.misconceptionId === "ADD_GIVENS_BEFORE_DIVIDING") {
      return `⚠️ ${option.text}: this uses (${distance} + ${time}) ÷ ${time}. Distance and time cannot be added; use ${distance} ÷ ${time}.`;
    }
    if (option.misconceptionId === "SUBTRACT_GIVENS_BEFORE_DIVIDING") {
      return `⚠️ ${option.text}: this uses (${distance} − ${time}) ÷ ${time}. Distance and time cannot be subtracted; use ${distance} ÷ ${time}.`;
    }
    const minutes = formatExamNumber(divide(input.durationSeconds, rational(60)));
    return `⚠️ ${option.text}: ${distance} ÷ ${minutes} is metres per minute after changing seconds to minutes, not metres per second.`;
  }

  const distance = formatExamNumber(input.distanceMetres);
  const speed = formatExamNumber(input.speedMps);
  if (option.misconceptionId === "ADD_GIVENS_BEFORE_DIVIDING") {
    return `⚠️ ${option.text}: this uses (${distance} + ${speed}) ÷ ${speed}. Distance and speed cannot be added; use ${distance} ÷ ${speed}.`;
  }
  if (option.misconceptionId === "SUBTRACT_GIVENS_BEFORE_DIVIDING") {
    return `⚠️ ${option.text}: this uses (${distance} − ${speed}) ÷ ${speed}. Distance and speed cannot be subtracted; use ${distance} ÷ ${speed}.`;
  }
  return `⚠️ ${option.text}: this is the journey time in minutes but is labelled seconds; multiply the numerical result by 60.`;
}

function mixedUnitReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "speedFromMixedUnits" }>,
  correct: Rational,
  option: TsdCp001OptionAnalysis,
): string {
  if (input.outputUnit === "KMPH") {
    const metresPerSecond = multiply(correct, rational(5, 18));
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: this is the metres-per-second result labelled km/h; multiply by 3.6 to convert it.`;
    }
    const factor = option.text === optionText(multiply(metresPerSecond, rational(3)), "km/h") ? "3" : "4";
    return `⚠️ ${option.text}: this multiplies the metres-per-second result by ${factor} instead of the correct factor 3.6.`;
  }

  if (input.outputUnit === "MPS") {
    const kilometresPerHour = multiply(correct, rational(18, 5));
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: this is the kilometres-per-hour result labelled m/s; divide by 3.6 to convert it.`;
    }
    const factor = option.text === optionText(divide(kilometresPerHour, rational(3)), "m/s") ? "3" : "4";
    return `⚠️ ${option.text}: this divides the kilometres-per-hour result by ${factor} instead of the correct factor 3.6.`;
  }

  if (input.outputUnit === "M_PER_MINUTE") {
    const raw = divide(input.distance, input.duration);
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION" || option.text === optionText(raw, "m/min")) {
      return `⚠️ ${option.text}: this divides kilometres by minutes without first converting kilometres to metres.`;
    }
    const usesHundred = option.text === optionText(divide(correct, rational(10)), "m/min");
    return usesHundred
      ? `⚠️ ${option.text}: this uses 100 metres for 1 kilometre instead of 1000 metres.`
      : `⚠️ ${option.text}: this uses 10,000 metres for 1 kilometre instead of 1000 metres.`;
  }

  return option.reason;
}

function elapsedReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "elapsedClockTime" }>,
  option: TsdCp001OptionAnalysis,
): string {
  if (option.misconceptionId === "DROP_ONE_HOUR_FROM_INTERVAL") {
    return `⚠️ ${option.text}: this leaves one complete hour out of the departure-to-arrival interval.`;
  }
  if (option.misconceptionId === "ADD_ONE_HOUR_TO_INTERVAL") {
    return `⚠️ ${option.text}: this counts one complete hour more than the departure-to-arrival interval.`;
  }
  return `⚠️ ${option.text}: this compares only the whole-hour marks and ignores the minute parts of the two clock times.`;
}

function deadlineReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "requiredUniformSpeedForDeadline" }>,
  option: TsdCp001OptionAnalysis,
): string {
  const absoluteDeadline = add(
    input.deadlineMinuteOfDay,
    multiply(rational(input.deadlineDayOffset), rational(1440)),
  );
  const availableHours = divide(
    subtract(absoluteDeadline, input.departureMinuteOfDay),
    rational(60),
  );
  const hours = formatExamNumber(availableHours);
  if (option.misconceptionId === "ADD_ONE_HOUR_TO_INTERVAL") {
    return `⚠️ ${option.text}: this allows ${hourText(add(availableHours, rational(1)))} instead of the exact ${hours}-hour window.`;
  }
  if (option.misconceptionId === "DROP_ONE_HOUR_FROM_INTERVAL") {
    return `⚠️ ${option.text}: this allows ${hourText(subtract(availableHours, rational(1)))} instead of the exact ${hours}-hour window.`;
  }
  return `⚠️ ${option.text}: this multiplies distance by available time; speed is distance ÷ time.`;
}

function comparisonReason(
  input: Extract<TsdCp001SolveInput, {
    solveMode: "compareDistancesAtEqualTime" | "compareTimesAtEqualDistance" | "compareSpeedsAtEqualTime";
  }>,
  option: TsdCp001OptionAnalysis,
): string {
  const first = input.solveMode === "compareSpeedsAtEqualTime" ? input.firstDistance : input.firstSpeed;
  const second = input.solveMode === "compareSpeedsAtEqualTime" ? input.secondDistance : input.secondSpeed;
  const firstText = formatExamNumber(first);
  const secondText = formatExamNumber(second);
  const correct = input.solveMode === "compareTimesAtEqualDistance"
    ? divide(second, first)
    : divide(first, second);
  const correctWorking = input.solveMode === "compareTimesAtEqualDistance"
    ? ratioWorking(second, first)
    : ratioWorking(first, second);
  const rule = input.solveMode === "compareTimesAtEqualDistance"
    ? `Equal-distance time ratio is inverse speed ratio, ${correctWorking}.`
    : input.solveMode === "compareDistancesAtEqualTime"
      ? `Equal-time distance ratio equals speed ratio, ${correctWorking}.`
      : `Equal-time speed ratio equals distance ratio, ${correctWorking}.`;

  if (option.misconceptionId === "INVERT_REQUIRED_RATIO") {
    if (input.solveMode === "compareTimesAtEqualDistance") {
      return `⚠️ ${option.text}: this copies speed ratio A:B. ${rule}`;
    }
    return `⚠️ ${option.text}: this reverses A:B. ${rule}`;
  }

  if (option.misconceptionId === "USE_SUM_INSTEAD_OF_RATIO") {
    const summed = add(first, second);
    return `⚠️ ${option.text}: this forms (${firstText}+${secondText}):${secondText} = ${formatExamNumber(summed)}:${secondText}. Required A:B is ${ratioText(correct)}.`;
  }

  const difference = absolute(subtract(first, second));
  return `⚠️ ${option.text}: this forms |${firstText}−${secondText}|:${secondText} = ${formatExamNumber(difference)}:${secondText}. Required A:B is ${ratioText(correct)}.`;
}

function ratioFormulaReason(
  input: Extract<TsdCp001SolveInput, {
    solveMode: "distanceRatioFromSpeedAndTimeRatios" | "speedRatioFromDistanceAndTimeRatios" | "timeRatioFromDistanceAndSpeedRatios";
  }>,
  option: TsdCp001OptionAnalysis,
): string {
  if (input.solveMode === "distanceRatioFromSpeedAndTimeRatios") {
    const speed = input.speedRatio;
    const time = input.timeRatio;
    const correct = multiply(speed, time);
    if (option.misconceptionId === "USE_FIRST_QUANTITY_ONLY") {
      return `⚠️ ${option.text}: this copies the speed ratio only. Distance ratio needs (${speed.numerator}×${time.numerator}):(${speed.denominator}×${time.denominator}) = ${ratioText(correct)}.`;
    }
    if (option.misconceptionId === "USE_SECOND_QUANTITY_ONLY") {
      return `⚠️ ${option.text}: this copies the time ratio only. Distance ratio needs (${speed.numerator}×${time.numerator}):(${speed.denominator}×${time.denominator}) = ${ratioText(correct)}.`;
    }
    const added = componentWiseRatioSum(speed, time);
    return `⚠️ ${option.text}: this adds corresponding terms, (${speed.numerator}+${time.numerator}):(${speed.denominator}+${time.denominator}) = ${ratioText(added)}. Multiply the terms to get ${ratioText(correct)}.`;
  }

  if (input.solveMode === "speedRatioFromDistanceAndTimeRatios") {
    const distance = input.distanceRatio;
    const time = input.timeRatio;
    const correct = divide(distance, time);
    if (option.misconceptionId === "USE_FIRST_QUANTITY_ONLY") {
      return `⚠️ ${option.text}: this copies the distance ratio only. Speed ratio needs (${distance.numerator}×${time.denominator}):(${distance.denominator}×${time.numerator}) = ${ratioText(correct)}.`;
    }
    if (option.misconceptionId === "USE_SECOND_QUANTITY_ONLY") {
      return `⚠️ ${option.text}: this copies the time ratio only. Speed ratio needs (${distance.numerator}×${time.denominator}):(${distance.denominator}×${time.numerator}) = ${ratioText(correct)}.`;
    }
    const multiplied = multiply(distance, time);
    return `⚠️ ${option.text}: this multiplies corresponding terms to get ${ratioText(multiplied)}. Dividing ratios requires cross-multiplication, giving ${ratioText(correct)}.`;
  }

  const distance = input.distanceRatio;
  const speed = input.speedRatio;
  const correct = divide(distance, speed);
  if (option.misconceptionId === "USE_FIRST_QUANTITY_ONLY") {
    return `⚠️ ${option.text}: this copies the distance ratio only. Time ratio needs (${distance.numerator}×${speed.denominator}):(${distance.denominator}×${speed.numerator}) = ${ratioText(correct)}.`;
  }
  if (option.misconceptionId === "USE_SECOND_QUANTITY_ONLY") {
    return `⚠️ ${option.text}: this copies the speed ratio only. Time ratio needs (${distance.numerator}×${speed.denominator}):(${distance.denominator}×${speed.numerator}) = ${ratioText(correct)}.`;
  }
  const multiplied = multiply(distance, speed);
  return `⚠️ ${option.text}: this multiplies corresponding terms to get ${ratioText(multiplied)}. Dividing ratios requires cross-multiplication, giving ${ratioText(correct)}.`;
}

function revisedReason(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  option: TsdCp001OptionAnalysis,
): string {
  if (option.isCorrect) return option.reason;
  if (input.solveMode === "speedFromDistanceAndTime" || input.solveMode === "timeFromDistanceAndSpeed") {
    return directReason(input, option);
  }
  if (input.solveMode === "speedFromMixedUnits") {
    const correct = scalarValue(solution);
    return correct ? mixedUnitReason(input, correct, option) : option.reason;
  }
  if (input.solveMode === "elapsedClockTime") return elapsedReason(input, option);
  if (input.solveMode === "requiredUniformSpeedForDeadline") return deadlineReason(input, option);
  if (
    input.solveMode === "compareDistancesAtEqualTime"
    || input.solveMode === "compareTimesAtEqualDistance"
    || input.solveMode === "compareSpeedsAtEqualTime"
  ) return comparisonReason(input, option);
  if (
    input.solveMode === "distanceRatioFromSpeedAndTimeRatios"
    || input.solveMode === "speedRatioFromDistanceAndTimeRatios"
    || input.solveMode === "timeRatioFromDistanceAndSpeedRatios"
  ) return ratioFormulaReason(input, option);
  return option.reason;
}

export function remodelMethodDerivedOptionFeedback(
  input: TsdCp001SolveInput,
  solution: TsdCp001Solution,
  explanation: TsdCp001Explanation,
): TsdCp001Explanation {
  const targeted = input.solveMode === "speedFromDistanceAndTime"
    || input.solveMode === "timeFromDistanceAndSpeed"
    || input.solveMode === "speedFromMixedUnits"
    || input.solveMode === "elapsedClockTime"
    || input.solveMode === "requiredUniformSpeedForDeadline"
    || input.solveMode === "compareDistancesAtEqualTime"
    || input.solveMode === "compareTimesAtEqualDistance"
    || input.solveMode === "compareSpeedsAtEqualTime"
    || input.solveMode === "distanceRatioFromSpeedAndTimeRatios"
    || input.solveMode === "speedRatioFromDistanceAndTimeRatios"
    || input.solveMode === "timeRatioFromDistanceAndSpeedRatios";
  if (!targeted) return explanation;

  return Object.freeze({
    ...explanation,
    optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
      ...option,
      reason: revisedReason(input, solution, option),
    }))),
  });
}
