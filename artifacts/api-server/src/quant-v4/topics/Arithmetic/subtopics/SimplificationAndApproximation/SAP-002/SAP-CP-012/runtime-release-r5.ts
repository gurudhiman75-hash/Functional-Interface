import type { SapE2Package } from "../../SAP-E2-TYPES";
import { SAP_CP012_E2_STRUCTURES, generateSapCp012E2 as generateR4B, type SapCp012E2Structure } from "./runtime-release-r4b";

export { SAP_CP012_E2_STRUCTURES };
export type { SapCp012E2Structure };

function polish(q: SapE2Package): SapE2Package {
  if (q.structureId === "CP012-E2-ROUNDED-OPERAND-SYNTHESIS") {
    return Object.freeze({
      ...q,
      explanation: Object.freeze({
        ...q.explanation,
        finalAnswer: `Therefore, ${q.canonicalAnswer}.`,
      }),
    });
  }
  return q;
}

export function generateSapCp012E2(structureId: SapCp012E2Structure, seed: number): SapE2Package {
  return polish(generateR4B(structureId, seed));
}
