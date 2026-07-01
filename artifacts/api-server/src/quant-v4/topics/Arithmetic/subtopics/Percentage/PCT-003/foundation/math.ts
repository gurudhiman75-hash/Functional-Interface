import type { Pct003AnswerType } from "./types";

export function roundTo(value: number, places = 4): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number): string {
  const rounded = roundTo(value, 4);
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded).replace(/\.?0+$/, "");
}

export function formatPercent(value: number): string {
  return `${formatNumber(value)}%`;
}

export function formatRatio(left: number, right: number): string {
  return `${formatNumber(left)}:${formatNumber(right)}`;
}

export function wrapAnswer(answerType: Pct003AnswerType, raw: string): string {
  if (answerType === "PERCENT") return `$$${raw.replace("%", "\\%")}$$`;
  if (answerType === "RATIO") return `$$${raw.replace(":", " : ")}$$`;
  return `$$${raw}$$`;
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

export function mathJaxBlock(expression: string) {
  return `\\[\\Rightarrow ${expression}\\]`;
}

export function growthFactor(rate: number) {
  return (100 + rate) / 100;
}
