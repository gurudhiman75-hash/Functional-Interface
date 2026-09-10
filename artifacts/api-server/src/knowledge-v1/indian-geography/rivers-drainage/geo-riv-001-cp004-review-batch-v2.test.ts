import { strict as assert } from "node:assert";
import {
  GEO_RIV_001_CP004_REVIEW_BATCH_V2,
  auditGeoRiv001Cp004ReviewBatchV2,
} from "./geo-riv-001-cp004-review-batch-v2";

const audit = auditGeoRiv001Cp004ReviewBatchV2();
assert.equal(audit.valid, true, audit.issues.join(", "));
assert.equal(audit.questionCount, 54);
assert.equal(audit.semanticUniqueCount, 54);
assert.equal(new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V2.map((q) => q.qlId)).size, 9);
assert.equal(new Set(GEO_RIV_001_CP004_REVIEW_BATCH_V2.map((q) => q.questionId)).size, 54);

for (const qlId of ["GEO-RIV-001-QL-032", "GEO-RIV-001-QL-033"]) {
  const targets = new Set(
    GEO_RIV_001_CP004_REVIEW_BATCH_V2
      .filter((q) => q.qlId === qlId)
      .map((q) => q.canonicalAnswer.split(" — ")[0]?.trim()),
  );
  assert.equal(targets.size, 7, `${qlId} must cover seven distinct pair targets`);
}
