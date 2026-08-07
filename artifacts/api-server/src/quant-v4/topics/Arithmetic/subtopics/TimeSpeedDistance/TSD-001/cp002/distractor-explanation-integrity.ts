import {
  divide,
  f,
  formatFraction,
  formatRatio,
  reciprocal,
  subtract,
} from "./fraction";
import type {
  TsdCp002GeneratedQuestion,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
} from "./types";

interface DiagnosisCorrection {
  readonly misconceptionId: string;
  readonly reason: string;
}

function percentText(value: ReturnType<typeof f>): string {
  return `${formatFraction(value)}%`;
}

function speedText(value: ReturnType<typeof f>): string {
  return `${formatFraction(value)} km/h`;
}

function shareCorrection(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  if (
    question.input.mode !== "unknownSegmentShareFromAverage"
    || question.solution.answerKind !== "PERCENT"
    || option.isCorrect
    || option.misconceptionId !== "USE_COMPLEMENT"
  ) return null;

  const complement = percentText(subtract(f(100), question.solution.value));
  if (option.text === complement) return null;

  const relation = question.input.shareKind === "DISTANCE"
    ? "reciprocal-speed weighting"
    : "time-weighted speed equation";
  return Object.freeze({
    misconceptionId: "UNSUPPORTED_SHARE_VALUE",
    reason: `⚠️ ${option.text}: this is not the complementary share ${complement}, and it does not satisfy the required ${relation}.`,
  });
}

function ratioCorrection(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  if (
    question.input.mode !== "segmentRatioFromAverageAndSpeeds"
    || question.solution.answerKind !== "RATIO"
    || option.isCorrect
    || option.misconceptionId !== "REVERSE_RATIO"
  ) return null;

  const reversed = formatRatio(reciprocal(question.solution.value));
  if (option.text === reversed) return null;

  const ratioType = question.input.ratioKind === "DISTANCE" ? "distance" : "time";
  return Object.freeze({
    misconceptionId: "UNSUPPORTED_RATIO_VALUE",
    reason: `⚠️ ${option.text}: reversing the correct ratio gives ${reversed}, not this value. It also fails the ${ratioType}-ratio equation for the stated average.`,
  });
}

function remainingSpeedCorrection(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  if (
    question.input.mode !== "requiredRemainingSpeedForTargetAverage"
    || question.solution.answerKind !== "SPEED"
    || option.isCorrect
    || option.misconceptionId !== "COPY_TARGET_AVERAGE"
  ) return null;

  const targetAverage = speedText(question.input.targetAverageKmph);
  if (option.text === targetAverage) return null;

  const remainingDistance = subtract(
    question.input.totalDistanceKm,
    question.input.completedDistanceKm,
  );
  const dividedByCompletedTime = speedText(divide(
    remainingDistance,
    question.input.completedTimeHours,
  ));
  if (option.text === dividedByCompletedTime) {
    return Object.freeze({
      misconceptionId: "DIVIDE_REMAINING_DISTANCE_BY_COMPLETED_TIME",
      reason: `⚠️ ${option.text}: this divides the remaining ${formatFraction(remainingDistance)} km by the ${formatFraction(question.input.completedTimeHours)} hours already used, instead of by the time still available.`,
    });
  }

  return Object.freeze({
    misconceptionId: "UNSUPPORTED_REMAINING_SPEED",
    reason: `⚠️ ${option.text}: this does not copy the target average ${targetAverage}; recomputing the remaining distance and remaining time rules it out.`,
  });
}

function correctionFor(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  return shareCorrection(question, option)
    ?? ratioCorrection(question, option)
    ?? remainingSpeedCorrection(question, option);
}

export function remodelCp002DistractorExplanations(
  question: TsdCp002GeneratedQuestion,
): TsdCp002GeneratedQuestion {
  const corrections = question.optionAudit.map((option) => correctionFor(question, option));
  if (corrections.every((entry) => entry === null)) return question;

  const optionAudit = Object.freeze(question.optionAudit.map((option, index): TsdCp002OptionAudit => {
    const correction = corrections[index];
    return correction
      ? Object.freeze({ ...option, misconceptionId: correction.misconceptionId })
      : option;
  }));
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option, index): TsdCp002OptionAnalysis => {
    const correction = corrections[index];
    return correction
      ? Object.freeze({
          ...option,
          misconceptionId: correction.misconceptionId,
          reason: correction.reason,
        })
      : option;
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
