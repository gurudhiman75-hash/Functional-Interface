import {
  exactToNumber,
  formatExactPlain,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";
import type { Trg002ProofQlId, Trg002ProofQuestion } from "./runtime-proof";

export type Trg002SolutionAnnotationRole =
  | "GIVEN"
  | "TARGET_SOLVED"
  | "MOVEMENT"
  | "EYE_HEIGHT";

export type Trg002SolutionAnnotationPlacement = "ABOVE" | "BELOW" | "LEFT" | "RIGHT";

export type Trg002SolutionAnnotationSource =
  | { kind: "ANSWER" }
  | { kind: "OBJECT_HEIGHT"; objectId: string }
  | { kind: "HORIZONTAL_DISTANCE"; fromPointId: string; toPointId: string }
  | { kind: "MOVEMENT_DISTANCE"; movementId: string }
  | { kind: "EYE_HEIGHT"; observerId: string };

export interface Trg002SolutionAnnotationPlanEntry {
  id: string;
  role: Trg002SolutionAnnotationRole;
  fromPointId: string;
  toPointId: string;
  source: Trg002SolutionAnnotationSource;
  placement: Trg002SolutionAnnotationPlacement;
  symbol?: string;
}

export interface Trg002ResolvedSolutionAnnotation extends Trg002SolutionAnnotationPlanEntry {
  label: string;
}

const P = (
  id: string,
  role: Trg002SolutionAnnotationRole,
  fromPointId: string,
  toPointId: string,
  source: Trg002SolutionAnnotationSource,
  placement: Trg002SolutionAnnotationPlacement,
  symbol?: string,
): Trg002SolutionAnnotationPlanEntry => ({
  id,
  role,
  fromPointId,
  toPointId,
  source,
  placement,
  ...(symbol ? { symbol } : {}),
});

/**
 * Explicit solution-annotation authority for the 20-Ql proof.
 *
 * The registry says WHAT semantic quantity may be shown and WHERE. It never
 * asks the renderer to infer a value from screen coordinates or parse the stem.
 * Values are resolved from exact canonical fields or from the exact answer.
 */
export const TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS: Record<
  Trg002ProofQlId,
  readonly Trg002SolutionAnnotationPlanEntry[]
> = {
  "TRG-002-QL-001": [
    P("given-horizontal", "GIVEN", "object-base", "observer-ground", { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, "BELOW", "d"),
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-007": [
    P("given-height", "GIVEN", "object-base", "object-top", { kind: "OBJECT_HEIGHT", objectId: "object-1" }, "RIGHT", "h"),
    P("target-horizontal", "TARGET_SOLVED", "object-base", "observer-ground", { kind: "ANSWER" }, "BELOW", "d"),
  ],
  "TRG-002-QL-012": [
    P("given-height", "GIVEN", "object-base", "object-top", { kind: "OBJECT_HEIGHT", objectId: "object-1" }, "RIGHT", "h"),
    P("given-horizontal", "GIVEN", "object-base", "observer-ground", { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, "BELOW", "d"),
  ],
  "TRG-002-QL-015": [
    P("given-observer-height", "GIVEN", "observer-base", "observer-top", { kind: "OBJECT_HEIGHT", objectId: "observer-building" }, "RIGHT"),
    P("given-horizontal", "GIVEN", "observer-base", "target-base", { kind: "HORIZONTAL_DISTANCE", fromPointId: "observer-base", toPointId: "target-base" }, "BELOW"),
    P("target-pole-height", "TARGET_SOLVED", "target-base", "target-top", { kind: "ANSWER" }, "LEFT", "h"),
  ],
  "TRG-002-QL-023": [
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-025": [
    P("given-shadow", "GIVEN", "object-base", "shadow-tip", { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "shadow-tip" }, "BELOW", "s"),
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-030": [
    P("given-height", "GIVEN", "object-base", "object-top", { kind: "OBJECT_HEIGHT", objectId: "object-1" }, "RIGHT", "h"),
    P("target-shadow", "TARGET_SOLVED", "object-base", "shadow-tip", { kind: "ANSWER" }, "BELOW", "s"),
  ],
  "TRG-002-QL-033": [
    P("given-old-shadow", "GIVEN", "object-base", "shadow-tip-old", { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "shadow-tip-old" }, "BELOW", "s₁"),
    P("target-new-shadow", "TARGET_SOLVED", "object-base", "shadow-tip-new", { kind: "ANSWER" }, "ABOVE", "s₂"),
  ],
  "TRG-002-QL-036": [
    P("target-wall-height", "TARGET_SOLVED", "wall-base", "wall-contact", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-045": [
    P("given-mast-height", "GIVEN", "mast-base", "mast-top", { kind: "OBJECT_HEIGHT", objectId: "mast-1" }, "RIGHT", "h"),
    P("target-wire", "TARGET_SOLVED", "anchor", "mast-top", { kind: "ANSWER" }, "ABOVE", "L"),
  ],
  "TRG-002-QL-049": [
    P("given-point-separation", "GIVEN", "near-ground", "far-ground", { kind: "HORIZONTAL_DISTANCE", fromPointId: "near-ground", toPointId: "far-ground" }, "BELOW", "AB"),
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-056": [
    P("given-movement", "MOVEMENT", "far-ground", "near-ground", { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" }, "ABOVE", "m"),
    P("target-near-distance", "TARGET_SOLVED", "object-base", "near-ground", { kind: "ANSWER" }, "BELOW", "x"),
  ],
  "TRG-002-QL-061": [
    P("given-movement", "MOVEMENT", "near-ground", "far-ground", { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" }, "ABOVE", "m"),
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-065": [
    P("given-movement", "MOVEMENT", "far-ground", "near-ground", { kind: "MOVEMENT_DISTANCE", movementId: "movement-1" }, "ABOVE", "m"),
    P("target-original-distance", "TARGET_SOLVED", "object-base", "far-ground", { kind: "ANSWER" }, "BELOW", "x"),
  ],
  "TRG-002-QL-068": [
    P("given-height", "GIVEN", "object-base", "object-top", { kind: "OBJECT_HEIGHT", objectId: "object-1" }, "RIGHT", "h"),
    P("target-separation", "TARGET_SOLVED", "near-ground", "far-ground", { kind: "ANSWER" }, "BELOW", "AB"),
  ],
  "TRG-002-QL-073": [
    P("given-horizontal", "GIVEN", "object-base", "observer-ground", { kind: "HORIZONTAL_DISTANCE", fromPointId: "object-base", toPointId: "observer-ground" }, "BELOW", "d"),
    P("given-eye-height", "EYE_HEIGHT", "observer-ground", "observer-eye", { kind: "EYE_HEIGHT", observerId: "observer-1" }, "LEFT", "e"),
    P("target-building-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "H"),
  ],
  "TRG-002-QL-078": [
    P("given-observer-separation", "GIVEN", "left-ground", "right-ground", { kind: "HORIZONTAL_DISTANCE", fromPointId: "left-ground", toPointId: "right-ground" }, "BELOW", "AB"),
    P("target-height", "TARGET_SOLVED", "object-base", "object-top", { kind: "ANSWER" }, "RIGHT", "h"),
  ],
  "TRG-002-QL-083": [
    P("given-first-height", "GIVEN", "first-base", "first-top", { kind: "OBJECT_HEIGHT", objectId: "building-1" }, "RIGHT", "h₁"),
    P("given-horizontal", "GIVEN", "first-base", "second-base", { kind: "HORIZONTAL_DISTANCE", fromPointId: "first-base", toPointId: "second-base" }, "BELOW", "d"),
    P("target-second-height", "TARGET_SOLVED", "second-base", "second-top", { kind: "ANSWER" }, "LEFT", "h₂"),
  ],
  "TRG-002-QL-088": [
    P("given-observer-building-height", "GIVEN", "observer-base", "observer-top", { kind: "OBJECT_HEIGHT", objectId: "observer-building" }, "RIGHT", "h₁"),
    P("target-tower-height", "TARGET_SOLVED", "target-base", "target-top", { kind: "ANSWER" }, "LEFT", "h₂"),
  ],
  "TRG-002-QL-092": [
    P("given-tower-height", "GIVEN", "tower-base", "tower-top", { kind: "OBJECT_HEIGHT", objectId: "bank-tower" }, "RIGHT", "h"),
    P("target-river-width", "TARGET_SOLVED", "tower-base", "opposite-bank", { kind: "ANSWER" }, "BELOW", "w"),
  ],
};

function point(question: Trg002ProofQuestion, id: string) {
  const found = question.canonicalSpatialState.points.find((item) => item.id === id);
  if (!found) throw new Error(`${question.qlId}: annotation cannot resolve point ${id}.`);
  return found;
}

function object(question: Trg002ProofQuestion, id: string) {
  const found = question.canonicalSpatialState.verticalObjects.find((item) => item.id === id);
  if (!found) throw new Error(`${question.qlId}: annotation cannot resolve object ${id}.`);
  return found;
}

function positiveDifference(first: ExactTrigNumber, second: ExactTrigNumber) {
  return exactToNumber(first) >= exactToNumber(second)
    ? subtractExact(first, second)
    : subtractExact(second, first);
}

function formatLength(question: Trg002ProofQuestion, value: ExactTrigNumber) {
  return `${formatExactPlain(value)} ${question.canonicalSpatialState.metadata.units}`;
}

function resolveSource(question: Trg002ProofQuestion, source: Trg002SolutionAnnotationSource) {
  switch (source.kind) {
    case "ANSWER":
      if (question.exactAnswer.kind !== "NUMBER") {
        throw new Error(`${question.qlId}: numeric dimension annotation cannot use an angle answer.`);
      }
      return question.answer;
    case "OBJECT_HEIGHT":
      return formatLength(question, object(question, source.objectId).height);
    case "HORIZONTAL_DISTANCE": {
      const first = point(question, source.fromPointId);
      const second = point(question, source.toPointId);
      return formatLength(question, positiveDifference(first.x, second.x));
    }
    case "MOVEMENT_DISTANCE": {
      const movement = question.canonicalSpatialState.movements.find((item) => item.id === source.movementId);
      if (!movement) throw new Error(`${question.qlId}: annotation cannot resolve movement ${source.movementId}.`);
      return formatLength(question, movement.distance);
    }
    case "EYE_HEIGHT": {
      const observer = question.canonicalSpatialState.observers.find((item) => item.id === source.observerId);
      if (!observer) throw new Error(`${question.qlId}: annotation cannot resolve observer ${source.observerId}.`);
      return formatLength(question, observer.eyeHeight);
    }
  }
}

export function buildTrg002SolutionAnnotations(question: Trg002ProofQuestion) {
  const plan = TRG_002_PROOF_SOLUTION_ANNOTATION_PLANS[question.qlId];
  const pointIds = new Set(question.canonicalSpatialState.points.map((item) => item.id));
  const resolved: Trg002ResolvedSolutionAnnotation[] = plan.map((entry) => {
    if (!pointIds.has(entry.fromPointId) || !pointIds.has(entry.toPointId)) {
      throw new Error(`${question.qlId}: annotation ${entry.id} has unresolved endpoints.`);
    }
    const value = resolveSource(question, entry.source);
    return {
      ...entry,
      label: entry.symbol ? `${entry.symbol} = ${value}` : value,
    };
  });

  const checks = [
    {
      name: "ANNOTATION_IDS_UNIQUE",
      passed: new Set(resolved.map((item) => item.id)).size === resolved.length,
      message: "Solution annotation IDs are unique.",
    },
    {
      name: "ANNOTATION_LABELS_NONEMPTY",
      passed: resolved.every((item) => item.label.trim().length > 0),
      message: "Every solution annotation has a non-empty exact label.",
    },
    {
      name: "ANNOTATION_ENDPOINTS_RESOLVE",
      passed: resolved.every((item) => pointIds.has(item.fromPointId) && pointIds.has(item.toPointId)),
      message: "Every solution annotation resolves canonical endpoints.",
    },
    {
      name: "SOLUTION_ONLY_TARGET_DISCLOSURE",
      passed: resolved.every((item) => item.role !== "TARGET_SOLVED" || item.source.kind === "ANSWER"),
      message: "Solved target annotations are sourced only from the exact answer and remain solution-stage content.",
    },
  ];

  return {
    annotations: resolved,
    validation: { valid: checks.every((check) => check.passed), checks },
  };
}
