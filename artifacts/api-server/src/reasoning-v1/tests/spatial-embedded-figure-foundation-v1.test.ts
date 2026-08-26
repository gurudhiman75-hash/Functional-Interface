import {
  EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1,
  matchEmbeddedGraphV1,
  validateEmbeddedGraphV1,
  type EmbeddedGraphV1,
} from "../foundation/spatial/embedded-figure-graph-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const straightTarget: EmbeddedGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 2, y: 0 },
    { id: "C", x: 2, y: 1 },
    { id: "D", x: 3, y: 1 },
  ],
  edges: [
    { id: "AB", a: "A", b: "B", kind: "LINE" },
    { id: "BC", a: "B", b: "C", kind: "LINE" },
    { id: "CD", a: "C", b: "D", kind: "LINE" },
  ],
};

const fixedHostWithExtras: EmbeddedGraphV1 = {
  vertices: [
    { id: "hA", x: 10, y: 10 },
    { id: "hB", x: 14, y: 10 },
    { id: "hC", x: 14, y: 12 },
    { id: "hD", x: 16, y: 12 },
    { id: "x1", x: 12, y: 7 },
    { id: "x2", x: 12, y: 15 },
    { id: "x3", x: 18, y: 9 },
  ],
  edges: [
    { id: "hAB", a: "hA", b: "hB", kind: "LINE" },
    { id: "hBC", a: "hB", b: "hC", kind: "LINE" },
    { id: "hCD", a: "hC", b: "hD", kind: "LINE" },
    { id: "cross", a: "x1", b: "x2", kind: "LINE" },
    { id: "noise1", a: "hA", b: "x3", kind: "LINE" },
    { id: "noise2", a: "x3", b: "hD", kind: "LINE" },
  ],
};

const rotatedHost: EmbeddedGraphV1 = {
  vertices: [
    { id: "rA", x: 5, y: 5 },
    { id: "rB", x: 5, y: 9 },
    { id: "rC", x: 3, y: 9 },
    { id: "rD", x: 3, y: 11 },
    { id: "rx", x: 7, y: 8 },
  ],
  edges: [
    { id: "rAB", a: "rA", b: "rB", kind: "LINE" },
    { id: "rBC", a: "rB", b: "rC", kind: "LINE" },
    { id: "rCD", a: "rC", b: "rD", kind: "LINE" },
    { id: "rNoise", a: "rA", b: "rx", kind: "LINE" },
  ],
};

const reflectedHost: EmbeddedGraphV1 = {
  vertices: [
    { id: "mA", x: 20, y: 4 },
    { id: "mB", x: 16, y: 4 },
    { id: "mC", x: 16, y: 6 },
    { id: "mD", x: 14, y: 6 },
  ],
  edges: [
    { id: "mAB", a: "mA", b: "mB", kind: "LINE" },
    { id: "mBC", a: "mB", b: "mC", kind: "LINE" },
    { id: "mCD", a: "mC", b: "mD", kind: "LINE" },
  ],
};

const missingEdgeHost: EmbeddedGraphV1 = {
  vertices: fixedHostWithExtras.vertices,
  edges: fixedHostWithExtras.edges.filter((edge) => edge.id !== "hBC"),
};

const curveTarget: EmbeddedGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 2, y: 0 },
    { id: "C", x: 3, y: 1 },
  ],
  edges: [
    { id: "AB", a: "A", b: "B", kind: "LINE" },
    { id: "BC", a: "B", b: "C", kind: "ARC", bulge: 0.5 },
  ],
};

const curveHost: EmbeddedGraphV1 = {
  vertices: [
    { id: "cA", x: 8, y: 2 },
    { id: "cB", x: 12, y: 2 },
    { id: "cC", x: 14, y: 4 },
    { id: "cx", x: 10, y: 6 },
  ],
  edges: [
    { id: "cAB", a: "cA", b: "cB", kind: "LINE" },
    { id: "cBC", a: "cB", b: "cC", kind: "ARC", bulge: 0.5 },
    { id: "cNoise", a: "cA", b: "cx", kind: "LINE" },
  ],
};

const curveAsStraightTrap: EmbeddedGraphV1 = {
  vertices: curveHost.vertices,
  edges: [
    { id: "cAB", a: "cA", b: "cB", kind: "LINE" },
    { id: "cBCWrong", a: "cB", b: "cC", kind: "LINE" },
    { id: "cNoise", a: "cA", b: "cx", kind: "LINE" },
  ],
};

const invalidDuplicateEdge: EmbeddedGraphV1 = {
  vertices: [
    { id: "A", x: 0, y: 0 },
    { id: "B", x: 1, y: 0 },
  ],
  edges: [
    { id: "e1", a: "A", b: "B", kind: "LINE" },
    { id: "e2", a: "B", b: "A", kind: "LINE" },
  ],
};

const straightValidation = validateEmbeddedGraphV1(straightTarget);
assert(straightValidation.valid, `Straight target should validate: ${straightValidation.issues.join(" ")}`);
assert(!validateEmbeddedGraphV1(invalidDuplicateEdge).valid, "Duplicate undirected semantic edge was not rejected.");

const fixed = matchEmbeddedGraphV1(straightTarget, fixedHostWithExtras, "FIXED_ORIENTATION");
assert(fixed.matched, "Fixed-orientation source-backed core failed a valid scale+translation embedding.");
assert(Math.abs(fixed.scale - 2) < 1e-7, `Expected scale 2, got ${fixed.scale}.`);
assert(fixed.rotationDegrees === 0, `Fixed embedding unexpectedly rotated ${fixed.rotationDegrees} degrees.`);
assert(!fixed.reflected, "Fixed embedding unexpectedly reflected.");
assert(Object.keys(fixed.vertexMap).length === straightTarget.vertices.length, "Vertex-map evidence is incomplete.");
assert(fixed.matchedHostEdgeIds.length === straightTarget.edges.length, "Matched-edge evidence is incomplete.");

const fixedReplay = matchEmbeddedGraphV1(straightTarget, fixedHostWithExtras, "FIXED_ORIENTATION");
assert(JSON.stringify(fixed) === JSON.stringify(fixedReplay), "Exact matcher evidence is not deterministic.");

const rotatedRejected = matchEmbeddedGraphV1(straightTarget, rotatedHost, "FIXED_ORIENTATION");
assert(!rotatedRejected.matched, "SSC fixed-orientation policy incorrectly accepted a rotated target.");

const rotatedAccepted = matchEmbeddedGraphV1(
  straightTarget,
  rotatedHost,
  "ROTATION_ALLOWED_REFLECTION_DISALLOWED",
);
assert(rotatedAccepted.matched, "Explicit rotation policy failed a valid rotated embedding.");
assert(Math.abs(rotatedAccepted.rotationDegrees - 90) < 1e-7, `Expected 90-degree rotation evidence, got ${rotatedAccepted.rotationDegrees}.`);
assert(!rotatedAccepted.reflected, "Rotation-only policy unexpectedly reflected the target.");

const reflectedRejected = matchEmbeddedGraphV1(
  straightTarget,
  reflectedHost,
  "ROTATION_ALLOWED_REFLECTION_DISALLOWED",
);
assert(!reflectedRejected.matched, "Reflection-disallowed policy accepted a mirrored embedding.");

const reflectedAccepted = matchEmbeddedGraphV1(
  straightTarget,
  reflectedHost,
  "ROTATION_AND_REFLECTION_ALLOWED",
);
assert(reflectedAccepted.matched, "Explicit reflection policy failed a valid mirrored embedding.");
assert(reflectedAccepted.reflected, "Reflection evidence was not recorded.");

const missingRejected = matchEmbeddedGraphV1(straightTarget, missingEdgeHost, "FIXED_ORIENTATION");
assert(!missingRejected.matched, "Host missing a required target edge was accepted.");

const curveAccepted = matchEmbeddedGraphV1(curveTarget, curveHost, "FIXED_ORIENTATION");
assert(curveAccepted.matched, "Mixed line/arc target failed exact fixed-orientation embedding.");

const curveTrapRejected = matchEmbeddedGraphV1(curveTarget, curveAsStraightTrap, "FIXED_ORIENTATION");
assert(!curveTrapRejected.matched, "Straight-line substitution incorrectly satisfied a required curved edge.");

const evidence = {
  status: "PASS_EMB_001_GRAPH_FOUNDATION_V1",
  authorityId: EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1.authorityId,
  chapterCode: EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1.chapterCode,
  coreExamPolicy: EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1.coreExamPolicy,
  checks: {
    structuralValidation: true,
    duplicateSemanticEdgeRejected: true,
    fixedOrientationScaleTranslationMatch: true,
    extraHostGeometryAllowed: true,
    deterministicEvidence: true,
    rotationRejectedUnderSscCore: true,
    rotationAcceptedOnlyWhenExplicitlyAllowed: true,
    reflectionRejectedWhenDisallowed: true,
    reflectionAcceptedWhenExplicitlyAllowed: true,
    missingEdgeRejected: true,
    mixedLineArcMatch: true,
    curvedVsStraightTrapRejected: true,
  },
  lifecycle: {
    permanentQlAllocationAuthorized: false,
    questionStudioRegistered: false,
    questionBankWritable: false,
    automaticStudentPublication: false,
  },
  nextGate: "EMB_CP_002_SOURCE_SATURATED_DISCOVERY",
};

console.log(JSON.stringify(evidence, null, 2));
