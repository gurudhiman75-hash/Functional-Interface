import {
  NUM_CP001_WAVE01_PROTOTYPE_IDS,
  type NumCp001AnswerSemantic,
  type NumCp001ClaimClass,
  type NumCp001Difficulty,
  type NumCp001Explanation,
  type NumCp001Lifecycle,
  type NumCp001NumberSet,
  type NumCp001Option,
  type NumCp001Wave01Package,
  type NumCp001Wave01PrototypeId,
} from "./types";

export { NUM_CP001_WAVE01_PROTOTYPE_IDS } from "./types";

const SOURCE_ANCESTRY = [
  "NUMBER-SYSTEM-COMPLETENESS-AUDIT",
  "NUM-001-COMPLETE-CHECKPOINT-DESIGN",
  "NUMBER-SYSTEM-CROSS-CP-OWNERSHIP-AND-DEPENDENCY-MATRIX",
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

const NUMBER_SET_LABELS: Record<NumCp001NumberSet, string> = {
  NATURAL: "Natural numbers",
  WHOLE: "Whole numbers",
  INTEGER: "Integers",
  RATIONAL: "Rational numbers",
  IRRATIONAL: "Irrational numbers",
  REAL: "Real numbers",
};

const CLAIM_CLASS_LABELS: Record<NumCp001ClaimClass, string> = {
  ALWAYS_TRUE: "Always true",
  TRUE_FOR_EVEN_N_ONLY: "True only when n is even",
  TRUE_FOR_ODD_N_ONLY: "True only when n is odd",
  NEVER_TRUE: "Never true",
};

const MISCONCEPTION_TEXT: Record<string, string> = {
  CHOSE_LARGER_CONTAINING_SET: "a true larger set was chosen instead of the smallest applicable set",
  SKIPPED_SMALLEST_SET_REQUIREMENT: "the smallest-set requirement was skipped",
  CLASSIFIED_BY_TRUE_SUPERSET_ONLY: "membership in a larger superset was mistaken for the most specific classification",
  IGNORED_NATURAL_STARTS_AT_ONE_CONVENTION: "the stated convention that natural numbers begin at 1 was ignored",
  TREATED_NEGATIVE_INTEGER_AS_WHOLE: "a negative integer was incorrectly treated as a whole number",
  IGNORED_SIGN_IN_SET_MEMBERSHIP: "the negative sign was ignored while classifying the number",
  ASSUMED_EVERY_FRACTION_IS_AN_INTEGER: "a non-integer fraction was treated as an integer",
  IGNORED_NON_INTEGER_FRACTION: "the fact that the value is a non-integer fraction was ignored",
  ASSUMED_EVERY_SQUARE_ROOT_IS_RATIONAL: "the square root of a non-square integer was treated as rational",
  TREATED_NON_SQUARE_ROOT_AS_INTEGER: "a non-square root was treated as an integer",
  ZERO_PARITY_MISCLASSIFIED: "zero was incorrectly classified as odd",
  NATURAL_NUMBER_CONVENTION_IGNORED: "the stated natural-number convention was ignored",
  NEGATIVE_SET_MEMBERSHIP_CONFUSED: "negative integers were confused with whole or natural numbers",
  NEGATIVE_INTEGER_NOT_RECOGNISED_AS_RATIONAL: "the fact that every integer can be written as a fraction over 1 was missed",
  ORDER_REVERSED: "ascending and descending order were interchanged",
  NEGATIVE_ORDER_REVERSED: "the order of negative numbers was reversed incorrectly",
  ORDERED_BY_ABSOLUTE_VALUE: "the numbers were ordered by magnitude instead of signed value",
  POSITIVE_ORDER_SWAP: "the final positive values were placed in the wrong order",
  USED_SIGNED_DISPLACEMENT: "signed displacement was used instead of non-negative distance",
  SUBTRACTED_DISTANCES_FROM_ZERO: "distances from zero were subtracted even though that does not match the point configuration",
  ADDED_DISTANCES_FROM_ZERO: "distances from zero were added even though both points lie on the same side of zero",
  COUNTED_POINTS_INSTEAD_OF_UNIT_INTERVALS: "the endpoints were counted as points instead of counting the unit gaps between them",
  UNDERCOUNTED_UNIT_INTERVALS: "one unit interval between the two points was missed",
  COUNTED_BOTH_ENDPOINTS: "both endpoint integers were included regardless of the brackets",
  TREATED_INTERVAL_AS_HALF_OPEN: "exactly one endpoint was removed without following the shown brackets",
  EXCLUDED_BOTH_ENDPOINTS: "both endpoints were removed even when a bracket includes one or both",
  ADDED_EXTRA_ENDPOINT: "an extra endpoint value was added to the interval count",
  REMOVED_TOO_MANY_ENDPOINT_VALUES: "too many endpoint integers were removed",
  ODD_PLUS_ODD_RULE_CONFUSED: "the parity rule for adding two odd numbers was applied incorrectly",
  EVEN_FACTOR_PRODUCT_RULE_IGNORED: "the even factor in a product was ignored",
  EVEN_POWER_RULE_IGNORED: "the parity of a power with an even base was misread",
  SINGLE_TRUE_EXAMPLE_GENERALIZED: "one true example was incorrectly treated as proof that the statement is always true",
  SINGLE_FALSE_EXAMPLE_GENERALIZED: "one false example was incorrectly treated as proof that the statement is never true",
  EVEN_ODD_CASES_CONFUSED: "the even-n and odd-n cases were interchanged",
  UNIVERSAL_PARITY_RULE_MISSED: "the parity identity that works for every integer was not used",
  BLOCK_SHIFTED_ONE_TOO_LOW: "the whole consecutive block was shifted down by one",
  BLOCK_SHIFTED_ONE_TOO_HIGH: "the whole consecutive block was shifted up by one",
  USED_CONSECUTIVE_SAME_PARITY_NUMBERS: "numbers two units apart were used instead of consecutive integers",
};

function makeOptions(
  correctValue: string,
  wrongOptions: readonly { value: string; misconceptionId: string }[],
  seed: number,
): NumCp001Option[] {
  if (wrongOptions.length !== 3) {
    throw new Error("Wave 1 requires exactly three misconception-owned distractors");
  }
  const values = [correctValue, ...wrongOptions.map((option) => option.value)];
  if (new Set(values).size !== 4) {
    throw new Error(`Duplicate option value for seed ${seed}: ${values.join(" | ")}`);
  }
  const options: NumCp001Option[] = wrongOptions.map((option) => ({
    value: option.value,
    isCorrect: false,
    misconceptionId: option.misconceptionId,
  }));
  const correctIndex = (seed - 1) % 4;
  options.splice(correctIndex, 0, { value: correctValue, isCorrect: true });
  return options;
}

function basePackage(
  prototypeId: NumCp001Wave01PrototypeId,
  seed: number,
  difficulty: NumCp001Difficulty,
  answerSemantic: NumCp001AnswerSemantic,
): Pick<
  NumCp001Wave01Package,
  | "packageId"
  | "checkpointId"
  | "temporaryPrototypeId"
  | "permanentQlId"
  | "seed"
  | "locale"
  | "difficulty"
  | "answerSemantic"
  | "sourceAncestry"
  | "prototypeAncestry"
  | "lifecycle"
> {
  return {
    packageId: "NUM-001",
    checkpointId: "NUM-CP-001",
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    seed,
    locale: "en-IN",
    difficulty,
    answerSemantic,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: [prototypeId, "NUM-CP-001-WAVE-01"],
    lifecycle: LOCKED_LIFECYCLE,
  };
}

function explanation(
  coreConcept: string,
  strategy: string,
  steps: readonly string[],
  speedMethod: string,
  options: readonly NumCp001Option[],
  finalAnswer: string,
): NumCp001Explanation {
  return {
    coreConcept: [coreConcept],
    givenDataAndStrategy: [strategy],
    stepByStep: steps,
    examSpeedMethod: [speedMethod],
    commonTraps: options
      .filter((option) => !option.isCorrect)
      .map((option) => {
        const trap = option.misconceptionId
          ? MISCONCEPTION_TEXT[option.misconceptionId]
          : undefined;
        if (!trap) throw new Error(`Missing learner-facing trap text for ${option.misconceptionId ?? "unknown"}`);
        return `Choosing “${option.value}” usually means ${trap}.`;
      }),
    finalAnswer,
  };
}

function gcd(first: number, second: number): number {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function isPerfectSquare(value: number): boolean {
  if (value < 0) return false;
  const root = Math.floor(Math.sqrt(value));
  return root * root === value;
}

function smallestSetForInteger(value: number): NumCp001NumberSet {
  if (value > 0) return "NATURAL";
  if (value === 0) return "WHOLE";
  return "INTEGER";
}

function generatePrototype001(seed: number): NumCp001Wave01Package {
  const caseIndex = (seed - 1) % 5;
  const cycle = Math.floor((seed - 1) / 5);
  let display: string;
  let canonicalClass: NumCp001NumberSet;
  let verifierClass: NumCp001NumberSet;
  let difficulty: NumCp001Difficulty;
  let hiddenState: Record<string, unknown>;

  if (caseIndex === 0) {
    const value = 2 + (cycle % 31);
    display = String(value);
    canonicalClass = smallestSetForInteger(value);
    verifierClass = value >= 1 && Number.isInteger(value) ? "NATURAL" : "REAL";
    difficulty = "EASY";
    hiddenState = { representation: "INTEGER", value, naturalStartsAt: 1 };
  } else if (caseIndex === 1) {
    display = "0";
    canonicalClass = "WHOLE";
    verifierClass = Number.isInteger(0) ? "WHOLE" : "REAL";
    difficulty = "MEDIUM";
    hiddenState = { representation: "INTEGER", value: 0, naturalStartsAt: 1 };
  } else if (caseIndex === 2) {
    const value = -(2 + (cycle % 29));
    display = String(value);
    canonicalClass = "INTEGER";
    verifierClass = Number.isInteger(value) && value < 0 ? "INTEGER" : "REAL";
    difficulty = "MEDIUM";
    hiddenState = { representation: "INTEGER", value, naturalStartsAt: 1 };
  } else if (caseIndex === 3) {
    let numerator = 2 + (cycle % 7);
    let denominator = numerator + 2 + (cycle % 3);
    while (gcd(numerator, denominator) !== 1) denominator += 1;
    display = `${numerator}/${denominator}`;
    canonicalClass = "RATIONAL";
    verifierClass = numerator % denominator === 0
      ? smallestSetForInteger(numerator / denominator)
      : "RATIONAL";
    difficulty = "HARD";
    hiddenState = { representation: "FRACTION", numerator, denominator, naturalStartsAt: 1 };
  } else {
    const radicands = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15] as const;
    const radicand = radicands[cycle % radicands.length]!;
    display = `√${radicand}`;
    canonicalClass = "IRRATIONAL";
    verifierClass = isPerfectSquare(radicand)
      ? smallestSetForInteger(Math.floor(Math.sqrt(radicand)))
      : "IRRATIONAL";
    difficulty = "HARD";
    hiddenState = { representation: "SQUARE_ROOT", radicand, naturalStartsAt: 1 };
  }

  const wrongByAnswer: Record<NumCp001NumberSet, readonly { value: NumCp001NumberSet; misconceptionId: string }[]> = {
    NATURAL: [
      { value: "WHOLE", misconceptionId: "CHOSE_LARGER_CONTAINING_SET" },
      { value: "INTEGER", misconceptionId: "SKIPPED_SMALLEST_SET_REQUIREMENT" },
      { value: "RATIONAL", misconceptionId: "CLASSIFIED_BY_TRUE_SUPERSET_ONLY" },
    ],
    WHOLE: [
      { value: "NATURAL", misconceptionId: "IGNORED_NATURAL_STARTS_AT_ONE_CONVENTION" },
      { value: "INTEGER", misconceptionId: "CHOSE_LARGER_CONTAINING_SET" },
      { value: "RATIONAL", misconceptionId: "SKIPPED_SMALLEST_SET_REQUIREMENT" },
    ],
    INTEGER: [
      { value: "WHOLE", misconceptionId: "TREATED_NEGATIVE_INTEGER_AS_WHOLE" },
      { value: "NATURAL", misconceptionId: "IGNORED_SIGN_IN_SET_MEMBERSHIP" },
      { value: "RATIONAL", misconceptionId: "CHOSE_LARGER_CONTAINING_SET" },
    ],
    RATIONAL: [
      { value: "INTEGER", misconceptionId: "ASSUMED_EVERY_FRACTION_IS_AN_INTEGER" },
      { value: "REAL", misconceptionId: "CHOSE_LARGER_CONTAINING_SET" },
      { value: "NATURAL", misconceptionId: "IGNORED_NON_INTEGER_FRACTION" },
    ],
    IRRATIONAL: [
      { value: "RATIONAL", misconceptionId: "ASSUMED_EVERY_SQUARE_ROOT_IS_RATIONAL" },
      { value: "REAL", misconceptionId: "CHOSE_LARGER_CONTAINING_SET" },
      { value: "INTEGER", misconceptionId: "TREATED_NON_SQUARE_ROOT_AS_INTEGER" },
    ],
    REAL: [
      { value: "RATIONAL", misconceptionId: "CLASSIFIED_BY_TRUE_SUPERSET_ONLY" },
      { value: "IRRATIONAL", misconceptionId: "CLASSIFIED_BY_TRUE_SUPERSET_ONLY" },
      { value: "INTEGER", misconceptionId: "CLASSIFIED_BY_TRUE_SUPERSET_ONLY" },
    ],
  };

  const canonicalAnswer = NUMBER_SET_LABELS[canonicalClass];
  const verifierAnswer = NUMBER_SET_LABELS[verifierClass];
  const options = makeOptions(
    canonicalAnswer,
    wrongByAnswer[canonicalClass].map((option) => ({
      value: NUMBER_SET_LABELS[option.value],
      misconceptionId: option.misconceptionId,
    })),
    seed,
  );

  return {
    ...basePackage("NUM-CP001-PROT-001", seed, difficulty, "NUMBER_SET"),
    stem: `In this question, natural numbers begin at 1. What is the smallest listed number set to which ${display} belongs?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { ...hiddenState, canonicalClass },
    mathematicalFingerprint: `NUM-CP001-PROT-001:${JSON.stringify(hiddenState)}`,
    explanation: explanation(
      "Use the smallest applicable set: Natural numbers ⊂ Whole numbers ⊂ Integers ⊂ Rational numbers ⊂ Real numbers; irrational numbers are real but not rational.",
      `Classify ${display} exactly under the stated convention that natural numbers begin at 1.`,
      [
        `The value is ${display}.`,
        `Its most specific listed classification is ${canonicalAnswer}.`,
      ],
      "Check whether the value is a positive integer, zero, a negative integer, a non-integer fraction, or an irrational value before moving to a larger set.",
      options,
      `The smallest applicable set is ${canonicalAnswer}.`,
    ),
  };
}

type EdgeClaimId =
  | "ZERO_EVEN"
  | "ZERO_ODD"
  | "ONE_NATURAL"
  | "ZERO_NATURAL_START_ONE"
  | "NEGATIVE_WHOLE"
  | "NEGATIVE_NATURAL"
  | "NEGATIVE_INTEGER_RATIONAL"
  | "ZERO_WHOLE_INTEGER";

function edgeClaimText(id: EdgeClaimId, negative: number): string {
  const labels: Record<EdgeClaimId, string> = {
    ZERO_EVEN: "0 is an even integer.",
    ZERO_ODD: "0 is an odd integer.",
    ONE_NATURAL: "1 is a natural number.",
    ZERO_NATURAL_START_ONE: "0 is a natural number.",
    NEGATIVE_WHOLE: `${negative} is a whole number.`,
    NEGATIVE_NATURAL: `${negative} is a natural number.`,
    NEGATIVE_INTEGER_RATIONAL: `${negative} is both an integer and a rational number.`,
    ZERO_WHOLE_INTEGER: "0 is both a whole number and an integer.",
  };
  return labels[id];
}

function verifyEdgeClaim(id: EdgeClaimId): boolean {
  switch (id) {
    case "ZERO_EVEN": return 0 % 2 === 0;
    case "ZERO_ODD": return 0 % 2 !== 0;
    case "ONE_NATURAL": return true;
    case "ZERO_NATURAL_START_ONE": return false;
    case "NEGATIVE_WHOLE": return false;
    case "NEGATIVE_NATURAL": return false;
    case "NEGATIVE_INTEGER_RATIONAL": return true;
    case "ZERO_WHOLE_INTEGER": return true;
  }
}

function generatePrototype002(seed: number): NumCp001Wave01Package {
  const negative = -(2 + (Math.floor((seed - 1) / 4) % 20));
  const bundles: readonly {
    readonly difficulty: NumCp001Difficulty;
    readonly claims: readonly EdgeClaimId[];
  }[] = [
    {
      difficulty: "EASY",
      claims: ["ZERO_EVEN", "ZERO_ODD", "ZERO_NATURAL_START_ONE", "NEGATIVE_WHOLE"],
    },
    {
      difficulty: "MEDIUM",
      claims: ["ONE_NATURAL", "ZERO_ODD", "ZERO_NATURAL_START_ONE", "NEGATIVE_WHOLE"],
    },
    {
      difficulty: "HARD",
      claims: ["NEGATIVE_INTEGER_RATIONAL", "NEGATIVE_WHOLE", "NEGATIVE_NATURAL", "ZERO_ODD"],
    },
    {
      difficulty: "MEDIUM",
      claims: ["ZERO_WHOLE_INTEGER", "ZERO_NATURAL_START_ONE", "NEGATIVE_WHOLE", "NEGATIVE_NATURAL"],
    },
  ];
  const bundle = bundles[(seed - 1) % bundles.length]!;
  const truths = bundle.claims.map((id) => verifyEdgeClaim(id));
  if (truths.filter(Boolean).length !== 1) {
    throw new Error("Edge-claim bundle must have exactly one true statement");
  }
  const correctClaimId = bundle.claims[truths.findIndex(Boolean)]!;
  const canonicalAnswer = edgeClaimText(correctClaimId, negative);
  const verifierClaimId = bundle.claims.find((id) => verifyEdgeClaim(id));
  if (!verifierClaimId) throw new Error("Verifier found no correct edge claim");
  const verifierAnswer = edgeClaimText(verifierClaimId, negative);
  const wrongs = bundle.claims
    .filter((id) => id !== correctClaimId)
    .map((id) => ({
      value: edgeClaimText(id, negative),
      misconceptionId: id === "ZERO_ODD"
        ? "ZERO_PARITY_MISCLASSIFIED"
        : id === "ZERO_NATURAL_START_ONE"
          ? "NATURAL_NUMBER_CONVENTION_IGNORED"
          : id === "NEGATIVE_INTEGER_RATIONAL"
            ? "NEGATIVE_INTEGER_NOT_RECOGNISED_AS_RATIONAL"
            : "NEGATIVE_SET_MEMBERSHIP_CONFUSED",
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-002", seed, bundle.difficulty, "BOOLEAN_CLAIM"),
    stem: "In this question, natural numbers begin at 1. Which one of the following statements is correct?",
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { claimIds: bundle.claims, negative, naturalStartsAt: 1, zeroIsEven: true },
    mathematicalFingerprint: `NUM-CP001-PROT-002:${bundle.claims.join(":")}:${negative}`,
    explanation: explanation(
      "Under the stated convention, 1 is natural, 0 is whole but not natural, 0 is even, and every positive or negative integer is rational.",
      "Check each option directly against the set definitions and the parity of zero.",
      bundle.claims.map((id) => `${edgeClaimText(id, negative)} → ${verifyEdgeClaim(id) ? "true" : "false"}.`),
      "Use the boundary facts for 0 and the sign restriction on natural/whole numbers before checking the options.",
      options,
      `The correct statement is: ${canonicalAnswer}`,
    ),
  };
}

function selectionSortAscending(values: readonly number[]): number[] {
  const result = [...values];
  for (let left = 0; left < result.length - 1; left += 1) {
    let minIndex = left;
    for (let index = left + 1; index < result.length; index += 1) {
      if (result[index]! < result[minIndex]!) minIndex = index;
    }
    [result[left], result[minIndex]] = [result[minIndex]!, result[left]!];
  }
  return result;
}

function formatOrder(values: readonly number[]): string {
  return values.join(" < ");
}

function generatePrototype003(seed: number): NumCp001Wave01Package {
  const tier = (seed - 1) % 3;
  const cycle = Math.floor((seed - 1) / 3);
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[tier]!;
  let values: number[];

  if (tier === 0) {
    values = [-(3 + (cycle % 8)), 2 + (cycle % 5), 10 + (cycle % 7)];
  } else if (tier === 1) {
    values = [-(13 + (cycle % 8)), -(3 + (cycle % 6)), 2 + (cycle % 5), 11 + (cycle % 8)];
  } else {
    values = [-(18 + (cycle % 9)), -(5 + (cycle % 7)), 0, 3 + (cycle % 6), 14 + (cycle % 9)];
  }

  const rotation = (seed - 1) % values.length;
  const shown = [...values.slice(rotation), ...values.slice(0, rotation)];
  const canonicalValues = [...shown].sort((a, b) => a - b);
  const verifierValues = selectionSortAscending(shown);
  const canonicalAnswer = formatOrder(canonicalValues);
  const verifierAnswer = formatOrder(verifierValues);

  const reversed = [...canonicalValues].reverse();
  const swapFirst = [...canonicalValues];
  [swapFirst[0], swapFirst[1]] = [swapFirst[1]!, swapFirst[0]!];
  const swapLast = [...canonicalValues];
  const last = swapLast.length - 1;
  [swapLast[last - 1], swapLast[last]] = [swapLast[last]!, swapLast[last - 1]!];

  const options = makeOptions(canonicalAnswer, [
    { value: formatOrder(reversed), misconceptionId: "ORDER_REVERSED" },
    { value: formatOrder(swapFirst), misconceptionId: "NEGATIVE_ORDER_REVERSED" },
    { value: formatOrder(swapLast), misconceptionId: "POSITIVE_ORDER_SWAP" },
  ], seed);

  return {
    ...basePackage("NUM-CP001-PROT-003", seed, difficulty, "ORDERED_LIST"),
    stem: `Arrange ${shown.join(", ")} in ascending order.`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { shown, canonicalValues, tier },
    mathematicalFingerprint: `NUM-CP001-PROT-003:${shown.join(":")}`,
    explanation: explanation(
      "On a number line, a value farther to the left is smaller. Among negative numbers, the number with the larger magnitude is the smaller signed value.",
      `Place ${shown.join(", ")} from left to right on the number line.`,
      [
        `First place the negative values in their correct signed order${shown.includes(0) ? ", then place 0" : ""}.`,
        `Place the positive values from smaller to larger.`,
        `The complete ascending order is ${canonicalAnswer}.`,
      ],
      "Handle negatives first by reversing their magnitude order, then continue through zero to the positive values.",
      options,
      `Ascending order: ${canonicalAnswer}.`,
    ),
  };
}

function distanceByUnitIntervals(first: number, second: number): number {
  let current = Math.min(first, second);
  const target = Math.max(first, second);
  let count = 0;
  while (current < target) {
    current += 1;
    count += 1;
  }
  return count;
}

function uniqueDistanceDistractors(
  first: number,
  second: number,
  canonical: number,
): { value: string; misconceptionId: string }[] {
  const candidates = [
    { value: String(first - second), misconceptionId: "USED_SIGNED_DISPLACEMENT" },
    { value: String(canonical + 1), misconceptionId: "COUNTED_POINTS_INSTEAD_OF_UNIT_INTERVALS" },
    { value: String(Math.max(0, canonical - 1)), misconceptionId: "UNDERCOUNTED_UNIT_INTERVALS" },
    { value: String(Math.abs(Math.abs(first) - Math.abs(second))), misconceptionId: "SUBTRACTED_DISTANCES_FROM_ZERO" },
    { value: String(Math.abs(first) + Math.abs(second)), misconceptionId: "ADDED_DISTANCES_FROM_ZERO" },
  ];
  const seen = new Set([String(canonical)]);
  const result: { value: string; misconceptionId: string }[] = [];
  for (const candidate of candidates) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    result.push(candidate);
    if (result.length === 3) break;
  }
  if (result.length !== 3) throw new Error("Unable to build three unique distance distractors");
  return result;
}

function generatePrototype004(seed: number): NumCp001Wave01Package {
  const tier = (seed - 1) % 3;
  const cycle = Math.floor((seed - 1) / 3);
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[tier]!;
  let first: number;
  let second: number;

  if (tier === 0) {
    first = 2 + (cycle % 12);
    second = first + 4 + (cycle % 8);
  } else if (tier === 1) {
    second = -(2 + (cycle % 8));
    first = second - 5 - (cycle % 7);
  } else {
    first = -(3 + (cycle % 15));
    second = 4 + ((cycle * 3 + 2) % 17);
  }

  const canonical = Math.abs(second - first);
  const verifier = distanceByUnitIntervals(first, second);
  const canonicalAnswer = String(canonical);
  const verifierAnswer = String(verifier);
  const options = makeOptions(
    canonicalAnswer,
    uniqueDistanceDistractors(first, second, canonical),
    seed,
  );

  return {
    ...basePackage("NUM-CP001-PROT-004", seed, difficulty, "DISTANCE"),
    stem: `Point A represents ${first} and point B represents ${second} on a number line. What is the distance AB?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { first, second, crossesZero: first < 0 && second > 0, tier },
    mathematicalFingerprint: `NUM-CP001-PROT-004:${first}:${second}`,
    explanation: explanation(
      "Distance on a number line is the absolute difference between the two coordinates, so it is never negative.",
      `Compute |${second} - (${first})|.`,
      [
        `${second} - (${first}) = ${second - first}.`,
        `Taking the absolute value gives ${canonical}.`,
      ],
      first < 0 && second > 0
        ? "Because the points are on opposite sides of zero, their distances from zero can be added."
        : "Because both points are on the same side of zero, subtract the smaller magnitude gap from the larger coordinate position rather than adding both magnitudes.",
      options,
      `The distance AB is ${canonical}.`,
    ),
  };
}

function intervalNotation(
  lower: number,
  upper: number,
  includeLower: boolean,
  includeUpper: boolean,
): string {
  return `${includeLower ? "[" : "("}${lower}, ${upper}${includeUpper ? "]" : ")"}`;
}

function countIntervalByEnumeration(
  lower: number,
  upper: number,
  includeLower: boolean,
  includeUpper: boolean,
): number {
  let count = 0;
  for (let value = lower; value <= upper; value += 1) {
    if (value === lower && !includeLower) continue;
    if (value === upper && !includeUpper) continue;
    count += 1;
  }
  return count;
}

function generatePrototype005(seed: number): NumCp001Wave01Package {
  const cycle = Math.floor((seed - 1) / 4);
  const lower = -(8 + (cycle % 8));
  const upper = lower + 6 + (cycle % 6);
  const topology = (seed - 1) % 4;
  const includeLower = topology === 0 || topology === 1;
  const includeUpper = topology === 0 || topology === 2;
  const difficulty: NumCp001Difficulty = topology === 0
    ? "EASY"
    : topology === 3
      ? "HARD"
      : "MEDIUM";
  const span = upper - lower;
  const canonical = span + 1 - (includeLower ? 0 : 1) - (includeUpper ? 0 : 1);
  const verifier = countIntervalByEnumeration(lower, upper, includeLower, includeUpper);
  const candidateWrongs = [
    { value: String(span + 1), misconceptionId: "COUNTED_BOTH_ENDPOINTS" },
    { value: String(span), misconceptionId: "TREATED_INTERVAL_AS_HALF_OPEN" },
    { value: String(span - 1), misconceptionId: "EXCLUDED_BOTH_ENDPOINTS" },
    { value: String(span + 2), misconceptionId: "ADDED_EXTRA_ENDPOINT" },
    { value: String(Math.max(0, span - 2)), misconceptionId: "REMOVED_TOO_MANY_ENDPOINT_VALUES" },
  ];
  const seen = new Set([String(canonical)]);
  const wrongs: { value: string; misconceptionId: string }[] = [];
  for (const candidate of candidateWrongs) {
    if (seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    wrongs.push(candidate);
    if (wrongs.length === 3) break;
  }
  if (wrongs.length !== 3) throw new Error(`Unable to build interval distractors for seed ${seed}`);
  const options = makeOptions(String(canonical), wrongs, seed);
  const notation = intervalNotation(lower, upper, includeLower, includeUpper);

  return {
    ...basePackage("NUM-CP001-PROT-005", seed, difficulty, "COUNT"),
    stem: `How many integers lie in the interval ${notation}?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer: String(canonical),
    verifierAnswer: String(verifier),
    hiddenState: { lower, upper, includeLower, includeUpper, topology: notation },
    mathematicalFingerprint: `NUM-CP001-PROT-005:${lower}:${upper}:${Number(includeLower)}:${Number(includeUpper)}`,
    explanation: explanation(
      "For integer endpoints, a square bracket includes that endpoint and a round bracket excludes it.",
      `Count the ${span + 1} integers from ${lower} through ${upper}, then apply the endpoint rules shown by ${notation}.`,
      [
        `The inclusive count from ${lower} to ${upper} is ${span + 1}.`,
        `${includeLower ? "Keep" : "Remove"} the lower endpoint ${lower}.`,
        `${includeUpper ? "Keep" : "Remove"} the upper endpoint ${upper}.`,
        `The final count is ${canonical}.`,
      ],
      "With integer endpoints, start with upper − lower + 1 and subtract one for each open endpoint.",
      options,
      `There are ${canonical} integers in ${notation}.`,
    ),
  };
}

interface ExpressionOptionState {
  readonly text: string;
  readonly value: number;
}

function generatePrototype006(seed: number): NumCp001Wave01Package {
  const topology = (seed - 1) % 3;
  const cycle = Math.floor((seed - 1) / 3);
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[topology]!;
  const odd = 2 * (2 + (cycle % 13)) + 1;
  const secondOdd = odd + 2;
  const even = 2 * (3 + (cycle % 11));
  let expressions: readonly ExpressionOptionState[];

  if (topology === 0) {
    expressions = [
      { text: `${odd} + ${even}`, value: odd + even },
      { text: `${odd} + ${secondOdd}`, value: odd + secondOdd },
      { text: `${even} × ${odd}`, value: even * odd },
      { text: `${even}²`, value: even * even },
    ];
  } else if (topology === 1) {
    expressions = [
      { text: `${odd} × ${secondOdd}`, value: odd * secondOdd },
      { text: `${even} + ${even + 2}`, value: even + even + 2 },
      { text: `${even} × ${secondOdd}`, value: even * secondOdd },
      { text: `${odd} + ${secondOdd}`, value: odd + secondOdd },
    ];
  } else {
    expressions = [
      { text: `${odd}³`, value: odd * odd * odd },
      { text: `${odd} - ${secondOdd}`, value: odd - secondOdd },
      { text: `${even}³`, value: even * even * even },
      { text: `${odd} + ${secondOdd}`, value: odd + secondOdd },
    ];
  }

  const oddExpressions = expressions.filter((item) => Math.abs(item.value) % 2 === 1);
  if (oddExpressions.length !== 1) {
    throw new Error(`Parity expression topology is not unique for seed ${seed}`);
  }
  const canonicalAnswer = oddExpressions[0]!.text;
  const verifierAnswer = expressions.find((item) => Math.abs(item.value) % 2 === 1)?.text;
  if (!verifierAnswer) throw new Error("Parity verifier found no odd expression");
  const wrongIds = [
    "ODD_PLUS_ODD_RULE_CONFUSED",
    "EVEN_FACTOR_PRODUCT_RULE_IGNORED",
    "EVEN_POWER_RULE_IGNORED",
  ] as const;
  const wrongs = expressions
    .filter((item) => item.text !== canonicalAnswer)
    .map((item, index) => ({
      value: item.text,
      misconceptionId: wrongIds[index]!,
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-006", seed, difficulty, "PARITY_CLASS"),
    stem: "Which one of the following expressions has an odd value?",
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { odd, secondOdd, even, topology, expressions },
    mathematicalFingerprint: `NUM-CP001-PROT-006:${topology}:${odd}:${even}`,
    explanation: explanation(
      "Odd ± even is odd; odd × odd is odd; a product with an even factor is even; an integer power has the same parity as its base.",
      "Use parity rules first and calculate full values only as a check.",
      expressions.map((item) => `${item.text} = ${item.value}, which is ${Math.abs(item.value) % 2 === 1 ? "odd" : "even"}.`),
      "Reduce each number mentally to O or E and apply the parity rule in one step.",
      options,
      `${canonicalAnswer} is the only expression with an odd value.`,
    ),
  };
}

type ParityClaimId =
  | "N_IS_EVEN"
  | "N_IS_ODD"
  | "CONSECUTIVE_PRODUCT_EVEN"
  | "CONSECUTIVE_PRODUCT_ODD"
  | "SQUARE_EVEN"
  | "SQUARE_ODD"
  | "POLYNOMIAL_ALWAYS_ODD"
  | "POLYNOMIAL_NEVER_ODD";

interface ParityClaimConfig {
  readonly text: string;
  readonly classId: NumCp001ClaimClass;
  readonly difficulty: NumCp001Difficulty;
  readonly rule: string;
}

const PARITY_CLAIMS: Record<ParityClaimId, ParityClaimConfig> = {
  N_IS_EVEN: {
    text: "n is even",
    classId: "TRUE_FOR_EVEN_N_ONLY",
    difficulty: "EASY",
    rule: "The statement is true exactly for even integers and false for odd integers.",
  },
  N_IS_ODD: {
    text: "n is odd",
    classId: "TRUE_FOR_ODD_N_ONLY",
    difficulty: "EASY",
    rule: "The statement is true exactly for odd integers and false for even integers.",
  },
  CONSECUTIVE_PRODUCT_EVEN: {
    text: "n(n + 1) is even",
    classId: "ALWAYS_TRUE",
    difficulty: "MEDIUM",
    rule: "n and n + 1 are consecutive integers, so one of them must be even; their product is therefore always even.",
  },
  CONSECUTIVE_PRODUCT_ODD: {
    text: "n(n + 1) is odd",
    classId: "NEVER_TRUE",
    difficulty: "MEDIUM",
    rule: "Among two consecutive integers one is even, so n(n + 1) can never be odd.",
  },
  SQUARE_EVEN: {
    text: "n² is even",
    classId: "TRUE_FOR_EVEN_N_ONLY",
    difficulty: "MEDIUM",
    rule: "Squaring preserves integer parity: an even n gives an even square and an odd n gives an odd square.",
  },
  SQUARE_ODD: {
    text: "n² is odd",
    classId: "TRUE_FOR_ODD_N_ONLY",
    difficulty: "MEDIUM",
    rule: "Squaring preserves integer parity: an odd n gives an odd square and an even n gives an even square.",
  },
  POLYNOMIAL_ALWAYS_ODD: {
    text: "n² + n + 1 is odd",
    classId: "ALWAYS_TRUE",
    difficulty: "HARD",
    rule: "n² + n = n(n + 1) is always even; adding 1 makes the result always odd.",
  },
  POLYNOMIAL_NEVER_ODD: {
    text: "n² + n is odd",
    classId: "NEVER_TRUE",
    difficulty: "HARD",
    rule: "n² + n = n(n + 1), the product of consecutive integers, so it is always even and never odd.",
  },
};

function evaluateParityClaim(id: ParityClaimId, n: number): boolean {
  switch (id) {
    case "N_IS_EVEN": return n % 2 === 0;
    case "N_IS_ODD": return Math.abs(n) % 2 === 1;
    case "CONSECUTIVE_PRODUCT_EVEN": return (n * (n + 1)) % 2 === 0;
    case "CONSECUTIVE_PRODUCT_ODD": return Math.abs(n * (n + 1)) % 2 === 1;
    case "SQUARE_EVEN": return (n * n) % 2 === 0;
    case "SQUARE_ODD": return Math.abs(n * n) % 2 === 1;
    case "POLYNOMIAL_ALWAYS_ODD": return Math.abs(n * n + n + 1) % 2 === 1;
    case "POLYNOMIAL_NEVER_ODD": return Math.abs(n * n + n) % 2 === 1;
  }
}

function classifyParityClaimByWitnesses(id: ParityClaimId): NumCp001ClaimClass {
  const witnesses = Array.from({ length: 21 }, (_, index) => index - 10);
  const evenWitnesses = witnesses.filter((n) => n % 2 === 0);
  const oddWitnesses = witnesses.filter((n) => Math.abs(n) % 2 === 1);
  if (witnesses.every((n) => evaluateParityClaim(id, n))) return "ALWAYS_TRUE";
  if (witnesses.every((n) => !evaluateParityClaim(id, n))) return "NEVER_TRUE";
  if (
    evenWitnesses.every((n) => evaluateParityClaim(id, n))
    && oddWitnesses.every((n) => !evaluateParityClaim(id, n))
  ) return "TRUE_FOR_EVEN_N_ONLY";
  if (
    oddWitnesses.every((n) => evaluateParityClaim(id, n))
    && evenWitnesses.every((n) => !evaluateParityClaim(id, n))
  ) return "TRUE_FOR_ODD_N_ONLY";
  throw new Error(`Witness verifier found an unsupported parity topology for ${id}`);
}

function generatePrototype007(seed: number): NumCp001Wave01Package {
  const claimIds = Object.keys(PARITY_CLAIMS) as ParityClaimId[];
  const claimId = claimIds[(seed - 1) % claimIds.length]!;
  const config = PARITY_CLAIMS[claimId];
  const canonicalAnswer = CLAIM_CLASS_LABELS[config.classId];
  const verifierClass = classifyParityClaimByWitnesses(claimId);
  const verifierAnswer = CLAIM_CLASS_LABELS[verifierClass];
  const allClasses: readonly NumCp001ClaimClass[] = [
    "ALWAYS_TRUE",
    "TRUE_FOR_EVEN_N_ONLY",
    "TRUE_FOR_ODD_N_ONLY",
    "NEVER_TRUE",
  ];
  const wrongs = allClasses
    .filter((classId) => classId !== config.classId)
    .map((classId) => ({
      value: CLAIM_CLASS_LABELS[classId],
      misconceptionId: classId === "ALWAYS_TRUE"
        ? "SINGLE_TRUE_EXAMPLE_GENERALIZED"
        : classId === "NEVER_TRUE"
          ? "SINGLE_FALSE_EXAMPLE_GENERALIZED"
          : config.classId === "ALWAYS_TRUE" || config.classId === "NEVER_TRUE"
            ? "UNIVERSAL_PARITY_RULE_MISSED"
            : "EVEN_ODD_CASES_CONFUSED",
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);
  const witnesses = [-2, -1, 0, 1, 2];
  const witnessSummary = witnesses
    .map((n) => `${n}: ${evaluateParityClaim(claimId, n) ? "true" : "false"}`)
    .join(", ");

  return {
    ...basePackage("NUM-CP001-PROT-007", seed, config.difficulty, "BOOLEAN_CLAIM"),
    stem: `For every integer n, which description is correct for the statement “${config.text}”?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { claimId, classId: config.classId, witnessSummary },
    mathematicalFingerprint: `NUM-CP001-PROT-007:${claimId}`,
    explanation: explanation(
      config.rule,
      `Check the parity rule behind “${config.text}”, using a few even and odd integers only as verification.`,
      [
        `For n = -2, -1, 0, 1, 2 the statement is respectively: ${witnessSummary}.`,
        config.rule,
        `Therefore the correct description is “${canonicalAnswer}”.`,
      ],
      "Split the problem into even-n and odd-n cases; if both cases give the same truth value, the statement is always or never true.",
      options,
      `The statement is ${canonicalAnswer.toLowerCase()}.`,
    ),
  };
}

function tuple(values: readonly number[]): string {
  return `(${values.join(", ")})`;
}

function recoverConsecutiveByEnumeration(sum: number, length: number): number[] | null {
  for (let start = -80; start <= 80; start += 1) {
    const values = Array.from({ length }, (_, index) => start + index);
    if (values.reduce((total, value) => total + value, 0) === sum) return values;
  }
  return null;
}

function generatePrototype008(seed: number): NumCp001Wave01Package {
  const tier = (seed - 1) % 3;
  const cycle = Math.floor((seed - 1) / 3);
  const length = [3, 4, 5][tier]!;
  const difficulty = (["EASY", "MEDIUM", "HARD"] as const)[tier]!;
  const start = -12 + (cycle % 35);
  const values = Array.from({ length }, (_, index) => start + index);
  const sum = values.reduce((total, value) => total + value, 0);
  const recoveredStart = (2 * sum / length - (length - 1)) / 2;
  if (!Number.isInteger(recoveredStart)) {
    throw new Error(`Constructed consecutive state became infeasible for seed ${seed}`);
  }
  const canonicalValues = Array.from({ length }, (_, index) => recoveredStart + index);
  const verifierValues = recoverConsecutiveByEnumeration(sum, length);
  if (!verifierValues) throw new Error(`Verifier found no consecutive block for seed ${seed}`);
  const canonicalAnswer = tuple(canonicalValues);
  const verifierAnswer = tuple(verifierValues);
  const shiftDown = canonicalValues.map((value) => value - 1);
  const shiftUp = canonicalValues.map((value) => value + 1);
  const stepTwo = canonicalValues.map((_, index) => recoveredStart + 2 * index);
  const options = makeOptions(canonicalAnswer, [
    { value: tuple(shiftDown), misconceptionId: "BLOCK_SHIFTED_ONE_TOO_LOW" },
    { value: tuple(shiftUp), misconceptionId: "BLOCK_SHIFTED_ONE_TOO_HIGH" },
    { value: tuple(stepTwo), misconceptionId: "USED_CONSECUTIVE_SAME_PARITY_NUMBERS" },
  ], seed);

  return {
    ...basePackage("NUM-CP001-PROT-008", seed, difficulty, "NUMBER_TUPLE"),
    stem: `The sum of ${length} consecutive integers is ${sum}. Which ordered tuple gives those integers?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { length, sum, start, values },
    mathematicalFingerprint: `NUM-CP001-PROT-008:${length}:${sum}`,
    explanation: explanation(
      "Consecutive integers differ by 1, and their average locates the centre of the block.",
      `Use the sum ${sum} and the block length ${length} to recover the first integer, then increase by 1 each time.`,
      [
        `Let the first integer be x. The block is x, x + 1, …, x + ${length - 1}.`,
        `Its sum is ${length}x + ${length * (length - 1) / 2} = ${sum}.`,
        `Solving gives x = ${recoveredStart}.`,
        `So the block is ${canonicalAnswer}.`,
      ],
      "Divide the sum by the number of terms to locate the centre, then write consecutive integers around that centre.",
      options,
      `The consecutive integers are ${canonicalAnswer}.`,
    ),
  };
}

export function generateNumCp001Wave01Package(
  prototypeId: NumCp001Wave01PrototypeId,
  seed: number,
): NumCp001Wave01Package {
  if (!NUM_CP001_WAVE01_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown NUM-CP-001 Wave 1 prototype: ${prototypeId}`);
  }
  if (!Number.isInteger(seed) || seed <= 0) {
    throw new Error("Seed must be a positive integer");
  }

  switch (prototypeId) {
    case "NUM-CP001-PROT-001": return generatePrototype001(seed);
    case "NUM-CP001-PROT-002": return generatePrototype002(seed);
    case "NUM-CP001-PROT-003": return generatePrototype003(seed);
    case "NUM-CP001-PROT-004": return generatePrototype004(seed);
    case "NUM-CP001-PROT-005": return generatePrototype005(seed);
    case "NUM-CP001-PROT-006": return generatePrototype006(seed);
    case "NUM-CP001-PROT-007": return generatePrototype007(seed);
    case "NUM-CP001-PROT-008": return generatePrototype008(seed);
  }
}

export function generateNumCp001Wave01Sweep(
  seedsPerPrototype: number,
): NumCp001Wave01Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("seedsPerPrototype must be a positive integer");
  }
  const result: NumCp001Wave01Package[] = [];
  for (const prototypeId of NUM_CP001_WAVE01_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      result.push(generateNumCp001Wave01Package(prototypeId, seed));
    }
  }
  return result;
}