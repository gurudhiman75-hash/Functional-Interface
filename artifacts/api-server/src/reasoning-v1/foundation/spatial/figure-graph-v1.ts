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

const DEFAULT_TOLERANCE = 1e-5;
const ARC_SAMPLE_STEPS = 8;

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

function segmentContains(host: FigureGraphSegmentV1, target: FigureGraphSegmentV1, tolerance: number): boolean {
  const direction = subtract(host.b, host.a);
  const length = Math.hypot(direction.x, direction.y);
  if (length <= tolerance) return false;
  const targetA = subtract(target.a, host.a);
  const targetB = subtract(target.b, host.a);
  if (Math.abs(cross(direction, targetA)) / length > tolerance) return false;
  if (Math.abs(cross(direction, targetB)) / length > tolerance) return false;
  const denominator = dot(direction, direction);
  const ta = dot(targetA, direction) / denominator;
  const tb = dot(targetB, direction) / denominator;
  return ta >= -tolerance && ta <= 1 + tolerance && tb >= -tolerance && tb <= 1 + tolerance;
}

function transformedArcSamples(arc: FigureGraphArcV1, transform: FigureGraphRigidTransformV1): SpatialPoint[] {
  return sampleArc(arc).map((point) => applyFigureGraphTransformV1(point, transform));
}

function arcSamplesMatch(targetSamples: readonly SpatialPoint[], hostArc: FigureGraphArcV1, tolerance: number): boolean {
  const hostSamples = sampleArc(hostArc);
  if (hostSamples.length !== targetSamples.length) return false;
  const direct = hostSamples.every((point, index) => distance(point, targetSamples[index]!) <= tolerance);
  if (direct) return true;
  const reversed = [...hostSamples].reverse();
  return reversed.every((point, index) => distance(point, targetSamples[index]!) <= tolerance);
}

function angleOfVector(vector: SpatialPoint): number {
  return radiansToDegrees(Math.atan2(vector.y, vector.x));
}

function nearZeroRotation(rotationDeg: number, tolerance: number): boolean {
  const normalized = normalizeAngle(rotationDeg);
  return normalized <= tolerance || Math.abs(normalized - 360) <= tolerance;
}

function candidateFromSegmentPair(
  target: FigureGraphSegmentV1,
  host: FigureGraphSegmentV1,
  reflected: boolean,
  reverseHost: boolean,
): FigureGraphRigidTransformV1 | null {
  const reflectedA = reflected ? reflectPoint(target.a) : target.a;
  const reflectedB = reflected ? reflectPoint(target.b) : target.b;
  const targetVector = subtract(reflectedB, reflectedA);
  const hostStart = reverseHost ? host.b : host.a;
  const hostEnd = reverseHost ? host.a : host.b;
  const hostVector = subtract(hostEnd, hostStart);
  if (Math.abs(Math.hypot(targetVector.x, targetVector.y) - Math.hypot(hostVector.x, hostVector.y)) > 1e-4) return null;
  const rotationDeg = angleOfVector(hostVector) - angleOfVector(targetVector);
  const rotatedTargetStart = rotatePoint(reflectedA, rotationDeg);
  return {
    reflected,
    rotationDeg,
    translation: {
      x: hostStart.x - rotatedTargetStart.x,
      y: hostStart.y - rotatedTargetStart.y,
    },
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
    const samples = transformedArcSamples(targetArc, transform);
    const hostIndex = host.arcs.findIndex((candidate) => arcSamplesMatch(samples, candidate, tolerance));
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

  for (const hostSegment of host.segments) {
    for (const reflected of reflectionModes) {
      for (const reverseHost of [false, true] as const) {
        const candidate = candidateFromSegmentPair(anchor, hostSegment, reflected, reverseHost);
        if (!candidate) continue;
        if (!policy.allowRotation && !nearZeroRotation(candidate.rotationDeg, 1e-4)) continue;
        candidates.set(transformKey(candidate), candidate);
      }
    }
  }

  const embeddings: FigureGraphEmbeddingV1[] = [];
  for (const candidate of candidates.values()) {
    const verified = verifyEmbedding(target, host, candidate, tolerance);
    if (verified) embeddings.push(verified);
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
