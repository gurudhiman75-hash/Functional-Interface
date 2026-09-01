import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { knowledgeV1Com003QuestionStudioAdapterV1 } from "./knowledge-v1-com003-adapter-v1";

const generated = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "en",
  count: 1,
  seed: "com003-review-only-approval-contract-v1",
  runtimeMode: "review-only",
});
const question = generated.questions[0]!;
const persistedPayload = {
  ...question,
  engineId: "knowledge-v1",
  generationContext: {
    ...(generated.generationContext ?? {}),
    engineId: "knowledge-v1",
  },
  validationResult: "pending",
};

const disposition = getGeneratedItemApprovalDisposition(persistedPayload);
assert.deepEqual(disposition, {
  mode: "review_only",
  reason: "Payload explicitly disables Question Bank storage",
});
assert.equal(question.questionBankStatus, "NOT_STORED");
assert.equal(question.questionBankWritable, false);
assert.equal(generated.generationContext?.questionBankStatus, "NOT_STORED");
assert.equal(generated.generationContext?.questionBankWritable, false);
assert.equal(generated.generationContext?.canonicalQuestionPersistenceAllowed, false);

const bulkRouteSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-bulk-hardening.ts"),
  "utf8",
);
assert(bulkRouteSource.includes("const disposition = getGeneratedItemApprovalDisposition(item.payload);"));
assert(bulkRouteSource.includes('if (disposition.mode === "question_bank")'));
assert(bulkRouteSource.includes("convertedCount: converted.length"));
assert(bulkRouteSource.includes('result.approvalMode === "review_only"'));
assert(bulkRouteSource.includes("reviewOnlyApprovedCount"));

const policySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/lib/admin-question-studio-approval-policy.ts"),
  "utf8",
);
assert(policySource.includes('questionBankStatus === "NOT_STORED" && questionBankWritable === false'));
assert(policySource.includes('mode: "review_only" as const'));

console.log("[COM003-REVIEW-ONLY-APPROVAL-CONTRACT-V1]", {
  valid: true,
  approvalMode: disposition.mode,
  questionBankStatus: question.questionBankStatus,
  questionBankWritable: question.questionBankWritable,
  canonicalQuestionPersistenceAllowed: generated.generationContext?.canonicalQuestionPersistenceAllowed,
  expectedConvertedCount: 0,
  expectedReviewOnlyApprovedCount: 1,
});
