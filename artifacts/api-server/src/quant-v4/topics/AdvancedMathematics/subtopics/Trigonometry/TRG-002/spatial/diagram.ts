import { exactToNumber } from "../../foundation/exact";
import { toDegrees } from "../../foundation/angle";
import type {
  Trg002DiagramAngleMarker,
  Trg002DiagramPoint,
  Trg002DiagramRightAngleMarker,
  Trg002DiagramSegment,
  Trg002DiagramSpec,
  Trg002SpatialState,
} from "./types";

const WIDTH = 1000 as const;
const HEIGHT = 600 as const;
const PADDING = 60 as const;

function angleText(angle: any) {
  const value = toDegrees(angle);
  return `${value.denominator === 1n ? value.numerator : `${value.numerator}/${value.denominator}`}°`;
}

function coordinateKey(x: number, y: number) {
  return `${x.toFixed(8)}|${y.toFixed(8)}`;
}

export function buildTrg002DiagramSpec(state: Trg002SpatialState): Trg002DiagramSpec {
  const raw = state.points.map((point) => ({
    id: point.id,
    x: exactToNumber(point.x),
    y: exactToNumber(point.y),
    role: point.role,
    label: point.label,
  }));

  for (const observation of state.observations) {
    const eye = raw.find((point) => point.id === observation.eyePointId);
    const target = raw.find((point) => point.id === observation.targetPointId);
    if (!eye || !target) throw new Error(`Diagram cannot resolve observation ${observation.id}.`);
    raw.push({ id: `eye-level-${observation.id}`, x: target.x, y: eye.y, role: "AUXILIARY", label: undefined });
  }

  const xs = raw.map((point) => point.x);
  const ys = raw.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys, exactToNumber(state.groundY));
  const maxY = Math.max(...ys, exactToNumber(state.groundY));
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scaleX = (WIDTH - 2 * PADDING) / spanX;
  const scaleY = (HEIGHT - 2 * PADDING) / spanY;
  const scale = Math.min(scaleX, scaleY);
  const usedWidth = spanX * scale;
  const usedHeight = spanY * scale;
  const offsetX = (WIDTH - usedWidth) / 2;
  const offsetY = (HEIGHT - usedHeight) / 2;

  const points: Trg002DiagramPoint[] = raw.map((point) => ({
    id: point.id,
    x: offsetX + (point.x - minX) * scale,
    y: HEIGHT - (offsetY + (point.y - minY) * scale),
    role: point.role,
    ...(point.label ? { label: point.label } : {}),
  }));

  const segments: Trg002DiagramSegment[] = [];
  const canonicalGroundPoints = state.points
    .filter((point) => ["GROUND", "OBJECT_BASE", "OBSERVER_GROUND", "SHADOW_TIP", "ANCHOR", "TOUCH_POINT"].includes(point.role))
    .sort((a, b) => exactToNumber(a.x) - exactToNumber(b.x));
  if (canonicalGroundPoints.length >= 2) {
    segments.push({ id: "ground-line", fromPointId: canonicalGroundPoints[0].id, toPointId: canonicalGroundPoints[canonicalGroundPoints.length - 1].id, kind: "GROUND" });
  }

  for (const object of state.verticalObjects) {
    segments.push({ id: `object-${object.id}`, fromPointId: object.basePointId, toPointId: object.topPointId, kind: "VERTICAL_OBJECT" });
  }

  for (const observation of state.observations) {
    segments.push({ id: `sight-${observation.id}`, fromPointId: observation.eyePointId, toPointId: observation.targetPointId, kind: "SIGHT_LINE" });
    segments.push({ id: `eye-level-segment-${observation.id}`, fromPointId: observation.eyePointId, toPointId: `eye-level-${observation.id}`, kind: "EYE_LEVEL" });
  }

  if (state.diagramStrategy === "LADDER") {
    const base = state.points.find((point) => point.id === "ladder-base");
    const contact = state.points.find((point) => point.id === "wall-contact");
    if (base && contact) segments.push({ id: "ladder-segment", fromPointId: base.id, toPointId: contact.id, kind: "LADDER" });
  }
  if (state.diagramStrategy === "SHADOW") {
    const base = state.points.find((point) => point.role === "OBJECT_BASE");
    const tips = state.points.filter((point) => point.role === "SHADOW_TIP");
    if (base) {
      for (const tip of tips) {
        segments.push({ id: `shadow-segment-${tip.id}`, fromPointId: base.id, toPointId: tip.id, kind: "SHADOW" });
      }
    }
  }
  if (state.diagramStrategy === "GUY_WIRE") {
    const top = state.points.find((point) => point.role === "OBJECT_TOP");
    const anchor = state.points.find((point) => point.role === "ANCHOR");
    if (top && anchor) segments.push({ id: "wire-segment", fromPointId: top.id, toPointId: anchor.id, kind: "WIRE" });
  }

  for (const movement of state.movements) {
    segments.push({ id: `movement-${movement.id}`, fromPointId: movement.fromGroundPointId, toPointId: movement.toGroundPointId, kind: "MOVEMENT" });
  }

  const angles: Trg002DiagramAngleMarker[] = state.observations.map((observation) => {
    const eye = state.points.find((point) => point.id === observation.eyePointId);
    const target = state.points.find((point) => point.id === observation.targetPointId);
    if (!eye || !target) throw new Error(`Diagram cannot resolve angle ${observation.id}.`);
    return {
      id: `angle-${observation.id}`,
      vertexPointId: observation.eyePointId,
      rayPointId: observation.targetPointId,
      referenceDirection: exactToNumber(target.x) >= exactToNumber(eye.x) ? "RIGHT" : "LEFT",
      classification: observation.classification,
      label: angleText(observation.angle),
    };
  });

  const groundY = exactToNumber(state.groundY);
  const groundXs = canonicalGroundPoints.map((point) => exactToNumber(point.x));
  const rightAngles: Trg002DiagramRightAngleMarker[] = [];
  for (const object of state.verticalObjects) {
    const base = state.points.find((point) => point.id === object.basePointId);
    const top = state.points.find((point) => point.id === object.topPointId);
    if (!base || !top) continue;
    const baseX = exactToNumber(base.x);
    if (Math.abs(exactToNumber(base.y) - groundY) > 1e-9 || exactToNumber(top.y) <= groundY) continue;
    const leftSpan = groundXs.length ? baseX - Math.min(...groundXs) : 0;
    const rightSpan = groundXs.length ? Math.max(...groundXs) - baseX : 0;
    rightAngles.push({
      id: `right-angle-${object.id}`,
      vertexPointId: object.basePointId,
      verticalRayPointId: object.topPointId,
      horizontalDirection: rightSpan >= leftSpan ? "RIGHT" : "LEFT",
    });
  }

  const labels: Array<{ id: string; pointId: string; text: string }> = [];
  const occupied = new Set<string>();
  for (const point of points.filter((item) => item.label)) {
    const key = coordinateKey(point.x, point.y);
    if (occupied.has(key)) continue;
    occupied.add(key);
    labels.push({ id: `label-${point.id}`, pointId: point.id, text: point.label! });
  }

  return { strategy: state.diagramStrategy, width: WIDTH, height: HEIGHT, padding: PADDING, points, segments, angles, rightAngles, labels };
}

export function validateTrg002DiagramSpec(spec: Trg002DiagramSpec) {
  const pointIds = new Set(spec.points.map((point) => point.id));
  const checks = [
    { name: "UNIQUE_POINTS", passed: pointIds.size === spec.points.length, message: "Diagram point IDs are unique." },
    { name: "POINTS_IN_VIEWPORT", passed: spec.points.every((point) => point.x >= spec.padding - 1e-6 && point.x <= spec.width - spec.padding + 1e-6 && point.y >= spec.padding - 1e-6 && point.y <= spec.height - spec.padding + 1e-6), message: "All diagram points lie inside the padded viewport." },
    { name: "SEGMENT_ENDPOINTS", passed: spec.segments.every((segment) => pointIds.has(segment.fromPointId) && pointIds.has(segment.toPointId)), message: "Every diagram segment resolves both endpoints." },
    { name: "ANGLE_ENDPOINTS", passed: spec.angles.every((angle) => pointIds.has(angle.vertexPointId) && pointIds.has(angle.rayPointId)), message: "Every angle marker resolves its vertex and sight-line target." },
    { name: "RIGHT_ANGLE_ENDPOINTS", passed: spec.rightAngles.every((marker) => pointIds.has(marker.vertexPointId) && pointIds.has(marker.verticalRayPointId)), message: "Every right-angle marker resolves its ground vertex and vertical ray." },
    { name: "LABEL_ANCHORS", passed: spec.labels.every((label) => pointIds.has(label.pointId) && label.text.trim().length > 0), message: "Every label has a valid anchor and non-empty text." },
    { name: "UNIQUE_LABEL_IDS", passed: new Set(spec.labels.map((label) => label.id)).size === spec.labels.length, message: "Diagram label IDs are unique." },
    { name: "SIGHT_LINE_PER_OBSERVATION", passed: spec.angles.every((angle) => spec.segments.some((segment) => segment.id === angle.id.replace("angle-", "sight-") && segment.kind === "SIGHT_LINE")), message: "Every angle marker has a matching sight line." },
    { name: "EYE_LEVEL_REFERENCE", passed: spec.angles.every((angle) => spec.segments.some((segment) => segment.id === angle.id.replace("angle-", "eye-level-segment-") && segment.kind === "EYE_LEVEL")), message: "Every sight-line angle has an explicit eye-level horizontal reference." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
