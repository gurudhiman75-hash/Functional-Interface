import { combinationCount } from "./combination";
import { factorialCount } from "./factorial";
import { permutationCount } from "./permutation";

export function committeeCompositionCount(groups: readonly number[], picks: readonly number[]): bigint {
  if (groups.length !== picks.length) throw new Error("Group and pick vectors must align");
  return groups.reduce((product, group, index) => product * combinationCount(group, picks[index]!), 1n);
}
export function pairTogetherLinearCount(n: number): bigint { if (n < 2) return 0n; return 2n * factorialCount(n - 1); }
export function pairApartLinearCount(n: number): bigint { return factorialCount(n) - pairTogetherLinearCount(n); }
export function fixedPositionAssignmentCount(totalPeople: number, eligibleForFixedPosition: number, positions: number): bigint {
  if (positions < 1 || eligibleForFixedPosition > totalPeople) return 0n;
  return BigInt(eligibleForFixedPosition) * permutationCount(totalPeople - 1, positions - 1);
}
export function terminalClassCodeCount(symbolCount: number, length: number, eligibleTerminalSymbols: number): bigint {
  return BigInt(eligibleTerminalSymbols) * permutationCount(symbolCount - 1, length - 1);
}
