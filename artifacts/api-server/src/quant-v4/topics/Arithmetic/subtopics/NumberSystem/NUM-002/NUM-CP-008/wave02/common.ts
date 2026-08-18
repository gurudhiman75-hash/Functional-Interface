import type { NumCp008Difficulty, NumCp008Option, NumCp008Wave02Package } from "./types.ts";

export interface Rng {
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
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(values: readonly T[]) => values[Math.floor(next() * values.length)]!,
  };
}

export function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
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

function egcd(a: number, b: number): { g: number; x: number; y: number } {
  if (b === 0) return { g: Math.abs(a), x: a < 0 ? -1 : 1, y: 0 };
  const next = egcd(b, a % b);
  return { g: next.g, x: next.y, y: next.x - Math.trunc(a / b) * next.y };
}

export function inverse(a: number, modulus: number): number {
  const result = egcd(a, modulus);
  if (result.g !== 1) throw new Error(`No inverse for ${a} mod ${modulus}`);
  return mod(result.x, modulus);
}

export function crtPair(r1: number, m1: number, r2: number, m2: number): { residue: number; period: number } | null {
  const g = gcd(m1, m2);
  const difference = r2 - r1;
  if (difference % g !== 0) return null;
  const reducedM1 = m1 / g;
  const reducedM2 = m2 / g;
  const k = mod((difference / g) * inverse(mod(reducedM1, reducedM2), reducedM2), reducedM2);
  const period = lcm(m1, m2);
  return { residue: mod(r1 + m1 * k, period), period };
}

export function crtMany(constraints: readonly { residue: number; modulus: number }[]): { residue: number; period: number } | null {
  if (constraints.length === 0) throw new Error("Need at least one congruence");
  let current = { residue: mod(constraints[0]!.residue, constraints[0]!.modulus), period: constraints[0]!.modulus };
  for (const next of constraints.slice(1)) {
    const merged = crtPair(current.residue, current.period, mod(next.residue, next.modulus), next.modulus);
    if (!merged) return null;
    current = merged;
  }
  return current;
}

export function solutionsInRange(residue: number, modulus: number, lower: number, upper: number): number[] {
  const out: number[] = [];
  for (let value = lower; value <= upper; value += 1) if (mod(value, modulus) === residue) out.push(value);
  return out;
}

export function systemSolutions(constraints: readonly { residue: number; modulus: number }[], lower: number, upper: number): number[] {
  const out: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (constraints.every((constraint) => mod(value, constraint.modulus) === mod(constraint.residue, constraint.modulus))) out.push(value);
  }
  return out;
}

export function geometricSumMod(base: number, highestExponent: number, modulus: number): number {
  let sum = 1;
  let term = 1;
  for (let exponent = 1; exponent <= highestExponent; exponent += 1) {
    term = mod(term * base, modulus);
    sum = mod(sum + term, modulus);
  }
  return sum;
}

export function geometricSumVerifier(base: number, highestExponent: number, modulus: number): number {
  let sum = 0n;
  const b = BigInt(base);
  for (let exponent = 0; exponent <= highestExponent; exponent += 1) sum += b ** BigInt(exponent);
  return Number(sum % BigInt(modulus));
}

export function difficulty(tier: 0 | 1 | 2, load = 0): NumCp008Difficulty {
  const score = tier + load;
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}

export function numericOptions(answer: number, candidates: readonly { value: number; misconceptionId: string }[], rng: Rng) {
  const seen = new Set<number>([answer]);
  const wrong: { value: number; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
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

export function textOptions(answer: string, wrong: readonly { value: string; misconceptionId: string }[], rng: Rng) {
  const seen = new Set([answer]);
  const distractors = wrong.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  }).slice(0, 3);
  if (distractors.length !== 3) throw new Error("Need three distinct text distractors");
  const options = shuffle<NumCp008Option>([
    { value: answer, isCorrect: true, misconceptionId: "CORRECT" },
    ...distractors.map((item) => ({ value: item.value, isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: answer };
}

export function base(input: Omit<NumCp008Wave02Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp008Wave02Package {
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

export const sources = (family: string) => [family, "NUMBER-SYSTEM-DESIGN-CP008", "CP008-WAVE02-BOUNDED-INVERSE-STRUCTURED-SYSTEMS"] as const;
