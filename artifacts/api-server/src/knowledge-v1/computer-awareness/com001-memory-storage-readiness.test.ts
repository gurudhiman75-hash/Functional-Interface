import { strict as assert } from "node:assert";

import { auditCom001MemoryStorageReadiness } from "./com001-memory-storage-readiness";

const audit = auditCom001MemoryStorageReadiness("2026-08-23");

assert.equal(audit.structurallyValid, true, audit.issues.join("\n"));
assert.equal(audit.candidateFactCount, 77);
assert.equal(audit.productionEligibleFactCount, 0);

// Hypothetical approval is an audit-only lens: it must reveal whether the
// corpus is intrinsically broad enough without actually approving any fact.
assert.equal(audit.hypotheticalCorpusReady, false);
assert.equal(audit.hypotheticalTotalRequirements, 11);
assert.equal(audit.hypotheticalPassedRequirements, 8);

for (const readyFamily of [
  "volatility",
  "memory-layer-classification",
  "function-purpose",
  "subtype-membership",
  "storage-medium",
  "memory-hierarchy-order",
  "abbreviation-expansion",
  "capacity-unit-relationship",
]) {
  assert.equal(
    audit.passingFamilies.includes(readyFamily),
    true,
    `Expected ready corpus family ${readyFamily}`,
  );
}

const failingFamilies = new Set(
  audit.failingFamilies.map((entry) => entry.relationFamily),
);
assert.deepEqual(
  [...failingFamilies].sort(),
  ["access-method", "backup-storage-role", "virtual-memory-concept"].sort(),
);

// Access method and virtual memory are already HOLD_FOR_EVIDENCE in the
// merge/split audit. Backup remains a real provisional learner task, but it
// is now represented through source-backed composite device profiles rather
// than a single has_backup_role fact. QL allocation readiness is evaluated in
// its dedicated gate.
