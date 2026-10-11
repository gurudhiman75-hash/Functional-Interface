import {
  absRational,
  add,
  compare,
  divide,
  equals,
  floorRational,
  gcdBigInt,
  isPositive,
  lcmBigInt,
  modulo,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp006SolveMode } from "./discovery-registry";
import type {
  TsdCp006DataSufficiency,
  TsdCp006Direction,
  TsdCp006DsFact,
  TsdCp006Input,
  TsdCp006Solution,
  TsdCp006Verification,
} from "./types";

type Expected = Readonly<{
  kind: TsdCp006Solution["answerKind"];
  value?: Rational;
  count?: number;
  values?: readonly Rational[];
  booleanValue?: boolean;
  classification?: TsdCp006Solution["classification"];
  dataSufficiency?: TsdCp006DataSufficiency;
}>;

function req(value: Rational | undefined, label: string): Rational {
  if (!value) throw new Error(`CP006 verifier missing ${label}`);
  return value;
}

function pos(value: Rational | undefined, label: string): Rational {
  const result = req(value, label);
  if (!isPositive(result)) throw new Error(`CP006 verifier requires positive ${label}`);
  return result;
}

function dir(value: TsdCp006Direction | undefined, fallback: TsdCp006Direction = 1): TsdCp006Direction {
  return value ?? fallback;
}

function vel(speed: Rational, direction: TsdCp006Direction): Rational {
  return multiply(speed, rational(direction));
}

function lcmR(a: Rational, b: Rational): Rational {
  return rational(lcmBigInt(a.numerator, b.numerator), gcdBigInt(a.denominator, b.denominator));
}

function lcmAll(values: readonly Rational[]): Rational {
  return values.slice(1).reduce((acc, item) => lcmR(acc, item), values[0]!);
}

function independentMeeting(track: Rational, pa: Rational, pb: Rational, va: Rational, vb: Rational): Rational {
  const relative = subtract(va, vb);
  if (relative.numerator === 0n) throw new Error("CP006 verifier cannot resolve equal signed velocities");
  let best: Rational | undefined;
  for (let k = -96; k <= 96; k += 1) {
    const candidate = divide(add(subtract(pb, pa), multiply(rational(k), track)), relative);
    if (compare(candidate, rational(0)) <= 0) continue;
    if (!best || compare(candidate, best) < 0) best = candidate;
  }
  if (!best) throw new Error("CP006 verifier did not find a positive modular meeting");
  return best;
}

function period(input: TsdCp006Input): Rational {
  const L = pos(input.trackLength, "trackLength");
  const u = pos(input.speedA, "speedA");
  const v = pos(input.speedB, "speedB");
  return independentMeeting(L, rational(0), rational(0), vel(u, dir(input.directionA)), vel(v, dir(input.directionB)));
}

function firstMeeting(input: TsdCp006Input): Rational {
  const L = pos(input.trackLength, "trackLength");
  const u = pos(input.speedA, "speedA");
  const v = pos(input.speedB, "speedB");
  return independentMeeting(
    L,
    modulo(input.startPositionA ?? rational(0), L),
    modulo(input.startPositionB ?? input.initialArcGap ?? rational(0), L),
    vel(u, dir(input.directionA)),
    vel(v, dir(input.directionB)),
  );
}

function position(track: Rational, start: Rational, speed: Rational, direction: TsdCp006Direction, time: Rational): Rational {
  return modulo(add(start, multiply(vel(speed, direction), time)), track);
}

function distinctPoints(input: TsdCp006Input): number {
  const L = pos(input.trackLength, "trackLength");
  const u = pos(input.speedA, "speedA");
  const step = modulo(multiply(vel(u, dir(input.directionA)), period(input)), L);
  if (step.numerator === 0n) return 1;
  const fraction = divide(step, L);
  return Number(fraction.denominator);
}

function countInWindow(input: TsdCp006Input): number {
  return Number(floorRational(divide(pos(input.timeWindow, "timeWindow"), period(input))));
}

function factSetSufficient(facts: readonly TsdCp006DsFact[] | undefined): boolean {
  const set = new Set(facts ?? []);
  return set.has("TRACK_LENGTH") && set.has("SPEED_A") && set.has("SPEED_B") && set.has("DIRECTIONS");
}

function dsExpected(input: TsdCp006Input): TsdCp006DataSufficiency {
  const one = factSetSufficient(input.dsStatement1);
  const two = factSetSufficient(input.dsStatement2);
  if (one && two) return "EITHER_ALONE";
  if (one) return "STATEMENT_1_ONLY";
  if (two) return "STATEMENT_2_ONLY";
  if (factSetSufficient([...(input.dsStatement1 ?? []), ...(input.dsStatement2 ?? [])])) return "BOTH_TOGETHER";
  return "NOT_SUFFICIENT";
}

function expected(mode: TsdCp006SolveMode, input: TsdCp006Input): Expected {
  switch (mode) {
    case "findCircularFirstMeetingTimeSameDirection":
    case "findCircularFirstMeetingTimeOppositeDirections":
    case "findFirstOvertakeTime":
    case "findMeetingWithInitialArcGap":
      return { kind: "VALUE", value: firstMeeting(input) };

    case "findLapDifferenceAfterTime": {
      const L = pos(input.trackLength, "trackLength");
      const delta = absRational(subtract(pos(input.speedA, "speedA"), pos(input.speedB, "speedB")));
      return { kind: "VALUE", value: divide(multiply(delta, pos(input.timeWindow, "timeWindow")), L) };
    }

    case "findMeetingCountInTimeWindow":
    case "findOvertakeCountInTimeWindow":
      return { kind: "COUNT", count: countInWindow(input) };

    case "findNthMeetingTime":
    case "findNthOvertakeTime":
      return { kind: "VALUE", value: multiply(period(input), rational(input.nthEvent ?? 1)) };

    case "findDistinctMeetingPointCount":
      return { kind: "COUNT", count: distinctPoints(input) };

    case "findMeetingPointLocation": {
      const L = pos(input.trackLength, "trackLength");
      const t = firstMeeting(input);
      return { kind: "VALUE", value: position(L, input.startPositionA ?? rational(0), pos(input.speedA, "speedA"), dir(input.directionA), t) };
    }

    case "findCircularMeetingPointFromSpeedRatio": {
      const L = pos(input.trackLength, "trackLength");
      const ratio = pos(input.speedRatio, "speedRatio");
      return { kind: "VALUE", value: divide(multiply(L, ratio), add(ratio, rational(1))) };
    }

    case "findCircularSpeedRatioFromMeetingPoint": {
      const L = pos(input.trackLength, "trackLength");
      const point = req(input.meetingPoint, "meetingPoint");
      return { kind: "VALUE", value: divide(point, subtract(L, point)) };
    }

    case "findTrackLengthFromMeetingTime": {
      const u = pos(input.speedA, "speedA");
      const v = pos(input.speedB, "speedB");
      const relative = absRational(subtract(vel(u, dir(input.directionA)), vel(v, dir(input.directionB))));
      return { kind: "VALUE", value: multiply(relative, pos(input.observedMeetingTime, "observedMeetingTime")) };
    }

    case "findRunnerSpeedFromMeetingCount": {
      const meetings = input.observedMeetingCount ?? 0;
      return { kind: "VALUE", value: add(pos(input.speedB, "speedB"), divide(multiply(rational(meetings), pos(input.trackLength, "trackLength")), pos(input.timeWindow, "timeWindow"))) };
    }

    case "findTimeBothReturnToStart":
    case "findFirstSimultaneousStartPointReturn":
    case "findFirstMeetingAtStartingPoint": {
      const L = pos(input.trackLength, "trackLength");
      return { kind: "VALUE", value: lcmR(divide(L, pos(input.speedA, "speedA")), divide(L, pos(input.speedB, "speedB"))) };
    }

    case "findThreeRunnerSimultaneousReturn": {
      const L = pos(input.trackLength, "trackLength");
      return { kind: "VALUE", value: lcmAll([
        divide(L, pos(input.speedA, "speedA")),
        divide(L, pos(input.speedB, "speedB")),
        divide(L, pos(input.speedC, "speedC")),
      ]) };
    }

    case "findThreeRunnerFirstCommonMeeting": {
      const L = pos(input.trackLength, "trackLength");
      const va = vel(pos(input.speedA, "speedA"), dir(input.directionA));
      const vb = vel(pos(input.speedB, "speedB"), dir(input.directionB));
      const vc = vel(pos(input.speedC, "speedC"), dir(input.directionC));
      return { kind: "VALUE", value: lcmR(
        independentMeeting(L, rational(0), rational(0), va, vb),
        independentMeeting(L, rational(0), rational(0), va, vc),
      ) };
    }

    case "findPairwiseMeetingScheduleForThreeRunners": {
      const L = pos(input.trackLength, "trackLength");
      const va = vel(pos(input.speedA, "speedA"), dir(input.directionA));
      const vb = vel(pos(input.speedB, "speedB"), dir(input.directionB));
      const vc = vel(pos(input.speedC, "speedC"), dir(input.directionC));
      return { kind: "LIST", values: [
        independentMeeting(L, rational(0), rational(0), va, vb),
        independentMeeting(L, rational(0), rational(0), va, vc),
        independentMeeting(L, rational(0), rational(0), vb, vc),
      ] };
    }

    case "findInitialArcGapFromMeetingTime": {
      const relative = absRational(subtract(
        vel(pos(input.speedA, "speedA"), dir(input.directionA)),
        vel(pos(input.speedB, "speedB"), dir(input.directionB)),
      ));
      return { kind: "VALUE", value: multiply(relative, pos(input.observedMeetingTime, "observedMeetingTime")) };
    }

    case "findMeetingWithStaggeredStarts": {
      const L = pos(input.trackLength, "trackLength");
      const u = pos(input.speedA, "speedA");
      const v = pos(input.speedB, "speedB");
      const delay = pos(input.startDelayB, "startDelayB");
      const pa = position(L, input.startPositionA ?? rational(0), u, dir(input.directionA), delay);
      const pb = modulo(input.startPositionB ?? rational(0), L);
      const after = independentMeeting(L, pa, pb, vel(u, dir(input.directionA)), vel(v, dir(input.directionB)));
      return { kind: "VALUE", value: add(delay, after) };
    }

    case "findStartDelayFromCircularMeeting": {
      const u = pos(input.speedA, "speedA");
      const v = pos(input.speedB, "speedB");
      return { kind: "VALUE", value: divide(multiply(subtract(v, u), pos(input.observedMeetingTime, "observedMeetingTime")), v) };
    }

    case "findMeetingAfterDirectionReversal": {
      const L = pos(input.trackLength, "trackLength");
      const u = pos(input.speedA, "speedA");
      const v = pos(input.speedB, "speedB");
      const t0 = pos(input.reversalTimeA, "reversalTimeA");
      const da = dir(input.directionA);
      const db = dir(input.directionB);
      const pa = position(L, input.startPositionA ?? rational(0), u, da, t0);
      const pb = position(L, input.startPositionB ?? rational(0), v, db, t0);
      const after = independentMeeting(L, pa, pb, vel(u, da === 1 ? -1 : 1), vel(v, db));
      return { kind: "VALUE", value: add(t0, after) };
    }

    case "findMeetingWithLapRest": {
      const L = pos(input.trackLength, "trackLength");
      const cycleA = add(divide(L, pos(input.speedA, "speedA")), req(input.lapRestA, "lapRestA"));
      const cycleB = divide(L, pos(input.speedB, "speedB"));
      return { kind: "VALUE", value: lcmR(cycleA, cycleB) };
    }

    case "findNumberOfCompletedLaps":
      return { kind: "COUNT", count: Number(floorRational(divide(multiply(pos(input.speedA, "speedA"), pos(input.timeWindow, "timeWindow")), pos(input.trackLength, "trackLength")))) };

    case "findLocationAfterGivenTime": {
      const L = pos(input.trackLength, "trackLength");
      return { kind: "VALUE", value: position(L, input.startPositionA ?? rational(0), pos(input.speedA, "speedA"), dir(input.directionA), pos(input.timeWindow, "timeWindow")) };
    }

    case "distinguishMeetingAnywhereVsAtStart": {
      const L = pos(input.trackLength, "trackLength");
      return { kind: "LIST", values: [
        period(input),
        lcmR(divide(L, pos(input.speedA, "speedA")), divide(L, pos(input.speedB, "speedB"))),
      ] };
    }

    case "distinguishTotalMeetingsVsDistinctPoints":
      return { kind: "LIST", values: [rational(countInWindow(input)), rational(distinctPoints(input))] };

    case "reconstructCircularMotionFromCheckpointTable": {
      const observations = input.checkpointObservations ?? [];
      if (observations.length < 2) throw new Error("CP006 verifier reconstruction requires two observations");
      const a = observations[0]!;
      const b = observations[1]!;
      const speed = divide(subtract(b.positionA, a.positionA), subtract(b.time, a.time));
      const start = modulo(subtract(a.positionA, multiply(speed, a.time)), pos(input.trackLength, "trackLength"));
      return { kind: "LIST", values: [speed, start] };
    }

    case "classifyCircularStateAsPossibleUniqueOrMultiple": {
      const L = input.trackLength;
      const u = input.speedA;
      const v = input.speedB;
      const impossible = !L || !isPositive(L) || (u ? !isPositive(u) : false) || (v ? !isPositive(v) : false);
      return { kind: "CLASSIFICATION", classification: impossible ? "IMPOSSIBLE" : L && u && v && input.directionA && input.directionB ? "UNIQUE" : "MULTIPLE" };
    }

    case "verifyCircularTrackClaim":
      return { kind: "BOOLEAN", booleanValue: equals(req(input.claimedValue, "claimedValue"), firstMeeting(input)) };

    case "solveCircularTrackDataSufficiency":
      return { kind: "DATA_SUFFICIENCY", dataSufficiency: dsExpected(input) };
  }
}

function sameValues(left: readonly Rational[] | undefined, right: readonly Rational[] | undefined): boolean {
  if (!left || !right || left.length !== right.length) return false;
  return left.every((item, index) => equals(item, right[index]!));
}

export function independentlyVerifyCp006(mode: TsdCp006SolveMode, input: TsdCp006Input, solution: TsdCp006Solution): TsdCp006Verification {
  const errors: string[] = [];
  try {
    const target = expected(mode, input);
    if (solution.checkpointId !== "TSD-CP-006") errors.push("checkpoint id mismatch");
    if (solution.solveMode !== mode) errors.push("solve mode mismatch");
    if (solution.answerKind !== target.kind) errors.push(`answer kind mismatch: expected ${target.kind}, got ${solution.answerKind}`);
    if (target.value && (!solution.value || !equals(solution.value, target.value))) errors.push("value answer mismatch");
    if (target.count !== undefined && solution.count !== target.count) errors.push(`count mismatch: expected ${target.count}, got ${String(solution.count)}`);
    if (target.values && !sameValues(solution.values, target.values)) errors.push("list answer mismatch");
    if (target.booleanValue !== undefined && solution.booleanValue !== target.booleanValue) errors.push("boolean answer mismatch");
    if (target.classification && solution.classification !== target.classification) errors.push("classification mismatch");
    if (target.dataSufficiency && solution.dataSufficiency !== target.dataSufficiency) errors.push("data-sufficiency classification mismatch");
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
