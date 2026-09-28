export type VennTopologyId =
  | "TWO_DISJOINT"
  | "TWO_PARTIAL_OVERLAP"
  | "TWO_CONTAINMENT"
  | "THREE_NESTED"
  | "THREE_TWO_DISJOINT_SUBSETS"
  | "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET"
  | "THREE_PAIRWISE_OVERLAP_WITH_TRIPLE"
  | "THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE"
  | "THREE_TWO_OVERLAP_ONE_SEPARATE";

type Circle = Readonly<{ cx: number; cy: number; r: number }>;

type RenderSpec = Readonly<{
  circles: readonly Circle[];
  accessibleName: string;
  accessibleDescription: string;
}>;

const TOPOLOGY_SPECS: Readonly<Record<VennTopologyId, RenderSpec>> = {
  TWO_DISJOINT: {
    circles: [{ cx: 78, cy: 86, r: 36 }, { cx: 172, cy: 86, r: 36 }],
    accessibleName: "Two separate groups",
    accessibleDescription: "Two circles with no overlap.",
  },
  TWO_PARTIAL_OVERLAP: {
    circles: [{ cx: 102, cy: 86, r: 39 }, { cx: 148, cy: 86, r: 39 }],
    accessibleName: "Two partly overlapping groups",
    accessibleDescription: "Two circles overlap, and each also has a separate region.",
  },
  TWO_CONTAINMENT: {
    circles: [{ cx: 125, cy: 86, r: 53 }, { cx: 125, cy: 86, r: 25 }],
    accessibleName: "One group contained in another",
    accessibleDescription: "A smaller circle lies fully inside a larger circle.",
  },
  THREE_NESTED: {
    circles: [{ cx: 125, cy: 86, r: 76 }, { cx: 125, cy: 86, r: 51 }, { cx: 125, cy: 86, r: 26 }],
    accessibleName: "Three nested groups",
    accessibleDescription: "Three concentric circles, each smaller group contained in the next.",
  },
  THREE_TWO_DISJOINT_SUBSETS: {
    circles: [{ cx: 125, cy: 86, r: 79 }, { cx: 91, cy: 86, r: 28 }, { cx: 159, cy: 86, r: 28 }],
    accessibleName: "Two separate groups inside a larger group",
    accessibleDescription: "Two non-overlapping small circles lie inside one larger circle.",
  },
  THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET: {
    circles: [{ cx: 125, cy: 86, r: 79 }, { cx: 100, cy: 86, r: 38 }, { cx: 150, cy: 86, r: 38 }],
    accessibleName: "Two overlapping groups inside a larger group",
    accessibleDescription: "Two overlapping small circles lie inside one larger circle.",
  },
  THREE_PAIRWISE_OVERLAP_WITH_TRIPLE: {
    circles: [{ cx: 95, cy: 58, r: 36 }, { cx: 155, cy: 58, r: 36 }, { cx: 125, cy: 110, r: 36 }],
    accessibleName: "Three groups with a common intersection",
    accessibleDescription: "Each pair overlaps, and all three circles share a central region.",
  },
  THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE: {
    circles: [{ cx: 95, cy: 58, r: 32 }, { cx: 155, cy: 58, r: 32 }, { cx: 125, cy: 110, r: 32 }],
    accessibleName: "Three pairwise-overlapping groups without a common region",
    accessibleDescription: "Each pair overlaps, but there is no region shared by all three groups.",
  },
  THREE_TWO_OVERLAP_ONE_SEPARATE: {
    circles: [{ cx: 73, cy: 86, r: 36 }, { cx: 119, cy: 86, r: 36 }, { cx: 207, cy: 86, r: 31 }],
    accessibleName: "Two overlapping groups and one separate group",
    accessibleDescription: "The first two circles overlap; the third circle is separate.",
  },
};

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function renderVennTopologySvg(topologyId: VennTopologyId): string {
  const spec = TOPOLOGY_SPECS[topologyId];
  if (!spec) throw new Error(`Unsupported VEN-001 topology ${String(topologyId)}`);
  const circles = spec.circles
    .map(({ cx, cy, r }) => `<circle cx="${cx}" cy="${cy}" r="${r}" />`)
    .join("");

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 172" role="img" aria-labelledby="ven-title ven-desc">',
    `<title id="ven-title">${escapeXml(spec.accessibleName)}</title>`,
    `<desc id="ven-desc">${escapeXml(spec.accessibleDescription)}</desc>`,
    '<g fill="none" stroke="#17324D" stroke-width="3" vector-effect="non-scaling-stroke">',
    circles,
    "</g>",
    "</svg>",
  ].join("");
}

export function getVennTopologyDescription(topologyId: VennTopologyId): string {
  return TOPOLOGY_SPECS[topologyId].accessibleDescription;
}
