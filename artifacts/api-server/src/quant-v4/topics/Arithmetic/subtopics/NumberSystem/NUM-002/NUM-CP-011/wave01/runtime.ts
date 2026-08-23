import type {
  NumCp011Difficulty,
  NumCp011Explanation,
  NumCp011Option,
  NumCp011Wave01Package,
  NumCp011Wave01PrototypeId,
} from "./types.ts";

const PRIMES = [2, 3, 5, 7, 11, 13] as const;
const COMPOSITE_BASES = [6, 8, 12, 18, 20, 24, 28, 36, 40, 45, 50, 60, 72] as const;

const SOURCE_ANCESTRY = Object.freeze([
  "NUMBER-SYSTEM-SOURCE-AND-OWNERSHIP-AUDIT:CP011",
  "QUANT-V2:factorial-and-valuation-family-recovery",
  "NUMBER-SYSTEM-DESIGN-REGISTRY:NUM-CP-011",
]);

const LOCKED_LIFECYCLE = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE01_REVIEW_REQUIRED" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function mixed(seed: number, salt: number): number {
  const x = (Math.imul(seed ^ (salt * 0x9e3779b1), 0x85ebca6b) ^ (seed >>> 3)) >>> 0;
  return (x ^ (x >>> 16)) >>> 0;
}

function choose<T>(values: readonly T[], seed: number, salt: number): T {
  return values[mixed(seed, salt) % values.length]!;
}

function intIn(seed: number, salt: number, min: number, max: number): number {
  return min + (mixed(seed, salt) % (max - min + 1));
}

function factorize(value: number): Readonly<Record<number, number>> {
  let remaining = value;
  const factors: Record<number, number> = {};
  for (let p = 2; p * p <= remaining; p += 1) {
    while (remaining % p === 0) {
      factors[p] = (factors[p] ?? 0) + 1;
      remaining /= p;
    }
  }
  if (remaining > 1) factors[remaining] = (factors[remaining] ?? 0) + 1;
  return Object.freeze(factors);
}

function valuationTerms(n: number, p: number): readonly number[] {
  const terms: number[] = [];
  let power = p;
  while (power <= n) {
    terms.push(Math.floor(n / power));
    if (power > Math.floor(n / p)) break;
    power *= p;
  }
  return Object.freeze(terms);
}

function valuationFactorial(n: number, p: number): number {
  return valuationTerms(n, p).reduce((sum, value) => sum + value, 0);
}

/** Independent verifier: factor every integer 2..n and accumulate p explicitly. */
function bruteValuationFactorial(n: number, p: number): number {
  let count = 0;
  for (let value = 2; value <= n; value += 1) {
    let current = value;
    while (current % p === 0) {
      count += 1;
      current /= p;
    }
  }
  return count;
}

function highestBasePowerInFactorial(n: number, base: number): number {
  const factors = factorize(base);
  return Math.min(
    ...Object.entries(factors).map(([prime, exponent]) =>
      Math.floor(valuationFactorial(n, Number(prime)) / exponent),
    ),
  );
}

function bruteHighestBasePowerInFactorial(n: number, base: number): number {
  const factors = factorize(base);
  return Math.min(
    ...Object.entries(factors).map(([prime, exponent]) =>
      Math.floor(bruteValuationFactorial(n, Number(prime)) / exponent),
    ),
  );
}

function trailingZerosBase10(n: number): number {
  return Math.min(valuationFactorial(n, 2), valuationFactorial(n, 5));
}

function bruteTrailingZerosBase10(n: number): number {
  return Math.min(bruteValuationFactorial(n, 2), bruteValuationFactorial(n, 5));
}

function leastNForValuation(p: number, target: number, verifier = false): number {
  for (let n = 1; n <= 2000; n += 1) {
    const value = verifier ? bruteValuationFactorial(n, p) : valuationFactorial(n, p);
    if (value >= target) return n;
  }
  throw new Error(`Unable to invert valuation target p=${p}, target=${target}`);
}

function leastNForZeros(target: number, verifier = false): number {
  for (let n = 1; n <= 5000; n += 1) {
    const value = verifier ? bruteTrailingZerosBase10(n) : trailingZerosBase10(n);
    if (value >= target) return n;
  }
  throw new Error(`Unable to invert trailing-zero target ${target}`);
}

function factorisationText(base: number): string {
  return Object.entries(factorize(base))
    .map(([prime, exponent]) => exponent === 1 ? prime : `${prime}^${exponent}`)
    .join(" × ");
}

function termsText(n: number, p: number): string {
  const terms = valuationTerms(n, p);
  const divisors = terms.map((_, index) => p ** (index + 1));
  return terms.map((term, index) => `⌊${n}/${divisors[index]}⌋ = ${term}`).join(", ");
}

function buildNumericOptions(correct: number, seed: number): readonly NumCp011Option[] {
  const candidates = new Set<number>([correct]);
  const offsets = [-1, 1, 2, -2, 3, -3, 4, 5];
  for (const offset of offsets) {
    const value = correct + offset;
    if (value >= 0) candidates.add(value);
    if (candidates.size >= 4) break;
  }
  let fallback = correct + 6;
  while (candidates.size < 4) candidates.add(fallback++);

  const values = [...candidates].slice(0, 4);
  const distractorIds = ["MISSED_HIGHER_PRIME_POWER", "OFF_BY_ONE_BOUNDARY", "WRONG_LIMITING_FACTOR"];
  const raw: NumCp011Option[] = values.map((value) => ({
    value: String(value),
    isCorrect: value === correct,
    misconceptionId: value === correct ? "CORRECT" : distractorIds.shift() ?? "NEARBY_ARITHMETIC_SLIP",
  }));
  const rotation = seed % raw.length;
  return Object.freeze([...raw.slice(rotation), ...raw.slice(0, rotation)].map((item) => Object.freeze(item)));
}

function stemFamily(seed: number): "DIRECT" | "EXAM" | "CONTEXT_FREE" {
  return (["DIRECT", "EXAM", "CONTEXT_FREE"] as const)[seed % 3]!;
}

function difficultyFor(prototypeId: NumCp011Wave01PrototypeId, seed: number): NumCp011Difficulty {
  const number = Number(prototypeId.slice(-3));
  if ([1, 3, 5].includes(number)) return seed % 4 === 0 ? "MEDIUM" : "EASY";
  if ([2, 4, 6].includes(number)) return seed % 3 === 0 ? "HARD" : "MEDIUM";
  return seed % 2 === 0 ? "HARD" : "MEDIUM";
}

function makePackage(args: {
  prototypeId: NumCp011Wave01PrototypeId;
  seed: number;
  answerSemantic: string;
  representation: string;
  stem: string;
  correct: number;
  verifier: number;
  hiddenState: Readonly<Record<string, unknown>>;
  explanation: NumCp011Explanation;
}): NumCp011Wave01Package {
  if (args.correct !== args.verifier) {
    throw new Error(`${args.prototypeId}/${args.seed}: solver/verifier mismatch ${args.correct} vs ${args.verifier}`);
  }
  const options = buildNumericOptions(args.correct, args.seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${args.prototypeId}/${args.seed}: correct option missing`);
  const canonicalAnswer = String(args.correct);
  return Object.freeze({
    packageId: "NUM-002" as const,
    checkpointId: "NUM-CP-011" as const,
    temporaryPrototypeId: args.prototypeId,
    seed: args.seed,
    locale: "en-IN" as const,
    difficulty: difficultyFor(args.prototypeId, args.seed),
    answerSemantic: args.answerSemantic,
    representation: args.representation,
    stemFamily: stemFamily(args.seed),
    stem: args.stem,
    options,
    correctIndex,
    canonicalAnswer,
    verifierAnswer: String(args.verifier),
    hiddenState: args.hiddenState,
    mathematicalFingerprint: JSON.stringify(args.hiddenState),
    explanation: Object.freeze({ ...args.explanation, steps: Object.freeze([...args.explanation.steps]) }),
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([args.prototypeId]),
    lifecycle: LOCKED_LIFECYCLE,
  });
}

function p001(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 11, 24, 140);
  const p = choose(PRIMES, seed, 12);
  const terms = valuationTerms(n, p);
  const correct = valuationFactorial(n, p);
  const verifier = bruteValuationFactorial(n, p);
  const family = stemFamily(seed);
  const stem = family === "DIRECT"
    ? `Find the exponent of ${p} in the prime factorisation of ${n}!.`
    : family === "EXAM"
      ? `What is v_${p}(${n}!), i.e. the total number of factors ${p} in ${n}!?`
      : `How many times does the prime ${p} occur in ${n}!?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-001",
    seed,
    answerSemantic: "PRIME_VALUATION",
    representation: "FACTORIAL_VALUATION",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, p, terms }),
    explanation: {
      coreConcept: `Every multiple of ${p} contributes at least one factor ${p}; multiples of ${p ** 2}, ${p ** 3} and so on contribute extra factors.`,
      strategy: `Add the integer quotients of ${n} by successive powers of ${p}.`,
      steps: [
        `${termsText(n, p)}.`,
        `Adding these contributions gives ${terms.join(" + ")} = ${correct}.`,
      ],
      finalAnswer: canonicalSentence(correct, `The exponent of ${p} in ${n}! is`),
    },
  });
}

function canonicalSentence(value: number, prefix: string): string {
  return `${prefix} ${value}.`;
}

function p002(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 21, 36, 150);
  const gap = intIn(seed, 22, 6, Math.min(30, n - 5));
  const m = n - gap;
  const p = choose(PRIMES, seed, 23);
  const top = valuationFactorial(n, p);
  const bottom = valuationFactorial(m, p);
  const correct = top - bottom;
  const verifier = bruteValuationFactorial(n, p) - bruteValuationFactorial(m, p);
  const family = stemFamily(seed);
  const stem = family === "DIRECT"
    ? `Find the exponent of ${p} in ${n}!/${m}!.`
    : family === "EXAM"
      ? `What is the highest power of ${p} contained in the integer ${n}!/${m}!? Give the exponent only.`
      : `How many factors ${p} occur in the product (${m + 1}) × (${m + 2}) × ... × ${n}?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-002",
    seed,
    answerSemantic: "PRIME_VALUATION",
    representation: "FACTORIAL_RATIO",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, m, p, top, bottom }),
    explanation: {
      coreConcept: `In ${n}!/${m}!, all factors from 1 through ${m} cancel, so prime valuations subtract.`,
      strategy: `Find the exponent of ${p} in each factorial and subtract the denominator contribution.`,
      steps: [
        `v_${p}(${n}!) = ${top} and v_${p}(${m}!) = ${bottom}.`,
        `Therefore v_${p}(${n}!/${m}!) = ${top} − ${bottom} = ${correct}.`,
      ],
      finalAnswer: canonicalSentence(correct, `The required exponent is`),
    },
  });
}

function p003(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 31, 28, 160);
  const p = choose(PRIMES, seed, 32);
  const correct = valuationFactorial(n, p);
  const verifier = bruteValuationFactorial(n, p);
  const stem = stemFamily(seed) === "EXAM"
    ? `What is the greatest integer k for which ${p}^k divides ${n}!?`
    : `Find the highest power of ${p} that divides ${n}!. Enter its exponent.`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-003",
    seed,
    answerSemantic: "HIGHEST_POWER_EXPONENT",
    representation: "PRIME_POWER_DIVISIBILITY",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, p, exponent: correct }),
    explanation: {
      coreConcept: `The largest k with ${p}^k dividing ${n}! is exactly the total exponent of ${p} in ${n}!.`,
      strategy: `Count all contributions from ${p}, ${p ** 2}, ${p ** 3} and higher powers not exceeding ${n}.`,
      steps: [
        `${termsText(n, p)}.`,
        `The total exponent is ${correct}, so ${p}^${correct} divides ${n}! but ${p}^${correct + 1} does not.`,
      ],
      finalAnswer: canonicalSentence(correct, `The greatest exponent k is`),
    },
  });
}

function p004(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 41, 34, 180);
  const base = choose(COMPOSITE_BASES, seed, 42);
  const factors = factorize(base);
  const available = Object.fromEntries(
    Object.keys(factors).map((prime) => [prime, valuationFactorial(n, Number(prime))]),
  );
  const correct = highestBasePowerInFactorial(n, base);
  const verifier = bruteHighestBasePowerInFactorial(n, base);
  const factorLimits = Object.entries(factors).map(([prime, exponent]) =>
    `⌊v_${prime}(${n}!)/${exponent}⌋ = ${Math.floor(Number(available[Number(prime)]) / exponent)}`,
  );
  const stem = stemFamily(seed) === "DIRECT"
    ? `Find the greatest integer k such that ${base}^k divides ${n}!.`
    : `What is the highest power of ${base} contained in ${n}!? Give the exponent k.`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-004",
    seed,
    answerSemantic: "HIGHEST_POWER_EXPONENT",
    representation: "COMPOSITE_BASE_VALUATION",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, base, factors, available, limits: factorLimits }),
    explanation: {
      coreConcept: `A power of composite ${base} needs every prime factor in the fixed ratio ${factorisationText(base)}.`,
      strategy: `Count each required prime in ${n}!, divide by its exponent in ${base}, and take the smallest whole-number limit.`,
      steps: [
        `${base} = ${factorisationText(base)}. The available prime exponents in ${n}! are ${Object.entries(available).map(([p, v]) => `v_${p} = ${v}`).join(", ")}.`,
        `${factorLimits.join("; ")}.`,
        `The limiting value is ${correct}, so ${base}^${correct} divides ${n}! but the next power does not.`,
      ],
      finalAnswer: canonicalSentence(correct, `The greatest exponent k is`),
    },
  });
}

function p005(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 51, 25, 320);
  const v2 = valuationFactorial(n, 2);
  const v5 = valuationFactorial(n, 5);
  const correct = trailingZerosBase10(n);
  const verifier = bruteTrailingZerosBase10(n);
  const family = stemFamily(seed);
  const stem = family === "DIRECT"
    ? `How many trailing zeroes are there in ${n}!?`
    : family === "EXAM"
      ? `Find the number of zeroes at the end of the decimal representation of ${n}!.`
      : `When ${n}! is written in base 10, how many consecutive zeroes appear at the right end?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-005",
    seed,
    answerSemantic: "TRAILING_ZERO_COUNT",
    representation: "DECIMAL_FACTORIAL",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, v2, v5 }),
    explanation: {
      coreConcept: `Each trailing zero in base 10 needs one factor 10 = 2 × 5. In a factorial, factors 2 are more plentiful, so factors 5 limit the pairs.`,
      strategy: `Count all factors 5 in ${n}! using successive powers of 5.`,
      steps: [
        `${termsText(n, 5)}.`,
        `Thus v_5(${n}!) = ${v5}; v_2(${n}!) = ${v2}, so the smaller count is ${correct}.`,
      ],
      finalAnswer: canonicalSentence(correct, `${n}! has` ) + " trailing zeroes.",
    },
  });
}

function p006(seed: number): NumCp011Wave01Package {
  const n = intIn(seed, 61, 36, 300);
  const base = choose(COMPOSITE_BASES, seed, 62);
  const factors = factorize(base);
  const primeValuations = Object.fromEntries(
    Object.keys(factors).map((prime) => [prime, valuationFactorial(n, Number(prime))]),
  );
  const limits = Object.entries(factors).map(([prime, exponent]) => ({
    prime: Number(prime),
    exponent,
    available: Number(primeValuations[Number(prime)]),
    groups: Math.floor(Number(primeValuations[Number(prime)]) / exponent),
  }));
  const correct = Math.min(...limits.map((item) => item.groups));
  const verifier = bruteHighestBasePowerInFactorial(n, base);
  const stem = stemFamily(seed) === "EXAM"
    ? `How many trailing zeroes does ${n}! have when written in base ${base}?`
    : `Write ${n}! in base ${base}. How many zeroes occur consecutively at the end?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-006",
    seed,
    answerSemantic: "TRAILING_ZERO_COUNT",
    representation: "GENERAL_BASE_FACTORIAL",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ n, base, factors, primeValuations, limits }),
    explanation: {
      coreConcept: `One trailing zero in base ${base} requires one complete factor ${base} = ${factorisationText(base)}.`,
      strategy: `Find how many complete copies of every required prime-power component occur in ${n}! and take the smallest count.`,
      steps: [
        `For ${base} = ${factorisationText(base)}, ${limits.map((item) => `v_${item.prime}(${n}!) = ${item.available}`).join(", ")}.`,
        `${limits.map((item) => `${item.available} ÷ ${item.exponent} gives ${item.groups} complete groups`).join("; ")}.`,
        `The smallest group count is ${correct}, so there are ${correct} trailing zeroes in base ${base}.`,
      ],
      finalAnswer: `${correct} trailing zeroes.`,
    },
  });
}

function p007(seed: number): NumCp011Wave01Package {
  const p = choose(PRIMES, seed, 72);
  const sourceN = intIn(seed, 71, 18, 180);
  const target = valuationFactorial(sourceN, p);
  const correct = leastNForValuation(p, target, false);
  const verifier = leastNForValuation(p, target, true);
  const atPrevious = correct > 1 ? valuationFactorial(correct - 1, p) : 0;
  const atCorrect = valuationFactorial(correct, p);
  const stem = stemFamily(seed) === "DIRECT"
    ? `Find the least positive integer n such that ${p}^${target} divides n!.`
    : `What is the smallest n for which the exponent of ${p} in n! is at least ${target}?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-007",
    seed,
    answerSemantic: "LEAST_INTEGER",
    representation: "INVERSE_PRIME_VALUATION",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ p, target, sourceN, atPrevious, atCorrect }),
    explanation: {
      coreConcept: `The exponent v_${p}(n!) increases only when n crosses multiples of ${p}; the least n is the first point where the target is reached.`,
      strategy: `Search the monotone valuation near the target and verify both n and n − 1.`,
      steps: [
        `At n = ${correct - 1}, v_${p}(n!) = ${atPrevious}, which is below ${target}.`,
        `At n = ${correct}, v_${p}(n!) = ${atCorrect}, which is at least ${target}.`,
        `Therefore ${correct} is the first possible n.`,
      ],
      finalAnswer: canonicalSentence(correct, `The least n is`),
    },
  });
}

function p008(seed: number): NumCp011Wave01Package {
  const sourceN = intIn(seed, 81, 25, 360);
  const target = trailingZerosBase10(sourceN);
  const correct = leastNForZeros(target, false);
  const verifier = leastNForZeros(target, true);
  const before = correct > 1 ? trailingZerosBase10(correct - 1) : 0;
  const at = trailingZerosBase10(correct);
  const stem = stemFamily(seed) === "EXAM"
    ? `Find the least positive integer n such that n! ends with at least ${target} zeroes.`
    : `What is the smallest n for which n! has ${target} or more trailing zeroes?`;
  return makePackage({
    prototypeId: "NUM-CP011-PROT-008",
    seed,
    answerSemantic: "LEAST_INTEGER",
    representation: "INVERSE_TRAILING_ZERO_COUNT",
    stem,
    correct,
    verifier,
    hiddenState: Object.freeze({ target, sourceN, before, at }),
    explanation: {
      coreConcept: `The number of trailing zeroes of n! never decreases as n grows, so the first n reaching the target is the required answer.`,
      strategy: `Use v_5(n!) for decimal trailing zeroes and verify the boundary at n − 1 and n.`,
      steps: [
        `(${correct - 1})! has ${before} trailing zeroes, which is below ${target}.`,
        `${correct}! has ${at} trailing zeroes, which is at least ${target}.`,
        `So no smaller positive integer works.`,
      ],
      finalAnswer: canonicalSentence(correct, `The least n is`),
    },
  });
}

export function generateNumCp011Wave01(
  prototypeId: NumCp011Wave01PrototypeId,
  seed: number,
): NumCp011Wave01Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error(`Seed must be a positive safe integer, received ${seed}`);
  switch (prototypeId) {
    case "NUM-CP011-PROT-001": return p001(seed);
    case "NUM-CP011-PROT-002": return p002(seed);
    case "NUM-CP011-PROT-003": return p003(seed);
    case "NUM-CP011-PROT-004": return p004(seed);
    case "NUM-CP011-PROT-005": return p005(seed);
    case "NUM-CP011-PROT-006": return p006(seed);
    case "NUM-CP011-PROT-007": return p007(seed);
    case "NUM-CP011-PROT-008": return p008(seed);
  }
}
