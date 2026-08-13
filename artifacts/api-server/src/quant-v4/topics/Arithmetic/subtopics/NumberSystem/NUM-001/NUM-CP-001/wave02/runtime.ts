import {
  NUM_CP001_WAVE02_PROTOTYPE_IDS,
  type NumCp001Difficulty,
  type NumCp001Explanation,
  type NumCp001Lifecycle,
  type NumCp001Option,
  type NumCp001Wave02AnswerSemantic,
  type NumCp001Wave02Package,
  type NumCp001Wave02PrototypeId,
} from "./types";

export { NUM_CP001_WAVE02_PROTOTYPE_IDS } from "./types";

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
  if (wrong.length !== 3) throw new Error("Wave 2 requires exactly three distractors");
  const values = [correctValue, ...wrong.map((x) => x.value)];
  if (new Set(values).size !== 4) throw new Error(`Duplicate options: ${values.join(" | ")}`);
  const options: NumCp001Option[] = wrong.map((x) => ({ value: x.value, isCorrect: false, misconceptionId: x.misconceptionId }));
  options.splice(mod(seed - 1, 4), 0, { value: correctValue, isCorrect: true });
  return options;
}

function explanation(core: string, strategy: string, steps: readonly string[], speed: string, traps: readonly string[], finalAnswer: string): NumCp001Explanation {
  return {
    coreConcept: [core],
    givenDataAndStrategy: [strategy],
    stepByStep: steps,
    examSpeedMethod: [speed],
    commonTraps: traps,
    finalAnswer,
  };
}

function base(prototype: NumCp001Wave02PrototypeId, seed: number, difficulty: NumCp001Difficulty, answerSemantic: NumCp001Wave02AnswerSemantic) {
  return {
    packageId: "NUM-001" as const,
    checkpointId: "NUM-CP-001" as const,
    temporaryPrototypeId: prototype,
    permanentQlId: null,
    seed,
    locale: "en-IN" as const,
    difficulty,
    answerSemantic,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: [prototype],
    lifecycle: LOCKED_LIFECYCLE,
  };
}

function difficulty(seed: number): NumCp001Difficulty {
  return (["EASY", "MEDIUM", "HARD"] as const)[mod(seed - 1, 3)];
}

function p009(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const mode = mod(seed - 1, 4);
  const set = ["natural numbers", "whole numbers", "integers", "rational numbers"][mode];
  const nonSquares = [2, 3, 5, 6, 7, 8, 10, 11] as const;
  const correct = mode === 0 ? `-${3 + mod(seed, 7)}` : mode === 1 ? `-${2 + mod(seed, 8)}` : mode === 2 ? frac(2 * seed + 1, 2) : `√${nonSquares[mod(seed, nonSquares.length)]}`;
  const wrong = mode === 0 ? ["1", "2", "3"] : mode === 1 ? ["0", "2", "4"] : mode === 2 ? ["-2", "0", "3"] : ["1/2", "3", "-4"];
  const options = makeOptions(correct, wrong.map((value, i) => ({ value, misconceptionId: `SET_MEMBERSHIP_${i + 1}` })), seed);
  return {
    ...base("NUM-CP001-PROT-009", seed, d, "VALUE"),
    stem: `Which of the following is NOT a member of the set of ${set}? Assume natural numbers begin at 1.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: { set, correct, mode },
    mathematicalFingerprint: `outside-set:${mode}:${correct}`,
    explanation: explanation(
      "A value belongs to a number set only when it satisfies that set's defining property.",
      `Check each option against ${set}; the task asks for the outsider, not the most specific classification.`,
      [`Three options satisfy the definition of ${set}.`, `${correct} fails that defining condition.`, `Therefore ${correct} is the unique outsider.`],
      "Test the defining property directly and stop as soon as exactly one option fails it.",
      ["Do not choose a value merely because it also belongs to a larger set.", "Keep the stated natural-number convention in view.", "A non-integer fraction is rational but not an integer."],
      correct,
    ),
  };
}

function p010(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const least = mod(seed, 2) === 0;
  const strict = mod(seed, 4) < 2;
  const den = [2, 3, 4, 5][mod(seed, 4)];
  const k = 3 + mod(seed * 5, 12);
  const num = k * den + (strict ? 0 : den - 1);
  const bound = frac(num, den);
  const value = num / den;
  const correct = String(least ? (strict ? Math.floor(value) + 1 : Math.ceil(value)) : (strict ? Math.ceil(value) - 1 : Math.floor(value)));
  const c = Number(correct);
  const options = makeOptions(correct, [
    { value: String(c - 1), misconceptionId: "STRICTNESS_IGNORED" },
    { value: String(c + 1), misconceptionId: "BOUND_DIRECTION_REVERSED" },
    { value: String(least ? c + 2 : c - 2), misconceptionId: "FLOOR_CEILING_CONFUSED" },
  ], seed);
  const op = least ? (strict ? ">" : "≥") : (strict ? "<" : "≤");
  return {
    ...base("NUM-CP001-PROT-010", seed, d, "INTEGER"),
    stem: `Find the ${least ? "least" : "greatest"} integer x such that x ${op} ${bound}.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: String(c),
    hiddenState: { least, strict, bound, num, den },
    mathematicalFingerprint: `integer-bound:${least}:${strict}:${bound}`,
    explanation: explanation(
      "Least/greatest integer questions depend on the first admissible integer and on whether equality is allowed.",
      `Locate ${bound} exactly between neighbouring integers, then apply ${op}.`,
      [`${bound} lies at the relevant boundary around integer ${k}.`, `Apply the ${strict ? "strict" : "non-strict"} condition before choosing an integer.`, `The required integer is ${correct}.`],
      "For strict integer bounds, check whether the bound itself is an integer before using floor or ceiling.",
      ["Do not ignore < versus ≤ or > versus ≥.", "Do not reverse least and greatest.", "Avoid decimal rounding; compare exact fractions."],
      correct,
    ),
  };
}

function p011(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const leftDen = 2 + mod(seed, 3);
  const rightDen = 3 + mod(seed, 3);
  const leftBase = -4 + mod(seed, 5);
  const count = 3 + mod(seed, 6);
  const leftNum = leftBase * leftDen + 1;
  const rightBase = leftBase + count;
  const rightNum = rightBase * rightDen - 1;
  const left = leftNum / leftDen;
  const right = rightNum / rightDen;
  const first = Math.floor(left) + 1;
  const last = Math.ceil(right) - 1;
  const correctCount = Math.max(0, last - first + 1);
  const correct = String(correctCount);
  const options = makeOptions(correct, [
    { value: String(correctCount + 1), misconceptionId: "COUNTED_ONE_BOUND" },
    { value: String(correctCount + 2), misconceptionId: "COUNTED_BOTH_BOUNDS" },
    { value: String(correctCount - 1), misconceptionId: "DROPPED_ADMISSIBLE_INTEGER" },
  ], seed);
  const verifierCount = Array.from({ length: Math.ceil(right - left) + 6 }, (_, i) => Math.floor(left) - 2 + i).filter((x) => left < x && x < right).length;
  return {
    ...base("NUM-CP001-PROT-011", seed, d, "COUNT"),
    stem: `How many integers x satisfy ${frac(leftNum, leftDen)} < x < ${frac(rightNum, rightDen)}?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: String(verifierCount),
    hiddenState: { leftNum, leftDen, rightNum, rightDen, first, last },
    mathematicalFingerprint: `rational-count:${frac(leftNum, leftDen)}:${frac(rightNum, rightDen)}`,
    explanation: explanation(
      "Count integers between exact rational bounds by finding the first and last admissible integers.",
      "Do not convert the bounds to rounded decimals; use exact comparison.",
      [`The first integer greater than the left bound is ${first}.`, `The last integer less than the right bound is ${last}.`, `Count = ${last} - ${first} + 1 = ${correct}.`],
      "Identify first and last valid integers, then use last − first + 1.",
      ["Do not count a non-integer bound as an integer.", "Do not add both endpoints automatically.", "Do not round a rational bound before testing integers."],
      correct,
    ),
  };
}

function p012(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const left = -6 + mod(seed, 8);
  const count = 4 + mod(seed, 7);
  const leftInclusive = mod(seed, 2) === 0;
  const rightInclusive = mod(seed, 3) !== 0;
  const first = left + (leftInclusive ? 0 : 1);
  const last = first + count - 1;
  const right = last + (rightInclusive ? 0 : 1);
  const correct = String(right);
  const options = makeOptions(correct, [
    { value: String(right - 1), misconceptionId: "RIGHT_ENDPOINT_INCLUSION_MISREAD" },
    { value: String(right + 1), misconceptionId: "EXTRA_ENDPOINT_ADDED" },
    { value: String(right + 2), misconceptionId: "LEFT_ENDPOINT_EFFECT_MISREAD" },
  ], seed);
  const lbr = leftInclusive ? "[" : "(";
  const rbr = rightInclusive ? "]" : ")";
  return {
    ...base("NUM-CP001-PROT-012", seed, d, "INTEGER"),
    stem: `The interval ${lbr}${left}, b${rbr} contains exactly ${count} integers. Find the integer endpoint b.`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: String(right),
    hiddenState: { left, count, leftInclusive, rightInclusive, first, last, right },
    mathematicalFingerprint: `inverse-interval:${left}:${count}:${leftInclusive}:${rightInclusive}`,
    explanation: explanation(
      "Recovering an interval endpoint is the inverse of counting its admissible integers.",
      "First locate the first included integer, then move count − 1 steps to the last included integer and account for the right bracket.",
      [`First included integer = ${first}.`, `With ${count} integers, the last included integer = ${first} + ${count - 1} = ${last}.`, `The right ${rightInclusive ? "closed" : "open"} endpoint is therefore b = ${right}.`],
      "Work with first and last included integers instead of memorising separate formulas for four bracket types.",
      ["Do not count a round-bracket endpoint.", "Do not add an extra +1 after already counting inclusively.", "Treat left and right endpoint effects separately."],
      correct,
    ),
  };
}

function p013(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const kinds = ["positive", "negative", "even", "odd"] as const;
  const kind = kinds[mod(seed - 1, 4)];
  const low = -10 + mod(seed, 4);
  const high = 7 + mod(seed * 3, 8);
  const values = Array.from({ length: high - low + 1 }, (_, i) => low + i);
  const filtered = values.filter((x) => kind === "positive" ? x > 0 : kind === "negative" ? x < 0 : kind === "even" ? x % 2 === 0 : Math.abs(x % 2) === 1);
  const c = filtered.length;
  const correct = String(c);
  const options = makeOptions(correct, [
    { value: String(c + 1), misconceptionId: "ZERO_PROPERTY_CONFUSION" },
    { value: String(c - 1), misconceptionId: "BOUNDARY_MEMBER_DROPPED" },
    { value: String(c + 2), misconceptionId: "FILTER_NOT_APPLIED" },
  ], seed);
  return {
    ...base("NUM-CP001-PROT-013", seed, d, "COUNT"),
    stem: `How many ${kind} integers are there in the closed interval [${low}, ${high}]?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: String(filtered.length),
    hiddenState: { low, high, kind, filtered },
    mathematicalFingerprint: `filtered-count:${kind}:${low}:${high}`,
    explanation: explanation(
      "Filtered interval counting is the intersection of interval membership with one integer property.",
      `First keep integers in [${low}, ${high}], then retain only the ${kind} ones.`,
      [`The interval contains all integers from ${low} through ${high}.`, `Applying the ${kind} filter leaves ${filtered.join(", ")}.`, `Hence the count is ${correct}.`],
      "For even/odd counts, locate the first and last valid parity member; for sign counts, separate zero carefully.",
      ["Zero is even but neither positive nor negative.", "Do not drop an included endpoint that satisfies the filter.", "Do not count all interval integers before applying the requested property."],
      correct,
    ),
  };
}

function p014(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const centre = -8 + mod(seed * 3, 17);
  const dist = 2 + mod(seed, 8);
  const a = centre - dist;
  const b = centre + dist;
  const correct = `(${a}, ${b})`;
  const options = makeOptions(correct, [
    { value: `(${centre}, ${centre + dist})`, misconceptionId: "ONE_SIDE_ONLY" },
    { value: `(${centre - dist}, ${centre})`, misconceptionId: "CENTRE_USED_AS_SOLUTION" },
    { value: `(${centre - dist - 1}, ${centre + dist + 1})`, misconceptionId: "DISTANCE_OFF_BY_ONE" },
  ], seed);
  const verifierCandidates = Array.from({ length: 2 * dist + 7 }, (_, i) => centre - dist - 3 + i).filter((x) => Math.abs(x - centre) === dist);
  return {
    ...base("NUM-CP001-PROT-014", seed, d, "NUMBER_TUPLE"),
    stem: `Which pair gives all integer points that are exactly ${dist} units from ${centre} on the number line?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: `(${verifierCandidates[0]}, ${verifierCandidates[1]})`,
    hiddenState: { centre, dist, a, b },
    mathematicalFingerprint: `inverse-distance:${centre}:${dist}`,
    explanation: explanation(
      "A fixed positive distance from a centre gives one point on each side: centre − distance and centre + distance.",
      `Use both directions from ${centre}.`,
      [`Left point = ${centre} − ${dist} = ${a}.`, `Right point = ${centre} + ${dist} = ${b}.`, `Thus the complete pair is ${correct}.`],
      "For |x − a| = d with d > 0, write x = a ± d immediately.",
      ["Do not keep only one side of the centre.", "The centre itself is at distance 0, not the stated positive distance.", "Distance is non-negative and symmetric."],
      correct,
    ),
  };
}

function p015(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const mode = mod(seed - 1, 4);
  const stems = [
    "The sum of n and an odd integer is even.",
    "The sum of n and an even integer is odd.",
    "The product of n and an odd integer is odd.",
    "The product of n and an odd integer is even.",
  ];
  const correct = mode === 3 ? "Even" : "Odd";
  const options = makeOptions(correct, [
    { value: correct === "Odd" ? "Even" : "Odd", misconceptionId: "INVERSE_PARITY_REVERSED" },
    { value: "Cannot be determined", misconceptionId: "PARITY_EVIDENCE_IGNORED" },
    { value: "Neither even nor odd", misconceptionId: "INTEGER_PARITY_EXHAUSTIVENESS_MISSED" },
  ], seed);
  return {
    ...base("NUM-CP001-PROT-015", seed, d, "PARITY_CLASS"),
    stem: `${stems[mode]} What must be the parity of the integer n?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: correct,
    hiddenState: { mode, condition: stems[mode] },
    mathematicalFingerprint: `inverse-parity:${mode}`,
    explanation: explanation(
      "Parity can be reconstructed by reversing the even/odd sum or product rule.",
      stems[mode],
      [`Test the required parity rule for even n and odd n.`, `Only ${correct.toLowerCase()} n satisfies the stated result.`, `Therefore n must be ${correct.toLowerCase()}.`],
      "Use E+E=E, E+O=O, O+O=E and O×O=O; an even factor makes a product even.",
      ["Do not reverse the resulting parity mechanically.", "Integer parity is exhaustive: every integer is even or odd.", "For products, distinguish an odd factor from an even factor."],
      correct,
    ),
  };
}

function p016(seed: number): NumCp001Wave02Package {
  const d = difficulty(seed);
  const odd = mod(seed, 2) === 1;
  const len = mod(seed, 4) < 2 ? 3 : 5;
  let first = 3 + 2 * mod(seed * 2, 8);
  if (!odd && first % 2 !== 0) first += 1;
  if (odd && first % 2 === 0) first += 1;
  const seq = Array.from({ length: len }, (_, i) => first + 2 * i);
  const sum = seq.reduce((a, b) => a + b, 0);
  const correct = `(${seq.join(", ")})`;
  const shiftedLow = seq.map((x) => x - 2);
  const shiftedHigh = seq.map((x) => x + 2);
  const consecutive = Array.from({ length: len }, (_, i) => first + i);
  const options = makeOptions(correct, [
    { value: `(${shiftedLow.join(", ")})`, misconceptionId: "SAME_PARITY_BLOCK_SHIFTED_LOW" },
    { value: `(${shiftedHigh.join(", ")})`, misconceptionId: "SAME_PARITY_BLOCK_SHIFTED_HIGH" },
    { value: `(${consecutive.join(", ")})`, misconceptionId: "USED_SPACING_ONE" },
  ], seed);
  const candidates: number[][] = [];
  for (let s = -20; s <= 40; s += 1) {
    if ((Math.abs(s) % 2 === 1) !== odd) continue;
    const arr = Array.from({ length: len }, (_, i) => s + 2 * i);
    if (arr.reduce((a, b) => a + b, 0) === sum) candidates.push(arr);
  }
  const verifier = `(${candidates[0].join(", ")})`;
  return {
    ...base("NUM-CP001-PROT-016", seed, d, "NUMBER_TUPLE"),
    stem: `The sum of ${len} consecutive ${odd ? "odd" : "even"} positive integers is ${sum}. Which tuple is correct?`,
    options,
    correctIndex: options.findIndex((x) => x.isCorrect),
    canonicalAnswer: correct,
    verifierAnswer: verifier,
    hiddenState: { odd, len, first, sum, seq },
    mathematicalFingerprint: `same-parity-block:${odd}:${len}:${sum}`,
    explanation: explanation(
      `Consecutive ${odd ? "odd" : "even"} integers differ by 2, not by 1.`,
      `Represent the block as a, a+2, ... and use the given sum ${sum}.`,
      [`The middle-value structure fixes the block around ${seq[Math.floor(len / 2)]}.`, `Using spacing 2 gives ${seq.join(", ")}.`, `Their sum is ${sum}, so the tuple is ${correct}.`],
      "For an odd number of equally spaced terms, average = middle term; then step outward by 2.",
      ["Do not use ordinary consecutive integers with spacing 1.", "Do not shift the whole block after finding the correct average.", "Check that every term has the requested parity."],
      correct,
    ),
  };
}

export function generateNumCp001Wave02(prototypeId: NumCp001Wave02PrototypeId, seed: number): NumCp001Wave02Package {
  if (!Number.isInteger(seed) || seed <= 0) throw new Error("seed must be a positive integer");
  switch (prototypeId) {
    case "NUM-CP001-PROT-009": return p009(seed);
    case "NUM-CP001-PROT-010": return p010(seed);
    case "NUM-CP001-PROT-011": return p011(seed);
    case "NUM-CP001-PROT-012": return p012(seed);
    case "NUM-CP001-PROT-013": return p013(seed);
    case "NUM-CP001-PROT-014": return p014(seed);
    case "NUM-CP001-PROT-015": return p015(seed);
    case "NUM-CP001-PROT-016": return p016(seed);
  }
}
