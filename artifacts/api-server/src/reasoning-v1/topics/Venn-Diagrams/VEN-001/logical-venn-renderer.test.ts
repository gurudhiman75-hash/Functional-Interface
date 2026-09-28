import assert from "node:assert/strict";
import {
  getVennTopologyDescription,
  renderVennTopologySvg,
  type VennTopologyId,
} from "./logical-venn-renderer.ts";

const ids: readonly VennTopologyId[] = [
  "TWO_DISJOINT",
  "TWO_PARTIAL_OVERLAP",
  "TWO_CONTAINMENT",
  "THREE_NESTED",
  "THREE_TWO_DISJOINT_SUBSETS",
  "THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET",
  "THREE_PAIRWISE_OVERLAP_WITH_TRIPLE",
  "THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE",
  "THREE_TWO_OVERLAP_ONE_SEPARATE",
];

const diagrams = ids.map((id) => renderVennTopologySvg(id));
assert.equal(new Set(diagrams).size, ids.length);
for (const [index, svg] of diagrams.entries()) {
  assert.match(svg, /<svg[^>]+role="img"/);
  assert.match(svg, /<title id="ven-title">/);
  assert.match(svg, /<desc id="ven-desc">/);
  assert.ok((svg.match(/<circle /g) ?? []).length >= 2);
  assert.ok(getVennTopologyDescription(ids[index]!).length > 10);
}
assert.match(renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE"), /no region shared by all three/);
assert.throws(() => renderVennTopologySvg("UNSUPPORTED" as VennTopologyId), /Unsupported VEN-001 topology/);

console.log("PASS_VEN_001_ACCESSIBLE_TOPOLOGY_RENDERER");
