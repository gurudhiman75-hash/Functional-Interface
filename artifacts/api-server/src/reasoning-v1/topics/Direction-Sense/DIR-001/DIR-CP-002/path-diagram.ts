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

function labelBox(
  text: string,
  x: number,
  y: number,
  options: { readonly fill?: string; readonly stroke?: string; readonly textColor?: string; readonly role: string },
): string {
  const width = Math.max(58, Math.min(330, text.length * 7.2 + 24));
  const height = 28;
  return [
    `<g data-role="${options.role}">`,
    `<rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}" rx="7" fill="${options.fill ?? "#ffffff"}" stroke="${options.stroke ?? "#cbd5e1"}" stroke-width="1.5"/>`,
    `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="${options.textColor ?? "#111827"}">${escapeXml(text)}</text>`,
    `</g>`,
  ].join("");
}

function renderSvg(spec: Omit<PathDiagramSpec, "svg">): string {
  const width = 760;
  const height = 520;
  const plotLeft = 105;
  const plotRight = width - 105;
  const plotTop = 105;
  const plotBottom = 390;
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
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#1f2937" stroke-width="4" stroke-linecap="round" marker-end="url(#routeArrow)"/>`;
  }).join("");

  const routeLabels = spec.segments.map((segment) => {
    const from = project(pointById.get(segment.fromPointId)!.coordinate);
    const to = project(pointById.get(segment.toPointId)!.coordinate);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(Math.hypot(dx, dy), 1);
    const normalX = -dy / length;
    const normalY = dx / length;
    const sign = segment.sequence % 2 === 0 ? -1 : 1;
    const offset = sign * (30 + ((segment.sequence - 1) % 3) * 16);
    const labelX = (from.x + to.x) / 2 + normalX * offset;
    const labelY = (from.y + to.y) / 2 + normalY * offset;
    const text = `${segment.distance} m ${PATH_DIRECTION_LABELS[segment.direction]}`;
    return labelBox(text, labelX, labelY, { role: "segment-label" });
  }).join("");

  const askedFrom = project(pointById.get(spec.askedRelation.fromPointId)!.coordinate);
  const askedTo = project(pointById.get(spec.askedRelation.toPointId)!.coordinate);
  const askedDx = askedTo.x - askedFrom.x;
  const askedDy = askedTo.y - askedFrom.y;
  const askedLength = Math.max(Math.hypot(askedDx, askedDy), 1);
  const askedNormalX = -askedDy / askedLength;
  const askedNormalY = askedDx / askedLength;
  const curveOffset = 48;
  const controlX = (askedFrom.x + askedTo.x) / 2 + askedNormalX * curveOffset;
  const controlY = (askedFrom.y + askedTo.y) / 2 + askedNormalY * curveOffset;
  const askedCurve = `<path data-role="asked-relation-arrow" d="M ${askedFrom.x} ${askedFrom.y} Q ${controlX} ${controlY} ${askedTo.x} ${askedTo.y}" fill="none" stroke="#dc2626" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round" marker-end="url(#questionArrow)"/>`;
  const askedLabel = labelBox(spec.askedRelation.label, width / 2, 454, {
    fill: "#fff7ed",
    stroke: "#dc2626",
    textColor: "#991b1b",
    role: "asked-relation-label",
  });

  let finalFacingArrow = "";
  let finalFacingLabel = "";
  if (spec.finalFacing) {
    const point = project(pointById.get(spec.finalFacing.pointId)!.coordinate);
    const unit = directionUnit(spec.finalFacing.direction);
    const arrowEnd = { x: point.x + unit.x * 54, y: point.y - unit.y * 54 };
    finalFacingArrow = `<line data-role="final-facing-arrow" x1="${point.x}" y1="${point.y}" x2="${arrowEnd.x}" y2="${arrowEnd.y}" stroke="#7c3aed" stroke-width="4" stroke-linecap="round" marker-end="url(#facingArrow)"/>`;
    finalFacingLabel = labelBox(spec.finalFacing.label, arrowEnd.x, arrowEnd.y - 22, {
      fill: "#faf5ff",
      stroke: "#7c3aed",
      textColor: "#5b21b6",
      role: "final-facing-label",
    });
  }

  const points = spec.points.map((point) => {
    const projected = project(point.coordinate);
    const fill = point.role === "START" ? "#dbeafe" : point.role === "END" ? "#dcfce7" : "#f3f4f6";
    return [
      `<circle cx="${projected.x}" cy="${projected.y}" r="19" fill="${fill}" stroke="#111827" stroke-width="2.5"/>`,
      `<text x="${projected.x}" y="${projected.y + 5}" text-anchor="middle" font-size="15" font-weight="800" fill="#111827">${escapeXml(point.label)}</text>`,
    ].join("");
  }).join("");

  const compass = [
    `<g data-role="compass" transform="translate(62 95)">`,
    `<circle cx="0" cy="0" r="30" fill="#ffffff" stroke="#94a3b8"/>`,
    `<line x1="0" y1="18" x2="0" y2="-19" stroke="#334155" stroke-width="2" marker-end="url(#compassArrow)"/>`,
    `<line x1="-18" y1="0" x2="18" y2="0" stroke="#94a3b8" stroke-width="1.5"/>`,
    `<text x="0" y="-35" text-anchor="middle" font-size="12" font-weight="800">N</text>`,
    `<text x="35" y="4" text-anchor="middle" font-size="12" font-weight="800">E</text>`,
    `<text x="0" y="43" text-anchor="middle" font-size="12" font-weight="800">S</text>`,
    `<text x="-35" y="4" text-anchor="middle" font-size="12" font-weight="800">W</text>`,
    `</g>`,
  ].join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(spec.title)}">`,
    `<defs>`,
    `<marker id="routeArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#1f2937"/></marker>`,
    `<marker id="questionArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#dc2626"/></marker>`,
    `<marker id="facingArrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#7c3aed"/></marker>`,
    `<marker id="compassArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker>`,
    `</defs>`,
    `<rect x="1" y="1" width="758" height="518" rx="16" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="380" y="34" text-anchor="middle" font-size="20" font-weight="800" fill="#111827">${escapeXml(spec.title)}</text>`,
    `<text x="380" y="57" text-anchor="middle" font-size="12" fill="#475569">Arrows show movement. The diagram is not necessarily to scale.</text>`,
    compass,
    routeLines,
    askedCurve,
    finalFacingArrow,
    points,
    routeLabels,
    finalFacingLabel,
    askedLabel,
    `<text x="380" y="494" text-anchor="middle" font-size="12" fill="#64748b">Dashed red curve shows the exact relation asked in the question.</text>`,
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
        label: `Final facing: ${PATH_DIRECTION_LABELS[solved.final.facing]}`,
      }
    : null;
  const withoutSvg: Omit<PathDiagramSpec, "svg"> = {
    kind: "DIRECTION_PATH_DIAGRAM",
    title: "Movement diagram",
    coordinateConvention: "EAST_POSITIVE_X_NORTH_POSITIVE_Y",
    points,
    segments,
    askedRelation,
    finalFacing,
  };
  return { ...withoutSvg, svg: renderSvg(withoutSvg) };
}
