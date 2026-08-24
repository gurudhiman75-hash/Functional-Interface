import { strict as assert } from "node:assert";

import {
  auditCom001EnglishFreezeV2,
  COM001_ENGLISH_FREEZE_AUTHORITY_V2,
} from "./com001-english-freeze-v2";

const audit = auditCom001EnglishFreezeV2();
if (!audit.valid) {
  console.error("[COM001-ENGLISH-FREEZE-V2] actual fingerprints", audit.actual);
}
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.humanReview.status, "APPROVED");
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.exactReviewedAuthority.workflowRunNumber, 143);
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.proofGuarantees.totalFrozenEnglishQuestions, 360);
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.lifecycle.questionBankWritable, false);
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.lifecycle.testEligible, false);
assert.equal(COM001_ENGLISH_FREEZE_AUTHORITY_V2.lifecycle.publiclyPublishable, false);
