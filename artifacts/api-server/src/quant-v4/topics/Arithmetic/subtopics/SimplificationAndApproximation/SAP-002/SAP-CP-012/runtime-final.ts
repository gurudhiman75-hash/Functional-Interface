import { e2Math, fmt, optionSet, packageE2, squareRoot, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateCandidate, type SapCp012E2Structure } from "./runtime";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const OFFSETS = Object.freeze([-0.38, -0.24, -0.11, -0.04, 0.07, 0.16, 0.29, 0.41]);
function off(seed: number, salt: number): number { return OFFSETS[(seed * 5 + salt * 3) % OFFSETS.length]!; }
function common(seed: number) {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1;
  const a = 12 + (p % 19);
  const c = 5 + ((p * 7) % 12);
  const q = 2 + ((p * 11) % 4);
  return { p, a, c, q, correctIndex: p % 4 };
}
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }
function numericWrong(answer: number, step = 1) {
  return [
    wrong(String(answer - step), "REVERSE_LOW", "The inverse arithmetic was one step too low."),
    wrong(String(answer + step), "REVERSE_HIGH", "The inverse arithmetic was one step too high."),
    wrong(String(answer + 2 * step), "BODMAS_OR_SCALE", "A scale or BODMAS slip changed the recovered value."),
  ];
}

function rootRatio(seed: number): SapE2Package {
  const { a, q, correctIndex } = common(seed);
  const answer = 2 + (seed % 7);
  const root1 = 11 + (seed % 15);
  const root2 = root1 * q;
  const multiplier = q * answer;
  const r1 = root1 ** 2 + off(seed, 0);
  const r2 = root2 ** 2 + off(seed, 4);
  const mD = multiplier + off(seed, 6);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-ROOT-RATIO", seed,
    difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(mD)} \\times ${squareRoot(fmt(r1))} = ? \\times ${squareRoot(fmt(r2))}`)}?`,
    canonicalAnswer: String(answer), options: optionSet(String(answer), correctIndex, numericWrong(answer)), correctIndex,
    explanation: Object.freeze({ coreConcept: "Use nearby perfect squares for both roots, then reduce the resulting ratio.", steps: Object.freeze([`${squareRoot(fmt(r1))} ≈ ${root1}, ${squareRoot(fmt(r2))} ≈ ${root2}, and ${fmt(mD)} ≈ ${multiplier}.`, `? ≈ (${multiplier} × ${root1}) ÷ ${root2} = ${answer}.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-ROOT-RATIO", data: Object.freeze({ a, q, answer, root1, root2, multiplier, r1_100: Math.round(r1 * 100), r2_100: Math.round(r2 * 100), m100: Math.round(mD * 100) }) }),
  });
}

function missingPercentage(seed: number): SapE2Package {
  const { c, correctIndex } = common(seed);
  const answer = [20, 25, 30, 40, 50, 60][seed % 6]!;
  const base = (12 + (seed % 17)) * 20;
  const rhs = answer * base / 100 + c;
  const bD = base + off(seed, 1), cD = c + off(seed, 4), rD = rhs + off(seed, 7);
  const answerText = `${answer}%`;
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-PERCENTAGE", seed,
    difficulty: "MEDIUM", decisionCount: 4,
    stem: `What approximate value should replace ? in ${e2Math(`?\\% \\text{ of } ${fmt(bD)} + ${fmt(cD)} = ${fmt(rD)}`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [wrong(`${Math.max(5, answer - 5)}%`, "PERCENT_LOW", "The recovered percentage was slightly too low."), wrong(`${answer + 5}%`, "PERCENT_HIGH", "The recovered percentage was slightly too high."), wrong(`${answer + 15}%`, "SCALE_SLIP", "The percentage scale was handled incorrectly.")]),
    correctIndex,
    explanation: Object.freeze({ coreConcept: "Approximate the known values, remove the additive term, then convert the remaining fraction to a percentage.", steps: Object.freeze([`?% of ${base} + ${c} ≈ ${rhs}, so ?% of ${base} ≈ ${rhs - c}.`, `${e2Math(`\\frac{${rhs - c}}{${base}} \\times 100 = ${answer}\\%`)}.`]), finalAnswer: `Therefore, ? ≈ ${answerText}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-PERCENTAGE", data: Object.freeze({ answerPct: answer, base, c, rhs, b100: Math.round(bD * 100), c100: Math.round(cD * 100), rhs100: Math.round(rD * 100) }) }),
  });
}

function missingCubeRoot(seed: number): SapE2Package {
  const { p, c, correctIndex } = common(seed);
  const answer = 4 + (p % 8);
  const base = 6 + (p % 25);
  const target = answer ** 3 + base ** 2 - c;
  const bD = base + off(seed, 1), cD = c + off(seed, 3), tD = target + off(seed, 6);
  const answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-CUBE-ROOT", seed,
    difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`?^{3} + (${fmt(bD)})^{2} - ${fmt(cD)} = ${fmt(tD)}`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [wrong(String(answer - 1), "CUBE_LOW", "The recovered cube was matched to the lower cube root."), wrong(String(answer + 1), "CUBE_HIGH", "The recovered cube was matched to the higher cube root."), wrong(String(answer + 2), "ARITHMETIC_SLIP", "A square or subtraction slip changed the recovered cube.")]),
    correctIndex,
    explanation: Object.freeze({ coreConcept: "Approximate the known terms, isolate the cube and identify its cube root.", steps: Object.freeze([`Using nearby integers: ?³ + ${base}² - ${c} ≈ ${target}.`, `So ?³ ≈ ${target - base ** 2 + c} = ${answer ** 3}, hence ? ≈ ${answer}.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-CUBE-ROOT", data: Object.freeze({ base, c, target, answer, cube: answer ** 3, b100: Math.round(bD * 100), c100: Math.round(cD * 100), target100: Math.round(tD * 100) }) }),
  });
}

function uniqueTolerance(seed: number): SapE2Package {
  const { a, c, correctIndex } = common(seed);
  const answer = 6 + (seed % 13);
  const known = a + off(seed, 2);
  const displayTarget = a + answer + off(seed, 5) / 10;
  const tolerance = 0.49;
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", seed,
    difficulty: "MEDIUM", decisionCount: 4,
    stem: `For integer ?, which option makes ${e2Math(`${fmt(known)} + ?`)} lie within ±${fmt(tolerance, 2)} of ${fmt(displayTarget, 2)}?`,
    canonicalAnswer: String(answer), options: optionSet(String(answer), correctIndex, numericWrong(answer)), correctIndex,
    explanation: Object.freeze({ coreConcept: "Turn the tolerance into an allowed interval, then test the integer candidates.", steps: Object.freeze([`The required value of ? is close to ${fmt(displayTarget - known, 2)}.`, `Only the integer ${answer} keeps the expression inside the stated tolerance.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE", data: Object.freeze({ known100: Math.round(known * 100), target100: Math.round(displayTarget * 100), tolerance100: 49, answer, c }) }),
  });
}

function countAdmissible(seed: number): SapE2Package {
  const { a, correctIndex } = common(seed);
  const centre = 9 + seed;
  const width = seed % 2 ? 1.4 : 2.4;
  const lower = centre - width;
  const upper = centre + width;
  const first = Math.ceil(lower);
  const last = Math.floor(upper);
  const count = last - first + 1;
  const answer = String(count);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-COUNT-ADMISSIBLE-INTEGERS", seed,
    difficulty: "HARD", decisionCount: 4,
    stem: `An approximate calculation requires integer ? to satisfy ${e2Math(`${fmt(lower, 1)} \\le ? \\le ${fmt(upper, 1)}`)}. How many integer values of ? are admissible?`,
    canonicalAnswer: answer,
    options: optionSet(answer, correctIndex, [wrong(String(Math.max(1, count - 1)), "MISS_ENDPOINT", "One valid endpoint-side integer was missed."), wrong(String(count + 1), "INCLUDE_OUTSIDE", "An integer outside the band was included."), wrong(String(count + 2), "ROUND_BAND", "Both limits were rounded outward incorrectly.")]), correctIndex,
    explanation: Object.freeze({ coreConcept: "List the integers inside the complete tolerance band; do not stop after finding one example.", steps: Object.freeze([`The admissible integers run from ${first} through ${last}.`, `That gives ${last} - ${first} + 1 = ${count} values.`]), finalAnswer: `Therefore, the number of admissible values is ${count}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-COUNT-ADMISSIBLE-INTEGERS", data: Object.freeze({ a, centre, lower10: Math.round(lower * 10), upper10: Math.round(upper * 10), first, last, count }) }),
  });
}

function outcomeClassification(seed: number): SapE2Package {
  const { a, correctIndex } = common(seed);
  const mode = seed % 3;
  const centre = 7 + seed;
  let lower: number, upper: number, answer: string;
  if (mode === 0) { lower = centre - 0.2; upper = centre + 0.2; answer = "Unique"; }
  else if (mode === 1) { lower = centre - 1.2; upper = centre + 1.2; answer = "Multiple"; }
  else { lower = centre + 0.2; upper = centre + 0.8; answer = "Impossible"; }
  const classes = ["Unique", "Multiple", "Impossible", "Indeterminate"];
  const wrongs = classes.filter(v => v !== answer).map(v => wrong(v, `CLASS_${v.toUpperCase()}`, "The integer candidates inside the band were classified incorrectly."));
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-OUTCOME-CLASSIFICATION", seed,
    difficulty: "HARD", decisionCount: 4,
    stem: `Integer ? must lie in the approximation band ${e2Math(`${fmt(lower, 1)} < ? < ${fmt(upper, 1)}`)}. How should the outcome be classified?`,
    canonicalAnswer: answer, options: optionSet(answer, correctIndex, wrongs), correctIndex,
    explanation: Object.freeze({ coreConcept: "Count all integer candidates in the band before classifying the approximate equation.", steps: Object.freeze([`Check every integer strictly between ${fmt(lower, 1)} and ${fmt(upper, 1)}.`, `The candidate set contains ${answer === "Unique" ? "one value" : answer === "Multiple" ? "more than one value" : "no value"}, so the outcome is ${answer}.`]), finalAnswer: `Therefore, the outcome is ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-OUTCOME-CLASSIFICATION", data: Object.freeze({ a, mode, centre, lower10: Math.round(lower * 10), upper10: Math.round(upper * 10), classification: answer }) }),
  });
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  switch (structureId) {
    case "CP012-E2-MISSING-ROOT-RATIO": return rootRatio(seed);
    case "CP012-E2-MISSING-PERCENTAGE": return missingPercentage(seed);
    case "CP012-E2-MISSING-CUBE-ROOT": return missingCubeRoot(seed);
    case "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE": return uniqueTolerance(seed);
    case "CP012-E2-COUNT-ADMISSIBLE-INTEGERS": return countAdmissible(seed);
    case "CP012-E2-OUTCOME-CLASSIFICATION": return outcomeClassification(seed);
    default: return generateCandidate(structureId, seed);
  }
}
