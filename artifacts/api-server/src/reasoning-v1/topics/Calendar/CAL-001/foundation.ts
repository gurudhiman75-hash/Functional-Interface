import type { GregorianDate, Month, Weekday } from "./types.ts";

export const WEEKDAY_ORDER: readonly Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const STANDARD_YEAR_MIN = 1800;
export const STANDARD_YEAR_MAX = 2199;
export const PROOF_YEAR_MIN = 1600;
export const PROOF_YEAR_MAX = 2399;

export function mod7(value: number): Weekday {
  return (((value % 7) + 7) % 7) as Weekday;
}

function assertInteger(value: number, label: string): void {
  if (!Number.isInteger(value)) throw new Error(`${label} must be an integer; received ${value}.`);
}

/** Ground-truth leap implementation. Deliberately structured independently from oddDayLeapYear. */
export function ordinalLeapYear(year: number): boolean {
  assertInteger(year, "year");
  if (year % 400 === 0) return true;
  if (year % 100 === 0) return false;
  return year % 4 === 0;
}

/** Pedagogical-engine leap implementation. Do not replace with ordinalLeapYear. */
export function oddDayLeapYear(year: number): boolean {
  assertInteger(year, "year");
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Exported generation classifier; proof compares this with both independent engines. */
export function classifyLeapYear(year: number): boolean {
  assertInteger(year, "year");
  const divisibleBy4 = Math.trunc(year / 4) * 4 === year;
  const divisibleBy100 = Math.trunc(year / 100) * 100 === year;
  const divisibleBy400 = Math.trunc(year / 400) * 400 === year;
  return divisibleBy400 || (divisibleBy4 && !divisibleBy100);
}

const ORDINARY_MONTH_LENGTHS: readonly number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const ODD_DAY_MONTH_LENGTHS: readonly number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function ordinalDaysInMonth(year: number, month: Month): number {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error(`Invalid month ${month}.`);
  if (month === 2 && ordinalLeapYear(year)) return 29;
  return ORDINARY_MONTH_LENGTHS[month - 1]!;
}

export function oddDayDaysInMonth(year: number, month: Month): number {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new Error(`Invalid month ${month}.`);
  const base = ODD_DAY_MONTH_LENGTHS[month - 1]!;
  return month === 2 && oddDayLeapYear(year) ? base + 1 : base;
}

export function isValidGregorianDate(date: GregorianDate): boolean {
  return Number.isInteger(date.year) && date.year >= 1 &&
    Number.isInteger(date.month) && date.month >= 1 && date.month <= 12 &&
    Number.isInteger(date.day) && date.day >= 1 && date.day <= ordinalDaysInMonth(date.year, date.month);
}

export function assertValidGregorianDate(date: GregorianDate): void {
  if (!isValidGregorianDate(date)) {
    throw new Error(`Invalid Gregorian date ${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}.`);
  }
}

function daysBeforeOrdinalYear(year: number): number {
  const y = year - 1;
  return 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
}

function ordinalDaysBeforeMonth(year: number, month: Month): number {
  let total = 0;
  for (let current = 1; current < month; current++) {
    total += ordinalDaysInMonth(year, current as Month);
  }
  return total;
}

/** 1 January 1 = ordinal 1. */
export function toOrdinal(date: GregorianDate): number {
  assertValidGregorianDate(date);
  return daysBeforeOrdinalYear(date.year) + ordinalDaysBeforeMonth(date.year, date.month) + date.day;
}

export function fromOrdinal(ordinal: number): GregorianDate {
  assertInteger(ordinal, "ordinal");
  if (ordinal < 1) throw new Error(`Ordinal must be >= 1; received ${ordinal}.`);

  let low = 1;
  let high = Math.floor(ordinal / 365) + 2;
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (daysBeforeOrdinalYear(mid) < ordinal) low = mid;
    else high = mid - 1;
  }

  const year = low;
  let remaining = ordinal - daysBeforeOrdinalYear(year);
  let month = 1 as Month;
  while (remaining > ordinalDaysInMonth(year, month)) {
    remaining -= ordinalDaysInMonth(year, month);
    month = (month + 1) as Month;
  }
  return { year, month, day: remaining };
}

/** Sunday=0 ... Saturday=6. 1 January 1 is Monday. */
export function ordinalWeekday(date: GregorianDate): Weekday {
  return mod7(toOrdinal(date));
}

export function ordinalDifference(a: GregorianDate, b: GregorianDate): number {
  return toOrdinal(b) - toOrdinal(a);
}

export function addDays(date: GregorianDate, signedDays: number): GregorianDate {
  assertInteger(signedDays, "signedDays");
  return fromOrdinal(toOrdinal(date) + signedDays);
}

export function compareDates(a: GregorianDate, b: GregorianDate): -1 | 0 | 1 {
  const aOrdinal = toOrdinal(a);
  const bOrdinal = toOrdinal(b);
  return aOrdinal < bOrdinal ? -1 : aOrdinal > bOrdinal ? 1 : 0;
}

export function absoluteDayGap(a: GregorianDate, b: GregorianDate): number {
  return Math.abs(ordinalDifference(a, b));
}

export function inclusiveDateCount(a: GregorianDate, b: GregorianDate): number {
  return absoluteDayGap(a, b) + 1;
}

export function interveningDays(a: GregorianDate, b: GregorianDate): number {
  return Math.max(absoluteDayGap(a, b) - 1, 0);
}

export function weekdayShift(anchor: Weekday, signedDays: number): Weekday {
  assertInteger(signedDays, "signedDays");
  return mod7(anchor + signedDays);
}

export function dayOfYear(date: GregorianDate): number {
  assertValidGregorianDate(date);
  return ordinalDaysBeforeMonth(date.year, date.month) + date.day;
}

export function dateFromDayOfYear(year: number, nthDay: number): GregorianDate {
  assertInteger(nthDay, "nthDay");
  const yearLength = ordinalLeapYear(year) ? 366 : 365;
  if (nthDay < 1 || nthDay > yearLength) throw new Error(`Day ${nthDay} is outside year ${year}.`);
  return fromOrdinal(toOrdinal({ year, month: 1, day: 1 }) + nthDay - 1);
}

export function spanContainsFeb29(a: GregorianDate, b: GregorianDate): boolean {
  const start = compareDates(a, b) <= 0 ? a : b;
  const end = compareDates(a, b) <= 0 ? b : a;
  for (let year = start.year; year <= end.year; year++) {
    if (!ordinalLeapYear(year)) continue;
    const leapDay: GregorianDate = { year, month: 2, day: 29 };
    if (compareDates(start, leapDay) <= 0 && compareDates(leapDay, end) <= 0) return true;
  }
  return false;
}

export function crossesCenturyBoundary(a: GregorianDate, b: GregorianDate): boolean {
  const min = Math.min(a.year, b.year);
  const max = Math.max(a.year, b.year);
  return Math.floor((min - 1) / 100) !== Math.floor((max - 1) / 100);
}

export type OddDayTrace = {
  completeYears: number;
  complete400YearBlocks: number;
  remainingYears: number;
  ordinaryYears: number;
  leapYears: number;
  daysBeforeMonth: number;
  dayOffset: number;
  totalOddDays: Weekday;
  weekday: Weekday;
};

/** Independent pedagogical absolute-date solver. Never calls toOrdinal/ordinalWeekday. */
export function oddDayWeekday(date: GregorianDate): { weekday: Weekday; trace: OddDayTrace } {
  if (!Number.isInteger(date.year) || date.year < 1 || !Number.isInteger(date.month) || date.month < 1 || date.month > 12) {
    throw new Error("Invalid date shell for odd-day engine.");
  }
  if (!Number.isInteger(date.day) || date.day < 1 || date.day > oddDayDaysInMonth(date.year, date.month)) {
    throw new Error("Invalid date for odd-day engine.");
  }

  const completeYears = date.year - 1;
  const complete400YearBlocks = Math.floor(completeYears / 400);
  const blockRemainderStartYear = complete400YearBlocks * 400 + 1;
  let ordinaryYears = 0;
  let leapYears = 0;
  for (let year = blockRemainderStartYear; year < date.year; year++) {
    if (oddDayLeapYear(year)) leapYears++;
    else ordinaryYears++;
  }
  let daysBeforeMonth = 0;
  for (let month = 1; month < date.month; month++) {
    daysBeforeMonth += oddDayDaysInMonth(date.year, month as Month);
  }
  const dayOffset = date.day - 1;
  const totalOddDays = mod7(ordinaryYears + 2 * leapYears + daysBeforeMonth + dayOffset);
  const weekday = mod7(1 + totalOddDays);
  return {
    weekday,
    trace: {
      completeYears,
      complete400YearBlocks,
      remainingYears: ordinaryYears + leapYears,
      ordinaryYears,
      leapYears,
      daysBeforeMonth,
      dayOffset,
      totalOddDays,
      weekday,
    },
  };
}

export function oddDaysInCompleteYears(yearCount: number): Weekday {
  assertInteger(yearCount, "yearCount");
  if (yearCount < 0) throw new Error("yearCount must be non-negative.");
  const blocks = Math.floor(yearCount / 400);
  const remainder = yearCount - blocks * 400;
  let oddDays = 0;
  for (let y = blocks * 400 + 1; y <= blocks * 400 + remainder; y++) {
    oddDays += oddDayLeapYear(y) ? 2 : 1;
  }
  return mod7(oddDays);
}

export function fullYearCalendarsMatch(yearA: number, yearB: number): boolean {
  return ordinalWeekday({ year: yearA, month: 1, day: 1 }) === ordinalWeekday({ year: yearB, month: 1, day: 1 }) &&
    ordinalLeapYear(yearA) === ordinalLeapYear(yearB);
}

export function monthCalendarsMatch(yearA: number, monthA: Month, yearB: number, monthB: Month): boolean {
  return ordinalWeekday({ year: yearA, month: monthA, day: 1 }) === ordinalWeekday({ year: yearB, month: monthB, day: 1 }) &&
    ordinalDaysInMonth(yearA, monthA) === ordinalDaysInMonth(yearB, monthB);
}

export function nextMatchingFullYear(year: number): number {
  for (let candidate = year + 1; candidate <= year + 40; candidate++) {
    if (fullYearCalendarsMatch(year, candidate)) return candidate;
  }
  throw new Error(`No next matching calendar found for ${year} within 40 years.`);
}

export function previousMatchingFullYear(year: number): number {
  for (let candidate = year - 1; candidate >= Math.max(1, year - 40); candidate--) {
    if (fullYearCalendarsMatch(year, candidate)) return candidate;
  }
  throw new Error(`No previous matching calendar found for ${year} within 40 years.`);
}

export function matchingFullYearsInRange(year: number, start: number, end: number): number[] {
  if (start > end) throw new Error("Invalid year range.");
  const matches: number[] = [];
  for (let candidate = start; candidate <= end; candidate++) {
    if (candidate !== year && fullYearCalendarsMatch(year, candidate)) matches.push(candidate);
  }
  return matches;
}

export type WeekdayFrequency = Record<Weekday, number>;

function emptyFrequency(): WeekdayFrequency {
  return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
}

export function weekdayFrequencyForLength(startWeekday: Weekday, length: number): WeekdayFrequency {
  assertInteger(length, "length");
  if (length < 0) throw new Error("length cannot be negative.");
  const q = Math.floor(length / 7);
  const r = length % 7;
  const result = emptyFrequency();
  for (const weekday of WEEKDAY_ORDER) result[weekday] = q;
  for (let offset = 0; offset < r; offset++) result[mod7(startWeekday + offset)]++;
  return result;
}

export function weekdayFrequencyInMonth(year: number, month: Month): WeekdayFrequency {
  return weekdayFrequencyForLength(ordinalWeekday({ year, month, day: 1 }), ordinalDaysInMonth(year, month));
}

export function weekdayFrequencyInYear(year: number): WeekdayFrequency {
  return weekdayFrequencyForLength(ordinalWeekday({ year, month: 1, day: 1 }), ordinalLeapYear(year) ? 366 : 365);
}

export function weekdayFrequencyInInclusiveRange(a: GregorianDate, b: GregorianDate): WeekdayFrequency {
  const start = compareDates(a, b) <= 0 ? a : b;
  return weekdayFrequencyForLength(ordinalWeekday(start), inclusiveDateCount(a, b));
}

export function enumerateWeekdayFrequency(a: GregorianDate, b: GregorianDate): WeekdayFrequency {
  const startOrdinal = Math.min(toOrdinal(a), toOrdinal(b));
  const endOrdinal = Math.max(toOrdinal(a), toOrdinal(b));
  const result = emptyFrequency();
  for (let ordinal = startOrdinal; ordinal <= endOrdinal; ordinal++) result[mod7(ordinal)]++;
  return result;
}

export function countLeapYearsInclusive(start: number, end: number): number {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) throw new Error("Invalid inclusive year range.");
  const through = (year: number) => Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
  return through(end) - through(start - 1);
}

export function countOrdinaryYearsInclusive(start: number, end: number): number {
  return end - start + 1 - countLeapYearsInclusive(start, end);
}

export function dateKey(date: GregorianDate): string {
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

export function semanticKey(value: unknown): string {
  if (Array.isArray(value)) return `set:${[...value].sort((a, b) => Number(a) - Number(b)).join(",")}`;
  if (typeof value === "object" && value !== null && "year" in value && "month" in value && "day" in value) {
    return `date:${dateKey(value as GregorianDate)}`;
  }
  return `${typeof value}:${String(value)}`;
}

function canonicalJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalJsonValue);
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value as Record<string, unknown>).sort()) {
      result[key] = canonicalJsonValue((value as Record<string, unknown>)[key]);
    }
    return result;
  }
  return value;
}

export function stableDigest(value: unknown): string {
  const text = JSON.stringify(canonicalJsonValue(value));
  let hash = 2166136261;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export class DeterministicRandom {
  private state: number;

  constructor(seed: number | string) {
    const text = String(seed);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    this.state = hash >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let x = this.state;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) throw new Error("Invalid random integer range.");
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    if (values.length === 0) throw new Error("Cannot pick from an empty array.");
    return values[this.int(0, values.length - 1)]!;
  }

  shuffle<T>(values: readonly T[]): T[] {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [copy[i], copy[j]] = [copy[j]!, copy[i]!];
    }
    return copy;
  }
}
