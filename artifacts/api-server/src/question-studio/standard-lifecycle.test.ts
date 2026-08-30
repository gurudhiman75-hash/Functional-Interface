import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../lib/admin-question-studio-approval-policy";
import {
  getGeneratedQuestionBankAcceptanceMode,
  getGeneratedQuestionBankEligibilityIssue,
} from "../lib/admin-question-conversion";
import {
  getStandardQuestionStudioLifecycle,
  QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1,
  QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
} from "./standard-lifecycle";

const reviewOnly = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
assert.equal(reviewOnly.stage, "REVIEW_ONLY");
assert.equal(reviewOnly.questionBankStatus, "NOT_STORED");
assert.equal(reviewOnly.questionBankWritable, false);
assert.equal(reviewOnly.canonicalQuestionPersistenceAllowed, false);
assert.equal(reviewOnly.testEligible, false);
assert.equal(reviewOnly.mockTestEligible, false);
assert.equal(reviewOnly.publiclyPublishable, false);
assert.deepEqual(getGeneratedItemApprovalDisposition(reviewOnly), {
  mode: "review_only",
  reason: "Payload explicitly disables Question Bank storage",
});

const bankOnly = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
assert.equal(bankOnly.stage, "BANK_ONLY");
assert.equal(bankOnly.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(bankOnly.questionBankWritable, true);
assert.equal(bankOnly.canonicalQuestionPersistenceAllowed, true);
assert.equal(bankOnly.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(
  bankOnly.questionBankAcceptanceAuthority,
  bankOnly.lifecycleId,
);
assert.equal(bankOnly.testEligibility, "INELIGIBLE");
assert.equal(bankOnly.testEligible, false);
assert.equal(bankOnly.mockTestEligible, false);
assert.equal(bankOnly.publiclyPublishable, false);
assert.equal(bankOnly.automaticStudentPublication, false);
assert.equal(bankOnly.productionReleaseAuthorized, false);
assert.equal(getGeneratedQuestionBankAcceptanceMode(bankOnly), "BANK_ONLY");
assert.equal(getGeneratedQuestionBankEligibilityIssue(bankOnly), null);
assert.deepEqual(getGeneratedItemApprovalDisposition(bankOnly), {
  mode: "question_bank",
  reason: null,
});

assert.equal(getStandardQuestionStudioLifecycle("REVIEW_ONLY"), reviewOnly);
assert.equal(getStandardQuestionStudioLifecycle("BANK_ONLY"), bankOnly);
