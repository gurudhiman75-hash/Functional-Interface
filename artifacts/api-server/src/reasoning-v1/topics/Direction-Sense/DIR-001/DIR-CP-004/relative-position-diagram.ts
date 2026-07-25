import type { Coordinate } from "../foundation/types";
import type { RelativeDiagramOptions, RelativeDiagramPointGroup, RelativePositionDiagramSpec, RelativeRelation } from "./types";

interface RectGeometry {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface ProjectedNode {
  readonly group: RelativeDiagramPointGroup;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly coincident: boolean;
  readonly radius: number | null;
  readonly box: RectGeometry | null;
}

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function keyFor(coordinate: Coordinate): string {
  return `${coordinate.x.toFixed(8)}:${coordinate.y.toFixed(8)}`;
}

function rectsOverlap(left: RectGeometry, right: RectGeometry, padding = 2): boolean {
  return left.x < right.x + right.width + padding
    && left.x + left.width + padding > right.x
    && left.y < right.y + right.height + padding
    && left.y + left.height + padding > right.y;
}

function rectTouchesCircle(rect: RectGeometry, x: number, y: number, radius: number, padding = 3): boolean {
  const closestX = Math.min(Math.max(x, rect.x), rect.x + rect.width);
  const closestY = Math.min(Math.max(y, rect.y), rect.y + rect.height);
  return (x - closestX) ** 2 + (y - closestY) ** 2 < (radius + padding) ** 2;
}

function labelRectIsClear(rect: RectGeometry, nodes: readonly ProjectedNode[], labels: readonly RectGeometry[]): boolean {
  if (rect.x < 10 || rect.y < 50 || rect.x + rect.width > 556 || rect.y + rect.height > 420) return false;
  if (labels.some((label) => rectsOverlap(rect, label))) return false;
  return nodes.every((node) => {
    if (node.radius !== null) return !rectTouchesCircle(rect, node.x, node.y, node.radius);
    return node.box === null || !rectsOverlap(rect, node.box, 3);
  });
}

export function buildRelativePositionDiagram(
  coordinates: Readonly<Record<string, Coordinate>>,
  relations: readonly RelativeRelation[],
  options: RelativeDiagramOptions = {},
): RelativePositionDiagramSpec {
  const width = 720;
  const height = 470;
  const plotLeft = 78;
  const plotRight = options.queryPair?.shortestDistanceLabel ? 520 : 548;
  const plotTop = 86;
  const plotBottom = 388;
  const entries = Object.entries(coordinates);
  if (entries.length < 2) throw new Error("Relative-position diagram requires at least two entities");

  const xs = entries.map(([, point]) => point.x);
  const ys = entries.map(([, point]) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min((plotRight - plotLeft) / spanX, (plotBottom - plotTop) / spanY);
  const xPad = ((plotRight - plotLeft) - spanX * scale) / 2;
  const yPad = ((plotBottom - plotTop) - spanY * scale) / 2;
  const project = (point: Coordinate) => ({
    x: plotLeft + xPad + (point.x - minX) * scale,
    y: plotBottom - yPad - (point.y - minY) * scale,
  });

  const grouped = new Map<string, { coordinate: Coordinate; entities: string[] }>();
  for (const [entity, coordinate] of entries) {
    const key = keyFor(coordinate);
    const group = grouped.get(key) ?? { coordinate, entities: [] };
    group.entities.push(entity);
    grouped.set(key, group);
  }
  const pointGroups: RelativeDiagramPointGroup[] = [...grouped.values()].map((group) => ({
    coordinate: group.coordinate,
    entities: [...group.entities].sort(),
  }));

  const projectedNodes: ProjectedNode[] = pointGroups.map((group) => {
    const p = project(group.coordinate);
    const coincident = group.entities.length > 1;
    const label = group.entities.join(" and ");
    if (coincident) {
      const boxWidth = Math.max(112, Math.min(164, 34 + label.length * 6.4));
      return {
        group,
        x: p.x,
        y: p.y,
        label,
        coincident,
        radius: null,
        box: { x: p.x - boxWidth / 2, y: p.y - 23, width: boxWidth, height: 46 },
      };
    }
    return {
      group,
      x: p.x,
      y: p.y,
      label,
      coincident,
      radius: Math.max(21, Math.min(35, 18 + label.length * 1.85)),
      box: null,
    };
  });

  const usedLabelRects: RectGeometry[] = [];
  const relationLines = relations.map((relation, index) => {
    const from = project(coordinates[relation.referenceEntity]);
    const to = project(coordinates[relation.subjectEntity]);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length <= 1e-9) throw new Error("A displayed relation may not have zero length");
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const perpendicularX = -dy / length;
    const perpendicularY = dx / length;
    const side = index % 2 === 0 ? 1 : -1;
    const perpendicularOffsets = [side * 28, -side * 28, side * 43, -side * 43, side * 58, -side * 58, 0];
    const alongOffsets = [0, -24, 24, -42, 42];
    const unitX = dx / length;
    const unitY = dy / length;
    const width = 46;
    const height = 25;
    let labelRect: RectGeometry | null = null;
    for (const perpendicularOffset of perpendicularOffsets) {
      for (const alongOffset of alongOffsets) {
        const candidate = {
          x: midX + perpendicularX * perpendicularOffset + unitX * alongOffset - width / 2,
          y: midY + perpendicularY * perpendicularOffset + unitY * alongOffset - height / 2,
          width,
          height,
        };
        if (labelRectIsClear(candidate, projectedNodes, usedLabelRects)) {
          labelRect = candidate;
          break;
        }
      }
      if (labelRect) break;
    }
    if (!labelRect) throw new Error(`Unable to place relation label for ${relation.referenceEntity} and ${relation.subjectEntity}`);
    usedLabelRects.push(labelRect);
    const labelX = labelRect.x + labelRect.width / 2;
    const labelY = labelRect.y + labelRect.height / 2;
    return [
      `<line data-role="relation-edge" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#64748b" stroke-width="2.5" marker-end="url(#relationArrow)"/>`,
      `<g data-role="relation-distance"><rect x="${labelRect.x}" y="${labelRect.y}" width="${labelRect.width}" height="${labelRect.height}" rx="6" fill="#ffffff" stroke="#cbd5e1"/><text x="${labelX}" y="${labelY + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">${relation.distance} m</text></g>`,
    ].join("");
  }).join("");

  const queryOverlay = options.queryPair
    ? (() => {
        const from = project(coordinates[options.queryPair.reference]);
        const to = project(coordinates[options.queryPair.subject]);
        const line = `<line data-role="query-relation-line" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#2563eb" stroke-width="3" stroke-dasharray="9 7" stroke-linecap="round"/>`;
        if (!options.queryPair.shortestDistanceLabel) return line;
        return [
          line,
          `<g data-role="shortest-distance-key"><rect x="566" y="166" width="142" height="70" rx="10" fill="#eff6ff" stroke="#60a5fa"/><text x="637" y="191" text-anchor="middle" font-size="12" font-weight="800" fill="#1e3a8a">Shortest distance</text><text x="637" y="218" text-anchor="middle" font-size="13" font-weight="800" fill="#111827">${escapeXml(options.queryPair.shortestDistanceLabel)}</text></g>`,
        ].join("");
      })()
    : "";

  const collinearGuide = options.collinearEntities
    ? (() => {
        const points = options.collinearEntities.map((entity) => project(coordinates[entity]));
        const ordered = [...points].sort((left, right) => left.x === right.x ? left.y - right.y : left.x - right.x);
        const start = ordered[0];
        const finish = ordered[2];
        const dx = finish.x - start.x;
        const dy = finish.y - start.y;
        const length = Math.hypot(dx, dy);
        if (length <= 1e-9) throw new Error("Collinear guide requires distinct points");
        const extension = 34;
        const unitX = dx / length;
        const unitY = dy / length;
        return `<line data-role="collinear-guide" x1="${start.x - unitX * extension}" y1="${start.y - unitY * extension}" x2="${finish.x + unitX * extension}" y2="${finish.y + unitY * extension}" stroke="#60a5fa" stroke-width="7" stroke-linecap="round" opacity="0.48"/>`;
      })()
    : "";

  const nodes = projectedNodes.map((node) => {
    if (node.coincident) {
      const box = node.box!;
      return [
        `<g data-role="position-node" data-coincident="true">`,
        `<rect data-role="coincident-node-shape" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="20" fill="#dcfce7" stroke="#111827" stroke-width="2.3"/>`,
        `<text x="${node.x}" y="${node.y + 5}" text-anchor="middle" font-size="12" font-weight="800" fill="#111827">${escapeXml(node.label)}</text>`,
        `</g>`,
      ].join("");
    }
    return [
      `<g data-role="position-node">`,
      `<circle data-role="single-node-shape" data-label-length="${node.label.length}" cx="${node.x}" cy="${node.y}" r="${node.radius}" fill="#ffffff" stroke="#111827" stroke-width="2.3"/>`,
      `<text x="${node.x}" y="${node.y + 5}" text-anchor="middle" font-size="13" font-weight="800" fill="#111827">${escapeXml(node.label)}</text>`,
      `</g>`,
    ].join("");
  }).join("");

  const compass = [
    `<g data-role="compass" transform="translate(650 79)">`,
    `<circle cx="0" cy="0" r="28" fill="#ffffff" stroke="#94a3b8"/>`,
    `<line x1="0" y1="17" x2="0" y2="-18" stroke="#334155" stroke-width="2" marker-end="url(#compassArrow)"/>`,
    `<line x1="-17" y1="0" x2="17" y2="0" stroke="#94a3b8" stroke-width="1.5"/>`,
    `<text x="0" y="-34" text-anchor="middle" font-size="11" font-weight="800">N</text>`,
    `<text x="33" y="4" text-anchor="middle" font-size="11" font-weight="800">E</text>`,
    `<text x="0" y="39" text-anchor="middle" font-size="11" font-weight="800">S</text>`,
    `<text x="-33" y="4" text-anchor="middle" font-size="11" font-weight="800">W</text>`,
    `</g>`,
  ].join("");

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Relative positions">`,
    `<defs><marker id="relationArrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker><marker id="compassArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker></defs>`,
    `<rect x="1" y="1" width="718" height="468" rx="14" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="360" y="34" text-anchor="middle" font-size="18" font-weight="800" fill="#111827">Relative positions</text>`,
    collinearGuide,
    queryOverlay,
    relationLines,
    nodes,
    compass,
    `<text x="360" y="448" text-anchor="middle" font-size="11" fill="#64748b">Diagram is not necessarily to scale.</text>`,
    `</svg>`,
  ].join("");

  return { kind: "RELATIVE_POSITION_DIAGRAM", title: "Relative positions", pointGroups, relationCount: relations.length, svg };
}
