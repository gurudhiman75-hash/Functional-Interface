import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  PFC_001_SOURCE_EVIDENCE_V2,
  PFC_001_SOURCE_SATURATION_AUTHORITY_V2,
  pfcSourceSaturationCoverageV2,
} from "../foundation/spatial/paper-folding-source-saturation-v2";
import {
  PFC_001_FOUNDATION_AUTHORITY_V2,
  PfcFoundationErrorV2,
  createCircularPfcSheetV2,
  createRectangularPfcSheetV2,
  createSquarePfcSheetV2,
  pfcPointOnSourceBoundaryV2,
  pfcPolygonBoundaryForLegacyEngineV2,
  pfcSheetContainsPointV2,
  validatePfcCutGeometryV2,
} from "../foundation/spatial/paper-folding-foundation-v2";

const coverage = pfcSourceSaturationCoverageV2();

assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.status, "SOURCE_GAP_REOPENED_ARCHITECTURE_SPLIT_REQUIRED");
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.oldV5CandidateStatus, "SUPERSEDED_NOT_SOURCE_SATURATED");
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.permanentQlAllocationAllowed, false);
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.questionStudioAllowed, false);
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.localizationAllowed, false);
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.chapterOwnership.tpf001Candidate.chapterCode, "TPF-001");
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.chapterOwnership.tpf001Candidate.permanentQlAllocation, "NONE_DISCOVERY_REQUIRED");
assert.equal(PFC_001_SOURCE_SATURATION_AUTHORITY_V2.nextGate, "PFC_TPF_SOURCE_SATURATED_EXECUTABLE_DISCOVERY_V1");

assert.equal(PFC_001_FOUNDATION_AUTHORITY_V2.permanentQlAllocationAllowed, false);
assert.equal(PFC_001_FOUNDATION_AUTHORITY_V2.questionStudioAllowed, false);
assert.equal(PFC_001_FOUNDATION_AUTHORITY_V2.circleAuthority, "ANALYTIC_BOUNDARY_NOT_POLYGON_APPROXIMATION");

assert.deepEqual(coverage.sheetShapes, ["CIRCLE", "RECTANGLE", "SQUARE"]);
assert.deepEqual(coverage.taskContracts, [
  "OPAQUE_CUT_UNFOLD_FORWARD",
  "OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE",
  "TRANSPARENT_PATTERN_FOLD_SUPERPOSITION",
]);
assert.ok(coverage.evidenceClasses.includes("UPLOADED_REFERENCE_BOOK"));
assert.ok(coverage.evidenceClasses.includes("INDEXED_PREVIOUS_YEAR_QUESTION"));
assert.ok(coverage.evidenceCount >= 9);

const requiredObservedCuts = [
  "CIRCLE_HOLE",
  "DIAMOND_CUT",
  "SQUARE_OR_RECTANGULAR_CUT",
  "TRIANGLE_CUT",
] as const;
for (const cut of requiredObservedCuts) assert.ok(coverage.cutShapes.includes(cut));

assert.ok(PFC_001_SOURCE_EVIDENCE_V2.some((item) =>
  item.evidenceClass === "UPLOADED_REFERENCE_BOOK" &&
  item.taskContracts.includes("TRANSPARENT_PATTERN_FOLD_SUPERPOSITION"),
));
assert.ok(PFC_001_SOURCE_EVIDENCE_V2.some((item) =>
  item.evidenceClass === "UPLOADED_REFERENCE_BOOK" &&
  item.taskContracts.includes("OPAQUE_FOLD_PUNCH_REVERSE_INFERENCE"),
));
assert.ok(PFC_001_SOURCE_EVIDENCE_V2.some((item) =>
  item.evidenceClass === "INDEXED_PREVIOUS_YEAR_QUESTION" &&
  item.sheetShapes.includes("CIRCLE"),
));
assert.ok(PFC_001_SOURCE_EVIDENCE_V2.some((item) =>
  item.evidenceClass === "INDEXED_PREVIOUS_YEAR_QUESTION" &&
  item.sheetShapes.includes("RECTANGLE"),
));

const square = createSquarePfcSheetV2(100);
assert.equal(pfcSheetContainsPointV2(square, { x: 50, y: 50 }), true);
assert.equal(pfcPointOnSourceBoundaryV2(square, { x: 0, y: 40 }), true);
assert.equal(pfcSheetContainsPointV2(square, { x: 101, y: 50 }), false);

const rectangle = createRectangularPfcSheetV2(120, 80);
assert.equal(pfcSheetContainsPointV2(rectangle, { x: 119.5, y: 79.5 }), true);
assert.equal(pfcPointOnSourceBoundaryV2(rectangle, { x: 120, y: 40 }), true);
assert.equal(pfcSheetContainsPointV2(rectangle, { x: 121, y: 40 }), false);
assert.deepEqual(pfcPolygonBoundaryForLegacyEngineV2(rectangle), [
  { x: 0, y: 0 },
  { x: 120, y: 0 },
  { x: 120, y: 80 },
  { x: 0, y: 80 },
]);

const circle = createCircularPfcSheetV2(50, { x: 50, y: 50 });
assert.equal(pfcSheetContainsPointV2(circle, { x: 50, y: 50 }), true);
assert.equal(pfcSheetContainsPointV2(circle, { x: 100, y: 50 }), true);
assert.equal(pfcPointOnSourceBoundaryV2(circle, { x: 100, y: 50 }), true);
assert.equal(pfcPointOnSourceBoundaryV2(circle, { x: 50, y: 50 }), false);
assert.equal(pfcSheetContainsPointV2(circle, { x: 100.01, y: 50 }), false);
assert.throws(
  () => pfcPolygonBoundaryForLegacyEngineV2(circle),
  (error: unknown) => error instanceof PfcFoundationErrorV2 && error.code === "PFC_V2_CIRCLE_REQUIRES_CURVED_FRAGMENT_ENGINE",
);

validatePfcCutGeometryV2(rectangle, {
  cutId: "D1",
  kind: "POLYGON_CUT",
  semanticShape: "DIAMOND",
  vertices: [
    { x: 60, y: 28 },
    { x: 68, y: 36 },
    { x: 60, y: 44 },
    { x: 52, y: 36 },
  ],
});
validatePfcCutGeometryV2(rectangle, {
  cutId: "T1",
  kind: "POLYGON_CUT",
  semanticShape: "TRIANGLE",
  vertices: [
    { x: 30, y: 20 },
    { x: 38, y: 34 },
    { x: 22, y: 34 },
  ],
});
validatePfcCutGeometryV2(rectangle, {
  cutId: "S1",
  kind: "SLIT",
  a: { x: 20, y: 60 },
  b: { x: 44, y: 60 },
  width: 1.8,
});

const evidence = {
  authority: PFC_001_SOURCE_SATURATION_AUTHORITY_V2,
  foundationAuthority: PFC_001_FOUNDATION_AUTHORITY_V2,
  status: "PASS_PFC_001_SOURCE_SATURATION_V2_BOUNDARY",
  coverage,
  evidenceLedger: PFC_001_SOURCE_EVIDENCE_V2,
  guarantees: {
    squareOnlyFreezeRejected: true,
    rectangleIsFirstClass: true,
    circleIsAnalyticFirstClass: true,
    circleCannotUseLegacyPolygonAnswerAuthority: true,
    reverseInferenceEstablished: true,
    transparentPatternMechanismSplitToTpfDiscovery: true,
    noPermanentQlAllocation: true,
    questionStudioBlocked: true,
  },
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-source-saturation-v2-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
