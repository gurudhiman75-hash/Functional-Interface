import assert from "node:assert/strict";
import { STA_EXAM_PROFILE_IDS_V2 } from "./exam-format-extension-v2.ts";
import { STA_EXAM_FORMAT_PROVENANCE_V2 } from "./exam-format-provenance-v2.ts";

assert.equal(STA_EXAM_PROFILE_IDS_V2.length, 9);
assert.deepEqual(Object.keys(STA_EXAM_FORMAT_PROVENANCE_V2).sort(), [...STA_EXAM_PROFILE_IDS_V2].sort());
for (const profileId of STA_EXAM_PROFILE_IDS_V2) {
  const provenance = STA_EXAM_FORMAT_PROVENANCE_V2[profileId];
  assert.equal(provenance.freezeEligible, true, `${profileId}: presentation profile not freeze-eligible`);
  assert.ok(provenance.rationale.length >= 40, `${profileId}: provenance rationale too thin`);
  if (provenance.directPunjabPyqBacked) assert.equal(profileId, "PUNJAB_2X4", `${profileId}: unsupported direct-Punjab provenance claim`);
}

for (const profileId of ["BANK_3X5", "BANK_4X5", "BANK_5X5"] as const) {
  const provenance = STA_EXAM_FORMAT_PROVENANCE_V2[profileId];
  assert.equal(provenance.evidenceClass, "DIRECT_MEMORY_BASED_PYQ");
  assert.equal(provenance.officialVerbatim, false, `${profileId}: memory-based evidence must not be represented as official verbatim`);
}
assert.match(STA_EXAM_FORMAT_PROVENANCE_V2.BANK_5X5.rationale, /I-V/);
assert.match(STA_EXAM_FORMAT_PROVENANCE_V2.BANK_5X5.rationale, /memory/i);
assert.equal(STA_EXAM_FORMAT_PROVENANCE_V2.PUNJAB_3X4.evidenceClass, "CROSS_EXAM_SYNTHESIS");
assert.equal(STA_EXAM_FORMAT_PROVENANCE_V2.PUNJAB_3X4.directPunjabPyqBacked, false);

console.log("PASS_STA_001_EXAM_FORMAT_PROVENANCE_V2_NINE_PROFILES");
console.log("profiles", STA_EXAM_PROFILE_IDS_V2.length);
console.log("BANK_5X5 evidence DIRECT_MEMORY_BASED_PYQ");
console.log("official verbatim claim false");
