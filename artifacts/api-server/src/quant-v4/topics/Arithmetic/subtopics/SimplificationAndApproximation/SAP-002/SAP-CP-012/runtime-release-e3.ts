import { packageE2, type SapE2Option, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR6, type SapCp012E2Structure } from "./runtime-release-r6";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

function foldCertifiedSeed(seed: number): number {
  if (seed <= 100) return seed;
  const value = seed - 1;
  const low = value % 100;
  const mid = Math.floor(value / 100) % 100;
  const high = Math.floor(value / 10_000) % 100;
  // Preserve the certified 1..100 runtime while folding all six Question Studio
  // source-seed digits; plain modulo 100 discarded four digits and caused repeats.
  return ((8 * low + 9 * mid + 3 * high) % 100) + 1;
}

function repackage(q: SapE2Package, finalAnswer: string, options: readonly SapE2Option[] = q.options): SapE2Package {
  return packageE2({
    profile: q.profile,
    checkpointId: q.checkpointId,
    structureId: q.structureId,
    seed: q.seed,
    difficulty: q.difficulty,
    decisionCount: q.decisionCount,
    stem: q.stem,
    canonicalAnswer: q.canonicalAnswer,
    options,
    correctIndex: q.correctIndex,
    explanation: Object.freeze({ ...q.explanation, finalAnswer }),
    oracle: q.oracle,
  });
}

function polishUniqueInteger(q: SapE2Package): SapE2Package {
  const answer = Number(q.canonicalAnswer);
  const options = Object.freeze(q.options.map((o): SapE2Option => {
    if (o.isCorrect) return o;
    const value = Number(o.value);
    if (value === answer - 1) return Object.freeze({ ...o, misconceptionId: "TOLERANCE_INTEGER_ONE_LOW", analysis: "The candidate integer is taken one below the value indicated by the centre of the tolerance band." });
    if (value === answer + 1) return Object.freeze({ ...o, misconceptionId: "TOLERANCE_INTEGER_ONE_HIGH", analysis: "The candidate integer is taken one above the value indicated by the centre of the tolerance band." });
    return Object.freeze({ ...o, misconceptionId: "TOLERANCE_BAND_SHIFT_HIGH", analysis: "The allowable tolerance band is shifted too high, producing an integer outside the stated ±0.49 condition." });
  }));
  return repackage(q, `Therefore, ? = ${q.canonicalAnswer}.`, options);
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("CP012 seed must be a positive integer.");
  const sourceSeed = foldCertifiedSeed(seed);
  const q = generateR6(structureId, sourceSeed);
  if (structureId === "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE") return polishUniqueInteger(q);
  return q;
}
