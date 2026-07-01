import type { Pct007AnswerType, Pct007ComparisonDirection } from "./types";

export function roundTo(value: number, places = 4): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, places = 2): string {
  const rounded = roundTo(value, places);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function formatPercent(value: number) {
  return `${formatNumber(value)}%`;
}

export function stableHash(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function stableBucket(seed: string, size: number) {
  if (size <= 0) return 0;
  return stableHash(seed) % size;
}

export function percentOf(base: number, rate: number) {
  return roundTo((base * rate) / 100, 4);
}

export function increaseByPercent(base: number, rate: number) {
  return roundTo(base + percentOf(base, rate), 4);
}

export function decreaseByPercent(base: number, rate: number) {
  return roundTo(base - percentOf(base, rate), 4);
}

export function mathJaxBlock(expression: string) {
  return `\\[\\Rightarrow ${expression}\\]`;
}

export function numericAnswer(answerType: Pct007AnswerType, value: number) {
  if (answerType === "PERCENT") return `$$${formatPercent(value).replace("%", "\\%")}$$`;
  return `$$${formatNumber(value)}$$`;
}

export function prefixedValue(value: number, prefix = "", unitLabel = "") {
  const numberPart = `${prefix}${formatNumber(value)}`.trim();
  return unitLabel ? `${numberPart} ${unitLabel}`.trim() : numberPart;
}

export function comparisonAnswer(
  direction: Pct007ComparisonDirection,
  leftLabel: string,
  rightLabel: string,
  magnitude: string,
) {
  if (direction === "equal") return `${leftLabel} and ${rightLabel} are equal.`;
  if (direction === "greater") return `${leftLabel} is greater by ${magnitude}.`;
  return `${rightLabel} is greater by ${magnitude}.`;
}
