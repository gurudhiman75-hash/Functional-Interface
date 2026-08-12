import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004ActorKind, TsdCp004CanonicalState, TsdCp004DirectionCase, TsdCp004Representation } from "./types";

const SIXTY = rational(60);

const ACTORS: readonly TsdCp004ActorKind[] = Object.freeze(["RUNNER", "CYCLIST", "SCOOTER", "CAR", "BUS", "DELIVERY_VAN"]);

const SAME_DIRECTION_PAIRS: Readonly<Record<TsdCp004ActorKind, readonly (readonly [number, number])[]>> = Object.freeze({
  RUNNER: Object.freeze([[12, 8], [15, 10], [10, 6]]),
  CYCLIST: Object.freeze([[24, 18], [30, 20], [20, 15]]),
  SCOOTER: Object.freeze([[48, 36], [54, 36], [45, 30]]),
  CAR: Object.freeze([[60, 45], [72, 54], [50, 40]]),
  BUS: Object.freeze([[48, 36], [45, 30], [54, 36]]),
  DELIVERY_VAN: Object.freeze([[60, 40], [50, 40], [45, 30]]),
});

const TIMES = Object.freeze([30, 40, 45, 60, 75, 90]);
const DELAYS = Object.freeze([15, 20, 24, 30, 40, 45]);
const DEADLINES = Object.freeze([30, 40, 45, 60, 75]);

function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  h ^= h >>> 13;
  h = Math.imul(h, 2246822519) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

function hoursFromMinutes(minutes: Rational): Rational {
  return divide(minutes, SIXTY);
}

function distance(speedKmph: Rational, minutes: Rational): Rational {
  return multiply(speedKmph, hoursFromMinutes(minutes));
}

function gapFromRelativeSpeed(relativeSpeedKmph: Rational, minutes: Rational): Rational {
  return distance(relativeSpeedKmph, minutes);
}

function representationFor(n: number): TsdCp004Representation {
  return (["PROSE", "NUMBER_LINE", "TIMELINE"] as const)[n % 3];
}

function directionFor(authorityId: TsdCp004AuthorityId, variant: number): TsdCp004DirectionCase {
  if (["RELATIVE_SPEED_OPPOSITE", "MEETING_POINT_DISTANCE_SPLIT", "SPEED_RATIO_FROM_MEETING_POINT", "MEETING_POINT_FROM_SPEED_RATIO"].includes(authorityId)) {
    return "OPPOSITE_TOWARD";
  }
  if (["RELATIVE_SPEED_SAME_DIRECTION", "HEAD_START_CATCH_UP_TIME", "HEAD_START_DISTANCE", "DELAYED_START_CATCH_UP_TIME", "START_DELAY_FROM_CATCH_UP", "MULTI_PURSUER_MEETING_ORDER"].includes(authorityId)) {
    return "SAME_DIRECTION";
  }
  if (authorityId === "SEPARATION_AFTER_TIME" || authorityId === "TIME_TO_SPECIFIED_SEPARATION") {
    return variant === 0 ? "OPPOSITE_AWAY" : variant === 1 ? "SAME_DIRECTION" : "OPPOSITE_TOWARD";
  }
  if (["FIRST_MEETING_TIME", "INITIAL_GAP_FROM_MEETING", "UNKNOWN_SPEED_FROM_MEETING", "REQUIRED_SPEED_FOR_MEETING_DEADLINE"].includes(authorityId)) {
    return variant % 2 === 0 ? "OPPOSITE_TOWARD" : "SAME_DIRECTION";
  }
  return "OPPOSITE_TOWARD";
}

function actorFor(authorityId: TsdCp004AuthorityId, n: number): TsdCp004ActorKind {
  const offset = authorityId === "MULTI_PURSUER_MEETING_ORDER" ? 1 : 0;
  return ACTORS[(n + offset) % ACTORS.length];
}

function makeBase(authorityId: TsdCp004AuthorityId, seed: string): {
  n: number;
  variant: number;
  actorKind: TsdCp004ActorKind;
  representation: TsdCp004Representation;
  directionCase: TsdCp004DirectionCase;
  fast: Rational;
  slow: Rational;
  secondFast: Rational;
  elapsed: Rational;
  delay: Rational;
  deadline: Rational;
} {
  const n = hashSeed(`${authorityId}|${seed}`);
  const variant = n % 3;
  const actorKind = actorFor(authorityId, n % 97);
  const pairs = SAME_DIRECTION_PAIRS[actorKind];
  const pair = pairs[(n >>> 3) % pairs.length];
  const nextPair = pairs[((n >>> 5) + 1) % pairs.length];
  const fast = rational(pair[0]);
  const slow = rational(pair[1]);
  let secondFast = rational(nextPair[0]);
  if (secondFast.numerator <= slow.numerator) secondFast = add(fast, rational(6));
  const elapsed = rational(TIMES[(n >>> 7) % TIMES.length]);
  const delay = rational(DELAYS[(n >>> 11) % DELAYS.length]);
  const deadline = rational(DEADLINES[(n >>> 13) % DEADLINES.length]);
  return {
    n,
    variant,
    actorKind,
    representation: representationFor(n >>> 17),
    directionCase: directionFor(authorityId, variant),
    fast,
    slow,
    secondFast,
    elapsed,
    delay,
    deadline,
  };
}

export function generateCp004CanonicalState(authorityId: TsdCp004AuthorityId, seed: string): TsdCp004CanonicalState {
  const base = makeBase(authorityId, seed);
  const { n, variant, actorKind, representation, directionCase, fast, slow, secondFast, elapsed, delay, deadline } = base;
  const sum = add(fast, slow);
  const diff = subtract(fast, slow);

  let speedA = fast;
  let speedB = slow;
  let speedC = secondFast;
  let initialGap = rational(0);
  let elapsedMinutes = elapsed;
  let startDelayMinutes = delay;
  let targetSeparation = rational(0);
  let routeLength = rational(0);
  let meetingFromA = rational(0);
  let deadlineMinutes = deadline;
  let ratioA = 2n;
  let ratioB = 3n;
  let extraGapC = rational(0);

  switch (authorityId) {
    case "RELATIVE_SPEED_OPPOSITE":
    case "RELATIVE_SPEED_SAME_DIRECTION":
      break;

    case "FIRST_MEETING_TIME":
    case "INITIAL_GAP_FROM_MEETING":
    case "UNKNOWN_SPEED_FROM_MEETING": {
      const closing = directionCase === "OPPOSITE_TOWARD" ? sum : diff;
      initialGap = gapFromRelativeSpeed(closing, elapsed);
      break;
    }

    case "HEAD_START_CATCH_UP_TIME":
    case "HEAD_START_DISTANCE":
      initialGap = gapFromRelativeSpeed(diff, elapsed);
      break;

    case "DELAYED_START_CATCH_UP_TIME": {
      const lead = distance(slow, delay);
      initialGap = lead;
      elapsedMinutes = multiply(divide(lead, diff), SIXTY);
      break;
    }

    case "START_DELAY_FROM_CATCH_UP": {
      const chaseMinutes = multiply(divide(distance(slow, delay), diff), SIXTY);
      elapsedMinutes = chaseMinutes;
      startDelayMinutes = delay;
      initialGap = distance(slow, delay);
      break;
    }

    case "SEPARATION_AFTER_TIME": {
      if (directionCase === "OPPOSITE_AWAY") {
        initialGap = rational([0, 2, 5][variant]);
        targetSeparation = add(initialGap, distance(sum, elapsed));
      } else if (directionCase === "SAME_DIRECTION") {
        initialGap = rational([2, 5, 8][variant]);
        targetSeparation = add(initialGap, distance(diff, elapsed));
      } else {
        targetSeparation = rational([5, 8, 12][variant]);
        initialGap = add(targetSeparation, distance(sum, elapsed));
      }
      break;
    }

    case "TIME_TO_SPECIFIED_SEPARATION": {
      if (directionCase === "OPPOSITE_AWAY") {
        initialGap = rational([0, 3, 6][variant]);
        targetSeparation = add(initialGap, distance(sum, elapsed));
      } else if (directionCase === "SAME_DIRECTION") {
        initialGap = rational([2, 4, 6][variant]);
        targetSeparation = add(initialGap, distance(diff, elapsed));
      } else {
        targetSeparation = rational([4, 8, 10][variant]);
        initialGap = add(targetSeparation, distance(sum, elapsed));
      }
      break;
    }

    case "MEETING_POINT_DISTANCE_SPLIT":
    case "SPEED_RATIO_FROM_MEETING_POINT": {
      const factor = rational([1, 2, 3, 4][(n >>> 19) % 4]);
      routeLength = multiply(sum, factor);
      meetingFromA = multiply(fast, factor);
      initialGap = routeLength;
      break;
    }

    case "MEETING_POINT_FROM_SPEED_RATIO": {
      const ratios: readonly (readonly [bigint, bigint])[] = Object.freeze([[2n, 3n], [3n, 4n], [3n, 5n], [4n, 5n], [5n, 7n]]);
      const selected = ratios[(n >>> 21) % ratios.length];
      ratioA = selected[0];
      ratioB = selected[1];
      const factor = BigInt([6, 8, 10, 12][(n >>> 24) % 4]);
      routeLength = rational((ratioA + ratioB) * factor);
      meetingFromA = rational(ratioA * factor);
      initialGap = routeLength;
      break;
    }

    case "REQUIRED_SPEED_FOR_MEETING_DEADLINE": {
      deadlineMinutes = deadline;
      if (directionCase === "OPPOSITE_TOWARD") {
        initialGap = distance(add(fast, slow), deadlineMinutes);
      } else {
        initialGap = distance(subtract(fast, slow), deadlineMinutes);
      }
      break;
    }

    case "MULTI_PURSUER_MEETING_ORDER": {
      speedA = fast;
      speedB = slow;
      if (secondFast.numerator === fast.numerator && secondFast.denominator === fast.denominator) speedC = add(fast, rational(6));
      const relA = subtract(speedA, speedB);
      const relC = subtract(speedC, speedB);
      const tA = rational(variant === 0 ? 30 : variant === 1 ? 45 : 40);
      const tC = rational(variant === 0 ? 45 : variant === 1 ? 30 : 40);
      initialGap = distance(relA, tA);
      extraGapC = distance(relC, tC);
      elapsedMinutes = tA;
      targetSeparation = tC;
      break;
    }
  }

  return Object.freeze({
    authorityId,
    actorKind,
    representation,
    variant,
    directionCase,
    speedAKmph: speedA,
    speedBKmph: speedB,
    speedCKmph: speedC,
    initialGapKm: initialGap,
    elapsedMinutes,
    startDelayMinutes,
    targetSeparationKm: targetSeparation,
    routeLengthKm: routeLength,
    meetingFromAKm: meetingFromA,
    deadlineMinutes,
    ratioA,
    ratioB,
    extraGapCKm: extraGapC,
  });
}

export function cp004GenerationFingerprint(state: TsdCp004CanonicalState): string {
  return [
    state.authorityId,
    state.actorKind,
    state.representation,
    state.variant,
    state.directionCase,
    `${state.speedAKmph.numerator}/${state.speedAKmph.denominator}`,
    `${state.speedBKmph.numerator}/${state.speedBKmph.denominator}`,
    `${state.speedCKmph.numerator}/${state.speedCKmph.denominator}`,
    `${state.initialGapKm.numerator}/${state.initialGapKm.denominator}`,
    `${state.elapsedMinutes.numerator}/${state.elapsedMinutes.denominator}`,
    `${state.startDelayMinutes.numerator}/${state.startDelayMinutes.denominator}`,
    `${state.targetSeparationKm.numerator}/${state.targetSeparationKm.denominator}`,
    `${state.routeLengthKm.numerator}/${state.routeLengthKm.denominator}`,
    `${state.meetingFromAKm.numerator}/${state.meetingFromAKm.denominator}`,
    `${state.deadlineMinutes.numerator}/${state.deadlineMinutes.denominator}`,
    `${state.ratioA}:${state.ratioB}`,
    `${state.extraGapCKm.numerator}/${state.extraGapCKm.denominator}`,
  ].join("|");
}
