import assert from "node:assert/strict";

import {
  SEA002_CP008_SOURCE_DISCOVERY_STATUS,
  SEA002_CP008_SOURCE_EVIDENCE_V1,
} from "./source-evidence-v1.ts";

assert.equal(SEA002_CP008_SOURCE_EVIDENCE_V1.length, 6);
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.lineage === "RRB"));
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.lineage === "SBI"));
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.lineage === "IBPS"));
assert.deepEqual(
  [...new Set(SEA002_CP008_SOURCE_EVIDENCE_V1.map((record) => record.schema))].sort(),
  ["ALT12_CORNER_PLUS_TWO_SIDE", "ALT8_CORNERS_MIDDLES", "SIDEPAIR8"],
);
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.facingMode === "CORNERS_IN_SIDES_OUT"));
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.facingMode === "CORNERS_OUT_SIDES_IN"));
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.facingMode === "ALL_IN"));
assert.ok(SEA002_CP008_SOURCE_EVIDENCE_V1.some((record) => record.facingMode === "MIXED"));
const extended = SEA002_CP008_SOURCE_EVIDENCE_V1.find((record) => record.schema === "ALT12_CORNER_PLUS_TWO_SIDE")!;
assert.equal(extended.evidenceStrength, "DISCOVERY_ONLY");
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.status, "WAVE01_SOURCE_DISCOVERY_OPEN");
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.permanentQlAllocated, false);
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.questionStudioRegistered, false);
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.questionBankWritable, false);
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.publiclyPublishable, false);
assert.equal(SEA002_CP008_SOURCE_DISCOVERY_STATUS.nextFreeQlId, "SEA-QL-029");

console.log("PASS_SEA002_CP008_SOURCE_DISCOVERY_V1");
console.log("source records", SEA002_CP008_SOURCE_EVIDENCE_V1.length);
console.log("schemas", SEA002_CP008_SOURCE_DISCOVERY_STATUS.representedSchemas.join(","));
console.log("permanent QL allocated", false);
console.log("Studio/Bank/public", false, false, false);
