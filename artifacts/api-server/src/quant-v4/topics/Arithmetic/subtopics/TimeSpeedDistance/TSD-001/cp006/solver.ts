import {
  absRational,
  add,
  compare,
  divide,
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
import type {
  TsdCp006DataSufficiency,
  TsdCp006Direction,
  TsdCp006DsFact,
  TsdCp006Input,
  TsdCp006Solution,
} from "./types";
import type { TsdCp006SolveMode } from "./discovery-registry";

function req(value: Rational | undefined, label: string): Rational {
  if (!value) throw new Error(`TSD-CP-006 missing ${label}`);
  return value;
}

function positive(value: Rational | undefined, label: string): Rational {
  const result = req(value, label);
  if (!isPositive(result)) throw new Error(`TSD-CP-006 ${label} must be positive`);
  return result;
}

function direction(value: TsdCp006Direction | undefined, fallback: TsdCp006Direction = 1): TsdCp006Direction {
  return value ?? fallback;
}

function velocity(speed: Rational, dir: TsdCp006Direction): Rational {
  return multiply(speed, rational(dir));
}

function lcmRational(a: Rational, b: Rational): Rational {
  if (!isPositive(a) || !isPositive(b)) throw new Error("TSD-CP-006 LCM requires positive durations");
  return rational(lcmBigInt(a.numerator, b.numerator), gcdBigInt(a.denominator, b.denominator));
}

function lcmMany(values: readonly Rational[]): Rational {
  if (!values.length) throw new Error("TSD-CP-006 LCM requires at least one duration");
  return values.slice(1).reduce((acc, value) => lcmRational(acc, value), values[0]!);
}

function firstPositiveMeeting(
  track: Rational,
  startA: Rational,
  startB: Rational,
  velA: Rational,
  velB: Rational,
  after: Rational = rational(0),
): Rational {
  const relative = subtract(velA, velB);
  if (relative.numerator === 0n) throw new Error("TSD-CP-006 equal signed velocities do not create a new meeting");
  let best: Rational | undefined;
  for (let k = -64; k <= 64; k += 1) {
    const numerator = add(subtract(startB, startA), multiply(rational(k), track));
    const candidate = divide(numerator, relative);
    if (compare(candidate, after) <= 0) continue;
    if (!best || compare(candidate, best) < 0) best = candidate;
  }
  if (!best) throw new Error("TSD-CP-006 could not resolve a positive circular meeting in bounded exact search");
  return best;
}

function pairPeriod(input: TsdCp006Input): Rational {
  const track = positive(input.trackLength, "trackLength");
  const a = positive(input.speedA, "speedA");
  const b = positive(input.speedB, "speedB");
  const va = velocity(a, direction(input.directionA));
  const vb = velocity(b, direction(input.directionB));
  return firstPositiveMeeting(track, rational(0), rational(0), va, vb);
}

function firstPairMeeting(input: TsdCp006Input): Rational {
  const track = positive(input.trackLength, "trackLength");
  const a = positive(input.speedA, "speedA");
  const b = positive(input.speedB, "speedB");
  const pa = input.startPositionA ?? rational(0);
  const pb = input.startPositionB ?? input.initialArcGap ?? rational(0);
  return firstPositiveMeeting(
    track,
    modulo(pa, track),
    modulo(pb, track),
    velocity(a, direction(input.directionA)),
    velocity(b, direction(input.directionB)),
  );
}

function positionAt(track: Rational, start: Rational, speed: Rational, dir: TsdCp006Direction, time: Rational): Rational {
  return modulo(add(start, multiply(velocity(speed, dir), time)), track);
}

function lapDuration(track: Rational, speed: Rational): Rational {
  return divide(track, speed);
}

function countByPeriod(window: Rational, period: Rational): number {
  const count = floorRational(divide(window, period));
  if (count < 0n || count > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("TSD-CP-006 meeting count outside safe integer range");
  return Number(count);
}

function distinctMeetingPointCount(input: TsdCp006Input): number {
  const track = positive(input.trackLength, "trackLength");
  const speedA = positive(input.speedA, "speedA");
  const period = pairPeriod(input);
  const advance = modulo(multiply(velocity(speedA, direction(input.directionA)), period), track);
  if (advance.numerator === 0n) return 1;
  const fraction = divide(advance, track);
  const count = fraction.denominator;
  if (count > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("TSD-CP-006 distinct meeting count outside safe integer range");
  return Number(count);
}

function dsSufficient(facts: readonly TsdCp006DsFact[] | undefined): boolean {
  const set = new Set(facts ?? []);
  return set.has("TRACK_LENGTH") && set.has("SPEED_A") && set.has("SPEED_B") && set.has("DIRECTIONS");
}

function dataSufficiency(input: TsdCp006Input): TsdCp006DataSufficiency {
  const s1 = dsSufficient(input.dsStatement1);
  const s2 = dsSufficient(input.dsStatement2);
  if (s1 && s2) return "EITHER_ALONE";
  if (s1) return "STATEMENT_1_ONLY";
  if (s2) return "STATEMENT_2_ONLY";
  if (dsSufficient([...(input.dsStatement1 ?? []), ...(input.dsStatement2 ?? [])])) return "BOTH_TOGETHER";
  return "NOT_SUFFICIENT";
}

function value(mode: TsdCp006SolveMode, unit: TsdCp006Solution["unit"], answer: Rational, evidence: readonly string[]): TsdCp006Solution {
  return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "VALUE", unit, value: answer, evidence: Object.freeze([...evidence]) });
}

function count(mode: TsdCp006SolveMode, answer: number, evidence: readonly string[]): TsdCp006Solution {
  return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "COUNT", unit: "COUNT", count: answer, evidence: Object.freeze([...evidence]) });
}

function list(mode: TsdCp006SolveMode, unit: TsdCp006Solution["unit"], answers: readonly Rational[], evidence: readonly string[]): TsdCp006Solution {
  return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "LIST", unit, values: Object.freeze([...answers]), evidence: Object.freeze([...evidence]) });
}

export function solveCp006(mode: TsdCp006SolveMode, input: TsdCp006Input): TsdCp006Solution {
  const track = input.trackLength;
  const speedA = input.speedA;
  const speedB = input.speedB;

  switch (mode) {
    case "findCircularFirstMeetingTimeSameDirection":
    case "findFirstOvertakeTime":
    case "findCircularFirstMeetingTimeOppositeDirections":
      return value(mode, "HOUR", firstPairMeeting(input), ["Solve the first positive modular coincidence of the two signed positions."]);

    case "findLapDifferenceAfterTime": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const t = positive(input.timeWindow, "timeWindow");
      return value(mode, "LAP", divide(multiply(absRational(subtract(u, v)), t), L), ["Relative distance divided by track length gives the lap difference."]);
    }

    case "findMeetingCountInTimeWindow":
    case "findOvertakeCountInTimeWindow": {
      const period = pairPeriod(input);
      const window = positive(input.timeWindow, "timeWindow");
      return count(mode, countByPeriod(window, period), ["Count positive meeting periods that do not exceed the time window."]);
    }

    case "findNthMeetingTime":
    case "findNthOvertakeTime": {
      const n = input.nthEvent ?? 1;
      if (!Number.isInteger(n) || n <= 0) throw new Error("TSD-CP-006 nthEvent must be a positive integer");
      return value(mode, "HOUR", multiply(pairPeriod(input), rational(n)), ["For fixed circular relative speed, repeated meetings occur at integer multiples of the fundamental period."]);
    }

    case "findDistinctMeetingPointCount":
      return count(mode, distinctMeetingPointCount(input), ["Reduce the meeting-to-meeting advance as a fraction of one lap; its denominator is the point cycle length."]);

    case "findMeetingPointLocation": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const t = firstPairMeeting(input);
      const p = positionAt(L, input.startPositionA ?? rational(0), u, direction(input.directionA), t);
      return value(mode, "KM", p, ["Resolve the first meeting time, then reduce A's travelled coordinate modulo the track length."]);
    }

    case "findCircularMeetingPointFromSpeedRatio": {
      const L = positive(track, "trackLength");
      const ratio = positive(input.speedRatio, "speedRatio");
      return value(mode, "KM", divide(multiply(L, ratio), add(ratio, rational(1))), ["Opposite-direction distances to the first meeting are in the speed ratio."]);
    }

    case "findCircularSpeedRatioFromMeetingPoint": {
      const L = positive(track, "trackLength");
      const point = req(input.meetingPoint, "meetingPoint");
      if (compare(point, rational(0)) <= 0 || compare(point, L) >= 0) throw new Error("TSD-CP-006 meetingPoint must lie strictly inside one lap");
      return value(mode, "RATIO", divide(point, subtract(L, point)), ["At the first opposite-direction meeting, distance ratio equals speed ratio."]);
    }

    case "findTrackLengthFromMeetingTime": {
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const t = positive(input.observedMeetingTime, "observedMeetingTime");
      const relative = absRational(subtract(velocity(u, direction(input.directionA)), velocity(v, direction(input.directionB))));
      return value(mode, "KM", multiply(relative, t), ["One relative lap is covered in the first meeting period."]);
    }

    case "findRunnerSpeedFromMeetingCount": {
      const L = positive(track, "trackLength");
      const v = positive(speedB, "speedB");
      const t = positive(input.timeWindow, "timeWindow");
      const meetings = input.observedMeetingCount ?? 0;
      if (!Number.isInteger(meetings) || meetings <= 0) throw new Error("TSD-CP-006 observedMeetingCount must be positive");
      return value(mode, "KM_PER_HOUR", add(v, divide(multiply(rational(meetings), L), t)), ["For same-direction overtakes ending exactly at the counted meeting, relative speed is count × lap / time."]);
    }

    case "findTimeBothReturnToStart":
    case "findFirstSimultaneousStartPointReturn": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      return value(mode, "HOUR", lcmRational(lapDuration(L, u), lapDuration(L, v)), ["The first common return is the rational LCM of the individual lap durations."]);
    }

    case "findThreeRunnerSimultaneousReturn": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const w = positive(input.speedC, "speedC");
      return value(mode, "HOUR", lcmMany([lapDuration(L, u), lapDuration(L, v), lapDuration(L, w)]), ["All three are back at the start at the LCM of their lap durations."]);
    }

    case "findThreeRunnerFirstCommonMeeting": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const w = positive(input.speedC, "speedC");
      const vu = velocity(u, direction(input.directionA));
      const vv = velocity(v, direction(input.directionB));
      const vw = velocity(w, direction(input.directionC));
      const ab = firstPositiveMeeting(L, rational(0), rational(0), vu, vv);
      const ac = firstPositiveMeeting(L, rational(0), rational(0), vu, vw);
      return value(mode, "HOUR", lcmRational(ab, ac), ["A common three-runner meeting must satisfy both independent pairwise relative congruences."]);
    }

    case "findPairwiseMeetingScheduleForThreeRunners": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const w = positive(input.speedC, "speedC");
      const vu = velocity(u, direction(input.directionA));
      const vv = velocity(v, direction(input.directionB));
      const vw = velocity(w, direction(input.directionC));
      return list(mode, "HOUR", [
        firstPositiveMeeting(L, rational(0), rational(0), vu, vv),
        firstPositiveMeeting(L, rational(0), rational(0), vu, vw),
        firstPositiveMeeting(L, rational(0), rational(0), vv, vw),
      ], ["Return the AB, AC and BC fundamental meeting periods in that order."]);
    }

    case "findMeetingWithInitialArcGap":
      return value(mode, "HOUR", firstPairMeeting(input), ["Use the supplied initial arc positions in the modular coincidence equation."]);

    case "findInitialArcGapFromMeetingTime": {
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const t = positive(input.observedMeetingTime, "observedMeetingTime");
      const relative = absRational(subtract(velocity(u, direction(input.directionA)), velocity(v, direction(input.directionB))));
      return value(mode, "KM", multiply(relative, t), ["Before the first catch from a known arc gap, gap = relative speed × meeting time."]);
    }

    case "findMeetingWithStaggeredStarts": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const delay = positive(input.startDelayB, "startDelayB");
      const pAAtStartB = positionAt(L, input.startPositionA ?? rational(0), u, direction(input.directionA), delay);
      const pBAtStartB = modulo(input.startPositionB ?? rational(0), L);
      const after = firstPositiveMeeting(L, pAAtStartB, pBAtStartB, velocity(u, direction(input.directionA)), velocity(v, direction(input.directionB)));
      return value(mode, "HOUR", add(delay, after), ["Advance the early runner to the delayed start instant, then solve the circular relative motion from that state."]);
    }

    case "findStartDelayFromCircularMeeting": {
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const t = positive(input.observedMeetingTime, "observedMeetingTime");
      if (compare(v, u) <= 0) throw new Error("TSD-CP-006 delay reconstruction expects B faster than A");
      return value(mode, "HOUR", divide(multiply(subtract(v, u), t), v), ["For the first no-wrap catch, v(t-d)=ut, so d=(v-u)t/v."]);
    }

    case "findMeetingAfterDirectionReversal": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const reversal = positive(input.reversalTimeA, "reversalTimeA");
      const dirA = direction(input.directionA);
      const dirB = direction(input.directionB);
      const pa = positionAt(L, input.startPositionA ?? rational(0), u, dirA, reversal);
      const pb = positionAt(L, input.startPositionB ?? rational(0), v, dirB, reversal);
      const after = firstPositiveMeeting(L, pa, pb, velocity(u, dirA === 1 ? -1 : 1), velocity(v, dirB));
      return value(mode, "HOUR", add(reversal, after), ["Evaluate both positions at reversal, reverse A's signed velocity, then solve the next modular coincidence."]);
    }

    case "findMeetingWithLapRest": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      const rest = req(input.lapRestA, "lapRestA");
      if (compare(rest, rational(0)) < 0) throw new Error("TSD-CP-006 lapRestA cannot be negative");
      return value(mode, "HOUR", lcmRational(add(lapDuration(L, u), rest), lapDuration(L, v)), ["At the start line, A repeats a lap-plus-rest cycle while B repeats its lap cycle; take their LCM."]);
    }

    case "findNumberOfCompletedLaps": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const t = positive(input.timeWindow, "timeWindow");
      const laps = floorRational(divide(multiply(u, t), L));
      if (laps > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("TSD-CP-006 lap count outside safe integer range");
      return count(mode, Number(laps), ["Completed laps are the floor of total distance divided by track length."]);
    }

    case "findLocationAfterGivenTime": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const t = positive(input.timeWindow, "timeWindow");
      return value(mode, "KM", positionAt(L, input.startPositionA ?? rational(0), u, direction(input.directionA), t), ["Reduce signed travelled distance plus the start coordinate modulo one lap."]);
    }

    case "findFirstMeetingAtStartingPoint": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      return value(mode, "HOUR", lcmRational(lapDuration(L, u), lapDuration(L, v)), ["Both must individually complete integral laps, so use the LCM of lap durations."]);
    }

    case "distinguishMeetingAnywhereVsAtStart": {
      const L = positive(track, "trackLength");
      const u = positive(speedA, "speedA");
      const v = positive(speedB, "speedB");
      return list(mode, "HOUR", [pairPeriod(input), lcmRational(lapDuration(L, u), lapDuration(L, v))], ["Return first meeting anywhere followed by first simultaneous start-line return."]);
    }

    case "distinguishTotalMeetingsVsDistinctPoints": {
      const window = positive(input.timeWindow, "timeWindow");
      const total = countByPeriod(window, pairPeriod(input));
      const distinct = distinctMeetingPointCount(input);
      return list(mode, "COUNT", [rational(total), rational(distinct)], ["Meeting events in a window and distinct modular meeting coordinates are different quantities."]);
    }

    case "reconstructCircularMotionFromCheckpointTable": {
      const L = positive(track, "trackLength");
      const observations = input.checkpointObservations ?? [];
      if (observations.length < 2) throw new Error("TSD-CP-006 reconstruction needs at least two checkpoint observations");
      const first = observations[0]!;
      const second = observations[1]!;
      const dt = subtract(second.time, first.time);
      if (!isPositive(dt)) throw new Error("TSD-CP-006 checkpoint times must increase");
      const speed = divide(subtract(second.positionA, first.positionA), dt);
      if (!isPositive(speed)) throw new Error("TSD-CP-006 discovery reconstruction expects a no-wrap increasing checkpoint pair");
      const start = modulo(subtract(first.positionA, multiply(speed, first.time)), L);
      return list(mode, "NONE", [speed, start], ["Use two no-wrap checkpoint rows to reconstruct signed speed and starting coordinate."]);
    }

    case "classifyCircularStateAsPossibleUniqueOrMultiple": {
      const impossible = !track || !isPositive(track) || (speedA ? !isPositive(speedA) : false) || (speedB ? !isPositive(speedB) : false);
      const classification = impossible
        ? "IMPOSSIBLE"
        : track && speedA && speedB && input.directionA && input.directionB
          ? "UNIQUE"
          : "MULTIPLE";
      return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "CLASSIFICATION", unit: "NONE", classification, evidence: Object.freeze(["Classify by physical validity first, then by whether the circular state is fully specified."]) });
    }

    case "verifyCircularTrackClaim": {
      const claimed = req(input.claimedValue, "claimedValue");
      const expected = firstPairMeeting(input);
      const ok = claimed.numerator === expected.numerator && claimed.denominator === expected.denominator;
      return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "BOOLEAN", unit: "NONE", booleanValue: ok, evidence: Object.freeze(["Recompute the first positive modular meeting time and compare it exactly with the claim."]) });
    }

    case "solveCircularTrackDataSufficiency": {
      return Object.freeze({ checkpointId: "TSD-CP-006", solveMode: mode, answerKind: "DATA_SUFFICIENCY", unit: "NONE", dataSufficiency: dataSufficiency(input), evidence: Object.freeze(["A unique first circular meeting period requires track length, both speeds and both directions; test each statement and their union."]) });
    }
  }
}
