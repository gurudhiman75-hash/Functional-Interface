
import {
  NUM_CP004_RETAINED_TEMPLATE_IDS,
  type NumCp004AnswerSemantic,
  type NumCp004Difficulty,
  type NumCp004Explanation,
  type NumCp004Option,
  type NumCp004RetainedQuestion,
  type NumCp004RetainedTemplateId,
} from "./types";
import { getNumCp004RetainedTemplate } from "./template-registry";

const SMALL_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47] as const;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

const LIFECYCLE = {
  permanentQlId: null,
  maturity: "RETAINED_ENGLISH_FREEZE_CANDIDATE",
  reviewStatus: "PRODUCT_OWNER_COMPLETION_INSTRUCTION",
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

function createRng(seed: number, salt: string): () => number {
  let state = (seed ^ hashText(salt)) >>> 0;
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

function isPrimeCanonical(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function divisorsByEnumeration(value: number): number[] {
  if (!Number.isSafeInteger(value) || value <= 0) return [];
  const divisors: number[] = [];
  for (let divisor = 1; divisor <= value; divisor += 1) {
    if (value % divisor === 0) divisors.push(divisor);
  }
  return divisors;
}

function isPrimeVerifier(value: number): boolean {
  return divisorsByEnumeration(value).length === 2;
}

function nextPrime(value: number): number {
  let candidate = value + 1;
  while (!isPrimeCanonical(candidate)) candidate += 1;
  return candidate;
}

function previousPrime(value: number): number {
  let candidate = value - 1;
  while (candidate >= 2 && !isPrimeCanonical(candidate)) candidate -= 1;
  if (candidate < 2) throw new Error(`No previous prime below ${value}`);
  return candidate;
}

function primesInInterval(
  lower: number,
  upper: number,
  predicate: (value: number) => boolean = isPrimeCanonical,
): number[] {
  const result: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (predicate(value)) result.push(value);
  }
  return result;
}

function gcdCanonical(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function gcdVerifier(values: readonly number[]): number {
  const upper = Math.min(...values.map((value) => Math.abs(value)));
  for (let divisor = upper; divisor >= 1; divisor -= 1) {
    if (values.every((value) => value % divisor === 0)) return divisor;
  }
  return 1;
}

interface PrimePower {
  readonly prime: number;
  readonly exponent: number;
}

function factoriseCanonical(value: number): PrimePower[] {
  if (!Number.isSafeInteger(value) || value < 2) return [];
  let remainder = value;
  const factors: PrimePower[] = [];
  for (let candidate = 2; candidate * candidate <= remainder; candidate += 1) {
    if (!isPrimeCanonical(candidate)) continue;
    let exponent = 0;
    while (remainder % candidate === 0) {
      remainder /= candidate;
      exponent += 1;
    }
    if (exponent > 0) factors.push({ prime: candidate, exponent });
  }
  if (remainder > 1) factors.push({ prime: remainder, exponent: 1 });
  return factors;
}

function factoriseVerifier(value: number): PrimePower[] {
  if (!Number.isSafeInteger(value) || value < 2) return [];
  let remainder = value;
  const expanded: number[] = [];
  for (let candidate = 2; candidate <= remainder; candidate += 1) {
    if (!isPrimeVerifier(candidate)) continue;
    while (remainder % candidate === 0) {
      expanded.push(candidate);
      remainder /= candidate;
    }
  }
  const grouped = new Map<number, number>();
  for (const prime of expanded) grouped.set(prime, (grouped.get(prime) ?? 0) + 1);
  return [...grouped.entries()].map(([prime, exponent]) => ({ prime, exponent }));
}

function multiplyPrimePowers(factors: readonly PrimePower[]): number {
  return factors.reduce(
    (product, factor) => product * factor.prime ** factor.exponent,
    1,
  );
}

function multiplyPrimePowersVerifier(factors: readonly PrimePower[]): number {
  let value = 1;
  for (const factor of factors) {
    for (let index = 0; index < factor.exponent; index += 1) value *= factor.prime;
  }
  return value;
}

function formatFactorisation(factors: readonly PrimePower[]): string {
  return factors
    .map((factor) => factor.exponent === 1
      ? `${factor.prime}`
      : `${factor.prime}^${factor.exponent}`)
    .join(" × ");
}

function formatNumberSet(values: readonly number[]): string {
  return `{${values.join(", ")}}`;
}

function formatPair(values: readonly [number, number]): string {
  return `(${values[0]}, ${values[1]})`;
}

function formatTriple(values: readonly [number, number, number]): string {
  return `(${values[0]}, ${values[1]}, ${values[2]})`;
}

function digitSum(value: number): number {
  return String(Math.abs(value))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function difficultyFor(seed: number): NumCp004Difficulty {
  return DIFFICULTIES[(seed - 1) % 3]!;
}

function makeOptions(
  correctValue: string,
  wrongCandidates: readonly { value: string; misconceptionId: string }[],
  seed: number,
): { options: NumCp004Option[]; correctIndex: number } {
  const seen = new Set<string>([correctValue]);
  const wrongs: { value: string; misconceptionId: string }[] = [];
  for (const candidate of wrongCandidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  if (wrongs.length < 3) {
    const numeric = Number(correctValue);
    if (Number.isFinite(numeric) && Number.isInteger(numeric)) {
      for (let distance = 1; wrongs.length < 3 && distance <= 20; distance += 1) {
        for (const value of [numeric - distance, numeric + distance]) {
          const text = String(value);
          if (seen.has(text)) continue;
          seen.add(text);
          wrongs.push({ value: text, misconceptionId: "NEARBY_NUMERIC_RESULT" });
          if (wrongs.length === 3) break;
        }
      }
    }
  }
  if (wrongs.length !== 3) {
    throw new Error(`Unable to create three unique options for ${correctValue}`);
  }
  const correctIndex = (seed - 1) % 4;
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, index): NumCp004Option => {
    if (index === correctIndex) return { value: correctValue, isCorrect: true };
    const wrong = wrongs[wrongIndex++]!;
    return {
      value: wrong.value,
      isCorrect: false,
      misconceptionId: wrong.misconceptionId,
    };
  });
  return { options, correctIndex };
}

function explanation(
  concept: string,
  strategy: string,
  steps: readonly string[],
  shortcut: string,
  options: readonly NumCp004Option[],
  finalAnswer: string,
): NumCp004Explanation {
  return {
    coreConcept: [concept],
    givenDataAndStrategy: [strategy],
    stepByStep: steps,
    examSpeedMethod: [shortcut],
    commonTraps: options
      .filter((option) => !option.isCorrect)
      .map((option) => `${option.value}: ${option.misconceptionId ?? "UNLABELLED_TRAP"}.`),
    finalAnswer,
  };
}

function buildQuestion(args: {
  templateId: NumCp004RetainedTemplateId;
  seed: number;
  answerSemantic: NumCp004AnswerSemantic;
  stem: string;
  canonicalAnswer: string;
  hiddenState: Readonly<Record<string, unknown>>;
  wrongCandidates: readonly { value: string; misconceptionId: string }[];
  concept: string;
  strategy: string;
  steps: readonly string[];
  shortcut: string;
}): NumCp004RetainedQuestion {
  const template = getNumCp004RetainedTemplate(args.templateId);
  const { options, correctIndex } = makeOptions(
    args.canonicalAnswer,
    args.wrongCandidates,
    args.seed,
  );
  const verifierAnswer = verifyNumCp004RetainedAnswer(
    args.templateId,
    args.hiddenState,
  );
  if (verifierAnswer !== args.canonicalAnswer) {
    throw new Error(
      `${args.templateId}/${args.seed} verifier mismatch: ${verifierAnswer} !== ${args.canonicalAnswer}`,
    );
  }
  return {
    packageId: "NUM-001",
    checkpointId: "NUM-CP-004",
    temporaryTemplateId: args.templateId,
    permanentQlId: null,
    seed: args.seed,
    locale: "en-IN",
    difficulty: difficultyFor(args.seed),
    answerSemantic: args.answerSemantic,
    stem: args.stem,
    options,
    correctIndex,
    canonicalAnswer: args.canonicalAnswer,
    verifierAnswer,
    hiddenState: args.hiddenState,
    sourceAncestry: template.sourceEvidence,
    prototypeAncestry: template.prototypeAncestry,
    mathematicalFingerprint: `${args.templateId}:${JSON.stringify(args.hiddenState)}`,
    explanation: explanation(
      args.concept,
      args.strategy,
      args.steps,
      args.shortcut,
      options,
      `The correct answer is ${args.canonicalAnswer}.`,
    ),
    lifecycle: LIFECYCLE,
  };
}

function generateClassification(seed: number): NumCp004RetainedQuestion {
  const rng = createRng(seed, "QLT01");
  const classIndex = (seed - 1) % 4;
  let value: number;
  if (classIndex === 0) value = 1;
  else if (classIndex === 1) value = seed % 2 === 0 ? 0 : -randomInt(rng, 2, 80);
  else if (classIndex === 2) value = nextPrime(10 + seed * 3);
  else value = pick(rng, [4, 6, 8, 9, 10, 12, 15, 21, 25, 27]) + 2 * Math.floor(seed / 10);
  const canonicalAnswer = value === 1
    ? "UNIT"
    : value <= 0
      ? "NEITHER"
      : isPrimeCanonical(value)
        ? "PRIME"
        : "COMPOSITE";
  return buildQuestion({
    templateId: "NUM-CP004-QLT-01",
    seed,
    answerSemantic: "PRIME_CLASS",
    stem: `How should ${value} be classified in prime-number terminology?`,
    canonicalAnswer,
    hiddenState: { mode: "CLASSIFY", value },
    wrongCandidates: [
      { value: "PRIME", misconceptionId: "ONE_OR_NONPOSITIVE_TREATED_AS_PRIME" },
      { value: "COMPOSITE", misconceptionId: "NONPOSITIVE_OR_UNIT_TREATED_AS_COMPOSITE" },
      { value: "UNIT", misconceptionId: "UNIT_CONFUSED_WITH_PRIME" },
      { value: "NEITHER", misconceptionId: "POSITIVE_INTEGER_CLASS_IGNORED" },
    ],
    concept: "A prime has exactly two positive divisors; a composite has more than two. One is a unit, while zero and negative integers are neither prime nor composite.",
    strategy: `Apply the classification definitions directly to ${value}.`,
    steps: [
      `Check whether ${value} is positive and greater than one.`,
      `Use its positive-divisor structure to decide the class.`,
      `The resulting class is ${canonicalAnswer}.`,
    ],
    shortcut: "Handle 1, 0 and negative values before testing divisibility.",
  });
}

function intervalState(seed: number): { lower: number; upper: number } {
  const edge = (seed - 1) % 5;
  if (edge === 0) {
    let prime = nextPrime(20 + seed * 3);
    let following = nextPrime(prime);
    while (following - prime < 4) {
      prime = following;
      following = nextPrime(prime);
    }
    return { lower: prime + 1, upper: following - 1 };
  }
  if (edge === 1) {
    const prime = nextPrime(20 + seed * 5);
    return { lower: prime, upper: prime };
  }
  const lower = 5 + ((seed * 11) % 120);
  return { lower, upper: lower + 8 + (seed % 10) };
}

function generatePrimeIntervalSet(seed: number): NumCp004RetainedQuestion {
  const { lower, upper } = intervalState(seed);
  const primes = primesInInterval(lower, upper);
  const canonicalAnswer = formatNumberSet(primes);
  const omitted = primes.length > 0 ? primes.slice(1) : [nextPrime(upper)];
  const addedComposite = [...primes, upper + 1].sort((a, b) => a - b);
  const shifted = primes.length > 0 ? primes.map((value) => value + 1) : [lower];
  const allIntegers = Array.from({ length: upper - lower + 1 }, (_unused, index) => lower + index);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-02",
    seed,
    answerSemantic: "PRIME_SET",
    stem: `Which set contains every prime integer from ${lower} through ${upper}, including both endpoints?`,
    canonicalAnswer,
    hiddenState: { mode: "INTERVAL_SET", lower, upper },
    wrongCandidates: [
      { value: formatNumberSet(omitted), misconceptionId: "FIRST_VALID_PRIME_OMITTED" },
      { value: formatNumberSet(addedComposite), misconceptionId: "COMPOSITE_ENDPOINT_ADDED" },
      { value: formatNumberSet(shifted), misconceptionId: "INTERVAL_VALUES_SHIFTED" },
      { value: formatNumberSet(allIntegers), misconceptionId: "EVERY_INTERVAL_INTEGER_RETAINED" },
    ],
    concept: "A complete interval answer requires testing every integer in the stated inclusive range.",
    strategy: `Check each integer from ${lower} to ${upper} and retain only primes.`,
    steps: [
      `Test divisibility only up to the square root of each candidate.`,
      `The prime candidates are ${canonicalAnswer}.`,
      "No other integer in the interval has exactly two positive divisors.",
    ],
    shortcut: "Eliminate even numbers greater than two before trial division.",
  });
}

function generatePrimeIntervalCount(seed: number): NumCp004RetainedQuestion {
  const { lower, upper } = intervalState(seed + 13);
  const primes = primesInInterval(lower, upper);
  const canonicalAnswer = String(primes.length);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-03",
    seed,
    answerSemantic: "COUNT",
    stem: `How many prime numbers lie in the inclusive interval [${lower}, ${upper}]?`,
    canonicalAnswer,
    hiddenState: { mode: "INTERVAL_COUNT", lower, upper },
    wrongCandidates: [
      { value: String(Math.max(0, primes.length - 1)), misconceptionId: "ONE_PRIME_MISSED" },
      { value: String(primes.length + 1), misconceptionId: "ONE_COMPOSITE_COUNTED" },
      { value: String(upper - lower + 1), misconceptionId: "EVERY_INTEGER_COUNTED" },
      { value: String(Math.max(0, upper - lower)), misconceptionId: "ENDPOINT_COUNT_USED_AS_PRIME_COUNT" },
    ],
    concept: "Prime counting over a bounded interval is exact enumeration, not interval length.",
    strategy: `List the primes from ${lower} through ${upper}, then count the list.`,
    steps: [
      `The primes are ${formatNumberSet(primes)}.`,
      `This list contains ${primes.length} value${primes.length === 1 ? "" : "s"}.`,
      `Therefore the required count is ${canonicalAnswer}.`,
    ],
    shortcut: "Cross out 1, even composites and obvious multiples before checking the remaining candidates.",
  });
}

function generateAdjacentPrime(seed: number): NumCp004RetainedQuestion {
  const direction = (seed - 1) % 4;
  let stem: string;
  let answer: number;
  let hiddenState: Record<string, unknown>;
  if (direction === 0) {
    const value = 20 + seed * 4;
    answer = nextPrime(value);
    stem = `What is the smallest prime strictly greater than ${value}?`;
    hiddenState = { mode: "ADJACENT_PRIME", direction: "NEXT", value };
  } else if (direction === 1) {
    const value = 30 + seed * 4;
    answer = previousPrime(value);
    stem = `What is the greatest prime strictly less than ${value}?`;
    hiddenState = { mode: "ADJACENT_PRIME", direction: "PREVIOUS", value };
  } else {
    const lower = 10 + seed * 3;
    const upper = lower + 20;
    const primes = primesInInterval(lower, upper);
    const useLeast = direction === 2;
    answer = useLeast ? primes[0]! : primes[primes.length - 1]!;
    stem = `Which is the ${useLeast ? "least" : "greatest"} prime in the interval [${lower}, ${upper}]?`;
    hiddenState = { mode: "ADJACENT_PRIME", direction: useLeast ? "LEAST" : "GREATEST", lower, upper };
  }
  return buildQuestion({
    templateId: "NUM-CP004-QLT-04",
    seed,
    answerSemantic: "PRIME",
    stem,
    canonicalAnswer: String(answer),
    hiddenState,
    wrongCandidates: [
      { value: String(answer - 1), misconceptionId: "NEAREST_INTEGER_NOT_TESTED" },
      { value: String(answer + 1), misconceptionId: "DIRECTION_REVERSED" },
      { value: String(nextPrime(answer)), misconceptionId: "ONE_VALID_PRIME_SKIPPED" },
      { value: String(previousPrime(answer)), misconceptionId: "OPPOSITE_EXTREMUM_SELECTED" },
    ],
    concept: "Adjacent and extreme prime tasks require both primality and the stated order condition.",
    strategy: "Test candidates in the required direction and stop at the first valid prime.",
    steps: [
      `The required direction or interval is encoded in the question.`,
      `${answer} is prime.`,
      `No closer eligible integer in the required direction is prime.`,
    ],
    shortcut: "Check odd candidates only, except that 2 is prime.",
  });
}

function uniqueDigitRangeState(seed: number): { prime: number; lower: number; upper: number; sum: number } {
  let prime = nextPrime(20 + seed * 9);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const lower = Math.max(2, prime - 4 - (seed % 3));
    const upper = prime + 4 + ((seed + 1) % 3);
    const sum = digitSum(prime);
    const matches = primesInInterval(lower, upper).filter((value) => digitSum(value) === sum);
    if (matches.length === 1) return { prime, lower, upper, sum };
    prime = nextPrime(prime + 3);
  }
  throw new Error(`Unable to construct unique digit-range prime for seed ${seed}`);
}

function generateDigitRangePrime(seed: number): NumCp004RetainedQuestion {
  const { prime, lower, upper, sum } = uniqueDigitRangeState(seed);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-05",
    seed,
    answerSemantic: "PRIME",
    stem: `A prime lies between ${lower} and ${upper}, inclusive, and its digits add to ${sum}. Which prime is it?`,
    canonicalAnswer: String(prime),
    hiddenState: { mode: "DIGIT_RANGE_PRIME", lower, upper, digitSum: sum },
    wrongCandidates: [
      { value: String(prime - 2), misconceptionId: "DIGIT_CONDITION_USED_WITHOUT_PRIMALITY" },
      { value: String(prime + 2), misconceptionId: "RANGE_CANDIDATE_NOT_CHECKED" },
      { value: String(sum), misconceptionId: "DIGIT_SUM_RETURNED_AS_NUMBER" },
      { value: String(lower), misconceptionId: "LOWER_ENDPOINT_ASSUMED" },
    ],
    concept: "Both the interval and digit condition must hold, and the surviving value must be prime.",
    strategy: "List interval primes first, then apply the digit-sum filter.",
    steps: [
      `The primes in the interval are ${formatNumberSet(primesInInterval(lower, upper))}.`,
      `Only ${prime} has digit sum ${sum}.`,
      `Therefore the unique prime is ${prime}.`,
    ],
    shortcut: "Apply the cheaper digit-sum check before full primality testing when the range is short.",
  });
}

function generatePrimeClaim(seed: number): NumCp004RetainedQuestion {
  const prime = nextPrime(20 + seed * 5);
  const composite = prime * 2;
  const claims = [
    { text: `${prime} is prime.`, kind: "IS_PRIME", value: prime },
    { text: `${composite} is prime.`, kind: "IS_PRIME", value: composite },
    { text: "1 is prime.", kind: "IS_PRIME", value: 1 },
    { text: `${prime * prime} is prime.`, kind: "IS_PRIME", value: prime * prime },
  ];
  const correctText = claims[0]!.text;
  return buildQuestion({
    templateId: "NUM-CP004-QLT-06",
    seed,
    answerSemantic: "BOOLEAN_CLAIM",
    stem: `For the values ${prime}, ${composite}, 1 and ${prime * prime}, which statement is true?`,
    canonicalAnswer: correctText,
    hiddenState: { mode: "PRIME_CLAIM", claims },
    wrongCandidates: claims.slice(1).map((claim, index) => ({
      value: claim.text,
      misconceptionId: ["COMPOSITE_NOT_TESTED", "ONE_TREATED_AS_PRIME", "PRIME_SQUARE_TREATED_AS_PRIME"][index]!,
    })),
    concept: "A prime claim is true only when the stated integer has exactly two positive divisors.",
    strategy: "Test each statement independently rather than trusting its form.",
    steps: [
      `${prime} has no divisor other than 1 and itself.`,
      `${composite} and ${prime * prime} are composite, while 1 is a unit.`,
      `Hence the true statement is: ${correctText}`,
    ],
    shortcut: "Reject even integers greater than 2, prime squares and the number 1 immediately.",
  });
}

function factorState(seed: number): PrimePower[] {
  const rng = createRng(seed, "FACTOR_STATE");
  const support = 2 + ((seed - 1) % 3);
  const primes = [...SMALL_PRIMES.slice(0, 8)];
  const factors: PrimePower[] = [];
  for (let index = 0; index < support; index += 1) {
    const prime = primes.splice(randomInt(rng, 0, primes.length - 1), 1)[0]!;
    const exponent = 1 + ((seed + index) % 3);
    factors.push({ prime, exponent });
  }
  return factors.sort((a, b) => a.prime - b.prime);
}

function factorWrongCandidates(factors: readonly PrimePower[]): { value: string; misconceptionId: string }[] {
  const first = factors[0]!;
  const second = factors[1] ?? first;
  const reduced = factors.map((factor, index) => index === 0
    ? { ...factor, exponent: Math.max(1, factor.exponent - 1) }
    : factor);
  const increased = factors.map((factor, index) => index === factors.length - 1
    ? { ...factor, exponent: factor.exponent + 1 }
    : factor);
  return [
    { value: formatFactorisation(reduced), misconceptionId: "REPEATED_FACTOR_OMITTED" },
    { value: formatFactorisation(increased), misconceptionId: "EXPONENT_OVERCOUNTED" },
    { value: `${first.prime * second.prime} × ${formatFactorisation(factors.slice(2)) || "1"}`, misconceptionId: "COMPOSITE_FACTOR_NOT_SPLIT" },
    { value: formatFactorisation([...factors].reverse()), misconceptionId: "NONCANONICAL_ORDER_ACCEPTED_WITH_OTHER_ERROR" },
  ];
}

function generateFactorisation(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed);
  const value = multiplyPrimePowers(factors);
  const canonicalAnswer = formatFactorisation(factors);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-07",
    seed,
    answerSemantic: "FACTORISATION",
    stem: `What is the complete prime factorisation of ${value}?`,
    canonicalAnswer,
    hiddenState: { mode: "FACTORISATION", value },
    wrongCandidates: factorWrongCandidates(factors),
    concept: "The fundamental theorem of arithmetic gives one complete prime-exponent form for every integer greater than one.",
    strategy: "Divide repeatedly by the least available prime until the quotient becomes one.",
    steps: [
      `Repeated prime division of ${value} gives ${canonicalAnswer}.`,
      "Every displayed base is prime.",
      "Multiplying the prime powers reconstructs the original integer.",
    ],
    shortcut: "Use divisibility by 2, 3, 5, 7 and then test primes only up to the square root of the remaining quotient.",
  });
}

function generatePrimeFactorExtremum(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 7);
  const value = multiplyPrimePowers(factors);
  const direction = seed % 2 === 0 ? "SMALLEST" : "LARGEST";
  const answer = direction === "SMALLEST" ? factors[0]!.prime : factors[factors.length - 1]!.prime;
  return buildQuestion({
    templateId: "NUM-CP004-QLT-08",
    seed,
    answerSemantic: "PRIME_FACTOR",
    stem: `What is the ${direction.toLowerCase()} prime factor of ${value}?`,
    canonicalAnswer: String(answer),
    hiddenState: { mode: "PRIME_FACTOR_EXTREMUM", value, direction },
    wrongCandidates: [
      { value: String(factors[0]!.prime), misconceptionId: "SMALLEST_SELECTED_FOR_LARGEST" },
      { value: String(factors[factors.length - 1]!.prime), misconceptionId: "LARGEST_SELECTED_FOR_SMALLEST" },
      { value: String(factors[0]!.exponent), misconceptionId: "EXPONENT_CONFUSED_WITH_PRIME_FACTOR" },
      { value: String(value), misconceptionId: "ORIGINAL_INTEGER_RETURNED" },
    ],
    concept: "Prime-factor extremum refers to the prime bases, not their exponents or repeated occurrences.",
    strategy: `Factorise ${value}, then inspect the ordered prime bases.`,
    steps: [
      `${value} = ${formatFactorisation(factors)}.`,
      `Its prime bases are ${formatNumberSet(factors.map((factor) => factor.prime))}.`,
      `The ${direction.toLowerCase()} one is ${answer}.`,
    ],
    shortcut: "For the smallest factor, stop at the first successful prime divisor; for the largest, finish the factorisation.",
  });
}

function generateDistinctFactorCount(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 17);
  const value = multiplyPrimePowers(factors);
  const answer = factors.length;
  return buildQuestion({
    templateId: "NUM-CP004-QLT-09",
    seed,
    answerSemantic: "COUNT",
    stem: `How many distinct prime factors does ${value} have?`,
    canonicalAnswer: String(answer),
    hiddenState: { mode: "DISTINCT_FACTOR_COUNT", value },
    wrongCandidates: [
      { value: String(factors.reduce((sum, factor) => sum + factor.exponent, 0)), misconceptionId: "MULTIPLICITY_COUNTED" },
      { value: String(answer + 1), misconceptionId: "COMPOSITE_REMAINDER_COUNTED" },
      { value: String(Math.max(1, answer - 1)), misconceptionId: "ONE_PRIME_BASE_OMITTED" },
      { value: String(factors[0]!.prime), misconceptionId: "SMALLEST_FACTOR_RETURNED" },
    ],
    concept: "Distinct prime-factor count is the number of different prime bases in the factorisation.",
    strategy: "Factorise the integer and count bases once each.",
    steps: [
      `${value} = ${formatFactorisation(factors)}.`,
      `The distinct prime bases are ${formatNumberSet(factors.map((factor) => factor.prime))}.`,
      `Their count is ${answer}.`,
    ],
    shortcut: "Ignore exponents when the word 'distinct' appears.",
  });
}

function generateMultiplicityCount(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 29);
  const value = multiplyPrimePowers(factors);
  const answer = factors.reduce((sum, factor) => sum + factor.exponent, 0);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-10",
    seed,
    answerSemantic: "COUNT",
    stem: `Counting multiplicity, how many prime factors occur in ${value}?`,
    canonicalAnswer: String(answer),
    hiddenState: { mode: "MULTIPLICITY_COUNT", value },
    wrongCandidates: [
      { value: String(factors.length), misconceptionId: "DISTINCT_COUNT_USED" },
      { value: String(answer + 1), misconceptionId: "EXPONENT_SUM_OVERCOUNTED" },
      { value: String(Math.max(1, answer - 1)), misconceptionId: "ONE_REPEATED_FACTOR_OMITTED" },
      { value: String(factors[factors.length - 1]!.prime), misconceptionId: "LARGEST_FACTOR_RETURNED" },
    ],
    concept: "Counting with multiplicity means adding all prime exponents.",
    strategy: "Write the prime-exponent form and add the exponents.",
    steps: [
      `${value} = ${formatFactorisation(factors)}.`,
      `The exponent sum is ${factors.map((factor) => factor.exponent).join(" + ")} = ${answer}.`,
      `Therefore ${answer} prime factors occur when repetitions are counted.`,
    ],
    shortcut: "Add exponents; do not count only the number of bases.",
  });
}

function generateReconstructInteger(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 41);
  const answer = multiplyPrimePowers(factors);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-11",
    seed,
    answerSemantic: "INTEGER",
    stem: `Which integer has prime factorisation ${formatFactorisation(factors)}?`,
    canonicalAnswer: String(answer),
    hiddenState: { mode: "RECONSTRUCT_INTEGER", factors },
    wrongCandidates: [
      { value: String(factors.reduce((sum, factor) => sum + factor.prime * factor.exponent, 0)), misconceptionId: "PRIME_TERMS_ADDED" },
      { value: String(factors.reduce((product, factor) => product * factor.prime * factor.exponent, 1)), misconceptionId: "EXPONENT_MULTIPLIED_AS_COEFFICIENT" },
      { value: String(answer + factors[0]!.prime), misconceptionId: "FINAL_MULTIPLICATION_ERROR" },
      { value: String(Math.max(2, answer / factors[0]!.prime)), misconceptionId: "ONE_PRIME_FACTOR_OMITTED" },
    ],
    concept: "A prime-exponent form reconstructs the integer by multiplying every prime power.",
    strategy: "Evaluate each power first, then multiply the results.",
    steps: [
      `The given prime powers are ${formatFactorisation(factors)}.`,
      `Their exact product is ${answer}.`,
      `Hence the reconstructed integer is ${answer}.`,
    ],
    shortcut: "Group powers before multiplying to reduce arithmetic errors.",
  });
}

function generateCompareStructures(seed: number): NumCp004RetainedQuestion {
  const factorsA = factorState(seed + 53);
  const factorsB = factorState(seed + 79).map((factor, index) => ({
    prime: factor.prime,
    exponent: factor.exponent + (index === 0 && seed % 2 === 0 ? 1 : 0),
  }));
  const valueA = multiplyPrimePowers(factorsA);
  const valueB = multiplyPrimePowers(factorsB);
  const targetIndex = (seed - 1) % 3;
  const target = ["DISTINCT", "MULTIPLICITY", "VALUE"] as const;
  let metricA: number;
  let metricB: number;
  if (target[targetIndex] === "DISTINCT") {
    metricA = factorsA.length;
    metricB = factorsB.length;
  } else if (target[targetIndex] === "MULTIPLICITY") {
    metricA = factorsA.reduce((sum, factor) => sum + factor.exponent, 0);
    metricB = factorsB.reduce((sum, factor) => sum + factor.exponent, 0);
  } else {
    metricA = valueA;
    metricB = valueB;
  }
  const answer = metricA === metricB ? "EQUAL" : metricA > metricB ? "A" : "B";
  const targetLabel = target[targetIndex] === "DISTINCT"
    ? "more distinct prime factors"
    : target[targetIndex] === "MULTIPLICITY"
      ? "more prime factors when multiplicity is counted"
      : "the greater integer value";
  return buildQuestion({
    templateId: "NUM-CP004-QLT-12",
    seed,
    answerSemantic: "COMPARISON_CLASS",
    stem: `A = ${formatFactorisation(factorsA)} and B = ${formatFactorisation(factorsB)}. Which has ${targetLabel}?`,
    canonicalAnswer: answer,
    hiddenState: { mode: "COMPARE_STRUCTURES", factorsA, factorsB, target: target[targetIndex] },
    wrongCandidates: [
      { value: "A", misconceptionId: "FIRST_STRUCTURE_ASSUMED_GREATER" },
      { value: "B", misconceptionId: "SECOND_STRUCTURE_ASSUMED_GREATER" },
      { value: "EQUAL", misconceptionId: "METRICS_NOT_COMPUTED" },
      { value: "CANNOT_BE_DETERMINED", misconceptionId: "VISIBLE_EXPONENT_DATA_IGNORED" },
    ],
    concept: "Prime-exponent structures can be compared by a stated projection: support size, exponent sum or numerical value.",
    strategy: `Compute the requested metric for A and B only.`,
    steps: [
      `For A, the requested metric is ${metricA}.`,
      `For B, the requested metric is ${metricB}.`,
      `Therefore the correct comparison is ${answer}.`,
    ],
    shortcut: "Do not multiply the full integers unless the question asks for value.",
  });
}

function generateMissingPrime(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 97);
  const hiddenIndex = (seed - 1) % factors.length;
  const hidden = factors[hiddenIndex]!;
  const value = multiplyPrimePowers(factors);
  const visible = factors.map((factor, index) =>
    index === hiddenIndex
      ? `?^${factor.exponent}`
      : factor.exponent === 1
        ? `${factor.prime}`
        : `${factor.prime}^${factor.exponent}`,
  ).join(" × ");
  return buildQuestion({
    templateId: "NUM-CP004-QLT-13",
    seed,
    answerSemantic: "PRIME",
    stem: `${value} = ${visible}. What prime replaces the question mark?`,
    canonicalAnswer: String(hidden.prime),
    hiddenState: { mode: "MISSING_PRIME", value, factors, hiddenIndex },
    wrongCandidates: [
      { value: String(hidden.exponent), misconceptionId: "EXPONENT_RETURNED_AS_PRIME" },
      { value: String(factors[(hiddenIndex + 1) % factors.length]!.prime), misconceptionId: "VISIBLE_PRIME_REUSED" },
      { value: String(hidden.prime + 2), misconceptionId: "NEARBY_ODD_NUMBER_ASSUMED_PRIME_FACTOR" },
      { value: String(value), misconceptionId: "ORIGINAL_INTEGER_RETURNED" },
    ],
    concept: "The missing prime is recovered by dividing out every visible prime power and taking the exact remaining root.",
    strategy: "Remove visible factors from the integer, then test the remaining prime base.",
    steps: [
      `Divide ${value} by all visible prime powers.`,
      `The remaining factor is ${hidden.prime}^${hidden.exponent}.`,
      `Thus the missing prime is ${hidden.prime}.`,
    ],
    shortcut: "Use cancellation in prime-exponent form instead of refactorising from the beginning.",
  });
}

function generateMissingExponent(seed: number): NumCp004RetainedQuestion {
  const factors = factorState(seed + 113);
  const hiddenIndex = (seed - 1) % factors.length;
  const hidden = factors[hiddenIndex]!;
  const value = multiplyPrimePowers(factors);
  const visible = factors.map((factor, index) =>
    index === hiddenIndex
      ? `${factor.prime}^?`
      : factor.exponent === 1
        ? `${factor.prime}`
        : `${factor.prime}^${factor.exponent}`,
  ).join(" × ");
  return buildQuestion({
    templateId: "NUM-CP004-QLT-14",
    seed,
    answerSemantic: "PRIME_EXPONENT",
    stem: `${value} = ${visible}. What exponent replaces the question mark?`,
    canonicalAnswer: String(hidden.exponent),
    hiddenState: { mode: "MISSING_EXPONENT", value, factors, hiddenIndex },
    wrongCandidates: [
      { value: String(hidden.prime), misconceptionId: "PRIME_BASE_RETURNED_AS_EXPONENT" },
      { value: String(hidden.exponent + 1), misconceptionId: "ONE_EXTRA_REPETITION_COUNTED" },
      { value: String(Math.max(0, hidden.exponent - 1)), misconceptionId: "ONE_REPETITION_OMITTED" },
      { value: String(factors.length), misconceptionId: "DISTINCT_SUPPORT_COUNT_USED" },
    ],
    concept: "A prime exponent records how many times that prime occurs in the complete factorisation.",
    strategy: "Divide out visible prime powers and count repeated divisions by the hidden base.",
    steps: [
      `After visible factors are removed, the remaining power is ${hidden.prime}^${hidden.exponent}.`,
      `${hidden.prime} divides the remainder exactly ${hidden.exponent} time${hidden.exponent === 1 ? "" : "s"}.`,
      `Therefore the exponent is ${hidden.exponent}.`,
    ],
    shortcut: "Use repeated division by the known prime base.",
  });
}

function generateCoprimePair(seed: number): NumCp004RetainedQuestion {
  const a = 6 + seed;
  const coprime = nextPrime(a + 2);
  const pairs: [number, number][] = [
    [a, coprime],
    [a, 2 * a],
    [2 * a, 4 * a],
    [3 * a, 6 * a],
  ];
  if (gcdCanonical(...pairs[0]) !== 1) pairs[0] = [a, a + 1];
  const correct = formatPair(pairs[0]);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-15",
    seed,
    answerSemantic: "PAIR",
    stem: `Among these four pairs built around ${a}, which pair is co-prime?`,
    canonicalAnswer: correct,
    hiddenState: { mode: "SELECT_COPRIME_PAIR", pairs },
    wrongCandidates: pairs.slice(1).map((pair) => ({
      value: formatPair(pair),
      misconceptionId: "COMMON_FACTOR_NOT_REMOVED",
    })),
    concept: "Two integers are co-prime exactly when their HCF is 1.",
    strategy: "Check the HCF of each listed pair.",
    steps: [
      `The HCF of ${correct} is 1.`,
      "Each other listed pair has a common factor greater than 1.",
      `Therefore ${correct} is the unique co-prime pair.`,
    ],
    shortcut: "Look first for an obvious shared factor such as 2, 3 or 5.",
  });
}

function coprimeCandidateState(seed: number): { fixed: number; candidates: number[]; valid: number[] } {
  const p = SMALL_PRIMES[1 + (seed % 4)]!;
  const q = SMALL_PRIMES[5 + (seed % 4)]!;
  const fixed = p * q;
  const start = 2 + seed;
  const candidates = Array.from({ length: 8 }, (_, index) => start + index);
  const valid = candidates.filter((candidate) => gcdCanonical(fixed, candidate) === 1);
  return { fixed, candidates, valid };
}

function generateCoprimeSet(seed: number): NumCp004RetainedQuestion {
  const { fixed, candidates, valid } = coprimeCandidateState(seed);
  const canonicalAnswer = formatNumberSet(valid);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-16",
    seed,
    answerSemantic: "COPRIME_SET",
    stem: `From ${formatNumberSet(candidates)}, select the complete set of values co-prime to ${fixed}.`,
    canonicalAnswer,
    hiddenState: { mode: "COPRIME_SET", fixed, candidates },
    wrongCandidates: [
      { value: formatNumberSet(valid.slice(1)), misconceptionId: "ONE_VALID_VALUE_OMITTED" },
      { value: formatNumberSet([...valid, candidates.find((value) => !valid.includes(value))!].sort((a, b) => a - b)), misconceptionId: "ONE_NONCOPRIME_VALUE_ADDED" },
      { value: formatNumberSet(candidates.filter((value) => value % 2 !== 0)), misconceptionId: "ODD_CONFUSED_WITH_COPRIME" },
      { value: "{}", misconceptionId: "NO_CANDIDATE_TESTED" },
    ],
    concept: "A complete co-prime set contains every candidate whose HCF with the fixed number is 1.",
    strategy: `Test each candidate against the prime support of ${fixed}.`,
    steps: [
      `${fixed} has prime support ${formatNumberSet(factoriseCanonical(fixed).map((factor) => factor.prime))}.`,
      `Reject candidates divisible by any of those primes.`,
      `The complete surviving set is ${canonicalAnswer}.`,
    ],
    shortcut: "Use the fixed number's distinct prime factors as quick rejection tests.",
  });
}

function generateCoprimeCount(seed: number): NumCp004RetainedQuestion {
  const { fixed, candidates, valid } = coprimeCandidateState(seed + 19);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-17",
    seed,
    answerSemantic: "COUNT",
    stem: `How many values in ${formatNumberSet(candidates)} are co-prime to ${fixed}?`,
    canonicalAnswer: String(valid.length),
    hiddenState: { mode: "COPRIME_COUNT", fixed, candidates },
    wrongCandidates: [
      { value: String(Math.max(0, valid.length - 1)), misconceptionId: "ONE_VALID_VALUE_MISSED" },
      { value: String(valid.length + 1), misconceptionId: "ONE_NONCOPRIME_VALUE_COUNTED" },
      { value: String(candidates.length), misconceptionId: "EVERY_CANDIDATE_COUNTED" },
      { value: String(factoriseCanonical(fixed).length), misconceptionId: "PRIME_SUPPORT_COUNT_RETURNED" },
    ],
    concept: "The required count is the size of the explicitly tested co-prime candidate set.",
    strategy: "Reject each candidate sharing a prime factor with the fixed number, then count survivors.",
    steps: [
      `The valid values are ${formatNumberSet(valid)}.`,
      `There are ${valid.length} such values.`,
      `Therefore the answer is ${valid.length}.`,
    ],
    shortcut: "Mark multiples of the fixed number's distinct prime factors.",
  });
}

function generateCoprimeUnknown(seed: number): NumCp004RetainedQuestion {
  const p = SMALL_PRIMES[1 + (seed % 4)]!;
  const q = SMALL_PRIMES[6 + (seed % 4)]!;
  const fixed = p * q;
  const good = nextPrime(fixed + seed);
  const candidates = [good, p * (2 + seed % 5), q * (3 + seed % 5), fixed + p];
  const answer = String(good);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-18",
    seed,
    answerSemantic: "INTEGER",
    stem: `Which value of x from ${formatNumberSet(candidates)} makes HCF(${fixed}, x) = 1?`,
    canonicalAnswer: answer,
    hiddenState: { mode: "COPRIME_UNKNOWN", fixed, candidates },
    wrongCandidates: candidates.slice(1).map((value) => ({
      value: String(value),
      misconceptionId: "CANDIDATE_SHARES_FIXED_PRIME_FACTOR",
    })),
    concept: "The unknown must avoid every prime factor of the fixed integer.",
    strategy: `Factor ${fixed}, then test the listed candidates.`,
    steps: [
      `${fixed} = ${formatFactorisation(factoriseCanonical(fixed))}.`,
      `${good} is divisible by none of those prime bases.`,
      `Hence x = ${good}.`,
    ],
    shortcut: "Check divisibility by the fixed number's prime support rather than computing full HCFs.",
  });
}

function coprimeTriple(seed: number): {
  values: [number, number, number];
  className: string;
} {
  const topology = (seed - 1) % 3;
  if (topology === 0) {
    const m = 5 + seed;
    return { values: [m, m + 1, 2 * m + 1], className: "Pairwise and collectively co-prime" };
  }
  if (topology === 1) {
    const m = 3 + seed;
    return { values: [2 * m, 2 * (m + 1), 2 * m + 1], className: "Collectively but not pairwise co-prime" };
  }
  const factor = [2, 3, 5][seed % 3]!;
  const m = 3 + seed;
  return { values: [factor * m, factor * (m + 1), factor * (m + 2)], className: "Not collectively co-prime" };
}

function generateCoprimeClassification(seed: number): NumCp004RetainedQuestion {
  const { values, className } = coprimeTriple(seed);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-19",
    seed,
    answerSemantic: "COPRIME_CLASS",
    stem: `Classify the triple ${formatTriple(values)} with respect to pairwise and collective co-primality.`,
    canonicalAnswer: className,
    hiddenState: { mode: "COPRIME_CLASS", values },
    wrongCandidates: [
      { value: "Pairwise and collectively co-prime", misconceptionId: "PAIR_TESTS_NOT_COMPLETED" },
      { value: "Collectively but not pairwise co-prime", misconceptionId: "COLLECTIVE_CONFUSED_WITH_PAIRWISE" },
      { value: "Not collectively co-prime", misconceptionId: "GLOBAL_HCF_NOT_CHECKED" },
      { value: "Pairwise but not collectively co-prime", misconceptionId: "IMPOSSIBLE_CLASS_ACCEPTED" },
    ],
    concept: "Pairwise co-prime tests every pair; collectively co-prime tests the HCF of all values together.",
    strategy: "Compute three pair HCFs and one global HCF.",
    steps: [
      `The pair HCFs are ${gcdCanonical(values[0], values[1])}, ${gcdCanonical(values[0], values[2])}, ${gcdCanonical(values[1], values[2])}.`,
      `The HCF of all three values is ${gcdCanonical(gcdCanonical(values[0], values[1]), values[2])}.`,
      `The classification is ${className}.`,
    ],
    shortcut: "Check a common factor of all three first, then inspect the pairs.",
  });
}

function generateCoprimeClaim(seed: number): NumCp004RetainedQuestion {
  const a = 10 + seed;
  const b = a + 1;
  const c = 6 * (seed + 2);
  const d = 9 * (seed + 2);
  const triple: [number, number, number] = [6, 10, 15];
  const claims = [
    { text: `${a} and ${b} are co-prime.`, kind: "PAIR", values: [a, b] },
    { text: `${c} and ${d} are co-prime.`, kind: "PAIR", values: [c, d] },
    { text: `${formatTriple(triple)} is pairwise co-prime.`, kind: "PAIRWISE_TRIPLE", values: triple },
    { text: "Every pair of odd integers is co-prime.", kind: "UNIVERSAL_ODD", values: [] },
  ];
  return buildQuestion({
    templateId: "NUM-CP004-QLT-20",
    seed,
    answerSemantic: "BOOLEAN_CLAIM",
    stem: `Considering the pairs involving ${a}, ${b}, ${c} and ${d}, which co-prime statement is true?`,
    canonicalAnswer: claims[0]!.text,
    hiddenState: { mode: "COPRIME_CLAIM", claims },
    wrongCandidates: claims.slice(1).map((claim, index) => ({
      value: claim.text,
      misconceptionId: ["COMMON_FACTOR_IGNORED", "COLLECTIVE_CONFUSED_WITH_PAIRWISE", "ODD_CONFUSED_WITH_COPRIME"][index]!,
    })),
    concept: "Co-primality is determined by HCF 1, not by parity or appearance.",
    strategy: "Evaluate the HCF claim in each option.",
    steps: [
      `Consecutive integers ${a} and ${b} have HCF 1.`,
      `The other numerical claims have a shared factor, and oddness alone does not guarantee co-primality.`,
      `Therefore the true statement is ${claims[0]!.text}`,
    ],
    shortcut: "Consecutive integers are always co-prime; use that fact only when the numbers are genuinely consecutive.",
  });
}

function generatePrimePair(seed: number): NumCp004RetainedQuestion {
  const first = nextPrime(10 + seed * 5);
  const second = nextPrime(first);
  const relation = ["SUM", "DIFFERENCE", "PRODUCT"][(seed - 1) % 3] as "SUM" | "DIFFERENCE" | "PRODUCT";
  const target = relation === "SUM"
    ? first + second
    : relation === "DIFFERENCE"
      ? second - first
      : first * second;
  const correct = formatPair([first, second]);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-21",
    seed,
    answerSemantic: "PAIR",
    stem: `Two consecutive primes lie between ${Math.max(2, first - 1)} and ${second + 1}, and their ${relation.toLowerCase()} is ${target}. Which pair is it?`,
    canonicalAnswer: correct,
    hiddenState: { mode: "PRIME_PAIR", first, second, relation, target },
    wrongCandidates: [
      { value: formatPair([first, nextPrime(second)]), misconceptionId: "ONE_PRIME_SKIPPED" },
      { value: formatPair([previousPrime(first), second]), misconceptionId: "BOUND_OR_ORDER_IGNORED" },
      { value: formatPair([first + 2, second + 2]), misconceptionId: "ODD_NUMBERS_ASSUMED_PRIME" },
      { value: formatPair([second, first]), misconceptionId: "INCREASING_ORDER_REVERSED" },
    ],
    concept: "Prime-pair reconstruction must satisfy primality, order, consecutiveness and the stated relation.",
    strategy: "Verify the consecutive primes in the bound, then check the relation.",
    steps: [
      `${first} and ${second} are consecutive primes in the stated range.`,
      `Their ${relation.toLowerCase()} is ${target}.`,
      `Therefore the required pair is ${correct}.`,
    ],
    shortcut: "For a product, prime factorisation identifies the pair immediately; for sum or difference, check bounded consecutive primes.",
  });
}

function generatePrimeTriple(seed: number): NumCp004RetainedQuestion {
  const first = nextPrime(10 + seed * 7);
  const second = nextPrime(first);
  const third = nextPrime(second);
  const sum = first + second + third;
  const correct = formatTriple([first, second, third]);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-22",
    seed,
    answerSemantic: "TRIPLE",
    stem: `Three consecutive increasing primes have sum ${sum}; the smallest is ${first}. Which triple is correct?`,
    canonicalAnswer: correct,
    hiddenState: { mode: "PRIME_TRIPLE", first, second, third, sum },
    wrongCandidates: [
      { value: formatTriple([first, second, nextPrime(third)]), misconceptionId: "THIRD_PRIME_SKIPPED" },
      { value: formatTriple([first, first + 2, first + 4]), misconceptionId: "ODD_SEQUENCE_ASSUMED_PRIME" },
      { value: formatTriple([previousPrime(first), second, third]), misconceptionId: "SMALLEST_GIVEN_IGNORED" },
      { value: formatTriple([first, third, second]), misconceptionId: "INCREASING_ORDER_IGNORED" },
    ],
    concept: "A consecutive-prime triple is fixed once its smallest member is known.",
    strategy: "Generate the next two primes and verify the sum.",
    steps: [
      `The next prime after ${first} is ${second}.`,
      `The next prime after ${second} is ${third}.`,
      `${first} + ${second} + ${third} = ${sum}, so the triple is ${correct}.`,
    ],
    shortcut: "Advance through primes, not through odd integers.",
  });
}

function generateLeastPrimeDivisor(seed: number): NumCp004RetainedQuestion {
  const p = SMALL_PRIMES[seed % 6]!;
  const q = nextPrime(p + 4 + seed);
  const value = p * q * (seed % 4 === 0 ? p : 1);
  const factors = factoriseCanonical(value);
  const answer = factors[0]!.prime;
  return buildQuestion({
    templateId: "NUM-CP004-QLT-23",
    seed,
    answerSemantic: "PRIME_FACTOR",
    stem: `What is the least prime divisor of ${value}?`,
    canonicalAnswer: String(answer),
    hiddenState: { mode: "LEAST_PRIME_DIVISOR", value },
    wrongCandidates: [
      { value: String(factors[factors.length - 1]!.prime), misconceptionId: "LARGEST_PRIME_FACTOR_SELECTED" },
      { value: "1", misconceptionId: "ONE_TREATED_AS_PRIME_DIVISOR" },
      { value: String(answer * answer), misconceptionId: "PRIME_SQUARE_RETURNED" },
      { value: String(value), misconceptionId: "NUMBER_ITSELF_RETURNED" },
    ],
    concept: "The least prime divisor is the first prime that divides the integer exactly.",
    strategy: "Test primes in increasing order.",
    steps: [
      `${value} = ${formatFactorisation(factors)}.`,
      `The smallest prime base in this factorisation is ${answer}.`,
      `Therefore the least prime divisor is ${answer}.`,
    ],
    shortcut: "Check 2, 3 and 5 before any longer trial division.",
  });
}

function generateExpressionPrimeDivisor(seed: number): NumCp004RetainedQuestion {
  const listed = [2, 3, 5, 7].map((prime, index) => SMALL_PRIMES[(seed + index) % 8]!) as [number, number, number, number];
  const chosenIndex = (seed - 1) % 4;
  const chosen = listed[chosenIndex]!;
  let multiplier = nextPrime(50 + seed * 5);
  while (listed.includes(multiplier as never)) multiplier = nextPrime(multiplier);
  const expressionValue = chosen * multiplier;
  const a = expressionValue - seed;
  const b = seed;
  const correct = String(chosen);
  const wrongs = listed.filter((value) => value !== chosen).map((value) => ({
    value: String(value),
    misconceptionId: "LISTED_PRIME_DOES_NOT_DIVIDE_EXPRESSION",
  }));
  return buildQuestion({
    templateId: "NUM-CP004-QLT-24",
    seed,
    answerSemantic: "PRIME_FACTOR",
    stem: `Which listed prime divides the value of (${a} + ${b})?`,
    canonicalAnswer: correct,
    hiddenState: { mode: "EXPRESSION_PRIME_DIVISOR", a, b, listed },
    wrongCandidates: wrongs,
    concept: "Evaluate the expression exactly, then test the listed prime divisors.",
    strategy: `First calculate ${a} + ${b}, then divide by each option.`,
    steps: [
      `${a} + ${b} = ${expressionValue}.`,
      `${expressionValue} is divisible by ${chosen}.`,
      `None of the other listed primes divides it exactly.`,
    ],
    shortcut: "Use last-digit and digit-sum divisibility checks before full division.",
  });
}

function generateFeasibility(seed: number): NumCp004RetainedQuestion {
  const prime = nextPrime(10 + seed * 3);
  const possible = `A positive integer can have exactly one distinct prime factor, for example ${prime}^2.`;
  const claims = [
    possible,
    "An even prime can be greater than 2.",
    "A composite positive integer can have no prime factor.",
    "The product of two primes can itself be prime.",
  ];
  return buildQuestion({
    templateId: "NUM-CP004-QLT-25",
    seed,
    answerSemantic: "SOLUTION_CLASS",
    stem: `Using ${prime} as the reference prime, which prime-structure statement is possible?`,
    canonicalAnswer: possible,
    hiddenState: { mode: "FEASIBILITY", prime, claims },
    wrongCandidates: claims.slice(1).map((value, index) => ({
      value,
      misconceptionId: ["EVEN_PRIME_EXCEPTION_EXTENDED", "COMPOSITE_WITHOUT_FACTOR_ACCEPTED", "PRODUCT_OF_PRIMES_TREATED_AS_PRIME"][index]!,
    })),
    concept: "Possible prime structure must agree with unique prime factorisation.",
    strategy: "Test each structural claim against the definitions of prime and composite numbers.",
    steps: [
      `${prime}^2 has one distinct prime factor, namely ${prime}.`,
      "The only even prime is 2, every composite has prime factors, and a product of two primes is composite.",
      `Therefore the possible statement is: ${possible}`,
    ],
    shortcut: "Use a prime power as the standard example of one distinct prime factor.",
  });
}

function generateFactorTree(seed: number): NumCp004RetainedQuestion {
  const p = SMALL_PRIMES[seed % 6]!;
  const q = SMALL_PRIMES[6 + (seed % 5)]!;
  const r = nextPrime(q + seed);
  const missing = p * q;
  const root = missing * r;
  return buildQuestion({
    templateId: "NUM-CP004-QLT-26",
    seed,
    answerSemantic: "INTEGER",
    stem: `A factor tree shows ${root} → ? × ${r}, and the missing node splits as ${p} × ${q}. What is the missing node?`,
    canonicalAnswer: String(missing),
    hiddenState: { mode: "FACTOR_TREE", root, right: r, children: [p, q] },
    wrongCandidates: [
      { value: String(p + q), misconceptionId: "CHILD_FACTORS_ADDED" },
      { value: String(root), misconceptionId: "ROOT_RETURNED" },
      { value: String(p * r), misconceptionId: "WRONG_BRANCH_MULTIPLIED" },
      { value: String(q * r), misconceptionId: "SIBLING_BRANCH_MULTIPLIED" },
    ],
    concept: "Every parent node in a factor tree equals the product of its two child nodes.",
    strategy: "Multiply the two displayed child primes and verify against the root split.",
    steps: [
      `${p} × ${q} = ${missing}.`,
      `${missing} × ${r} = ${root}.`,
      `Therefore the missing node is ${missing}.`,
    ],
    shortcut: "Use the nearest child relation first; the root then acts as a check.",
  });
}

function generateDataSufficiency(seed: number): NumCp004RetainedQuestion {
  const first = nextPrime(10 + seed * 5);
  const candidates = [first, nextPrime(first), nextPrime(nextPrime(first)), nextPrime(nextPrime(nextPrime(first)))];
  const classIndex = (seed - 1) % 4;
  let statementI: number[];
  let statementII: number[];
  let answer: string;
  if (classIndex === 0) {
    statementI = [candidates[0]!];
    statementII = candidates.slice(0, 3);
    answer = "Statement I alone is sufficient";
  } else if (classIndex === 1) {
    statementI = candidates.slice(1);
    statementII = [candidates[2]!];
    answer = "Statement II alone is sufficient";
  } else if (classIndex === 2) {
    statementI = candidates.slice(0, 2);
    statementII = candidates.slice(1);
    answer = "Both statements together are sufficient";
  } else {
    statementI = candidates.slice(0, 3);
    statementII = candidates.slice(1);
    answer = "Even both statements together are not sufficient";
  }
  return buildQuestion({
    templateId: "NUM-CP004-QLT-27",
    seed,
    answerSemantic: "SUFFICIENCY_CLASS",
    stem: `A prime p is one of ${formatNumberSet(candidates)}. Statement I narrows p to ${formatNumberSet(statementI)}. Statement II narrows p to ${formatNumberSet(statementII)}. Which sufficiency conclusion determines p uniquely?`,
    canonicalAnswer: answer,
    hiddenState: { mode: "DATA_SUFFICIENCY", candidates, statementI, statementII },
    wrongCandidates: [
      { value: "Statement I alone is sufficient", misconceptionId: "STATEMENT_I_UNIQUENESS_MISREAD" },
      { value: "Statement II alone is sufficient", misconceptionId: "STATEMENT_II_UNIQUENESS_MISREAD" },
      { value: "Both statements together are sufficient", misconceptionId: "INTERSECTION_NOT_TESTED" },
      { value: "Even both statements together are not sufficient", misconceptionId: "UNIQUE_SET_IGNORED" },
    ],
    concept: "A statement is sufficient only when its surviving candidate set contains exactly one value.",
    strategy: "Check the size of each statement set and then their intersection.",
    steps: [
      `Statement I leaves ${statementI.length} candidate${statementI.length === 1 ? "" : "s"}.`,
      `Statement II leaves ${statementII.length} candidate${statementII.length === 1 ? "" : "s"}.`,
      `Their intersection has ${statementI.filter((value) => statementII.includes(value)).length} candidate${statementI.filter((value) => statementII.includes(value)).length === 1 ? "" : "s"}, so the conclusion is ${answer}.`,
    ],
    shortcut: "Data sufficiency is a set-size test: one candidate means sufficient.",
  });
}

function nearestPrimeAdjustments(value: number, predicate: (candidate: number) => boolean): number[] {
  for (let distance = 0; distance <= value + 20; distance += 1) {
    const adjustments: number[] = [];
    if (value - distance >= 2 && predicate(value - distance)) adjustments.push(-distance);
    if (distance !== 0 && predicate(value + distance)) adjustments.push(distance);
    if (adjustments.length > 0) return adjustments;
  }
  throw new Error(`No prime adjustment found for ${value}`);
}

function formatAdjustmentSet(values: readonly number[]): string {
  return `{${values.map((value) => value > 0 ? `+${value}` : String(value)).join(", ")}}`;
}

function generatePrimeAdjustment(seed: number): NumCp004RetainedQuestion {
  const tieCenters = [4, 6, 12, 18, 30, 42, 60, 72];
  let value: number;
  if (seed % 4 === 0) value = tieCenters[(seed / 4 - 1) % tieCenters.length]!;
  else {
    value = 20 + seed * 3;
    while (isPrimeCanonical(value)) value += 1;
  }
  const adjustments = nearestPrimeAdjustments(value, isPrimeCanonical);
  const answer = formatAdjustmentSet(adjustments);
  const firstDistance = Math.abs(adjustments[0]!);
  return buildQuestion({
    templateId: "NUM-CP004-QLT-28",
    seed,
    answerSemantic: "PRIME_ADJUSTMENT_SET",
    stem: `What is the complete set of minimum signed integer adjustments that make ${value} prime?`,
    canonicalAnswer: answer,
    hiddenState: { mode: "PRIME_ADJUSTMENT", value },
    wrongCandidates: [
      { value: formatAdjustmentSet([firstDistance]), misconceptionId: "SIGN_DIRECTION_IGNORED" },
      { value: formatAdjustmentSet([-firstDistance]), misconceptionId: "ONLY_LOWER_PRIME_CHECKED" },
      { value: formatAdjustmentSet([firstDistance + 1]), misconceptionId: "NONMINIMUM_ADJUSTMENT_USED" },
      { value: "{0}", misconceptionId: "COMPOSITE_TREATED_AS_PRIME" },
    ],
    concept: "Minimum adjustment compares prime distances in both directions and keeps every tied minimum.",
    strategy: "Search outward from the given integer by equal distances.",
    steps: [
      `The nearest lower and upper prime candidates are checked at each distance.`,
      `The first successful distance gives adjustment set ${answer}.`,
      "No smaller absolute adjustment reaches a prime.",
    ],
    shortcut: "Test n−1 and n+1 together, then expand symmetrically.",
  });
}

export function verifyNumCp004RetainedAnswer(
  templateId: NumCp004RetainedTemplateId,
  hiddenState: Readonly<Record<string, unknown>>,
): string {
  const mode = String(hiddenState.mode);
  switch (mode) {
    case "CLASSIFY": {
      const value = Number(hiddenState.value);
      if (value === 1) return "UNIT";
      if (value <= 0) return "NEITHER";
      return isPrimeVerifier(value) ? "PRIME" : "COMPOSITE";
    }
    case "INTERVAL_SET": {
      return formatNumberSet(primesInInterval(
        Number(hiddenState.lower),
        Number(hiddenState.upper),
        isPrimeVerifier,
      ));
    }
    case "INTERVAL_COUNT": {
      return String(primesInInterval(
        Number(hiddenState.lower),
        Number(hiddenState.upper),
        isPrimeVerifier,
      ).length);
    }
    case "ADJACENT_PRIME": {
      const direction = String(hiddenState.direction);
      if (direction === "NEXT") {
        const value = Number(hiddenState.value);
        for (let candidate = value + 1; ; candidate += 1) {
          if (isPrimeVerifier(candidate)) return String(candidate);
        }
      }
      if (direction === "PREVIOUS") {
        const value = Number(hiddenState.value);
        for (let candidate = value - 1; candidate >= 2; candidate -= 1) {
          if (isPrimeVerifier(candidate)) return String(candidate);
        }
      }
      const primes = primesInInterval(
        Number(hiddenState.lower),
        Number(hiddenState.upper),
        isPrimeVerifier,
      );
      return String(direction === "LEAST" ? primes[0] : primes[primes.length - 1]);
    }
    case "DIGIT_RANGE_PRIME": {
      const matches = primesInInterval(
        Number(hiddenState.lower),
        Number(hiddenState.upper),
        isPrimeVerifier,
      ).filter((value) => digitSum(value) === Number(hiddenState.digitSum));
      if (matches.length !== 1) throw new Error(`${templateId}: digit-range state is not unique`);
      return String(matches[0]);
    }
    case "PRIME_CLAIM": {
      const claims = hiddenState.claims as readonly { text: string; kind: string; value: number }[];
      const trueClaims = claims.filter((claim) => claim.kind === "IS_PRIME" && isPrimeVerifier(claim.value));
      if (trueClaims.length !== 1) throw new Error(`${templateId}: prime claim state is not unique`);
      return trueClaims[0]!.text;
    }
    case "FACTORISATION":
      return formatFactorisation(factoriseVerifier(Number(hiddenState.value)));
    case "PRIME_FACTOR_EXTREMUM": {
      const factors = factoriseVerifier(Number(hiddenState.value));
      return String(hiddenState.direction === "SMALLEST" ? factors[0]!.prime : factors[factors.length - 1]!.prime);
    }
    case "DISTINCT_FACTOR_COUNT":
      return String(factoriseVerifier(Number(hiddenState.value)).length);
    case "MULTIPLICITY_COUNT":
      return String(factoriseVerifier(Number(hiddenState.value)).reduce((sum, factor) => sum + factor.exponent, 0));
    case "RECONSTRUCT_INTEGER":
      return String(multiplyPrimePowersVerifier(hiddenState.factors as readonly PrimePower[]));
    case "COMPARE_STRUCTURES": {
      const factorsA = hiddenState.factorsA as readonly PrimePower[];
      const factorsB = hiddenState.factorsB as readonly PrimePower[];
      const target = String(hiddenState.target);
      const metric = (factors: readonly PrimePower[]): number => {
        if (target === "DISTINCT") return factors.length;
        if (target === "MULTIPLICITY") return factors.reduce((sum, factor) => sum + factor.exponent, 0);
        return multiplyPrimePowersVerifier(factors);
      };
      const a = metric(factorsA);
      const b = metric(factorsB);
      return a === b ? "EQUAL" : a > b ? "A" : "B";
    }
    case "MISSING_PRIME": {
      const value = Number(hiddenState.value);
      const factors = hiddenState.factors as readonly PrimePower[];
      const hiddenIndex = Number(hiddenState.hiddenIndex);
      const visible = factors.filter((_factor, index) => index !== hiddenIndex);
      const remainder = value / multiplyPrimePowersVerifier(visible);
      const exponent = factors[hiddenIndex]!.exponent;
      for (let candidate = 2; candidate <= remainder; candidate += 1) {
        if (isPrimeVerifier(candidate) && candidate ** exponent === remainder) return String(candidate);
      }
      throw new Error(`${templateId}: missing prime not found`);
    }
    case "MISSING_EXPONENT": {
      const value = Number(hiddenState.value);
      const factors = hiddenState.factors as readonly PrimePower[];
      const hiddenIndex = Number(hiddenState.hiddenIndex);
      const visible = factors.filter((_factor, index) => index !== hiddenIndex);
      let remainder = value / multiplyPrimePowersVerifier(visible);
      const prime = factors[hiddenIndex]!.prime;
      let exponent = 0;
      while (remainder % prime === 0) {
        remainder /= prime;
        exponent += 1;
      }
      if (remainder !== 1) throw new Error(`${templateId}: invalid missing exponent state`);
      return String(exponent);
    }
    case "SELECT_COPRIME_PAIR": {
      const pairs = hiddenState.pairs as readonly [number, number][];
      const valid = pairs.filter((pair) => gcdVerifier(pair) === 1);
      if (valid.length !== 1) throw new Error(`${templateId}: co-prime pair state is not unique`);
      return formatPair(valid[0]!);
    }
    case "COPRIME_SET": {
      const fixed = Number(hiddenState.fixed);
      const candidates = hiddenState.candidates as readonly number[];
      return formatNumberSet(candidates.filter((candidate) => gcdVerifier([fixed, candidate]) === 1));
    }
    case "COPRIME_COUNT": {
      const fixed = Number(hiddenState.fixed);
      const candidates = hiddenState.candidates as readonly number[];
      return String(candidates.filter((candidate) => gcdVerifier([fixed, candidate]) === 1).length);
    }
    case "COPRIME_UNKNOWN": {
      const fixed = Number(hiddenState.fixed);
      const candidates = hiddenState.candidates as readonly number[];
      const valid = candidates.filter((candidate) => gcdVerifier([fixed, candidate]) === 1);
      if (valid.length !== 1) throw new Error(`${templateId}: co-prime unknown state is not unique`);
      return String(valid[0]);
    }
    case "COPRIME_CLASS": {
      const values = hiddenState.values as readonly [number, number, number];
      const pairwise = gcdVerifier([values[0], values[1]]) === 1
        && gcdVerifier([values[0], values[2]]) === 1
        && gcdVerifier([values[1], values[2]]) === 1;
      const collective = gcdVerifier(values) === 1;
      if (pairwise && collective) return "Pairwise and collectively co-prime";
      if (!pairwise && collective) return "Collectively but not pairwise co-prime";
      if (!collective) return "Not collectively co-prime";
      return "Pairwise but not collectively co-prime";
    }
    case "COPRIME_CLAIM": {
      const claims = hiddenState.claims as readonly { text: string; kind: string; values: readonly number[] }[];
      const trueClaims = claims.filter((claim) => {
        if (claim.kind === "PAIR") return gcdVerifier(claim.values) === 1;
        if (claim.kind === "PAIRWISE_TRIPLE") {
          const [a, b, c] = claim.values;
          return gcdVerifier([a!, b!]) === 1 && gcdVerifier([a!, c!]) === 1 && gcdVerifier([b!, c!]) === 1;
        }
        return false;
      });
      if (trueClaims.length !== 1) throw new Error(`${templateId}: co-prime claim state is not unique`);
      return trueClaims[0]!.text;
    }
    case "PRIME_PAIR": {
      const first = Number(hiddenState.first);
      const second = Number(hiddenState.second);
      const relation = String(hiddenState.relation);
      const target = Number(hiddenState.target);
      const candidates: [number, number][] = [];
      for (let p = first; p <= second; p += 1) {
        if (!isPrimeVerifier(p)) continue;
        for (let q = p + 1; q <= second; q += 1) {
          if (!isPrimeVerifier(q)) continue;
          let hasPrimeBetween = false;
          for (let value = p + 1; value < q; value += 1) {
            if (isPrimeVerifier(value)) hasPrimeBetween = true;
          }
          if (hasPrimeBetween) continue;
          const relationValue = relation === "SUM" ? p + q : relation === "DIFFERENCE" ? q - p : p * q;
          if (relationValue === target) candidates.push([p, q]);
        }
      }
      if (candidates.length !== 1) throw new Error(`${templateId}: prime pair state is not unique`);
      return formatPair(candidates[0]!);
    }
    case "PRIME_TRIPLE": {
      const first = Number(hiddenState.first);
      const sum = Number(hiddenState.sum);
      const primes: number[] = [];
      for (let candidate = first; primes.length < 3; candidate += 1) {
        if (isPrimeVerifier(candidate)) primes.push(candidate);
      }
      if (primes.reduce((total, value) => total + value, 0) !== sum) {
        throw new Error(`${templateId}: triple sum mismatch`);
      }
      return formatTriple([primes[0]!, primes[1]!, primes[2]!]);
    }
    case "LEAST_PRIME_DIVISOR": {
      const value = Number(hiddenState.value);
      for (let divisor = 2; divisor <= value; divisor += 1) {
        if (isPrimeVerifier(divisor) && value % divisor === 0) return String(divisor);
      }
      throw new Error(`${templateId}: least prime divisor not found`);
    }
    case "EXPRESSION_PRIME_DIVISOR": {
      const value = Number(hiddenState.a) + Number(hiddenState.b);
      const listed = hiddenState.listed as readonly number[];
      const valid = listed.filter((prime) => isPrimeVerifier(prime) && value % prime === 0);
      if (valid.length !== 1) throw new Error(`${templateId}: expression divisor state is not unique`);
      return String(valid[0]);
    }
    case "FEASIBILITY": {
      const prime = Number(hiddenState.prime);
      return `A positive integer can have exactly one distinct prime factor, for example ${prime}^2.`;
    }
    case "FACTOR_TREE": {
      const children = hiddenState.children as readonly [number, number];
      const missing = children[0] * children[1];
      if (missing * Number(hiddenState.right) !== Number(hiddenState.root)) {
        throw new Error(`${templateId}: factor tree does not reconstruct`);
      }
      return String(missing);
    }
    case "DATA_SUFFICIENCY": {
      const statementI = hiddenState.statementI as readonly number[];
      const statementII = hiddenState.statementII as readonly number[];
      const intersection = statementI.filter((value) => statementII.includes(value));
      if (statementI.length === 1) return "Statement I alone is sufficient";
      if (statementII.length === 1) return "Statement II alone is sufficient";
      if (intersection.length === 1) return "Both statements together are sufficient";
      return "Even both statements together are not sufficient";
    }
    case "PRIME_ADJUSTMENT":
      return formatAdjustmentSet(nearestPrimeAdjustments(Number(hiddenState.value), isPrimeVerifier));
    default:
      throw new Error(`${templateId}: unsupported verifier mode ${mode}`);
  }
}

const GENERATORS: Record<
  NumCp004RetainedTemplateId,
  (seed: number) => NumCp004RetainedQuestion
> = {
  "NUM-CP004-QLT-01": generateClassification,
  "NUM-CP004-QLT-02": generatePrimeIntervalSet,
  "NUM-CP004-QLT-03": generatePrimeIntervalCount,
  "NUM-CP004-QLT-04": generateAdjacentPrime,
  "NUM-CP004-QLT-05": generateDigitRangePrime,
  "NUM-CP004-QLT-06": generatePrimeClaim,
  "NUM-CP004-QLT-07": generateFactorisation,
  "NUM-CP004-QLT-08": generatePrimeFactorExtremum,
  "NUM-CP004-QLT-09": generateDistinctFactorCount,
  "NUM-CP004-QLT-10": generateMultiplicityCount,
  "NUM-CP004-QLT-11": generateReconstructInteger,
  "NUM-CP004-QLT-12": generateCompareStructures,
  "NUM-CP004-QLT-13": generateMissingPrime,
  "NUM-CP004-QLT-14": generateMissingExponent,
  "NUM-CP004-QLT-15": generateCoprimePair,
  "NUM-CP004-QLT-16": generateCoprimeSet,
  "NUM-CP004-QLT-17": generateCoprimeCount,
  "NUM-CP004-QLT-18": generateCoprimeUnknown,
  "NUM-CP004-QLT-19": generateCoprimeClassification,
  "NUM-CP004-QLT-20": generateCoprimeClaim,
  "NUM-CP004-QLT-21": generatePrimePair,
  "NUM-CP004-QLT-22": generatePrimeTriple,
  "NUM-CP004-QLT-23": generateLeastPrimeDivisor,
  "NUM-CP004-QLT-24": generateExpressionPrimeDivisor,
  "NUM-CP004-QLT-25": generateFeasibility,
  "NUM-CP004-QLT-26": generateFactorTree,
  "NUM-CP004-QLT-27": generateDataSufficiency,
  "NUM-CP004-QLT-28": generatePrimeAdjustment,
};

export function generateNumCp004RetainedQuestion(
  temporaryTemplateId: NumCp004RetainedTemplateId,
  seed: number,
): NumCp004RetainedQuestion {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  return GENERATORS[temporaryTemplateId](seed);
}

export function generateNumCp004RetainedSweep(
  seedsPerTemplate: number,
): NumCp004RetainedQuestion[] {
  if (!Number.isInteger(seedsPerTemplate) || seedsPerTemplate <= 0) {
    throw new Error("seedsPerTemplate must be a positive integer");
  }
  return NUM_CP004_RETAINED_TEMPLATE_IDS.flatMap((templateId) =>
    Array.from({ length: seedsPerTemplate }, (_, index) =>
      generateNumCp004RetainedQuestion(templateId, index + 1),
    ),
  );
}
