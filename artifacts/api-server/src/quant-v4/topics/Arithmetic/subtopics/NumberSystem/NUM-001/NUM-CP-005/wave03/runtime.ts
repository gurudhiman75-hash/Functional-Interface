import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";
import {
  NUM_CP005_WAVE03_PROTOTYPE_IDS,
  type NumCp005Wave03AnswerSemantic,
  type NumCp005Wave03Package,
  type NumCp005Wave03PrototypeId,
} from "./types";

const PRIME_POOL = [2, 3, 5, 7, 11] as const;
const ODD_MINIMUM_TARGETS = [3, 4, 5, 6, 8, 9, 10, 12, 15, 16] as const;
const EVEN_MINIMUM_TARGETS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24] as const;
const RANGE_TARGETS = [2, 3, 4, 6, 8, 9, 10, 12] as const;

const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligibility: "INELIGIBLE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

class Rng {
  private state: number;

  constructor(text: string) {
    let state = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      state ^= text.charCodeAt(index);
      state = Math.imul(state, 16777619);
    }
    this.state = state >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(minimum: number, maximum: number): number {
    return minimum + (this.next() % (maximum - minimum + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }
}

function assertSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("NUM-CP-005 Wave 03 seed must be a positive integer.");
  }
}

function difficultyForSeed(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: NumCp005Wave03PrototypeId): number {
  return NUM_CP005_WAVE03_PROTOTYPE_IDS.indexOf(prototypeId);
}

function factorText(factors: readonly NumCp005PrimePower[]): string {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ") || "1";
}

function numberFromFactors(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (value, factor) => value * BigInt(factor.prime) ** BigInt(factor.exponent),
    1n,
  );
}

function enumerateDivisors(factors: readonly NumCp005PrimePower[]): bigint[] {
  let divisors = [1n];
  for (const factor of factors) {
    const additions: bigint[] = [];
    let power = 1n;
    for (let exponent = 1; exponent <= factor.exponent; exponent += 1) {
      power *= BigInt(factor.prime);
      for (const divisor of divisors) additions.push(divisor * power);
    }
    divisors = [...divisors, ...additions];
  }
  return divisors.sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function enumerateDivisorsByScan(n: bigint): bigint[] {
  const divisors: bigint[] = [];
  for (let candidate = 1n; candidate <= n; candidate += 1n) {
    if (n % candidate === 0n) divisors.push(candidate);
  }
  return divisors;
}

function divisorCountByPairs(value: number): number {
  let count = 0;
  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor !== 0) continue;
    count += divisor * divisor === value ? 1 : 2;
  }
  return count;
}

function factorInteger(value: number): readonly NumCp005PrimePower[] {
  let remaining = value;
  const factors: NumCp005PrimePower[] = [];
  for (let candidate = 2; candidate * candidate <= remaining; candidate += 1) {
    let exponent = 0;
    while (remaining % candidate === 0) {
      remaining /= candidate;
      exponent += 1;
    }
    if (exponent > 0) factors.push({ prime: candidate, exponent });
  }
  if (remaining > 1) factors.push({ prime: remaining, exponent: 1 });
  return Object.freeze(factors.map((factor) => Object.freeze(factor)));
}

function divisorCountFormula(factors: readonly NumCp005PrimePower[]): number {
  return factors.reduce((count, factor) => count * (factor.exponent + 1), 1);
}

function divisorSumFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((product, factor) => {
    let localSum = 0n;
    let power = 1n;
    for (let exponent = 0; exponent <= factor.exponent; exponent += 1) {
      localSum += power;
      power *= BigInt(factor.prime);
    }
    return product * localSum;
  }, 1n);
}

function oddDivisorCount(factors: readonly NumCp005PrimePower[]): number {
  return factors.reduce(
    (count, factor) => count * (factor.prime === 2 ? 1 : factor.exponent + 1),
    1,
  );
}

function squareDivisorCount(factors: readonly NumCp005PrimePower[]): number {
  return factors.reduce(
    (count, factor) => count * (Math.floor(factor.exponent / 2) + 1),
    1,
  );
}

function makeFactors(
  prototypeId: NumCp005Wave03PrototypeId,
  seed: number,
  difficulty: NumCp005Difficulty,
  rng: Rng,
): readonly NumCp005PrimePower[] {
  const count = difficulty === "EASY" ? 2 : difficulty === "MEDIUM" ? 2 : 3;
  const selected: number[] = [];
  if ((seed + prototypeIndex(prototypeId)) % 2 === 0) selected.push(2);
  while (selected.length < count) {
    const prime = rng.pick(PRIME_POOL);
    if (!selected.includes(prime)) selected.push(prime);
  }
  selected.sort((left, right) => left - right);
  return Object.freeze(selected.map((prime) => Object.freeze({
    prime,
    exponent: difficulty === "EASY" ? rng.int(1, 2)
      : difficulty === "MEDIUM" ? rng.int(2, 3)
        : rng.int(2, 4),
  })));
}

function requirementValue(requirements: readonly NumCp005PrimePower[]): bigint {
  return requirements.reduce(
    (value, requirement) =>
      value * BigInt(requirement.prime) ** BigInt(requirement.exponent),
    1n,
  );
}

function requirementText(requirements: readonly NumCp005PrimePower[]): string {
  return factorText(requirements.filter((requirement) => requirement.exponent > 0));
}

function countDivisibleByRequirement(
  factors: readonly NumCp005PrimePower[],
  requirements: readonly NumCp005PrimePower[],
): number {
  return factors.reduce((count, factor) => {
    const minimum = requirements.find((entry) => entry.prime === factor.prime)?.exponent ?? 0;
    if (minimum > factor.exponent) return 0;
    return count * (factor.exponent - minimum + 1);
  }, 1);
}

function mergeRequirementMaximum(
  first: readonly NumCp005PrimePower[],
  second: readonly NumCp005PrimePower[],
): readonly NumCp005PrimePower[] {
  const primes = new Set([...first.map((entry) => entry.prime), ...second.map((entry) => entry.prime)]);
  return Object.freeze([...primes].sort((left, right) => left - right).map((prime) => Object.freeze({
    prime,
    exponent: Math.max(
      first.find((entry) => entry.prime === prime)?.exponent ?? 0,
      second.find((entry) => entry.prime === prime)?.exponent ?? 0,
    ),
  })));
}

function buildTwoRequirements(
  factors: readonly NumCp005PrimePower[],
  rng: Rng,
): {
  first: readonly NumCp005PrimePower[];
  second: readonly NumCp005PrimePower[];
  canonicalCount: number;
} {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const first = factors.map((factor) => ({
      prime: factor.prime,
      exponent: rng.int(0, factor.exponent),
    }));
    const second = factors.map((factor) => ({
      prime: factor.prime,
      exponent: rng.int(0, factor.exponent),
    }));
    if (first.every((entry) => entry.exponent === 0)) first[0]!.exponent = 1;
    if (second.every((entry) => entry.exponent === 0)) second[second.length - 1]!.exponent = 1;
    const firstFrozen = Object.freeze(first.map((entry) => Object.freeze(entry)));
    const secondFrozen = Object.freeze(second.map((entry) => Object.freeze(entry)));
    const both = mergeRequirementMaximum(firstFrozen, secondFrozen);
    const canonicalCount = countDivisibleByRequirement(factors, firstFrozen)
      - countDivisibleByRequirement(factors, both);
    if (
      canonicalCount > 0
      && requirementValue(firstFrozen) !== requirementValue(secondFrozen)
    ) {
      return { first: firstFrozen, second: secondFrozen, canonicalCount };
    }
  }
  throw new Error("Unable to construct a non-empty two-condition divisor state.");
}

function numericOptions(answer: bigint, correctIndex: number): readonly NumCp005Option[] {
  const candidates = [
    answer + 1n,
    answer > 0n ? answer - 1n : 2n,
    answer + 2n,
    answer * 2n,
    answer + 3n,
    answer > 2n ? answer - 2n : 4n,
  ];
  const wrongs: bigint[] = [];
  for (const candidate of candidates) {
    if (candidate >= 0n && candidate !== answer && !wrongs.includes(candidate)) wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  const traps = [
    ["NUM-CP005-TRAP-CONDITION-LOSS", "This ignores one of the displayed divisor conditions."],
    ["NUM-CP005-TRAP-ORDER-BOUNDARY", "This misreads the bound, rank, or paired-divisor boundary."],
    ["NUM-CP005-TRAP-INVERSE-NOT-MINIMUM", "This value satisfies a related count but is not the required exact or least result."],
  ] as const;
  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    if (index === correctIndex) {
      return Object.freeze({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches the canonical result and the independent verifier.",
      });
    }
    const trap = traps[wrongIndex]!;
    const option = Object.freeze({
      value: wrongs[wrongIndex]!.toString(),
      isCorrect: false,
      misconceptionId: trap[0],
      analysis: trap[1],
    });
    wrongIndex += 1;
    return option;
  }));
}

function claimOptions(answer: "True" | "False", correctIndex: number): readonly NumCp005Option[] {
  const values = ["True", "False", "Cannot be determined", "True only when n is prime"];
  const ordered = [answer, ...values.filter((value) => value !== answer)];
  const rotated = Array.from({ length: 4 }, (_unused, index) =>
    ordered[(index - correctIndex + 4) % 4]!);
  return Object.freeze(rotated.map((value, index) => Object.freeze({
    value,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null
      : value === "Cannot be determined" ? "NUM-CP005-TRAP-CLAIM-UNRESOLVED"
        : value === "True only when n is prime" ? "NUM-CP005-TRAP-IRRELEVANT-PRIMALITY"
          : "NUM-CP005-TRAP-CLAIM-POLARITY",
    analysis: index === correctIndex
      ? "The displayed claim matches the independently recomputed divisor property."
      : value === "Cannot be determined"
        ? "The prime factorisation determines the claimed divisor property exactly."
        : value === "True only when n is prime"
          ? "Primality is not the governing condition for this displayed claim."
          : "This reverses the verified truth value of the claim.",
  })));
}

function representationFor(prototypeId: NumCp005Wave03PrototypeId): NumCp005Wave03Package["representation"] {
  if (prototypeId === "NUM-CP005-PROT-020") return "CLAIM";
  if (prototypeId === "NUM-CP005-PROT-021") return "DIVISOR_PAIR_TABLE";
  if (prototypeId === "NUM-CP005-PROT-022") return "BOUNDED_INTERVAL";
  return "DIRECT";
}

function semanticFor(prototypeId: NumCp005Wave03PrototypeId): NumCp005Wave03AnswerSemantic {
  if (prototypeId === "NUM-CP005-PROT-017") return "DIVISOR_COUNT";
  if (["NUM-CP005-PROT-018", "NUM-CP005-PROT-019", "NUM-CP005-PROT-021"].includes(prototypeId)) {
    return "DIVISOR_VALUE";
  }
  if (prototypeId === "NUM-CP005-PROT-020") return "BOOLEAN_CLAIM";
  if (prototypeId === "NUM-CP005-PROT-022") return "INTEGER_COUNT";
  return "INTEGER";
}

function propertyValue(
  kind: "TOTAL_DIVISORS" | "ODD_DIVISORS" | "SQUARE_DIVISORS" | "DIVISOR_SUM",
  factors: readonly NumCp005PrimePower[],
): bigint {
  if (kind === "TOTAL_DIVISORS") return BigInt(divisorCountFormula(factors));
  if (kind === "ODD_DIVISORS") return BigInt(oddDivisorCount(factors));
  if (kind === "SQUARE_DIVISORS") return BigInt(squareDivisorCount(factors));
  return divisorSumFormula(factors);
}

function propertyLabel(kind: string): string {
  if (kind === "TOTAL_DIVISORS") return "positive divisors";
  if (kind === "ODD_DIVISORS") return "odd positive divisors";
  if (kind === "SQUARE_DIVISORS") return "perfect-square positive divisors";
  return "as the sum of all positive divisors";
}

interface RangeState {
  readonly lower: number;
  readonly upper: number;
  readonly target: number;
  readonly matches: readonly number[];
  readonly className: "ZERO" | "ONE" | "MULTIPLE";
}

let cachedRangeStates: readonly RangeState[] | null = null;

function rangeStates(): readonly RangeState[] {
  if (cachedRangeStates) return cachedRangeStates;
  const result: RangeState[] = [];
  const lengths = [8, 12, 16, 20];
  for (const target of RANGE_TARGETS) {
    for (const length of lengths) {
      for (let lower = 1; lower <= 130 - length; lower += 1) {
        const upper = lower + length;
        const matches: number[] = [];
        for (let value = lower; value <= upper; value += 1) {
          if (divisorCountFormula(factorInteger(value)) === target) matches.push(value);
        }
        const className = matches.length === 0 ? "ZERO" : matches.length === 1 ? "ONE" : "MULTIPLE";
        result.push(Object.freeze({
          lower,
          upper,
          target,
          matches: Object.freeze(matches),
          className,
        }));
      }
    }
  }
  cachedRangeStates = Object.freeze(result);
  return cachedRangeStates;
}

function chooseRangeState(seed: number): RangeState {
  const desired = (["ZERO", "ONE", "MULTIPLE"] as const)[(seed - 1) % 3]!;
  const candidates = rangeStates().filter((state) => state.className === desired);
  if (candidates.length === 0) throw new Error(`No bounded range state found for ${desired}.`);
  return candidates[(seed * 37) % candidates.length]!;
}

function minimumWithDivisorCount(
  target: number,
  parity: "ODD" | "EVEN",
): bigint {
  const primes = parity === "ODD"
    ? [3n, 5n, 7n, 11n, 13n, 17n]
    : [2n, 3n, 5n, 7n, 11n, 13n];
  let best: bigint | null = null;

  function search(
    primeIndex: number,
    maximumExponent: number,
    remainingChoices: number,
    current: bigint,
  ): void {
    if (remainingChoices === 1) {
      if (parity === "EVEN" && current % 2n !== 0n) return;
      if (best === null || current < best) best = current;
      return;
    }
    if (primeIndex >= primes.length) return;
    let primePower = 1n;
    for (let exponent = 1; exponent <= maximumExponent; exponent += 1) {
      primePower *= primes[primeIndex]!;
      if (remainingChoices % (exponent + 1) !== 0) continue;
      const next = current * primePower;
      if (best !== null && next >= best) continue;
      search(primeIndex + 1, exponent, remainingChoices / (exponent + 1), next);
    }
  }

  search(0, target - 1, target, 1n);
  if (best === null) throw new Error(`No ${parity.toLowerCase()} minimum found for ${target} divisors.`);
  return best;
}

function verifyMinimumWithScan(target: number, parity: "ODD" | "EVEN", candidate: bigint): bigint {
  const limit = Number(candidate);
  if (!Number.isSafeInteger(limit)) throw new Error("Parity minimum exceeds safe scan range.");
  const start = parity === "ODD" ? 1 : 2;
  const step = 2;
  for (let value = start; value <= limit; value += step) {
    if (divisorCountByPairs(value) === target) return BigInt(value);
  }
  throw new Error(`No ${parity.toLowerCase()} scan solution for ${target} divisors.`);
}

function exponentPattern(factors: readonly NumCp005PrimePower[]): string {
  return factors.map((factor) => factor.exponent).join(", ");
}

function explanationFor(
  prototypeId: NumCp005Wave03PrototypeId,
  answer: string,
  state: Readonly<Record<string, unknown>>,
): NumCp005Explanation {
  let coreConcept = "The complete divisor set follows from independent prime-exponent choices.";
  let strategy = "Apply the displayed condition to the exact divisor structure, then verify independently.";
  let steps: string[] = [];
  let speed = "Use exponent restrictions before listing or scanning divisors.";

  switch (prototypeId) {
    case "NUM-CP005-PROT-017":
      steps = [
        `Count divisors divisible by k1: ${String(state.divisibleByFirst)}.`,
        `Count divisors divisible by both k1 and k2: ${String(state.divisibleByBoth)}.`,
        `Subtract to obtain ${answer}.`,
      ];
      speed = "Use A but not B = count(A) - count(A and B).";
      break;
    case "NUM-CP005-PROT-018":
      steps = [
        `Construct the ordered divisor set of n = ${String(state.integerValue)}.`,
        `Discard divisors greater than the bound ${String(state.bound)}.`,
        `The greatest remaining divisor is ${answer}.`,
      ];
      speed = "Check complementary divisor pairs near the bound instead of testing every integer.";
      break;
    case "NUM-CP005-PROT-019":
      steps = [
        `Arrange all ${String(state.divisorCount)} positive divisors in ascending order.`,
        `Read position ${String(state.requestedIndex)} using one-based indexing.`,
        `The requested divisor is ${answer}.`,
      ];
      speed = "Generate divisor pairs from both ends and stop when the requested rank is reached.";
      break;
    case "NUM-CP005-PROT-020":
      coreConcept = "A divisor-function claim is true only when its displayed value equals the exact governed property.";
      steps = [
        `Recompute the ${String(state.propertyLabel)} from the prime factorisation.`,
        `Exact value = ${String(state.actualValue)}; claimed value = ${String(state.claimedValue)}.`,
        `Therefore the claim is ${answer}.`,
      ];
      speed = "Compute the property first; compare only after the exact value is known.";
      break;
    case "NUM-CP005-PROT-021":
      coreConcept = "Every divisor pair multiplies to the same number n.";
      steps = [
        `Use the visible partner ${String(state.visiblePartner)} and n = ${String(state.integerValue)}.`,
        `Missing entry = n ÷ visible partner = ${answer}.`,
        "Check that the completed pair occurs in the ordered divisor-pair table.",
      ];
      speed = "In a divisor-pair table, divide n by the visible partner.";
      break;
    case "NUM-CP005-PROT-022":
      coreConcept = "An interval count includes only integers whose exact positive-divisor count equals the target.";
      steps = [
        `Check each integer from ${String(state.lower)} through ${String(state.upper)}.`,
        `The matching integers are ${String(state.matchList)}.`,
        `Their count is ${answer}.`,
      ];
      speed = "Use prime factorisation for each candidate and stop early when the exponent-choice product exceeds the target.";
      break;
    case "NUM-CP005-PROT-023":
      coreConcept = "The least odd number uses only odd primes, with larger exponents assigned to smaller primes.";
      strategy = "Factor the divisor count into exponent-choice factors and minimise over ascending odd primes.";
      steps = [
        `Required divisor count: ${String(state.targetDivisorCount)}.`,
        `Minimum odd exponent pattern: ${String(state.exponentPattern)}.`,
        `This gives ${answer}; an odd-only scan proves no smaller odd candidate works.`,
      ];
      speed = "Use 3, 5, 7, ... and keep exponents non-increasing.";
      break;
    case "NUM-CP005-PROT-024":
      coreConcept = "The least even number must include prime 2 and uses non-increasing exponents on ascending primes.";
      strategy = "Minimise the exponent-partition construction with a mandatory positive exponent on 2.";
      steps = [
        `Required divisor count: ${String(state.targetDivisorCount)}.`,
        `Minimum even exponent pattern: ${String(state.exponentPattern)}.`,
        `This gives ${answer}; an even-only scan proves no smaller even candidate works.`,
      ];
      speed = "Start with 2 and assign the largest exponent there.";
      break;
  }

  return Object.freeze({
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze(steps),
    examSpeedMethod: speed,
    commonTraps: Object.freeze([
      "Do not drop one of the stated conditions or reverse a complement.",
      "Use one-based indexing and include both 1 and n in the positive-divisor order.",
      "For inverse minima, proving that a candidate works is not enough; prove no smaller candidate works.",
    ]),
    finalAnswer: `The required result is ${answer}.`,
  });
}

function fingerprint(
  prototypeId: NumCp005Wave03PrototypeId,
  factors: readonly NumCp005PrimePower[],
  state: Readonly<Record<string, unknown>>,
): string {
  const factorPart = factors.map(({ prime, exponent }) => `${prime}^${exponent}`).join("*") || "1";
  const statePart = Object.entries(state)
    .filter(([key]) => !["pairTable", "matchList"].includes(key))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("|");
  return `${prototypeId}|${factorPart}|${statePart}`;
}

export function generateNumCp005Wave03Package(
  prototypeId: NumCp005Wave03PrototypeId,
  seed: number,
): NumCp005Wave03Package {
  assertSeed(seed);
  if (!NUM_CP005_WAVE03_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown NUM-CP-005 Wave 03 prototype: ${prototypeId}`);
  }

  const difficulty = difficultyForSeed(seed);
  const rng = new Rng(`${prototypeId}:${seed}`);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  let factors: readonly NumCp005PrimePower[] = Object.freeze([]);
  let canonical = "";
  let verifier = "";
  let stem = "";
  let state: Readonly<Record<string, unknown>> = Object.freeze({});
  let options: readonly NumCp005Option[];

  if (prototypeId === "NUM-CP005-PROT-022") {
    const range = chooseRangeState(seed);
    const verifiedMatches: number[] = [];
    for (let value = range.lower; value <= range.upper; value += 1) {
      if (divisorCountByPairs(value) === range.target) verifiedMatches.push(value);
    }
    canonical = range.matches.length.toString();
    verifier = verifiedMatches.length.toString();
    stem = `How many integers from ${range.lower} through ${range.upper}, inclusive, have exactly ${range.target} positive divisors?`;
    state = Object.freeze({
      lower: range.lower,
      upper: range.upper,
      targetDivisorCount: range.target,
      rangeClass: range.className,
      matches: range.matches,
      matchList: range.matches.length ? range.matches.join(", ") : "none",
    });
    options = numericOptions(BigInt(range.matches.length), correctIndex);
  } else if (prototypeId === "NUM-CP005-PROT-023" || prototypeId === "NUM-CP005-PROT-024") {
    const parity = prototypeId === "NUM-CP005-PROT-023" ? "ODD" as const : "EVEN" as const;
    const targets = parity === "ODD" ? ODD_MINIMUM_TARGETS : EVEN_MINIMUM_TARGETS;
    const target = targets[(seed - 1) % targets.length]!;
    const answer = minimumWithDivisorCount(target, parity);
    const verified = verifyMinimumWithScan(target, parity, answer);
    factors = factorInteger(Number(answer));
    canonical = answer.toString();
    verifier = verified.toString();
    stem = `What is the least ${parity.toLowerCase()} positive integer having exactly ${target} positive divisors?`;
    state = Object.freeze({
      parity,
      targetDivisorCount: target,
      exponentPattern: exponentPattern(factors),
      integerValue: canonical,
    });
    options = numericOptions(answer, correctIndex);
  } else {
    factors = makeFactors(prototypeId, seed, difficulty, rng);
    const n = numberFromFactors(factors);
    const divisors = enumerateDivisors(factors);
    const scanned = enumerateDivisorsByScan(n);

    if (prototypeId === "NUM-CP005-PROT-017") {
      const requirements = buildTwoRequirements(factors, rng);
      const firstValue = requirementValue(requirements.first);
      const secondValue = requirementValue(requirements.second);
      const both = mergeRequirementMaximum(requirements.first, requirements.second);
      const divisibleByFirst = countDivisibleByRequirement(factors, requirements.first);
      const divisibleByBoth = countDivisibleByRequirement(factors, both);
      const answer = requirements.canonicalCount;
      const verified = divisors.filter((divisor) =>
        divisor % firstValue === 0n && divisor % secondValue !== 0n).length;
      canonical = answer.toString();
      verifier = verified.toString();
      stem = `Let n = ${factorText(factors)}. How many positive divisors of n are divisible by k1 = ${requirementText(requirements.first)} but not divisible by k2 = ${requirementText(requirements.second)}?`;
      state = Object.freeze({
        integerValue: n.toString(),
        firstRequirement: requirementText(requirements.first),
        secondRequirement: requirementText(requirements.second),
        divisibleByFirst,
        divisibleByBoth,
      });
      options = numericOptions(BigInt(answer), correctIndex);
    } else if (prototypeId === "NUM-CP005-PROT-018") {
      const candidateIndex = rng.int(0, divisors.length - 2);
      const selected = divisors[candidateIndex]!;
      const next = divisors[candidateIndex + 1]!;
      const bound = selected === next - 1n ? selected : selected + BigInt(rng.int(0, Number(next - selected - 1n)));
      const answer = [...divisors].reverse().find((divisor) => divisor <= bound)!;
      let verified = 1n;
      for (let candidate = bound; candidate >= 1n; candidate -= 1n) {
        if (n % candidate === 0n) {
          verified = candidate;
          break;
        }
      }
      canonical = answer.toString();
      verifier = verified.toString();
      stem = `For n = ${factorText(factors)}, find the greatest positive divisor of n that does not exceed ${bound}.`;
      state = Object.freeze({ integerValue: n.toString(), bound: bound.toString(), divisorCount: divisors.length });
      options = numericOptions(answer, correctIndex);
    } else if (prototypeId === "NUM-CP005-PROT-019") {
      let requestedIndex: number;
      const positionClass = (seed - 1) % 3;
      if (positionClass === 0) requestedIndex = 1;
      else if (positionClass === 1) requestedIndex = Math.ceil(divisors.length / 2);
      else requestedIndex = divisors.length;
      const answer = divisors[requestedIndex - 1]!;
      const verified = scanned[requestedIndex - 1]!;
      canonical = answer.toString();
      verifier = verified.toString();
      stem = `Arrange the positive divisors of n = ${factorText(factors)} in ascending order. What is the ${requestedIndex}${requestedIndex === 1 ? "st" : requestedIndex === 2 ? "nd" : requestedIndex === 3 ? "rd" : "th"} divisor?`;
      state = Object.freeze({
        integerValue: n.toString(),
        divisorCount: divisors.length,
        requestedIndex,
        positionClass: positionClass === 0 ? "FIRST" : positionClass === 1 ? "MIDDLE" : "LAST",
      });
      options = numericOptions(answer, correctIndex);
    } else if (prototypeId === "NUM-CP005-PROT-020") {
      const kinds = ["TOTAL_DIVISORS", "ODD_DIVISORS", "SQUARE_DIVISORS", "DIVISOR_SUM"] as const;
      const kind = kinds[(seed - 1) % kinds.length]!;
      const actual = propertyValue(kind, factors);
      const shouldBeTrue = seed % 2 === 0;
      const claimed = shouldBeTrue ? actual : actual + BigInt(1 + (seed % 3));
      const answer = actual === claimed ? "True" as const : "False" as const;
      let verifiedActual: bigint;
      if (kind === "TOTAL_DIVISORS") verifiedActual = BigInt(scanned.length);
      else if (kind === "ODD_DIVISORS") verifiedActual = BigInt(scanned.filter((divisor) => divisor % 2n !== 0n).length);
      else if (kind === "SQUARE_DIVISORS") verifiedActual = BigInt(scanned.filter((divisor) => {
        const root = BigInt(Math.floor(Math.sqrt(Number(divisor))));
        return root * root === divisor;
      }).length);
      else verifiedActual = scanned.reduce((sum, divisor) => sum + divisor, 0n);
      const verifiedAnswer = verifiedActual === claimed ? "True" : "False";
      canonical = answer;
      verifier = verifiedAnswer;
      stem = `For n = ${factorText(factors)}, consider the claim: “n has ${claimed} ${propertyLabel(kind)}.” Is the claim true?`;
      state = Object.freeze({
        integerValue: n.toString(),
        propertyKind: kind,
        propertyLabel: propertyLabel(kind),
        actualValue: actual.toString(),
        claimedValue: claimed.toString(),
        claimPolarity: answer,
      });
      options = claimOptions(answer, correctIndex);
    } else if (prototypeId === "NUM-CP005-PROT-021") {
      const pairs = divisors
        .filter((divisor) => divisor <= n / divisor)
        .map((divisor) => [divisor, n / divisor] as const);
      const pairIndex = rng.int(0, pairs.length - 1);
      const pair = pairs[pairIndex]!;
      const blankLeft = seed % 2 === 0;
      const visible = blankLeft ? pair[1] : pair[0];
      const answer = blankLeft ? pair[0] : pair[1];
      const verified = n / visible;
      canonical = answer.toString();
      verifier = verified.toString();
      const renderedRows = pairs.map(([left, right], index) =>
        index === pairIndex
          ? blankLeft ? `? × ${right}` : `${left} × ?`
          : `${left} × ${right}`);
      stem = `The following are divisor pairs of n = ${n}: ${renderedRows.join("; ")}. Find the missing entry.`;
      state = Object.freeze({
        integerValue: n.toString(),
        pairTable: renderedRows,
        pairIndex,
        blankSide: blankLeft ? "LEFT" : "RIGHT",
        visiblePartner: visible.toString(),
      });
      options = numericOptions(answer, correctIndex);
    } else {
      throw new Error(`Unhandled NUM-CP-005 Wave 03 prototype: ${prototypeId}`);
    }
  }

  if (canonical !== verifier) {
    throw new Error(`${prototypeId} seed ${seed}: canonical and verifier outputs differ.`);
  }

  const frozenFactors = Object.freeze(factors.map((factor) => Object.freeze({ ...factor })));
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic: semanticFor(prototypeId),
    representation: representationFor(prototypeId),
    stem,
    options: options!,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: Object.freeze({ factorState: frozenFactors, factorisation: factorText(factors), ...state }),
    mathematicalFingerprint: fingerprint(prototypeId, factors, state),
    explanation: explanationFor(prototypeId, canonical, state),
    sourceAncestry: Object.freeze([
      "NUM-CP005-WAVE01-DIVISOR-FOUNDATION",
      "NUM-CP005-WAVE02-AGGREGATE-INVERSE",
      "NUM-CP005-WAVE03-SOURCE-REPRESENTATION-DESIGN",
      "SSC-DIVISOR-SOURCE-REPRESENTATION-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId]),
    lifecycle: LIFECYCLE,
  });
}

export function generateNumCp005Wave03Sweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave03Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 03 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE03_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave03Package(prototypeId, index + 1)),
  ));
}
