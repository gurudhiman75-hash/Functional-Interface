import { strict as assert } from "node:assert";

import {
  COM002_CP_ALLOCATION_PROPOSAL,
  auditCom002AllocationReadiness,
} from "./com002-allocation-readiness";

const audit = auditCom002AllocationReadiness();
assert.equal(audit.status, "READY_FOR_PERMANENT_ALLOCATION", audit.issues.join("\n"));
assert.equal(audit.discoveryCandidateCount, 25);
assert.equal(audit.provisionalTaskCount, 13);
assert.equal(audit.heldTaskCount, 2);
assert.equal(audit.proposedCpCount, 2);
assert.equal(audit.sourceSaturationProven, true);
assert.equal(audit.crossExamEvidenceProven, true);
assert.equal(audit.recentSscEvidenceProven, true);
assert.equal(audit.mergeSplitOwnershipProven, true);
assert.equal(audit.inverseSurfaceOwnershipProven, true);
assert.equal(audit.crossChapterOwnershipProven, true);
assert.equal(audit.versionSensitivityProtected, true);
assert.equal(audit.multiStatementFormatEvidenceProven, true);
assert.equal(audit.allProvisionalTasksAssignedToExactlyOneCp, true);
assert.equal(audit.heldCandidatesExcludedFromCpProposal, true);
assert.equal(audit.permanentQlCountBeforeAllocation, 0);
assert.deepEqual(
  COM002_CP_ALLOCATION_PROPOSAL.map((cp) => cp.provisionalTaskIds.length),
  [7, 6],
);

console.log("[COM002-ALLOCATION-READINESS]", audit);
