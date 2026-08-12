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

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

function difficultyForSeed(seed: number): NumCp001Difficulty {
  return DIFFICULTIES[(seed - 1) % DIFFICULTIES.length]!;
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

function makeOptions(
  correctValue: string,
  wrongOptions: readonly { value: string; misconceptionId: string }[],
  seed: number,
): NumCp001Option[] {
  if (wrongOptions.length !== 3) throw new Error("Wave 1 requires exactly three misconception-owned distractors");
  const values = [correctValue, ...wrongOptions.map((option) => option.value)];
  if (new Set(values).size !== 4) throw new Error(`Duplicate option value for seed ${seed}: ${values.join(" | ")}`);
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
    difficulty: difficultyForSeed(seed),
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
      .map((option) => `${option.value}: ${option.misconceptionId}.`),
    finalAnswer,
  };
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
  let canonicalAnswer: NumCp001NumberSet;
  let verifierAnswer: NumCp001NumberSet;
  let hiddenState: Record<string, unknown>;

  if (caseIndex === 0) {
    const value = 2 + (cycle % 31);
    display = String(value);
    canonicalAnswer = smallestSetForInteger(value);
    verifierAnswer = value >= 1 && Number.isInteger(value) ? "NATURAL" : "REAL";
    hiddenState = { representation: "INTEGER", value, naturalStartsAt: 1 };
  } else if (caseIndex === 1) {
    const value = 0;
    display = "0";
    canonicalAnswer = smallestSetForInteger(value);
    verifierAnswer = Number.isInteger(value) && value === 0 ? "WHOLE" : "REAL";
    hiddenState = { representation: "INTEGER", value, naturalStartsAt: 1 };
  } else if (caseIndex === 2) {
    const value = -(2 + (cycle % 29));
    display = String(value);
    canonicalAnswer = smallestSetForInteger(value);
    verifierAnswer = Number.isInteger(value) && value < 0 ? "INTEGER" : "REAL";
    hiddenState = { representation: "INTEGER", value, naturalStartsAt: 1 };
  } else if (caseIndex === 3) {
    let numerator = 2 + (cycle % 7);
    let denominator = numerator + 2 + (cycle % 3);
    while (gcd(numerator, denominator) !== 1) denominator += 1;
    display = `${numerator}/${denominator}`;
    canonicalAnswer = "RATIONAL";
    verifierAnswer = numerator % denominator === 0
      ? smallestSetForInteger(numerator / denominator)
      : "RATIONAL";
    hiddenState = { representation: "FRACTION", numerator, denominator, naturalStartsAt: 1 };
  } else {
    const radicands = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15] as const;
    const radicand = radicands[cycle % radicands.length]!;
    display = `√${radicand}`;
    canonicalAnswer = "IRRATIONAL";
    verifierAnswer = isPerfectSquare(radicand)
      ? smallestSetForInteger(Math.floor(Math.sqrt(radicand)))
      : "IRRATIONAL";
    hiddenState = { representation: "SQUARE_ROOT", radicand, naturalStartsAt: 1 };
  }

  const wrongByAnswer: Record<NumCp001NumberSet, readonly { value: string; misconceptionId: string }[]> = {
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
      { value: "RATIONAL", misconceptionId: "MISCLASSIFIED_REAL_SUBSET" },
      { value: "IRRATIONAL", misconceptionId: "MISCLASSIFIED_REAL_SUBSET" },
      { value: "INTEGER", misconceptionId: "MISCLASSIFIED_REAL_SUBSET" },
    ],
  };
  const options = makeOptions(canonicalAnswer, wrongByAnswer[canonicalAnswer], seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);

  return {
    ...basePackage("NUM-CP001-PROT-001", seed, "NUMBER_SET"),
    stem: `In this question, natural numbers begin at 1. What is the smallest listed number set to which ${display} belongs?`,
    options,
    correctIndex,
    canonicalAnswer,
    verifierAnswer,
    hiddenState,
    mathematicalFingerprint: `NUM-CP001-PROT-001:${JSON.stringify(hiddenState)}`,
    explanation: explanation(
      "Use the smallest applicable set in the chain Natural ⊂ Whole ⊂ Integer ⊂ Rational ⊂ Real, while irrational real numbers form a separate class from rational numbers.",
      `Classify ${display} exactly under the stated convention that natural numbers begin at 1.`,
      [
        `The displayed value is ${display}.`,
        `Applying the set definition gives ${canonicalAnswer} as the smallest applicable listed set.`,
      ],
      "Check sign and integrality first; only then move outward to larger sets.",
      options,
      `The smallest applicable set is ${canonicalAnswer}.`,
    ),
  };
}

type EdgeClaimId =
  | "ZERO_EVEN"
  | "ZERO_ODD"
  | "ONE_PRIME"
  | "ONE_COMPOSITE"
  | "ONE_NATURAL"
  | "ZERO_NATURAL_START_ONE"
  | "NEGATIVE_WHOLE"
  | "NEGATIVE_INTEGER_RATIONAL"
  | "ZERO_WHOLE_INTEGER";

function edgeClaimText(id: EdgeClaimId, negative: number): string {
  const labels: Record<EdgeClaimId, string> = {
    ZERO_EVEN: "0 is an even integer.",
    ZERO_ODD: "0 is an odd integer.",
    ONE_PRIME: "1 is a prime number.",
    ONE_COMPOSITE: "1 is a composite number.",
    ONE_NATURAL: "1 is a natural number.",
    ZERO_NATURAL_START_ONE: "0 is a natural number.",
    NEGATIVE_WHOLE: `${negative} is a whole number.`,
    NEGATIVE_INTEGER_RATIONAL: `${negative} is both an integer and a rational number.`,
    ZERO_WHOLE_INTEGER: "0 is both a whole number and an integer.",
  };
  return labels[id];
}

function verifyEdgeClaim(id: EdgeClaimId): boolean {
  switch (id) {
    case "ZERO_EVEN": return 0 % 2 === 0;
    case "ZERO_ODD": return 0 % 2 !== 0;
    case "ONE_PRIME": return false;
    case "ONE_COMPOSITE": return false;
    case "ONE_NATURAL": return true;
    case "ZERO_NATURAL_START_ONE": return false;
    case "NEGATIVE_WHOLE": return false;
    case "NEGATIVE_INTEGER_RATIONAL": return true;
    case "ZERO_WHOLE_INTEGER": return true;
  }
}

function generatePrototype002(seed: number): NumCp001Wave01Package {
  const negative = -(2 + (Math.floor((seed - 1) / 4) % 20));
  const bundles: readonly (readonly EdgeClaimId[])[] = [
    ["ZERO_EVEN", "ZERO_ODD", "ONE_PRIME", "NEGATIVE_WHOLE"],
    ["ONE_NATURAL", "ONE_COMPOSITE", "ZERO_NATURAL_START_ONE", "NEGATIVE_WHOLE"],
    ["NEGATIVE_INTEGER_RATIONAL", "ZERO_ODD", "ONE_PRIME", "ONE_COMPOSITE"],
    ["ZERO_WHOLE_INTEGER", "ZERO_NATURAL_START_ONE", "ONE_COMPOSITE", "NEGATIVE_WHOLE"],
  ];
  const claimIds = bundles[(seed - 1) % bundles.length]!;
  const truths = claimIds.map((id) => verifyEdgeClaim(id));
  if (truths.filter(Boolean).length !== 1) throw new Error("Edge-claim bundle must have exactly one true statement");
  const correctClaimId = claimIds[truths.findIndex(Boolean)]!;
  const canonicalAnswer = edgeClaimText(correctClaimId, negative);
  const verifierClaimId = claimIds.find((id) => verifyEdgeClaim(id));
  if (!verifierClaimId) throw new Error("Verifier found no correct edge claim");
  const verifierAnswer = edgeClaimText(verifierClaimId, negative);
  const wrongs = claimIds
    .filter((id) => id !== correctClaimId)
    .map((id) => ({
      value: edgeClaimText(id, negative),
      misconceptionId: id === "ZERO_ODD"
        ? "ZERO_PARITY_MISCLASSIFIED"
        : id === "ONE_PRIME" || id === "ONE_COMPOSITE"
          ? "ONE_PRIME_COMPOSITE_BOUNDARY_IGNORED"
          : id === "ZERO_NATURAL_START_ONE"
            ? "NATURAL_NUMBER_CONVENTION_IGNORED"
            : "NEGATIVE_SET_MEMBERSHIP_CONFUSED",
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-002", seed, "BOOLEAN_CLAIM"),
    stem: "In this question, natural numbers begin at 1. Which one of the following statements is correct?",
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { claimIds, negative, naturalStartsAt: 1, zeroIsEven: true },
    mathematicalFingerprint: `NUM-CP001-PROT-002:${claimIds.join(":")}:${negative}`,
    explanation: explanation(
      "Zero is even; with natural numbers starting at 1, zero is whole but not natural; one is neither prime nor composite; every integer is rational.",
      "Check each statement against the explicitly stated set convention and the boundary facts for zero and one.",
      claimIds.map((id) => `${edgeClaimText(id, negative)} → ${verifyEdgeClaim(id) ? "true" : "false"}.`),
      "For zero/one questions, write the boundary facts first instead of relying on memory shortcuts.",
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
  const cycle = Math.floor((seed - 1) / 4);
  const values = [
    -(12 + (cycle % 9)),
    -(3 + (cycle % 6)),
    2 + (cycle % 5),
    11 + (cycle % 8),
  ];
  const rotation = (seed - 1) % values.length;
  const shown = [...values.slice(rotation), ...values.slice(0, rotation)];
  const canonicalValues = [...shown].sort((a, b) => a - b);
  const verifierValues = selectionSortAscending(shown);
  const canonicalAnswer = formatOrder(canonicalValues);
  const verifierAnswer = formatOrder(verifierValues);
  const reversed = [...canonicalValues].reverse();
  const swapFirst = [...canonicalValues];
  [swapFirst[0], swapFirst[1]] = [swapFirst[1]!, swapFirst[0]!];
  const absoluteOrder = [...shown].sort((a, b) => Math.abs(a) - Math.abs(b));
  const wrongs = [
    { value: formatOrder(reversed), misconceptionId: "ORDER_REVERSED" },
    { value: formatOrder(swapFirst), misconceptionId: "NEGATIVE_ORDER_REVERSED" },
    { value: formatOrder(absoluteOrder), misconceptionId: "ORDERED_BY_ABSOLUTE_VALUE" },
  ];
  if (new Set([canonicalAnswer, ...wrongs.map((item) => item.value)]).size !== 4) {
    wrongs[2] = {
      value: formatOrder([canonicalValues[0]!, canonicalValues[1]!, canonicalValues[3]!, canonicalValues[2]!]),
      misconceptionId: "POSITIVE_ORDER_SWAP",
    };
  }
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-003", seed, "ORDERED_LIST"),
    stem: `Arrange ${shown.join(", ")} in ascending order.`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { shown, canonicalValues },
    mathematicalFingerprint: `NUM-CP001-PROT-003:${shown.join(":")}`,
    explanation: explanation(
      "On the number line, a number farther left is smaller; among negative numbers, the one with larger absolute value is smaller.",
      `Place the four signed integers mentally from left to right: ${shown.join(", ")}.`,
      [
        `The negative values come before the positive values.`,
        `Among the negatives, ${canonicalValues[0]} < ${canonicalValues[1]}.`,
        `Therefore the complete ascending order is ${canonicalAnswer}.`,
      ],
      "For two negatives, compare magnitudes and reverse the magnitude order.",
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

function generatePrototype004(seed: number): NumCp001Wave01Package {
  const cycle = Math.floor((seed - 1) / 4);
  const first = -(3 + (cycle % 17));
  const second = 4 + ((cycle * 3 + seed) % 19);
  const canonical = Math.abs(second - first);
  const verifier = distanceByUnitIntervals(first, second);
  const canonicalAnswer = String(canonical);
  const verifierAnswer = String(verifier);
  const wrongs = [
    { value: String(first - second), misconceptionId: "USED_SIGNED_DISPLACEMENT" },
    { value: String(Math.abs(Math.abs(first) - Math.abs(second))), misconceptionId: "SUBTRACTED_DISTANCES_FROM_ZERO" },
    { value: String(canonical + 1), misconceptionId: "COUNTED_POINTS_INSTEAD_OF_UNIT_INTERVALS" },
  ];
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-004", seed, "DISTANCE"),
    stem: `Point A represents ${first} and point B represents ${second} on a number line. What is the distance AB?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { first, second, crossesZero: first < 0 && second > 0 },
    mathematicalFingerprint: `NUM-CP001-PROT-004:${first}:${second}`,
    explanation: explanation(
      "Distance on a number line is the absolute difference between the coordinates.",
      `Use |${second} - (${first})| rather than a signed displacement.`,
      [
        `${second} - (${first}) = ${second - first}.`,
        `Taking absolute value gives ${canonical}.`,
      ],
      "When the points lie on opposite sides of zero, add their distances from zero.",
      options,
      `The distance AB is ${canonical}.`,
    ),
  };
}

function intervalNotation(lower: number, upper: number, includeLower: boolean, includeUpper: boolean): string {
  return `${includeLower ? "[" : "("}${lower}, ${upper}${includeUpper ? "]" : ")"}`;
}

function countIntervalByEnumeration(lower: number, upper: number, includeLower: boolean, includeUpper: boolean): number {
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
  const wrongs = candidateWrongs.filter((item) => item.value !== String(canonical)).slice(0, 3);
  if (wrongs.length !== 3 || new Set(wrongs.map((item) => item.value)).size !== 3) {
    throw new Error(`Unable to build interval distractors for seed ${seed}`);
  }
  const options = makeOptions(String(canonical), wrongs, seed);
  const notation = intervalNotation(lower, upper, includeLower, includeUpper);

  return {
    ...basePackage("NUM-CP001-PROT-005", seed, "COUNT"),
    stem: `How many integers lie in the interval ${notation}?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer: String(canonical),
    verifierAnswer: String(verifier),
    hiddenState: { lower, upper, includeLower, includeUpper, topology: notation },
    mathematicalFingerprint: `NUM-CP001-PROT-005:${lower}:${upper}:${Number(includeLower)}:${Number(includeUpper)}`,
    explanation: explanation(
      "For integer endpoints, a closed interval includes the endpoint integer while an open endpoint removes it.",
      `Start from the ${span + 1} integers from ${lower} through ${upper}, then apply the endpoint brackets in ${notation}.`,
      [
        `Inclusive count from ${lower} to ${upper} is ${span + 1}.`,
        `${includeLower ? "Keep" : "Remove"} the lower endpoint ${lower}.`,
        `${includeUpper ? "Keep" : "Remove"} the upper endpoint ${upper}.`,
        `The final integer count is ${canonical}.`,
      ],
      "For integer endpoints: closed-closed = difference + 1; each open endpoint removes one.",
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
  const cycle = Math.floor((seed - 1) / 3);
  const odd = 2 * (2 + (cycle % 13)) + 1;
  const secondOdd = odd + 2;
  const even = 2 * (3 + (cycle % 11));
  const topology = (seed - 1) % 3;
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
  if (oddExpressions.length !== 1) throw new Error(`Parity expression topology is not unique for seed ${seed}`);
  const canonicalAnswer = oddExpressions[0]!.text;
  const verifierAnswer = expressions.find((item) => item.value % 2 !== 0)?.text;
  if (!verifierAnswer) throw new Error("Parity verifier found no odd expression");
  const wrongs = expressions
    .filter((item) => item.text !== canonicalAnswer)
    .map((item, index) => ({
      value: item.text,
      misconceptionId: [
        "ODD_PLUS_ODD_RULE_CONFUSED",
        "EVEN_FACTOR_PRODUCT_RULE_IGNORED",
        "EVEN_POWER_RULE_IGNORED",
      ][index]!,
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-006", seed, "PARITY_CLASS"),
    stem: "Which one of the following expressions has an odd value?",
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { odd, secondOdd, even, topology, expressions },
    mathematicalFingerprint: `NUM-CP001-PROT-006:${topology}:${odd}:${even}`,
    explanation: explanation(
      "Odd ± even is odd; odd × odd is odd; any product containing an even factor is even; powers preserve the parity of an integer base.",
      "Use parity rules on each option instead of carrying out unnecessary full arithmetic.",
      expressions.map((item) => `${item.text} has value ${item.value}, which is ${Math.abs(item.value) % 2 === 1 ? "odd" : "even"}.`),
      "Reduce each number to O or E and apply the parity rule in one step.",
      options,
      `${canonicalAnswer} is the only expression with an odd value.`,
    ),
  };
}

type ParityClaimId =
  | "CONSECUTIVE_PRODUCT_EVEN"
  | "N_IS_EVEN"
  | "CONSECUTIVE_PRODUCT_ODD"
  | "N_SQUARED_EQUALS_ZERO";

function parityClaimText(id: ParityClaimId): string {
  const claims: Record<ParityClaimId, string> = {
    CONSECUTIVE_PRODUCT_EVEN: "n(n + 1) is even.",
    N_IS_EVEN: "n is even.",
    CONSECUTIVE_PRODUCT_ODD: "n(n + 1) is odd.",
    N_SQUARED_EQUALS_ZERO: "n² = 0.",
  };
  return claims[id];
}

function evaluateParityClaim(id: ParityClaimId, n: number): boolean {
  switch (id) {
    case "CONSECUTIVE_PRODUCT_EVEN": return (n * (n + 1)) % 2 === 0;
    case "N_IS_EVEN": return n % 2 === 0;
    case "CONSECUTIVE_PRODUCT_ODD": return Math.abs(n * (n + 1)) % 2 === 1;
    case "N_SQUARED_EQUALS_ZERO": return n * n === 0;
  }
}

function classifyParityClaimCanonical(id: ParityClaimId): NumCp001ClaimClass {
  switch (id) {
    case "CONSECUTIVE_PRODUCT_EVEN": return "ALWAYS_TRUE";
    case "N_IS_EVEN": return "SOMETIMES_TRUE";
    case "CONSECUTIVE_PRODUCT_ODD": return "NEVER_TRUE";
    case "N_SQUARED_EQUALS_ZERO": return "TRUE_ONLY_WHEN_N_IS_ZERO";
  }
}

function classifyParityClaimByWitnesses(id: ParityClaimId): NumCp001ClaimClass {
  const witnesses = Array.from({ length: 21 }, (_, index) => index - 10);
  const trueValues = witnesses.filter((n) => evaluateParityClaim(id, n));
  if (trueValues.length === witnesses.length) return "ALWAYS_TRUE";
  if (trueValues.length === 0) return "NEVER_TRUE";
  if (trueValues.length === 1 && trueValues[0] === 0) return "TRUE_ONLY_WHEN_N_IS_ZERO";
  return "SOMETIMES_TRUE";
}

function generatePrototype007(seed: number): NumCp001Wave01Package {
  const claimIds: readonly ParityClaimId[] = [
    "CONSECUTIVE_PRODUCT_EVEN",
    "N_IS_EVEN",
    "CONSECUTIVE_PRODUCT_ODD",
    "N_SQUARED_EQUALS_ZERO",
  ];
  const claimId = claimIds[(seed - 1) % claimIds.length]!;
  const canonicalAnswer = classifyParityClaimCanonical(claimId);
  const verifierAnswer = classifyParityClaimByWitnesses(claimId);
  const allClasses: readonly NumCp001ClaimClass[] = [
    "ALWAYS_TRUE",
    "SOMETIMES_TRUE",
    "NEVER_TRUE",
    "TRUE_ONLY_WHEN_N_IS_ZERO",
  ];
  const wrongs = allClasses
    .filter((value) => value !== canonicalAnswer)
    .map((value) => ({
      value,
      misconceptionId: value === "ALWAYS_TRUE"
        ? "SINGLE_TRUE_EXAMPLE_GENERALIZED"
        : value === "NEVER_TRUE"
          ? "SINGLE_FALSE_EXAMPLE_GENERALIZED"
          : value === "TRUE_ONLY_WHEN_N_IS_ZERO"
            ? "ZERO_SPECIAL_CASE_OVERGENERALIZED"
            : "ALWAYS_VS_SOMETIMES_CONFUSED",
    }));
  const options = makeOptions(canonicalAnswer, wrongs, seed);
  const witnessSummary = [-2, -1, 0, 1, 2]
    .map((n) => `${n}:${evaluateParityClaim(claimId, n) ? "T" : "F"}`)
    .join(", ");

  return {
    ...basePackage("NUM-CP001-PROT-007", seed, "BOOLEAN_CLAIM"),
    stem: `For every integer n, consider the statement “${parityClaimText(claimId)}” How should the statement be classified?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { claimId, witnessSummary },
    mathematicalFingerprint: `NUM-CP001-PROT-007:${claimId}:${Math.floor((seed - 1) / 4)}`,
    explanation: explanation(
      "A universal parity claim must hold for every integer; a counterexample disproves ‘always’, while consecutive integers always contain one even member.",
      `Classify the claim ${parityClaimText(claimId)} using its integer parity structure and small witness values as a check.`,
      [
        `Witness check around zero: ${witnessSummary}.`,
        `The governing parity rule therefore gives ${canonicalAnswer}.`,
      ],
      "Test n = 0, 1 and 2 first; then use the parity invariant to decide whether the pattern is universal.",
      options,
      `The statement is ${canonicalAnswer}.`,
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
  const cycle = Math.floor((seed - 1) / 3);
  const length = [3, 4, 5][(seed - 1) % 3]!;
  const start = -12 + (cycle % 35);
  const values = Array.from({ length }, (_, index) => start + index);
  const sum = values.reduce((total, value) => total + value, 0);
  const recoveredStart = (2 * sum / length - (length - 1)) / 2;
  if (!Number.isInteger(recoveredStart)) throw new Error(`Constructed consecutive state became infeasible for seed ${seed}`);
  const canonicalValues = Array.from({ length }, (_, index) => recoveredStart + index);
  const verifierValues = recoverConsecutiveByEnumeration(sum, length);
  if (!verifierValues) throw new Error(`Verifier found no consecutive block for seed ${seed}`);
  const canonicalAnswer = tuple(canonicalValues);
  const verifierAnswer = tuple(verifierValues);
  const shiftDown = canonicalValues.map((value) => value - 1);
  const shiftUp = canonicalValues.map((value) => value + 1);
  const stepTwo = canonicalValues.map((_, index) => start + 2 * index);
  const wrongs = [
    { value: tuple(shiftDown), misconceptionId: "BLOCK_SHIFTED_ONE_TOO_LOW" },
    { value: tuple(shiftUp), misconceptionId: "BLOCK_SHIFTED_ONE_TOO_HIGH" },
    { value: tuple(stepTwo), misconceptionId: "USED_CONSECUTIVE_SAME_PARITY_NUMBERS" },
  ];
  const options = makeOptions(canonicalAnswer, wrongs, seed);

  return {
    ...basePackage("NUM-CP001-PROT-008", seed, "NUMBER_TUPLE"),
    stem: `The sum of ${length} consecutive integers is ${sum}. Which ordered tuple gives those integers?`,
    options,
    correctIndex: options.findIndex((option) => option.isCorrect),
    canonicalAnswer,
    verifierAnswer,
    hiddenState: { length, sum, start, values },
    mathematicalFingerprint: `NUM-CP001-PROT-008:${length}:${sum}`,
    explanation: explanation(
      "Consecutive integers differ by 1. Their average is the middle value for an odd-length block and the midpoint of the two middle values for an even-length block.",
      `Use the sum ${sum} and block length ${length} to recover the first term, then step by 1.`,
      [
        `Let the first integer be x. The block is x, x + 1, …, x + ${length - 1}.`,
        `Its sum is ${length}x + ${length * (length - 1) / 2} = ${sum}.`,
        `Solving gives x = ${recoveredStart}.`,
        `Therefore the block is ${canonicalAnswer}.`,
      ],
      "Divide the sum by the number of terms to locate the centre, then write consecutive values around it.",
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
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("Seed must be a positive integer");

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

export function generateNumCp001Wave01Sweep(seedsPerPrototype: number): NumCp001Wave01Package[] {
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