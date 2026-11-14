import assert from "node:assert/strict";
import { getGeneratedItemApprovalDisposition } from "./admin-question-studio-approval-policy";

// Chapter storage metadata must not silently override a human's review approval.
// Actual quality validation happens before this disposition is used.
for (const payload of [
  {},
  { questionBankStatus: "NOT_STORED", questionBankWritable: false },
  { generationContext: { questionBankStatus: "REVIEW_ONLY", questionBankWritable: false } },
  { questionBankStatus: "STORED", questionBankWritable: true },
  { runtimeMode: "DYNAMIC_CANDIDATE", questionBankWritable: false },
]) {
  assert.deepEqual(getGeneratedItemApprovalDisposition(payload), {
    mode: "question_bank",
    reason: null,
  });
}
console.log("Question Studio manual approval disposition policy: PASS");
