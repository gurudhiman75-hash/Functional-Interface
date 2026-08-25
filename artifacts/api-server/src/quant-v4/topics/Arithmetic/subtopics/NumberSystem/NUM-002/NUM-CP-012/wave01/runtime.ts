import { createHash } from "node:crypto";

import type {
  NumCp012Difficulty,
  NumCp012Option,
  NumCp012Wave01Package,
  NumCp012Wave01PrototypeId,
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

interface OptionDefinition {
  readonly value: string;
  readonly misconceptionId: string;
}

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }, (_key, value) => typeof value === "bigint" ? value.toString() : value))
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

function numericOptions(correct: bigint, distractors: readonly { value: bigint; misconceptionId: string }[], rng: Rng) {
  const definitions: OptionDefinition[] = [{ value: correct.toString(), misconceptionId: "CORRECT" }];
  for (const distractor of distractors) {
    if (distractor.value >= 0n && !definitions.some((item) => item.value === distractor.value.toString())) {
      definitions.push({ value: distractor.value.toString(), misconceptionId: distractor.misconceptionId });
    }
    if (definitions.length === 4) break;
  }
  let delta = 1n;
  while (definitions.length < 4) {
    for (const candidate of [correct + delta, correct >= delta ? correct - delta : 0n]) {
      const value = candidate.toString();
      if (!definitions.some((item) => item.value === value)) {
        definitions.push({ value, misconceptionId: "NEARBY_VALUE" });
      }
      if (definitions.length === 4) break;
    }
    delta += 1n;
  }
  return definitions;
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp012Wave01PrototypeId;
  seed: number;
  difficulty: NumCp012Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  canonicalAnswer: string;
  verifierAnswer: string;
  optionDefinitions: readonly OptionDefinition[];
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp012Wave01Package {
  if (input.optionDefinitions.length !== 4) throw new Error(`${input.prototypeId}: expected four options`);
  const optionRng = new Rng(input.seed * 32452843 + Number(input.prototypeId.slice(-3)));
  const options = Object.freeze(shuffle(input.optionDefinitions, optionRng).map((definition) => Object.freeze({
    value: definition.value,
    isCorrect: definition.value === input.canonicalAnswer,
    misconceptionId: definition.misconceptionId,
  } satisfies NumCp012Option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${input.prototypeId}: correct answer missing from options`);

  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-012",
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

function powBig(base: bigint, exponent: number) {
  return base ** BigInt(exponent);
}

function factorize(value: bigint) {
  if (value < 1n) throw new Error("Wave01 factorisation expects a positive integer");
  let remaining = value;
  const factors: Array<readonly [bigint, number]> = [];
  let prime = 2n;
  while (prime * prime <= remaining) {
    if (remaining % prime !== 0n) {
      prime += 1n;
      continue;
    }
    let exponent = 0;
    while (remaining % prime === 0n) {
      exponent += 1;
      remaining /= prime;
    }
    factors.push([prime, exponent] as const);
    prime += 1n;
  }
  if (remaining > 1n) factors.push([remaining, 1] as const);
  return factors;
}

function factorizationText(factors: readonly (readonly [bigint, number])[]) {
  return factors.map(([prime, exponent]) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`).join(" × ");
}

function productFromFactors(factors: readonly (readonly [bigint, number])[]) {
  return factors.reduce((product, [prime, exponent]) => product * powBig(prime, exponent), 1n);
}

function isPerfectKByFactors(value: bigint, k: number) {
  if (value === 0n || value === 1n) return true;
  return factorize(value).every(([, exponent]) => exponent % k === 0);
}

function comparePow(base: bigint, exponent: number, target: bigint) {
  const value = powBig(base, exponent);
  return value < target ? -1 : value > target ? 1 : 0;
}

function floorKthRoot(value: bigint, k: number) {
  if (value < 0n) throw new Error("floorKthRoot expects non-negative value");
  if (value <= 1n) return value;
  let low = 0n;
  let high = 1n;
  while (powBig(high, k) <= value) high *= 2n;
  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (powBig(mid, k) <= value) low = mid;
    else high = mid;
  }
  return low;
}

function exactKthRoot(value: bigint, k: number): bigint | null {
  if (value < 0n) {
    if (k % 2 === 0) return null;
    const root = exactKthRoot(-value, k);
    return root === null ? null : -root;
  }
  const root = floorKthRoot(value, k);
  return powBig(root, k) === value ? root : null;
}

function perfectPowerLabel(k: number) {
  if (k === 2) return "perfect square";
  if (k === 3) return "perfect cube";
  return `perfect ${k}th power`;
}

function kthRootLabel(k: number) {
  if (k === 2) return "square root";
  if (k === 3) return "cube root";
  return `${k}th root`;
}

function p001(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 79 + 1);
  const k = rng.pick([2, 3, 4] as const);
  const root = BigInt(rng.int(3, k === 4 ? 9 : 18));
  const perfect = powBig(root, k);
  const candidates: bigint[] = [perfect];
  let offset = 1n;
  while (candidates.length < 4) {
    const candidate = perfect + offset;
    if (!isPerfectKByFactors(candidate, k)) candidates.push(candidate);
    offset += 1n;
  }
  const canonical = candidates.find((candidate) => isPerfectKByFactors(candidate, k))!;
  const verified = candidates.find((candidate) => exactKthRoot(candidate, k) !== null)!;
  const optionDefinitions = candidates.map((value) => ({
    value: value.toString(),
    misconceptionId: value === canonical ? "CORRECT" : "NEARBY_NON_PERFECT_POWER",
  }));
  const factors = factorize(perfect);

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-001",
    seed,
    difficulty: k >= 4 ? "MEDIUM" : "EASY",
    answerSemantic: "PERFECT_POWER_IDENTIFICATION",
    representation: "FOUR_INTEGER_SELECTION",
    stem: `Which of the following numbers is a ${perfectPowerLabel(k)}?`,
    canonicalAnswer: canonical.toString(),
    verifierAnswer: verified.toString(),
    optionDefinitions,
    state: { k, root: root.toString(), perfect: perfect.toString(), factors, candidates: candidates.map(String) },
    concept: `A positive integer is a ${perfectPowerLabel(k)} when every prime exponent in its factorisation is divisible by ${k}.`,
    strategy: "Check the prime-exponent pattern of each candidate; a nearby numerical value is irrelevant unless all exponents satisfy the required divisibility.",
    steps: [
      `${perfect} = ${factorizationText(factors)} and every displayed exponent is divisible by ${k}.`,
      `The other candidates fail the exact ${k}th-power test, so ${perfect} is the required number.`,
    ],
    sourceAncestry: ["DESIGN:PERFECT_POWER_RECOGNITION", "V2:ns_perfect_square_completion", "V2:ns_perfect_cube_completion"],
  });
}

function p002(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 83 + 2);
  const k = rng.pick([2, 3, 4] as const);
  const root = BigInt(rng.int(2, k === 4 ? 12 : 25));
  const value = powBig(root, k);
  const verifiedRoot = exactKthRoot(value, k);
  if (verifiedRoot === null) throw new Error("Exact-root verifier unexpectedly failed");

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-002",
    seed,
    difficulty: k === 4 ? "MEDIUM" : "EASY",
    answerSemantic: "EXACT_INTEGER_ROOT",
    representation: "DIRECT_PERFECT_POWER_ROOT",
    stem: `Find the exact integer ${kthRootLabel(k)} of ${value}.`,
    canonicalAnswer: root.toString(),
    verifierAnswer: verifiedRoot.toString(),
    optionDefinitions: numericOptions(root, [
      { value: root + 1n, misconceptionId: "ROOT_ONE_TOO_LARGE" },
      { value: root - 1n, misconceptionId: "ROOT_ONE_TOO_SMALL" },
      { value: root * BigInt(k), misconceptionId: "MULTIPLY_ROOT_BY_POWER" },
    ], rng),
    state: { k, root: root.toString(), value: value.toString() },
    concept: `An exact integer ${kthRootLabel(k)} is the integer whose ${k}th power equals the given number exactly.`,
    strategy: "Use exact integer-power structure rather than a decimal approximation, then verify by raising the candidate root back to the declared power.",
    steps: [
      `${root}^${k} = ${value}.`,
      `Therefore the exact integer ${kthRootLabel(k)} is ${root}.`,
    ],
    sourceAncestry: ["DESIGN:EXACT_INTEGER_ROOT", "DESIGN:PERFECT_POWER_RECOGNITION"],
  });
}

function completionFactors(seed: number, k: number) {
  const rng = new Rng(seed);
  const primes = [2n, 3n, 5n] as const;
  const alreadyPerfect = seed % 5 === 0;
  return primes.map((prime, index) => {
    const quotient = rng.int(1, 2);
    const residue = alreadyPerfect ? 0 : index === 0 ? rng.int(1, k - 1) : rng.int(0, k - 1);
    return [prime, quotient * k + residue] as const;
  });
}

function p003(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 89 + 3);
  const k = rng.pick([2, 3, 4] as const);
  const factors = completionFactors(seed * 97 + k, k);
  const value = productFromFactors(factors);
  const multiplierFactors = factors
    .map(([prime, exponent]) => [prime, (k - (exponent % k)) % k] as const)
    .filter(([, exponent]) => exponent > 0);
  const correct = productFromFactors(multiplierFactors);
  const verifierProduct = value * correct;
  const verifier = exactKthRoot(verifierProduct, k) !== null ? correct : -1n;
  const residueProduct = productFromFactors(
    factors.map(([prime, exponent]) => [prime, exponent % k] as const).filter(([, exponent]) => exponent > 0),
  );

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-003",
    seed,
    difficulty: k >= 3 ? "MEDIUM" : "EASY",
    answerSemantic: "LEAST_PERFECT_POWER_MULTIPLIER",
    representation: "PRIME_EXPONENT_COMPLETION",
    stem: `What is the least positive integer by which ${value} must be multiplied to make the product a ${perfectPowerLabel(k)}?`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: verifier.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: residueProduct, misconceptionId: "MULTIPLY_BY_EXISTING_RESIDUES" },
      { value: BigInt(k), misconceptionId: "USE_POWER_AS_MULTIPLIER" },
      { value: correct * 2n, misconceptionId: "NON_MINIMAL_COMPLETION" },
    ], rng),
    state: { k, value: value.toString(), factors, multiplierFactors, correct: correct.toString() },
    concept: `To make an integer a ${perfectPowerLabel(k)}, each prime exponent must become a multiple of ${k}.`,
    strategy: `For each exponent, find its remainder modulo ${k} and add only the complementary exponent needed to reach the next multiple of ${k}.`,
    steps: [
      ...factors.map(([prime, exponent]) => `For prime ${prime}, exponent ${exponent} needs ${((k - exponent % k) % k)} more factor(s) to reach a multiple of ${k}.`),
      `Multiplying those missing prime factors gives the least multiplier ${correct}.`,
    ],
    sourceAncestry: ["V2:ns_perfect_square_completion", "V2:ns_perfect_cube_completion", "V2:ns_least_square_multiple", "V2:ns_least_cube_multiple"],
  });
}

function p004(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 97 + 4);
  const k = rng.pick([2, 3, 4] as const);
  const factors = completionFactors(seed * 101 + k + 1, k);
  const value = productFromFactors(factors);
  const divisorFactors = factors
    .map(([prime, exponent]) => [prime, exponent % k] as const)
    .filter(([, exponent]) => exponent > 0);
  const correct = productFromFactors(divisorFactors);
  const quotient = value / correct;
  const verifier = value % correct === 0n && exactKthRoot(quotient, k) !== null ? correct : -1n;
  const complementProduct = productFromFactors(
    factors.map(([prime, exponent]) => [prime, (k - exponent % k) % k] as const).filter(([, exponent]) => exponent > 0),
  );

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-004",
    seed,
    difficulty: k >= 3 ? "MEDIUM" : "EASY",
    answerSemantic: "LEAST_PERFECT_POWER_DIVISOR",
    representation: "PRIME_EXPONENT_REDUCTION",
    stem: `What is the least positive integer by which ${value} must be divided so that the quotient is a ${perfectPowerLabel(k)}?`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: verifier.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: complementProduct, misconceptionId: "USE_MULTIPLIER_COMPLEMENT_FOR_DIVISOR" },
      { value: BigInt(k), misconceptionId: "USE_POWER_AS_DIVISOR" },
      { value: correct * 2n, misconceptionId: "REMOVE_EXTRA_FACTOR" },
    ], rng),
    state: { k, value: value.toString(), factors, divisorFactors, quotient: quotient.toString(), correct: correct.toString() },
    concept: `For division-based completion, remove each exponent's remainder modulo ${k}; what remains must have every exponent divisible by ${k}.`,
    strategy: "Do not use the multiplier complement. For a least divisor, remove exactly the residue already present in each prime exponent.",
    steps: [
      ...factors.map(([prime, exponent]) => `Prime ${prime} has exponent ${exponent}; remove ${exponent % k} copy/copies of ${prime}.`),
      `The product of the removed prime factors is ${correct}, and the quotient is an exact ${k}th power.`,
    ],
    sourceAncestry: ["DESIGN:LEAST_PERFECT_POWER_DIVISOR", "V2:ns_square_factor_constraint", "V2:ns_cube_factor_constraint"],
  });
}

function p005(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 101 + 5);
  const k = rng.pick([2, 3, 4] as const);
  const prime = rng.pick([2n, 3n, 5n, 7n] as const);
  const target = k * rng.int(2, 5);
  const leftGap = rng.int(1, k - 1);
  const rightGap = rng.int(0, k - 1);
  const low = target - leftGap;
  const high = target + rightGap;
  const fixedPrime = prime === 2n ? 3n : 2n;
  const fixedExponent = k * rng.int(1, 3);
  const valid: number[] = [];
  for (let x = low; x <= high; x += 1) {
    const candidate = powBig(fixedPrime, fixedExponent) * powBig(prime, x);
    if (exactKthRoot(candidate, k) !== null) valid.push(x);
  }
  if (valid.length !== 1) throw new Error(`Missing-exponent fixture must have one solution, got ${valid}`);
  const correct = BigInt(valid[0]!);

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-005",
    seed,
    difficulty: k >= 3 ? "MEDIUM" : "EASY",
    answerSemantic: "MISSING_PRIME_EXPONENT",
    representation: "BOUNDED_EXPONENT_RECONSTRUCTION",
    stem: `The number ${fixedPrime}^${fixedExponent} × ${prime}^x is a ${perfectPowerLabel(k)}. If ${low} ≤ x ≤ ${high}, find x.`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: correct.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: BigInt(low), misconceptionId: "CHOOSE_LOWER_BOUND" },
      { value: BigInt(high), misconceptionId: "CHOOSE_UPPER_BOUND" },
      { value: BigInt(target + k), misconceptionId: "NEXT_MULTIPLE_OUTSIDE_UNIQUENESS" },
    ], rng),
    state: { k, prime: prime.toString(), fixedPrime: fixedPrime.toString(), fixedExponent, low, high, target, valid },
    concept: `For the whole integer to be a ${perfectPowerLabel(k)}, every prime exponent—including x—must be divisible by ${k}.`,
    strategy: `Inspect only the multiples of ${k} inside the declared interval for x, then verify the resulting factorisation is an exact ${k}th power.`,
    steps: [
      `The fixed exponent ${fixedExponent} is already divisible by ${k}.`,
      `Within ${low} ≤ x ≤ ${high}, the only exponent divisible by ${k} is ${target}.`,
      `Therefore x = ${target}.`,
    ],
    sourceAncestry: ["DESIGN:MISSING_PRIME_EXPONENT", "V2:ns_square_factor_constraint", "V2:ns_cube_factor_constraint"],
  });
}

function p006(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 103 + 6);
  const k = rng.pick([2, 3] as const);
  const factors = ([2n, 3n, 5n] as const).map((prime) => [prime, rng.int(1, 6)] as const);
  const value = productFromFactors(factors);
  const divisorFactors = factors
    .map(([prime, exponent]) => [prime, Math.floor(exponent / k) * k] as const)
    .filter(([, exponent]) => exponent > 0);
  const correct = productFromFactors(divisorFactors);

  let verifier = 1n;
  const maxRoot = floorKthRoot(value, k);
  for (let root = 1n; root <= maxRoot; root += 1n) {
    const candidate = powBig(root, k);
    if (value % candidate === 0n && candidate > verifier) verifier = candidate;
  }
  const wrongRoundUpFactors = factors.map(([prime, exponent]) =>
    [prime, Math.ceil(exponent / k) * k] as const);
  const wrongRoundUp = productFromFactors(wrongRoundUpFactors);

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-006",
    seed,
    difficulty: "HARD",
    answerSemantic: "GREATEST_PERFECT_POWER_DIVISOR",
    representation: "EXPONENT_FLOORING",
    stem: `Find the greatest divisor of ${value} that is a ${perfectPowerLabel(k)}.`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: verifier.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: wrongRoundUp, misconceptionId: "ROUND_EXPONENTS_UP_INSTEAD_OF_DOWN" },
      { value: floorKthRoot(value, k), misconceptionId: "RETURN_ROOT_INSTEAD_OF_DIVISOR" },
      { value: value / correct, misconceptionId: "RETURN_REMOVED_COFACTOR" },
    ], rng),
    state: { k, value: value.toString(), factors, divisorFactors, correct: correct.toString() },
    concept: `A ${perfectPowerLabel(k)} divisor can use only prime exponents that are multiples of ${k}; to make it greatest, take the largest such exponent not exceeding each exponent in the original number.`,
    strategy: `Round each prime exponent down to the nearest multiple of ${k}, keep those prime powers, and multiply them.`,
    steps: [
      ...factors.map(([prime, exponent]) => `${prime}^${exponent} contributes exponent ${Math.floor(exponent / k) * k} to the greatest ${perfectPowerLabel(k)} divisor.`),
      `Multiplying the retained prime powers gives ${correct}.`,
    ],
    sourceAncestry: ["DESIGN:GREATEST_PERFECT_POWER_DIVISOR", "V2:ns_square_factor_constraint", "V2:ns_cube_factor_constraint"],
  });
}

function p007(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 107 + 7);
  const k = rng.pick([2, 3] as const);
  const low = BigInt(rng.int(1, 180));
  const high = low + BigInt(rng.int(80, 360));
  const highRoot = floorKthRoot(high, k);
  const lowFloorRoot = floorKthRoot(low, k);
  const firstRoot = powBig(lowFloorRoot, k) >= low ? lowFloorRoot : lowFloorRoot + 1n;
  const correct = highRoot >= firstRoot ? highRoot - firstRoot + 1n : 0n;

  let verifier = 0n;
  for (let value = low; value <= high; value += 1n) {
    if (exactKthRoot(value, k) !== null) verifier += 1n;
  }

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-007",
    seed,
    difficulty: k === 3 ? "MEDIUM" : "EASY",
    answerSemantic: "PERFECT_POWER_COUNT_IN_INTERVAL",
    representation: "CLOSED_INTERVAL_COUNT",
    stem: `How many ${k === 2 ? "perfect squares" : "perfect cubes"} lie in the closed interval from ${low} to ${high}?`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: verifier.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: highRoot - lowFloorRoot, misconceptionId: "OPEN_LEFT_BOUNDARY_COUNT" },
      { value: correct + 1n, misconceptionId: "OFF_BY_ONE_COUNT" },
      { value: correct > 0n ? correct - 1n : 1n, misconceptionId: "MISS_BOUNDARY_POWER" },
    ], rng),
    state: { k, low: low.toString(), high: high.toString(), firstRoot: firstRoot.toString(), highRoot: highRoot.toString(), correct: correct.toString() },
    concept: `Counting ${k === 2 ? "squares" : "cubes"} in an interval is equivalent to counting the integer roots whose ${k}th powers fall between the two inclusive boundaries.`,
    strategy: "Find the first integer root whose power is at least the lower bound and the last integer root whose power is at most the upper bound, then count those roots inclusively.",
    steps: [
      `The first admissible root is ${firstRoot} and the last is ${highRoot}.`,
      `The inclusive root count is ${highRoot} − ${firstRoot} + 1 = ${correct}.`,
    ],
    sourceAncestry: ["DESIGN:PERFECT_POWER_RANGE_COUNT", "SOURCE_GAP:RANGE_BOUNDARY"],
  });
}

function p008(seed: number): NumCp012Wave01Package {
  const rng = new Rng(seed * 109 + 8);
  const k = rng.pick([2, 3] as const);
  const direction = seed % 2 === 0 ? "ADD" : "SUBTRACT";
  const forceComplete = seed % 5 === 0;
  const baseRoot = BigInt(rng.int(3, k === 2 ? 24 : 10));
  const exact = powBig(baseRoot, k);
  const n = forceComplete ? exact : exact + BigInt(rng.int(1, k === 2 ? 2 * Number(baseRoot) : 12));

  let correct: bigint;
  let boundary: bigint;
  if (direction === "ADD") {
    const floorRoot = floorKthRoot(n, k);
    const ceilRoot = powBig(floorRoot, k) === n ? floorRoot : floorRoot + 1n;
    boundary = powBig(ceilRoot, k);
    correct = boundary - n;
  } else {
    const floorRoot = floorKthRoot(n, k);
    boundary = powBig(floorRoot, k);
    correct = n - boundary;
  }

  let verifier = 0n;
  while (true) {
    const candidate = direction === "ADD" ? n + verifier : n - verifier;
    if (candidate >= 0n && exactKthRoot(candidate, k) !== null) break;
    verifier += 1n;
  }

  return packageFrom({
    prototypeId: "NUM-CP012-PROT-008",
    seed,
    difficulty: k === 3 ? "MEDIUM" : "EASY",
    answerSemantic: direction === "ADD" ? "LEAST_ADDITION_TO_PERFECT_POWER" : "LEAST_SUBTRACTION_TO_PERFECT_POWER",
    representation: direction === "ADD" ? "NEXT_POWER_BOUNDARY" : "PREVIOUS_POWER_BOUNDARY",
    stem: direction === "ADD"
      ? `What is the least non-negative integer that must be added to ${n} to obtain a ${perfectPowerLabel(k)}?`
      : `What is the least non-negative integer that must be subtracted from ${n} to obtain a ${perfectPowerLabel(k)}?`,
    canonicalAnswer: correct.toString(),
    verifierAnswer: verifier.toString(),
    optionDefinitions: numericOptions(correct, [
      { value: boundary, misconceptionId: "RETURN_TARGET_POWER_INSTEAD_OF_DIFFERENCE" },
      { value: correct + 1n, misconceptionId: "OFF_BY_ONE_COMPLETION" },
      { value: correct > 0n ? correct - 1n : 1n, misconceptionId: "STOP_BEFORE_POWER_BOUNDARY" },
    ], rng),
    state: { k, direction, forceComplete, n: n.toString(), boundary: boundary.toString(), correct: correct.toString() },
    concept: `Additive perfect-power completion is a boundary problem: move to the nearest allowed ${direction === "ADD" ? "not-smaller" : "not-greater"} exact ${k}th power.`,
    strategy: `Locate the ${direction === "ADD" ? "next" : "previous"} exact ${perfectPowerLabel(k)} boundary and take the numerical difference. Zero is valid when the starting number already satisfies the target class.`,
    steps: [
      `The relevant exact power boundary is ${boundary}.`,
      `${direction === "ADD" ? `${boundary} − ${n}` : `${n} − ${boundary}`} = ${correct}.`,
    ],
    sourceAncestry: ["DESIGN:ADDITIVE_PERFECT_POWER_COMPLETION", "V2:ns_minimum_addition", "V2:ns_minimum_subtraction"],
  });
}

export function generateNumCp012Wave01(
  prototypeId: NumCp012Wave01PrototypeId,
  seed: number,
): NumCp012Wave01Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 01 seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP012-PROT-001": return p001(seed);
    case "NUM-CP012-PROT-002": return p002(seed);
    case "NUM-CP012-PROT-003": return p003(seed);
    case "NUM-CP012-PROT-004": return p004(seed);
    case "NUM-CP012-PROT-005": return p005(seed);
    case "NUM-CP012-PROT-006": return p006(seed);
    case "NUM-CP012-PROT-007": return p007(seed);
    case "NUM-CP012-PROT-008": return p008(seed);
  }
}
