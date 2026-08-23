import type {
  SpatialArcNode,
  SpatialNode,
  SpatialPoint,
  SpatialScene,
} from "./types";

export interface FigureGraphSegmentV1 {
  kind: "SEGMENT";
  a: SpatialPoint;
  b: SpatialPoint;
}

export interface FigureGraphArcV1 {
  kind: "ARC";
  center: SpatialPoint;
  radius: number;
  startAngleDeg: number;
  endAngleDeg: number;
  sweep: "clockwise" | "counterclockwise";
}

export interface FigureGraphV1 {
  version: "FIGURE-GRAPH-V1";
  segments: FigureGraphSegmentV1[];
  arcs: FigureGraphArcV1[];
}

export interface FigureGraphMatchPolicyV1 {
  allowRotation: boolean;
  allowReflection: boolean;
  allowScale: false;
  tolerance?: number;
}

export interface FigureGraphRigidTransformV1 {
  reflected: boolean;
  rotationDeg: number;
  translation: SpatialPoint;
}

export interface FigureGraphEmbeddingV1 {
  transform: FigureGraphRigidTransformV1;
  matchedSegmentIndexes: number[];
  matchedArcIndexes: number[];
}

export const FIGURE_GRAPH_V1_MATCHER_HARDENING = Object.freeze({
  authorityId: "FIGURE-GRAPH-V1-SUBSTRUCTURE-HARDENING-2026-08-23" as const,
  segmentSubstructureViaHostLandmarks: true,
  hostIntersectionLandmarks: true,
  hostArcEndpointLandmarks: true,
  exactSubArcContainment: true,
  scalingAllowed: false,
} as const);

const DEFAULT_TOLERANCE = 1e-5;
const ARC_SAMPLE_STEPS = 12;

function distance(a: SpatialPoint, b: SpatialPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function segmentLength(segment: FigureGraphSegmentV1): number {
  return distance(segment.a, segment.b);
}

function pointKey(point: SpatialPoint, precision = 1e-4): string {
  return `${Math.round(point.x / precision)}:${Math.round(point.y / precision)}`;
}

function canonicalSegmentKey(segment: FigureGraphSegmentV1): string {
  const left = pointKey(segment.a);
  const right = pointKey(segment.b);
  return left < right ? `${left}>${right}` : `${right}>${left}`;
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function normalizeAngle(value: number): number {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function signedSweepDegrees(arc: FigureGraphArcV1): number {
  const start = normalizeAngle(arc.startAngleDeg);
  const end = normalizeAngle(arc.endAngleDeg);
  if (arc.sweep === "clockwise") {
    const delta = normalizeAngle(end - start);
    return delta === 0 ? 360 : delta;
  }
  const delta = normalizeAngle(start - end);
  return -(delta === 0 ? 360 : delta);
}

function sampleArc(arc: FigureGraphArcV1, steps = ARC_SAMPLE_STEPS): SpatialPoint[] {
  const sweep = signedSweepDegrees(arc);
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const angle = degreesToRadians(arc.startAngleDeg + sweep * t);
    return {
      x: arc.center.x + arc.radius * Math.cos(angle),
      y: arc.center.y + arc.radius * Math.sin(angle),
    };
  });
}

function arcEndpoints(arc: FigureGraphArcV1): [SpatialPoint, SpatialPoint] {
  const samples = sampleArc(arc, 1);
  return [samples[0]!, samples[1]!];
}

function canonicalArcKey(arc: FigureGraphArcV1): string {
  const direct = sampleArc(arc).map((point) => pointKey(point)).join(">");
  const reverse = [...sampleArc(arc)].reverse().map((point) => pointKey(point)).join(">");
  return direct < reverse ? direct : reverse;
}

function addPolylineSegments(points: readonly SpatialPoint[], closed: boolean, output: FigureGraphSegmentV1[]): void {
  for (let index = 0; index < points.length - 1; index += 1) {
    const a = points[index]!;
    const b = points[index + 1]!;
    if (distance(a, b) > DEFAULT_TOLERANCE) output.push({ kind: "SEGMENT", a: { ...a }, b: { ...b } });
  }
  if (closed && points.length >= 3) {
    const a = points[points.length - 1]!;
    const b = points[0]!;
    if (distance(a, b) > DEFAULT_TOLERANCE) output.push({ kind: "SEGMENT", a: { ...a }, b: { ...b } });
  }
}

function nodeToGraph(node: SpatialNode, segments: FigureGraphSegmentV1[], arcs: FigureGraphArcV1[]): void {
  switch (node.kind) {
    case "line":
      if (distance(node.start, node.end) > DEFAULT_TOLERANCE) {
        segments.push({ kind: "SEGMENT", a: { ...node.start }, b: { ...node.end } });
      }
      return;
    case "polyline":
      addPolylineSegments(node.points, false, segments);
      return;
    case "polygon":
      addPolylineSegments(node.points, true, segments);
      return;
    case "arc":
      arcs.push({
        kind: "ARC",
        center: { ...node.center },
        radius: node.radius,
        startAngleDeg: node.startAngleDeg,
        endAngleDeg: node.endAngleDeg,
        sweep: node.sweep,
      });
      return;
    case "circle":
      // Full circles are intentionally excluded from EMB V1 matching. A later
      // graph version may add a CIRCLE primitive when source saturation needs it.
      return;
  }
}

export function spatialSceneToFigureGraphV1(scene: SpatialScene): FigureGraphV1 {
  const segments: FigureGraphSegmentV1[] = [];
  const arcs: FigureGraphArcV1[] = [];
  for (const node of scene.nodes) nodeToGraph(node, segments, arcs);
  return { version: "FIGURE-GRAPH-V1", segments, arcs };
}

export function figureGraphFingerprintV1(graph: FigureGraphV1): string {
  return JSON.stringify({
    version: graph.version,
    segments: graph.segments.map(canonicalSegmentKey).sort(),
    arcs: graph.arcs.map(canonicalArcKey).sort(),
  });
}

function reflectPoint(point: SpatialPoint): SpatialPoint {
  return { x: -point.x, y: point.y };
}

function rotatePoint(point: SpatialPoint, rotationDeg: number): SpatialPoint {
  const angle = degreesToRadians(rotationDeg);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  };
}

export function applyFigureGraphTransformV1(point: SpatialPoint, transform: FigureGraphRigidTransformV1): SpatialPoint {
  const reflected = transform.reflected ? reflectPoint(point) : point;
  const rotated = rotatePoint(reflected, transform.rotationDeg);
  return {
    x: rotated.x + transform.translation.x,
    y: rotated.y + transform.translation.y,
  };
}

function transformedSegment(segment: FigureGraphSegmentV1, transform: FigureGraphRigidTransformV1): FigureGraphSegmentV1 {
  return {
    kind: "SEGMENT",
    a: applyFigureGraphTransformV1(segment.a, transform),
    b: applyFigureGraphTransformV1(segment.b, transform),
  };
}

function cross(a: SpatialPoint, b: SpatialPoint): number {
  return a.x * b.y - a.y * b.x;
}

function subtract(a: SpatialPoint, b: SpatialPoint): SpatialPoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

function dot(a: SpatialPoint, b: SpatialPoint): number {
  return a.x * b.x + a.y * b.y;
}

function segmentParameter(host: FigureGraphSegmentV1, point: SpatialPoint, tolerance: number): number | null {
  const direction = subtract(host.b, host.a);
  const length = Math.hypot(direction.x, direction.y);
  if (length <= tolerance) return null;
  const relative = subtract(point, host.a);
  if (Math.abs(cross(direction, relative)) / length > tolerance) return null;
  const denominator = dot(direction, direction);
  const parameter = dot(relative, direction) / denominator;
  return parameter >= -tolerance && parameter <= 1 + tolerance ? parameter : null;
}

function segmentContains(host: FigureGraphSegmentV1, target: FigureGraphSegmentV1, tolerance: number): boolean {
  return segmentParameter(host, target.a, tolerance) !== null && segmentParameter(host, target.b, tolerance) !== null;
}

function segmentIntersection(
  first: FigureGraphSegmentV1,
  second: FigureGraphSegmentV1,
  tolerance: number,
): SpatialPoint | null {
  const r = subtract(first.b, first.a);
  const s = subtract(second.b, second.a);
  const denominator = cross(r, s);
  if (Math.abs(denominator) <= tolerance) return null;
  const delta = subtract(second.a, first.a);
  const t = cross(delta, s) / denominator;
  const u = cross(delta, r) / denominator;
  if (t < -tolerance || t > 1 + tolerance || u < -tolerance || u > 1 + tolerance) return null;
  return { x: first.a.x + t * r.x, y: first.a.y + t * r.y };
}

function dedupePoints(points: readonly SpatialPoint[], tolerance: number): SpatialPoint[] {
  const precision = Math.max(tolerance * 4, 1e-5);
  const seen = new Set<string>();
  const result: SpatialPoint[] = [];
  for (const point of points) {
    const key = pointKey(point, precision);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(point);
  }
  return result;
}

function hostLandmarksOnSegment(
  host: FigureGraphV1,
  hostSegmentIndex: number,
  tolerance: number,
): SpatialPoint[] {
  const segment = host.segments[hostSegmentIndex]!;
  const points: SpatialPoint[] = [{ ...segment.a }, { ...segment.b }];

  for (let index = 0; index < host.segments.length; index += 1) {
    if (index === hostSegmentIndex) continue;
    const other = host.segments[index]!;
    if (segmentParameter(segment, other.a, tolerance) !== null) points.push({ ...other.a });
    if (segmentParameter(segment, other.b, tolerance) !== null) points.push({ ...other.b });
    const intersection = segmentIntersection(segment, other, tolerance);
    if (intersection) points.push(intersection);
  }

  for (const hostArc of host.arcs) {
    for (const endpoint of arcEndpoints(hostArc)) {
      if (segmentParameter(segment, endpoint, tolerance) !== null) points.push(endpoint);
    }
  }

  return dedupePoints(points, tolerance);
}

function angleOnArc(angleDeg: number, arc: FigureGraphArcV1, toleranceDeg: number): boolean {
  const sweep = signedSweepDegrees(arc);
  if (Math.abs(sweep) >= 360 - toleranceDeg) return true;
  const start = normalizeAngle(arc.startAngleDeg);
  const angle = normalizeAngle(angleDeg);
  if (sweep > 0) return normalizeAngle(angle - start) <= sweep + toleranceDeg;
  return normalizeAngle(start - angle) <= -sweep + toleranceDeg;
}

function transformedArcGeometry(
  arc: FigureGraphArcV1,
  transform: FigureGraphRigidTransformV1,
): { center: SpatialPoint; samples: SpatialPoint[] } {
  return {
    center: applyFigureGraphTransformV1(arc.center, transform),
    samples: sampleArc(arc).map((point) => applyFigureGraphTransformV1(point, transform)),
  };
}

function arcContainsTransformedTarget(
  targetArc: FigureGraphArcV1,
  hostArc: FigureGraphArcV1,
  transform: FigureGraphRigidTransformV1,
  tolerance: number,
): boolean {
  if (Math.abs(targetArc.radius - hostArc.radius) > tolerance) return false;
  const transformed = transformedArcGeometry(targetArc, transform);
  if (distance(transformed.center, hostArc.center) > tolerance) return false;
  const angularTolerance = radiansToDegrees(tolerance / Math.max(hostArc.radius, 1));
  return transformed.samples.every((point) => {
    if (Math.abs(distance(point, hostArc.center) - hostArc.radius) > tolerance) return false;
    const angle = radiansToDegrees(Math.atan2(point.y - hostArc.center.y, point.x - hostArc.center.x));
    return angleOnArc(angle, hostArc, angularTolerance);
  });
}

function angleOfVector(vector: SpatialPoint): number {
  return radiansToDegrees(Math.atan2(vector.y, vector.x));
}

function nearZeroRotation(rotationDeg: number, tolerance: number): boolean {
  const normalized = normalizeAngle(rotationDeg);
  return normalized <= tolerance || Math.abs(normalized - 360) <= tolerance;
}

function candidateFromLandmark(
  target: FigureGraphSegmentV1,
  host: FigureGraphSegmentV1,
  reflected: boolean,
  targetEndpoint: "a" | "b",
  hostDirection: 1 | -1,
  landmark: SpatialPoint,
): FigureGraphRigidTransformV1 | null {
  const reflectedA = reflected ? reflectPoint(target.a) : target.a;
  const reflectedB = reflected ? reflectPoint(target.b) : target.b;
  const source = targetEndpoint === "a" ? reflectedA : reflectedB;
  const other = targetEndpoint === "a" ? reflectedB : reflectedA;
  const targetVector = subtract(other, source);
  const rawHostVector = subtract(host.b, host.a);
  const hostVector = hostDirection === 1 ? rawHostVector : { x: -rawHostVector.x, y: -rawHostVector.y };
  if (Math.hypot(targetVector.x, targetVector.y) <= DEFAULT_TOLERANCE || Math.hypot(hostVector.x, hostVector.y) <= DEFAULT_TOLERANCE) return null;
  const rotationDeg = angleOfVector(hostVector) - angleOfVector(targetVector);
  const rotatedSource = rotatePoint(source, rotationDeg);
  return {
    reflected,
    rotationDeg,
    translation: { x: landmark.x - rotatedSource.x, y: landmark.y - rotatedSource.y },
  };
}

function transformKey(transform: FigureGraphRigidTransformV1): string {
  return `${transform.reflected ? 1 : 0}:${Math.round(normalizeAngle(transform.rotationDeg) * 1000)}:${Math.round(transform.translation.x * 1000)}:${Math.round(transform.translation.y * 1000)}`;
}

function verifyEmbedding(
  target: FigureGraphV1,
  host: FigureGraphV1,
  transform: FigureGraphRigidTransformV1,
  tolerance: number,
): FigureGraphEmbeddingV1 | null {
  const matchedSegmentIndexes: number[] = [];
  for (const targetSegment of target.segments) {
    const transformed = transformedSegment(targetSegment, transform);
    const hostIndex = host.segments.findIndex((candidate) => segmentContains(candidate, transformed, tolerance));
    if (hostIndex < 0) return null;
    matchedSegmentIndexes.push(hostIndex);
  }

  const matchedArcIndexes: number[] = [];
  for (const targetArc of target.arcs) {
    const hostIndex = host.arcs.findIndex((candidate) => arcContainsTransformedTarget(targetArc, candidate, transform, tolerance));
    if (hostIndex < 0) return null;
    matchedArcIndexes.push(hostIndex);
  }

  return { transform, matchedSegmentIndexes, matchedArcIndexes };
}

export function findFigureGraphEmbeddingsV1(
  target: FigureGraphV1,
  host: FigureGraphV1,
  policy: FigureGraphMatchPolicyV1,
): FigureGraphEmbeddingV1[] {
  if (policy.allowScale !== false) throw new Error("FIGURE-GRAPH-V1 does not permit scaling.");
  if (target.segments.length === 0) throw new Error("FIGURE-GRAPH-V1 requires at least one target segment to infer a rigid transform.");
  const tolerance = policy.tolerance ?? DEFAULT_TOLERANCE;
  const anchor = target.segments
    .slice()
    .sort((left, right) => segmentLength(right) - segmentLength(left))[0]!;
  const reflectionModes = policy.allowReflection ? [false, true] as const : [false] as const;
  const candidates = new Map<string, FigureGraphRigidTransformV1>();

  for (let hostIndex = 0; hostIndex < host.segments.length; hostIndex += 1) {
    const hostSegment = host.segments[hostIndex]!;
    if (segmentLength(hostSegment) + tolerance < segmentLength(anchor)) continue;
    const landmarks = hostLandmarksOnSegment(host, hostIndex, tolerance);
    for (const landmark of landmarks) {
      for (const reflected of reflectionModes) {
        for (const targetEndpoint of ["a", "b"] as const) {
          for (const hostDirection of [1, -1] as const) {
            const candidate = candidateFromLandmark(anchor, hostSegment, reflected, targetEndpoint, hostDirection, landmark);
            if (!candidate) continue;
            if (!policy.allowRotation && !nearZeroRotation(candidate.rotationDeg, 1e-4)) continue;
            candidates.set(transformKey(candidate), candidate);
          }
        }
      }
    }
  }

  const embeddings: FigureGraphEmbeddingV1[] = [];
  const embeddingKeys = new Set<string>();
  for (const candidate of candidates.values()) {
    const verified = verifyEmbedding(target, host, candidate, tolerance);
    if (!verified) continue;
    const key = transformKey(verified.transform);
    if (embeddingKeys.has(key)) continue;
    embeddingKeys.add(key);
    embeddings.push(verified);
  }
  return embeddings;
}

export function figureGraphContainsV1(
  target: FigureGraphV1,
  host: FigureGraphV1,
  policy: FigureGraphMatchPolicyV1,
): boolean {
  return findFigureGraphEmbeddingsV1(target, host, policy).length > 0;
}

export function figureGraphFromNodesV1(nodes: readonly SpatialNode[]): FigureGraphV1 {
  const scene: SpatialScene = {
    version: "1.0",
    id: "figure-graph-node-adapter",
    viewBox: { minX: 0, minY: 0, width: 100, height: 100 },
    nodes: [...nodes],
  };
  return spatialSceneToFigureGraphV1(scene);
}

export function graphArcFromSpatialArcV1(node: SpatialArcNode): FigureGraphArcV1 {
  return {
    kind: "ARC",
    center: { ...node.center },
    radius: node.radius,
    startAngleDeg: node.startAngleDeg,
    endAngleDeg: node.endAngleDeg,
    sweep: node.sweep,
  };
}
