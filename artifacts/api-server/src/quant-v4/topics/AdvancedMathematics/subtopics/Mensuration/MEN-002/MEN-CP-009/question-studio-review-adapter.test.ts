import assert from "node:assert/strict";
import { MEN_CP_009_FROZEN_QLS_V2 } from "./coverage-v2/registry";
import {
  MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD,
  MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST,
  MEN_CP009_QUESTION_STUDIO_FREEZE_ID,
  MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE,
  MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS,
  previewMenCp009QuestionStudioReview,
} from "./question-studio-review-adapter";

assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.frozenQlCount, 28);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedReviewPayloadCount, 330);
assert.deepEqual(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority, MEN_CP009_QUESTION_STUDIO_FREEZE_ID);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedSourceHead, MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD);
assert.equal(MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedArtifactDigest, MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST);

let checked = 0;
for (const row of MEN_CP_009_FROZEN_QLS_V2) {
  for (const language of ["en", "hi", "pa"] as const) {
    const result = previewMenCp009QuestionStudioReview({
      qlId: row.qlId,
      language,
      count: 1,
      seed: `men-cp009-question-studio:${row.qlId}:${language}`,
    });
    assert.equal(result.questions.length, 1);
    assert.equal(result.generationContext.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(result.generationContext.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
    assert.equal(result.generationContext.questionBankStatus, "NOT_STORED");
    assert.equal(result.generationContext.questionBankWritable, false);
    assert.equal(result.generationContext.testEligible, false);
    assert.equal(result.generationContext.publiclyPublishable, false);

    const question = result.questions[0]!;
    assert.equal(question.qlId, row.qlId);
    assert.equal(question.language, language);
    assert.equal(question.reviewStatus, MEN_CP009_QUESTION_STUDIO_REVIEW_STATUS);
    assert.equal(question.integrationAuthority, MEN_CP009_QUESTION_STUDIO_FREEZE_ID);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.optionDetails[question.correctIndex]?.isCorrect, true);
    assert.equal(question.answer, question.options[question.correctIndex]);
    assert.ok(question.explanation.steps.length >= 4 && question.explanation.steps.length <= 5);
    assert.ok(question.explanation.steps.some((line) => /[=×÷]|√|∛/u.test(line)));
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.questionStudioVisible, true);
    assert.equal(question.safety.questionStudioDiscoverable, true);
    assert.equal(question.safety.persistenceAllowed, true);
    assert.equal(question.safety.questionBankWritable, false);
    assert.equal(question.safety.questionBankEligible, false);
    assert.equal(question.safety.testEligible, false);
    assert.equal(question.safety.mockTestEligible, false);
    assert.equal(question.safety.publiclyPublishable, false);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.sourceLifecycleLocked, true);
    assert.equal(question.traceability.approvedReviewedHead, MEN_CP009_QUESTION_STUDIO_APPROVED_HEAD);
    assert.equal(question.traceability.artifactDigest, MEN_CP009_QUESTION_STUDIO_ARTIFACT_DIGEST);

    if (language === "pa") {
      const learnerText = [question.stem, ...question.options, question.answer, ...question.explanation.steps].join("\n");
      assert.ok(!learnerText.includes("ਸਤਹ"), `${row.qlId}: rejected Punjabi surface spelling leaked.`);
    }
    checked += 1;
  }
}
assert.equal(checked, 28 * 3);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = previewMenCp009QuestionStudioReview({
    language: "en",
    difficulty,
    count: 6,
    seed: `men-cp009-question-studio:difficulty:${difficulty}`,
  });
  assert.equal(result.questions.length, 6);
  assert.ok(result.questions.every((question) => question.difficultyBand === difficulty));
}

const batch = previewMenCp009QuestionStudioReview({
  language: "pa",
  count: 50,
  seed: "men-cp009-question-studio:batch-50",
});
assert.equal(batch.questions.length, 50);
assert.ok(batch.questions.every((question) => question.language === "pa"));
assert.ok(batch.questions.every((question) => question.questionBankWritable === false));
assert.ok(batch.questions.every((question) => question.testEligible === false));
assert.ok(batch.questions.every((question) => question.publiclyPublishable === false));

console.log(JSON.stringify({
  packageId: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.packageId,
  checkpointId: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointId,
  frozenQlCount: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.frozenQlCount,
  approvedReviewPayloadCount: MEN_CP009_QUESTION_STUDIO_REVIEW_PACKAGE.approvedReviewPayloadCount,
  perQlLanguageChecks: checked,
  maxBatchCheck: batch.questions.length,
  status: "PASS_MEN_CP009_QUESTION_STUDIO_REVIEW_ONLY",
}, null, 2));
