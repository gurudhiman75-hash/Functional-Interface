import {
  NUM_CP001_WAVE04_PROTOTYPE_IDS,
  type NumCp001Difficulty,
  type NumCp001Explanation,
  type NumCp001Lifecycle,
  type NumCp001Option,
  type NumCp001Wave04AnswerSemantic,
  type NumCp001Wave04Package,
  type NumCp001Wave04PrototypeId,
} from "./types";

export { NUM_CP001_WAVE04_PROTOTYPE_IDS } from "./types";

const SOURCE_ANCESTRY = [
  "NUMBER-SYSTEM-COMPLETENESS-AUDIT",
  "NUMBER-SYSTEM-ROADMAP-V2",
  "NUM-001-COMPLETE-CHECKPOINT-DESIGN",
  "NUM-CP-001-WAVE-00-SOURCE-AND-OWNERSHIP-REGISTER",
] as const;

const LOCKED_LIFECYCLE: NumCp001Lifecycle = {
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
};

const DS_CLASSES = [
  "I alone is sufficient",
  "II alone is sufficient",
  "Both together are sufficient",
  "Even together are insufficient",
] as const;

type DsClass = (typeof DS_CLASSES)[number];
type Predicate = Readonly<{ description: string; test: (x: number) => boolean }>;

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function factorial(n: number): number {
  let result = 1;
  for (let value = 2; value <= n; value += 1) result *= value;
  return result;
}

function difficulty(seed: number): NumCp001Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[mod(seed - 1, 3)];
}

function makeOptions(
  correctValue: string,
  wrong: readonly { value: string; misconceptionId: string }[],
  seed: number,
): NumCp001Option[] {
  if (wrong.length !== 3) throw new Error("Wave 4 requires exactly three distractors");
  const values = [correctValue, ...wrong.map((x) => x.value)];
  if (new Set(values).size !== 4) throw new Error(`Duplicate options: ${values.join(" | ")}`);
  const options: NumCp001Option[] = wrong.map((x) => ({
    value: x.value,
    isCorrect: false,
    misconceptionId: x.misconceptionId,
  }));
  options.splice(mod(seed - 1, 4), 0, { value: correctValue, isCorrect: true });
  return options;
}

function explanation(
  core: string,
  strategy: string,
  steps: readonly string[],
  speed: string,
  traps: readonly string[],
  finalAnswer: string,
): NumCp001Explanation {
  return {
    coreConcept: [core],
    givenDataAndStrategy: [strategy],
    stepByStep: steps,
    examSpeedMethod: [speed],
    commonTraps: traps,
    finalAnswer: `Final answer: ${finalAnswer}`,
  };
}

function base(
  prototype: NumCp001Wave04PrototypeId,
  seed: number,
  answerSemantic: NumCp001Wave04AnswerSemantic,
  explicitDifficulty = difficulty(seed),
) {
  return {
    packageId: "NUM-001" as const,
    checkpointId: "NUM-CP-001" as const,
    temporaryPrototypeId: prototype,
    permanentQlId: null,
    seed,
    locale: "en-IN" as const,
    difficulty: explicitDifficulty,
    answerSemantic,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: [prototype],
    lifecycle: LOCKED_LIFECYCLE,
  };
}

function classifySufficiency(
  domain: readonly number[],
  first: Predicate,
  second: Predicate,
): DsClass {
  const firstCandidates = domain.filter(first.test);
  const secondCandidates = domain.filter(second.test);
  const combinedCandidates = domain.filter((x) => first.test(x) && second.test(x));
  const firstSufficient = firstCandidates.length === 1;
  const secondSufficient = secondCandidates.length === 1;
  const combinedSufficient = combinedCandidates.length === 1;

  if (firstSufficient && !secondSufficient) return "I alone is sufficient";
  if (!firstSufficient && secondSufficient) return "II alone is sufficient";
  if (!firstSufficient && !secondSufficient && combinedSufficient) return "Both together are sufficient";
  return "Even together are insufficient";
}

function p025(seed: number): NumCp001Wave04Package {
  const domain = Array.from({ length: 21 }, (_, i) => i - 10);
  const scenario = mod(seed - 1, 4);
  const hidden = -6 + mod(seed * 5, 13);
  const parityWord = Math.abs(hidden) % 2 === 0 ? "even" : "odd";
  const parityPredicate: Predicate = {
    description: `x is ${parityWord}`,
    test: (x) => Math.abs(x) % 2 === Math.abs(hidden) % 2,
  };

  const uniqueUpperPredicate: Predicate = {
    description: `x is the greatest integer strictly less than ${hidden + 0.5}`,
    test: (x) => x === hidden,
  };
  const uniqueLowerPredicate: Predicate = {
    description: `x is the least integer strictly greater than ${hidden - 0.5}`,
    test: (x) => x === hidden,
  };
  const pairLower = hidden - 0.5;
  const pairUpper = hidden + 1.5;
  const pairPredicate: Predicate = {
    description: `${pairLower} < x < ${pairUpper}`,
    test: (x) => pairLower < x && x < pairUpper,
  };
  const broadLower = hidden - 2.5;
  const broadUpper = hidden + 2.5;
  const broadPredicate: Predicate = {
    description: `${broadLower} < x < ${broadUpper}`,
    test: (x) => broadLower < x && x < broadUpper,
  };

  let first: Predicate;
  let second: Predicate;
  if (scenario === 0) {
    first = uniqueUpperPredicate;
    second = parityPredicate;
  } else if (scenario === 1) {
    first = parityPredicate;
    second = uniqueLowerPredicate;
  } else if (scenario === 2) {
    first = parityPredicate;
    second = pairPredicate;
  } else {
    first = parityPredicate;
    second = broadPredicate;
  }

  const firstCandidates = domain.filter(first.test);
  const secondCandidates = domain.filter(second.test);
  const combinedCandidates = domain.filter((x) => first.test(x) && second.test(x));
  const canonicalAnswer = classifySufficiency(domain, first, second);
  const verifierAnswer = classifySufficiency(
    [...domain],
    { description: first.description, test: first.test },
    { description: second.description, test: second.test },
  );
  const options = makeOptions(canonicalAnswer, DS_CLASSES.filter((x) => x !== canonicalAnswer).map((value, i) => ({
    value,
    misconceptionId: ["STATEMENT_I_CARDINALITY_MISREAD", "STATEMENT_II_CARDINALITY_MISREAD", "INTERSECTION_CARDINALITY_MISREAD"][i],
  })), seed);

  return {
    ...base("NUM-CP001-PROT-025", seed, "DATA_SUFFICIENCY_CLASS"),
    stem: `An integer x is known to lie from -10 to 10 inclusive. Decide whether x can be uniquely determined. Statement I: ${first.description}. Statement II: ${second.description}.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: {
      scenario,
      hidden,
      firstCandidates,
      secondCandidates,
      combinedCandidates,
      firstDescription: first.description,
      secondDescription: second.description,
    },
    mathematicalFingerprint: `cp001-ds:${scenario}:${hidden}:${firstCandidates.join(",")}:${secondCandidates.join(",")}`,
    explanation: explanation(
      "A data-sufficiency statement is sufficient only when it leaves exactly one allowed integer value.",
      "List the bounded candidates allowed by Statement I, Statement II and their intersection; judge sufficiency from candidate-set size, not from how informative a sentence sounds.",
      [
        `Statement I leaves {${firstCandidates.join(", ")}}.`,
        `Statement II leaves {${secondCandidates.join(", ")}}.`,
        `Using both leaves {${combinedCandidates.join(", ")}}; therefore ${canonicalAnswer.toLowerCase()}.`,
      ],
      "For bounded integer DS, reduce each statement to a candidate set. A singleton is sufficient; two or more candidates are not.",
      [
        "Do not combine the statements before testing each one separately.",
        "Parity alone usually leaves many candidates in a bounded interval.",
        "Two statements can each be insufficient but become sufficient when their candidate sets intersect in one value.",
      ],
      canonicalAnswer,
    ),
  };
}

function guaranteedDivisorByEnumeration(k: number): number {
  const products: number[] = [];
  for (let start = 1; start <= 12; start += 1) {
    let product = 1;
    for (let offset = 0; offset < k; offset += 1) product *= start + offset;
    products.push(product);
  }
  let divisor = products[0]!;
  for (let i = 1; i < products.length; i += 1) {
    let a = Math.abs(divisor);
    let b = Math.abs(products[i]!);
    while (b !== 0) [a, b] = [b, a % b];
    divisor = a;
  }
  return divisor;
}

function p026(seed: number): NumCp001Wave04Package {
  const kValues = [2, 3, 4, 5] as const;
  const k = kValues[mod(seed - 1, kValues.length)];
  const canonical = factorial(k);
  const canonicalAnswer = String(canonical);
  const verifierAnswer = String(guaranteedDivisorByEnumeration(k));
  const candidates = [
    { value: factorial(k - 1), misconceptionId: "USED_ONE_FEWER_CONSECUTIVE_FACTORS" },
    { value: k, misconceptionId: "USED_BLOCK_LENGTH_ONLY" },
    { value: k * (k - 1), misconceptionId: "USED_ONLY_TWO_BLOCK_FACTORS" },
    { value: canonical + k, misconceptionId: "ADDED_BLOCK_LENGTH_TO_FACTORIAL" },
    { value: canonical * 2, misconceptionId: "ASSUMED_EXTRA_FACTOR_ALWAYS_PRESENT" },
    { value: Math.max(1, canonical - 1), misconceptionId: "NEARBY_DIVISOR_GUESS" },
  ];
  const seen = new Set([canonicalAnswer]);
  const wrongs: { value: string; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
    const value = String(candidate.value);
    if (seen.has(value)) continue;
    seen.add(value);
    wrongs.push({ value, misconceptionId: candidate.misconceptionId });
    if (wrongs.length === 3) break;
  }
  if (wrongs.length !== 3) throw new Error(`Unable to construct consecutive-product distractors for k=${k}`);
  const options = makeOptions(canonicalAnswer, wrongs, seed);
  const explicitDifficulty: NumCp001Difficulty = k === 2 ? "EASY" : k === 3 ? "MEDIUM" : "HARD";

  return {
    ...base("NUM-CP001-PROT-026", seed, "INTEGER", explicitDifficulty),
    stem: `For every integer n, what is the greatest positive integer that is guaranteed to divide n(n + 1)${k >= 3 ? "(n + 2)" : ""}${k >= 4 ? "(n + 3)" : ""}${k >= 5 ? "(n + 4)" : ""}?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { k, factorial: canonical },
    mathematicalFingerprint: `consecutive-product-guaranteed-divisor:${k}`,
    explanation: explanation(
      "The product of k consecutive integers is always divisible by k!, and k! is the greatest universal guarantee because the block 1,2,…,k has product exactly k!.",
      `Here the expression is a product of ${k} consecutive integers, so use ${k}!.`,
      [
        `${k}! = ${canonical}.`,
        `Every block of ${k} consecutive integers has product divisible by ${canonical}.`,
        `The block 1, 2, …, ${k} has product exactly ${canonical}, so no larger integer can be guaranteed for every block.`,
      ],
      "Recognise a complete run of consecutive factors and replace the universal-divisibility question by k!.",
      [
        "Do not use only the number of factors k as the guaranteed divisor.",
        "The question asks for the greatest divisor guaranteed for every starting integer, not the divisor of one sample product.",
        "The sharpness check using 1×2×…×k rules out any larger universal answer.",
      ],
      canonicalAnswer,
    ),
  };
}

const GENERATORS: Record<NumCp001Wave04PrototypeId, (seed: number) => NumCp001Wave04Package> = {
  "NUM-CP001-PROT-025": p025,
  "NUM-CP001-PROT-026": p026,
};

export function generateNumCp001Wave04(
  prototypeId: NumCp001Wave04PrototypeId,
  seed: number,
): NumCp001Wave04Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("seed must be a positive integer");
  const generator = GENERATORS[prototypeId];
  if (!generator) throw new Error(`Unknown Wave 4 prototype: ${prototypeId}`);
  return generator(seed);
}
