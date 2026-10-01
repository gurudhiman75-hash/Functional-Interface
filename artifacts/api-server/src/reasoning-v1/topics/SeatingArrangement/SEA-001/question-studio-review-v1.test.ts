import assert from "node:assert/strict";
import {
  SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  isSea001QuestionStudioRequest,
  previewSea001QuestionStudioReview,
} from "./question-studio-review-v1.ts";
import {
  generateQuestion,
  listQuestionStudioPackages,
} from "../../../question-studio/shared-generation-engine.ts";

assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 9);
assert.deepEqual(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.deepEqual(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, true);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(SEA_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

for (const language of ["en", "hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const preview = previewSea001QuestionStudioReview({
      language,
      difficulty,
      seed: `sea-qs-proof:${language}:${difficulty}`,
      count: 5,
    });
    assert.ok(preview.questions.length >= 1);
    assert.ok(preview.questions.length <= 5);
    for (const question of preview.questions) {
      assert.equal(question.language, language);
      assert.equal(question.difficultyBand, difficulty);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.answer, question.options[question.correctIndex]);
      assert.equal(question.validation.valid, true);
      assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.diagramPolicy, "EXPLANATION_ONLY");
    }
  }
}

for (let ql = 1; ql <= 9; ql += 1) {
  const qlId = `SEA-QL-${String(ql).padStart(3, "0")}`;
  const preview = previewSea001QuestionStudioReview({
    language: "pa",
    canonicalProblemId: qlId,
    seed: `sea-qs-ql-proof:${qlId}`,
    count: 1,
  });
  assert.equal(preview.questions.length, 1);
  assert.equal(preview.questions[0]!.qlId, qlId);
}

assert.equal(isSea001QuestionStudioRequest({ packageId: "SEA-001" }), true);
assert.equal(isSea001QuestionStudioRequest({ canonicalProblemId: "SEA-QL-004" }), true);
assert.equal(isSea001QuestionStudioRequest({ subtopic: "Seating Arrangement" }), true);
assert.equal(isSea001QuestionStudioRequest({ packageId: "WOR-001" }), false);

const packages = listQuestionStudioPackages();
const seaPackages = packages.filter((entry: any) => String(entry.packageId) === "SEA-001");
assert.equal(seaPackages.length, 1);
assert.equal(seaPackages[0]!.enabled, true);
assert.equal(seaPackages[0]!.permanentQlCount, 9);

const shared = await generateQuestion({
  packageId: "SEA-001",
  language: "hi",
  difficulty: "Medium",
  seed: "sea-shared-engine-proof",
  count: 3,
});
assert.ok(Array.isArray(shared.questions));
assert.ok(shared.questions.length >= 1 && shared.questions.length <= 3);
assert.equal(shared.generationContext.packageId, "SEA-001");
assert.equal(shared.generationContext.multilingualChapterFrozen, true);
assert.equal(shared.generationContext.questionBankWritable, false);

console.log(JSON.stringify({
  status: "PASS_SEA_001_QUESTION_STUDIO_REVIEW_V1",
  permanentQlCount: 9,
  languages: 3,
  difficulties: 3,
  frozenPoolPerLanguage: 324,
  sharedEngineRegisteredExactlyOnce: true,
  reviewOnly: true,
  downstreamReleaseLocked: true,
}, null, 2));
