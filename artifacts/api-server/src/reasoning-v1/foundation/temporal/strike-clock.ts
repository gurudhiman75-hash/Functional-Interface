import {
  addRationals,
  compareRationals,
  divideRationals,
  exactRational,
  floorRational,
  multiplyRationals,
  type ExactRational,
  type ExactRationalInput,
} from "./rational";

export interface StrikeEvent {
  strikeNumber: number;
  timestampSeconds: ExactRational;
}

function assertStrikeCount(count: number): void {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Strike count must be a positive integer.");
  }
}

export function strikeTimelineExact(input: {
  strikes: number;
  gapSeconds: ExactRationalInput;
  firstStrikeAtSeconds?: ExactRationalInput;
}): StrikeEvent[] {
  assertStrikeCount(input.strikes);
  if (compareRationals(input.gapSeconds, 0) < 0) {
    throw new Error("Strike gap cannot be negative.");
  }
  const first = input.firstStrikeAtSeconds ?? 0;
  return Array.from({ length: input.strikes }, (_, index) => ({
    strikeNumber: index + 1,
    timestampSeconds: addRationals(first, multiplyRationals(input.gapSeconds, index)),
  }));
}

export function durationForStrikesExact(input: {
  strikes: number;
  gapSeconds: ExactRationalInput;
}): ExactRational {
  assertStrikeCount(input.strikes);
  return multiplyRationals(input.gapSeconds, input.strikes - 1);
}

export function gapFromStrikeDurationExact(input: {
  strikes: number;
  firstToLastDurationSeconds: ExactRationalInput;
}): ExactRational {
  assertStrikeCount(input.strikes);
  if (input.strikes === 1) {
    if (compareRationals(input.firstToLastDurationSeconds, 0) !== 0) {
      throw new Error("One strike has zero first-to-last duration.");
    }
    return exactRational(0);
  }
  return divideRationals(
    input.firstToLastDurationSeconds,
    input.strikes - 1,
  );
}

export function transferStrikeDurationExact(input: {
  sourceStrikes: number;
  sourceDurationSeconds: ExactRationalInput;
  targetStrikes: number;
}): ExactRational {
  const gap = gapFromStrikeDurationExact({
    strikes: input.sourceStrikes,
    firstToLastDurationSeconds: input.sourceDurationSeconds,
  });
  return durationForStrikesExact({
    strikes: input.targetStrikes,
    gapSeconds: gap,
  });
}

export function strikeCountWithinDurationExact(input: {
  durationSeconds: ExactRationalInput;
  gapSeconds: ExactRationalInput;
  includeStrikeAtStart?: boolean;
  includeStrikeAtEnd?: boolean;
}): number {
  if (compareRationals(input.durationSeconds, 0) < 0) {
    throw new Error("Strike observation duration cannot be negative.");
  }
  if (compareRationals(input.gapSeconds, 0) <= 0) {
    throw new Error("Strike gap must be positive for count inference.");
  }
  const includeStart = input.includeStrikeAtStart ?? true;
  const includeEnd = input.includeStrikeAtEnd ?? true;
  let intervals = floorRational(divideRationals(input.durationSeconds, input.gapSeconds));
  const exactEnd = compareRationals(
    multiplyRationals(intervals, input.gapSeconds),
    input.durationSeconds,
  ) === 0;
  if (!includeEnd && exactEnd && intervals > 0n) {
    intervals -= 1n;
  }
  const count = Number(intervals) + (includeStart ? 1 : 0);
  return Math.max(0, count);
}

export function clockHourLabel(hourIndex: number): number {
  const normalized = ((hourIndex % 12) + 12) % 12;
  return normalized === 0 ? 12 : normalized;
}

export function standardHourlyStrikeCount(hourIndex: number): number {
  return clockHourLabel(hourIndex);
}

export function totalHourlyStrikesInclusive(input: {
  startHour: number;
  endHour: number;
  schedule?: (hourIndex: number) => number;
}): number {
  if (!Number.isInteger(input.startHour) || !Number.isInteger(input.endHour)) {
    throw new Error("Hourly strike range requires integer hour indices.");
  }
  if (input.endHour < input.startHour) {
    throw new Error("Hourly strike range end must not precede start.");
  }
  const schedule = input.schedule ?? standardHourlyStrikeCount;
  let total = 0;
  for (let hour = input.startHour; hour <= input.endHour; hour += 1) {
    const count = schedule(hour);
    if (!Number.isInteger(count) || count < 0) {
      throw new Error("Hourly strike schedule returned an invalid count.");
    }
    total += count;
  }
  return total;
}

export function totalStrikesInTwelveHours(): number {
  return totalHourlyStrikesInclusive({ startHour: 1, endHour: 12 });
}

export function totalStrikesInTwentyFourHours(): number {
  return totalHourlyStrikesInclusive({ startHour: 1, endHour: 24 });
}

export function totalHourlyAndHalfHourChimes(input: {
  startHour: number;
  endHour: number;
  includeStartHour?: boolean;
  includeEndHour?: boolean;
  halfHourChimesPerInterval?: number;
}): number {
  const includeStart = input.includeStartHour ?? true;
  const includeEnd = input.includeEndHour ?? true;
  const halfHourChimes = input.halfHourChimesPerInterval ?? 1;
  if (!Number.isInteger(halfHourChimes) || halfHourChimes < 0) {
    throw new Error("Half-hour chime count must be a non-negative integer.");
  }
  const firstHour = includeStart ? input.startHour : input.startHour + 1;
  const lastHour = includeEnd ? input.endHour : input.endHour - 1;
  const hourly = firstHour <= lastHour
    ? totalHourlyStrikesInclusive({ startHour: firstHour, endHour: lastHour })
    : 0;
  const halfHourIntervals = Math.max(0, input.endHour - input.startHour);
  return hourly + halfHourIntervals * halfHourChimes;
}
