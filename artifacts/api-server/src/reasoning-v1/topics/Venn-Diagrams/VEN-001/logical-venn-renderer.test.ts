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
  "THREE_ONE_NESTED_PAIR_ONE_SEPARATE",
  "THREE_ALL_DISJOINT",
  "THREE_NESTED_PAIR_CROSSED_BY_THIRD",
  "THREE_TWO_DISJOINT_OVERLAP_THIRD",
  "THREE_NESTED_PAIR_OUTER_ONLY_OVERLAP",
];

const diagrams = ids.map((id) => renderVennTopologySvg(id));
assert.equal(new Set(diagrams).size, ids.length);
for (const [index, svg] of diagrams.entries()) {
  assert.match(svg, /<svg[^>]+role="img"/);
  assert.match(svg, /<title id="ven-title">/);
  assert.match(svg, /<desc id="ven-desc">/);
  assert.ok((svg.match(/<circle /g) ?? []).length >= 2);
  assert.equal((svg.match(/<text /g) ?? []).length, ids[index]!.startsWith("TWO_") ? 2 : 3);
  assert.match(svg, /stroke="#FFFFFF"[^>]*paint-order="stroke"/);
  assert.ok(getVennTopologyDescription(ids[index]!).length > 10);
}
assert.match(
  renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE"),
  /no region shared by all three/,
);
assert.throws(
  () => renderVennTopologySvg("UNSUPPORTED" as VennTopologyId),
  /Unsupported VEN-001 topology/,
);
assert.match(
  renderVennTopologySvg("TWO_PARTIAL_OVERLAP", ["A<&", "B"]),
  /A&lt;&amp;/,
);
assert.throws(
  () => renderVennTopologySvg("TWO_DISJOINT", ["A"]),
  /requires 2 non-empty circle labels/,
);
assert.doesNotMatch(
  renderVennTopologySvg("THREE_NESTED", undefined, false),
  /<text /,
);

function circleGeometry(svg: string) {
  return [...svg.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="(\d+)" \/>/g)].map(
    (match) => ({
      x: Number(match[1]),
      y: Number(match[2]),
      r: Number(match[3]),
    }),
  );
}
function distance(
  a: ReturnType<typeof circleGeometry>[number],
  b: ReturnType<typeof circleGeometry>[number],
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
const separated = circleGeometry(renderVennTopologySvg("TWO_DISJOINT"));
assert.ok(
  distance(separated[0]!, separated[1]!) > separated[0]!.r + separated[1]!.r,
);
const pairOverlap = circleGeometry(
  renderVennTopologySvg("TWO_PARTIAL_OVERLAP"),
);
assert.ok(
  distance(pairOverlap[0]!, pairOverlap[1]!) <
    pairOverlap[0]!.r + pairOverlap[1]!.r,
);
assert.ok(
  distance(pairOverlap[0]!, pairOverlap[1]!) >
    Math.abs(pairOverlap[0]!.r - pairOverlap[1]!.r),
);
const threeWithoutTriple = circleGeometry(
  renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE"),
);
for (let left = 0; left < 3; left += 1) {
  for (let right = left + 1; right < 3; right += 1) {
    assert.ok(
      distance(threeWithoutTriple[left]!, threeWithoutTriple[right]!) <
        threeWithoutTriple[left]!.r + threeWithoutTriple[right]!.r,
    );
  }
}
const tripleGap = threeWithoutTriple[1]!.y + threeWithoutTriple[1]!.r;
const separatePairLensTop =
  threeWithoutTriple[0]!.y -
  Math.sqrt(threeWithoutTriple[0]!.r ** 2 - (125 - threeWithoutTriple[0]!.x) ** 2);
assert.ok(
  separatePairLensTop - tripleGap >= 4,
  "The no-triple diagram must show a visible gap between the pair intersection and the third set",
);
const threeWithTriple = circleGeometry(
  renderVennTopologySvg("THREE_PAIRWISE_OVERLAP_WITH_TRIPLE"),
);
assert.ok(
  threeWithTriple.every(
    (circle) => Math.hypot(circle.x - 125, circle.y - 100) < circle.r,
  ),
);
const nestedAndSeparate = circleGeometry(renderVennTopologySvg("THREE_ONE_NESTED_PAIR_ONE_SEPARATE"));
assert.ok(nestedAndSeparate[0]!.r > nestedAndSeparate[1]!.r);
assert.equal(distance(nestedAndSeparate[0]!, nestedAndSeparate[1]!), 0);
assert.ok(distance(nestedAndSeparate[0]!, nestedAndSeparate[2]!) > nestedAndSeparate[0]!.r + nestedAndSeparate[2]!.r);
const allSeparate = circleGeometry(renderVennTopologySvg("THREE_ALL_DISJOINT"));
for (let i = 0; i < 3; i += 1) for (let j = i + 1; j < 3; j += 1) {
  assert.ok(distance(allSeparate[i]!, allSeparate[j]!) > allSeparate[i]!.r + allSeparate[j]!.r);
}
const crossedNested = circleGeometry(renderVennTopologySvg("THREE_NESTED_PAIR_CROSSED_BY_THIRD"));
assert.ok(distance(crossedNested[0]!, crossedNested[1]!) + crossedNested[1]!.r < crossedNested[0]!.r);
for (const i of [1, 2]) {
  assert.ok(distance(crossedNested[0]!, crossedNested[i]!) < crossedNested[0]!.r + crossedNested[i]!.r);
}
assert.ok(distance(crossedNested[1]!, crossedNested[2]!) < crossedNested[1]!.r + crossedNested[2]!.r);
assert.ok(distance(crossedNested[0]!, crossedNested[2]!) + crossedNested[2]!.r > crossedNested[0]!.r);
const twoSeparateCrossed = circleGeometry(renderVennTopologySvg("THREE_TWO_DISJOINT_OVERLAP_THIRD"));
assert.ok(distance(twoSeparateCrossed[0]!, twoSeparateCrossed[1]!) > twoSeparateCrossed[0]!.r + twoSeparateCrossed[1]!.r);
for (const i of [0, 1]) assert.ok(distance(twoSeparateCrossed[i]!, twoSeparateCrossed[2]!) < twoSeparateCrossed[i]!.r + twoSeparateCrossed[2]!.r);
const outerOnly = circleGeometry(renderVennTopologySvg("THREE_NESTED_PAIR_OUTER_ONLY_OVERLAP"));
assert.ok(distance(outerOnly[0]!, outerOnly[1]!) + outerOnly[1]!.r < outerOnly[0]!.r);
assert.ok(distance(outerOnly[0]!, outerOnly[2]!) < outerOnly[0]!.r + outerOnly[2]!.r);
assert.ok(distance(outerOnly[1]!, outerOnly[2]!) > outerOnly[1]!.r + outerOnly[2]!.r);
console.log("PASS_VEN_001_ACCESSIBLE_TOPOLOGY_RENDERER");
