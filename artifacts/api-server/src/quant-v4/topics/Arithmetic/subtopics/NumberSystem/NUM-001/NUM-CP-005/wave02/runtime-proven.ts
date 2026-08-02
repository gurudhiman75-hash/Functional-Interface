import type {
  NumCp005Difficulty,
  NumCp005Explanation,
  NumCp005Option,
  NumCp005PrimePower,
} from "../wave01/types";
import {
  generateNumCp005Wave02Package as generateBasePackage,
} from "./runtime";
import {
  NUM_CP005_WAVE02_PROTOTYPE_IDS,
  type NumCp005Wave02Package,
  type NumCp005Wave02PrototypeId,
} from "./types";

const SPECIAL_IDS = new Set<NumCp005Wave02PrototypeId>([
  "NUM-CP005-PROT-010",
  "NUM-CP005-PROT-011",
  "NUM-CP005-PROT-015",
]);
const PRIME_POOL = [2, 3, 5, 7, 11, 13] as const;
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

function band(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function indexOf(prototypeId: NumCp005Wave02PrototypeId): number {
  return NUM_CP005_WAVE02_PROTOTYPE_IDS.indexOf(prototypeId);
}

function factorText(factors: readonly NumCp005PrimePower[]): string {
  return factors.map(({ prime, exponent }) =>
    exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
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
  return divisors;
}

function comparePower(root: bigint, power: number, target: bigint): number {
  let value = 1n;
  for (let index = 0; index < power; index += 1) {
    value *= root;
    if (value > target) return 1;
  }
  return value === target ? 0 : -1;
}

function isPerfectPower(value: bigint, power: number): boolean {
  if (value === 1n) return true;
  let low = 2n;
  let high = value;
  while (low <= high) {
    const middle = (low + high) / 2n;
    const comparison = comparePower(middle, power, value);
    if (comparison === 0) return true;
    if (comparison < 0) low = middle + 1n;
    else high = middle - 1n;
  }
  return false;
}

function divisorCountByPairs(value: bigint): number {
  let count = 0;
  for (let divisor = 1n; divisor * divisor <= value; divisor += 1n) {
    if (value % divisor !== 0n) continue;
    count += divisor * divisor === value ? 1 : 2;
  }
  return count;
}

function buildOptions(answer: bigint, correctIndex: number): readonly NumCp005Option[] {
  const candidates = [answer + 1n, answer > 0n ? answer - 1n : 2n, answer + 2n, answer * 2n, answer + 3n];
  const wrongs: bigint[] = [];
  for (const candidate of candidates) {
    if (candidate >= 0n && candidate !== answer && !wrongs.includes(candidate)) wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  const traps = [
    ["NUM-CP005-TRAP-POWER-CHOICE", "This counts an exponent that is not a legal multiple of the required power."],
    ["NUM-CP005-TRAP-EXPONENT-OFFSET", "This forgets that p^a has a + 1 positive divisors."],
    ["NUM-CP005-TRAP-UNVERIFIED-INVERSE", "This accepts an inverse value without checking its exact divisor count."],
  ] as const;
  let wrongIndex = 0;
  return Object.freeze(Array.from({ length: 4 }, (_unused, optionIndex) => {
    if (optionIndex === correctIndex) {
      return Object.freeze({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches the canonical exponent rule and the bounded independent verifier.",
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

function explanation(
  prototypeId: NumCp005Wave02PrototypeId,
  factors: readonly NumCp005PrimePower[],
  answer: bigint,
  power: number | null,
  targetDivisorCount: number | null,
): NumCp005Explanation {
  if (prototypeId === "NUM-CP005-PROT-015") {
    return Object.freeze({
      coreConcept: "For a prime power p^a, the positive-divisor count is a + 1.",
      givenDataAndStrategy: "Subtract 1 from the stated divisor count, then raise the stated prime to that exponent.",
      stepByStep: Object.freeze([
        `The divisor count is ${targetDivisorCount}, so a = ${targetDivisorCount} - 1.`,
        `Evaluate the prime power to obtain ${answer}.`,
        "A factor-pair verifier confirms the exact divisor count.",
      ]),
      examSpeedMethod: "Prime power: exponent = divisor count - 1.",
      commonTraps: Object.freeze([
        "Do not use the divisor count itself as the exponent.",
        "Do not introduce another prime factor.",
        "Verify the reconstructed integer has exactly the stated count.",
      ]),
      finalAnswer: `The required integer is ${answer}.`,
    });
  }

  return Object.freeze({
    coreConcept: `A perfect ${power}-th-power divisor must use exponent multiples of ${power} for every prime.`,
    givenDataAndStrategy: `Read the exponents in ${factorText(factors)} and count the legal multiples independently.`,
    stepByStep: Object.freeze([
      `For each exponent a, the legal choices are 0, ${power}, 2${power}, ... up to a.`,
      `Each prime contributes floor(a/${power}) + 1 choices.`,
      `Multiplying those choices gives ${answer}.`,
    ]),
    examSpeedMethod: `Compute floor(a/${power}) + 1 for each prime exponent and multiply.`,
    commonTraps: Object.freeze([
      "Do not require the original number itself to be a perfect power.",
      "Do not count non-multiple exponents.",
      "Remember that divisor 1 corresponds to choosing exponent 0 everywhere.",
    ]),
    finalAnswer: `The required divisor count is ${answer}.`,
  });
}

function makePowerFactors(
  prototypeId: NumCp005Wave02PrototypeId,
  seed: number,
  difficulty: NumCp005Difficulty,
  rng: Rng,
  power: number,
): readonly NumCp005PrimePower[] {
  const count = difficulty === "HARD" ? 3 : 2;
  const selected: number[] = [];
  if ((seed + indexOf(prototypeId)) % 2 === 0) selected.push(2);
  while (selected.length < count) {
    const prime = rng.pick(PRIME_POOL);
    if (!selected.includes(prime)) selected.push(prime);
  }
  selected.sort((left, right) => left - right);
  return Object.freeze(selected.map((prime, factorIndex) => Object.freeze({
    prime,
    exponent: factorIndex === 0
      ? rng.int(power, power + (difficulty === "HARD" ? 3 : 1))
      : rng.int(1, difficulty === "EASY" ? 2 : 4),
  })));
}

function generateSpecial(
  prototypeId: NumCp005Wave02PrototypeId,
  seed: number,
): NumCp005Wave02Package {
  const difficulty = band(seed);
  const rng = new Rng(`PROVEN:${prototypeId}:${seed}`);
  const correctIndex = (seed + indexOf(prototypeId)) % 4;
  let factors: readonly NumCp005PrimePower[];
  let answer: bigint;
  let verifier: bigint;
  let stem: string;
  let state: Record<string, unknown>;
  let semantic: "DIVISOR_COUNT" | "INTEGER";
  let requiredPower: number | null = null;
  let targetCount: number | null = null;

  if (prototypeId === "NUM-CP005-PROT-015") {
    const prime = rng.pick(PRIME_POOL);
    const exponent = difficulty === "EASY" ? rng.int(1, 2)
      : difficulty === "MEDIUM" ? rng.int(2, 4) : rng.int(4, 6);
    targetCount = exponent + 1;
    answer = BigInt(prime) ** BigInt(exponent);
    const candidates: bigint[] = [];
    for (let candidateExponent = 0; candidateExponent <= 8; candidateExponent += 1) {
      const candidate = BigInt(prime) ** BigInt(candidateExponent);
      if (divisorCountByPairs(candidate) === targetCount) candidates.push(candidate);
    }
    if (candidates.length !== 1 || candidates[0] !== answer) {
      throw new Error("NUM-CP005 Wave 02 prime-power inverse is not uniquely verified.");
    }
    verifier = candidates[0];
    factors = Object.freeze([{ prime, exponent }]);
    stem = `A positive integer is a power of the prime ${prime} and has exactly ${targetCount} positive divisors. Find the integer.`;
    state = { prime, exponent, targetDivisorCount: targetCount, integerValue: answer.toString() };
    semantic = "INTEGER";
  } else {
    requiredPower = prototypeId === "NUM-CP005-PROT-010" ? 3 : seed % 2 === 0 ? 4 : 5;
    factors = makePowerFactors(prototypeId, seed, difficulty, rng, requiredPower);
    answer = factors.reduce(
      (count, factor) => count * BigInt(Math.floor(factor.exponent / requiredPower!) + 1),
      1n,
    );
    const divisors = enumerateDivisors(factors);
    verifier = BigInt(divisors.filter((divisor) => isPerfectPower(divisor, requiredPower!)).length);
    stem = prototypeId === "NUM-CP005-PROT-010"
      ? `If n = ${factorText(factors)}, how many positive divisors of n are perfect cubes?`
      : `For n = ${factorText(factors)}, find the number of positive divisors that are perfect ${requiredPower}-th powers.`;
    state = {
      integerValue: numberFromFactors(factors).toString(),
      power: requiredPower,
      divisorCount: divisors.length,
    };
    semantic = "DIVISOR_COUNT";
  }

  if (answer !== verifier) throw new Error(`${prototypeId} seed ${seed}: proven verifier mismatch.`);
  const frozenFactors = Object.freeze(factors.map((factor) => Object.freeze({ ...factor })));
  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic: semantic,
    stem,
    options: buildOptions(answer, correctIndex),
    correctIndex,
    canonicalAnswer: answer.toString(),
    verifierAnswer: verifier.toString(),
    hiddenState: Object.freeze({ factorState: frozenFactors, factorisation: factorText(factors), ...state }),
    mathematicalFingerprint: `${prototypeId}|${factorText(factors)}|${requiredPower ?? targetCount}|${answer}`,
    explanation: explanation(prototypeId, factors, answer, requiredPower, targetCount),
    sourceAncestry: Object.freeze([
      "NUM-CP005-WAVE01-DIVISOR-FOUNDATION",
      "NUM-CP005-WAVE02-AGGREGATE-INVERSE-DESIGN",
      "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
      "SSC-DIVISOR-AGGREGATE-INVERSE-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId]),
    lifecycle: LIFECYCLE,
  });
}

export function generateNumCp005Wave02ProvenPackage(
  prototypeId: NumCp005Wave02PrototypeId,
  seed: number,
): NumCp005Wave02Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("NUM-CP-005 Wave 02 seed must be a positive integer.");
  }
  return SPECIAL_IDS.has(prototypeId)
    ? generateSpecial(prototypeId, seed)
    : generateBasePackage(prototypeId, seed);
}

export function generateNumCp005Wave02ProvenSweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave02Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 02 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave02ProvenPackage(prototypeId, index + 1)),
  ));
}
