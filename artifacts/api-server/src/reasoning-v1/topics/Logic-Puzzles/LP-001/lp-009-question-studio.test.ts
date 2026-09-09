import assert from "node:assert/strict";
import { generateLogicPuzzleQuestionStudioBatch, isLogicPuzzleQuestionStudioRequest, listLogicPuzzleQuestionStudioPackages } from "./question-studio.ts";

assert.equal(isLogicPuzzleQuestionStudioRequest({ packageId: "LP-009" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ cpId: "LP-CP-009" }), true);
assert.equal(isLogicPuzzleQuestionStudioRequest({ patternId: "LP-QL-036" }), true);

const packageEntry = listLogicPuzzleQuestionStudioPackages().find((entry) => entry.packageId === "LP-009");
assert.ok(packageEntry);
assert.deepEqual(packageEntry.cpIds, ["LP-CP-009"]);
assert.deepEqual(packageEntry.patternIds, ["LP-QL-033", "LP-QL-034", "LP-QL-035", "LP-QL-036"]);
assert.equal(packageEntry.runtimeMode, "REVIEW_ONLY");

const result = await generateLogicPuzzleQuestionStudioBatch({ packageId: "LP-009", seed: "lp-009-question-studio-proof", count: 8 });
assert.equal(result.questions.length, 32);
assert.equal(result.generationContext.packageId, "LP-009");
assert.equal(result.generationContext.checkpointId, "LP-CP-009");
assert.ok(result.questions.some((question) => /six months/u.test(question.text)));
assert.ok(result.questions.some((question) => /six different years/u.test(question.text)));
for (const question of result.questions) {
  assert.equal(question.packageId, "LP-009");
  assert.equal(question.runtimeMode, "REVIEW_ONLY");
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(question.text, /Clues:\n/u);
}
console.log("Question Studio LP-009 route passed: package listing, 32 standalone questions, both calendar modes and lifecycle locks are green.");
