import type { Coordinate, Direction, SolvedPath } from "../foundation/types";
import { PATH_DIRECTION_LABELS } from "./question-language.en";

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

export interface AskedRelationDiagram {
  readonly fromPointId: string;
  readonly toPointId: string;
  readonly fromLabel: string;
  readonly toLabel: string;
  readonly direction: Direction;
  readonly label: string;
}

export interface FinalFacingDiagram {
  readonly pointId: string;
  readonly direction: Direction;
  readonly label: string;
}

export interface PathDiagramSpec {
  readonly kind: "DIRECTION_PATH_DIAGRAM";
  readonly title: string;
  readonly coordinateConvention: "EAST_POSITIVE_X_NORTH_POSITIVE_Y";
  readonly points: readonly PathDiagramPoint[];
  readonly segments: readonly PathDiagramSegment[];
  readonly askedRelation: AskedRelationDiagram;
  readonly finalFacing: FinalFacingDiagram | null;
  readonly svg: string;
}

function pointLabel(moveIndex: number): string {
  if (moveIndex === 0) return "O";
  return String.fromCharCode(64 + moveIndex);
}

function normalizedNumber(value: number): number {
  const rounded = Math.round(value * 1e9) / 1e9;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function directionUnit(direction: Direction): Coordinate {
  switch (direction) {
    case "NORTH": return { x: 0, y: 1 };
    case "NORTH_EAST": return { x: Math.SQRT1_2, y: Math.SQRT1_2 };
    case "EAST": return { x: 1, y: 0 };
    case "SOUTH_EAST": return { x: Math.SQRT1_2, y: -Math.SQRT1_2 };
    case "SOUTH": return { x: 0, y: -1 };
    case "SOUTH_WEST": return { x: -Math.SQRT1_2, y: -Math.SQRT1_2 };
    case "WEST": return { x: -1, y: 0 };
    case "NORTH_WEST": return { x: -Math.SQRT1_2, y: Math.SQRT1_2 };
  }
}

function renderSvg(spec: Omit<PathDiagramSpec, "svg">): string {
  const width = 720;
  const height = 480;
  const plotLeft = 70;
  const plotRight = width - 70;
  const plotTop = 70;
  const plotBottom = height - 110;
  const coordinates = spec.points.map((point) => point.coordinate);
  const rawMinX = Math.min(...coordinates.map((point) => point.x));
  const rawMaxX = Math.max(...coordinates.map((point) => point.x));
  const rawMinY = Math.min(...coordinates.map((point) => point.y));
  const rawMaxY = Math.max(...coordinates.map((point) => point.y));
  const spanX = Math.max(rawMaxX - rawMinX, 1);
  const spanY = Math.max(rawMaxY - rawMinY, 1);
  const scale = Math.min((plotRight - plotLeft) / spanX, (plotBottom - plotTop) / spanY);
  const offsetX = plotLeft + ((plotRight - plotLeft) - spanX * scale) / 2;
  const offsetY = plotTop + ((plotBottom - plotTop) - spanY * scale) / 2;
  const project = (coordinate: Coordinate) => ({
    x: offsetX + (coordinate.x - rawMinX) * scale,
    y: plotBottom - ((coordinate.y - rawMinY) * scale + ((plotBottom - plotTop) - spanY * scale) / 2),
  });
  const pointById = new Map(spec.points.map((point) => [point.id, point]));

  const routeSegments = spec.segments.map((segment) => {
    const from = project(pointById.get(segment.fromPointId)!.coordinate);
    const to = project(pointById.get(segment.toPointId)!.coordinate);
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    return [
      `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#1f2937" stroke-width="4" marker-end="url(#routeArrow)"/>`,
      `<text x="${midX}" y="${midY - 10}" text-anchor="middle" font-size="14" font-weight="600" fill="#111827">${segment.distance} m ${escapeXml(PATH_DIRECTION_LABELS[segment.direction])}</text>`,
    ].join("");
  }).join("");

  const points = spec.points.map((point) => {
    const projected = project(point.coordinate);
    const fill = point.role === "START" ? "#dbeafe" : point.role === "END" ? "#dcfce7" : "#f3f4f6";
    const coordinateLabel = `(${normalizedNumber(point.coordinate.x)}, ${normalizedNumber(point.coordinate.y)})`;
    return [
      `<circle cx="${projected.x}" cy="${projected.y}" r="18" fill="${fill}" stroke="#111827" stroke-width="2"/>`,
      `<text x="${projected.x}" y="${projected.y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="#111827">${escapeXml(point.label)}</text>`,
      `<text x="${projected.x}" y="${projected.y + 38}" text-anchor="middle" font-size="12" fill="#374151">${escapeXml(coordinateLabel)}</text>`,
    ].join("");
  }).join("");

  const askedFrom = project(pointById.get(spec.askedRelation.fromPointId)!.coordinate);
  const askedTo = project(pointById.get(spec.askedRelation.toPointId)!.coordinate);
  const askedMidX = (askedFrom.x + askedTo.x) / 2;
  const askedMidY = (askedFrom.y + askedTo.y) / 2;
  const askedRelation = [
    `<line x1="${askedFrom.x}" y1="${askedFrom.y}" x2="${askedTo.x}" y2="${askedTo.y}" stroke="#dc2626" stroke-width="3" stroke-dasharray="9 7" marker-end="url(#questionArrow)"/>`,
    `<rect x="${askedMidX - 132}" y="${askedMidY + 12}" width="264" height="30" rx="8" fill="#fff7ed" stroke="#dc2626"/>`,
    `<text x="${askedMidX}" y="${askedMidY + 32}" text-anchor="middle" font-size="13" font-weight="700" fill="#991b1b">${escapeXml(spec.askedRelation.label)}</text>`,
  ].join("");

  let finalFacing = "";
  if (spec.finalFacing) {
    const point = project(pointById.get(spec.finalFacing.pointId)!.coordinate);
    const unit = directionUnit(spec.finalFacing.direction);
    const arrowEnd = { x: point.x + unit.x * 52, y: point.y - unit.y * 52 };
    finalFacing = [
      `<line x1="${point.x}" y1="${point.y}" x2="${arrowEnd.x}" y2="${arrowEnd.y}" stroke="#7c3aed" stroke-width="4" marker-end="url(#facingArrow)"/>`,
      `<text x="${arrowEnd.x}" y="${arrowEnd.y - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="#5b21b6">${escapeXml(spec.finalFacing.label)}</text>`,
    ].join("");
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(spec.title)}">`,
    `<defs>`,
    `<marker id="routeArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1f2937"/></marker>`,
    `<marker id="questionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#dc2626"/></marker>`,
    `<marker id="facingArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#7c3aed"/></marker>`,
    `</defs>`,
    `<rect x="1" y="1" width="718" height="478" rx="16" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="360" y="34" text-anchor="middle" font-size="20" font-weight="700" fill="#111827">${escapeXml(spec.title)}</text>`,
    `<text x="360" y="56" text-anchor="middle" font-size="12" fill="#4b5563">East is +x; North is +y. Diagram is not necessarily to scale.</text>`,
    routeSegments,
    askedRelation,
    finalFacing,
    points,
    `<text x="70" y="448" font-size="13" font-weight="700" fill="#991b1b">Dashed red arrow = the exact relation asked in the question</text>`,
    spec.finalFacing ? `<text x="70" y="468" font-size="13" font-weight="700" fill="#5b21b6">Purple arrow = final facing direction</text>` : "",
    `</svg>`,
  ].join("");
}

export function buildPathDiagram(
  solved: SolvedPath,
  reverseQuery: boolean,
  askedDirection: Direction,
  includeFinalFacing: boolean,
): PathDiagramSpec {
  const points: PathDiagramPoint[] = [
    { id: "P0", label: "O", coordinate: solved.initial.position, role: "START" },
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
      label: pointLabel(moveIndex),
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
  points[points.length - 1] = { ...finalPoint, role: "END" };
  const fromPoint = reverseQuery ? finalPoint : points[0];
  const toPoint = reverseQuery ? points[0] : finalPoint;
  const askedRelation: AskedRelationDiagram = {
    fromPointId: fromPoint.id,
    toPointId: toPoint.id,
    fromLabel: fromPoint.label,
    toLabel: toPoint.label,
    direction: askedDirection,
    label: `Asked: ${toPoint.label} from ${fromPoint.label} = ${PATH_DIRECTION_LABELS[askedDirection]}`,
  };
  const finalFacing: FinalFacingDiagram | null = includeFinalFacing
    ? {
        pointId: finalPoint.id,
        direction: solved.final.facing,
        label: `Facing ${PATH_DIRECTION_LABELS[solved.final.facing]}`,
      }
    : null;
  const withoutSvg: Omit<PathDiagramSpec, "svg"> = {
    kind: "DIRECTION_PATH_DIAGRAM",
    title: "Movement path and asked relation",
    coordinateConvention: "EAST_POSITIVE_X_NORTH_POSITIVE_Y",
    points,
    segments,
    askedRelation,
    finalFacing,
  };
  return { ...withoutSvg, svg: renderSvg(withoutSvg) };
}
