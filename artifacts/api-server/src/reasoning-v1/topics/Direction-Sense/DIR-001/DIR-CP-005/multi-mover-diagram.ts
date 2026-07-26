import type { Coordinate } from "../foundation/types";
import type { MoverPath, MultiMoverDiagramOptions, MultiMoverDiagramSpec } from "./types";

const PATH_COLOURS = ["#7c3aed", "#ea580c", "#059669", "#db2777"] as const;

function escapeXml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function coordinateKey(point: Coordinate): string {
  return `${point.x.toFixed(8)}:${point.y.toFixed(8)}`;
}

export function buildMultiMoverDiagram(paths: readonly MoverPath[], options: MultiMoverDiagramOptions = {}): MultiMoverDiagramSpec {
  const width = 760;
  const height = 500;
  const plotLeft = 72;
  const plotRight = options.queryPair?.distanceLabel ? 548 : 630;
  const plotTop = 78;
  const plotBottom = 420;
  const allPoints = paths.flatMap((path) => path.points);
  if (options.referencePoint) allPoints.push(options.referencePoint.coordinate);
  const xs = allPoints.map((point) => point.x);
  const ys = allPoints.map((point) => point.y);
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

  const endpoints = new Map<string, string[]>();
  for (const path of paths) {
    const key = coordinateKey(path.endpoint);
    const names = endpoints.get(key) ?? [];
    names.push(path.name);
    endpoints.set(key, names);
  }

  const pathLines = paths.map((path, moverIndex) => {
    const colour = PATH_COLOURS[moverIndex % PATH_COLOURS.length];
    return path.points.slice(1).map((point, index) => {
      const from = project(path.points[index]);
      const to = project(point);
      return `<line data-role="mover-path" data-mover="${escapeXml(path.name)}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="${colour}" stroke-width="3" stroke-linecap="round" marker-end="url(#moverArrow${moverIndex})"/>`;
    }).join("");
  }).join("");

  const queryGuide = options.queryPair
    ? (() => {
        const subject = paths.find((path) => path.name === options.queryPair!.subject);
        const reference = paths.find((path) => path.name === options.queryPair!.reference);
        if (!subject || !reference) throw new Error("Query guide references an unknown mover");
        const from = project(reference.endpoint);
        const to = project(subject.endpoint);
        return `<line data-role="endpoint-comparison-guide" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#2563eb" stroke-width="3" stroke-dasharray="10 7" stroke-linecap="round"/>`;
      })()
    : "";

  const startGroups = new Map<string, { point: Coordinate; labels: string[] }>();
  for (const path of paths) {
    const key = coordinateKey(path.start);
    const group = startGroups.get(key) ?? { point: path.start, labels: [] };
    if (!group.labels.includes(path.startLabel)) group.labels.push(path.startLabel);
    startGroups.set(key, group);
  }
  const startNodes = [...startGroups.values()].map((group) => {
    const p = project(group.point);
    const label = group.labels.join("/");
    return `<g data-role="start-node"><circle cx="${p.x}" cy="${p.y}" r="17" fill="#f8fafc" stroke="#475569" stroke-width="2"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="12" font-weight="800">${escapeXml(label)}</text></g>`;
  }).join("");

  const waypointNodes = paths.flatMap((path) => path.points.slice(1, -1).map((point) => ({ point, name: path.name }))).map(({ point, name }) => {
    const p = project(point);
    return `<circle data-role="waypoint" data-mover="${escapeXml(name)}" cx="${p.x}" cy="${p.y}" r="4.5" fill="#ffffff" stroke="#64748b"/>`;
  }).join("");

  const endpointNodes = [...endpoints.entries()].map(([key, names]) => {
    const [x, y] = key.split(":").map(Number);
    const p = project({ x, y });
    const label = names.sort().join(" and ");
    const highlighted = names.some((name) => options.highlightedMovers?.includes(name));
    const widthForLabel = Math.max(76, Math.min(190, 28 + label.length * 7));
    return `<g data-role="endpoint-node" data-coincident="${names.length > 1}"><rect x="${p.x - widthForLabel / 2}" y="${p.y - 20}" width="${widthForLabel}" height="40" rx="18" fill="${names.length > 1 || highlighted ? "#dcfce7" : "#ffffff"}" stroke="#111827" stroke-width="2"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="12" font-weight="800">${escapeXml(label)}</text></g>`;
  }).join("");

  const referenceNode = options.referencePoint
    ? (() => {
        const p = project(options.referencePoint!.coordinate);
        return `<g data-role="reference-point"><rect x="${p.x - 28}" y="${p.y - 16}" width="56" height="32" rx="8" fill="#fef3c7" stroke="#d97706"/><text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="12" font-weight="800">${escapeXml(options.referencePoint!.label)}</text></g>`;
      })()
    : "";

  const distanceKey = options.queryPair?.distanceLabel
    ? `<g data-role="separation-distance-key"><rect x="584" y="180" width="160" height="72" rx="10" fill="#eff6ff" stroke="#60a5fa"/><text x="664" y="207" text-anchor="middle" font-size="12" font-weight="800" fill="#1e3a8a">Endpoint separation</text><text x="664" y="234" text-anchor="middle" font-size="14" font-weight="800">${escapeXml(options.queryPair.distanceLabel)}</text></g>`
    : "";

  const compass = `<g data-role="compass" transform="translate(684 76)"><circle cx="0" cy="0" r="27" fill="#ffffff" stroke="#94a3b8"/><line x1="0" y1="16" x2="0" y2="-17" stroke="#334155" stroke-width="2" marker-end="url(#compassArrow)"/><line x1="-16" y1="0" x2="16" y2="0" stroke="#94a3b8"/><text x="0" y="-33" text-anchor="middle" font-size="11" font-weight="800">N</text><text x="32" y="4" text-anchor="middle" font-size="11" font-weight="800">E</text><text x="0" y="38" text-anchor="middle" font-size="11" font-weight="800">S</text><text x="-32" y="4" text-anchor="middle" font-size="11" font-weight="800">W</text></g>`;

  const markers = paths.map((_, index) => `<marker id="moverArrow${index}" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="${PATH_COLOURS[index % PATH_COLOURS.length]}"/></marker>`).join("");
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Multiple mover endpoints">`,
    `<defs>${markers}<marker id="compassArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#334155"/></marker></defs>`,
    `<rect x="1" y="1" width="758" height="498" rx="14" fill="#ffffff" stroke="#d1d5db"/>`,
    `<text x="380" y="34" text-anchor="middle" font-size="18" font-weight="800">Mover paths and final positions</text>`,
    pathLines,
    queryGuide,
    waypointNodes,
    startNodes,
    referenceNode,
    endpointNodes,
    distanceKey,
    compass,
    `<text x="380" y="477" text-anchor="middle" font-size="11" fill="#64748b">Paths are shown for comparison and are not necessarily to scale.</text>`,
    `</svg>`,
  ].join("");

  return { kind: "MULTI_MOVER_DIAGRAM", title: "Mover paths and final positions", moverCount: paths.length, svg };
}
