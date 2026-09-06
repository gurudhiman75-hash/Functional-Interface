import { strict as assert } from "node:assert";

import {
  COM001_EDITORIALLY_APPROVED_FACTS,
  COM001_EDITORIAL_FACT_DECISIONS,
  COM001_EDITORIALLY_BLOCKED_SOURCE_IDS,
  auditCom001EditorialReview,
} from "./com001-editorial-review";

const audit = auditCom001EditorialReview();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.totalFactCount, 77);
assert.equal(audit.approvedFactCount, 73);
assert.equal(audit.heldFactCount, 3);
assert.equal(audit.rejectedFactCount, 1);
assert.equal(audit.promotedFactCount, 73);

assert.equal(
  COM001_EDITORIAL_FACT_DECISIONS.find(
    (entry) => entry.factId === "com001-sram-layer",
  )?.disposition,
  "REJECT",
);

for (const heldFactId of [
  "com001-windows-pagefile-purpose",
  "com001-windows-paging-backing-resource",
  "com001-cpu-registers-primary-function",
]) {
  assert.equal(
    COM001_EDITORIAL_FACT_DECISIONS.find((entry) => entry.factId === heldFactId)
      ?.disposition,
    "HOLD",
    heldFactId,
  );
}

const blockedSources = new Set<string>(COM001_EDITORIALLY_BLOCKED_SOURCE_IDS);
assert.equal(
  COM001_EDITORIALLY_APPROVED_FACTS.some((fact) =>
    blockedSources.has(fact.source.sourceId),
  ),
  false,
);
assert.equal(
  COM001_EDITORIALLY_APPROVED_FACTS.some(
    (fact) => fact.contextGroupId === "virtual-memory-awareness",
  ),
  false,
);
assert.equal(
  COM001_EDITORIALLY_APPROVED_FACTS.some(
    (fact) => fact.factId === "com001-sram-layer",
  ),
  false,
);

for (const fact of COM001_EDITORIALLY_APPROVED_FACTS) {
  assert.equal(fact.cpId, "COM-001-CP-001");
  assert.equal(fact.review.status, "APPROVED");
  assert.equal(fact.review.reviewedBy, "COM001_EDITORIAL_REVIEW_V1");
  assert.equal(fact.review.reviewedAt, "2026-08-24T08:30:00.000Z");
}
