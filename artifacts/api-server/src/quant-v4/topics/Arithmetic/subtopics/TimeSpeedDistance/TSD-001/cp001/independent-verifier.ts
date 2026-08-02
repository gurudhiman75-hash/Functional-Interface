import {
  RATIONAL_ZERO,
  add,
  compare,
  equals,
  isPositive,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import type { DistanceUnit, PaceUnit, SpeedUnit, TimeUnit } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput, UniformMotionClassification } from "./canonical-solver";

const DISTANCE_TO_METRES: Record<DistanceUnit, Rational> = {
  MM: rational(1, 1000),
  CM: rational(1, 100),
  M: rational(1),
  KM: rational(1000),
};

const TIME_TO_SECONDS: Record<TimeUnit, Rational> = {
  SECOND: rational(1),
  MINUTE: rational(60),
  HOUR: rational(3600),
  DAY: rational(86400),
};

const SPEED_TO_MPS: Record<SpeedUnit, Rational> = {
  MPS: rational(1),
  KMPH: rational(5, 18),
  M_PER_MINUTE: rational(1, 60),
  KM_PER_MINUTE: rational(50, 3),
};

function paceToSecondsPerKilometre(value: Rational, unit: PaceUnit): Rational {
  return unit === "SECOND_PER_KM" ? value : multiply(value, rational(60));
}

function scalarValue(solution: TsdCp001Solution): Rational | null {
  return "value" in solution && typeof solution.value !== "boolean" ? solution.value : null;
}

function classifyIndependently(input: {
  readonly distanceMetres?: Rational;
  readonly speedMps?: Rational;
  readonly durationSeconds?: Rational;
}): UniformMotionClassification {
  const values = [input.distanceMetres, input.speedMps, input.durationSeconds].filter(
    (value): value is Rational => value !== undefined,
  );
  if (values.some((value) => !isPositive(value))) return "IMPOSSIBLE";
  if (values.length < 2) return "INDETERMINATE";
  if (values.length === 2) return "UNIQUE";
  return equals(input.distanceMetres!, multiply(input.speedMps!, input.durationSeconds!))
    ? "CONSISTENT"
    : "IMPOSSIBLE";
}

export interface TsdCp001Verification {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

export function verifyCp001Solution(input: TsdCp001SolveInput, solution: TsdCp001Solution): TsdCp001Verification {
  const errors: string[] = [];
  if (input.solveMode !== solution.solveMode) errors.push("Solve-mode mismatch");

  const scalar = scalarValue(solution);
  const requireScalar = (): Rational => {
    if (!scalar) {
      errors.push("Expected scalar answer");
      return RATIONAL_ZERO;
    }
    return scalar;
  };

  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      if (!equals(requireScalar(), multiply(input.speedMps, input.durationSeconds))) errors.push("Distance identity failed");
      break;

    case "speedFromDistanceAndTime":
      if (!equals(multiply(requireScalar(), input.durationSeconds), input.distanceMetres)) errors.push("Speed identity failed");
      break;

    case "timeFromDistanceAndSpeed":
      if (!equals(multiply(input.speedMps, requireScalar()), input.distanceMetres)) errors.push("Time identity failed");
      break;

    case "convertSpeedUnit":
      if (!equals(multiply(input.value, SPEED_TO_MPS[input.from]), multiply(requireScalar(), SPEED_TO_MPS[input.to]))) {
        errors.push("Speed-dimension conversion failed");
      }
      break;

    case "convertDistanceUnit":
      if (!equals(multiply(input.value, DISTANCE_TO_METRES[input.from]), multiply(requireScalar(), DISTANCE_TO_METRES[input.to]))) {
        errors.push("Distance-dimension conversion failed");
      }
      break;

    case "convertTimeUnit":
      if (!equals(multiply(input.value, TIME_TO_SECONDS[input.from]), multiply(requireScalar(), TIME_TO_SECONDS[input.to]))) {
        errors.push("Time-dimension conversion failed");
      }
      break;

    case "speedFromMixedUnits": {
      const metres = multiply(input.distance, DISTANCE_TO_METRES[input.distanceUnit]);
      const seconds = multiply(input.duration, TIME_TO_SECONDS[input.timeUnit]);
      const metresPerSecond = multiply(requireScalar(), SPEED_TO_MPS[input.outputUnit]);
      if (!equals(metres, multiply(metresPerSecond, seconds))) errors.push("Mixed-unit motion identity failed");
      break;
    }

    case "arrivalClockTime":
      if (solution.answerKind !== "CLOCK_TIME") {
        errors.push("Expected clock-time answer");
      } else {
        const absoluteAnswer = add(solution.minuteOfDay, multiply(rational(solution.dayOffset), rational(1440)));
        if (!equals(absoluteAnswer, add(input.departureMinuteOfDay, input.durationMinutes))) errors.push("Arrival clock reconstruction failed");
      }
      break;

    case "departureClockTime":
      if (solution.answerKind !== "CLOCK_TIME") {
        errors.push("Expected clock-time answer");
      } else {
        const absoluteDeparture = add(solution.minuteOfDay, multiply(rational(solution.dayOffset), rational(1440)));
        const absoluteArrival = add(input.arrivalMinuteOfDay, multiply(rational(input.arrivalDayOffset), rational(1440)));
        if (!equals(add(absoluteDeparture, input.durationMinutes), absoluteArrival)) errors.push("Departure clock reconstruction failed");
      }
      break;

    case "elapsedClockTime": {
      const absoluteArrival = add(input.arrivalMinuteOfDay, multiply(rational(input.arrivalDayOffset), rational(1440)));
      if (!equals(add(input.departureMinuteOfDay, requireScalar()), absoluteArrival)) errors.push("Elapsed clock reconstruction failed");
      break;
    }

    case "compareDistancesAtEqualTime":
      if (!equals(multiply(requireScalar(), input.secondSpeed), input.firstSpeed)) errors.push("Equal-time distance comparison failed");
      break;

    case "compareTimesAtEqualDistance":
      if (!equals(multiply(requireScalar(), input.firstSpeed), input.secondSpeed)) errors.push("Equal-distance time comparison failed");
      break;

    case "compareSpeedsAtEqualTime":
      if (!equals(multiply(requireScalar(), input.secondDistance), input.firstDistance)) errors.push("Equal-time speed comparison failed");
      break;

    case "distanceRatioFromSpeedAndTimeRatios":
      if (!equals(requireScalar(), multiply(input.speedRatio, input.timeRatio))) errors.push("Distance-ratio relation failed");
      break;

    case "speedRatioFromDistanceAndTimeRatios":
      if (!equals(multiply(requireScalar(), input.timeRatio), input.distanceRatio)) errors.push("Speed-ratio relation failed");
      break;

    case "timeRatioFromDistanceAndSpeedRatios":
      if (!equals(multiply(requireScalar(), input.speedRatio), input.distanceRatio)) errors.push("Time-ratio relation failed");
      break;

    case "distanceByProportion": {
      const left = multiply(requireScalar(), multiply(input.knownSpeed, input.knownTime));
      const right = multiply(input.knownDistance, multiply(input.targetSpeed, input.targetTime));
      if (!equals(left, right)) errors.push("Distance proportion cross-product failed");
      break;
    }

    case "timeByProportion": {
      const left = multiply(requireScalar(), multiply(input.knownDistance, input.targetSpeed));
      const right = multiply(input.knownTime, multiply(input.targetDistance, input.knownSpeed));
      if (!equals(left, right)) errors.push("Time proportion cross-product failed");
      break;
    }

    case "speedByProportion": {
      const left = multiply(requireScalar(), multiply(input.knownDistance, input.targetTime));
      const right = multiply(input.knownSpeed, multiply(input.targetDistance, input.knownTime));
      if (!equals(left, right)) errors.push("Speed proportion cross-product failed");
      break;
    }

    case "speedFromPace": {
      const speedMps = multiply(requireScalar(), SPEED_TO_MPS[input.outputUnit]);
      const paceSeconds = paceToSecondsPerKilometre(input.pace, input.paceUnit);
      if (!equals(multiply(speedMps, paceSeconds), rational(1000))) errors.push("Speed-pace reciprocal failed");
      break;
    }

    case "paceFromSpeed": {
      const speedMps = multiply(input.speed, SPEED_TO_MPS[input.speedUnit]);
      const paceSeconds = paceToSecondsPerKilometre(requireScalar(), input.outputUnit);
      if (!equals(multiply(speedMps, paceSeconds), rational(1000))) errors.push("Pace-speed reciprocal failed");
      break;
    }

    case "distanceFromPaceAndTime": {
      const metres = multiply(requireScalar(), DISTANCE_TO_METRES[input.outputUnit]);
      const durationSeconds = multiply(input.duration, TIME_TO_SECONDS[input.timeUnit]);
      const paceSeconds = paceToSecondsPerKilometre(input.pace, input.paceUnit);
      if (!equals(multiply(metres, paceSeconds), multiply(durationSeconds, rational(1000)))) {
        errors.push("Pace-led distance relation failed");
      }
      break;
    }

    case "requiredUniformSpeedForDeadline": {
      const absoluteDeadline = add(input.deadlineMinuteOfDay, multiply(rational(input.deadlineDayOffset), rational(1440)));
      const durationMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      const durationSeconds = multiply(durationMinutes, rational(60));
      const speedMps = multiply(requireScalar(), SPEED_TO_MPS[input.outputUnit]);
      const distanceMetres = multiply(input.distance, DISTANCE_TO_METRES[input.distanceUnit]);
      if (!equals(multiply(speedMps, durationSeconds), distanceMetres)) errors.push("Deadline motion identity failed");
      break;
    }

    case "classifyUniformMotionState":
      if (solution.answerKind !== "CLASSIFICATION") {
        errors.push("Expected classification answer");
      } else if (solution.classification !== classifyIndependently(input)) {
        errors.push("State classification failed");
      }
      break;

    case "verifyUniformMotionClaim": {
      if (solution.answerKind !== "BOOLEAN") {
        errors.push("Expected boolean answer");
      } else {
        const expected =
          compare(input.distanceMetres, RATIONAL_ZERO) > 0
          && compare(input.speedMps, RATIONAL_ZERO) > 0
          && compare(input.durationSeconds, RATIONAL_ZERO) > 0
          && equals(input.distanceMetres, multiply(input.speedMps, input.durationSeconds));
        if (solution.value !== expected) errors.push("Claim verification failed");
      }
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}
