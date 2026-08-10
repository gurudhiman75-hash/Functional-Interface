import {
  absRational,
  add,
  compare,
  divide,
  isPositive,
  multiply,
  reciprocal,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

function requirePositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

function requireWholePositive(value: Rational, label: string): void {
  requirePositive(value, label);
  if (value.denominator !== 1n) throw new Error(`${label} must be a whole positive count`);
}

function requireFaster(slower: Rational, faster: Rational): void {
  requirePositive(slower, "slower speed");
  requirePositive(faster, "faster speed");
  if (compare(faster, slower) <= 0) throw new Error("faster speed must exceed slower speed");
}

function reciprocalGap(slower: Rational, faster: Rational): Rational {
  requireFaster(slower, faster);
  return subtract(reciprocal(slower), reciprocal(faster));
}

export function solveCp003(input: TsdCp003SolveInput): TsdCp003SolveCertificate {
  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      requirePositive(input.distance, "distance");
      requirePositive(input.originalSpeed, "original speed");
      requirePositive(input.changedSpeed, "changed speed");
      if (compare(input.originalSpeed, input.changedSpeed) === 0) throw new Error("speed change must be non-zero");
      const originalTime = divide(input.distance, input.originalSpeed);
      const changedTime = divide(input.distance, input.changedSpeed);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: absRational(subtract(originalTime, changedTime)),
        unit: "HOUR",
        governingEquation: "time difference = |distance/original speed - distance/changed speed|",
        intermediate: Object.freeze({ originalTime, changedTime }),
      });
    }

    case "distanceFromSpeedTimeDifference": {
      requireFaster(input.slowerSpeed, input.fasterSpeed);
      requirePositive(input.timeDifference, "time difference");
      const gap = reciprocalGap(input.slowerSpeed, input.fasterSpeed);
      const distance = divide(input.timeDifference, gap);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: distance,
        unit: "KM",
        governingEquation: "time difference = distance(1/slower speed - 1/faster speed)",
        intermediate: Object.freeze({ reciprocalTimeGap: gap }),
      });
    }

    case "usualSpeedFromEarlyLatePair": {
      requireFaster(input.slowerTrialSpeed, input.fasterTrialSpeed);
      requirePositive(input.lateBy, "late-by time");
      requirePositive(input.earlyBy, "early-by time");
      const scheduleGap = add(input.lateBy, input.earlyBy);
      const distance = divide(scheduleGap, reciprocalGap(input.slowerTrialSpeed, input.fasterTrialSpeed));
      const slowTravelTime = divide(distance, input.slowerTrialSpeed);
      const scheduledTravelTime = subtract(slowTravelTime, input.lateBy);
      requirePositive(scheduledTravelTime, "scheduled travel time");
      const usualSpeed = divide(distance, scheduledTravelTime);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: usualSpeed,
        unit: "KMPH",
        governingEquation: "distance/slower - late = distance/faster + early = scheduled travel time",
        intermediate: Object.freeze({ distance, scheduledTravelTime }),
      });
    }

    case "distanceFromEarlyLatePair": {
      requireFaster(input.slowerTrialSpeed, input.fasterTrialSpeed);
      requirePositive(input.lateBy, "late-by time");
      requirePositive(input.earlyBy, "early-by time");
      const scheduleGap = add(input.lateBy, input.earlyBy);
      const distance = divide(scheduleGap, reciprocalGap(input.slowerTrialSpeed, input.fasterTrialSpeed));
      return Object.freeze({
        solveMode: input.solveMode,
        answer: distance,
        unit: "KM",
        governingEquation: "late + early = distance(1/slower speed - 1/faster speed)",
        intermediate: Object.freeze({ scheduleGap }),
      });
    }

    case "requiredRecoverySpeedAfterLostTime": {
      requirePositive(input.remainingDistance, "remaining distance");
      requirePositive(input.remainingAvailableTime, "remaining available time");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(input.remainingDistance, input.remainingAvailableTime),
        unit: "KMPH",
        governingEquation: "required recovery speed = remaining distance / remaining available time",
        intermediate: Object.freeze({}),
      });
    }

    case "requiredRemainingSpeedAfterPartialRoute": {
      requirePositive(input.totalDistance, "total distance");
      requirePositive(input.scheduledTotalTime, "scheduled total time");
      requirePositive(input.completedDistance, "completed distance");
      requirePositive(input.completedSpeed, "completed speed");
      if (compare(input.completedDistance, input.totalDistance) >= 0) throw new Error("completed distance must be less than total distance");
      const completedTime = divide(input.completedDistance, input.completedSpeed);
      const remainingTime = subtract(input.scheduledTotalTime, completedTime);
      requirePositive(remainingTime, "remaining schedule time");
      const remainingDistance = subtract(input.totalDistance, input.completedDistance);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(remainingDistance, remainingTime),
        unit: "KMPH",
        governingEquation: "completed time + remaining distance/required speed = scheduled total time",
        intermediate: Object.freeze({ completedTime, remainingTime, remainingDistance }),
      });
    }

    case "stoppageDurationFromRunningAndOverallSpeed": {
      requirePositive(input.distance, "distance");
      requirePositive(input.runningSpeed, "running speed");
      requirePositive(input.overallSpeed, "overall speed");
      if (compare(input.runningSpeed, input.overallSpeed) <= 0) throw new Error("running speed must exceed overall speed when stoppage is positive");
      const runningTime = divide(input.distance, input.runningSpeed);
      const overallTime = divide(input.distance, input.overallSpeed);
      const stoppageTime = subtract(overallTime, runningTime);
      requirePositive(stoppageTime, "stoppage duration");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: stoppageTime,
        unit: "HOUR",
        governingEquation: "stoppage time = distance/overall speed - distance/running speed",
        intermediate: Object.freeze({ runningTime, overallTime }),
      });
    }

    case "overallSpeedIncludingStops": {
      requirePositive(input.distance, "distance");
      requirePositive(input.runningSpeed, "running speed");
      requirePositive(input.totalStopTime, "total stop time");
      const runningTime = divide(input.distance, input.runningSpeed);
      const totalElapsedTime = add(runningTime, input.totalStopTime);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(input.distance, totalElapsedTime),
        unit: "KMPH",
        governingEquation: "overall speed = distance/(running time + stoppage time)",
        intermediate: Object.freeze({ runningTime, totalElapsedTime }),
      });
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      requirePositive(input.distance, "distance");
      requirePositive(input.overallSpeed, "overall speed");
      requirePositive(input.totalStopTime, "total stop time");
      const totalElapsedTime = divide(input.distance, input.overallSpeed);
      const runningTime = subtract(totalElapsedTime, input.totalStopTime);
      requirePositive(runningTime, "running time");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(input.distance, runningTime),
        unit: "KMPH",
        governingEquation: "running speed = distance/(distance/overall speed - stoppage time)",
        intermediate: Object.freeze({ totalElapsedTime, runningTime }),
      });
    }

    case "numberOfStopsFromOverallDelay": {
      requirePositive(input.totalDelay, "total delay");
      requirePositive(input.stopDuration, "stop duration");
      const count = divide(input.totalDelay, input.stopDuration);
      requireWholePositive(count, "number of stops");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: count,
        unit: "COUNT",
        governingEquation: "number of stops = total stop delay / duration of each stop",
        intermediate: Object.freeze({}),
      });
    }

    case "delayFromRegularStops": {
      requireWholePositive(input.stopCount, "stop count");
      requirePositive(input.stopDuration, "stop duration");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: multiply(input.stopCount, input.stopDuration),
        unit: "HOUR",
        governingEquation: "total delay = number of stops × duration of each stop",
        intermediate: Object.freeze({}),
      });
    }

    case "restTimeInRepeatedTravelRestCycle": {
      requirePositive(input.travelTimePerCycle, "travel time per cycle");
      requireWholePositive(input.cycleCount, "cycle count");
      requireWholePositive(input.restEvents, "rest-event count");
      requirePositive(input.totalElapsedTime, "total elapsed time");
      const totalTravelTime = multiply(input.travelTimePerCycle, input.cycleCount);
      const totalRestTime = subtract(input.totalElapsedTime, totalTravelTime);
      requirePositive(totalRestTime, "total rest time");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: divide(totalRestTime, input.restEvents),
        unit: "HOUR",
        governingEquation: "rest per event = (total elapsed - total travel time)/number of rests",
        intermediate: Object.freeze({ totalTravelTime, totalRestTime }),
      });
    }

    case "totalTimeWithRegularStops": {
      requirePositive(input.runningTime, "running time");
      requireWholePositive(input.stopCount, "stop count");
      requirePositive(input.stopDuration, "stop duration");
      const totalStopTime = multiply(input.stopCount, input.stopDuration);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: add(input.runningTime, totalStopTime),
        unit: "HOUR",
        governingEquation: "total elapsed time = running time + number of stops × stop duration",
        intermediate: Object.freeze({ totalStopTime }),
      });
    }
  }
}
