import {
  add,
  compare,
  divide,
  equals,
  floorRational,
  multiply,
  rational,
  subtract,
  toCanonicalString,
  type Rational,
} from "../foundation/rational";
import type {
  TsdCp005DataSufficiency,
  TsdCp005DsFact,
  TsdCp005Input,
  TsdCp005Solution,
  TsdCp005SolveMode,
} from "./types";

function required(value: Rational | undefined, name: string): Rational {
  if (!value) throw new Error(`CP005 missing required input: ${name}`);
  return value;
}

function positive(value: Rational, name: string): Rational {
  if (compare(value, rational(0)) <= 0) throw new Error(`CP005 ${name} must be positive`);
  return value;
}

function positiveInteger(value: number | undefined, name: string): number {
  if (!Number.isInteger(value) || (value ?? 0) <= 0) throw new Error(`CP005 ${name} must be a positive integer`);
  return value!;
}

function sqrtBigIntExact(value: bigint): bigint {
  if (value < 0n) throw new Error("CP005 cannot take square root of a negative value");
  if (value < 2n) return value;
  let x = value;
  let y = (x + value / x) >> 1n;
  while (y < x) {
    x = y;
    y = (x + value / x) >> 1n;
  }
  if (x * x !== value) throw new Error(`CP005 expected an exact square, received ${value}`);
  return x;
}

export function sqrtRationalExact(value: Rational): Rational {
  positive(value, "square-root input");
  return rational(sqrtBigIntExact(value.numerator), sqrtBigIntExact(value.denominator));
}

function sumSpeeds(input: TsdCp005Input): { route: Rational; speedA: Rational; speedB: Rational; totalSpeed: Rational } {
  const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
  const speedA = positive(required(input.speedA, "speedA"), "speedA");
  const speedB = positive(required(input.speedB, "speedB"), "speedB");
  return { route, speedA, speedB, totalSpeed: add(speedA, speedB) };
}

export function bouncePosition(distanceTravelled: Rational, routeDistance: Rational): Rational {
  const route = positive(routeDistance, "routeDistance");
  const period = multiply(rational(2), route);
  const quotient = floorRational(divide(distanceTravelled, period));
  const remainder = subtract(distanceTravelled, multiply(rational(quotient), period));
  return compare(remainder, route) <= 0 ? remainder : subtract(period, remainder);
}

function firstMeetingPoint(route: Rational, speedA: Rational, speedB: Rational): Rational {
  return divide(multiply(route, speedA), add(speedA, speedB));
}

function nthMeetingTime(route: Rational, speedA: Rational, speedB: Rational, n: number): Rational {
  return divide(multiply(rational(2 * n - 1), route), add(speedA, speedB));
}

function oneTravellerTurnMeetingTime(route: Rational, speedA: Rational, speedB: Rational): Rational {
  if (compare(speedA, speedB) <= 0) throw new Error("CP005 turnaround meeting requires traveller A to be faster than traveller B");
  return divide(multiply(rational(2), route), add(speedA, speedB));
}

function ratioFromPostTimes(input: TsdCp005Input): Rational {
  const timeA = positive(required(input.postMeetingTimeA, "postMeetingTimeA"), "postMeetingTimeA");
  const timeB = positive(required(input.postMeetingTimeB, "postMeetingTimeB"), "postMeetingTimeB");
  return sqrtRationalExact(divide(timeB, timeA));
}

function postMeetingTimes(route: Rational, speedA: Rational, speedB: Rational): { meetingPoint: Rational; timeA: Rational; timeB: Rational } {
  const meetingPoint = firstMeetingPoint(route, speedA, speedB);
  return {
    meetingPoint,
    timeA: divide(subtract(route, meetingPoint), speedA),
    timeB: divide(meetingPoint, speedB),
  };
}

function isFactSetSufficient(facts: readonly TsdCp005DsFact[] | undefined): boolean {
  const set = new Set(facts ?? []);
  return (set.has("POST_TIME_A") && set.has("POST_TIME_B")) || (set.has("SPEED_A") && set.has("SPEED_B"));
}

function classifyDataSufficiency(statement1: readonly TsdCp005DsFact[] | undefined, statement2: readonly TsdCp005DsFact[] | undefined): TsdCp005DataSufficiency {
  const first = isFactSetSufficient(statement1);
  const second = isFactSetSufficient(statement2);
  if (first && second) return "EITHER_ALONE";
  if (first) return "STATEMENT_1_ONLY";
  if (second) return "STATEMENT_2_ONLY";
  if (isFactSetSufficient([...(statement1 ?? []), ...(statement2 ?? [])])) return "BOTH_TOGETHER";
  return "INSUFFICIENT";
}

function valueSolution(solveMode: TsdCp005SolveMode, value: Rational, unit: TsdCp005Solution["unit"], derivation: readonly string[]): TsdCp005Solution {
  return Object.freeze({ solveMode, answerKind: "VALUE" as const, unit, value, derivation: Object.freeze([...derivation]) });
}

export function solveCp005(mode: TsdCp005SolveMode, input: TsdCp005Input): TsdCp005Solution {
  switch (mode) {
    case "findSpeedRatioFromPostMeetingArrivalTimes": {
      const ratio = ratioFromPostTimes(input);
      return valueSolution(mode, ratio, "RATIO", ["For opposite-end first meeting, post-meeting arrival-time ratio equals the square of the speed ratio.", `speed ratio = ${toCanonicalString(ratio)}`]);
    }

    case "findPostMeetingArrivalTimeFromSpeedRatio": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const ratio = positive(required(input.speedRatio, "speedRatio"), "speedRatio");
      const speedB = divide(speedA, ratio);
      const times = postMeetingTimes(route, speedA, speedB);
      const value = input.targetPostBody === "B" ? times.timeB : times.timeA;
      return valueSolution(mode, value, "HOUR", [`speedB = speedA ÷ ratio = ${toCanonicalString(speedB)}`, `post-meeting time = ${toCanonicalString(value)}`]);
    }

    case "findTotalDistanceFromPostMeetingTimes": {
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const timeA = positive(required(input.postMeetingTimeA, "postMeetingTimeA"), "postMeetingTimeA");
      const ratio = ratioFromPostTimes(input);
      const route = multiply(multiply(timeA, speedA), add(ratio, rational(1)));
      return valueSolution(mode, route, "KM", [`speed ratio = ${toCanonicalString(ratio)}`, `route = tA × speedA × (ratio + 1) = ${toCanonicalString(route)}`]);
    }

    case "findSpeedsFromPostMeetingTimesAndDistance": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const timeA = positive(required(input.postMeetingTimeA, "postMeetingTimeA"), "postMeetingTimeA");
      const ratio = ratioFromPostTimes(input);
      const speedA = divide(route, multiply(timeA, add(ratio, rational(1))));
      const speedB = divide(speedA, ratio);
      return Object.freeze({ solveMode: mode, answerKind: "PAIR" as const, unit: "KM_PER_HOUR" as const, values: Object.freeze([speedA, speedB]), derivation: Object.freeze([`speed ratio = ${toCanonicalString(ratio)}`, `speeds = ${toCanonicalString(speedA)}, ${toCanonicalString(speedB)}`]) });
    }

    case "findMeetingPointFromPostMeetingTimes": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const ratio = ratioFromPostTimes(input);
      const point = divide(multiply(route, ratio), add(ratio, rational(1)));
      return valueSolution(mode, point, "KM", [`meeting-point fraction from A = ratio ÷ (ratio + 1)`, `meeting point = ${toCanonicalString(point)}`]);
    }

    case "findSecondMeetingTimeAfterEndpointTurnaround":
    case "findMeetingAfterBothTurnAtEndpoints": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const time = nthMeetingTime(route, speedA, speedB, 2);
      return valueSolution(mode, time, "HOUR", [`second meeting occurs after combined path 3L`, `time = 3L ÷ (speedA + speedB) = ${toCanonicalString(time)}`]);
    }

    case "findSecondMeetingPointAfterEndpointTurnaround": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const time = nthMeetingTime(route, speedA, speedB, 2);
      const point = bouncePosition(multiply(speedA, time), route);
      return Object.freeze({ solveMode: mode, answerKind: "VALUE" as const, unit: "KM" as const, value: point, meetingPointFromA: point, derivation: Object.freeze([`second-meeting time = ${toCanonicalString(time)}`, `reflect A's travelled distance at the endpoints to get ${toCanonicalString(point)}`]) });
    }

    case "findNthMeetingTimeOnLine": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const n = positiveInteger(input.nthMeeting, "nthMeeting");
      const time = nthMeetingTime(route, speedA, speedB, n);
      return valueSolution(mode, time, "HOUR", [`nth meeting requires combined path (2n-1)L`, `time = ${toCanonicalString(time)}`]);
    }

    case "findNthMeetingPointOnLine": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const n = positiveInteger(input.nthMeeting, "nthMeeting");
      const time = nthMeetingTime(route, speedA, speedB, n);
      const point = bouncePosition(multiply(speedA, time), route);
      return Object.freeze({ solveMode: mode, answerKind: "VALUE" as const, unit: "KM" as const, value: point, meetingPointFromA: point, derivation: Object.freeze([`nth-meeting time = ${toCanonicalString(time)}`, `endpoint reflection gives point ${toCanonicalString(point)}`]) });
    }

    case "findRepeatedMeetingCountInTimeWindow": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const window = positive(required(input.timeWindow, "timeWindow"), "timeWindow");
      const scaled = divide(multiply(add(speedA, speedB), window), route);
      const count = floorRational(divide(add(scaled, rational(1)), rational(2)));
      const bounded = count < 0n ? 0n : count;
      return valueSolution(mode, rational(bounded), "COUNT", [`meetings occur at odd multiples of L/(u+v)`, `count = ${bounded}`]);
    }

    case "findMeetingAfterOneTravellerTurnsBack":
    case "findShuttleMeetingTime":
    case "findPassThenCatchAfterTurnaround": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const time = oneTravellerTurnMeetingTime(route, speedA, speedB);
      return valueSolution(mode, time, "HOUR", [`after A reaches the far endpoint and turns, 2L - u·t = v·t`, `time = ${toCanonicalString(time)}`]);
    }

    case "findShuttleDistanceCovered": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const time = oneTravellerTurnMeetingTime(route, speedA, speedB);
      const distance = multiply(speedA, time);
      return valueSolution(mode, distance, "KM", [`turnaround meeting time = ${toCanonicalString(time)}`, `shuttle distance = speedA × time = ${toCanonicalString(distance)}`]);
    }

    case "findReturnJourneyMeetingPoint": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const time = oneTravellerTurnMeetingTime(route, speedA, speedB);
      const point = multiply(speedB, time);
      return Object.freeze({ solveMode: mode, answerKind: "VALUE" as const, unit: "KM" as const, value: point, meetingPointFromA: point, derivation: Object.freeze([`turnaround meeting time = ${toCanonicalString(time)}`, `slower traveller's position = ${toCanonicalString(point)}`]) });
    }

    case "findMeetingPointShiftAfterSpeedChange": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const changedSpeedA = positive(required(input.changedSpeedA, "changedSpeedA"), "changedSpeedA");
      const original = firstMeetingPoint(route, speedA, speedB);
      const changed = firstMeetingPoint(route, changedSpeedA, speedB);
      const shift = subtract(changed, original);
      return valueSolution(mode, shift, "KM", [`original point = ${toCanonicalString(original)}`, `changed point = ${toCanonicalString(changed)}`, `shift = ${toCanonicalString(shift)}`]);
    }

    case "findSpeedChangeFromMeetingPointShift": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const shift = required(input.meetingPointShift, "meetingPointShift");
      const original = firstMeetingPoint(route, speedA, speedB);
      const target = add(original, shift);
      if (compare(target, rational(0)) <= 0 || compare(target, route) >= 0) throw new Error("CP005 shifted meeting point must remain inside the route");
      const changedSpeed = divide(multiply(speedB, target), subtract(route, target));
      const change = subtract(changedSpeed, speedA);
      return valueSolution(mode, change, "KM_PER_HOUR", [`target meeting point = ${toCanonicalString(target)}`, `changed speed = ${toCanonicalString(changedSpeed)}`, `speed change = ${toCanonicalString(change)}`]);
    }

    case "findStartDelayFromMeetingPoint":
    case "findMeetingAtSpecifiedCheckpoint": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const point = mode === "findMeetingAtSpecifiedCheckpoint"
        ? required(input.specifiedCheckpoint, "specifiedCheckpoint")
        : required(input.meetingPointFromA, "meetingPointFromA");
      if (compare(point, rational(0)) <= 0 || compare(point, route) >= 0) throw new Error("CP005 meeting checkpoint must lie inside the route");
      const absoluteTime = divide(subtract(route, point), speedB);
      const travelTimeA = divide(point, speedA);
      const delay = subtract(absoluteTime, travelTimeA);
      return valueSolution(mode, delay, "HOUR", [`B's time to the meeting point = ${toCanonicalString(absoluteTime)}`, `A's travel time = ${toCanonicalString(travelTimeA)}`, `A's start delay = ${toCanonicalString(delay)}`]);
    }

    case "findStaggeredDepartureMeetingPoint": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const delay = required(input.startDelayA, "startDelayA");
      const remainingEffectiveRoute = subtract(route, multiply(speedB, delay));
      if (compare(remainingEffectiveRoute, rational(0)) <= 0) throw new Error("CP005 delay lets B reach A before A starts");
      const point = divide(multiply(speedA, remainingEffectiveRoute), add(speedA, speedB));
      return Object.freeze({ solveMode: mode, answerKind: "VALUE" as const, unit: "KM" as const, value: point, meetingPointFromA: point, derivation: Object.freeze([`effective route after A's delay = ${toCanonicalString(remainingEffectiveRoute)}`, `meeting point = ${toCanonicalString(point)}`]) });
    }

    case "findIntermediateStartPointFromMeetingData": {
      const route = positive(required(input.routeDistance, "routeDistance"), "routeDistance");
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const point = required(input.meetingPointFromA, "meetingPointFromA");
      const meetingTime = divide(subtract(route, point), speedB);
      const startPoint = subtract(point, multiply(speedA, meetingTime));
      return valueSolution(mode, startPoint, "KM", [`meeting time from B's travel = ${toCanonicalString(meetingTime)}`, `A start point = meeting point - speedA × time = ${toCanonicalString(startPoint)}`]);
    }

    case "findEndpointRestTimeFromNextMeeting":
    case "findRouteReversalScheduleParameter": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const secondMeetingTime = positive(required(input.observedSecondMeetingTime, "observedSecondMeetingTime"), "observedSecondMeetingTime");
      const rest = divide(subtract(multiply(add(speedA, speedB), secondMeetingTime), multiply(rational(3), route)), speedA);
      if (compare(rest, rational(0)) < 0) throw new Error("CP005 observed second meeting implies negative endpoint rest");
      return valueSolution(mode, rest, "HOUR", [`combined moving distance by second meeting = 3L + speedA × rest`, `rest = ${toCanonicalString(rest)}`]);
    }

    case "findTimeBetweenFirstAndSecondMeetings": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const gap = divide(multiply(rational(2), route), add(speedA, speedB));
      return valueSolution(mode, gap, "HOUR", [`between consecutive reflected-line meetings the combined distance increases by 2L`, `time gap = ${toCanonicalString(gap)}`]);
    }

    case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
      const speedA = positive(required(input.speedA, "speedA"), "speedA");
      const speedB = positive(required(input.speedB, "speedB"), "speedB");
      const first = positive(required(input.observedFirstMeetingTime, "observedFirstMeetingTime"), "observedFirstMeetingTime");
      const second = positive(required(input.observedSecondMeetingTime, "observedSecondMeetingTime"), "observedSecondMeetingTime");
      const gap = subtract(second, first);
      if (compare(gap, rational(0)) <= 0) throw new Error("CP005 second meeting must occur after first meeting");
      const route = divide(multiply(add(speedA, speedB), gap), rational(2));
      return valueSolution(mode, route, "KM", [`meeting-time gap = ${toCanonicalString(gap)}`, `route = (speedA + speedB) × gap ÷ 2 = ${toCanonicalString(route)}`]);
    }

    case "reconstructCompleteLinearItinerary": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const n = positiveInteger(input.nthMeeting, "nthMeeting");
      const time = nthMeetingTime(route, speedA, speedB, n);
      const distanceA = multiply(speedA, time);
      const distanceB = multiply(speedB, time);
      const point = bouncePosition(distanceA, route);
      return Object.freeze({ solveMode: mode, answerKind: "ITINERARY" as const, unit: "KM" as const, value: time, values: Object.freeze([distanceA, distanceB]), meetingPointFromA: point, derivation: Object.freeze([`meeting time = ${toCanonicalString(time)}`, `A total path = ${toCanonicalString(distanceA)}`, `B total path = ${toCanonicalString(distanceB)}`, `meeting point from A endpoint = ${toCanonicalString(point)}`]) });
    }

    case "detectContradictoryMeetingStatements":
    case "verifyPostMeetingClaim": {
      const { route, speedA, speedB } = sumSpeeds(input);
      const n = input.nthMeeting ?? 1;
      const expectedTime = nthMeetingTime(route, speedA, speedB, positiveInteger(n, "nthMeeting"));
      const expectedPoint = bouncePosition(multiply(speedA, expectedTime), route);
      const timeMatches = input.claimedMeetingTime ? equals(input.claimedMeetingTime, expectedTime) : true;
      const pointMatches = input.claimedMeetingPoint ? equals(input.claimedMeetingPoint, expectedPoint) : true;
      const validClaim = timeMatches && pointMatches;
      const booleanValue = mode === "detectContradictoryMeetingStatements" ? !validClaim : validClaim;
      return Object.freeze({ solveMode: mode, answerKind: "BOOLEAN" as const, unit: "NONE" as const, booleanValue, derivation: Object.freeze([`expected time = ${toCanonicalString(expectedTime)}`, `expected point = ${toCanonicalString(expectedPoint)}`, `${mode === "detectContradictoryMeetingStatements" ? "contradictory" : "verified"} = ${booleanValue}`]) });
    }

    case "classifyPostMeetingStateAsPossibleUniqueOrMultiple": {
      const positiveInputs = [input.routeDistance, input.speedA, input.speedB, input.postMeetingTimeA, input.postMeetingTimeB].filter((value): value is Rational => value !== undefined);
      const impossible = positiveInputs.some((value) => compare(value, rational(0)) <= 0);
      const unique = Boolean(
        (input.routeDistance && input.speedA && input.speedB)
        || (input.routeDistance && input.postMeetingTimeA && input.postMeetingTimeB),
      );
      const classification = impossible ? "IMPOSSIBLE" as const : unique ? "UNIQUE" as const : "MULTIPLE" as const;
      return Object.freeze({ solveMode: mode, answerKind: "CLASSIFICATION" as const, unit: "NONE" as const, classification, derivation: Object.freeze([`classification = ${classification}`]) });
    }

    case "solvePostMeetingDataSufficiency": {
      const dataSufficiency = classifyDataSufficiency(input.dsStatement1, input.dsStatement2);
      return Object.freeze({ solveMode: mode, answerKind: "DATA_SUFFICIENCY" as const, unit: "NONE" as const, dataSufficiency, derivation: Object.freeze([`data sufficiency = ${dataSufficiency}`]) });
    }
  }
}
