import {
  RATIONAL_ZERO,
  add,
  compare,
  divide,
  equals,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import { deriveSaturatedCp003WrongWorkings } from "./distractor-saturation";
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
  throw new Error(`Exam-ready CP-003 distractor pool has fewer than three unique wrong methods for answer ${f(answer)}`);
}

export function deriveExamReadyCp003WrongWorkings(
  input: TsdCp003SolveInput,
  solution: TsdCp003SolveCertificate,
): readonly TsdCp003WrongWorking[] {
  const answer = solution.answer;

  switch (input.solveMode) {
    case "overallSpeedIncludingStops": {
      const runningTime = divide(input.distance, input.runningSpeed);
      const doubleStopElapsed = add(runningTime, multiply(input.totalStopTime, rational(2)));
      const subtractStopElapsed = subtract(runningTime, input.totalStopTime);
      return choose(answer, [
        wrong(
          "IGNORE_STOPS",
          input.runningSpeed,
          `${f(input.runningSpeed)}`,
          "It uses the running speed as the overall speed and ignores the stoppage time.",
        ),
        wrong(
          "DOUBLE_COUNT_STOP_TIME",
          divide(input.distance, doubleStopElapsed),
          `${f(input.distance)} ÷ (${f(runningTime)} + 2 × ${f(input.totalStopTime)})`,
          "It counts the stoppage time twice before calculating overall speed.",
        ),
        ...(compare(subtractStopElapsed, RATIONAL_ZERO) > 0 ? [wrong(
          "SUBTRACT_STOP_TIME_FROM_RUNNING_TIME",
          divide(input.distance, subtractStopElapsed),
          `${f(input.distance)} ÷ (${f(runningTime)} − ${f(input.totalStopTime)})`,
          "It subtracts stoppage from running time, making the journey artificially shorter.",
        )] : []),
      ]);
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const overallTime = divide(input.distance, input.overallSpeed);
      const subtractTwice = subtract(overallTime, multiply(input.totalStopTime, rational(2)));
      const subtractHalf = subtract(overallTime, divide(input.totalStopTime, rational(2)));
      return choose(answer, [
        wrong(
          "USE_OVERALL_SPEED_AS_RUNNING_SPEED",
          input.overallSpeed,
          `${f(input.overallSpeed)}`,
          "It treats overall speed as running speed even though the overall time includes stoppage.",
        ),
        wrong(
          "ADD_STOP_TIME_TO_TOTAL_TIME",
          divide(input.distance, add(overallTime, input.totalStopTime)),
          `${f(input.distance)} ÷ (${f(overallTime)} + ${f(input.totalStopTime)})`,
          "It adds the stoppage time to an overall time that already includes that stoppage.",
        ),
        ...(compare(subtractTwice, RATIONAL_ZERO) > 0 ? [wrong(
          "SUBTRACT_STOP_TIME_TWICE",
          divide(input.distance, subtractTwice),
          `${f(input.distance)} ÷ (${f(overallTime)} − 2 × ${f(input.totalStopTime)})`,
          "It removes the stoppage time twice before calculating running speed.",
        )] : []),
        wrong(
          "SUBTRACT_HALF_STOP_TIME",
          divide(input.distance, subtractHalf),
          `${f(input.distance)} ÷ (${f(overallTime)} − ${f(input.totalStopTime)} ÷ 2)`,
          "It removes only half of the stated stoppage time.",
        ),
      ]);
    }

    case "numberOfStopsFromOverallDelay": {
      const one = rational(1);
      const two = rational(2);
      return choose(answer, [
        wrong(
          "MISS_ONE_STOP",
          subtract(answer, one),
          `${f(answer)} − 1`,
          "It misses one stop when converting the total delay into a stop count.",
        ),
        wrong(
          "COUNT_ONE_EXTRA_STOP",
          add(answer, one),
          `${f(answer)} + 1`,
          "It counts one extra stop.",
        ),
        wrong(
          "MISS_TWO_STOPS",
          subtract(answer, two),
          `${f(answer)} − 2`,
          "It misses two stops in the discrete count.",
        ),
      ]);
    }

    case "delayFromRegularStops": {
      const one = rational(1);
      const oneFewer = multiply(subtract(input.stopCount, one), input.stopDuration);
      const oneExtra = multiply(add(input.stopCount, one), input.stopDuration);
      return choose(answer, [
        wrong(
          "MISS_ONE_STOP",
          oneFewer,
          `(${f(input.stopCount)} − 1) × ${f(input.stopDuration)}`,
          "It misses one stop when adding the repeated delays.",
        ),
        wrong(
          "COUNT_ONE_EXTRA_STOP",
          oneExtra,
          `(${f(input.stopCount)} + 1) × ${f(input.stopDuration)}`,
          "It counts one extra stop.",
        ),
        wrong(
          "COUNT_ONLY_ONE_STOP",
          input.stopDuration,
          `${f(input.stopDuration)}`,
          "It includes the delay from only one stop instead of all stops.",
        ),
      ]);
    }

    case "restTimeInRepeatedTravelRestCycle": {
      const totalTravel = multiply(input.travelTimePerCycle, input.cycleCount);
      const totalRest = subtract(input.totalElapsedTime, totalTravel);
      const one = rational(1);
      const oneFewerRest = subtract(input.restEvents, one);
      const oneExtraRest = add(input.restEvents, one);
      return choose(answer, [
        ...(compare(oneFewerRest, RATIONAL_ZERO) > 0 ? [wrong(
          "MISS_ONE_REST_EVENT",
          divide(totalRest, oneFewerRest),
          `${f(totalRest)} ÷ (${f(input.restEvents)} − 1)`,
          "It misses one rest event when sharing the total rest time.",
        )] : []),
        wrong(
          "COUNT_ONE_EXTRA_REST_EVENT",
          divide(totalRest, oneExtraRest),
          `${f(totalRest)} ÷ (${f(input.restEvents)} + 1)`,
          "It counts one extra rest event.",
        ),
        wrong(
          "DIVIDE_REST_BY_CYCLES",
          divide(totalRest, input.cycleCount),
          `${f(totalRest)} ÷ ${f(input.cycleCount)}`,
          "It divides by travel cycles instead of the actual number of rest events.",
        ),
        wrong(
          "IGNORE_TRAVEL_TIME",
          divide(input.totalElapsedTime, input.restEvents),
          `${f(input.totalElapsedTime)} ÷ ${f(input.restEvents)}`,
          "It treats the entire elapsed time as rest time and never removes the travel component.",
        ),
      ]);
    }

    case "totalTimeWithRegularStops": {
      const one = rational(1);
      const oneFewer = add(input.runningTime, multiply(subtract(input.stopCount, one), input.stopDuration));
      const oneExtra = add(input.runningTime, multiply(add(input.stopCount, one), input.stopDuration));
      const oneOnly = add(input.runningTime, input.stopDuration);
      return choose(answer, [
        wrong(
          "MISS_ONE_STOP",
          oneFewer,
          `${f(input.runningTime)} + (${f(input.stopCount)} − 1) × ${f(input.stopDuration)}`,
          "It misses one regular stop when building total elapsed time.",
        ),
        wrong(
          "COUNT_ONE_EXTRA_STOP",
          oneExtra,
          `${f(input.runningTime)} + (${f(input.stopCount)} + 1) × ${f(input.stopDuration)}`,
          "It counts one extra regular stop.",
        ),
        wrong(
          "COUNT_ONE_STOP_ONLY",
          oneOnly,
          `${f(input.runningTime)} + ${f(input.stopDuration)}`,
          "It adds the duration of only one stop instead of all regular stops.",
        ),
      ]);
    }

    case "fractionOfRouteAtChangedSpeed": {
      const originalDistance = solution.intermediate.originalDistance;
      const changedDistance = solution.intermediate.changedDistance;
      if (!originalDistance || !changedDistance) throw new Error("Changed-route solution did not expose both distance components");
      const complement = multiply(divide(originalDistance, input.totalDistance), rational(100));
      const speedChange = multiply(divide(subtract(input.changedSpeed, input.originalSpeed), input.originalSpeed), rational(100));
      const changedTime = divide(changedDistance, input.changedSpeed);
      const changedTimeShare = multiply(divide(changedTime, input.totalTravelTime), rational(100));
      const speedRatioShare = multiply(divide(input.changedSpeed, add(input.originalSpeed, input.changedSpeed)), rational(100));
      const inverseSpeedRatioShare = multiply(divide(input.originalSpeed, add(input.originalSpeed, input.changedSpeed)), rational(100));
      return choose(answer, [
        wrong(
          "USE_COMPLEMENT_ROUTE_FRACTION",
          complement,
          `${f(originalDistance)} ÷ ${f(input.totalDistance)} × 100`,
          "It gives the original-speed share of the route instead of the changed-speed share.",
        ),
        wrong(
          "USE_SPEED_CHANGE_PERCENT",
          speedChange,
          `(${f(input.changedSpeed)} − ${f(input.originalSpeed)}) ÷ ${f(input.originalSpeed)} × 100`,
          "It finds the percentage increase in speed instead of the percentage of route travelled at that speed.",
        ),
        wrong(
          "USE_TIME_SHARE_AS_ROUTE_PERCENT",
          changedTimeShare,
          `${f(changedTime)} ÷ ${f(input.totalTravelTime)} × 100`,
          "It uses the share of journey time spent at the changed speed instead of the share of route distance.",
        ),
        wrong(
          "SPLIT_DISTANCE_IN_SPEED_RATIO",
          speedRatioShare,
          `${f(input.changedSpeed)} ÷ (${f(input.originalSpeed)} + ${f(input.changedSpeed)}) × 100`,
          "It incorrectly splits the route in the ratio of the two speeds.",
        ),
        wrong(
          "SPLIT_DISTANCE_IN_SPEED_RATIO",
          inverseSpeedRatioShare,
          `${f(input.originalSpeed)} ÷ (${f(input.originalSpeed)} + ${f(input.changedSpeed)}) × 100`,
          "It incorrectly uses the opposite share from a speed-ratio split of the route.",
        ),
      ]);
    }

    default:
      return deriveSaturatedCp003WrongWorkings(input, solution);
  }
}