import {
  ONE,
  ZERO,
  add,
  divide,
  equals,
  f,
  isPositive,
  multiply,
  reciprocal,
  subtract,
  sum,
  type Fraction,
} from "./fraction";
import type {
  Segment,
  TsdCp002Input,
  TsdCp002Solution,
} from "./types";

export function segmentTime(segment: Segment): Fraction {
  return divide(segment.distanceKm, segment.speedKmph);
}

export function totalSegmentDistance(segments: readonly Segment[]): Fraction {
  return sum(segments.map((segment) => segment.distanceKm));
}

export function totalSegmentTime(segments: readonly Segment[]): Fraction {
  return sum(segments.map(segmentTime));
}

export function averageSpeedForSegments(segments: readonly Segment[]): Fraction {
  if (segments.length < 1) throw new Error("At least one segment is required");
  const distance = totalSegmentDistance(segments);
  const time = totalSegmentTime(segments);
  if (!isPositive(distance) || !isPositive(time)) throw new Error("Segment distance and time must be positive");
  return divide(distance, time);
}

function numeric(answerKind: Extract<TsdCp002Solution["answerKind"], "SPEED" | "PACE" | "TIME" | "DISTANCE" | "PERCENT" | "RATIO">, value: Fraction): TsdCp002Solution {
  if (!isPositive(value)) throw new Error(`Non-positive ${answerKind} solution`);
  return Object.freeze({ answerKind, value });
}

export function solveCp002(input: TsdCp002Input): TsdCp002Solution {
  switch (input.mode) {
    case "averageSpeedFromSegments":
      return numeric("SPEED", averageSpeedForSegments(input.segments));

    case "averagePaceFromSegments": {
      const totalDistance = sum(input.segments.map((segment) => segment.distanceKm));
      const totalMinutes = sum(input.segments.map((segment) => multiply(segment.distanceKm, segment.paceMinutesPerKm)));
      return numeric("PACE", divide(totalMinutes, totalDistance));
    }

    case "unknownSegmentSpeedFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const totalTime = divide(totalDistance, input.overallAverageKmph);
      const knownTime = divide(input.knownDistanceKm, input.knownSpeedKmph);
      const unknownTime = subtract(totalTime, knownTime);
      return numeric("SPEED", divide(input.unknownDistanceKm, unknownTime));
    }

    case "unknownSegmentTimeFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const totalTime = divide(totalDistance, input.overallAverageKmph);
      return numeric("TIME", subtract(totalTime, input.knownTimeHours));
    }

    case "unknownSegmentDistanceFromAverage": {
      const numerator = subtract(
        divide(input.knownDistanceKm, input.knownSpeedKmph),
        divide(input.knownDistanceKm, input.overallAverageKmph),
      );
      const denominator = subtract(reciprocal(input.overallAverageKmph), reciprocal(input.unknownSpeedKmph));
      return numeric("DISTANCE", divide(numerator, denominator));
    }

    case "unknownSegmentShareFromAverage": {
      const share = input.shareKind === "DISTANCE"
        ? divide(
            subtract(reciprocal(input.overallAverageKmph), reciprocal(input.secondSpeedKmph)),
            subtract(reciprocal(input.firstSpeedKmph), reciprocal(input.secondSpeedKmph)),
          )
        : divide(
            subtract(input.secondSpeedKmph, input.overallAverageKmph),
            subtract(input.secondSpeedKmph, input.firstSpeedKmph),
          );
      return numeric("PERCENT", multiply(share, f(100)));
    }

    case "unknownRoundTripLegSpeedFromAverage": {
      const numerator = multiply(input.overallAverageKmph, input.knownLegSpeedKmph);
      const denominator = subtract(multiply(f(2), input.knownLegSpeedKmph), input.overallAverageKmph);
      return numeric("SPEED", divide(numerator, denominator));
    }

    case "oneWayDistanceFromRoundTripData": {
      const reciprocalSpeedSum = add(reciprocal(input.outwardSpeedKmph), reciprocal(input.returnSpeedKmph));
      return numeric("DISTANCE", divide(input.totalTimeHours, reciprocalSpeedSum));
    }

    case "roundTripTimeFromOneWayDistance":
      return numeric("TIME", add(
        divide(input.oneWayDistanceKm, input.outwardSpeedKmph),
        divide(input.oneWayDistanceKm, input.returnSpeedKmph),
      ));

    case "totalDistanceFromAverageAndTime":
      return numeric("DISTANCE", multiply(input.overallAverageKmph, input.totalTimeHours));

    case "segmentAllocationFromTotalsAndSpeeds": {
      const firstTime = divide(
        subtract(multiply(input.secondSpeedKmph, input.totalTimeHours), input.totalDistanceKm),
        subtract(input.secondSpeedKmph, input.firstSpeedKmph),
      );
      const secondTime = subtract(input.totalTimeHours, firstTime);
      const firstDistance = multiply(input.firstSpeedKmph, firstTime);
      const secondDistance = multiply(input.secondSpeedKmph, secondTime);
      switch (input.requested) {
        case "FIRST_DISTANCE": return numeric("DISTANCE", firstDistance);
        case "SECOND_DISTANCE": return numeric("DISTANCE", secondDistance);
        case "FIRST_TIME": return numeric("TIME", firstTime);
        case "SECOND_TIME": return numeric("TIME", secondTime);
      }
    }

    case "segmentRatioFromAverageAndSpeeds": {
      const ratio = input.ratioKind === "DISTANCE"
        ? divide(
            subtract(reciprocal(input.overallAverageKmph), reciprocal(input.secondSpeedKmph)),
            subtract(reciprocal(input.firstSpeedKmph), reciprocal(input.overallAverageKmph)),
          )
        : divide(
            subtract(input.secondSpeedKmph, input.overallAverageKmph),
            subtract(input.overallAverageKmph, input.firstSpeedKmph),
          );
      return numeric("RATIO", ratio);
    }

    case "requiredRemainingSpeedForTargetAverage": {
      const targetTotalTime = divide(input.totalDistanceKm, input.targetAverageKmph);
      const remainingTime = subtract(targetTotalTime, input.completedTimeHours);
      const remainingDistance = subtract(input.totalDistanceKm, input.completedDistanceKm);
      return numeric("SPEED", divide(remainingDistance, remainingTime));
    }

    case "compareSegmentedJourneyPlans": {
      const averageA = averageSpeedForSegments(input.planA);
      const averageB = averageSpeedForSegments(input.planB);
      const value = equals(averageA, averageB)
        ? "Both plans have the same average speed" as const
        : (averageA.n * averageB.d > averageB.n * averageA.d ? "Plan A" as const : "Plan B" as const);
      return Object.freeze({ answerKind: "CHOICE", value });
    }

    case "classifyAverageSpeedState": {
      const value = input.supplied === "CONTRADICTORY"
        ? "IMPOSSIBLE" as const
        : input.supplied === "AVERAGE_ONLY"
          ? "INDETERMINATE" as const
          : "UNIQUE" as const;
      return Object.freeze({ answerKind: "CLASSIFICATION", value });
    }

    case "verifyAverageSpeedClaim":
      return Object.freeze({
        answerKind: "BOOLEAN",
        value: equals(averageSpeedForSegments(input.segments), input.claimedAverageKmph),
      });
  }
}

export function solutionEquals(a: TsdCp002Solution, b: TsdCp002Solution): boolean {
  if (a.answerKind !== b.answerKind) return false;
  if ("value" in a && "value" in b) {
    if (typeof a.value === "object" && typeof b.value === "object") return equals(a.value, b.value);
    return a.value === b.value;
  }
  return false;
}

export function assertPositiveInput(input: TsdCp002Input): void {
  const fractions: Fraction[] = [];
  const collect = (value: unknown): void => {
    if (value && typeof value === "object" && "n" in value && "d" in value) fractions.push(value as Fraction);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (value && typeof value === "object") Object.values(value as Record<string, unknown>).forEach(collect);
  };
  collect(input);
  if (fractions.some((value) => !isPositive(value))) throw new Error("All CP-002 quantitative inputs must be positive");
}
