import {
  NUM_CP005_WAVE01_PROTOTYPE_IDS,
  type NumCp005AnswerSemantic,
  type NumCp005Difficulty,
  type NumCp005Explanation,
  type NumCp005Option,
  type NumCp005PrimePower,
  type NumCp005Wave01Package,
  type NumCp005Wave01PrototypeId,
} from "./types";

const PRIME_POOL = [2, 3, 5, 7, 11, 13, 17] as const;

const PROTOTYPE_TITLES: Record<NumCp005Wave01PrototypeId, string> = {
  "NUM-CP005-PROT-001": "total positive divisors",
  "NUM-CP005-PROT-002": "proper divisors",
  "NUM-CP005-PROT-003": "odd divisors",
  "NUM-CP005-PROT-004": "even divisors",
  "NUM-CP005-PROT-005": "divisors divisible by a stated divisor",
  "NUM-CP005-PROT-006": "perfect-square divisors",
  "NUM-CP005-PROT-007": "sum of positive divisors",
  "NUM-CP005-PROT-008": "missing prime exponent from divisor count",
};

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

class DeterministicRng {
  private state: number;

  constructor(seedText: string) {
    let state = 2166136261;
    for (let index = 0; index < seedText.length; index += 1) {
      state ^= seedText.charCodeAt(index);
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

function assertPositiveSeed(seed: number): void {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("NUM-CP-005 Wave 01 seed must be a positive integer.");
  }
}

function difficultyForSeed(seed: number): NumCp005Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!;
}

function prototypeIndex(prototypeId: NumCp005Wave01PrototypeId): number {
  return NUM_CP005_WAVE01_PROTOTYPE_IDS.indexOf(prototypeId);
}

function factorCountForDifficulty(difficulty: NumCp005Difficulty, seed: number): number {
  if (difficulty === "EASY") return seed % 4 === 0 ? 1 : 2;
  if (difficulty === "MEDIUM") return 2;
  return 3;
}

function exponentForDifficulty(
  rng: DeterministicRng,
  difficulty: NumCp005Difficulty,
): number {
  if (difficulty === "EASY") return rng.int(1, 2);
  if (difficulty === "MEDIUM") return rng.int(2, 3);
  return rng.int(2, 4);
}

function buildFactorState(
  prototypeId: NumCp005Wave01PrototypeId,
  seed: number,
  difficulty: NumCp005Difficulty,
  rng: DeterministicRng,
): readonly NumCp005PrimePower[] {
  if (prototypeId === "NUM-CP005-PROT-001" && seed % 97 === 0) {
    return Object.freeze([]);
  }

  if (prototypeId === "NUM-CP005-PROT-002" && seed % 89 === 0) {
    return Object.freeze([{ prime: rng.pick(PRIME_POOL), exponent: 1 }]);
  }

  const desiredCount = factorCountForDifficulty(difficulty, seed);
  const forceOdd = prototypeId === "NUM-CP005-PROT-004" && seed % 5 === 0;
  const candidates = PRIME_POOL.filter((prime) => !forceOdd || prime !== 2);
  const chosen: number[] = [];

  if (!forceOdd && (seed + prototypeIndex(prototypeId)) % 2 === 0) {
    chosen.push(2);
  }

  while (chosen.length < desiredCount) {
    const prime = rng.pick(candidates);
    if (!chosen.includes(prime)) chosen.push(prime);
  }

  chosen.sort((left, right) => left - right);
  return Object.freeze(chosen.map((prime, index) => {
    let exponent = exponentForDifficulty(rng, difficulty);
    if (prototypeId === "NUM-CP005-PROT-006" && index === 0 && seed % 4 === 0) {
      exponent = Math.max(2, exponent + (exponent % 2));
    }
    return Object.freeze({ prime, exponent });
  }));
}

function integerFromFactors(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (product, factor) => product * BigInt(factor.prime) ** BigInt(factor.exponent),
    1n,
  );
}

function factorisationText(factors: readonly NumCp005PrimePower[]): string {
  if (factors.length === 0) return "1";
  return factors
    .map(({ prime, exponent }) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`)
    .join(" × ");
}

function enumerateDivisors(factors: readonly NumCp005PrimePower[]): bigint[] {
  let divisors = [1n];
  for (const { prime, exponent } of factors) {
    const additions: bigint[] = [];
    let primePower = 1n;
    for (let power = 1; power <= exponent; power += 1) {
      primePower *= BigInt(prime);
      for (const divisor of divisors) additions.push(divisor * primePower);
    }
    divisors = [...divisors, ...additions];
  }
  return divisors.sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
}

function totalDivisorFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((count, factor) => count * BigInt(factor.exponent + 1), 1n);
}

function oddDivisorFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (count, factor) => count * BigInt(factor.prime === 2 ? 1 : factor.exponent + 1),
    1n,
  );
}

function squareDivisorFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce(
    (count, factor) => count * BigInt(Math.floor(factor.exponent / 2) + 1),
    1n,
  );
}

function divisorSumFormula(factors: readonly NumCp005PrimePower[]): bigint {
  return factors.reduce((sum, factor) => {
    let localSum = 0n;
    let power = 1n;
    for (let exponent = 0; exponent <= factor.exponent; exponent += 1) {
      localSum += power;
      power *= BigInt(factor.prime);
    }
    return sum * localSum;
  }, 1n);
}

function constrainedDivisorState(
  factors: readonly NumCp005PrimePower[],
  rng: DeterministicRng,
): readonly NumCp005PrimePower[] {
  if (factors.length === 0) return Object.freeze([]);
  const requirements = factors.map((factor) => ({
    prime: factor.prime,
    exponent: rng.int(0, factor.exponent),
  }));
  if (requirements.every((factor) => factor.exponent === 0)) {
    const index = rng.int(0, requirements.length - 1);
    requirements[index] = {
      ...requirements[index]!,
      exponent: 1,
    };
  }
  return Object.freeze(requirements.map((factor) => Object.freeze(factor)));
}

function constrainedCountFormula(
  factors: readonly NumCp005PrimePower[],
  requirements: readonly NumCp005PrimePower[],
): bigint {
  return factors.reduce((count, factor) => {
    const required = requirements.find((entry) => entry.prime === factor.prime)?.exponent ?? 0;
    return count * BigInt(factor.exponent - required + 1);
  }, 1n);
}

function semanticForPrototype(
  prototypeId: NumCp005Wave01PrototypeId,
): NumCp005AnswerSemantic {
  if (prototypeId === "NUM-CP005-PROT-007") return "DIVISOR_SUM";
  if (prototypeId === "NUM-CP005-PROT-008") return "PRIME_EXPONENT";
  return "DIVISOR_COUNT";
}

function buildWrongValues(answer: bigint): bigint[] {
  const candidates = [
    answer + 1n,
    answer > 0n ? answer - 1n : 2n,
    answer + 2n,
    answer * 2n,
    answer + 3n,
    answer > 2n ? answer - 2n : 4n,
  ];
  const result: bigint[] = [];
  for (const candidate of candidates) {
    if (candidate >= 0n && candidate !== answer && !result.includes(candidate)) {
      result.push(candidate);
    }
    if (result.length === 3) break;
  }
  return result;
}

function optionAnalysis(
  prototypeId: NumCp005Wave01PrototypeId,
  misconceptionIndex: number,
): { id: string; text: string } {
  const shared = [
    {
      id: "NUM-CP005-TRAP-ADD-EXPONENTS",
      text: "This treats exponent choices additively instead of multiplying independent choices.",
    },
    {
      id: "NUM-CP005-TRAP-ENDPOINT",
      text: "This misses or adds one divisor by handling 1, n, or a condition boundary incorrectly.",
    },
    {
      id: "NUM-CP005-TRAP-CONDITION-IGNORED",
      text: "This counts the unrestricted divisor set instead of applying the requested restriction.",
    },
  ];
  if (prototypeId === "NUM-CP005-PROT-007") {
    shared[0] = {
      id: "NUM-CP005-TRAP-COUNT-FOR-SUM",
      text: "This uses the number of divisors where the sum of their values is required.",
    };
  }
  if (prototypeId === "NUM-CP005-PROT-008") {
    shared[0] = {
      id: "NUM-CP005-TRAP-EXPONENT-OFFSET",
      text: "This forgets that exponent a contributes a + 1 divisor choices.",
    };
  }
  return shared[misconceptionIndex]!;
}

function buildOptions(
  prototypeId: NumCp005Wave01PrototypeId,
  answer: bigint,
  correctIndex: number,
): readonly NumCp005Option[] {
  const wrongValues = buildWrongValues(answer);
  const options: NumCp005Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        value: answer.toString(),
        isCorrect: true,
        misconceptionId: null,
        analysis: "This matches the exact canonical and independently verified result.",
      }));
    } else {
      const misconception = optionAnalysis(prototypeId, wrongIndex);
      options.push(Object.freeze({
        value: wrongValues[wrongIndex]!.toString(),
        isCorrect: false,
        misconceptionId: misconception.id,
        analysis: misconception.text,
      }));
      wrongIndex += 1;
    }
  }
  return Object.freeze(options);
}

function divisorChoiceProductText(factors: readonly NumCp005PrimePower[]): string {
  if (factors.length === 0) return "1";
  return factors.map((factor) => `(${factor.exponent} + 1)`).join(" × ");
}

function explanationFor(
  prototypeId: NumCp005Wave01PrototypeId,
  factors: readonly NumCp005PrimePower[],
  answer: bigint,
  extra: Readonly<Record<string, unknown>>,
): NumCp005Explanation {
  const factorText = factorisationText(factors);
  const baseSteps = [
    `Write the governed prime-power state: n = ${factorText}.`,
    `Each divisor chooses an exponent independently within the allowed range.`,
  ];
  let concept = "A divisor is formed by independently choosing an exponent for every prime factor.";
  let strategy = `Use the exponent-choice structure of ${factorText}, then apply the requested restriction.`;
  let steps: string[] = [...baseSteps];
  let speed = "Work directly from the prime exponents; do not list divisors unless checking the result.";

  switch (prototypeId) {
    case "NUM-CP005-PROT-001":
      steps.push(`Total choices = ${divisorChoiceProductText(factors)} = ${answer}.`);
      break;
    case "NUM-CP005-PROT-002":
      steps.push(`First count all divisors: ${divisorChoiceProductText(factors)}.`);
      steps.push(`Exclude n itself, so proper divisors = d(n) - 1 = ${answer}.`);
      speed = "Count all divisors first and subtract exactly one for the number itself.";
      break;
    case "NUM-CP005-PROT-003":
      steps.push("For an odd divisor, the exponent of 2 must be 0.");
      steps.push(`Multiply the remaining exponent choices to get ${answer}.`);
      speed = "Delete the 2-power choice; keep every odd-prime exponent choice unchanged.";
      break;
    case "NUM-CP005-PROT-004":
      steps.push("Count all divisors and subtract the odd divisors.");
      steps.push(`Even divisors = d(n) - odd divisors = ${answer}.`);
      speed = "If n is odd, the answer is immediately 0; otherwise use total minus odd.";
      break;
    case "NUM-CP005-PROT-005": {
      const requirementText = String(extra.requirementFactorisation);
      steps.push(`A required divisor must include at least the exponents in k = ${requirementText}.`);
      steps.push(`Count only the remaining legal exponent choices: ${answer}.`);
      speed = "For each prime, use a - b + 1 choices when the divisor must contain p^b.";
      break;
    }
    case "NUM-CP005-PROT-006":
      steps.push("A square divisor uses only even exponents.");
      steps.push(`For p^a there are floor(a/2) + 1 even-exponent choices; their product is ${answer}.`);
      speed = "Halve each exponent with floor, add 1, then multiply.";
      break;
    case "NUM-CP005-PROT-007":
      concept = "The divisor sum is the product of the independent geometric sums for each prime power.";
      steps.push("For every p^a, form 1 + p + p^2 + ... + p^a.");
      steps.push(`Multiply those geometric sums to obtain ${answer}.`);
      speed = "Use the geometric factor for each prime power; never substitute the divisor-count formula.";
      break;
    case "NUM-CP005-PROT-008":
      concept = "An exponent a contributes exactly a + 1 choices to the divisor count.";
      strategy = "Divide out the known exponent-choice factors, then subtract 1 from the remaining choice count.";
      steps = [
        `The stated divisor count is ${String(extra.targetDivisorCount)}.`,
        `The known prime powers contribute ${String(extra.knownChoiceProduct)} choices.`,
        `Therefore x + 1 = ${String(extra.hiddenChoiceCount)}, so x = ${answer}.`,
      ];
      speed = "Isolate x + 1 rather than x; the extra one represents choosing exponent 0.";
      break;
  }

  return Object.freeze({
    coreConcept: concept,
    givenDataAndStrategy: strategy,
    stepByStep: Object.freeze(steps),
    examSpeedMethod: speed,
    commonTraps: Object.freeze([
      "Do not add exponent choices that are independent.",
      "Read whether 1, n, odd/even status, or another condition changes the allowed exponent range.",
      "Use a separate enumeration only as a verifier, not as a replacement for the governed rule.",
    ]),
    finalAnswer: `The required ${PROTOTYPE_TITLES[prototypeId]} result is ${answer}.`,
  });
}

function fingerprint(
  prototypeId: NumCp005Wave01PrototypeId,
  factors: readonly NumCp005PrimePower[],
  extra: Readonly<Record<string, unknown>>,
): string {
  const factorPart = factors.map(({ prime, exponent }) => `${prime}^${exponent}`).join("*") || "1";
  const extraPart = Object.entries(extra)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("|");
  return `${prototypeId}|${factorPart}|${extraPart}`;
}

function buildInversePackageState(
  seed: number,
  difficulty: NumCp005Difficulty,
  rng: DeterministicRng,
) {
  const hiddenPrime = difficulty === "EASY" ? 2 : rng.pick([2, 3, 5] as const);
  const hiddenExponent = difficulty === "EASY"
    ? 1 + (seed % 3)
    : difficulty === "MEDIUM"
      ? 2 + (seed % 4)
      : 3 + (seed % 5);
  const knownPrimePool = PRIME_POOL.filter((prime) => prime !== hiddenPrime);
  const knownCount = difficulty === "HARD" ? 2 : 1;
  const knownFactors: NumCp005PrimePower[] = [];
  while (knownFactors.length < knownCount) {
    const prime = rng.pick(knownPrimePool);
    if (knownFactors.some((factor) => factor.prime === prime)) continue;
    knownFactors.push({
      prime,
      exponent: difficulty === "EASY" ? 1 : rng.int(1, difficulty === "MEDIUM" ? 3 : 4),
    });
  }
  knownFactors.sort((left, right) => left.prime - right.prime);
  const knownChoiceProduct = totalDivisorFormula(knownFactors);
  const targetDivisorCount = knownChoiceProduct * BigInt(hiddenExponent + 1);
  const allFactors = [
    { prime: hiddenPrime, exponent: hiddenExponent },
    ...knownFactors,
  ].sort((left, right) => left.prime - right.prime);
  const candidates = Array.from({ length: 11 }, (_unused, exponent) => exponent)
    .filter((exponent) => knownChoiceProduct * BigInt(exponent + 1) === targetDivisorCount);
  if (candidates.length !== 1 || candidates[0] !== hiddenExponent) {
    throw new Error("NUM-CP-005 inverse exponent state is not uniquely reconstructible.");
  }
  return {
    factors: Object.freeze(allFactors.map((factor) => Object.freeze(factor))),
    hiddenPrime,
    hiddenExponent,
    knownFactors: Object.freeze(knownFactors.map((factor) => Object.freeze(factor))),
    knownChoiceProduct,
    targetDivisorCount,
    verifierAnswer: BigInt(candidates[0]),
  };
}

export function generateNumCp005Wave01Package(
  prototypeId: NumCp005Wave01PrototypeId,
  seed: number,
): NumCp005Wave01Package {
  assertPositiveSeed(seed);
  if (!NUM_CP005_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown NUM-CP-005 Wave 01 prototype: ${prototypeId}`);
  }

  const difficulty = difficultyForSeed(seed);
  const rng = new DeterministicRng(`${prototypeId}:${seed}`);
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  let factors: readonly NumCp005PrimePower[];
  let canonicalAnswer: bigint;
  let verifierAnswer: bigint;
  let stem: string;
  let extra: Readonly<Record<string, unknown>> = Object.freeze({});

  if (prototypeId === "NUM-CP005-PROT-008") {
    const inverse = buildInversePackageState(seed, difficulty, rng);
    factors = inverse.factors;
    canonicalAnswer = BigInt(inverse.hiddenExponent);
    verifierAnswer = inverse.verifierAnswer;
    const knownText = inverse.knownFactors
      .map(({ prime, exponent }) => exponent === 1 ? `${prime}` : `${prime}^${exponent}`)
      .join(" × ");
    stem = `If n = ${inverse.hiddenPrime}^x × ${knownText} has exactly ${inverse.targetDivisorCount} positive divisors, find x.`;
    extra = Object.freeze({
      hiddenPrime: inverse.hiddenPrime,
      targetDivisorCount: inverse.targetDivisorCount.toString(),
      knownChoiceProduct: inverse.knownChoiceProduct.toString(),
      hiddenChoiceCount: (inverse.targetDivisorCount / inverse.knownChoiceProduct).toString(),
    });
  } else {
    factors = buildFactorState(prototypeId, seed, difficulty, rng);
    const divisors = enumerateDivisors(factors);
    const n = integerFromFactors(factors);
    const factorText = factorisationText(factors);

    switch (prototypeId) {
      case "NUM-CP005-PROT-001":
        canonicalAnswer = totalDivisorFormula(factors);
        verifierAnswer = BigInt(divisors.length);
        stem = `The prime factorisation of n is ${factorText}. How many positive divisors does n have?`;
        break;
      case "NUM-CP005-PROT-002":
        canonicalAnswer = totalDivisorFormula(factors) - 1n;
        verifierAnswer = BigInt(divisors.filter((divisor) => divisor !== n).length);
        stem = `Given n = ${factorText}, find the number of proper positive divisors of n.`;
        break;
      case "NUM-CP005-PROT-003":
        canonicalAnswer = oddDivisorFormula(factors);
        verifierAnswer = BigInt(divisors.filter((divisor) => divisor % 2n !== 0n).length);
        stem = `If n = ${factorText}, how many positive divisors of n are odd?`;
        break;
      case "NUM-CP005-PROT-004":
        canonicalAnswer = totalDivisorFormula(factors) - oddDivisorFormula(factors);
        verifierAnswer = BigInt(divisors.filter((divisor) => divisor % 2n === 0n).length);
        stem = `For n = ${factorText}, determine the number of even positive divisors.`;
        break;
      case "NUM-CP005-PROT-005": {
        const requirements = constrainedDivisorState(factors, rng);
        const requiredValue = integerFromFactors(requirements);
        canonicalAnswer = constrainedCountFormula(factors, requirements);
        verifierAnswer = BigInt(divisors.filter((divisor) => divisor % requiredValue === 0n).length);
        const requirementFactorisation = factorisationText(requirements.filter((factor) => factor.exponent > 0));
        stem = `Let n = ${factorText}. How many positive divisors of n are divisible by k = ${requirementFactorisation}?`;
        extra = Object.freeze({
          requirementFactorisation,
          requirementValue: requiredValue.toString(),
        });
        break;
      }
      case "NUM-CP005-PROT-006":
        canonicalAnswer = squareDivisorFormula(factors);
        verifierAnswer = BigInt(divisors.filter((divisor) => {
          const root = BigInt(Math.floor(Math.sqrt(Number(divisor))));
          return root * root === divisor || (root + 1n) * (root + 1n) === divisor;
        }).length);
        stem = `The number n has prime factorisation ${factorText}. How many divisors of n are perfect squares?`;
        break;
      case "NUM-CP005-PROT-007":
        canonicalAnswer = divisorSumFormula(factors);
        verifierAnswer = divisors.reduce((sum, divisor) => sum + divisor, 0n);
        stem = `If n = ${factorText}, find the sum of all positive divisors of n.`;
        break;
      default:
        throw new Error(`Unhandled NUM-CP-005 Wave 01 prototype: ${prototypeId}`);
    }

    extra = Object.freeze({
      ...extra,
      integerValue: n.toString(),
      divisorCount: divisors.length,
    });
  }

  if (canonicalAnswer !== verifierAnswer) {
    throw new Error(`${prototypeId} seed ${seed}: canonical and verifier answers differ.`);
  }

  const options = buildOptions(prototypeId, canonicalAnswer, correctIndex);
  const factorState = Object.freeze(factors.map((factor) => Object.freeze({ ...factor })));

  return Object.freeze({
    packageId: "NUM-001",
    checkpointId: "NUM-CP-005",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic: semanticForPrototype(prototypeId),
    stem,
    options,
    correctIndex,
    canonicalAnswer: canonicalAnswer.toString(),
    verifierAnswer: verifierAnswer.toString(),
    hiddenState: Object.freeze({
      factorState,
      factorisation: factorisationText(factors),
      ...extra,
    }),
    mathematicalFingerprint: fingerprint(prototypeId, factors, extra),
    explanation: explanationFor(prototypeId, factors, canonicalAnswer, extra),
    sourceAncestry: Object.freeze([
      "NUMBER-SYSTEM-COMPLETE-CHECKPOINT-DESIGN",
      "NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL",
      "NUM-CP-004-PRIME-FACTORISATION-AUTHORITY",
      "SSC-DIVISOR-FUNCTION-SOURCE-FAMILY",
    ]),
    prototypeAncestry: Object.freeze([prototypeId]),
    lifecycle: LIFECYCLE,
  });
}

export function generateNumCp005Wave01Sweep(
  seedsPerPrototype: number,
): readonly NumCp005Wave01Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("NUM-CP-005 Wave 01 sweep size must be a positive integer.");
  }
  return Object.freeze(NUM_CP005_WAVE01_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_unused, index) =>
      generateNumCp005Wave01Package(prototypeId, index + 1)),
  ));
}
