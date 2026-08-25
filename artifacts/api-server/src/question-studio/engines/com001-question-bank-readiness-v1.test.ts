import { strict as assert } from "node:assert";

import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM001_STANDARD_QUESTION_STUDIO_PACKAGE } from "./knowledge-v1-com001-adapter";

process.env.DATABASE_URL ??= "postgresql://test:test@127.0.0.1:5432/test";

const {
  COM001_REQUIRED_BANK_PROVENANCE_FIELDS,
  auditCom001QuestionBankReadinessV1,
} = await import("./com001-question-bank-readiness-v1");

const result = await auditCom001QuestionBankReadinessV1();
const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

assert.equal(result.auditedQuestionCount, 270);
assert.equal(result.qlCount, 9);
assert.deepEqual(result.languages, ["en", "hi", "pa"]);
assert.equal(result.currentLifecycleMatchesStandard, true);
assert.equal(result.downstreamLifecycleLocked, true);
assert.equal(result.semanticNormalizationProven, true);
assert.equal(result.productionReleaseAuthorized, false);
assert.equal(result.status, "STANDARD_LIFECYCLE_READY");
assert.deepEqual(result.missingNormalizedProvenanceFields, []);
assert.equal(COM001_REQUIRED_BANK_PROVENANCE_FIELDS.length, 13);

assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.questionBankStatus, lifecycle.questionBankStatus);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.lifecycleId, lifecycle.lifecycleId);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.stage, "BANK_ONLY");
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.questionBankWritable, true);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(
  COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.questionBankAcceptanceAuthority,
  lifecycle.lifecycleId,
);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.testEligible, false);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.mockTestEligible, false);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.automaticStudentPublication, false);
assert.equal(COM001_STANDARD_QUESTION_STUDIO_PACKAGE.metadata?.productionReleaseAuthorized, false);

console.log("[COM001-QUESTION-BANK-NORMALIZATION-V1]", {
  status: result.status,
  auditedQuestionCount: result.auditedQuestionCount,
  lifecycleId: lifecycle.lifecycleId,
  requiredNormalizedProvenanceFields: COM001_REQUIRED_BANK_PROVENANCE_FIELDS,
  missingNormalizedProvenanceFields: result.missingNormalizedProvenanceFields,
  currentLifecycleMatchesStandard: result.currentLifecycleMatchesStandard,
  downstreamLifecycleLocked: result.downstreamLifecycleLocked,
  productionReleaseAuthorized: result.productionReleaseAuthorized,
});
