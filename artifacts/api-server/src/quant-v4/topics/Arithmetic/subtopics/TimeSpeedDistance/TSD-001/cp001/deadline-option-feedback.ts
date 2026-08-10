import {
  absRational,
  add,
  compare,
  divide,
  fromDecimalString,
  multiply,
  rational,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

const MINUTES_PER_DAY = rational(1440);
const MINUTES_PER_HOUR = rational(60);

function displayedSpeed(text: string): Rational {
  const suffix = " km/h";
  if (!text.endsWith(suffix)) {
    throw new Error(`Expected km/h option, received ${text}`);
  }
  return fromDecimalString(text.slice(0, -suffix.length));
}

function availableHours(question: TsdCp001GeneratedQuestion): Rational {
  if (question.input.solveMode !== "requiredUniformSpeedForDeadline") {
    throw new Error(`Expected deadline-speed question, received ${question.input.solveMode}`);
  }
  const absoluteDeadline = add(
    question.input.deadlineMinuteOfDay,
    multiply(rational(question.input.deadlineDayOffset), MINUTES_PER_DAY),
  );
  return divide(subtract(absoluteDeadline, question.input.departureMinuteOfDay), MINUTES_PER_HOUR);
}

function arithmeticOffsetReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode !== "requiredUniformSpeedForDeadline") return option.reason;
  const hours = availableHours(question);
  const proposedSpeed = displayedSpeed(option.text);
  const exactSpeed = divide(question.input.distance, hours);
  const impliedDistance = multiply(proposedSpeed, hours);
  const offset = absRational(subtract(proposedSpeed, exactSpeed));
  const direction = compare(proposedSpeed, exactSpeed) > 0 ? "above" : "below";

  return `${option.text}: the available time is ${toMixedString(hours)} hours. At this speed, the vehicle would cover ${toMixedString(impliedDistance)} km, not ${toMixedString(question.input.distance)} km. The exact division is ${toMixedString(question.input.distance)} ÷ ${toMixedString(hours)} = ${question.answerText}, so this option is an arithmetic offset of ${toMixedString(offset)} km/h ${direction} the correct value.`;
}

export function remodelCp001DeadlineOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (question.input.solveMode !== "requiredUniformSpeedForDeadline") return question;

  const corrections = question.optionAudit.map((option) => (
    !option.isCorrect && option.misconceptionId === "DIVISION_ERROR"
  ));
  if (!corrections.some(Boolean)) return question;

  const optionAudit = Object.freeze(question.optionAudit.map((option, index): TsdCp001OptionAudit => (
    corrections[index]
      ? Object.freeze({ ...option, misconceptionId: "ARITHMETIC_OFFSET" })
      : option
  )));

  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option, index): TsdCp001OptionAnalysis => (
    corrections[index]
      ? Object.freeze({
          ...option,
          misconceptionId: "ARITHMETIC_OFFSET",
          reason: arithmeticOffsetReason(question, option),
        })
      : option
  )));

  return Object.freeze({
    ...question,
    optionAudit,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
