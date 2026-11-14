import assert from "node:assert/strict";

import {
  getGeneratedItemApprovalDisposition,
} from "./admin-question-studio-approval-policy";

for (const payload of [
  {
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
  },
  {
    generationContext: {
      questionBankStatus: "not_stored",
      questionBankWritable: false,
    },
  },
  { questionBankStatus: "NOT_STORED" },
  { questionBankWritable: false },
  { questionBankStatus: "STORED", questionBankWritable: false },
  { questionBankStatus: "NOT_STORED", questionBankWritable: true },
]) {
  assert.equal(getGeneratedItemApprovalDisposition(payload).mode, "review_only");
}

for (const payload of [
  {},
  { questionBankStatus: "STORED" },
  { generationContext: { questionBankStatus: "STORED" } },
]) {
  const disposition = getGeneratedItemApprovalDisposition(payload);
  assert.equal(disposition.mode, "review_only");
  assert.match(
    String(disposition.reason),
    /lifecycle authority is missing/i,
  );
}

for (const payload of [
  { questionBankWritable: true },
  { questionBankStatus: "STORED", questionBankWritable: true },
  {
    runtimeMode: "CANONICAL_REVIEW",
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "STORED",
    questionBankWritable: true,
  },
  {
    generationContext: {
      questionBankStatus: "STORED",
      questionBankWritable: true,
    },
  },
]) {
  assert.deepEqual(getGeneratedItemApprovalDisposition(payload), {
    mode: "question_bank",
    reason: null,
  });
}

console.log("Question Studio approval disposition policy: PASS");

for (const payload of [
  {},
  { questionBankStatus: "NOT_STORED", questionBankWritable: false },
  { generationContext: { questionBankStatus: "REVIEW_ONLY", questionBankWritable: false } },
  { runtimeMode: "DYNAMIC_CANDIDATE", questionBankWritable: false },
]) {
  // Legacy policy still reports chapter restriction outside an admin action,
  // but an explicit manual approval can always store a bank-only question.
  assert.deepEqual(getGeneratedItemApprovalDisposition(payload, { manualApproval: true }), {
    mode: "question_bank",
    reason: null,
  });
}
