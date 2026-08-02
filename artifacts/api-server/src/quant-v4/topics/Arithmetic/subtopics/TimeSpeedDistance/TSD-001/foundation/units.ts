import { divide, multiply, rational, type Rational } from "./rational";

export type DistanceUnit = "MM" | "CM" | "M" | "KM";
export type TimeUnit = "SECOND" | "MINUTE" | "HOUR" | "DAY";
export type SpeedUnit = "MPS" | "KMPH" | "M_PER_MINUTE" | "KM_PER_MINUTE";
export type PaceUnit = "SECOND_PER_KM" | "MINUTE_PER_KM";

const METRES_PER_DISTANCE_UNIT: Record<DistanceUnit, Rational> = {
  MM: rational(1, 1000),
  CM: rational(1, 100),
  M: rational(1),
  KM: rational(1000),
};

const SECONDS_PER_TIME_UNIT: Record<TimeUnit, Rational> = {
  SECOND: rational(1),
  MINUTE: rational(60),
  HOUR: rational(3600),
  DAY: rational(86400),
};

const METRES_PER_SECOND_PER_SPEED_UNIT: Record<SpeedUnit, Rational> = {
  MPS: rational(1),
  KMPH: rational(5, 18),
  M_PER_MINUTE: rational(1, 60),
  KM_PER_MINUTE: rational(50, 3),
};

export function convertDistance(value: Rational, from: DistanceUnit, to: DistanceUnit): Rational {
  return divide(multiply(value, METRES_PER_DISTANCE_UNIT[from]), METRES_PER_DISTANCE_UNIT[to]);
}

export function convertTime(value: Rational, from: TimeUnit, to: TimeUnit): Rational {
  return divide(multiply(value, SECONDS_PER_TIME_UNIT[from]), SECONDS_PER_TIME_UNIT[to]);
}

export function convertSpeed(value: Rational, from: SpeedUnit, to: SpeedUnit): Rational {
  return divide(multiply(value, METRES_PER_SECOND_PER_SPEED_UNIT[from]), METRES_PER_SECOND_PER_SPEED_UNIT[to]);
}

export function speedFromDistanceAndTime(
  distance: Rational,
  distanceUnit: DistanceUnit,
  duration: Rational,
  timeUnit: TimeUnit,
  outputUnit: SpeedUnit,
): Rational {
  const metres = convertDistance(distance, distanceUnit, "M");
  const seconds = convertTime(duration, timeUnit, "SECOND");
  return convertSpeed(divide(metres, seconds), "MPS", outputUnit);
}

export function distanceFromSpeedAndTime(
  speed: Rational,
  speedUnit: SpeedUnit,
  duration: Rational,
  timeUnit: TimeUnit,
  outputUnit: DistanceUnit,
): Rational {
  const metresPerSecond = convertSpeed(speed, speedUnit, "MPS");
  const seconds = convertTime(duration, timeUnit, "SECOND");
  return convertDistance(multiply(metresPerSecond, seconds), "M", outputUnit);
}

export function timeFromDistanceAndSpeed(
  distance: Rational,
  distanceUnit: DistanceUnit,
  speed: Rational,
  speedUnit: SpeedUnit,
  outputUnit: TimeUnit,
): Rational {
  const metres = convertDistance(distance, distanceUnit, "M");
  const metresPerSecond = convertSpeed(speed, speedUnit, "MPS");
  return convertTime(divide(metres, metresPerSecond), "SECOND", outputUnit);
}

export function speedFromPace(pace: Rational, paceUnit: PaceUnit, outputUnit: SpeedUnit): Rational {
  const secondsPerKilometre = paceUnit === "SECOND_PER_KM" ? pace : multiply(pace, rational(60));
  const metresPerSecond = divide(rational(1000), secondsPerKilometre);
  return convertSpeed(metresPerSecond, "MPS", outputUnit);
}

export function paceFromSpeed(speed: Rational, speedUnit: SpeedUnit, outputUnit: PaceUnit): Rational {
  const metresPerSecond = convertSpeed(speed, speedUnit, "MPS");
  const secondsPerKilometre = divide(rational(1000), metresPerSecond);
  return outputUnit === "SECOND_PER_KM" ? secondsPerKilometre : divide(secondsPerKilometre, rational(60));
}

export function metresPerDistanceUnit(unit: DistanceUnit): Rational {
  return METRES_PER_DISTANCE_UNIT[unit];
}

export function secondsPerTimeUnit(unit: TimeUnit): Rational {
  return SECONDS_PER_TIME_UNIT[unit];
}
