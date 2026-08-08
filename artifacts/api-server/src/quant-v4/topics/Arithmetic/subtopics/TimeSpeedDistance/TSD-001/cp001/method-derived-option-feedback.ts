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
import { formatExamNumber } from "./runtime-support";

function scalarValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function optionText(value: Rational, unit: string): string {
  return `${formatExamNumber(value)} ${unit}`;
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
    return `⚠️ ${option.text}: this allows ${formatExamNumber(add(availableHours, rational(1)))} hours instead of the exact ${hours}-hour window.`;
  }
  if (option.misconceptionId === "DROP_ONE_HOUR_FROM_INTERVAL") {
    return `⚠️ ${option.text}: this allows ${formatExamNumber(subtract(availableHours, rational(1)))} hours instead of the exact ${hours}-hour window.`;
  }
  return `⚠️ ${option.text}: this multiplies distance by available time; speed is distance ÷ time.`;
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
    || input.solveMode === "requiredUniformSpeedForDeadline";
  if (!targeted) return explanation;

  return Object.freeze({
    ...explanation,
    optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
      ...option,
      reason: revisedReason(input, solution, option),
    }))),
  });
}
