import type {
  Trg002DiagramAngleMarker,
  Trg002DiagramPoint,
  Trg002DiagramSpec,
} from "./spatial";

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

function normalizeRadians(value: number) {
  let result = value;
  while (result <= -Math.PI) result += Math.PI * 2;
  while (result > Math.PI) result -= Math.PI * 2;
  return result;
}

function angleArc(
  marker: Trg002DiagramAngleMarker,
  points: Map<string, Trg002DiagramPoint>,
) {
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
  const textX = vertex.x + textRadius * Math.cos(midAngle);
  const textY = vertex.y + textRadius * Math.sin(midAngle);
  return {
    path: `M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${radius} ${radius} 0 0 ${sweepFlag} ${endX.toFixed(2)} ${endY.toFixed(2)}`,
    textX,
    textY,
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

export interface Trg002SvgReviewOptions {
  title?: string;
  showPointDots?: boolean;
  showStrategyCaption?: boolean;
}

/**
 * Review-only SVG renderer.
 *
 * This function never derives geometry. It consumes the already projected and
 * validated Trg002DiagramSpec so the visual review surface cannot become a
 * competing mathematical authority.
 */
export function renderTrg002DiagramReviewSvg(
  spec: Trg002DiagramSpec,
  options: Trg002SvgReviewOptions = {},
) {
  const points = pointMap(spec);
  const title = options.title ?? `TRG-002 ${spec.strategy}`;
  const pointDots = options.showPointDots ?? true;
  const showStrategyCaption = options.showStrategyCaption ?? true;

  const segments = spec.segments.map((segment) => {
    const from = pointOrThrow(points, segment.fromPointId);
    const to = pointOrThrow(points, segment.toPointId);
    return `<line class="segment segment-${segment.kind.toLowerCase().replace(/_/g, "-")}" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${to.x.toFixed(2)}" y2="${to.y.toFixed(2)}" data-segment-id="${escapeXml(segment.id)}" />`;
  }).join("\n");

  const angles = spec.angles.map((marker) => {
    const arc = angleArc(marker, points);
    return [
      `<path class="angle-arc angle-${marker.classification.toLowerCase()}" d="${arc.path}" data-angle-id="${escapeXml(marker.id)}" />`,
      `<text class="angle-label" x="${arc.textX.toFixed(2)}" y="${arc.textY.toFixed(2)}" text-anchor="middle" dominant-baseline="middle">${escapeXml(marker.label)}</text>`,
    ].join("\n");
  }).join("\n");

  const dots = pointDots
    ? spec.points
        .filter((point) => point.role !== "AUXILIARY")
        .map((point) => `<circle class="point point-${point.role.toLowerCase().replace(/_/g, "-")}" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4" data-point-id="${escapeXml(point.id)}" />`)
        .join("\n")
    : "";

  const labels = spec.labels.map((label) => {
    const anchor = pointOrThrow(points, label.pointId);
    const offset = labelOffset(anchor);
    return `<text class="point-label" x="${(anchor.x + offset.dx).toFixed(2)}" y="${(anchor.y + offset.dy).toFixed(2)}" data-label-id="${escapeXml(label.id)}">${escapeXml(label.text)}</text>`;
  }).join("\n");

  const strategyCaption = showStrategyCaption
    ? `<text class="strategy-caption" x="${spec.width - spec.padding}" y="${spec.padding - 18}" text-anchor="end">${escapeXml(spec.strategy)}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-labelledby="diagram-title diagram-desc" data-diagram-strategy="${escapeXml(spec.strategy)}">
  <title id="diagram-title">${escapeXml(title)}</title>
  <desc id="diagram-desc">Review rendering of the canonical TRG-002 solution diagram using strategy ${escapeXml(spec.strategy)}.</desc>
  <style>
    .diagram-bg { fill: #ffffff; }
    .segment { stroke: #1f2937; stroke-width: 4; fill: none; vector-effect: non-scaling-stroke; stroke-linecap: round; }
    .segment-ground { stroke-width: 5; }
    .segment-vertical-object { stroke-width: 7; }
    .segment-sight-line { stroke-width: 4; }
    .segment-eye-level { stroke-width: 3; stroke-dasharray: 12 10; opacity: 0.72; }
    .segment-auxiliary { stroke-width: 3; stroke-dasharray: 8 9; opacity: 0.78; }
    .segment-ladder, .segment-wire { stroke-width: 6; }
    .segment-shadow { stroke-width: 7; }
    .angle-arc { stroke: #4b5563; stroke-width: 3; fill: none; vector-effect: non-scaling-stroke; }
    .angle-label { font: 600 24px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 7px; stroke-linejoin: round; }
    .point { fill: #111827; stroke: #ffffff; stroke-width: 2; vector-effect: non-scaling-stroke; }
    .point-label { font: 600 23px system-ui, sans-serif; fill: #111827; paint-order: stroke; stroke: #ffffff; stroke-width: 7px; stroke-linejoin: round; }
    .strategy-caption { font: 600 17px system-ui, sans-serif; fill: #6b7280; letter-spacing: 0.04em; }
  </style>
  <rect class="diagram-bg" x="0" y="0" width="${spec.width}" height="${spec.height}" />
  ${segments}
  ${angles}
  ${dots}
  ${labels}
  ${strategyCaption}
</svg>`;
}
