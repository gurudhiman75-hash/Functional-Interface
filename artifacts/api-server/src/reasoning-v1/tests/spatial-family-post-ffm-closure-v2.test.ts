import assert from "node:assert/strict";

import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 } from "../foundation/spatial/spatial-family-final-closure-audit-v2";

assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.permanentQlCount, 53);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.permanentQlRange, "SPA-QL-001..SPA-QL-053");
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.nextAvailablePermanentQlId, "SPA-QL-054");
assert.deepEqual(
  SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.resolvedSinceV1[0]?.permanentQlIds,
  ["SPA-QL-051", "SPA-QL-052", "SPA-QL-053"],
);
assert.deepEqual(
  SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.map((entry) => entry.chapterCode),
  ["DOT-001", "FMT-001", "IDF-001"],
);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.familyFreezeAuthorized, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.mockTestReleaseAuthorizedByThisAudit, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.publicReleaseAuthorizedByThisAudit, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.studentDeliveryAuthorizedByThisAudit, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.lifecycle.automaticStudentPublicationAuthorizedByThisAudit, false);
assert.equal(SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.nextGate, "SPA_DOT_001_SOURCE_DISCOVERY_V1");

console.log("PASS_SPATIAL_POST_FFM_CLOSURE_V2", {
  range: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.permanentQlRange,
  next: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.currentCorpus.nextAvailablePermanentQlId,
  remaining: SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2.blockingMissingChapters.map((entry) => entry.chapterCode),
});
