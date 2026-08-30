export type CountingFigureVertexV1 = Readonly<{
  id: string;
  x: number;
  y: number;
}>;

export type CountingFigureEdgeV1 = Readonly<{
  id: string;
  a: string;
  b: string;
  kind: "LINE";
}>;

export type CountingFigureGraphV1 = Readonly<{
  vertices: readonly CountingFigureVertexV1[];
  edges: readonly CountingFigureEdgeV1[];
}>;

export type CountingFigureGraphValidationV1 = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type CountingFigureRectanglePolicyV1 = "INCLUDE_SQUARES" | "EXCLUDE_SQUARES";

export type CountedTriangleV1 = Readonly<{
  kind: "TRIANGLE";
  vertexIds: readonly [string, string, string];
  area: number;
}>;

export type CountedRectangleV1 = Readonly<{
  kind: "RECTANGLE";
  vertexIds: readonly [string, string, string, string];
  area: number;
  square: boolean;
  sideLengths: readonly [number, number, number, number];
}>;

export const FCT_001_EXACT_GRAPH_FOUNDATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "FCT-001-EXACT-GRAPH-FOUNDATION-V1" as const,
  chapterCode: "FCT-001" as const,
  status: "CP001_FOUNDATION_PROOF_NOT_FROZEN" as const,
  supportedNow: [
    "COMPOSITE_STRAIGHT_SIDE_COVERAGE",
    "TRIANGLE_ENUMERATION",
    "RECTANGLE_ENUMERATION",
    "SQUARE_ENUMERATION",
    "ROTATED_SQUARES",
  ] as const,
  semanticIntersectionPolicy: "ALL_TRUE_LINE_INTERSECTIONS_MUST_BE_EXPLICIT_VERTICES" as const,
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  automaticStudentPublication: false,
});

const EPS = 1e-8;

function finite(value: number): boolean {
  return Number.isFinite(value);
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

function distance(a: CountingFigureVertexV1, b: CountingFigureVertexV1): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function cross(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return ax * by - ay * bx;
}

function dot(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return ax * bx + ay * by;
}

function graphTolerance(graph: CountingFigureGraphV1): number {
  if (!graph.vertices.length) return EPS;
  const xs = graph.vertices.map((vertex) => vertex.x);
  const ys = graph.vertices.map((vertex) => vertex.y);
  const extent = Math.max(
    1,
    Math.max(...xs) - Math.min(...xs),
    Math.max(...ys) - Math.min(...ys),
  );
  return Math.max(EPS, extent * 1e-8);
}

function vertexMap(graph: CountingFigureGraphV1): ReadonlyMap<string, CountingFigureVertexV1> {
  return new Map(graph.vertices.map((vertex) => [vertex.id, vertex] as const));
}

export function validateCountingFigureGraphV1(
  graph: CountingFigureGraphV1,
): CountingFigureGraphValidationV1 {
  const issues: string[] = [];
  if (graph.vertices.length < 3) issues.push("Graph must contain at least three vertices.");
  if (graph.edges.length < 1) issues.push("Graph must contain at least one edge.");

  const ids = new Set<string>();
  const byId = new Map<string, CountingFigureVertexV1>();
  for (const vertex of graph.vertices) {
    if (!vertex.id.trim()) issues.push("Vertex ID must be non-empty.");
    if (ids.has(vertex.id)) issues.push(`Duplicate vertex ID: ${vertex.id}.`);
    ids.add(vertex.id);
    byId.set(vertex.id, vertex);
    if (!finite(vertex.x) || !finite(vertex.y)) {
      issues.push(`Vertex ${vertex.id} has non-finite coordinates.`);
    }
  }

  const edgeIds = new Set<string>();
  const semanticEdges = new Set<string>();
  for (const edge of graph.edges) {
    if (!edge.id.trim()) issues.push("Edge ID must be non-empty.");
    if (edgeIds.has(edge.id)) issues.push(`Duplicate edge ID: ${edge.id}.`);
    edgeIds.add(edge.id);
    const a = byId.get(edge.a);
    const b = byId.get(edge.b);
    if (!a || !b) {
      issues.push(`Edge ${edge.id} references a missing endpoint.`);
      continue;
    }
    if (edge.a === edge.b || distance(a, b) <= EPS) {
      issues.push(`Edge ${edge.id} has zero geometric length.`);
    }
    const key = edgeKey(edge.a, edge.b);
    if (semanticEdges.has(key)) issues.push(`Duplicate line edge between ${edge.a} and ${edge.b}.`);
    semanticEdges.add(key);
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function pointOnSegment(
  point: CountingFigureVertexV1,
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  tolerance: number,
): boolean {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const apx = point.x - a.x;
  const apy = point.y - a.y;
  const length = Math.hypot(abx, aby);
  if (length <= tolerance) return false;
  if (Math.abs(cross(abx, aby, apx, apy)) > tolerance * length) return false;
  const projection = dot(apx, apy, abx, aby);
  const squaredLength = abx * abx + aby * aby;
  return projection >= -tolerance * length && projection <= squaredLength + tolerance * length;
}

function edgeLiesOnSegment(
  edge: CountingFigureEdgeV1,
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  byId: ReadonlyMap<string, CountingFigureVertexV1>,
  tolerance: number,
): boolean {
  const edgeA = byId.get(edge.a);
  const edgeB = byId.get(edge.b);
  return Boolean(
    edgeA &&
    edgeB &&
    pointOnSegment(edgeA, a, b, tolerance) &&
    pointOnSegment(edgeB, a, b, tolerance),
  );
}

export function straightPathCoveredV1(
  graph: CountingFigureGraphV1,
  fromVertexId: string,
  toVertexId: string,
): boolean {
  if (fromVertexId === toVertexId) return false;
  const byId = vertexMap(graph);
  const from = byId.get(fromVertexId);
  const to = byId.get(toVertexId);
  if (!from || !to) return false;
  const tolerance = graphTolerance(graph);
  if (distance(from, to) <= tolerance) return false;

  const adjacency = new Map<string, string[]>();
  for (const edge of graph.edges) {
    if (!edgeLiesOnSegment(edge, from, to, byId, tolerance)) continue;
    const aList = adjacency.get(edge.a) ?? [];
    aList.push(edge.b);
    adjacency.set(edge.a, aList);
    const bList = adjacency.get(edge.b) ?? [];
    bList.push(edge.a);
    adjacency.set(edge.b, bList);
  }

  const queue = [fromVertexId];
  const visited = new Set<string>([fromVertexId]);
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]!;
    if (current === toVertexId) return true;
    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      queue.push(next);
    }
  }
  return false;
}

function triangleArea2(
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  c: CountingFigureVertexV1,
): number {
  return Math.abs(cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y));
}

export function enumerateTrianglesV1(graph: CountingFigureGraphV1): readonly CountedTriangleV1[] {
  const validation = validateCountingFigureGraphV1(graph);
  if (!validation.valid) throw new Error(`Invalid counting graph: ${validation.issues.join(" ")}`);
  const vertices = [...graph.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const tolerance = graphTolerance(graph);
  const triangles: CountedTriangleV1[] = [];

  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      for (let k = j + 1; k < vertices.length; k += 1) {
        const a = vertices[i]!;
        const b = vertices[j]!;
        const c = vertices[k]!;
        const area2 = triangleArea2(a, b, c);
        if (area2 <= tolerance * tolerance) continue;
        if (!straightPathCoveredV1(graph, a.id, b.id)) continue;
        if (!straightPathCoveredV1(graph, b.id, c.id)) continue;
        if (!straightPathCoveredV1(graph, c.id, a.id)) continue;
        triangles.push(Object.freeze({
          kind: "TRIANGLE",
          vertexIds: Object.freeze([a.id, b.id, c.id]) as readonly [string, string, string],
          area: area2 / 2,
        }));
      }
    }
  }
  return Object.freeze(triangles);
}

function combinationsOfFour<T>(values: readonly T[]): readonly [T, T, T, T][] {
  const result: [T, T, T, T][] = [];
  for (let a = 0; a < values.length; a += 1) {
    for (let b = a + 1; b < values.length; b += 1) {
      for (let c = b + 1; c < values.length; c += 1) {
        for (let d = c + 1; d < values.length; d += 1) {
          result.push([values[a]!, values[b]!, values[c]!, values[d]!]);
        }
      }
    }
  }
  return result;
}

function cyclicOrder(
  vertices: readonly [CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1],
): readonly [CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1] {
  const cx = vertices.reduce((sum, vertex) => sum + vertex.x, 0) / 4;
  const cy = vertices.reduce((sum, vertex) => sum + vertex.y, 0) / 4;
  const ordered = [...vertices].sort((a, b) => {
    const angleDelta = Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx);
    return Math.abs(angleDelta) > EPS ? angleDelta : a.id.localeCompare(b.id);
  });
  return ordered as [CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1];
}

function polygonArea(vertices: readonly CountingFigureVertexV1[]): number {
  let twiceArea = 0;
  for (let index = 0; index < vertices.length; index += 1) {
    const current = vertices[index]!;
    const next = vertices[(index + 1) % vertices.length]!;
    twiceArea += current.x * next.y - current.y * next.x;
  }
  return Math.abs(twiceArea) / 2;
}

function rectangleFromVertices(
  graph: CountingFigureGraphV1,
  vertices: readonly [CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1, CountingFigureVertexV1],
): CountedRectangleV1 | null {
  const ordered = cyclicOrder(vertices);
  const tolerance = graphTolerance(graph);
  if (polygonArea(ordered) <= tolerance * tolerance) return null;

  const vectors = ordered.map((vertex, index) => {
    const next = ordered[(index + 1) % 4]!;
    return { x: next.x - vertex.x, y: next.y - vertex.y };
  });
  const lengths = vectors.map((vector) => Math.hypot(vector.x, vector.y));
  if (lengths.some((length) => length <= tolerance)) return null;

  for (let index = 0; index < 4; index += 1) {
    const current = vectors[index]!;
    const next = vectors[(index + 1) % 4]!;
    const scale = lengths[index]! * lengths[(index + 1) % 4]!;
    if (Math.abs(dot(current.x, current.y, next.x, next.y)) > tolerance * Math.max(1, scale)) {
      return null;
    }
    const from = ordered[index]!;
    const to = ordered[(index + 1) % 4]!;
    if (!straightPathCoveredV1(graph, from.id, to.id)) return null;
  }

  const maxLength = Math.max(...lengths);
  const minLength = Math.min(...lengths);
  const square = maxLength - minLength <= tolerance * Math.max(1, maxLength);
  return Object.freeze({
    kind: "RECTANGLE",
    vertexIds: Object.freeze(ordered.map((vertex) => vertex.id)) as readonly [string, string, string, string],
    area: polygonArea(ordered),
    square,
    sideLengths: Object.freeze(lengths) as readonly [number, number, number, number],
  });
}

export function enumerateRectanglesV1(
  graph: CountingFigureGraphV1,
  policy: CountingFigureRectanglePolicyV1 = "INCLUDE_SQUARES",
): readonly CountedRectangleV1[] {
  const validation = validateCountingFigureGraphV1(graph);
  if (!validation.valid) throw new Error(`Invalid counting graph: ${validation.issues.join(" ")}`);
  const vertices = [...graph.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const result: CountedRectangleV1[] = [];
  for (const combination of combinationsOfFour(vertices)) {
    const rectangle = rectangleFromVertices(graph, combination);
    if (!rectangle) continue;
    if (policy === "EXCLUDE_SQUARES" && rectangle.square) continue;
    result.push(rectangle);
  }
  return Object.freeze(result);
}

export function enumerateSquaresV1(graph: CountingFigureGraphV1): readonly CountedRectangleV1[] {
  return Object.freeze(enumerateRectanglesV1(graph, "INCLUDE_SQUARES").filter((rectangle) => rectangle.square));
}
