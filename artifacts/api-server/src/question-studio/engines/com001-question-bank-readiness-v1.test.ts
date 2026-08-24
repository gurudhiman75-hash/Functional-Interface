import { strict as assert } from "node:assert";

import { COM001_REVIEW_ONLY_PACKAGE } from "./knowledge-v1-com001-adapter";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";

const {
  COM001_QUESTION_BANK_DRY_RUN_AUTHORITY,
  COM001_REQUIRED_BANK_PROVENANCE_FIELDS,
  auditCom001QuestionBankReadinessV1,
} = await import("./com001-question-bank-readiness-v1");

const result = await auditCom001QuestionBankReadinessV1();

assert.equal(COM001_QUESTION_BANK_DRY_RUN_AUTHORITY, "COM-001-QUESTION-BANK-DRY-RUN-CANDIDATE-V1");
assert.equal(result.auditedQuestionCount, 270);
assert.equal(result.qlCount, 9);
assert.deepEqual(result.languages, ["en", "hi", "pa"]);
assert.equal(result.bankOnlyLifecycleProven, true);
assert.equal(result.liveQuestionBankLockPreserved, true);
assert.equal(result.semanticNormalizationProven, true);
assert.equal(result.productionActivationAuthorized, false);
assert.equal(result.status, "READY_FOR_BANK_ONLY_REVIEW");
assert.deepEqual(result.missingNormalizedProvenanceFields, []);
assert.equal(COM001_REQUIRED_BANK_PROVENANCE_FIELDS.length, 13);

assert.equal(COM001_REVIEW_ONLY_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.questionBankWritable, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.testEligible, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.publiclyPublishable, false);
assert.equal(COM001_REVIEW_ONLY_PACKAGE.metadata?.automaticStudentPublication, false);

console.log("[COM001-QUESTION-BANK-READINESS-V1]", {
  status: result.status,
  auditedQuestionCount: result.auditedQuestionCount,
  requiredNormalizedProvenanceFields: COM001_REQUIRED_BANK_PROVENANCE_FIELDS,
  missingNormalizedProvenanceFields: result.missingNormalizedProvenanceFields,
  bankOnlyLifecycleProven: result.bankOnlyLifecycleProven,
  liveQuestionBankLockPreserved: result.liveQuestionBankLockPreserved,
  productionActivationAuthorized: result.productionActivationAuthorized,
});
