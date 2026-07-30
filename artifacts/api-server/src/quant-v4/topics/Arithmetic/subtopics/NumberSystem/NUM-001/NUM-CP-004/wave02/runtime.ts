import type {
  NumCp004Difficulty,
  NumCp004Lifecycle,
  NumCp004Option,
} from "../wave01/types";
import {
  NUM_CP004_WAVE02_PROTOTYPE_IDS,
  type NumCp004Wave02Package,
  type NumCp004Wave02PrototypeId,
} from "./types";

const SOURCE_ANCESTRY = [
  "UPLOAD:SSC-MATHEMATICS-PREVIOUS-YEAR-NUMBER-SYSTEM",
  "UPLOAD:DISHA-SSC-MATHEMATICS-GUIDE",
  "DESIGN:NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
  "CHECKPOINT:NUM-CP-004-WAVE-02-DIRECT-INVERSE-PLAN",
] as const;

const LIFECYCLE: NumCp004Lifecycle = {
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
};

function rng(seed: number): () => number {
  let state = (seed ^ 0x4e554d32) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function difficultyFor(seed: number): NumCp004Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function isPrimeByDivisorCount(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  let count = 0;
  for (let divisor = 1; divisor <= value; divisor += 1) {
    if (value % divisor === 0) count += 1;
    if (count > 2) return false;
  }
  return count === 2;
}

function nextPrime(value: number): number {
  let candidate = value + 1;
  while (!isPrime(candidate)) candidate += 1;
  return candidate;
}

function previousPrime(value: number): number {
  let candidate = value - 1;
  while (candidate >= 2 && !isPrime(candidate)) candidate -= 1;
  if (candidate < 2) throw new Error(`No previous prime exists below ${value}`);
  return candidate;
}

function leastPrimeDivisor(value: number): number {
  if (value < 4 || isPrime(value)) throw new Error(`${value} is not composite`);
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0 && isPrime(divisor)) return divisor;
  }
  throw new Error(`Unable to find least prime divisor of ${value}`);
}

function gcd(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function gcdByEnumeration(first: number, second: number): number {
  for (let candidate = Math.min(Math.abs(first), Math.abs(second)); candidate >= 1; candidate -= 1) {
    if (first % candidate === 0 && second % candidate === 0) return candidate;
  }
  return 1;
}

function formatPair(pair: readonly [number, number]): string {
  return `(${pair[0]}, ${pair[1]})`;
}

function formatTriple(triple: readonly [number, number, number]): string {
  return `(${triple[0]}, ${triple[1]}, ${triple[2]})`;
}

function formatSet(values: readonly number[]): string {
  return `{${[...values].sort((a, b) => a - b).join(", ")}}`;
}

function uniqueStrings(values: readonly string[], correct: string): string[] {
  const result: string[] = [correct];
  for (const value of values) {
    if (!result.includes(value)) result.push(value);
    if (result.length === 4) break;
  }
  let suffix = 1;
  while (result.length < 4) {
    const value = `${correct} [alternative ${suffix}]`;
    if (!result.includes(value)) result.push(value);
    suffix += 1;
  }
  return result;
}

function placeOptions(
  correct: string,
  distractors: readonly { value: string; misconceptionId: string }[],
  seed: number,
): { options: NumCp004Option[]; correctIndex: number } {
  const correctIndex = (seed - 1) % 4;
  const distinct = uniqueStrings(distractors.map((item) => item.value), correct);
  const lookup = new Map(distractors.map((item) => [item.value, item.misconceptionId]));
  const wrong = distinct.filter((value) => value !== correct).slice(0, 3);
  const options: NumCp004Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) options.push({ value: correct, isCorrect: true });
    else {
      const value = wrong[wrongIndex++]!;
      options.push({
        value,
        isCorrect: false,
        misconceptionId: lookup.get(value) ?? "NON_CANONICAL_ALTERNATIVE",
      });
    }
  }
  return { options, correctIndex };
}

function explanation(
  concept: string,
  strategy: string,
  steps: readonly string[],
  speed: string,
  options: readonly NumCp004Option[],
  answer: string,
) {
  return {
    coreConcept: [concept],
    givenDataAndStrategy: [strategy],
    stepByStep: steps,
    examSpeedMethod: [speed],
    commonTraps: options.filter((option) => !option.isCorrect).map(
      (option) => `${option.value}: ${option.misconceptionId}.`,
    ),
    finalAnswer: `The correct answer is ${answer}.`,
  };
}

function basePackage(
  prototypeId: NumCp004Wave02PrototypeId,
  seed: number,
  data: Omit<NumCp004Wave02Package,
    "packageId" | "checkpointId" | "temporaryPrototypeId" | "permanentQlId" |
    "seed" | "locale" | "sourceAncestry" | "prototypeAncestry" | "lifecycle"
  >,
): NumCp004Wave02Package {
  return {
    packageId: "NUM-001",
    checkpointId: "NUM-CP-004",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: [prototypeId, "NUM-CP-004-WAVE-02"],
    lifecycle: LIFECYCLE,
    ...data,
  };
}

function generateNextPrime(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 101);
  const floor = difficulty === "EASY" ? 8 : difficulty === "MEDIUM" ? 60 : 180;
  const value = floor + Math.floor(random() * (difficulty === "HARD" ? 170 : 70));
  const canonical = nextPrime(value);
  let verifier = value + 1;
  while (!isPrimeByDivisorCount(verifier)) verifier += 1;
  const correct = String(canonical);
  const { options, correctIndex } = placeOptions(correct, [
    { value: String(value + 1), misconceptionId: "ASSUMED_IMMEDIATE_SUCCESSOR_PRIME" },
    { value: String(previousPrime(Math.max(value, 4))), misconceptionId: "SEARCHED_IN_WRONG_DIRECTION" },
    { value: String(nextPrime(canonical)), misconceptionId: "SKIPPED_FIRST_VALID_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-009", seed, {
    difficulty,
    answerSemantic: "NEXT_PRIME",
    stem: `What is the smallest prime number greater than ${value}?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: String(verifier),
    hiddenState: { value, searchGap: canonical - value },
    mathematicalFingerprint: `NUM-CP004-PROT-009:${value}:${canonical}`,
    explanation: explanation(
      "The next prime is the first integer above the given number having exactly two positive divisors.",
      `Test successive integers after ${value} until the first prime appears.`,
      [`The integers are checked from ${value + 1} upward.`, `${canonical} is the first one that has no divisor other than 1 and itself.`],
      "Reject even numbers greater than 2 immediately, then test only possible prime divisors up to the square root.",
      options,
      correct,
    ),
  });
}

function generatePreviousPrime(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 103);
  const floor = difficulty === "EASY" ? 12 : difficulty === "MEDIUM" ? 80 : 220;
  const value = floor + Math.floor(random() * (difficulty === "HARD" ? 190 : 80));
  const canonical = previousPrime(value);
  let verifier = value - 1;
  while (!isPrimeByDivisorCount(verifier)) verifier -= 1;
  const correct = String(canonical);
  const { options, correctIndex } = placeOptions(correct, [
    { value: String(value - 1), misconceptionId: "ASSUMED_IMMEDIATE_PREDECESSOR_PRIME" },
    { value: String(nextPrime(value)), misconceptionId: "SEARCHED_IN_WRONG_DIRECTION" },
    { value: String(previousPrime(canonical)), misconceptionId: "SKIPPED_FIRST_VALID_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-010", seed, {
    difficulty,
    answerSemantic: "PREVIOUS_PRIME",
    stem: `What is the greatest prime number smaller than ${value}?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: String(verifier),
    hiddenState: { value, searchGap: value - canonical },
    mathematicalFingerprint: `NUM-CP004-PROT-010:${value}:${canonical}`,
    explanation: explanation(
      "The previous prime is the first prime encountered while moving downward from the given number.",
      `Test integers below ${value} in descending order.`,
      [`Begin with ${value - 1}.`, `${canonical} is the first tested integer with exactly two positive divisors.`],
      "Skip even candidates and stop as soon as a prime is confirmed.",
      options,
      correct,
    ),
  });
}

function generateLeastPrimeDivisor(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const primePools = difficulty === "EASY" ? [2, 3] : difficulty === "MEDIUM" ? [3, 5, 7] : [7, 11, 13];
  const random = rng(seed * 107);
  const least = primePools[Math.floor(random() * primePools.length)]!;
  let partner = nextPrime(least + 2 + Math.floor(random() * 12));
  if (partner < least) partner = nextPrime(least);
  const value = least * partner * (difficulty === "HARD" ? nextPrime(partner) : 1);
  const canonical = leastPrimeDivisor(value);
  let verifier = 2;
  while (value % verifier !== 0 || !isPrimeByDivisorCount(verifier)) verifier += 1;
  const correct = String(canonical);
  const { options, correctIndex } = placeOptions(correct, [
    { value: String(partner), misconceptionId: "SELECTED_VISIBLE_LARGER_FACTOR" },
    { value: String(Math.floor(Math.sqrt(value))), misconceptionId: "CONFUSED_SEARCH_LIMIT_WITH_DIVISOR" },
    { value: "1", misconceptionId: "TREATED_UNIT_AS_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-011", seed, {
    difficulty,
    answerSemantic: "LEAST_PRIME_DIVISOR",
    stem: `What is the least prime divisor of ${value}?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: String(verifier),
    hiddenState: { value, leastPrimeDivisor: least, partner },
    mathematicalFingerprint: `NUM-CP004-PROT-011:${value}:${least}`,
    explanation: explanation(
      "A composite number has a prime divisor not exceeding its square root; the least such divisor is found by testing primes in increasing order.",
      `Test 2, 3, 5, 7 and later primes against ${value} until one divides exactly.`,
      [`The earlier prime candidates fail or are skipped when inapplicable.`, `${value} is divisible by ${canonical}, so the search stops there.`],
      "Always test 2 first, then odd prime candidates only.",
      options,
      correct,
    ),
  });
}

function generatePrimePairSum(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 109);
  const floor = difficulty === "EASY" ? 7 : difficulty === "MEDIUM" ? 31 : 101;
  const oddPrime = nextPrime(floor + Math.floor(random() * (difficulty === "HARD" ? 120 : 50)));
  const sum = oddPrime + 2;
  const pair: [number, number] = [2, oddPrime];
  const verifierPairs: [number, number][] = [];
  for (let first = 2; first <= Math.floor(sum / 2); first += 1) {
    const second = sum - first;
    if (isPrimeByDivisorCount(first) && isPrimeByDivisorCount(second)) verifierPairs.push([first, second]);
  }
  if (verifierPairs.length !== 1) throw new Error(`Expected unique prime pair for sum ${sum}`);
  const correct = formatPair(pair);
  const { options, correctIndex } = placeOptions(correct, [
    { value: formatPair([3, sum - 3]), misconceptionId: "IGNORED_PARITY_OF_ODD_SUM" },
    { value: formatPair([2, nextPrime(oddPrime)]), misconceptionId: "USED_NEXT_PRIME_WITHOUT_CHECKING_SUM" },
    { value: formatPair([1, sum - 1]), misconceptionId: "TREATED_ONE_AS_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-012", seed, {
    difficulty,
    answerSemantic: "PRIME_PAIR",
    stem: `Which unordered pair of prime numbers has sum ${sum}?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: formatPair(verifierPairs[0]!),
    hiddenState: { sum, pair, uniquenessCount: verifierPairs.length },
    mathematicalFingerprint: `NUM-CP004-PROT-012:${sum}:${pair.join(":")}`,
    explanation: explanation(
      "An odd sum of two primes must contain the only even prime, 2.",
      `Subtract 2 from ${sum}, then check whether the remainder is prime.`,
      [`${sum} - 2 = ${oddPrime}.`, `${oddPrime} is prime, so the required pair is ${correct}.`],
      "For an odd target sum, test 2 first; this usually settles the pair immediately.",
      options,
      correct,
    ),
  });
}

function pairsWithDifference(lower: number, upper: number, difference: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let first = lower; first <= upper; first += 1) {
    const second = first + difference;
    if (second > upper) break;
    if (isPrime(first) && isPrime(second)) pairs.push([first, second]);
  }
  return pairs;
}

function generatePrimePairDifference(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 113);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const first = nextPrime((difficulty === "EASY" ? 5 : difficulty === "MEDIUM" ? 30 : 80) + Math.floor(random() * 80) + attempt);
    const second = nextPrime(first + 2 + ((seed + attempt) % 8));
    const difference = second - first;
    const spread = difficulty === "EASY" ? 2 : difficulty === "MEDIUM" ? 12 : 28;
    const lower = Math.max(2, first - spread);
    const upper = second + spread;
    const pairs = pairsWithDifference(lower, upper, difference);
    if (pairs.length !== 1 || pairs[0]![0] !== first) continue;
    const correct = formatPair([first, second]);
    const { options, correctIndex } = placeOptions(correct, [
      { value: formatPair([first, nextPrime(second)]), misconceptionId: "USED_NEXT_PRIME_BUT_CHANGED_DIFFERENCE" },
      { value: formatPair([previousPrime(first), second]), misconceptionId: "CHECKED_ONLY_ONE_BOUND" },
      { value: formatPair([first + 1, second + 1]), misconceptionId: "PRESERVED_DIFFERENCE_BUT_IGNORED_PRIMALITY" },
    ], seed);
    return basePackage("NUM-CP004-PROT-013", seed, {
      difficulty,
      answerSemantic: "PRIME_PAIR",
      stem: `Within ${lower} to ${upper}, which unordered prime pair differs by ${difference}?`,
      options,
      correctIndex,
      canonicalAnswer: correct,
      verifierAnswer: formatPair(pairs[0]!),
      hiddenState: { lower, upper, difference, pair: [first, second], uniquenessCount: pairs.length },
      mathematicalFingerprint: `NUM-CP004-PROT-013:${lower}:${upper}:${difference}:${first}:${second}`,
      explanation: explanation(
        "Both numbers must be prime, lie inside the stated interval and differ by the exact amount.",
        `List prime candidates in the interval and test pairs separated by ${difference}.`,
        [`${first} and ${second} are both prime.`, `${second} - ${first} = ${difference}, and no other in-range prime pair satisfies all conditions.`],
        "For each smaller prime p, test only p plus the required difference.",
        options,
        correct,
      ),
    });
  }
  throw new Error(`Unable to construct unique difference pair for seed ${seed}`);
}

function triplesForMiddleAndSum(lower: number, upper: number, middle: number, sum: number): [number, number, number][] {
  const triples: [number, number, number][] = [];
  for (let first = lower; first < middle; first += 1) {
    const third = sum - middle - first;
    if (third <= middle || third > upper) continue;
    if (isPrime(first) && isPrime(middle) && isPrime(third)) triples.push([first, middle, third]);
  }
  return triples;
}

function generatePrimeTriple(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 127);
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const first = nextPrime((difficulty === "EASY" ? 3 : difficulty === "MEDIUM" ? 20 : 60) + Math.floor(random() * 50) + attempt);
    const middle = nextPrime(first);
    const third = nextPrime(middle);
    const sum = first + middle + third;
    const lower = Math.max(2, first - (difficulty === "HARD" ? 20 : 4));
    const upper = third + (difficulty === "HARD" ? 20 : 4);
    const triples = triplesForMiddleAndSum(lower, upper, middle, sum);
    if (triples.length !== 1 || triples[0]![0] !== first || triples[0]![2] !== third) continue;
    const correct = formatTriple([first, middle, third]);
    const { options, correctIndex } = placeOptions(correct, [
      { value: formatTriple([first, middle, nextPrime(third)]), misconceptionId: "CHANGED_SUM_WHILE_KEEPING_PRIMES" },
      { value: formatTriple([previousPrime(first), middle, third]), misconceptionId: "IGNORED_TOTAL_AFTER_REPLACING_TERM" },
      { value: formatTriple([first + 2, middle, third - 2]), misconceptionId: "PRESERVED_SUM_BUT_IGNORED_PRIMALITY" },
    ], seed);
    return basePackage("NUM-CP004-PROT-014", seed, {
      difficulty,
      answerSemantic: "PRIME_TRIPLE",
      stem: `Three increasing primes between ${lower} and ${upper} have sum ${sum}. If the middle prime is ${middle}, which triple is possible?`,
      options,
      correctIndex,
      canonicalAnswer: correct,
      verifierAnswer: formatTriple(triples[0]!),
      hiddenState: { lower, upper, sum, middle, triple: [first, middle, third], uniquenessCount: triples.length },
      mathematicalFingerprint: `NUM-CP004-PROT-014:${lower}:${upper}:${sum}:${middle}:${first}:${third}`,
      explanation: explanation(
        "A constrained prime triple must satisfy primality, increasing order, the fixed middle term, the interval and the total simultaneously.",
        `With middle term ${middle}, find two primes on opposite sides whose sum is ${sum - middle}.`,
        [`The outer primes ${first} and ${third} total ${first + third}.`, `Including ${middle} gives ${sum}, so the triple is ${correct}.`],
        "Subtract the fixed middle prime first, then test complementary prime pairs around it.",
        options,
        correct,
      ),
    });
  }
  throw new Error(`Unable to construct unique prime triple for seed ${seed}`);
}

function generateCoprimeSet(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 131);
  const factors = difficulty === "EASY" ? [2, 3] : difficulty === "MEDIUM" ? [3, 5] : [5, 7];
  const base = factors[0]! * factors[1]! * (difficulty === "HARD" ? 11 : 1);
  const offset = 2 + Math.floor(random() * 9);
  const candidates = [
    base + offset,
    factors[0]! * (offset + 1),
    base - 1,
    factors[1]! * (offset + 2),
    base + 1,
    base + offset + 3,
  ];
  const uniqueCandidates = [...new Set(candidates)].slice(0, 5);
  while (uniqueCandidates.length < 5) uniqueCandidates.push(base + 2 * uniqueCandidates.length + 1);
  const canonicalValues = uniqueCandidates.filter((value) => gcd(base, value) === 1);
  const verifierValues = uniqueCandidates.filter((value) => gcdByEnumeration(base, value) === 1);
  const correct = formatSet(canonicalValues);
  const addWrong = uniqueCandidates.find((value) => !canonicalValues.includes(value));
  const removeCorrect = canonicalValues[0];
  const { options, correctIndex } = placeOptions(correct, [
    { value: formatSet(removeCorrect === undefined ? canonicalValues : canonicalValues.filter((value) => value !== removeCorrect)), misconceptionId: "OMITTED_VALID_COPRIME_CANDIDATE" },
    { value: formatSet(addWrong === undefined ? uniqueCandidates : [...canonicalValues, addWrong]), misconceptionId: "INCLUDED_CANDIDATE_SHARING_A_FACTOR" },
    { value: formatSet(uniqueCandidates.filter((value) => isPrime(value))), misconceptionId: "CONFUSED_COPRIME_WITH_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-015", seed, {
    difficulty,
    answerSemantic: "COPRIME_SET",
    stem: `Which option lists every number from [${uniqueCandidates.join(", ")}] that is co-prime to ${base}?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: formatSet(verifierValues),
    hiddenState: { base, candidates: uniqueCandidates, coprimeValues: canonicalValues },
    mathematicalFingerprint: `NUM-CP004-PROT-015:${base}:${uniqueCandidates.join(":")}:${canonicalValues.join(":")}`,
    explanation: explanation(
      "Two numbers are co-prime when their HCF is 1; each listed candidate must be checked independently.",
      `Compute the HCF of ${base} with every candidate and retain all candidates whose HCF is 1.`,
      uniqueCandidates.map((value) => `HCF(${base}, ${value}) = ${gcd(base, value)}${gcd(base, value) === 1 ? ", so retain it" : ", so reject it"}.`),
      "Factor the base once, then reject any candidate divisible by one of those prime factors.",
      options,
      correct,
    ),
  });
}

function nearestPrimeAdjustments(value: number): number[] {
  if (isPrime(value)) return [0];
  let distance = 1;
  while (distance < value + 10) {
    const results: number[] = [];
    if (value - distance >= 2 && isPrime(value - distance)) results.push(-distance);
    if (isPrime(value + distance)) results.push(distance);
    if (results.length > 0) return results;
    distance += 1;
  }
  throw new Error(`Unable to find nearest prime to ${value}`);
}

function formatAdjustments(values: readonly number[]): string {
  return values.map((value) => value > 0 ? `+${value}` : String(value)).join(" or ");
}

function generatePrimeAdjustment(seed: number): NumCp004Wave02Package {
  const difficulty = difficultyFor(seed);
  const random = rng(seed * 137);
  let value = (difficulty === "EASY" ? 8 : difficulty === "MEDIUM" ? 50 : 140) + Math.floor(random() * 100);
  while (isPrime(value)) value += 1;
  const canonicalValues = nearestPrimeAdjustments(value);
  const verifierValues: number[] = [];
  for (let delta = -value + 2; delta <= value + 20; delta += 1) {
    if (!isPrimeByDivisorCount(value + delta)) continue;
    const bestDistance = Math.min(...nearestPrimeAdjustments(value).map(Math.abs));
    if (Math.abs(delta) === bestDistance) verifierValues.push(delta);
  }
  const correct = formatAdjustments(canonicalValues);
  const lower = previousPrime(value) - value;
  const upper = nextPrime(value) - value;
  const { options, correctIndex } = placeOptions(correct, [
    { value: formatAdjustments([lower]), misconceptionId: "IGNORED_EQUALLY_NEAR_OR_CLOSER_UPPER_PRIME" },
    { value: formatAdjustments([upper]), misconceptionId: "IGNORED_EQUALLY_NEAR_OR_CLOSER_LOWER_PRIME" },
    { value: formatAdjustments([Math.sign(upper || 1) * (Math.abs(upper) + 1)]), misconceptionId: "OFF_BY_ONE_ADJUSTMENT" },
    { value: "0", misconceptionId: "TREATED_COMPOSITE_INPUT_AS_PRIME" },
  ], seed);
  return basePackage("NUM-CP004-PROT-016", seed, {
    difficulty,
    answerSemantic: "PRIME_ADJUSTMENT_SET",
    stem: `What minimum signed adjustment must be applied to ${value} to obtain a prime number? Give both adjustments when there is a tie.`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: formatAdjustments(verifierValues),
    hiddenState: { value, lowerPrime: value + lower, upperPrime: value + upper, adjustments: canonicalValues },
    mathematicalFingerprint: `NUM-CP004-PROT-016:${value}:${canonicalValues.join(":")}`,
    explanation: explanation(
      "The required adjustment is determined by the nearest prime below or above the number; equal distances produce two valid signed adjustments.",
      `Find the nearest lower and upper primes around ${value}, compare their distances and retain every minimum-distance adjustment.`,
      [`The nearest lower prime is ${value + lower}, requiring ${lower}.`, `The nearest upper prime is ${value + upper}, requiring +${upper}.`, `The minimum valid adjustment set is ${correct}.`],
      "Check outward symmetrically: value minus 1 and value plus 1, then distance 2, and stop at the first distance containing a prime.",
      options,
      correct,
    ),
  });
}

export function generateNumCp004Wave02Package(
  prototypeId: NumCp004Wave02PrototypeId,
  seed: number,
): NumCp004Wave02Package {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error(`Seed must be a positive integer; received ${seed}`);
  switch (prototypeId) {
    case "NUM-CP004-PROT-009": return generateNextPrime(seed);
    case "NUM-CP004-PROT-010": return generatePreviousPrime(seed);
    case "NUM-CP004-PROT-011": return generateLeastPrimeDivisor(seed);
    case "NUM-CP004-PROT-012": return generatePrimePairSum(seed);
    case "NUM-CP004-PROT-013": return generatePrimePairDifference(seed);
    case "NUM-CP004-PROT-014": return generatePrimeTriple(seed);
    case "NUM-CP004-PROT-015": return generateCoprimeSet(seed);
    case "NUM-CP004-PROT-016": return generatePrimeAdjustment(seed);
  }
}

export function generateNumCp004Wave02Sweep(seedsPerPrototype: number): NumCp004Wave02Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) throw new Error("seedsPerPrototype must be a positive integer");
  return NUM_CP004_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_, index) => generateNumCp004Wave02Package(prototypeId, index + 1)),
  );
}

export { NUM_CP004_WAVE02_PROTOTYPE_IDS };
