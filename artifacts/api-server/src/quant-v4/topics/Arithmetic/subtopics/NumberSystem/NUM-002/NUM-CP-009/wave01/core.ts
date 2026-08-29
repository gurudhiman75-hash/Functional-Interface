import type {
  NumCp009Difficulty,
  NumCp009Explanation,
  NumCp009Option,
  NumCp009Wave01Package,
} from "./types.ts";

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
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(0, index);
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

export function mod(value: number, modulus: number): number {
  if (!Number.isSafeInteger(value) || !Number.isSafeInteger(modulus) || modulus <= 0) {
    throw new Error("Invalid modulo input");
  }
  return ((value % modulus) + modulus) % modulus;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

export function powMod(base: number, exponent: number, modulus: number): number {
  if (!Number.isSafeInteger(exponent) || exponent < 0) throw new Error("Invalid exponent");
  let result = 1n;
  let factor = BigInt(mod(base, modulus));
  let power = BigInt(exponent);
  const m = BigInt(modulus);
  while (power > 0n) {
    if ((power & 1n) === 1n) result = (result * factor) % m;
    factor = (factor * factor) % m;
    power >>= 1n;
  }
  return Number(result);
}

export function powModVerifier(base: number, exponent: number, modulus: number): number {
  let value = 1n;
  const m = BigInt(modulus);
  const b = BigInt(mod(base, modulus));
  for (let index = 0; index < exponent; index += 1) value = (value * b) % m;
  return Number(value);
}

export const UNIT_DIGIT_CYCLES: Readonly<Record<number, readonly number[]>> = Object.freeze({
  0: Object.freeze([0]),
  1: Object.freeze([1]),
  2: Object.freeze([2, 4, 8, 6]),
  3: Object.freeze([3, 9, 7, 1]),
  4: Object.freeze([4, 6]),
  5: Object.freeze([5]),
  6: Object.freeze([6]),
  7: Object.freeze([7, 9, 3, 1]),
  8: Object.freeze([8, 4, 2, 6]),
  9: Object.freeze([9, 1]),
});

export function unitDigitByCycle(base: number, exponent: number): number {
  if (exponent === 0) return 1;
  const lastDigit = mod(base, 10);
  const cycle = UNIT_DIGIT_CYCLES[lastDigit]!;
  const position = mod(exponent - 1, cycle.length);
  return cycle[position]!;
}

export function bruteUnitCycleLength(lastDigit: number): number {
  const target = mod(lastDigit, 10);
  for (let length = 1; length <= 4; length += 1) {
    let valid = true;
    for (let exponent = 1; exponent <= 16; exponent += 1) {
      if (powModVerifier(target, exponent, 10) !== powModVerifier(target, exponent + length, 10)) {
        valid = false;
        break;
      }
    }
    if (valid) return length;
  }
  throw new Error(`No unit-digit cycle found for ${lastDigit}`);
}

export function multiplicativeOrder(base: number, modulus: number): number {
  if (gcd(base, modulus) !== 1) throw new Error("Multiplicative order requires coprime inputs");
  let value = 1;
  for (let exponent = 1; exponent <= modulus * 2; exponent += 1) {
    value = mod(value * mod(base, modulus), modulus);
    if (value === 1) return exponent;
  }
  throw new Error(`Order not found for ${base} mod ${modulus}`);
}

export function difficulty(score: number): NumCp009Difficulty {
  if (score <= 1) return "EASY";
  if (score <= 3) return "MEDIUM";
  return "HARD";
}

function uniqueWrongValues(answer: string, candidates: readonly { value: string; misconceptionId: string }[]): { value: string; misconceptionId: string }[] {
  const seen = new Set([answer]);
  const output: { value: string; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    output.push(candidate);
    if (output.length === 3) break;
  }
  return output;
}

export function optionsWithSlot(
  answer: string,
  wrongCandidates: readonly { value: string; misconceptionId: string }[],
  rng: Rng,
  seed: number,
): { options: readonly NumCp009Option[]; correctIndex: number; canonicalAnswer: string } {
  const wrong = uniqueWrongValues(answer, wrongCandidates);
  if (wrong.length < 3) throw new Error(`Need three distinct distractors for answer ${answer}`);
  const shuffledWrong = shuffle(wrong, rng);
  const correctIndex = mod(seed, 4);
  const options: NumCp009Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push({ value: answer, isCorrect: true, misconceptionId: "CORRECT" });
    } else {
      const candidate = shuffledWrong[wrongIndex++]!;
      options.push({ value: candidate.value, isCorrect: false, misconceptionId: candidate.misconceptionId });
    }
  }
  return { options: Object.freeze(options), correctIndex, canonicalAnswer: answer };
}

export function numericOptions(answer: number, candidates: readonly { value: number; misconceptionId: string }[], rng: Rng, seed: number) {
  const expanded = [...candidates];
  for (let delta = 1; expanded.length < 8; delta += 1) {
    expanded.push({ value: answer + delta, misconceptionId: "NEARBY_UNVERIFIED_VALUE" });
    if (answer - delta >= 0) expanded.push({ value: answer - delta, misconceptionId: "NEARBY_UNVERIFIED_VALUE" });
  }
  return optionsWithSlot(String(answer), expanded.map((item) => ({ value: String(item.value), misconceptionId: item.misconceptionId })), rng, seed);
}

export function fixedWidthOptions(answer: number, width: number, candidates: readonly { value: number; misconceptionId: string }[], rng: Rng, seed: number) {
  const format = (value: number) => String(mod(value, 10 ** width)).padStart(width, "0");
  const answerText = format(answer);
  const expanded = [...candidates];
  for (let delta = 1; expanded.length < 8; delta += 1) {
    expanded.push({ value: mod(answer + delta, 10 ** width), misconceptionId: "NEARBY_TERMINAL_VALUE" });
    expanded.push({ value: mod(answer - delta, 10 ** width), misconceptionId: "NEARBY_TERMINAL_VALUE" });
  }
  return optionsWithSlot(answerText, expanded.map((item) => ({ value: format(item.value), misconceptionId: item.misconceptionId })), rng, seed);
}

export function explanation(coreConcept: string, strategy: string, steps: readonly string[], finalAnswer: string): NumCp009Explanation {
  return { coreConcept, strategy, steps, finalAnswer };
}

export function base(input: Omit<NumCp009Wave01Package, "packageId" | "checkpointId" | "permanentQlId" | "locale" | "lifecycle">): NumCp009Wave01Package {
  return {
    packageId: "NUM-002",
    checkpointId: "NUM-CP-009",
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

export const sources = (family: string) => Object.freeze([
  family,
  "NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
  "NUM-002-COMPLETE-CHECKPOINT-DESIGN:NUM-CP-009",
  "QUANT-V3:NS-LASTDIG-001:LEGACY-EVIDENCE",
]);
