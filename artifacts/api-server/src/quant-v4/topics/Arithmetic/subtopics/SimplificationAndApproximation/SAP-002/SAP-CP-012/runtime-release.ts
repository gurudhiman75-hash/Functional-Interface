import { e2Math, fmt, optionSet, packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateFinal, type SapCp012E2Structure } from "./runtime-final";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const TIGHT = Object.freeze([-0.08, -0.05, -0.03, -0.01, 0.02, 0.04, 0.06, 0.08]);
const MULT = Object.freeze([-0.02, -0.01, 0.01, 0.02]);
function tight(seed: number, salt: number): number { return TIGHT[(seed * 3 + salt * 5) % TIGHT.length]!; }
function mult(seed: number, salt = 0): number { return MULT[(seed * 5 + 1 + salt) % MULT.length]!; }
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function missingAddend(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1, correctIndex = p % 4;
  const a = 12 + (p % 19), m = 3 + ((p * 3) % 5), c = 5 + ((p * 7) % 12), d = 6 + ((p * 11) % 11);
  const answer = a * m + c - d;
  const x = a + tight(seed, 0), y = m + mult(seed), z = c + tight(seed, 2), w = d + tight(seed, 4);
  const exactImplied = x * y + z - w, answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-ADDEND-MIXED", seed, difficulty: "MEDIUM", decisionCount: 5,
    stem: `What approximate value should come in place of ? in ${e2Math(`${fmt(x)} \\times ${fmt(y)} + ${fmt(z)} = ? + ${fmt(w)}`)}?`, canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [wrong(String(answer - 3), "REVERSE_LOW", "The final subtraction was taken too far."), wrong(String(answer + 3), "REVERSE_HIGH", "The recovered value was pushed too high."), wrong(String(answer + 6), "PRODUCT_OR_SIDE_SLIP", "A product or transposition slip changed the answer.")]), correctIndex,
    explanation: Object.freeze({ coreConcept: "Use nearby whole numbers for the displayed terms, then move the known addend to the other side.", steps: Object.freeze([`The equation is approximately ${a} × ${m} + ${c} = ? + ${d}.`, `So ? ≈ ${a * m + c} - ${d} = ${answer}.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-ADDEND-MIXED", data: Object.freeze({ a, m, c, d, answer, x100: Math.round(x * 100), y100: Math.round(y * 100), z100: Math.round(z * 100), w100: Math.round(w * 100), exactImplied10000: Math.round(exactImplied * 10000) }) }),
  });
}

function missingDivisor(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1, correctIndex = p % 4;
  const answer = 4 + (p % 7), b = 3 + ((p * 3) % 8), base = 5 + ((p * 5) % 8), c = 5 + ((p * 7) % 12);
  const x = answer * b * base, target = b * b * base + c;
  const xD = x + tight(seed, 0), bD = b + mult(seed, 1), cD = c + tight(seed, 3), tD = target + tight(seed, 6);
  const exactImplied = xD * bD / (tD - cD), answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-DIVISOR", seed, difficulty: "HARD", decisionCount: 5,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(xD)} \\div ? \\times ${fmt(bD)} + ${fmt(cD)} = ${fmt(tD)}`)}?`, canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [wrong(String(answer - 1), "DIVISOR_LOW", "The recovered divisor was one step too low."), wrong(String(answer + 1), "DIVISOR_HIGH", "The recovered divisor was one step too high."), wrong(String(answer + 2), "ORDER_SLIP", "Division and multiplication were reversed incorrectly.")]), correctIndex,
    explanation: Object.freeze({ coreConcept: "Approximate the visible terms, remove the additive term, then invert the remaining quotient-product relation.", steps: Object.freeze([`${x} ÷ ? × ${b} + ${c} ≈ ${target}.`, `Thus ${x * b} ÷ ? ≈ ${target - c}, giving ? ≈ ${answer}.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-DIVISOR", data: Object.freeze({ answer, b, base, c, x, target, x100: Math.round(xD * 100), b100: Math.round(bD * 100), c100: Math.round(cD * 100), target100: Math.round(tD * 100), exactImplied10000: Math.round(exactImplied * 10000) }) }),
  });
}

function twoSided(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1, correctIndex = p % 4;
  const leftDen = 5 + (p % 4), leftBase = 7 + ((p * 3) % 10), leftNum = leftDen * leftBase, leftMul = 3 + ((p * 5) % 6), leftC = 5 + ((p * 7) % 12);
  const rightDen = 6 + ((p * 2) % 5), rightBase = 6 + ((p * 7) % 9), rightNum = rightDen * rightBase, rightMul = 2 + ((p * 5) % 6);
  const left = leftBase * leftMul + leftC, rightKnown = rightBase * rightMul, answer = left - rightKnown;
  const lNumD = leftNum + tight(seed, 0), lMulD = leftMul + mult(seed, 1), lCD = leftC + tight(seed, 2);
  const rNumD = rightNum + tight(seed, 4), rMulD = rightMul + mult(seed, 2);
  const exactImplied = lNumD / leftDen * lMulD + lCD - rNumD / rightDen * rMulD;
  const answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-TWO-SIDED-MIXED-EQUATION", seed, difficulty: "HARD", decisionCount: 7,
    stem: `What approximate value should replace ? in ${e2Math(`${fmt(lNumD)} \\div ${leftDen} \\times ${fmt(lMulD)} + ${fmt(lCD)} = ? + ${fmt(rNumD)} \\div ${rightDen} \\times ${fmt(rMulD)}`)}?`, canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [wrong(String(answer - 3), "LEFT_RIGHT_LOW", "One side was simplified or transposed too low."), wrong(String(answer + 3), "LEFT_RIGHT_HIGH", "One side was simplified or transposed too high."), wrong(String(answer + 6), "BODMAS_SLIP", "A left-to-right division or multiplication slip changed the difference.")]), correctIndex,
    explanation: Object.freeze({ coreConcept: "Simplify the two sides separately with nearby values, then subtract the known right-side term from the left side.", steps: Object.freeze([`The left side is about ${left}; the known term on the right is about ${rightKnown}.`, `So ? ≈ ${left} - ${rightKnown} = ${answer}.`]), finalAnswer: `Therefore, ? ≈ ${answer}.` }),
    oracle: Object.freeze({ kind: "CP012-E2-TWO-SIDED-MIXED-EQUATION", data: Object.freeze({ leftDen, leftBase, leftNum, leftMul, leftC, rightDen, rightBase, rightNum, rightMul, left, rightKnown, answer, lNum100: Math.round(lNumD * 100), lMul100: Math.round(lMulD * 100), lC100: Math.round(lCD * 100), rNum100: Math.round(rNumD * 100), rMul100: Math.round(rMulD * 100), exactImplied10000: Math.round(exactImplied * 10000) }) }),
  });
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  if (structureId === "CP012-E2-MISSING-ADDEND-MIXED") return missingAddend(seed);
  if (structureId === "CP012-E2-MISSING-DIVISOR") return missingDivisor(seed);
  if (structureId === "CP012-E2-TWO-SIDED-MIXED-EQUATION") return twoSided(seed);
  return generateFinal(structureId, seed);
}
