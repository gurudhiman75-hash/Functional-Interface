import assert from "node:assert/strict";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioPackages,
} from "../../../../question-studio/engine-registry.ts";

const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "DM-001");
assert.ok(registered, "DM-001 must be discoverable through the shared Question Studio registry");
assert.equal(registered.engineId, "reasoning-v1");
assert.deepEqual(registered.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered.cpIds, ["DM-CP-001", "DM-CP-002", "DM-CP-003", "DM-CP-004", "DM-CP-005"]);
assert.equal(registered.lifecycleStage, "REVIEW_ONLY");
assert.equal(registered.questionBankWritable, false);
assert.equal(registered.testEligible, false);
assert.equal(registered.mockTestEligible, false);
assert.equal(registered.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateQuestionStudioQuestions({
      engineId: "reasoning-v1",
      packageId: "DM-001",
      count: 10,
      language,
      difficulty,
      seed: "dm001-integration-test",
    });
    assert.equal(result.engineId, "reasoning-v1");
    assert.equal(result.questions.length, 10);
    assert.ok(result.questions.every((question) => question.difficulty === difficulty));
    assert.ok(result.questions.every((question) => question.reviewOnly === true));
    assert.ok(result.questions.every((question) => question.questionBankWritable === false));
    assert.ok(result.questions.every((question) => question.options?.length === 4));
    assert.ok(result.questions.every((question) => Number(question.correctIndex) >= 0 && Number(question.correctIndex) < 4));
  }
}

const basic = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  packageId: "DM-001",
  patternId: "DM-001",
  count: 7,
  seed: "dm001-cp-alias",
});
assert.ok(basic.questions.every((question) => question.checkpointId === "DM-CP-001"));

const dateProfile = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  packageId: "DM-001",
  patternId: "DM-QL-013",
  language: "pa",
  count: 5,
  seed: "dm001-age-cutoff",
});
assert.ok(dateProfile.questions.every((question) => question.checkpointId === "DM-CP-005"));
assert.ok(dateProfile.questions.every((question) => String(question.stem).includes("ਜਨਮ ਮਿਤੀ")));

console.log("DM-001 passed shared Question Studio registration, routing, locale, difficulty and review-only lifecycle checks.");
