import { packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR6, type SapCp012E2Structure } from "./runtime-release-r6";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

function repackage(q: SapE2Package, finalAnswer: string): SapE2Package {
  return packageE2({
    profile: q.profile,
    checkpointId: q.checkpointId,
    structureId: q.structureId,
    seed: q.seed,
    difficulty: q.difficulty,
    decisionCount: q.decisionCount,
    stem: q.stem,
    canonicalAnswer: q.canonicalAnswer,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: Object.freeze({ ...q.explanation, finalAnswer }),
    oracle: q.oracle,
  });
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  const q = generateR6(structureId, seed);
  if (structureId === "CP012-E2-UNIQUE-INTEGER-WITHIN-TOLERANCE") {
    return repackage(q, `Therefore, ? = ${q.canonicalAnswer}.`);
  }
  return q;
}
