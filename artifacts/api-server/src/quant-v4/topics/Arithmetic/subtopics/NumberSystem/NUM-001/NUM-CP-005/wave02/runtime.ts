import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";
import {
  NUM_CP005_WAVE02_PROTOTYPE_IDS,
  type NumCp005Wave02AnswerSemantic,
  type NumCp005Wave02Package,
  type NumCp005Wave02PrototypeId,
} from "./types";

const PRIME_POOL = [2, 3, 5, 7, 11, 13] as const;
const LEAST_NUMBER_TARGETS = [4, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24] as const;

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
    throw new Error("NUM-CP-005 Wave 02 seed must be a positive integer.");
  }
}

function difficulty(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: NumCp005Wave02PrototypeId): number {
  return NUM_CP005_WAVE02_PROTOTYPE_IDS.indexOf(prototypeId);
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

function enumerateDivisorsFromFactors(factors: readonly NumCp005PrimePower[]): bigint[] {
  let divisors = [1n];
  for (const { prime, exponent } of factors) {
    const base = BigInt(prime);
    const additions: bigint[] = [];
    let power = 1n;
    for (let exponentIndex = 1; exponentIndex <= exponent; exponentIndex += 1) {
      power *= base;
      for (const divisor of divisors) additions.push(divisor * power);
    }
    divisors = [...divisors, ...additions];
  }
  return divisors.sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function enumerateDivisorsByIntegerScan(n: bigint): bigint[] {
  const result: bigint[] = [];
  for (let candidate = 1n; candidate <= n; candidate += 1n) {
    if (n % candidate === 0n) result.push(candidate);
  }
  return result;
}

function divisorCountFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((count, factor) => count * BigInt(factor.exponent + 1), 1n);
}

function divisorSumFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((product, factor) => {
    let local = 0n;
    let power = 1n;
    for (let index = 0; index <= factor.exponent; index += 1) {
      local += power;
      power *= BigInt(factor.prime);
    }
    return product * local;
  }, 1n);
}

function perfectPowerDivisorCount(
  factors: readonly NumCp005PrimePower[],
  power: number,
): bigint {
  return factors.reduce(
    (count, factor) => count * BigInt(Math.floor(factor.exponent / power) + 1),
    1n,
  );
}

function isPerfectPower(value: bigint, power: number): boolean {
  if (value === 1n) return true;
  for (let root = 2n; root ** BigInt(power) <= value; root += 1n) {
    if (root ** BigInt(power) === value) return true;
  }
  return false;
}

function integerSqrt(value: bigint): bigint {
  if (value < 0n) throw new Error("Cannot take square root of a negative integer.");
  if (value < 2n) return value;
  let left = 1n;
  let right = value;
  while (left <= right) {
    const middle = (left + right) / 2n;
    const square = middle * middle;
    if (square === value) return middle;
    if (square < value) left = middle + 1n;
    else right = middle - 1n;
  }
  return right;
}

function divisorProductFormula(
  factors: readonly NumCp005PrimePower[],
  n: bigint,
): bigint {
  const divisorCount = divisorCountFormula(factors);
  if (divisorCount % 2n === 0n) {
    return n ** (divisorCount / 2n);
  }
  const root = integerSqrt(n);
  if (root * root !== n) {
    throw new Error("Odd divisor count requires a perfect-square integer state.");
  }
  return n ** ((divisorCount - 1n) / 2n) * root;
}

function makeFactors(
  prototypeId: NumCp005Wave02PrototypeId,
  seed: number,
  band: NumCp005Difficulty,
  rng: Rng,
): readonly NumCp005PrimePower[] {
  if (prototypeId === "NUM-CP005-PROT-014") {
    const count = band === "HARD" ? 2 : 1 + (seed % 2);
    const selected: number[] = [];
    while (selected.length < count) {
      const prime = rng.pick([2, 3, 5, 7] as const);
      if (!selected.includes(prime)) selected.push(prime);
    }
    selected.sort((left, right) => left - right);
    return Object.freeze(selected.map((prime) => Object.freeze({
      prime,
      exponent: rng.int(1, band === "EASY" ? 2 : 3),
    })));
  }

  const count = band === "EASY" ? 2 : band === "MEDIUM" ? 2 : 3;
  const selected: number[] = [];
  if ((seed + prototypeIndex(prototypeId)) % 2 === 0) selected.push(2);
  while (selected.length < count) {
    const prime = rng.pick(PRIME_POOL);
    if (!selected.includes(prime)) selected.push(prime);
  }
  selected.sort((left, right) => left - right);

  return Object.freeze(selected.map((prime, index) => {
    let exponent = band === "EASY" ? rng.int(1, 2)
      : band === "MEDIUM" ? rng.int(2, 3)
        : rng.int(2, 4);
    if (prototypeId === "NUM-CP005-PROT-010" && index === 0) {
      exponent = rng.int(3, band === "HARD" ? 6 : 4);
    }
    if (prototypeId === "NUM-CP005-PROT-011" && index === 0) {
      exponent = rng.int(4, band === "HARD" ? 7 : 5);
    }
    if (prototypeId === "NUM-CP005-PROT-013" && seed % 4 === 0) {
      exponent = Math.max(2, exponent + (exponent % 2));
    }
    return Object.freeze({ prime, exponent });
  }));
}

function requirementState(
  factors: readonly NumCp005PrimePower[],
  rng: Rng,
): readonly NumCp005PrimePower[] {
  const requirements = factors.map((factor) => ({
    prime: factor.prime,
    exponent: rng.int(0, factor.exponent),
  }));
  if (requirements.every((entry) => entry.exponent === 0)) {
    requirements[0] = { ...requirements[0]!, exponent: 1 };
  }
  return Object.freeze(requirements.map((entry) => Object.freeze(entry)));
}

function divisibleCount(
  factors: readonly NumCp005PrimePower[],
  requirements: readonly NumCp005PrimePower[],
): bigint {
  return factors.reduce((count, factor) => {
    const minimum = requirements.find((entry) => entry.prime === factor.prime)?.exponent ?? 0;
    return count * BigInt(factor.exponent - minimum + 1);
  }, 1n);
}

function divisorCountByPairs(value: number): number {
  let count = 0;
  for (let divisor = 1; divisor * divisor <= value; divisor += 1) {
    if (value % divisor !== 0) continue;
    count += divisor * divisor === value ? 1 : 2;
  }
  return count;
}

function leastNumberWithDivisorCount(target: number): bigint {
  let best: bigint | null = null;
  const primes = [2n, 3n, 5n, 7n, 11n, 13n];

  function search(
    primeIndex: number,
    maximumExponent: number,
    remainingChoices: number,
    current: bigint,
  ): void {
    if (remainingChoices === 1) {
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
      search(
        primeIndex + 1,
        exponent,
        remainingChoices / (exponent + 1),
        next,
      );
    }
  }

  search(0, target - 1, target, 1n);
  if (best === null) throw new Error(`No least-number construction found for divisor count ${target}.`);
  return best;
}

function verifyLeastNumber(target: number, candidate: bigint): bigint {
  const numericCandidate = Number(candidate);
  if (!Number.isSafeInteger(numericCandidate)) {
    throw new Error("Least-number verifier candidate exceeds the safe bounded scan.");
  }
  for (let value = 1; value <= numericCandidate; value += 1) {
    if (divisorCountByPairs(value) === target) return BigInt(value);
  }
  throw new Error(`No bounded verifier solution found for divisor count ${target}.`);
}

function factorInteger(value: bigint): readonly NumCp005PrimePower[] {
  let remaining = value;
  const factors: NumCp005PrimePower[] = [];
  for (const prime of PRIME_POOL) {
    let exponent = 0;
    while (remaining % BigInt(prime) === 0n) {
      remaining /= BigInt(prime);
      exponent += 1;
    }
    if (exponent > 0) factors.push({ prime, exponent });
  }
  if (remaining > 1n) factors.push({ prime: Number(remaining), exponent: 1 });
  return Object.freeze(factors.map((entry) => Object.freeze(entry)));
}

function answerSemantic(prototypeId: NumCp005Wave02PrototypeId): NumCp005Wave02AnswerSemantic {
  switch (prototypeId) {
    case "NUM-CP005-PROT-012": return "DIVISOR_SUM";
    case "NUM-CP005-PROT-013": return "DIVISOR_PRODUCT";
    case "NUM-CP005-PROT-014": return "DIVISOR_SET";
    case "NUM-CP005-PROT-015":
    case "NUM-CP005-PROT-016": return "INTEGER";
    default: return "DIVISOR_COUNT";
  }
}

function numericOptions(answer: bigint, correctIndex: number): readonly NumCp005Option[] {
  const candidatePool = [
    answer + 1n,
    answer > 0n ? answer - 1n : 2n,
    answer + 2n,
    answer * 2n,
    answer + 3n,
  ];
  const wrongValues: bigint[] = [];
  for (const value of candidatePool) {
    if (value >= 0n && value !== answer && !wrongValues.includes(value)) wrongValues.push(value);
    if (wrongValues.length === 3) break;
  }
  const traps = [
    ["NUM-CP005-TRAP-FORMULA-SWAP", "This applies a related divisor formula to the wrong requested output."],
    ["NUM-CP005-TRAP-BOUNDARY", "This mishandles a complement, proper-divisor, pairing, or exponent boundary."],
    ["NUM-CP005-TRAP-INVERSE-FIRST-HIT", "This accepts a candidate without proving the exact or least inverse condition."],
  ] as const;
  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    if (index === correctIndex) {
      return Object.freeze({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This is the exact canonical result and matches the independent verifier.",
      });
    }
    const trap = traps[wrongIndex]!;
    const option = Object.freeze({
      value: wrongValues[wrongIndex]!.toString(),
      isCorrect: false,
      misconceptionId: trap[0],
      analysis: trap[1],
    });
    wrongIndex += 1;
    return option;
  }));
}

function setText(values: readonly bigint[]): string {
  return `{${values.map(String).join(", ")}}`;
}

function setOptions(
  divisors: readonly bigint[],
  n: bigint,
  correctIndex: number,
): readonly NumCp005Option[] {
  const correct = setText(divisors);
  const withoutOne = setText(divisors.filter((value) => value !== 1n));
  const withoutNumber = setText(divisors.filter((value) => value !== n));
  const withNonDivisor = setText([...divisors, n + 1n]);
  const wrongs = [
    [withoutOne, "NUM-CP005-TRAP-OMIT-ONE", "This omits 1, which is a positive divisor of every positive integer."],
    [withoutNumber, "NUM-CP005-TRAP-OMIT-N", "This omits the number itself from the complete positive-divisor set."],
    [withNonDivisor, "NUM-CP005-TRAP-ADD-NONDIVISOR", "This includes a value that does not divide the number exactly."],
  ] as const;
  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, index) => {
    if (index === correctIndex) {
      return Object.freeze({
        value: correct,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This is the complete independently verified positive-divisor set.",
      });
    }
    const wrong = wrongs[wrongIndex]!;
    wrongIndex += 1;
    return Object.freeze({
      value: wrong[0],
      isCorrect: false,
      misconceptionId: wrong[1],
      analysis: wrong[2],
    });
  }));
}

function explanation(
  prototypeId: NumCp005Wave02PrototypeId,
  factorisation: string,
  answer: string,
  state: Readonly<Record<string, unknown>>,
): NumCp005Explanation {
  let coreConcept = "Prime-exponent choices describe the complete positive-divisor structure.";
  let strategy = `Use the exact factorisation ${factorisation}, then apply the requested aggregate or inverse condition.`;
  let steps: string[] = [];
  let speed = "Work from exponent choices first and use explicit divisor construction only as a check.";

  switch (prototypeId) {
    case "NUM-CP005-PROT-009":
      steps = [
        `Count all positive divisors: ${String(state.totalDivisorCount)}.`,
        `Count divisors divisible by k: ${String(state.divisibleByKCount)}.`,
        `Subtract to get ${answer} divisors not divisible by k.`,
      ];
      speed = "Use complement counting: total minus divisible by k.";
      break;
    case "NUM-CP005-PROT-010":
      steps = [
        "A cube divisor requires every selected exponent to be a multiple of 3.",
        `Multiply floor(a/3) + 1 across the prime powers to get ${answer}.`,
      ];
      speed = "Divide each exponent by 3 with floor, add 1, then multiply.";
      break;
    case "NUM-CP005-PROT-011":
      steps = [
        `The required divisor must be a perfect ${String(state.power)}-th power.`,
        `Multiply floor(a/${String(state.power)}) + 1 across all prime powers to get ${answer}.`,
      ];
      speed = `Keep only exponent multiples of ${String(state.power)}.`;
      break;
    case "NUM-CP005-PROT-012":
      steps = [
        `Find the sum of all positive divisors: ${String(state.allDivisorSum)}.`,
        `Remove n = ${String(state.integerValue)} itself.`,
        `The proper-divisor sum is ${answer}.`,
      ];
      speed = "Use sigma(n) - n; do not subtract 1.";
      break;
    case "NUM-CP005-PROT-013":
      coreConcept = "Positive divisors pair to the number n; a perfect square has one unpaired square-root divisor.";
      steps = [
        `The number is n = ${String(state.integerValue)} and has ${String(state.divisorCount)} positive divisors.`,
        `Apply exact divisor pairing, including the square-root boundary when needed.`,
        `The product is ${answer}.`,
      ];
      speed = "Use n^(d/2) for even d; for odd d, pair all but the square-root divisor.";
      break;
    case "NUM-CP005-PROT-014":
      steps = [
        "Choose every legal exponent combination from the prime factorisation.",
        "Multiply each combination and sort the resulting values.",
        `The complete set is ${answer}.`,
      ];
      speed = "Build the set systematically from exponent choices so 1 and n cannot be missed.";
      break;
    case "NUM-CP005-PROT-015":
      coreConcept = "For a prime power p^a, the divisor count is exactly a + 1.";
      steps = [
        `The stated divisor count is ${String(state.targetDivisorCount)}, so a = ${String(state.exponent)}.`,
        `Raise the stated prime to that exponent: ${String(state.prime)}^${String(state.exponent)} = ${answer}.`,
        "Direct enumeration confirms the divisor count.",
      ];
      speed = "For a prime power, subtract 1 from the divisor count to obtain the exponent.";
      break;
    case "NUM-CP005-PROT-016":
      coreConcept = "The least number uses larger exponents on smaller primes and a non-increasing exponent pattern.";
      strategy = "Factor the required divisor count into exponent-choice factors and minimise the resulting prime-power product.";
      steps = [
        `Required divisor count: ${String(state.targetDivisorCount)}.`,
        `The minimum exponent pattern found is ${String(state.exponentPattern)}.`,
        `Assign it to ascending primes to obtain the least number ${answer}.`,
        "A separate bounded scan confirms that no smaller positive integer has the same divisor count.",
      ];
      speed = "Put the largest exponent on 2, the next on 3, and continue in non-increasing order.";
      break;
  }

  return Object.freeze({
    coreConcept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze(steps),
    examSpeedMethod: speed,
    commonTraps: Object.freeze([
      "Do not exchange count, sum, product and set formulas.",
      "Do not ignore the divisor 1, the number itself, or an exact complement boundary.",
      "For inverse tasks, prove uniqueness or minimality instead of accepting the first plausible value.",
    ]),
    finalAnswer: `The required result is ${answer}.`,
  });
}

function exponentPattern(factors: readonly NumCp005PrimePower[]): string {
  return factors.map((factor) => factor.exponent).join(", ");
}

function fingerprint(
  prototypeId: NumCp005Wave02PrototypeId,
  factors: readonly NumCp005PrimePower[],
  state: Readonly<Record<string, unknown>>,
): string {
  const factorPart = factors.map(({ prime, exponent }) => `${prime}^${exponent}`).join("*") || "1";
  const statePart = Object.entries(state)
    .filter(([key]) => !["integerValue", "divisorCount"].includes(key))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`).join("|");
  return `${prototypeId}|${factorPart}|${statePart}`;
}

export function generateNumCp005Wave02Package(
  prototypeId: NumCp005Wave02PrototypeId,
  seed: number,
): NumCp005Wave02Package {
  assertSeed(seed);
  if (!NUM_CP005_WAVE02_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown NUM-CP-005 Wave 02 prototype: ${prototypeId}`);
  }

  const band = difficulty(seed);
  const rng = new Rng(`${prototypeId}:${seed}`);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  let factors: readonly NumCp005PrimePower[] = Object.freeze([]);
  let stem = "";
  let canonical = "";
  let verifier = "";
  let state: Readonly<Record<string, unknown>> = Object.freeze({});
  let options: readonly NumCp005Option[];

  if (prototypeId === "NUM-CP005-PROT-015") {
    const prime = rng.pick(PRIME_POOL);
    const exponent = band === "EASY" ? rng.int(1, 2)
      : band === "MEDIUM" ? rng.int(2, 4) : rng.int(4, 6);
    const targetDivisorCount = exponent + 1;
    const answer = BigInt(prime) ** BigInt(exponent);
    const candidates: bigint[] = [];
    let power = 1n;
    for (let candidateExponent = 0; candidateExponent <= 8; candidateExponent += 1) {
      if (candidateExponent > 0) power *= BigInt(prime);
      if (enumerateDivisorsByIntegerScan(power).length === targetDivisorCount) candidates.push(power);
    }
    if (candidates.length !== 1 || candidates[0] !== answer) {
      throw new Error("Prime-power inverse state is not uniquely verified.");
    }
    factors = Object.freeze([{ prime, exponent }]);
    canonical = answer.toString();
    verifier = candidates[0].toString();
    stem = `A positive integer is a power of the prime ${prime} and has exactly ${targetDivisorCount} positive divisors. Find the integer.`;
    state = Object.freeze({ prime, exponent, targetDivisorCount, integerValue: canonical });
    options = numericOptions(answer, correctIndex);
  } else if (prototypeId === "NUM-CP005-PROT-016") {
    const targetDivisorCount = LEAST_NUMBER_TARGETS[(seed - 1) % LEAST_NUMBER_TARGETS.length]!;
    const answer = leastNumberWithDivisorCount(targetDivisorCount);
    const verified = verifyLeastNumber(targetDivisorCount, answer);
    factors = factorInteger(answer);
    canonical = answer.toString();
    verifier = verified.toString();
    stem = `What is the least positive integer having exactly ${targetDivisorCount} positive divisors?`;
    state = Object.freeze({
      targetDivisorCount,
      exponentPattern: exponentPattern(factors),
      integerValue: canonical,
    });
    options = numericOptions(answer, correctIndex);
  } else {
    factors = makeFactors(prototypeId, seed, band, rng);
    const n = numberFromFactors(factors);
    const divisors = enumerateDivisorsFromFactors(factors);
    const factorisation = factorText(factors);
    let answer: bigint;
    let verified: bigint;

    switch (prototypeId) {
      case "NUM-CP005-PROT-009": {
        const requirements = requirementState(factors, rng);
        const k = numberFromFactors(requirements);
        const divisibleByKCount = divisibleCount(factors, requirements);
        const totalDivisorCount = divisorCountFormula(factors);
        answer = totalDivisorCount - divisibleByKCount;
        verified = BigInt(divisors.filter((divisor) => divisor % k !== 0n).length);
        const requirementFactorisation = factorText(requirements.filter((entry) => entry.exponent > 0));
        stem = `Let n = ${factorisation}. How many positive divisors of n are not divisible by k = ${requirementFactorisation}?`;
        state = Object.freeze({
          integerValue: n.toString(),
          totalDivisorCount: totalDivisorCount.toString(),
          divisibleByKCount: divisibleByKCount.toString(),
          requirementFactorisation,
          requirementValue: k.toString(),
        });
        break;
      }
      case "NUM-CP005-PROT-010":
        answer = perfectPowerDivisorCount(factors, 3);
        verified = BigInt(divisors.filter((divisor) => isPerfectPower(divisor, 3)).length);
        stem = `If n = ${factorisation}, how many positive divisors of n are perfect cubes?`;
        state = Object.freeze({ integerValue: n.toString(), power: 3, divisorCount: divisors.length });
        break;
      case "NUM-CP005-PROT-011": {
        const power = seed % 2 === 0 ? 4 : 5;
        answer = perfectPowerDivisorCount(factors, power);
        verified = BigInt(divisors.filter((divisor) => isPerfectPower(divisor, power)).length);
        stem = `For n = ${factorisation}, find the number of positive divisors that are perfect ${power}-th powers.`;
        state = Object.freeze({ integerValue: n.toString(), power, divisorCount: divisors.length });
        break;
      }
      case "NUM-CP005-PROT-012":
        answer = divisorSumFormula(factors) - n;
        verified = divisors.filter((divisor) => divisor !== n)
          .reduce((sum, divisor) => sum + divisor, 0n);
        stem = `The prime factorisation of n is ${factorisation}. Find the sum of all proper positive divisors of n.`;
        state = Object.freeze({
          integerValue: n.toString(),
          allDivisorSum: divisorSumFormula(factors).toString(),
          divisorCount: divisors.length,
        });
        break;
      case "NUM-CP005-PROT-013":
        answer = divisorProductFormula(factors, n);
        verified = divisors.reduce((product, divisor) => product * divisor, 1n);
        stem = `If n = ${factorisation}, determine the product of all positive divisors of n.`;
        state = Object.freeze({
          integerValue: n.toString(),
          divisorCount: divisors.length,
          perfectSquareState: integerSqrt(n) ** 2n === n,
        });
        break;
      case "NUM-CP005-PROT-014": {
        const scanned = enumerateDivisorsByIntegerScan(n);
        canonical = setText(divisors);
        verifier = setText(scanned);
        stem = `The positive integer n has prime factorisation ${factorisation}. Select the complete set of its positive divisors.`;
        state = Object.freeze({ integerValue: n.toString(), divisorCount: divisors.length });
        options = setOptions(divisors, n, correctIndex);
        answer = 0n;
        verified = 0n;
        break;
      }
      default:
        throw new Error(`Unhandled Wave 02 prototype: ${prototypeId}`);
    }

    if (prototypeId !== "NUM-CP005-PROT-014") {
      canonical = answer!.toString();
      verifier = verified!.toString();
      options = numericOptions(answer!, correctIndex);
    }
  }

  if (canonical !== verifier) {
    throw new Error(`${prototypeId} seed ${seed}: canonical and verifier outputs differ.`);
  }

  const frozenFactors = Object.freeze(factors.map((entry) => Object.freeze({ ...entry })));
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty: band,
    answerSemantic: answerSemantic(prototypeId),
    stem,
    options: options!,
    correctIndex,
    canonicalAnswer: canonical,
    verifierAnswer: verifier,
    hiddenState: Object.freeze({ factorState: frozenFactors, factorisation: factorText(factors), ...state }),
    mathematicalFingerprint: fingerprint(prototypeId, factors, state),
    explanation: explanation(prototypeId, factorText(factors), canonical, state),
    sourceAncestry: Object.freeze([
      "NUM-CP005-WAVE01-DIVISOR-FOUNDATION",
      "NUMBER-SYSTEM-COMPLETE-CHECKPOINT-DESIGN",
      "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
      "SSC-DIVISOR-AGGREGATE-INVERSE-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId]),
    lifecycle: LIFECYCLE,
  });
}

export function generateNumCp005Wave02Sweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave02Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 02 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave02Package(prototypeId, index + 1)),
  ));
}
