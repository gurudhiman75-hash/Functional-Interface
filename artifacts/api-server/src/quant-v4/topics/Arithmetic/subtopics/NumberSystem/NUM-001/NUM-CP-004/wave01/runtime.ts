import {
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
  type CoprimeClass,
  type NumCp004AnswerSemantic,
  type NumCp004Difficulty,
  type NumCp004Explanation,
  type NumCp004Option,
  type NumCp004Wave01Package,
  type NumCp004Wave01PrototypeId,
  type PrimeClass,
  type PrimeFactorPropertyTarget,
  type PrimePower,
} from "./types";

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43] as const;

const LIFECYCLE = {
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
} as const;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed: number, prototypeId: string): () => number {
  let state = (seed ^ hashText(prototypeId)) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng: () => number, minimum: number, maximum: number): number {
  return minimum + Math.floor(rng() * (maximum - minimum + 1));
}

function pick<T>(rng: () => number, values: readonly T[]): T {
  return values[randomInt(rng, 0, values.length - 1)]!;
}

function shuffled<T>(rng: () => number, values: readonly T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(rng, 0, index);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function gcdCanonical(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function gcdByCommonDivisorSearch(values: readonly number[]): number {
  const positive = values.map((value) => Math.abs(value));
  const upper = Math.min(...positive);
  for (let candidate = upper; candidate >= 1; candidate -= 1) {
    if (positive.every((value) => value % candidate === 0)) {
      return candidate;
    }
  }
  return 1;
}

function isPrimeCanonical(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function positiveDivisorsByEnumeration(value: number): number[] {
  if (!Number.isSafeInteger(value) || value <= 0) return [];
  const divisors: number[] = [];
  for (let candidate = 1; candidate <= value; candidate += 1) {
    if (value % candidate === 0) divisors.push(candidate);
  }
  return divisors;
}

function isPrimeVerifier(value: number): boolean {
  return positiveDivisorsByEnumeration(value).length === 2;
}

function classifyPrimeCanonical(value: number): PrimeClass {
  if (value === 1) return "UNIT";
  if (value <= 0) return "NEITHER";
  return isPrimeCanonical(value) ? "PRIME" : "COMPOSITE";
}

function classifyPrimeVerifier(value: number): PrimeClass {
  if (value === 1) return "UNIT";
  if (value <= 0) return "NEITHER";
  return isPrimeVerifier(value) ? "PRIME" : "COMPOSITE";
}

function primesInIntervalCanonical(lower: number, upper: number): number[] {
  const primes: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (isPrimeCanonical(value)) primes.push(value);
  }
  return primes;
}

function primesInIntervalVerifier(lower: number, upper: number): number[] {
  const primes: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (isPrimeVerifier(value)) primes.push(value);
  }
  return primes;
}

function factoriseCanonical(value: bigint): PrimePower[] {
  if (value < 2n) return [];
  let remainder = value;
  const result: PrimePower[] = [];
  let candidate = 2n;
  while (candidate * candidate <= remainder) {
    let exponent = 0;
    while (remainder % candidate === 0n) {
      remainder /= candidate;
      exponent += 1;
    }
    if (exponent > 0) result.push({ prime: Number(candidate), exponent });
    candidate = candidate === 2n ? 3n : candidate + 2n;
  }
  if (remainder > 1n) result.push({ prime: Number(remainder), exponent: 1 });
  return result;
}

function factoriseVerifier(value: bigint): PrimePower[] {
  if (value < 2n) return [];
  const numericValue = Number(value);
  if (!Number.isSafeInteger(numericValue)) {
    throw new Error(`Wave 1 verifier domain exceeded: ${value.toString()}`);
  }
  const factors: number[] = [];
  let remainder = numericValue;
  for (let candidate = 2; candidate <= remainder; candidate += 1) {
    if (!isPrimeVerifier(candidate)) continue;
    while (remainder % candidate === 0) {
      factors.push(candidate);
      remainder /= candidate;
    }
  }
  const grouped = new Map<number, number>();
  for (const factor of factors) grouped.set(factor, (grouped.get(factor) ?? 0) + 1);
  return [...grouped.entries()].map(([prime, exponent]) => ({ prime, exponent }));
}

function multiplyPrimePowers(factors: readonly PrimePower[]): bigint {
  return factors.reduce(
    (product, factor) => product * BigInt(factor.prime) ** BigInt(factor.exponent),
    1n,
  );
}

function expandedPrimeFactors(factors: readonly PrimePower[]): number[] {
  return factors.flatMap((factor) => Array.from({ length: factor.exponent }, () => factor.prime));
}

function formatFactorisation(factors: readonly PrimePower[]): string {
  if (factors.length === 0) return "1";
  return factors
    .map((factor) => (factor.exponent === 1 ? `${factor.prime}` : `${factor.prime}^${factor.exponent}`))
    .join(" × ");
}

function formatPrimeSet(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function formatPair(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

function nextPrimeAfter(value: number): number {
  let candidate = value + 1;
  while (!isPrimeCanonical(candidate)) candidate += 1;
  return candidate;
}

function firstCompositeInInterval(lower: number, upper: number): number | undefined {
  for (let value = Math.max(4, lower); value <= upper; value += 1) {
    if (!isPrimeCanonical(value)) return value;
  }
  return undefined;
}

function difficultyFromScore(score: number): NumCp004Difficulty {
  if (score <= 3) return "EASY";
  if (score <= 6) return "MEDIUM";
  return "HARD";
}

function makeOptions(
  correctValue: string,
  wrongCandidates: readonly { value: string; misconceptionId: string }[],
  rng: () => number,
): { options: NumCp004Option[]; correctIndex: number } {
  const seen = new Set<string>([correctValue]);
  const wrongs: { value: string; misconceptionId: string }[] = [];
  for (const candidate of wrongCandidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  if (wrongs.length !== 3) {
    throw new Error(`Unable to construct three unique misconception options for ${correctValue}`);
  }
  const options = shuffled<NumCp004Option>(rng, [
    { value: correctValue, isCorrect: true },
    ...wrongs.map((wrong) => ({
      value: wrong.value,
      isCorrect: false,
      misconceptionId: wrong.misconceptionId,
    })),
  ]);
  return {
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
  };
}

function sourceAncestryFor(prototypeId: NumCp004Wave01PrototypeId): string[] {
  const common = [
    "DESIGN:NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
    "UPLOAD:SSC-MATHEMATICS-PREVIOUS-YEAR-NUMBER-SYSTEM",
    "UPLOAD:DISHA-SSC-MATHEMATICS-GUIDE",
  ];
  if (["NUM-CP004-PROT-004", "NUM-CP004-PROT-005", "NUM-CP004-PROT-006"].includes(prototypeId)) {
    common.push("LEGACY:QUANT-V2:ns_prime_factorization", "LEGACY:QUANT-V2:ns_hidden_prime_exponent");
  }
  if (["NUM-CP004-PROT-001", "NUM-CP004-PROT-007", "NUM-CP004-PROT-008"].includes(prototypeId)) {
    common.push("LEGACY:QUANT-V2:ns_prime_composite_deduction");
  }
  return common;
}

function buildPackage(args: {
  prototypeId: NumCp004Wave01PrototypeId;
  seed: number;
  difficulty: NumCp004Difficulty;
  answerSemantic: NumCp004AnswerSemantic;
  stem: string;
  canonicalAnswer: string;
  verifierAnswer: string;
  hiddenState: Readonly<Record<string, unknown>>;
  options: NumCp004Option[];
  correctIndex: number;
  explanation: NumCp004Explanation;
}): NumCp004Wave01Package {
  return {
    packageId: "NUM-001",
    checkpointId: "NUM-CP-004",
    temporaryPrototypeId: args.prototypeId,
    permanentQlId: null,
    seed: args.seed,
    locale: "en-IN",
    difficulty: args.difficulty,
    answerSemantic: args.answerSemantic,
    stem: args.stem,
    options: args.options,
    correctIndex: args.correctIndex,
    canonicalAnswer: args.canonicalAnswer,
    verifierAnswer: args.verifierAnswer,
    hiddenState: args.hiddenState,
    sourceAncestry: sourceAncestryFor(args.prototypeId),
    prototypeAncestry: [args.prototypeId, "NUM-CP-004-WAVE-01"],
    mathematicalFingerprint: `${args.prototypeId}:${JSON.stringify(args.hiddenState)}`,
    explanation: args.explanation,
    lifecycle: LIFECYCLE,
  };
}

function classificationValue(seed: number, tier: number, rng: () => number): number {
  const classIndex = seed % 4;
  if (classIndex === 0) return 1;
  if (classIndex === 1) return tier === 2 ? -randomInt(rng, 2, 90) : 0;
  if (classIndex === 2) {
    const ranges: readonly [number, number][] = [
      [2, 47],
      [53, 197],
      [199, 499],
    ];
    const [minimum, maximum] = ranges[tier]!;
    const candidates = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index).filter(isPrimeCanonical);
    return pick(rng, candidates);
  }
  const first = pick(rng, SMALL_PRIMES.slice(0, tier === 0 ? 4 : tier === 1 ? 7 : 10));
  const second = pick(rng, SMALL_PRIMES.slice(0, tier === 0 ? 4 : tier === 1 ? 7 : 10));
  return first * second;
}

function generateClassification(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-001" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const value = classificationValue(seed, tier, rng);
  const canonicalAnswer = classifyPrimeCanonical(value);
  const verifierAnswer = classifyPrimeVerifier(value);
  const optionResult = makeOptions(
    canonicalAnswer,
    (["PRIME", "COMPOSITE", "UNIT", "NEITHER"] as const)
      .filter((valueClass) => valueClass !== canonicalAnswer)
      .map((valueClass) => ({
        value: valueClass,
        misconceptionId:
          value === 1 && valueClass === "PRIME"
            ? "ONE_IS_PRIME"
            : value <= 0 && valueClass === "PRIME"
              ? "ZERO_OR_NEGATIVE_IS_PRIME"
              : "PRIME_CLASS_CONFUSION",
      })),
    rng,
  );
  const testedDivisors = value > 1
    ? SMALL_PRIMES.filter((prime) => prime * prime <= value).filter((prime) => value % prime === 0)
    : [];
  const score = tier * 3 + (Math.abs(value) >= 100 ? 2 : 1);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "PRIME_CLASS",
    stem: `Classify the integer ${value} as PRIME, COMPOSITE, UNIT or NEITHER.`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: {
      value,
      testedDivisors,
      divisorCount: positiveDivisorsByEnumeration(value).length,
      complexityScore: score,
    },
    ...optionResult,
    explanation: {
      coreConcept: ["A prime positive integer has exactly two positive divisors: 1 and itself."],
      givenDataAndStrategy: [`The integer to classify is ${value}. Check the special cases 1 and non-positive integers before testing primality.`],
      stepByStep:
        value === 1
          ? ["The number 1 has only one positive divisor.", "Therefore, it is the unit, not a prime or composite number."]
          : value <= 0
            ? ["Prime and composite classification is restricted here to positive integers greater than 1.", `Therefore, ${value} is classified as NEITHER.`]
            : testedDivisors.length > 0
              ? [`${value} is divisible by ${testedDivisors[0]}, in addition to 1 and itself.`, "Therefore, it is COMPOSITE."]
              : [`No prime not exceeding the square-root boundary divides ${value}.`, "Therefore, it is PRIME."],
      examSpeedMethod: ["Test only prime divisors up to the square root; stop as soon as one divides exactly."],
      commonTraps: optionResult.options
        .filter((option) => !option.isCorrect)
        .map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `${value} is ${canonicalAnswer}.`,
    },
  });
}

function intervalState(seed: number, tier: number, rng: () => number): { lower: number; upper: number; score: number } {
  const lowerRanges: readonly [number, number][] = [
    [1, 20],
    [20, 90],
    [80, 220],
  ];
  const widths = [10, 18, 28] as const;
  const [minimum, maximum] = lowerRanges[tier]!;
  const lower = randomInt(rng, minimum, maximum);
  const upper = lower + widths[tier] + (seed % 4);
  return { lower, upper, score: 2 + tier * 3 + (lower === 1 ? 1 : 0) };
}

function primeSetWrongCandidates(lower: number, upper: number, primes: readonly number[]): { value: string; misconceptionId: string }[] {
  const firstComposite = firstCompositeInInterval(lower, upper) ?? upper + 1;
  const removeFirst = primes.slice(1);
  const removeLast = primes.slice(0, -1);
  const addOne = [...primes, 1].sort((a, b) => a - b);
  const addComposite = [...primes, firstComposite].sort((a, b) => a - b);
  return [
    { value: formatPrimeSet(removeFirst), misconceptionId: "LOWER_PRIME_OR_FIRST_PRIME_MISSED" },
    { value: formatPrimeSet(removeLast), misconceptionId: "UPPER_ENDPOINT_OR_LAST_PRIME_MISSED" },
    { value: formatPrimeSet(addOne), misconceptionId: "ONE_INCLUDED_AS_PRIME" },
    { value: formatPrimeSet(addComposite), misconceptionId: "COMPOSITE_ACCEPTED_AS_PRIME" },
  ];
}

function generatePrimeIntervalSet(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-002" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const { lower, upper, score } = intervalState(seed, tier, rng);
  const canonicalPrimes = primesInIntervalCanonical(lower, upper);
  const verifierPrimes = primesInIntervalVerifier(lower, upper);
  const canonicalAnswer = formatPrimeSet(canonicalPrimes);
  const verifierAnswer = formatPrimeSet(verifierPrimes);
  const optionResult = makeOptions(canonicalAnswer, primeSetWrongCandidates(lower, upper, canonicalPrimes), rng);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "PRIME_SET",
    stem: `Which option gives the complete set of prime numbers in the inclusive interval [${lower}, ${upper}]?`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { lower, upper, primes: canonicalPrimes, complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["A complete interval answer must include every prime inside both inclusive endpoints and no composite number."],
      givenDataAndStrategy: [`Test each integer from ${lower} through ${upper}, using prime divisors only up to its square root.`],
      stepByStep: canonicalPrimes.length === 0
        ? [`No integer in [${lower}, ${upper}] passes the primality test.`, "Therefore, the required set is empty."]
        : [`The values that pass are ${canonicalPrimes.join(", ")}.`, `Hence the complete set is ${canonicalAnswer}.`],
      examSpeedMethod: ["Remove even numbers above 2 and multiples of 3 or 5 first, then test the few remaining candidates."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The complete prime set is ${canonicalAnswer}.`,
    },
  });
}

function generatePrimeIntervalCount(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-003" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const { lower, upper, score } = intervalState(seed + 37, tier, rng);
  const canonicalPrimes = primesInIntervalCanonical(lower, upper);
  const verifierPrimes = primesInIntervalVerifier(lower, upper);
  const canonicalAnswer = String(canonicalPrimes.length);
  const verifierAnswer = String(verifierPrimes.length);
  const oddCount = Array.from({ length: upper - lower + 1 }, (_, index) => lower + index).filter((value) => value % 2 !== 0).length;
  const optionResult = makeOptions(
    canonicalAnswer,
    [
      { value: String(Math.max(0, canonicalPrimes.length - 1)), misconceptionId: "INTERVAL_ENDPOINT_EXCLUDED" },
      { value: String(canonicalPrimes.length + 1), misconceptionId: "ONE_OR_COMPOSITE_COUNTED_AS_PRIME" },
      { value: String(oddCount), misconceptionId: "ODD_NUMBERS_COUNTED_AS_PRIMES" },
      { value: String(canonicalPrimes.length + 2), misconceptionId: "TWO_COMPOSITES_COUNTED_AS_PRIMES" },
    ],
    rng,
  );
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "COUNT",
    stem: `How many prime numbers lie in the inclusive interval from ${lower} to ${upper}?`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { lower, upper, primes: canonicalPrimes, count: canonicalPrimes.length, complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Count only integers with exactly two positive divisors."],
      givenDataAndStrategy: [`List the primes from ${lower} through ${upper}, including an endpoint when it is prime.`],
      stepByStep: [`The primes are ${canonicalPrimes.length === 0 ? "none" : canonicalPrimes.join(", ")}.`, `Their number is ${canonicalPrimes.length}.`],
      examSpeedMethod: ["Cross out even values above 2 and obvious multiples of 3 or 5 before testing the remaining candidates."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `${canonicalPrimes.length} prime number${canonicalPrimes.length === 1 ? "" : "s"} lie in the interval.`,
    },
  });
}

function constructedFactors(seed: number, tier: number, rng: () => number): PrimePower[] {
  const supportCount = tier + 1;
  const available = shuffled(rng, SMALL_PRIMES.slice(0, tier === 0 ? 5 : tier === 1 ? 8 : 10)).slice(0, supportCount).sort((a, b) => a - b);
  return available.map((prime, index) => ({
    prime,
    exponent: tier === 0 ? 1 + ((seed + index) % 2) : 1 + ((seed + index * 2) % (tier + 2)),
  }));
}

function factorisationWrongCandidates(factors: readonly PrimePower[]): { value: string; misconceptionId: string }[] {
  const dropped = factors.map((factor, index) =>
    index === 0 ? { ...factor, exponent: Math.max(0, factor.exponent - 1) } : factor,
  ).filter((factor) => factor.exponent > 0);
  const extra = factors.map((factor, index) =>
    index === factors.length - 1 ? { ...factor, exponent: factor.exponent + 1 } : factor,
  );
  const replaced = factors.map((factor, index) =>
    index === factors.length - 1 ? { prime: nextPrimeAfter(factor.prime), exponent: factor.exponent } : factor,
  );
  const stoppedAtComposite = factors.length >= 2
    ? `${factors[0]!.prime * factors[1]!.prime}${factors[0]!.exponent + factors[1]!.exponent > 2 ? `^${Math.max(factors[0]!.exponent, factors[1]!.exponent)}` : ""}${factors.length > 2 ? ` × ${formatFactorisation(factors.slice(2))}` : ""}`
    : String(factors[0]!.prime ** factors[0]!.exponent);
  return [
    { value: formatFactorisation(dropped), misconceptionId: "DROPPED_REPEATED_PRIME" },
    { value: formatFactorisation(extra), misconceptionId: "EXTRA_REPEATED_PRIME" },
    { value: formatFactorisation(replaced), misconceptionId: "WRONG_PRIME_SUPPORT" },
    { value: stoppedAtComposite, misconceptionId: "STOPPED_AT_COMPOSITE_FACTOR" },
  ];
}

function generateFactorisation(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-004" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const factors = constructedFactors(seed, tier, rng);
  const value = multiplyPrimePowers(factors);
  const canonicalFactors = factoriseCanonical(value);
  const verifierFactors = factoriseVerifier(value);
  const canonicalAnswer = formatFactorisation(canonicalFactors);
  const verifierAnswer = formatFactorisation(verifierFactors);
  const exponentTotal = factors.reduce((total, factor) => total + factor.exponent, 0);
  const score = factors.length * 2 + exponentTotal + tier;
  const optionResult = makeOptions(canonicalAnswer, factorisationWrongCandidates(factors), rng);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "FACTORISATION",
    stem: `Write ${value.toString()} as a complete product of prime powers.`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { value: value.toString(), factors, exponentTotal, complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Every positive integer greater than 1 has a unique prime factorisation, apart from factor order."],
      givenDataAndStrategy: [`Divide ${value.toString()} repeatedly by the smallest available prime and continue until the quotient is 1.`],
      stepByStep: factors.map((factor) => `${factor.prime} occurs ${factor.exponent} time${factor.exponent === 1 ? "" : "s"}, contributing ${factor.prime}^${factor.exponent}.`).concat(`Therefore, ${value.toString()} = ${canonicalAnswer}.`),
      examSpeedMethod: ["Use divisibility tests for 2, 3, 5 and 11 first, and group repeated factors as powers."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The complete prime factorisation is ${canonicalAnswer}.`,
    },
  });
}

function propertyValue(target: PrimeFactorPropertyTarget, factors: readonly PrimePower[]): number {
  if (target === "SMALLEST_PRIME_FACTOR") return factors[0]!.prime;
  if (target === "LARGEST_PRIME_FACTOR") return factors[factors.length - 1]!.prime;
  if (target === "DISTINCT_PRIME_FACTOR_COUNT") return factors.length;
  return factors.reduce((total, factor) => total + factor.exponent, 0);
}

function propertyValueVerifier(target: PrimeFactorPropertyTarget, factors: readonly PrimePower[]): number {
  const expanded = expandedPrimeFactors(factors);
  if (target === "SMALLEST_PRIME_FACTOR") return Math.min(...expanded);
  if (target === "LARGEST_PRIME_FACTOR") return Math.max(...expanded);
  if (target === "DISTINCT_PRIME_FACTOR_COUNT") return new Set(expanded).size;
  return expanded.length;
}

function propertyWrongCandidates(
  correct: number,
  target: PrimeFactorPropertyTarget,
  factors: readonly PrimePower[],
): { value: string; misconceptionId: string }[] {
  const values = [
    { value: propertyValue("SMALLEST_PRIME_FACTOR", factors), misconceptionId: "SMALLEST_LARGEST_FACTOR_CONFUSION" },
    { value: propertyValue("LARGEST_PRIME_FACTOR", factors), misconceptionId: "SMALLEST_LARGEST_FACTOR_CONFUSION" },
    { value: propertyValue("DISTINCT_PRIME_FACTOR_COUNT", factors), misconceptionId: "DISTINCT_COUNT_USED_FOR_MULTIPLICITY" },
    { value: propertyValue("TOTAL_PRIME_FACTOR_COUNT", factors), misconceptionId: "MULTIPLICITY_USED_FOR_DISTINCT_COUNT" },
    { value: correct + 1, misconceptionId: "PROPERTY_COUNT_OFF_BY_ONE" },
    { value: Math.max(0, correct - 1), misconceptionId: "PROPERTY_COUNT_OFF_BY_ONE" },
    { value: correct + 2, misconceptionId: "PROPERTY_VALUE_OVERCOUNTED" },
  ];
  return values.filter((candidate) => candidate.value !== correct || target === "SMALLEST_PRIME_FACTOR").map((candidate) => ({
    value: String(candidate.value),
    misconceptionId: candidate.misconceptionId,
  }));
}

function generatePrimeFactorProperty(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-005" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const targets: readonly PrimeFactorPropertyTarget[] = [
    "SMALLEST_PRIME_FACTOR",
    "LARGEST_PRIME_FACTOR",
    "DISTINCT_PRIME_FACTOR_COUNT",
    "TOTAL_PRIME_FACTOR_COUNT",
  ];
  const target = targets[seed % targets.length]!;
  const factors = constructedFactors(seed + 11, Math.max(1, tier), rng);
  const value = multiplyPrimePowers(factors);
  const canonicalValue = propertyValue(target, factors);
  const verifierValue = propertyValueVerifier(target, factoriseVerifier(value));
  const canonicalAnswer = String(canonicalValue);
  const verifierAnswer = String(verifierValue);
  const score = factors.length * 2 + factors.reduce((sum, factor) => sum + factor.exponent, 0) + (target.includes("COUNT") ? 1 : 0);
  const optionResult = makeOptions(canonicalAnswer, propertyWrongCandidates(canonicalValue, target, factors), rng);
  const targetLabel: Record<PrimeFactorPropertyTarget, string> = {
    SMALLEST_PRIME_FACTOR: "smallest prime factor",
    LARGEST_PRIME_FACTOR: "largest prime factor",
    DISTINCT_PRIME_FACTOR_COUNT: "number of distinct prime factors",
    TOTAL_PRIME_FACTOR_COUNT: "total number of prime factors, counting multiplicity",
  };
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: target.includes("FACTOR") && !target.includes("COUNT") ? "PRIME_FACTOR" : "COUNT",
    stem: `Given ${value.toString()} = ${formatFactorisation(factors)}, find the ${targetLabel[target]}.`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { value: value.toString(), factors, target, complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Prime-exponent notation shows both the distinct prime support and each prime's multiplicity."],
      givenDataAndStrategy: [`Read the requested property directly from ${formatFactorisation(factors)}.`],
      stepByStep: [`The expanded prime list is ${expandedPrimeFactors(factors).join(", ")}.`, `Therefore, the ${targetLabel[target]} is ${canonicalAnswer}.`],
      examSpeedMethod: ["For distinct count, count bases; for multiplicity, add exponents; for an extreme factor, compare the prime bases."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The required ${targetLabel[target]} is ${canonicalAnswer}.`,
    },
  });
}

function generateMissingComponent(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-006" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const factors = constructedFactors(seed + 23, Math.max(1, tier), rng);
  const value = multiplyPrimePowers(factors);
  const hideExponent = seed % 2 === 0;
  const hiddenIndex = randomInt(rng, 0, factors.length - 1);
  const hidden = factors[hiddenIndex]!;
  let stem: string;
  let answerSemantic: NumCp004AnswerSemantic;
  let canonicalAnswer: string;
  let verifierAnswer: string;
  let wrongCandidates: { value: string; misconceptionId: string }[];
  if (hideExponent) {
    answerSemantic = "PRIME_EXPONENT";
    canonicalAnswer = String(hidden.exponent);
    const verifierCandidates = Array.from({ length: 7 }, (_, index) => index);
    verifierAnswer = String(verifierCandidates.find((candidate) => {
      const candidateFactors = factors.map((factor, index) => index === hiddenIndex ? { ...factor, exponent: candidate } : factor);
      return multiplyPrimePowers(candidateFactors) === value;
    }));
    const visible = factors.map((factor, index) => index === hiddenIndex ? `${factor.prime}^x` : formatFactorisation([factor])).join(" × ");
    stem = `If ${value.toString()} = ${visible}, what is x?`;
    wrongCandidates = [
      { value: String(Math.max(0, hidden.exponent - 1)), misconceptionId: "MISSING_COMPONENT_OFF_BY_ONE" },
      { value: String(hidden.exponent + 1), misconceptionId: "MISSING_COMPONENT_OFF_BY_ONE" },
      { value: String(factors.length), misconceptionId: "DISTINCT_COUNT_USED_AS_EXPONENT" },
      { value: String(hidden.exponent + 2), misconceptionId: "EXPONENT_OVERCOUNTED" },
    ];
  } else {
    answerSemantic = "PRIME";
    canonicalAnswer = String(hidden.prime);
    const visible = factors.map((factor, index) => index === hiddenIndex ? `p^${factor.exponent}` : formatFactorisation([factor])).join(" × ");
    stem = `In the prime factorisation ${value.toString()} = ${visible}, what is the prime p?`;
    const candidatePrimes = SMALL_PRIMES.filter((prime) => prime !== hidden.prime);
    verifierAnswer = String(candidatePrimes.concat(hidden.prime).find((candidate) => {
      const candidateFactors = factors.map((factor, index) => index === hiddenIndex ? { ...factor, prime: candidate } : factor);
      return multiplyPrimePowers(candidateFactors) === value;
    }));
    wrongCandidates = shuffled(rng, candidatePrimes).slice(0, 4).map((prime) => ({
      value: String(prime),
      misconceptionId: prime < hidden.prime ? "SMALLER_PRIME_SUBSTITUTED" : "LARGER_PRIME_SUBSTITUTED",
    }));
  }
  const score = factors.length * 2 + hidden.exponent + (hideExponent ? 2 : 1) + tier;
  const optionResult = makeOptions(canonicalAnswer, wrongCandidates, rng);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic,
    stem,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { value: value.toString(), factors, hiddenIndex, hiddenKind: hideExponent ? "EXPONENT" : "PRIME", complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Unique prime factorisation fixes every prime base and exponent."],
      givenDataAndStrategy: [`Compare the complete factorisation of ${value.toString()} with the displayed factorisation and isolate the missing component.`],
      stepByStep: [`The verified factorisation is ${formatFactorisation(factors)}.`, `Therefore, the missing ${hideExponent ? "exponent" : "prime"} is ${canonicalAnswer}.`],
      examSpeedMethod: ["Divide by all visible prime powers; the remaining quotient identifies the missing prime power."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The missing ${hideExponent ? "exponent" : "prime"} is ${canonicalAnswer}.`,
    },
  });
}

function generateCoprimePair(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-007" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const base = randomInt(rng, tier === 0 ? 4 : tier === 1 ? 20 : 60, tier === 0 ? 18 : tier === 1 ? 70 : 140);
  const correctPair: [number, number] = [base, base + 1];
  const distractorBase = randomInt(rng, 3, 12 + tier * 6);
  const pairs: [number, number][] = [
    correctPair,
    [2 * distractorBase, 4 * distractorBase],
    [3 * (distractorBase + 1), 6 * (distractorBase + 1)],
    [5 * (distractorBase + 2), 10 * (distractorBase + 2)],
  ];
  const canonicalMatches = pairs.filter(([first, second]) => gcdCanonical(first, second) === 1);
  const verifierMatches = pairs.filter(([first, second]) => gcdByCommonDivisorSearch([first, second]) === 1);
  if (canonicalMatches.length !== 1 || verifierMatches.length !== 1) {
    throw new Error("Co-prime pair construction did not produce a unique answer");
  }
  const canonicalAnswer = formatPair(canonicalMatches[0]!);
  const verifierAnswer = formatPair(verifierMatches[0]!);
  const optionResult = makeOptions(
    canonicalAnswer,
    pairs.filter((pair) => formatPair(pair) !== canonicalAnswer).map((pair) => ({
      value: formatPair(pair),
      misconceptionId: `COMMON_FACTOR_${gcdCanonical(pair[0], pair[1])}_MISSED`,
    })),
    rng,
  );
  const score = 2 + tier * 3 + (base > 99 ? 1 : 0);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "PAIR",
    stem: "Which of the following pairs is co-prime?",
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { pairs, gcds: pairs.map((pair) => gcdCanonical(pair[0], pair[1])), complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Two integers are co-prime when their greatest common divisor is 1."],
      givenDataAndStrategy: ["Check each pair for a common prime factor; exactly one pair has none."],
      stepByStep: pairs.map((pair) => `${formatPair(pair)} has HCF ${gcdCanonical(pair[0], pair[1])}.`).concat(`Hence ${canonicalAnswer} is the unique co-prime pair.`),
      examSpeedMethod: ["Consecutive positive integers are always co-prime; for the other pairs, spot an obvious shared factor."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `${canonicalAnswer} is the co-prime pair.`,
    },
  });
}

function classifyCoprimeTripleCanonical(values: readonly [number, number, number]): CoprimeClass {
  const pairwise = gcdCanonical(values[0], values[1]) === 1
    && gcdCanonical(values[0], values[2]) === 1
    && gcdCanonical(values[1], values[2]) === 1;
  const collective = gcdCanonical(gcdCanonical(values[0], values[1]), values[2]) === 1;
  if (pairwise && collective) return "PAIRWISE_AND_COLLECTIVELY_COPRIME";
  if (!pairwise && collective) return "COLLECTIVELY_BUT_NOT_PAIRWISE";
  if (pairwise && !collective) return "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME";
  return "NOT_COLLECTIVELY_COPRIME";
}

function classifyCoprimeTripleVerifier(values: readonly [number, number, number]): CoprimeClass {
  const pairwise = gcdByCommonDivisorSearch([values[0], values[1]]) === 1
    && gcdByCommonDivisorSearch([values[0], values[2]]) === 1
    && gcdByCommonDivisorSearch([values[1], values[2]]) === 1;
  const collective = gcdByCommonDivisorSearch(values) === 1;
  if (pairwise && collective) return "PAIRWISE_AND_COLLECTIVELY_COPRIME";
  if (!pairwise && collective) return "COLLECTIVELY_BUT_NOT_PAIRWISE";
  if (pairwise && !collective) return "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME";
  return "NOT_COLLECTIVELY_COPRIME";
}

function tripleFor(seed: number, tier: number): [number, number, number] {
  const category = seed % 3;
  const offset = tier * 6 + (seed % 4) * 2;
  if (category === 0) return [5 + offset, 8 + offset * 2, 9 + offset * 3];
  if (category === 1) {
    const scale = 1 + tier;
    return [6 * scale, 10 * scale, 15 * scale];
  }
  const scale = 1 + tier;
  return [6 * scale, 10 * scale, 14 * scale];
}

function ensurePairwiseTriple(values: [number, number, number]): [number, number, number] {
  if (classifyCoprimeTripleCanonical(values) === "PAIRWISE_AND_COLLECTIVELY_COPRIME") return values;
  const first = Math.max(5, values[0]);
  for (let second = first + 1; second < first + 30; second += 1) {
    for (let third = second + 1; third < second + 30; third += 1) {
      const candidate: [number, number, number] = [first, second, third];
      if (classifyCoprimeTripleCanonical(candidate) === "PAIRWISE_AND_COLLECTIVELY_COPRIME") return candidate;
    }
  }
  throw new Error("Unable to construct pairwise co-prime triple");
}

function generateCoprimeTriple(seed: number): NumCp004Wave01Package {
  const prototypeId = "NUM-CP004-PROT-008" as const;
  const rng = createRng(seed, prototypeId);
  const tier = seed % 3;
  const raw = tripleFor(seed, tier);
  const values = seed % 3 === 0 ? ensurePairwiseTriple(raw) : raw;
  const canonicalAnswer = classifyCoprimeTripleCanonical(values);
  const verifierAnswer = classifyCoprimeTripleVerifier(values);
  const labels: readonly CoprimeClass[] = [
    "PAIRWISE_AND_COLLECTIVELY_COPRIME",
    "COLLECTIVELY_BUT_NOT_PAIRWISE",
    "NOT_COLLECTIVELY_COPRIME",
    "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME",
  ];
  const optionResult = makeOptions(
    canonicalAnswer,
    labels.filter((label) => label !== canonicalAnswer).map((label) => ({
      value: label,
      misconceptionId: label === "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME"
        ? "PAIRWISE_BUT_NOT_COLLECTIVE_IMPOSSIBLE_CLASS"
        : "COLLECTIVE_CONFUSED_WITH_PAIRWISE",
    })),
    rng,
  );
  const pairGcds = [
    gcdCanonical(values[0], values[1]),
    gcdCanonical(values[0], values[2]),
    gcdCanonical(values[1], values[2]),
  ];
  const globalGcd = gcdCanonical(gcdCanonical(values[0], values[1]), values[2]);
  const score = 4 + tier * 2 + (canonicalAnswer === "COLLECTIVELY_BUT_NOT_PAIRWISE" ? 2 : 0);
  return buildPackage({
    prototypeId,
    seed,
    difficulty: difficultyFromScore(score),
    answerSemantic: "COPRIME_CLASS",
    stem: `Classify the triple (${values.join(", ")}) with respect to pairwise and collective co-primality.`,
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { values, pairGcds, globalGcd, complexityScore: score },
    ...optionResult,
    explanation: {
      coreConcept: ["Pairwise co-prime means every pair has HCF 1; collectively co-prime means the HCF of all three together is 1."],
      givenDataAndStrategy: [`Compute the three pair HCFs and the common HCF of ${values.join(", ")}.`],
      stepByStep: [
        `The pair HCFs are ${pairGcds.join(", ")}.`,
        `The HCF of all three numbers is ${globalGcd}.`,
        `Therefore, the triple is ${canonicalAnswer}.`,
      ],
      examSpeedMethod: ["Look for a factor common to all three first, then check whether any individual pair still shares a factor."],
      commonTraps: optionResult.options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The correct classification is ${canonicalAnswer}.`,
    },
  });
}

export function generateNumCp004Wave01Package(
  prototypeId: NumCp004Wave01PrototypeId,
  seed: number,
): NumCp004Wave01Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  switch (prototypeId) {
    case "NUM-CP004-PROT-001": return generateClassification(seed);
    case "NUM-CP004-PROT-002": return generatePrimeIntervalSet(seed);
    case "NUM-CP004-PROT-003": return generatePrimeIntervalCount(seed);
    case "NUM-CP004-PROT-004": return generateFactorisation(seed);
    case "NUM-CP004-PROT-005": return generatePrimeFactorProperty(seed);
    case "NUM-CP004-PROT-006": return generateMissingComponent(seed);
    case "NUM-CP004-PROT-007": return generateCoprimePair(seed);
    case "NUM-CP004-PROT-008": return generateCoprimeTriple(seed);
    default: {
      const exhaustive: never = prototypeId;
      throw new Error(`Unsupported NUM-CP-004 Wave 1 prototype: ${exhaustive}`);
    }
  }
}

export function generateNumCp004Wave01Sweep(seedsPerPrototype: number): NumCp004Wave01Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer");
  }
  return NUM_CP004_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_, index) =>
      generateNumCp004Wave01Package(prototypeId, index + 1),
    ),
  );
}

export { NUM_CP004_WAVE01_PROTOTYPE_IDS };
