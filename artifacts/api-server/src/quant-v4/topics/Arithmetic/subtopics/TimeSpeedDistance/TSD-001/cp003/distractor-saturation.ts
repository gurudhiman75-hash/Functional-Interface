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
import { deriveCp003WrongWorkings } from "./distractors";
import { formatExamNumber } from "./generation-support";
import type { TsdCp003MisconceptionId, TsdCp003WrongWorking } from "./runtime-types";
import type { TsdCp003SolveCertificate, TsdCp003SolveInput } from "./types";

type WrongId = Exclude<TsdCp003MisconceptionId, "CORRECT">;

function f(value: Rational): string {
  return formatExamNumber(value);
}

function wrong(id: WrongId, value: Rational, calculation: string, diagnosis: string): TsdCp003WrongWorking {
  return Object.freeze({ misconceptionId: id, value, calculation, diagnosis });
}

function choose(answer: Rational, methods: readonly TsdCp003WrongWorking[]): readonly TsdCp003WrongWorking[] {
  const selected: TsdCp003WrongWorking[] = [];
  const seen: Rational[] = [answer];
  for (const method of methods) {
    if (compare(method.value, RATIONAL_ZERO) <= 0) continue;
    if (seen.some((value) => equals(value, method.value))) continue;
    selected.push(method);
    seen.push(method.value);
    if (selected.length === 3) return Object.freeze(selected);
  }
  throw new Error(`Collision-safe CP-003 distractor pool still has fewer than three unique wrong methods for answer ${f(answer)}`);
}

function collisionFallback(input: TsdCp003SolveInput, solution: TsdCp003SolveCertificate): readonly TsdCp003WrongWorking[] {
  const answer = solution.answer;

  switch (input.solveMode) {
    case "speedFromFixedRouteTimeDifference": {
      if (input.representation !== "KNOWN_OTHER_SPEED") throw new Error("Ratio-speed collision was not expected");
      const gapRate = divide(input.distance, input.timeDifference);
      const knownTime = divide(input.distance, input.knownSpeed);
      const wrongDirectionTime = input.unknownRole === "FASTER"
        ? add(knownTime, input.timeDifference)
        : subtract(knownTime, input.timeDifference);
      return choose(answer, [
        wrong("TREAT_TIME_GAP_AS_TOTAL_TIME", gapRate, `${f(input.distance)} ÷ ${f(input.timeDifference)}`, "It treats the time gap as the complete journey time."),
        wrong("IGNORE_RECIPROCAL_RELATION", input.knownSpeed, `${f(input.knownSpeed)}`, "It simply repeats the known speed."),
        ...(compare(wrongDirectionTime, RATIONAL_ZERO) > 0 ? [wrong("IGNORE_RECIPROCAL_RELATION", divide(input.distance, wrongDirectionTime), `${f(input.distance)} ÷ ${f(wrongDirectionTime)}`, "It applies the time gap in the opposite direction.")] : []),
        wrong("IGNORE_RECIPROCAL_RELATION", add(input.knownSpeed, gapRate), `${f(input.knownSpeed)} + (${f(input.distance)} ÷ ${f(input.timeDifference)})`, "It adds a gap-derived rate to the known speed instead of solving the reciprocal-time equation."),
      ]);
    }

    case "usualSpeedFromEarlyLatePair": {
      const distance = solution.intermediate.distance!;
      const arithmeticMean = divide(add(input.slowerTrialSpeed, input.fasterTrialSpeed), rational(2));
      const harmonicMean = divide(multiply(rational(2), multiply(input.slowerTrialSpeed, input.fasterTrialSpeed)), add(input.slowerTrialSpeed, input.fasterTrialSpeed));
      const gap = add(input.lateBy, input.earlyBy);
      return choose(answer, [
        wrong("USE_ARITHMETIC_MEAN_SPEED", arithmeticMean, `(${f(input.slowerTrialSpeed)} + ${f(input.fasterTrialSpeed)}) ÷ 2`, "It takes an arithmetic mean instead of reconstructing the schedule."),
        wrong("USE_HARMONIC_MEAN_SPEED", harmonicMean, `2 × ${f(input.slowerTrialSpeed)} × ${f(input.fasterTrialSpeed)} ÷ (${f(input.slowerTrialSpeed)} + ${f(input.fasterTrialSpeed)})`, "It applies an equal-distance average shortcut to an early/late schedule problem."),
        wrong("USE_EARLY_LATE_GAP_AS_TOTAL_TIME", divide(distance, gap), `${f(distance)} ÷ ${f(gap)}`, "It treats the early-plus-late gap as the full scheduled journey time."),
        wrong("USE_SLOWER_SPEED_ONLY", input.slowerTrialSpeed, `${f(input.slowerTrialSpeed)}`, "It selects the late-case speed instead of the on-time speed."),
        wrong("USE_FASTER_SPEED_ONLY", input.fasterTrialSpeed, `${f(input.fasterTrialSpeed)}`, "It selects the early-case speed instead of the on-time speed."),
      ]);
    }

    case "distanceFromEarlyLatePair": {
      const reciprocalGap = subtract(reciprocal(input.slowerTrialSpeed), reciprocal(input.fasterTrialSpeed));
      const totalGap = add(input.lateBy, input.earlyBy);
      return choose(answer, [
        wrong("MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE", multiply(totalGap, subtract(input.fasterTrialSpeed, input.slowerTrialSpeed)), `${f(totalGap)} × (${f(input.fasterTrialSpeed)} − ${f(input.slowerTrialSpeed)})`, "It multiplies the time gap by the speed gap instead of using reciprocal speeds."),
        wrong("IGNORE_EARLY_COMPONENT", divide(input.lateBy, reciprocalGap), `${f(input.lateBy)} ÷ ${f(reciprocalGap)}`, "It uses only the late component."),
        wrong("IGNORE_LATE_COMPONENT", divide(input.earlyBy, reciprocalGap), `${f(input.earlyBy)} ÷ ${f(reciprocalGap)}`, "It uses only the early component."),
        wrong("USE_SLOWER_SPEED_ONLY", multiply(input.lateBy, input.slowerTrialSpeed), `${f(input.lateBy)} × ${f(input.slowerTrialSpeed)}`, "It treats the late amount as if it were the entire slower journey time."),
        wrong("USE_FASTER_SPEED_ONLY", multiply(input.earlyBy, input.fasterTrialSpeed), `${f(input.earlyBy)} × ${f(input.fasterTrialSpeed)}`, "It treats the early amount as if it were the entire faster journey time."),
      ]);
    }

    case "requiredRemainingSpeedAfterPartialRoute": {
      const completedTime = divide(input.completedDistance, input.completedSpeed);
      const remainingTime = subtract(input.scheduledTotalTime, completedTime);
      const remainingDistance = subtract(input.totalDistance, input.completedDistance);
      return choose(answer, [
        wrong("USE_OVERALL_AVERAGE_SPEED", divide(input.totalDistance, input.scheduledTotalTime), `${f(input.totalDistance)} ÷ ${f(input.scheduledTotalTime)}`, "It uses the planned whole-route average and ignores how the first segment changed the schedule."),
        wrong("IGNORE_TIME_ALREADY_SPENT", divide(remainingDistance, input.scheduledTotalTime), `${f(remainingDistance)} ÷ ${f(input.scheduledTotalTime)}`, "It subtracts distance already covered but gives the remainder the full scheduled time."),
        wrong("IGNORE_DISTANCE_ALREADY_COVERED", divide(input.totalDistance, remainingTime), `${f(input.totalDistance)} ÷ (${f(input.scheduledTotalTime)} − ${f(completedTime)})`, "It subtracts the time already spent but still uses the full route distance instead of only the remaining distance."),
        wrong("CONTINUE_AT_INITIAL_SPEED", input.completedSpeed, `${f(input.completedSpeed)}`, "It simply continues at the first-segment speed without checking the remaining distance and deadline."),
      ]);
    }

    case "speedChangePointDistance": {
      const halfRoute = divide(input.totalDistance, rational(2));
      const firstWholeTimeDistance = multiply(input.totalTravelTime, input.firstSpeed);
      const secondWholeTimeDistance = multiply(input.totalTravelTime, input.secondSpeed);
      const speedGapDistance = multiply(input.totalTravelTime, absRational(subtract(input.secondSpeed, input.firstSpeed)));
      const speedRatioSplit = multiply(input.totalDistance, divide(input.firstSpeed, add(input.firstSpeed, input.secondSpeed)));
      return choose(answer, [
        wrong("HALVE_ROUTE_BY_DEFAULT", halfRoute, `${f(input.totalDistance)} ÷ 2`, "It assumes the speed changes exactly halfway without using the total-time condition."),
        wrong("USE_FIRST_SPEED_FOR_WHOLE_TIME", firstWholeTimeDistance, `${f(input.totalTravelTime)} × ${f(input.firstSpeed)}`, "It assumes the first speed is used throughout the full journey time."),
        wrong("USE_SECOND_SPEED_FOR_WHOLE_TIME", secondWholeTimeDistance, `${f(input.totalTravelTime)} × ${f(input.secondSpeed)}`, "It assumes the second speed is used throughout the full journey time."),
        wrong("TREAT_SPEED_DIFFERENCE_AS_SPEED", speedGapDistance, `${f(input.totalTravelTime)} × |${f(input.secondSpeed)} − ${f(input.firstSpeed)}|`, "It treats the speed difference as an effective travel speed for the whole elapsed time."),
        wrong("SPLIT_DISTANCE_IN_SPEED_RATIO", speedRatioSplit, `${f(input.totalDistance)} × ${f(input.firstSpeed)} ÷ (${f(input.firstSpeed)} + ${f(input.secondSpeed)})`, "It splits route distance in the ratio of speeds, which ignores the stated total journey time."),
      ]);
    }

    case "fractionOfRouteAtChangedSpeed": {
      const originalDistance = solution.intermediate.originalDistance!;
      const changedDistance = solution.intermediate.changedDistance!;
      const complement = multiply(divide(originalDistance, input.totalDistance), rational(100));
      const changePercent = multiply(divide(absRational(subtract(input.changedSpeed, input.originalSpeed)), input.originalSpeed), rational(100));
      const forwardRatio = multiply(divide(input.changedSpeed, input.originalSpeed), rational(100));
      const inverseRatio = multiply(divide(input.originalSpeed, input.changedSpeed), rational(100));
      const changedTime = divide(changedDistance, input.changedSpeed);
      const changedTimePercent = multiply(divide(changedTime, input.totalTravelTime), rational(100));
      return choose(answer, [
        wrong("USE_COMPLEMENT_ROUTE_FRACTION", complement, `${f(originalDistance)} ÷ ${f(input.totalDistance)} × 100`, "It gives the original-speed route share rather than the changed-speed share."),
        wrong("USE_SPEED_CHANGE_PERCENT", changePercent, `|${f(input.changedSpeed)} − ${f(input.originalSpeed)}| ÷ ${f(input.originalSpeed)} × 100`, "It finds percentage change in speed rather than route percentage."),
        wrong("USE_SPEED_RATIO_AS_PERCENT", forwardRatio, `${f(input.changedSpeed)} ÷ ${f(input.originalSpeed)} × 100`, "It converts the speed ratio into a percentage."),
        wrong("USE_SPEED_RATIO_AS_PERCENT", inverseRatio, `${f(input.originalSpeed)} ÷ ${f(input.changedSpeed)} × 100`, "It converts the inverse speed ratio into a route percentage."),
        wrong("USE_TIME_SHARE_AS_ROUTE_PERCENT", changedTimePercent, `${f(changedTime)} ÷ ${f(input.totalTravelTime)} × 100`, "It uses the percentage of journey time spent at the changed speed instead of the percentage of route distance."),
      ]);
    }

    case "lostTimeDurationFromScheduleRecovery": {
      const usualTime = divide(input.remainingDistance, input.usualSpeed);
      const recoveryTime = divide(input.remainingDistance, input.recoverySpeed);
      const recovered = subtract(usualTime, recoveryTime);
      return choose(answer, [
        wrong("IGNORE_FINAL_DELAY", recovered, `${f(usualTime)} − ${f(recoveryTime)}`, "It keeps only the time recovered by the higher speed."),
        wrong("USE_FINAL_DELAY_ONLY", input.finalArrivalDelay, `${f(input.finalArrivalDelay)}`, "It keeps only the residual arrival delay."),
        wrong("SUBTRACT_FINAL_DELAY", absRational(subtract(recovered, input.finalArrivalDelay)), `|${f(recovered)} − ${f(input.finalArrivalDelay)}|`, "It subtracts residual delay from recovered time instead of adding both parts."),
        wrong("USE_ONE_TRAVEL_TIME", usualTime, `${f(input.remainingDistance)} ÷ ${f(input.usualSpeed)}`, "It reports the usual remaining journey time as the disruption duration."),
        wrong("USE_ONE_TRAVEL_TIME", recoveryTime, `${f(input.remainingDistance)} ÷ ${f(input.recoverySpeed)}`, "It reports the recovery journey time as the disruption duration."),
      ]);
    }

    case "startTimeShiftForSameArrival": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      const averageTime = divide(add(oldTime, newTime), rational(2));
      return choose(answer, [
        wrong("USE_OLD_TRAVEL_TIME", oldTime, `${f(input.distance)} ÷ ${f(input.originalSpeed)}`, "It gives the old journey time instead of the required departure shift."),
        wrong("USE_NEW_TRAVEL_TIME", newTime, `${f(input.distance)} ÷ ${f(input.newSpeed)}`, "It gives the new journey time instead of the difference between the two journey times."),
        wrong("ADD_TRAVEL_TIMES_FOR_SHIFT", add(oldTime, newTime), `${f(oldTime)} + ${f(newTime)}`, "It adds the two journey times instead of taking their difference."),
        wrong("AVERAGE_TRAVEL_TIMES_FOR_SHIFT", averageTime, `(${f(oldTime)} + ${f(newTime)}) ÷ 2`, "It averages the old and new journey times instead of subtracting them to find the departure shift."),
      ]);
    }

    case "arrivalShiftFromDepartureAndSpeedChanges": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.newSpeed);
      const speedShift = subtract(newTime, oldTime);
      return choose(answer, [
        wrong("IGNORE_SPEED_SHIFT", absRational(input.departureShift), `|${f(input.departureShift)}|`, "It uses only the departure-time change."),
        wrong("IGNORE_DEPARTURE_SHIFT", absRational(speedShift), `|${f(newTime)} − ${f(oldTime)}|`, "It uses only the speed-related travel-time change."),
        wrong("SUBTRACT_SHIFT_COMPONENTS", absRational(subtract(input.departureShift, speedShift)), `|${f(input.departureShift)} − (${f(speedShift)})|`, "It combines the signed changes in the wrong direction."),
        wrong("USE_OLD_TRAVEL_TIME", oldTime, `${f(input.distance)} ÷ ${f(input.originalSpeed)}`, "It reports the original travel time rather than the change in arrival."),
        wrong("USE_NEW_TRAVEL_TIME", newTime, `${f(input.distance)} ÷ ${f(input.newSpeed)}`, "It reports the new travel time rather than the change in arrival."),
      ]);
    }

    case "walkingRidingAllocation": {
      const walkingDistance = solution.intermediate.walkingDistance!;
      const ridingDistance = solution.intermediate.ridingDistance!;
      const walkingTime = solution.intermediate.walkingTime!;
      const ridingTime = solution.intermediate.ridingTime!;
      const isTimeTarget = input.target.endsWith("TIME");
      const otherComponent = input.target === "WALKING_TIME" ? ridingTime
        : input.target === "RIDING_TIME" ? walkingTime
          : input.target === "WALKING_DISTANCE" ? ridingDistance
            : walkingDistance;
      const totalQuantity = isTimeTarget ? input.totalTime : input.totalDistance;
      const wholeTargetMode = input.target === "WALKING_TIME" ? divide(input.totalDistance, input.walkingSpeed)
        : input.target === "RIDING_TIME" ? divide(input.totalDistance, input.ridingSpeed)
          : input.target === "WALKING_DISTANCE" ? multiply(input.totalTime, input.walkingSpeed)
            : multiply(input.totalTime, input.ridingSpeed);
      const equalSplit = divide(totalQuantity, rational(2));
      const wrongPairing = input.target === "WALKING_TIME" ? divide(walkingDistance, input.ridingSpeed)
        : input.target === "RIDING_TIME" ? divide(ridingDistance, input.walkingSpeed)
          : input.target === "WALKING_DISTANCE" ? multiply(walkingTime, input.ridingSpeed)
            : multiply(ridingTime, input.walkingSpeed);
      return choose(answer, [
        wrong("USE_OTHER_MODE_COMPONENT", otherComponent, `${f(otherComponent)}`, "It reports the other travel mode's component instead of the requested one."),
        wrong("USE_TOTAL_QUANTITY", totalQuantity, `${f(totalQuantity)}`, "It reports the full journey quantity instead of the requested walking/riding share."),
        wrong("ASSUME_WHOLE_ROUTE_IN_TARGET_MODE", wholeTargetMode, isTimeTarget ? `${f(input.totalDistance)} ÷ target speed` : `${f(input.totalTime)} × target speed`, "It assumes the entire route or time belongs to only the requested mode."),
        wrong("ASSUME_EQUAL_MODE_SPLIT", equalSplit, `${f(totalQuantity)} ÷ 2`, "It assumes walking and riding split the requested quantity equally without using the two speeds."),
        wrong("PAIR_DISTANCE_WITH_WRONG_SPEED", wrongPairing, input.target.endsWith("TIME") ? `target distance ÷ other-mode speed` : `target time × other-mode speed`, "It pairs a segment from one mode with the other mode's speed."),
      ]);
    }

    default:
      throw new Error(`No collision fallback defined for ${input.solveMode}`);
  }
}

export function deriveSaturatedCp003WrongWorkings(
  input: TsdCp003SolveInput,
  solution: TsdCp003SolveCertificate,
): readonly TsdCp003WrongWorking[] {
  try {
    return deriveCp003WrongWorkings(input, solution);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.startsWith("Could not derive three unique method-based distractors")) throw error;
    return collisionFallback(input, solution);
  }
}
