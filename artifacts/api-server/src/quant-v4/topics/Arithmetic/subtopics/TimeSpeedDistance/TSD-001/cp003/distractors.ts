import {
  RATIONAL_ZERO,
  absRational,
  add,
  compare,
  divide,
  equals,
  multiply,
  rational,
  reciprocal,
  subtract,
  type Rational,
} from "../foundation/rational";
import { formatExamNumber, uniqueRationals } from "./generation-support";
import type { TsdCp003MisconceptionId, TsdCp003WrongWorking } from "./runtime-types";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

type WrongId = Exclude<TsdCp003MisconceptionId, "CORRECT">;

function wrong(id: WrongId, value: Rational, calculation: string, diagnosis: string): TsdCp003WrongWorking {
  return Object.freeze({ misconceptionId: id, value, calculation, diagnosis });
}

function positive(value: Rational): boolean {
  return compare(value, RATIONAL_ZERO) > 0;
}

function chooseThree(answer: Rational, methods: readonly TsdCp003WrongWorking[]): readonly TsdCp003WrongWorking[] {
  const selected: TsdCp003WrongWorking[] = [];
  const seen: Rational[] = [answer];
  for (const method of methods) {
    if (!positive(method.value)) continue;
    if (seen.some((value) => equals(value, method.value))) continue;
    selected.push(method);
    seen.push(method.value);
    if (selected.length === 3) return Object.freeze(selected);
  }
  throw new Error(`Could not derive three unique method-based distractors; unique values=${uniqueRationals(seen).map(formatExamNumber).join(",")}`);
}

function f(value: Rational): string {
  return formatExamNumber(value);
}

export function deriveCp003WrongWorkings(
  input: TsdCp003SolveInput,
  solution: TsdCp003SolveCertificate,
): readonly TsdCp003WrongWorking[] {
  const answer = solution.answer;

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.changedSpeed);
      const speedGap = absRational(subtract(input.changedSpeed, input.originalSpeed));
      return chooseThree(answer, [
        wrong("ADD_TRAVEL_TIMES", add(oldTime, newTime), `${f(oldTime)} + ${f(newTime)}`, "It adds the two journey times instead of taking their difference."),
        wrong("USE_ONE_TRAVEL_TIME", oldTime, `${f(input.distance)} ÷ ${f(input.originalSpeed)}`, "It gives the original journey time, not the time saved or lost."),
        wrong("TREAT_SPEED_DIFFERENCE_AS_SPEED", divide(input.distance, speedGap), `${f(input.distance)} ÷ (${f(input.changedSpeed)} − ${f(input.originalSpeed)})`, "It treats the speed difference as if it were a travel speed."),
        wrong("USE_ONE_TRAVEL_TIME", newTime, `${f(input.distance)} ÷ ${f(input.changedSpeed)}`, "It gives the changed journey time rather than the difference in times."),
      ]);
    }

    case "distanceFromSpeedTimeDifference": {
      const speedGap = subtract(input.fasterSpeed, input.slowerSpeed);
      return chooseThree(answer, [
        wrong("MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE", multiply(input.timeDifference, speedGap), `${f(input.timeDifference)} × (${f(input.fasterSpeed)} − ${f(input.slowerSpeed)})`, "It multiplies the time gap by the speed gap, which is not the fixed-route relation."),
        wrong("USE_SLOWER_SPEED_ONLY", multiply(input.timeDifference, input.slowerSpeed), `${f(input.timeDifference)} × ${f(input.slowerSpeed)}`, "It treats the time difference as the complete slower journey time."),
        wrong("USE_FASTER_SPEED_ONLY", multiply(input.timeDifference, input.fasterSpeed), `${f(input.timeDifference)} × ${f(input.fasterSpeed)}`, "It treats the time difference as the complete faster journey time."),
      ]);
    }

    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const knownTime = divide(input.distance, input.knownSpeed);
        const oppositeTime = input.unknownRole === "FASTER"
          ? add(knownTime, input.timeDifference)
          : subtract(knownTime, input.timeDifference);
        return chooseThree(answer, [
          wrong("TREAT_TIME_GAP_AS_TOTAL_TIME", divide(input.distance, input.timeDifference), `${f(input.distance)} ÷ ${f(input.timeDifference)}`, "It treats the difference between two journey times as a complete journey time."),
          wrong("IGNORE_RECIPROCAL_RELATION", input.knownSpeed, `${f(input.knownSpeed)}`, "It simply repeats the known speed instead of solving the second travel time."),
          ...(positive(oppositeTime) ? [wrong("IGNORE_RECIPROCAL_RELATION", divide(input.distance, oppositeTime), `${f(input.distance)} ÷ ${f(oppositeTime)}`, "It applies the time difference in the wrong direction, producing the opposite speed change.")] : []),
        ]);
      }
      const scale = solution.intermediate.scale;
      if (!scale) throw new Error("Ratio-speed solution did not expose its common scale");
      return chooseThree(answer, [
        wrong("TREAT_TIME_GAP_AS_TOTAL_TIME", divide(input.distance, input.timeDifference), `${f(input.distance)} ÷ ${f(input.timeDifference)}`, "It treats the time gap as the full travel time."),
        wrong("IGNORE_RECIPROCAL_RELATION", scale, `${f(scale)}`, "It stops at the common ratio scale and forgets to multiply by the requested ratio part."),
        wrong("IGNORE_RECIPROCAL_RELATION", multiply(scale, add(input.slowerRatio, input.fasterRatio)), `${f(scale)} × (${f(input.slowerRatio)} + ${f(input.fasterRatio)})`, "It adds the ratio parts instead of selecting the requested speed component."),
      ]);
    }

    case "usualSpeedFromEarlyLatePair": {
      const distance = solution.intermediate.distance;
      if (!distance) throw new Error("Early/late speed solution did not expose distance");
      const arithmeticMean = divide(add(input.slowerTrialSpeed, input.fasterTrialSpeed), rational(2));
      const harmonicMean = divide(multiply(rational(2), multiply(input.slowerTrialSpeed, input.fasterTrialSpeed)), add(input.slowerTrialSpeed, input.fasterTrialSpeed));
      const scheduleGap = add(input.lateBy, input.earlyBy);
      return chooseThree(answer, [
        wrong("USE_ARITHMETIC_MEAN_SPEED", arithmeticMean, `(${f(input.slowerTrialSpeed)} + ${f(input.fasterTrialSpeed)}) ÷ 2`, "The usual speed is not the arithmetic mean of the early and late trial speeds."),
        wrong("USE_HARMONIC_MEAN_SPEED", harmonicMean, `2 × ${f(input.slowerTrialSpeed)} × ${f(input.fasterTrialSpeed)} ÷ (${f(input.slowerTrialSpeed)} + ${f(input.fasterTrialSpeed)})`, "It applies an equal-distance average-speed shortcut to a schedule reconstruction problem."),
        wrong("USE_EARLY_LATE_GAP_AS_TOTAL_TIME", divide(distance, scheduleGap), `${f(distance)} ÷ (${f(input.lateBy)} + ${f(input.earlyBy)})`, "It treats the early-plus-late gap as the scheduled journey time."),
      ]);
    }

    case "distanceFromEarlyLatePair": {
      const reciprocalGap = subtract(reciprocal(input.slowerTrialSpeed), reciprocal(input.fasterTrialSpeed));
      return chooseThree(answer, [
        wrong("MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE", multiply(add(input.lateBy, input.earlyBy), subtract(input.fasterTrialSpeed, input.slowerTrialSpeed)), `(${f(input.lateBy)} + ${f(input.earlyBy)}) × (${f(input.fasterTrialSpeed)} − ${f(input.slowerTrialSpeed)})`, "It uses the speed difference directly instead of the reciprocal-time difference."),
        wrong("IGNORE_EARLY_COMPONENT", divide(input.lateBy, reciprocalGap), `${f(input.lateBy)} ÷ (${f(reciprocalGap)})`, "It uses only the late-arrival part of the total schedule gap."),
        wrong("IGNORE_LATE_COMPONENT", divide(input.earlyBy, reciprocalGap), `${f(input.earlyBy)} ÷ (${f(reciprocalGap)})`, "It uses only the early-arrival part of the total schedule gap."),
      ]);
    }

    case "scheduledArrivalTimeFromActualSpeed": {
      const travelHours = divide(input.distance, input.actualSpeed);
      const travelMinutes = multiply(travelHours, rational(60));
      return chooseThree(answer, [
        wrong("TREAT_HOURS_AS_MINUTES", add(input.departureMinuteFromDayZero, travelHours), `${f(input.departureMinuteFromDayZero)} + ${f(travelHours)}`, "It adds a number of hours directly to a clock expressed in minutes."),
        wrong("ADD_DISTANCE_TO_CLOCK", add(input.departureMinuteFromDayZero, input.distance), `${f(input.departureMinuteFromDayZero)} + ${f(input.distance)}`, "It adds kilometres to the clock instead of adding travel minutes."),
        wrong("ADD_SPEED_TO_CLOCK", add(input.departureMinuteFromDayZero, input.actualSpeed), `${f(input.departureMinuteFromDayZero)} + ${f(input.actualSpeed)}`, "It adds the speed value to the clock instead of the journey time."),
        wrong("TREAT_HOURS_AS_MINUTES", add(input.departureMinuteFromDayZero, multiply(travelMinutes, rational(60))), `${f(input.departureMinuteFromDayZero)} + ${f(travelMinutes)} × 60`, "It converts the already-computed minutes by 60 once more."),
      ]);
    }

    case "requiredRecoverySpeedAfterLostTime":
      return chooseThree(answer, [
        wrong("ADD_INSTEAD_OF_DIVIDE", add(input.remainingDistance, input.remainingAvailableTime), `${f(input.remainingDistance)} + ${f(input.remainingAvailableTime)}`, "Required speed comes from distance divided by time, not their sum."),
        wrong("MULTIPLY_INSTEAD_OF_DIVIDE", multiply(input.remainingDistance, input.remainingAvailableTime), `${f(input.remainingDistance)} × ${f(input.remainingAvailableTime)}`, "It multiplies distance and time instead of dividing distance by time."),
        wrong("REVERSE_DIVISION", divide(input.remainingAvailableTime, input.remainingDistance), `${f(input.remainingAvailableTime)} ÷ ${f(input.remainingDistance)}`, "It reverses the distance ÷ time relation."),
      ]);

    case "requiredRemainingSpeedAfterPartialRoute": {
      const remainingDistance = subtract(input.totalDistance, input.completedDistance);
      return chooseThree(answer, [
        wrong("USE_OVERALL_AVERAGE_SPEED", divide(input.totalDistance, input.scheduledTotalTime), `${f(input.totalDistance)} ÷ ${f(input.scheduledTotalTime)}`, "It uses the planned average for the whole route and ignores the slow/fast first segment."),
        wrong("IGNORE_TIME_ALREADY_SPENT", divide(remainingDistance, input.scheduledTotalTime), `${f(remainingDistance)} ÷ ${f(input.scheduledTotalTime)}`, "It gives the remaining distance the full scheduled time instead of subtracting time already spent."),
        wrong("CONTINUE_AT_INITIAL_SPEED", input.completedSpeed, `${f(input.completedSpeed)}`, "It assumes the traveller can continue at the first-segment speed without checking the deadline."),
      ]);
    }

    case "stoppageDurationFromRunningAndOverallSpeed": {
      const runningTime = divide(input.distance, input.runningSpeed);
      const overallTime = divide(input.distance, input.overallSpeed);
      return chooseThree(answer, [
        wrong("USE_TOTAL_TIME_AS_STOPPAGE", overallTime, `${f(input.distance)} ÷ ${f(input.overallSpeed)}`, "It gives the complete elapsed time instead of only the stoppage part."),
        wrong("USE_RUNNING_TIME_AS_STOPPAGE", runningTime, `${f(input.distance)} ÷ ${f(input.runningSpeed)}`, "It gives the running time instead of the difference between total and running time."),
        wrong("ADD_RUNNING_AND_TOTAL_TIME", add(runningTime, overallTime), `${f(runningTime)} + ${f(overallTime)}`, "It adds total and running time instead of subtracting them."),
      ]);
    }

    case "overallSpeedIncludingStops": {
      const runningTime = divide(input.distance, input.runningSpeed);
      return chooseThree(answer, [
        wrong("IGNORE_STOPS", input.runningSpeed, `${f(input.runningSpeed)}`, "It reports running speed and ignores the stoppage time."),
        wrong("USE_STOP_TIME_AS_TOTAL_TIME", divide(input.distance, input.totalStopTime), `${f(input.distance)} ÷ ${f(input.totalStopTime)}`, "It treats stoppage time as if it were the complete elapsed time."),
        ...(compare(runningTime, input.totalStopTime) > 0 ? [wrong("SUBTRACT_STOP_TIME_FROM_RUNNING_TIME", divide(input.distance, subtract(runningTime, input.totalStopTime)), `${f(input.distance)} ÷ (${f(runningTime)} − ${f(input.totalStopTime)})`, "It subtracts the stop time from running time when stops should increase elapsed time.")] : []),
      ]);
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const overallTime = divide(input.distance, input.overallSpeed);
      return chooseThree(answer, [
        wrong("USE_OVERALL_SPEED_AS_RUNNING_SPEED", input.overallSpeed, `${f(input.overallSpeed)}`, "It assumes running speed and overall speed are the same despite stoppages."),
        wrong("USE_STOP_TIME_AS_TOTAL_TIME", divide(input.distance, input.totalStopTime), `${f(input.distance)} ÷ ${f(input.totalStopTime)}`, "It treats stoppage time as the running time."),
        wrong("ADD_STOP_TIME_TO_TOTAL_TIME", divide(input.distance, add(overallTime, input.totalStopTime)), `${f(input.distance)} ÷ (${f(overallTime)} + ${f(input.totalStopTime)})`, "It adds stoppage time to an overall time that already includes the stops."),
      ]);
    }

    case "numberOfStopsFromOverallDelay": {
      const delayMinutes = multiply(input.totalDelay, rational(60));
      const stopMinutes = multiply(input.stopDuration, rational(60));
      return chooseThree(answer, [
        wrong("USE_DELAY_MINUTES_AS_COUNT", delayMinutes, `${f(input.totalDelay)} × 60`, "It reports the total delay in minutes as the number of stops."),
        wrong("USE_STOP_MINUTES_AS_COUNT", stopMinutes, `${f(input.stopDuration)} × 60`, "It reports the duration of one stop in minutes as the stop count."),
        wrong("MULTIPLY_STOP_MINUTES", multiply(delayMinutes, stopMinutes), `${f(delayMinutes)} × ${f(stopMinutes)}`, "It multiplies the two minute values instead of dividing total delay by one-stop duration."),
      ]);
    }

    case "delayFromRegularStops": {
      const totalDelay = multiply(input.stopCount, input.stopDuration);
      return chooseThree(answer, [
        wrong("COUNT_ONLY_ONE_STOP", input.stopDuration, `${f(input.stopDuration)}`, "It counts only one stop instead of all stops."),
        wrong("EXTRA_SIXTY_DIVISION", divide(totalDelay, rational(60)), `${f(totalDelay)} ÷ 60`, "It divides by 60 even though the stop duration is already expressed in hours."),
        wrong("EXTRA_SIXTY_MULTIPLICATION", multiply(totalDelay, rational(60)), `${f(totalDelay)} × 60`, "It multiplies by 60 and then labels the minute total as hours."),
      ]);
    }

    case "restTimeInRepeatedTravelRestCycle": {
      const totalTravel = multiply(input.travelTimePerCycle, input.cycleCount);
      const totalRest = subtract(input.totalElapsedTime, totalTravel);
      return chooseThree(answer, [
        wrong("DIVIDE_REST_BY_CYCLES", divide(totalRest, input.cycleCount), `${f(totalRest)} ÷ ${f(input.cycleCount)}`, "It divides by travel cycles instead of by the actual number of rest events."),
        wrong("IGNORE_TRAVEL_TIME", divide(input.totalElapsedTime, input.restEvents), `${f(input.totalElapsedTime)} ÷ ${f(input.restEvents)}`, "It treats the entire elapsed time as rest time."),
        wrong("AVERAGE_FULL_CYCLE", divide(input.totalElapsedTime, input.cycleCount), `${f(input.totalElapsedTime)} ÷ ${f(input.cycleCount)}`, "It finds average elapsed time per travel cycle rather than rest time per stop."),
      ]);
    }

    case "totalTimeWithRegularStops": {
      const totalStop = multiply(input.stopCount, input.stopDuration);
      return chooseThree(answer, [
        wrong("COUNT_ONE_STOP_ONLY", add(input.runningTime, input.stopDuration), `${f(input.runningTime)} + ${f(input.stopDuration)}`, "It adds only one stop instead of all regular stops."),
        wrong("TREAT_STOP_COUNT_AS_HOURS", add(input.runningTime, input.stopCount), `${f(input.runningTime)} + ${f(input.stopCount)}`, "It treats the number of stops as a number of hours."),
        wrong("EXTRA_SIXTY_DIVISION", add(input.runningTime, divide(totalStop, rational(60))), `${f(input.runningTime)} + ${f(totalStop)} ÷ 60`, "It divides the already-hour-based stop time by 60 once more."),
      ]);
    }

    case "speedChangePointDistance":
      return chooseThree(answer, [
        wrong("HALVE_ROUTE_BY_DEFAULT", divide(input.totalDistance, rational(2)), `${f(input.totalDistance)} ÷ 2`, "It assumes the speed changes halfway without using the travel-time condition."),
        wrong("USE_FIRST_SPEED_FOR_WHOLE_TIME", multiply(input.totalTravelTime, input.firstSpeed), `${f(input.totalTravelTime)} × ${f(input.firstSpeed)}`, "It assumes the first speed was used for the entire journey."),
        wrong("USE_SECOND_SPEED_FOR_WHOLE_TIME", multiply(input.totalTravelTime, input.secondSpeed), `${f(input.totalTravelTime)} × ${f(input.secondSpeed)}`, "It assumes the second speed was used for the entire journey."),
      ]);

    case "fractionOfRouteAtChangedSpeed": {
      const originalDistance = solution.intermediate.originalDistance;
      if (!originalDistance) throw new Error("Changed-route solution did not expose original distance");
      const complementPercent = multiply(divide(originalDistance, input.totalDistance), rational(100));
      const speedChangePercent = multiply(divide(absRational(subtract(input.changedSpeed, input.originalSpeed)), input.originalSpeed), rational(100));
      const speedRatioPercent = multiply(divide(input.changedSpeed, input.originalSpeed), rational(100));
      return chooseThree(answer, [
        wrong("USE_COMPLEMENT_ROUTE_FRACTION", complementPercent, `${f(originalDistance)} ÷ ${f(input.totalDistance)} × 100`, "It gives the fraction travelled at the original speed rather than at the changed speed."),
        wrong("USE_SPEED_CHANGE_PERCENT", speedChangePercent, `|${f(input.changedSpeed)} − ${f(input.originalSpeed)}| ÷ ${f(input.originalSpeed)} × 100`, "It calculates percentage change in speed instead of percentage of route."),
        wrong("USE_SPEED_RATIO_AS_PERCENT", speedRatioPercent, `${f(input.changedSpeed)} ÷ ${f(input.originalSpeed)} × 100`, "It converts the speed ratio into a percentage and mistakes it for route share."),
      ]);
    }

    case "lostTimeDurationFromScheduleRecovery": {
      const usualTime = divide(input.remainingDistance, input.usualSpeed);
      const recoveryTime = divide(input.remainingDistance, input.recoverySpeed);
      const recovered = subtract(usualTime, recoveryTime);
      return chooseThree(answer, [
        wrong("IGNORE_FINAL_DELAY", recovered, `${f(usualTime)} − ${f(recoveryTime)}`, "It finds only the time recovered by higher speed and forgets the delay still remaining at arrival."),
        wrong("USE_FINAL_DELAY_ONLY", input.finalArrivalDelay, `${f(input.finalArrivalDelay)}`, "It uses only the final arrival delay and ignores the time that was recovered."),
        wrong("SUBTRACT_FINAL_DELAY", absRational(subtract(recovered, input.finalArrivalDelay)), `|${f(recovered)} − ${f(input.finalArrivalDelay)}|`, "It subtracts the final delay from recovered time instead of adding both parts to reconstruct the original lost time."),
      ]);
    }

    case "startTimeShiftForSameArrival": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      return chooseThree(answer, [
        wrong("USE_OLD_TRAVEL_TIME", oldTime, `${f(input.distance)} ÷ ${f(input.originalSpeed)}`, "It gives the old journey time instead of the required start-time shift."),
        wrong("USE_NEW_TRAVEL_TIME", newTime, `${f(input.distance)} ÷ ${f(input.newSpeed)}`, "It gives the new journey time instead of their difference."),
        wrong("ADD_TRAVEL_TIMES_FOR_SHIFT", add(oldTime, newTime), `${f(oldTime)} + ${f(newTime)}`, "It adds the two travel times instead of taking the difference needed to keep the same arrival."),
      ]);
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      const speedShift = subtract(newTime, oldTime);
      return chooseThree(answer, [
        wrong("IGNORE_SPEED_SHIFT", absRational(input.departureShift), `|${f(input.departureShift)}|`, "It uses only the change in departure time and ignores the change in journey duration."),
        wrong("IGNORE_DEPARTURE_SHIFT", absRational(speedShift), `|${f(newTime)} − ${f(oldTime)}|`, "It uses only the speed-related travel-time change and ignores the shifted departure."),
        wrong("SUBTRACT_SHIFT_COMPONENTS", absRational(subtract(input.departureShift, speedShift)), `|${f(input.departureShift)} − (${f(speedShift)})|`, "It combines the signed departure and travel-time shifts in the wrong direction."),
      ]);
    }

    case "walkingRidingAllocation": {
      const walkingDistance = solution.intermediate.walkingDistance;
      const ridingDistance = solution.intermediate.ridingDistance;
      const walkingTime = solution.intermediate.walkingTime;
      const ridingTime = solution.intermediate.ridingTime;
      if (!walkingDistance || !ridingDistance || !walkingTime || !ridingTime) throw new Error("Walking/riding solution did not expose its allocation components");
      const isTime = input.target.endsWith("TIME");
      const otherComponent = input.target === "WALKING_TIME" ? ridingTime
        : input.target === "RIDING_TIME" ? walkingTime
          : input.target === "WALKING_DISTANCE" ? ridingDistance
            : walkingDistance;
      const wholeTargetMode = input.target === "WALKING_TIME" ? divide(input.totalDistance, input.walkingSpeed)
        : input.target === "RIDING_TIME" ? divide(input.totalDistance, input.ridingSpeed)
          : input.target === "WALKING_DISTANCE" ? multiply(input.totalTime, input.walkingSpeed)
            : multiply(input.totalTime, input.ridingSpeed);
      const totalQuantity = isTime ? input.totalTime : input.totalDistance;
      return chooseThree(answer, [
        wrong("USE_OTHER_MODE_COMPONENT", otherComponent, `${f(otherComponent)}`, "It reports the other travel mode's component instead of the requested one."),
        wrong("USE_TOTAL_QUANTITY", totalQuantity, `${f(totalQuantity)}`, "It reports the total journey quantity instead of the requested walking/riding share."),
        wrong("ASSUME_WHOLE_ROUTE_IN_TARGET_MODE", wholeTargetMode, isTime ? `${f(input.totalDistance)} ÷ target speed` : `${f(input.totalTime)} × target speed`, "It assumes the whole journey used only the requested travel mode."),
      ]);
    }

    case "scheduleBuffer":
      return chooseThree(answer, [
        wrong("USE_SCHEDULED_DURATION", input.scheduledDuration, `${f(input.scheduledDuration)}`, "It gives the full scheduled duration instead of the extra buffer."),
        wrong("USE_PLANNED_DURATION", input.plannedTravelDuration, `${f(input.plannedTravelDuration)}`, "It gives the planned travel time instead of the schedule margin."),
        wrong("ADD_SCHEDULE_DURATIONS", add(input.scheduledDuration, input.plannedTravelDuration), `${f(input.scheduledDuration)} + ${f(input.plannedTravelDuration)}`, "It adds scheduled and planned durations instead of subtracting them."),
      ]);
  }
}
