import {
  cubeRoot,
  e2Math,
  fmt,
  optionSet,
  packageE2,
  squareRoot,
  type SapE2Package,
} from "../../SAP-E2-TYPES";

export const SAP_CP012_E2_STRUCTURES = Object.freeze([
  "CP012-E2-MISSING-ADDEND-MIXED",
  "CP012-E2-MISSING-MULTIPLIER",
  "CP012-E2-MISSING-DIVISOR",
  "CP012-E2-MISSING-SQUARE-ROOT",
  "CP012-E2-MISSING-CUBE-ROOT",
  "CP012-E2-MISSING-ROOT-RATIO",
  "CP012-E2-MISSING-PERCENTAGE",
  "CP012-E2-TWO-SIDED-MIXED-EQUATION",
  "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE",
  "CP012-E2-COUNT-ADMISSIBLE-INTEGERS",
  "CP012-E2-OUTCOME-CLASSIFICATION",
  "CP012-E2-ROUNDED-OPERAND-SYNTHESIS",
] as const);
export type SapCp012E2Structure = typeof SAP_CP012_E2_STRUCTURES[number];

const OFFSETS = Object.freeze([-0.38, -0.24, -0.11, -0.04, 0.07, 0.16, 0.29, 0.41]);
function off(seed: number, salt: number): number { return OFFSETS[(seed * 5 + salt * 3) % OFFSETS.length]!; }
function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1;
  const a = 12 + (p % 19);
  const b = 3 + ((p * 3) % 8);
  const c = 5 + ((p * 7) % 12);
  const m = 2 + ((p * 5) % 5);
  const q = 2 + ((p * 11) % 4);
  return { p, a, b, c, m, q, correctIndex: p % 4 };
}
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }
function numericWrong(answer: number, step = 1, places = 0) {
  return [
    wrong(fmt(answer - step, places), "REVERSE_LOW", "The inverse arithmetic was one step too low."),
    wrong(fmt(answer + step, places), "REVERSE_HIGH", "The inverse arithmetic was one step too high."),
    wrong(fmt(answer + 2 * step, places), "BODMAS_OR_SCALE", "A scale or BODMAS slip changed the recovered value."),
  ];
}
function finish(args: {
  structureId: SapCp012E2Structure;
  seed: number;
  difficulty: "MEDIUM" | "HARD";
  decisionCount: number;
  stem: string;
  answer: string;
  options: ReturnType<typeof optionSet>;
  concept: string;
  steps: readonly string[];
  data: Readonly<Record<string, number | string>>;
}): SapE2Package {
  return packageE2({
    profile: "BANK",
    checkpointId: "SAP-CP-012",
    structureId: args.structureId,
    seed: args.seed,
    difficulty: args.difficulty,
    decisionCount: args.decisionCount,
    stem: args.stem,
    canonicalAnswer: args.answer,
    options: args.options,
    correctIndex: (args.seed - 1) % 4,
    explanation: Object.freeze({ coreConcept: args.concept, steps: Object.freeze(args.steps), finalAnswer: `Therefore, ? ≈ ${args.answer}.` }),
    oracle: Object.freeze({ kind: args.structureId, data: args.data }),
  });
}

function missingAddend(seed: number): SapE2Package {
  const { a, b, c, m, correctIndex } = common(seed);
  const d = 10 + (seed % 13);
  const answer = a * m + c - d;
  const x = a + off(seed, 0), y = m + off(seed, 1), z = c + off(seed, 2), w = d + off(seed, 3);
  const stem = `What approximate value should come in place of ? in ${e2Math(`${fmt(x)} \\times ${fmt(y)} + ${fmt(z)} = ? + ${fmt(w)}`)}?`;
  return finish({ structureId: "CP012-E2-MISSING-ADDEND-MIXED", seed, difficulty: "MEDIUM", decisionCount: 5, stem, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 3)), concept: "Approximate the visible terms first, then reverse the final addition.",
    steps: [`The equation becomes approximately ${a} × ${m} + ${c} = ? + ${d}.`, `So ? ≈ ${a * m + c} - ${d} = ${answer}.`],
    data: Object.freeze({ a, m, c, d, answer, x100: Math.round(x * 100), y100: Math.round(y * 100), z100: Math.round(z * 100), w100: Math.round(w * 100) }) });
}

function missingMultiplier(seed: number): SapE2Package {
  const { a, c, q, correctIndex } = common(seed);
  const answer = 4 + (seed % 11);
  const rhs = a * answer + c;
  const x = a + off(seed, 1), z = c + off(seed, 4), r = rhs + off(seed, 6);
  return finish({ structureId: "CP012-E2-MISSING-MULTIPLIER", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(x)} \\times ? + ${fmt(z)} = ${fmt(r)}`)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 2)), concept: "After approximating the known terms, isolate the multiplier by subtraction and division.",
    steps: [`Use the nearby values ${a}, ${c} and ${rhs}: ${a} × ? + ${c} ≈ ${rhs}.`, `Thus ? ≈ (${rhs} - ${c}) ÷ ${a} = ${answer}.`],
    data: Object.freeze({ a, c, rhs, answer, q, x100: Math.round(x * 100), z100: Math.round(z * 100), r100: Math.round(r * 100) }) });
}

function missingDivisor(seed: number): SapE2Package {
  const { b, c, q, correctIndex } = common(seed);
  const answer = q + 2 + (seed % 4);
  const x = answer * b * (5 + (seed % 7));
  const target = x / answer * b + c;
  const xD = x + off(seed, 0), bD = b + off(seed, 2), cD = c + off(seed, 5), tD = target + off(seed, 7);
  return finish({ structureId: "CP012-E2-MISSING-DIVISOR", seed, difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(xD)} \\div ? \\times ${fmt(bD)} + ${fmt(cD)} = ${fmt(tD)}`)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 1)), concept: "Respect left-to-right division and multiplication, then reverse the expression to recover the divisor.",
    steps: [`The nearby values give ${x} ÷ ? × ${b} + ${c} ≈ ${target}.`, `So ${x * b} ÷ ? ≈ ${target - c}, giving ? ≈ ${answer}.`],
    data: Object.freeze({ x, b, c, target, answer, x100: Math.round(xD * 100), b100: Math.round(bD * 100), c100: Math.round(cD * 100), target100: Math.round(tD * 100) }) });
}

function missingSquareRoot(seed: number): SapE2Package {
  const { a, b, c, correctIndex } = common(seed);
  const answer = 9 + (seed % 15);
  const left = answer ** 2 + b ** 2 - c;
  const leftD = left + off(seed, 0), bD = b + off(seed, 2), cD = c + off(seed, 4);
  return finish({ structureId: "CP012-E2-MISSING-SQUARE-ROOT", seed, difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(leftD)} - (${fmt(bD)})^{2} + ${fmt(cD)} = ?^{2}`)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 2)), concept: "Approximate the known terms, evaluate the square, then take the positive square root of the recovered value.",
    steps: [`The equation becomes ${left} - ${b}² + ${c} ≈ ?² = ${answer ** 2}.`, `Hence ? ≈ ${answer}.`],
    data: Object.freeze({ a, b, c, left, answer, square: answer ** 2, left100: Math.round(leftD * 100), b100: Math.round(bD * 100), c100: Math.round(cD * 100) }) });
}

function missingCubeRoot(seed: number): SapE2Package {
  const { a, c, correctIndex } = common(seed);
  const answer = 4 + (seed % 8);
  const base = 6 + (seed % 9);
  const target = answer ** 3 + base ** 2 - c;
  const bD = base + off(seed, 1), cD = c + off(seed, 3), tD = target + off(seed, 6);
  return finish({ structureId: "CP012-E2-MISSING-CUBE-ROOT", seed, difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`?^{3} + (${fmt(bD)})^{2} - ${fmt(cD)} = ${fmt(tD)}`)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 1)), concept: "Approximate the known terms, isolate the cube and then identify its cube root.",
    steps: [`Using nearby integers: ?³ + ${base}² - ${c} ≈ ${target}.`, `So ?³ ≈ ${target - base ** 2 + c} = ${answer ** 3}, hence ? ≈ ${answer}.`],
    data: Object.freeze({ a, base, c, target, answer, cube: answer ** 3, b100: Math.round(bD * 100), c100: Math.round(cD * 100), target100: Math.round(tD * 100) }) });
}

function missingRootRatio(seed: number): SapE2Package {
  const { a, q, correctIndex } = common(seed);
  const answer = 2 + (seed % 7);
  const root1 = 11 + (seed % 15);
  const root2 = root1 * q * answer;
  const multiplier = q * answer;
  const r1 = root1 ** 2 + off(seed, 0), r2 = root2 ** 2 + off(seed, 4), mD = multiplier + off(seed, 6);
  return finish({ structureId: "CP012-E2-MISSING-ROOT-RATIO", seed, difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(mD)} \\times ${squareRoot(fmt(r1))} = ? \\times ${squareRoot(fmt(r2))}`)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 1)), concept: "Use nearby perfect squares for both roots, then reduce the resulting ratio.",
    steps: [`${squareRoot(fmt(r1))} ≈ ${root1}, ${squareRoot(fmt(r2))} ≈ ${root2}, and ${fmt(mD)} ≈ ${multiplier}.`, `? ≈ (${multiplier} × ${root1}) ÷ ${root2} = ${answer}.`],
    data: Object.freeze({ a, q, answer, root1, root2, multiplier, r1_100: Math.round(r1 * 100), r2_100: Math.round(r2 * 100), m100: Math.round(mD * 100) }) });
}

function missingPercentage(seed: number): SapE2Package {
  const { c, correctIndex } = common(seed);
  const answer = [20, 25, 30, 40, 50, 60][seed % 6]!;
  const base = (12 + (seed % 17)) * 20;
  const rhs = answer * base / 100 + c;
  const bD = base + off(seed, 1), cD = c + off(seed, 4), rD = rhs + off(seed, 7);
  return finish({ structureId: "CP012-E2-MISSING-PERCENTAGE", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `What approximate value should replace ? in ${e2Math(`?\\% \\text{ of } ${fmt(bD)} + ${fmt(cD)} = ${fmt(rD)}`)}?`, answer: `${answer}%`,
    options: optionSet(`${answer}%`, correctIndex, [wrong(`${Math.max(5, answer - 10)}%`, "PERCENT_LOW", "The recovered percentage was too low."), wrong(`${answer + 10}%`, "PERCENT_HIGH", "The recovered percentage was too high."), wrong(`${Math.max(5, answer / 2)}%`, "HALF_RATE", "The final percentage scale was halved.")]),
    concept: "Approximate the known values, remove the additive term, then convert the remaining fraction to a percentage.",
    steps: [`?% of ${base} + ${c} ≈ ${rhs}, so ?% of ${base} ≈ ${rhs - c}.`, `${e2Math(`\\frac{${rhs - c}}{${base}} \\times 100 = ${answer}\\%`)}.`],
    data: Object.freeze({ answerPct: answer, base, c, rhs, b100: Math.round(bD * 100), c100: Math.round(cD * 100), rhs100: Math.round(rD * 100) }) });
}

function twoSidedMixed(seed: number): SapE2Package {
  const { a, b, c, q, correctIndex } = common(seed);
  const leftA = q * (8 + (seed % 13));
  const leftB = q;
  const leftC = b;
  const leftD = c;
  const rightA = (10 + (seed % 11)) * a;
  const rightB = a;
  const rightC = 2 + (seed % 6);
  const left = leftA / leftB * leftC + leftD;
  const rightKnown = rightA / rightB * rightC;
  const answer = left - rightKnown;
  const stem = `What approximate value should replace ? in ${e2Math(`${fmt(leftA + off(seed, 0))} \\div ${fmt(leftB + off(seed, 1))} \\times ${fmt(leftC + off(seed, 2))} + ${fmt(leftD + off(seed, 3))} = ? + ${fmt(rightA + off(seed, 4))} \\div ${fmt(rightB + off(seed, 5))} \\times ${fmt(rightC + off(seed, 6))}`)}?`;
  return finish({ structureId: "CP012-E2-TWO-SIDED-MIXED-EQUATION", seed, difficulty: "HARD", decisionCount: 7, stem, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, Math.max(2, Math.round(Math.abs(answer) * 0.1)))), concept: "Approximate and simplify each side separately, then move the known right-side term across.",
    steps: [`The left side is about ${left}; the known term on the right is about ${rightKnown}.`, `So ? ≈ ${left} - ${rightKnown} = ${answer}.`],
    data: Object.freeze({ leftA, leftB, leftC, leftD, rightA, rightB, rightC, left, rightKnown, answer }) });
}

function uniqueTolerance(seed: number): SapE2Package {
  const { a, c, correctIndex } = common(seed);
  const answer = 6 + (seed % 13);
  const known = a + off(seed, 2);
  const target = a + answer + c / 10;
  const tolerance = 0.45;
  const displayTarget = target + off(seed, 5) / 10;
  return finish({ structureId: "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", seed, difficulty: "MEDIUM", decisionCount: 4,
    stem: `For integer ?, which option makes ${e2Math(`${fmt(known)} + ?`)} lie within ±${fmt(tolerance, 2)} of ${fmt(displayTarget, 2)}?`, answer: String(answer),
    options: optionSet(String(answer), correctIndex, numericWrong(answer, 1)), concept: "Turn the tolerance into an allowed interval, then test the integer candidates.",
    steps: [`The required value of ? is close to ${fmt(displayTarget - known, 2)}.`, `Only the integer ${answer} keeps the expression inside the stated tolerance.`],
    data: Object.freeze({ known100: Math.round(known * 100), target100: Math.round(displayTarget * 100), tolerance100: Math.round(tolerance * 100), answer, c }) });
}

function countAdmissible(seed: number): SapE2Package {
  const { a, correctIndex } = common(seed);
  const centre = 10 + (seed % 25);
  const width = seed % 2 ? 1.4 : 2.4;
  const lower = centre - width;
  const upper = centre + width;
  const first = Math.ceil(lower);
  const last = Math.floor(upper);
  const count = last - first + 1;
  const answer = String(count);
  return finish({ structureId: "CP012-E2-COUNT-ADMISSIBLE-INTEGERS", seed, difficulty: "HARD", decisionCount: 4,
    stem: `An approximate calculation requires integer ? to satisfy ${e2Math(`${fmt(lower, 1)} \\le ? \\le ${fmt(upper, 1)}`)}. How many integer values of ? are admissible?`, answer,
    options: optionSet(answer, correctIndex, [wrong(String(Math.max(1, count - 1)), "MISS_ENDPOINT", "One valid endpoint-side integer was missed."), wrong(String(count + 1), "INCLUDE_OUTSIDE", "An integer outside the band was included."), wrong(String(count + 2), "ROUND_BAND", "Both limits were rounded outward incorrectly.")]),
    concept: "List the integers inside the complete tolerance band; do not stop after finding one example.",
    steps: [`The admissible integers run from ${first} through ${last}.`, `That gives ${last} - ${first} + 1 = ${count} values.`],
    data: Object.freeze({ a, centre, lower10: Math.round(lower * 10), upper10: Math.round(upper * 10), first, last, count }) });
}

function outcomeClassification(seed: number): SapE2Package {
  const { a, correctIndex } = common(seed);
  const mode = seed % 3;
  const centre = 8 + (seed % 21);
  let lower: number, upper: number, answer: string;
  if (mode === 0) { lower = centre - 0.2; upper = centre + 0.2; answer = "Unique"; }
  else if (mode === 1) { lower = centre - 1.2; upper = centre + 1.2; answer = "Multiple"; }
  else { lower = centre + 0.2; upper = centre + 0.8; answer = "Impossible"; }
  return finish({ structureId: "CP012-E2-OUTCOME-CLASSIFICATION", seed, difficulty: "HARD", decisionCount: 4,
    stem: `Integer ? must lie in the approximation band ${e2Math(`${fmt(lower, 1)} < ? < ${fmt(upper, 1)}`)}. How should the outcome be classified?`, answer,
    options: optionSet(answer, correctIndex, [wrong("Unique", "FORCE_UNIQUE", "The band was not checked for all integer candidates."), wrong("Multiple", "FORCE_MULTIPLE", "The number of admissible integers was miscounted."), wrong("Impossible", "FORCE_IMPOSSIBLE", "A valid integer candidate was overlooked.")]),
    concept: "Count all integer candidates in the band before classifying the approximate equation.",
    steps: [`Integers strictly between ${fmt(lower, 1)} and ${fmt(upper, 1)} determine the outcome.`, `The candidate set is ${answer.toLowerCase() === "unique" ? "one value" : answer.toLowerCase() === "multiple" ? "more than one value" : "empty"}, so the outcome is ${answer}.`],
    data: Object.freeze({ a, mode, centre, lower10: Math.round(lower * 10), upper10: Math.round(upper * 10), classification: answer }) });
}

function roundedOperandSynthesis(seed: number): SapE2Package {
  const { a, c, correctIndex } = common(seed);
  const rounded = 20 + (seed % 35);
  const multiplier = 2 + (seed % 4);
  const result = rounded * multiplier + c;
  const answer = `${fmt(rounded - 0.5, 1)} ≤ x < ${fmt(rounded + 0.5, 1)}`;
  return finish({ structureId: "CP012-E2-ROUNDED-OPERAND-SYNTHESIS", seed, difficulty: "HARD", decisionCount: 5,
    stem: `A positive number x is rounded to the nearest integer before evaluating ${e2Math(`${multiplier}x + ${c}`)}. The approximate result is ${result}. Which interval can contain the original x?`, answer,
    options: optionSet(answer, correctIndex, [wrong(`${rounded} ≤ x < ${fmt(rounded + 1, 1)}`, "DROP_LOWER_HALF", "The lower half of the rounding interval was lost."), wrong(`${fmt(rounded - 1, 1)} ≤ x < ${fmt(rounded + 1, 1)}`, "TOO_WIDE", "The interval is wider than nearest-integer rounding allows."), wrong(`${fmt(rounded - 0.5, 1)} < x ≤ ${fmt(rounded + 0.5, 1)}`, "ENDPOINTS_REVERSED", "The half-open rounding endpoints were reversed.")]),
    concept: "First recover the rounded integer used in the expression, then reverse the nearest-integer rounding rule.",
    steps: [`${multiplier} × rounded value + ${c} = ${result}, so the rounded value is ${rounded}.`, `A number rounding to ${rounded} lies in ${answer}.`],
    data: Object.freeze({ a, rounded, multiplier, c, result, lower10: rounded * 10 - 5, upper10: rounded * 10 + 5 }) });
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  switch (structureId) {
    case "CP012-E2-MISSING-ADDEND-MIXED": return missingAddend(seed);
    case "CP012-E2-MISSING-MULTIPLIER": return missingMultiplier(seed);
    case "CP012-E2-MISSING-DIVISOR": return missingDivisor(seed);
    case "CP012-E2-MISSING-SQUARE-ROOT": return missingSquareRoot(seed);
    case "CP012-E2-MISSING-CUBE-ROOT": return missingCubeRoot(seed);
    case "CP012-E2-MISSING-ROOT-RATIO": return missingRootRatio(seed);
    case "CP012-E2-MISSING-PERCENTAGE": return missingPercentage(seed);
    case "CP012-E2-TWO-SIDED-MIXED-EQUATION": return twoSidedMixed(seed);
    case "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE": return uniqueTolerance(seed);
    case "CP012-E2-COUNT-ADMISSIBLE-INTEGERS": return countAdmissible(seed);
    case "CP012-E2-OUTCOME-CLASSIFICATION": return outcomeClassification(seed);
    case "CP012-E2-ROUNDED-OPERAND-SYNTHESIS": return roundedOperandSynthesis(seed);
  }
}
