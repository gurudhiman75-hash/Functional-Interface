import { convertSpeed } from "../foundation/units";
import type { TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001Explanation, TsdCp001OptionAnalysis } from "./runtime-types";
import { formatExamNumber } from "./runtime-support";

function speedReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertSpeedUnit" }>,
  representation: string,
  option: TsdCp001OptionAnalysis,
): string {
  if (representation === "EQUIVALENT_SPEED_SET") {
    const metresPerSecond = convertSpeed(input.value, input.from, "MPS");
    const kilometresPerHour = convertSpeed(metresPerSecond, "MPS", "KMPH");
    const metresPerMinute = convertSpeed(metresPerSecond, "MPS", "M_PER_MINUTE");
    const mps = formatExamNumber(metresPerSecond);
    const kmph = formatExamNumber(kilometresPerHour);
    const mpm = formatExamNumber(metresPerMinute);
    if (option.misconceptionId === "USE_WRONG_CONVERSION_FACTOR") {
      return `⚠️ ${option.text}: ${mps} × 3 gives the shown km/h value; use × 3.6 to get ${kmph} km/h.`;
    }
    if (option.misconceptionId === "MIX_UNCONVERTED_UNITS") {
      return `⚠️ ${option.text}: it uses ${kmph} × 60; m/min must use ${mps} × 60 = ${mpm}.`;
    }
    return `⚠️ ${option.text}: it copies ${mps} into every unit instead of converting km/h and m/min.`;
  }

  const value = formatExamNumber(input.value);
  if (input.from === "KM_PER_MINUTE" && input.to === "KMPH") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it copies ${value}; km/min to km/h requires × 60.`;
    }
    if (option.misconceptionId === "REVERSE_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it divides by 60, but changing per minute to per hour requires multiplying by 60.`;
    }
    return `⚠️ ${option.text}: it uses 3600 seconds per hour; the given rate is per minute, so use × 60.`;
  }

  if (input.from === "MPS" && input.to === "KMPH") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it copies ${value}; m/s to km/h requires multiplying by 3.6.`;
    }
    const usedFactor = option.text.startsWith(`${formatExamNumber(input.value)} `)
      ? "1"
      : option.text.startsWith(`${formatExamNumber({ numerator: input.value.numerator * 3n, denominator: input.value.denominator })} `)
        ? "3"
        : "4";
    return `⚠️ ${option.text}: it uses × ${usedFactor}; the exact m/s-to-km/h factor is 3.6.`;
  }

  if (input.from === "KMPH" && input.to === "MPS") {
    if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
      return `⚠️ ${option.text}: it copies ${value}; km/h to m/s requires dividing by 3.6.`;
    }
    return `⚠️ ${option.text}: it uses a rounded divisor; the exact km/h-to-m/s divisor is 3.6.`;
  }

  return option.reason;
}

function distanceReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertDistanceUnit" }>,
  option: TsdCp001OptionAnalysis,
): string {
  const value = formatExamNumber(input.value);
  if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
    return `⚠️ ${option.text}: it copies ${value} without changing the distance unit.`;
  }
  if (input.from === "M" && input.to === "KM") {
    return option.text.startsWith("24 ")
      ? `⚠️ ${option.text}: it uses 100 metres per kilometre; use 1000 metres per kilometre.`
      : `⚠️ ${option.text}: it uses 10,000 metres per kilometre; use 1000 metres per kilometre.`;
  }
  if (input.from === "M" && input.to === "CM") {
    return option.text.startsWith("7000 ")
      ? `⚠️ ${option.text}: it uses 1000 millimetres per metre; centimetres require × 100.`
      : `⚠️ ${option.text}: it uses 10 decimetres per metre; centimetres require × 100.`;
  }
  if (input.from === "MM" && input.to === "CM") {
    return option.misconceptionId === "REVERSE_UNIT_CONVERSION"
      ? `⚠️ ${option.text}: it multiplies by 10; millimetres to centimetres requires dividing by 10.`
      : `⚠️ ${option.text}: it uses 100 millimetres per centimetre; the correct relation is 10 millimetres per centimetre.`;
  }
  return option.reason;
}

function timeReason(
  input: Extract<TsdCp001SolveInput, { solveMode: "convertTimeUnit" }>,
  option: TsdCp001OptionAnalysis,
): string {
  const value = formatExamNumber(input.value);
  if (option.misconceptionId === "OMIT_UNIT_CONVERSION") {
    return `⚠️ ${option.text}: it copies ${value} without changing the time unit.`;
  }
  if (input.from === "HOUR" && input.to === "MINUTE") {
    return option.text.startsWith("72 ")
      ? `⚠️ ${option.text}: it uses 24, the hours-per-day factor; hours to minutes requires × 60.`
      : `⚠️ ${option.text}: it converts hours to seconds with × 3600, then wrongly labels the result minutes.`;
  }
  if (input.from === "SECOND" && input.to === "HOUR") {
    return option.misconceptionId === "CONVERT_ONLY_ONE_UNIT"
      ? `⚠️ ${option.text}: ${value} ÷ 60 gives minutes; divide by 60 once more to get hours.`
      : `⚠️ ${option.text}: after converting to minutes, it divides by 24 instead of 60.`;
  }
  if (input.from === "MINUTE" && input.to === "DAY") {
    return option.misconceptionId === "CONVERT_ONLY_ONE_UNIT"
      ? `⚠️ ${option.text}: ${value} ÷ 60 gives hours; divide those hours by 24 to get days.`
      : `⚠️ ${option.text}: it divides minutes directly by 24 and misses the minutes-to-hours step.`;
  }
  return option.reason;
}

function revisedReason(
  input: TsdCp001SolveInput,
  representation: string,
  option: TsdCp001OptionAnalysis,
): string {
  if (option.isCorrect) return option.reason;
  if (input.solveMode === "convertSpeedUnit") return speedReason(input, representation, option);
  if (input.solveMode === "convertDistanceUnit") return distanceReason(input, option);
  if (input.solveMode === "convertTimeUnit") return timeReason(input, option);
  return option.reason;
}

export function remodelUnitConversionOptionFeedback(
  input: TsdCp001SolveInput,
  representation: string,
  explanation: TsdCp001Explanation,
): TsdCp001Explanation {
  if (
    input.solveMode !== "convertSpeedUnit"
    && input.solveMode !== "convertDistanceUnit"
    && input.solveMode !== "convertTimeUnit"
  ) return explanation;

  return Object.freeze({
    ...explanation,
    optionAnalysis: Object.freeze(explanation.optionAnalysis.map((option) => Object.freeze({
      ...option,
      reason: revisedReason(input, representation, option),
    }))),
  });
}
