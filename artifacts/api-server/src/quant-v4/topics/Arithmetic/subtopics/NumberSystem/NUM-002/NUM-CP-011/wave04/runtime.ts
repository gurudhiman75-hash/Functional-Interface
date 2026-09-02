import { createHash } from "node:crypto";

import type {
  NumCp011Wave04Difficulty,
  NumCp011Wave04Option,
  NumCp011Wave04Package,
  NumCp011Wave04PrototypeId,
} from "./types.ts";

const lifecycle = Object.freeze({
  maturity: "DISCOVERY_PROTOTYPE" as const,
  reviewStatus: "WAVE04_REVIEW_REQUIRED" as const,
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

function fingerprint(prototypeId: string, state: Readonly<Record<string, unknown>>) {
  return createHash("sha256")
    .update(JSON.stringify({ prototypeId, state }))
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

function valuationInteger(value: number, prime: number) {
  let remaining = value;
  let exponent = 0;
  while (remaining > 0 && remaining % prime === 0) {
    exponent += 1;
    remaining /= prime;
  }
  return exponent;
}

function valuationFactorialLegendre(n: number, prime: number) {
  let exponent = 0;
  let power = prime;
  while (power <= n) {
    exponent += Math.floor(n / power);
    if (power > Math.floor(n / prime)) break;
    power *= prime;
  }
  return exponent;
}

function valuationFactorialByEnumeration(n: number, prime: number) {
  let exponent = 0;
  for (let value = 2; value <= n; value += 1) {
    exponent += valuationInteger(value, prime);
  }
  return exponent;
}

function leastNAtLeastValuation(prime: number, target: number) {
  let low = 1;
  let high = Math.max(prime, 2);
  while (valuationFactorialLegendre(high, prime) < target) high *= 2;
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (valuationFactorialLegendre(mid, prime) >= target) high = mid;
    else low = mid + 1;
  }
  return low;
}

function leastNAtLeastValuationByEnumeration(prime: number, target: number) {
  const bound = Math.max(40, target * prime + prime * prime);
  for (let n = 1; n <= bound; n += 1) {
    if (valuationFactorialByEnumeration(n, prime) >= target) return n;
  }
  throw new Error(`Unable to verify inverse valuation threshold for p=${prime}, target=${target}`);
}

function packageFrom(input: Readonly<{
  prototypeId: NumCp011Wave04PrototypeId;
  seed: number;
  difficulty: NumCp011Wave04Difficulty;
  answerSemantic: string;
  representation: string;
  stem: string;
  statements: readonly string[];
  optionDefinitions: readonly { value: string; misconceptionId: string }[];
  canonicalAnswer: string;
  verifierAnswer: string;
  state: Readonly<Record<string, unknown>>;
  concept: string;
  strategy: string;
  steps: readonly string[];
  sourceAncestry: readonly string[];
}>): NumCp011Wave04Package {
  const optionRng = new Rng(input.seed * 15485863 + Number(input.prototypeId.slice(-3)));
  const options = Object.freeze(shuffle(input.optionDefinitions, optionRng).map((definition) => Object.freeze({
    value: definition.value,
    isCorrect: definition.value === input.canonicalAnswer,
    misconceptionId: definition.misconceptionId,
  } satisfies NumCp011Wave04Option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0) throw new Error(`${input.prototypeId}: correct option missing`);

  return Object.freeze({
    packageId: "NUM-002",
    checkpointId: "NUM-CP-011",
    temporaryPrototypeId: input.prototypeId,
    seed: input.seed,
    locale: "en-IN",
    difficulty: input.difficulty,
    answerSemantic: input.answerSemantic,
    representation: input.representation,
    stem: input.stem,
    statements: Object.freeze([...input.statements]),
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

const CLAIM_OPTIONS = Object.freeze([
  { value: "Only Statement I is correct", misconceptionId: "TRUTH_PATTERN_I_ONLY" },
  { value: "Only Statement II is correct", misconceptionId: "TRUTH_PATTERN_II_ONLY" },
  { value: "Both statements are correct", misconceptionId: "TRUTH_PATTERN_BOTH" },
  { value: "Neither statement is correct", misconceptionId: "TRUTH_PATTERN_NEITHER" },
]);

function claimAnswer(first: boolean, second: boolean) {
  if (first && second) return "Both statements are correct";
  if (first) return "Only Statement I is correct";
  if (second) return "Only Statement II is correct";
  return "Neither statement is correct";
}

function p014(seed: number): NumCp011Wave04Package {
  const rng = new Rng(seed * 71 + 14);
  const primes = [2, 3, 5, 7] as const;
  const firstPrime = rng.pick(primes);
  const secondPrime = rng.pick(primes.filter((prime) => prime !== firstPrime));
  const n = rng.int(24, 115);
  const firstActual = valuationFactorialLegendre(n, firstPrime);
  const secondActual = valuationFactorialLegendre(n, secondPrime);
  const pattern = seed % 4;
  const firstTrue = pattern === 0 || pattern === 1;
  const secondTrue = pattern === 0 || pattern === 2;
  const firstClaim = firstTrue ? firstActual : firstActual + rng.int(1, 3);
  const secondClaim = secondTrue ? secondActual : secondActual + rng.int(1, 3);
  const canonicalAnswer = claimAnswer(firstTrue, secondTrue);

  const firstVerified = valuationFactorialByEnumeration(n, firstPrime) === firstClaim;
  const secondVerified = valuationFactorialByEnumeration(n, secondPrime) === secondClaim;
  const verifierAnswer = claimAnswer(firstVerified, secondVerified);

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-014",
    seed,
    difficulty: "MEDIUM",
    answerSemantic: "STATEMENT_TRUTH_PATTERN",
    representation: "TWO_STATEMENT_FACTORIAL_VALUATION",
    stem: `Consider the following statements about ${n}!. Which option is correct?`,
    statements: [
      `Statement I: The exponent of ${firstPrime} in the prime factorisation of ${n}! is ${firstClaim}.`,
      `Statement II: The exponent of ${secondPrime} in the prime factorisation of ${n}! is ${secondClaim}.`,
    ],
    optionDefinitions: CLAIM_OPTIONS,
    canonicalAnswer,
    verifierAnswer,
    state: {
      n,
      firstPrime,
      secondPrime,
      firstActual,
      secondActual,
      firstClaim,
      secondClaim,
      firstTrue,
      secondTrue,
      pattern,
    },
    concept: "Each statement must be tested independently against the factorial prime valuation it claims; one statement being true gives no shortcut for the other prime.",
    strategy: `Find the exponent of ${firstPrime} and ${secondPrime} in ${n}! separately, compare each exact value with its statement, then choose the option matching the two truth values.`,
    steps: [
      `For Statement I, v_${firstPrime}(${n}!) = ${firstActual}, so Statement I is ${firstTrue ? "correct" : "incorrect"}.`,
      `For Statement II, v_${secondPrime}(${n}!) = ${secondActual}, so Statement II is ${secondTrue ? "correct" : "incorrect"}.`,
      `Therefore the correct choice is: ${canonicalAnswer}.`,
    ],
    sourceAncestry: ["DESIGN:STATEMENT_CLAIM_REPRESENTATION", "DESIGN:FACTORIAL_VALUATION"],
  });
}

const DS_OPTIONS = Object.freeze([
  {
    value: "Statement I alone is sufficient, but Statement II alone is not sufficient",
    misconceptionId: "DS_I_ONLY",
  },
  {
    value: "Statement II alone is sufficient, but Statement I alone is not sufficient",
    misconceptionId: "DS_II_ONLY",
  },
  {
    value: "Either statement alone is sufficient",
    misconceptionId: "DS_EITHER_ALONE",
  },
  {
    value: "Both statements together are sufficient, but neither alone is sufficient",
    misconceptionId: "DS_BOTH_TOGETHER_ONLY",
  },
  {
    value: "Even both statements together are not sufficient",
    misconceptionId: "DS_NOT_SUFFICIENT_TOGETHER",
  },
]);

function dsAnswer(classId: number) {
  return DS_OPTIONS[classId]!.value;
}

interface StatementPredicate {
  readonly text: string;
  readonly test: (n: number) => boolean;
}

function sufficiencyFromDomain(
  domain: readonly number[],
  statement: (n: number) => boolean,
  question: (n: number) => boolean,
) {
  const candidates = domain.filter(statement);
  if (candidates.length === 0) throw new Error("DS statement produced an empty verifier domain");
  const outcomes = new Set(candidates.map(question));
  return outcomes.size === 1;
}

function classifyDsByEnumeration(
  threshold: number,
  prime: number,
  first: StatementPredicate,
  second: StatementPredicate,
) {
  const domain = Array.from({ length: threshold + 14 }, (_, index) => index + 1);
  const question = (n: number) => valuationFactorialByEnumeration(n, prime) >= valuationFactorialByEnumeration(threshold, prime);
  const firstSufficient = sufficiencyFromDomain(domain, first.test, question);
  const secondSufficient = sufficiencyFromDomain(domain, second.test, question);
  const bothSufficient = sufficiencyFromDomain(domain, (n) => first.test(n) && second.test(n), question);

  if (firstSufficient && secondSufficient) return 2;
  if (firstSufficient) return 0;
  if (secondSufficient) return 1;
  if (bothSufficient) return 3;
  return 4;
}

function p015(seed: number): NumCp011Wave04Package {
  const rng = new Rng(seed * 73 + 15);
  const decimalRepresentation = seed % 2 === 0;
  const prime = decimalRepresentation ? 5 : rng.pick([2, 3, 5, 7] as const);
  const target = rng.int(9, 48);
  const threshold = leastNAtLeastValuation(prime, target);
  const verifierThreshold = leastNAtLeastValuationByEnumeration(prime, target);
  if (threshold !== verifierThreshold) throw new Error("DS threshold verifier mismatch");
  const parityWord = threshold % 2 === 0 ? "even" : "odd";
  const parityTest = (n: number) => n % 2 === threshold % 2;
  const classId = seed % 5;

  let first: StatementPredicate;
  let second: StatementPredicate;

  if (classId === 0) {
    first = { text: `n ≥ ${threshold}`, test: (n) => n >= threshold };
    second = { text: `n is ${parityWord}`, test: parityTest };
  } else if (classId === 1) {
    first = { text: `n is ${parityWord}`, test: parityTest };
    second = { text: `n ≥ ${threshold}`, test: (n) => n >= threshold };
  } else if (classId === 2) {
    first = { text: `n ≥ ${threshold}`, test: (n) => n >= threshold };
    second = { text: `n ≥ ${threshold + 1}`, test: (n) => n >= threshold + 1 };
  } else if (classId === 3) {
    first = {
      text: `${threshold - 1} ≤ n ≤ ${threshold}`,
      test: (n) => n >= threshold - 1 && n <= threshold,
    };
    second = { text: `n is ${parityWord}`, test: parityTest };
  } else {
    first = {
      text: `${threshold - 2} ≤ n ≤ ${threshold + 1}`,
      test: (n) => n >= threshold - 2 && n <= threshold + 1,
    };
    second = { text: `n is ${parityWord}`, test: parityTest };
  }

  const verifierClassId = classifyDsByEnumeration(threshold, prime, first, second);
  const canonicalAnswer = dsAnswer(classId);
  const verifierAnswer = dsAnswer(verifierClassId);
  const questionStem = decimalRepresentation
    ? `For a positive integer n, can it be determined whether n! has at least ${target} trailing zeroes?`
    : `For a positive integer n, can it be determined whether ${prime}^${target} divides n!?`;

  return packageFrom({
    prototypeId: "NUM-CP011-PROT-015",
    seed,
    difficulty: classId >= 3 ? "HARD" : "MEDIUM",
    answerSemantic: "DATA_SUFFICIENCY_CLASS",
    representation: decimalRepresentation ? "BASE10_ZERO_THRESHOLD_DS" : "PRIME_VALUATION_THRESHOLD_DS",
    stem: `${questionStem} Use the two statements below to decide sufficiency.`,
    statements: [
      `Statement I: ${first.text}.`,
      `Statement II: ${second.text}.`,
    ],
    optionDefinitions: DS_OPTIONS,
    canonicalAnswer,
    verifierAnswer,
    state: {
      decimalRepresentation,
      prime,
      target,
      threshold,
      classId,
      firstStatement: first.text,
      secondStatement: second.text,
      parityWord,
    },
    concept: decimalRepresentation
      ? "The question has a sharp factorial threshold: once n reaches the least value giving the requested number of decimal zeroes, every larger n also satisfies it. Data sufficiency asks whether each statement locates n wholly on one side of that threshold."
      : `The divisibility condition has a sharp threshold at the least n for which v_${prime}(n!) reaches ${target}. A statement is sufficient only if every n allowed by it gives the same yes/no answer.`,
    strategy: `First locate the threshold n = ${threshold}. Then test the full set of n values allowed by Statement I, Statement II, and their intersection; a statement is sufficient only when it cannot place n on both sides of ${threshold}.`,
    steps: [
      `The target is first reached at n = ${threshold}; values below ${threshold} answer “No”, while values from ${threshold} onward answer “Yes”.`,
      `Statement I says ${first.text}; Statement II says ${second.text}. Check whether each condition, by itself and together, fixes n to one side of the threshold.`,
      `This gives the standard data-sufficiency result: ${canonicalAnswer}.`,
    ],
    sourceAncestry: ["DESIGN:DATA_SUFFICIENCY_REPRESENTATION", "SOURCE_GAP:INVERSE_FACTORIAL_VALUATION"],
  });
}

export function generateNumCp011Wave04(
  prototypeId: NumCp011Wave04PrototypeId,
  seed: number,
): NumCp011Wave04Package {
  if (!Number.isSafeInteger(seed) || seed < 1) throw new Error("Wave 04 seed must be a positive safe integer");
  switch (prototypeId) {
    case "NUM-CP011-PROT-014": return p014(seed);
    case "NUM-CP011-PROT-015": return p015(seed);
  }
}
