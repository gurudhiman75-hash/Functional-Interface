import assert from "node:assert/strict";
import { listQuestionStudioPackages, resolveQuestionStudioEngine, generateQuestionStudioQuestions } from "../../../../question-studio/engine-registry.ts";
import { SIF_001_QUESTION_STUDIO_PACKAGE as SIF_NORMAL_PACKAGE } from "./question-studio-adapter.ts";
import { listEnabledReasoningV1QuestionStudioPackages, listReasoningV1QuestionStudioReviewPackages, persistReasoningV1QuestionStudioReview, previewReasoningV1QuestionStudioReview } from "../../../question-studio-review-registry.ts";
import { SIF_001_QUESTION_STUDIO_PACKAGE_ID, SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";
import { SIF_BANKING_THREE_INFERENCE_PROFILE_ID } from "./banking-three-inference.ts";

assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.cpCount, 17);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.lifecycleStatus, "REVIEW_ONLY");
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualFrozen, true);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus, "SIF_001_V1_FROZEN_REVIEW_ONLY");
assert.ok(listReasoningV1QuestionStudioReviewPackages().some((entry) => entry.packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID));
assert.ok(listEnabledReasoningV1QuestionStudioPackages().some((entry) => entry.packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID));

const preview = previewReasoningV1QuestionStudioReview({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID, cpId: "SIF-CP010", locale: "pa-IN", seed: 1010 });
assert.equal(preview.packageId, SIF_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(preview.lifecycleStatus, "REVIEW_ONLY");
assert.equal(preview.multilingualFrozen, true);
assert.equal(preview.question.cpId, "SIF-CP010");
assert.equal(preview.question.metadata.questionBankWritable, false);

for (const cpId of ["SIF-CP015", "SIF-CP016", "SIF-CP017"] as const) {
  const pack = previewReasoningV1QuestionStudioReview({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID, cpId, locale: "pa-IN", seed: 1010 });
  assert.equal(pack.question.cpId, cpId);
  assert.equal(pack.question.locale, "pa-IN");
  assert.equal(pack.question.metadata.reviewOnly, true);
  assert.equal(pack.question.validation.every((gate) => gate.passed), true);
}

assert.throws(() => persistReasoningV1QuestionStudioReview({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID, cpId: "SIF-CP001", locale: "en-IN", seed: 1 }), /review only.*delivery remain locked/i);

const normalPackage = listQuestionStudioPackages().find((entry) => entry.packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID);
assert.ok(normalPackage, "SIF-001 must appear in normal Question Studio package capabilities");
assert.equal(normalPackage.engineId, "reasoning-v1");
assert.equal(normalPackage.enabled, true);
assert.deepEqual(normalPackage.cpIds, SIF_NORMAL_PACKAGE.cpIds);
assert.deepEqual(normalPackage.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(normalPackage.lifecycleStage, "REVIEW_ONLY");
assert.equal(normalPackage.questionBankWritable, false);
assert.equal(normalPackage.testEligible, false);
assert.equal(normalPackage.publiclyPublishable, false);
assert.equal(normalPackage.metadata?.reviewRunPersistenceAllowed, true);
assert.equal(normalPackage.metadata?.canonicalQuestionPersistenceAllowed, false);
assert.equal(resolveQuestionStudioEngine({ packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID }).engineId, "reasoning-v1");

const paRun = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  canonicalProblemId: "SIF-CP015",
  language: "pa",
  difficulty: "Hard",
  runtimeMode: "review-only",
  count: 3,
  seed: "sif-normal-workflow-parity",
});
const hiRun = await generateQuestionStudioQuestions({
  packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  canonicalProblemId: "SIF-CP015",
  language: "hi",
  difficulty: "Hard",
  runtimeMode: "review-only",
  count: 3,
  seed: "sif-normal-workflow-parity",
});
assert.equal(paRun.engineId, "reasoning-v1");
assert.equal(paRun.questions.length, 3);
assert.equal(paRun.generationContext?.reviewRunPersistenceAllowed, true);
assert.equal(paRun.generationContext?.canonicalQuestionPersistenceAllowed, false);
assert.equal(paRun.generationContext?.questionBankWritable, false);
assert.equal(paRun.generationContext?.testEligible, false);
assert.equal(paRun.generationContext?.publiclyPublishable, false);
assert.equal(new Set(paRun.questions.map((question) => question.sourceAuthorityId)).size, 3);
for (const [index, paQuestion] of paRun.questions.entries()) {
  const hiQuestion = hiRun.questions[index];
  assert.equal(paQuestion.cpId, "SIF-CP015");
  assert.equal(paQuestion.language, "pa");
  assert.equal(paQuestion.locale, "pa-IN");
  assert.equal(paQuestion.difficulty, "Hard");
  assert.equal(paQuestion.lifecycleStage, "REVIEW_ONLY");
  assert.equal(paQuestion.reviewRunPersistenceAllowed, true);
  assert.equal(paQuestion.canonicalQuestionPersistenceAllowed, false);
  assert.equal(paQuestion.reviewOnly, true);
  assert.equal(paQuestion.questionBankWritable, false);
  assert.equal(paQuestion.testEligible, false);
  assert.equal(paQuestion.mockTestEligible, false);
  assert.equal(paQuestion.publiclyPublishable, false);
  assert.equal(paQuestion.sourceAuthorityId, hiQuestion.sourceAuthorityId);
  assert.equal(paQuestion.answerClass, hiQuestion.answerClass);
  assert.equal(paQuestion.correctIndex, hiQuestion.correctIndex);
}

const bankingThreeInference = await generateQuestionStudioQuestions({
  engineId: "reasoning-v1",
  packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  patternId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
  language: "pa",
  runtimeMode: "review-only",
  count: 5,
  seed: "sif-banking-three-inference-integration",
});
assert.equal(bankingThreeInference.questions.length, 5);
assert.equal(bankingThreeInference.generationContext?.presentationProfileId, SIF_BANKING_THREE_INFERENCE_PROFILE_ID);
for (const question of bankingThreeInference.questions) {
  assert.equal(question.patternId, SIF_BANKING_THREE_INFERENCE_PROFILE_ID);
  assert.equal(question.canonicalProblemId, SIF_BANKING_THREE_INFERENCE_PROFILE_ID);
  assert.equal(question.format, "THREE_INFERENCES");
  assert.equal(question.language, "pa");
  assert.equal(question.locale, "pa-IN");
  assert.match(String(question.instruction), /ਤਿੰਨਾਂ ਅਨੁਮਾਨਾਂ/u);
  assert.doesNotMatch(String(question.instruction), /Read the statement/i);
  assert.equal(question.options.length, 5);
  assert.equal(question.inferences.length, 3);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.ok(["Medium", "Hard"].includes(String(question.difficulty)));
}
assert.equal(
  new Set(bankingThreeInference.questions.map((question) => question.sourceAuthorityId)).size,
  5,
  "Banking three-inference review batch must use five distinct curated authorities",
);

console.log("PASS_SIF_001_NORMAL_QUESTION_STUDIO_INTEGRATION");
