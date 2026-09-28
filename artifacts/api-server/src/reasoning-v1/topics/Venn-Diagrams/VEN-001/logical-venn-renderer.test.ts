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


function circleGeometry(svg: string) {
  return [...svg.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="(\d+)" \/>/g)]
    .map((match) => ({ x: Number(match[1]), y: Number(match[2]), r: Number(match[3]) }));
}
function distance(a: ReturnType<typeof circleGeometry>[number], b: ReturnType<typeof circleGeometry>[number]) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
const separated = circleGeometry(renderVennTopologySvg("TWO_DISJOINT"));
assert.ok(distance(separated[0]!, separated[1]!) > separated[0]!.r + separated[1]!.r);
const pairOverlap = circleGeometry(renderVennTopologySvg("TWO_PARTIAL_OVERLAP"));
assert.ok(distance(pairOverlap[0]!, pairOverlap[1]!) < pairOverlap[0]!.r + pairOverlap[1]!.r);
assert.ok(distance(pairOverlap[0]!, pairOverlap[1]!) > Math.abs(pairOverlap[0]!.r - pairOverlap[1]!.r));
const threeWithoutTriple = circleGeometry(renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE"));
for (let left = 0; left < 3; left += 1) {
  for (let right = left + 1; right < 3; right += 1) {
    assert.ok(distance(threeWithoutTriple[left]!, threeWithoutTriple[right]!) < threeWithoutTriple[left]!.r + threeWithoutTriple[right]!.r);
  }
}
const threeWithTriple = circleGeometry(renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITH_TRIPLE"));
assert.ok(threeWithTriple.every((circle) => Math.hypot(circle.x - 125, circle.y - 76) < circle.r));
\nconsole.log("PASS_VEN_001_ACCESSIBLE_TOPOLOGY_RENDERER");
