import {
  SAP_CP010_E1_R2_STRUCTURES,
  generateSapCp010E1R2 as generateReleaseV3,
  type SapCp010E1R2Structure,
} from "./e1-r2-exam-runtime-release";
import type { SapE1R2Package } from "../../SAP-E1-R2-TYPES";

export { SAP_CP010_E1_R2_STRUCTURES };
export type { SapCp010E1R2Structure };

export function generateSapCp010E1R2(
  structureId: SapCp010E1R2Structure,
  seed: number,
): SapE1R2Package {
  const q = generateReleaseV3(structureId, seed);
  if (structureId !== "CP010-R2-SUPPLIED-ROOT-QUOTIENT") return q;
  return Object.freeze({ ...q, difficulty: "MEDIUM" as const });
}
