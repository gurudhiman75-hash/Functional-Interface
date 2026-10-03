import assert from "node:assert/strict";

import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine.ts";
import {
  getGeneratedItemApprovalDisposition,
} from "../../../../../lib/admin-question-studio-approval-policy.ts";
import {
  normalizeGeneratedQuestionPayload,
} from "../../../../../lib/admin-question-conversion.ts";

const pkg = listQuestionStudioPackages().find((entry: any) => String(entry.packageId) === "SEA-002");
assert.ok(pkg, "SEA-002 must be visible through shared Question Studio capabilities");
assert.equal(pkg.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(pkg.questionBankWritable, true);
assert.equal(pkg.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(pkg.manualApprovalRequired, true);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);

const result = await generateQuestion({
  packageId: "SEA-002",
  canonicalProblemId: "SEA-CP-006",
  language: "pa",
  difficulty: "Hard",
  count: 8,
  seed: "sea002-cp006-bank-acceptance-shared-facade",
});

assert.equal(result.questions.length, 8);
assert.equal(result.generationContext.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(result.generationContext.questionBankWritable, true);
assert.equal(result.generationContext.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(result.generationContext.questionBankAcceptanceActive, true);
assert.equal(result.generationContext.testEligible, false);
assert.equal(result.generationContext.mockTestEligible, false);
assert.equal(result.generationContext.publiclyPublishable, false);
assert.equal(result.generationContext.automaticStudentPublication, false);

const queries = new Set<string>();
for (let index = 0; index < result.questions.length; index += 1) {
  const question = result.questions[index] as Record<string, any>;
  queries.add(String(question.queryContractId));
  assert.equal(question.questionBankStatus, "READY_FOR_STORAGE");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(String(question.explanation), /data:image\/svg\+xml;base64,/u);

  const persisted = { ...question, generationContext: result.generationContext };
  assert.equal(getGeneratedItemApprovalDisposition(persisted).mode, "question_bank");
  const normalized = normalizeGeneratedQuestionPayload(persisted, {
    itemId: `facade-${index}`,
    generationRunCode: "SEA002-FACADE-ACTIVATION",
  });
  const generation = normalized.answerModel.generation as Record<string, unknown>;
  assert.equal(generation.questionBankAcceptanceMode, "BANK_ONLY");
  assert.equal(generation.testEligible, false);
  assert.equal(generation.publiclyPublishable, false);
}

assert.deepEqual([...queries].sort(), [
  "SEA-QC-003",
  "SEA-QC-006",
  "SEA-QC-008",
  "SEA-QC-010",
  "SEA-QC-011",
  "SEA-QC-012",
  "SEA-QC-014",
  "SEA-QC-015",
]);

console.log("PASS_SEA002_CP006_QUESTION_BANK_ACCEPTANCE_SHARED_FACADE_V1");
console.log("shared capability READY_FOR_STORAGE / BANK_ONLY");
console.log("shared generated items", result.questions.length);
console.log("manual approval disposition question_bank");
console.log("test/mock/public remain false");
