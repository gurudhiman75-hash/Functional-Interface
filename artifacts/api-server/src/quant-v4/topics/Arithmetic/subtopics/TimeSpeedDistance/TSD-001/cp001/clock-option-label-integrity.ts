import { formatClock, formatExamNumber } from "./runtime-support";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

function copiedClockReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode === "arrivalClockTime") {
    const departure = formatClock(question.input.departureMinuteOfDay, 0n);
    return `${option.text}: this copies the departure clock time and ignores the ${formatExamNumber(question.input.durationMinutes)}-minute journey. Move forward: ${departure} + ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}.`;
  }

  if (question.input.solveMode === "departureClockTime") {
    const arrival = formatClock(question.input.arrivalMinuteOfDay, question.input.arrivalDayOffset);
    return `${option.text}: this copies the arrival clock time and ignores the ${formatExamNumber(question.input.durationMinutes)}-minute journey. Move backward: ${arrival} − ${formatExamNumber(question.input.durationMinutes)} minutes = ${question.answerText}.`;
  }

  return option.reason;
}

export function remodelCp001ClockOptionLabels(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  const isArrivalOrDeparture = question.input.solveMode === "arrivalClockTime"
    || question.input.solveMode === "departureClockTime";
  if (!isArrivalOrDeparture) return question;

  const corrections = question.optionAudit.map((option) => (
    !option.isCorrect && option.misconceptionId === "USE_GIVEN_DURATION_AS_ANSWER"
      ? "COPY_GIVEN_CLOCK_TIME" as const
      : null
  ));
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
      reason: copiedClockReason(question, option),
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
