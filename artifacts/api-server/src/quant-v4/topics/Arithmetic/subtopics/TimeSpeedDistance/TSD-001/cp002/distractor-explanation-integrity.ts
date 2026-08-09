import { calibrateTsdDifficulty } from "../difficulty-calibration";
import {
  add,
  compare,
  divide,
  f,
  formatFraction,
  formatRatio,
  multiply,
  subtract,
  sum,
  type Fraction,
} from "./fraction";
import type {
  Segment,
  TsdCp002GeneratedQuestion,
  TsdCp002OptionAnalysis,
  TsdCp002OptionAudit,
} from "./types";

function scalarSolution(question: TsdCp002GeneratedQuestion): Fraction {
  const solution = question.solution;
  if (
    solution.answerKind === "CHOICE"
    || solution.answerKind === "CLASSIFICATION"
    || solution.answerKind === "BOOLEAN"
  ) {
    throw new Error(`${question.questionLanguageId}: expected a scalar solution`);
  }
  return solution.value;
}

function value(value: Fraction): string {
  return formatFraction(value);
}

function planTotals(segments: readonly Segment[]): {
  readonly distance: Fraction;
  readonly time: Fraction;
  readonly average: Fraction;
} {
  const distance = sum(segments.map((segment) => segment.distanceKm));
  const time = sum(segments.map((segment) => divide(segment.distanceKm, segment.speedKmph)));
  return Object.freeze({ distance, time, average: divide(distance, time) });
}

function definingEquation(question: TsdCp002GeneratedQuestion): string {
  const input = question.input;
  switch (input.mode) {
    case "averageSpeedFromSegments": {
      const distance = sum(input.segments.map((segment) => segment.distanceKm));
      const time = sum(input.segments.map((segment) => divide(segment.distanceKm, segment.speedKmph)));
      return `Total distance ${value(distance)} km ÷ total time ${value(time)} hours = ${value(divide(distance, time))} km/h.`;
    }
    case "averagePaceFromSegments": {
      const distance = sum(input.segments.map((segment) => segment.distanceKm));
      const minutes = sum(input.segments.map((segment) => multiply(segment.distanceKm, segment.paceMinutesPerKm)));
      return `Total time ${value(minutes)} minutes ÷ total distance ${value(distance)} km = ${value(divide(minutes, distance))} minutes/km.`;
    }
    case "unknownSegmentSpeedFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const allowedTime = divide(totalDistance, input.overallAverageKmph);
      const knownTime = divide(input.knownDistanceKm, input.knownSpeedKmph);
      const remainingTime = subtract(allowedTime, knownTime);
      const speed = divide(input.unknownDistanceKm, remainingTime);
      return `${value(totalDistance)} ÷ ${value(input.overallAverageKmph)} = ${value(allowedTime)} hours; ${value(allowedTime)} - ${value(knownTime)} = ${value(remainingTime)} hours; ${value(input.unknownDistanceKm)} ÷ ${value(remainingTime)} = ${value(speed)} km/h.`;
    }
    case "unknownSegmentTimeFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const allowedTime = divide(totalDistance, input.overallAverageKmph);
      const remainingTime = subtract(allowedTime, input.knownTimeHours);
      return `${value(totalDistance)} ÷ ${value(input.overallAverageKmph)} = ${value(allowedTime)} hours; ${value(allowedTime)} - ${value(input.knownTimeHours)} = ${value(remainingTime)} hours.`;
    }
    case "unknownSegmentDistanceFromAverage": {
      const distance = scalarSolution(question);
      return `Let x be the second distance: (${value(input.knownDistanceKm)} + x) ÷ (${value(input.knownDistanceKm)} ÷ ${value(input.knownSpeedKmph)} + x ÷ ${value(input.unknownSpeedKmph)}) = ${value(input.overallAverageKmph)}; x = ${value(distance)} km.`;
    }
    case "unknownSegmentShareFromAverage": {
      const share = scalarSolution(question);
      if (input.shareKind === "TIME") {
        return `Let s be the second-speed time share: ((100 - s) × ${value(input.firstSpeedKmph)} + s × ${value(input.secondSpeedKmph)}) ÷ 100 = ${value(input.overallAverageKmph)}; s = ${value(share)}%.`;
      }
      return `For 100 km, 100 ÷ ((100 - s) ÷ ${value(input.firstSpeedKmph)} + s ÷ ${value(input.secondSpeedKmph)}) = ${value(input.overallAverageKmph)}; s = ${value(share)}%.`;
    }
    case "unknownRoundTripLegSpeedFromAverage": {
      const unknown = scalarSolution(question);
      return `2 × ${value(input.knownLegSpeedKmph)} × x ÷ (${value(input.knownLegSpeedKmph)} + x) = ${value(input.overallAverageKmph)}; x = ${value(unknown)} km/h.`;
    }
    case "oneWayDistanceFromRoundTripData": {
      const distance = scalarSolution(question);
      return `x ÷ ${value(input.outwardSpeedKmph)} + x ÷ ${value(input.returnSpeedKmph)} = ${value(input.totalTimeHours)}; x = ${value(distance)} km.`;
    }
    case "roundTripTimeFromOneWayDistance": {
      const outward = divide(input.oneWayDistanceKm, input.outwardSpeedKmph);
      const returned = divide(input.oneWayDistanceKm, input.returnSpeedKmph);
      return `${value(input.oneWayDistanceKm)} ÷ ${value(input.outwardSpeedKmph)} + ${value(input.oneWayDistanceKm)} ÷ ${value(input.returnSpeedKmph)} = ${value(add(outward, returned))} hours.`;
    }
    case "totalDistanceFromAverageAndTime":
      return `${value(input.overallAverageKmph)} × ${value(input.totalTimeHours)} = ${value(multiply(input.overallAverageKmph, input.totalTimeHours))} km.`;
    case "segmentAllocationFromTotalsAndSpeeds": {
      const firstTime = divide(
        subtract(multiply(input.secondSpeedKmph, input.totalTimeHours), input.totalDistanceKm),
        subtract(input.secondSpeedKmph, input.firstSpeedKmph),
      );
      const secondTime = subtract(input.totalTimeHours, firstTime);
      const firstDistance = multiply(input.firstSpeedKmph, firstTime);
      const secondDistance = multiply(input.secondSpeedKmph, secondTime);
      const requested = {
        FIRST_DISTANCE: `${value(firstDistance)} km`,
        SECOND_DISTANCE: `${value(secondDistance)} km`,
        FIRST_TIME: `${value(firstTime)} hours`,
        SECOND_TIME: `${value(secondTime)} hours`,
      }[input.requested];
      return `${value(firstTime)} + ${value(secondTime)} = ${value(input.totalTimeHours)} hours and ${value(firstDistance)} + ${value(secondDistance)} = ${value(input.totalDistanceKm)} km; requested value = ${requested}.`;
    }
    case "segmentRatioFromAverageAndSpeeds": {
      if (input.ratioKind === "TIME") {
        const ratio = divide(
          subtract(input.secondSpeedKmph, input.overallAverageKmph),
          subtract(input.overallAverageKmph, input.firstSpeedKmph),
        );
        return `Time ratio = (${value(input.secondSpeedKmph)} - ${value(input.overallAverageKmph)}):(${value(input.overallAverageKmph)} - ${value(input.firstSpeedKmph)}) = ${formatRatio(ratio)}.`;
      }
      const ratio = divide(
        multiply(input.firstSpeedKmph, subtract(input.secondSpeedKmph, input.overallAverageKmph)),
        multiply(input.secondSpeedKmph, subtract(input.overallAverageKmph, input.firstSpeedKmph)),
      );
      return `Distance ratio = ${value(input.firstSpeedKmph)} × (${value(input.secondSpeedKmph)} - ${value(input.overallAverageKmph)}):${value(input.secondSpeedKmph)} × (${value(input.overallAverageKmph)} - ${value(input.firstSpeedKmph)}) = ${formatRatio(ratio)}.`;
    }
    case "requiredRemainingSpeedForTargetAverage": {
      const allowedTime = divide(input.totalDistanceKm, input.targetAverageKmph);
      const remainingTime = subtract(allowedTime, input.completedTimeHours);
      const remainingDistance = subtract(input.totalDistanceKm, input.completedDistanceKm);
      const speed = divide(remainingDistance, remainingTime);
      return `${value(input.totalDistanceKm)} ÷ ${value(input.targetAverageKmph)} = ${value(allowedTime)} hours; ${value(allowedTime)} - ${value(input.completedTimeHours)} = ${value(remainingTime)} hours; ${value(remainingDistance)} ÷ ${value(remainingTime)} = ${value(speed)} km/h.`;
    }
    case "compareSegmentedJourneyPlans": {
      const planA = planTotals(input.planA);
      const planB = planTotals(input.planB);
      const comparison = compare(planA.average, planB.average);
      const conclusion = comparison > 0
        ? "Plan A has the higher average"
        : comparison < 0
          ? "Plan B has the higher average"
          : "Both plans have the same average speed";
      return `Plan A: ${value(planA.distance)} ÷ ${value(planA.time)} = ${value(planA.average)} km/h; Plan B: ${value(planB.distance)} ÷ ${value(planB.time)} = ${value(planB.average)} km/h; ${conclusion}.`;
    }
    case "classifyAverageSpeedState":
    case "verifyAverageSpeedClaim":
      throw new Error(`${question.questionLanguageId}: internal CP-002 mode reached learner remediation`);
  }
}

function failureId(question: TsdCp002GeneratedQuestion): string {
  return `FAILS_${question.solveMode.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()}_EQUATION`;
}

export function remodelCp002DistractorExplanations(
  question: TsdCp002GeneratedQuestion,
): TsdCp002GeneratedQuestion {
  const equation = definingEquation(question);
  const optionAudit = Object.freeze(question.optionAudit.map((option): TsdCp002OptionAudit => Object.freeze({
    ...option,
    misconceptionId: option.isCorrect ? "CORRECT" : failureId(question),
  })));
  const optionAnalysis = Object.freeze(question.explanation.optionAnalysis.map((option): TsdCp002OptionAnalysis => {
    const isCorrect = option.isCorrect;
    return Object.freeze({
      ...option,
      misconceptionId: isCorrect ? "CORRECT" : failureId(question),
      reason: isCorrect
        ? `✅ ${option.text}: ${equation}`
        : `⚠️ ${option.text}: ${equation} The defining equation gives ${question.answerText}, not ${option.text}.`,
    });
  }));

  return Object.freeze({
    ...question,
    difficulty: calibrateTsdDifficulty(question.difficulty),
    optionAudit,
    explanation: Object.freeze({
      ...question.explanation,
      optionAnalysis,
    }),
  });
}
