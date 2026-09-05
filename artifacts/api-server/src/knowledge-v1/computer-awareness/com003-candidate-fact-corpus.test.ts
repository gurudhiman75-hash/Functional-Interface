import { strict as assert } from "node:assert";

import {
  COM003_CANDIDATE_FACTS,
  auditCom003CandidateFactCorpus,
} from "./com003-candidate-fact-corpus";

const audit = auditCom003CandidateFactCorpus();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.factCount, 119);
assert.equal(audit.taskCount, 19);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.productionEligible, false);
assert.equal(audit.reviewStatus, "REVIEW_REQUIRED");
assert.equal(audit.cpCounts["COM-003-CP-001"], 29);
assert.equal(audit.cpCounts["COM-003-CP-002"], 33);
assert.equal(audit.cpCounts["COM-003-CP-003"], 41);
assert.equal(audit.cpCounts["COM-003-CP-004"], 16);
assert.equal(audit.versionScopedFactIds.length >= 15, true);

for (let n = 1; n <= 19; n += 1) {
  const taskId = `COM003-PT-${String(n).padStart(3, "0")}`;
  assert.equal(
    COM003_CANDIDATE_FACTS.some((fact) => fact.tags.includes(`provisional-task:${taskId}`)),
    true,
    `COM-003 candidate corpus missing ${taskId}`,
  );
}

assert.equal(
  COM003_CANDIDATE_FACTS.some((fact) => fact.source.sourceId.startsWith("PYQ-")),
  false,
  "PYQ evidence must never be used as the canonical truth source for COM-003 facts",
);

for (const fact of COM003_CANDIDATE_FACTS.filter((entry) => entry.tags.includes("version-scoped"))) {
  assert.notEqual(fact.freshness.class, "IMMUTABLE", `${fact.factId} must remain mutable/version-scoped`);
  assert.equal(Boolean(fact.freshness.lastVerifiedAt), true, `${fact.factId} missing lastVerifiedAt`);
}

console.log("[COM003-CANDIDATE-FACT-CORPUS]", audit);
