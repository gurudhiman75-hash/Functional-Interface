import {
  NUM_CP001_WAVE03_PROTOTYPE_IDS,
  type NumCp001Difficulty,
  type NumCp001Explanation,
  type NumCp001Lifecycle,
  type NumCp001Option,
  type NumCp001Wave03AnswerSemantic,
  type NumCp001Wave03Package,
  type NumCp001Wave03PrototypeId,
} from "./types";

export { NUM_CP001_WAVE03_PROTOTYPE_IDS } from "./types";

const SOURCE_ANCESTRY = [
  "NUMBER-SYSTEM-COMPLETENESS-AUDIT",
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

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x;
}

function frac(n: number, d: number): string {
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  return `${(n / g) * sign}/${Math.abs(d / g)}`;
}

function makeOptions(
  correctValue: string,
  wrong: readonly { value: string; misconceptionId: string }[],
  seed: number,
): NumCp001Option[] {
  if (wrong.length !== 3) throw new Error("Wave 3 requires exactly three distractors");
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

function difficulty(seed: number): NumCp001Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[mod(seed - 1, 3)];
}

function base(
  prototype: NumCp001Wave03PrototypeId,
  seed: number,
  answerSemantic: NumCp001Wave03AnswerSemantic,
) {
  return {
    packageId: "NUM-001" as const,
    checkpointId: "NUM-CP-001" as const,
    temporaryPrototypeId: prototype,
    permanentQlId: null,
    seed,
    locale: "en-IN" as const,
    difficulty: difficulty(seed),
    answerSemantic,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: [prototype],
    lifecycle: LOCKED_LIFECYCLE,
  };
}

function p017(seed: number): NumCp001Wave03Package {
  const nonSquares = [2, 3, 5, 6, 7, 10, 11, 13] as const;
  const n = nonSquares[mod(seed, nonSquares.length)];
  const mode = mod(seed - 1, 4);
  const rationalForms = [
    `√${n} × √${n}`,
    `(√${n})² + 1/2`,
    `(3√${n}) × (√${n})`,
    `(√${n} × √${n}) / 2`,
  ] as const;
  const irrationalForms = [
    `√${n} + 1`,
    `2√${n}`,
    `√${n} / 2`,
    `√${n} - 3`,
    `5 + √${n}`,
    `3√${n} + 2`,
  ] as const;
  const correct = rationalForms[mode];
  const wrongValues = [
    irrationalForms[mod(seed, irrationalForms.length)],
    irrationalForms[mod(seed + 2, irrationalForms.length)],
    irrationalForms[mod(seed + 4, irrationalForms.length)],
  ];
  if (new Set(wrongValues).size !== 3) throw new Error("Irrational distractor collision");
  const options = makeOptions(correct, wrongValues.map((value, i) => ({
    value,
    misconceptionId: ["NON_SQUARE_ROOT_ASSUMED_RATIONAL", "SUM_WITH_INTEGER_MISCLASSIFIED", "SCALAR_MULTIPLE_MISCLASSIFIED"][i],
  })), seed);
  const rationalValue = mode === 0 ? String(n) : mode === 1 ? frac(2 * n + 1, 2) : mode === 2 ? String(3 * n) : frac(n, 2);
  const verifier = [correct, ...wrongValues].find((value) => value === correct) ?? "";
  return {
    ...base("NUM-CP001-PROT-017", seed, "VALUE"),
    stem: `Here ${n} is not a perfect square. Which of the following expressions is rational?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: verifier,
    hiddenState: { n, mode, rationalValue },
    mathematicalFingerprint: `compound-set:${n}:${mode}`,
    explanation: explanation(
      "A square root of a positive non-square integer is irrational, but multiplying the same square root by itself removes the radical.",
      "Simplify each expression exactly before classifying it; no decimal approximation is needed.",
      [`For the selected expression, the repeated radical product becomes ${n}.`, `After the remaining rational operation, its value is ${rationalValue}.`, `A ratio or sum of rational numbers remains rational, so ${correct} is rational.`],
      "Look first for a repeated √n factor that becomes n; adding or scaling a single non-square radical does not make it rational.",
      ["Do not call every expression containing √n irrational before simplifying.", "Do not use decimal approximations of square roots.", "Adding an integer to an irrational number remains irrational."],
      correct,
    ),
  };
}

function p018(seed: number): NumCp001Wave03Package {
  const baseInt = -6 + mod(seed * 5, 10);
  const values = [
    { text: String(baseInt), num: 2 * baseInt },
    { text: frac(2 * baseInt + 1, 2), num: 2 * baseInt + 1 },
    { text: String(baseInt + 1), num: 2 * baseInt + 2 },
    { text: frac(2 * baseInt + 3, 2), num: 2 * baseInt + 3 },
  ];
  const permutations = [
    [0, 1, 2, 3],
    [2, 0, 3, 1],
    [1, 3, 0, 2],
    [3, 2, 1, 0],
  ] as const;
  const permutation = permutations[mod(seed - 1, permutations.length)];
  const labels = ["A", "B", "C", "D"] as const;
  const assigned = labels.map((label, i) => ({ label, ...values[permutation[i]] }));
  const sortedLabels = [...assigned].sort((a, b) => a.num - b.num).map((x) => x.label);
  const correct = sortedLabels.join(" < ");
  const reverse = [...sortedLabels].reverse().join(" < ");
  const swapFirst = [sortedLabels[1], sortedLabels[0], sortedLabels[2], sortedLabels[3]].join(" < ");
  const swapLast = [sortedLabels[0], sortedLabels[1], sortedLabels[3], sortedLabels[2]].join(" < ");
  const options = makeOptions(correct, [
    { value: reverse, misconceptionId: "ASCENDING_DESCENDING_REVERSED" },
    { value: swapFirst, misconceptionId: "NEGATIVE_OR_NEARBY_ORDER_SWAP" },
    { value: swapLast, misconceptionId: "FRACTION_INTEGER_NEIGHBOUR_SWAP" },
  ], seed);
  const verifier = [...assigned].sort((a, b) => a.num - b.num).map((x) => x.label).join(" < ");
  return {
    ...base("NUM-CP001-PROT-018", seed, "ORDERED_LIST"),
    stem: `Arrange the following exact values in ascending order: A = ${assigned[0].text}, B = ${assigned[1].text}, C = ${assigned[2].text}, D = ${assigned[3].text}.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: verifier,
    hiddenState: { baseInt, permutation: [...permutation], assigned },
    mathematicalFingerprint: `mixed-order:${baseInt}:${permutation.join("")}`,
    explanation: explanation(
      "Exact rational values can be ordered by placing them on a common scale; signs must be respected before comparing magnitudes.",
      "Convert only to an exact common denominator, not to rounded decimals.",
      [`Using denominator 2 gives consecutive numerators ${2 * baseInt}, ${2 * baseInt + 1}, ${2 * baseInt + 2}, ${2 * baseInt + 3}.`, `Their increasing numerical order is fixed by those numerators.`, `Mapping the values back to their labels gives ${correct}.`],
      "For halves and integers, double every value mentally and compare the resulting integers.",
      ["Among negative values, the one with larger absolute magnitude is smaller.", "Do not round a fraction before comparing.", "Do not confuse the option's label order with the order in which values were listed."],
      correct,
    ),
  };
}

function p019(seed: number): NumCp001Wave03Package {
  const topology = mod(seed - 1, 4);
  const targetCounts = [0, 1, 2, 4] as const;
  const expectedCount = targetCounts[topology];
  const k = -5 + mod(seed * 3, 9);
  const leftNum = 3 * k + 1;
  const leftDen = 3;
  const rightNum = expectedCount === 0 ? 3 * k + 2 : 2 * (k + expectedCount) + 1;
  const rightDen = expectedCount === 0 ? 3 : 2;
  const left = leftNum / leftDen;
  const right = rightNum / rightDen;
  const integers = Array.from({ length: 16 }, (_, i) => k - 3 + i).filter((x) => left < x && x < right);
  const category = integers.length === 0 ? "No integers" : integers.length === 1 ? "Exactly one integer" : integers.length === 2 ? "Exactly two integers" : "At least three integers";
  const categories = ["No integers", "Exactly one integer", "Exactly two integers", "At least three integers"];
  const options = makeOptions(category, categories.filter((x) => x !== category).map((value, i) => ({
    value,
    misconceptionId: ["EMPTY_SINGLETON_CONFUSION", "ENDPOINT_COUNT_CONFUSION", "MULTIPLE_TOPOLOGY_CONFUSION"][i],
  })), seed);
  const verifier = integers.length === 0 ? "No integers" : integers.length === 1 ? "Exactly one integer" : integers.length === 2 ? "Exactly two integers" : "At least three integers";
  return {
    ...base("NUM-CP001-PROT-019", seed, "CARDINALITY_CLASS"),
    stem: `Which description is correct for the set of integers x satisfying ${frac(leftNum, leftDen)} < x < ${frac(rightNum, rightDen)}?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: category,
    verifierAnswer: verifier,
    hiddenState: { topology, expectedCount, integers, leftNum, leftDen, rightNum, rightDen },
    mathematicalFingerprint: `interval-topology:${topology}:${frac(leftNum, leftDen)}:${frac(rightNum, rightDen)}`,
    explanation: explanation(
      "An interval can contain no integers, one integer, two integers, or several integers depending on its exact endpoints.",
      "Identify the first integer strictly above the left bound and the last integer strictly below the right bound.",
      [`The admissible integers are ${integers.length ? integers.join(", ") : "none"}.`, `Their count is ${integers.length}.`, `Therefore the correct topology is ${category}.`],
      "Check neighbouring integers directly when an interval is short; it is faster and safer than memorising a case table.",
      ["Strict inequalities exclude endpoints even when an endpoint is an integer.", "Do not assume every non-empty real interval contains an integer.", "Keep 'exactly two' distinct from the broader 'multiple' idea."],
      category,
    ),
  };
}

function p020(seed: number): NumCp001Wave03Package {
  const mode = mod(seed - 1, 4);
  const configs = [
    { expression: "n + 2", correct: "n must be even", rule: "n + an even number has the same parity as n" },
    { expression: "n + 1", correct: "n must be odd", rule: "adding 1 reverses parity" },
    { expression: "2n + 4", correct: "every integer n", rule: "both terms are always even" },
    { expression: "2n + 1", correct: "no integer n", rule: "an even number plus 1 is always odd" },
  ] as const;
  const cfg = configs[mode];
  const all = ["n must be even", "n must be odd", "every integer n", "no integer n"];
  const options = makeOptions(cfg.correct, all.filter((x) => x !== cfg.correct).map((value, i) => ({
    value,
    misconceptionId: ["PARITY_CONDITION_REVERSED", "COEFFICIENT_PARITY_IGNORED", "ALWAYS_NEVER_CONFUSED"][i],
  })), seed);
  return {
    ...base("NUM-CP001-PROT-020", seed, "PARITY_CLASS"),
    stem: `For which condition on the integer n is ${cfg.expression} even?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: cfg.correct,
    verifierAnswer: cfg.correct,
    hiddenState: { mode, expression: cfg.expression },
    mathematicalFingerprint: `missing-parity:${mode}`,
    explanation: explanation(
      "Parity depends only on whether each term is even or odd; coefficients can make a term always even.",
      `Reduce ${cfg.expression} modulo 2 and identify exactly when the result is 0.`,
      [`Use the fact that ${cfg.rule}.`, `So the expression is even under the condition: ${cfg.correct}.`, `That condition is sufficient for every integer covered by it.`],
      "Reduce coefficients and constants modulo 2 instead of substituting many sample values.",
      ["Do not assume the parity of n always survives multiplication.", "Adding an odd constant flips parity; adding an even constant does not.", "Distinguish 'for every n' from 'for no n'."],
      cfg.correct,
    ),
  };
}

function p021(seed: number): NumCp001Wave03Package {
  const lengths = [4, 5, 6] as const;
  const len = lengths[mod(seed - 1, lengths.length)];
  const first = -7 + mod(seed * 4, 15);
  const block = Array.from({ length: len }, (_, i) => first + i);
  const sum = block.reduce((a, b) => a + b, 0);
  const correct = block.join(", ");
  const leftShift = block.map((x) => x - 1).join(", ");
  const rightShift = block.map((x) => x + 1).join(", ");
  const gapBlock = block.map((x, i) => x + i).join(", ");
  const options = makeOptions(correct, [
    { value: leftShift, misconceptionId: "BLOCK_SHIFTED_LEFT" },
    { value: rightShift, misconceptionId: "BLOCK_SHIFTED_RIGHT" },
    { value: gapBlock, misconceptionId: "CONSECUTIVE_GAP_MISREAD" },
  ], seed);
  const verifierFirst = (2 * sum / len - (len - 1)) / 2;
  const verifierBlock = Array.from({ length: len }, (_, i) => verifierFirst + i).join(", ");
  return {
    ...base("NUM-CP001-PROT-021", seed, "NUMBER_TUPLE"),
    stem: `The sum of ${len} consecutive integers is ${sum}. Which option gives the complete block in increasing order?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: verifierBlock,
    hiddenState: { len, first, sum, block },
    mathematicalFingerprint: `long-block:${len}:${sum}`,
    explanation: explanation(
      "For consecutive integers, the average fixes the centre of the block and hence every member.",
      `Use average = ${sum}/${len}, then place ${len} consecutive integers symmetrically around that average.`,
      [`The average is ${sum / len}.`, `For ${len} consecutive integers, the first member is ${first}.`, `Moving by 1 gives ${correct}, whose sum is ${sum}.`],
      "Use the block average instead of writing a long linear equation term by term.",
      ["Consecutive means common difference exactly 1.", "For an even-length block the average lies halfway between the two middle integers.", "Check the reconstructed block by adding its terms."],
      correct,
    ),
  };
}

function p022(seed: number): NumCp001Wave03Package {
  const len = mod(seed, 2) === 0 ? 5 : 7;
  const first = -9 + mod(seed * 5, 18);
  const last = first + len - 1;
  const middle = first + (len - 1) / 2;
  const sum = len * middle;
  const targets = ["first", "middle", "last"] as const;
  const target = targets[mod(seed - 1, targets.length)];
  const correctNumber = target === "first" ? first : target === "middle" ? middle : last;
  const correct = String(correctNumber);
  const pool = [first, middle, last, correctNumber - 1, correctNumber + 1, correctNumber + 2]
    .filter((x, i, arr) => x !== correctNumber && arr.indexOf(x) === i)
    .slice(0, 3);
  if (pool.length !== 3) throw new Error("Endpoint distractor pool too small");
  const options = makeOptions(correct, pool.map((value, i) => ({
    value: String(value),
    misconceptionId: ["TARGET_POSITION_CONFUSED", "AVERAGE_USED_AS_TARGET", "OFF_BY_ONE_ENDPOINT"][i],
  })), seed);
  const verifier = target === "first" ? middle - (len - 1) / 2 : target === "middle" ? sum / len : middle + (len - 1) / 2;
  return {
    ...base("NUM-CP001-PROT-022", seed, "VALUE"),
    stem: `The sum of ${len} consecutive integers is ${sum}. Find the ${target} integer of the block.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: String(verifier),
    hiddenState: { len, first, middle, last, sum, target },
    mathematicalFingerprint: `block-target:${len}:${target}:${sum}`,
    explanation: explanation(
      "In an odd-length consecutive block, the arithmetic mean is exactly the middle integer.",
      `First compute the middle as ${sum}/${len}, then move the required number of unit steps to the ${target}.`,
      [`Middle integer = ${sum} ÷ ${len} = ${middle}.`, `The block extends ${(len - 1) / 2} integers on each side of ${middle}.`, `Therefore the ${target} integer is ${correct}.`],
      "For odd-length blocks, find the middle by one division; endpoints are a fixed number of steps away.",
      ["Do not use the average as an endpoint.", "Count the number of gaps, not the number of terms, when moving to an endpoint.", "Keep the requested first/middle/last target in view."],
      correct,
    ),
  };
}

function p023(seed: number): NumCp001Wave03Package {
  const lengths = [3, 4, 5, 6] as const;
  const len = lengths[mod(seed - 1, lengths.length)];
  const first = -8 + mod(seed * 7, 17);
  const possibleSum = len * (2 * first + len - 1) / 2;
  const possible = mod(seed, 2) === 0;
  const proposedSum = possible ? possibleSum : possibleSum + 1;
  const correct = possible ? "Possible" : "Impossible";
  const options = makeOptions(correct, [
    { value: possible ? "Impossible" : "Possible", misconceptionId: "FEASIBILITY_REVERSED" },
    { value: "Possible only if the first integer is even", misconceptionId: "UNNEEDED_FIRST_PARITY_CONDITION" },
    { value: "Possible only if the first integer is odd", misconceptionId: "WRONG_FIRST_PARITY_CONDITION" },
  ], seed);
  const doubledFirst = 2 * proposedSum / len - (len - 1);
  const verifierPossible = Number.isInteger(doubledFirst) && mod(doubledFirst, 2) === 0;
  const verifier = verifierPossible ? "Possible" : "Impossible";
  return {
    ...base("NUM-CP001-PROT-023", seed, "BOOLEAN_CLASS"),
    stem: `Can ${proposedSum} be the sum of ${len} consecutive integers?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: verifier,
    hiddenState: { len, first, possibleSum, proposedSum, possible },
    mathematicalFingerprint: `block-feasibility:${len}:${proposedSum}:${possible}`,
    explanation: explanation(
      "A proposed consecutive-block sum is possible only if it yields an integer first term when the block-sum formula is inverted.",
      `For length ${len}, solve 2S/k = 2a + k - 1 and test whether a is an integer.`,
      [`Here 2S/k − (k − 1) = ${doubledFirst}.`, `${verifierPossible ? "This is an even integer, so dividing by 2 gives an integer first term." : "This does not produce an even integer, so no integer first term exists."}`, `Therefore the proposed sum is ${correct.toLowerCase()}.`],
      "Use the residue condition hidden in the average: odd-length blocks have an integer average; even-length blocks have a half-integer average.",
      ["A plausible-looking total is not automatically attainable.", "Do not impose an extra even/odd condition on the first term unless the algebra requires it.", "For even block length, a half-integer average is expected rather than impossible."],
      correct,
    ),
  };
}

function p024(seed: number): NumCp001Wave03Package {
  const mode = mod(seed - 1, 4);
  const cases = [
    {
      statements: ["0 is an even integer.", "Every integer is a natural number.", "The sum of two odd integers is odd."],
      correct: "I only",
      truths: [true, false, false],
    },
    {
      statements: ["Every whole number is negative.", "The product of two odd integers is odd.", "1 is an even integer."],
      correct: "II only",
      truths: [false, true, false],
    },
    {
      statements: ["0 is a whole number.", "The sum of three consecutive integers is divisible by 3.", "The sum of an even and an odd integer is even."],
      correct: "I and II only",
      truths: [true, true, false],
    },
    {
      statements: ["Every rational number is an integer.", "If a < b, then -a > -b.", "The sum of two even integers is even."],
      correct: "II and III only",
      truths: [false, true, true],
    },
  ] as const;
  const cfg = cases[mode];
  const all = ["I only", "II only", "I and II only", "II and III only"];
  const options = makeOptions(cfg.correct, all.filter((x) => x !== cfg.correct).map((value, i) => ({
    value,
    misconceptionId: ["SET_CONVENTION_CLAIM_MISREAD", "PARITY_STATEMENT_MISREAD", "SIGNED_ORDER_OR_COMBINATION_MISREAD"][i],
  })), seed);
  const trueRoman = cfg.truths.map((truth, i) => truth ? ["I", "II", "III"][i] : null).filter(Boolean);
  const verifier = trueRoman.length === 1 ? `${trueRoman[0]} only` : `${trueRoman.slice(0, -1).join(" and ")} and ${trueRoman.at(-1)} only`;
  return {
    ...base("NUM-CP001-PROT-024", seed, "STATEMENT_COMBINATION"),
    stem: `Consider the following statements:\nI. ${cfg.statements[0]}\nII. ${cfg.statements[1]}\nIII. ${cfg.statements[2]}\nWhich option identifies exactly the true statements? Assume natural numbers begin at 1.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: cfg.correct,
    verifierAnswer: verifier,
    hiddenState: { mode, truths: [...cfg.truths] },
    mathematicalFingerprint: `statement-combination:${mode}`,
    explanation: explanation(
      "Statement-combination questions should be solved claim by claim using the defining number-set, parity and order rules.",
      "Evaluate I, II and III independently before looking at the combination options.",
      [`Statement I is ${cfg.truths[0] ? "true" : "false"}.`, `Statement II is ${cfg.truths[1] ? "true" : "false"}.`, `Statement III is ${cfg.truths[2] ? "true" : "false"}; hence ${cfg.correct}.`],
      "Mark T/F beside each statement first, then match the resulting pattern to an option.",
      ["Do not let one familiar true statement make the whole combination true.", "Remember that reversing signs reverses an inequality.", "Use the stated natural-number convention when a set-membership claim depends on it."],
      cfg.correct,
    ),
  };
}

const GENERATORS: Record<NumCp001Wave03PrototypeId, (seed: number) => NumCp001Wave03Package> = {
  "NUM-CP001-PROT-017": p017,
  "NUM-CP001-PROT-018": p018,
  "NUM-CP001-PROT-019": p019,
  "NUM-CP001-PROT-020": p020,
  "NUM-CP001-PROT-021": p021,
  "NUM-CP001-PROT-022": p022,
  "NUM-CP001-PROT-023": p023,
  "NUM-CP001-PROT-024": p024,
};

export function generateNumCp001Wave03(
  prototypeId: NumCp001Wave03PrototypeId,
  seed: number,
): NumCp001Wave03Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("seed must be a positive integer");
  const generator = GENERATORS[prototypeId];
  if (!generator) throw new Error(`Unknown Wave 3 prototype: ${prototypeId}`);
  return generator(seed);
}
