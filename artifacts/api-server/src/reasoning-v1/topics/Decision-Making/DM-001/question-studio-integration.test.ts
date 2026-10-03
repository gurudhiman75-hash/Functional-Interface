import assert from "node:assert/strict";
import { generateQuestionStudioQuestions } from "../../../../question-studio/engine-registry.ts";
import { reasoningV1QuestionStudioAdapter } from "../../../../question-studio/engines/reasoning-v1-adapter.ts";

const registered = reasoningV1QuestionStudioAdapter.listPackages().find((entry) => entry.packageId === "DM-001");
assert.ok(registered, "DM-001 must be discoverable through the shared Question Studio registry");
assert.equal(registered.engineId, "reasoning-v1");
assert.deepEqual(registered.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(registered.cpIds, Array.from({ length: 20 }, (_, index) => "DM-CP-" + String(index + 1).padStart(3, "0")));
assert.equal(registered.lifecycleStage, "REVIEW_ONLY");
assert.equal(registered.questionBankWritable, false);
assert.equal(registered.testEligible, false);
assert.equal(registered.mockTestEligible, false);
assert.equal(registered.publiclyPublishable, false);

for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateQuestionStudioQuestions({
      engineId: "reasoning-v1",
      topic: "Decision Making / Eligibility",
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
  patternId: "DM-001",
  count: 7,
  seed: "dm001-cp-alias",
});
assert.ok(basic.questions.every((question) => question.checkpointId === "DM-CP-001"));

const dateProfile = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  patternId: "DM-QL-013",
  language: "pa",
  count: 5,
  seed: "dm001-age-cutoff",
});
assert.ok(dateProfile.questions.every((question) => question.checkpointId === "DM-CP-005"));
assert.ok(dateProfile.questions.every((question) => String(question.stem).includes("ਜਨਮ ਮਿਤੀ")));

const benefits = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  patternId: "DM-007",
  language: "en",
  count: 5,
  seed: "dm001-benefit-eligibility",
});
assert.ok(benefits.questions.every((question) => question.checkpointId === "DM-CP-007"));
assert.ok(benefits.questions.every((question) => String(question.stem).includes("fictional scheme")));

const ranked = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  patternId: "DM-010",
  language: "pa",
  difficulty: "Hard",
  count: 5,
  seed: "dm001-priority-ranking",
});
assert.ok(ranked.questions.every((question) => question.checkpointId === "DM-CP-010"));
assert.ok(ranked.questions.every((question) => question.answerMode === "RANKED_CANDIDATE_SET"));
assert.ok(ranked.questions.every((question) => Array.isArray(question.selectedCandidates) && question.selectedCandidates.length > 0));
assert.ok(ranked.questions.every((question) => question.answer === question.canonicalAnswer));
assert.ok(ranked.questions.every((question) => String(question.stem).includes("ਤਰਜੀਹ ਦਾ ਕ੍ਰਮ")));

const immediate = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1", patternId: "DM-012", language: "hi", difficulty: "Medium", count: 8, seed: "dm001-immediate-action",
});
assert.ok(immediate.questions.every((question) => question.checkpointId === "DM-CP-012"));
assert.ok(immediate.questions.every((question) => question.answerMode === "SITUATIONAL_ACTION"));
assert.ok(immediate.questions.every((question) => question.answer === question.canonicalAnswer));
assert.ok(immediate.questions.every((question) => String(question.explanation).includes("यह पहले क्यों")));

const resources = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1", patternId: "DM-QL-046", language: "en", difficulty: "Hard", count: 8, seed: "dm001-resource-priority",
});
assert.ok(resources.questions.every((question) => question.checkpointId === "DM-CP-016"));
assert.ok(resources.questions.every((question) => question.answerMode === "SITUATIONAL_ACTION"));

const incomplete = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1", patternId: "DM-018", language: "pa", difficulty: "Hard", count: 8, seed: "dm001-incomplete-information",
});
assert.ok(incomplete.questions.every((question) => question.checkpointId === "DM-CP-018"));
assert.ok(incomplete.questions.every((question) => question.ruleOutcome === "REJECT"));

const mixedSet = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1", patternId: "DM-020", language: "en", difficulty: "Hard", count: 10, seed: "dm001-mixed-set",
});
assert.ok(mixedSet.questions.every((question) => question.checkpointId === "DM-CP-020"));
assert.ok(mixedSet.questions.every((question) => question.answerMode === "MIXED_DECISION_SET"));
assert.ok(mixedSet.questions.every((question) => question.answer === question.canonicalAnswer));
assert.ok(mixedSet.questions.every((question) => Array.isArray(question.selectedCandidates)));
assert.equal(new Set(mixedSet.questions.map((question) => question.id)).size, 10);
assert.equal(new Set(mixedSet.questions.map((question) => question.setId)).size, 2);
for (let offset = 0; offset < mixedSet.questions.length; offset += 5) {
  const setQuestions = mixedSet.questions.slice(offset, offset + 5);
  assert.equal(setQuestions.length, 5);
  assert.equal(new Set(setQuestions.map((question) => question.setId)).size, 1);
  assert.equal(new Set(setQuestions.map((question) => question.scenarioId)).size, 1);
  assert.equal(new Set(setQuestions.map((question) => question.setSharedStimulus)).size, 1);
  assert.equal(new Set(setQuestions.map((question) => JSON.stringify(question.setCandidateProfiles))).size, 1);
  assert.deepEqual(setQuestions.map((question) => question.setQuestionNumber), [1, 2, 3, 4, 5]);
  assert.deepEqual(new Set(setQuestions.map((question) => question.setQuestionKind)), new Set(["COUNT_SELECTED", "IDENTIFY_REJECTED", "IDENTIFY_REFERRED", "SAME_DECISION_PAIR", "INFORMATION_REQUIRED"]));
}

console.log("DM-001 passed shared Question Studio registration, routing, Waves 1–4 selectors, locale, difficulty and review-only lifecycle checks.");
