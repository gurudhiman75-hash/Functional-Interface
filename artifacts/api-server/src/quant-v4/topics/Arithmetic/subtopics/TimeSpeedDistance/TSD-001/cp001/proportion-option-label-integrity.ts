import { equals, toMixedString } from "../foundation/rational";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

function needsSpeedChangeCorrection(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAudit,
): boolean {
  return question.input.solveMode === "timeByProportion"
    && !option.isCorrect
    && option.misconceptionId === "IGNORE_DISTANCE_CHANGE"
    && equals(question.input.knownDistance, question.input.targetDistance)
    && !equals(question.input.knownSpeed, question.input.targetSpeed);
}

export function remodelCp001ProportionOptionLabels(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (question.input.solveMode !== "timeByProportion") return question;

  const corrections = question.optionAudit.map((option) => needsSpeedChangeCorrection(question, option));
  if (!corrections.some(Boolean)) return question;

  const optionAudit = Object.freeze(question.optionAudit.map((option, index): TsdCp001OptionAudit => (
    corrections[index]
      ? Object.freeze({ ...option, misconceptionId: "IGNORE_SPEED_CHANGE" })
      : option
  )));

  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option, index): TsdCp001OptionAnalysis => {
    if (!corrections[index]) return option;
    return Object.freeze({
      ...option,
      misconceptionId: "IGNORE_SPEED_CHANGE",
      reason: `${option.text}: this keeps the reference time even though the speed changes from ${toMixedString(question.input.knownSpeed)} km/h to ${toMixedString(question.input.targetSpeed)} km/h. For the same ${toMixedString(question.input.targetDistance)} km, use the target speed: ${toMixedString(question.input.targetDistance)} ÷ ${toMixedString(question.input.targetSpeed)} = ${question.answerText}.`,
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
