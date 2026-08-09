import { permutationExact } from "../../topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/math";
export function permutationCount(n: number, r: number): bigint { return BigInt(permutationExact(n, r)); }
