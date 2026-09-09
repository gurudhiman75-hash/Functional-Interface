export type GeographyExplanationMapKind =
  | "SOURCE"
  | "TRIBUTARY"
  | "CONFLUENCE"
  | "COURSE"
  | "SYSTEM_CHAIN";

export type GeographyExplanationMapNodeRole =
  | "river"
  | "source"
  | "place"
  | "lake"
  | "pass"
  | "confluence"
  | "context";

export type GeographyExplanationMapNodeV1 = {
  id: string;
  label: string;
  x: number;
  y: number;
  role: GeographyExplanationMapNodeRole;
  emphasis?: "primary" | "context";
};

export type GeographyExplanationMapLinkV1 = {
  id: string;
  from: string;
  to: string;
  label?: string;
  emphasis?: "primary" | "context";
  arrow?: boolean;
};

export type GeographyExplanationMapSpecV1 = {
  schemaVersion: "GEO_EXPLANATION_MAP_V1";
  mapId: string;
  kind: GeographyExplanationMapKind;
  title: string;
  viewportLabel: string;
  caption: string;
  geometryMode: "SCHEMATIC" | "ATLAS";
  geometryAuthorityId: string;
  notToScale: boolean;
  sourceFactIds: string[];
  nodes: GeographyExplanationMapNodeV1[];
  links: GeographyExplanationMapLinkV1[];
};

export type GeographyExplanationMapRenderV1 = {
  spec: GeographyExplanationMapSpecV1;
  svg: string;
  width: 320;
  height: 180;
  altText: string;
};

const SVG_WIDTH = 320;
const SVG_HEIGHT = 180;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function coordinate(value: number, span: number, inset: number) {
  return inset + (value / 100) * (span - inset * 2);
}

export function auditGeographyExplanationMapSpecV1(spec: GeographyExplanationMapSpecV1) {
  const issues: string[] = [];
  const nodeIds = new Set<string>();
  const linkIds = new Set<string>();

  if (spec.schemaVersion !== "GEO_EXPLANATION_MAP_V1") issues.push("SCHEMA_VERSION");
  if (!spec.mapId.trim()) issues.push("MAP_ID");
  if (!spec.title.trim()) issues.push("TITLE");
  if (!spec.viewportLabel.trim()) issues.push("VIEWPORT");
  if (!spec.caption.trim()) issues.push("CAPTION");
  if (!spec.geometryAuthorityId.trim()) issues.push("GEOMETRY_AUTHORITY");
  if (!spec.sourceFactIds.length) issues.push("SOURCE_FACT_IDS");
  if (spec.geometryMode === "SCHEMATIC" && spec.notToScale !== true) issues.push("SCHEMATIC_MUST_BE_NOT_TO_SCALE");
  if (spec.geometryMode === "ATLAS" && spec.notToScale !== false) issues.push("ATLAS_MUST_BE_TO_SCALE");
  if (spec.nodes.length < 2 || spec.nodes.length > 9) issues.push(`NODE_COUNT:${spec.nodes.length}`);
  if (spec.links.length < 1 || spec.links.length > 12) issues.push(`LINK_COUNT:${spec.links.length}`);

  for (const node of spec.nodes) {
    if (!node.id.trim()) issues.push("NODE_ID");
    if (nodeIds.has(node.id)) issues.push(`DUPLICATE_NODE:${node.id}`);
    nodeIds.add(node.id);
    if (!node.label.trim()) issues.push(`NODE_LABEL:${node.id}`);
    if (node.label.length > 36) issues.push(`NODE_LABEL_TOO_LONG:${node.id}`);
    if (!Number.isFinite(node.x) || node.x < 3 || node.x > 97) issues.push(`NODE_X:${node.id}`);
    if (!Number.isFinite(node.y) || node.y < 5 || node.y > 95) issues.push(`NODE_Y:${node.id}`);
  }

  for (const link of spec.links) {
    if (!link.id.trim()) issues.push("LINK_ID");
    if (linkIds.has(link.id)) issues.push(`DUPLICATE_LINK:${link.id}`);
    linkIds.add(link.id);
    if (!nodeIds.has(link.from)) issues.push(`UNKNOWN_LINK_FROM:${link.id}:${link.from}`);
    if (!nodeIds.has(link.to)) issues.push(`UNKNOWN_LINK_TO:${link.id}:${link.to}`);
    if (link.from === link.to) issues.push(`SELF_LINK:${link.id}`);
  }

  if (!spec.links.some((link) => (link.emphasis ?? "primary") === "primary")) {
    issues.push("NO_PRIMARY_LINK");
  }

  return { valid: issues.length === 0, issues };
}

export function assertGeographyExplanationMapSpecV1(spec: GeographyExplanationMapSpecV1) {
  const audit = auditGeographyExplanationMapSpecV1(spec);
  if (!audit.valid) throw new Error(`Invalid Geography explanation map ${spec.mapId}: ${audit.issues.join(", ")}`);
  return spec;
}

function nodeShape(node: GeographyExplanationMapNodeV1, x: number, y: number) {
  const primary = (node.emphasis ?? "primary") === "primary";
  const stroke = primary ? "#0f766e" : "#64748b";
  const fill = primary ? "#ecfdf5" : "#f8fafc";

  if (node.role === "lake") {
    return `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
  }
  if (node.role === "source" || node.role === "pass") {
    const points = `${x},${y - 7} ${x + 7},${y + 6} ${x - 7},${y + 6}`;
    return `<polygon points="${points}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
  }
  if (node.role === "confluence") {
    return `<circle cx="${x}" cy="${y}" r="5" fill="#ffffff" stroke="${stroke}" stroke-width="2.2"/>`;
  }
  return `<circle cx="${x}" cy="${y}" r="4.5" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
}

export function renderGeographyExplanationMapSvgV1(spec: GeographyExplanationMapSpecV1): GeographyExplanationMapRenderV1 {
  assertGeographyExplanationMapSpecV1(spec);
  const insetX = 24;
  const insetY = 31;
  const nodes = new Map(spec.nodes.map((node) => [node.id, node]));
  const markerId = `arrow-${spec.mapId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  const linkSvg = spec.links.map((link) => {
    const from = nodes.get(link.from)!;
    const to = nodes.get(link.to)!;
    const x1 = coordinate(from.x, SVG_WIDTH, insetX);
    const y1 = coordinate(from.y, SVG_HEIGHT, insetY);
    const x2 = coordinate(to.x, SVG_WIDTH, insetX);
    const y2 = coordinate(to.y, SVG_HEIGHT, insetY);
    const primary = (link.emphasis ?? "primary") === "primary";
    const stroke = primary ? "#0284c7" : "#94a3b8";
    const width = primary ? 3.2 : 1.8;
    const marker = link.arrow === false ? "" : ` marker-end="url(#${markerId})"`;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"${marker}/>`;
  }).join("");

  const nodeSvg = spec.nodes.map((node) => {
    const x = coordinate(node.x, SVG_WIDTH, insetX);
    const y = coordinate(node.y, SVG_HEIGHT, insetY);
    const labelY = y > 137 ? y - 10 : y + 15;
    const weight = (node.emphasis ?? "primary") === "primary" ? 600 : 400;
    return `${nodeShape(node, x, y)}<text x="${x}" y="${labelY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5" font-weight="${weight}" fill="#0f172a">${escapeXml(node.label)}</text>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-label="${escapeXml(spec.title)}">
  <defs><marker id="${markerId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#0284c7"/></marker></defs>
  <rect x="0.5" y="0.5" width="319" height="179" rx="10" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="14" y="19" font-family="Arial, sans-serif" font-size="11" font-weight="700" fill="#0f172a">${escapeXml(spec.title)}</text>
  <text x="306" y="19" text-anchor="end" font-family="Arial, sans-serif" font-size="9" fill="#64748b">N ↑</text>
  ${linkSvg}
  ${nodeSvg}
  <text x="14" y="169" font-family="Arial, sans-serif" font-size="8.5" fill="#64748b">${escapeXml(spec.geometryMode === "SCHEMATIC" ? "Schematic · not to scale" : spec.geometryAuthorityId)}</text>
</svg>`;

  return {
    spec,
    svg,
    width: SVG_WIDTH,
    height: SVG_HEIGHT,
    altText: `${spec.title}. ${spec.caption}`,
  };
}
