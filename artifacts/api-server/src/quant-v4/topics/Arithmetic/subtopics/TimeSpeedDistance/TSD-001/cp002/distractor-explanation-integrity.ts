import {
  compare,
  divide,
  f,
  formatFraction,
  formatRatio,
  reciprocal,
  subtract,
  sum,
} from "./fraction";
import type {
  Segment,
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
    reason: `⚠️ ${option.text}: the complementary share is ${complement}, not this value; it also fails the stated ${relation}.`,
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
    reason: `⚠️ ${option.text}: reversing the correct ratio gives ${reversed}, not this value; it also fails the ${ratioType}-ratio equation.`,
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
      reason: `⚠️ ${option.text}: this divides the remaining ${formatFraction(remainingDistance)} km by the ${formatFraction(question.input.completedTimeHours)} hours already used, not by the time left.`,
    });
  }

  const allowedTotalTime = divide(
    question.input.totalDistanceKm,
    question.input.targetAverageKmph,
  );
  const remainingTime = subtract(allowedTotalTime, question.input.completedTimeHours);
  const requiredSpeed = divide(remainingDistance, remainingTime);
  return Object.freeze({
    misconceptionId: "UNSUPPORTED_REMAINING_SPEED",
    reason: `⚠️ ${option.text}: remaining speed must be ${formatFraction(remainingDistance)} ÷ ${formatFraction(remainingTime)} = ${formatFraction(requiredSpeed)} km/h.`,
  });
}

function planTotals(segments: readonly Segment[]): {
  readonly distance: ReturnType<typeof f>;
  readonly time: ReturnType<typeof f>;
  readonly average: ReturnType<typeof f>;
} {
  const distance = sum(segments.map((segment) => segment.distanceKm));
  const time = sum(segments.map((segment) => divide(segment.distanceKm, segment.speedKmph)));
  return Object.freeze({ distance, time, average: divide(distance, time) });
}

function planCorrection(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  if (
    question.input.mode !== "compareSegmentedJourneyPlans"
    || question.solution.answerKind !== "CHOICE"
  ) return null;

  const planA = planTotals(question.input.planA);
  const planB = planTotals(question.input.planB);
  const ledger = `A: ${formatFraction(planA.distance)} ÷ ${formatFraction(planA.time)} = ${formatFraction(planA.average)} km/h; B: ${formatFraction(planB.distance)} ÷ ${formatFraction(planB.time)} = ${formatFraction(planB.average)} km/h.`;
  const comparison = compare(planA.average, planB.average);

  if (option.isCorrect) {
    const conclusion = comparison > 0
      ? "Plan A has the higher average."
      : comparison < 0
        ? "Plan B has the higher average."
        : "The averages are equal.";
    return Object.freeze({
      misconceptionId: "CORRECT",
      reason: `✅ ${option.text}: ${ledger} ${conclusion}`,
    });
  }

  let conclusion: string;
  if (option.text === "Plan A") {
    conclusion = comparison === 0
      ? `Both averages equal ${formatFraction(planA.average)} km/h, so Plan A alone is not higher.`
      : `Plan A is not the higher-average plan.`;
  } else if (option.text === "Plan B") {
    conclusion = comparison === 0
      ? `Both averages equal ${formatFraction(planA.average)} km/h, so Plan B alone is not higher.`
      : `Plan B is not the higher-average plan.`;
  } else if (/same average/i.test(option.text)) {
    conclusion = `${formatFraction(planA.average)} and ${formatFraction(planB.average)} km/h are not equal.`;
  } else {
    conclusion = "Both complete averages are calculable from the given distances and speeds.";
  }

  return Object.freeze({
    misconceptionId: option.misconceptionId,
    reason: `⚠️ ${option.text}: ${ledger} ${conclusion}`,
  });
}

function correctionFor(
  question: TsdCp002GeneratedQuestion,
  option: TsdCp002OptionAudit,
): DiagnosisCorrection | null {
  return planCorrection(question, option)
    ?? shareCorrection(question, option)
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
