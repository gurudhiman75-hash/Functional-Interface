import assert from "node:assert/strict";

import {
  COM002_ENGLISH_V5_FREEZE_CANDIDATE,
  auditCom002EnglishV5FreezeCandidate,
} from "./com002-english-freeze-v5-candidate";

const audit = auditCom002EnglishV5FreezeCandidate();
console.log("[COM002-ENGLISH-V5-FREEZE-CANDIDATE] actual fingerprints", audit.actual);

assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.humanReview.explicitApprovalVerified, true);
assert.equal(COM002_ENGLISH_V5_FREEZE_CANDIDATE.promotionAllowed, false);
assert.equal(audit.actual.qlCount, 13);
assert.equal(audit.actual.corpusQuestionCount, 520);
assert.equal(audit.actual.reviewQuestionCount, 26);
assert.equal(audit.promotable, false);

const fingerprintIssues = audit.issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:"));
assert.equal(fingerprintIssues.length, 3, `expected three PENDING fingerprint mismatches, got ${audit.issues.join(" | ")}`);
assert.equal(
  audit.issues.filter((issue) => !issue.startsWith("FINGERPRINT_MISMATCH:")).length,
  0,
  `unexpected V5 freeze-candidate issue: ${audit.issues.join(" | ")}`,
);

console.log("[COM002-ENGLISH-V5-FREEZE-CANDIDATE] PASS approval=true hashProbe=true promotable=false");
