import {
  RATIONAL_ONE,
  compare,
  divide,
  equals,
  multiply,
  rational,
  toCanonicalString,
  type Rational,
} from "../foundation/rational";

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
    if (values.length === 0) throw new Error("Cannot pick from an empty list");
    return values[this.next() % values.length];
  }

  shuffle<T>(values: readonly T[]): readonly T[] {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = this.next() % (index + 1);
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return Object.freeze(copy);
  }
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
  if (digits === null || digits > 2) return `${value.numerator}/${value.denominator}`;
  const scale = 10n ** BigInt(digits);
  const scaled = (value.numerator * scale) / value.denominator;
  const negative = scaled < 0n;
  const absolute = negative ? -scaled : scaled;
  const whole = absolute / scale;
  const fraction = String(absolute % scale).padStart(digits, "0").replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole}${fraction ? `.${fraction}` : ""}`;
}

export function formatDurationHours(value: Rational): string {
  const minutes = multiply(value, rational(60));
  if (minutes.denominator === 1n) {
    const total = Number(minutes.numerator);
    const sign = total < 0 ? "-" : "";
    const absolute = Math.abs(total);
    const hours = Math.floor(absolute / 60);
    const remainder = absolute % 60;
    if (hours === 0) return `${sign}${remainder} ${remainder === 1 ? "minute" : "minutes"}`;
    if (remainder === 0) return `${sign}${hours} ${hours === 1 ? "hour" : "hours"}`;
    return `${sign}${hours} ${hours === 1 ? "hour" : "hours"} ${remainder} minutes`;
  }
  return `${formatExamNumber(value)} hours`;
}

export function formatClockMinute(value: Rational): string {
  if (value.denominator !== 1n) return `${formatExamNumber(value)} minutes from day zero`;
  const total = Number(value.numerator);
  const day = Math.floor(total / 1440);
  const minuteOfDay = ((total % 1440) + 1440) % 1440;
  const hour24 = Math.floor(minuteOfDay / 60);
  const minute = minuteOfDay % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  const dayText = day === 0 ? "" : day === 1 ? " next day" : ` day ${day + 1}`;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}${dayText}`;
}

export function formatSolvedValue(value: Rational, unit: "HOUR" | "KM" | "KMPH" | "COUNT" | "PERCENT" | "CLOCK_MINUTE"): string {
  switch (unit) {
    case "HOUR": return formatDurationHours(value);
    case "KM": return `${formatExamNumber(value)} km`;
    case "KMPH": return `${formatExamNumber(value)} km/h`;
    case "COUNT": return formatExamNumber(value);
    case "PERCENT": return `${formatExamNumber(value)}%`;
    case "CLOCK_MINUTE": return formatClockMinute(value);
  }
}

export function fingerprint(values: readonly Rational[], extras: readonly string[] = []): string {
  return [...extras, ...values.map(toCanonicalString)].join("|");
}

export function isStrictlyBetween(value: Rational, lower: Rational, upper: Rational): boolean {
  return compare(value, lower) > 0 && compare(value, upper) < 0;
}

export function ratioToPercent(value: Rational): Rational {
  return multiply(value, rational(100));
}

export function percentToRatio(value: Rational): Rational {
  return divide(value, rational(100));
}

export function uniqueRationals(values: readonly Rational[]): readonly Rational[] {
  const unique: Rational[] = [];
  for (const value of values) {
    if (!unique.some((entry) => equals(entry, value))) unique.push(value);
  }
  return Object.freeze(unique);
}

export const ONE = RATIONAL_ONE;
