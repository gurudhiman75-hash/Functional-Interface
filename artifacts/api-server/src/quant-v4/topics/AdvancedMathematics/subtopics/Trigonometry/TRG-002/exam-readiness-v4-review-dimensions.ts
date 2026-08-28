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

type MeterLiteral = { value: number; label: string };

function exactAbs(value: ExactTrigNumber): ExactTrigNumber {
  return exactToNumber(value) < 0 ? negateExact(value) : value;
}

function formatLength(value: ExactTrigNumber, unit: string) {
  return `${formatExactPlain(exactAbs(value))} ${unit}`;
}

function normalizeMathText(value: string) {
  return value.replaceAll("−", "-").replace(/\s+/g, " ").trim();
}

function textContainsLength(text: string, label: string) {
  return normalizeMathText(text).includes(normalizeMathText(label));
}

function exactLengthMention(text: string, label: string) {
  const normalizedText = normalizeMathText(text);
  const normalizedLabel = normalizeMathText(label);
  const escaped = normalizedLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\d√/])${escaped}(?!\\d)`, "u").test(normalizedText);
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
    const nonNegative = candidates.filter((value) => value >= 0);
    return nonNegative.length ? Math.min(...nonNegative) : 0;
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

function pointExactHorizontalDistance(statePoints: Map<string, AnyRecord>, fromPointId: string, toPointId: string) {
  const from = statePoints.get(fromPointId);
  const to = statePoints.get(toPointId);
  if (!from || !to) return null;
  const dx = subtractExact(to.x, from.x);
  const dy = subtractExact(to.y, from.y);
  if (Math.abs(exactToNumber(dy)) >= 1e-8) return null;
  return exactAbs(dx);
}

function numericDistance(statePoints: Map<string, AnyRecord>, fromPointId: string, toPointId: string) {
  const from = statePoints.get(fromPointId);
  const to = statePoints.get(toPointId);
  if (!from || !to) return Number.NaN;
  return Math.hypot(exactToNumber(subtractExact(to.x, from.x)), exactToNumber(subtractExact(to.y, from.y)));
}

function numericMeterLiterals(stem: string): MeterLiteral[] {
  return [...stem.matchAll(/(?<![\d./√])(\d+(?:\.\d+)?)\s*m\b/g)].map((match) => ({
    value: Number(match[1]),
    label: `${match[1]} m`,
  }));
}

function matchingLiteral(value: number, literals: MeterLiteral[]) {
  return literals.find((entry) => Math.abs(entry.value - Math.abs(value)) < 1e-7) ?? null;
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

function requestedLabel(kind: string, unit: string) {
  switch (kind) {
    case "OBJECT_HEIGHT": return `h = ? ${unit}`;
    case "HORIZONTAL_DISTANCE": return `x = ? ${unit}`;
    case "SIGHT_LINE_LENGTH": return `L = ? ${unit}`;
    case "MOVEMENT_DISTANCE": return `d = ? ${unit}`;
    case "EYE_HEIGHT": return `h = ? ${unit}`;
    case "SHADOW_LENGTH": return `s = ? ${unit}`;
    default: return `? ${unit}`;
  }
}

export function applyTrg002V4ReviewDimensions(args: {
  qlId: string;
  diagram: AnyRecord;
  canonicalSpatialState: AnyRecord;
  englishStem: string;
  englishExplanationText: string;
}) {
  const { qlId, diagram, canonicalSpatialState: state, englishStem, englishExplanationText } = args;
  if (!diagram || !state) throw new Error(`${qlId}: review dimension enrichment requires diagram + canonical spatial state.`);
  const diagramPoints = new Map<string, { x: number; y: number }>((diagram.points ?? []).map((point: AnyRecord) => [point.id, { x: Number(point.x), y: Number(point.y) }]));
  const statePoints = new Map<string, AnyRecord>((state.points ?? []).map((point: AnyRecord) => [point.id, point]));
  const diagramPointIds = new Set(diagramPoints.keys());
  const unit = state.metadata?.units ?? "m";
  const requested = state.requested ?? {};
  const reqPair = requestedPair(state);
  const reqKey = reqPair ? endpointKey(reqPair.fromPointId, reqPair.toPointId) : null;
  const existing: DimensionArrow[] = (Array.isArray(diagram.measurementArrows) ? diagram.measurementArrows : [])
    .filter((arrow: DimensionArrow) => endpointKey(arrow.fromPointId, arrow.toPointId) !== reqKey);
  const seen = new Set(existing.map((arrow) => endpointKey(arrow.fromPointId, arrow.toPointId)));
  const placed: SegmentRange[] = [];
  const auto: DimensionArrow[] = [];
  const stemMeters = numericMeterLiterals(englishStem);

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

  // The asked length is always displayed as an unknown, never as the solved answer.
  if (reqPair) add(reqPair.fromPointId, reqPair.toPointId, requestedLabel(requested.kind, unit), "REQUESTED_UNKNOWN");

  // Object/eye heights are shown when they are stated givens, or when the worked solution
  // explicitly uses the derived height as a helper quantity. Exact stem matching handles
  // integers, fractions and surds without reducing them to floating-point literals.
  for (const object of state.verticalObjects ?? []) {
    const key = endpointKey(object.basePointId, object.topPointId);
    if (key === reqKey) continue;
    const label = formatLength(object.height, unit);
    const literal = matchingLiteral(exactToNumber(object.height), stemMeters);
    if (exactLengthMention(englishStem, label)) add(object.basePointId, object.topPointId, label, "GIVEN_OBJECT_HEIGHT");
    else if (literal) add(object.basePointId, object.topPointId, literal.label, "GIVEN_OBJECT_HEIGHT");
    else if (textContainsLength(englishExplanationText, label)) add(object.basePointId, object.topPointId, label, "DERIVED_HELPER_OBJECT_HEIGHT");
  }

  for (const observer of state.observers ?? []) {
    if (Math.abs(exactToNumber(observer.eyeHeight)) < 1e-8) continue;
    const key = endpointKey(observer.groundPointId, observer.eyePointId);
    if (key === reqKey) continue;
    const label = formatLength(observer.eyeHeight, unit);
    const literal = matchingLiteral(exactToNumber(observer.eyeHeight), stemMeters);
    if (exactLengthMention(englishStem, label)) add(observer.groundPointId, observer.eyePointId, label, "GIVEN_EYE_HEIGHT");
    else if (literal) add(observer.groundPointId, observer.eyePointId, literal.label, "GIVEN_EYE_HEIGHT");
    else if (textContainsLength(englishExplanationText, label)) add(observer.groundPointId, observer.eyePointId, label, "DERIVED_HELPER_EYE_HEIGHT");
  }

  // Find explicitly stated horizontal separations even when the base diagram has one long
  // ground segment rather than a dedicated segment between the two observation points.
  const groundRoles = new Set(["GROUND", "OBJECT_BASE", "OBSERVER_GROUND", "SHADOW_TIP", "ANCHOR", "TOUCH_POINT", "BREAK_POINT"]);
  const groundPoints = (state.points ?? []).filter((point: AnyRecord) => diagramPointIds.has(point.id) && groundRoles.has(point.role));

  // First preserve exact canonical labels appearing in the stem, including surds/fractions.
  const exactHorizontalByLabel = new Map<string, Array<{ score: number; fromPointId: string; toPointId: string }>>();
  for (let left = 0; left < groundPoints.length; left += 1) {
    for (let right = left + 1; right < groundPoints.length; right += 1) {
      const from = groundPoints[left]!;
      const to = groundPoints[right]!;
      const key = endpointKey(from.id, to.id);
      if (key === reqKey || seen.has(key)) continue;
      const distance = pointExactHorizontalDistance(statePoints, from.id, to.id);
      if (!distance) continue;
      const label = formatLength(distance, unit);
      if (!exactLengthMention(englishStem, label)) continue;
      const bothObservers = from.role === "OBSERVER_GROUND" && to.role === "OBSERVER_GROUND";
      const oneObserver = from.role === "OBSERVER_GROUND" || to.role === "OBSERVER_GROUND";
      const candidates = exactHorizontalByLabel.get(label) ?? [];
      candidates.push({ score: bothObservers ? 0 : oneObserver ? 1 : 2, fromPointId: from.id, toPointId: to.id });
      exactHorizontalByLabel.set(label, candidates);
    }
  }
  for (const [label, candidates] of exactHorizontalByLabel) {
    candidates.sort((a, b) => a.score - b.score || a.fromPointId.localeCompare(b.fromPointId) || a.toPointId.localeCompare(b.toPointId));
    const best = candidates[0];
    if (best) add(best.fromPointId, best.toPointId, label, "GIVEN_HORIZONTAL_SEPARATION");
  }

  // Decimal/integer fallback tolerates editorial formatting variants.
  for (const literal of stemMeters) {
    const candidates: Array<{ score: number; fromPointId: string; toPointId: string }> = [];
    for (let left = 0; left < groundPoints.length; left += 1) {
      for (let right = left + 1; right < groundPoints.length; right += 1) {
        const from = groundPoints[left]!;
        const to = groundPoints[right]!;
        const key = endpointKey(from.id, to.id);
        if (key === reqKey || seen.has(key)) continue;
        const distance = pointExactHorizontalDistance(statePoints, from.id, to.id);
        if (!distance || Math.abs(exactToNumber(distance) - literal.value) >= 1e-7) continue;
        const bothObservers = from.role === "OBSERVER_GROUND" && to.role === "OBSERVER_GROUND";
        const oneObserver = from.role === "OBSERVER_GROUND" || to.role === "OBSERVER_GROUND";
        candidates.push({ score: bothObservers ? 0 : oneObserver ? 1 : 2, fromPointId: from.id, toPointId: to.id });
      }
    }
    candidates.sort((a, b) => a.score - b.score || a.fromPointId.localeCompare(b.fromPointId) || a.toPointId.localeCompare(b.toPointId));
    const best = candidates[0];
    if (best) add(best.fromPointId, best.toPointId, literal.label, "GIVEN_HORIZONTAL_SEPARATION");
  }

  // Movement may be stated directly or derived from speed/time; include it when the solution
  // explicitly computes and uses that movement.
  for (const movement of state.movements ?? []) {
    const key = endpointKey(movement.fromGroundPointId, movement.toGroundPointId);
    if (key === reqKey) continue;
    const label = formatLength(movement.distance, unit);
    const literal = matchingLiteral(exactToNumber(movement.distance), stemMeters);
    if (exactLengthMention(englishStem, label)) add(movement.fromGroundPointId, movement.toGroundPointId, label, "GIVEN_MOVEMENT");
    else if (literal) add(movement.fromGroundPointId, movement.toGroundPointId, literal.label, "GIVEN_MOVEMENT");
    else if (textContainsLength(englishExplanationText, label)) add(movement.fromGroundPointId, movement.toGroundPointId, label, "DERIVED_HELPER_MOVEMENT");
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
    if (!value) continue;
    const label = formatLength(value, unit);
    const literal = matchingLiteral(exactToNumber(value), stemMeters);
    if (exactLengthMention(englishStem, label)) add(fromPointId, toPointId, label, `GIVEN_${name.toUpperCase().replaceAll("-", "_")}`);
    else if (literal) add(fromPointId, toPointId, literal.label, `GIVEN_${name.toUpperCase().replaceAll("-", "_")}`);
  }

  // Given ladder/wire/sight-line lengths are not axis-aligned, so match their canonical
  // Euclidean length against explicit metre literals in the stem.
  for (const segment of diagram.segments ?? []) {
    if (!["LADDER", "WIRE", "SIGHT_LINE"].includes(String(segment.kind))) continue;
    const key = endpointKey(segment.fromPointId, segment.toPointId);
    if (key === reqKey || seen.has(key)) continue;
    const actual = numericDistance(statePoints, segment.fromPointId, segment.toPointId);
    if (!Number.isFinite(actual)) continue;
    const literal = matchingLiteral(actual, stemMeters);
    if (literal) add(segment.fromPointId, segment.toPointId, literal.label, `GIVEN_${segment.kind}`);
  }

  // Relational shadow questions give a difference rather than either absolute length.
  // Preserve that semantics visually without leaking the requested height.
  const shadowMinusHeight = measurements["shadow-minus-height"] as ExactTrigNumber | undefined;
  if (shadowMinusHeight && requested.kind === "OBJECT_HEIGHT") {
    const object = (state.verticalObjects ?? []).find((item: AnyRecord) => item.id === requested.objectId);
    const shadowTip = (state.points ?? []).find((point: AnyRecord) => point.role === "SHADOW_TIP" && diagramPointIds.has(point.id));
    if (object && shadowTip) {
      add(object.basePointId, shadowTip.id, `h + ${formatExactPlain(exactAbs(shadowMinusHeight))} ${unit}`, "RELATIONAL_SHADOW");
    }
  }

  const all = [...existing, ...auto];
  if (all.length < 2) throw new Error(`${qlId}: solution diagram must expose at least two meaningful dimensions; got ${all.length}.`);

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
      answerHiddenOnRequestedDimension: true,
    },
  };
}
