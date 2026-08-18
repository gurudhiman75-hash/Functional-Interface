import {
  FGC_001_PROTOTYPES_V1,
  generateFigureCompletionDiscoveryQuestionV2,
  type FigureCompletionPrototypeV1,
} from "../foundation/spatial/figure-completion-discovery-v2-hardened";
import type { SpatialNode, SpatialPoint } from "../foundation/spatial/types";

const PATCH = { left: 34, top: 34, right: 66, bottom: 66 } as const;
const MIN_VISIBLE_CUE_LENGTH = 9;
const ACCEPTED_PER_PROTOTYPE = 24;
const MAX_ATTEMPTS_PER_PROTOTYPE = 240;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function isRetryableGenerationReject(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.includes("semantically equivalent completion options") ||
    error.message.includes("perceptually equivalent completion options");
}

function distance(a: SpatialPoint, b: SpatialPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function strictlyInsidePatch(point: SpatialPoint): boolean {
  return point.x > PATCH.left && point.x < PATCH.right && point.y > PATCH.top && point.y < PATCH.bottom;
}

function onPatchBoundary(point: SpatialPoint): boolean {
  const onVertical = (point.x === PATCH.left || point.x === PATCH.right) && point.y >= PATCH.top && point.y <= PATCH.bottom;
  const onHorizontal = (point.y === PATCH.top || point.y === PATCH.bottom) && point.x >= PATCH.left && point.x <= PATCH.right;
  return onVertical || onHorizontal;
}

function nodePoints(node: SpatialNode): SpatialPoint[] {
  switch (node.kind) {
    case "line": return [node.start, node.end];
    case "circle": return [node.center];
    case "polygon":
    case "polyline": return node.points;
    case "arc": return [node.center];
  }
}

function boundaryCueSegments(node: SpatialNode): Array<[SpatialPoint, SpatialPoint]> {
  if (node.kind === "line") {
    if (onPatchBoundary(node.start)) return [[node.start, node.end]];
    if (onPatchBoundary(node.end)) return [[node.end, node.start]];
    return [];
  }
  if (node.kind === "polyline") {
    const segments: Array<[SpatialPoint, SpatialPoint]> = [];
    for (let index = 0; index < node.points.length; index += 1) {
      const point = node.points[index]!;
      if (!onPatchBoundary(point)) continue;
      if (index > 0) segments.push([point, node.points[index - 1]!]);
      if (index < node.points.length - 1) segments.push([point, node.points[index + 1]!]);
    }
    return segments;
  }
  return [];
}

function auditQuestion(prototypeId: FigureCompletionPrototypeV1, seed: string): void {
  const question = generateFigureCompletionDiscoveryQuestionV2({ prototypeId, seed, desiredCorrectOptionIndex: 0 });
  assert(question.solverEvidence.patchOrigin.x === PATCH.left, `${prototypeId}/${seed}: patch must be horizontally centered at x=34.`);
  assert(question.solverEvidence.patchOrigin.y === PATCH.top, `${prototypeId}/${seed}: patch must start at y=34.`);
  assert(question.solverEvidence.patchSize === 32, `${prototypeId}/${seed}: patch size drifted.`);

  const missing = question.stimulusScene.nodes.find((node) => node.id === "missing-box");
  assert(missing?.kind === "polygon", `${prototypeId}/${seed}: missing-box polygon absent.`);
  const expectedBoundary = new Set(["34,34", "66,34", "66,66", "34,66"]);
  assert(missing.points.length === 4 && missing.points.every((point) => expectedBoundary.has(`${point.x},${point.y}`)), `${prototypeId}/${seed}: missing-box geometry is not the centered 32x32 window.`);

  const visibleNodes = question.stimulusScene.nodes.filter((node) => node.id !== "missing-box" && node.id !== "outer-frame");
  for (const node of visibleNodes) {
    assert(!nodePoints(node).some(strictlyInsidePatch), `${prototypeId}/${seed}/${node.id}: visible context leaks inside the missing region.`);
    for (const [boundaryPoint, outsidePoint] of boundaryCueSegments(node)) {
      assert(!strictlyInsidePatch(outsidePoint), `${prototypeId}/${seed}/${node.id}: boundary cue points back inside the hidden patch.`);
      assert(distance(boundaryPoint, outsidePoint) >= MIN_VISIBLE_CUE_LENGTH, `${prototypeId}/${seed}/${node.id}: boundary cue is too short for learner-visible evidence.`);
    }
  }
}

let audited = 0;
let generationRejects = 0;
const attemptsByPrototype: Record<string, number> = {};
for (const prototypeId of FGC_001_PROTOTYPES_V1) {
  let acceptedForPrototype = 0;
  let attempts = 0;
  for (let index = 0; index < MAX_ATTEMPTS_PER_PROTOTYPE && acceptedForPrototype < ACCEPTED_PER_PROTOTYPE; index += 1) {
    attempts += 1;
    const seed = `FGC-VISUAL-COMPOSITION-HARDENED:${prototypeId}:${String(index).padStart(3, "0")}`;
    try {
      auditQuestion(prototypeId, seed);
    } catch (error) {
      if (isRetryableGenerationReject(error)) {
        generationRejects += 1;
        continue;
      }
      throw error;
    }
    acceptedForPrototype += 1;
    audited += 1;
  }
  attemptsByPrototype[prototypeId] = attempts;
  assert(acceptedForPrototype === ACCEPTED_PER_PROTOTYPE, `${prototypeId}: visual composition audit reached ${acceptedForPrototype}/${ACCEPTED_PER_PROTOTYPE} accepted questions after ${attempts} attempts.`);
}

console.log(JSON.stringify({
  status: "PASS_FGC_001_VISUAL_COMPOSITION_V2_HARDENED",
  prototypes: FGC_001_PROTOTYPES_V1.length,
  acceptedPerPrototype: ACCEPTED_PER_PROTOTYPE,
  audited,
  generationRejects,
  attemptsByPrototype,
  patch: PATCH,
  minimumVisibleCueLength: MIN_VISIBLE_CUE_LENGTH,
}, null, 2));
