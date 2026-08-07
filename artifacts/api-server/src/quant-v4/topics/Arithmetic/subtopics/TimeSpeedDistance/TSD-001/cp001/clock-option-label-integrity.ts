import {
  absRational,
  add,
  compare,
  fromDecimalString,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import { formatClock, formatExamNumber } from "./runtime-support";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

const MINUTES_PER_DAY = rational(1440);

function copiedClockReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode === "arrivalClockTime") {
    const departure = formatClock(question.input.departureMinuteOfDay, 0n);
    return `${option.text}: this copies the departure clock time and ignores the ${formatExamNumber(question.input.durationMinutes)}-minute journey. Move forward on the clock: ${departure} + ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}.`;
  }

  if (question.input.solveMode === "departureClockTime") {
    const arrival = formatClock(question.input.arrivalMinuteOfDay, question.input.arrivalDayOffset);
    return `${option.text}: this copies the arrival clock time and ignores the ${formatExamNumber(question.input.durationMinutes)}-minute journey. Move backward on the clock: ${arrival} − ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}.`;
  }

  return option.reason;
}

function displayedMinutes(text: string): Rational {
  const suffix = " minutes";
  if (!text.endsWith(suffix)) {
    throw new Error(`Expected minutes option, received ${text}`);
  }
  return fromDecimalString(text.slice(0, -suffix.length));
}

function elapsedOffsetReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode !== "elapsedClockTime") return option.reason;
  const absoluteArrival = add(
    question.input.arrivalMinuteOfDay,
    multiply(rational(question.input.arrivalDayOffset), MINUTES_PER_DAY),
  );
  const exactElapsed = subtract(absoluteArrival, question.input.departureMinuteOfDay);
  const proposed = displayedMinutes(option.text);
  const offset = absRational(subtract(proposed, exactElapsed));
  const direction = compare(proposed, exactElapsed) > 0 ? "above" : "below";
  const departure = formatClock(question.input.departureMinuteOfDay, 0n);
  const arrival = formatClock(question.input.arrivalMinuteOfDay, question.input.arrivalDayOffset);

  return `${option.text}: the exact interval from ${departure} to ${arrival} is ${question.answerText}. This option is an arithmetic offset of ${toMixedString(offset)} minutes ${direction} the correct interval.`;
}

export function remodelCp001ClockOptionLabels(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const isArrivalOrDeparture = question.input.solveMode === "arrivalClockTime"
    || question.input.solveMode === "departureClockTime";
  const isElapsed = question.input.solveMode === "elapsedClockTime";
  if (!isArrivalOrDeparture && !isElapsed) return question;

  const corrections = question.optionAudit.map((option) => {
    if (option.isCorrect) return null;
    if (isArrivalOrDeparture && option.misconceptionId === "USE_GIVEN_DURATION_AS_ANSWER") {
      return "COPY_GIVEN_CLOCK_TIME" as const;
    }
    if (isElapsed && option.misconceptionId === "MISREAD_TIME") {
      return "ARITHMETIC_OFFSET" as const;
    }
    return null;
  });
  if (!corrections.some((value) => value !== null)) return question;

  const optionAudit = Object.freeze(question.optionAudit.map((option, index): TsdCp001OptionAudit => (
    corrections[index]
      ? Object.freeze({ ...option, misconceptionId: corrections[index]! })
      : option
  )));

  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option, index): TsdCp001OptionAnalysis => {
    const correction = corrections[index];
    if (!correction) return option;
    return Object.freeze({
      ...option,
      misconceptionId: correction,
      reason: correction === "COPY_GIVEN_CLOCK_TIME"
        ? copiedClockReason(question, option)
        : elapsedOffsetReason(question, option),
    });
  }));

  return Object.freeze({
    ...question,
    optionAudit,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
