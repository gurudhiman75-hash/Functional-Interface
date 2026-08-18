import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY,
  generatePfcGapClosureWave2,
  generatePfcReverseCorpusWave2,
  pfcGapClosureScenariosWave2,
} from "../foundation/spatial/paper-folding-source-saturated-discovery-v2";
import {
  TPF_001_DISCOVERY_WAVE2_AUTHORITY,
  TpfDiscoveryWave2Error,
  generateTpfDiscoveryWave2,
  solveTransparentPatternFoldWave2,
} from "../foundation/spatial/transparent-pattern-folding-discovery-v2";
import { PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1 } from "../foundation/spatial/paper-folding-post-wave2-saturation-audit-v1";

assert.equal(PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY.permanentQlAllocationAllowed, false);
assert.equal(PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY.questionStudioAllowed, false);
const scenarios = pfcGapClosureScenariosWave2();
const solutions = generatePfcGapClosureWave2();
assert.equal(scenarios.length, 8);
assert.equal(solutions.length, 8);
assert.equal(new Set(solutions.map((solution) => solution.coalescedFingerprint)).size, 8);

const squareTriple = solutions.find((solution) => solution.scenarioId === "PFC-W2-SQUARE-THREE-FOLD-HOLE")!;
assert.equal(squareTriple.affectedLayersByCut.H1, 8);
assert.equal(squareTriple.topologyComponents.filter((item) => item.topology === "HOLE").length, 8);
const rectTriple = solutions.find((solution) => solution.scenarioId === "PFC-W2-RECT-THREE-FOLD-HOLE")!;
assert.equal(rectTriple.affectedLayersByCut.H1, 8);

const squareCreaseNotch = solutions.find((solution) => solution.scenarioId === "PFC-W2-SQUARE-FOLD-EDGE-V-NOTCH")!;
assert.equal(squareCreaseNotch.affectedLayersByCut.N1, 2);
assert.equal(squareCreaseNotch.topologyComponents.length, 1);
assert.equal(squareCreaseNotch.topologyComponents[0].topology, "INTERIOR_COALESCED_CUT");
assert.equal(squareCreaseNotch.topologyComponents[0].atomicMappedCount, 2);
const squareOuterNotch = solutions.find((solution) => solution.scenarioId === "PFC-W2-SQUARE-OUTER-V-NOTCH")!;
assert.equal(squareOuterNotch.topologyComponents.filter((item) => item.topology === "BOUNDARY_NOTCH").length, 2);

const reverse = generatePfcReverseCorpusWave2();
assert.equal(reverse.length, 12);
assert.deepEqual([...new Set(reverse.map((item) => item.foldDepth))].sort(), [1, 2, 3]);
assert.deepEqual([...new Set(reverse.map((item) => item.sourceShape))].sort(), ["RECTANGLE", "SQUARE"]);
for (const question of reverse) {
  assert.equal(question.candidateIds.length, 4);
  assert.equal(new Set(Object.values(question.candidateFingerprints)).size, 4);
  assert.ok(question.candidateIds.includes(question.correctCandidateId));
}
assert.deepEqual([...new Set(reverse.map((item) => item.correctCandidateId))].sort(), ["A", "B", "C", "D"]);

assert.equal(TPF_001_DISCOVERY_WAVE2_AUTHORITY.permanentQlAllocation, "NONE_DISCOVERY_REQUIRED");
assert.equal(TPF_001_DISCOVERY_WAVE2_AUTHORITY.diagonalStatus, "HELD_PENDING_DIRECT_SOURCE_RECURRENCE");
const tpf = generateTpfDiscoveryWave2();
assert.equal(tpf.length, 6);
assert.equal(new Set(tpf.map((solution) => solution.fingerprint)).size, 6);
assert.ok(tpf.some((solution) => solution.circleOutlines.length > 0));
assert.ok(tpf.some((solution) => solution.atomicPrimitives.length >= 4));
assert.throws(
  () => solveTransparentPatternFoldWave2({
    scenarioId: "TPF-W2-DIAGONAL-HELD",
    sheetSize: 100,
    folds: [{ foldId: "F1", kind: "DIAGONAL", line: { a: { x: 0, y: 0 }, b: { x: 100, y: 100 } }, movingSide: "POSITIVE" }],
    pattern: [{ primitiveId: "P1", kind: "POINT_MARK", point: { x: 20, y: 70 } }],
    sourceFamily: "HELD_DIAGONAL",
  }),
  (error: unknown) => error instanceof TpfDiscoveryWave2Error && error.code === "TPF_W2_UNSUPPORTED_FOLD",
);
assert.throws(
  () => solveTransparentPatternFoldWave2({
    scenarioId: "TPF-W2-MULTIFOLD-HELD",
    sheetSize: 100,
    folds: [
      { foldId: "F1", kind: "VERTICAL", line: { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } }, movingSide: "POSITIVE" },
      { foldId: "F2", kind: "HORIZONTAL", line: { a: { x: 0, y: 50 }, b: { x: 100, y: 50 } }, movingSide: "POSITIVE" },
    ],
    pattern: [{ primitiveId: "P1", kind: "POINT_MARK", point: { x: 70, y: 20 } }],
    sourceFamily: "HELD_MULTI_FOLD",
  }),
  (error: unknown) => error instanceof TpfDiscoveryWave2Error && error.code === "TPF_W2_MULTIFOLD_HELD",
);

assert.equal(PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.unimplementedSourceBackedSscCoreGapCount, 0);
assert.equal(PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.mergeSplitReviewAllowedAfterExactHeadGreen, true);
assert.equal(PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1.permanentQlAllocationAllowed, false);

const evidence = {
  pfcAuthority: PFC_001_MULTISHAPE_DISCOVERY_WAVE2_AUTHORITY,
  tpfAuthority: TPF_001_DISCOVERY_WAVE2_AUTHORITY,
  postWave2Audit: PFC_TPF_POST_WAVE2_SATURATION_AUDIT_V1,
  status: "PASS_PFC_TPF_EXECUTABLE_DISCOVERY_WAVE2",
  pfc: {
    scenarioCount: solutions.length,
    scenarios: solutions,
    reverseQuestionCount: reverse.length,
    reverseQuestions: reverse,
  },
  tpf: {
    scenarioCount: tpf.length,
    solutions: tpf,
  },
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-tpf-executable-discovery-wave2-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
