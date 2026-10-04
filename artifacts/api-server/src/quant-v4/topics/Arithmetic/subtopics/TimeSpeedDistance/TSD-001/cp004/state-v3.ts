import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { generateCp004StateV2 } from "./state-v2";
import type { TsdCp004GeneratedState } from "./runtime-types";

const SAME_SPEED_PAIRS = Object.freeze([
  [72, 48],
  [80, 50],
  [66, 42],
  [75, 45],
  [64, 40],
  [90, 54],
] as const);

const OPPOSITE_SPEED_PAIRS = Object.freeze([
  [48, 36],
  [54, 42],
  [60, 45],
  [64, 48],
  [72, 54],
  [50, 40],
] as const);

const RATIO_PAIRS = Object.freeze([
  [3, 2],
  [5, 3],
  [7, 4],
  [4, 3],
  [8, 5],
  [5, 2],
] as const);

const DURATIONS = Object.freeze([
  rational(2),
  rational(3),
  rational(4),
  rational(5, 2),
  rational(3, 2),
  rational(5),
]);

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

function q(value: number): Rational {
  return rational(value);
}

function direction(index: number): "OPPOSITE" | "SAME" {
  return index % 2 === 0 ? "OPPOSITE" : "SAME";
}

function speedPair(index: number, directionCase: "OPPOSITE" | "SAME"): readonly [Rational, Rational] {
  const pair = (directionCase === "SAME" ? SAME_SPEED_PAIRS : OPPOSITE_SPEED_PAIRS)[index % 6]!;
  return [q(pair[0]), q(pair[1])];
}

function relative(a: Rational, b: Rational, directionCase: "OPPOSITE" | "SAME"): Rational {
  return directionCase === "SAME" ? subtract(a, b) : add(a, b);
}

function duration(index: number): Rational {
  return DURATIONS[index % DURATIONS.length]!;
}

export function generateCp004StateV3(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004StateV2(authorityKey, seed);
  const index = ordinal(seed);
  const directionCase = direction(index);
  const t = duration(index);
  let input = base.input;

  const setPair = (forcedDirection: "OPPOSITE" | "SAME" = directionCase) => {
    const [speedA, speedB] = speedPair(index, forcedDirection);
    return { speedA, speedB, directionCase: forcedDirection } as const;
  };

  switch (base.solveMode) {
    case "findRelativeSpeedOppositeDirections": {
      const pair = setPair("OPPOSITE");
      input = Object.freeze({ ...input, ...pair });
      break;
    }
    case "findRelativeSpeedSameDirection": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair });
      break;
    }
    case "findMeetingTimeFromInitialSeparation": {
      const pair = setPair(directionCase);
      input = Object.freeze({ ...input, ...pair, initialSeparation: multiply(relative(pair.speedA, pair.speedB, pair.directionCase), t) });
      break;
    }
    case "findCatchUpTimeFromHeadStartDistance": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair, headStartDistance: multiply(subtract(pair.speedA, pair.speedB), t) });
      break;
    }
    case "findInitialSeparationFromMeetingTime":
    case "findUnknownStartPointGap": {
      const pair = setPair(directionCase);
      input = Object.freeze({ ...input, ...pair, meetingTime: t });
      break;
    }
    case "findHeadStartDistanceFromCatchUpTime": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair, meetingTime: t });
      break;
    }
    case "findRelativeDistanceCoveredInGivenTime": {
      const pair = setPair(directionCase);
      input = Object.freeze({ ...input, ...pair, elapsedTime: t });
      break;
    }
    case "findRelativeSpeedFromMeetingTime": {
      const rates = [54, 66, 72, 84, 90, 96] as const;
      const rate = q(rates[index % rates.length]!);
      const known = q([24, 30, 36, 40, 45, 48][index % 6]!);
      input = Object.freeze({
        ...input,
        initialSeparation: multiply(rate, t),
        meetingTime: t,
        speedB: known,
        directionCase,
      });
      break;
    }
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": {
      const pair = setPair(directionCase);
      input = Object.freeze({
        ...input,
        ...pair,
        relativeSpeed: relative(pair.speedA, pair.speedB, pair.directionCase),
        unknownBody: "A" as const,
      });
      break;
    }
    case "findFasterSpeedFromCatchUpState": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair, meetingTime: t, headStartDistance: multiply(subtract(pair.speedA, pair.speedB), t) });
      break;
    }
    case "findSlowerSpeedFromCatchUpState": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair, meetingTime: t, headStartDistance: multiply(subtract(pair.speedA, pair.speedB), t) });
      break;
    }
    case "findDelayedStartCatchUpTime": {
      const pair = setPair("SAME");
      const pursuit = t;
      const headStart = multiply(subtract(pair.speedA, pair.speedB), pursuit);
      input = Object.freeze({ ...input, ...pair, startDelay: divide(headStart, pair.speedB) });
      break;
    }
    case "findStartDelayFromCatchUpState": {
      const pair = setPair("SAME");
      input = Object.freeze({ ...input, ...pair, meetingTime: t });
      break;
    }
    case "findSeparationAfterMovingApart": {
      const pair = setPair("OPPOSITE");
      const initial = q([30, 45, 60, 50, 40, 75][index % 6]!);
      input = Object.freeze({ ...input, ...pair, initialSeparation: initial, elapsedTime: t });
      break;
    }
    case "findInitialGapFromLaterSeparation": {
      const pair = setPair("OPPOSITE");
      const initial = q([40, 60, 75, 50, 90, 70][index % 6]!);
      input = Object.freeze({
        ...input,
        ...pair,
        elapsedTime: t,
        specifiedSeparation: add(initial, multiply(add(pair.speedA, pair.speedB), t)),
      });
      break;
    }
    case "findTimeUntilSpecifiedSeparation": {
      const pair = setPair(directionCase);
      const change = multiply(relative(pair.speedA, pair.speedB, pair.directionCase), t);
      input = pair.directionCase === "SAME"
        ? Object.freeze({ ...input, ...pair, initialSeparation: add(change, q([20, 25, 30, 35, 40, 45][index % 6]!)), specifiedSeparation: q([20, 25, 30, 35, 40, 45][index % 6]!) })
        : Object.freeze({ ...input, ...pair, initialSeparation: q([20, 25, 30, 35, 40, 45][index % 6]!), specifiedSeparation: add(q([20, 25, 30, 35, 40, 45][index % 6]!), change) });
      break;
    }
    case "findMeetingPointDistanceSplit": {
      const pair = setPair("OPPOSITE");
      const meetingTime = q([2, 3, 4, 5, 3, 2][index % 6]!);
      input = Object.freeze({ ...input, ...pair, routeDistance: multiply(add(pair.speedA, pair.speedB), meetingTime) });
      break;
    }
    case "findMeetingPointFromSpeedRatio": {
      const ratio = RATIO_PAIRS[index % RATIO_PAIRS.length]!;
      const unitDistance = q([24, 30, 36, 40, 45, 50][index % 6]!);
      input = Object.freeze({
        ...input,
        ratioA: q(ratio[0]),
        ratioB: q(ratio[1]),
        routeDistance: multiply(q(ratio[0] + ratio[1]), unitDistance),
      });
      break;
    }
    case "findSpeedRatioFromMeetingPoint": {
      const ratio = RATIO_PAIRS[index % RATIO_PAIRS.length]!;
      const scale = q([20, 24, 30, 36, 40, 45][index % 6]!);
      input = Object.freeze({ ...input, distanceA: multiply(q(ratio[0]), scale), distanceB: multiply(q(ratio[1]), scale) });
      break;
    }
    case "findMeetingClockTime": {
      const pair = setPair(directionCase);
      input = Object.freeze({
        ...input,
        ...pair,
        initialSeparation: multiply(relative(pair.speedA, pair.speedB, pair.directionCase), t),
      });
      break;
    }
    case "findDepartureClockTimeFromMeetingState": {
      const pair = setPair(directionCase);
      const departureMinute = input.meetingClockMinute ? subtract(input.meetingClockMinute, multiply(t, rational(60))) : q(480);
      const meetingClockMinute = add(departureMinute, multiply(t, rational(60)));
      input = Object.freeze({
        ...input,
        ...pair,
        initialSeparation: multiply(relative(pair.speedA, pair.speedB, pair.directionCase), t),
        meetingClockMinute,
      });
      break;
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const other = q([30, 36, 40, 45, 48, 54][index % 6]!);
      const required = q([72, 80, 75, 90, 84, 96][index % 6]!);
      const targetTime = q([2, 3, 4, 5, 3, 2][index % 6]!);
      const requiredRelative = directionCase === "SAME" ? subtract(required, other) : add(required, other);
      input = Object.freeze({
        ...input,
        speedB: other,
        directionCase,
        targetTime,
        initialSeparation: multiply(requiredRelative, targetTime),
      });
      break;
    }
  }

  return Object.freeze({ ...base, input });
}
