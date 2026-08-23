import { createHash } from "node:crypto";

import type {
  NumCp011Wave03Difficulty,
  NumCp011Wave03Option,
  NumCp011Wave03Package,
  NumCp011Wave03PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE03_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    this.state = (Math.imul(1664525, this.state) + 1013904223) >>> 0;
    return this.state / 0x100000000;
  }

  int(min: number, max: number) {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.int(0, values.length - 1)]!;
  }
}

interface Distractor {
  readonly value: number;
  readonly misconceptionId: string;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }))
    .digest("hex");
}

function shuffle<T>(values: readonly T[], rng: Rng): T[] {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function optionsFor(correct: number, distractors: readonly Distractor[], rng: Rng): readonly NumCp011Wave03Option[] {
  const values: Array<{ value: number; misconceptionId: string }> = [
    { value: correct, misconceptionId: "CORRECT" },
  ];

  for (const distractor of distractors) {
    if (
      Number.isSafeInteger(distractor.value)
      && distractor.value >= 0
      && !values.some((item) => item.value === distractor.value)
    ) {
      values.push({ ...distractor });
    }
    if (values.length === 4) break;
  }

  let delta = 1;
  while (values.length < 4) {
    for (const candidate of [correct + delta, Math.max(0, correct - delta)]) {
      if (!values.some((item) => item.value === candidate)) {
        values.push({ value: candidate, misconceptionId: "NEARBY_ZERO_COUNT" });
      }
      if (values.length === 4) break;
    }
    delta += 1;
  }

  return Object.freeze(shuffle(values, rng).map((item) => Object.freeze({
    value: String(item.value),
    isCorrect: item.value === correct,
    misconceptionId: item.misconceptionId,
  })));
}

function valuationInteger(value: number, prime: number) {
  let remaining = value;
  let exponent = 0;
  while (remaining > 0 && remaining % prime === 0) {
    exponent += 1;
    remaining /= prime;
  }
  return exponent;
}

function valuationFactorial(n: number, prime: number) {
  let exponent = 0;
  let power = prime;
  while (power <= n) {
    exponent += Math.floor(n / power);
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return exponent;
}

function factorize(value: number) {
  let remaining = value;
  const factors: Array<readonly [number, number]> = [];
  for (let prime = 2; prime * prime <= remaining; prime += 1) {
    if (remaining % prime !== 0) continue;
    let exponent = 0;
    while (remaining % prime === 0) {
      exponent += 1;
      remaining /= prime;
    }
    factors.push([prime, exponent] as const);
  }
  if (remaining > 1) factors.push([remaining, 1] as const);
  return factors;
}

function factorizationText(factors: readonly (readonly [number, number])[]) {
  return factors.map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp011Wave03PrototypeId;
  seed: number;
  difficulty: NumCp011Wave03Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  correct: number;
  verifier: number;
  distractors: readonly Distractor[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp011Wave03Package {
  const optionRng = new Rng(input.seed * 130363 + Number(input.prototypeId.slice(-3)));
  const options = optionsFor(input.correct, input.distractors, optionRng);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${input.prototypeId}: correct option missing`);

  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-011",
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN",
    difficulty: input.difficulty,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    options,
    correctIndex,
    canonicalAnswer: String(input.correct),
    verifierAnswer: String(input.verifier),
    hiddenState: Object.freeze({ ...input.state }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.state),
    explanation: Object.freeze({
      coreConcept: input.concept,
      strategy: input.strategy,
      steps: Object.freeze([...input.steps]),
      finalAnswer: String(input.correct),
    }),
    sourceAncestry: Object.freeze([...input.sourceAncestry]),
    prototypeAncestry: Object.freeze([input.prototypeId]),
    lifecycle,
  });
}

function p012(seed: number): NumCp011Wave03Package {
  const rng = new Rng(seed * 61 + 12);
  const decimal = seed % 2 === 0;
  const base = decimal ? 10 : rng.pick([8, 12, 18, 20, 24, 40, 45, 72] as const);
  const n = rng.int(25, 85);
  const gap = rng.int(6, Math.min(18, n - 2));
  const m = n - gap;
  const factors = factorize(base);

  const rows = factors.map(([prime, required]) => {
    const numerator = valuationFactorial(n, prime);
    const denominator = valuationFactorial(m, prime);
    const surviving = numerator - denominator;
    return {
      prime,
      required,
      numerator,
      denominator,
      surviving,
      groups: Math.floor(surviving / required),
    };
  });
  const correct = Math.min(...rows.map((row) => row.groups));

  const verifierValuations = new Map<number, number>();
  for (const [prime] of factors) verifierValuations.set(prime, 0);
  for (let value = m + 1; value <= n; value += 1) {
    for (const [prime] of factors) {
      verifierValuations.set(prime, verifierValuations.get(prime)! + valuationInteger(value, prime));
    }
  }
  const verifier = Math.min(...factors.map(([prime, required]) =>
    Math.floor(verifierValuations.get(prime)! / required)));

  const numeratorOnly = Math.min(...factors.map(([prime, required]) =>
    Math.floor(valuationFactorial(n, prime) / required)));
  const rawMinimum = Math.min(...rows.map((row) => row.surviving));
  const maximumCapacity = Math.max(...rows.map((row) => row.groups));

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-012",
    seed,
    difficulty: decimal ? "MEDIUM" : "HARD",
    answerSemantic: "TRAILING_ZERO_COUNT_OF_FACTORIAL_RATIO",
    representation: decimal ? "BASE10_FACTORIAL_RATIO" : "GENERAL_BASE_FACTORIAL_RATIO",
    stem: decimal
      ? `How many trailing zeroes are there in the integer ${n}!/${m}!?`
      : `When the integer ${n}!/${m}! is written in base ${base}, how many trailing zeroes does it have?`,
    correct,
    verifier,
    distractors: [
      { value: numeratorOnly, misconceptionId: "IGNORE_DENOMINATOR_CANCELLATION" },
      { value: rawMinimum, misconceptionId: "IGNORE_BASE_PRIME_EXPONENTS" },
      { value: maximumCapacity, misconceptionId: "USE_NON_LIMITING_PRIME" },
    ],
    state: { decimal, base, n, m, gap, factors, rows, correct },
    concept: decimal
      ? "Trailing zeroes of a factorial ratio are counted after denominator factors cancel; each decimal zero then needs one surviving pair of 2 and 5."
      : `For a factorial ratio in base ${base}, first subtract denominator prime valuations, then group the surviving factors according to ${factorizationText(factors)}.`,
    strategy: `Compute each required prime valuation in ${n}! and ${m}!, subtract to get the surviving factors in the integer ratio, divide by the amount needed for one base-${base} zero, and take the limiting count.`,
    steps: [
      ...rows.map((row) => `For prime ${row.prime}: ${row.numerator} − ${row.denominator} = ${row.surviving} factors survive; ${row.required} per zero gives ${row.groups} complete groups.`),
      `The limiting complete-group count is ${correct}, so the ratio has ${correct} trailing zeroes in base ${base}.`,
    ],
    sourceAncestry: ["SOURCE_GAP:FACTORIAL_RATIO_TRAILING_ZEROES", "DESIGN:FACTORIAL_RATIO_VALUATION"],
  });
}

function p013(seed: number): NumCp011Wave03Package {
  const rng = new Rng(seed * 67 + 13);
  const decimal = seed % 2 === 1;
  const base = decimal ? 10 : rng.pick([8, 12, 18, 20, 24, 40] as const);
  const baseFactors = factorize(base);
  const termCount = rng.int(3, 5);
  const terms: Array<{ coefficient: number; exponent: number }> = [];

  for (let index = 0; index < termCount; index += 1) {
    const coefficient = rng.pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20] as const);
    const exponent = rng.int(1, 4);
    terms.push({ coefficient, exponent });
  }

  const capacities = baseFactors.map(([prime, required]) => {
    const total = terms.reduce((sum, term) =>
      sum + valuationInteger(term.coefficient, prime) * term.exponent, 0);
    return { prime, required, total, groups: Math.floor(total / required) };
  });
  const correct = Math.min(...capacities.map((row) => row.groups));

  let exactProduct = 1n;
  for (const term of terms) {
    exactProduct *= BigInt(term.coefficient) ** BigInt(term.exponent);
  }
  const baseBig = BigInt(base);
  let reduced = exactProduct;
  let verifier = 0;
  while (reduced !== 0n && reduced % baseBig === 0n) {
    verifier += 1;
    reduced /= baseBig;
  }

  const countDivisibleTerms = terms.filter((term) => term.coefficient % base === 0).length;
  const rawMinimum = Math.min(...capacities.map((row) => row.total));
  const maxGroups = Math.max(...capacities.map((row) => row.groups));
  const expression = terms.map((term) => term.exponent === 1
    ? `${term.coefficient}`
    : `${term.coefficient}^${term.exponent}`).join(" × ");

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-013",
    seed,
    difficulty: decimal ? "MEDIUM" : "HARD",
    answerSemantic: "TRAILING_ZERO_COUNT_OF_STRUCTURED_PRODUCT",
    representation: decimal ? "BASE10_STRUCTURED_PRODUCT" : "GENERAL_BASE_STRUCTURED_PRODUCT",
    stem: decimal
      ? `How many trailing zeroes are there in the product ${expression}?`
      : `When the product ${expression} is written in base ${base}, how many trailing zeroes does it have?`,
    correct,
    verifier,
    distractors: [
      { value: countDivisibleTerms, misconceptionId: "COUNT_WHOLE_BASE_DIVISIBLE_TERMS" },
      { value: rawMinimum, misconceptionId: "IGNORE_BASE_PRIME_EXPONENTS" },
      { value: maxGroups, misconceptionId: "USE_NON_LIMITING_PRIME" },
    ],
    state: { decimal, base, baseFactors, terms, capacities, correct },
    concept: decimal
      ? "A decimal trailing zero needs one complete factor 10, so the total factors of 2 and 5 across every powered term must be balanced."
      : `A trailing zero in base ${base} needs one complete factor ${base} = ${factorizationText(baseFactors)}, assembled from prime factors contributed by all terms.`,
    strategy: `Add each base-prime valuation across the full structured product, convert those totals into complete copies of base ${base}, then use the limiting prime capacity.`,
    steps: [
      ...capacities.map((row) => `Prime ${row.prime} contributes ${row.total} factors in total; ${row.required} are needed per zero, allowing ${row.groups} complete groups.`),
      `The limiting group count is ${correct}, so the product has ${correct} trailing zeroes in base ${base}.`,
    ],
    sourceAncestry: ["SOURCE_GAP:EXPLICIT_PRODUCT_TRAILING_ZEROES", "SSC_GUIDE:TRAILING_ZERO_PRIME_PAIRS"],
  });
}

export function generateNumCp011Wave03(
  prototypeId: NumCp011Wave03PrototypeId,
  seed: number,
): NumCp011Wave03Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 03 seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP011-PROT-012": return p012(seed);
    case "NUM-CP011-PROT-013": return p013(seed);
  }
}
