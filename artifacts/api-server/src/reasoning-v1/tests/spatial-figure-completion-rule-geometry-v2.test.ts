import {
  FGC_001_PROTOTYPES_V1,
  generateFigureCompletionDiscoveryQuestionV2,
  type FigureCompletionPrototypeV1,
  type FigureCompletionQuestionV1,
} from "../foundation/spatial/figure-completion-discovery-v2";
import type { SpatialNode, SpatialPoint } from "../foundation/spatial/types";

const PATCH_ORIGIN = { x: 34, y: 34 } as const;
const PATCH_SIZE = 32;
const ACCEPTED_PER_PROTOTYPE = 32;
const MAX_ATTEMPTS_PER_PROTOTYPE = 320;
const EPSILON = 1e-7;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRetryableGenerationReject(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("semantically equivalent completion options") ||
    error.message.includes("perceptually equivalent completion options");
}

function samePoint(left: SpatialPoint, right: SpatialPoint): boolean {
  return Math.abs(left.x - right.x) <= EPSILON && Math.abs(left.y - right.y) <= EPSILON;
}

function vector(from: SpatialPoint, to: SpatialPoint): SpatialPoint {
  return { x: to.x - from.x, y: to.y - from.y };
}

function cross(left: SpatialPoint, right: SpatialPoint): number {
  return left.x * right.y - left.y * right.x;
}

function dot(left: SpatialPoint, right: SpatialPoint): number {
  return left.x * right.x + left.y * right.y;
}

function translated(point: SpatialPoint): SpatialPoint {
  return { x: point.x + PATCH_ORIGIN.x, y: point.y + PATCH_ORIGIN.y };
}

function onPatchBoundary(point: SpatialPoint): boolean {
  const left = PATCH_ORIGIN.x;
  const top = PATCH_ORIGIN.y;
  const right = left + PATCH_SIZE;
  const bottom = top + PATCH_SIZE;
  const vertical = (Math.abs(point.x - left) <= EPSILON || Math.abs(point.x - right) <= EPSILON) && point.y >= top - EPSILON && point.y <= bottom + EPSILON;
  const horizontal = (Math.abs(point.y - top) <= EPSILON || Math.abs(point.y - bottom) <= EPSILON) && point.x >= left - EPSILON && point.x <= right + EPSILON;
  return vertical || horizontal;
}

interface BoundaryTangent {
  boundary: SpatialPoint;
  interior: SpatialPoint;
}

function fragmentBoundaryTangents(node: SpatialNode): BoundaryTangent[] {
  if (node.kind === "line") {
    const start = translated(node.start);
    const end = translated(node.end);
    const result: BoundaryTangent[] = [];
    if (onPatchBoundary(start)) result.push({ boundary: start, interior: end });
    if (onPatchBoundary(end)) result.push({ boundary: end, interior: start });
    return result;
  }
  if (node.kind === "polyline") {
    const points = node.points.map(translated);
    const result: BoundaryTangent[] = [];
    if (points.length >= 2 && onPatchBoundary(points[0]!)) {
      result.push({ boundary: points[0]!, interior: points[1]! });
    }
    const last = points.length - 1;
    if (points.length >= 2 && onPatchBoundary(points[last]!)) {
      result.push({ boundary: points[last]!, interior: points[last - 1]! });
    }
    return result;
  }
  return [];
}

function contextBoundaryTangents(node: SpatialNode): BoundaryTangent[] {
  if (node.kind === "line") {
    const result: BoundaryTangent[] = [];
    if (onPatchBoundary(node.start)) result.push({ boundary: node.start, interior: node.end });
    if (onPatchBoundary(node.end)) result.push({ boundary: node.end, interior: node.start });
    return result;
  }
  if (node.kind === "polyline") {
    const result: BoundaryTangent[] = [];
    if (node.points.length >= 2 && onPatchBoundary(node.points[0]!)) {
      result.push({ boundary: node.points[0]!, interior: node.points[1]! });
    }
    const last = node.points.length - 1;
    if (node.points.length >= 2 && onPatchBoundary(node.points[last]!)) {
      result.push({ boundary: node.points[last]!, interior: node.points[last - 1]! });
    }
    return result;
  }
  return [];
}

function assertBoundaryContinuity(question: FigureCompletionQuestionV1): number {
  const correct = question.options[question.correctOptionIndex]!.scene;
  const fragmentTangents = correct.nodes.flatMap(fragmentBoundaryTangents);
  const contextTangents = question.stimulusScene.nodes
    .filter((node) => node.id !== "missing-box" && node.id !== "outer-frame")
    .flatMap(contextBoundaryTangents);

  assert(fragmentTangents.length === question.solverEvidence.visibleEntryCount, `${question.prototypeId}/${question.seed}: fragment boundary tangent count ${fragmentTangents.length} != declared visibleEntryCount ${question.solverEvidence.visibleEntryCount}.`);

  for (const fragment of fragmentTangents) {
    const matches = contextTangents.filter((context) => samePoint(context.boundary, fragment.boundary));
    assert(matches.length === 1, `${question.prototypeId}/${question.seed}: expected one visible context tangent at ${fragment.boundary.x},${fragment.boundary.y}, found ${matches.length}.`);
    const context = matches[0]!;
    const inward = vector(fragment.boundary, fragment.interior);
    const outward = vector(context.boundary, context.interior);
    const scale = Math.max(1, Math.hypot(inward.x, inward.y) * Math.hypot(outward.x, outward.y));
    assert(Math.abs(cross(inward, outward)) / scale <= EPSILON, `${question.prototypeId}/${question.seed}: correct fragment creates a visible angle kink at ${fragment.boundary.x},${fragment.boundary.y}.`);
    assert(dot(inward, outward) < 0, `${question.prototypeId}/${question.seed}: context and fragment point in the same direction instead of continuing through the boundary.`);
  }
  return fragmentTangents.length;
}

function pointLineResidual(point: SpatialPoint, start: SpatialPoint, end: SpatialPoint): number {
  const lineVector = vector(start, end);
  const pointVector = vector(start, point);
  return Math.abs(cross(lineVector, pointVector)) / Math.max(EPSILON, Math.hypot(lineVector.x, lineVector.y));
}

function assertMarkerPattern(question: FigureCompletionQuestionV1): void {
  if (question.prototypeId !== "FGC-PROT-05-COMPOUND-CONTOUR-MARKER") return;
  const correct = question.options[question.correctOptionIndex]!.scene;
  const fragmentLine = correct.nodes.find((node) => node.kind === "line" && node.id === "path");
  const fragmentMarker = correct.nodes.find((node) => node.kind === "circle" && node.id === "marker");
  assert(fragmentLine?.kind === "line", `${question.seed}: compound marker correct path missing.`);
  assert(fragmentMarker?.kind === "circle", `${question.seed}: compound marker correct marker missing.`);

  const visibleMarkers = question.stimulusScene.nodes.filter((node) => node.kind === "circle" && node.role === "marker");
  assert(visibleMarkers.length === 2, `${question.seed}: expected exactly two visible marker cues.`);
  const hidden = translated(fragmentMarker.center);
  const markers = [...visibleMarkers.map((node) => (node as Extract<SpatialNode, { kind: "circle" }>).center), hidden]
    .sort((left, right) => left.x - right.x);
  const leftGap = Math.hypot(markers[1]!.x - markers[0]!.x, markers[1]!.y - markers[0]!.y);
  const rightGap = Math.hypot(markers[2]!.x - markers[1]!.x, markers[2]!.y - markers[1]!.y);
  assert(Math.abs(leftGap - rightGap) <= EPSILON, `${question.seed}: hidden marker does not complete equal spacing.`);

  const globalStart = translated(fragmentLine.start);
  const globalEnd = translated(fragmentLine.end);
  for (const marker of markers) {
    assert(pointLineResidual(marker, globalStart, globalEnd) <= EPSILON, `${question.seed}: marker is not on the continued path.`);
  }

  const omitted = question.options.find((option) => option.misconception === "STRUCTURE_ONLY_MARKER_OMITTED");
  assert(omitted, `${question.seed}: marker-omitted distractor missing.`);
  assert(!omitted.scene.nodes.some((node) => node.kind === "circle"), `${question.seed}: marker-omitted distractor still draws a marker.`);
}

let auditedQuestions = 0;
let auditedBoundaryTangents = 0;
let generationRejects = 0;
const acceptedByPrototype: Record<string, number> = {};

for (const prototypeId of FGC_001_PROTOTYPES_V1) {
  let accepted = 0;
  for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_PROTOTYPE && accepted < ACCEPTED_PER_PROTOTYPE; attempt += 1) {
    const seed = `FGC-RULE-GEOMETRY-V2:${prototypeId}:${String(attempt).padStart(4, "0")}`;
    let question: FigureCompletionQuestionV1;
    try {
      question = generateFigureCompletionDiscoveryQuestionV2({ prototypeId, seed, desiredCorrectOptionIndex: 0 });
    } catch (error) {
      if (isRetryableGenerationReject(error)) {
        generationRejects += 1;
        continue;
      }
      throw error;
    }
    auditedBoundaryTangents += assertBoundaryContinuity(question);
    assertMarkerPattern(question);
    auditedQuestions += 1;
    accepted += 1;
  }
  acceptedByPrototype[prototypeId] = accepted;
  assert(accepted === ACCEPTED_PER_PROTOTYPE, `${prototypeId}: geometry audit reached ${accepted}/${ACCEPTED_PER_PROTOTYPE}.`);
}

console.log(JSON.stringify({
  status: "PASS_FGC_001_RULE_GEOMETRY_V2",
  acceptedPerPrototype: ACCEPTED_PER_PROTOTYPE,
  auditedQuestions,
  auditedBoundaryTangents,
  generationRejects,
  acceptedByPrototype,
  guarantees: [
    "correct fragments are collinear with every visible boundary cue",
    "junction arms continue to one common authored junction without kinks",
    "compound marker is collinear and equally spaced between visible markers",
    "marker-omitted distractor contains no marker",
  ],
}, null, 2));
