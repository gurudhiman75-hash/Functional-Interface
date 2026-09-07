import { strict as assert } from "node:assert";

import {
  COM004_AUTHORITY_PROPOSALS_V1,
  COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1,
  COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1,
  auditCom004SourceSaturationClosureMergeSplitV1,
} from "./com004-source-saturation-closure-merge-split-v1";

const audit = auditCom004SourceSaturationClosureMergeSplitV1();

assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, 41);
assert.equal(audit.authorityProposalCount, 17);
assert.equal(audit.compositionOnlyCandidateCount, 2);
assert.equal(audit.externalOwnershipDispositionCount, 4);
assert.equal(audit.permanentQlCount, 0);
assert.equal(audit.sourceSaturationClosed, true);
assert.equal(audit.mergeSplitClosed, false);
assert.equal(audit.productionReady, false);
assert.equal(audit.nextGate, "COM004_MERGE_SPLIT_FINAL_AND_PERMANENT_QL_ALLOCATION");

const browserState = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-006");
assert.ok(browserState);
assert.equal(browserState.sourceCandidateIds.includes("WEB-DISC-041"), true);
assert.equal(browserState.protectedBoundaries?.some((boundary) => boundary.includes("COM-006")), true);

for (const compositionOnlyId of ["WEB-DISC-018", "WEB-DISC-036"]) {
  const disposition = COM004_NON_AUTHORITY_DISCOVERY_DISPOSITIONS_V1.find((entry) => entry.candidateId === compositionOnlyId);
  assert.ok(disposition, `Missing composition-only disposition for ${compositionOnlyId}`);
  assert.equal(disposition.disposition, "COMPOSITION_ONLY");
}

const protocolAuthority = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-015");
assert.ok(protocolAuthority);
assert.equal(protocolAuthority.protectedBoundaries?.some((boundary) => /POP3.*invariably deleting/i.test(boundary)), true);
assert.equal(protocolAuthority.protectedBoundaries?.some((boundary) => boundary.includes("COM-005")), true);

const bankingSafety = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-017");
assert.ok(bankingSafety);
assert.equal(bankingSafety.protectedBoundaries?.some((boundary) => /HTTPS alone is not proof/i.test(boundary)), true);
assert.equal(bankingSafety.protectedBoundaries?.some((boundary) => boundary.includes("COM-006")), true);

const urlAuthority = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-008");
assert.ok(urlAuthority);
assert.equal(urlAuthority.protectedBoundaries?.some((boundary) => /generic TLDs.*proof/i.test(boundary)), true);

const bankingAuthority = COM004_AUTHORITY_PROPOSALS_V1.find((proposal) => proposal.authorityKey === "COM004-AUTH-PROP-016");
assert.ok(bankingAuthority);
assert.equal(bankingAuthority.protectedBoundaries?.some((boundary) => /Banking Awareness\/current affairs/i.test(boundary)), true);

assert.equal(COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.some((entry) => entry.owner === "COM-005"), true);
assert.equal(COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.some((entry) => entry.owner === "COM-006"), true);
assert.equal(COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.some((entry) => entry.owner === "BANKING_AWARENESS_CURRENT_AFFAIRS"), true);
assert.equal(COM004_EXTERNAL_OWNERSHIP_DISPOSITIONS_V1.some((entry) => entry.owner === "REJECT_FROM_CANONICAL_COM004"), true);

console.log("[COM004-SOURCE-SATURATION-CLOSURE-MERGE-SPLIT-V1]", audit);
