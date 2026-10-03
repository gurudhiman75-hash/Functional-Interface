import assert from "node:assert/strict";

import {
  SEA002_CP008_SOURCE_EVIDENCE_V2,
  SEA002_CP008_SOURCE_SATURATION_V2,
  SEA002_CP008_WAVE02_GAPS,
} from "./source-saturation-v2.ts";

assert.equal(SEA002_CP008_SOURCE_EVIDENCE_V2.length, 13);
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.officialPaperRelayCount >= 6);
assert.deepEqual(
  [...SEA002_CP008_SOURCE_SATURATION_V2.representedSchemas].sort(),
  ["ALT12_CORNER_PLUS_TWO_SIDE", "ALT8_CORNERS_MIDDLES", "SIDEPAIR8", "VARIABLE_SIDE6"],
);
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.representedFacingModes.includes("ALL_IN"));
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.representedFacingModes.includes("ALL_OUT"));
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.representedFacingModes.includes("MIXED"));
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.representedFacingModes.includes("CORNERS_IN_SIDES_OUT"));
assert.ok(SEA002_CP008_SOURCE_SATURATION_V2.representedFacingModes.includes("CORNERS_OUT_SIDES_IN"));
assert.equal(SEA002_CP008_WAVE02_GAPS.length, 4);
assert.equal(SEA002_CP008_WAVE02_GAPS.find((gap) => gap.id === "CP008-GAP-001")!.status, "SOURCE_PROVEN_TOPOLOGY_MODEL_REUSABLE");
assert.equal(SEA002_CP008_WAVE02_GAPS.find((gap) => gap.id === "CP008-GAP-003")!.status, "OFFICIAL_SOURCE_PROVEN_NEW_TOPOLOGY_PRIMITIVE_REQUIRED");
assert.equal(SEA002_CP008_WAVE02_GAPS.find((gap) => gap.id === "CP008-GAP-004")!.status, "DISCOVERY_ONLY_SOURCE_TOO_WEAK_FOR_ALLOCATION");
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.status, "WAVE02_SOURCE_EXPANSION_COMPLETE_SATURATION_NOT_YET_CLAIMED");
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.permanentQlAllocated, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.questionStudioRegistered, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.questionBankWritable, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.publiclyPublishable, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V2.nextFreeQlId, "SEA-QL-029");

console.log("PASS_SEA002_CP008_SOURCE_EXPANSION_V2");
console.log("source records", SEA002_CP008_SOURCE_EVIDENCE_V2.length);
console.log("official paper relays", SEA002_CP008_SOURCE_SATURATION_V2.officialPaperRelayCount);
console.log("schemas", SEA002_CP008_SOURCE_SATURATION_V2.representedSchemas.join(","));
console.log("open topology/authority gaps", SEA002_CP008_WAVE02_GAPS.length);
console.log("saturation claimed", false);
console.log("permanent QL allocated", false);
