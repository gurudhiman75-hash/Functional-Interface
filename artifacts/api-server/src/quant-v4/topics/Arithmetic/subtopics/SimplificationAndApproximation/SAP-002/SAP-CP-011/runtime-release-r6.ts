import { optionSet, packageE2, fmt, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP011_E2_STRUCTURES, generateSapCp011E2 as generateR5, type SapCp011E2Structure } from "./runtime-release";

export { SAP_CP011_E2_STRUCTURES };
export type { SapCp011E2Structure };

function wrong(value: string, id: string, analysis: string) { return { value, id, analysis }; }

function compareAccuracy(seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1 || seed > 100) throw new Error("CP011 seed must be 1..100.");
  const p = seed - 1;
  const anchor = 18 + p;
  const correctIndex = p % 4;
  const block = Math.floor(p / 4);
  const exact100 = anchor * 100 + 37;
  const small = 20 + (seed % 6) * 5;
  const large = small + 15 + (seed % 4) * 5;
  const estimate1IsBetter = (block + 2 * correctIndex) % 4 < 2;
  const d1 = estimate1IsBetter ? small : large;
  const d2 = estimate1IsBetter ? large : small;
  const e1 = exact100 + (seed % 3 === 0 ? -d1 : d1);
  const e2 = exact100 + (seed % 3 === 1 ? -d2 : d2);
  const answer = estimate1IsBetter ? `Estimate 1 (${fmt(e1 / 100, 2)})` : `Estimate 2 (${fmt(e2 / 100, 2)})`;
  const other = estimate1IsBetter ? `Estimate 2 (${fmt(e2 / 100, 2)})` : `Estimate 1 (${fmt(e1 / 100, 2)})`;
  return packageE2({
    profile: "BANK", checkpointId: "SAP-CP-011", structureId: "CP011-E2-COMPARE-ESTIMATE-ACCURACY", seed,
    difficulty: "MEDIUM", decisionCount: 3,
    stem: `The exact value of an expression is ${fmt(exact100 / 100, 2)}. Two estimates are ${fmt(e1 / 100, 2)} and ${fmt(e2 / 100, 2)}. Which statement is correct?`,
    canonicalAnswer: answer,
    options: optionSet(answer, correctIndex, [
      wrong(other, "CHOOSE_FARTHER", "The estimate with the larger absolute error was selected."),
      wrong("Both are equally accurate", "IGNORE_GAP", "The two absolute errors are not equal."),
      wrong("Neither can be compared", "NO_COMPARISON", "Both estimates can be compared with the same exact value."),
    ]), correctIndex,
    explanation: Object.freeze({
      coreConcept: "The more accurate estimate has the smaller absolute error.",
      steps: Object.freeze([
        `Estimate 1 has error ${fmt(d1 / 100, 2)}; Estimate 2 has error ${fmt(d2 / 100, 2)}.`,
        `${fmt(Math.min(d1, d2) / 100, 2)} is smaller, so ${answer} is more accurate.`,
      ]),
      finalAnswer: `Therefore, ${answer} is the correct choice.`,
    }),
    oracle: Object.freeze({ kind: "CP011-E2-COMPARE-ESTIMATE-ACCURACY", data: Object.freeze({ exact100, e1, e2, d1, d2, better: estimate1IsBetter ? 1 : 2, block }) }),
  });
}

export function generateSapCp011E2(structureId: SapCp011E2Structure, seed: number): SapE2Package {
  if (structureId === "CP011-E2-COMPARE-ESTIMATE-ACCURACY") return compareAccuracy(seed);
  return generateR5(structureId, seed);
}
