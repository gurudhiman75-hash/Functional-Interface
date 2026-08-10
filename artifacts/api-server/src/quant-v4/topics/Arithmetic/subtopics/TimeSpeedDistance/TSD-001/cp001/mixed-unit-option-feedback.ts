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
import {
  convertDistance,
  convertTime,
  type DistanceUnit,
  type SpeedUnit,
  type TimeUnit,
} from "../foundation/units";
import type {
  TsdCp001GeneratedQuestion,
  TsdCp001OptionAnalysis,
  TsdCp001OptionAudit,
} from "./runtime-types";

interface SpeedBasis {
  readonly distanceUnit: DistanceUnit;
  readonly timeUnit: TimeUnit;
  readonly distanceLabel: string;
  readonly timeLabel: string;
  readonly speedLabel: string;
}

function basisFor(unit: SpeedUnit): SpeedBasis {
  switch (unit) {
    case "KMPH":
      return { distanceUnit: "KM", timeUnit: "HOUR", distanceLabel: "km", timeLabel: "hours", speedLabel: "km/h" };
    case "MPS":
      return { distanceUnit: "M", timeUnit: "SECOND", distanceLabel: "m", timeLabel: "seconds", speedLabel: "m/s" };
    case "M_PER_MINUTE":
      return { distanceUnit: "M", timeUnit: "MINUTE", distanceLabel: "m", timeLabel: "minutes", speedLabel: "m/min" };
    case "KM_PER_MINUTE":
      return { distanceUnit: "KM", timeUnit: "MINUTE", distanceLabel: "km", timeLabel: "minutes", speedLabel: "km/min" };
  }
}

function displayedSpeed(text: string, speedLabel: string): Rational {
  const suffix = ` ${speedLabel}`;
  if (!text.endsWith(suffix)) {
    throw new Error(`Expected ${speedLabel} option, received ${text}`);
  }
  return fromDecimalString(text.slice(0, -suffix.length));
}

function arithmeticOffsetReason(
  question: TsdCp001GeneratedQuestion,
  option: TsdCp001OptionAnalysis,
): string {
  if (question.input.solveMode !== "speedFromMixedUnits") return option.reason;
  const basis = basisFor(question.input.outputUnit);
  const convertedDistance = convertDistance(
    question.input.distance,
    question.input.distanceUnit,
    basis.distanceUnit,
  );
  const convertedTime = convertTime(
    question.input.duration,
    question.input.timeUnit,
    basis.timeUnit,
  );
  const proposedSpeed = displayedSpeed(option.text, basis.speedLabel);
  const exactSpeed = divide(convertedDistance, convertedTime);
  const impliedDistance = multiply(proposedSpeed, convertedTime);
  const offset = absRational(subtract(proposedSpeed, exactSpeed));
  const direction = compare(proposedSpeed, exactSpeed) > 0 ? "above" : "below";

  return `${option.text}: after conversion, the journey is ${toMixedString(convertedDistance)} ${basis.distanceLabel} in ${toMixedString(convertedTime)} ${basis.timeLabel}. At this speed, ${toMixedString(proposedSpeed)} × ${toMixedString(convertedTime)} = ${toMixedString(impliedDistance)} ${basis.distanceLabel}, not ${toMixedString(convertedDistance)} ${basis.distanceLabel}. The exact division is ${toMixedString(convertedDistance)} ÷ ${toMixedString(convertedTime)} = ${question.answerText}, so this option is an arithmetic offset of ${toMixedString(offset)} ${basis.speedLabel} ${direction} the correct value.`;
}

export function remodelCp001MixedUnitOptionFeedback(
  question: TsdCp001GeneratedQuestion,
): TsdCp001GeneratedQuestion {
  if (question.input.solveMode !== "speedFromMixedUnits") return question;

  const corrections = question.optionAudit.map((option) => (
    !option.isCorrect
    && (option.misconceptionId === "MISREAD_TIME" || option.misconceptionId === "MISREAD_DISTANCE")
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
