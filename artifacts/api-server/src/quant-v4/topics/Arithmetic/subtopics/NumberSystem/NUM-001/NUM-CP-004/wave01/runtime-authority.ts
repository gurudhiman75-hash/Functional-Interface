import {
  generateNumCp004Wave01Package as generateReviewedPackage,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime-reviewed";
import type {
  CoprimeClass,
  NumCp004Difficulty,
  NumCp004Option,
  NumCp004Wave01Package,
  NumCp004Wave01PrototypeId,
} from "./types";

const FACTOR_STATE_PROTOTYPES = new Set<NumCp004Wave01PrototypeId>([
  "NUM-CP004-PROT-004",
  "NUM-CP004-PROT-005",
  "NUM-CP004-PROT-006",
]);

function gcd(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function gcdByEnumeration(values: readonly number[]): number {
  const upper = Math.min(...values.map(Math.abs));
  for (let candidate = upper; candidate >= 1; candidate -= 1) {
    if (values.every((value) => value % candidate === 0)) return candidate;
  }
  return 1;
}

function classifyCanonical(values: readonly [number, number, number]): CoprimeClass {
  const pairwise = gcd(values[0], values[1]) === 1
    && gcd(values[0], values[2]) === 1
    && gcd(values[1], values[2]) === 1;
  const collective = gcd(gcd(values[0], values[1]), values[2]) === 1;
  if (pairwise && collective) return "PAIRWISE_AND_COLLECTIVELY_COPRIME";
  if (!pairwise && collective) return "COLLECTIVELY_BUT_NOT_PAIRWISE";
  if (pairwise && !collective) return "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME";
  return "NOT_COLLECTIVELY_COPRIME";
}

function classifyVerifier(values: readonly [number, number, number]): CoprimeClass {
  const pairwise = gcdByEnumeration([values[0], values[1]]) === 1
    && gcdByEnumeration([values[0], values[2]]) === 1
    && gcdByEnumeration([values[1], values[2]]) === 1;
  const collective = gcdByEnumeration(values) === 1;
  if (pairwise && collective) return "PAIRWISE_AND_COLLECTIVELY_COPRIME";
  if (!pairwise && collective) return "COLLECTIVELY_BUT_NOT_PAIRWISE";
  if (pairwise && !collective) return "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME";
  return "NOT_COLLECTIVELY_COPRIME";
}

function shuffle<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  let state = (seed ^ 0x50434f34) >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(next() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function variedTriple(seed: number): {
  values: [number, number, number];
  topology: "PAIRWISE" | "COLLECTIVE_ONLY" | "NOT_COLLECTIVE";
  difficulty: NumCp004Difficulty;
} {
  const tier = (seed - 1) % 3;
  const category = Math.floor((seed - 1) / 3) % 3;
  const cycle = Math.floor((seed - 1) / 9);
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[tier]!;

  if (category === 0) {
    const m = 5 + cycle * 5 + tier;
    return {
      values: [m, m + 1, 2 * m + 1],
      topology: "PAIRWISE",
      difficulty,
    };
  }

  if (category === 1) {
    const m = 3 + cycle * 4 + tier;
    return {
      values: [2 * m, 2 * (m + 1), 2 * m + 1],
      topology: "COLLECTIVE_ONLY",
      difficulty,
    };
  }

  const commonFactor = ([2, 3, 5] as const)[tier]!;
  const m = 3 + cycle * 4;
  return {
    values: [commonFactor * m, commonFactor * (m + 1), commonFactor * (m + 2)],
    topology: "NOT_COLLECTIVE",
    difficulty,
  };
}

function generateVariedTriple(seed: number): NumCp004Wave01Package {
  const base = generateReviewedPackage("NUM-CP004-PROT-008", seed);
  const { values, topology, difficulty } = variedTriple(seed);
  const canonicalAnswer = classifyCanonical(values);
  const verifierAnswer = classifyVerifier(values);
  const labels: readonly CoprimeClass[] = [
    "PAIRWISE_AND_COLLECTIVELY_COPRIME",
    "COLLECTIVELY_BUT_NOT_PAIRWISE",
    "NOT_COLLECTIVELY_COPRIME",
    "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME",
  ];
  const options = shuffle<NumCp004Option>(
    labels.map((label) => ({
      value: label,
      isCorrect: label === canonicalAnswer,
      ...(label === canonicalAnswer
        ? {}
        : {
            misconceptionId: label === "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME"
              ? "PAIRWISE_BUT_NOT_COLLECTIVE_IMPOSSIBLE_CLASS"
              : "COLLECTIVE_CONFUSED_WITH_PAIRWISE",
          }),
    })),
    seed,
  );
  const pairGcds = [
    gcd(values[0], values[1]),
    gcd(values[0], values[2]),
    gcd(values[1], values[2]),
  ];
  const globalGcd = gcd(gcd(values[0], values[1]), values[2]);

  return {
    ...base,
    seed,
    difficulty,
    stem: `Classify the triple (${values.join(", ")}) with respect to pairwise and collective co-primality.`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: {
      values,
      pairGcds,
      globalGcd,
      topology,
      complexityScore: difficulty === "EASY" ? 3 : difficulty === "MEDIUM" ? 6 : 9,
    },
    prototypeAncestry: [
      "NUM-CP004-PROT-008",
      "NUM-CP-004-WAVE-01",
      "FINAL-NON-COLLAPSING-COPRIME-TOPOLOGY",
    ],
    mathematicalFingerprint: `NUM-CP004-PROT-008:${topology}:${values.join(":")}`,
    explanation: {
      coreConcept: ["Pairwise co-prime means every pair has HCF 1; collectively co-prime means the HCF of all three together is 1."],
      givenDataAndStrategy: [`Check all three pair HCFs and then the HCF common to ${values.join(", ")}.`],
      stepByStep: [
        `The three pair HCFs are ${pairGcds.join(", ")}.`,
        `The HCF of all three numbers is ${globalGcd}.`,
        `Hence the correct classification is ${canonicalAnswer}.`,
      ],
      examSpeedMethod: ["First look for a factor common to all three; then test each pair separately."],
      commonTraps: options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The triple is ${canonicalAnswer}.`,
    },
  };
}

function calibratedFactorDifficulty(
  prototypeId: NumCp004Wave01PrototypeId,
  pkg: NumCp004Wave01Package,
): NumCp004Difficulty {
  const score = Number(pkg.hiddenState.complexityScore ?? 0);
  if (prototypeId === "NUM-CP004-PROT-004") {
    if (score <= 4) return "EASY";
    if (score <= 8) return "MEDIUM";
    return "HARD";
  }
  return pkg.difficulty;
}

function generateBoundedFactorState(
  prototypeId: NumCp004Wave01PrototypeId,
  requestedSeed: number,
): NumCp004Wave01Package {
  const tierResidue = ((requestedSeed - 1) % 3) + 1;
  let lastError: unknown;
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const foundationSeed = requestedSeed * 10_000 + tierResidue + attempt * 3;
    try {
      const pkg = generateReviewedPackage(prototypeId, foundationSeed);
      return {
        ...pkg,
        seed: requestedSeed,
        difficulty: calibratedFactorDifficulty(prototypeId, pkg),
        hiddenState: {
          ...pkg.hiddenState,
          requestedSeed,
          boundedFoundationSeed: foundationSeed,
        },
        prototypeAncestry: [...pkg.prototypeAncestry, "FINAL-BOUNDED-FACTOR-STATE"],
        mathematicalFingerprint: `${prototypeId}:${JSON.stringify(pkg.hiddenState)}`,
      };
    } catch (error) {
      lastError = error;
      if (!(error instanceof Error) || !error.message.includes("verifier domain exceeded")) throw error;
    }
  }
  throw new Error(`Unable to construct bounded factor state for ${prototypeId}, seed ${requestedSeed}: ${String(lastError)}`);
}

export function generateNumCp004Wave01Package(
  prototypeId: NumCp004Wave01PrototypeId,
  seed: number,
): NumCp004Wave01Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  if (prototypeId === "NUM-CP004-PROT-008") return generateVariedTriple(seed);
  if (FACTOR_STATE_PROTOTYPES.has(prototypeId)) return generateBoundedFactorState(prototypeId, seed);
  return generateReviewedPackage(prototypeId, seed);
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
