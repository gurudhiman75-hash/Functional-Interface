import { strict as assert } from "node:assert";

import { validateKnowledgeFactEligibility } from "../../eligibility";
import {
  GEO_RIV_001_CP001_EDITORIALLY_APPROVED_FACTS,
  GEO_RIV_001_CP001_EDITORIAL_DECISIONS,
  auditGeoRiv001Cp001EditorialReview,
} from "./geo-riv-001-cp001-editorial-review";

const audit = auditGeoRiv001Cp001EditorialReview();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.totalFactCount, 21);
assert.equal(audit.approvedFactCount, 19);
assert.equal(audit.heldFactCount, 2);
assert.equal(audit.rejectedFactCount, 0);
assert.equal(audit.promotedFactCount, 19);

const held = GEO_RIV_001_CP001_EDITORIAL_DECISIONS.filter(
  (decision) => decision.disposition === "HOLD",
).map((decision) => decision.factId);
assert.deepEqual(
  held.sort(),
  [
    "geo-riv-001-cp001-concept-distributary",
    "geo-riv-001-cp001-concept-tributary",
  ],
);

for (const fact of GEO_RIV_001_CP001_EDITORIALLY_APPROVED_FACTS) {
  const eligibility = validateKnowledgeFactEligibility(fact, {
    asOf: "2026-09-09T08:00:00.000Z",
  });
  assert.equal(
    eligibility.eligible,
    true,
    `${fact.factId}: ${eligibility.issues.map((issue) => issue.code).join(", ")}`,
  );
  assert.equal(fact.cpId, "GEO-RIV-001-CP001");
  assert.equal(fact.review.status, "APPROVED");
  assert.equal(
    fact.review.reviewedBy,
    "GEO_RIV_001_CP001_SOURCE_EDITORIAL_REVIEW_V1",
  );
}
