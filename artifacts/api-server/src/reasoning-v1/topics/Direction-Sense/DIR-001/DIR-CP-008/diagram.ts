import { addCoordinates } from "../foundation/coordinates";
import { solveEntityPositions } from "../foundation/entity-position-graph";
import type { Coordinate, PositionRelation } from "../foundation/types";
import { cardinalVector } from "./geometry";
import type { AdvancedDiagram, HybridScenario, MixedGraphMovementScenario } from "./types";

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
    return `<g data-role="${role}" data-index="${index}"><line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#475569" stroke-width="3" marker-end="url(#arrow)"/><text x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 8}" text-anchor="middle" font-size="13" fill="#334155">${esc(relation.fromEntity)} to ${esc(relation.toEntity)}</text></g>`;
  }).join("");
}

function nodeSvg(coordinates: Readonly<Record<string, Coordinate>>): string {
  return Object.entries(coordinates).map(([name, point]) => `<g data-role="entity-node"><circle cx="${point.x}" cy="${point.y}" r="19" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-size="13" font-weight="800">${esc(name)}</text></g>`).join("");
}

function frame(title: string, body: string, width = 760, height = 460): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#475569"/></marker><marker id="path-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#059669"/></marker></defs><rect width="${width}" height="${height}" rx="18" fill="#fff"/><rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="16" fill="#f8fafc" stroke="#cbd5e1"/><text x="28" y="42" font-size="20" font-weight="800">${esc(title)}</text>${body}</svg>`;
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

export function buildHybridQuestionDiagram(scenario: HybridScenario): AdvancedDiagram {
  const solved = solveEntityPositions(scenario.diagramRelations);
  if (!solved.connected || solved.contradictions.length) throw new Error("Cannot draw invalid hybrid premises");
  const coordinates = normalizePoints(solved.coordinates);
  const title = "Use the diagram together with the statement";
  const svg = frame(title, `${relationSvg(scenario.diagramRelations, coordinates, "diagram-premise")}${nodeSvg(coordinates)}`);
  return { kind: "DIAGRAM_TEXT_HYBRID", title, svg };
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
