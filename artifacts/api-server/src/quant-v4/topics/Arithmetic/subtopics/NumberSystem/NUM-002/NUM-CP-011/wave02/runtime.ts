import { createHash } from "node:crypto";

import type {
  NumCp011Wave02Difficulty,
  NumCp011Wave02Option,
  NumCp011Wave02Package,
  NumCp011Wave02PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE02_REVIEW_REQUIRED" as const,
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
  readonly value: string;
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

function makeOptions(correct: string, distractors: readonly Distractor[], rng: Rng): readonly NumCp011Wave02Option[] {
  const values: Array<{ value: string; misconceptionId: string }> = [
    { value: correct, misconceptionId: "CORRECT" },
  ];

  for (const distractor of distractors) {
    if (distractor.value !== correct && !values.some((item) => item.value === distractor.value)) {
      values.push({ ...distractor });
    }
    if (values.length === 4) break;
  }

  if (values.length < 4 && /^\d+$/u.test(correct)) {
    const numeric = Number(correct);
    let delta = 1;
    while (values.length < 4) {
      for (const candidate of [numeric + delta, Math.max(0, numeric - delta)]) {
        const value = String(candidate);
        if (!values.some((item) => item.value === value)) {
          values.push({ value, misconceptionId: "NEARBY_BOUND" });
        }
        if (values.length === 4) break;
      }
      delta += 1;
    }
  }

  if (values.length !== 4) throw new Error(`Unable to construct four unique options for answer ${correct}`);

  return Object.freeze(shuffle(values, rng).map((item) => Object.freeze({
    value: item.value,
    isCorrect: item.value === correct,
    misconceptionId: item.misconceptionId,
  })));
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp011Wave02PrototypeId;
  seed: number;
  difficulty: NumCp011Wave02Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  canonicalAnswer: string;
  verifierAnswer: string;
  distractors: readonly Distractor[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp011Wave02Package {
  const optionRng = new Rng(input.seed * 104729 + Number(input.prototypeId.slice(-3)));
  const options = makeOptions(input.canonicalAnswer, input.distractors, optionRng);
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
    canonicalAnswer: input.canonicalAnswer,
    verifierAnswer: input.verifierAnswer,
    hiddenState: Object.freeze({ ...input.state }),
    mathematicalFingerprint: fingerprint(input.prototypeId, input.state),
    explanation: Object.freeze({
      coreConcept: input.concept,
      strategy: input.strategy,
      steps: Object.freeze([...input.steps]),
      finalAnswer: input.canonicalAnswer,
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

function valuationFactorialLegendre(n: number, prime: number) {
  let exponent = 0;
  let power = prime;
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
  return factors
    .map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`)
    .join(" × ");
}

function leastNAtLeastValuation(prime: number, target: number) {
  if (target <= 0) return 1;
  let low = 1;
  let high = Math.max(prime, 2);
  while (valuationFactorialLegendre(high, prime) < target) high *= 2;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (valuationFactorialLegendre(mid, prime) >= target) high = mid;
    else low = mid + 1;
  }
  return low;
}

function leastNAtLeastValuationByEnumeration(prime: number, target: number) {
  for (let n = 1; n <= Math.max(20, target * prime + prime * prime); n += 1) {
    if (valuationFactorialByEnumeration(n, prime) >= target) return n;
  }
  throw new Error(`Verifier bound exhausted for p=${prime}, target=${target}`);
}

function zeroCountInBaseCanonical(n: number, base: number) {
  const factors = factorize(base);
  return Math.min(...factors.map(([prime, required]) =>
    Math.floor(valuationFactorialLegendre(n, prime) / required)));
}

function zeroCountInBaseByEnumeration(n: number, base: number) {
  const factors = factorize(base);
  return Math.min(...factors.map(([prime, required]) =>
    Math.floor(valuationFactorialByEnumeration(n, prime) / required)));
}

function leastNAtLeastBaseZeroes(base: number, target: number) {
  let low = 1;
  let high = Math.max(base, 2);
  while (zeroCountInBaseCanonical(high, base) < target) high *= 2;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (zeroCountInBaseCanonical(mid, base) >= target) high = mid;
    else low = mid + 1;
  }
  return low;
}

function leastNAtLeastBaseZeroesByEnumeration(base: number, target: number) {
  const bound = Math.max(50, target * base + base);
  for (let n = 1; n <= bound; n += 1) {
    if (zeroCountInBaseByEnumeration(n, base) >= target) return n;
  }
  throw new Error(`Verifier bound exhausted for base=${base}, target=${target}`);
}

function formatSet(values: readonly number[]) {
  return values.length === 0 ? "No positive integer n" : `{${values.join(", ")}}`;
}

function exactValuationPreimageCanonical(prime: number, target: number) {
  const start = leastNAtLeastValuation(prime, target);
  if (valuationFactorialLegendre(start, prime) !== target) return [] as number[];
  const end = leastNAtLeastValuation(prime, target + 1) - 1;
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function exactValuationPreimageByEnumeration(prime: number, target: number) {
  const maxN = Math.max(30, (target + 3) * prime + prime * prime);
  const values: number[] = [];
  for (let n = 1; n <= maxN; n += 1) {
    const valuation = valuationFactorialByEnumeration(n, prime);
    if (valuation === target) values.push(n);
    if (valuation > target && values.length > 0) break;
    if (valuation > target && values.length === 0) break;
  }
  return values;
}

function p007(seed: number): NumCp011Wave02Package {
  const rng = new Rng(seed * 41 + 7);
  const prime = rng.pick([2, 3, 5, 7] as const);
  const target = rng.int(8, 60);
  const correct = leastNAtLeastValuation(prime, target);
  const verifier = leastNAtLeastValuationByEnumeration(prime, target);
  const before = valuationFactorialLegendre(correct - 1, prime);
  const at = valuationFactorialLegendre(correct, prime);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-007",
    seed,
    difficulty: target >= 35 ? "HARD" : target >= 18 ? "MEDIUM" : "EASY",
    answerSemantic: "LEAST_N_AT_LEAST_PRIME_VALUATION",
    representation: "INVERSE_FACTORIAL_DIVISIBILITY_THRESHOLD",
    stem: `What is the least positive integer n such that ${prime}^${target} divides n!?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    distractors: [
      { value: String(Math.max(1, correct - 1)), misconceptionId: "STOP_ONE_STEP_TOO_EARLY" },
      { value: String(correct + 1), misconceptionId: "OVERSHOOT_MINIMUM" },
      { value: String(target * prime), misconceptionId: "MULTIPLY_TARGET_BY_PRIME" },
    ],
    state: { prime, target, correct, before, at },
    concept: "The factorial valuation v_p(n!) grows monotonically with n, so a least-n divisibility question is a lower-bound inverse of that valuation.",
    strategy: `Find the first n for which the exponent of ${prime} in n! reaches at least ${target}; values below that point must still be short of the target.`,
    steps: [
      `At n = ${correct - 1}, the exponent of ${prime} is ${before}, which is below ${target}.`,
      `At n = ${correct}, the exponent becomes ${at}, so ${prime}^${target} divides ${correct}! and ${correct} is the least possible n.`,
    ],
    sourceAncestry: ["SOURCE_GAP:INVERSE_FACTORIAL_VALUATION", "V2:ns_factorial_divisibility"],
  });
}

function p008(seed: number): NumCp011Wave02Package {
  const rng = new Rng(seed * 43 + 8);
  const decimalRepresentation = seed % 2 === 0;
  const prime = decimalRepresentation ? 5 : rng.pick([2, 3, 5, 7] as const);
  const forceImpossible = seed % 3 === 0;

  let target: number;
  if (forceImpossible) {
    const jumpAt = prime * prime * rng.int(1, 4);
    target = valuationFactorialLegendre(jumpAt - 1, prime) + 1;
  } else {
    const anchor = rng.int(Math.max(10, prime * 2), 90);
    target = valuationFactorialLegendre(anchor, prime);
  }

  const canonicalValues = exactValuationPreimageCanonical(prime, target);
  const verifierValues = exactValuationPreimageByEnumeration(prime, target);
  const canonicalAnswer = formatSet(canonicalValues);
  const verifierAnswer = formatSet(verifierValues);
  const crossing = leastNAtLeastValuation(prime, target);

  const distractors: Distractor[] = canonicalValues.length === 0
    ? [
        { value: formatSet([crossing]), misconceptionId: "ASSUME_TARGET_ALWAYS_ATTAINED" },
        { value: formatSet([Math.max(1, crossing - 1)]), misconceptionId: "USE_LAST_VALUE_BELOW_TARGET" },
        { value: formatSet([crossing, crossing + 1]), misconceptionId: "IGNORE_VALUATION_JUMP" },
      ]
    : [
        { value: formatSet([canonicalValues[0]!]), misconceptionId: "KEEP_FIRST_SOLUTION_ONLY" },
        { value: formatSet(canonicalValues.map((value) => Math.max(1, value - 1))), misconceptionId: "SHIFT_PREIMAGE_LEFT" },
        { value: formatSet(canonicalValues.map((value) => value + 1)), misconceptionId: "SHIFT_PREIMAGE_RIGHT" },
        { value: "No positive integer n", misconceptionId: "ASSUME_TARGET_SKIPPED" },
      ];

  const stem = decimalRepresentation
    ? `Which option lists all positive integers n for which n! has exactly ${target} trailing zeroes?`
    : `Which option lists all positive integers n for which the exponent of ${prime} in n! is exactly ${target}?`;

  const concept = decimalRepresentation
    ? "For an ordinary factorial, the number of decimal trailing zeroes equals v_5(n!), so exact-zero inversion is the same preimage problem as an exact factorial valuation."
    : "An exact factorial valuation may hold for several consecutive n values or for none at all because v_p(n!) is monotone but can jump by more than one.";

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-008",
    seed,
    difficulty: forceImpossible ? "HARD" : "MEDIUM",
    answerSemantic: "EXACT_FACTORIAL_VALUATION_PREIMAGE_SET",
    representation: decimalRepresentation ? "EXACT_BASE10_TRAILING_ZERO_PREIMAGE" : "EXACT_PRIME_VALUATION_PREIMAGE",
    stem,
    canonicalAnswer,
    verifierAnswer,
    distractors,
    state: { prime, target, forceImpossible, decimalRepresentation, canonicalValues, crossing },
    concept,
    strategy: `Locate where the relevant factorial valuation first reaches ${target}, then locate where it first reaches ${target + 1}; the exact solutions, if the target is attained, form the consecutive integers between those two boundaries.`,
    steps: canonicalValues.length === 0
      ? [
          `At the first crossing n = ${crossing}, the valuation has already jumped past ${target}.`,
          `Therefore no positive integer n gives the exact requested value, so the correct set is empty.`,
        ]
      : [
          `The valuation first equals ${target} at n = ${canonicalValues[0]}.`,
          `It stays equal to ${target} through n = ${canonicalValues[canonicalValues.length - 1]}, giving exactly ${canonicalAnswer}.`,
        ],
    sourceAncestry: ["SOURCE_GAP:EXACT_INVERSE_VALUATION", "SOURCE_GAP:POSSIBLE_IMPOSSIBLE_TRAILING_ZEROES", "V2:ns_trailing_zeroes"],
  });
}

function p009(seed: number): NumCp011Wave02Package {
  const rng = new Rng(seed * 47 + 9);
  const base = rng.pick([8, 12, 18, 20, 24, 40, 45, 72] as const);
  const target = rng.int(4, 24);
  const correct = leastNAtLeastBaseZeroes(base, target);
  const verifier = leastNAtLeastBaseZeroesByEnumeration(base, target);
  const before = zeroCountInBaseCanonical(correct - 1, base);
  const at = zeroCountInBaseCanonical(correct, base);
  const factors = factorize(base);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-009",
    seed,
    difficulty: "HARD",
    answerSemantic: "LEAST_N_AT_LEAST_GENERAL_BASE_ZEROES",
    representation: "INVERSE_GENERAL_BASE_TRAILING_ZEROES",
    stem: `What is the least positive integer n such that n!, when written in base ${base}, ends in at least ${target} zeroes?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    distractors: [
      { value: String(Math.max(1, correct - 1)), misconceptionId: "STOP_BEFORE_ALL_BASE_FACTORS_AVAILABLE" },
      { value: String(correct + 1), misconceptionId: "OVERSHOOT_MINIMUM" },
      { value: String(target * base), misconceptionId: "COUNT_WHOLE_BASE_MULTIPLES" },
    ],
    state: { base, factors, target, correct, before, at },
    concept: `A trailing zero in base ${base} requires one complete factor ${base} = ${factorizationText(factors)}. The least n must satisfy every prime-factor requirement at the same time.`,
    strategy: "Track the limiting prime-capacity of n! and find the first factorial whose complete base-factor count reaches the requested number of zeroes.",
    steps: [
      `At n = ${correct - 1}, the base-${base} zero count is ${before}, still below ${target}.`,
      `At n = ${correct}, the count is ${at}, so ${correct} is the first n that reaches at least ${target} trailing zeroes.`,
    ],
    sourceAncestry: ["SOURCE_GAP:GENERAL_BASE_TRAILING_ZEROES", "SOURCE_GAP:INVERSE_FACTORIAL_VALUATION"],
  });
}

function p010(seed: number): NumCp011Wave02Package {
  const rng = new Rng(seed * 53 + 10);
  const selectedPrimes = seed % 3 === 0 ? [2, 3, 5] as const : [2, 3] as const;
  const factors = selectedPrimes.map((prime) => [prime, rng.int(2, prime === 2 ? 7 : 5)] as const);
  const integer = factors.reduce((product, [prime, exponent]) => product * (prime ** exponent), 1);
  const thresholds = factors.map(([prime, exponent]) => ({
    prime,
    exponent,
    leastN: leastNAtLeastValuation(prime, exponent),
  }));
  const correct = Math.max(...thresholds.map((item) => item.leastN));

  let factorialMod = 1n;
  let verifier = -1;
  const modulus = BigInt(integer);
  for (let n = 1; n <= 100; n += 1) {
    factorialMod = (factorialMod * BigInt(n)) % modulus;
    if (factorialMod === 0n) {
      verifier = n;
      break;
    }
  }
  if (verifier < 0) throw new Error(`Verifier failed to locate least factorial containing ${integer}`);

  const sumThresholds = thresholds.reduce((sum, item) => sum + item.leastN, 0);
  const largestExponent = Math.max(...factors.map(([, exponent]) => exponent));

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-010",
    seed,
    difficulty: factors.length === 3 ? "HARD" : "MEDIUM",
    answerSemantic: "LEAST_FACTORIAL_DIVISIBLE_BY_INTEGER",
    representation: "COMPOSITE_DIVISOR_THRESHOLD",
    stem: `What is the least positive integer n such that ${integer} divides n!?`,
    canonicalAnswer: String(correct),
    verifierAnswer: String(verifier),
    distractors: [
      { value: String(Math.max(1, correct - 1)), misconceptionId: "MISS_LIMITING_PRIME_REQUIREMENT" },
      { value: String(largestExponent), misconceptionId: "USE_LARGEST_EXPONENT_AS_N" },
      { value: String(sumThresholds), misconceptionId: "ADD_PRIME_THRESHOLDS" },
    ],
    state: { integer, factors, thresholds, correct },
    concept: "For a composite integer to divide n!, every prime power in its factorisation must be present. The slowest prime-power requirement determines the least n.",
    strategy: `Factor ${integer} as ${factorizationText(factors)}, find the least factorial meeting each prime-exponent requirement, then take the largest of those threshold n values.`,
    steps: [
      ...thresholds.map((item) => `${item.prime}^${item.exponent} first has enough factors by n = ${item.leastN}.`),
      `All requirements are simultaneously satisfied first at n = ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_factorial_divisibility", "SOURCE_GAP:LEAST_FACTORIAL_CONTAINING_INTEGER"],
  });
}

function p011(seed: number): NumCp011Wave02Package {
  const rng = new Rng(seed * 59 + 11);
  const prime = rng.pick([2, 3, 5, 7] as const);
  const multiplierValuation = rng.int(1, 3);
  const allowedCofactors = [1, 2, 3, 4, 5, 7, 8, 11].filter((value) => value % prime !== 0);
  const cofactor = rng.pick(allowedCofactors);
  const multiplier = (prime ** multiplierValuation) * cofactor;
  const baseValuation = rng.int(1, 8);
  const baseCofactor = rng.pick(allowedCofactors);
  const base = (prime ** baseValuation) * baseCofactor;
  const correct = rng.int(1, 7);
  const target = baseValuation + correct * multiplierValuation;
  const canonical = (target - baseValuation) / multiplierValuation;

  let verifier = -1;
  for (let x = 0; x <= 12; x += 1) {
    const valuation = valuationInteger(base, prime) + x * valuationInteger(multiplier, prime);
    if (valuation === target) {
      verifier = x;
      break;
    }
  }

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-011",
    seed,
    difficulty: multiplierValuation >= 2 ? "MEDIUM" : "EASY",
    answerSemantic: "MISSING_PRODUCT_EXPONENT_FROM_VALUATION",
    representation: "UNKNOWN_EXPONENT_IN_STRUCTURED_PRODUCT",
    stem: `The exponent of ${prime} in the prime factorisation of ${base} × ${multiplier}^x is ${target}. Find x.`,
    canonicalAnswer: String(canonical),
    verifierAnswer: String(verifier),
    distractors: [
      { value: String(target - baseValuation), misconceptionId: "FORGET_MULTIPLIER_VALUATION" },
      { value: String(Math.floor(target / multiplierValuation)), misconceptionId: "IGNORE_EXISTING_BASE_VALUATION" },
      { value: String(correct + 1), misconceptionId: "OFF_BY_ONE_EXPONENT" },
    ],
    state: { prime, base, baseValuation, multiplier, multiplierValuation, target, correct },
    concept: "Prime valuation turns multiplication into addition, so an unknown ordinary exponent becomes a linear contribution to the total prime exponent.",
    strategy: `Count the ${prime}-factors already present in ${base}, find how many ${prime}-factors one copy of ${multiplier} contributes, then solve the resulting one-step valuation equation.`,
    steps: [
      `${base} contributes ${baseValuation} factors of ${prime}, while each copy of ${multiplier} contributes ${multiplierValuation}.`,
      `So ${baseValuation} + ${multiplierValuation}x = ${target}, giving x = ${correct}.`,
    ],
    sourceAncestry: ["SOURCE_GAP:MISSING_PRODUCT_EXPONENT", "V2:ns_highest_power_dividing"],
  });
}

export function generateNumCp011Wave02(
  prototypeId: NumCp011Wave02PrototypeId,
  seed: number,
): NumCp011Wave02Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 02 seed must be a positive safe integer");

  switch (prototypeId) {
    case "NUM-CP011-PROT-007": return p007(seed);
    case "NUM-CP011-PROT-008": return p008(seed);
    case "NUM-CP011-PROT-009": return p009(seed);
    case "NUM-CP011-PROT-010": return p010(seed);
    case "NUM-CP011-PROT-011": return p011(seed);
  }
}
