import {
  add,
  compare,
  divide,
  equals,
  floorRational,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp005DsFact, TsdCp005Input, TsdCp005Solution, TsdCp005Verification } from "./types";

function required(value: Rational | undefined, name: string, errors: string[]): Rational | null {
  if (!value) {
    errors.push(`missing ${name}`);
    return null;
  }
  return value;
}

function reflectedPosition(distanceTravelled: Rational, route: Rational): Rational {
  const period = multiply(rational(2), route);
  const k = floorRational(divide(distanceTravelled, period));
  const r = subtract(distanceTravelled, multiply(rational(k), period));
  return compare(r, route) <= 0 ? r : subtract(period, r);
}

function meetingPoint(route: Rational, speedA: Rational, speedB: Rational): Rational {
  const time = divide(route, add(speedA, speedB));
  return multiply(speedA, time);
}

function solutionValue(solution: TsdCp005Solution, errors: string[]): Rational | null {
  if (!solution.value) errors.push("solution missing scalar value");
  return solution.value ?? null;
}

function factSetSufficient(facts: readonly TsdCp005DsFact[] | undefined): boolean {
  const set = new Set(facts ?? []);
  return (set.has("POST_TIME_A") && set.has("POST_TIME_B")) || (set.has("SPEED_A") && set.has("SPEED_B"));
}

export function independentlyVerifyCp005(input: TsdCp005Input, solution: TsdCp005Solution): TsdCp005Verification {
  const errors: string[] = [];
  const mode = solution.solveMode;

  try {
    switch (mode) {
      case "findSpeedRatioFromPostMeetingArrivalTimes": {
        const timeA = required(input.postMeetingTimeA, "postMeetingTimeA", errors);
        const timeB = required(input.postMeetingTimeB, "postMeetingTimeB", errors);
        const ratio = solutionValue(solution, errors);
        if (timeA && timeB && ratio && !equals(multiply(multiply(ratio, ratio), timeA), timeB)) errors.push("speed ratio does not satisfy squared post-arrival-time invariant");
        break;
      }

      case "findPostMeetingArrivalTimeFromSpeedRatio": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const ratio = required(input.speedRatio, "speedRatio", errors);
        const observed = solutionValue(solution, errors);
        if (route && speedA && ratio && observed) {
          const speedB = divide(speedA, ratio);
          const firstTime = divide(route, add(speedA, speedB));
          const point = multiply(speedA, firstTime);
          const expected = input.targetPostBody === "B" ? divide(point, speedB) : divide(subtract(route, point), speedA);
          if (!equals(observed, expected)) errors.push("post-meeting arrival time does not match route reconstruction");
        }
        break;
      }

      case "findTotalDistanceFromPostMeetingTimes": {
        const route = solutionValue(solution, errors);
        const speedA = required(input.speedA, "speedA", errors);
        const timeA = required(input.postMeetingTimeA, "postMeetingTimeA", errors);
        const timeB = required(input.postMeetingTimeB, "postMeetingTimeB", errors);
        if (route && speedA && timeA && timeB) {
          const denominator = subtract(route, multiply(timeA, speedA));
          if (compare(denominator, rational(0)) <= 0) errors.push("candidate route makes post-meeting geometry impossible");
          else {
            const speedB = divide(multiply(timeA, multiply(speedA, speedA)), denominator);
            const firstTime = divide(route, add(speedA, speedB));
            const point = multiply(speedA, firstTime);
            if (!equals(divide(point, speedB), timeB)) errors.push("candidate route does not satisfy both post-meeting arrival times");
          }
        }
        break;
      }

      case "findSpeedsFromPostMeetingTimesAndDistance": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const timeA = required(input.postMeetingTimeA, "postMeetingTimeA", errors);
        const timeB = required(input.postMeetingTimeB, "postMeetingTimeB", errors);
        const speeds = solution.values;
        if (!speeds || speeds.length !== 2) errors.push("speed-pair solution must contain exactly two values");
        if (route && timeA && timeB && speeds?.length === 2) {
          const [speedA, speedB] = speeds;
          const firstTime = divide(route, add(speedA!, speedB!));
          const point = multiply(speedA!, firstTime);
          if (!equals(divide(subtract(route, point), speedA!), timeA)) errors.push("speed A fails post-meeting arrival equation");
          if (!equals(divide(point, speedB!), timeB)) errors.push("speed B fails post-meeting arrival equation");
        }
        break;
      }

      case "findMeetingPointFromPostMeetingTimes": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const timeA = required(input.postMeetingTimeA, "postMeetingTimeA", errors);
        const timeB = required(input.postMeetingTimeB, "postMeetingTimeB", errors);
        const point = solutionValue(solution, errors);
        if (route && timeA && timeB && point) {
          if (compare(point, rational(0)) <= 0 || compare(point, route) >= 0) errors.push("meeting point lies outside route");
          else {
            const distanceRatio = divide(point, subtract(route, point));
            if (!equals(multiply(multiply(distanceRatio, distanceRatio), timeA), timeB)) errors.push("meeting point does not satisfy post-arrival square relation");
          }
        }
        break;
      }

      case "findSecondMeetingTimeAfterEndpointTurnaround":
      case "findMeetingAfterBothTurnAtEndpoints":
      case "findNthMeetingTimeOnLine": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const time = solutionValue(solution, errors);
        const n = mode === "findNthMeetingTimeOnLine" ? input.nthMeeting : 2;
        if (route && speedA && speedB && time && n && !equals(multiply(add(speedA, speedB), time), multiply(rational(2 * n - 1), route))) errors.push("meeting time fails reflected-line combined-path invariant");
        break;
      }

      case "findSecondMeetingPointAfterEndpointTurnaround":
      case "findNthMeetingPointOnLine": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const point = solutionValue(solution, errors);
        const n = mode === "findNthMeetingPointOnLine" ? input.nthMeeting : 2;
        if (route && speedA && speedB && point && n) {
          const time = divide(multiply(rational(2 * n - 1), route), add(speedA, speedB));
          const a = reflectedPosition(multiply(speedA, time), route);
          const bFromRight = reflectedPosition(multiply(speedB, time), route);
          const b = subtract(route, bFromRight);
          if (!equals(a, b)) errors.push("reflected traveller positions do not meet");
          if (!equals(point, a)) errors.push("reported meeting point differs from reflected position");
        }
        break;
      }

      case "findRepeatedMeetingCountInTimeWindow": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const window = required(input.timeWindow, "timeWindow", errors);
        const countValue = solutionValue(solution, errors);
        if (route && speedA && speedB && window && countValue) {
          let count = 0;
          for (let n = 1; n <= 10000; n += 1) {
            const t = divide(multiply(rational(2 * n - 1), route), add(speedA, speedB));
            if (compare(t, window) <= 0) count += 1;
            else break;
          }
          if (!equals(countValue, rational(count))) errors.push("meeting count does not equal independently enumerated event count");
        }
        break;
      }

      case "findMeetingAfterOneTravellerTurnsBack":
      case "findShuttleMeetingTime":
      case "findPassThenCatchAfterTurnaround": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const time = solutionValue(solution, errors);
        if (route && speedA && speedB && time) {
          if (!equals(subtract(multiply(rational(2), route), multiply(speedA, time)), multiply(speedB, time))) errors.push("turnaround meeting positions are unequal");
          if (compare(time, divide(route, speedA)) < 0) errors.push("reported meeting occurs before A reaches turnaround endpoint");
        }
        break;
      }

      case "findShuttleDistanceCovered": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const distance = solutionValue(solution, errors);
        if (route && speedA && speedB && distance) {
          const time = divide(distance, speedA);
          if (!equals(subtract(multiply(rational(2), route), distance), multiply(speedB, time))) errors.push("shuttle distance does not place both travellers at same point");
        }
        break;
      }

      case "findReturnJourneyMeetingPoint": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const point = solutionValue(solution, errors);
        if (route && speedA && speedB && point) {
          const time = divide(point, speedB);
          if (!equals(subtract(multiply(rational(2), route), multiply(speedA, time)), point)) errors.push("return meeting point does not satisfy turnaround geometry");
        }
        break;
      }

      case "findMeetingPointShiftAfterSpeedChange": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const changedSpeedA = required(input.changedSpeedA, "changedSpeedA", errors);
        const shift = solutionValue(solution, errors);
        if (route && speedA && speedB && changedSpeedA && shift) {
          const original = meetingPoint(route, speedA, speedB);
          const changed = meetingPoint(route, changedSpeedA, speedB);
          if (!equals(subtract(changed, original), shift)) errors.push("meeting-point shift mismatch");
        }
        break;
      }

      case "findSpeedChangeFromMeetingPointShift": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const shift = required(input.meetingPointShift, "meetingPointShift", errors);
        const speedChange = solutionValue(solution, errors);
        if (route && speedA && speedB && shift && speedChange) {
          const original = meetingPoint(route, speedA, speedB);
          const changed = meetingPoint(route, add(speedA, speedChange), speedB);
          if (!equals(subtract(changed, original), shift)) errors.push("recovered speed change does not reproduce meeting-point shift");
        }
        break;
      }

      case "findStartDelayFromMeetingPoint":
      case "findMeetingAtSpecifiedCheckpoint": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const point = mode === "findMeetingAtSpecifiedCheckpoint" ? input.specifiedCheckpoint : input.meetingPointFromA;
        const delay = solutionValue(solution, errors);
        if (route && speedA && speedB && point && delay) {
          const absoluteTimeA = add(delay, divide(point, speedA));
          const absoluteTimeB = divide(subtract(route, point), speedB);
          if (!equals(absoluteTimeA, absoluteTimeB)) errors.push("start delay does not synchronize arrival at meeting point");
        }
        break;
      }

      case "findStaggeredDepartureMeetingPoint": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const delay = required(input.startDelayA, "startDelayA", errors);
        const point = solutionValue(solution, errors);
        if (route && speedA && speedB && delay && point) {
          if (!equals(add(delay, divide(point, speedA)), divide(subtract(route, point), speedB))) errors.push("staggered meeting point does not equalize absolute arrival times");
        }
        break;
      }

      case "findIntermediateStartPointFromMeetingData": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const point = required(input.meetingPointFromA, "meetingPointFromA", errors);
        const start = solutionValue(solution, errors);
        if (route && speedA && speedB && point && start && !equals(divide(subtract(point, start), speedA), divide(subtract(route, point), speedB))) errors.push("intermediate start point does not reproduce meeting data");
        break;
      }

      case "findEndpointRestTimeFromNextMeeting":
      case "findRouteReversalScheduleParameter": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const second = required(input.observedSecondMeetingTime, "observedSecondMeetingTime", errors);
        const rest = solutionValue(solution, errors);
        if (route && speedA && speedB && second && rest && !equals(subtract(multiply(add(speedA, speedB), second), multiply(speedA, rest)), multiply(rational(3), route))) errors.push("endpoint rest does not satisfy second-meeting path balance");
        break;
      }

      case "findTimeBetweenFirstAndSecondMeetings": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const gap = solutionValue(solution, errors);
        if (route && speedA && speedB && gap && !equals(multiply(add(speedA, speedB), gap), multiply(rational(2), route))) errors.push("first-to-second meeting gap fails 2L combined-path identity");
        break;
      }

      case "findDistanceBetweenEndpointsFromRepeatedMeetings": {
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const first = required(input.observedFirstMeetingTime, "observedFirstMeetingTime", errors);
        const second = required(input.observedSecondMeetingTime, "observedSecondMeetingTime", errors);
        const route = solutionValue(solution, errors);
        if (speedA && speedB && first && second && route && !equals(multiply(add(speedA, speedB), subtract(second, first)), multiply(rational(2), route))) errors.push("reconstructed endpoint distance fails repeated-meeting gap identity");
        break;
      }

      case "reconstructCompleteLinearItinerary": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const n = input.nthMeeting;
        const time = solution.value;
        const paths = solution.values;
        if (!n || !time || !paths || paths.length !== 2 || !solution.meetingPointFromA) errors.push("itinerary solution missing time, paths or meeting point");
        else if (route && speedA && speedB) {
          if (!equals(multiply(add(speedA, speedB), time), multiply(rational(2 * n - 1), route))) errors.push("itinerary time is not nth meeting time");
          if (!equals(paths[0]!, multiply(speedA, time)) || !equals(paths[1]!, multiply(speedB, time))) errors.push("itinerary path totals mismatch speeds and time");
          if (!equals(solution.meetingPointFromA, reflectedPosition(paths[0]!, route))) errors.push("itinerary meeting point mismatch");
        }
        break;
      }

      case "detectContradictoryMeetingStatements":
      case "verifyPostMeetingClaim": {
        const route = required(input.routeDistance, "routeDistance", errors);
        const speedA = required(input.speedA, "speedA", errors);
        const speedB = required(input.speedB, "speedB", errors);
        const n = input.nthMeeting ?? 1;
        if (route && speedA && speedB) {
          const expectedTime = divide(multiply(rational(2 * n - 1), route), add(speedA, speedB));
          const expectedPoint = reflectedPosition(multiply(speedA, expectedTime), route);
          const valid = (!input.claimedMeetingTime || equals(input.claimedMeetingTime, expectedTime)) && (!input.claimedMeetingPoint || equals(input.claimedMeetingPoint, expectedPoint));
          const expectedBoolean = mode === "detectContradictoryMeetingStatements" ? !valid : valid;
          if (solution.booleanValue !== expectedBoolean) errors.push("boolean claim result mismatch");
        }
        break;
      }

      case "classifyPostMeetingStateAsPossibleUniqueOrMultiple": {
        const positives = [input.routeDistance, input.speedA, input.speedB, input.postMeetingTimeA, input.postMeetingTimeB].filter((value): value is Rational => value !== undefined);
        const impossible = positives.some((value) => compare(value, rational(0)) <= 0);
        const unique = Boolean((input.routeDistance && input.speedA && input.speedB) || (input.routeDistance && input.postMeetingTimeA && input.postMeetingTimeB));
        const expected = impossible ? "IMPOSSIBLE" : unique ? "UNIQUE" : "MULTIPLE";
        if (solution.classification !== expected) errors.push("post-meeting state classification mismatch");
        break;
      }

      case "solvePostMeetingDataSufficiency": {
        const first = factSetSufficient(input.dsStatement1);
        const second = factSetSufficient(input.dsStatement2);
        const together = factSetSufficient([...(input.dsStatement1 ?? []), ...(input.dsStatement2 ?? [])]);
        const expected = first && second ? "EITHER_ALONE" : first ? "STATEMENT_1_ONLY" : second ? "STATEMENT_2_ONLY" : together ? "BOTH_TOGETHER" : "INSUFFICIENT";
        if (solution.dataSufficiency !== expected) errors.push("data-sufficiency classification mismatch");
        break;
      }
    }
  } catch (error) {
    errors.push(error instanceof Error ? error.message : String(error));
  }

  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze(errors) });
}
