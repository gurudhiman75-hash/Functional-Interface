import { createHash } from "node:crypto";

import type {
  NumCp011Difficulty,
  NumCp011Option,
  NumCp011Wave01Package,
  NumCp011Wave01PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE01_REVIEW_REQUIRED" as const,
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

function numericOptions(correct: number, distractors: readonly Distractor[], rng: Rng): readonly NumCp011Option[] {
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
        values.push({ value: candidate, misconceptionId: "NEARBY_EXPONENT" });
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

function packageFrom(input: Readonly<{
  prototypeId: NumCp011Wave01PrototypeId;
  seed: number;
  difficulty: NumCp011Difficulty;
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
}>): NumCp011Wave01Package {
  if (!Number.isSafeInteger(input.correct) || input.correct < 0) {
    throw new Error(`${input.prototypeId}: invalid canonical answer`);
  }
  if (!Number.isSafeInteger(input.verifier) || input.verifier < 0) {
    throw new Error(`${input.prototypeId}: invalid verifier answer`);
  }

  const optionRng = new Rng(input.seed * 7919 + Number(input.prototypeId.slice(-3)));
  const options = numericOptions(input.correct, input.distractors, optionRng);
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

function valuationInteger(value: number, prime: number) {
  let remaining = value;
  let exponent = 0;
  while (remaining > 0 && remaining % prime === 0) {
    exponent += 1;
    remaining /= prime;
  }
  return exponent;
}

function valuationBigInt(value: bigint, prime: bigint) {
  let remaining = value;
  let exponent = 0;
  while (remaining > 0n && remaining % prime === 0n) {
    exponent += 1;
    remaining /= prime;
  }
  return exponent;
}

function valuationFactorialLegendre(n: number, prime: number) {
  let power = prime;
  let exponent = 0;
  while (power <= n) {
    exponent += Math.floor(n / power);
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return exponent;
}

function valuationFactorialByEnumeration(n: number, prime: number) {
  let exponent = 0;
  for (let value = 2; value <= n; value += 1) {
    exponent += valuationInteger(value, prime);
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

function legendreTerms(n: number, prime: number) {
  const terms: number[] = [];
  let power = prime;
  while (power <= n) {
    terms.push(Math.floor(n / power));
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return terms;
}

function p001(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 17 + 1);
  const prime = rng.pick([2, 3, 5, 7] as const);
  const exponents = [rng.int(1, 5), rng.int(1, 4), rng.int(1, 3)] as const;
  const cofactors = exponents.map(() => {
    const allowed = Array.from({ length: 9 }, (_, index) => index + 1).filter((value) => value % prime !== 0);
    return rng.pick(allowed);
  });
  const terms = exponents.map((exponent, index) => (prime ** exponent) * cofactors[index]!);
  const correct = terms.reduce((sum, term) => sum + valuationInteger(term, prime), 0);
  const exactProduct = terms.reduce((product, term) => product * BigInt(term), 1n);
  const verifier = valuationBigInt(exactProduct, BigInt(prime));
  const largestSingle = Math.max(...terms.map((term) => valuationInteger(term, prime)));
  const containingPrime = terms.filter((term) => term % prime === 0).length;

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-001",
    seed,
    difficulty: correct >= 9 ? "MEDIUM" : "EASY",
    answerSemantic: "PRIME_VALUATION",
    representation: "STRUCTURED_PRODUCT",
    stem: `What is the exponent of ${prime} in the prime factorisation of ${terms.join(" × ")}?`,
    correct,
    verifier,
    distractors: [
      { value: largestSingle, misconceptionId: "TAKE_LARGEST_TERM_ONLY" },
      { value: containingPrime, misconceptionId: "COUNT_DIVISIBLE_FACTORS_ONLY" },
      { value: Math.max(0, correct - exponents[2]), misconceptionId: "OMIT_ONE_FACTOR" },
    ],
    state: { prime, exponents, cofactors, terms, correct },
    concept: "For a product, the exponent of a prime is the sum of that prime's exponents in all factors.",
    strategy: `Find how many factors of ${prime} each displayed term contributes, then add those contributions rather than multiplying the exponents.`,
    steps: [
      `The three terms contribute ${exponents[0]}, ${exponents[1]} and ${exponents[2]} factors of ${prime}.`,
      `Therefore the total exponent is ${exponents[0]} + ${exponents[1]} + ${exponents[2]} = ${correct}.`,
    ],
    sourceAncestry: ["DESIGN:DIRECT_PRODUCT_VALUATION", "V2:ns_highest_power_dividing"],
  });
}

function p002(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 19 + 2);
  const prime = rng.pick([2, 3, 5, 7] as const);
  const n = rng.int(20, 120);
  const terms = legendreTerms(n, prime);
  const correct = valuationFactorialLegendre(n, prime);
  const verifier = valuationFactorialByEnumeration(n, prime);
  const firstLayerOnly = Math.floor(n / prime);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-002",
    seed,
    difficulty: terms.length >= 3 ? "MEDIUM" : "EASY",
    answerSemantic: "PRIME_VALUATION",
    representation: "FACTORIAL_VALUATION",
    stem: `Find the largest integer k such that ${prime}^k divides ${n}!.`,
    correct,
    verifier,
    distractors: [
      { value: firstLayerOnly, misconceptionId: "COUNT_MULTIPLES_OF_P_ONLY" },
      { value: terms.slice(0, 2).reduce((sum, value) => sum + value, 0), misconceptionId: "STOP_LEGENDRE_TOO_EARLY" },
      { value: Math.max(0, correct - 1), misconceptionId: "OFF_BY_ONE_EXPONENT" },
    ],
    state: { prime, n, terms, correct },
    concept: `The exponent of ${prime} in ${n}! is found by counting multiples of ${prime}, then the extra factors contributed by multiples of higher powers of ${prime}.`,
    strategy: `Use the factorial valuation sum floor(n/${prime}) + floor(n/${prime}^2) + ... until the denominator exceeds n.`,
    steps: [
      `The non-zero contributions are ${terms.join(" + ")}.`,
      `Their sum is ${terms.join(" + ")} = ${correct}, so the greatest possible exponent k is ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_highest_power_dividing", "ALIAS:ns_highest_power_in_factorial", "DESIGN:FACTORIAL_VALUATION"],
  });
}

function p003(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 23 + 3);
  const prime = rng.pick([2, 3, 5, 7] as const);
  const n = rng.int(30, 100);
  const gap = rng.int(5, Math.min(15, n - 2));
  const m = n - gap;
  const nValuation = valuationFactorialLegendre(n, prime);
  const mValuation = valuationFactorialLegendre(m, prime);
  const correct = nValuation - mValuation;
  let verifier = 0;
  for (let value = m + 1; value <= n; value += 1) verifier += valuationInteger(value, prime);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-003",
    seed,
    difficulty: gap >= 10 ? "MEDIUM" : "EASY",
    answerSemantic: "PRIME_VALUATION",
    representation: "FACTORIAL_RATIO",
    stem: `What is the exponent of ${prime} in the integer ${n}!/${m}!?`,
    correct,
    verifier,
    distractors: [
      { value: nValuation, misconceptionId: "IGNORE_DENOMINATOR_VALUATION" },
      { value: mValuation, misconceptionId: "USE_DENOMINATOR_VALUATION" },
      { value: Math.max(0, Math.floor(n / prime) - Math.floor(m / prime)), misconceptionId: "COUNT_FIRST_POWER_ONLY" },
    ],
    state: { prime, n, m, gap, nValuation, mValuation, correct },
    concept: "Prime valuation is subtractive across an exact integer ratio: v_p(A/B) = v_p(A) − v_p(B).",
    strategy: `Compute the exponent of ${prime} in ${n}! and ${m}! separately, then subtract because the denominator cancels its prime factors from the numerator.`,
    steps: [
      `v_${prime}(${n}!) = ${nValuation} and v_${prime}(${m}!) = ${mValuation}.`,
      `So v_${prime}(${n}!/${m}!) = ${nValuation} − ${mValuation} = ${correct}.`,
    ],
    sourceAncestry: ["DESIGN:FACTORIAL_RATIO_VALUATION", "SOURCE_GAP:FACTORIAL_RATIO"],
  });
}

function p004(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 29 + 4);
  const base = rng.pick([6, 12, 18, 20, 24, 45, 72] as const);
  const n = rng.int(35, 120);
  const factors = factorize(base);
  const canonicalRows = factors.map(([prime, required]) => {
    const available = valuationFactorialLegendre(n, prime);
    return { prime, required, available, quotient: Math.floor(available / required) };
  });
  const verifierRows = factors.map(([prime, required]) => ({
    prime,
    required,
    available: valuationFactorialByEnumeration(n, prime),
  }));
  const correct = Math.min(...canonicalRows.map((row) => row.quotient));
  const verifier = Math.min(...verifierRows.map((row) => Math.floor(row.available / row.required)));
  const ignoreBaseExponents = Math.min(...canonicalRows.map((row) => row.available));
  const takeMaximum = Math.max(...canonicalRows.map((row) => row.quotient));
  const sumQuotients = canonicalRows.reduce((sum, row) => sum + row.quotient, 0);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-004",
    seed,
    difficulty: factors.some(([, exponent]) => exponent > 1) ? "HARD" : "MEDIUM",
    answerSemantic: "HIGHEST_COMPOSITE_POWER_EXPONENT",
    representation: "COMPOSITE_POWER_VALUATION_TABLE",
    stem: `Find the largest integer k such that ${base}^k divides ${n}!.`,
    correct,
    verifier,
    distractors: [
      { value: ignoreBaseExponents, misconceptionId: "IGNORE_BASE_PRIME_EXPONENTS" },
      { value: takeMaximum, misconceptionId: "TAKE_ABUNDANT_PRIME_INSTEAD_OF_LIMITING" },
      { value: sumQuotients, misconceptionId: "ADD_PRIME_CAPACITIES" },
    ],
    state: { base, n, factors, canonicalRows, correct },
    concept: "For a composite base, every prime factor of the base must be supplied together, so the limiting valuation ratio determines the highest power.",
    strategy: `Factor ${base} as ${factorizationText(factors)}, find each required prime valuation in ${n}!, divide by the exponent required for one copy of ${base}, and take the minimum.`,
    steps: [
      ...canonicalRows.map((row) => `For prime ${row.prime}: floor(${row.available}/${row.required}) = ${row.quotient} complete copies are available.`),
      `The limiting value is ${correct}, so ${base}^${correct} is the highest power of ${base} guaranteed to divide ${n}!.`,
    ],
    sourceAncestry: ["V2:ns_highest_power_dividing", "DESIGN:HIGHEST_COMPOSITE_POWER"],
  });
}

function p005(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 31 + 5);
  const n = rng.int(25, 220);
  const fiveTerms = legendreTerms(n, 5);
  const correct = valuationFactorialLegendre(n, 5);
  const verifier = Math.min(
    valuationFactorialByEnumeration(n, 2),
    valuationFactorialByEnumeration(n, 5),
  );
  const firstLayerOnly = Math.floor(n / 5);
  const twos = valuationFactorialLegendre(n, 2);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-005",
    seed,
    difficulty: fiveTerms.length >= 3 ? "MEDIUM" : "EASY",
    answerSemantic: "TRAILING_ZERO_COUNT",
    representation: "BASE10_FACTORIAL",
    stem: `How many trailing zeroes are there in ${n}!?`,
    correct,
    verifier,
    distractors: [
      { value: firstLayerOnly, misconceptionId: "COUNT_MULTIPLES_OF_FIVE_ONLY" },
      { value: twos, misconceptionId: "COUNT_TWOS_INSTEAD_OF_PAIRS" },
      { value: Math.max(0, correct - 1), misconceptionId: "MISS_HIGHER_POWER_OF_FIVE" },
    ],
    state: { n, fiveTerms, twos, correct },
    concept: "Each decimal trailing zero needs one factor 10 = 2 × 5; in a factorial, factors of 2 are more abundant, so factors of 5 limit the number of pairs.",
    strategy: "Count factors of 5 in the factorial, including the extra factors contributed by multiples of 25, 125 and higher powers when they are present.",
    steps: [
      `The factor-of-5 contributions are ${fiveTerms.join(" + ")}.`,
      `Their sum is ${correct}; there are enough factors of 2 to pair with them, so ${n}! has ${correct} trailing zeroes.`,
    ],
    sourceAncestry: ["SSC_GUIDE:TRAILING_ZERO_PRIME_PAIRS", "V2:ns_trailing_zeroes", "ALIAS:ns_trailing_zeros_factorial"],
  });
}

function p006(seed: number): NumCp011Wave01Package {
  const rng = new Rng(seed * 37 + 6);
  const base = rng.pick([8, 12, 18, 20, 24, 40, 45, 72] as const);
  const n = rng.int(30, 150);
  const factors = factorize(base);
  const canonicalRows = factors.map(([prime, required]) => {
    const available = valuationFactorialLegendre(n, prime);
    return { prime, required, available, groups: Math.floor(available / required) };
  });
  const verifierRows = factors.map(([prime, required]) => ({
    prime,
    required,
    available: valuationFactorialByEnumeration(n, prime),
  }));
  const correct = Math.min(...canonicalRows.map((row) => row.groups));
  const verifier = Math.min(...verifierRows.map((row) => Math.floor(row.available / row.required)));
  const rawMinimum = Math.min(...canonicalRows.map((row) => row.available));
  const largestCapacity = Math.max(...canonicalRows.map((row) => row.groups));

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-006",
    seed,
    difficulty: "HARD",
    answerSemantic: "TRAILING_ZERO_COUNT",
    representation: "GENERAL_BASE_FACTORIAL",
    stem: `When ${n}! is written in base ${base}, how many trailing zeroes does it have?`,
    correct,
    verifier,
    distractors: [
      { value: rawMinimum, misconceptionId: "IGNORE_BASE_EXPONENTS" },
      { value: largestCapacity, misconceptionId: "USE_NON_LIMITING_PRIME" },
      { value: Math.floor(n / base), misconceptionId: "COUNT_BASE_MULTIPLES_ONLY" },
    ],
    state: { base, n, factors, canonicalRows, correct },
    concept: `A trailing zero in base ${base} requires one complete factor of ${base}, not one factor of 10. The prime factors of the base must therefore be balanced in the required proportions.`,
    strategy: `Factor the base as ${factorizationText(factors)}. For each prime factor, find its valuation in ${n}! and divide by the amount needed for one factor of ${base}; the smallest capacity is the zero count.`,
    steps: [
      ...canonicalRows.map((row) => `Prime ${row.prime} contributes ${row.available} factors; ${row.required} are needed per base factor, giving ${row.groups} complete groups.`),
      `The minimum complete-group count is ${correct}, so the base-${base} representation ends in ${correct} zeroes.`,
    ],
    sourceAncestry: ["SOURCE_GAP:GENERAL_BASE_TRAILING_ZEROES", "V2:ns_trailing_zeroes"],
  });
}

export function generateNumCp011Wave01(
  prototypeId: NumCp011Wave01PrototypeId,
  seed: number,
): NumCp011Wave01Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 01 seed must be a positive safe integer");

  switch (prototypeId) {
    case "NUM-CP011-PROT-001": return p001(seed);
    case "NUM-CP011-PROT-002": return p002(seed);
    case "NUM-CP011-PROT-003": return p003(seed);
    case "NUM-CP011-PROT-004": return p004(seed);
    case "NUM-CP011-PROT-005": return p005(seed);
    case "NUM-CP011-PROT-006": return p006(seed);
    default: throw new Error(`Unsupported NUM-CP-011 Wave 01 prototype: ${prototypeId satisfies never}`);
  }
}
