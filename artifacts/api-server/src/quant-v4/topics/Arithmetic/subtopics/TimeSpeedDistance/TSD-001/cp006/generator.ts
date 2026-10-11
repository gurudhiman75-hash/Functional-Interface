import {
  absRational,
  add,
  divide,
  modulo,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import { TSD_CP006_DISCOVERY_CANDIDATES, type TsdCp006SolveMode } from "./discovery-registry";
import { solveCp006 } from "./solver";
import type { TsdCp006GeneratedCase, TsdCp006Input } from "./types";
import { independentlyVerifyCp006 } from "./verifier";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

const TRACKS = [240, 300, 360, 420, 480, 600] as const;
const SPEED_A = [60, 72, 54, 80, 75, 90] as const;
const SPEED_B = [40, 48, 36, 50, 45, 60] as const;
const SPEED_C = [30, 24, 18, 40, 25, 30] as const;

function base(seed: string) {
  const variant = hash(seed) % TRACKS.length;
  return {
    variant,
    L: rational(TRACKS[variant]!),
    u: rational(SPEED_A[variant]!),
    v: rational(SPEED_B[variant]!),
    w: rational(SPEED_C[variant]!),
  };
}

function period(track: Rational, speedA: Rational, speedB: Rational, opposite = false): Rational {
  return divide(track, opposite ? add(speedA, speedB) : absRational(subtract(speedA, speedB)));
}

function meetingPoint(track: Rational, speedA: Rational, speedB: Rational): Rational {
  const t = period(track, speedA, speedB, true);
  return modulo(multiply(speedA, t), track);
}

export function buildCp006Input(mode: TsdCp006SolveMode, seed: string): TsdCp006Input {
  const { variant, L, u, v, w } = base(`${mode}:${seed}`);
  const n = 2 + (variant % 5);
  const samePeriod = period(L, u, v, false);
  const oppositePeriod = period(L, u, v, true);

  switch (mode) {
    case "findCircularFirstMeetingTimeSameDirection":
    case "findFirstOvertakeTime":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: rational(0) });

    case "findCircularFirstMeetingTimeOppositeDirections":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, startPositionA: rational(0), startPositionB: rational(0) });

    case "findLapDifferenceAfterTime":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, timeWindow: rational(8 + variant) });

    case "findMeetingCountInTimeWindow":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, timeWindow: add(multiply(oppositePeriod, rational(3 + variant)), divide(oppositePeriod, rational(2))) });

    case "findOvertakeCountInTimeWindow":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, timeWindow: add(multiply(samePeriod, rational(3 + variant)), divide(samePeriod, rational(2))) });

    case "findNthMeetingTime":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, nthEvent: n });

    case "findNthOvertakeTime":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, nthEvent: n });

    case "findDistinctMeetingPointCount":
    case "findMeetingPointLocation":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, startPositionA: rational(0), startPositionB: rational(0) });

    case "findCircularMeetingPointFromSpeedRatio":
      return Object.freeze({ trackLength: L, speedRatio: divide(u, v) });

    case "findCircularSpeedRatioFromMeetingPoint":
      return Object.freeze({ trackLength: L, meetingPoint: meetingPoint(L, u, v) });

    case "findTrackLengthFromMeetingTime":
      return Object.freeze({ speedA: u, speedB: v, directionA: 1, directionB: -1, observedMeetingTime: oppositePeriod });

    case "findRunnerSpeedFromMeetingCount": {
      const meetings = 3 + (variant % 4);
      const exactWindow = divide(multiply(rational(meetings), L), subtract(u, v));
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, observedMeetingCount: meetings, timeWindow: exactWindow });
    }

    case "findTimeBothReturnToStart":
    case "findFirstSimultaneousStartPointReturn":
    case "findFirstMeetingAtStartingPoint":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: variant % 2 === 0 ? 1 : -1 });

    case "findThreeRunnerSimultaneousReturn":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, speedC: w, directionA: 1, directionB: 1, directionC: 1 });

    case "findThreeRunnerFirstCommonMeeting":
    case "findPairwiseMeetingScheduleForThreeRunners":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, speedC: w, directionA: 1, directionB: 1, directionC: -1 });

    case "findMeetingWithInitialArcGap": {
      const gap = multiply(subtract(u, v), rational(1 + (variant % 3)));
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: gap, initialArcGap: gap });
    }

    case "findInitialArcGapFromMeetingTime": {
      const t = rational(1 + (variant % 3));
      return Object.freeze({ speedA: u, speedB: v, directionA: 1, directionB: 1, observedMeetingTime: t });
    }

    case "findMeetingWithStaggeredStarts": {
      const delay = rational(1 + (variant % 3));
      return Object.freeze({ trackLength: L, speedA: v, speedB: u, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: rational(0), startDelayB: delay });
    }

    case "findStartDelayFromCircularMeeting": {
      const delay = rational(1 + (variant % 3));
      const observed = divide(multiply(delay, u), subtract(u, v));
      return Object.freeze({ trackLength: L, speedA: v, speedB: u, directionA: 1, directionB: 1, observedMeetingTime: observed });
    }

    case "findMeetingAfterDirectionReversal":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: 1, startPositionA: rational(0), startPositionB: rational(0), reversalTimeA: divide(samePeriod, rational(4)) });

    case "findMeetingWithLapRest":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, lapRestA: rational(1 + (variant % 2)) });

    case "findNumberOfCompletedLaps":
      return Object.freeze({ trackLength: L, speedA: u, timeWindow: rational(12 + 2 * variant) });

    case "findLocationAfterGivenTime":
      return Object.freeze({ trackLength: L, speedA: u, directionA: variant % 2 === 0 ? 1 : -1, startPositionA: rational(15 * variant), timeWindow: rational(5 + variant) });

    case "distinguishMeetingAnywhereVsAtStart":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1 });

    case "distinguishTotalMeetingsVsDistinctPoints":
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, timeWindow: add(multiply(oppositePeriod, rational(5 + variant)), divide(oppositePeriod, rational(2))) });

    case "reconstructCircularMotionFromCheckpointTable": {
      const speed = rational(30 + 5 * variant);
      const start = rational(10 + 4 * variant);
      const t1 = rational(1);
      const t2 = rational(2);
      return Object.freeze({
        trackLength: rational(600),
        checkpointObservations: Object.freeze([
          Object.freeze({ time: t1, positionA: add(start, multiply(speed, t1)) }),
          Object.freeze({ time: t2, positionA: add(start, multiply(speed, t2)) }),
        ]),
      });
    }

    case "classifyCircularStateAsPossibleUniqueOrMultiple": {
      if (variant % 3 === 0) return Object.freeze({ trackLength: rational(-1), speedA: u });
      if (variant % 3 === 1) return Object.freeze({ trackLength: L, speedA: u });
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1 });
    }

    case "verifyCircularTrackClaim": {
      const correct = variant % 2 === 0;
      const claimed = correct ? oppositePeriod : add(oppositePeriod, rational(1));
      return Object.freeze({ trackLength: L, speedA: u, speedB: v, directionA: 1, directionB: -1, claimedValue: claimed });
    }

    case "solveCircularTrackDataSufficiency": {
      const cases = [
        { dsStatement1: ["TRACK_LENGTH", "SPEED_A", "SPEED_B", "DIRECTIONS"] as const, dsStatement2: ["MEETING_TIME"] as const },
        { dsStatement1: ["MEETING_TIME"] as const, dsStatement2: ["TRACK_LENGTH", "SPEED_A", "SPEED_B", "DIRECTIONS"] as const },
        { dsStatement1: ["TRACK_LENGTH", "SPEED_A"] as const, dsStatement2: ["SPEED_B", "DIRECTIONS"] as const },
        { dsStatement1: ["TRACK_LENGTH"] as const, dsStatement2: ["SPEED_A"] as const },
        { dsStatement1: ["TRACK_LENGTH", "SPEED_A", "SPEED_B", "DIRECTIONS"] as const, dsStatement2: ["TRACK_LENGTH", "SPEED_A", "SPEED_B", "DIRECTIONS"] as const },
      ];
      return Object.freeze(cases[variant % cases.length]!);
    }
  }
}

export function generateCp006Case(mode: TsdCp006SolveMode, seed: string): TsdCp006GeneratedCase {
  const input = buildCp006Input(mode, seed);
  const solution = solveCp006(mode, input);
  const verification = independentlyVerifyCp006(mode, input, solution);
  if (!verification.valid) throw new Error(`${mode}/${seed}: independent verification failed: ${verification.errors.join("; ")}`);
  return Object.freeze({
    checkpointId: "TSD-CP-006",
    solveMode: mode,
    seed,
    input,
    solution,
    verification,
    lifecycle: Object.freeze({
      discoveryStatus: "EXECUTABLE_DISCOVERY",
      permanentQlAllocated: false,
      englishFreezeStatus: "UNFROZEN",
      questionStudioEnabled: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
  });
}

export function generateCp006AuditCases(casesPerMode = 12): readonly TsdCp006GeneratedCase[] {
  if (!Number.isInteger(casesPerMode) || casesPerMode <= 0) throw new Error("TSD-CP-006 casesPerMode must be a positive integer");
  return Object.freeze(TSD_CP006_DISCOVERY_CANDIDATES.flatMap((mode) =>
    Array.from({ length: casesPerMode }, (_, index) => generateCp006Case(mode, `cp006:${mode}:${index + 1}`)),
  ));
}
