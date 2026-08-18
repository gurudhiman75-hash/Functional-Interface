import { add, divide, multiply, rational, subtract, type Rational } from "../foundation/rational";
import { TSD_CP005_DISCOVERY_CANDIDATES } from "./discovery-registry";
import { bouncePosition, solveCp005 } from "./solver";
import type { TsdCp005GeneratedCase, TsdCp005Input, TsdCp005SolveMode } from "./types";
import { independentlyVerifyCp005 } from "./verifier";

const SPEED_PAIRS = Object.freeze([
  [60, 40],
  [72, 48],
  [54, 36],
  [80, 50],
  [75, 45],
  [90, 60],
] as const);

function ordinal(seed: string): number {
  return Number(seed.match(/(\d+)$/)?.[1] ?? "0");
}

function base(seed: string) {
  const index = ordinal(seed);
  const [a, b] = SPEED_PAIRS[index % SPEED_PAIRS.length]!;
  // Preserve the approved discovery/review states, but give the large English audit
  // surface a wider route lattice so 30 cases per learner authority are genuinely
  // mathematically distinct rather than cycling through the original 5-route grid.
  const route = seed.startsWith("cp005-audit-v")
    ? rational(120 + 5 * index)
    : rational(120 + 60 * (index % 5));
  const speedA = rational(a);
  const speedB = rational(b);
  const totalSpeed = add(speedA, speedB);
  const firstTime = divide(route, totalSpeed);
  const firstPoint = multiply(speedA, firstTime);
  const postMeetingTimeA = divide(subtract(route, firstPoint), speedA);
  const postMeetingTimeB = divide(firstPoint, speedB);
  const speedRatio = divide(speedA, speedB);
  return { index, route, speedA, speedB, totalSpeed, firstTime, firstPoint, postMeetingTimeA, postMeetingTimeB, speedRatio };
}

function nthTime(route: Rational, totalSpeed: Rational, n: number): Rational {
  return divide(multiply(rational(2 * n - 1), route), totalSpeed);
}

export function buildCp005Input(mode: TsdCp005SolveMode, seed: string): TsdCp005Input {
  const state = base(seed);
  const common = { routeDistance: state.route, speedA: state.speedA, speedB: state.speedB } as const;

  switch (mode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes":
      return Object.freeze({ postMeetingTimeA: state.postMeetingTimeA, postMeetingTimeB: state.postMeetingTimeB });

    case "findPostMeetingArrivalTimeFromSpeedRatio":
      return Object.freeze({ routeDistance: state.route, speedA: state.speedA, speedRatio: state.speedRatio, targetPostBody: state.index % 2 === 0 ? "A" : "B" });

    case "findTotalDistanceFromPostMeetingTimes":
      return Object.freeze({ speedA: state.speedA, postMeetingTimeA: state.postMeetingTimeA, postMeetingTimeB: state.postMeetingTimeB });

    case "findSpeedsFromPostMeetingTimesAndDistance":
    case "findMeetingPointFromPostMeetingTimes":
      return Object.freeze({ routeDistance: state.route, postMeetingTimeA: state.postMeetingTimeA, postMeetingTimeB: state.postMeetingTimeB });

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findSecondMeetingPointAfterEndpointTurnaround":
    case "findMeetingAfterOneTravellerTurnsBack":
    case "findMeetingAfterBothTurnAtEndpoints":
    case "findShuttleMeetingTime":
    case "findShuttleDistanceCovered":
    case "findReturnJourneyMeetingPoint":
    case "findTimeBetweenFirstAndSecondMeetings":
    case "findPassThenCatchAfterTurnaround":
      return Object.freeze(common);

    case "findNthMeetingTimeOnLine":
    case "findNthMeetingPointOnLine":
      return Object.freeze({ ...common, nthMeeting: 2 + (state.index % 5) });

    case "reconstructCompleteLinearItinerary":
      return Object.freeze({ ...common, nthMeeting: 1 + (state.index % 5) });

    case "findRepeatedMeetingCountInTimeWindow": {
      const targetCount = 3 + (state.index % 5);
      const targetTime = nthTime(state.route, state.totalSpeed, targetCount);
      const nextTime = nthTime(state.route, state.totalSpeed, targetCount + 1);
      const window = divide(add(targetTime, nextTime), rational(2));
      return Object.freeze({ ...common, timeWindow: window });
    }

    case "findMeetingPointShiftAfterSpeedChange": {
      const changedSpeedA = add(state.speedA, rational(6 + 3 * (state.index % 4)));
      return Object.freeze({ ...common, changedSpeedA });
    }

    case "findSpeedChangeFromMeetingPointShift": {
      const changedSpeedA = add(state.speedA, rational(6 + 3 * (state.index % 4)));
      const originalPoint = divide(multiply(state.route, state.speedA), state.totalSpeed);
      const changedPoint = divide(multiply(state.route, changedSpeedA), add(changedSpeedA, state.speedB));
      return Object.freeze({ ...common, meetingPointShift: subtract(changedPoint, originalPoint) });
    }

    case "findStartDelayFromMeetingPoint":
    case "findStaggeredDepartureMeetingPoint":
    case "findMeetingAtSpecifiedCheckpoint": {
      const delay = state.index % 2 === 0 ? rational(1, 4) : rational(1, 2);
      const point = divide(multiply(state.speedA, subtract(state.route, multiply(state.speedB, delay))), state.totalSpeed);
      if (mode === "findStartDelayFromMeetingPoint") return Object.freeze({ ...common, meetingPointFromA: point });
      if (mode === "findMeetingAtSpecifiedCheckpoint") return Object.freeze({ ...common, specifiedCheckpoint: point });
      return Object.freeze({ ...common, startDelayA: delay });
    }

    case "findIntermediateStartPointFromMeetingData": {
      const startPositionA = divide(state.route, rational(10 + (state.index % 3)));
      const time = divide(subtract(state.route, startPositionA), state.totalSpeed);
      const point = add(startPositionA, multiply(state.speedA, time));
      return Object.freeze({ ...common, meetingPointFromA: point, startPositionA });
    }

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const endpointRestA = state.index % 2 === 0 ? rational(1, 4) : rational(1, 3);
      const observedSecondMeetingTime = divide(add(multiply(rational(3), state.route), multiply(state.speedA, endpointRestA)), state.totalSpeed);
      return Object.freeze({ ...common, endpointRestA, observedSecondMeetingTime });
    }

    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const observedFirstMeetingTime = state.firstTime;
      const observedSecondMeetingTime = nthTime(state.route, state.totalSpeed, 2);
      return Object.freeze({ speedA: state.speedA, speedB: state.speedB, observedFirstMeetingTime, observedSecondMeetingTime });
    }

    case "detectContradictoryMeetingStatements": {
      const n = 1 + (state.index % 4);
      const time = nthTime(state.route, state.totalSpeed, n);
      const point = bouncePosition(multiply(state.speedA, time), state.route);
      return Object.freeze({ ...common, nthMeeting: n, claimedMeetingTime: time, claimedMeetingPoint: add(point, rational(1)) });
    }

    case "classifyPostMeetingStateAsPossibleUniqueOrMultiple": {
      const variant = state.index % 3;
      if (variant === 0) return Object.freeze({ ...common });
      if (variant === 1) return Object.freeze({ routeDistance: state.route, speedA: state.speedA });
      return Object.freeze({ routeDistance: rational(-1), speedA: state.speedA, speedB: state.speedB });
    }

    case "verifyPostMeetingClaim": {
      const n = 1 + (state.index % 4);
      const time = nthTime(state.route, state.totalSpeed, n);
      const point = bouncePosition(multiply(state.speedA, time), state.route);
      return state.index % 2 === 0
        ? Object.freeze({ ...common, nthMeeting: n, claimedMeetingTime: time, claimedMeetingPoint: point })
        : Object.freeze({ ...common, nthMeeting: n, claimedMeetingTime: add(time, rational(1, 60)), claimedMeetingPoint: point });
    }

    case "solvePostMeetingDataSufficiency": {
      const variant = state.index % 5;
      if (variant === 0) return Object.freeze({ dsStatement1: ["POST_TIME_A", "POST_TIME_B"], dsStatement2: ["SPEED_A"] });
      if (variant === 1) return Object.freeze({ dsStatement1: ["POST_TIME_A"], dsStatement2: ["SPEED_A", "SPEED_B"] });
      if (variant === 2) return Object.freeze({ dsStatement1: ["POST_TIME_A"], dsStatement2: ["POST_TIME_B"] });
      if (variant === 3) return Object.freeze({ dsStatement1: ["POST_TIME_A", "POST_TIME_B"], dsStatement2: ["SPEED_A", "SPEED_B"] });
      return Object.freeze({ dsStatement1: ["POST_TIME_A"], dsStatement2: ["SPEED_A"] });
    }
  }
}

export function generateCp005Case(mode: TsdCp005SolveMode, seed: string): TsdCp005GeneratedCase {
  const input = buildCp005Input(mode, seed);
  const solution = solveCp005(mode, input);
  const verification = independentlyVerifyCp005(input, solution);
  return Object.freeze({
    checkpointId: "TSD-CP-005" as const,
    solveMode: mode,
    seed,
    input,
    solution,
    verification,
    lifecycle: Object.freeze({
      discoveryStatus: "EXECUTABLE_DISCOVERY" as const,
      permanentQlAllocated: false as const,
      englishFreezeStatus: "UNFROZEN" as const,
      questionStudioEnabled: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function generateCp005AuditPool(perMode = 12): readonly TsdCp005GeneratedCase[] {
  if (!Number.isInteger(perMode) || perMode <= 0) throw new Error("CP005 perMode must be a positive integer");
  return Object.freeze(TSD_CP005_DISCOVERY_CANDIDATES.flatMap((mode, modeIndex) =>
    Array.from({ length: perMode }, (_unused, index) => generateCp005Case(mode, `cp005:${modeIndex}:${index}`)),
  ));
}
