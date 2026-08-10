import { RATIONAL_ONE, add, divide, equals, multiply, rational, subtract, toMathJax, toMixedString, type Rational } from "../foundation/rational";
import type { DistanceUnit, PaceUnit, SpeedUnit, TimeUnit } from "../foundation/units";
import type { TsdCp001Solution, TsdCp001SolveInput } from "./canonical-solver";
import type { TsdCp001DiscoveryAuthority } from "./discovery-registry";
import type { DisplayContract, TsdCp001MisconceptionId } from "./runtime-types";

export const DISTANCE_LABEL: Record<DistanceUnit, string> = {
  MM: "mm",
  CM: "cm",
  M: "m",
  KM: "km",
};
export const TIME_LABEL: Record<TimeUnit, string> = {
  SECOND: "seconds",
  MINUTE: "minutes",
  HOUR: "hours",
  DAY: "days",
};
export const SPEED_LABEL: Record<SpeedUnit, string> = {
  MPS: "m/s",
  KMPH: "km/h",
  M_PER_MINUTE: "m/min",
  KM_PER_MINUTE: "km/min",
};
export const PACE_LABEL: Record<PaceUnit, string> = {
  SECOND_PER_KM: "seconds/km",
  MINUTE_PER_KM: "minutes/km",
};

export const CONTEXTS = [
  { actor: "a car", route: "a road" },
  { actor: "a cyclist", route: "a road" },
  { actor: "a bus", route: "a route" },
  { actor: "a runner", route: "a track" },
  { actor: "a van", route: "a highway" },
  { actor: "a rider", route: "a road" },
] as const;

export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class SeededRng {
  private state: number;

  constructor(seed: string) {
    this.state = hashSeed(seed) || 0x9e3779b9;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state;
  }

  int(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length];
  }
}

export function authorityOrdinal(authority: TsdCp001DiscoveryAuthority): number {
  return Number(authority.provisionalId.slice(-3));
}

export function trailingSeedOrdinal(seed: string): number {
  const match = seed.match(/(\d+)$/);
  return match ? Number(match[1]) : hashSeed(seed);
}

export function r(value: number, denominator = 1): Rational {
  return rational(value, denominator);
}

export function ratioText(value: Rational): string {
  return `${value.numerator}:${value.denominator}`;
}

export function rationalMath(value: Rational): string {
  return `\\(${toMathJax(value)}\\)`;
}

export function capitalizeSentence(value: string): string {
  return value.replace(/^./, (letter) => letter.toUpperCase());
}

function finiteDecimalDigits(denominator: bigint): number | null {
  let value = denominator;
  let twos = 0;
  let fives = 0;
  while (value % 2n === 0n) {
    value /= 2n;
    twos += 1;
  }
  while (value % 5n === 0n) {
    value /= 5n;
    fives += 1;
  }
  return value === 1n ? Math.max(twos, fives) : null;
}

export function formatExamNumber(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  const digits = finiteDecimalDigits(value.denominator);
  if (digits === null || digits > 3) return `${value.numerator}/${value.denominator}`;
  const scale = 10n ** BigInt(digits);
  const scaled = (value.numerator * scale) / value.denominator;
  const negative = scaled < 0n;
  const absolute = negative ? -scaled : scaled;
  const whole = absolute / scale;
  const fraction = String(absolute % scale).padStart(digits, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

export function unitForValue(value: Rational, unit: string): string {
  if (!equals(value, RATIONAL_ONE)) return unit;
  return { seconds: "second", minutes: "minute", hours: "hour", days: "day" }[unit] ?? unit;
}

export function formatClock(minuteOfDay: Rational, dayOffset: bigint): string {
  if (minuteOfDay.denominator !== 1n) throw new Error("Clock answer must use whole minutes");
  const minute = Number(minuteOfDay.numerator);
  const hour24 = Math.floor(minute / 60);
  const minutePart = minute % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  const dayText = dayOffset === 0n ? "" : dayOffset === 1n ? " next day" : ` day ${dayOffset >= 0n ? "+" : ""}${dayOffset}`;
  return `${hour12}:${String(minutePart).padStart(2, "0")} ${suffix}${dayText}`;
}

function durationText(minutes: Rational): string {
  if (minutes.denominator !== 1n) return `${formatExamNumber(minutes)} minutes`;
  const total = Number(minutes.numerator);
  const hours = Math.floor(total / 60);
  const remaining = total % 60;
  if (hours === 0) return `${remaining} minutes`;
  if (remaining === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return `${hours} ${hours === 1 ? "hour" : "hours"} ${remaining} minutes`;
}

export function formatAnswer(solution: TsdCp001Solution, display: DisplayContract): string {
  if (solution.answerKind === "CLOCK_TIME") return formatClock(solution.minuteOfDay, solution.dayOffset);
  if (solution.answerKind === "CLASSIFICATION") {
    return {
      UNIQUE: "The missing value can be found",
      CONSISTENT: "The three values are correct",
      INDETERMINATE: "The information is not sufficient",
      IMPOSSIBLE: "The given values are not possible together",
    }[solution.classification];
  }
  if (solution.answerKind === "BOOLEAN") return solution.value ? "Yes" : "No";
  if (solution.answerKind === "RATIO") return ratioText(solution.value);
  return `${formatExamNumber(solution.value)}${display.unit ? ` ${unitForValue(solution.value, display.unit)}` : ""}`;
}

export function contextFor(rng: SeededRng): (typeof CONTEXTS)[number] {
  return rng.pick(CONTEXTS);
}

export function conceptFor(authority: TsdCp001DiscoveryAuthority): string {
  return {
    UNIFORM_MOTION: "Use the relation between distance, speed and time.",
    UNIT_CONVERSION: "Convert the given value into the required unit.",
    CLOCK_ARITHMETIC: "Add or subtract the journey time from the clock time.",
    MOTION_COMPARISON: "Cancel the quantity that is the same for both travellers.",
    MOTION_RATIO: "Use distance = speed × time in ratio form.",
    MOTION_PROPORTION: "Apply only the changes in speed, time and distance.",
    PACE_RECIPROCAL: "Pace is the time taken to cover 1 km.",
    STATE_VALIDITY: "Check the values using distance = speed × time.",
  }[authority.governingRule];
}

export function workingLines(input: TsdCp001SolveInput, solution: TsdCp001Solution, display: DisplayContract): readonly string[] {
  const answer = formatAnswer(solution, display);
  const value = (candidate: Rational): string => formatExamNumber(candidate);
  const ratio = (candidate: Rational): string => ratioText(candidate);
  switch (input.solveMode) {
    case "distanceFromSpeedAndTime":
      return ["Distance = Speed × Time", `= ${value(input.speedMps)} × ${value(input.durationSeconds)}`, `= ${answer}`];
    case "speedFromDistanceAndTime":
      return ["Speed = Distance ÷ Time", `= ${value(input.distanceMetres)} ÷ ${value(input.durationSeconds)}`, `= ${answer}`];
    case "timeFromDistanceAndSpeed":
      return ["Time = Distance ÷ Speed", `= ${value(input.distanceMetres)} ÷ ${value(input.speedMps)}`, `= ${answer}`];
    case "convertSpeedUnit":
    case "convertDistanceUnit":
    case "convertTimeUnit": {
      const factor = divide(solution.answerKind === "CLOCK_TIME" || solution.answerKind === "CLASSIFICATION" || solution.answerKind === "BOOLEAN" ? RATIONAL_ONE : solution.value, input.value);
      return [display.formula, `= \\(${value(input.value)}\\times${toMathJax(factor)}\\)`, `= ${answer}`];
    }
    case "speedFromMixedUnits": {
      const target = {
        MPS: { distance: "M", time: "SECOND" },
        KMPH: { distance: "KM", time: "HOUR" },
        M_PER_MINUTE: { distance: "M", time: "MINUTE" },
        KM_PER_MINUTE: { distance: "KM", time: "MINUTE" },
      }[input.outputUnit] as { distance: DistanceUnit; time: TimeUnit };
      const convertedDistance = convertDistanceForWorking(input.distance, input.distanceUnit, target.distance);
      const convertedTime = convertTimeForWorking(input.duration, input.timeUnit, target.time);
      return [
        `${value(input.duration)} ${TIME_LABEL[input.timeUnit]} = ${value(convertedTime)} ${unitForValue(convertedTime, TIME_LABEL[target.time])}`,
        `Speed = ${value(convertedDistance)} ÷ ${value(convertedTime)}`,
        `= ${answer}`,
      ];
    }
    case "arrivalClockTime":
      return [`Journey time = ${durationText(input.durationMinutes)}`, `${formatClock(input.departureMinuteOfDay, 0n)} + ${durationText(input.durationMinutes)}`, `= ${answer}`];
    case "departureClockTime":
      return [`Journey time = ${durationText(input.durationMinutes)}`, `${formatClock(input.arrivalMinuteOfDay, input.arrivalDayOffset)} − ${durationText(input.durationMinutes)}`, `= ${answer}`];
    case "elapsedClockTime": {
      const absoluteArrival = add(input.arrivalMinuteOfDay, multiply(rational(input.arrivalDayOffset), rational(1440)));
      const elapsed = subtract(absoluteArrival, input.departureMinuteOfDay);
      return ["Total time = arrival time − starting time", `= ${formatExamNumber(elapsed)} minutes`, `= ${durationText(elapsed)}`];
    }
    case "compareDistancesAtEqualTime":
      return ["For equal time, distance ratio = speed ratio", `= ${value(input.firstSpeed)} : ${value(input.secondSpeed)}`, `= ${answer}`];
    case "compareTimesAtEqualDistance":
      return ["For equal distance, time ratio is the inverse of speed ratio", `= ${value(input.secondSpeed)} : ${value(input.firstSpeed)}`, `= ${answer}`];
    case "compareSpeedsAtEqualTime":
      return ["For equal time, speed ratio = distance ratio", `= ${value(input.firstDistance)} : ${value(input.secondDistance)}`, `= ${answer}`];
    case "distanceRatioFromSpeedAndTimeRatios":
      return ["Distance ratio = Speed ratio × Time ratio", `= (${ratio(input.speedRatio)}) × (${ratio(input.timeRatio)})`, `= ${answer}`];
    case "speedRatioFromDistanceAndTimeRatios":
      return ["Speed ratio = Distance ratio ÷ Time ratio", `= (${ratio(input.distanceRatio)}) ÷ (${ratio(input.timeRatio)})`, `= ${answer}`];
    case "timeRatioFromDistanceAndSpeedRatios":
      return ["Time ratio = Distance ratio ÷ Speed ratio", `= (${ratio(input.distanceRatio)}) ÷ (${ratio(input.speedRatio)})`, `= ${answer}`];
    case "distanceByProportion":
      return [display.formula, `= ${value(input.knownDistance)} × (${value(input.targetSpeed)} ÷ ${value(input.knownSpeed)}) × (${value(input.targetTime)} ÷ ${value(input.knownTime)})`, `= ${answer}`];
    case "timeByProportion":
      return [display.formula, `= ${value(input.knownTime)} × (${value(input.targetDistance)} ÷ ${value(input.knownDistance)}) × (${value(input.knownSpeed)} ÷ ${value(input.targetSpeed)})`, `= ${answer}`];
    case "speedByProportion":
      return [display.formula, `= ${value(input.knownSpeed)} × (${value(input.targetDistance)} ÷ ${value(input.knownDistance)}) × (${value(input.knownTime)} ÷ ${value(input.targetTime)})`, `= ${answer}`];
    case "speedFromPace":
      return input.outputUnit === "KMPH"
        ? ["Speed in km/h = 60 ÷ minutes per km", `= 60 ÷ ${value(input.pace)}`, `= ${answer}`]
        : ["Convert the pace into seconds per km", `Speed = 1000 ÷ (60 × ${value(input.pace)})`, `= ${answer}`];
    case "paceFromSpeed":
      return ["Minutes per km = 60 ÷ speed in km/h", `= 60 ÷ ${value(input.speed)}`, `= ${answer}`];
    case "distanceFromPaceAndTime":
      return ["Distance = Total time ÷ Minutes per km", `= ${value(input.duration)} ÷ ${value(input.pace)}`, `= ${answer}`];
    case "requiredUniformSpeedForDeadline": {
      const absoluteDeadline = add(input.deadlineMinuteOfDay, multiply(rational(input.deadlineDayOffset), rational(1440)));
      const availableMinutes = subtract(absoluteDeadline, input.departureMinuteOfDay);
      const availableHours = divide(availableMinutes, rational(60));
      return [`Available time = ${durationText(availableMinutes)} = ${value(availableHours)} hours`, `Required speed = ${value(input.distance)} ÷ ${value(availableHours)}`, `= ${answer}`];
    }
    case "classifyUniformMotionState": {
      const supplied = [input.distanceMetres, input.speedMps, input.durationSeconds].filter((item): item is Rational => item !== undefined);
      if (supplied.length < 2) return ["Only one value is given.", "Distance and time cannot both be found.", `Answer: ${answer}.`];
      if (supplied.length === 2) return [display.formula, "Two values are enough to calculate the third.", `Answer: ${answer}.`];
      const reconstructed = multiply(input.speedMps!, input.durationSeconds!);
      return ["Check Distance = Speed × Time", `${value(input.speedMps!)} × ${value(input.durationSeconds!)} = ${value(reconstructed)} m`, `Answer: ${answer}.`];
    }
    case "verifyUniformMotionClaim": {
      const reconstructed = multiply(input.speedMps, input.durationSeconds);
      return ["Check Distance = Speed × Time", `${value(input.speedMps)} × ${value(input.durationSeconds)} = ${value(reconstructed)} m`, `${value(reconstructed)} m compared with ${value(input.distanceMetres)} m gives ${answer}.`];
    }
  }
}

function convertDistanceForWorking(value: Rational, from: DistanceUnit, to: DistanceUnit): Rational {
  const metres = multiply(value, { MM: rational(1, 1000), CM: rational(1, 100), M: RATIONAL_ONE, KM: rational(1000) }[from]);
  return divide(metres, { MM: rational(1, 1000), CM: rational(1, 100), M: RATIONAL_ONE, KM: rational(1000) }[to]);
}

function convertTimeForWorking(value: Rational, from: TimeUnit, to: TimeUnit): Rational {
  const seconds = multiply(value, { SECOND: RATIONAL_ONE, MINUTE: rational(60), HOUR: rational(3600), DAY: rational(86400) }[from]);
  return divide(seconds, { SECOND: RATIONAL_ONE, MINUTE: rational(60), HOUR: rational(3600), DAY: rational(86400) }[to]);
}

export function humanizeMisconception(id: TsdCp001MisconceptionId): string {
  const messages: Record<TsdCp001MisconceptionId, string> = {
    CORRECT: "using the correct method",
    MULTIPLY_INSTEAD_OF_DIVIDE: "multiplying instead of dividing",
    DIVIDE_INSTEAD_OF_MULTIPLY: "dividing instead of multiplying",
    ADD_INSTEAD_OF_MULTIPLY: "adding speed and time instead of multiplying",
    ADD_GIVENS_BEFORE_DIVIDING: "adding the given values before dividing",
    SUBTRACT_GIVENS_BEFORE_DIVIDING: "subtracting the given values before dividing",
    REVERSE_DIVISION: "reversing the division",
    TREAT_SECONDS_AS_MINUTES: "treating seconds as minutes",
    INVERT_REQUIRED_RATIO: "writing the inverse of the required ratio",
    OMIT_UNIT_CONVERSION: "using the number without changing its unit",
    REVERSE_UNIT_CONVERSION: "using the conversion factor in the wrong direction",
    USE_WRONG_CONVERSION_FACTOR: "using the wrong conversion factor",
    IGNORE_CLOCK_ROLLOVER: "not carrying the extra hour or day",
    IGNORE_MINUTE_COMPONENTS: "ignoring the minute parts of the two clock times",
    ADD_WHEN_SUBTRACTION_IS_REQUIRED: "adding when subtraction is required",
    SUBTRACT_WHEN_ADDITION_IS_REQUIRED: "subtracting when addition is required",
    USE_GIVEN_DURATION_AS_ANSWER: "copying a given time instead of calculating",
    COPY_GIVEN_CLOCK_TIME: "copying the given clock time instead of moving by the journey duration",
    USE_FIRST_QUANTITY_ONLY: "using only the first given value",
    USE_SECOND_QUANTITY_ONLY: "using only the second given value",
    IGNORE_SPEED_CHANGE: "ignoring the change in speed",
    IGNORE_TIME_CHANGE: "ignoring the change in time",
    IGNORE_DISTANCE_CHANGE: "ignoring the change in distance",
    USE_DIRECT_SPEED_FACTOR: "using the speed ratio directly instead of inversely",
    USE_DIRECT_TIME_FACTOR: "using the time ratio directly instead of inversely",
    ADD_RATIOS_INSTEAD_OF_MULTIPLYING: "adding the ratios instead of multiplying them",
    USE_SUM_INSTEAD_OF_RATIO: "adding the two quantities instead of forming a ratio",
    USE_DIFFERENCE_INSTEAD_OF_RATIO: "subtracting the two quantities instead of forming a ratio",
    FAIL_TO_INVERT_PACE: "treating minutes per kilometre as kilometres per hour",
    MULTIPLY_PACE_AND_TIME: "multiplying pace and total time instead of dividing",
    IGNORE_MINUTE_CONVERSION: "not converting minutes into seconds",
    USE_MINUTES_AS_HOURS: "using minutes as if they were hours",
    ADD_ONE_HOUR_TO_INTERVAL: "counting one extra hour",
    DROP_ONE_HOUR_FROM_INTERVAL: "leaving out one hour",
    MIX_UNCONVERTED_UNITS: "dividing before making the units compatible",
    CONVERT_ONLY_ONE_UNIT: "converting only one of the two units",
    APPLY_SIXTY_IN_WRONG_DIRECTION: "using 60 in the wrong direction",
    DOUBLE_COUNT_A_FACTOR: "using the same factor twice",
    HALVE_A_REQUIRED_FACTOR: "using only half of a required factor",
    ARITHMETIC_OFFSET: "changing the answer without a valid step",
    MISREAD_SPEED: "using a nearby value instead of the given speed",
    MISREAD_TIME: "using a nearby value instead of the given time",
    MISREAD_DISTANCE: "using a nearby value instead of the given distance",
    DIVISION_ERROR: "making an error in the final division",
    CLASSIFY_FROM_NUMBER_OF_GIVENS_ONLY: "deciding without checking the given values",
    IGNORE_INCONSISTENT_IDENTITY: "ignoring that speed × time does not equal distance",
    ASSUME_CLAIM_WITHOUT_CHECKING: "accepting the statement without calculation",
  };
  return messages[id];
}

export function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_key, nested) => (typeof nested === "bigint" ? `${nested}n` : nested));
}
