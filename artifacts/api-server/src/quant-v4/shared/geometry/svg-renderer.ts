import type {
  DiagramLabelPosition,
  DiagramSegment,
  GeoDiagramModel,
} from "./diagram-model";

interface LayoutPoint {
  readonly x: number;
  readonly y: number;
}

interface Rect {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
}

interface TextPlacement {
  readonly x: number;
  readonly y: number;
  readonly box: Rect;
  readonly collisionScore: number;
}

interface VisualSegment {
  readonly from: LayoutPoint;
  readonly to: LayoutPoint;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function pointLookup(model: GeoDiagramModel): Map<string, LayoutPoint> {
  return new Map(model.points.map((point) => [point.id, point]));
}

function requirePoint(points: ReadonlyMap<string, LayoutPoint>, pointId: string, ownerId: string): LayoutPoint {
  const point = points.get(pointId);
  if (!point) throw new Error(`Diagram object ${ownerId} references missing point ${pointId}`);
  return point;
}

function visualSegment(
  points: ReadonlyMap<string, LayoutPoint>,
  segment: DiagramSegment,
): VisualSegment {
  const from = requirePoint(points, segment.fromPointId, segment.id);
  const to = requirePoint(points, segment.toPointId, segment.id);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) throw new Error(`Diagram segment ${segment.id} has zero visual length`);
  const unit = { x: dx / length, y: dy / length };
  const extension = segment.extension ?? 24;
  const extent = segment.extent ?? "SEGMENT";

  if (extent === "RAY") {
    return {
      from,
      to: { x: to.x + unit.x * extension, y: to.y + unit.y * extension },
    };
  }
  if (extent === "LINE") {
    return {
      from: { x: from.x - unit.x * extension, y: from.y - unit.y * extension },
      to: { x: to.x + unit.x * extension, y: to.y + unit.y * extension },
    };
  }
  return { from, to };
}

function segmentMidpoint(
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  segmentId: string,
): Readonly<{ midpoint: LayoutPoint; unit: LayoutPoint; normal: LayoutPoint }> {
  const segment = model.segments.find((candidate) => candidate.id === segmentId);
  if (!segment) throw new Error(`Diagram mark references missing segment ${segmentId}`);
  const from = requirePoint(points, segment.fromPointId, segmentId);
  const to = requirePoint(points, segment.toPointId, segmentId);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) throw new Error(`Diagram segment ${segmentId} has zero visual length`);
  const unit = { x: dx / length, y: dy / length };
  const normal = { x: -unit.y, y: unit.x };
  return {
    midpoint: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
    unit,
    normal,
  };
}

function renderEqualLengthMark(
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  markId: string,
  segmentIds: readonly string[],
): string {
  const ticks = segmentIds.map((segmentId) => {
    const { midpoint, normal } = segmentMidpoint(model, points, segmentId);
    const half = 5;
    return `<line x1="${midpoint.x - normal.x * half}" y1="${midpoint.y - normal.y * half}" x2="${midpoint.x + normal.x * half}" y2="${midpoint.y + normal.y * half}" />`;
  }).join("");
  return `<g data-geo-kind="equal-length-mark" data-geo-id="${escapeXml(markId)}" data-segments="${escapeXml(segmentIds.join(","))}">${ticks}</g>`;
}

function renderParallelMark(
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  markId: string,
  segmentIds: readonly string[],
): string {
  const chevrons = segmentIds.map((segmentId) => {
    const { midpoint, unit, normal } = segmentMidpoint(model, points, segmentId);
    const along = 6;
    const out = 5;
    const left = { x: midpoint.x - unit.x * along + normal.x * out, y: midpoint.y - unit.y * along + normal.y * out };
    const tip = { x: midpoint.x, y: midpoint.y };
    const right = { x: midpoint.x + unit.x * along + normal.x * out, y: midpoint.y + unit.y * along + normal.y * out };
    return `<path d="M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y}" />`;
  }).join("");
  return `<g data-geo-kind="parallel-mark" data-geo-id="${escapeXml(markId)}" data-segments="${escapeXml(segmentIds.join(","))}">${chevrons}</g>`;
}

function renderRightAngleMark(
  points: ReadonlyMap<string, LayoutPoint>,
  mark: GeoDiagramModel["rightAngleMarks"][number],
): string {
  const vertex = requirePoint(points, mark.vertexPointId, mark.id);
  const first = requirePoint(points, mark.firstRayPointId, mark.id);
  const second = requirePoint(points, mark.secondRayPointId, mark.id);
  const firstLength = Math.hypot(first.x - vertex.x, first.y - vertex.y);
  const secondLength = Math.hypot(second.x - vertex.x, second.y - vertex.y);
  if (firstLength === 0 || secondLength === 0) throw new Error(`Right-angle mark ${mark.id} has a zero-length ray`);
  const size = 10;
  const u = { x: (first.x - vertex.x) / firstLength, y: (first.y - vertex.y) / firstLength };
  const v = { x: (second.x - vertex.x) / secondLength, y: (second.y - vertex.y) / secondLength };
  const p1 = { x: vertex.x + u.x * size, y: vertex.y + u.y * size };
  const corner = { x: p1.x + v.x * size, y: p1.y + v.y * size };
  const p2 = { x: vertex.x + v.x * size, y: vertex.y + v.y * size };
  return `<g data-geo-kind="right-angle-mark" data-geo-id="${escapeXml(mark.id)}" data-vertex="${escapeXml(mark.vertexPointId)}"><path d="M ${p1.x} ${p1.y} L ${corner.x} ${corner.y} L ${p2.x} ${p2.y}" /></g>`;
}

function textSize(text: string): Readonly<{ width: number; height: number }> {
  return { width: Math.max(9, text.length * 7.2), height: 13 };
}

function rectAtCenter(x: number, y: number, text: string): Rect {
  const { width, height } = textSize(text);
  return {
    left: x - width / 2,
    right: x + width / 2,
    top: y - height / 2,
    bottom: y + height / 2,
  };
}

function rectsOverlap(a: Rect, b: Rect, padding = 1.5): boolean {
  return !(
    a.right + padding <= b.left
    || b.right + padding <= a.left
    || a.bottom + padding <= b.top
    || b.bottom + padding <= a.top
  );
}

function pointInsideRect(point: LayoutPoint, rect: Rect): boolean {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function orientation(a: LayoutPoint, b: LayoutPoint, c: LayoutPoint): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function onSegment(a: LayoutPoint, b: LayoutPoint, c: LayoutPoint): boolean {
  const epsilon = 1e-9;
  return c.x >= Math.min(a.x, b.x) - epsilon
    && c.x <= Math.max(a.x, b.x) + epsilon
    && c.y >= Math.min(a.y, b.y) - epsilon
    && c.y <= Math.max(a.y, b.y) + epsilon;
}

function segmentsIntersect(a: LayoutPoint, b: LayoutPoint, c: LayoutPoint, d: LayoutPoint): boolean {
  const epsilon = 1e-9;
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  if (Math.abs(o1) <= epsilon && onSegment(a, b, c)) return true;
  if (Math.abs(o2) <= epsilon && onSegment(a, b, d)) return true;
  if (Math.abs(o3) <= epsilon && onSegment(c, d, a)) return true;
  if (Math.abs(o4) <= epsilon && onSegment(c, d, b)) return true;
  return Math.sign(o1) !== Math.sign(o2) && Math.sign(o3) !== Math.sign(o4);
}

function segmentIntersectsRect(segment: VisualSegment, rect: Rect): boolean {
  if (pointInsideRect(segment.from, rect) || pointInsideRect(segment.to, rect)) return true;
  const topLeft = { x: rect.left, y: rect.top };
  const topRight = { x: rect.right, y: rect.top };
  const bottomRight = { x: rect.right, y: rect.bottom };
  const bottomLeft = { x: rect.left, y: rect.bottom };
  return segmentsIntersect(segment.from, segment.to, topLeft, topRight)
    || segmentsIntersect(segment.from, segment.to, topRight, bottomRight)
    || segmentsIntersect(segment.from, segment.to, bottomRight, bottomLeft)
    || segmentsIntersect(segment.from, segment.to, bottomLeft, topLeft);
}

function rectTouchesCircleBoundary(
  rect: Rect,
  center: LayoutPoint,
  radius: number,
): boolean {
  const nearestX = Math.max(rect.left, Math.min(center.x, rect.right));
  const nearestY = Math.max(rect.top, Math.min(center.y, rect.bottom));
  const nearestDistance = Math.hypot(nearestX - center.x, nearestY - center.y);
  const farthestDistance = Math.max(
    Math.hypot(rect.left - center.x, rect.top - center.y),
    Math.hypot(rect.right - center.x, rect.top - center.y),
    Math.hypot(rect.right - center.x, rect.bottom - center.y),
    Math.hypot(rect.left - center.x, rect.bottom - center.y),
  );
  return nearestDistance <= radius + 1 && farthestDistance >= radius - 1;
}

function placementCollisionScore(
  box: Rect,
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  occupied: readonly Rect[],
): number {
  let score = occupied.reduce((sum, other) => sum + (rectsOverlap(box, other) ? 100 : 0), 0);

  for (const point of model.points) {
    const p = requirePoint(points, point.id, point.id);
    const pointBox: Rect = { left: p.x - 4, right: p.x + 4, top: p.y - 4, bottom: p.y + 4 };
    if (rectsOverlap(box, pointBox, 0)) score += 20;
  }

  for (const segment of model.segments) {
    if (segmentIntersectsRect(visualSegment(points, segment), box)) score += 12;
  }

  for (const circle of model.circles) {
    const center = requirePoint(points, circle.centerPointId, circle.id);
    if (rectTouchesCircleBoundary(box, center, circle.radius)) score += 8;
  }

  return score;
}

function choosePlacement(
  candidates: readonly LayoutPoint[],
  text: string,
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  occupied: readonly Rect[],
): TextPlacement {
  const scored = candidates.map((candidate, index) => {
    const box = rectAtCenter(candidate.x, candidate.y, text);
    const collisionScore = placementCollisionScore(box, model, points, occupied);
    return { ...candidate, box, collisionScore, index };
  });
  scored.sort((a, b) => a.collisionScore - b.collisionScore || a.index - b.index);
  return scored[0];
}

function labelBoxData(box: Rect): string {
  return [box.left, box.top, box.right - box.left, box.bottom - box.top]
    .map((value) => Number(value.toFixed(3)))
    .join(",");
}

const POSITION_ORDER: readonly Exclude<DiagramLabelPosition, "AUTO">[] = [
  "NE", "NW", "SE", "SW", "N", "E", "W", "S",
];

function pointLabelCandidate(
  point: LayoutPoint,
  text: string,
  position: Exclude<DiagramLabelPosition, "AUTO">,
): LayoutPoint {
  const { width, height } = textSize(text);
  const gap = 7;
  switch (position) {
    case "N": return { x: point.x, y: point.y - gap - height / 2 };
    case "NE": return { x: point.x + gap + width / 2, y: point.y - gap - height / 2 };
    case "E": return { x: point.x + gap + width / 2, y: point.y };
    case "SE": return { x: point.x + gap + width / 2, y: point.y + gap + height / 2 };
    case "S": return { x: point.x, y: point.y + gap + height / 2 };
    case "SW": return { x: point.x - gap - width / 2, y: point.y + gap + height / 2 };
    case "W": return { x: point.x - gap - width / 2, y: point.y };
    case "NW": return { x: point.x - gap - width / 2, y: point.y - gap - height / 2 };
  }
}

function renderAngleMark(
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  mark: GeoDiagramModel["angleMarks"][number],
  occupied: Rect[],
): string {
  const vertex = requirePoint(points, mark.vertexPointId, mark.id);
  const first = requirePoint(points, mark.firstPointId, mark.id);
  const second = requirePoint(points, mark.secondPointId, mark.id);
  const startAngle = Math.atan2(first.y - vertex.y, first.x - vertex.x);
  let endAngle = Math.atan2(second.y - vertex.y, second.x - vertex.x);
  let sweep = endAngle - startAngle;
  while (sweep <= -Math.PI) sweep += Math.PI * 2;
  while (sweep > Math.PI) sweep -= Math.PI * 2;
  endAngle = startAngle + sweep;
  const radius = mark.radius ?? 18;
  const start = { x: vertex.x + Math.cos(startAngle) * radius, y: vertex.y + Math.sin(startAngle) * radius };
  const end = { x: vertex.x + Math.cos(endAngle) * radius, y: vertex.y + Math.sin(endAngle) * radius };
  const sweepFlag = sweep >= 0 ? 1 : 0;
  const labelAngle = startAngle + sweep / 2;

  let label = "";
  if (mark.label) {
    const baseRadius = mark.labelRadius ?? radius + 15;
    const candidateRadii = [baseRadius, baseRadius + 10, baseRadius + 20];
    const candidateAngles = [labelAngle, labelAngle - 0.14, labelAngle + 0.14];
    const candidates = candidateRadii.flatMap((candidateRadius) =>
      candidateAngles.map((candidateAngle) => ({
        x: vertex.x + Math.cos(candidateAngle) * candidateRadius,
        y: vertex.y + Math.sin(candidateAngle) * candidateRadius,
      })),
    );
    const placement = choosePlacement(candidates, mark.label, model, points, occupied);
    occupied.push(placement.box);
    label = `<text data-geo-kind="angle-label" data-geo-id="${escapeXml(mark.id)}-label" data-label-box="${labelBoxData(placement.box)}" data-label-collision-score="${placement.collisionScore}" fill="currentColor" stroke="none" text-anchor="middle" dominant-baseline="central" x="${placement.x}" y="${placement.y}">${escapeXml(mark.label)}</text>`;
  }

  return `<g data-geo-kind="angle-mark" data-angle-sign="true" data-geo-id="${escapeXml(mark.id)}" data-vertex="${escapeXml(mark.vertexPointId)}"${mark.label ? ` data-label="${escapeXml(mark.label)}"` : ""}><path d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}" />${label}</g>`;
}

function renderPoint(
  model: GeoDiagramModel,
  points: ReadonlyMap<string, LayoutPoint>,
  point: GeoDiagramModel["points"][number],
  occupied: Rect[],
): string {
  const positionOrder = point.labelPosition && point.labelPosition !== "AUTO"
    ? [point.labelPosition, ...POSITION_ORDER.filter((position) => position !== point.labelPosition)]
    : POSITION_ORDER;
  const candidates = positionOrder.map((position) => pointLabelCandidate(point, point.label, position));
  const placement = choosePlacement(candidates, point.label, model, points, occupied);
  occupied.push(placement.box);
  const pointGlyph = point.showPoint === false
    ? ""
    : `<circle cx="${point.x}" cy="${point.y}" r="2.3" fill="currentColor" stroke="none"/>`;
  const label = point.label.length === 0
    ? ""
    : `<text data-geo-kind="point-label" data-geo-id="${escapeXml(point.id)}-label" data-label-box="${labelBoxData(placement.box)}" data-label-collision-score="${placement.collisionScore}" fill="currentColor" stroke="none" text-anchor="middle" dominant-baseline="central" x="${placement.x}" y="${placement.y}">${escapeXml(point.label)}</text>`;
  return `<g data-geo-kind="point" data-geo-id="${escapeXml(point.id)}">${pointGlyph}${label}</g>`;
}

function viewBox(model: GeoDiagramModel, points: ReadonlyMap<string, LayoutPoint>): string {
  const xs: number[] = model.points.map((point) => point.x);
  const ys: number[] = model.points.map((point) => point.y);
  for (const label of model.labels) {
    xs.push(label.x);
    ys.push(label.y);
  }
  for (const circle of model.circles) {
    const center = requirePoint(points, circle.centerPointId, circle.id);
    xs.push(center.x - circle.radius, center.x + circle.radius);
    ys.push(center.y - circle.radius, center.y + circle.radius);
  }
  for (const segment of model.segments) {
    const visual = visualSegment(points, segment);
    xs.push(visual.from.x, visual.to.x);
    ys.push(visual.from.y, visual.to.y);
  }
  if (xs.length === 0 || ys.length === 0) return "0 0 100 100";
  const margin = 32;
  const minX = Math.min(...xs) - margin;
  const minY = Math.min(...ys) - margin;
  const width = Math.max(1, Math.max(...xs) - Math.min(...xs) + margin * 2);
  const height = Math.max(1, Math.max(...ys) - Math.min(...ys) + margin * 2);
  return `${minX} ${minY} ${width} ${height}`;
}

export function renderGeometrySvg(model: GeoDiagramModel): string {
  const points = pointLookup(model);
  const body: string[] = [];
  const occupiedTextBoxes: Rect[] = [];

  for (const segment of model.segments) {
    const visual = visualSegment(points, segment);
    const extent = segment.extent ?? "SEGMENT";
    const style = segment.style ?? "PRIMARY";
    const styleAttrs = style === "CONSTRUCTION"
      ? ` stroke-dasharray="5 4" stroke-width="1.15" opacity="0.78"`
      : "";
    body.push(`<line data-geo-kind="segment" data-geo-id="${escapeXml(segment.id)}" data-extent="${extent}" data-style="${style}" x1="${visual.from.x}" y1="${visual.from.y}" x2="${visual.to.x}" y2="${visual.to.y}"${styleAttrs} />`);
  }

  for (const circle of model.circles) {
    const center = requirePoint(points, circle.centerPointId, circle.id);
    body.push(`<circle data-geo-kind="circle" data-geo-id="${escapeXml(circle.id)}" cx="${center.x}" cy="${center.y}" r="${circle.radius}" />`);
  }

  for (const mark of model.parallelMarks) {
    body.push(renderParallelMark(model, points, mark.id, mark.segmentIds));
  }
  for (const mark of model.equalLengthMarks) {
    body.push(renderEqualLengthMark(model, points, mark.id, mark.segmentIds));
  }
  for (const mark of model.rightAngleMarks) {
    body.push(renderRightAngleMark(points, mark));
  }
  for (const mark of model.angleMarks) {
    body.push(renderAngleMark(model, points, mark, occupiedTextBoxes));
  }
  for (const arc of model.arcs) {
    body.push(`<g data-geo-kind="arc" data-geo-id="${escapeXml(arc.id)}" data-circle="${escapeXml(arc.circleId)}"></g>`);
  }
  for (const point of model.points) {
    body.push(renderPoint(model, points, point, occupiedTextBoxes));
  }
  for (const label of model.labels) {
    const box = rectAtCenter(label.x, label.y, label.text);
    const collisionScore = placementCollisionScore(box, model, points, occupiedTextBoxes);
    occupiedTextBoxes.push(box);
    body.push(`<text data-geo-kind="label" data-geo-id="${escapeXml(label.id)}" data-label-box="${labelBoxData(box)}" data-label-collision-score="${collisionScore}" fill="currentColor" stroke="none" text-anchor="middle" dominant-baseline="central" x="${label.x}" y="${label.y}">${escapeXml(label.text)}</text>`);
  }

  const description = model.notToScale ? "Geometry diagram, not to scale" : "Geometry diagram";
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${description}" viewBox="${viewBox(model, points)}" width="100%" data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V2" data-disclosure="${model.disclosure}" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" font-family="system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="12">${body.join("")}</svg>`;
}
