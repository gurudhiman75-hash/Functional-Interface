import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";
import {
  NUM_CP005_WAVE04_PROTOTYPE_IDS,
  type NumCp005Wave04PrototypeId,
} from "./types";

export const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export class Rng {
  private state: number;

  constructor(text: string) {
    let state = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      state ^= text.charCodeAt(index);
      state = Math.imul(state, 16777619);
    }
    this.state = state >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minimum: number, maximum: number): number {
    return minimum + (this.next() % (maximum - minimum + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }
}

export function assertSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("NUM-CP-005 Wave 04 seed must be a positive integer.");
  }
}

export function difficulty(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

export function correctIndex(
  prototypeId: NumCp005Wave04PrototypeId,
  seed: number,
): number {
  return (seed + NUM_CP005_WAVE04_PROTOTYPE_IDS.indexOf(prototypeId)) % 4;
}

export function factorText(factors: readonly NumCp005PrimePower[]): string {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ") || "1";
}

export function numberFromFactors(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (value, factor) => value * BigInt(factor.prime) ** BigInt(factor.exponent),
    1n,
  );
}

export function divisorCountFormula(
  factors: readonly NumCp005PrimePower[],
): number {
  return factors.reduce((count, factor) => count * (factor.exponent + 1), 1);
}

export function oddDivisorCountFormula(
  factors: readonly NumCp005PrimePower[],
): number {
  return factors
    .filter((factor) => factor.prime !== 2)
    .reduce((count, factor) => count * (factor.exponent + 1), 1);
}

export function squareDivisorCountFormula(
  factors: readonly NumCp005PrimePower[],
): number {
  return factors.reduce(
    (count, factor) => count * (Math.floor(factor.exponent / 2) + 1),
    1,
  );
}

export function divisorSumFormula(
  factors: readonly NumCp005PrimePower[],
): bigint {
  return factors.reduce((product, factor) => {
    let local = 0n;
    let power = 1n;
    for (let index = 0; index <= factor.exponent; index += 1) {
      local += power;
      power *= BigInt(factor.prime);
    }
    return product * local;
  }, 1n);
}

export function integerDivisorsByPairs(n: bigint): bigint[] {
  const low: bigint[] = [];
  const high: bigint[] = [];
  for (let divisor = 1n; divisor * divisor <= n; divisor += 1n) {
    if (n % divisor !== 0n) continue;
    low.push(divisor);
    if (divisor * divisor !== n) high.push(n / divisor);
  }
  return [...low, ...high.reverse()];
}

export function divisorCountByPairs(n: number): number {
  let count = 0;
  for (let divisor = 1; divisor * divisor <= n; divisor += 1) {
    if (n % divisor !== 0) continue;
    count += divisor * divisor === n ? 1 : 2;
  }
  return count;
}

export function factorInteger(n: number): readonly NumCp005PrimePower[] {
  let remaining = n;
  const factors: NumCp005PrimePower[] = [];
  for (let prime = 2; prime * prime <= remaining; prime += prime === 2 ? 1 : 2) {
    let exponent = 0;
    while (remaining % prime === 0) {
      remaining /= prime;
      exponent += 1;
    }
    if (exponent > 0) factors.push(Object.freeze({ prime, exponent }));
  }
  if (remaining > 1) factors.push(Object.freeze({ prime: remaining, exponent: 1 }));
  return Object.freeze(factors);
}

export function setText(values: readonly string[]): string {
  return values.length === 0 ? "∅" : `{${values.join(", ")}}`;
}

export function pairSetText(
  pairs: readonly (readonly [number, number])[],
): string {
  return setText(pairs.map(([x, y]) => `(${x},${y})`));
}

export function makeOptions(
  correct: string,
  wrongValues: readonly string[],
  answerIndex: number,
  trapPrefix: string,
): readonly NumCp005Option[] {
  const uniqueWrongs: string[] = [];
  for (const value of wrongValues) {
    if (value !== correct && !uniqueWrongs.includes(value)) uniqueWrongs.push(value);
  }
  let fallback = 1;
  while (uniqueWrongs.length < 3) {
    const value = `${correct} (${fallback})`;
    if (!uniqueWrongs.includes(value)) uniqueWrongs.push(value);
    fallback += 1;
  }

  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    if (index === answerIndex) {
      return Object.freeze({
        value: correct,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches both the governed solution and the independent bounded verifier.",
      });
    }
    const option = Object.freeze({
      value: uniqueWrongs[wrongIndex]!,
      isCorrect: false,
      misconceptionId: `${trapPrefix}-${wrongIndex + 1}`,
      analysis: [
        "This treats one condition as stronger than it is.",
        "This drops a valid bounded candidate or includes an invalid one.",
        "This confuses existence, uniqueness and complete-set evidence.",
      ][wrongIndex]!,
    });
    wrongIndex += 1;
    return option;
  }));
}

export function explanation(
  concept: string,
  strategy: string,
  steps: readonly string[],
  speed: string,
  finalAnswer: string,
): NumCp005Explanation {
  return Object.freeze({
    coreConcept: concept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze([...steps]),
    examSpeedMethod: speed,
    commonTraps: Object.freeze([
      "Do not treat a statement as sufficient merely because it is true for the hidden state.",
      "Do not stop after finding one candidate when the question asks for all candidates or uniqueness.",
      "Do not interchange divisor-count, odd-divisor and square-divisor formulas.",
    ]),
    finalAnswer: `Final answer: ${finalAnswer}`,
  });
}
