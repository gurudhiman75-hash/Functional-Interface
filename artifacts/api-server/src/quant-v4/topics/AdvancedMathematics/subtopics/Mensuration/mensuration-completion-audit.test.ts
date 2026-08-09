import assert from "node:assert/strict";
import {
  MENSURATION_CANONICAL_PROBLEM_STATUS,
  MENSURATION_COMPLETION_AUDIT_AUTHORITY,
  MENSURATION_UNIMPLEMENTED_CP_ORDER,
  auditMensurationCompletion,
} from "./mensuration-completion-audit";

const audit = auditMensurationCompletion();

assert.equal(audit.authority, MENSURATION_COMPLETION_AUDIT_AUTHORITY);
assert.equal(audit.canonicalProblemCount, 13);
assert.equal(audit.uniqueCanonicalProblemCount, 13);
assert.deepEqual(audit.packageCounts, {
  "MEN-001": 6,
  "MEN-002": 7,
});
assert.equal(audit.engineeringImplementedCount, 9);
assert.equal(audit.englishAuthorityCount, 9);
assert.equal(audit.designOnlyNotImplementedCount, 4);
assert.equal(audit.activationReadyCount, 0);
assert.equal(audit.questionStudioDiscoverableCount, 0);
assert.equal(audit.questionBankStoredCount, 0);
assert.equal(audit.testEligibleCount, 0);
assert.equal(audit.publiclyPublishableCount, 0);
assert.equal(audit.mensurationEngineeringComplete, false);
assert.equal(audit.mensurationProductReady, false);
assert.equal(
  audit.conclusion,
  "MENSURATION_PARTIALLY_IMPLEMENTED__NINE_OF_THIRTEEN__PRODUCT_ACTIVATION_ZERO",
);

assert.deepEqual(audit.nextImplementationOrder, [
  "MEN-CP-009",
  "MEN-CP-010",
  "MEN-CP-012",
  "MEN-CP-013",
]);
assert.deepEqual(
  [...MENSURATION_UNIMPLEMENTED_CP_ORDER],
  audit.nextImplementationOrder,
);

assert.deepEqual(audit.implementationStatusCounts, {
  RUNTIME_PROOF_COMPLETE_ACTIVATION_LOCKED: 6,
  ENGLISH_COMPLETE_APPROVED_INACTIVE: 1,
  ENGLISH_IMPLEMENTATION_FROZEN_INACTIVE: 1,
  DESIGN_ONLY_NOT_IMPLEMENTED: 4,
  IMPLEMENTATION_COMPLETE_ACTIVATION_LOCKED: 1,
});

const expectedIds = Array.from(
  { length: 13 },
  (_, index) => `MEN-CP-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(
  MENSURATION_CANONICAL_PROBLEM_STATUS.map((row) => row.cpId),
  expectedIds,
);

const designOnlyIds = MENSURATION_CANONICAL_PROBLEM_STATUS.filter(
  (row) => row.implementationStatus === "DESIGN_ONLY_NOT_IMPLEMENTED",
).map((row) => row.cpId);
assert.deepEqual(designOnlyIds, [
  "MEN-CP-009",
  "MEN-CP-010",
  "MEN-CP-012",
  "MEN-CP-013",
]);

const cp011 = MENSURATION_CANONICAL_PROBLEM_STATUS.find(
  (row) => row.cpId === "MEN-CP-011",
);
assert.ok(cp011);
assert.equal(
  cp011.implementationStatus,
  "IMPLEMENTATION_COMPLETE_ACTIVATION_LOCKED",
);
assert.equal(cp011.evidencePr, 647);
assert.equal(
  cp011.evidenceMergeCommit,
  "4e79dcae0fee1914cd7f4514c064b03e76288fab",
);

const cp007 = MENSURATION_CANONICAL_PROBLEM_STATUS.find(
  (row) => row.cpId === "MEN-CP-007",
);
assert.ok(cp007);
assert.equal(cp007.permanentQlRange, "MEN-002-QL-001..MEN-002-QL-043");
assert.equal(cp007.evidencePr, 326);

const cp008 = MENSURATION_CANONICAL_PROBLEM_STATUS.find(
  (row) => row.cpId === "MEN-CP-008",
);
assert.ok(cp008);
assert.equal(cp008.permanentQlRange, "MEN-002-QL-044..MEN-002-QL-095");
assert.equal(cp008.evidencePr, 397);

assert.ok(
  MENSURATION_CANONICAL_PROBLEM_STATUS.every(
    (row) =>
      row.active === false &&
      row.questionStudioDiscoverable === false &&
      row.questionBankStatus === "NOT_STORED" &&
      row.testEligibility === "INELIGIBLE" &&
      row.publiclyPublishable === false,
  ),
);

assert.ok(
  MENSURATION_CANONICAL_PROBLEM_STATUS.filter(
    (row) => row.engineeringImplemented,
  ).every(
    (row) =>
      row.englishAuthorityPresent &&
      row.evidencePr !== null &&
      row.evidenceMergeCommit !== null,
  ),
);
assert.ok(
  MENSURATION_CANONICAL_PROBLEM_STATUS.filter(
    (row) => !row.engineeringImplemented,
  ).every(
    (row) =>
      !row.englishAuthorityPresent &&
      row.evidencePr === null &&
      row.evidenceMergeCommit === null,
  ),
);

console.log(JSON.stringify(audit, null, 2));
