import { equals, toMixedString } from "../foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
} from "./runtime-types";

export function remodelFinalProportionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (question.input.solveMode !== "timeByProportion") return question;

  const input = question.input;
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option): TsdCp001OptionAnalysis => {
    if (option.isCorrect || option.misconceptionId !== "IGNORE_SPEED_CHANGE") return option;

    const reason = equals(input.knownDistance, input.targetDistance)
      ? `⚠️ ${option.text}: this keeps the reference time at ${toMixedString(input.knownSpeed)} km/h although the target speed is ${toMixedString(input.targetSpeed)} km/h. For the same ${toMixedString(input.targetDistance)} km, ${toMixedString(input.targetDistance)} ÷ ${toMixedString(input.targetSpeed)} = ${question.answerText}.`
      : `⚠️ ${option.text}: ${toMixedString(input.targetDistance)} ÷ ${toMixedString(input.knownSpeed)} uses the reference speed. Use the target speed ${toMixedString(input.targetSpeed)} km/h: ${toMixedString(input.targetDistance)} ÷ ${toMixedString(input.targetSpeed)} = ${question.answerText}.`;

    return Object.freeze({ ...option, reason });
  }));

  return Object.freeze({
    ...question,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
