import {
  add,
  divide,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp003DiscoveryAuthority } from "./discovery-registry";
import { SeededRng } from "./generation-support";
import type { TsdCp003GeneratedState } from "./runtime-types";
import type { TsdCp003SolveInput } from "./types";

const CONTEXTS = [
  "a bus on an intercity route",
  "a car on a highway trip",
  "a delivery van on a fixed route",
  "a school bus on its usual route",
  "a coach on a regional route",
  "a taxi on a scheduled trip",
] as const;

function r(numerator: number, denominator = 1): Rational {
  return rational(numerator, denominator);
}

function profile<T>(rng: SeededRng, values: readonly T[]): T {
  return values[rng.int(0, values.length - 1)];
}

function travelTime(distance: Rational, speed: Rational): Rational {
  return divide(distance, speed);
}

function timeGap(distance: Rational, slower: Rational, faster: Rational): Rational {
  return subtract(travelTime(distance, slower), travelTime(distance, faster));
}

function state(input: TsdCp003SolveInput, representation: string, rng: SeededRng): TsdCp003GeneratedState {
  return Object.freeze({
    input,
    representation,
    context: rng.pick(CONTEXTS),
    stemVariant: rng.int(0, 2),
  });
}

export function generateCp003State(authority: TsdCp003DiscoveryAuthority, seed: string): TsdCp003GeneratedState {
  const rng = new SeededRng(`${authority.provisionalId}:${seed}`);

  switch (authority.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const [distance, originalSpeed, changedSpeed] = profile(rng, [
        [120, 40, 60], [180, 45, 60], [300, 50, 75], [360, 40, 60],
      ] as const);
      return state({ solveMode: "timeGainLossFromSpeedChange", distance: r(distance), originalSpeed: r(originalSpeed), changedSpeed: r(changedSpeed) }, changedSpeed > originalSpeed ? "FASTER_TIME_SAVED" : "SLOWER_DELAY", rng);
    }

    case "distanceFromSpeedTimeDifference": {
      const [distance, slower, faster] = profile(rng, [
        [120, 40, 60], [180, 45, 60], [240, 48, 60], [300, 50, 75],
      ] as const);
      return state({ solveMode: "distanceFromSpeedTimeDifference", slowerSpeed: r(slower), fasterSpeed: r(faster), timeDifference: timeGap(r(distance), r(slower), r(faster)) }, "TWO_SPEEDS_TIME_GAP", rng);
    }

    case "speedFromFixedRouteTimeDifference": {
      const useRatio = rng.int(0, 1) === 1;
      if (useRatio) {
        const [distance, scale, slowerRatio, fasterRatio] = profile(rng, [
          [200, 10, 4, 5], [180, 10, 3, 5], [240, 12, 3, 4], [300, 10, 5, 6],
        ] as const);
        const slower = r(scale * slowerRatio);
        const faster = r(scale * fasterRatio);
        const target = rng.int(0, 1) === 0 ? "SLOWER" : "FASTER";
        return state({
          solveMode: "speedFromFixedRouteTimeDifference",
          representation: "KNOWN_SPEED_RATIO",
          distance: r(distance),
          timeDifference: timeGap(r(distance), slower, faster),
          slowerRatio: r(slowerRatio),
          fasterRatio: r(fasterRatio),
          target,
        }, `SPEED_RATIO_${target}`, rng);
      }
      const [distance, slower, faster] = profile(rng, [
        [120, 40, 60], [180, 45, 60], [240, 48, 60], [300, 50, 75],
      ] as const);
      const unknownRole = rng.int(0, 1) === 0 ? "SLOWER" : "FASTER";
      return state({
        solveMode: "speedFromFixedRouteTimeDifference",
        representation: "KNOWN_OTHER_SPEED",
        distance: r(distance),
        timeDifference: timeGap(r(distance), r(slower), r(faster)),
        knownSpeed: r(unknownRole === "SLOWER" ? faster : slower),
        unknownRole,
      }, `KNOWN_OTHER_SPEED_${unknownRole}`, rng);
    }

    case "usualSpeedFromEarlyLatePair":
    case "distanceFromEarlyLatePair": {
      const [slower, faster, lateN, lateD, earlyN, earlyD] = profile(rng, [
        [40, 60, 1, 1, 1, 1],
        [30, 45, 1, 1, 1, 1],
        [48, 72, 1, 2, 1, 2],
        [36, 60, 1, 2, 1, 2],
      ] as const);
      const common = { slowerTrialSpeed: r(slower), fasterTrialSpeed: r(faster), lateBy: r(lateN, lateD), earlyBy: r(earlyN, earlyD) };
      return authority.solveMode === "usualSpeedFromEarlyLatePair"
        ? state({ solveMode: "usualSpeedFromEarlyLatePair", ...common }, "EARLY_LATE_PAIR_SPEED", rng)
        : state({ solveMode: "distanceFromEarlyLatePair", ...common }, "EARLY_LATE_PAIR_DISTANCE", rng);
    }

    case "scheduledArrivalTimeFromActualSpeed": {
      const [departure, distance, speed] = profile(rng, [
        [480, 120, 60], [525, 90, 45], [690, 150, 75], [1380, 90, 60],
      ] as const);
      return state({ solveMode: "scheduledArrivalTimeFromActualSpeed", departureMinuteFromDayZero: r(departure), distance: r(distance), actualSpeed: r(speed) }, departure >= 1200 ? "NEXT_DAY_ARRIVAL" : "SAME_DAY_ARRIVAL", rng);
    }

    case "requiredRecoverySpeedAfterLostTime": {
      const [distance, timeN, timeD] = profile(rng, [
        [90, 3, 2], [126, 2, 1], [150, 2, 1], [98, 7, 5],
      ] as const);
      return state({ solveMode: "requiredRecoverySpeedAfterLostTime", remainingDistance: r(distance), remainingAvailableTime: r(timeN, timeD) }, "LOST_TIME_RECOVERY_SPEED", rng);
    }

    case "requiredRemainingSpeedAfterPartialRoute": {
      const [totalD, scheduleT, completedD, completedSpeed] = profile(rng, [
        [240, 4, 60, 30], [180, 3, 60, 40], [300, 5, 100, 40], [200, 4, 80, 40],
      ] as const);
      return state({ solveMode: "requiredRemainingSpeedAfterPartialRoute", totalDistance: r(totalD), scheduledTotalTime: r(scheduleT), completedDistance: r(completedD), completedSpeed: r(completedSpeed) }, completedSpeed < totalD / scheduleT ? "SLOW_INITIAL_SEGMENT" : "FAST_INITIAL_SEGMENT", rng);
    }

    case "stoppageDurationFromRunningAndOverallSpeed": {
      const [distance, running, overall] = profile(rng, [
        [120, 60, 48], [180, 72, 60], [180, 60, 45], [240, 80, 64],
      ] as const);
      return state({ solveMode: "stoppageDurationFromRunningAndOverallSpeed", distance: r(distance), runningSpeed: r(running), overallSpeed: r(overall) }, "RUNNING_VS_OVERALL_SPEED", rng);
    }

    case "overallSpeedIncludingStops": {
      const [distance, running, stopN, stopD] = profile(rng, [
        [120, 60, 1, 2], [180, 72, 1, 2], [150, 75, 1, 2], [240, 80, 3, 4],
      ] as const);
      return state({ solveMode: "overallSpeedIncludingStops", distance: r(distance), runningSpeed: r(running), totalStopTime: r(stopN, stopD) }, "OVERALL_SPEED_WITH_STOPS", rng);
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const [distance, overall, stopN, stopD] = profile(rng, [
        [120, 48, 1, 2], [180, 60, 1, 2], [150, 60, 1, 2], [240, 64, 3, 4],
      ] as const);
      return state({ solveMode: "runningSpeedFromOverallSpeedAndStops", distance: r(distance), overallSpeed: r(overall), totalStopTime: r(stopN, stopD) }, "RUNNING_SPEED_FROM_STOPS", rng);
    }

    case "numberOfStopsFromOverallDelay": {
      const [count, stopN, stopD] = profile(rng, [[4, 1, 12], [6, 1, 12], [8, 1, 20], [5, 1, 10]] as const);
      const stopDuration = r(stopN, stopD);
      return state({ solveMode: "numberOfStopsFromOverallDelay", totalDelay: multiply(r(count), stopDuration), stopDuration }, "STOP_COUNT_FROM_DELAY", rng);
    }

    case "delayFromRegularStops": {
      const [count, stopN, stopD] = profile(rng, [[4, 1, 12], [6, 1, 12], [8, 1, 20], [5, 1, 10]] as const);
      return state({ solveMode: "delayFromRegularStops", stopCount: r(count), stopDuration: r(stopN, stopD) }, "DELAY_FROM_STOP_COUNT", rng);
    }

    case "restTimeInRepeatedTravelRestCycle": {
      const [travelN, travelD, cycles, rests, restN, restD] = profile(rng, [
        [1, 2, 4, 3, 1, 4], [3, 4, 3, 2, 1, 4], [2, 3, 3, 2, 1, 6], [1, 2, 5, 4, 1, 8],
      ] as const);
      const travelPerCycle = r(travelN, travelD);
      const restPerEvent = r(restN, restD);
      const total = add(multiply(travelPerCycle, r(cycles)), multiply(restPerEvent, r(rests)));
      return state({ solveMode: "restTimeInRepeatedTravelRestCycle", travelTimePerCycle: travelPerCycle, cycleCount: r(cycles), restEvents: r(rests), totalElapsedTime: total }, "REPEATED_TRAVEL_REST", rng);
    }

    case "totalTimeWithRegularStops": {
      const [runN, runD, count, stopN, stopD] = profile(rng, [
        [3, 1, 4, 1, 6], [5, 2, 3, 1, 6], [4, 1, 5, 1, 10], [7, 2, 6, 1, 12],
      ] as const);
      return state({ solveMode: "totalTimeWithRegularStops", runningTime: r(runN, runD), stopCount: r(count), stopDuration: r(stopN, stopD) }, rng.int(0, 1) === 0 ? "FIXED_DISTANCE_STOP_PATTERN" : "FIXED_TIME_STOP_PATTERN", rng);
    }

    case "speedChangePointDistance": {
      const [totalD, firstD, firstSpeed, secondSpeed] = profile(rng, [
        [120, 60, 30, 60], [180, 60, 30, 60], [150, 90, 45, 60], [200, 80, 40, 60],
      ] as const);
      const totalTime = add(travelTime(r(firstD), r(firstSpeed)), travelTime(r(totalD - firstD), r(secondSpeed)));
      return state({ solveMode: "speedChangePointDistance", totalDistance: r(totalD), totalTravelTime: totalTime, firstSpeed: r(firstSpeed), secondSpeed: r(secondSpeed) }, "CHANGE_POINT_DISTANCE", rng);
    }

    case "fractionOfRouteAtChangedSpeed": {
      const [totalD, changedD, originalSpeed, changedSpeed] = profile(rng, [
        [120, 48, 30, 60], [180, 90, 45, 60], [150, 50, 50, 75], [200, 120, 40, 80],
      ] as const);
      const originalD = r(totalD - changedD);
      const totalTime = add(travelTime(originalD, r(originalSpeed)), travelTime(r(changedD), r(changedSpeed)));
      return state({ solveMode: "fractionOfRouteAtChangedSpeed", totalDistance: r(totalD), totalTravelTime: totalTime, originalSpeed: r(originalSpeed), changedSpeed: r(changedSpeed) }, "CHANGED_ROUTE_PERCENT", rng);
    }

    case "lostTimeDurationFromScheduleRecovery": {
      const [distance, usual, recovery, delayN, delayD] = profile(rng, [
        [120, 60, 80, 1, 4], [90, 45, 90, 1, 4], [150, 50, 75, 1, 2], [100, 40, 50, 1, 2],
      ] as const);
      return state({ solveMode: "lostTimeDurationFromScheduleRecovery", remainingDistance: r(distance), usualSpeed: r(usual), recoverySpeed: r(recovery), finalArrivalDelay: r(delayN, delayD) }, rng.int(0, 1) === 0 ? "BREAKDOWN_DELAY" : "REPAIR_TIME_FROM_RECOVERY", rng);
    }

    case "startTimeShiftForSameArrival": {
      const [distance, oldSpeed, newSpeed] = profile(rng, [
        [120, 40, 60], [240, 48, 80], [180, 60, 120], [180, 60, 80],
      ] as const);
      return state({ solveMode: "startTimeShiftForSameArrival", distance: r(distance), originalSpeed: r(oldSpeed), newSpeed: r(newSpeed) }, newSpeed > oldSpeed ? "LATER_START_SAME_ARRIVAL" : "EARLIER_START_SAME_ARRIVAL", rng);
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const [distance, oldSpeed, newSpeed, shiftN, shiftD] = profile(rng, [
        [120, 60, 40, -1, 2], [180, 60, 90, 1, 2], [150, 50, 75, 1, 4], [180, 60, 90, -1, 4],
      ] as const);
      return state({ solveMode: "arrivalShiftFromDepartureAndSpeedChanges", distance: r(distance), originalSpeed: r(oldSpeed), newSpeed: r(newSpeed), departureShift: r(shiftN, shiftD) }, "COMBINED_DEPARTURE_SPEED_SHIFT", rng);
    }

    case "walkingRidingAllocation": {
      const [totalD, walkingD, walkingSpeed, ridingSpeed] = profile(rng, [
        [30, 10, 5, 20], [24, 8, 4, 16], [36, 12, 6, 24], [40, 10, 5, 15],
      ] as const);
      const ridingD = r(totalD - walkingD);
      const totalTime = add(travelTime(r(walkingD), r(walkingSpeed)), travelTime(ridingD, r(ridingSpeed)));
      const targets = ["WALKING_TIME", "RIDING_TIME", "WALKING_DISTANCE", "RIDING_DISTANCE"] as const;
      const target = rng.pick(targets);
      return state({ solveMode: "walkingRidingAllocation", totalDistance: r(totalD), totalTime, walkingSpeed: r(walkingSpeed), ridingSpeed: r(ridingSpeed), target }, `WALK_RIDE_${target}`, rng);
    }

    case "scheduleBuffer": {
      const [scheduledN, scheduledD, plannedN, plannedD] = profile(rng, [
        [4, 1, 7, 2], [3, 1, 5, 2], [5, 1, 17, 4], [7, 2, 3, 1],
      ] as const);
      return state({ solveMode: "scheduleBuffer", scheduledDuration: r(scheduledN, scheduledD), plannedTravelDuration: r(plannedN, plannedD) }, "SCHEDULE_BUFFER", rng);
    }

    default:
      throw new Error(`${authority.provisionalId}: no learner parameter factory for ${authority.solveMode}`);
  }
}
