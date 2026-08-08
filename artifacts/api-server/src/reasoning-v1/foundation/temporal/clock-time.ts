import {
  addRationals,
  asExactRational,
  compareRationals,
  exactRational,
  floorRational,
  moduloRational,
  subtractRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";

export const CLOCK_CYCLE_SECONDS = exactRational(43_200);

export interface ClockTime12Input {
  hour: number;
  minute: number;
  second?: ExactRationalInput;
}

export interface ExactClockTime12 {
  hour: number;
  minute: number;
  second: ExactRational;
}

function normalizeSecond(second: ExactRationalInput | undefined): ExactRational {
  const normalized = asExactRational(second ?? 0);
  if (
    compareRationals(normalized, 0) < 0 ||
    compareRationals(normalized, 60) >= 0
  ) {
    throw new Error("Clock second must be at least 0 and less than 60.");
  }
  return normalized;
}

export function normalizeClockTimeInput(time: ClockTime12Input): ExactClockTime12 {
  if (!Number.isInteger(time.hour) || time.hour < 1 || time.hour > 12) {
    throw new Error("Clock hour must be an integer from 1 through 12.");
  }
  if (!Number.isInteger(time.minute) || time.minute < 0 || time.minute > 59) {
    throw new Error("Clock minute must be an integer from 0 through 59.");
  }

  return {
    hour: time.hour,
    minute: time.minute,
    second: normalizeSecond(time.second),
  };
}

export function clockTimeToTotalSecondsExact(
  time: ClockTime12Input,
): ExactRational {
  const normalized = normalizeClockTimeInput(time);
  return addRationals(
    addRationals((normalized.hour % 12) * 3_600, normalized.minute * 60),
    normalized.second,
  );
}

export function totalSecondsToClockTimeExact(
  totalSeconds: ExactRationalInput,
): ExactClockTime12 {
  const normalized = moduloRational(totalSeconds, CLOCK_CYCLE_SECONDS);
  const hourIndex = Number(floorRational({
    numerator: normalized.numerator,
    denominator: normalized.denominator * 3_600n,
  }));
  const afterHours = subtractRationals(normalized, hourIndex * 3_600);
  const minute = Number(floorRational({
    numerator: afterHours.numerator,
    denominator: afterHours.denominator * 60n,
  }));

  return {
    hour: hourIndex === 0 ? 12 : hourIndex,
    minute,
    second: subtractRationals(afterHours, minute * 60),
  };
}

export function addClockSecondsExact(
  time: ClockTime12Input,
  seconds: ExactRationalInput,
): ExactClockTime12 {
  return totalSecondsToClockTimeExact(
    addRationals(clockTimeToTotalSecondsExact(time), seconds),
  );
}
