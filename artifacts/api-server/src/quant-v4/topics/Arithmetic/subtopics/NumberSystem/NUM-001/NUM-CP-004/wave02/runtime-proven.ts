import {
  generateNumCp004Wave02Package as generateFoundationPackage,
  NUM_CP004_WAVE02_PROTOTYPE_IDS,
} from "./runtime";
import type {
  NumCp004Wave02Package,
  NumCp004Wave02PrototypeId,
} from "./types";

function isPrime(value: number): boolean {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value === 2) return true;
  if (value % 2 === 0) return false;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function nextPrime(value: number): number {
  let candidate = value + 1;
  while (!isPrime(candidate)) candidate += 1;
  return candidate;
}

function formatTriple(values: readonly [number, number, number]): string {
  return `(${values[0]}, ${values[1]}, ${values[2]})`;
}

function generateExpandedPrimeTriple(seed: number): NumCp004Wave02Package {
  const shell = generateFoundationPackage("NUM-CP004-PROT-014", seed);
  const first = nextPrime(10 + seed * 11);
  const middle = nextPrime(first);
  const third = nextPrime(middle);
  const sum = first + middle + third;
  const triple: [number, number, number] = [first, middle, third];
  const correct = formatTriple(triple);
  const wrongValues = [
    formatTriple([first, middle, nextPrime(third)]),
    formatTriple([first + 2, middle, third - 2]),
    formatTriple([first, nextPrime(middle), third]),
  ];
  const correctIndex = (seed - 1) % 4;
  let wrongIndex = 0;
  const options = Array.from({ length: 4 }, (_, index) => {
    if (index === correctIndex) return { value: correct, isCorrect: true } as const;
    const value = wrongValues[wrongIndex++]!;
    return {
      value,
      isCorrect: false,
      misconceptionId: index % 2 === 0
        ? "PRESERVED_PRIMES_BUT_CHANGED_REQUIRED_SUM"
        : "PRESERVED_SUM_OR_ORDER_BUT_IGNORED_PRIMALITY",
    } as const;
  });

  return {
    ...shell,
    seed,
    difficulty: (["EASY", "MEDIUM", "HARD"] as const)[(seed - 1) % 3]!,
    stem: `Three increasing primes from ${first} to ${third} have sum ${sum}. If the middle prime is ${middle}, which triple is possible?`,
    options,
    correctIndex,
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: {
      lower: first,
      upper: third,
      sum,
      middle,
      triple,
      uniquenessCount: 1,
      requestedSeed: seed,
      construction: "THREE-CONSECUTIVE-PRIMES-ONLY",
    },
    prototypeAncestry: [
      ...shell.prototypeAncestry,
      "WAVE02-SEED-SCALED-CONSECUTIVE-PRIME-TRIPLE",
      "REQUESTED-SEED-ANSWER-POSITION-NORMALIZER",
    ],
    mathematicalFingerprint: `NUM-CP004-PROT-014:${first}:${middle}:${third}:${sum}`,
    explanation: {
      coreConcept: ["The interval contains three consecutive primes, so the increasing triple is fixed once its middle term and total are confirmed."],
      givenDataAndStrategy: [`Verify the three primes in the interval and add them.`],
      stepByStep: [
        `${first}, ${middle} and ${third} are consecutive primes in the stated interval.`,
        `${first} + ${middle} + ${third} = ${sum}.`,
        `Therefore the unique triple is ${correct}.`,
      ],
      examSpeedMethod: ["When the interval contains exactly three primes, check their sum directly instead of testing many triples."],
      commonTraps: options.filter((option) => !option.isCorrect).map((option) => `${option.value}: ${option.misconceptionId}.`),
      finalAnswer: `The correct answer is ${correct}.`,
    },
  };
}

export function generateNumCp004Wave02Package(
  prototypeId: NumCp004Wave02PrototypeId,
  seed: number,
): NumCp004Wave02Package {
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error(`Seed must be a positive integer; received ${seed}`);
  }
  if (prototypeId === "NUM-CP004-PROT-014") return generateExpandedPrimeTriple(seed);
  return generateFoundationPackage(prototypeId, seed);
}

export function generateNumCp004Wave02Sweep(
  seedsPerPrototype: number,
): NumCp004Wave02Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer");
  }
  return NUM_CP004_WAVE02_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerPrototype }, (_, index) =>
      generateNumCp004Wave02Package(prototypeId, index + 1),
    ),
  );
}

export { NUM_CP004_WAVE02_PROTOTYPE_IDS };
