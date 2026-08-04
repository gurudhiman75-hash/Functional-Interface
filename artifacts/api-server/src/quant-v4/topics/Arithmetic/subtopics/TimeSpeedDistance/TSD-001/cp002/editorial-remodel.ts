import { editorialDifficulty, type TsdEditorialDifficulty } from "../editorial-contract";
import {
  add,
  divide,
  f,
  formatFraction,
  formatRatio,
  multiply,
  reciprocal,
  subtract,
  sum,
  type Fraction,
} from "./fraction";
import { averageSpeedForSegments, segmentTime, totalSegmentDistance, totalSegmentTime } from "./solver";
import type { Segment, TsdCp002Input, TsdCp002LearnerSolveMode, TsdCp002Solution } from "./types";

const POSITION_PERMUTATIONS = Object.freeze([
  Object.freeze([0, 3, 1, 2] as const),
  Object.freeze([2, 0, 3, 1] as const),
  Object.freeze([1, 2, 0, 3] as const),
  Object.freeze([3, 1, 2, 0] as const),
  Object.freeze([0, 2, 3, 1] as const),
  Object.freeze([2, 3, 1, 0] as const),
]);

const q = (value: Fraction): string => formatFraction(value);
const quantity = (value: Fraction, singular: string, plural = `${singular}s`): string =>
  `${q(value)} ${value.n === value.d ? singular : plural}`;
const hours = (value: Fraction): string => quantity(value, "hour");
const minutes = (value: Fraction): string => quantity(value, "minute");

function numeric(solution: TsdCp002Solution): Fraction {
  if (typeof solution.value !== "object") throw new Error("Expected a numeric CP-002 solution");
  return solution.value;
}

function authorityOrdinal(provisionalAuthorityId: string): number {
  return Number(provisionalAuthorityId.slice(-3));
}

function trailingOrdinal(seed: string): number {
  const match = seed.match(/(\d+)$/);
  if (!match) throw new Error(`CP-002 seed has no trailing ordinal: ${seed}`);
  return Number(match[1]);
}

export function cp002CorrectIndex(provisionalAuthorityId: string, seed: string): number {
  const ordinal = trailingOrdinal(seed);
  const slot = ordinal % 4;
  const block = Math.floor(ordinal / 4);
  const permutationIndex = (authorityOrdinal(provisionalAuthorityId) - 1 + block * 5) % POSITION_PERMUTATIONS.length;
  return POSITION_PERMUTATIONS[permutationIndex][slot];
}

export function cp002Difficulty(mode: TsdCp002LearnerSolveMode, input: TsdCp002Input): TsdEditorialDifficulty {
  switch (mode) {
    case "averageSpeedFromSegments":
    case "averagePaceFromSegments":
    case "roundTripTimeFromOneWayDistance":
    case "totalDistanceFromAverageAndTime":
      return editorialDifficulty("Medium", 2);
    case "unknownSegmentSpeedFromAverage":
    case "unknownSegmentTimeFromAverage":
    case "unknownRoundTripLegSpeedFromAverage":
    case "oneWayDistanceFromRoundTripData":
    case "requiredRemainingSpeedForTargetAverage":
    case "compareSegmentedJourneyPlans":
      return editorialDifficulty("Medium", 3);
    case "unknownSegmentDistanceFromAverage":
      return editorialDifficulty("Hard", 4);
    case "unknownSegmentShareFromAverage":
      return editorialDifficulty(input.shareKind === "DISTANCE" ? "Hard" : "Medium", input.shareKind === "DISTANCE" ? 4 : 3);
    case "segmentAllocationFromTotalsAndSpeeds":
    case "segmentRatioFromAverageAndSpeeds":
      return editorialDifficulty("Hard", 4);
  }
}

function segmentSummary(segments: readonly Segment[]): readonly string[] {
  return segments.map((segment, index) => {
    const time = segmentTime(segment);
    return `Segment ${index + 1} time = ${q(segment.distanceKm)} ÷ ${q(segment.speedKmph)} = ${hours(time)}.`;
  });
}

export function cp002Shortcut(input: TsdCp002Input, fallback: string): string {
  if (input.mode === "segmentRatioFromAverageAndSpeeds") {
    return input.ratioKind === "TIME"
      ? "⚡ Exam Speed Trick: For time ratio at the lower and higher speeds, use (higher speed − average):(average − lower speed)."
      : "⚡ Exam Speed Trick: For distance ratio at the lower and higher speeds, use lower speed × (higher speed − average) : higher speed × (average − lower speed).";
  }
  if (input.mode === "unknownSegmentShareFromAverage") {
    return input.shareKind === "DISTANCE"
      ? "⚡ Exam Speed Trick: A distance share must weight reciprocal speeds: 1/A = x/v₁ + (1−x)/v₂."
      : "⚡ Exam Speed Trick: A time share weights speeds directly: A = xv₁ + (1−x)v₂.";
  }
  return fallback;
}

export function cp002WorkingLines(input: TsdCp002Input, solution: TsdCp002Solution, fallback: readonly string[]): readonly string[] {
  switch (input.mode) {
    case "averageSpeedFromSegments": {
      const totalDistance = totalSegmentDistance(input.segments);
      const totalTime = totalSegmentTime(input.segments);
      return Object.freeze([
        ...segmentSummary(input.segments),
        `Total distance = ${input.segments.map((segment) => q(segment.distanceKm)).join(" + ")} = ${q(totalDistance)} km.`,
        `Total travelling time = ${input.segments.map((segment) => q(segmentTime(segment))).join(" + ")} = ${hours(totalTime)}.`,
        `Average speed = ${q(totalDistance)} ÷ ${q(totalTime)} = ${q(numeric(solution))} km/h.`,
      ]);
    }
    case "averagePaceFromSegments": {
      const segmentMinutes = input.segments.map((segment) => multiply(segment.distanceKm, segment.paceMinutesPerKm));
      const totalMinutes = sum(segmentMinutes);
      const totalDistance = sum(input.segments.map((segment) => segment.distanceKm));
      return Object.freeze([
        ...input.segments.map((segment, index) => `Segment ${index + 1} time = ${q(segment.distanceKm)} × ${q(segment.paceMinutesPerKm)} = ${minutes(segmentMinutes[index])}.`),
        `Total time = ${segmentMinutes.map(q).join(" + ")} = ${minutes(totalMinutes)}.`,
        `Total distance = ${input.segments.map((segment) => q(segment.distanceKm)).join(" + ")} = ${q(totalDistance)} km.`,
        `Average pace = ${q(totalMinutes)} ÷ ${q(totalDistance)} = ${q(numeric(solution))} minutes/km.`,
      ]);
    }
    case "unknownSegmentSpeedFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const allowedTotalTime = divide(totalDistance, input.overallAverageKmph);
      const knownTime = divide(input.knownDistanceKm, input.knownSpeedKmph);
      const remainingTime = subtract(allowedTotalTime, knownTime);
      return Object.freeze([
        `Total distance = ${q(input.knownDistanceKm)} + ${q(input.unknownDistanceKm)} = ${q(totalDistance)} km.`,
        `Allowed total time = ${q(totalDistance)} ÷ ${q(input.overallAverageKmph)} = ${hours(allowedTotalTime)}.`,
        `Known-leg time = ${q(input.knownDistanceKm)} ÷ ${q(input.knownSpeedKmph)} = ${hours(knownTime)}.`,
        `Unknown-leg time = ${q(allowedTotalTime)} − ${q(knownTime)} = ${hours(remainingTime)}.`,
        `Unknown speed = ${q(input.unknownDistanceKm)} ÷ ${q(remainingTime)} = ${q(numeric(solution))} km/h.`,
      ]);
    }
    case "unknownSegmentTimeFromAverage": {
      const totalDistance = add(input.knownDistanceKm, input.unknownDistanceKm);
      const totalTime = divide(totalDistance, input.overallAverageKmph);
      const missingTime = subtract(totalTime, input.knownTimeHours);
      return Object.freeze([
        `Total distance = ${q(totalDistance)} km.`,
        `Complete journey time = ${q(totalDistance)} ÷ ${q(input.overallAverageKmph)} = ${hours(totalTime)}.`,
        `Known time = ${hours(input.knownTimeHours)}.`,
        `Missing time = ${q(totalTime)} − ${q(input.knownTimeHours)} = ${hours(missingTime)}.`,
      ]);
    }
    case "unknownSegmentDistanceFromAverage": {
      const knownTime = divide(input.knownDistanceKm, input.knownSpeedKmph);
      const coefficient = subtract(f(1), divide(input.overallAverageKmph, input.unknownSpeedKmph));
      const rightSide = subtract(multiply(input.overallAverageKmph, knownTime), input.knownDistanceKm);
      return Object.freeze([
        "Let the unknown second distance be x km.",
        `Known-leg time = ${q(input.knownDistanceKm)} ÷ ${q(input.knownSpeedKmph)} = ${hours(knownTime)}.`,
        `(${q(input.knownDistanceKm)} + x) ÷ (${q(knownTime)} + x/${q(input.unknownSpeedKmph)}) = ${q(input.overallAverageKmph)}.`,
        `${q(input.knownDistanceKm)} + x = ${q(input.overallAverageKmph)} × (${q(knownTime)} + x/${q(input.unknownSpeedKmph)}).`,
        `Collecting terms gives ${q(coefficient)}x = ${q(rightSide)}.`,
        `x = ${q(rightSide)} ÷ ${q(coefficient)} = ${q(numeric(solution))} km.`,
      ]);
    }
    case "unknownSegmentShareFromAverage": {
      const share = divide(numeric(solution), f(100));
      if (input.shareKind === "DISTANCE") {
        const coefficient = subtract(reciprocal(input.firstSpeedKmph), reciprocal(input.secondSpeedKmph));
        const rightSide = subtract(reciprocal(input.overallAverageKmph), reciprocal(input.secondSpeedKmph));
        return Object.freeze([
          `Let x be the distance fraction at ${q(input.firstSpeedKmph)} km/h.`,
          `1/${q(input.overallAverageKmph)} = x/${q(input.firstSpeedKmph)} + (1 − x)/${q(input.secondSpeedKmph)}.`,
          `x × ${q(coefficient)} = ${q(rightSide)}.`,
          `x = ${q(rightSide)} ÷ ${q(coefficient)} = ${q(share)}.`,
          `Percentage = ${q(share)} × 100 = ${q(numeric(solution))}%.`,
        ]);
      }
      const numerator = subtract(input.secondSpeedKmph, input.overallAverageKmph);
      const denominator = subtract(input.secondSpeedKmph, input.firstSpeedKmph);
      return Object.freeze([
        `Let x be the time fraction at ${q(input.firstSpeedKmph)} km/h.`,
        `${q(input.overallAverageKmph)} = ${q(input.firstSpeedKmph)}x + ${q(input.secondSpeedKmph)}(1 − x).`,
        `${q(denominator)}x = ${q(numerator)}.`,
        `x = ${q(numerator)} ÷ ${q(denominator)} = ${q(share)}.`,
        `Percentage = ${q(share)} × 100 = ${q(numeric(solution))}%.`,
      ]);
    }
    case "unknownRoundTripLegSpeedFromAverage": {
      const numerator = multiply(input.overallAverageKmph, input.knownLegSpeedKmph);
      const denominator = subtract(multiply(f(2), input.knownLegSpeedKmph), input.overallAverageKmph);
      return Object.freeze([
        "Let the unknown equal-distance leg speed be x km/h.",
        `${q(input.overallAverageKmph)} = 2 × ${q(input.knownLegSpeedKmph)} × x ÷ (${q(input.knownLegSpeedKmph)} + x).`,
        `${q(input.overallAverageKmph)} × (${q(input.knownLegSpeedKmph)} + x) = ${q(multiply(f(2), input.knownLegSpeedKmph))}x.`,
        `${q(numerator)} = ${q(denominator)}x.`,
        `x = ${q(numerator)} ÷ ${q(denominator)} = ${q(numeric(solution))} km/h.`,
      ]);
    }
    case "oneWayDistanceFromRoundTripData": {
      const reciprocalSum = add(reciprocal(input.outwardSpeedKmph), reciprocal(input.returnSpeedKmph));
      return Object.freeze([
        "Let the one-way distance be d km.",
        `Outward time = d/${q(input.outwardSpeedKmph)} and return time = d/${q(input.returnSpeedKmph)}.`,
        `d(${q(reciprocal(input.outwardSpeedKmph))} + ${q(reciprocal(input.returnSpeedKmph))}) = ${q(input.totalTimeHours)}.`,
        `The reciprocal-speed sum is ${q(reciprocalSum)}.`,
        `d = ${q(input.totalTimeHours)} ÷ ${q(reciprocalSum)} = ${q(numeric(solution))} km.`,
      ]);
    }
    case "roundTripTimeFromOneWayDistance": {
      const outwardTime = divide(input.oneWayDistanceKm, input.outwardSpeedKmph);
      const returnTime = divide(input.oneWayDistanceKm, input.returnSpeedKmph);
      return Object.freeze([
        `Outward time = ${q(input.oneWayDistanceKm)} ÷ ${q(input.outwardSpeedKmph)} = ${hours(outwardTime)}.`,
        `Return time = ${q(input.oneWayDistanceKm)} ÷ ${q(input.returnSpeedKmph)} = ${hours(returnTime)}.`,
        `Round-trip time = ${q(outwardTime)} + ${q(returnTime)} = ${hours(numeric(solution))}.`,
      ]);
    }
    case "totalDistanceFromAverageAndTime":
      return Object.freeze([
        "Total distance = overall average × complete travelling time.",
        `= ${q(input.overallAverageKmph)} × ${q(input.totalTimeHours)}.`,
        `= ${q(numeric(solution))} km.`,
      ]);
    case "segmentAllocationFromTotalsAndSpeeds": {
      const firstTime = divide(subtract(multiply(input.secondSpeedKmph, input.totalTimeHours), input.totalDistanceKm), subtract(input.secondSpeedKmph, input.firstSpeedKmph));
      const secondTime = subtract(input.totalTimeHours, firstTime);
      const firstDistance = multiply(input.firstSpeedKmph, firstTime);
      const secondDistance = multiply(input.secondSpeedKmph, secondTime);
      const finalLine = input.requested === "FIRST_TIME"
        ? `Required first time = ${hours(firstTime)}.`
        : input.requested === "SECOND_TIME"
          ? `Required second time = ${hours(secondTime)}.`
          : input.requested === "FIRST_DISTANCE"
            ? `Required first distance = ${q(firstDistance)} km.`
            : `Required second distance = ${q(secondDistance)} km.`;
      return Object.freeze([
        `t₁ + t₂ = ${q(input.totalTimeHours)}.`,
        `${q(input.firstSpeedKmph)}t₁ + ${q(input.secondSpeedKmph)}t₂ = ${q(input.totalDistanceKm)}.`,
        `Substitute t₂ = ${q(input.totalTimeHours)} − t₁.`,
        `t₁ = (${q(input.secondSpeedKmph)} × ${q(input.totalTimeHours)} − ${q(input.totalDistanceKm)}) ÷ (${q(input.secondSpeedKmph)} − ${q(input.firstSpeedKmph)}) = ${hours(firstTime)}.`,
        `t₂ = ${q(input.totalTimeHours)} − ${q(firstTime)} = ${hours(secondTime)}.`,
        `Distances are ${q(firstDistance)} km and ${q(secondDistance)} km.`,
        finalLine,
      ]);
    }
    case "segmentRatioFromAverageAndSpeeds": {
      const v1 = input.firstSpeedKmph;
      const v2 = input.secondSpeedKmph;
      const average = input.overallAverageKmph;
      if (input.ratioKind === "TIME") {
        const firstPart = subtract(v2, average);
        const secondPart = subtract(average, v1);
        return Object.freeze([
          `${q(average)}(t₁ + t₂) = ${q(v1)}t₁ + ${q(v2)}t₂.`,
          `(${q(average)} − ${q(v1)})t₁ = (${q(v2)} − ${q(average)})t₂.`,
          `t₁:t₂ = (${q(v2)} − ${q(average)}):(${q(average)} − ${q(v1)}).`,
          `Substituting values gives ${q(firstPart)}:${q(secondPart)}.`,
          `The simplified time ratio is ${formatRatio(numeric(solution))}.`,
        ]);
      }
      const firstPart = multiply(v1, subtract(v2, average));
      const secondPart = multiply(v2, subtract(average, v1));
      return Object.freeze([
        `${q(average)} = (d₁ + d₂) ÷ (d₁/${q(v1)} + d₂/${q(v2)}).`,
        `d₁:d₂ = ${q(v1)}(${q(v2)} − ${q(average)}) : ${q(v2)}(${q(average)} − ${q(v1)}).`,
        `Substituting values gives ${q(firstPart)}:${q(secondPart)}.`,
        `The simplified distance ratio is ${formatRatio(numeric(solution))}.`,
      ]);
    }
    case "requiredRemainingSpeedForTargetAverage": {
      const targetTime = divide(input.totalDistanceKm, input.targetAverageKmph);
      const remainingDistance = subtract(input.totalDistanceKm, input.completedDistanceKm);
      const remainingTime = subtract(targetTime, input.completedTimeHours);
      return Object.freeze([
        `Target total time = ${q(input.totalDistanceKm)} ÷ ${q(input.targetAverageKmph)} = ${hours(targetTime)}.`,
        `Time already used = ${hours(input.completedTimeHours)}.`,
        `Remaining time = ${q(targetTime)} − ${q(input.completedTimeHours)} = ${hours(remainingTime)}.`,
        `Remaining distance = ${q(input.totalDistanceKm)} − ${q(input.completedDistanceKm)} = ${q(remainingDistance)} km.`,
        `Required speed = ${q(remainingDistance)} ÷ ${q(remainingTime)} = ${q(numeric(solution))} km/h.`,
      ]);
    }
    case "compareSegmentedJourneyPlans": {
      const distanceA = totalSegmentDistance(input.planA);
      const timeA = totalSegmentTime(input.planA);
      const averageA = averageSpeedForSegments(input.planA);
      const distanceB = totalSegmentDistance(input.planB);
      const timeB = totalSegmentTime(input.planB);
      const averageB = averageSpeedForSegments(input.planB);
      return Object.freeze([
        ...segmentSummary(input.planA).map((line) => `Plan A — ${line}`),
        `Plan A: total distance ${q(distanceA)} km, total time ${hours(timeA)}, average ${q(averageA)} km/h.`,
        ...segmentSummary(input.planB).map((line) => `Plan B — ${line}`),
        `Plan B: total distance ${q(distanceB)} km, total time ${hours(timeB)}, average ${q(averageB)} km/h.`,
        `Therefore, ${solution.value}.`,
      ]);
    }
    default:
      return fallback;
  }
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function semanticCp002OptionKey(text: string): string {
  const ratio = text.match(/^(\d+):(\d+)$/);
  if (ratio) {
    const first = Number(ratio[1]);
    const second = Number(ratio[2]);
    const divisor = gcd(first, second);
    return `RATIO:${first / divisor}:${second / divisor}`;
  }
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  if (normalized === "plan a and plan b are equal" || normalized === "both plans have the same average speed") return "PLAN_TIE";
  return normalized;
}
