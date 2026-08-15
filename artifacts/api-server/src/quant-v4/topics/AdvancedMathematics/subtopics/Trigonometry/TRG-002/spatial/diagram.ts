import { exactToNumber, formatExactPlain, subtractExact } from "../../foundation/exact";
import { toDegrees } from "../../foundation/angle";
import type {
  Trg002DiagramAngleMarker,
  Trg002DiagramMeasurementArrow,
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

function angleDegrees(angle: any) {
  const value = toDegrees(angle);
  return Number(value.numerator) / Number(value.denominator);
}

function coordinateKey(x: number, y: number) {
  return `${x.toFixed(8)}|${y.toFixed(8)}`;
}

function lengthLabel(state: Trg002SpatialState, value: any) {
  return `${formatExactPlain(value)} ${state.metadata.units}`;
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
    if (observation.classification === "DEPRESSION" && Math.abs(eye.y - target.y) > 1e-9) {
      raw.push({ id: `target-level-${observation.id}`, x: eye.x, y: target.y, role: "AUXILIARY", label: undefined });
    }
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
    if (observation.classification === "DEPRESSION") {
      segments.push({
        id: `depression-drop-${observation.id}`,
        fromPointId: `eye-level-${observation.id}`,
        toPointId: observation.targetPointId,
        kind: "AUXILIARY",
      });
      const targetLevelId = `target-level-${observation.id}`;
      if (points.some((point) => point.id === targetLevelId)) {
        segments.push({
          id: `depression-height-transfer-${observation.id}`,
          fromPointId: targetLevelId,
          toPointId: observation.targetPointId,
          kind: "AUXILIARY",
        });
      }
    }
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

  const measurementArrows: Trg002DiagramMeasurementArrow[] = [];
  for (const observation of state.observations) {
    if (observation.classification !== "DEPRESSION") continue;
    const eye = state.points.find((point) => point.id === observation.eyePointId);
    const target = state.points.find((point) => point.id === observation.targetPointId);
    const observerObject = state.verticalObjects.find((object) => object.topPointId === observation.eyePointId);
    const targetObject = state.verticalObjects.find((object) => object.topPointId === observation.targetPointId);
    const targetLevelId = `target-level-${observation.id}`;
    const targetLevel = points.find((point) => point.id === targetLevelId);
    if (!eye || !target || !observerObject || !targetObject || !targetLevel) continue;

    const observerBase = state.points.find((point) => point.id === observerObject.basePointId);
    const targetBase = state.points.find((point) => point.id === targetObject.basePointId);
    if (!observerBase || !targetBase) continue;
    const eyeY = exactToNumber(eye.y);
    const targetY = exactToNumber(target.y);
    const observerBaseY = exactToNumber(observerBase.y);
    const targetBaseY = exactToNumber(targetBase.y);
    if (eyeY <= targetY + 1e-9 || Math.abs(observerBaseY - targetBaseY) > 1e-9) continue;

    const targetOnRight = exactToNumber(target.x) >= exactToNumber(eye.x);
    const observerSide = targetOnRight ? "RIGHT" as const : "LEFT" as const;
    const targetSide = targetOnRight ? "LEFT" as const : "RIGHT" as const;
    const drop = subtractExact(eye.y, target.y);

    measurementArrows.push(
      {
        id: `height-arrow-target-total-${observation.id}`,
        fromPointId: targetObject.basePointId,
        toPointId: targetObject.topPointId,
        label: lengthLabel(state, targetObject.height),
        side: targetSide,
        lane: 0,
        kind: "TOTAL_HEIGHT",
      },
      {
        id: `height-arrow-observer-lower-${observation.id}`,
        fromPointId: observerObject.basePointId,
        toPointId: targetLevelId,
        label: lengthLabel(state, targetObject.height),
        side: observerSide,
        lane: 0,
        kind: "HEIGHT_PART",
      },
      {
        id: `height-arrow-observer-drop-${observation.id}`,
        fromPointId: targetLevelId,
        toPointId: observerObject.topPointId,
        label: lengthLabel(state, drop),
        side: observerSide,
        lane: 0,
        kind: "HEIGHT_DIFFERENCE",
      },
      {
        id: `height-arrow-observer-total-${observation.id}`,
        fromPointId: observerObject.basePointId,
        toPointId: observerObject.topPointId,
        label: lengthLabel(state, observerObject.height),
        side: observerSide,
        lane: 1,
        kind: "TOTAL_HEIGHT",
      },
    );
  }

  const angleMagnitudeById = new Map<string, number>();
  const angles: Trg002DiagramAngleMarker[] = state.observations.map((observation) => {
    const eye = state.points.find((point) => point.id === observation.eyePointId);
    const target = state.points.find((point) => point.id === observation.targetPointId);
    if (!eye || !target) throw new Error(`Diagram cannot resolve angle ${observation.id}.`);
    const id = `angle-${observation.id}`;
    angleMagnitudeById.set(id, angleDegrees(observation.angle));
    return {
      id,
      vertexPointId: observation.eyePointId,
      rayPointId: observation.targetPointId,
      referenceDirection: exactToNumber(target.x) >= exactToNumber(eye.x) ? "RIGHT" : "LEFT",
      classification: observation.classification,
      label: angleText(observation.angle),
      arcLane: 0,
    };
  });

  const angleGroups = new Map<string, Trg002DiagramAngleMarker[]>();
  for (const angle of angles) {
    const group = angleGroups.get(angle.vertexPointId) ?? [];
    group.push(angle);
    angleGroups.set(angle.vertexPointId, group);
  }
  for (const group of angleGroups.values()) {
    const distinctMagnitudes = [...new Set(group.map((angle) => angleMagnitudeById.get(angle.id) ?? 0))].sort((a, b) => a - b);
    for (const angle of group) {
      const magnitude = angleMagnitudeById.get(angle.id) ?? 0;
      angle.arcLane = Math.max(0, distinctMagnitudes.indexOf(magnitude));
    }
  }

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

  return { strategy: state.diagramStrategy, width: WIDTH, height: HEIGHT, padding: PADDING, points, segments, angles, rightAngles, measurementArrows, labels };
}

export function validateTrg002DiagramSpec(spec: Trg002DiagramSpec) {
  const pointIds = new Set(spec.points.map((point) => point.id));
  const pointsById = new Map(spec.points.map((point) => [point.id, point]));
  const sharedVertexDistinctAnglesSeparated = spec.angles.every((angle) => spec.angles.every((other) => {
    if (angle.id === other.id || angle.vertexPointId !== other.vertexPointId || angle.label === other.label) return true;
    return angle.arcLane !== other.arcLane;
  }));
  const measurementEndpointsResolve = spec.measurementArrows.every((arrow) => pointIds.has(arrow.fromPointId) && pointIds.has(arrow.toPointId));
  const measurementArrowsVertical = spec.measurementArrows.every((arrow) => {
    const from = pointsById.get(arrow.fromPointId);
    const to = pointsById.get(arrow.toPointId);
    return Boolean(from && to && Math.abs(from.x - to.x) <= 1e-6 && Math.abs(from.y - to.y) > 1e-6);
  });
  const checks = [
    { name: "UNIQUE_POINTS", passed: pointIds.size === spec.points.length, message: "Diagram point IDs are unique." },
    { name: "POINTS_IN_VIEWPORT", passed: spec.points.every((point) => point.x >= spec.padding - 1e-6 && point.x <= spec.width - spec.padding + 1e-6 && point.y >= spec.padding - 1e-6 && point.y <= spec.height - spec.padding + 1e-6), message: "All diagram points lie inside the padded viewport." },
    { name: "SEGMENT_ENDPOINTS", passed: spec.segments.every((segment) => pointIds.has(segment.fromPointId) && pointIds.has(segment.toPointId)), message: "Every diagram segment resolves both endpoints." },
    { name: "ANGLE_ENDPOINTS", passed: spec.angles.every((angle) => pointIds.has(angle.vertexPointId) && pointIds.has(angle.rayPointId)), message: "Every angle marker resolves its vertex and sight-line target." },
    { name: "ANGLE_ARC_LANES", passed: spec.angles.every((angle) => Number.isInteger(angle.arcLane) && angle.arcLane >= 0) && sharedVertexDistinctAnglesSeparated, message: "Angle arcs use valid lanes and distinct shared-vertex angles do not overlap." },
    { name: "RIGHT_ANGLE_ENDPOINTS", passed: spec.rightAngles.every((marker) => pointIds.has(marker.vertexPointId) && pointIds.has(marker.verticalRayPointId)), message: "Every right-angle marker resolves its ground vertex and vertical ray." },
    { name: "MEASUREMENT_ARROW_ENDPOINTS", passed: measurementEndpointsResolve, message: "Every vertical measurement arrow resolves both endpoints." },
    { name: "MEASUREMENT_ARROWS_VERTICAL", passed: measurementArrowsVertical, message: "Height measurement arrows remain vertical and have non-zero length." },
    { name: "MEASUREMENT_ARROW_LABELS", passed: spec.measurementArrows.every((arrow) => arrow.label.trim().length > 0), message: "Every height measurement arrow has a non-empty exact label." },
    { name: "MEASUREMENT_ARROW_LANES", passed: spec.measurementArrows.every((arrow) => Number.isInteger(arrow.lane) && arrow.lane >= 0), message: "Height measurement arrows use non-negative integer lanes." },
    { name: "UNIQUE_MEASUREMENT_ARROW_IDS", passed: new Set(spec.measurementArrows.map((arrow) => arrow.id)).size === spec.measurementArrows.length, message: "Height measurement arrow IDs are unique." },
    { name: "LABEL_ANCHORS", passed: spec.labels.every((label) => pointIds.has(label.pointId) && label.text.trim().length > 0), message: "Every label has a valid anchor and non-empty text." },
    { name: "UNIQUE_LABEL_IDS", passed: new Set(spec.labels.map((label) => label.id)).size === spec.labels.length, message: "Diagram label IDs are unique." },
    { name: "SIGHT_LINE_PER_OBSERVATION", passed: spec.angles.every((angle) => spec.segments.some((segment) => segment.id === angle.id.replace("angle-", "sight-") && segment.kind === "SIGHT_LINE")), message: "Every angle marker has a matching sight line." },
    { name: "EYE_LEVEL_REFERENCE", passed: spec.angles.every((angle) => spec.segments.some((segment) => segment.id === angle.id.replace("angle-", "eye-level-segment-") && segment.kind === "EYE_LEVEL")), message: "Every sight-line angle has an explicit eye-level horizontal reference." },
  ];
  return { valid: checks.every((check) => check.passed), checks };
}
