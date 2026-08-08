import assert from "node:assert/strict";

import {
  getGeneratedItemApprovalDisposition,
} from "./admin-question-studio-approval-policy";

assert.deepEqual(
  getGeneratedItemApprovalDisposition({
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
  }),
  {
    mode: "review_only",
    reason: "Payload explicitly disables Question Bank storage",
  },
);

assert.deepEqual(
  getGeneratedItemApprovalDisposition({
    generationContext: {
      questionBankStatus: "not_stored",
      questionBankWritable: false,
    },
  }),
  {
    mode: "review_only",
    reason: "Payload explicitly disables Question Bank storage",
  },
);

for (const payload of [
  {},
  { questionBankStatus: "NOT_STORED" },
  { questionBankWritable: false },
  { questionBankStatus: "STORED", questionBankWritable: false },
  { questionBankStatus: "NOT_STORED", questionBankWritable: true },
  {
    runtimeMode: "CANONICAL_REVIEW",
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "STORED",
    questionBankWritable: true,
  },
]) {
  assert.deepEqual(getGeneratedItemApprovalDisposition(payload), {
    mode: "question_bank",
    reason: null,
  });
}

console.log("Question Studio approval disposition policy: PASS");
