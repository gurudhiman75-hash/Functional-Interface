import { e2Math, fmt, optionSet, packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 as generateCandidate, type SapCp011E2Structure } from "./runtime";

export { SAP_CP011_E2_STRUCTURES };
export type { SapCp011E2Structure };

function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function percentageError(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP011 seed must be 1..100.");
  const p = seed - 1;
  const anchor = 18 + p;
  const correctIndex = p % 4;
  const exact = (anchor + 2) * 10;
  const pct = [2, 4, 5, 8][seed % 4]!;
  const estimate = exact * (100 + (seed % 2 ? pct : -pct)) / 100;
  const answer = `${pct}%`;
  const options = optionSet(answer, correctIndex, [
    wrong(`${pct + 1}%`, "DENOMINATOR_SLIP", "The error percentage was computed with the wrong reference value."),
    wrong(`${pct + 3}%`, "ROUND_HIGH", "The error percentage was pushed too high."),
    wrong(`${pct * 2}%`, "DOUBLE_ERROR", "The absolute error was effectively counted twice."),
  ]);
  return packageE2({
    profile: "SSC",
    checkpointId: "SAP-CP-011",
    structureId: "CP011-E2-PERCENTAGE-ERROR",
    seed,
    difficulty: "MEDIUM",
    decisionCount: 3,
    stem: `An expression has exact value ${exact}, but it was estimated as ${fmt(estimate, 1)}. What is the percentage error in the estimate?`,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: "Compare the absolute error with the exact value, not with the estimate.",
      steps: Object.freeze([`Absolute error = ${fmt(Math.abs(estimate - exact), 1)}.`, `${e2Math(`\\frac{${fmt(Math.abs(estimate - exact), 1)}}{${exact}} \\times 100 = ${pct}\\%`)}.`]),
      finalAnswer: `Therefore, the percentage error is ${answer}.`,
    }),
    oracle: Object.freeze({ kind: "CP011-E2-PERCENTAGE-ERROR", data: Object.freeze({ exact, estimate100: Math.round(estimate * 100), pct, anchor }) }),
  });
}

export function generateSapCp011E2(structureId: SapCp011E2Structure, seed: number): SapE2Package {
  if (structureId === "CP011-E2-PERCENTAGE-ERROR") return percentageError(seed);
  return generateCandidate(structureId, seed);
}
