import { polygonDiagonalCount, type TheoremId } from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase3Question, proveClueMinimality } from "../discovery/phase3-utils";
import type { Phase3PrototypeDefinition, Phase3PrototypeQuestion } from "../discovery/phase3-types";

const CP_ID = "GEO-CP-009" as const;

function variantIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

function generateDiagonalCount(seed: string): Phase3PrototypeQuestion {
  const sidePool = [7, 8, 9, 10, 12, 15] as const;
  const n = sidePool[variantIndex(seed, sidePool.length)]!;
  const diagonalCount = polygonDiagonalCount(n);
  const expected = String(diagonalCount);
  const clues = ["POLYGON_SIDE_COUNT_GIVEN"] as const;
  const solve = (active: ReadonlySet<string>) => active.has("POLYGON_SIDE_COUNT_GIVEN") ? String(polygonDiagonalCount(n)) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Polygon diagonal-count solver mismatch");
  const verifierPassed = (n * (n - 1)) / 2 - n === diagonalCount;
  const theoremTrace: TheoremId[] = ["POLYGON_DIAGONAL_COUNT"];
  const optionSet = buildOptions(expected, [
    { text: String((n * (n - 1)) / 2), misconceptionId: "COUNTED_SIDES_AS_DIAGONALS", rationale: "Counts all unordered vertex pairs but forgets to remove the polygon sides." },
    { text: String(n * (n - 3)), misconceptionId: "DOUBLE_COUNTED_DIAGONALS", rationale: "Counts each diagonal from both endpoints." },
    { text: String((n * (n - 4)) / 2), misconceptionId: "USED_WRONG_DIAGONAL_OFFSET", rationale: "Uses the wrong offset in the diagonal formula." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-DIAGONAL-COUNT-V1", solveMode: "countPolygonDiagonals", difficulty: "Medium", seed,
    stem: `How many diagonals does a ${n}-sided polygon have?`, ...optionSet,
    explanation: buildExplanation(theoremTrace, ["From each vertex, diagonals join the n−3 non-adjacent vertices; dividing by 2 avoids double counting.", `For n = ${n}, the count is ${n}(${n}−3)/2 = ${diagonalCount}.`]),
    theoremTrace, proofEvents: [], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "EXACT_RANGE_ENUMERATION", checks: Object.freeze([`C(${n},2) gives ${(n * (n - 1)) / 2} unordered vertex pairs`, `removing the ${n} polygon sides leaves ${diagonalCount} diagonals`]) }),
  });
}

export const GEO_CP_009_DIAGONAL_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP009-DIAGONAL-COUNT-V1", cpId: CP_ID, solveMode: "countPolygonDiagonals", generate: generateDiagonalCount },
]);
