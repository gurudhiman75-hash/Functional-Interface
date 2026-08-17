import { generateSapCp004Package } from "./final-runtime";
import { expandPerfectSquareRoot, expandRootMixedArithmetic } from "./e1-root-expansion";

export function generateSapCp004E1SquareRoot(seed: number, correctIndex?: number) {
  return expandPerfectSquareRoot(generateSapCp004Package("SAP-CP004-PROT-PERFECT-SQUARE-ROOT", seed, correctIndex));
}

export function generateSapCp004E1RootArithmetic(seed: number, correctIndex?: number) {
  return expandRootMixedArithmetic(generateSapCp004Package("SAP-CP004-PROT-ROOT-MIXED-ARITHMETIC", seed, correctIndex));
}
