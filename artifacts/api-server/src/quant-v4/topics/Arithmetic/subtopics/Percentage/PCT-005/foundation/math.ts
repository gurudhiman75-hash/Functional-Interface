import type { Pct005AnswerType, Pct005Direction } from "./types";

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

export function wrapAnswer(answerType: Pct005AnswerType, raw: string): string {
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

export function stagePercent(direction: Pct005Direction, rate: number) {
  return direction === "increase" ? 100 + rate : 100 - rate;
}

export function stageFactor(direction: Pct005Direction, rate: number) {
  return stagePercent(direction, rate) / 100;
}
