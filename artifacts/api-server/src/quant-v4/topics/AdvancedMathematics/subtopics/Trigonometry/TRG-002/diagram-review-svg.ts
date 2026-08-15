import type {
  Trg002DiagramAngleMarker,
  Trg002DiagramMeasurementArrow,
  Trg002DiagramPoint,
  Trg002DiagramSpec,
} from "./spatial";
import type { Trg002ResolvedSolutionAnnotation } from "./solution-diagram-annotations";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function pointMap(spec: Trg002DiagramSpec) {
  return new Map(spec.points.map((point) => [point.id, point]));
}

function pointOrThrow(points: Map<string, Trg002DiagramPoint>, id: string) {
  const point = points.get(id);
  if (!point) throw new Error(`TRG-002 SVG review renderer cannot resolve point ${id}.`);
  return point;
}

function endpointKey(fromPointId: string, toPointId: string) {
  return [fromPointId, toPointId].sort().join("|");
}

function normalizeRadians(value: number) {
  let result = value;
  while (result <= -Math.PI) result += Math.PI * 2;
  while (result > Math.PI) result -= Math.PI * 2;
  return result;
}

function angleArc(marker: Trg002DiagramAngleMarker, points: Map<string, Trg002DiagramPoint>) {
  const vertex = pointOrThrow(points, marker.vertexPointId);
  const ray = pointOrThrow(points, marker.rayPointId);
  const radius = 38;
  const referenceAngle = marker.referenceDirection === "RIGHT" ? 0 : Math.PI;
  const rayAngle = Math.atan2(ray.y - vertex.y, ray.x - vertex.x);
  const delta = normalizeRadians(rayAngle - referenceAngle);
  const startX = vertex.x + radius * Math.cos(referenceAngle);
  const startY = vertex.y + radius * Math.sin(referenceAngle);
  const endX = vertex.x + radius * Math.cos(rayAngle);
  const endY = vertex.y + radius * Math.sin(rayAngle);
  const sweepFlag = delta >= 0 ? 1 : 0;
  const midAngle = referenceAngle + delta / 2;
  const textRadius = radius + 22;
  return {
    path: `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius} ${radius} 0 0 ${sweepFlag} ${endX.toFixed(2)} ${endY.toFixed(2)}`,
    textX: vertex.x + textRadius * Math.cos(midAngle),
    textY: vertex.y + textRadius * Math.sin(midAngle),
  };
}

function labelOffset(point: Trg002DiagramPoint) {
  switch (point.role) {
    case "OBJECT_BASE":
    case "OBSERVER_GROUND":
    case "SHADOW_TIP":
    case "ANCHOR":
    case "GROUND":
      return { dx: 8, dy: 20 };
    case "OBJECT_TOP":
    case "OBSERVER_EYE":
    case "LADDER_CONTACT":
      return { dx: 8, dy: -10 };
    default:
      return { dx: 8, dy: -8 };
  }
}

export function trg002ReviewPointLabelPosition(spec: Trg002DiagramSpec, pointId: string) {
  const point = pointOrThrow(pointMap(spec), pointId);
  const offset = labelOffset(point);
  return { x: point.x + offset.dx, y: point.y + offset.dy };
}

function annotationBasePosition(annotation: Trg002ResolvedSolutionAnnotation, points: Map<string, Trg002DiagramPoint>) {
  const from = pointOrThrow(points, annotation.fromPointId);
  const to = pointOrThrow(points, annotation.toPointId);
  const x = (from.x + to.x) / 2;
  const y = (from.y + to.y) / 2;
  switch (annotation.placement) {
    case "ABOVE": return { x, y: y - 34 };
    case "BELOW": return { x, y: y + 36 };
    case "LEFT": return { x: x - 48, y };
    case "RIGHT": return { x: x + 48, y };
  }
}

export function trg002ReviewAnnotationPosition(spec: Trg002DiagramSpec, annotation: Trg002ResolvedSolutionAnnotation) {
  const position = annotationBasePosition(annotation, pointMap(spec));
  if (spec.strategy === "OPPOSITE_SIDE_OBSERVATIONS" && annotation.id === "given-observer-separation") {
    return { x: position.x + 96, y: position.y };
  }
  if (spec.strategy === "ELEVATION_AND_DEPRESSION" && annotation.id === "target-tower-height") {
    return { x: position.x + 96, y: position.y };
  }
  return position;
}

function measurementArrowSvg(arrow: Trg002DiagramMeasurementArrow, points: Map<string, Trg002DiagramPoint>) {
  const from = pointOrThrow(points, arrow.fromPointId);
  const to = pointOrThrow(points, arrow.toPointId);
  const direction = arrow.side === "LEFT" ? -1 : 1;
  const offset = 34 + arrow.lane * 58;
  const arrowX = from.x + direction * offset;
  const witnessEndX = arrowX - direction * 7;
  const labelX = arrowX + direction * 46;
  const midY = (from.y + to.y) / 2;
  const kindClass = arrow.kind.toLowerCase().replace(/_/g, "-");
  return [
    `<line class="dimension-witness" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${witnessEndX.toFixed(2)}" y2="${from.y.toFixed(2)}" />`,
    `<line class="dimension-witness" x1="${to.x.toFixed(2)}" y1="${to.y.toFixed(2)}" x2="${witnessEndX.toFixed(2)}" y2="${to.y.toFixed(2)}" />`,
    `<line class="dimension-arrow dimension-${kindClass}" x1="${arrowX.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${arrowX.toFixed(2)}" y2="${to.y.toFixed(2)}" marker-start="url(#dimension-arrow)" marker-end="url(#dimension-arrow)" data-measurement-arrow-id="${escapeXml(arrow.id)}" />`,
    `<text class="dimension-label dimension-label-${kindClass}" x="${labelX.toFixed(2)}" y="${midY.toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${escapeXml(arrow.label)}</text>`,
  ].join("\n");
}

export interface Trg002SvgReviewOptions {
  title?: string;
  showPointDots?: boolean;
  showStrategyCaption?: boolean;
  annotations?: readonly Trg002ResolvedSolutionAnnotation[];
}

export function renderTrg002DiagramReviewSvg(spec: Trg002DiagramSpec, options: Trg002SvgReviewOptions = {}) {
  const points = pointMap(spec);
  const title = options.title ?? `TRG-002 ${spec.strategy}`;
  const pointDots = options.showPointDots ?? true;
  const showStrategyCaption = options.showStrategyCaption ?? true;
  const annotations = options.annotations ?? [];

  const segments = spec.segments.map((segment) => {
    const from = pointOrThrow(points, segment.fromPointId);
    const to = pointOrThrow(points, segment.toPointId);
    const movementArrow = segment.kind === "MOVEMENT" ? ` marker-end="url(#movement-arrow)"` : "";
    return `<line class="segment segment-${segment.kind.toLowerCase().replace(/_/g, "-")}" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${to.x.toFixed(2)}" y2="${to.y.toFixed(2)}" data-segment-id="${escapeXml(segment.id)}"${movementArrow} />`;
  }).join("\n");

  const angles = spec.angles.map((marker) => {
    const arc = angleArc(marker, points);
    return [
      `<path class="angle-arc angle-${marker.classification.toLowerCase()}" d="${arc.path}" data-angle-id="${escapeXml(marker.id)}" />`,
      `<text class="angle-label" x="${arc.textX.toFixed(2)}" y="${arc.textY.toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${escapeXml(marker.label)}</text>`,
    ].join("\n");
  }).join("\n");

  const dots = pointDots
    ? spec.points.filter((point) => point.role !== "AUXILIARY").map((point) => `<circle class="point point-${point.role.toLowerCase().replace(/_/g, "-")}" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4" data-point-id="${escapeXml(point.id)}" />`).join("\n")
    : "";

  const labels = spec.labels.map((label) => {
    const position = trg002ReviewPointLabelPosition(spec, label.pointId);
    return `<text class="point-label" x="${position.x.toFixed(2)}" y="${position.y.toFixed(2)}" data-label-id="${escapeXml(label.id)}">${escapeXml(label.text)}</text>`;
  }).join("\n");

  const dimensionArrows = spec.measurementArrows.map((arrow) => measurementArrowSvg(arrow, points)).join("\n");
  const dimensionEndpointKeys = new Set(
    spec.measurementArrows.map((arrow) => endpointKey(arrow.fromPointId, arrow.toPointId)),
  );
  const measurementLabels = annotations
    .filter((annotation) => !dimensionEndpointKeys.has(endpointKey(annotation.fromPointId, annotation.toPointId)))
    .map((annotation) => {
      const position = trg002ReviewAnnotationPosition(spec, annotation);
      const roleClass = annotation.role.toLowerCase().replace(/_/g, "-");
      return `<text class="measurement-label measurement-${roleClass}" x="${position.x.toFixed(2)}" y="${position.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" data-annotation-id="${escapeXml(annotation.id)}" data-annotation-role="${escapeXml(annotation.role)}">${escapeXml(annotation.label)}</text>`;
    }).join("\n");

  const strategyCaption = showStrategyCaption
    ? `<text class="strategy-caption" x="${spec.width - spec.padding}" y="${spec.padding - 18}" text-anchor="end">${escapeXml(spec.strategy)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-labelledby="diagram-title diagram-desc" data-diagram-strategy="${escapeXml(spec.strategy)}">
  <title id="diagram-title">${escapeXml(title)}</title>
  <desc id="diagram-desc">Review rendering of the canonical TRG-002 solution diagram using strategy ${escapeXml(spec.strategy)}.</desc>
  <defs>
    <marker id="movement-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
    <marker id="dimension-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 5 L 10 0 L 10 10 z" />
    </marker>
  </defs>
  <style>
    .diagram-bg { fill: #ffffff; }
    .segment { stroke: #1f2937; stroke-width: 4; fill: none; vector-effect: non-scaling-stroke; stroke-linecap: round; }
    .segment-ground { stroke-width: 5; }
    .segment-vertical-object { stroke-width: 7; }
    .segment-sight-line { stroke-width: 4; }
    .segment-eye-level { stroke-width: 3; stroke-dasharray: 12 10; opacity: 0.72; }
    .segment-auxiliary { stroke-width: 3; stroke-dasharray: 8 9; opacity: 0.78; }
    .segment-movement { stroke-width: 4; stroke-dasharray: 10 8; }
    .segment-ladder, .segment-wire { stroke-width: 6; }
    .segment-shadow { stroke-width: 7; }
    #movement-arrow path, #dimension-arrow path { fill: #1f2937; }
    .dimension-witness { stroke: #4b5563; stroke-width: 2; opacity: 0.72; vector-effect: non-scaling-stroke; }
    .dimension-arrow { stroke: #1f2937; stroke-width: 2.5; fill: none; vector-effect: non-scaling-stroke; }
    .dimension-label { font: 700 20px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 7px; stroke-linejoin: round; }
    .dimension-label-height-difference { font-weight: 800; }
    .angle-arc { stroke: #4b5563; stroke-width: 3; fill: none; vector-effect: non-scaling-stroke; }
    .angle-label { font: 600 24px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 7px; stroke-linejoin: round; }
    .point { fill: #111827; stroke: #ffffff; stroke-width: 2; vector-effect: non-scaling-stroke; }
    .point-label { font: 600 23px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 7px; stroke-linejoin: round; }
    .measurement-label { font: 650 22px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 8px; stroke-linejoin: round; }
    .measurement-target-solved { font-weight: 800; }
    .measurement-eye-height { font-size: 19px; }
    .strategy-caption { font: 600 17px system-ui, sans-serif; fill: #6b7280; letter-spacing: 0.04em; }
  </style>
  <rect class="diagram-bg" x="0" y="0" width="${spec.width}" height="${spec.height}" />
  ${segments}
  ${angles}
  ${dots}
  ${labels}
  ${dimensionArrows}
  ${measurementLabels}
  ${strategyCaption}
</svg>`;
}
