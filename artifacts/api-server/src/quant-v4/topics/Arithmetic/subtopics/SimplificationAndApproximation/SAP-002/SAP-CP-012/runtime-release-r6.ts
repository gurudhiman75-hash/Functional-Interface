import type { SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR5, type SapCp012E2Structure } from "./runtime-release-r5";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

function polish(q: SapE2Package): SapE2Package {
  if (q.structureId === "CP012-E2-ROUNDED-OPERAND-SYNTHESIS") {
    return Object.freeze({
      ...q,
      difficulty: "MEDIUM" as const,
      stem: q.stem.replace("Which interval can contain the original x?", "Which is the exact interval of possible values for the original x?"),
      explanation: Object.freeze({ ...q.explanation, finalAnswer: `Therefore, ${q.canonicalAnswer}.` }),
    });
  }
  if (q.structureId === "CP012-E2-COUNT-ADMISSIBLE-INTEGERS" || q.structureId === "CP012-E2-OUTCOME-CLASSIFICATION") {
    return Object.freeze({ ...q, difficulty: "MEDIUM" as const });
  }
  return q;
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  return polish(generateR5(structureId, seed));
}
