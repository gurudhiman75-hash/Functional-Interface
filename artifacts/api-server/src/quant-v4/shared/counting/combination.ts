import { combinationExact } from "../../topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/math";
export function combinationCount(n: number, r: number): bigint { if (r < 0 || r > n) return 0n; return BigInt(combinationExact(n, r)); }
