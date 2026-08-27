import { strict as assert } from "node:assert";

import {
  auditCom002EnglishFreezeV1,
  COM002_ENGLISH_FREEZE_AUTHORITY_V1,
} from "./com002-english-freeze-v1";

const audit = auditCom002EnglishFreezeV1();
if (!audit.valid) {
  console.error("[COM002-ENGLISH-FREEZE-V1] actual fingerprints", audit.actual);
}
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.humanReview.status, "APPROVED");
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.workflowRunNumber, 278);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.englishAuditQuestions, 520);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.humanReviewQuestions, 26);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle.questionStudioActive, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle.questionBankWritable, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle.testEligible, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle.mockTestEligible, false);
assert.equal(COM002_ENGLISH_FREEZE_AUTHORITY_V1.lifecycle.publiclyPublishable, false);
