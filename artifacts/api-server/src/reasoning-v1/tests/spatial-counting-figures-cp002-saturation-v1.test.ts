import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
  type CountingFigureGraphV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import {
  enumerateSimpleQuadrilateralsV2,
  FCT_001_EXACT_GRAPH_SATURATION_AUTHORITY_V2,
  validateCountingFigurePlanarityV2,
} from "../foundation/spatial/counting-figures-graph-v2";
import {
  FCT_001_CP002_MOTIF_REQUIREMENTS_V1,
  FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1,
} from "../foundation/spatial/counting-figures-cp002-saturation-v1";

assert.equal(FCT_001_EXACT_GRAPH_SATURATION_AUTHORITY_V2.permanentQlAllocated, false);
assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.retainedCandidate.splitRequiredNow, false);
assert.equal(
  FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.mergeDecisions.triangleVsSquareVsRectangleVsQuadrilateral,
  "MERGE_AS_TARGET_SHAPE_PARAMETER",
);
assert.equal(
  FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.mergeDecisions.regularGridVsIrregularNetwork,
  "MERGE_AS_LAYOUT_PARAMETER",
);
assert.deepEqual(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.sourceTargetCounts, {
  TRIANGLE: 4,
  SQUARE: 5,
  RECTANGLE: 2,
  QUADRILATERAL: 1,
});
assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.sourceTargetTotal, 12);
assert.equal(FCT_001_CP002_MOTIF_REQUIREMENTS_V1.length, 4);
assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.permanentQlDecision.allocateAtCp002, false);
assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.permanentQlDecision.nextAvailableSpatialPermanentQlId, "SPA-QL-042");

const undeclaredCrossing: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 2, y: 2 },
    { id: "C", x: 0, y: 2 },
    { id: "D", x: 2, y: 0 },
  ],
  edges: [
    { id: "ab", a: "A", b: "B", kind: "LINE" },
    { id: "cd", a: "C", b: "D", kind: "LINE" },
  ],
};
const crossingValidation = validateCountingFigurePlanarityV2(undeclaredCrossing);
assert.equal(crossingValidation.valid, false);
assert.ok(crossingValidation.issues.some((issue) => issue.includes("cross without an explicit shared intersection vertex")));

const declaredCrossing: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 2, y: 2 },
    { id: "C", x: 0, y: 2 },
    { id: "D", x: 2, y: 0 },
    { id: "O", x: 1, y: 1 },
  ],
  edges: [
    { id: "ao", a: "A", b: "O", kind: "LINE" },
    { id: "ob", a: "O", b: "B", kind: "LINE" },
    { id: "co", a: "C", b: "O", kind: "LINE" },
    { id: "od", a: "O", b: "D", kind: "LINE" },
  ],
};
assert.equal(validateCountingFigurePlanarityV2(declaredCrossing).valid, true);

const convexQuad: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 3, y: 0 },
    { id: "C", x: 2.5, y: 2 },
    { id: "D", x: 0.25, y: 1.5 },
  ],
  edges: [
    { id: "ab", a: "A", b: "B", kind: "LINE" },
    { id: "bc", a: "B", b: "C", kind: "LINE" },
    { id: "cd", a: "C", b: "D", kind: "LINE" },
    { id: "da", a: "D", b: "A", kind: "LINE" },
  ],
};
const convex = enumerateSimpleQuadrilateralsV2(convexQuad);
assert.equal(convex.length, 1);
assert.equal(convex[0]?.convexity, "CONVEX");

const concaveQuad: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 3, y: 0 },
    { id: "C", x: 1, y: 0.75 },
    { id: "D", x: 0, y: 2.5 },
  ],
  edges: [
    { id: "ab", a: "A", b: "B", kind: "LINE" },
    { id: "bc", a: "B", b: "C", kind: "LINE" },
    { id: "cd", a: "C", b: "D", kind: "LINE" },
    { id: "da", a: "D", b: "A", kind: "LINE" },
  ],
};
const concave = enumerateSimpleQuadrilateralsV2(concaveQuad);
assert.equal(concave.length, 1);
assert.equal(concave[0]?.convexity, "CONCAVE");

function grid2x2(): CountingFigureGraphV1 {
  const vertices = [] as { id: string; x: number; y: number }[];
  const edges = [] as { id: string; a: string; b: string; kind: "LINE" }[];
  for (let y = 0; y <= 2; y += 1) {
    for (let x = 0; x <= 2; x += 1) vertices.push({ id: `p${x}${y}`, x, y });
  }
  for (let y = 0; y <= 2; y += 1) {
    for (let x = 0; x < 2; x += 1) edges.push({ id: `h${x}${y}`, a: `p${x}${y}`, b: `p${x + 1}${y}`, kind: "LINE" });
  }
  for (let x = 0; x <= 2; x += 1) {
    for (let y = 0; y < 2; y += 1) edges.push({ id: `v${x}${y}`, a: `p${x}${y}`, b: `p${x}${y + 1}`, kind: "LINE" });
  }
  return { vertices, edges };
}

const grid = grid2x2();
assert.equal(validateCountingFigurePlanarityV2(grid).valid, true);
const gridQuadrilaterals = enumerateSimpleQuadrilateralsV2(grid);
assert.equal(gridQuadrilaterals.length, 9, "A 2x2 orthogonal grid should expose exactly its 9 rectangles as quadrilaterals.");
assert.equal(enumerateRectanglesV1(grid, "INCLUDE_SQUARES").length, 9);
assert.equal(enumerateSquaresV1(grid).length, 5);
assert.equal(enumerateTrianglesV1(grid).length, 0);

const evidence = {
  status: "PASS_FCT_001_CP002_SOURCE_FAMILY_AND_SOLVER_SATURATION_V1",
  graphAuthority: FCT_001_EXACT_GRAPH_SATURATION_AUTHORITY_V2.authorityId,
  qlDecisionAuthority: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.authorityId,
  sourceTargetCounts: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.sourceTargetCounts,
  motifFamilyCount: FCT_001_CP002_MOTIF_REQUIREMENTS_V1.length,
  undeclaredCrossingRejected: !crossingValidation.valid,
  declaredCrossingAccepted: validateCountingFigurePlanarityV2(declaredCrossing).valid,
  convexQuadrilateralCount: convex.length,
  concaveQuadrilateralCount: concave.length,
  grid2x2QuadrilateralCount: gridQuadrilaterals.length,
  grid2x2RectangleCount: enumerateRectanglesV1(grid, "INCLUDE_SQUARES").length,
  grid2x2SquareCount: enumerateSquaresV1(grid).length,
  qlBoundary: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.retainedCandidate,
  permanentQlDecision: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.permanentQlDecision,
  governance: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.governance,
  nextGate: FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-cp002-saturation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
