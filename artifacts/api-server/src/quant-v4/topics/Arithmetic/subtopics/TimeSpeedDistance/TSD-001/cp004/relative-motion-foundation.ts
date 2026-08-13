import {
  add,
  compare,
  divide,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";

export type TsdCp004CoreSolveMode =
  | "findRelativeSpeedOppositeDirections"
  | "findRelativeSpeedSameDirection"
  | "findMeetingTimeFromInitialSeparation"
  | "findInitialSeparationFromMeetingTime"
  | "findRelativeSpeedFromMeetingTime"
  | "findIndividualSpeedFromRelativeSpeedAndOtherSpeed"
  | "findCatchUpTimeFromHeadStartDistance"
  | "findHeadStartDistanceFromCatchUpTime"
  | "findDelayedStartCatchUpTime"
  | "findStartDelayFromCatchUpState"
  | "findFasterSpeedFromCatchUpState"
  | "findSlowerSpeedFromCatchUpState"
  | "findSeparationAfterMovingApart"
  | "findInitialGapFromLaterSeparation"
  | "findMeetingPointDistanceSplit"
  | "findSpeedRatioFromMeetingPoint"
  | "findMeetingPointFromSpeedRatio"
  | "findUnknownStartPointGap"
  | "findMeetingClockTime"
  | "findDepartureClockTimeFromMeetingState"
  | "findRelativeDistanceCoveredInGivenTime"
  | "findTimeUntilSpecifiedSeparation"
  | "findSpeedNeededToAvoidOrCauseMeeting";

export interface TsdCp004CoreInput {
  readonly speedA?: Rational;
  readonly speedB?: Rational;
  readonly relativeSpeed?: Rational;
  readonly initialSeparation?: Rational;
  readonly meetingTime?: Rational;
  readonly elapsedTime?: Rational;
  readonly headStartDistance?: Rational;
  readonly startDelay?: Rational;
  readonly distanceA?: Rational;
  readonly distanceB?: Rational;
  readonly routeDistance?: Rational;
  readonly ratioA?: Rational;
  readonly ratioB?: Rational;
  readonly departureMinute?: Rational;
  readonly meetingClockMinute?: Rational;
  readonly specifiedSeparation?: Rational;
  readonly targetTime?: Rational;
  readonly directionCase?: "OPPOSITE" | "SAME";
  readonly unknownBody?: "A" | "B";
}

export interface TsdCp004CoreSolution {
  readonly solveMode: TsdCp004CoreSolveMode;
  readonly answer: Rational;
  readonly unit: "SPEED" | "TIME" | "DISTANCE" | "RATIO" | "CLOCK_MINUTE";
  readonly invariant: "SUM_SPEED" | "CLOSING_SPEED" | "RELATIVE_DISTANCE" | "MEETING_POINT_PROPORTION" | "CLOCK_SHIFT";
  readonly equation: string;
}

function need(input: TsdCp004CoreInput, key: keyof TsdCp004CoreInput): Rational {
  const value = input[key];
  if (!value || typeof value !== "object" || !("numerator" in value) || !("denominator" in value)) {
    throw new Error(`CP-004 missing rational input: ${String(key)}`);
  }
  return value as Rational;
}

function positive(value: Rational, label: string): Rational {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
  return value;
}

function closing(speedA: Rational, speedB: Rational): Rational {
  const value = subtract(speedA, speedB);
  if (!isPositive(value)) throw new Error("catch-up requires faster speed > slower speed");
  return value;
}

function relativeForCase(input: TsdCp004CoreInput): Rational {
  const a = positive(need(input, "speedA"), "speedA");
  const b = positive(need(input, "speedB"), "speedB");
  return input.directionCase === "SAME" ? closing(a, b) : add(a, b);
}

function solution(
  solveMode: TsdCp004CoreSolveMode,
  answer: Rational,
  unit: TsdCp004CoreSolution["unit"],
  invariant: TsdCp004CoreSolution["invariant"],
  equation: string,
): TsdCp004CoreSolution {
  return Object.freeze({ solveMode, answer, unit, invariant, equation });
}

export function solveCp004Core(
  solveMode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
): TsdCp004CoreSolution {
  switch (solveMode) {
    case "findRelativeSpeedOppositeDirections": {
      const answer = add(positive(need(input, "speedA"), "speedA"), positive(need(input, "speedB"), "speedB"));
      return solution(solveMode, answer, "SPEED", "SUM_SPEED", "relative speed = speed A + speed B");
    }
    case "findRelativeSpeedSameDirection": {
      const answer = closing(positive(need(input, "speedA"), "speedA"), positive(need(input, "speedB"), "speedB"));
      return solution(solveMode, answer, "SPEED", "CLOSING_SPEED", "closing speed = faster speed − slower speed");
    }
    case "findMeetingTimeFromInitialSeparation": {
      const answer = divide(positive(need(input, "initialSeparation"), "initialSeparation"), relativeForCase(input));
      return solution(solveMode, answer, "TIME", input.directionCase === "SAME" ? "CLOSING_SPEED" : "SUM_SPEED", "meeting time = initial gap / relative speed");
    }
    case "findInitialSeparationFromMeetingTime": {
      const answer = multiply(relativeForCase(input), positive(need(input, "meetingTime"), "meetingTime"));
      return solution(solveMode, answer, "DISTANCE", "RELATIVE_DISTANCE", "initial gap = relative speed × meeting time");
    }
    case "findRelativeSpeedFromMeetingTime": {
      const answer = divide(positive(need(input, "initialSeparation"), "initialSeparation"), positive(need(input, "meetingTime"), "meetingTime"));
      return solution(solveMode, answer, "SPEED", "RELATIVE_DISTANCE", "relative speed = initial gap / meeting time");
    }
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": {
      const relative = positive(need(input, "relativeSpeed"), "relativeSpeed");
      const other = positive(input.unknownBody === "A" ? need(input, "speedB") : need(input, "speedA"), "otherSpeed");
      const answer = input.directionCase === "OPPOSITE" ? subtract(relative, other) : add(relative, other);
      return solution(solveMode, positive(answer, "individual speed"), "SPEED", input.directionCase === "OPPOSITE" ? "SUM_SPEED" : "CLOSING_SPEED", input.directionCase === "OPPOSITE" ? "unknown speed = relative speed − other speed" : "faster speed = closing speed + slower speed");
    }
    case "findCatchUpTimeFromHeadStartDistance": {
      const answer = divide(positive(need(input, "headStartDistance"), "headStartDistance"), closing(need(input, "speedA"), need(input, "speedB")));
      return solution(solveMode, answer, "TIME", "CLOSING_SPEED", "catch-up time = head-start distance / closing speed");
    }
    case "findHeadStartDistanceFromCatchUpTime": {
      const answer = multiply(closing(need(input, "speedA"), need(input, "speedB")), positive(need(input, "meetingTime"), "meetingTime"));
      return solution(solveMode, answer, "DISTANCE", "CLOSING_SPEED", "head-start distance = closing speed × catch-up time");
    }
    case "findDelayedStartCatchUpTime": {
      const headStart = multiply(positive(need(input, "speedB"), "slower speed"), positive(need(input, "startDelay"), "startDelay"));
      const answer = divide(headStart, closing(need(input, "speedA"), need(input, "speedB")));
      return solution(solveMode, answer, "TIME", "CLOSING_SPEED", "catch-up time after faster start = slower speed × delay / closing speed");
    }
    case "findStartDelayFromCatchUpState": {
      const answer = divide(multiply(closing(need(input, "speedA"), need(input, "speedB")), positive(need(input, "meetingTime"), "meetingTime")), positive(need(input, "speedB"), "slower speed"));
      return solution(solveMode, answer, "TIME", "CLOSING_SPEED", "start delay = closing speed × pursuit time / slower speed");
    }
    case "findFasterSpeedFromCatchUpState": {
      const closingSpeed = divide(positive(need(input, "headStartDistance"), "headStartDistance"), positive(need(input, "meetingTime"), "meetingTime"));
      const answer = add(positive(need(input, "speedB"), "slower speed"), closingSpeed);
      return solution(solveMode, answer, "SPEED", "CLOSING_SPEED", "faster speed = slower speed + head-start distance / catch-up time");
    }
    case "findSlowerSpeedFromCatchUpState": {
      const closingSpeed = divide(positive(need(input, "headStartDistance"), "headStartDistance"), positive(need(input, "meetingTime"), "meetingTime"));
      const answer = subtract(positive(need(input, "speedA"), "faster speed"), closingSpeed);
      return solution(solveMode, positive(answer, "slower speed"), "SPEED", "CLOSING_SPEED", "slower speed = faster speed − head-start distance / catch-up time");
    }
    case "findSeparationAfterMovingApart": {
      const answer = add(positive(need(input, "initialSeparation"), "initialSeparation"), multiply(add(need(input, "speedA"), need(input, "speedB")), positive(need(input, "elapsedTime"), "elapsedTime")));
      return solution(solveMode, answer, "DISTANCE", "RELATIVE_DISTANCE", "later separation = initial separation + sum speed × time");
    }
    case "findInitialGapFromLaterSeparation": {
      const answer = subtract(positive(need(input, "specifiedSeparation"), "later separation"), multiply(add(need(input, "speedA"), need(input, "speedB")), positive(need(input, "elapsedTime"), "elapsedTime")));
      return solution(solveMode, positive(answer, "initial gap"), "DISTANCE", "RELATIVE_DISTANCE", "initial separation = later separation − sum speed × time");
    }
    case "findMeetingPointDistanceSplit": {
      const total = positive(need(input, "routeDistance"), "routeDistance");
      const a = positive(need(input, "speedA"), "speedA");
      const b = positive(need(input, "speedB"), "speedB");
      const answer = divide(multiply(total, a), add(a, b));
      return solution(solveMode, answer, "DISTANCE", "MEETING_POINT_PROPORTION", "distance from A = total distance × speed A / (speed A + speed B)");
    }
    case "findSpeedRatioFromMeetingPoint": {
      const a = positive(need(input, "distanceA"), "distanceA");
      const b = positive(need(input, "distanceB"), "distanceB");
      return solution(solveMode, divide(a, b), "RATIO", "MEETING_POINT_PROPORTION", "speed A / speed B = distance A / distance B at first meeting");
    }
    case "findMeetingPointFromSpeedRatio": {
      const total = positive(need(input, "routeDistance"), "routeDistance");
      const a = positive(need(input, "ratioA"), "ratioA");
      const b = positive(need(input, "ratioB"), "ratioB");
      return solution(solveMode, divide(multiply(total, a), add(a, b)), "DISTANCE", "MEETING_POINT_PROPORTION", "distance from A = total distance × ratio A / (ratio A + ratio B)");
    }
    case "findUnknownStartPointGap": {
      const answer = multiply(relativeForCase(input), positive(need(input, "meetingTime"), "meetingTime"));
      return solution(solveMode, answer, "DISTANCE", "RELATIVE_DISTANCE", "unknown starting gap = relative speed × meeting time");
    }
    case "findMeetingClockTime": {
      const start = need(input, "departureMinute");
      const hours = divide(positive(need(input, "initialSeparation"), "initialSeparation"), relativeForCase(input));
      const answer = add(start, multiply(hours, rational(60)));
      return solution(solveMode, answer, "CLOCK_MINUTE", "CLOCK_SHIFT", "meeting clock = departure clock + meeting duration");
    }
    case "findDepartureClockTimeFromMeetingState": {
      const meeting = need(input, "meetingClockMinute");
      const hours = divide(positive(need(input, "initialSeparation"), "initialSeparation"), relativeForCase(input));
      const answer = subtract(meeting, multiply(hours, rational(60)));
      return solution(solveMode, answer, "CLOCK_MINUTE", "CLOCK_SHIFT", "departure clock = meeting clock − meeting duration");
    }
    case "findRelativeDistanceCoveredInGivenTime": {
      const answer = multiply(relativeForCase(input), positive(need(input, "elapsedTime"), "elapsedTime"));
      return solution(solveMode, answer, "DISTANCE", "RELATIVE_DISTANCE", "relative distance = relative speed × time");
    }
    case "findTimeUntilSpecifiedSeparation": {
      const target = positive(need(input, "specifiedSeparation"), "specifiedSeparation");
      const initial = need(input, "initialSeparation");
      const relative = relativeForCase(input);
      const delta = input.directionCase === "SAME" ? subtract(initial, target) : subtract(target, initial);
      return solution(solveMode, divide(positive(delta, "separation change"), relative), "TIME", "RELATIVE_DISTANCE", "time = required change in separation / relative speed");
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const gap = positive(need(input, "initialSeparation"), "initialSeparation");
      const targetTime = positive(need(input, "targetTime"), "targetTime");
      const other = positive(need(input, "speedB"), "other speed");
      const requiredRelative = divide(gap, targetTime);
      const answer = input.directionCase === "OPPOSITE" ? subtract(requiredRelative, other) : add(requiredRelative, other);
      return solution(solveMode, positive(answer, "required speed"), "SPEED", input.directionCase === "OPPOSITE" ? "SUM_SPEED" : "CLOSING_SPEED", input.directionCase === "OPPOSITE" ? "required speed = gap/time − other speed" : "required faster speed = gap/time + slower speed");
    }
  }
}

export function verifyCp004Core(
  mode: TsdCp004CoreSolveMode,
  input: TsdCp004CoreInput,
  candidate: TsdCp004CoreSolution,
): { readonly valid: boolean; readonly errors: readonly string[] } {
  const errors: string[] = [];
  if (candidate.solveMode !== mode) errors.push("solve-mode mismatch");
  let independentlySolved: TsdCp004CoreSolution;
  try {
    independentlySolved = solveCp004Core(mode, input);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
    return Object.freeze({ valid: false, errors: Object.freeze(errors) });
  }
  if (!equals(independentlySolved.answer, candidate.answer)) errors.push("answer mismatch");
  if (independentlySolved.unit !== candidate.unit) errors.push("unit mismatch");
  if (candidate.unit !== "CLOCK_MINUTE" && compare(candidate.answer, rational(0)) <= 0) errors.push("answer must be positive");
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
