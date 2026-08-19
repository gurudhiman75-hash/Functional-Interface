import {
  createRng,
  shuffle,
  mod,
  gcd,
  lcm,
  crtMany,
  systemSolutions,
  difficulty,
  numericOptions,
  textOptions,
  type Rng,
} from "../wave03/common.ts";
import type { NumCp008Option } from "../wave03/types.ts";
import type { NumCp008Wave04Package } from "./types.ts";

export { createRng, shuffle, mod, gcd, lcm, crtMany, systemSolutions, difficulty, numericOptions, textOptions, type Rng };

export function residueOptions(answer: number, modulus: number, candidates: readonly { value: number; misconceptionId: string }[], rng: Rng) {
  if (!Number.isSafeInteger(answer) || answer < 0 || answer >= modulus || modulus < 4) throw new Error("Invalid residue-option state");
  const seen = new Set<number>([answer]);
  const wrong: { value: number; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
    const value = mod(candidate.value, modulus);
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push({ value, misconceptionId: candidate.misconceptionId });
    if (wrong.length === 3) break;
  }
  for (let offset = 1; wrong.length < 3 && offset < modulus; offset += 1) {
    const value = mod(answer + offset, modulus);
    if (seen.has(value)) continue;
    seen.add(value);
    wrong.push({ value, misconceptionId: "VALID_RANGE_WRONG_RESIDUE" });
  }
  if (wrong.length !== 3) throw new Error("Need three distinct residue distractors");
  const options = shuffle<NumCp008Option>([
    { value: String(answer), isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: String(item.value), isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: String(answer) };
}

export function boundedNumericOptions(answer: number, lower: number, upper: number, candidates: readonly { value: number; misconceptionId: string }[], rng: Rng) {
  if (!Number.isSafeInteger(answer) || answer < lower || answer > upper || lower > upper) throw new Error("Invalid bounded-option state");
  const seen = new Set<number>([answer]);
  const wrong: { value: number; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
    if (!Number.isSafeInteger(candidate.value) || candidate.value < lower || candidate.value > upper || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  for (let delta = 1; wrong.length < 3 && delta <= upper - lower; delta += 1) {
    for (const value of [answer - delta, answer + delta]) {
      if (value < lower || value > upper || seen.has(value)) continue;
      seen.add(value);
      wrong.push({ value, misconceptionId: "IN_RANGE_UNVERIFIED_VALUE" });
      if (wrong.length === 3) break;
    }
  }
  if (wrong.length !== 3) throw new Error("Need three distinct bounded distractors");
  const options = shuffle<NumCp008Option>([
    { value: String(answer), isCorrect: true, misconceptionId: "CORRECT" },
    ...wrong.map((item) => ({ value: String(item.value), isCorrect: false, misconceptionId: item.misconceptionId })),
  ], rng);
  return { options, correctIndex: options.findIndex((option) => option.isCorrect), canonicalAnswer: String(answer) };
}

export function base(input: Omit<NumCp008Wave04Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp008Wave04Package {
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

export const sources = (family: string, fixture: string) => [
  family,
  fixture,
  "NUMBER-SYSTEM-DESIGN-CP008",
  "CP008-WAVE04-SOURCE-SATURATION-RECHECK",
] as const;

export function leastPositive(residue: number, period: number): number {
  const normalized = mod(residue, period);
  return normalized === 0 ? period : normalized;
}

export function countClassInRange(residue: number, period: number, lower: number, upper: number): number {
  const first = lower + mod(residue - lower, period);
  if (first > upper) return 0;
  return Math.floor((upper - first) / period) + 1;
}
