import { formatRational, multiply, rational } from "./rational";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry, TmwTimeUnit } from "./types";

export function seedNumber(seed: string, salt: string): number {
  const input = `${seed}:${salt}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pick<T>(values: readonly T[], seed: string, salt: string): T {
  return values[seedNumber(seed, salt) % values.length];
}

export function required<T>(value: T | undefined, label: string): T {
  if (value === undefined) throw new Error(`Missing required parameter: ${label}`);
  return value;
}

export function percent(value: Rational): Rational {
  return multiply(value, rational(100));
}

export function timeUnitLabel(unit: TmwTimeUnit, value: Rational): string {
  return value.numerator === value.denominator ? unit : `${unit}s`;
}

export function answerText(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters, answer: Rational): string {
  const value = formatRational(answer);
  if (entry.answerType === "PERCENT") return `${value}%`;
  if (entry.answerType === "TIME") return `${value} ${timeUnitLabel(p.timeUnit, answer)}`;
  if (entry.answerType === "RATE") {
    if (entry.solveMode === "findOneUnitWorkFromCompletionTime") return `${value} of the work per ${p.timeUnit}`;
    if (entry.solveMode === "convertRateAcrossTimeUnits") {
      const targetDuration = required(p.targetDuration, "targetDuration");
      return `${value} ${p.context.object} per ${formatRational(targetDuration)} ${timeUnitLabel(p.timeUnit, targetDuration)}`;
    }
    return `${value} ${p.context.object} per ${p.timeUnit}`;
  }
  if (entry.answerType === "FRACTION") return `${value} of the work`;
  return `${value} ${p.context.object}`;
}
