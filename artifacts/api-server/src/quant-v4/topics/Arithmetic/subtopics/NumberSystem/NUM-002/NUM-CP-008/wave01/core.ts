import type { NumCp008Difficulty, NumCp008Explanation, NumCp008Option, NumCp008Wave01Package } from "./types.ts";

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  const next = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(values: readonly T[]) => values[Math.floor(next() * values.length)]!,
  };
}

export function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const output = [...values];
  for (let i = output.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [output[i], output[j]] = [output[j]!, output[i]!];
  }
  return output;
}

export function mod(value: number, modulus: number): number {
  if (!Number.isSafeInteger(value) || !Number.isSafeInteger(modulus) || modulus <= 0) throw new Error("Invalid modulo input");
  return ((value % modulus) + modulus) % modulus;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function lcm(a: number, b: number): number {
  return Math.abs((a / gcd(a, b)) * b);
}

export function powMod(base: number, exponent: number, modulus: number): number {
  if (!Number.isSafeInteger(exponent) || exponent < 0) throw new Error("Invalid exponent");
  let result = 1n;
  let factor = BigInt(mod(base, modulus));
  let power = BigInt(exponent);
  const m = BigInt(modulus);
  while (power > 0n) {
    if (power & 1n) result = (result * factor) % m;
    factor = (factor * factor) % m;
    power >>= 1n;
  }
  return Number(result % m);
}

export function powModVerifier(base: number, exponent: number, modulus: number): number {
  let value = 1n;
  const m = BigInt(modulus);
  const b = BigInt(base);
  for (let index = 0; index < exponent; index += 1) value = (value * b) % m;
  return Number((value + m) % m);
}

export function solveResidues(a: number, b: number, modulus: number): number[] {
  const out: number[] = [];
  for (let x = 0; x < modulus; x += 1) if (mod(a * x - b, modulus) === 0) out.push(x);
  return out;
}

export function systemResidues(r1: number, m1: number, r2: number, m2: number): number[] {
  const period = lcm(m1, m2);
  const out: number[] = [];
  for (let x = 0; x < period; x += 1) if (mod(x, m1) === r1 && mod(x, m2) === r2) out.push(x);
  return out;
}

export function difficulty(tier: 0 | 1 | 2, load = 0): NumCp008Difficulty {
  const score = tier + load;
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}

export function numericOptions(answer: number, wrongValues: readonly { value: number; misconceptionId: string }[], rng: Rng): { options: readonly NumCp008Option[]; correctIndex: number; canonicalAnswer: string } {
  const seen = new Set<number>([answer]);
  const wrong: { value: number; misconceptionId: string }[] = [];
  for (const candidate of wrongValues) {
    if (!Number.isSafeInteger(candidate.value) || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  for (let delta = 1; wrong.length < 3; delta += 1) {
    for (const value of [answer + delta, answer - delta]) {
      if (seen.has(value)) continue;
      seen.add(value);
      wrong.push({ value, misconceptionId: "NEARBY_UNVERIFIED_VALUE" });
      if (wrong.length === 3) break;
    }
  }
  const options = shuffle<NumCp008Option>([
    { value: String(answer), isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: String(item.value), isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: String(answer) };
}

export function textOptions(answer: string, distractors: readonly { value: string; misconceptionId: string }[], rng: Rng): { options: readonly NumCp008Option[]; correctIndex: number; canonicalAnswer: string } {
  const seen = new Set([answer]);
  const wrong = distractors.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  }).slice(0, 3);
  if (wrong.length !== 3) throw new Error("Need three distinct text distractors");
  const options = shuffle<NumCp008Option>([
    { value: answer, isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: answer };
}

export function explanation(coreConcept: string, strategy: string, steps: readonly string[], finalAnswer: string): NumCp008Explanation {
  return { coreConcept, strategy, steps, finalAnswer };
}

export function base(input: Omit<NumCp008Wave01Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp008Wave01Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-008",
    permanentQlId: null,
    locale: "en-IN",
    ...input,
    lifecycle: {
      permanentQlId: null,
      maturity: "EXECUTABLE_DISCOVERY_PROOF",
      reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      active: false,
      questionStudioDiscoverable: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    },
  };
}

export const sources = (family: string) => [family, "NUMBER-SYSTEM-DESIGN-CP008", "NUMBER-SYSTEM-SOURCE-AUDIT-REMAINDER-CONGRUENCE"] as const;
