import {
  generateNumCp004Wave01Package as generateFoundationPackage,
  NUM_CP004_WAVE01_PROTOTYPE_IDS,
} from "./runtime";
import type {
  CoprimeClass,
  NumCp004Difficulty,
  NumCp004Option,
  NumCp004Wave01Package,
  NumCp004Wave01PrototypeId,
} from "./types";

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

function deterministicShuffle<T>(values: readonly T[], seed: number): T[] {
  const result = [...values];
  let state = (seed ^ 0x4c50434f) >>> 0;
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

function tripleFor(seed: number): {
  values: [number, number, number];
  difficulty: NumCp004Difficulty;
  topology: "PAIRWISE" | "COLLECTIVE_ONLY" | "NOT_COLLECTIVE";
} {
  const tier = (seed - 1) % 3;
  const category = Math.floor((seed - 1) / 3) % 3;
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[tier]!;
  if (category === 0) {
    const values = ([
      [5, 8, 9],
      [11, 14, 15],
      [17, 22, 27],
    ] as const)[tier]!;
    return { values: [...values], difficulty, topology: "PAIRWISE" };
  }
  if (category === 1) {
    const values = ([
      [6, 10, 15],
      [12, 25, 18],
      [14, 21, 30],
    ] as const)[tier]!;
    return { values: [...values], difficulty, topology: "COLLECTIVE_ONLY" };
  }
  const values = ([
    [6, 10, 14],
    [12, 18, 30],
    [21, 35, 49],
  ] as const)[tier]!;
  return { values: [...values], difficulty, topology: "NOT_COLLECTIVE" };
}

function generateReviewedTriple(seed: number): NumCp004Wave01Package {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("Seed must be a positive integer");
  const prototypeId = "NUM-CP004-PROT-008" as const;
  const { values, difficulty, topology } = tripleFor(seed);
  const canonicalAnswer = classifyCanonical(values);
  const verifierAnswer = classifyVerifier(values);
  const labels: readonly CoprimeClass[] = [
    "PAIRWISE_AND_COLLECTIVELY_COPRIME",
    "COLLECTIVELY_BUT_NOT_PAIRWISE",
    "NOT_COLLECTIVELY_COPRIME",
    "PAIRWISE_BUT_NOT_COLLECTIVELY_COPRIME",
  ];
  const options = deterministicShuffle<NumCp004Option>(
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
    packageId: "NUM-001",
    checkpointId: "NUM-CP-004",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic: "COPRIME_CLASS",
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
    sourceAncestry: [
      "DESIGN:NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY",
      "UPLOAD:DISHA-SSC-MATHEMATICS-GUIDE",
      "LEGACY:QUANT-V2:ns_prime_composite_deduction",
    ],
    prototypeAncestry: [prototypeId, "NUM-CP-004-WAVE-01", "REVIEWED-COPRIME-TOPOLOGY"],
    mathematicalFingerprint: `${prototypeId}:${values.join(":")}:${topology}`,
    explanation: {
      coreConcept: ["Pairwise co-prime means every pair has HCF 1; collectively co-prime means the HCF of all three together is 1."],
      givenDataAndStrategy: [`Check all three pair HCFs and then the HCF common to ${values.join(", ")}.`],
      stepByStep: [
        `The three pair HCFs are ${pairGcds.join(", ")}.`,
        `The HCF of all three numbers is ${globalGcd}.`,
        `Hence the correct classification is ${canonicalAnswer}.`,
      ],
      examSpeedMethod: ["First look for a factor common to all three; then check each pair separately."],
      commonTraps: options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The triple is ${canonicalAnswer}.`,
    },
    lifecycle: {
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
    },
  };
}

function reviewedDifficulty(pkg: NumCp004Wave01Package): NumCp004Difficulty {
  const score = Number(pkg.hiddenState.complexityScore ?? 0);
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-005") {
    return score <= 7 ? "EASY" : score <= 11 ? "MEDIUM" : "HARD";
  }
  if (pkg.temporaryPrototypeId === "NUM-CP004-PROT-006") {
    return score <= 7 ? "EASY" : score <= 10 ? "MEDIUM" : "HARD";
  }
  return pkg.difficulty;
}

export function generateNumCp004Wave01Package(
  prototypeId: NumCp004Wave01PrototypeId,
  seed: number,
): NumCp004Wave01Package {
  if (prototypeId === "NUM-CP004-PROT-008") return generateReviewedTriple(seed);
  const foundation = generateFoundationPackage(prototypeId, seed);
  return { ...foundation, difficulty: reviewedDifficulty(foundation) };
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
