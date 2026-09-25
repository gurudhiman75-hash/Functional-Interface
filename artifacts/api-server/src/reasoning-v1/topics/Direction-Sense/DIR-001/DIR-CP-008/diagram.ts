import { addCoordinates } from "../foundation/coordinates";
import { solveEntityPositions } from "../foundation/entity-position-graph";
import type { Coordinate, Direction, PositionRelation } from "../foundation/types";
import { DIRECTION_LABELS, cardinalVector, directionFromVector, turnFacing } from "./geometry";
import type { AdvancedDiagram, HybridScenario, MixedGraphMovementScenario, RelativePathOperation } from "./types";

const esc = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function normalizePoints(coordinates: Readonly<Record<string, Coordinate>>, width = 760, height = 460): Readonly<Record<string, Coordinate>> {
  const entries = Object.entries(coordinates);
  const xs = entries.map(([, point]) => point.x), ys = entries.map(([, point]) => point.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(1, maxX - minX), spanY = Math.max(1, maxY - minY);
  const availableWidth = width - 160, availableHeight = height - 160;
  const scale = Math.min(availableWidth / spanX, availableHeight / spanY);
  const usedWidth = spanX * scale, usedHeight = spanY * scale;
  const left = 80 + (availableWidth - usedWidth) / 2;
  const bottom = 80 + (availableHeight - usedHeight) / 2;
  return Object.fromEntries(entries.map(([name, point]) => [name, {
    x: left + (point.x - minX) * scale,
    y: height - bottom - (point.y - minY) * scale,
  }]));
}

function relationSvg(relations: readonly PositionRelation[], coordinates: Readonly<Record<string, Coordinate>>, role = "relation-edge"): string {
  return relations.map((relation, index) => {
    const from = coordinates[relation.fromEntity], to = coordinates[relation.toEntity];
    const direction = directionFromVector(relation.vector);
    const distance = Math.max(Math.abs(relation.vector.x), Math.abs(relation.vector.y));
    return `<g data-role="${role}" data-index="${index}"><line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#475569" stroke-width="3" marker-end="url(#arrow)"/><text x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 8}" text-anchor="middle" font-size="13" fill="#334155">${distance} m ${DIRECTION_LABELS[direction]}</text></g>`;
  }).join("");
}

function nodeSvg(coordinates: Readonly<Record<string, Coordinate>>): string {
  return Object.entries(coordinates).map(([name, point]) => `<g data-role="entity-node"><circle cx="${point.x}" cy="${point.y}" r="19" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-size="13" font-weight="800">${esc(name)}</text></g>`).join("");
}

function frame(title: string, body: string, width = 760, height = 460): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#475569"/></marker><marker id="path-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#059669"/></marker></defs><rect width="${width}" height="${height}" rx="18" fill="#fff"/><rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="16" fill="#f8fafc" stroke="#cbd5e1"/><text x="28" y="42" font-size="20" font-weight="800">${esc(title)}</text>${body}</svg>`;
}


type SolvedDiagramLeg = {
  readonly direction: Direction;
  readonly distance: number;
};

function buildSolvedPathDiagram(
  legs: readonly SolvedDiagramLeg[],
  shortestDistanceLabel?: string,
): AdvancedDiagram {
  if (legs.length === 0) throw new Error("Solved path diagram requires at least one movement leg");

  const rawPoints: Coordinate[] = [{ x: 0, y: 0 }];
  for (const leg of legs) {
    rawPoints.push(addCoordinates(rawPoints[rawPoints.length - 1], cardinalVector(leg.direction, leg.distance)));
  }

  const rawCoordinates = Object.fromEntries(rawPoints.map((point, index) => [`P${index}`, point]));
  const coordinates = normalizePoints(rawCoordinates);
  const projected = rawPoints.map((_, index) => coordinates[`P${index}`]);

  const endpointGuide = (() => {
    const start = projected[0];
    const finish = projected[projected.length - 1];
    const label = shortestDistanceLabel
      ? `<g data-role="shortest-distance-key"><rect x="${(start.x + finish.x) / 2 - 40}" y="${(start.y + finish.y) / 2 - 29}" width="80" height="24" rx="6" fill="#eff6ff" stroke="#60a5fa"/><text x="${(start.x + finish.x) / 2}" y="${(start.y + finish.y) / 2 - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="#1e3a8a">${esc(shortestDistanceLabel)}</text></g>`
      : "";
    return `<line data-role="endpoint-guide" x1="${start.x}" y1="${start.y}" x2="${finish.x}" y2="${finish.y}" stroke="#2563eb" stroke-width="2.2" stroke-dasharray="8 6" opacity="0.75"/>${label}`;
  })();

  const route = legs.map((leg, index) => {
    const from = projected[index];
    const to = projected[index + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(Math.hypot(dx, dy), 1);
    const side = index % 2 === 0 ? 1 : -1;
    const perpX = -dy / length;
    const perpY = dx / length;
    const labelX = (from.x + to.x) / 2 + perpX * 24 * side;
    const labelY = (from.y + to.y) / 2 + perpY * 24 * side;
    return [
      `<line data-role="movement-leg" data-index="${index}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#334155" stroke-width="3" stroke-linecap="round" marker-end="url(#path-arrow)"/>`,
      `<g data-role="movement-distance"><rect x="${labelX - 28}" y="${labelY - 13}" width="56" height="26" rx="6" fill="#ffffff" stroke="#cbd5e1"/><text x="${labelX}" y="${labelY + 4}" text-anchor="middle" font-size="12" font-weight="800">${leg.distance} m</text></g>`,
    ].join("");
  }).join("");

  const start = projected[0];
  const finish = projected[projected.length - 1];
  const waypoints = projected.slice(1, -1).map((point, index) =>
    `<circle data-role="turn-point" data-index="${index + 1}" cx="${point.x}" cy="${point.y}" r="5" fill="#ffffff" stroke="#475569" stroke-width="2"/>`
  ).join("");
  const endpoints = [
    `<g data-role="start-point"><circle cx="${start.x}" cy="${start.y}" r="15" fill="#dbeafe" stroke="#1e3a8a" stroke-width="2"/><text x="${start.x}" y="${start.y + 5}" text-anchor="middle" font-size="12" font-weight="900">S</text></g>`,
    `<g data-role="finish-point"><circle cx="${finish.x}" cy="${finish.y}" r="15" fill="#dcfce7" stroke="#047857" stroke-width="2"/><text x="${finish.x}" y="${finish.y + 5}" text-anchor="middle" font-size="12" font-weight="900">F</text></g>`,
  ].join("");

  const compass = `<g data-role="compass" transform="translate(690 82)"><circle r="27" fill="#ffffff" stroke="#94a3b8"/><line x1="0" y1="15" x2="0" y2="-17" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/><line x1="-15" y1="0" x2="15" y2="0" stroke="#94a3b8"/><text x="0" y="-33" text-anchor="middle" font-size="11" font-weight="800">N</text><text x="31" y="4" text-anchor="middle" font-size="11" font-weight="800">E</text><text x="0" y="37" text-anchor="middle" font-size="11" font-weight="800">S</text><text x="-31" y="4" text-anchor="middle" font-size="11" font-weight="800">W</text></g>`;

  const title = "Movement path";
  return {
    kind: "PATH_SOLUTION",
    title,
    svg: frame(title, `${endpointGuide}${route}${waypoints}${endpoints}${compass}`),
  };
}

export function buildAbsoluteMovementSolutionDiagram(
  legs: readonly { readonly direction: Direction; readonly distance: number }[],
  shortestDistanceLabel?: string,
): AdvancedDiagram {
  return buildSolvedPathDiagram(legs, shortestDistanceLabel);
}

export function buildRelativeMovementSolutionDiagram(
  initialFacing: Direction,
  operations: readonly RelativePathOperation[],
  shortestDistanceLabel?: string,
): AdvancedDiagram {
  let facing = initialFacing;
  const legs: SolvedDiagramLeg[] = [];
  for (const operation of operations) {
    if (operation.kind === "TURN") {
      facing = turnFacing(facing, operation.turn);
    } else {
      legs.push({ direction: facing, distance: operation.distance });
    }
  }
  return buildSolvedPathDiagram(legs, shortestDistanceLabel);
}

export function buildRelationDiagram(relations: readonly PositionRelation[], title: string): AdvancedDiagram {
  const solved = solveEntityPositions(relations);
  if (!solved.connected || solved.contradictions.length) throw new Error("Cannot draw an invalid relation graph");
  const coordinates = normalizePoints(solved.coordinates);
  const svg = frame(title, `${relationSvg(relations, coordinates)}${nodeSvg(coordinates)}`);
  return { kind: "RELATION_GRAPH", title, svg };
}

export function buildMixedGraphMovementDiagram(scenario: MixedGraphMovementScenario): AdvancedDiagram {
  const solved = solveEntityPositions(scenario.relations);
  if (!solved.connected || solved.contradictions.length) throw new Error("Cannot draw an invalid mixed graph");
  const raw: Record<string, Coordinate> = { ...solved.coordinates };
  let current = raw[scenario.startEntity];
  for (const movement of scenario.movements) current = addCoordinates(current, cardinalVector(movement.direction, movement.distance));
  raw["Final"] = current;
  const coordinates = normalizePoints(raw);
  const start = coordinates[scenario.startEntity], endpoint = coordinates["Final"];
  const movementLine = `<line data-role="movement-segment" x1="${start.x}" y1="${start.y}" x2="${endpoint.x}" y2="${endpoint.y}" stroke="#059669" stroke-width="4" marker-end="url(#path-arrow)"/><text x="${(start.x + endpoint.x) / 2}" y="${(start.y + endpoint.y) / 2 - 10}" text-anchor="middle" font-size="13" font-weight="700" fill="#047857">movement</text>`;
  const graphCoordinates = Object.fromEntries(Object.entries(coordinates).filter(([name]) => name !== "Final"));
  const endpointNode = `<g data-role="final-point"><circle cx="${endpoint.x}" cy="${endpoint.y}" r="17" fill="#dcfce7" stroke="#059669" stroke-width="2"/><text x="${endpoint.x}" y="${endpoint.y + 5}" text-anchor="middle" font-size="12" font-weight="800">Final</text></g>`;
  const svg = frame("Static layout followed by movement", `${relationSvg(scenario.relations, graphCoordinates)}${movementLine}${nodeSvg(graphCoordinates)}${endpointNode}`);
  return { kind: "GRAPH_AND_PATH", title: "Static layout followed by movement", svg };
}

export function buildHybridExplanationDiagram(scenario: HybridScenario): AdvancedDiagram {
  const all = [...scenario.diagramRelations, scenario.textRelation];
  const solved = solveEntityPositions(all);
  if (!solved.connected || solved.contradictions.length) throw new Error("Cannot draw invalid hybrid solution");
  const coordinates = normalizePoints(solved.coordinates);
  const title = "Combined diagram and text relations";
  const svg = frame(title, `${relationSvg(scenario.diagramRelations, coordinates, "diagram-premise")}${relationSvg([scenario.textRelation], coordinates, "text-premise")}${nodeSvg(coordinates)}`);
  return { kind: "DIAGRAM_TEXT_HYBRID", title, svg };
}
