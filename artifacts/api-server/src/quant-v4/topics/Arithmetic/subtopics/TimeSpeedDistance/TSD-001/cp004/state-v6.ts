import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { SeededRng } from "../cp003/generation-support";
import { generateCp004State } from "./generator";
import type { TsdCp004GeneratedState } from "./runtime-types";

const SAME_SPEED_PAIRS = Object.freeze([
  [54, 36], [60, 42], [64, 40], [66, 48], [70, 45], [72, 48],
  [75, 50], [78, 54], [80, 56], [84, 60], [88, 64], [90, 54],
  [90, 66], [96, 60], [96, 72], [100, 75], [108, 72], [110, 80],
] as const);

const OPPOSITE_SPEED_PAIRS = Object.freeze([
  [36, 24], [40, 30], [42, 36], [45, 30], [48, 32], [48, 36],
  [50, 40], [54, 36], [54, 42], [56, 40], [60, 36], [60, 45],
  [64, 48], [66, 42], [70, 50], [72, 48], [72, 54], [75, 60],
] as const);

const RATIO_PAIRS = Object.freeze([
  [3, 2], [4, 3], [5, 2], [5, 3], [5, 4], [7, 3],
  [7, 4], [7, 5], [8, 3], [8, 5], [9, 4], [9, 5],
] as const);

const DURATIONS = Object.freeze([
  rational(1, 2), rational(3, 4), rational(1), rational(5, 4),
  rational(3, 2), rational(2), rational(5, 2), rational(3),
  rational(7, 2), rational(4), rational(9, 2), rational(5),
]);

const BASE_GAPS = Object.freeze([24, 30, 36, 40, 45, 48, 54, 60, 72, 75, 84, 90, 96, 108, 120, 135, 150, 180] as const);
const CLOCK_STARTS = Object.freeze([390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 720, 780, 840] as const);
const UNIT_DISTANCES = Object.freeze([18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 54] as const);

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

function q(value: number): Rational {
  return rational(value);
}

function pair(rng: SeededRng, direction: "SAME" | "OPPOSITE") {
  const chosen = rng.pick(direction === "SAME" ? SAME_SPEED_PAIRS : OPPOSITE_SPEED_PAIRS);
  return { speedA: q(chosen[0]), speedB: q(chosen[1]), directionCase: direction } as const;
}

function duration(rng: SeededRng): Rational {
  return rng.pick(DURATIONS);
}

function relative(speedA: Rational, speedB: Rational, direction: "SAME" | "OPPOSITE") {
  return direction === "SAME" ? subtract(speedA, speedB) : add(speedA, speedB);
}

function variedDirection(rng: SeededRng): "SAME" | "OPPOSITE" {
  return rng.pick(["SAME", "OPPOSITE"] as const);
}

export function generateCp004StateV6(authorityKey: string, seed: string): TsdCp004GeneratedState {
  const base = generateCp004State(authorityKey, seed);
  const rng = new SeededRng(`cp004:v6:${authorityKey}:${base.solveMode}:${seed}`);
  const t = duration(rng);
  const directionCase = variedDirection(rng);
  const variant = ordinal(seed) % 6;
  let input = base.input;

  switch (base.solveMode) {
    case "findRelativeSpeedOppositeDirections": {
      input = Object.freeze({ ...input, ...pair(rng, "OPPOSITE") });
      break;
    }
    case "findRelativeSpeedSameDirection": {
      input = Object.freeze({ ...input, ...pair(rng, "SAME") });
      break;
    }
    case "findMeetingTimeFromInitialSeparation": {
      const p = pair(rng, directionCase);
      input = Object.freeze({ ...input, ...p, initialSeparation: multiply(relative(p.speedA, p.speedB, p.directionCase), t) });
      break;
    }
    case "findCatchUpTimeFromHeadStartDistance": {
      const p = pair(rng, "SAME");
      input = Object.freeze({ ...input, ...p, headStartDistance: multiply(subtract(p.speedA, p.speedB), t) });
      break;
    }
    case "findInitialSeparationFromMeetingTime":
    case "findUnknownStartPointGap": {
      const p = pair(rng, directionCase);
      input = Object.freeze({ ...input, ...p, meetingTime: t });
      break;
    }
    case "findHeadStartDistanceFromCatchUpTime": {
      const p = pair(rng, "SAME");
      input = Object.freeze({ ...input, ...p, meetingTime: t });
      break;
    }
    case "findRelativeDistanceCoveredInGivenTime": {
      const p = pair(rng, directionCase);
      input = Object.freeze({ ...input, ...p, elapsedTime: t });
      break;
    }
    case "findRelativeSpeedFromMeetingTime": {
      const p = pair(rng, directionCase);
      const rate = relative(p.speedA, p.speedB, p.directionCase);
      input = Object.freeze({ ...input, ...p, initialSeparation: multiply(rate, t), meetingTime: t });
      break;
    }
    case "findIndividualSpeedFromRelativeSpeedAndOtherSpeed": {
      const p = pair(rng, directionCase);
      input = Object.freeze({
        ...input,
        ...p,
        relativeSpeed: relative(p.speedA, p.speedB, p.directionCase),
        unknownBody: "A" as const,
      });
      break;
    }
    case "findFasterSpeedFromCatchUpState": {
      const p = pair(rng, "SAME");
      input = Object.freeze({
        ...input,
        ...p,
        meetingTime: t,
        headStartDistance: multiply(subtract(p.speedA, p.speedB), t),
      });
      break;
    }
    case "findSlowerSpeedFromCatchUpState": {
      const p = pair(rng, "SAME");
      input = Object.freeze({
        ...input,
        ...p,
        meetingTime: t,
        headStartDistance: multiply(subtract(p.speedA, p.speedB), t),
      });
      break;
    }
    case "findDelayedStartCatchUpTime": {
      const p = pair(rng, "SAME");
      const pursuitTime = t;
      const headStart = multiply(subtract(p.speedA, p.speedB), pursuitTime);
      input = Object.freeze({ ...input, ...p, startDelay: divide(headStart, p.speedB) });
      break;
    }
    case "findStartDelayFromCatchUpState": {
      const p = pair(rng, "SAME");
      input = Object.freeze({ ...input, ...p, meetingTime: t });
      break;
    }
    case "findSeparationAfterMovingApart": {
      const p = pair(rng, "OPPOSITE");
      input = Object.freeze({ ...input, ...p, initialSeparation: q(rng.pick(BASE_GAPS)), elapsedTime: t });
      break;
    }
    case "findInitialGapFromLaterSeparation": {
      const p = pair(rng, "OPPOSITE");
      const initial = q(rng.pick(BASE_GAPS));
      input = Object.freeze({
        ...input,
        ...p,
        elapsedTime: t,
        specifiedSeparation: add(initial, multiply(add(p.speedA, p.speedB), t)),
      });
      break;
    }
    case "findTimeUntilSpecifiedSeparation": {
      const p = pair(rng, directionCase);
      const baseGap = q(rng.pick(BASE_GAPS));
      const change = multiply(relative(p.speedA, p.speedB, p.directionCase), t);
      input = p.directionCase === "SAME"
        ? Object.freeze({ ...input, ...p, initialSeparation: add(baseGap, change), specifiedSeparation: baseGap })
        : Object.freeze({ ...input, ...p, initialSeparation: baseGap, specifiedSeparation: add(baseGap, change) });
      break;
    }
    case "findMeetingPointDistanceSplit": {
      const p = pair(rng, "OPPOSITE");
      const meetingTime = duration(rng);
      input = Object.freeze({ ...input, ...p, routeDistance: multiply(add(p.speedA, p.speedB), meetingTime) });
      break;
    }
    case "findMeetingPointFromSpeedRatio": {
      const ratio = rng.pick(RATIO_PAIRS);
      const unit = q(rng.pick(UNIT_DISTANCES));
      input = Object.freeze({
        ...input,
        ratioA: q(ratio[0]),
        ratioB: q(ratio[1]),
        routeDistance: multiply(q(ratio[0] + ratio[1]), unit),
      });
      break;
    }
    case "findSpeedRatioFromMeetingPoint": {
      const ratio = rng.pick(RATIO_PAIRS);
      const scale = q(rng.pick(UNIT_DISTANCES));
      input = Object.freeze({
        ...input,
        distanceA: multiply(q(ratio[0]), scale),
        distanceB: multiply(q(ratio[1]), scale),
      });
      break;
    }
    case "findMeetingClockTime": {
      const p = pair(rng, directionCase);
      const departureMinute = q(rng.pick(CLOCK_STARTS));
      input = Object.freeze({
        ...input,
        ...p,
        initialSeparation: multiply(relative(p.speedA, p.speedB, p.directionCase), t),
        departureMinute,
      });
      break;
    }
    case "findDepartureClockTimeFromMeetingState": {
      const p = pair(rng, directionCase);
      const departureMinute = q(rng.pick(CLOCK_STARTS));
      input = Object.freeze({
        ...input,
        ...p,
        initialSeparation: multiply(relative(p.speedA, p.speedB, p.directionCase), t),
        meetingClockMinute: add(departureMinute, multiply(t, rational(60))),
      });
      break;
    }
    case "findSpeedNeededToAvoidOrCauseMeeting": {
      const targetTime = duration(rng);
      if (directionCase === "SAME") {
        const chosen = rng.pick(SAME_SPEED_PAIRS);
        const required = q(chosen[0]);
        const other = q(chosen[1]);
        input = Object.freeze({
          ...input,
          speedB: other,
          directionCase,
          targetTime,
          initialSeparation: multiply(subtract(required, other), targetTime),
        });
      } else {
        const chosen = rng.pick(OPPOSITE_SPEED_PAIRS);
        const required = q(chosen[0]);
        const other = q(chosen[1]);
        input = Object.freeze({
          ...input,
          speedB: other,
          directionCase,
          targetTime,
          initialSeparation: multiply(add(required, other), targetTime),
        });
      }
      break;
    }
  }

  return Object.freeze({
    ...base,
    representation: `${base.solveMode}:${variant}`,
    input,
  });
}
