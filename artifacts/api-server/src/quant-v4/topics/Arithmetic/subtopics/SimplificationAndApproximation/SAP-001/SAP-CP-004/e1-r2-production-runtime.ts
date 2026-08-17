import { SAP_CP004_E1_R2_STRUCTURES, generateSapCp004E1R2 as generateBase, type SapCp004E1R2Structure } from "./e1-r2-exam-runtime";
import type { SapE1R2Package } from "../../SAP-E1-R2-TYPES";

export { SAP_CP004_E1_R2_STRUCTURES };
export type { SapCp004E1R2Structure };

export function generateSapCp004E1R2(structureId: SapCp004E1R2Structure, seed: number): SapE1R2Package {
  const q = generateBase(structureId, seed);
  if (structureId !== "CP004-R2-WEIGHTED-ROOT-QUOTIENT") return q;
  return Object.freeze({ ...q, difficulty: "MEDIUM" as const });
}
