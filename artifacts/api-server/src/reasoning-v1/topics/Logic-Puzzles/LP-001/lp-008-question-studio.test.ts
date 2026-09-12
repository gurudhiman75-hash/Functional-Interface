import assert from "node:assert/strict";
import { generateLogicPuzzleQuestionStudioBatch, isLogicPuzzleQuestionStudioRequest, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(isLogicPuzzleQuestionStudioRequest({ packageId: "LP-008" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ cpId: "LP-CP-008" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ patternId: "LP-QL-032" }), true);

const packageEntry = listLogicPuzzleQuestionStudioPackages().find((entry) => entry.packageId === "LP-008");
assert.ok(packageEntry);
assert.deepEqual(packageEntry.cpIds, ["LP-CP-008"]);
assert.deepEqual(packageEntry.patternIds, ["LP-QL-029", "LP-QL-030", "LP-QL-031", "LP-QL-032"]);
assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");

const result = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-008", seed: "lp-008-question-studio-proof", count: 3 });
assert.equal(result.questions.length, 12);
assert.equal(result.generationContext.packageId, "LP-008");
assert.equal(result.generationContext.checkpointId, "LP-CP-008");
for (const question of result.questions) {
  assert.equal(question.packageId, "LP-008");
  assert.equal(question.runtimeMode, "REVIEW_ONLY");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(question.text, /following eight dates:/u);
  assert.match(question.text, /Clues:\n/u);
}
console.log("Question Studio LP-008 route passed: package listing, 12 standalone questions and lifecycle locks are green.");
