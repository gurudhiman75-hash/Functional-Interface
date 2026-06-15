import type { Rap001AnswerType } from "./types";

export function roundTo(value: number, places = 4): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value);
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export function gcdMany(values: readonly number[]) {
  return values.reduce((acc, value) => gcd(acc, value), 0) || 1;
}

export function lcmMany(values: readonly number[]) {
  return values.reduce((acc, value) => lcm(acc, value), 1);
}

export function simplifyRatio(values: readonly number[]) {
  const divisor = gcdMany(values);
  return values.map((value) => Math.round(value / divisor));
}

export function formatNumber(value: number): string {
  const rounded = roundTo(value, 4);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function formatRatio(values: readonly number[]) {
  return simplifyRatio(values).join(":");
}

export function formatAnswer(answerType: Rap001AnswerType, answerValue: string | number): string {
  if (typeof answerValue === "string") return answerValue;
  if (answerType === "PERCENT") return formatPercent(answerValue);
  if (answerType === "COUNT") return String(Math.round(answerValue));
  return formatNumber(answerValue);
}

export function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function stableBucket(seed: string, size: number): number {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

export function mathJaxLine(label: string, expression: string | number) {
  return `${label}: \\(${expression}\\)`;
}

export function ratioFromFractions(numerator1: number, denominator1: number, numerator2: number, denominator2: number) {
  return simplifyRatio([numerator1 * denominator2, numerator2 * denominator1]);
}

export function ratioFromDecimals(decimalA: number, decimalB: number) {
  const scale = 10 ** Math.max(decimalPlaces(decimalA), decimalPlaces(decimalB));
  return simplifyRatio([Math.round(decimalA * scale), Math.round(decimalB * scale)]);
}

export function decimalPlaces(value: number) {
  const text = String(value);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}
