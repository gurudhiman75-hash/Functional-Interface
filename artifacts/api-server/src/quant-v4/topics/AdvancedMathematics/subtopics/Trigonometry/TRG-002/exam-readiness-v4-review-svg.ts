type AnyDiagram = Record<string, any>;
type Point = { id: string; x: number; y: number; role?: string; label?: string };
type GeometrySegment = { from: Point; to: Point };
type LabelBox = { x: number; y: number; halfWidth: number; halfHeight: number };
type LabelPlacement = LabelBox & { lineHits: number; labelOverlaps: number; clearance: number };

function esc(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function finite(value: unknown, context: string): number {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${context}: expected a finite coordinate, got ${String(value)}.`);
  return number;
}

function sanitizeId(value: unknown) {
  return String(value ?? "diagram").replace(/[^A-Za-z0-9_-]/g, "-");
}

function segmentStyle(kind: string) {
  switch (kind) {
    case "GROUND":
    case "GROUND_UNSCALED":
      return { stroke: "#111827", width: 3, dash: "", marker: false };
    case "VERTICAL_OBJECT":
    case "VERTICAL":
      return { stroke: "#111827", width: 3, dash: "", marker: false };
    case "SIGHT_LINE":
    case "SIGHT":
      return { stroke: "#1d4ed8", width: 2.6, dash: "", marker: false };
    case "HORIZONTAL_SIGHT":
    case "EYE_LEVEL":
      return { stroke: "#64748b", width: 1.7, dash: "8 7", marker: false };
    case "MOVEMENT":
      return { stroke: "#9a3412", width: 2.5, dash: "9 6", marker: true };
    case "AUXILIARY":
    default:
      return { stroke: "#94a3b8", width: 1.5, dash: "6 6", marker: false };
  }
}

function normalizeDelta(delta: number) {
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return delta;
}

function estimateLabelBox(text: string, fontSize: number) {
  const weightedGlyphs = Array.from(text || " ").reduce((sum, char) => {
    if (/[^\x00-\x7F]/.test(char)) return sum + 0.95;
    if (/[MW@#%]/.test(char)) return sum + 0.9;
    if (/[il1.,' ]/.test(char)) return sum + 0.35;
    return sum + 0.58;
  }, 0);
  return {
    halfWidth: Math.max(16, (weightedGlyphs * fontSize + 18) / 2),
    halfHeight: (fontSize + 14) / 2,
  };
}

function boxesOverlap(a: LabelBox, b: LabelBox, gap = 5) {
  return Math.abs(a.x - b.x) < a.halfWidth + b.halfWidth + gap
    && Math.abs(a.y - b.y) < a.halfHeight + b.halfHeight + gap;
}

function pointToSegmentDistance(x: number, y: number, segment: GeometrySegment) {
  const ax = segment.from.x;
  const ay = segment.from.y;
  const bx = segment.to.x;
  const by = segment.to.y;
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 0) return Math.hypot(x - ax, y - ay);
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / lengthSquared));
  return Math.hypot(x - (ax + t * dx), y - (ay + t * dy));
}

function segmentIntersectsBox(segment: GeometrySegment, box: LabelBox, gap = 5) {
  const xmin = box.x - box.halfWidth - gap;
  const xmax = box.x + box.halfWidth + gap;
  const ymin = box.y - box.halfHeight - gap;
  const ymax = box.y + box.halfHeight + gap;
  const x1 = segment.from.x;
  const y1 = segment.from.y;
  const x2 = segment.to.x;
  const y2 = segment.to.y;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - xmin, xmax - x1, y1 - ymin, ymax - y1];
  let u1 = 0;
  let u2 = 1;
  for (let i = 0; i < 4; i++) {
    const pi = p[i]!;
    const qi = q[i]!;
    if (Math.abs(pi) < 1e-9) {
      if (qi < 0) return false;
      continue;
    }
    const t = qi / pi;
    if (pi < 0) u1 = Math.max(u1, t);
    else u2 = Math.min(u2, t);
    if (u1 > u2) return false;
  }
  return true;
}

function labelClearance(box: LabelBox, geometrySegments: GeometrySegment[], occupied: LabelBox[]) {
  const radius = Math.hypot(box.halfWidth, box.halfHeight);
  const lineClearance = geometrySegments.length
    ? Math.min(...geometrySegments.map((segment) => pointToSegmentDistance(box.x, box.y, segment) - radius))
    : 999;
  const labelClearance = occupied.length
    ? Math.min(...occupied.map((other) => {
        const dx = Math.max(0, Math.abs(box.x - other.x) - box.halfWidth - other.halfWidth);
        const dy = Math.max(0, Math.abs(box.y - other.y) - box.halfHeight - other.halfHeight);
        return Math.hypot(dx, dy);
      }))
    : 999;
  return Math.min(lineClearance, labelClearance);
}

function chooseLabelPlacement(
  text: string,
  fontSize: number,
  candidates: Array<{ x: number; y: number }>,
  geometrySegments: GeometrySegment[],
  occupied: LabelBox[],
  width: number,
  height: number,
): LabelPlacement {
  const dimensions = estimateLabelBox(text, fontSize);
  const margin = 10;
  let best: LabelPlacement | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    const box: LabelBox = { ...candidate, ...dimensions };
    const outOfBounds = candidate.x - box.halfWidth < margin
      || candidate.x + box.halfWidth > width - margin
      || candidate.y - box.halfHeight < margin
      || candidate.y + box.halfHeight > height - margin;
    if (outOfBounds) continue;

    const lineHits = geometrySegments.filter((segment) => segmentIntersectsBox(segment, box)).length;
    const labelOverlaps = occupied.filter((other) => boxesOverlap(box, other)).length;
    const clearance = labelClearance(box, geometrySegments, occupied);
    const score = lineHits * 100000 + labelOverlaps * 100000 - Math.min(clearance, 100);

    if (score < bestScore) {
      bestScore = score;
      best = { ...box, lineHits, labelOverlaps, clearance };
      if (lineHits === 0 && labelOverlaps === 0 && clearance >= 8) break;
    }
  }

  if (best) return best;
  const fallback = candidates[0] ?? { x: width / 2, y: height / 2 };
  const box: LabelBox = { ...fallback, ...dimensions };
  return {
    ...box,
    lineHits: geometrySegments.filter((segment) => segmentIntersectsBox(segment, box)).length,
    labelOverlaps: occupied.filter((other) => boxesOverlap(box, other)).length,
    clearance: labelClearance(box, geometrySegments, occupied),
  };
}

function renderLabelBox(label: string, placement: LabelPlacement, className: string, fontSize: number, fill: string) {
  const rectX = placement.x - placement.halfWidth;
  const rectY = placement.y - placement.halfHeight;
  return `<g class="diagram-label" data-label-box="true" data-label-line-hits="${placement.lineHits}" data-label-overlaps="${placement.labelOverlaps}" data-label-clearance="${placement.clearance.toFixed(2)}"><rect class="label-bg" x="${rectX.toFixed(2)}" y="${rectY.toFixed(2)}" width="${(placement.halfWidth * 2).toFixed(2)}" height="${(placement.halfHeight * 2).toFixed(2)}" rx="7" fill="#ffffff" fill-opacity="0.97" stroke="#e2e8f0" stroke-width="1"/><text x="${placement.x.toFixed(2)}" y="${placement.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="${className}" font-size="${fontSize}" fill="${fill}">${esc(label)}</text></g>`;
}

function pointLabelCandidates(point: Point) {
  const directions = [
    [1, -1], [-1, -1], [1, 1], [-1, 1],
    [1, 0], [-1, 0], [0, -1], [0, 1],
  ];
  return [34, 46, 60, 76, 94, 116].flatMap((distance) => directions.map(([dx, dy]) => {
    const norm = Math.hypot(dx, dy) || 1;
    return { x: point.x + (dx / norm) * distance, y: point.y + (dy / norm) * distance };
  }));
}

function renderAngle(
  angle: any,
  points: Map<string, Point>,
  geometrySegments: GeometrySegment[],
  occupied: LabelBox[],
  width: number,
  height: number,
) {
  const vertex = points.get(angle.vertexPointId);
  const ray = points.get(angle.rayPointId);
  if (!vertex || !ray) return "";

  const start = angle.referenceDirection === "LEFT" ? Math.PI : 0;
  const target = Math.atan2(ray.y - vertex.y, ray.x - vertex.x);
  const delta = normalizeDelta(target - start);
  const end = start + delta;
  const lane = Number.isFinite(Number(angle.arcLane)) ? Number(angle.arcLane) : 0;
  const radius = 38 + lane * 18;
  const sx = vertex.x + radius * Math.cos(start);
  const sy = vertex.y + radius * Math.sin(start);
  const ex = vertex.x + radius * Math.cos(end);
  const ey = vertex.y + radius * Math.sin(end);
  const sweep = delta >= 0 ? 1 : 0;
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  const mid = start + delta / 2;
  const label = String(angle.label ?? "");
  const angularOffsets = [0, 0.05, -0.05, 0.09, -0.09, 0.13, -0.13];
  const candidates = [100, 120, 145, 170, 200, 235].flatMap((labelRadius) => angularOffsets.map((turn) => ({
    x: vertex.x + (radius + labelRadius) * Math.cos(mid + turn),
    y: vertex.y + (radius + labelRadius) * Math.sin(mid + turn),
  })));
  const placement = chooseLabelPlacement(label, 20, candidates, geometrySegments, occupied, width, height);
  occupied.push(placement);
  const renderedLabel = label ? renderLabelBox(label, placement, "angle-label", 20, "#6d28d9") : "";

  return `<g class="diagram-angle" data-angle-id="${esc(angle.id)}"><path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="#7c3aed" stroke-width="2.4"/>${renderedLabel}</g>`;
}

function renderRightAngle(marker: any, points: Map<string, Point>) {
  const vertex = points.get(marker.vertexPointId);
  if (!vertex) return "";
  const vertical = points.get(marker.verticalRayPointId);
  const hx = marker.horizontalDirection === "LEFT" ? -1 : 1;
  let vx = 0;
  let vy = -1;
  if (vertical) {
    const dx = vertical.x - vertex.x;
    const dy = vertical.y - vertex.y;
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      vx = dx / length;
      vy = dy / length;
    }
  }
  const size = 17;
  const p1 = [vertex.x + hx * size, vertex.y];
  const p2 = [vertex.x + hx * size + vx * size, vertex.y + vy * size];
  const p3 = [vertex.x + vx * size, vertex.y + vy * size];
  return `<polyline class="right-angle" data-right-angle-id="${esc(marker.id)}" points="${p1[0].toFixed(2)},${p1[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} ${p3[0].toFixed(2)},${p3[1].toFixed(2)}" fill="none" stroke="#111827" stroke-width="2"/>`;
}

function renderMeasurementArrow(
  arrow: any,
  points: Map<string, Point>,
  markerId: string,
  geometrySegments: GeometrySegment[],
  occupied: LabelBox[],
  width: number,
  height: number,
) {
  const from = points.get(arrow.fromPointId);
  const to = points.get(arrow.toPointId);
  if (!from || !to) return "";
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length <= 0) return "";
  const ux = dx / length;
  const uy = dy / length;
  let nx = -uy;
  let ny = ux;
  if (arrow.side === "RIGHT") {
    nx *= -1;
    ny *= -1;
  }
  const lane = Number.isFinite(Number(arrow.lane)) ? Number(arrow.lane) : 0;
  const offset = 34 + lane * 20;
  const ax1 = from.x + nx * offset;
  const ay1 = from.y + ny * offset;
  const ax2 = to.x + nx * offset;
  const ay2 = to.y + ny * offset;
  const midpointX = (from.x + to.x) / 2;
  const midpointY = (from.y + to.y) / 2;
  const label = String(arrow.label ?? "");
  const candidates = [offset + 30, offset + 48, offset + 68, offset + 92, offset + 118].flatMap((labelOffset) => [0, 22, -22, 44, -44].map((tangent) => ({
    x: midpointX + nx * labelOffset + ux * tangent,
    y: midpointY + ny * labelOffset + uy * tangent,
  })));
  const placement = chooseLabelPlacement(label, 18, candidates, geometrySegments, occupied, width, height);
  occupied.push(placement);
  const renderedLabel = label ? renderLabelBox(label, placement, "measurement-label", 18, "#0f766e") : "";

  return `<g class="measurement" data-measurement-id="${esc(arrow.id)}"><line x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${ax1.toFixed(2)}" y2="${ay1.toFixed(2)}" stroke="#94a3b8" stroke-width="1.2"/><line x1="${to.x.toFixed(2)}" y1="${to.y.toFixed(2)}" x2="${ax2.toFixed(2)}" y2="${ay2.toFixed(2)}" stroke="#94a3b8" stroke-width="1.2"/><line x1="${ax1.toFixed(2)}" y1="${ay1.toFixed(2)}" x2="${ax2.toFixed(2)}" y2="${ay2.toFixed(2)}" stroke="#0f766e" stroke-width="1.9" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>${renderedLabel}</g>`;
}

export function renderTrg002SolutionDiagramSvg(diagram: AnyDiagram) {
  if (!diagram || typeof diagram !== "object") return `<div class="diagram-missing">No solution diagram specification is available.</div>`;
  const width = finite(diagram.width ?? 1000, `${diagram.qlId ?? "diagram"}:width`);
  const height = finite(diagram.height ?? 600, `${diagram.qlId ?? "diagram"}:height`);
  const qlId = String(diagram.qlId ?? "unknown");
  const pointsArray: Point[] = Array.isArray(diagram.points)
    ? diagram.points.map((point: any) => ({
        ...point,
        x: finite(point.x, `${qlId}:${point.id}:x`),
        y: finite(point.y, `${qlId}:${point.id}:y`),
      }))
    : [];
  const points = new Map(pointsArray.map((point) => [point.id, point]));
  const markerId = `arrow-${sanitizeId(qlId)}`;
  const geometrySegments: GeometrySegment[] = [];
  const occupiedLabels: LabelBox[] = [];

  const segments = (Array.isArray(diagram.segments) ? diagram.segments : []).map((segment: any) => {
    const from = points.get(segment.fromPointId);
    const to = points.get(segment.toPointId);
    if (!from || !to) return "";
    geometrySegments.push({ from, to });
    const style = segmentStyle(String(segment.kind ?? "AUXILIARY"));
    const dash = style.dash ? ` stroke-dasharray="${style.dash}"` : "";
    const marker = style.marker ? ` marker-end="url(#${markerId})"` : "";
    return `<line data-segment-id="${esc(segment.id)}" data-kind="${esc(segment.kind)}" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${to.x.toFixed(2)}" y2="${to.y.toFixed(2)}" stroke="${style.stroke}" stroke-width="${style.width}"${dash}${marker} stroke-linecap="round"/>`;
  }).join("");

  const rightAngles = (Array.isArray(diagram.rightAngles) ? diagram.rightAngles : []).map((marker: any) => renderRightAngle(marker, points)).join("");
  const measurements = (Array.isArray(diagram.measurementArrows) ? diagram.measurementArrows : []).map((arrow: any) => renderMeasurementArrow(arrow, points, markerId, geometrySegments, occupiedLabels, width, height)).join("");
  const angles = (Array.isArray(diagram.angles) ? diagram.angles : []).map((angle: any) => renderAngle(angle, points, geometrySegments, occupiedLabels, width, height)).join("");

  const seenLabels = new Set<string>();
  const pointLabels = pointsArray.map((point) => {
    if (!point.label) return "";
    const label = String(point.label);
    const key = `${point.x.toFixed(2)}|${point.y.toFixed(2)}|${label}`;
    if (seenLabels.has(key)) return "";
    seenLabels.add(key);
    const placement = chooseLabelPlacement(label, 18, pointLabelCandidates(point), geometrySegments, occupiedLabels, width, height);
    occupiedLabels.push(placement);
    return `<g class="diagram-point" data-point-id="${esc(point.id)}"><circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4.5" fill="#111827"/>${renderLabelBox(label, placement, "point-label", 18, "#111827")}</g>`;
  }).join("");

  return `<figure class="diagram-figure"><div class="diagram-caption"><b>${esc(qlId)}</b> · ${esc(diagram.strategy ?? "solution geometry")}</div><svg class="solution-diagram" data-diagram-ql="${esc(qlId)}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Solution geometry for ${esc(qlId)}" preserveAspectRatio="xMidYMid meet"><title>Solution geometry for ${esc(qlId)}</title><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e"/></marker></defs><rect x="1" y="1" width="${Math.max(0, width - 2)}" height="${Math.max(0, height - 2)}" rx="10" fill="#ffffff" stroke="#e2e8f0"/>${segments}${rightAngles}${measurements}${angles}${pointLabels}</svg></figure>`;
}
