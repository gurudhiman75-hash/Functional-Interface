import {
  runNumCp004PermanentPipeline,
  type NumCp004PermanentQuestion,
  type NumCp004PermanentRuntimeInput,
} from "./runtime";

export const NUM_CP004_EDITORIAL_V2_RELEASE = Object.freeze({
  releaseId: "NUM-001-CP004-EN-EDITORIAL-V2-REVIEW",
  packageId: "NUM-001",
  cpId: "NUM-CP-004",
  language: "en",
  locale: "en-IN",
  status: "EDITORIAL_V2_CONTROLLED_REVIEW",
  permanentQlRange: "NUM-QL-018..NUM-QL-045",
  permanentQlCount: 28,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
} as const);

export interface NumCp004EditorialV2Explanation {
  readonly concept: string;
  readonly solution: readonly string[];
  readonly finalAnswer: string;
}

type ReplacedFields = "explanation" | "reviewStatus" | "maturity" | "allocationStatus";

export type NumCp004EditorialV2Question = Omit<NumCp004PermanentQuestion, ReplacedFields> & {
  readonly answer: string;
  readonly explanation: NumCp004EditorialV2Explanation;
  readonly editorialVersion: "NUM-CP-004-EDITORIAL-V2";
  readonly sourceReviewStatus: NumCp004PermanentQuestion["reviewStatus"];
  readonly reviewStatus: "EDITORIAL_V2_CONTROLLED_REVIEW";
  readonly maturity: "EDITORIAL_REVIEW";
  readonly allocationStatus: "EDITORIAL_V2_CONTROLLED_REVIEW";
};

type HiddenState = Readonly<Record<string, unknown>>;
type PrimePower = Readonly<{ prime: number; exponent: number }>;

function math(value: string | number): string {
  return `\\(${String(value)}\\)`;
}

function asNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value)) {
    throw new Error(`Expected integer ${label}`);
  }
  return value;
}

function asString(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(`Expected string ${label}`);
  return value;
}

function asNumberArray(value: unknown, label: string): number[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "number" || !Number.isSafeInteger(item))) {
    throw new Error(`Expected integer array ${label}`);
  }
  return [...value] as number[];
}

function asPrimePowers(value: unknown, label: string): PrimePower[] {
  if (!Array.isArray(value)) throw new Error(`Expected prime-power array ${label}`);
  return value.map((item, index) => {
    if (!item || typeof item !== "object") throw new Error(`Invalid ${label}[${index}]`);
    const row = item as Record<string, unknown>;
    return Object.freeze({
      prime: asNumber(row.prime, `${label}[${index}].prime`),
      exponent: asNumber(row.exponent, `${label}[${index}].exponent`),
    });
  });
}

function isPrime(value: number): boolean {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function primesInRange(lower: number, upper: number): number[] {
  const result: number[] = [];
  for (let value = lower; value <= upper; value += 1) {
    if (isPrime(value)) result.push(value);
  }
  return result;
}

function previousPrime(value: number): number {
  for (let candidate = value - 1; candidate >= 2; candidate -= 1) {
    if (isPrime(candidate)) return candidate;
  }
  throw new Error(`No previous prime below ${value}`);
}

function nextPrime(value: number): number {
  for (let candidate = value + 1; candidate < Number.MAX_SAFE_INTEGER; candidate += 1) {
    if (isPrime(candidate)) return candidate;
  }
  throw new Error(`No next prime after ${value}`);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function factorise(value: number): PrimePower[] {
  let remainder = value;
  const factors: Array<{ prime: number; exponent: number }> = [];
  for (let prime = 2; prime * prime <= remainder; prime += 1) {
    if (!isPrime(prime)) continue;
    let exponent = 0;
    while (remainder % prime === 0) {
      remainder /= prime;
      exponent += 1;
    }
    if (exponent > 0) factors.push({ prime, exponent });
  }
  if (remainder > 1) factors.push({ prime: remainder, exponent: 1 });
  return factors;
}

function factorValue(factors: readonly PrimePower[]): number {
  return factors.reduce((product, factor) => product * factor.prime ** factor.exponent, 1);
}

function factorText(factors: readonly PrimePower[]): string {
  return factors.map(({ prime, exponent }) => exponent === 1 ? `${prime}` : `${prime}^{${exponent}}`).join(" \\times ");
}

function setText(values: readonly number[]): string {
  if (values.length === 0) return "\\varnothing";
  return `\\{${values.join(", ")}\\}`;
}

function digitSum(value: number): number {
  return String(Math.abs(value)).split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function primeRule(): string {
  return "Rule: A number greater than 1 is prime only when its positive divisors are 1 and the number itself. To test a number, it is enough to check prime divisors up to its square root.";
}

function conceptFor(state: HiddenState): string {
  const mode = asString(state.mode, "mode");
  switch (mode) {
    case "CLASSIFY": return "This question tests whether a number is prime, composite, the unit 1, or neither.";
    case "INTERVAL_SET": return "This question tests finding every prime number in the given inclusive interval.";
    case "INTERVAL_COUNT": return "This question tests counting all prime numbers in the given inclusive interval.";
    case "ADJACENT_PRIME": return "This question tests finding the nearest or extreme prime in the stated direction or interval.";
    case "DIGIT_RANGE_PRIME": return "This question tests finding the unique prime that satisfies both the range and digit-sum conditions.";
    case "PRIME_CLAIM": return "This question tests checking which statement about primality is actually true.";
    case "FACTORISATION": return "This question tests writing the given integer as a complete product of prime powers.";
    case "PRIME_FACTOR_EXTREMUM": return "This question tests identifying the required smallest or largest prime factor.";
    case "DISTINCT_FACTOR_COUNT": return "This question tests counting different prime factors, ignoring repeated powers.";
    case "MULTIPLICITY_COUNT": return "This question tests counting prime factors with repetition by adding their exponents.";
    case "RECONSTRUCT_INTEGER": return "This question tests rebuilding an integer from its prime-power factorisation.";
    case "COMPARE_STRUCTURES": return "This question tests comparing two prime-factor structures using the quantity named in the question.";
    case "MISSING_PRIME": return "This question tests recovering a missing prime from a complete prime-factorisation equation.";
    case "MISSING_EXPONENT": return "This question tests recovering a missing exponent from a complete prime-factorisation equation.";
    case "SELECT_COPRIME_PAIR": return "This question tests selecting the pair whose HCF is exactly 1.";
    case "COPRIME_SET": return "This question tests finding every candidate that is co-prime to the fixed number.";
    case "COPRIME_COUNT": return "This question tests counting the candidates that are co-prime to the fixed number.";
    case "COPRIME_UNKNOWN": return "This question tests choosing the value that makes the stated HCF equal to 1.";
    case "COPRIME_CLASS": return "This question tests the difference between pairwise co-prime and collectively co-prime numbers.";
    case "COPRIME_CLAIM": return "This question tests checking which co-prime statement is true using HCF.";
    case "PRIME_PAIR": return "This question tests reconstructing consecutive primes that satisfy the stated relation.";
    case "PRIME_TRIPLE": return "This question tests reconstructing three consecutive primes and verifying their sum.";
    case "LEAST_PRIME_DIVISOR": return "This question tests finding the first prime number that divides the given integer exactly.";
    case "EXPRESSION_PRIME_DIVISOR": return "This question tests evaluating an expression and finding which listed prime divides it exactly.";
    case "FEASIBILITY": return "This question tests which proposed prime-factor structure is mathematically possible.";
    case "FACTOR_TREE": return "This question tests using the parent-equals-product-of-children rule in a factor tree.";
    case "DATA_SUFFICIENCY": return "This question tests whether each statement gives enough information to determine one unique prime.";
    case "PRIME_ADJUSTMENT": return "This question tests the smallest signed change needed to reach a prime, including ties.";
    default: return "This question tests the stated prime-number or factorisation condition.";
  }
}

function classifySolution(state: HiddenState): string[] {
  const value = asNumber(state.value, "value");
  if (value === 1) {
    return [primeRule(), `${math(1)} has only one positive divisor, ${math(1)}. So it is not prime and not composite; it is the unit.`];
  }
  if (value <= 0) {
    return [primeRule(), `${math(value)} is not a positive integer greater than ${math(1)}, so it is neither prime nor composite.`];
  }
  const limit = Math.floor(Math.sqrt(value));
  const trialPrimes = primesInRange(2, limit);
  const divisor = trialPrimes.find((prime) => value % prime === 0);
  if (divisor !== undefined) {
    return [primeRule(), `${math(`${value} \\div ${divisor} = ${value / divisor}`)} is exact, so ${math(value)} has a factor other than 1 and itself and is composite.`];
  }
  const tests = trialPrimes.length === 0 ? "no prime divisor needs to be tested" : `none of ${math(setText(trialPrimes))} divides ${math(value)} exactly`;
  return [primeRule(), `Since ${math(`\\sqrt{${value}} < ${limit + 1}`)} and ${tests}, ${math(value)} is prime.`];
}

function intervalSolution(state: HiddenState, countOnly: boolean): string[] {
  const lower = asNumber(state.lower, "lower");
  const upper = asNumber(state.upper, "upper");
  const primes = primesInRange(lower, upper);
  const listed = math(setText(primes));
  if (countOnly) {
    return [primeRule(), `Testing the integers from ${math(lower)} to ${math(upper)} leaves the primes ${listed}.`, `There are ${math(primes.length)} primes, so the required count is ${math(primes.length)}.`];
  }
  return [primeRule(), `Testing every integer from ${math(lower)} to ${math(upper)} leaves exactly ${listed}.`, `Therefore the complete prime set is ${listed}.`];
}

function adjacentPrimeSolution(state: HiddenState, fallback: readonly string[]): string[] {
  const direction = asString(state.direction, "direction");
  if (direction === "NEXT") {
    const value = asNumber(state.value, "value");
    const answer = nextPrime(value);
    const skipped = Array.from({ length: Math.max(0, answer - value - 1) }, (_, index) => value + index + 1);
    return [primeRule(), `${skipped.length ? `${math(setText(skipped))} are not prime; ` : ""}${math(answer)} is prime.`, `So the smallest prime strictly greater than ${math(value)} is ${math(answer)}.`];
  }
  if (direction === "PREVIOUS") {
    const value = asNumber(state.value, "value");
    const answer = previousPrime(value);
    const skipped = Array.from({ length: Math.max(0, value - answer - 1) }, (_, index) => value - index - 1);
    return [primeRule(), `${skipped.length ? `${math(setText(skipped))} are not prime; ` : ""}${math(answer)} is prime.`, `So the greatest prime strictly less than ${math(value)} is ${math(answer)}.`];
  }
  return [primeRule(), ...fallback.slice(1, 3)];
}

function factorisationRule(): string {
  return "Rule: For complete prime factorisation, divide the number by prime factors until the quotient becomes 1, then group repeated prime factors as powers.";
}

function coprimeRule(): string {
  return "Rule: Two integers are co-prime when their HCF is exactly 1; they must not share any prime factor.";
}

function solutionFor(source: NumCp004PermanentQuestion): readonly string[] {
  const state = source.hiddenState as HiddenState;
  const mode = asString(state.mode, "mode");
  const answer = source.canonicalAnswer;
  const oldSteps = source.explanation.stepByStep;

  switch (mode) {
    case "CLASSIFY": return classifySolution(state);
    case "INTERVAL_SET": return intervalSolution(state, false);
    case "INTERVAL_COUNT": return intervalSolution(state, true);
    case "ADJACENT_PRIME": return adjacentPrimeSolution(state, oldSteps);
    case "DIGIT_RANGE_PRIME": {
      const lower = asNumber(state.lower, "lower");
      const upper = asNumber(state.upper, "upper");
      const target = asNumber(state.digitSum, "digitSum");
      const primes = primesInRange(lower, upper);
      const valid = primes.filter((prime) => digitSum(prime) === target);
      return [primeRule(), `The primes from ${math(lower)} to ${math(upper)} are ${math(setText(primes))}.`, `Their digit sums show that only ${math(valid[0] ?? answer)} has digit sum ${math(target)}, so the answer is ${math(answer)}.`];
    }
    case "PRIME_CLAIM":
      return [primeRule(), ...oldSteps.slice(0, 2), `Therefore the true statement is ${answer}`];
    case "FACTORISATION": {
      const value = asNumber(state.value, "value");
      const factors = factorise(value);
      return [factorisationRule(), `Repeated prime division gives ${math(`${value} = ${factorText(factors)}`)}.`, `Multiplying these prime powers gives ${math(value)} again, so the factorisation is complete.`];
    }
    case "PRIME_FACTOR_EXTREMUM": {
      const value = asNumber(state.value, "value");
      const factors = factorise(value);
      const bases = factors.map((factor) => factor.prime);
      const direction = asString(state.direction, "direction").toLowerCase();
      return ["Rule: First write the complete prime factorisation. The required smallest or largest prime factor is chosen from the prime bases, not from the exponents.", `${math(`${value} = ${factorText(factors)}`)}, so the prime factors are ${math(setText(bases))}.`, `The ${direction} prime factor is ${math(answer)}.`];
    }
    case "DISTINCT_FACTOR_COUNT": {
      const value = asNumber(state.value, "value");
      const factors = factorise(value);
      const bases = factors.map((factor) => factor.prime);
      return ["Rule: To count distinct prime factors, write the prime factorisation and count each different prime base once, regardless of its exponent.", `${math(`${value} = ${factorText(factors)}`)}, so the different prime bases are ${math(setText(bases))}.`, `There are ${math(bases.length)} different prime factors.`];
    }
    case "MULTIPLICITY_COUNT": {
      const value = asNumber(state.value, "value");
      const factors = factorise(value);
      const exponents = factors.map((factor) => factor.exponent);
      const total = exponents.reduce((sum, exponent) => sum + exponent, 0);
      return ["Rule: When prime factors are counted with multiplicity, repeated factors are included; in prime-power form, add all the exponents.", `${math(`${value} = ${factorText(factors)}`)}.`, `${math(`${exponents.join(" + ")} = ${total}`)}, so ${math(total)} prime factors occur when repetitions are counted.`];
    }
    case "RECONSTRUCT_INTEGER": {
      const factors = asPrimePowers(state.factors, "factors");
      const value = factorValue(factors);
      return ["Rule: To recover the integer from prime-power form, evaluate each prime power and multiply all of them.", `${math(`${factorText(factors)} = ${value}`)}.`, `Therefore the required integer is ${math(value)}.`];
    }
    case "COMPARE_STRUCTURES": {
      const factorsA = asPrimePowers(state.factorsA, "factorsA");
      const factorsB = asPrimePowers(state.factorsB, "factorsB");
      const target = asString(state.target, "target");
      const metric = (factors: readonly PrimePower[]): number => target === "DISTINCT"
        ? factors.length
        : target === "MULTIPLICITY"
          ? factors.reduce((sum, factor) => sum + factor.exponent, 0)
          : factorValue(factors);
      const a = metric(factorsA);
      const b = metric(factorsB);
      const rule = target === "DISTINCT"
        ? "Rule: For distinct prime factors, count the different prime bases in each factorisation."
        : target === "MULTIPLICITY"
          ? "Rule: For prime factors counted with multiplicity, add the exponents in each factorisation."
          : "Rule: To compare numerical values from prime-power form, evaluate the products and compare the resulting integers.";
      return [rule, `For A, the required value is ${math(a)}; for B, it is ${math(b)}.`, `${math(`${a} ${a === b ? "=" : a > b ? ">" : "<"} ${b}`)}, so the correct comparison is ${answer}.`];
    }
    case "MISSING_PRIME": {
      const value = asNumber(state.value, "value");
      const factors = asPrimePowers(state.factors, "factors");
      const hiddenIndex = asNumber(state.hiddenIndex, "hiddenIndex");
      const hidden = factors[hiddenIndex]!;
      const visible = factors.filter((_factor, index) => index !== hiddenIndex);
      const visibleProduct = factorValue(visible);
      const remainder = value / visibleProduct;
      return ["Rule: In a complete prime-factorisation equation, divide the number by all visible prime powers. The remaining exact prime power reveals the missing prime.", `${math(`${value} \\div ${visibleProduct} = ${remainder}`)}, and ${math(`${remainder} = ${hidden.prime}^{${hidden.exponent}}`)}.`, `Therefore the missing prime is ${math(hidden.prime)}.`];
    }
    case "MISSING_EXPONENT": {
      const value = asNumber(state.value, "value");
      const factors = asPrimePowers(state.factors, "factors");
      const hiddenIndex = asNumber(state.hiddenIndex, "hiddenIndex");
      const hidden = factors[hiddenIndex]!;
      const visible = factors.filter((_factor, index) => index !== hiddenIndex);
      const visibleProduct = factorValue(visible);
      const remainder = value / visibleProduct;
      return ["Rule: Divide out all known prime powers. Then express the remaining factor as a power of the prime whose exponent is missing.", `${math(`${value} \\div ${visibleProduct} = ${remainder}`)}, and ${math(`${remainder} = ${hidden.prime}^{${hidden.exponent}}`)}.`, `So the missing exponent is ${math(hidden.exponent)}.`];
    }
    case "SELECT_COPRIME_PAIR": {
      const pairs = state.pairs as ReadonlyArray<readonly [number, number]>;
      const checked = pairs.map(([a, b]) => `${math(`\\operatorname{HCF}(${a},${b})=${gcd(a, b)}`)}`);
      return [coprimeRule(), `Checking the four pairs gives ${checked.join(", ")}.`, `Only ${answer} has HCF ${math(1)}, so it is the co-prime pair.`];
    }
    case "COPRIME_SET":
    case "COPRIME_COUNT": {
      const fixed = asNumber(state.fixed, "fixed");
      const candidates = asNumberArray(state.candidates, "candidates");
      const valid = candidates.filter((candidate) => gcd(fixed, candidate) === 1);
      const checks = candidates.map((candidate) => `${candidate}:${gcd(fixed, candidate)}`).join(", ");
      const last = mode === "COPRIME_SET"
        ? `The values with HCF ${math(1)} are ${math(setText(valid))}.`
        : `There are ${math(valid.length)} values with HCF ${math(1)}, so the answer is ${math(valid.length)}.`;
      return [coprimeRule(), `For the candidates, the HCF values with ${math(fixed)} are ${math(`\\{${checks}\\}`)} (candidate:HCF).`, last];
    }
    case "COPRIME_UNKNOWN": {
      const fixed = asNumber(state.fixed, "fixed");
      const candidates = asNumberArray(state.candidates, "candidates");
      const valid = candidates.find((candidate) => gcd(fixed, candidate) === 1);
      return [coprimeRule(), `Checking the options, ${math(`\\operatorname{HCF}(${fixed},${valid})=1`)} while the other choices share a factor with ${math(fixed)}.`, `Therefore ${math(`x=${valid}`)}.`];
    }
    case "COPRIME_CLASS": {
      const values = asNumberArray(state.values, "values");
      const [a, b, c] = values;
      const ab = gcd(a!, b!);
      const ac = gcd(a!, c!);
      const bc = gcd(b!, c!);
      const all = gcd(gcd(a!, b!), c!);
      return ["Rule: Pairwise co-prime means every pair has HCF 1. Collectively co-prime means the HCF of all the numbers together is 1.", `Pair HCFs are ${math(`${ab}, ${ac}, ${bc}`)}; the HCF of all three numbers is ${math(all)}.`, `Therefore the correct classification is ${answer}.`];
    }
    case "COPRIME_CLAIM":
      return [coprimeRule(), ...oldSteps.slice(0, 2), `Therefore the true statement is ${answer}`];
    case "PRIME_PAIR": {
      const first = asNumber(state.first, "first");
      const second = asNumber(state.second, "second");
      const relation = asString(state.relation, "relation");
      const target = asNumber(state.target, "target");
      const operation = relation === "SUM" ? `${first}+${second}` : relation === "DIFFERENCE" ? `${second}-${first}` : `${first}\\times${second}`;
      return ["Rule: The required numbers must both be prime, must be consecutive in the prime sequence, and must satisfy the stated relation.", `${math(first)} and ${math(second)} are consecutive primes.`, `${math(`${operation}=${target}`)}, so the required pair is ${math(`(${first},${second})`)}.`];
    }
    case "PRIME_TRIPLE": {
      const first = asNumber(state.first, "first");
      const second = asNumber(state.second, "second");
      const third = asNumber(state.third, "third");
      const sum = asNumber(state.sum, "sum");
      return ["Rule: Consecutive primes are adjacent in the prime sequence; once the first is fixed, take the next prime and then the next one again.", `After ${math(first)}, the next two primes are ${math(second)} and ${math(third)}.`, `${math(`${first}+${second}+${third}=${sum}`)}, so the triple is ${math(`(${first},${second},${third})`)}.`];
    }
    case "LEAST_PRIME_DIVISOR": {
      const value = asNumber(state.value, "value");
      const factors = factorise(value);
      return ["Rule: The least prime divisor is the smallest prime that divides the number exactly. In the prime factorisation, it is the smallest prime base.", `${math(`${value}=${factorText(factors)}`)}.`, `The smallest prime base is ${math(factors[0]!.prime)}, so the least prime divisor is ${math(answer)}.`];
    }
    case "EXPRESSION_PRIME_DIVISOR": {
      const a = asNumber(state.a, "a");
      const b = asNumber(state.b, "b");
      const value = a + b;
      const divisor = Number(answer);
      return ["Rule: First evaluate the expression. A listed prime is a divisor only if the division leaves remainder 0.", `${math(`${a}+${b}=${value}`)}.`, `${math(`${value}\\div${divisor}=${value / divisor}`)} is exact, so ${math(divisor)} divides the expression.`];
    }
    case "FEASIBILITY":
      return ["Rule: Every integer greater than 1 has a unique prime factorisation. Also, 2 is the only even prime, and a product of primes greater than 1 is composite.", ...oldSteps.slice(0, 2), `Therefore the possible statement is: ${answer}`];
    case "FACTOR_TREE": {
      const root = asNumber(state.root, "root");
      const right = asNumber(state.right, "right");
      const children = asNumberArray(state.children, "children");
      const missing = children[0]! * children[1]!;
      return ["Rule: In a factor tree, every parent node equals the product of its two child nodes.", `${math(`${children[0]}\\times${children[1]}=${missing}`)}, so the missing node is ${math(missing)}.`, `Check: ${math(`${missing}\\times${right}=${root}`)}, so the factor tree is consistent.`];
    }
    case "DATA_SUFFICIENCY": {
      const statementI = asNumberArray(state.statementI, "statementI");
      const statementII = asNumberArray(state.statementII, "statementII");
      const intersection = statementI.filter((value) => statementII.includes(value));
      return ["Rule: A statement is sufficient only if it alone leaves exactly one possible value. Combine the statements only when neither one is sufficient by itself.", `Statement I leaves ${math(statementI.length)} possible value(s); Statement II leaves ${math(statementII.length)}.`, `Together they leave ${math(intersection.length)} common value(s), so the conclusion is ${answer}.`];
    }
    case "PRIME_ADJUSTMENT": {
      const value = asNumber(state.value, "value");
      const lower = previousPrime(value);
      const upper = nextPrime(value);
      const down = lower - value;
      const up = upper - value;
      const minimum = Math.min(Math.abs(down), Math.abs(up));
      const adjustments = [down, up].filter((change) => Math.abs(change) === minimum);
      return ["Rule: Check the nearest prime below and above the number. Choose the change with the smallest absolute value; if both distances are equal, keep both signed changes.", `Nearest primes: ${math(lower)} and ${math(upper)}. The signed changes are ${math(String(down))} and ${math(`+${up}`)}.`, `The minimum absolute change is ${math(minimum)}, so the required adjustment set is ${math(`\\{${adjustments.map((change) => change > 0 ? `+${change}` : change).join(", ")}\\}`)}.`];
    }
    default:
      return [String(source.explanation.coreConcept[0] ?? "Rule: Use the relevant prime-number definition."), ...oldSteps.slice(0, 2)];
  }
}

function buildEditorialV2Question(source: NumCp004PermanentQuestion): NumCp004EditorialV2Question {
  const solution = Object.freeze(solutionFor(source));
  if (solution.length < 2 || solution.length > 4) {
    throw new Error(`${source.permanentQlId}/${source.seed}: Editorial V2 solution must contain 2-4 lines`);
  }
  if (!solution[0]!.startsWith("Rule:")) {
    throw new Error(`${source.permanentQlId}/${source.seed}: solution must teach the rule first`);
  }

  const concept = conceptFor(source.hiddenState as HiddenState);
  if (!concept.startsWith("This question tests ")) {
    throw new Error(`${source.permanentQlId}/${source.seed}: concept must identify the tested skill`);
  }

  return Object.freeze({
    ...source,
    answer: source.canonicalAnswer,
    explanation: Object.freeze({
      concept,
      solution,
      finalAnswer: source.canonicalAnswer,
    }),
    editorialVersion: "NUM-CP-004-EDITORIAL-V2" as const,
    sourceReviewStatus: source.reviewStatus,
    reviewStatus: "EDITORIAL_V2_CONTROLLED_REVIEW" as const,
    maturity: "EDITORIAL_REVIEW" as const,
    allocationStatus: "EDITORIAL_V2_CONTROLLED_REVIEW" as const,
  });
}

export function runNumCp004EditorialV2(
  input: NumCp004PermanentRuntimeInput = {},
): NumCp004EditorialV2Question {
  return buildEditorialV2Question(runNumCp004PermanentPipeline(input));
}
