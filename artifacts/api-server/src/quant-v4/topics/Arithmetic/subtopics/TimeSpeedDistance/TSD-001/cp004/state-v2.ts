import { add, divide, equals, multiply, rational, subtract } from "../foundation/rational";
import { generateCp004State } from "./generator";
import type { TsdCp004GeneratedState } from "./runtime-types";

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

function normalizeTwoToOnePair(input: TsdCp004GeneratedState["input"], directionCase: "OPPOSITE" | "SAME") {
  const baseSpeed = input.speedB ?? rational(30);
  return Object.freeze({ ...input, speedA: multiply(baseSpeed, rational(2)), speedB: baseSpeed, directionCase });
}

function reviewDuration(index: number) {
  return rational([1, 2, 3, 4, 5, 6][index % 6]!);
}

export function generateCp004StateV2(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004State(authorityKey, seed);
  const index = ordinal(seed);
  const directionCase = index % 2 === 0 ? "OPPOSITE" as const : "SAME" as const;
  let input = base.input;

  if (input.speedA && input.speedB && equals(input.speedA, input.speedB)) input = Object.freeze({ ...input, speedA: add(input.speedA, rational(6)) });

  if (base.solveMode === "findRelativeSpeedOppositeDirections" || base.solveMode === "findRelativeSpeedSameDirection") {
    input = normalizeTwoToOnePair(input, base.solveMode === "findRelativeSpeedSameDirection" ? "SAME" : "OPPOSITE");
  }

  if (base.solveMode === "findMeetingTimeFromInitialSeparation" || base.solveMode === "findInitialSeparationFromMeetingTime" || base.solveMode === "findUnknownStartPointGap" || base.solveMode === "findRelativeDistanceCoveredInGivenTime") {
    input = normalizeTwoToOnePair(input, input.directionCase ?? directionCase);
  }

  if (base.solveMode === "findCatchUpTimeFromHeadStartDistance" || base.solveMode === "findHeadStartDistanceFromCatchUpTime" || base.solveMode === "findDelayedStartCatchUpTime" || base.solveMode === "findStartDelayFromCatchUpState") {
    input = normalizeTwoToOnePair(input, "SAME");
  }

  if (base.solveMode === "findRelativeSpeedFromMeetingTime") {
    const knownSpeeds = [24, 30, 36, 40, 45, 48] as const;
    input = Object.freeze({ ...input, speedB: rational(knownSpeeds[index % knownSpeeds.length]), directionCase });
  }

  if (base.solveMode === "findIndividualSpeedFromRelativeSpeedAndOtherSpeed" && input.relativeSpeed) {
    input = input.directionCase === "OPPOSITE"
      ? Object.freeze({ ...input, speedB: divide(input.relativeSpeed, rational(3)), unknownBody: "A" as const })
      : Object.freeze({ ...input, speedB: multiply(input.relativeSpeed, rational(2)), unknownBody: "A" as const, directionCase: "SAME" as const });
  }

  if (base.solveMode === "findFasterSpeedFromCatchUpState" && input.speedB && input.meetingTime) {
    const closing = divide(input.speedB, rational(2));
    input = Object.freeze({ ...input, headStartDistance: multiply(closing, input.meetingTime) });
  }

  if (base.solveMode === "findSlowerSpeedFromCatchUpState" && input.speedA && input.meetingTime) {
    const closing = divide(input.speedA, rational(3));
    input = Object.freeze({ ...input, headStartDistance: multiply(closing, input.meetingTime) });
  }

  if (base.solveMode === "findSeparationAfterMovingApart" && input.elapsedTime) {
    input = normalizeTwoToOnePair(input, "OPPOSITE");
    const increase = multiply(add(input.speedA!, input.speedB!), input.elapsedTime);
    input = Object.freeze({ ...input, initialSeparation: increase });
  }

  if (base.solveMode === "findInitialGapFromLaterSeparation" && input.elapsedTime) {
    input = normalizeTwoToOnePair(input, "OPPOSITE");
    const increase = multiply(add(input.speedA!, input.speedB!), input.elapsedTime);
    const initial = multiply(increase, rational(2));
    input = Object.freeze({ ...input, specifiedSeparation: add(initial, increase) });
  }

  if (base.solveMode === "findTimeUntilSpecifiedSeparation") {
    const duration = reviewDuration(index);
    input = normalizeTwoToOnePair(input, input.directionCase ?? directionCase);
    if (input.directionCase === "SAME") {
      const closing = subtract(input.speedA!, input.speedB!);
      const change = multiply(closing, duration);
      input = Object.freeze({ ...input, initialSeparation: multiply(change, rational(2)), specifiedSeparation: change });
    } else {
      const opening = add(input.speedA!, input.speedB!);
      const change = multiply(opening, duration);
      const initial = divide(change, rational(2));
      input = Object.freeze({ ...input, initialSeparation: initial, specifiedSeparation: add(initial, change) });
    }
  }

  if (base.solveMode === "findMeetingPointDistanceSplit" && input.routeDistance) {
    const unit = rational([24, 30, 36, 42, 48, 54][index % 6]!);
    input = Object.freeze({ ...input, speedA: multiply(unit, rational(2)), speedB: unit });
  }

  if (base.solveMode === "findMeetingPointFromSpeedRatio" && input.routeDistance) {
    input = Object.freeze({ ...input, ratioA: rational(2), ratioB: rational(1) });
  }

  if (base.solveMode === "findSpeedRatioFromMeetingPoint") {
    const scale = rational([20, 30, 40, 50, 60, 70][index % 6]!);
    input = Object.freeze({ ...input, distanceA: multiply(scale, rational(2)), distanceB: scale });
  }

  if (authorityKey === "requiredSpeedForTargetMeeting" && input.initialSeparation && input.targetTime) {
    const requiredRelative = divide(input.initialSeparation, input.targetTime);
    input = Object.freeze({ ...input, speedB: divide(requiredRelative, rational(3)) });
  }

  return Object.freeze({ ...base, representation: `${base.solveMode}:${index % 6}`, input });
}
