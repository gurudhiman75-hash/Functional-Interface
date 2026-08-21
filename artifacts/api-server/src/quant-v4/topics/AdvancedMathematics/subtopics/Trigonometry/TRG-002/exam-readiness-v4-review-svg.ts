type AnyDiagram = Record<string, any>;
type Point = { id: string; x: number; y: number; role?: string; label?: string };
type GeometrySegment = { from: Point; to: Point };
type LabelBox = { x: number; y: number; halfWidth: number; halfHeight: number };
type LabelPlacement = LabelBox & { lineHits: number; labelOverlaps: number; clearance: number };
type CoreBounds = { left: number; top: number; right: number; bottom: number };
type LaneCandidate = {
  ax1: number;
  ay1: number;
  ax2: number;
  ay2: number;
  outwardX: number;
  outwardY: number;
};

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
      return { stroke: "#111827", width: 5.2, dash: "", marker: false };
    case "VERTICAL_OBJECT":
    case "VERTICAL":
      return { stroke: "#111827", width: 5.2, dash: "", marker: false };
    case "SIGHT_LINE":
    case "SIGHT":
      return { stroke: "#1d4ed8", width: 4.2, dash: "", marker: false };
    case "HORIZONTAL_SIGHT":
    case "EYE_LEVEL":
      return { stroke: "#64748b", width: 2.7, dash: "10 8", marker: false };
    case "MOVEMENT":
      return { stroke: "#9a3412", width: 3.7, dash: "10 7", marker: true };
    case "AUXILIARY":
    default:
      return { stroke: "#64748b", width: 2.5, dash: "7 7", marker: false };
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

function coreBox(core: CoreBounds): LabelBox {
  return {
    x: (core.left + core.right) / 2,
    y: (core.top + core.bottom) / 2,
    halfWidth: (core.right - core.left) / 2,
    halfHeight: (core.bottom - core.top) / 2,
  };
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
  for (let index = 0; index < 4; index += 1) {
    const pi = p[index]!;
    const qi = q[index]!;
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

function geometryIntersectsLabels(segments: GeometrySegment[], occupied: LabelBox[]) {
  return segments.some((segment) => occupied.some((box) => segmentIntersectsBox(segment, box)));
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
  forbiddenBoxes: Array<{ box: LabelBox; gap: number }> = [],
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
    if (forbiddenBoxes.some((entry) => boxesOverlap(box, entry.box, entry.gap))) continue;

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

  if (!best) throw new Error(`TRG-002 review diagram label "${text}" has no in-bounds placement candidate.`);
  if (best.lineHits !== 0 || best.labelOverlaps !== 0) {
    throw new Error(`TRG-002 review diagram label "${text}" could not be placed collision-free: lineHits=${best.lineHits} labelOverlaps=${best.labelOverlaps}.`);
  }
  return best;
}

function renderLabelBox(
  label: string,
  placement: LabelPlacement,
  className: string,
  fontSize: number,
  fill: string,
  extraData = "",
) {
  const rectX = placement.x - placement.halfWidth;
  const rectY = placement.y - placement.halfHeight;
  return `<g class="diagram-label" data-label-box="true" data-label-line-hits="${placement.lineHits}" data-label-overlaps="${placement.labelOverlaps}" data-label-clearance="${placement.clearance.toFixed(2)}"${extraData}><rect class="label-bg" x="${rectX.toFixed(2)}" y="${rectY.toFixed(2)}" width="${(placement.halfWidth * 2).toFixed(2)}" height="${(placement.halfHeight * 2).toFixed(2)}" rx="7" fill="#ffffff" fill-opacity="0.98" stroke="#dbe3ec" stroke-width="1"${extraData}/><text x="${placement.x.toFixed(2)}" y="${placement.y.toFixed(2)}" text-anchor="middle" dominant-baseline="middle" class="${className}" font-size="${fontSize}" fill="${fill}">${esc(label)}</text></g>`;
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
  qlId: string,
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
  const radius = 40 + lane * 19;
  const sx = vertex.x + radius * Math.cos(start);
  const sy = vertex.y + radius * Math.sin(start);
  const ex = vertex.x + radius * Math.cos(end);
  const ey = vertex.y + radius * Math.sin(end);
  const sweep = delta >= 0 ? 1 : 0;
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  const mid = start + delta / 2;
  const label = String(angle.label ?? "");
  const angularOffsets = [0, 0.08, -0.08, 0.16, -0.16, 0.24, -0.24, 0.34, -0.34, 0.48, -0.48];
  const candidates = [82, 105, 132, 165, 205, 250, 300].flatMap((labelRadius) => angularOffsets.map((turn) => ({
    x: vertex.x + (radius + labelRadius) * Math.cos(mid + turn),
    y: vertex.y + (radius + labelRadius) * Math.sin(mid + turn),
  })));
  let placement: LabelPlacement;
  try {
    placement = chooseLabelPlacement(label, 20, candidates, geometrySegments, occupied, width, height);
  } catch (error) {
    throw new Error(`${qlId}: angle label "${label}" has no collision-free placement. ${error instanceof Error ? error.message : String(error)}`);
  }
  occupied.push(placement);
  const renderedLabel = label ? renderLabelBox(label, placement, "angle-label", 20, "#6d28d9") : "";

  return `<g class="diagram-angle" data-angle-id="${esc(angle.id)}"><path d="M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${ex.toFixed(2)} ${ey.toFixed(2)}" fill="none" stroke="#6d28d9" stroke-width="3.2"/>${renderedLabel}</g>`;
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
  const size = 19;
  const p1 = [vertex.x + hx * size, vertex.y];
  const p2 = [vertex.x + hx * size + vx * size, vertex.y + vy * size];
  const p3 = [vertex.x + vx * size, vertex.y + vy * size];
  return `<polyline class="right-angle" data-right-angle-id="${esc(marker.id)}" points="${p1[0].toFixed(2)},${p1[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)} ${p3[0].toFixed(2)},${p3[1].toFixed(2)}" fill="none" stroke="#111827" stroke-width="3"/>`;
}

function measurementPriority(arrow: any, points: Map<string, Point>) {
  if (String(arrow.kind ?? "").includes("REQUESTED")) return 30;
  const from = points.get(arrow.fromPointId);
  const to = points.get(arrow.toPointId);
  if (!from || !to) return 25;
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  if (dy < 1e-6) return 0;
  if (dx < 1e-6) return 20;
  return 10;
}

function outsideLaneCandidates(
  from: Point,
  to: Point,
  lane: number,
  preferredNx: number,
  preferredNy: number,
  core: CoreBounds,
  width: number,
  height: number,
): LaneCandidate[] {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const baseGap = 58 + lane * 28;
  const candidates: LaneCandidate[] = [];

  if (absDy < 1e-6) {
    const preferredTop = preferredNy < 0;
    const sides = preferredTop ? [-1, 1] : [1, -1];
    for (const side of sides) {
      for (let extra = 0; extra <= 150; extra += 26) {
        const gap = baseGap + extra;
        const y = side < 0 ? core.top - gap : core.bottom + gap;
        if (y < 14 || y > height - 14) continue;
        candidates.push({ ax1: from.x, ay1: y, ax2: to.x, ay2: y, outwardX: 0, outwardY: side });
      }
    }
    return candidates;
  }

  if (absDx < 1e-6) {
    const preferredLeft = preferredNx < 0;
    const sides = preferredLeft ? [-1, 1] : [1, -1];
    for (const side of sides) {
      for (let extra = 0; extra <= 150; extra += 26) {
        const gap = baseGap + extra;
        const x = side < 0 ? core.left - gap : core.right + gap;
        if (x < 14 || x > width - 14) continue;
        candidates.push({ ax1: x, ay1: from.y, ax2: x, ay2: to.y, outwardX: side, outwardY: 0 });
      }
    }
    return candidates;
  }

  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const normals = [
    { x: preferredNx, y: preferredNy },
    { x: -preferredNx, y: -preferredNy },
  ];
  const maxOffset = Math.max(width, height) * 1.2;
  for (const normal of normals) {
    for (let offset = baseGap; offset <= maxOffset; offset += 24) {
      const ax1 = from.x + normal.x * offset;
      const ay1 = from.y + normal.y * offset;
      const ax2 = to.x + normal.x * offset;
      const ay2 = to.y + normal.y * offset;
      if ([ax1, ax2].some((x) => x < 14 || x > width - 14) || [ay1, ay2].some((y) => y < 14 || y > height - 14)) continue;
      candidates.push({ ax1, ay1, ax2, ay2, outwardX: normal.x, outwardY: normal.y });
    }
  }
  return candidates;
}

function renderMeasurementArrow(
  arrow: any,
  qlId: string,
  points: Map<string, Point>,
  markerId: string,
  geometrySegments: GeometrySegment[],
  occupied: LabelBox[],
  width: number,
  height: number,
  core: CoreBounds,
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
  let preferredNx = uy;
  let preferredNy = -ux;
  if (arrow.side === "RIGHT") {
    preferredNx *= -1;
    preferredNy *= -1;
  }
  const lane = Number.isFinite(Number(arrow.lane)) ? Number(arrow.lane) : 0;
  const label = String(arrow.label ?? "");
  const coreRegion = coreBox(core);

  let selected: {
    ax1: number;
    ay1: number;
    ax2: number;
    ay2: number;
    dimensionLine: GeometrySegment;
    placement: LabelPlacement;
  } | null = null;

  for (const laneCandidate of outsideLaneCandidates(from, to, lane, preferredNx, preferredNy, core, width, height)) {
    const { ax1, ay1, ax2, ay2, outwardX, outwardY } = laneCandidate;
    const dimensionLine: GeometrySegment = {
      from: { id: `${arrow.id}-dimension-a`, x: ax1, y: ay1 },
      to: { id: `${arrow.id}-dimension-b`, x: ax2, y: ay2 },
    };
    if (segmentIntersectsBox(dimensionLine, coreRegion, 26)) continue;
    if (geometryIntersectsLabels([dimensionLine], occupied)) continue;

    const dimensionMidX = (ax1 + ax2) / 2;
    const dimensionMidY = (ay1 + ay2) / 2;
    const candidates = [30, 48, 68, 92].flatMap((outward) => [0, 24, -24, 48, -48, 76, -76].map((tangent) => ({
      x: dimensionMidX + outwardX * outward + ux * tangent,
      y: dimensionMidY + outwardY * outward + uy * tangent,
    })));

    try {
      const placement = chooseLabelPlacement(
        label,
        18,
        candidates,
        [...geometrySegments, dimensionLine],
        occupied,
        width,
        height,
        [{ box: coreRegion, gap: 24 }],
      );
      selected = { ax1, ay1, ax2, ay2, dimensionLine, placement };
      break;
    } catch {
      // Try the next edge band / parallel outside lane.
    }
  }

  if (!selected) throw new Error(`${qlId}: review measurement "${label}" could not find a clean outside dimension band.`);
  occupied.push(selected.placement);
  geometrySegments.push(selected.dimensionLine);
  const renderedLabel = label
    ? renderLabelBox(label, selected.placement, "measurement-label", 18, "#0f766e", ' data-dimension-label="true"')
    : "";

  return `<g class="measurement" data-measurement-id="${esc(arrow.id)}" data-dimension-zone="outside"><line data-extension-line="true" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${selected.ax1.toFixed(2)}" y2="${selected.ay1.toFixed(2)}" stroke="#a8b3c2" stroke-width="1.1" stroke-dasharray="5 5"/><line data-extension-line="true" x1="${to.x.toFixed(2)}" y1="${to.y.toFixed(2)}" x2="${selected.ax2.toFixed(2)}" y2="${selected.ay2.toFixed(2)}" stroke="#a8b3c2" stroke-width="1.1" stroke-dasharray="5 5"/><line data-dimension-line="true" x1="${selected.ax1.toFixed(2)}" y1="${selected.ay1.toFixed(2)}" x2="${selected.ax2.toFixed(2)}" y2="${selected.ay2.toFixed(2)}" stroke="#0f766e" stroke-width="1.8" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>${renderedLabel}</g>`;
}

export function renderTrg002SolutionDiagramSvg(diagram: AnyDiagram) {
  if (!diagram || typeof diagram !== "object") return `<div class="diagram-missing">No solution diagram specification is available.</div>`;
  const qlId = String(diagram.qlId ?? "unknown");
  const baseWidth = finite(diagram.width ?? 1000, `${qlId}:width`);
  const baseHeight = finite(diagram.height ?? 600, `${qlId}:height`);
  const reviewPadding = 240;
  const width = baseWidth + reviewPadding * 2;
  const height = baseHeight + reviewPadding * 2;
  const core: CoreBounds = {
    left: reviewPadding,
    top: reviewPadding,
    right: reviewPadding + baseWidth,
    bottom: reviewPadding + baseHeight,
  };
  const pointsArray: Point[] = Array.isArray(diagram.points)
    ? diagram.points.map((point: any) => ({
        ...point,
        x: finite(point.x, `${qlId}:${point.id}:x`) + reviewPadding,
        y: finite(point.y, `${qlId}:${point.id}:y`) + reviewPadding,
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
    return `<line data-core-segment="true" data-segment-id="${esc(segment.id)}" data-kind="${esc(segment.kind)}" x1="${from.x.toFixed(2)}" y1="${from.y.toFixed(2)}" x2="${to.x.toFixed(2)}" y2="${to.y.toFixed(2)}" stroke="${style.stroke}" stroke-width="${style.width}"${dash}${marker} stroke-linecap="round"/>`;
  }).join("");

  const rightAngles = (Array.isArray(diagram.rightAngles) ? diagram.rightAngles : []).map((marker: any) => renderRightAngle(marker, points)).join("");
  const angles = (Array.isArray(diagram.angles) ? diagram.angles : []).map((angle: any) => renderAngle(angle, qlId, points, geometrySegments, occupiedLabels, width, height)).join("");

  const seenLabels = new Set<string>();
  const pointLabels = pointsArray.map((point) => {
    if (!point.label) return "";
    const label = String(point.label);
    const key = `${point.x.toFixed(2)}|${point.y.toFixed(2)}|${label}`;
    if (seenLabels.has(key)) return "";
    seenLabels.add(key);
    const placement = chooseLabelPlacement(label, 18, pointLabelCandidates(point), geometrySegments, occupiedLabels, width, height);
    occupiedLabels.push(placement);
    return `<g class="diagram-point" data-point-id="${esc(point.id)}"><circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="5.5" fill="#111827"/>${renderLabelBox(label, placement, "point-label", 18, "#111827")}</g>`;
  }).join("");

  const measurementArrows = [...(Array.isArray(diagram.measurementArrows) ? diagram.measurementArrows : [])]
    .sort((a: any, b: any) => measurementPriority(a, points) - measurementPriority(b, points));
  const measurements = measurementArrows.map((arrow: any) => renderMeasurementArrow(
    arrow,
    qlId,
    points,
    markerId,
    geometrySegments,
    occupiedLabels,
    width,
    height,
    core,
  )).join("");

  const coreFrameX = core.left - 24;
  const coreFrameY = core.top - 24;
  const coreFrameWidth = baseWidth + 48;
  const coreFrameHeight = baseHeight + 48;

  return `<figure class="diagram-figure"><div class="diagram-caption"><b>${esc(qlId)}</b> · ${esc(diagram.strategy ?? "solution geometry")}</div><svg class="solution-diagram" data-diagram-ql="${esc(qlId)}" data-core-left="${core.left}" data-core-top="${core.top}" data-core-right="${core.right}" data-core-bottom="${core.bottom}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Solution geometry for ${esc(qlId)}" preserveAspectRatio="xMidYMid meet"><title>Solution geometry for ${esc(qlId)}</title><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#0f766e"/></marker></defs><rect x="1" y="1" width="${Math.max(0, width - 2)}" height="${Math.max(0, height - 2)}" rx="12" fill="#ffffff" stroke="#e2e8f0"/><rect class="diagram-core-frame" data-core-frame="true" x="${coreFrameX}" y="${coreFrameY}" width="${coreFrameWidth}" height="${coreFrameHeight}" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.4"/>${measurements}${segments}${rightAngles}${angles}${pointLabels}</svg></figure>`;
}
