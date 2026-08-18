import type { GeoDiagramModel } from "./diagram-model";

interface LayoutPoint {
  readonly x: number;
  readonly y: number;
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

function renderAngleMark(
  points: ReadonlyMap<string, LayoutPoint>,
  mark: GeoDiagramModel["angleMarks"][number],
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
  const radius = 16;
  const start = { x: vertex.x + Math.cos(startAngle) * radius, y: vertex.y + Math.sin(startAngle) * radius };
  const end = { x: vertex.x + Math.cos(endAngle) * radius, y: vertex.y + Math.sin(endAngle) * radius };
  const sweepFlag = sweep >= 0 ? 1 : 0;
  const labelAngle = startAngle + sweep / 2;
  const labelRadius = radius + 10;
  const label = mark.label
    ? `<text x="${vertex.x + Math.cos(labelAngle) * labelRadius}" y="${vertex.y + Math.sin(labelAngle) * labelRadius}">${escapeXml(mark.label)}</text>`
    : "";
  return `<g data-geo-kind="angle-mark" data-geo-id="${escapeXml(mark.id)}" data-vertex="${escapeXml(mark.vertexPointId)}"${mark.label ? ` data-label="${escapeXml(mark.label)}"` : ""}><path d="M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${end.x} ${end.y}" />${label}</g>`;
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
  if (xs.length === 0 || ys.length === 0) return "0 0 100 100";
  const margin = 24;
  const minX = Math.min(...xs) - margin;
  const minY = Math.min(...ys) - margin;
  const width = Math.max(1, Math.max(...xs) - Math.min(...xs) + margin * 2);
  const height = Math.max(1, Math.max(...ys) - Math.min(...ys) + margin * 2);
  return `${minX} ${minY} ${width} ${height}`;
}

export function renderGeometrySvg(model: GeoDiagramModel): string {
  const points = pointLookup(model);
  const body: string[] = [];

  for (const segment of model.segments) {
    const from = requirePoint(points, segment.fromPointId, segment.id);
    const to = requirePoint(points, segment.toPointId, segment.id);
    body.push(`<line data-geo-kind="segment" data-geo-id="${escapeXml(segment.id)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`);
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
    body.push(renderAngleMark(points, mark));
  }
  for (const arc of model.arcs) {
    body.push(`<g data-geo-kind="arc" data-geo-id="${escapeXml(arc.id)}" data-circle="${escapeXml(arc.circleId)}"></g>`);
  }
  for (const point of model.points) {
    body.push(`<g data-geo-kind="point" data-geo-id="${escapeXml(point.id)}"><circle cx="${point.x}" cy="${point.y}" r="2"/><text x="${point.x + 4}" y="${point.y - 4}">${escapeXml(point.label)}</text></g>`);
  }
  for (const label of model.labels) {
    body.push(`<text data-geo-kind="label" data-geo-id="${escapeXml(label.id)}" x="${label.x}" y="${label.y}">${escapeXml(label.text)}</text>`);
  }

  const description = model.notToScale ? "Geometry diagram, not to scale" : "Geometry diagram";
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${description}" viewBox="${viewBox(model, points)}" width="100%" data-geometry-renderer="EXAMTREE_GEOMETRY_SVG_V1" data-disclosure="${model.disclosure}" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">${body.join("")}</svg>`;
}
