import type { Money, Rational } from "./types";
import { moneyFromRupees } from "./money";
import { rational } from "./rational";

export type SeededRandom = Readonly<{ next: () => number }>;

function hashSeed(seed: string): number {
  let value = 2166136261;
  for (const char of seed) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function createSeededRandom(seed: string): SeededRandom {
  let state = hashSeed(seed) || 1;
  return {
    next: () => {
      state += 0x6d2b79f5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

export function pickSeeded<T>(random: SeededRandom, values: readonly T[]): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty parameter set.");
  return values[Math.floor(random.next() * values.length)]!;
}

export const fundamentalCostPrices: readonly Money[] = [
  120, 160, 200, 240, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2400,
].map(moneyFromRupees);

export const fundamentalRates: readonly Rational[] = [
  rational(5), rational(10), rational(12, 1), rational(25, 2), rational(15),
  rational(20), rational(25), rational(100, 3), rational(40), rational(50),
];

export function generateFundamentalParameters(seed: string) {
  const random = createSeededRandom(seed);
  return {
    costPrice: pickSeeded(random, fundamentalCostPrices),
    ratePercent: pickSeeded(random, fundamentalRates),
    direction: pickSeeded(random, ["PROFIT", "LOSS"] as const),
  };
}
