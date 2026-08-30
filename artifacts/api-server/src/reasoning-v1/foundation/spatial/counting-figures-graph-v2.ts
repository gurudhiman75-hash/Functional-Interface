import {
  straightPathCoveredV1,
  validateCountingFigureGraphV1,
  type CountingFigureEdgeV1,
  type CountingFigureGraphV1,
  type CountingFigureVertexV1,
} from "./counting-figures-graph-v1";

export type CountingFigurePlanarValidationV2 = Readonly<{
  valid: boolean;
  issues: readonly string[];
}>;

export type CountedQuadrilateralV2 = Readonly<{
  kind: "QUADRILATERAL";
  vertexIds: readonly [string, string, string, string];
  area: number;
  convexity: "CONVEX" | "CONCAVE";
}>;

export const FCT_001_EXACT_GRAPH_SATURATION_AUTHORITY_V2 = Object.freeze({
  authorityId: "FCT-001-EXACT-GRAPH-SATURATION-V2" as const,
  baseAuthorityId: "FCT-001-EXACT-GRAPH-FOUNDATION-V1" as const,
  chapterCode: "FCT-001" as const,
  status: "CP002_QUADRILATERAL_AND_PLANARITY_PROOF_NOT_FROZEN" as const,
  adds: [
    "UNDECLARED_CROSSING_REJECTION",
    "SIMPLE_QUADRILATERAL_ENUMERATION",
    "CONVEX_QUADRILATERAL_SUPPORT",
    "CONCAVE_QUADRILATERAL_SUPPORT",
  ] as const,
  permanentQlAllocated: false,
  questionStudioDiscoverable: false,
  automaticStudentPublication: false,
});

const EPS = 1e-8;

function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

function orientation(
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  c: CountingFigureVertexV1,
): number {
  return cross(b.x - a.x, b.y - a.y, c.x - a.x, c.y - a.y);
}

function pointEquals(a: CountingFigureVertexV1, b: CountingFigureVertexV1): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= EPS;
}

function properSegmentsIntersect(
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  c: CountingFigureVertexV1,
  d: CountingFigureVertexV1,
): boolean {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 * o2 < -EPS && o3 * o4 < -EPS;
}

function collinearOverlapBeyondEndpoint(
  a: CountingFigureVertexV1,
  b: CountingFigureVertexV1,
  c: CountingFigureVertexV1,
  d: CountingFigureVertexV1,
): boolean {
  if (Math.abs(orientation(a, b, c)) > EPS || Math.abs(orientation(a, b, d)) > EPS) return false;
  const axis: "x" | "y" = Math.abs(b.x - a.x) >= Math.abs(b.y - a.y) ? "x" : "y";
  const values1 = [a[axis], b[axis]].sort((x, y) => x - y);
  const values2 = [c[axis], d[axis]].sort((x, y) => x - y);
  const overlap = Math.min(values1[1]!, values2[1]!) - Math.max(values1[0]!, values2[0]!);
  return overlap > EPS;
}

function edgeEndpoints(
  edge: CountingFigureEdgeV1,
  byId: ReadonlyMap<string, CountingFigureVertexV1>,
): readonly [CountingFigureVertexV1, CountingFigureVertexV1] | null {
  const a = byId.get(edge.a);
  const b = byId.get(edge.b);
  return a && b ? [a, b] : null;
}

export function validateCountingFigurePlanarityV2(
  graph: CountingFigureGraphV1,
): CountingFigurePlanarValidationV2 {
  const base = validateCountingFigureGraphV1(graph);
  const issues = [...base.issues];
  if (!base.valid) return Object.freeze({ valid: false, issues: Object.freeze(issues) });
  const byId = new Map(graph.vertices.map((vertex) => [vertex.id, vertex] as const));

  for (let i = 0; i < graph.edges.length; i += 1) {
    for (let j = i + 1; j < graph.edges.length; j += 1) {
      const first = graph.edges[i]!;
      const second = graph.edges[j]!;
      const firstEndpoints = edgeEndpoints(first, byId);
      const secondEndpoints = edgeEndpoints(second, byId);
      if (!firstEndpoints || !secondEndpoints) continue;
      const [a, b] = firstEndpoints;
      const [c, d] = secondEndpoints;
      const sharesSemanticEndpoint =
        first.a === second.a || first.a === second.b || first.b === second.a || first.b === second.b;

      if (!sharesSemanticEndpoint && properSegmentsIntersect(a, b, c, d)) {
        issues.push(`Edges ${first.id} and ${second.id} cross without an explicit shared intersection vertex.`);
      }
      if (!sharesSemanticEndpoint && collinearOverlapBeyondEndpoint(a, b, c, d)) {
        issues.push(`Edges ${first.id} and ${second.id} overlap collinearly without atomic segmentation.`);
      }
      if (sharesSemanticEndpoint) {
        const sharedIds = [first.a, first.b].filter((id) => id === second.a || id === second.b);
        const shared = sharedIds[0] ? byId.get(sharedIds[0]) : undefined;
        if (shared) {
          const otherFirst = first.a === shared.id ? b : a;
          const otherSecond = second.a === shared.id ? d : c;
          if (pointEquals(otherFirst, otherSecond)) {
            issues.push(`Edges ${first.id} and ${second.id} duplicate the same geometric segment.`);
          }
        }
      }
    }
  }

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

function polygonArea(vertices: readonly CountingFigureVertexV1[]): number {
  let twiceArea = 0;
  for (let i = 0; i < vertices.length; i += 1) {
    const current = vertices[i]!;
    const next = vertices[(i + 1) % vertices.length]!;
    twiceArea += current.x * next.y - current.y * next.x;
  }
  return Math.abs(twiceArea) / 2;
}

function hasTurnAtEveryCorner(vertices: readonly CountingFigureVertexV1[]): boolean {
  for (let i = 0; i < vertices.length; i += 1) {
    const previous = vertices[(i + vertices.length - 1) % vertices.length]!;
    const current = vertices[i]!;
    const next = vertices[(i + 1) % vertices.length]!;
    if (Math.abs(orientation(previous, current, next)) <= EPS) return false;
  }
  return true;
}

function simpleCycle(vertices: readonly CountingFigureVertexV1[]): boolean {
  return !properSegmentsIntersect(vertices[0]!, vertices[1]!, vertices[2]!, vertices[3]!) &&
    !properSegmentsIntersect(vertices[1]!, vertices[2]!, vertices[3]!, vertices[0]!);
}

function cycleKey(ids: readonly string[]): string {
  const rotations: string[] = [];
  for (const source of [ids, [...ids].reverse()]) {
    for (let offset = 0; offset < source.length; offset += 1) {
      rotations.push([...source.slice(offset), ...source.slice(0, offset)].join("|"));
    }
  }
  return rotations.sort()[0]!;
}

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [values.slice()];
  const result: T[][] = [];
  for (let i = 0; i < values.length; i += 1) {
    const head = values[i]!;
    const rest = [...values.slice(0, i), ...values.slice(i + 1)];
    for (const tail of permutations(rest)) result.push([head, ...tail]);
  }
  return result;
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

function classifyConvexity(vertices: readonly CountingFigureVertexV1[]): "CONVEX" | "CONCAVE" {
  const signs: number[] = [];
  for (let i = 0; i < 4; i += 1) {
    const a = vertices[i]!;
    const b = vertices[(i + 1) % 4]!;
    const c = vertices[(i + 2) % 4]!;
    const value = orientation(a, b, c);
    if (Math.abs(value) > EPS) signs.push(Math.sign(value));
  }
  return signs.every((sign) => sign === signs[0]) ? "CONVEX" : "CONCAVE";
}

export function enumerateSimpleQuadrilateralsV2(
  graph: CountingFigureGraphV1,
): readonly CountedQuadrilateralV2[] {
  const validation = validateCountingFigurePlanarityV2(graph);
  if (!validation.valid) throw new Error(`Invalid planar counting graph: ${validation.issues.join(" ")}`);
  const vertices = [...graph.vertices].sort((a, b) => a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const result: CountedQuadrilateralV2[] = [];

  for (const combination of combinationsOfFour(vertices)) {
    for (const candidate of permutations(combination)) {
      const ids = candidate.map((vertex) => vertex.id);
      const key = cycleKey(ids);
      if (seen.has(key)) continue;
      if (!hasTurnAtEveryCorner(candidate)) continue;
      if (!simpleCycle(candidate)) continue;
      if (polygonArea(candidate) <= EPS) continue;
      let covered = true;
      for (let i = 0; i < 4; i += 1) {
        if (!straightPathCoveredV1(graph, candidate[i]!.id, candidate[(i + 1) % 4]!.id)) {
          covered = false;
          break;
        }
      }
      if (!covered) continue;
      seen.add(key);
      result.push(Object.freeze({
        kind: "QUADRILATERAL",
        vertexIds: Object.freeze(ids) as readonly [string, string, string, string],
        area: polygonArea(candidate),
        convexity: classifyConvexity(candidate),
      }));
    }
  }

  return Object.freeze(result.sort((a, b) => cycleKey(a.vertexIds).localeCompare(cycleKey(b.vertexIds))));
}
