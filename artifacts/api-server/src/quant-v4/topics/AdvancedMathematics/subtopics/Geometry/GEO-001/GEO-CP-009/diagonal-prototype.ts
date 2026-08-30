import { polygonDiagonalCount, type TheoremId } from "../../../../../../shared/geometry";
import { buildExplanation, buildOptions, finalizePhase3Question, proveClueMinimality } from "../discovery/phase3-utils";
import type { Phase3PrototypeDefinition, Phase3PrototypeQuestion } from "../discovery/phase3-types";

const CP_ID = "GEO-CP-009" as const;

function generateDiagonalCount(seed: string): Phase3PrototypeQuestion {
  const clues = ["POLYGON_HAS_10_SIDES"] as const;
  const expected = "35";
  const solve = (active: ReadonlySet<string>) => active.has("POLYGON_HAS_10_SIDES") ? String(polygonDiagonalCount(10)) : null;
  if (solve(new Set(clues)) !== expected) throw new Error("Polygon diagonal-count solver mismatch");
  const verifierPassed = (10 * 9) / 2 - 10 === 35;
  const theoremTrace: TheoremId[] = ["POLYGON_DIAGONAL_COUNT"];
  const optionSet = buildOptions(expected, [
    { text: "45", misconceptionId: "COUNTED_SIDES_AS_DIAGONALS", rationale: "Counts all unordered vertex pairs but forgets to remove the 10 sides." },
    { text: "70", misconceptionId: "DOUBLE_COUNTED_DIAGONALS", rationale: "Counts each diagonal from both endpoints." },
    { text: "30", misconceptionId: "USED_WRONG_DIAGONAL_OFFSET", rationale: "Uses the wrong offset in the diagonal formula." },
  ], seed);
  return finalizePhase3Question({
    cpId: CP_ID, temporaryPrototypeId: "GEO-TMP-CP009-DIAGONAL-COUNT-V1", solveMode: "countPolygonDiagonals", difficulty: "Medium", seed,
    stem: "How many diagonals does a 10-sided polygon have?", ...optionSet,
    explanation: buildExplanation(theoremTrace, ["From each vertex, diagonals join the n−3 non-adjacent vertices; dividing by 2 avoids double counting.", "For n = 10, the count is 10(10−3)/2 = 35."]),
    theoremTrace, proofEvents: [], displayedClueIds: clues,
    minimalityProof: proveClueMinimality(clues, solve, expected),
    independentVerifierResult: Object.freeze({ passed: verifierPassed, oracle: "EXACT_RANGE_ENUMERATION", checks: Object.freeze(["C(10,2) gives 45 unordered vertex pairs", "removing the 10 polygon sides leaves 35 diagonals"]) }),
  });
}

export const GEO_CP_009_DIAGONAL_PHASE3_PROTOTYPES: readonly Phase3PrototypeDefinition[] = Object.freeze([
  { temporaryPrototypeId: "GEO-TMP-CP009-DIAGONAL-COUNT-V1", cpId: CP_ID, solveMode: "countPolygonDiagonals", generate: generateDiagonalCount },
]);
