import type { Coordinate } from "../foundation/types";
import { CODE_SYMBOLS, type CodeRecoveryEvidence, type CodedDirectionDiagramSpec, type CodedMovementStep, type CodedRelation, type DirectionCodeMap } from "./types";
import { DIRECTION_LABELS } from "./code-system";

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

interface Projector {
  readonly project: (coordinate: Coordinate) => Coordinate;
  readonly plotLeft: number;
  readonly plotRight: number;
  readonly plotTop: number;
  readonly plotBottom: number;
}

function projector(points: readonly Coordinate[]): Projector {
  const plotLeft = 70;
  const plotRight = 550;
  const plotTop = 88;
  const plotBottom = 408;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min((plotRight - plotLeft) / spanX, (plotBottom - plotTop) / spanY);
  const xPad = ((plotRight - plotLeft) - spanX * scale) / 2;
  const yPad = ((plotBottom - plotTop) - spanY * scale) / 2;
  return {
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
    project: (point) => ({
      x: plotLeft + xPad + (point.x - minX) * scale,
      y: plotBottom - yPad - (point.y - minY) * scale,
    }),
  };
}

function compass(): string {
  return [
    `<g data-role="compass" transform="translate(665 82)">`,
    `<circle cx="0" cy="0" r="30" fill="#ffffff" stroke="#94a3b8"/>`,
    `<line x1="0" y1="18" x2="0" y2="-19" stroke="#334155" stroke-width="2" marker-end="url(#compassArrow)"/>`,
    `<line x1="-18" y1="0" x2="18" y2="0" stroke="#94a3b8" stroke-width="1.5"/>`,
    `<text x="0" y="-36" text-anchor="middle" font-size="11" font-weight="800">N</text>`,
    `<text x="35" y="4" text-anchor="middle" font-size="11" font-weight="800">E</text>`,
    `<text x="0" y="42" text-anchor="middle" font-size="11" font-weight="800">S</text>`,
    `<text x="-35" y="4" text-anchor="middle" font-size="11" font-weight="800">W</text>`,
    `</g>`,
  ].join("");
}

function codeKey(map: DirectionCodeMap, y = 145): string {
  const rows = CODE_SYMBOLS.map((symbol, index) => {
    const rowY = y + index * 48;
    return [
      `<g data-role="code-key-row" data-symbol="${escapeXml(symbol)}">`,
      `<rect x="590" y="${rowY}" width="150" height="38" rx="9" fill="#f8fafc" stroke="#cbd5e1"/>`,
      `<rect x="600" y="${rowY + 6}" width="30" height="26" rx="6" fill="#eef2ff" stroke="#818cf8"/>`,
      `<text x="615" y="${rowY + 24}" text-anchor="middle" font-size="17" font-weight="900" fill="#312e81">${escapeXml(symbol)}</text>`,
      `<text x="640" y="${rowY + 24}" font-size="12" font-weight="750" fill="#111827">${escapeXml(DIRECTION_LABELS[map[symbol]])}</text>`,
      `</g>`,
    ].join("");
  }).join("");
  return `<g data-role="code-key"><text x="665" y="${y - 14}" text-anchor="middle" font-size="13" font-weight="850" fill="#334155">Code key</text>${rows}</g>`;
}

function svgFrame(title: string, body: string, footer: string): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" role="img" aria-label="${escapeXml(title)}">`,
    `<defs>`,
    `<marker id="relationArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker>`,
    `<marker id="pathArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#7c3aed"/></marker>`,
    `<marker id="compassArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker>`,
    `</defs>`,
    `<rect x="1" y="1" width="778" height="498" rx="15" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="390" y="35" text-anchor="middle" font-size="18" font-weight="850" fill="#111827">${escapeXml(title)}</text>`,
    body,
    `<text x="390" y="478" text-anchor="middle" font-size="11" fill="#64748b">${escapeXml(footer)}</text>`,
    `</svg>`,
  ].join("");
}

export function buildCodedRelationDiagram(
  coordinates: Readonly<Record<string, Coordinate>>,
  relations: readonly CodedRelation[],
  map: DirectionCodeMap,
  options: { readonly queryPair?: { readonly subject: string; readonly reference: string }; readonly title?: string } = {},
): CodedDirectionDiagramSpec {
  const entries = Object.entries(coordinates);
  if (entries.length < 2) throw new Error("Coded relation diagram requires at least two entities");
  const projection = projector(entries.map(([, coordinate]) => coordinate));
  const projected = new Map(entries.map(([entity, coordinate]) => [entity, projection.project(coordinate)]));

  const relationParts = relations.map((relation, index) => {
    const subject = projected.get(relation.subject);
    const reference = projected.get(relation.reference);
    if (!subject || !reference) throw new Error("Coded relation diagram references an unknown entity");
    const dx = subject.x - reference.x;
    const dy = subject.y - reference.y;
    const length = Math.max(Math.hypot(dx, dy), 1);
    const perpX = -dy / length;
    const perpY = dx / length;
    const side = index % 2 === 0 ? 1 : -1;
    const labelX = (subject.x + reference.x) / 2 + perpX * 23 * side;
    const labelY = (subject.y + reference.y) / 2 + perpY * 23 * side;
    return {
      edge: `<line data-role="coded-relation-edge" x1="${reference.x}" y1="${reference.y}" x2="${subject.x}" y2="${subject.y}" stroke="#64748b" stroke-width="2.5" marker-end="url(#relationArrow)"/>`,
      label: `<g data-role="coded-relation-label" data-symbol="${escapeXml(relation.symbol)}"><rect x="${labelX - 17}" y="${labelY - 14}" width="34" height="28" rx="7" fill="#ffffff" stroke="#a5b4fc"/><text x="${labelX}" y="${labelY + 6}" text-anchor="middle" font-size="17" font-weight="900" fill="#3730a3">${escapeXml(relation.symbol)}</text></g>`,
    };
  });

  const queryGuide = options.queryPair
    ? (() => {
        const subject = projected.get(options.queryPair!.subject);
        const reference = projected.get(options.queryPair!.reference);
        if (!subject || !reference) throw new Error("Coded query guide references an unknown entity");
        return `<line data-role="coded-query-guide" x1="${reference.x}" y1="${reference.y}" x2="${subject.x}" y2="${subject.y}" stroke="#2563eb" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round" opacity="0.9"/>`;
      })()
    : "";

  const nodes = entries.map(([entity]) => {
    const point = projected.get(entity)!;
    const radius = Math.max(22, Math.min(36, 18 + entity.length * 1.75));
    const highlighted = options.queryPair && (entity === options.queryPair.subject || entity === options.queryPair.reference);
    return [
      `<g data-role="coded-position-node" data-entity="${escapeXml(entity)}">`,
      `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${highlighted ? "#eff6ff" : "#ffffff"}" stroke="${highlighted ? "#2563eb" : "#111827"}" stroke-width="${highlighted ? 3 : 2.2}"/>`,
      `<text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-size="13" font-weight="850" fill="#111827">${escapeXml(entity)}</text>`,
      `</g>`,
    ].join("");
  }).join("");

  const body = [
    relationParts.map((part) => part.edge).join(""),
    queryGuide,
    relationParts.map((part) => part.label).join(""),
    nodes,
    compass(),
    codeKey(map),
  ].join("");
  const title = options.title ?? "Decoded coded relations";
  return {
    kind: "CODED_RELATION_DIAGRAM",
    title,
    svg: svgFrame(title, body, "Symbols are decoded using the code key; the diagram is not necessarily to scale."),
  };
}

export function buildCodeMapDiagram(
  map: DirectionCodeMap,
  evidence: readonly CodeRecoveryEvidence[] = [],
  title = "Recovered direction-code map",
): CodedDirectionDiagramSpec {
  const evidenceRows = evidence.slice(0, 5).map((item, index) => {
    const chain = item.displayEntities.map((entity, entityIndex) => entityIndex < item.symbols.length ? `${entity} ${item.symbols[entityIndex]}` : entity).join(" ");
    const y = 112 + index * 54;
    return [
      `<g data-role="recovery-evidence">`,
      `<rect x="55" y="${y}" width="475" height="42" rx="9" fill="#f8fafc" stroke="#cbd5e1"/>`,
      `<text x="70" y="${y + 26}" font-size="13" font-weight="750" fill="#111827">${escapeXml(chain)}</text>`,
      `<text x="510" y="${y + 26}" text-anchor="end" font-size="12" font-weight="800" fill="#1d4ed8">${escapeXml(DIRECTION_LABELS[item.resultDirection])}</text>`,
      `</g>`,
    ].join("");
  }).join("");
  const note = evidence.length > 0
    ? `<text x="292" y="88" text-anchor="middle" font-size="12" fill="#475569">Each displayed chain constrains the same one-to-one code map.</text>`
    : `<text x="292" y="88" text-anchor="middle" font-size="12" fill="#475569">Use the recovered key to read the coded statement.</text>`;
  const body = [note, evidenceRows, compass(), codeKey(map, 145)].join("");
  return {
    kind: "CODE_MAP_DIAGRAM",
    title,
    svg: svgFrame(title, body, "The four active symbols map one-to-one to North, East, South and West."),
  };
}

export function buildCodedMovementDiagram(
  steps: readonly CodedMovementStep[],
  points: readonly Coordinate[],
  map: DirectionCodeMap,
  title = "Decoded coded movement path",
): CodedDirectionDiagramSpec {
  if (points.length !== steps.length + 1) throw new Error("Coded movement diagram point/step mismatch");
  const projection = projector(points);
  const projected = points.map((point) => projection.project(point));
  const segments = steps.map((step, index) => {
    const from = projected[index];
    const to = projected[index + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.max(Math.hypot(dx, dy), 1);
    const perpX = -dy / length;
    const perpY = dx / length;
    const side = index % 2 === 0 ? 1 : -1;
    const labelX = (from.x + to.x) / 2 + perpX * 25 * side;
    const labelY = (from.y + to.y) / 2 + perpY * 25 * side;
    return [
      `<line data-role="coded-movement-segment" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#7c3aed" stroke-width="3" marker-end="url(#pathArrow)"/>`,
      `<g data-role="coded-movement-label"><rect x="${labelX - 35}" y="${labelY - 14}" width="70" height="28" rx="7" fill="#ffffff" stroke="#c4b5fd"/><text x="${labelX}" y="${labelY + 5}" text-anchor="middle" font-size="12" font-weight="850" fill="#4c1d95">${escapeXml(step.symbol)} · ${step.distance} m</text></g>`,
    ].join("");
  }).join("");
  const start = projected[0];
  const finish = projected[projected.length - 1];
  const shortcut = `<line data-role="coded-endpoint-guide" x1="${start.x}" y1="${start.y}" x2="${finish.x}" y2="${finish.y}" stroke="#2563eb" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round"/>`;
  const pointNodes = projected.map((point, index) => {
    const role = index === 0 ? "Start" : index === projected.length - 1 ? "Finish" : String(index);
    const fill = index === 0 ? "#ecfdf5" : index === projected.length - 1 ? "#eff6ff" : "#ffffff";
    return `<g data-role="coded-path-point"><circle cx="${point.x}" cy="${point.y}" r="${index === 0 || index === projected.length - 1 ? 24 : 9}" fill="${fill}" stroke="#111827" stroke-width="2.2"/><text x="${point.x}" y="${point.y + 5}" text-anchor="middle" font-size="${index === 0 || index === projected.length - 1 ? 11 : 9}" font-weight="850">${escapeXml(role)}</text></g>`;
  }).join("");
  const body = [segments, shortcut, pointNodes, compass(), codeKey(map)].join("");
  return {
    kind: "CODED_MOVEMENT_DIAGRAM",
    title,
    svg: svgFrame(title, body, "Decode each symbol first, then follow the movement sequence in the stated order."),
  };
}
