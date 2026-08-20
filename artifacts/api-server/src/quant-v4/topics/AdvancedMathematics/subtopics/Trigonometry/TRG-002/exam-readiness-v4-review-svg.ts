type AnyDiagram = Record<string, any>;
type Point = { id: string; x: number; y: number; role?: string; label?: string };

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

function renderAngle(angle: any, points: Map<string, Point>) {
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
  const labelRadius = radius + 20;
  const lx = vertex.x + labelRadius * Math.cos(mid);
  const ly = vertex.y + labelRadius * Math.sin(mid);
  const label = angle.label ?? "";

  return `<g class="diagram-angle" data-angle-id="${esc(angle.id)}"><path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="#7c3aed" stroke-width="2.4"/><text x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="angle-label">${esc(label)}</text></g>`;
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

function renderMeasurementArrow(arrow: any, points: Map<string, Point>, markerId: string) {
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
  const offset = 28 + lane * 18;
  const ax1 = from.x + nx * offset;
  const ay1 = from.y + ny * offset;
  const ax2 = to.x + nx * offset;
  const ay2 = to.y + ny * offset;
  const labelX = (ax1 + ax2) / 2 + nx * 13;
  const labelY = (ay1 + ay2) / 2 + ny * 13;
  return `<g class="measurement" data-measurement-id="${esc(arrow.id)}"><line x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${ax1.toFixed(2)}" y2="${ay1.toFixed(2)}" stroke="#94a3b8" stroke-width="1.2"/><line x1="${to.x.toFixed(2)}" y1="${to.y.toFixed(2)}" x2="${ax2.toFixed(2)}" y2="${ay2.toFixed(2)}" stroke="#94a3b8" stroke-width="1.2"/><line x1="${ax1.toFixed(2)}" y1="${ay1.toFixed(2)}" x2="${ax2.toFixed(2)}" y2="${ay2.toFixed(2)}" stroke="#0f766e" stroke-width="1.9" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/><text x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="measurement-label">${esc(arrow.label ?? "")}</text></g>`;
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

  const segments = (Array.isArray(diagram.segments) ? diagram.segments : []).map((segment: any) => {
    const from = points.get(segment.fromPointId);
    const to = points.get(segment.toPointId);
    if (!from || !to) return "";
    const style = segmentStyle(String(segment.kind ?? "AUXILIARY"));
    const dash = style.dash ? ` stroke-dasharray="${style.dash}"` : "";
    const marker = style.marker ? ` marker-end="url(#${markerId})"` : "";
    return `<line data-segment-id="${esc(segment.id)}" data-kind="${esc(segment.kind)}" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${to.x.toFixed(2)}" y2="${to.y.toFixed(2)}" stroke="${style.stroke}" stroke-width="${style.width}"${dash}${marker} stroke-linecap="round"/>`;
  }).join("");

  const rightAngles = (Array.isArray(diagram.rightAngles) ? diagram.rightAngles : []).map((marker: any) => renderRightAngle(marker, points)).join("");
  const angles = (Array.isArray(diagram.angles) ? diagram.angles : []).map((angle: any) => renderAngle(angle, points)).join("");
  const measurements = (Array.isArray(diagram.measurementArrows) ? diagram.measurementArrows : []).map((arrow: any) => renderMeasurementArrow(arrow, points, markerId)).join("");

  const seenLabels = new Set<string>();
  const pointLabels = pointsArray.map((point) => {
    if (!point.label) return "";
    const key = `${point.x.toFixed(2)}|${point.y.toFixed(2)}|${point.label}`;
    if (seenLabels.has(key)) return "";
    seenLabels.add(key);
    const dx = point.x > width * 0.82 ? -12 : 12;
    const anchor = dx < 0 ? "end" : "start";
    const dy = point.y < 90 ? 18 : -12;
    return `<g class="diagram-point" data-point-id="${esc(point.id)}"><circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4.5" fill="#111827"/><text x="${(point.x + dx).toFixed(2)}" y="${(point.y + dy).toFixed(2)}" text-anchor="${anchor}" class="point-label">${esc(point.label)}</text></g>`;
  }).join("");

  return `<figure class="diagram-figure"><div class="diagram-caption"><b>${esc(qlId)}</b> · ${esc(diagram.strategy ?? "solution geometry")}</div><svg class="solution-diagram" data-diagram-ql="${esc(qlId)}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Solution geometry for ${esc(qlId)}" preserveAspectRatio="xMidYMid meet"><title>Solution geometry for ${esc(qlId)}</title><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e"/></marker></defs><rect x="1" y="1" width="${Math.max(0, width - 2)}" height="${Math.max(0, height - 2)}" rx="10" fill="#ffffff" stroke="#e2e8f0"/>${segments}${rightAngles}${angles}${measurements}${pointLabels}</svg></figure>`;
}
