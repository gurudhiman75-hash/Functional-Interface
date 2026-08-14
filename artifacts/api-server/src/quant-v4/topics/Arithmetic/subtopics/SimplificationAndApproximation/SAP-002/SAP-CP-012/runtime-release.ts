import { e2Math, fmt, optionSet, packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateFinal, type SapCp012E2Structure } from "./runtime-final";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const TIGHT = Object.freeze([-0.08, -0.05, -0.03, -0.01, 0.02, 0.04, 0.06, 0.08]);
const MULT = Object.freeze([-0.02, -0.01, 0.01, 0.02]);
function tight(seed: number, salt: number): number { return TIGHT[(seed * 3 + salt * 5) % TIGHT.length]!; }
function mult(seed: number): number { return MULT[(seed * 5 + 1) % MULT.length]!; }
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function missingAddend(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1;
  const correctIndex = p % 4;
  const a = 12 + (p % 19);
  const m = 3 + ((p * 3) % 5);
  const c = 5 + ((p * 7) % 12);
  const d = 6 + ((p * 11) % 11);
  const answer = a * m + c - d;
  const x = a + tight(seed, 0);
  const y = m + mult(seed);
  const z = c + tight(seed, 2);
  const w = d + tight(seed, 4);
  const exactImplied = x * y + z - w;
  const answerText = String(answer);
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-012", structureId: "CP012-E2-MISSING-ADDEND-MIXED", seed,
    difficulty: "MEDIUM", decisionCount: 5,
    stem: `What approximate value should come in place of ? in ${e2Math(`${fmt(x)} \\times ${fmt(y)} + ${fmt(z)} = ? + ${fmt(w)}`)}?`,
    canonicalAnswer: answerText,
    options: optionSet(answerText, correctIndex, [
      wrong(String(answer - 3), "REVERSE_LOW", "The final subtraction was taken too far."),
      wrong(String(answer + 3), "REVERSE_HIGH", "The recovered value was pushed too high."),
      wrong(String(answer + 6), "PRODUCT_OR_SIDE_SLIP", "A product or transposition slip changed the answer."),
    ]),
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Use nearby whole numbers for the displayed terms, then move the known addend to the other side.",
      steps: Object.freeze([`The equation is approximately ${a} × ${m} + ${c} = ? + ${d}.`, `So ? ≈ ${a * m + c} - ${d} = ${answer}.`]),
      finalAnswer: `Therefore, ? ≈ ${answer}.`,
    }),
    oracle: Object.freeze({ kind: "CP012-E2-MISSING-ADDEND-MIXED", data: Object.freeze({ a, m, c, d, answer, x100: Math.round(x * 100), y100: Math.round(y * 100), z100: Math.round(z * 100), w100: Math.round(w * 100), exactImplied10000: Math.round(exactImplied * 10000) }) }),
  });
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  if (structureId === "CP012-E2-MISSING-ADDEND-MIXED") return missingAddend(seed);
  return generateFinal(structureId, seed);
}
