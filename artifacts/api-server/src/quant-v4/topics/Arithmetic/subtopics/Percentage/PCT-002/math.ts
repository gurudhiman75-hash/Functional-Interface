import type { Pct002AnswerType } from "./types";

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

export function formatAnswer(answerType: Pct002AnswerType, numericAnswer: number): string {
  if (answerType === "PERCENT") return formatPercent(numericAnswer);
  if (answerType === "COUNT") return String(Math.round(numericAnswer));
  return formatNumber(numericAnswer);
}

export function mathJaxLine(label: string, expression: string | number): string {
  return `${label}: \\(${expression}\\)`;
}

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value);
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

export function percentage(rate: number): number {
  return rate / 100;
}

export function inclusionExclusionOverlap(groupA: number, groupB: number, neither: number): number {
  return groupA + groupB + neither - 100;
}

export function fractionalErrorPercent(correctNumerator: number, correctDenominator: number, wrongNumerator: number, wrongDenominator: number): number {
  const correctValue = correctNumerator / correctDenominator;
  const wrongValue = wrongNumerator / wrongDenominator;
  return Math.abs((wrongValue - correctValue) / correctValue) * 100;
}

export function multiplierErrorPercent(correctMultiplier: number, wrongMultiplier: number): number {
  return Math.abs((wrongMultiplier - correctMultiplier) / correctMultiplier) * 100;
}

export function divisorErrorPercent(correctDivisor: number, wrongDivisor: number): number {
  return Math.abs(correctDivisor / wrongDivisor - 1) * 100;
}

export function piecewiseAmount(totalAmount: number, thresholdAmount: number, baseRate: number, extraRate: number): number {
  if (totalAmount <= thresholdAmount) return totalAmount * percentage(baseRate);
  return thresholdAmount * percentage(baseRate) + (totalAmount - thresholdAmount) * percentage(extraRate);
}

export function weightedPercentage(primaryShare: number, primaryRate: number, secondaryRate: number): number {
  return primaryShare * percentage(primaryRate) + (100 - primaryShare) * percentage(secondaryRate);
}

export function weightedCount(total: number, primaryShare: number, primaryRate: number, secondaryRate: number): number {
  return total * weightedPercentage(primaryShare, primaryRate, secondaryRate) / 100;
}

export function repeatedReplacementFactor(initialVolume: number, replacementVolume: number): number {
  return (initialVolume - replacementVolume) / initialVolume;
}

export function repeatedReplacementPercent(initialVolume: number, replacementVolume: number, operations: number): number {
  return repeatedReplacementFactor(initialVolume, replacementVolume) ** operations * 100;
}

export function repeatedReplacementAmount(initialVolume: number, replacementVolume: number, operations: number): number {
  return repeatedReplacementFactor(initialVolume, replacementVolume) ** operations * initialVolume;
}

export function electionTotalVoters(polledPercentage: number, invalidPercentage: number, winnerPercentage: number, voteMargin: number): number {
  const votedFactor = percentage(polledPercentage);
  const validFactor = 1 - percentage(invalidPercentage);
  const winnerGapFactor = (2 * winnerPercentage - 100) / 100;
  return voteMargin / (votedFactor * validFactor * winnerGapFactor);
}

export function chainedDropCount(initialCount: number, drops: readonly number[]): number {
  return drops.reduce((current, rate) => current * (1 - percentage(rate)), initialCount);
}

export function shiftedBaseChainCount(initialCount: number, passes: readonly number[]): number {
  return passes.reduce((current, rate) => current * percentage(rate), initialCount);
}

export function tripleInclusionExclusionUnion(a: number, b: number, c: number, ab: number, bc: number, ac: number, abc: number): number {
  return a + b + c - ab - bc - ac + abc;
}

export function multiTierPiecewiseAmount(total: number, t1: number, t2: number, r1: number, r2: number, r3: number): number {
  if (total <= t1) return total * percentage(r1);
  const slab1 = t1 * percentage(r1);
  if (total <= t2) return slab1 + (total - t1) * percentage(r2);
  const slab2 = (t2 - t1) * percentage(r2);
  return slab1 + slab2 + (total - t2) * percentage(r3);
}

export function reversePiecewiseSales(totalResult: number, t1: number, r1: number, r2: number): number {
  const slab1Max = t1 * percentage(r1);
  if (totalResult <= slab1Max) return totalResult / percentage(r1);
  return t1 + (totalResult - slab1Max) / percentage(r2);
}

export function variableReplacementPercent(rates: readonly number[]): number {
  return rates.reduce((current, r) => current * (1 - percentage(r)), 100);
}
