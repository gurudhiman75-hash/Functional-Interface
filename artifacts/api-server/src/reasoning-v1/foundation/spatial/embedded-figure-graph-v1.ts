export type EmbeddedVertexV1 = Readonly<{
  id: string;
  x: number;
  y: number;
}>;

export type EmbeddedLineEdgeV1 = Readonly<{
  id: string;
  a: string;
  b: string;
  kind: "LINE";
}>;

export type EmbeddedArcEdgeV1 = Readonly<{
  id: string;
  a: string;
  b: string;
  kind: "ARC";
  /**
   * Signed, scale-independent curvature/chirality descriptor.
   * Rotation preserves the sign; reflection reverses it.
   */
  bulge: number;
}>;

export type EmbeddedEdgeV1 = EmbeddedLineEdgeV1 | EmbeddedArcEdgeV1;

export type EmbeddedGraphV1 = Readonly<{
  vertices: readonly EmbeddedVertexV1[];
  edges: readonly EmbeddedEdgeV1[];
}>;

export type EmbeddedEquivalencePolicyV1 =
  | "FIXED_ORIENTATION"
  | "ROTATION_ALLOWED_REFLECTION_DISALLOWED"
  | "ROTATION_AND_REFLECTION_ALLOWED";

export type EmbeddedGraphValidationV1 = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type EmbeddedMatchEvidenceV1 = Readonly<{
  matched: true;
  policy: EmbeddedEquivalencePolicyV1;
  scale: number;
  rotationDegrees: number;
  reflected: boolean;
  translation: Readonly<{ x: number; y: number }>;
  vertexMap: Readonly<Record<string, string>>;
  matchedHostEdgeIds: readonly string[];
}>;

export type EmbeddedMatchResultV1 =
  | EmbeddedMatchEvidenceV1
  | Readonly<{
      matched: false;
      policy: EmbeddedEquivalencePolicyV1;
      reason: string;
    }>;

export const EMBEDDED_FIGURE_GRAPH_AUTHORITY_V1 = Object.freeze({
  authorityId: "EMB-001-GRAPH-FOUNDATION-V1" as const,
  chapterCode: "EMB-001" as const,
  status: "FOUNDATION_PROOF_NOT_FROZEN" as const,
  coreExamPolicy: "FIXED_ORIENTATION" as const,
  allowsTranslation: true,
  allowsPositiveUniformScale: true,
  allowsExtraHostGeometry: true,
  lineCurveIdentityIsSemantic: true,
  crossingsConnectOnlyWhenDeclaredByVertices: true,
  automaticQuestionStudioRegistration: false,
  permanentQlAllocationAuthorized: false,
});

const EPS = 1e-7;

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function distance(a: EmbeddedVertexV1, b: EmbeddedVertexV1): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function undirectedKey(a: string, b: string, kind: EmbeddedEdgeV1["kind"]): string {
  return a < b ? `${kind}:${a}:${b}` : `${kind}:${b}:${a}`;
}

export function validateEmbeddedGraphV1(graph: EmbeddedGraphV1): EmbeddedGraphValidationV1 {
  const issues: string[] = [];
  if (graph.vertices.length < 2) issues.push("Graph must contain at least two vertices.");
  if (graph.edges.length < 1) issues.push("Graph must contain at least one edge.");

  const ids = new Set<string>();
  const vertexById = new Map<string, EmbeddedVertexV1>();
  for (const vertex of graph.vertices) {
    if (!vertex.id.trim()) issues.push("Vertex ID must be non-empty.");
    if (ids.has(vertex.id)) issues.push(`Duplicate vertex ID: ${vertex.id}.`);
    ids.add(vertex.id);
    vertexById.set(vertex.id, vertex);
    if (!finite(vertex.x) || !finite(vertex.y)) issues.push(`Vertex ${vertex.id} has non-finite coordinates.`);
  }

  const edgeIds = new Set<string>();
  const semanticEdges = new Set<string>();
  for (const edge of graph.edges) {
    if (!edge.id.trim()) issues.push("Edge ID must be non-empty.");
    if (edgeIds.has(edge.id)) issues.push(`Duplicate edge ID: ${edge.id}.`);
    edgeIds.add(edge.id);
    const a = vertexById.get(edge.a);
    const b = vertexById.get(edge.b);
    if (!a || !b) {
      issues.push(`Edge ${edge.id} references a missing endpoint.`);
      continue;
    }
    if (edge.a === edge.b || distance(a, b) <= EPS) issues.push(`Edge ${edge.id} has zero geometric length.`);
    const key = undirectedKey(edge.a, edge.b, edge.kind);
    if (semanticEdges.has(key)) issues.push(`Duplicate ${edge.kind} edge between ${edge.a} and ${edge.b}.`);
    semanticEdges.add(key);
    if (edge.kind === "ARC" && (!finite(edge.bulge) || Math.abs(edge.bulge) <= EPS)) {
      issues.push(`ARC edge ${edge.id} must have a finite non-zero bulge.`);
    }
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function normalizeDegrees(degrees: number): number {
  let result = degrees % 360;
  if (result <= -180) result += 360;
  if (result > 180) result -= 360;
  if (Math.abs(result) < 1e-9) return 0;
  return result;
}

function radToDeg(radians: number): number {
  return radians * 180 / Math.PI;
}

function allowedRotation(policy: EmbeddedEquivalencePolicyV1, radians: number): boolean {
  if (policy !== "FIXED_ORIENTATION") return true;
  return Math.abs(normalizeDegrees(radToDeg(radians))) <= 1e-7;
}

function allowsReflection(policy: EmbeddedEquivalencePolicyV1): boolean {
  return policy === "ROTATION_AND_REFLECTION_ALLOWED";
}

function graphTolerance(host: EmbeddedGraphV1): number {
  const xs = host.vertices.map((vertex) => vertex.x);
  const ys = host.vertices.map((vertex) => vertex.y);
  const extent = Math.max(
    1,
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  );
  return Math.max(EPS, extent * 1e-7);
}

function chooseTargetAnchorPair(target: EmbeddedGraphV1): readonly [EmbeddedVertexV1, EmbeddedVertexV1] {
  const sorted = [...target.vertices].sort((a, b) => a.id.localeCompare(b.id));
  let best: readonly [EmbeddedVertexV1, EmbeddedVertexV1] = [sorted[0]!, sorted[1]!];
  let bestDistance = distance(best[0], best[1]);
  for (let i = 0; i < sorted.length; i += 1) {
    for (let j = i + 1; j < sorted.length; j += 1) {
      const candidateDistance = distance(sorted[i]!, sorted[j]!);
      if (candidateDistance > bestDistance + EPS) {
        best = [sorted[i]!, sorted[j]!];
        bestDistance = candidateDistance;
      }
    }
  }
  return best;
}

type SimilarityTransformV1 = Readonly<{
  scale: number;
  angle: number;
  reflected: boolean;
  tx: number;
  ty: number;
}>;

function orientPoint(x: number, y: number, reflected: boolean): readonly [number, number] {
  return reflected ? [x, -y] : [x, y];
}

function transformPoint(
  vertex: EmbeddedVertexV1,
  transform: SimilarityTransformV1,
): Readonly<{ x: number; y: number }> {
  const [ox, oy] = orientPoint(vertex.x, vertex.y, transform.reflected);
  const cos = Math.cos(transform.angle);
  const sin = Math.sin(transform.angle);
  return {
    x: transform.tx + transform.scale * (ox * cos - oy * sin),
    y: transform.ty + transform.scale * (ox * sin + oy * cos),
  };
}

function deriveTransform(
  targetA: EmbeddedVertexV1,
  targetB: EmbeddedVertexV1,
  hostA: EmbeddedVertexV1,
  hostB: EmbeddedVertexV1,
  reflected: boolean,
): SimilarityTransformV1 | null {
  const [tax, tay] = orientPoint(targetA.x, targetA.y, reflected);
  const [tbx, tby] = orientPoint(targetB.x, targetB.y, reflected);
  const tvx = tbx - tax;
  const tvy = tby - tay;
  const hvx = hostB.x - hostA.x;
  const hvy = hostB.y - hostA.y;
  const targetLength = Math.hypot(tvx, tvy);
  const hostLength = Math.hypot(hvx, hvy);
  if (targetLength <= EPS || hostLength <= EPS) return null;
  const scale = hostLength / targetLength;
  if (!finite(scale) || scale <= EPS) return null;
  const angle = Math.atan2(hvy, hvx) - Math.atan2(tvy, tvx);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const mappedAx = scale * (tax * cos - tay * sin);
  const mappedAy = scale * (tax * sin + tay * cos);
  return {
    scale,
    angle,
    reflected,
    tx: hostA.x - mappedAx,
    ty: hostA.y - mappedAy,
  };
}

function nearestUnusedHostVertex(
  point: Readonly<{ x: number; y: number }>,
  hostVertices: readonly EmbeddedVertexV1[],
  used: ReadonlySet<string>,
  tolerance: number,
): EmbeddedVertexV1 | null {
  let best: EmbeddedVertexV1 | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const vertex of hostVertices) {
    if (used.has(vertex.id)) continue;
    const d = Math.hypot(vertex.x - point.x, vertex.y - point.y);
    if (d <= tolerance && (d < bestDistance - EPS || (Math.abs(d - bestDistance) <= EPS && vertex.id.localeCompare(best?.id ?? "") < 0))) {
      best = vertex;
      bestDistance = d;
    }
  }
  return best;
}

function hostEdgeMatchesTarget(
  targetEdge: EmbeddedEdgeV1,
  hostEdge: EmbeddedEdgeV1,
  mappedA: string,
  mappedB: string,
  reflected: boolean,
): boolean {
  const endpointsMatch =
    (hostEdge.a === mappedA && hostEdge.b === mappedB) ||
    (hostEdge.a === mappedB && hostEdge.b === mappedA);
  if (!endpointsMatch || hostEdge.kind !== targetEdge.kind) return false;
  if (targetEdge.kind === "LINE" || hostEdge.kind === "LINE") return targetEdge.kind === hostEdge.kind;

  // Bulge direction is defined from edge.a -> edge.b. Reversing endpoint order reverses
  // the bulge sign; reflection also reverses chirality.
  const sameEndpointOrder = hostEdge.a === mappedA && hostEdge.b === mappedB;
  let expectedBulge = targetEdge.bulge;
  if (reflected) expectedBulge *= -1;
  if (!sameEndpointOrder) expectedBulge *= -1;
  return Math.abs(hostEdge.bulge - expectedBulge) <= 1e-7;
}

function attemptMatch(
  target: EmbeddedGraphV1,
  host: EmbeddedGraphV1,
  policy: EmbeddedEquivalencePolicyV1,
  transform: SimilarityTransformV1,
  tolerance: number,
): EmbeddedMatchEvidenceV1 | null {
  if (transform.reflected && !allowsReflection(policy)) return null;
  if (!allowedRotation(policy, transform.angle)) return null;

  const hostVertices = [...host.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const targetVertices = [...target.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const vertexMap: Record<string, string> = {};
  const used = new Set<string>();

  for (const targetVertex of targetVertices) {
    const mappedPoint = transformPoint(targetVertex, transform);
    const hostVertex = nearestUnusedHostVertex(mappedPoint, hostVertices, used, tolerance);
    if (!hostVertex) return null;
    vertexMap[targetVertex.id] = hostVertex.id;
    used.add(hostVertex.id);
  }

  const matchedHostEdgeIds: string[] = [];
  const usedHostEdges = new Set<string>();
  for (const targetEdge of target.edges) {
    const mappedA = vertexMap[targetEdge.a];
    const mappedB = vertexMap[targetEdge.b];
    if (!mappedA || !mappedB) return null;
    const hostEdge = host.edges.find((candidate) =>
      !usedHostEdges.has(candidate.id) &&
      hostEdgeMatchesTarget(targetEdge, candidate, mappedA, mappedB, transform.reflected),
    );
    if (!hostEdge) return null;
    usedHostEdges.add(hostEdge.id);
    matchedHostEdgeIds.push(hostEdge.id);
  }

  return Object.freeze({
    matched: true,
    policy,
    scale: transform.scale,
    rotationDegrees: normalizeDegrees(radToDeg(transform.angle)),
    reflected: transform.reflected,
    translation: Object.freeze({ x: transform.tx, y: transform.ty }),
    vertexMap: Object.freeze({ ...vertexMap }),
    matchedHostEdgeIds: Object.freeze([...matchedHostEdgeIds]),
  });
}

export function matchEmbeddedGraphV1(
  target: EmbeddedGraphV1,
  host: EmbeddedGraphV1,
  policy: EmbeddedEquivalencePolicyV1,
): EmbeddedMatchResultV1 {
  const targetValidation = validateEmbeddedGraphV1(target);
  if (!targetValidation.valid) {
    return Object.freeze({ matched: false, policy, reason: `Invalid target graph: ${targetValidation.issues.join(" ")}` });
  }
  const hostValidation = validateEmbeddedGraphV1(host);
  if (!hostValidation.valid) {
    return Object.freeze({ matched: false, policy, reason: `Invalid host graph: ${hostValidation.issues.join(" ")}` });
  }
  if (target.vertices.length > host.vertices.length || target.edges.length > host.edges.length) {
    return Object.freeze({ matched: false, policy, reason: "Target graph is larger than host graph." });
  }

  const [targetA, targetB] = chooseTargetAnchorPair(target);
  const hostVertices = [...host.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const tolerance = graphTolerance(host);
  const reflectionModes = allowsReflection(policy) ? [false, true] as const : [false] as const;

  for (const reflected of reflectionModes) {
    for (const hostA of hostVertices) {
      for (const hostB of hostVertices) {
        if (hostA.id === hostB.id) continue;
        const transform = deriveTransform(targetA, targetB, hostA, hostB, reflected);
        if (!transform) continue;
        const evidence = attemptMatch(target, host, policy, transform, tolerance);
        if (evidence) return evidence;
      }
    }
  }

  return Object.freeze({
    matched: false,
    policy,
    reason: "No exact embedding exists under the declared equivalence policy.",
  });
}
