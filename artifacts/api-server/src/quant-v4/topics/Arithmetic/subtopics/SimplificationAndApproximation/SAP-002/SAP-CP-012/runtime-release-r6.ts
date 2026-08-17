import { packageE2, type SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR5, type SapCp012E2Structure } from "./runtime-release-r5";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

function repackage(q: SapE2Package, patch: { stem?: string; difficulty?: "MEDIUM" | "HARD"; finalAnswer?: string }): SapE2Package {
  return packageE2({
    profile: q.profile,
    checkpointId: q.checkpointId,
    structureId: q.structureId,
    seed: q.seed,
    difficulty: patch.difficulty ?? q.difficulty,
    decisionCount: q.decisionCount,
    stem: patch.stem ?? q.stem,
    canonicalAnswer: q.canonicalAnswer,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: Object.freeze({ ...q.explanation, finalAnswer: patch.finalAnswer ?? q.explanation.finalAnswer }),
    oracle: q.oracle,
  });
}

function polish(q: SapE2Package): SapE2Package {
  if (q.structureId === "CP012-E2-ROUNDED-OPERAND-SYNTHESIS") {
    return repackage(q, {
      difficulty: "MEDIUM",
      stem: q.stem.replace("Which interval can contain the original x?", "Which is the exact interval of possible values for the original x?"),
      finalAnswer: `Therefore, ${q.canonicalAnswer}.`,
    });
  }
  if (q.structureId === "CP012-E2-COUNT-ADMISSIBLE-INTEGERS" || q.structureId === "CP012-E2-OUTCOME-CLASSIFICATION") {
    return repackage(q, { difficulty: "MEDIUM" });
  }
  return q;
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  return polish(generateR5(structureId, seed));
}
