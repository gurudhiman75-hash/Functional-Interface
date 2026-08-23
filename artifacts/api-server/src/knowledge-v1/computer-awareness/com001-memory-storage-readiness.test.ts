import { strict as assert } from "node:assert";

import { auditCom001MemoryStorageReadiness } from "./com001-memory-storage-readiness";

const audit = auditCom001MemoryStorageReadiness("2026-08-23");

assert.equal(audit.structurallyValid, true, audit.issues.join("\n"));
assert.equal(audit.candidateFactCount, 34);
assert.equal(audit.productionEligibleFactCount, 0);

// Hypothetical approval is an audit-only lens: it must reveal whether the
// corpus is intrinsically broad enough without actually approving any fact.
assert.equal(audit.hypotheticalCorpusReady, false);
assert.equal(audit.hypotheticalTotalRequirements, 11);

assert.equal(audit.passingFamilies.includes("volatility"), true);
assert.equal(audit.passingFamilies.includes("abbreviation-expansion"), true);

const failingFamilies = new Set(
  audit.failingFamilies.map((entry) => entry.relationFamily),
);
for (const requiredGap of [
  "memory-layer-classification",
  "function-purpose",
  "subtype-membership",
  "storage-medium",
  "memory-hierarchy-order",
  "access-method",
  "backup-storage-role",
  "virtual-memory-concept",
  "capacity-unit-relationship",
]) {
  assert.equal(
    failingFamilies.has(requiredGap),
    true,
    `Expected corpus gap ${requiredGap}`,
  );
}

// Do not allocate permanent QLs while only a minority of corpus requirements
// are ready. Evidence-supported task boundaries stay provisional.
assert.equal(audit.hypotheticalPassedRequirements < 5, true);
