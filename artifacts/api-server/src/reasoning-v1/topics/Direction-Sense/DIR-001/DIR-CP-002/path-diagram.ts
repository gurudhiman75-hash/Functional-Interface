import type { Coordinate, Direction, SolvedPath } from "../foundation/types";

export interface PathDiagramPoint {
  readonly id: string;
  readonly label: string;
  readonly coordinate: Coordinate;
  readonly role: "START" | "WAYPOINT" | "END";
}

export interface PathDiagramSegment {
  readonly sequence: number;
  readonly fromPointId: string;
  readonly toPointId: string;
  readonly distance: number;
  readonly direction: Direction;
}

export interface PathDiagramSpec {
  readonly kind: "DIRECTION_PATH_DIAGRAM";
  readonly title: string;
  readonly coordinateConvention: "EAST_POSITIVE_X_NORTH_POSITIVE_Y";
  readonly points: readonly PathDiagramPoint[];
  readonly segments: readonly PathDiagramSegment[];
  readonly svg: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderSvg(spec: Omit<PathDiagramSpec, "svg">): string {
  const width = 720;
  const height = 460;
  const plotLeft = 80;
  const plotRight = width - 80;
  const plotTop = 82;
  const plotBottom = height - 62;
  const coordinates = spec.points.map((point) => point.coordinate);
  const rawMinX = Math.min(...coordinates.map((point) => point.x));
  const rawMaxX = Math.max(...coordinates.map((point) => point.x));
  const rawMinY = Math.min(...coordinates.map((point) => point.y));
  const rawMaxY = Math.max(...coordinates.map((point) => point.y));
  const spanX = Math.max(rawMaxX - rawMinX, 1);
  const spanY = Math.max(rawMaxY - rawMinY, 1);
  const scale = Math.min((plotRight - plotLeft) / spanX, (plotBottom - plotTop) / spanY);
  const horizontalPadding = ((plotRight - plotLeft) - spanX * scale) / 2;
  const verticalPadding = ((plotBottom - plotTop) - spanY * scale) / 2;
  const project = (coordinate: Coordinate) => ({
    x: plotLeft + horizontalPadding + (coordinate.x - rawMinX) * scale,
    y: plotBottom - verticalPadding - (coordinate.y - rawMinY) * scale,
  });
  const pointById = new Map(spec.points.map((point) => [point.id, point]));

  const routeLines = spec.segments.map((segment) => {
    const from = project(pointById.get(segment.fromPointId)!.coordinate);
    const to = project(pointById.get(segment.toPointId)!.coordinate);
    return `<line data-role="movement-leg" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#1f2937" stroke-width="4" stroke-linecap="round" marker-end="url(#routeArrow)"/>`;
  }).join("");

  const distanceLabels = spec.segments.map((segment, index) => {
    const from = project(pointById.get(segment.fromPointId)!.coordinate);
    const to = project(pointById.get(segment.toPointId)!.coordinate);
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const vertical = Math.abs(to.x - from.x) < 1e-9;
    const side = index % 2 === 0 ? 1 : -1;
    const labelX = vertical ? midX + side * 31 : midX;
    const labelY = vertical ? midY : midY - side * 24;
    const text = `${segment.distance} m`;
    return [
      `<g data-role="distance-label">`,
      `<rect x="${labelX - 27}" y="${labelY - 14}" width="54" height="28" rx="7" fill="#ffffff" stroke="#cbd5e1"/>`,
      `<text x="${labelX}" y="${labelY + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#111827">${escapeXml(text)}</text>`,
      `</g>`,
    ].join("");
  }).join("");

  const points = spec.points.map((point) => {
    const projected = project(point.coordinate);
    if (point.role === "WAYPOINT") {
      return `<circle data-role="turn-point" cx="${projected.x}" cy="${projected.y}" r="5" fill="#475569" stroke="#ffffff" stroke-width="2"/>`;
    }
    const isStart = point.role === "START";
    const fill = isStart ? "#dbeafe" : "#dcfce7";
    const letter = isStart ? "S" : "F";
    const label = isStart ? "Start" : "Finish";
    const labelX = projected.x + (isStart ? -28 : 30);
    const labelY = projected.y + (isStart ? -25 : 31);
    return [
      `<g data-role="${isStart ? "start-point" : "finish-point"}">`,
      `<circle cx="${projected.x}" cy="${projected.y}" r="18" fill="${fill}" stroke="#111827" stroke-width="2.5"/>`,
      `<text x="${projected.x}" y="${projected.y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#111827">${letter}</text>`,
      `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="13" font-weight="800" fill="#111827" stroke="#ffffff" stroke-width="5" paint-order="stroke">${label}</text>`,
      `</g>`,
    ].join("");
  }).join("");

  const compass = [
    `<g data-role="compass" transform="translate(654 80)">`,
    `<circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#94a3b8"/>`,
    `<line x1="0" y1="17" x2="0" y2="-18" stroke="#334155" stroke-width="2" marker-end="url(#compassArrow)"/>`,
    `<line x1="-17" y1="0" x2="17" y2="0" stroke="#94a3b8" stroke-width="1.5"/>`,
    `<text x="0" y="-34" text-anchor="middle" font-size="11" font-weight="800">N</text>`,
    `<text x="33" y="4" text-anchor="middle" font-size="11" font-weight="800">E</text>`,
    `<text x="0" y="39" text-anchor="middle" font-size="11" font-weight="800">S</text>`,
    `<text x="-33" y="4" text-anchor="middle" font-size="11" font-weight="800">W</text>`,
    `</g>`,
  ].join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(spec.title)}">`,
    `<defs>`,
    `<marker id="routeArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1f2937"/></marker>`,
    `<marker id="compassArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker>`,
    `</defs>`,
    `<rect x="1" y="1" width="718" height="458" rx="14" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="360" y="35" text-anchor="middle" font-size="18" font-weight="800" fill="#111827">Movement path</text>`,
    routeLines,
    points,
    distanceLabels,
    compass,
    `<text x="360" y="438" text-anchor="middle" font-size="11" fill="#64748b">Diagram is not necessarily to scale.</text>`,
    `</svg>`,
  ].join("");
}

export function buildPathDiagram(solved: SolvedPath): PathDiagramSpec {
  const points: PathDiagramPoint[] = [
    { id: "P0", label: "Start", coordinate: solved.initial.position, role: "START" },
  ];
  const segments: PathDiagramSegment[] = [];
  let moveIndex = 0;

  for (const trace of solved.trace) {
    if (trace.operation.kind !== "MOVE") continue;
    const fromPointId = `P${moveIndex}`;
    moveIndex += 1;
    const toPointId = `P${moveIndex}`;
    points.push({
      id: toPointId,
      label: `Turn ${moveIndex}`,
      coordinate: trace.after.position,
      role: "WAYPOINT",
    });
    segments.push({
      sequence: moveIndex,
      fromPointId,
      toPointId,
      distance: trace.operation.distance,
      direction: trace.movementDirection!,
    });
  }

  const finalPoint = points.at(-1)!;
  points[points.length - 1] = { ...finalPoint, label: "Finish", role: "END" };
  const withoutSvg: Omit<PathDiagramSpec, "svg"> = {
    kind: "DIRECTION_PATH_DIAGRAM",
    title: "Movement path",
    coordinateConvention: "EAST_POSITIVE_X_NORTH_POSITIVE_Y",
    points,
    segments,
  };
  return { ...withoutSvg, svg: renderSvg(withoutSvg) };
}
