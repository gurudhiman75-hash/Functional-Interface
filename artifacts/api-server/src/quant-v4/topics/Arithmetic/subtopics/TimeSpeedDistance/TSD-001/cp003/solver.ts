import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  isPositive,
  multiply,
  rational,
  reciprocal,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

function requirePositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

function requireNonNegative(value: Rational, label: string): void {
  if (compare(value, RATIONAL_ZERO) < 0) throw new Error(`${label} must be non-negative`);
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

    case "speedFromFixedRouteTimeDifference": {
      requirePositive(input.distance, "distance");
      requirePositive(input.timeDifference, "time difference");
      if (input.representation === "KNOWN_OTHER_SPEED") {
        requirePositive(input.knownSpeed, "known speed");
        const reciprocalDifference = divide(input.timeDifference, input.distance);
        const unknownReciprocal = input.unknownRole === "FASTER"
          ? subtract(reciprocal(input.knownSpeed), reciprocalDifference)
          : add(reciprocal(input.knownSpeed), reciprocalDifference);
        requirePositive(unknownReciprocal, "unknown reciprocal speed");
        const unknownSpeed = reciprocal(unknownReciprocal);
        if (input.unknownRole === "FASTER" && compare(unknownSpeed, input.knownSpeed) <= 0) throw new Error("solved faster speed must exceed known speed");
        if (input.unknownRole === "SLOWER" && compare(unknownSpeed, input.knownSpeed) >= 0) throw new Error("solved slower speed must be below known speed");
        return Object.freeze({
          solveMode: input.solveMode,
          answer: unknownSpeed,
          unit: "KMPH",
          governingEquation: "time difference = distance × |1/slower speed - 1/faster speed|",
          intermediate: Object.freeze({ reciprocalDifference }),
        });
      }
      requireFaster(input.slowerRatio, input.fasterRatio);
      const ratioReciprocalGap = reciprocalGap(input.slowerRatio, input.fasterRatio);
      const scale = divide(multiply(input.distance, ratioReciprocalGap), input.timeDifference);
      requirePositive(scale, "speed-ratio scale");
      const slowerSpeed = multiply(scale, input.slowerRatio);
      const fasterSpeed = multiply(scale, input.fasterRatio);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: input.target === "SLOWER" ? slowerSpeed : fasterSpeed,
        unit: "KMPH",
        governingEquation: "speed pair = common scale × stated speed ratio, fitted to the fixed-route time difference",
        intermediate: Object.freeze({ scale, slowerSpeed, fasterSpeed }),
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

    case "scheduledArrivalTimeFromActualSpeed": {
      requireNonNegative(input.departureMinuteFromDayZero, "departure clock minute");
      requirePositive(input.distance, "distance");
      requirePositive(input.actualSpeed, "actual speed");
      const travelHours = divide(input.distance, input.actualSpeed);
      const travelMinutes = multiply(travelHours, rational(60));
      return Object.freeze({
        solveMode: input.solveMode,
        answer: add(input.departureMinuteFromDayZero, travelMinutes),
        unit: "CLOCK_MINUTE",
        governingEquation: "arrival clock minute = departure clock minute + 60 × distance/speed",
        intermediate: Object.freeze({ travelHours, travelMinutes }),
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

    case "speedChangePointDistance": {
      requirePositive(input.totalDistance, "total distance");
      requirePositive(input.totalTravelTime, "total travel time");
      requirePositive(input.firstSpeed, "first speed");
      requirePositive(input.secondSpeed, "second speed");
      if (compare(input.firstSpeed, input.secondSpeed) === 0) throw new Error("speed-change point requires two different speeds");
      const numerator = subtract(input.totalTravelTime, divide(input.totalDistance, input.secondSpeed));
      const denominator = subtract(reciprocal(input.firstSpeed), reciprocal(input.secondSpeed));
      const firstSegmentDistance = divide(numerator, denominator);
      requirePositive(firstSegmentDistance, "first-segment distance");
      if (compare(firstSegmentDistance, input.totalDistance) >= 0) throw new Error("speed-change point must lie inside the route");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: firstSegmentDistance,
        unit: "KM",
        governingEquation: "x/first speed + (total distance - x)/second speed = total travel time",
        intermediate: Object.freeze({ numerator, denominator }),
      });
    }

    case "fractionOfRouteAtChangedSpeed": {
      requirePositive(input.totalDistance, "total distance");
      requirePositive(input.totalTravelTime, "total travel time");
      requirePositive(input.originalSpeed, "original speed");
      requirePositive(input.changedSpeed, "changed speed");
      if (compare(input.originalSpeed, input.changedSpeed) === 0) throw new Error("changed speed must differ from original speed");
      const numerator = subtract(input.totalTravelTime, divide(input.totalDistance, input.changedSpeed));
      const denominator = subtract(reciprocal(input.originalSpeed), reciprocal(input.changedSpeed));
      const originalDistance = divide(numerator, denominator);
      requirePositive(originalDistance, "original-speed distance");
      if (compare(originalDistance, input.totalDistance) >= 0) throw new Error("changed-speed segment must be non-empty");
      const changedDistance = subtract(input.totalDistance, originalDistance);
      const changedPercent = multiply(divide(changedDistance, input.totalDistance), rational(100));
      return Object.freeze({
        solveMode: input.solveMode,
        answer: changedPercent,
        unit: "PERCENT",
        governingEquation: "route time = original-distance/original-speed + changed-distance/changed-speed",
        intermediate: Object.freeze({ originalDistance, changedDistance }),
      });
    }

    case "lostTimeDurationFromScheduleRecovery": {
      requirePositive(input.remainingDistance, "remaining distance");
      requirePositive(input.usualSpeed, "usual speed");
      requirePositive(input.recoverySpeed, "recovery speed");
      requireNonNegative(input.finalArrivalDelay, "final arrival delay");
      if (compare(input.recoverySpeed, input.usualSpeed) < 0) throw new Error("recovery speed cannot be below usual speed");
      const usualRemainingTime = divide(input.remainingDistance, input.usualSpeed);
      const recoveryRemainingTime = divide(input.remainingDistance, input.recoverySpeed);
      const timeRecovered = subtract(usualRemainingTime, recoveryRemainingTime);
      const lostTime = add(timeRecovered, input.finalArrivalDelay);
      requirePositive(lostTime, "lost time duration");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: lostTime,
        unit: "HOUR",
        governingEquation: "lost time = time recovered by higher speed + final arrival delay",
        intermediate: Object.freeze({ usualRemainingTime, recoveryRemainingTime, timeRecovered }),
      });
    }

    case "startTimeShiftForSameArrival": {
      requirePositive(input.distance, "distance");
      requirePositive(input.originalSpeed, "original speed");
      requirePositive(input.newSpeed, "new speed");
      if (compare(input.originalSpeed, input.newSpeed) === 0) throw new Error("new speed must differ from original speed");
      const originalTravelTime = divide(input.distance, input.originalSpeed);
      const newTravelTime = divide(input.distance, input.newSpeed);
      return Object.freeze({
        solveMode: input.solveMode,
        answer: absRational(subtract(originalTravelTime, newTravelTime)),
        unit: "HOUR",
        governingEquation: "departure shift for same arrival = |old travel time - new travel time|",
        intermediate: Object.freeze({ originalTravelTime, newTravelTime }),
      });
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      requirePositive(input.distance, "distance");
      requirePositive(input.originalSpeed, "original speed");
      requirePositive(input.newSpeed, "new speed");
      const originalTravelTime = divide(input.distance, input.originalSpeed);
      const newTravelTime = divide(input.distance, input.newSpeed);
      const signedArrivalShift = add(input.departureShift, subtract(newTravelTime, originalTravelTime));
      if (compare(signedArrivalShift, RATIONAL_ZERO) === 0) throw new Error("combined changes produce no arrival shift");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: absRational(signedArrivalShift),
        unit: "HOUR",
        governingEquation: "arrival shift = departure shift + new travel time - original travel time",
        intermediate: Object.freeze({ originalTravelTime, newTravelTime, signedArrivalShift }),
      });
    }

    case "walkingRidingAllocation": {
      requirePositive(input.totalDistance, "total distance");
      requirePositive(input.totalTime, "total time");
      requireFaster(input.walkingSpeed, input.ridingSpeed);
      const numerator = subtract(input.totalTime, divide(input.totalDistance, input.ridingSpeed));
      const denominator = subtract(reciprocal(input.walkingSpeed), reciprocal(input.ridingSpeed));
      const walkingDistance = divide(numerator, denominator);
      requirePositive(walkingDistance, "walking distance");
      if (compare(walkingDistance, input.totalDistance) >= 0) throw new Error("riding distance must be positive");
      const ridingDistance = subtract(input.totalDistance, walkingDistance);
      const walkingTime = divide(walkingDistance, input.walkingSpeed);
      const ridingTime = divide(ridingDistance, input.ridingSpeed);
      const answer = input.target === "WALKING_TIME"
        ? walkingTime
        : input.target === "RIDING_TIME"
          ? ridingTime
          : input.target === "WALKING_DISTANCE"
            ? walkingDistance
            : ridingDistance;
      const unit = input.target.endsWith("TIME") ? "HOUR" : "KM";
      return Object.freeze({
        solveMode: input.solveMode,
        answer,
        unit,
        governingEquation: "walking distance/walking speed + riding distance/riding speed = total time",
        intermediate: Object.freeze({ walkingDistance, ridingDistance, walkingTime, ridingTime }),
      });
    }

    case "scheduleBuffer": {
      requirePositive(input.scheduledDuration, "scheduled duration");
      requirePositive(input.plannedTravelDuration, "planned travel duration");
      if (compare(input.scheduledDuration, input.plannedTravelDuration) <= 0) throw new Error("scheduled duration must exceed planned travel duration for positive buffer");
      return Object.freeze({
        solveMode: input.solveMode,
        answer: subtract(input.scheduledDuration, input.plannedTravelDuration),
        unit: "HOUR",
        governingEquation: "schedule buffer = scheduled duration - planned travel duration",
        intermediate: Object.freeze({}),
      });
    }
  }
}
