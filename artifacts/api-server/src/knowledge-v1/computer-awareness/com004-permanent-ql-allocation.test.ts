import assert from "node:assert/strict";
import {
  COM004_HELD_DISCOVERY_CANDIDATES,
  COM004_PERMANENT_CPS,
  COM004_PERMANENT_QLS,
  auditCom004PermanentQlAllocation,
} from "./com004-permanent-ql-allocation";

const audit = auditCom004PermanentQlAllocation();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM004_PERMANENT_CPS.length, 9);
assert.equal(COM004_PERMANENT_QLS.length, 18);
assert.equal(audit.cpCount, 9);
assert.equal(audit.qlCount, 18);
assert.equal(audit.allocatedTaskCount, 18);
assert.deepEqual(audit.heldCandidateIds, ["WEB-DISC-025", "WEB-DISC-041", "WEB-DISC-042"]);
assert.equal(COM004_HELD_DISCOVERY_CANDIDATES.length, 3);
assert.equal(audit.contentFrozen, false);
assert.equal(audit.questionStudioRuntimeAuthorized, false);
assert.equal(audit.questionBankWritable, false);
assert.equal(audit.testEligible, false);
assert.equal(audit.mockEligible, false);
assert.equal(audit.publicPublicationAuthorized, false);
assert.equal(audit.productionEligible, false);
assert.equal(audit.nextGate, "COM004_ENGLISH_REVIEW_CORPUS_V1");

const qlIds = COM004_PERMANENT_QLS.map((entry) => entry.qlId);
assert.deepEqual(qlIds, Array.from({ length: 18 }, (_, index) => `COM-004-QL-${String(index + 1).padStart(3, "0")}`));
assert.equal(COM004_PERMANENT_CPS.every((cp) => cp.qlIds.length > 0), true);
assert.equal(COM004_PERMANENT_QLS.every((ql) => ql.status === "ALLOCATED_NOT_CONTENT_FROZEN"), true);
