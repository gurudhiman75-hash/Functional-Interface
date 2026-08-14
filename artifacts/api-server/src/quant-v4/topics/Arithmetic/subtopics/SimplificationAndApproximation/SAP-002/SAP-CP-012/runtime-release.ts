import { e2Math, fmt, optionSet, packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateFinal, type SapCp012E2Structure } from "./runtime-final";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

const OFFSETS = Object.freeze([-0.38, -0.24, -0.11, -0.04, 0.07, 0.16, 0.29, 0.41]);
function off(seed: number, salt: number): number { return OFFSETS[(seed * 5 + salt * 3) % OFFSETS.length]!; }
function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function cubeRootInverse(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP012 seed must be 1..100.");
  const p = seed - 1;
  const correctIndex = p % 4;
  const answer = 4 + (p % 8);
  const base = 6 + (p % 25);
  const c = 5 + ((p * 7) % 12);
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

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  if (structureId === "CP012-E2-MISSING-CUBE-ROOT") return cubeRootInverse(seed);
  return generateFinal(structureId, seed);
}
