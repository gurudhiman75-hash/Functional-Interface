import { strict as assert } from "node:assert";

import {
  COM004_COMPOSITION_ONLY_FORMS_V1,
  COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1,
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
} from "./com004-permanent-ql-allocation-v1";

const audit = auditCom004PermanentQlAllocationV1();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.sourceSaturationClosed, true);
assert.equal(audit.mergeSplitClosed, true);
assert.equal(audit.permanentQlCount, 17);
assert.equal(audit.englishQuestionCount, 0);
assert.equal(audit.englishCorpusFrozen, false);
assert.equal(audit.questionStudioAuthorized, false);
assert.equal(audit.productionReady, false);
assert.equal(audit.nextGate, "COM004_ENGLISH_PRODUCTION_V1");

assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.status, "PERMANENT_QL_IDS_ALLOCATED_ENGLISH_NOT_AUTHORED");
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.nextAvailablePermanentQlId, "COM-004-QL-018");
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.englishCorpus.questionCount, 0);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.englishCorpus.authored, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.englishCorpus.frozen, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.active, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.questionStudioDiscoverable, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.questionBankWritable, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.testEligible, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.mockEligible, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.publiclyPublishable, false);
assert.equal(COM004_PERMANENT_QL_ALLOCATION_AUTHORITY_V1.lifecycle.hindiPunjabiGeneration, false);

assert.deepEqual(
  COM004_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => allocation.permanentQlId),
  Array.from({ length: 17 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`),
);
assert.deepEqual(
  COM004_PERMANENT_QL_ALLOCATIONS_V1.map((allocation) => allocation.authorityProposalId),
  Array.from({ length: 17 }, (_, index) => `COM004-AUTH-PROP-${String(index + 1).padStart(3, "0")}`),
);

assert.deepEqual(new Set(COM004_COMPOSITION_ONLY_FORMS_V1.map((entry) => entry.sourceCandidateId)), new Set(["WEB-DISC-018", "WEB-DISC-036"]));
assert.equal(COM004_COMPOSITION_ONLY_FORMS_V1.every((entry) => entry.permanentQlAllocated === false), true);
assert.equal(COM004_COMPOSITION_ONLY_FORMS_V1.every((entry) => entry.mayComposeOnlyFromAllocatedFacts === true), true);

const browserQl = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((allocation) => allocation.permanentQlId === "COM-004-QL-006");
assert.ok(browserQl);
assert.equal(browserQl.sourceCandidateIds.includes("WEB-DISC-041"), true);
assert.equal(browserQl.protectedBoundaries.some((boundary) => boundary.includes("COM-006")), true);

const urlQl = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((allocation) => allocation.permanentQlId === "COM-004-QL-008");
assert.ok(urlQl);
assert.equal(urlQl.protectedBoundaries.some((boundary) => /generic TLDs.*proof/i.test(boundary)), true);

const mailProtocolQl = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((allocation) => allocation.permanentQlId === "COM-004-QL-015");
assert.ok(mailProtocolQl);
assert.equal(mailProtocolQl.protectedBoundaries.some((boundary) => /POP3.*invariably deleting/i.test(boundary)), true);

const eBankingQl = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((allocation) => allocation.permanentQlId === "COM-004-QL-016");
assert.ok(eBankingQl);
assert.equal(eBankingQl.protectedBoundaries.some((boundary) => /Banking Awareness\/current affairs/i.test(boundary)), true);

const safetyQl = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((allocation) => allocation.permanentQlId === "COM-004-QL-017");
assert.ok(safetyQl);
assert.equal(safetyQl.protectedBoundaries.some((boundary) => /HTTPS alone is not proof/i.test(boundary)), true);

console.log("[COM004-PERMANENT-QL-ALLOCATION-V1]", audit);
