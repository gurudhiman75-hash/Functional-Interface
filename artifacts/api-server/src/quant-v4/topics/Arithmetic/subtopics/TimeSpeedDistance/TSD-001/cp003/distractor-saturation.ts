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

    case "fractionOfRouteAtChangedSpeed": {
      const originalDistance = solution.intermediate.originalDistance!;
      const complement = multiply(divide(originalDistance, input.totalDistance), rational(100));
      const changePercent = multiply(divide(absRational(subtract(input.changedSpeed, input.originalSpeed)), input.originalSpeed), rational(100));
      const forwardRatio = multiply(divide(input.changedSpeed, input.originalSpeed), rational(100));
      const inverseRatio = multiply(divide(input.originalSpeed, input.changedSpeed), rational(100));
      return choose(answer, [
        wrong("USE_COMPLEMENT_ROUTE_FRACTION", complement, `${f(originalDistance)} ÷ ${f(input.totalDistance)} × 100`, "It gives the original-speed route share rather than the changed-speed share."),
        wrong("USE_SPEED_CHANGE_PERCENT", changePercent, `|${f(input.changedSpeed)} − ${f(input.originalSpeed)}| ÷ ${f(input.originalSpeed)} × 100`, "It finds percentage change in speed rather than route percentage."),
        wrong("USE_SPEED_RATIO_AS_PERCENT", forwardRatio, `${f(input.changedSpeed)} ÷ ${f(input.originalSpeed)} × 100`, "It converts the speed ratio into a percentage."),
        wrong("USE_SPEED_RATIO_AS_PERCENT", inverseRatio, `${f(input.originalSpeed)} ÷ ${f(input.changedSpeed)} × 100`, "It converts the inverse speed ratio into a route percentage."),
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
