import assert from "node:assert/strict";
import { generateLogicPuzzleQuestionStudioBatch, isLogicPuzzleQuestionStudioRequest, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(isLogicPuzzleQuestionStudioRequest({ packageId: "LP-007" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ cpId: "LP-CP-007" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ patternId: "LP-QL-028" }), true);

const packageEntry = listLogicPuzzleQuestionStudioPackages().find((entry) => entry.packageId === "LP-007");
assert.ok(packageEntry);
assert.deepEqual(packageEntry.cpIds, ["LP-CP-007"]);
assert.deepEqual(packageEntry.patternIds, ["LP-QL-025", "LP-QL-026", "LP-QL-027", "LP-QL-028"]);
assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");

const result = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-007", seed: "lp-007-question-studio-proof", count: 3 });
assert.equal(result.questions.length, 12);
assert.equal(result.generationContext.packageId, "LP-007");
assert.equal(result.generationContext.checkpointId, "LP-CP-007");
for (const question of result.questions) {
  assert.equal(question.packageId, "LP-007");
  assert.equal(question.runtimeMode, "REVIEW_ONLY");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(question.text, /each assigned one different /u);
  assert.match(question.text, /Clues:\n/u);
}
console.log("Question Studio LP-007 route passed: package listing, 12 standalone questions and lifecycle locks are green.");
