import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  enumerateRectanglesV1,
  enumerateSquaresV1,
  enumerateTrianglesV1,
  FCT_001_EXACT_GRAPH_FOUNDATION_AUTHORITY_V1,
  straightPathCoveredV1,
  validateCountingFigureGraphV1,
  type CountingFigureGraphV1,
} from "../foundation/spatial/counting-figures-graph-v1";
import {
  FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1,
  FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1,
} from "../foundation/spatial/counting-figures-source-saturated-discovery-v1";

assert.equal(FCT_001_EXACT_GRAPH_FOUNDATION_AUTHORITY_V1.permanentQlAllocated, false);
assert.equal(FCT_001_EXACT_GRAPH_FOUNDATION_AUTHORITY_V1.questionStudioDiscoverable, false);
assert.equal(FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.candidateQlBoundary.permanentQlAllocationDeferred, true);
assert.equal(FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.candidateQlBoundary.nextAvailableSpatialPermanentQlId, "SPA-QL-042");
assert.ok(FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length >= 12);
assert.deepEqual(
  [...new Set(FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.map((record) => record.targetShape))].sort(),
  ["QUADRILATERAL", "RECTANGLE", "SQUARE", "TRIANGLE"],
);
assert.ok(FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.some((record) => record.heldOn.startsWith("2017-")));
assert.ok(FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.some((record) => record.heldOn.startsWith("2024-")));

const malformed: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "A", x: 1, y: 0 },
    { id: "C", x: 0, y: 1 },
  ],
  edges: [{ id: "e1", a: "A", b: "C", kind: "LINE" }],
};
assert.equal(validateCountingFigureGraphV1(malformed).valid, false);

const subdividedTriangle: CountingFigureGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "M", x: 1, y: 0 },
    { id: "B", x: 2, y: 0 },
    { id: "C", x: 1, y: 2 },
  ],
  edges: [
    { id: "am", a: "A", b: "M", kind: "LINE" },
    { id: "mb", a: "M", b: "B", kind: "LINE" },
    { id: "ac", a: "A", b: "C", kind: "LINE" },
    { id: "bc", a: "B", b: "C", kind: "LINE" },
    { id: "mc", a: "M", b: "C", kind: "LINE" },
  ],
};
assert.equal(validateCountingFigureGraphV1(subdividedTriangle).valid, true);
assert.equal(straightPathCoveredV1(subdividedTriangle, "A", "B"), true, "Composite A-M-B side was not recognized.");
const triangles = enumerateTrianglesV1(subdividedTriangle);
assert.equal(triangles.length, 3);
assert.deepEqual(
  triangles.map((triangle) => [...triangle.vertexIds].sort().join("")),
  ["ACM", "ABC", "BCM"].sort(),
);

function grid2x2(): CountingFigureGraphV1 {
  const vertices = [] as { id: string; x: number; y: number }[];
  const edges = [] as { id: string; a: string; b: string; kind: "LINE" }[];
  for (let y = 0; y <= 2; y += 1) {
    for (let x = 0; x <= 2; x += 1) vertices.push({ id: `v${x}${y}`, x, y });
  }
  for (let y = 0; y <= 2; y += 1) {
    for (let x = 0; x < 2; x += 1) edges.push({ id: `h${x}${y}`, a: `v${x}${y}`, b: `v${x + 1}${y}`, kind: "LINE" });
  }
  for (let x = 0; x <= 2; x += 1) {
    for (let y = 0; y < 2; y += 1) edges.push({ id: `v${x}${y}`, a: `v${x}${y}`, b: `v${x}${y + 1}`, kind: "LINE" });
  }
  return { vertices, edges };
}

const grid = grid2x2();
assert.equal(validateCountingFigureGraphV1(grid).valid, true);
assert.equal(enumerateRectanglesV1(grid, "INCLUDE_SQUARES").length, 9);
assert.equal(enumerateSquaresV1(grid).length, 5);
assert.equal(enumerateRectanglesV1(grid, "EXCLUDE_SQUARES").length, 4);

const rotatedSquare: CountingFigureGraphV1 = {
  vertices: [
    { id: "N", x: 0, y: 2 },
    { id: "E", x: 2, y: 0 },
    { id: "S", x: 0, y: -2 },
    { id: "W", x: -2, y: 0 },
  ],
  edges: [
    { id: "ne", a: "N", b: "E", kind: "LINE" },
    { id: "es", a: "E", b: "S", kind: "LINE" },
    { id: "sw", a: "S", b: "W", kind: "LINE" },
    { id: "wn", a: "W", b: "N", kind: "LINE" },
  ],
};
assert.equal(enumerateSquaresV1(rotatedSquare).length, 1);
assert.equal(enumerateRectanglesV1(rotatedSquare, "INCLUDE_SQUARES").length, 1);
assert.equal(enumerateRectanglesV1(rotatedSquare, "EXCLUDE_SQUARES").length, 0);

const evidence = {
  status: "PASS_FCT_001_CP001_FOUNDATION_V1",
  sourceAuthority: FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.authorityId,
  graphAuthority: FCT_001_EXACT_GRAPH_FOUNDATION_AUTHORITY_V1.authorityId,
  directSscRecordCount: FCT_001_DIRECT_SSC_SOURCE_RECORDS_V1.length,
  sourceBackedTargetShapes: FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.sourceBackedTargetShapes,
  subdividedTriangleCount: triangles.length,
  compositeStraightSideProof: straightPathCoveredV1(subdividedTriangle, "A", "B"),
  grid2x2: {
    rectanglesIncludingSquares: enumerateRectanglesV1(grid, "INCLUDE_SQUARES").length,
    squares: enumerateSquaresV1(grid).length,
    strictRectangles: enumerateRectanglesV1(grid, "EXCLUDE_SQUARES").length,
  },
  rotatedSquareCount: enumerateSquaresV1(rotatedSquare).length,
  candidateQlBoundary: FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.candidateQlBoundary,
  governance: FCT_001_SOURCE_SATURATED_DISCOVERY_AUTHORITY_V1.governance,
  nextGate: "FCT_001_CP002_SOURCE_FAMILY_AND_SOLVER_SATURATION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-foundation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
