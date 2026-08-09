import { multisetPermutationExact } from "../../topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/math";
export function multisetArrangementCount(total: number, multiplicities: number[]): bigint { return BigInt(multisetPermutationExact(total, multiplicities)); }
