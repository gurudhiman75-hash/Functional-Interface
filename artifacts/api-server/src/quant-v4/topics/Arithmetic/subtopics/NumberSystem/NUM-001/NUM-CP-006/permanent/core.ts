import type {
  NumCp006Difficulty,
  NumCp006Explanation,
  NumCp006Option,
} from "./types";

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
  bool(probability?: number): boolean;
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
    bool: (probability = 0.5) => next() < probability,
  };
}

export const abs = (value: bigint): bigint => value < 0n ? -value : value;

export function gcd(a: bigint, b: bigint): bigint {
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

export function lcm(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return abs((a / gcd(a, b)) * b);
}

export function gcdMany(values: readonly bigint[]): bigint {
  if (values.length === 0) throw new Error("gcdMany requires at least one value");
  return values.reduce((left, right) => gcd(left, right));
}

export function lcmMany(values: readonly bigint[]): bigint {
  if (values.length === 0) throw new Error("lcmMany requires at least one value");
  return values.reduce((left, right) => lcm(left, right), 1n);
}

export function primeFactors(value: bigint): Map<bigint, number> {
  let n = abs(value);
  const result = new Map<bigint, number>();
  let divisor = 2n;
  while (divisor * divisor <= n) {
    while (n % divisor === 0n) {
      result.set(divisor, (result.get(divisor) ?? 0) + 1);
      n /= divisor;
    }
    divisor += divisor === 2n ? 1n : 2n;
  }
  if (n > 1n) result.set(n, 1);
  return result;
}

export function factorText(value: bigint): string {
  const factors = [...primeFactors(value)];
  if (factors.length === 0) return String(value);
  return factors.map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

export function divisors(value: bigint): bigint[] {
  const n = abs(value);
  const result: bigint[] = [];
  for (let divisor = 1n; divisor * divisor <= n; divisor += 1n) {
    if (n % divisor !== 0n) continue;
    result.push(divisor);
    if (divisor * divisor !== n) result.push(n / divisor);
  }
  return result.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
}

export function countCoprimeFactorPairs(value: bigint): bigint {
  const factors = divisors(value);
  let count = 0n;
  for (const left of factors) {
    if (left > value / left) break;
    const right = value / left;
    if (left * right === value && gcd(left, right) === 1n) count += 1n;
  }
  return count;
}

export function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const output = [...values];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.int(0, index);
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

export interface WrongOption {
  readonly value: string;
  readonly misconceptionId: string;
  readonly analysis: string;
}

export function makeOptions(
  correctValue: string,
  wrongCandidates: readonly WrongOption[],
  rng: Rng,
): Readonly<{ options: readonly NumCp006Option[]; correctIndex: number; canonicalAnswer: string }> {
  const seen = new Set<string>([correctValue]);
  const wrong: WrongOption[] = [];
  for (const candidate of wrongCandidates) {
    if (!candidate.value.trim() || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrong.push(candidate);
    if (wrong.length === 3) break;
  }
  if (wrong.length !== 3) {
    throw new Error(`Expected three distinct distractors for ${correctValue}; received ${wrong.length}`);
  }
  const options = shuffle<NumCp006Option>([
    {
      value: correctValue,
      isCorrect: true,
      misconceptionId: "CORRECT",
      analysis: "This option satisfies every stated HCF/LCM condition.",
    },
    ...wrong.map((candidate) => ({
      value: candidate.value,
      isCorrect: false,
      misconceptionId: candidate.misconceptionId,
      analysis: candidate.analysis,
    })),
  ], rng);
  return Object.freeze({
    options: Object.freeze(options),
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer: correctValue,
  });
}

export function numericOptions(
  answer: bigint,
  wrongValues: readonly { readonly value: bigint; readonly misconceptionId: string; readonly analysis: string }[],
  rng: Rng,
  suffix = "",
): ReturnType<typeof makeOptions> {
  const candidates: WrongOption[] = [];
  const seen = new Set<string>([`${answer}${suffix}`]);
  for (const wrong of wrongValues) {
    if (wrong.value < 0n) continue;
    const value = `${wrong.value}${suffix}`;
    if (seen.has(value)) continue;
    seen.add(value);
    candidates.push({ value, misconceptionId: wrong.misconceptionId, analysis: wrong.analysis });
  }
  let offset = 1n;
  while (candidates.length < 3) {
    const nearby = answer + offset;
    const value = `${nearby}${suffix}`;
    if (!seen.has(value)) {
      seen.add(value);
      candidates.push({
        value,
        misconceptionId: "NEARBY_UNVERIFIED",
        analysis: "This nearby value does not satisfy all required divisibility conditions.",
      });
    }
    offset += 1n;
  }
  return makeOptions(`${answer}${suffix}`, candidates.slice(0, 3), rng);
}

export function explanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  speedMethod: string,
  finalAnswer: string,
  commonTraps: readonly string[],
): NumCp006Explanation {
  if (commonTraps.length !== 3) throw new Error("Every explanation requires exactly three traps");
  return Object.freeze({
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze([...steps]),
    examSpeedMethod: speedMethod,
    commonTraps: Object.freeze([...commonTraps]),
    finalAnswer: `Final answer: ${finalAnswer}`,
  });
}

export function difficulty(
  values: readonly bigint[],
  flags: Readonly<{
    inverse?: boolean;
    remainder?: boolean;
    bounded?: boolean;
    rational?: boolean;
    reasoning?: boolean;
    caselet?: boolean;
  }> = {},
): NumCp006Difficulty {
  const maximum = Math.max(...values.map((value) => Number(abs(value))));
  let score = 0;
  if (maximum > 150) score += 1;
  if (maximum > 1200) score += 1;
  if (values.length >= 3) score += 1;
  if (flags.inverse) score += 1;
  if (flags.remainder) score += 1;
  if (flags.bounded) score += 1;
  if (flags.rational) score += 1;
  if (flags.reasoning) score += 1;
  if (flags.caselet) score += 1;
  return score <= 1 ? "EASY" : score <= 3 ? "MEDIUM" : "HARD";
}

export const sourceAncestry = (family: string): readonly string[] => Object.freeze([
  family,
  "NUM-CP-006-SOURCE-GAP-AND-MERGE-SPLIT-AUDIT",
  "NUMBER-SYSTEM-DESIGN-CP006",
]);

export function formatList(values: readonly bigint[]): string {
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")} and ${values.at(-1)}`;
}

export interface Fraction {
  readonly numerator: bigint;
  readonly denominator: bigint;
}

export function reduceFraction(numerator: bigint, denominator: bigint): Fraction {
  if (denominator === 0n) throw new Error("Fraction denominator cannot be zero");
  const sign = denominator < 0n ? -1n : 1n;
  const divisor = gcd(numerator, denominator);
  return Object.freeze({
    numerator: sign * numerator / divisor,
    denominator: sign * denominator / divisor,
  });
}

export function fractionText(fraction: Fraction): string {
  const reduced = reduceFraction(fraction.numerator, fraction.denominator);
  return reduced.denominator === 1n
    ? `${reduced.numerator}`
    : `${reduced.numerator}/${reduced.denominator}`;
}

export function fractionEquals(left: Fraction, right: Fraction): boolean {
  return left.numerator * right.denominator === right.numerator * left.denominator;
}

export function fractionHcf(values: readonly Fraction[]): Fraction {
  const numerators = values.map((value) => abs(value.numerator));
  const denominators = values.map((value) => abs(value.denominator));
  return reduceFraction(gcdMany(numerators), lcmMany(denominators));
}

export function fractionLcm(values: readonly Fraction[]): Fraction {
  const numerators = values.map((value) => abs(value.numerator));
  const denominators = values.map((value) => abs(value.denominator));
  return reduceFraction(lcmMany(numerators), gcdMany(denominators));
}

export function euclideanRows(a: bigint, b: bigint): readonly { dividend: bigint; divisor: bigint; quotient: bigint; remainder: bigint }[] {
  let dividend = abs(a);
  let divisor = abs(b);
  if (dividend < divisor) [dividend, divisor] = [divisor, dividend];
  const rows: { dividend: bigint; divisor: bigint; quotient: bigint; remainder: bigint }[] = [];
  while (divisor !== 0n) {
    const quotient = dividend / divisor;
    const remainder = dividend % divisor;
    rows.push({ dividend, divisor, quotient, remainder });
    [dividend, divisor] = [divisor, remainder];
  }
  return Object.freeze(rows);
}
