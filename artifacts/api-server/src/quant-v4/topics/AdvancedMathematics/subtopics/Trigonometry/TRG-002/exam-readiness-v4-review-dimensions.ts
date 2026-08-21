import {
  exactToNumber,
  formatExactPlain,
  negateExact,
  subtractExact,
} from "../foundation/exact";
import type { ExactTrigNumber } from "../foundation/types";

type AnyRecord = Record<string, any>;
type DimensionArrow = {
  id: string;
  fromPointId: string;
  toPointId: string;
  label: string;
  side: "LEFT" | "RIGHT";
  lane: number;
  kind: string;
};

type SegmentRange = {
  orientation: "HORIZONTAL" | "VERTICAL" | "SLOPED";
  side: "LEFT" | "RIGHT";
  fromPointId: string;
  toPointId: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  lane: number;
};

function exactAbs(value: ExactTrigNumber): ExactTrigNumber {
  return exactToNumber(value) < 0 ? negateExact(value) : value;
}

function formatLength(value: ExactTrigNumber, unit: string) {
  return `${formatExactPlain(exactAbs(value))} ${unit}`;
}

function endpointKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

function orientation(from: { x: number; y: number }, to: { x: number; y: number }): SegmentRange["orientation"] {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dy < 1e-6) return "HORIZONTAL";
  if (dx < 1e-6) return "VERTICAL";
  return "SLOPED";
}

function sideWithMoreSpace(from: { x: number; y: number }, to: { x: number; y: number }, width: number, height: number): "LEFT" | "RIGHT" {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const left = { x: uy, y: -ux };
  const midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

  const room = (normal: { x: number; y: number }) => {
    const candidates: number[] = [];
    if (normal.x > 1e-9) candidates.push((width - 12 - midpoint.x) / normal.x);
    else if (normal.x < -1e-9) candidates.push((midpoint.x - 12) / -normal.x);
    if (normal.y > 1e-9) candidates.push((height - 12 - midpoint.y) / normal.y);
    else if (normal.y < -1e-9) candidates.push((midpoint.y - 12) / -normal.y);
    return candidates.length ? Math.min(...candidates.filter((value) => value >= 0)) : 0;
  };

  return room(left) >= room({ x: -left.x, y: -left.y }) ? "LEFT" : "RIGHT";
}

function rangesOverlap(a: SegmentRange, b: SegmentRange) {
  if (a.orientation !== b.orientation || a.side !== b.side) return false;
  if (a.orientation === "HORIZONTAL") {
    return Math.abs(a.minY - b.minY) < 8 && a.minX < b.maxX - 4 && b.minX < a.maxX - 4;
  }
  if (a.orientation === "VERTICAL") {
    return Math.abs(a.minX - b.minX) < 8 && a.minY < b.maxY - 4 && b.minY < a.maxY - 4;
  }
  return a.minX < b.maxX - 4 && b.minX < a.maxX - 4 && a.minY < b.maxY - 4 && b.minY < a.maxY - 4;
}

function laneFor(
  fromPointId: string,
  toPointId: string,
  side: "LEFT" | "RIGHT",
  points: Map<string, { x: number; y: number }>,
  placed: SegmentRange[],
) {
  const from = points.get(fromPointId)!;
  const to = points.get(toPointId)!;
  const candidate: SegmentRange = {
    orientation: orientation(from, to),
    side,
    fromPointId,
    toPointId,
    minX: Math.min(from.x, to.x),
    maxX: Math.max(from.x, to.x),
    minY: Math.min(from.y, to.y),
    maxY: Math.max(from.y, to.y),
    lane: 0,
  };
  const used = new Set(placed.filter((other) => rangesOverlap(candidate, other)).map((other) => other.lane));
  let lane = 0;
  while (used.has(lane)) lane += 1;
  candidate.lane = lane;
  placed.push(candidate);
  return lane;
}

function pointExactDistanceAlongAxis(statePoints: Map<string, AnyRecord>, fromPointId: string, toPointId: string) {
  const from = statePoints.get(fromPointId);
  const to = statePoints.get(toPointId);
  if (!from || !to) return null;
  const dx = subtractExact(to.x, from.x);
  const dy = subtractExact(to.y, from.y);
  const nx = Math.abs(exactToNumber(dx));
  const ny = Math.abs(exactToNumber(dy));
  if (ny < 1e-8) return exactAbs(dx);
  if (nx < 1e-8) return exactAbs(dy);
  return null;
}

function numericDistance(statePoints: Map<string, AnyRecord>, fromPointId: string, toPointId: string) {
  const from = statePoints.get(fromPointId);
  const to = statePoints.get(toPointId);
  if (!from || !to) return Number.NaN;
  return Math.hypot(exactToNumber(subtractExact(to.x, from.x)), exactToNumber(subtractExact(to.y, from.y)));
}

function numericMeterLiterals(stem: string) {
  return [...stem.matchAll(/(?<![\d.])(\d+(?:\.\d+)?)\s*m\b/g)].map((match) => ({
    value: Number(match[1]),
    label: `${match[1]} m`,
  }));
}

function requestedPair(state: AnyRecord): { fromPointId: string; toPointId: string } | null {
  const requested = state.requested ?? {};
  if (requested.kind === "OBJECT_HEIGHT") {
    const object = (state.verticalObjects ?? []).find((item: AnyRecord) => item.id === requested.objectId);
    return object ? { fromPointId: object.basePointId, toPointId: object.topPointId } : null;
  }
  if (requested.kind === "HORIZONTAL_DISTANCE" || requested.kind === "SIGHT_LINE_LENGTH") {
    return { fromPointId: requested.fromPointId, toPointId: requested.toPointId };
  }
  if (requested.kind === "MOVEMENT_DISTANCE") {
    const movement = (state.movements ?? []).find((item: AnyRecord) => item.id === requested.movementId);
    return movement ? { fromPointId: movement.fromGroundPointId, toPointId: movement.toGroundPointId } : null;
  }
  if (requested.kind === "EYE_HEIGHT") {
    const observer = (state.observers ?? []).find((item: AnyRecord) => item.id === requested.observerId);
    return observer ? { fromPointId: observer.groundPointId, toPointId: observer.eyePointId } : null;
  }
  if (requested.kind === "SHADOW_LENGTH") {
    const object = (state.verticalObjects ?? []).find((item: AnyRecord) => item.id === requested.objectId);
    return object ? { fromPointId: object.basePointId, toPointId: requested.shadowTipPointId } : null;
  }
  return null;
}

export function applyTrg002V4ReviewDimensions(args: {
  qlId: string;
  diagram: AnyRecord;
  canonicalSpatialState: AnyRecord;
  englishStem: string;
  englishAnswer: string;
}) {
  const { qlId, diagram, canonicalSpatialState: state, englishStem, englishAnswer } = args;
  if (!diagram || !state) throw new Error(`${qlId}: review dimension enrichment requires diagram + canonical spatial state.`);
  const diagramPoints = new Map<string, { x: number; y: number }>((diagram.points ?? []).map((point: AnyRecord) => [point.id, { x: Number(point.x), y: Number(point.y) }]));
  const statePoints = new Map<string, AnyRecord>((state.points ?? []).map((point: AnyRecord) => [point.id, point]));
  const unit = state.metadata?.units ?? "m";
  const existing: DimensionArrow[] = Array.isArray(diagram.measurementArrows) ? [...diagram.measurementArrows] : [];
  const seen = new Set(existing.map((arrow) => endpointKey(arrow.fromPointId, arrow.toPointId)));
  const placed: SegmentRange[] = [];
  const auto: DimensionArrow[] = [];

  const add = (fromPointId: string, toPointId: string, label: string, source: string) => {
    if (!diagramPoints.has(fromPointId) || !diagramPoints.has(toPointId) || !label.trim()) return;
    const key = endpointKey(fromPointId, toPointId);
    if (seen.has(key)) return;
    const from = diagramPoints.get(fromPointId)!;
    const to = diagramPoints.get(toPointId)!;
    const side = sideWithMoreSpace(from, to, Number(diagram.width ?? 1000), Number(diagram.height ?? 600));
    const lane = laneFor(fromPointId, toPointId, side, diagramPoints, placed);
    auto.push({
      id: `review-dim-${qlId.replace(/[^A-Za-z0-9]/g, "-")}-${auto.length + 1}`,
      fromPointId,
      toPointId,
      label,
      side,
      lane,
      kind: `REVIEW_${source}`,
    });
    seen.add(key);
  };

  for (const object of state.verticalObjects ?? []) {
    add(object.basePointId, object.topPointId, formatLength(object.height, unit), "OBJECT_HEIGHT");
  }

  for (const observer of state.observers ?? []) {
    if (Math.abs(exactToNumber(observer.eyeHeight)) > 1e-8) {
      add(observer.groundPointId, observer.eyePointId, formatLength(observer.eyeHeight, unit), "EYE_HEIGHT");
    }
  }

  for (const segment of diagram.segments ?? []) {
    if (!["GROUND", "SHADOW", "MOVEMENT"].includes(String(segment.kind))) continue;
    const distance = pointExactDistanceAlongAxis(statePoints, segment.fromPointId, segment.toPointId);
    if (distance && Math.abs(exactToNumber(distance)) > 1e-8) {
      add(segment.fromPointId, segment.toPointId, formatLength(distance, unit), String(segment.kind));
    }
  }

  const requested = state.requested ?? {};
  const reqPair = requestedPair(state);
  if (reqPair) {
    if (requested.kind === "SIGHT_LINE_LENGTH") {
      add(reqPair.fromPointId, reqPair.toPointId, englishAnswer, "REQUESTED");
    } else {
      const distance = pointExactDistanceAlongAxis(statePoints, reqPair.fromPointId, reqPair.toPointId);
      if (distance) add(reqPair.fromPointId, reqPair.toPointId, formatLength(distance, unit), "REQUESTED");
      else add(reqPair.fromPointId, reqPair.toPointId, englishAnswer, "REQUESTED");
    }
  }

  for (const movement of state.movements ?? []) {
    add(movement.fromGroundPointId, movement.toGroundPointId, formatLength(movement.distance, unit), "MOVEMENT");
  }

  const measurements = state.metadata?.measurements ?? {};
  const specialPairs: Record<string, [string, string]> = {
    "height-added": ["initial-top", "completed-top"],
    "standing-part": ["tree-base", "break-point"],
    "fallen-part": ["break-point", "touch-point"],
    "boat-separation": ["boat-near", "boat-far"],
    "target-height": ["target-ground", "target"],
  };
  for (const [name, [fromPointId, toPointId]] of Object.entries(specialPairs)) {
    const value = measurements[name];
    if (value) add(fromPointId, toPointId, formatLength(value, unit), `GIVEN_${name.toUpperCase().replaceAll("-", "_")}`);
  }

  const stemMeters = numericMeterLiterals(englishStem);
  for (const segment of diagram.segments ?? []) {
    if (!["LADDER", "WIRE", "SIGHT_LINE"].includes(String(segment.kind))) continue;
    const actual = numericDistance(statePoints, segment.fromPointId, segment.toPointId);
    if (!Number.isFinite(actual)) continue;
    const literal = stemMeters.find((entry) => Math.abs(entry.value - actual) < 1e-7);
    if (literal) add(segment.fromPointId, segment.toPointId, literal.label, `GIVEN_${segment.kind}`);
  }

  const all = [...existing, ...auto];
  if (all.length < 2) throw new Error(`${qlId}: solution diagram must expose at least two dimensions; got ${all.length}.`);

  if (reqPair && !seen.has(endpointKey(reqPair.fromPointId, reqPair.toPointId))) {
    throw new Error(`${qlId}: requested linear quantity is missing from the solution diagram dimensions.`);
  }

  return {
    ...diagram,
    measurementArrows: all,
    reviewDimensionAudit: {
      autoDimensions: auto.length,
      totalDimensions: all.length,
      requestedDimensionPresent: reqPair ? seen.has(endpointKey(reqPair.fromPointId, reqPair.toPointId)) : true,
    },
  };
}
