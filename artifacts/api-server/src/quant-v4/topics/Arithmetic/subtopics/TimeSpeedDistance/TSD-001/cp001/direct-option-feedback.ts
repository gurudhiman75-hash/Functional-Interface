import {
  absRational,
  compare,
  divide,
  fromDecimalString,
  multiply,
  subtract,
  toMixedString,
  type Rational,
} from "../foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

function displayedNumber(text: string, unit: "m/s" | "seconds"): Rational {
  const suffix = ` ${unit}`;
  if (!text.endsWith(suffix)) {
    throw new Error(`Expected ${unit} option, received ${text}`);
  }
  return fromDecimalString(text.slice(0, -suffix.length));
}

function speedReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode !== "speedFromDistanceAndTime") return option.reason;
  const proposedSpeed = displayedNumber(option.text, "m/s");
  const exactSpeed = divide(question.input.distanceMetres, question.input.durationSeconds);
  const impliedDistance = multiply(proposedSpeed, question.input.durationSeconds);
  const offset = absRational(subtract(proposedSpeed, exactSpeed));
  const direction = compare(proposedSpeed, exactSpeed) > 0 ? "above" : "below";
  return `${option.text}: At this speed for ${toMixedString(question.input.durationSeconds)} seconds, the distance would be ${toMixedString(impliedDistance)} metres, not ${toMixedString(question.input.distanceMetres)} metres. The exact check is ${toMixedString(question.input.distanceMetres)} ÷ ${toMixedString(question.input.durationSeconds)} = ${question.answerText}. This option is an arithmetic offset of ${toMixedString(offset)} m/s ${direction} the correct speed.`;
}

function timeReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode !== "timeFromDistanceAndSpeed") return option.reason;
  const proposedTime = displayedNumber(option.text, "seconds");
  const exactTime = divide(question.input.distanceMetres, question.input.speedMps);
  const impliedDistance = multiply(question.input.speedMps, proposedTime);
  const offset = absRational(subtract(proposedTime, exactTime));
  const direction = compare(proposedTime, exactTime) > 0 ? "above" : "below";
  return `${option.text}: At ${toMixedString(question.input.speedMps)} m/s, this time covers ${toMixedString(impliedDistance)} metres, not ${toMixedString(question.input.distanceMetres)} metres. The exact check is ${toMixedString(question.input.distanceMetres)} ÷ ${toMixedString(question.input.speedMps)} = ${question.answerText}. This option is an arithmetic offset of ${toMixedString(offset)} seconds ${direction} the correct time.`;
}

export function remodelCp001DirectOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (
    question.input.solveMode !== "speedFromDistanceAndTime"
    && question.input.solveMode !== "timeFromDistanceAndSpeed"
  ) return question;

  const optionAudit = Object.freeze(question.optionAudit.map((option): TsdCp001OptionAudit => (
    option.isCorrect
      ? option
      : Object.freeze({ ...option, misconceptionId: "ARITHMETIC_OFFSET" })
  )));

  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option): TsdCp001OptionAnalysis => {
    if (option.isCorrect) return option;
    const reason = question.input.solveMode === "speedFromDistanceAndTime"
      ? speedReason(question, option)
      : timeReason(question, option);
    return Object.freeze({
      ...option,
      misconceptionId: "ARITHMETIC_OFFSET",
      reason,
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
