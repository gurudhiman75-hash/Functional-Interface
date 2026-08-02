import {
  add,
  divide,
  equals,
  f,
  multiply,
  reciprocal,
  subtract,
  sum,
  type Fraction,
} from "./fraction";
import { averageSpeedForSegments, segmentTime } from "./solver";
import type { TsdCp002Input, TsdCp002Solution } from "./types";

export interface VerificationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

function numericValue(solution: TsdCp002Solution): Fraction | null {
  return typeof solution.value === "object" ? solution.value : null;
}

function check(condition: boolean, errors: string[], message: string): void {
  if (!condition) errors.push(message);
}

export function verifyCp002Solution(input: TsdCp002Input, solution: TsdCp002Solution): VerificationResult {
  const errors: string[] = [];
  const value = numericValue(solution);

  switch (input.mode) {
    case "averageSpeedFromSegments": {
      check(solution.answerKind === "SPEED" && value !== null, errors, "Expected speed answer");
      if (value) {
        const totalDistance = sum(input.segments.map((segment) => segment.distanceKm));
        const totalTime = sum(input.segments.map(segmentTime));
        check(equals(multiply(value, totalTime), totalDistance), errors, "Average speed does not reconstruct total distance");
      }
      break;
    }
    case "averagePaceFromSegments": {
      check(solution.answerKind === "PACE" && value !== null, errors, "Expected pace answer");
      if (value) {
        const totalDistance = sum(input.segments.map((segment) => segment.distanceKm));
        const totalMinutes = sum(input.segments.map((segment) => multiply(segment.distanceKm, segment.paceMinutesPerKm)));
        check(equals(multiply(value, totalDistance), totalMinutes), errors, "Average pace does not reconstruct total minutes");
      }
      break;
    }
    case "unknownSegmentSpeedFromAverage": {
      check(solution.answerKind === "SPEED" && value !== null, errors, "Expected missing speed answer");
      if (value) {
        const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
        const reconstructedTime = add(divide(input.knownDistanceKm, input.knownSpeedKmph), divide(input.unknownDistanceKm, value));
        check(equals(divide(totalDistance, reconstructedTime), input.overallAverageKmph), errors, "Missing speed fails overall-average invariant");
      }
      break;
    }
    case "unknownSegmentTimeFromAverage": {
      check(solution.answerKind === "TIME" && value !== null, errors, "Expected missing time answer");
      if (value) {
        const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
        check(equals(divide(totalDistance, add(input.knownTimeHours, value)), input.overallAverageKmph), errors, "Missing time fails overall-average invariant");
      }
      break;
    }
    case "unknownSegmentDistanceFromAverage": {
      check(solution.answerKind === "DISTANCE" && value !== null, errors, "Expected missing distance answer");
      if (value) {
        const totalDistance = add(input.knownDistanceKm, value);
        const totalTime = add(divide(input.knownDistanceKm, input.knownSpeedKmph), divide(value, input.unknownSpeedKmph));
        check(equals(divide(totalDistance, totalTime), input.overallAverageKmph), errors, "Missing distance fails overall-average invariant");
      }
      break;
    }
    case "unknownSegmentShareFromAverage": {
      check(solution.answerKind === "PERCENT" && value !== null, errors, "Expected percentage answer");
      if (value) {
        const share = divide(value, f(100));
        if (input.shareKind === "DISTANCE") {
          const unitDistanceTime = add(divide(share, input.firstSpeedKmph), divide(subtract(f(1), share), input.secondSpeedKmph));
          check(equals(reciprocal(unitDistanceTime), input.overallAverageKmph), errors, "Distance share fails weighted harmonic invariant");
        } else {
          const weightedSpeed = add(multiply(share, input.firstSpeedKmph), multiply(subtract(f(1), share), input.secondSpeedKmph));
          check(equals(weightedSpeed, input.overallAverageKmph), errors, "Time share fails weighted arithmetic invariant");
        }
      }
      break;
    }
    case "unknownRoundTripLegSpeedFromAverage": {
      check(solution.answerKind === "SPEED" && value !== null, errors, "Expected round-trip leg speed");
      if (value) {
        const harmonic = divide(f(2), add(reciprocal(input.knownLegSpeedKmph), reciprocal(value)));
        check(equals(harmonic, input.overallAverageKmph), errors, "Round-trip leg speed fails harmonic-average invariant");
      }
      break;
    }
    case "oneWayDistanceFromRoundTripData": {
      check(solution.answerKind === "DISTANCE" && value !== null, errors, "Expected one-way distance");
      if (value) {
        const time = add(divide(value, input.outwardSpeedKmph), divide(value, input.returnSpeedKmph));
        check(equals(time, input.totalTimeHours), errors, "One-way distance fails round-trip time invariant");
      }
      break;
    }
    case "roundTripTimeFromOneWayDistance": {
      check(solution.answerKind === "TIME" && value !== null, errors, "Expected round-trip time");
      if (value) {
        const expected = add(divide(input.oneWayDistanceKm, input.outwardSpeedKmph), divide(input.oneWayDistanceKm, input.returnSpeedKmph));
        check(equals(value, expected), errors, "Round-trip time does not equal leg-time sum");
      }
      break;
    }
    case "totalDistanceFromAverageAndTime": {
      check(solution.answerKind === "DISTANCE" && value !== null, errors, "Expected total distance");
      if (value) check(equals(value, multiply(input.overallAverageKmph, input.totalTimeHours)), errors, "Total distance fails average × time invariant");
      break;
    }
    case "segmentAllocationFromTotalsAndSpeeds": {
      check((solution.answerKind === "DISTANCE" || solution.answerKind === "TIME") && value !== null, errors, "Expected allocation quantity");
      if (value) {
        let firstTime: Fraction;
        let secondTime: Fraction;
        if (input.requested === "FIRST_TIME") {
          firstTime = value;
          secondTime = subtract(input.totalTimeHours, firstTime);
        } else if (input.requested === "SECOND_TIME") {
          secondTime = value;
          firstTime = subtract(input.totalTimeHours, secondTime);
        } else if (input.requested === "FIRST_DISTANCE") {
          firstTime = divide(value, input.firstSpeedKmph);
          secondTime = subtract(input.totalTimeHours, firstTime);
        } else {
          secondTime = divide(value, input.secondSpeedKmph);
          firstTime = subtract(input.totalTimeHours, secondTime);
        }
        const distance = add(multiply(input.firstSpeedKmph, firstTime), multiply(input.secondSpeedKmph, secondTime));
        check(equals(distance, input.totalDistanceKm), errors, "Segment allocation fails distance/time system");
      }
      break;
    }
    case "segmentRatioFromAverageAndSpeeds": {
      check(solution.answerKind === "RATIO" && value !== null, errors, "Expected ratio answer");
      if (value) {
        if (input.ratioKind === "TIME") {
          const reconstructed = divide(add(multiply(input.firstSpeedKmph, value), input.secondSpeedKmph), add(value, f(1)));
          check(equals(reconstructed, input.overallAverageKmph), errors, "Time ratio fails weighted-speed invariant");
        } else {
          const totalTime = add(divide(value, input.firstSpeedKmph), reciprocal(input.secondSpeedKmph));
          const reconstructed = divide(add(value, f(1)), totalTime);
          check(equals(reconstructed, input.overallAverageKmph), errors, "Distance ratio fails harmonic-weight invariant");
        }
      }
      break;
    }
    case "requiredRemainingSpeedForTargetAverage": {
      check(solution.answerKind === "SPEED" && value !== null, errors, "Expected remaining speed");
      if (value) {
        const remainingDistance = subtract(input.totalDistanceKm, input.completedDistanceKm);
        const totalTime = add(input.completedTimeHours, divide(remainingDistance, value));
        check(equals(divide(input.totalDistanceKm, totalTime), input.targetAverageKmph), errors, "Remaining speed misses target average");
      }
      break;
    }
    case "compareSegmentedJourneyPlans": {
      check(solution.answerKind === "CHOICE", errors, "Expected plan choice");
      const a = averageSpeedForSegments(input.planA);
      const b = averageSpeedForSegments(input.planB);
      const expected = equals(a, b) ? "Both plans have the same average speed" : (a.n * b.d > b.n * a.d ? "Plan A" : "Plan B");
      check(solution.value === expected, errors, "Plan comparison is incorrect");
      break;
    }
    case "classifyAverageSpeedState": {
      check(solution.answerKind === "CLASSIFICATION", errors, "Expected classification");
      const expected = input.supplied === "CONTRADICTORY" ? "IMPOSSIBLE" : input.supplied === "AVERAGE_ONLY" ? "INDETERMINATE" : "UNIQUE";
      check(solution.value === expected, errors, "Average-state classification is incorrect");
      break;
    }
    case "verifyAverageSpeedClaim": {
      check(solution.answerKind === "BOOLEAN", errors, "Expected boolean verification");
      check(solution.value === equals(averageSpeedForSegments(input.segments), input.claimedAverageKmph), errors, "Claim verification is incorrect");
      break;
    }
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
