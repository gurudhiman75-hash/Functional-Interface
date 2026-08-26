import { generateEmbeddedFigureWholeOptionConnectivityQuestionV1 } from "../foundation/spatial/embedded-figure-whole-option-connectivity-remediation-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const SAFE_MIN = 3;
const SAFE_MAX = 117;
const corpus = Array.from({ length: 240 }, (_, index) => generateEmbeddedFigureWholeOptionConnectivityQuestionV1(`EMB-WOC-SCALE-${index}`));
let optionChecks = 0;
let vertexChecks = 0;
let edgeLengthChecks = 0;
let minimumCoordinate = Number.POSITIVE_INFINITY;
let maximumCoordinate = Number.NEGATIVE_INFINITY;
let minimumEdgeLength = Number.POSITIVE_INFINITY;

for (const question of corpus) {
  question.optionGraphs.forEach((option, optionIndex) => {
    const byId = new Map(option.vertices.map((vertex) => [vertex.id, vertex]));
    for (const vertex of option.vertices) {
      minimumCoordinate = Math.min(minimumCoordinate, vertex.x, vertex.y);
      maximumCoordinate = Math.max(maximumCoordinate, vertex.x, vertex.y);
      assert(vertex.x >= SAFE_MIN && vertex.x <= SAFE_MAX, `${question.seed} option ${optionIndex}: x=${vertex.x} breaches ${SAFE_MIN}..${SAFE_MAX} SVG safe margin.`);
      assert(vertex.y >= SAFE_MIN && vertex.y <= SAFE_MAX, `${question.seed} option ${optionIndex}: y=${vertex.y} breaches ${SAFE_MIN}..${SAFE_MAX} SVG safe margin.`);
      vertexChecks += 1;
    }
    for (const edge of option.edges) {
      const a = byId.get(edge.a)!;
      const b = byId.get(edge.b)!;
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      minimumEdgeLength = Math.min(minimumEdgeLength, length);
      assert(length >= 4, `${question.seed} option ${optionIndex}: edge ${edge.id} is visually degenerate at ${length.toFixed(4)}px.`);
      edgeLengthChecks += 1;
    }
    assert(question.optionSvgs[optionIndex]!.includes('viewBox="0 0 120 120"'), `${question.seed} option ${optionIndex}: SVG viewBox changed.`);
    assert(question.optionSvgs[optionIndex]!.includes('<rect width="120" height="120" fill="white"/>'), `${question.seed} option ${optionIndex}: white background changed.`);
    optionChecks += 1;
  });
}

assert(optionChecks === 960, `Expected 960 SVG-bound option checks, got ${optionChecks}.`);

console.log(JSON.stringify({
  status: "PASS_EMB_001_VISUAL_BOUNDS_V1",
  corpusSize: corpus.length,
  optionChecks,
  vertexChecks,
  edgeLengthChecks,
  safeCoordinateRange: [SAFE_MIN, SAFE_MAX],
  observedMinimumCoordinate: minimumCoordinate,
  observedMaximumCoordinate: maximumCoordinate,
  observedMinimumEdgeLength: minimumEdgeLength,
  checks: {
    noSvgClipping: true,
    threePixelMinimumSafetyMargin: true,
    noVisuallyDegenerateEdges: true,
    whiteBackgroundPreserved: true,
    canonicalViewBoxPreserved: true,
  },
  nextGate: "EMB_CP_004_2_FULL_VISUAL_AUDIT_AND_EXACT_HEAD_CI",
}, null, 2));
