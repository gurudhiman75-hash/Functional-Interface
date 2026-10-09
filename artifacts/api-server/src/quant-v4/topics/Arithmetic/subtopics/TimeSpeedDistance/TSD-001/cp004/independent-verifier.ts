import {
  add,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp004CoreInput, TsdCp004CoreSolution, TsdCp004CoreSolveMode } from "./relative-motion-foundation";

function need(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): Rational {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value)) throw new Error(`missing ${String(key)}`);
  return value as Rational;
}

function positive(value: Rational, label: string): Rational {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
  return value;
}

function relative(input: TsdCp004CoreInput): Rational {
  const a = positive(need(input, "speedA"), "speedA");
  const b = positive(need(input, "speedB"), "speedB");
  if (input.directionCase === "SAME") return positive(subtract(a, b), "closing speed");
  return add(a, b);
}

function independentlySolve(mode: TsdCp004CoreSolveMode, input: TsdCp004CoreInput): Rational {
  switch (mode) {
    case "findRelativeSpeedOppositeDirections": return add(need(input, "speedA"), need(input, "speedB"));
    case "findRelativeSpeedSameDirection": return positive(subtract(need(input, "speedA"), need(input, "speedB")), "closing speed");
    case "findMeetingTimeFromInitialSeparation": return divide(need(input, "initialSeparation"), relative(input));
    case "findInitialSeparationFromMeetingTime": return multiply(relative(input), need(input, "meetingTime"));
    case "findRelativeSpeedFromMeetingTime": return divide(need(input, "initialSeparation"), need(input, "meetingTime"));
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": {
      const rel = need(input, "relativeSpeed");
      const other = input.unknownBody === "A" ? need(input, "speedB") : need(input, "speedA");
      return input.directionCase === "OPPOSITE" ? positive(subtract(rel, other), "individual speed") : add(rel, other);
    }
    case "findCatchUpTimeFromHeadStartDistance": return divide(need(input, "headStartDistance"), positive(subtract(need(input, "speedA"), need(input, "speedB")), "closing speed"));
    case "findHeadStartDistanceFromCatchUpTime": return multiply(positive(subtract(need(input, "speedA"), need(input, "speedB")), "closing speed"), need(input, "meetingTime"));
    case "findDelayedStartCatchUpTime": return divide(multiply(need(input, "speedB"), need(input, "startDelay")), positive(subtract(need(input, "speedA"), need(input, "speedB")), "closing speed"));
    case "findStartDelayFromCatchUpState": return divide(multiply(positive(subtract(need(input, "speedA"), need(input, "speedB")), "closing speed"), need(input, "meetingTime")), need(input, "speedB"));
    case "findFasterSpeedFromCatchUpState": return add(need(input, "speedB"), divide(need(input, "headStartDistance"), need(input, "meetingTime")));
    case "findSlowerSpeedFromCatchUpState": return positive(subtract(need(input, "speedA"), divide(need(input, "headStartDistance"), need(input, "meetingTime"))), "slower speed");
    case "findSeparationAfterMovingApart": return add(need(input, "initialSeparation"), multiply(add(need(input, "speedA"), need(input, "speedB")), need(input, "elapsedTime")));
    case "findInitialGapFromLaterSeparation": return positive(subtract(need(input, "specifiedSeparation"), multiply(add(need(input, "speedA"), need(input, "speedB")), need(input, "elapsedTime"))), "initial gap");
    case "findMeetingPointDistanceSplit": return divide(multiply(need(input, "routeDistance"), need(input, "speedA")), add(need(input, "speedA"), need(input, "speedB")));
    case "findSpeedRatioFromMeetingPoint": return divide(need(input, "distanceA"), need(input, "distanceB"));
    case "findMeetingPointFromSpeedRatio": return divide(multiply(need(input, "routeDistance"), need(input, "ratioA")), add(need(input, "ratioA"), need(input, "ratioB")));
    case "findUnknownStartPointGap": return multiply(relative(input), need(input, "meetingTime"));
    case "findMeetingClockTime": return add(need(input, "departureMinute"), multiply(divide(need(input, "initialSeparation"), relative(input)), rational(60)));
    case "findDepartureClockTimeFromMeetingState": return subtract(need(input, "meetingClockMinute"), multiply(divide(need(input, "initialSeparation"), relative(input)), rational(60)));
    case "findRelativeDistanceCoveredInGivenTime": return multiply(relative(input), need(input, "elapsedTime"));
    case "findTimeUntilSpecifiedSeparation": {
      const delta = input.directionCase === "SAME"
        ? subtract(need(input, "initialSeparation"), need(input, "specifiedSeparation"))
        : subtract(need(input, "specifiedSeparation"), need(input, "initialSeparation"));
      return divide(positive(delta, "separation change"), relative(input));
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const requiredRelative = divide(need(input, "initialSeparation"), need(input, "targetTime"));
      return input.directionCase === "OPPOSITE"
        ? positive(subtract(requiredRelative, need(input, "speedB")), "required speed")
        : add(requiredRelative, need(input, "speedB"));
    }
  }
}

export function independentlyVerifyCp004(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  candidate: TsdCp004CoreSolution,
): Readonly<{ valid: boolean; errors: readonly string[] }> {
  const errors: string[] = [];
  try {
    const expected = independentlySolve(mode, input);
    if (!equals(expected, candidate.answer)) errors.push("independent answer mismatch");
    if (candidate.solveMode !== mode) errors.push("solve-mode mismatch");
    if (candidate.unit !== "CLOCK_MINUTE" && !isPositive(candidate.answer)) errors.push("non-positive learner answer");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
