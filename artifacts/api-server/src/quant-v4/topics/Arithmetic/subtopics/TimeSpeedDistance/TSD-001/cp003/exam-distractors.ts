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

function choose(
  answer: Rational,
  methods: readonly TsdCp003WrongWorking[],
  predicate: (value: Rational) => boolean = () => true,
): readonly TsdCp003WrongWorking[] {
  const selected: TsdCp003WrongWorking[] = [];
  const seen: Rational[] = [answer];
  for (const method of methods) {
    if (compare(method.value, RATIONAL_ZERO) <= 0) continue;
    if (!predicate(method.value)) continue;
    if (seen.some((value) => equals(value, method.value))) continue;
    selected.push(method);
    seen.push(method.value);
    if (selected.length === 3) return Object.freeze(selected);
  }
  throw new Error(`Exam-ready CP-003 distractor pool has fewer than three unique wrong methods for answer ${f(answer)}`);
}

function isWholeMinuteDuration(value: Rational): boolean {
  return multiply(value, rational(60)).denominator === 1n;
}

function chooseWholeMinuteDurations(answer: Rational, methods: readonly TsdCp003WrongWorking[]): readonly TsdCp003WrongWorking[] {
  return choose(answer, methods, isWholeMinuteDuration);
}

function chooseWithinRoute(
  answer: Rational,
  totalDistance: Rational,
  methods: readonly TsdCp003WrongWorking[],
): readonly TsdCp003WrongWorking[] {
  return choose(answer, methods, (value) => compare(value, totalDistance) < 0);
}

export function deriveExamReadyCp003WrongWorkings(
  input: TsdCp003SolveInput,
  solution: TsdCp003SolveCertificate,
): readonly TsdCp003WrongWorking[] {
  const answer = solution.answer;

  switch (input.solveMode) {
    case "timeGainLossFromSpeedChange": {
      const oldTime = divide(input.distance, input.originalSpeed);
      const newTime = divide(input.distance, input.changedSpeed);
      return choose(answer, [
        wrong(
          "USE_OLD_TRAVEL_TIME",
          oldTime,
          `${f(input.distance)} ÷ ${f(input.originalSpeed)}`,
          "It reports the original journey time instead of the change between the two journey times.",
        ),
        wrong(
          "USE_NEW_TRAVEL_TIME",
          newTime,
          `${f(input.distance)} ÷ ${f(input.changedSpeed)}`,
          "It reports the changed-speed journey time instead of the amount of time gained or lost.",
        ),
        wrong(
          "ADD_TRAVEL_TIMES",
          add(oldTime, newTime),
          `${f(oldTime)} + ${f(newTime)}`,
          "It adds the two journey times instead of taking their difference.",
        ),
        wrong(
          "AVERAGE_TRAVEL_TIMES_FOR_SHIFT",
          divide(add(oldTime, newTime), rational(2)),
          `(${f(oldTime)} + ${f(newTime)}) ÷ 2`,
          "It averages the two journey times instead of finding the time gained or lost.",
        ),
      ]);
    }

    case "speedFromFixedRouteTimeDifference": {
      if (input.representation === "KNOWN_OTHER_SPEED") {
        const knownTime = divide(input.distance, input.knownSpeed);
        const reversedTime = input.unknownRole === "SLOWER"
          ? subtract(knownTime, input.timeDifference)
          : add(knownTime, input.timeDifference);
        return choose(answer, [
          wrong(
            "COPY_KNOWN_SPEED",
            input.knownSpeed,
            `${f(input.knownSpeed)}`,
            "It simply repeats the given speed instead of solving for the other speed.",
          ),
          wrong(
            "USE_HALF_KNOWN_SPEED",
            divide(input.knownSpeed, rational(2)),
            `${f(input.knownSpeed)} ÷ 2`,
            "It assumes the unknown speed is half the known speed without using the stated time difference.",
          ),
          ...(compare(reversedTime, RATIONAL_ZERO) > 0 ? [wrong(
            "REVERSE_TIME_GAP_DIRECTION",
            divide(input.distance, reversedTime),
            `${f(input.distance)} ÷ ${f(reversedTime)}`,
            "It applies the time difference in the wrong direction when reconstructing the other journey time.",
          )] : []),
          wrong(
            "TREAT_TIME_GAP_AS_TOTAL_TIME",
            divide(input.distance, input.timeDifference),
            `${f(input.distance)} ÷ ${f(input.timeDifference)}`,
            "It treats the difference between the two journey times as if it were a complete journey time.",
          ),
        ]);
      }

      const targetRatio = input.target === "SLOWER" ? input.slowerRatio : input.fasterRatio;
      const otherRatio = input.target === "SLOWER" ? input.fasterRatio : input.slowerRatio;
      const ratioUnit = divide(answer, targetRatio);
      const otherSpeed = multiply(ratioUnit, otherRatio);
      const slowerSpeed = multiply(ratioUnit, input.slowerRatio);
      const fasterSpeed = multiply(ratioUnit, input.fasterRatio);
      const meanSpeed = divide(add(slowerSpeed, fasterSpeed), rational(2));
      const neighbouringRatio = input.target === "SLOWER"
        ? subtract(targetRatio, rational(1))
        : add(targetRatio, rational(1));
      return choose(answer, [
        wrong(
          "USE_OTHER_RATIO_SPEED",
          otherSpeed,
          `${f(ratioUnit)} × ${f(otherRatio)}`,
          "It solves the speed pair correctly but reports the other speed in the ratio.",
        ),
        wrong(
          "USE_RATIO_MEAN_SPEED",
          meanSpeed,
          `(${f(slowerSpeed)} + ${f(fasterSpeed)}) ÷ 2`,
          "It reports the arithmetic mean of the two ratio speeds instead of the requested speed.",
        ),
        ...(compare(neighbouringRatio, RATIONAL_ZERO) > 0 ? [wrong(
          "USE_ONE_EXTRA_RATIO_PART",
          multiply(ratioUnit, neighbouringRatio),
          `${f(ratioUnit)} × ${f(neighbouringRatio)}`,
          "It uses a neighbouring ratio part instead of the requested ratio part.",
        )] : []),
        wrong(
          "TREAT_TIME_GAP_AS_TOTAL_TIME",
          divide(input.distance, input.timeDifference),
          `${f(input.distance)} ÷ ${f(input.timeDifference)}`,
          "It treats the time difference as the complete travel time.",
        ),
      ]);
    }

    case "usualSpeedFromEarlyLatePair":
      return choose(answer, [
        wrong(
          "USE_SLOWER_SPEED_ONLY",
          input.slowerTrialSpeed,
          `${f(input.slowerTrialSpeed)}`,
          "It uses the late-arrival trial speed as the usual speed.",
        ),
        wrong(
          "USE_FASTER_SPEED_ONLY",
          input.fasterTrialSpeed,
          `${f(input.fasterTrialSpeed)}`,
          "It uses the early-arrival trial speed as the usual speed.",
        ),
        wrong(
          "USE_ARITHMETIC_MEAN_SPEED",
          divide(add(input.slowerTrialSpeed, input.fasterTrialSpeed), rational(2)),
          `(${f(input.slowerTrialSpeed)} + ${f(input.fasterTrialSpeed)}) ÷ 2`,
          "It averages the two trial speeds directly instead of reconstructing the scheduled travel time.",
        ),
        ...deriveSaturatedCp003WrongWorkings(input, solution),
      ]);

    case "requiredRecoverySpeedAfterLostTime":
      return choose(answer, [
        wrong(
          "TREAT_DISTANCE_AS_SPEED",
          input.remainingDistance,
          `${f(input.remainingDistance)}`,
          "It copies the remaining distance as a speed and ignores the available time.",
        ),
        wrong(
          "USE_DOUBLE_AVAILABLE_TIME",
          divide(input.remainingDistance, multiply(input.remainingAvailableTime, rational(2))),
          `${f(input.remainingDistance)} ÷ (2 × ${f(input.remainingAvailableTime)})`,
          "It accidentally doubles the available time, making the required speed too low.",
        ),
        wrong(
          "USE_HALF_AVAILABLE_TIME",
          divide(input.remainingDistance, divide(input.remainingAvailableTime, rational(2))),
          `${f(input.remainingDistance)} ÷ (${f(input.remainingAvailableTime)} ÷ 2)`,
          "It uses only half of the available time, making the required speed too high.",
        ),
        wrong(
          "ADD_INSTEAD_OF_DIVIDE",
          add(input.remainingDistance, input.remainingAvailableTime),
          `${f(input.remainingDistance)} + ${f(input.remainingAvailableTime)}`,
          "It adds distance and time instead of using speed = distance ÷ time.",
        ),
      ]);

    case "stoppageDurationFromRunningAndOverallSpeed": {
      const runningTime = divide(input.distance, input.runningSpeed);
      const overallTime = divide(input.distance, input.overallSpeed);
      const speedLoss = subtract(input.runningSpeed, input.overallSpeed);
      return chooseWholeMinuteDurations(answer, [
        wrong(
          "APPLY_SPEED_LOSS_TO_RUNNING_TIME",
          multiply(runningTime, divide(speedLoss, input.runningSpeed)),
          `${f(runningTime)} × (${f(speedLoss)} ÷ ${f(input.runningSpeed)})`,
          "It applies the speed-loss percentage to running time; stoppage must come from total time minus running time.",
        ),
        wrong(
          "APPLY_SPEED_LOSS_TO_OVERALL_TIME",
          multiply(overallTime, divide(speedLoss, input.overallSpeed)),
          `${f(overallTime)} × (${f(speedLoss)} ÷ ${f(input.overallSpeed)})`,
          "It applies the speed-loss percentage to overall time instead of subtracting the two journey times.",
        ),
        wrong(
          "USE_SPEED_LOSS_RATIO_AS_TIME",
          divide(speedLoss, input.runningSpeed),
          `${f(speedLoss)} ÷ ${f(input.runningSpeed)}`,
          "It treats a dimensionless speed-loss fraction as if it were a duration.",
        ),
        wrong(
          "USE_SPEED_LOSS_RATIO_AS_TIME",
          divide(speedLoss, input.overallSpeed),
          `${f(speedLoss)} ÷ ${f(input.overallSpeed)}`,
          "It turns the relative speed loss into a time without using the route distance.",
        ),
        wrong(
          "USE_RUNNING_TIME_AS_STOPPAGE",
          runningTime,
          `${f(input.distance)} ÷ ${f(input.runningSpeed)}`,
          "It reports the moving time instead of only the stoppage time.",
        ),
        wrong(
          "USE_TOTAL_TIME_AS_STOPPAGE",
          overallTime,
          `${f(input.distance)} ÷ ${f(input.overallSpeed)}`,
          "It reports the complete elapsed time instead of only the stoppage time.",
        ),
      ]);
    }

    case "overallSpeedIncludingStops": {
      const runningTime = divide(input.distance, input.runningSpeed);
      const totalElapsed = add(runningTime, input.totalStopTime);
      const lostDistance = multiply(input.runningSpeed, input.totalStopTime);
      const wrongDistance = subtract(input.distance, lostDistance);
      const stopShareOfRunningTime = divide(input.totalStopTime, runningTime);
      return choose(answer, [
        wrong(
          "IGNORE_STOPS",
          input.runningSpeed,
          `${f(input.runningSpeed)}`,
          "It uses the running speed as the overall speed and ignores the stoppage time.",
        ),
        ...(compare(wrongDistance, RATIONAL_ZERO) > 0 ? [wrong(
          "SUBTRACT_STOP_DISTANCE_BEFORE_AVERAGING",
          divide(wrongDistance, totalElapsed),
          `(${f(input.distance)} − ${f(input.runningSpeed)} × ${f(input.totalStopTime)}) ÷ ${f(totalElapsed)}`,
          "It invents a distance supposedly lost during the stop and subtracts it from the actual route before averaging.",
        )] : []),
        wrong(
          "APPLY_STOP_SHARE_AS_SPEED_REDUCTION",
          multiply(input.runningSpeed, subtract(rational(1), stopShareOfRunningTime)),
          `${f(input.runningSpeed)} × (1 − ${f(input.totalStopTime)} ÷ ${f(runningTime)})`,
          "It reduces running speed directly by the stoppage-time share instead of increasing total elapsed time.",
        ),
        ...deriveSaturatedCp003WrongWorkings(input, solution),
      ]);
    }

    case "runningSpeedFromOverallSpeedAndStops": {
      const overallTime = divide(input.distance, input.overallSpeed);
      const stopShare = divide(input.totalStopTime, overallTime);
      return choose(answer, [
        wrong(
          "USE_OVERALL_SPEED_AS_RUNNING_SPEED",
          input.overallSpeed,
          `${f(input.overallSpeed)}`,
          "It treats overall speed as running speed even though the overall time includes stoppage.",
        ),
        wrong(
          "APPLY_STOP_SHARE_AS_SPEED_INCREASE",
          multiply(input.overallSpeed, add(rational(1), stopShare)),
          `${f(input.overallSpeed)} × (1 + ${f(input.totalStopTime)} ÷ ${f(overallTime)})`,
          "It adds the stoppage-time share directly to speed instead of removing stoppage from elapsed time first.",
        ),
        wrong(
          "DOUBLE_STOP_SHARE_AS_SPEED_INCREASE",
          multiply(input.overallSpeed, add(rational(1), multiply(stopShare, rational(2)))),
          `${f(input.overallSpeed)} × (1 + 2 × ${f(input.totalStopTime)} ÷ ${f(overallTime)})`,
          "It applies the stoppage-time share twice as a direct speed increase.",
        ),
        ...deriveSaturatedCp003WrongWorkings(input, solution),
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
      const subtractOnlyOneTravel = subtract(input.totalElapsedTime, input.travelTimePerCycle);
      const one = rational(1);
      const oneFewerRest = subtract(input.restEvents, one);
      const oneExtraRest = add(input.restEvents, one);
      return chooseWholeMinuteDurations(answer, [
        wrong(
          "USE_TRAVEL_SECTION_TIME_AS_REST",
          input.travelTimePerCycle,
          `${f(input.travelTimePerCycle)}`,
          "It copies the duration of one travel section as the rest duration.",
        ),
        wrong(
          "USE_TOTAL_REST_AS_ONE_REST",
          totalRest,
          `${f(input.totalElapsedTime)} − ${f(totalTravel)}`,
          "It finds the combined rest time but forgets to divide it among the individual rests.",
        ),
        wrong(
          "SUBTRACT_ONLY_ONE_TRAVEL_SECTION",
          divide(subtractOnlyOneTravel, input.restEvents),
          `(${f(input.totalElapsedTime)} − ${f(input.travelTimePerCycle)}) ÷ ${f(input.restEvents)}`,
          "It subtracts only one travel section before sharing the remaining time among the rests.",
        ),
        wrong(
          "IGNORE_TRAVEL_TIME",
          divide(input.totalElapsedTime, input.restEvents),
          `${f(input.totalElapsedTime)} ÷ ${f(input.restEvents)}`,
          "It treats the entire elapsed time as rest time and never removes the travel component.",
        ),
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

    case "speedChangePointDistance": {
      const oneHour = rational(1);
      return chooseWithinRoute(answer, input.totalDistance, [
        wrong(
          "HALVE_ROUTE_BY_DEFAULT",
          divide(input.totalDistance, rational(2)),
          `${f(input.totalDistance)} ÷ 2`,
          "It assumes the speed changes halfway along the route without using the total-time condition.",
        ),
        wrong(
          "USE_FIRST_HOUR_DISTANCE",
          multiply(input.firstSpeed, oneHour),
          `${f(input.firstSpeed)} × 1`,
          "It assumes the speed change occurs after exactly one hour at the first speed.",
        ),
        wrong(
          "USE_SECOND_HOUR_DISTANCE",
          multiply(input.secondSpeed, oneHour),
          `${f(input.secondSpeed)} × 1`,
          "It uses one hour of the second speed as the change-point distance.",
        ),
        wrong(
          "QUARTER_ROUTE_BY_DEFAULT",
          divide(input.totalDistance, rational(4)),
          `${f(input.totalDistance)} ÷ 4`,
          "It assumes the speed changes after one-quarter of the route without using the time equation.",
        ),
        wrong(
          "HALVE_ROUTE_BY_DEFAULT",
          multiply(input.totalDistance, rational(3, 4)),
          `3 × ${f(input.totalDistance)} ÷ 4`,
          "It assumes the speed changes after three-quarters of the route without using the time equation.",
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
          "ASSUME_EQUAL_ROUTE_SPLIT",
          rational(50),
          `100 ÷ 2`,
          "It assumes the two speeds are used over equal halves of the route.",
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