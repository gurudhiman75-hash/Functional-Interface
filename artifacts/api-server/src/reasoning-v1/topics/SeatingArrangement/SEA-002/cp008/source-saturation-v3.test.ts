import assert from "node:assert/strict";

import {
  SEA002_CP008_SOURCE_EVIDENCE_V3,
  SEA002_CP008_SOURCE_SATURATION_V3,
  SEA002_CP008_WAVE04_SOURCE_DECISIONS,
} from "./source-saturation-v3.ts";

assert.equal(SEA002_CP008_SOURCE_EVIDENCE_V3.length, 14);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.sourceRecordCount, 14);
assert.ok(SEA002_CP008_SOURCE_SATURATION_V3.officialPaperRelayCount >= 6);
assert.ok(SEA002_CP008_SOURCE_SATURATION_V3.establishedOrStrongerCount >= 12);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.productionSourceSaturationClaimed, true);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.permanentQlAllocated, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.questionStudioRegistered, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.questionBankWritable, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.publiclyPublishable, false);
assert.equal(SEA002_CP008_SOURCE_SATURATION_V3.nextFreeQlId, "SEA-QL-029");

const pw = SEA002_CP008_SOURCE_EVIDENCE_V3.find((record) => record.id === "CP008-SRC-014");
assert.ok(pw);
assert.equal(pw.schema, "ALT12_CORNER_PLUS_TWO_SIDE");
assert.equal(pw.facingMode, "ALL_IN");
assert.equal(pw.evidenceStrength, "ESTABLISHED_PREP_ARCHIVE");
assert.deepEqual(pw.prototypeIds, ["SEA-CP008-PROT-011"]);
assert.match(pw.notes, /60m/i);
assert.match(pw.notes, /metric perimeter distances/i);

const decisions = Object.fromEntries(SEA002_CP008_WAVE04_SOURCE_DECISIONS.map((decision) => [decision.family, decision]));
assert.equal(decisions.ALT12_UNIFORM_INWARD_WITH_METRIC_DISTANCE?.decision, "SOURCE_BACKED_DISTINCT_PRODUCTION_FAMILY");
assert.equal(decisions.ALT12_ROLE_DERIVED_FACING?.decision, "RETAIN_DISCOVERY_STRESS_ONLY");
assert.equal(decisions.ALT12_INDEPENDENT_MIXED_FACING?.decision, "RETAIN_DISCOVERY_STRESS_ONLY");

console.log("PASS_SEA002_CP008_SOURCE_SATURATION_V3");
console.log("source records", SEA002_CP008_SOURCE_SATURATION_V3.sourceRecordCount);
console.log("official paper relays", SEA002_CP008_SOURCE_SATURATION_V3.officialPaperRelayCount);
console.log("established-or-stronger records", SEA002_CP008_SOURCE_SATURATION_V3.establishedOrStrongerCount);
console.log("production source saturation", SEA002_CP008_SOURCE_SATURATION_V3.productionSourceSaturationClaimed);
console.log("12-seat weak families retained stress-only", SEA002_CP008_SOURCE_SATURATION_V3.stressOnlyFamiliesExcludedFromPermanentAllocation.length);
console.log("permanent QL allocated", SEA002_CP008_SOURCE_SATURATION_V3.permanentQlAllocated);
