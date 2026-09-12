import assert from "node:assert/strict";

import {
  COM002_ENGLISH_V5_FREEZE_CANDIDATE,
  COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS,
  auditCom002EnglishV5FreezeCandidate,
} from "./com002-english-freeze-v5-candidate";

const audit = auditCom002EnglishV5FreezeCandidate();
console.log("[COM002-ENGLISH-V5-FREEZE-CANDIDATE] actual fingerprints", audit.actual);

assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.humanReview.explicitApprovalVerified, true);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.conclusion, "SUCCESS");
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowRunNumber, 502);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowRunId, 33136710464);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowJobId, 98738191160);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.promotionAllowed, true);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.lifecycle.englishV5MachineAuditExecuted, true);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.lifecycle.englishV5MachineFingerprintsPinned, true);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.lifecycle.englishV5AuthorityFrozen, false);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.actual.corpusQuestionCount, 520);
assert.equal(audit.actual.reviewQuestionCount, 26);
assert.equal(audit.actual.englishCorpusFingerprint, COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS.englishCorpusFingerprint);
assert.equal(audit.actual.reviewPackFingerprint, COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS.reviewPackFingerprint);
assert.equal(audit.actual.combinedFingerprint, COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS.combinedFingerprint);
assert.deepEqual(audit.issues, []);
assert.equal(audit.promotable, true);

console.log("[COM002-ENGLISH-V5-FREEZE-CANDIDATE] PASS approval=true execution=true pinned=true promotable=true");
