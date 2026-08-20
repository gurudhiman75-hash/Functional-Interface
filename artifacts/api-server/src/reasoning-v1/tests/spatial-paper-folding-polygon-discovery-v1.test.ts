import assert from "node:assert/strict";
import {
  PFC_001_FOUNDATION_AUTHORITY_V3,
  PfcFoundationErrorV3,
  createGeneralConvexPfcSheetV3,
  createRegularHexagonalPfcSheetV3,
  createTriangularPfcSheetV3,
  pfcPolygonBoundaryForFoldEngineV3,
  pfcSheetContainsPointV3,
  validatePfcSourceSheetV3,
} from "../foundation/spatial/paper-folding-foundation-v3";
import {
  PFC_001_TRIANGLE_DISCOVERY_AUTHORITY_V1,
  pfcTriangleDiscoveryScenariosV1,
  solvePfcTriangleReverseInferenceV1,
  solvePfcTriangleScenarioV1,
} from "../foundation/spatial/paper-folding-polygon-discovery-v1";
import { PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3 } from "../foundation/spatial/paper-folding-polygon-source-saturation-v3";

assert.equal(PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3.shapeDecisions.TRIANGLE, "ACTIVE_SOURCE_BACKED_POLYGON");
assert.equal(PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3.shapeDecisions.HEXAGON, "ENGINE_CAPABILITY_ONLY");
assert.equal(PFC_001_FOUNDATION_AUTHORITY_V3.activatedPolygonSemanticShapes[0], "TRIANGLE");
assert.equal(PFC_001_TRIANGLE_DISCOVERY_AUTHORITY_V1.activatedSourceShape, "TRIANGLE");

const triangle = createTriangularPfcSheetV3();
assert.equal(triangle.shape, "POLYGON");
assert.equal(triangle.semanticShape, "TRIANGLE");
assert.equal(triangle.learnerReviewEligible, true);
assert.equal(pfcPolygonBoundaryForFoldEngineV3(triangle).length, 3);
assert.ok(pfcSheetContainsPointV3(triangle, { x: 50, y: 60 }));
assert.ok(!pfcSheetContainsPointV3(triangle, { x: 2, y: 2 }));

const hexagon = createRegularHexagonalPfcSheetV3();
assert.equal(hexagon.shape, "POLYGON");
assert.equal(hexagon.semanticShape, "REGULAR_HEXAGON");
assert.equal(hexagon.learnerReviewEligible, false);
assert.equal(pfcPolygonBoundaryForFoldEngineV3(hexagon).length, 6);

assert.throws(
  () => validatePfcSourceSheetV3({ ...hexagon, learnerReviewEligible: true }),
  (error: unknown) => error instanceof PfcFoundationErrorV3 && error.code === "PFC_V3_POLYGON_REVIEW_SHAPE_NOT_SOURCE_APPROVED",
);

assert.throws(
  () => createGeneralConvexPfcSheetV3([{ x:0,y:0 },{ x:100,y:0 },{ x:50,y:35 },{ x:100,y:100 },{ x:0,y:100 }]),
  (error: unknown) => error instanceof PfcFoundationErrorV3 && error.code === "PFC_V3_NON_CONVEX_POLYGON_UNSUPPORTED",
);

const scenarios = pfcTriangleDiscoveryScenariosV1();
assert.equal(scenarios.length, 8);
const solutions = scenarios.map(solvePfcTriangleScenarioV1);
assert.equal(new Set(solutions.map((solution) => solution.fingerprint)).size, solutions.length, "Triangle discovery fingerprints must be unique.");
for (const solution of solutions) {
  assert.equal(solution.sourceSemanticShape, "TRIANGLE");
  assert.equal(solution.affectedLayerCount, 2, `${solution.scenarioId} should punch/cut through both folded triangular layers.`);
  assert.equal(solution.mappedCuts.length, 2, `${solution.scenarioId} should unfold to two distinct mapped cuts.`);
}

const holeScenarios = scenarios.filter((scenario) => scenario.cut.kind === "CIRCLE_HOLE");
assert.ok(holeScenarios.length >= 4);
for (let index = 0; index < Math.min(4, holeScenarios.length); index += 1) {
  const target = solvePfcTriangleScenarioV1(holeScenarios[index]);
  const candidates = holeScenarios.slice(0, 4).map((scenario, candidateIndex) => ({ candidateId: `OPT-${candidateIndex + 1}`, scenario }));
  const solved = solvePfcTriangleReverseInferenceV1(target.fingerprint, candidates);
  assert.equal(solved.scenario.scenarioId, holeScenarios[index].scenarioId);
}

const evidence = {
  status: "PASS_PFC_TRIANGLE_SUBSTRATE_DISCOVERY_V1",
  sourceAuthority: PFC_001_POLYGON_SOURCE_SATURATION_AUTHORITY_V3.authorityId,
  foundationAuthority: PFC_001_FOUNDATION_AUTHORITY_V3.authorityId,
  discoveryAuthority: PFC_001_TRIANGLE_DISCOVERY_AUTHORITY_V1.authorityId,
  scenarioCount: scenarios.length,
  uniqueFingerprintCount: new Set(solutions.map((solution) => solution.fingerprint)).size,
  affectedLayerCounts: solutions.map((solution) => solution.affectedLayerCount),
  activatedLearnerShape: "TRIANGLE",
  capabilityOnlyShapes: ["REGULAR_HEXAGON", "GENERAL_CONVEX_POLYGON"],
  governance: {
    permanentQlIdsAssigned: false,
    englishFrozen: false,
    localizationAllowed: false,
    questionStudioAllowed: false,
    nextGate: "PFC_001_TRIANGLE_POLYGON_LEARNER_REVIEW_V1",
  },
};
console.log(JSON.stringify(evidence));
