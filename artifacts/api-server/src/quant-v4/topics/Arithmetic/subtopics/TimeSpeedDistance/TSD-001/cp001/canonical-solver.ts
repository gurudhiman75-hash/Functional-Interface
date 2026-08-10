import {
  RATIONAL_ZERO,
  add,
  compare,
  divide,
  equals,
  floorRational,
  isPositive,
  modulo,
  multiply,
  rational,
  subtract,
  type Rational,
} from "../foundation/rational";
import {
  convertDistance,
  convertSpeed,
  convertTime,
  distanceFromSpeedAndTime,
  paceFromSpeed,
  speedFromDistanceAndTime,
  speedFromPace,
  type DistanceUnit,
  type PaceUnit,
  type SpeedUnit,
  type TimeUnit,
} from "../foundation/units";
import type { TsdCp001DiscoverySolveMode } from "./discovery-registry";

export type UniformMotionClassification = "UNIQUE" | "CONSISTENT" | "INDETERMINATE" | "IMPOSSIBLE";

export type TsdCp001SolveInput =
  | { readonly solveMode: "distanceFromSpeedAndTime"; readonly speedMps: Rational; readonly durationSeconds: Rational }
  | { readonly solveMode: "speedFromDistanceAndTime"; readonly distanceMetres: Rational; readonly durationSeconds: Rational }
  | { readonly solveMode: "timeFromDistanceAndSpeed"; readonly distanceMetres: Rational; readonly speedMps: Rational }
  | { readonly solveMode: "convertSpeedUnit"; readonly value: Rational; readonly from: SpeedUnit; readonly to: SpeedUnit }
  | { readonly solveMode: "convertDistanceUnit"; readonly value: Rational; readonly from: DistanceUnit; readonly to: DistanceUnit }
  | { readonly solveMode: "convertTimeUnit"; readonly value: Rational; readonly from: TimeUnit; readonly to: TimeUnit }
  | {
      readonly solveMode: "speedFromMixedUnits";
      readonly distance: Rational;
      readonly distanceUnit: DistanceUnit;
      readonly duration: Rational;
      readonly timeUnit: TimeUnit;
      readonly outputUnit: SpeedUnit;
    }
  | { readonly solveMode: "arrivalClockTime"; readonly departureMinuteOfDay: Rational; readonly durationMinutes: Rational }
  | {
      readonly solveMode: "departureClockTime";
      readonly arrivalMinuteOfDay: Rational;
      readonly arrivalDayOffset: bigint;
      readonly durationMinutes: Rational;
    }
  | {
      readonly solveMode: "elapsedClockTime";
      readonly departureMinuteOfDay: Rational;
      readonly arrivalMinuteOfDay: Rational;
      readonly arrivalDayOffset: bigint;
    }
  | { readonly solveMode: "compareDistancesAtEqualTime"; readonly firstSpeed: Rational; readonly secondSpeed: Rational }
  | { readonly solveMode: "compareTimesAtEqualDistance"; readonly firstSpeed: Rational; readonly secondSpeed: Rational }
  | { readonly solveMode: "compareSpeedsAtEqualTime"; readonly firstDistance: Rational; readonly secondDistance: Rational }
  | {
      readonly solveMode: "distanceRatioFromSpeedAndTimeRatios";
      readonly speedRatio: Rational;
      readonly timeRatio: Rational;
    }
  | {
      readonly solveMode: "speedRatioFromDistanceAndTimeRatios";
      readonly distanceRatio: Rational;
      readonly timeRatio: Rational;
    }
  | {
      readonly solveMode: "timeRatioFromDistanceAndSpeedRatios";
      readonly distanceRatio: Rational;
      readonly speedRatio: Rational;
    }
  | {
      readonly solveMode: "distanceByProportion";
      readonly knownDistance: Rational;
      readonly knownSpeed: Rational;
      readonly knownTime: Rational;
      readonly targetSpeed: Rational;
      readonly targetTime: Rational;
    }
  | {
      readonly solveMode: "timeByProportion";
      readonly knownDistance: Rational;
      readonly knownSpeed: Rational;
      readonly knownTime: Rational;
      readonly targetDistance: Rational;
      readonly targetSpeed: Rational;
    }
  | {
      readonly solveMode: "speedByProportion";
      readonly knownDistance: Rational;
      readonly knownSpeed: Rational;
      readonly knownTime: Rational;
      readonly targetDistance: Rational;
      readonly targetTime: Rational;
    }
  | { readonly solveMode: "speedFromPace"; readonly pace: Rational; readonly paceUnit: PaceUnit; readonly outputUnit: SpeedUnit }
  | { readonly solveMode: "paceFromSpeed"; readonly speed: Rational; readonly speedUnit: SpeedUnit; readonly outputUnit: PaceUnit }
  | {
      readonly solveMode: "distanceFromPaceAndTime";
      readonly pace: Rational;
      readonly paceUnit: PaceUnit;
      readonly duration: Rational;
      readonly timeUnit: TimeUnit;
      readonly outputUnit: DistanceUnit;
    }
  | {
      readonly solveMode: "requiredUniformSpeedForDeadline";
      readonly distance: Rational;
      readonly distanceUnit: DistanceUnit;
      readonly departureMinuteOfDay: Rational;
      readonly deadlineMinuteOfDay: Rational;
      readonly deadlineDayOffset: bigint;
      readonly outputUnit: SpeedUnit;
    }
  | {
      readonly solveMode: "classifyUniformMotionState";
      readonly distanceMetres?: Rational;
      readonly speedMps?: Rational;
      readonly durationSeconds?: Rational;
    }
  | {
      readonly solveMode: "verifyUniformMotionClaim";
      readonly distanceMetres: Rational;
      readonly speedMps: Rational;
      readonly durationSeconds: Rational;
    };

export type TsdCp001Solution =
  | {
      readonly solveMode: TsdCp001DiscoverySolveMode;
      readonly answerKind: "DISTANCE" | "SPEED" | "TIME" | "RATIO" | "PACE";
      readonly value: Rational;
    }
  | {
      readonly solveMode: "arrivalClockTime" | "departureClockTime";
      readonly answerKind: "CLOCK_TIME";
      readonly minuteOfDay: Rational;
      readonly dayOffset: bigint;
    }
  | {
      readonly solveMode: "classifyUniformMotionState";
      readonly answerKind: "CLASSIFICATION";
      readonly classification: UniformMotionClassification;
    }
  | { readonly solveMode: "verifyUniformMotionClaim"; readonly answerKind: "BOOLEAN"; readonly value: boolean };

const MINUTES_PER_DAY = rational(1440);

function requirePositive(value: Rational, label: string): void {
  if (!isPositive(value)) throw new Error(`${label} must be positive`);
}

function requireMinuteOfDay(value: Rational, label: string): void {
  if (compare(value, RATIONAL_ZERO) < 0 || compare(value, MINUTES_PER_DAY) >= 0) {
    throw new Error(`${label} must be in [0, 1440)`);
  }
}

function clockSolution(
  solveMode: "arrivalClockTime" | "departureClockTime",
  absoluteMinutes: Rational,
): TsdCp001Solution {
  return {
    solveMode,
    answerKind: "CLOCK_TIME",
    minuteOfDay: modulo(absoluteMinutes, MINUTES_PER_DAY),
    dayOffset: floorRational(divide(absoluteMinutes, MINUTES_PER_DAY)),
  };
}

function scalar(
  solveMode: TsdCp001DiscoverySolveMode,
  answerKind: "DISTANCE" | "SPEED" | "TIME" | "RATIO" | "PACE",
  value: Rational,
): TsdCp001Solution {
  return { solveMode, answerKind, value };
}

export function classifyUniformMotionState(input: {
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

export function solveCp001(input: TsdCp001SolveInput): TsdCp001Solution {
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      requirePositive(input.speedMps, "Speed");
      requirePositive(input.durationSeconds, "Duration");
      return scalar(input.solveMode, "DISTANCE", multiply(input.speedMps, input.durationSeconds));

    case "speedFromDistanceAndTime":
      requirePositive(input.distanceMetres, "Distance");
      requirePositive(input.durationSeconds, "Duration");
      return scalar(input.solveMode, "SPEED", divide(input.distanceMetres, input.durationSeconds));

    case "timeFromDistanceAndSpeed":
      requirePositive(input.distanceMetres, "Distance");
      requirePositive(input.speedMps, "Speed");
      return scalar(input.solveMode, "TIME", divide(input.distanceMetres, input.speedMps));

    case "convertSpeedUnit":
      requirePositive(input.value, "Speed");
      return scalar(input.solveMode, "SPEED", convertSpeed(input.value, input.from, input.to));

    case "convertDistanceUnit":
      requirePositive(input.value, "Distance");
      return scalar(input.solveMode, "DISTANCE", convertDistance(input.value, input.from, input.to));

    case "convertTimeUnit":
      requirePositive(input.value, "Duration");
      return scalar(input.solveMode, "TIME", convertTime(input.value, input.from, input.to));

    case "speedFromMixedUnits":
      requirePositive(input.distance, "Distance");
      requirePositive(input.duration, "Duration");
      return scalar(
        input.solveMode,
        "SPEED",
        speedFromDistanceAndTime(input.distance, input.distanceUnit, input.duration, input.timeUnit, input.outputUnit),
      );

    case "arrivalClockTime": {
      requireMinuteOfDay(input.departureMinuteOfDay, "Departure time");
      requirePositive(input.durationMinutes, "Duration");
      return clockSolution(input.solveMode, add(input.departureMinuteOfDay, input.durationMinutes));
    }

    case "departureClockTime": {
      requireMinuteOfDay(input.arrivalMinuteOfDay, "Arrival time");
      requirePositive(input.durationMinutes, "Duration");
      const absoluteArrival = add(
        input.arrivalMinuteOfDay,
        multiply(rational(input.arrivalDayOffset), MINUTES_PER_DAY),
      );
      return clockSolution(input.solveMode, subtract(absoluteArrival, input.durationMinutes));
    }

    case "elapsedClockTime": {
      requireMinuteOfDay(input.departureMinuteOfDay, "Departure time");
      requireMinuteOfDay(input.arrivalMinuteOfDay, "Arrival time");
      const absoluteArrival = add(
        input.arrivalMinuteOfDay,
        multiply(rational(input.arrivalDayOffset), MINUTES_PER_DAY),
      );
      const elapsed = subtract(absoluteArrival, input.departureMinuteOfDay);
      requirePositive(elapsed, "Elapsed time");
      return scalar(input.solveMode, "TIME", elapsed);
    }

    case "compareDistancesAtEqualTime":
      requirePositive(input.firstSpeed, "First speed");
      requirePositive(input.secondSpeed, "Second speed");
      return scalar(input.solveMode, "RATIO", divide(input.firstSpeed, input.secondSpeed));

    case "compareTimesAtEqualDistance":
      requirePositive(input.firstSpeed, "First speed");
      requirePositive(input.secondSpeed, "Second speed");
      return scalar(input.solveMode, "RATIO", divide(input.secondSpeed, input.firstSpeed));

    case "compareSpeedsAtEqualTime":
      requirePositive(input.firstDistance, "First distance");
      requirePositive(input.secondDistance, "Second distance");
      return scalar(input.solveMode, "RATIO", divide(input.firstDistance, input.secondDistance));

    case "distanceRatioFromSpeedAndTimeRatios":
      requirePositive(input.speedRatio, "Speed ratio");
      requirePositive(input.timeRatio, "Time ratio");
      return scalar(input.solveMode, "RATIO", multiply(input.speedRatio, input.timeRatio));

    case "speedRatioFromDistanceAndTimeRatios":
      requirePositive(input.distanceRatio, "Distance ratio");
      requirePositive(input.timeRatio, "Time ratio");
      return scalar(input.solveMode, "RATIO", divide(input.distanceRatio, input.timeRatio));

    case "timeRatioFromDistanceAndSpeedRatios":
      requirePositive(input.distanceRatio, "Distance ratio");
      requirePositive(input.speedRatio, "Speed ratio");
      return scalar(input.solveMode, "RATIO", divide(input.distanceRatio, input.speedRatio));

    case "distanceByProportion":
      [input.knownDistance, input.knownSpeed, input.knownTime, input.targetSpeed, input.targetTime].forEach(
        (value) => requirePositive(value, "Proportion input"),
      );
      return scalar(
        input.solveMode,
        "DISTANCE",
        multiply(
          input.knownDistance,
          multiply(divide(input.targetSpeed, input.knownSpeed), divide(input.targetTime, input.knownTime)),
        ),
      );

    case "timeByProportion":
      [input.knownDistance, input.knownSpeed, input.knownTime, input.targetDistance, input.targetSpeed].forEach(
        (value) => requirePositive(value, "Proportion input"),
      );
      return scalar(
        input.solveMode,
        "TIME",
        multiply(
          input.knownTime,
          multiply(divide(input.targetDistance, input.knownDistance), divide(input.knownSpeed, input.targetSpeed)),
        ),
      );

    case "speedByProportion":
      [input.knownDistance, input.knownSpeed, input.knownTime, input.targetDistance, input.targetTime].forEach(
        (value) => requirePositive(value, "Proportion input"),
      );
      return scalar(
        input.solveMode,
        "SPEED",
        multiply(
          input.knownSpeed,
          multiply(divide(input.targetDistance, input.knownDistance), divide(input.knownTime, input.targetTime)),
        ),
      );

    case "speedFromPace":
      requirePositive(input.pace, "Pace");
      return scalar(input.solveMode, "SPEED", speedFromPace(input.pace, input.paceUnit, input.outputUnit));

    case "paceFromSpeed":
      requirePositive(input.speed, "Speed");
      return scalar(input.solveMode, "PACE", paceFromSpeed(input.speed, input.speedUnit, input.outputUnit));

    case "distanceFromPaceAndTime": {
      requirePositive(input.pace, "Pace");
      requirePositive(input.duration, "Duration");
      const speedMps = speedFromPace(input.pace, input.paceUnit, "MPS");
      return scalar(
        input.solveMode,
        "DISTANCE",
        distanceFromSpeedAndTime(speedMps, "MPS", input.duration, input.timeUnit, input.outputUnit),
      );
    }

    case "requiredUniformSpeedForDeadline": {
      requirePositive(input.distance, "Distance");
      requireMinuteOfDay(input.departureMinuteOfDay, "Departure time");
      requireMinuteOfDay(input.deadlineMinuteOfDay, "Deadline time");
      const absoluteDeadline = add(
        input.deadlineMinuteOfDay,
        multiply(rational(input.deadlineDayOffset), MINUTES_PER_DAY),
      );
      const durationMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      requirePositive(durationMinutes, "Available duration");
      return scalar(
        input.solveMode,
        "SPEED",
        speedFromDistanceAndTime(input.distance, input.distanceUnit, durationMinutes, "MINUTE", input.outputUnit),
      );
    }

    case "classifyUniformMotionState":
      return {
        solveMode: input.solveMode,
        answerKind: "CLASSIFICATION",
        classification: classifyUniformMotionState(input),
      };

    case "verifyUniformMotionClaim":
      return {
        solveMode: input.solveMode,
        answerKind: "BOOLEAN",
        value:
          isPositive(input.distanceMetres)
          && isPositive(input.speedMps)
          && isPositive(input.durationSeconds)
          && equals(input.distanceMetres, multiply(input.speedMps, input.durationSeconds)),
      };
  }
}
