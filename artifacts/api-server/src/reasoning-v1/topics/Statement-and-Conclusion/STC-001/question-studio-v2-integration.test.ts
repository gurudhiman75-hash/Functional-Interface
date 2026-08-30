import assert from "node:assert/strict";
import {
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import {
  STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
  STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001V2QuestionStudioPersistenceAllowed,
  previewStc001V2QuestionStudioReview,
} from "./question-studio-review-v2.ts";
import { STC_QL_IDS } from "./types.ts";

const packages = listReasoningV1QuestionStudioReviewPackages();
const activeStcPackages = packages.filter((entry) => entry.chapterId === "STC-001");
assert.equal(activeStcPackages.length, 1, "only one STC package should be visible in the active review registry");
assert.equal(activeStcPackages[0]!.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthorityCount, 48);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthoritiesPerQl, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.requiredDistinctSurfaceArchetypesPerQl, 8);
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.locales, ["en-IN"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus, "PENDING_AFTER_ENGLISH_EDITORIAL_APPROVAL");
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles, ["FOUR_WAY"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

for (const qlId of STC_QL_IDS) {
  for (let seed = 0; seed < 8; seed += 1) {
    const direct = previewStc001V2QuestionStudioReview({ qlId, locale: "en-IN", seed });
    const shared = previewReasoningV1QuestionStudioReview({
      packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
      qlId,
      locale: "en-IN",
      seed,
    });
    assert.equal(shared.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID);
    assert.equal(shared.lifecycleStatus, "REVIEW_ONLY");
    assert.equal(shared.question.scenarioId, direct.question.scenarioId);
    assert.equal(shared.question.answerClass, direct.question.answerClass);
    assert.equal(shared.question.correctIndex, direct.question.correctIndex);
    assert.equal(shared.question.surfaceArchetype, direct.question.surfaceArchetype);
    assert.equal(shared.question.metadata.questionBankWritable, false);
    assert.equal(shared.question.metadata.testEligible, false);
    assert.equal(shared.question.metadata.mockEligible, false);
    assert.equal(shared.question.metadata.publicEligible, false);
  }
}

assert.throws(
  () => assertStc001V2QuestionStudioPersistenceAllowed(),
  /editorial review candidate only.*delivery remains locked/i,
);
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "STC-QL-001",
    locale: "en-IN",
    seed: 0,
  }),
  /editorial review candidate only.*delivery remains locked/i,
);

console.log("PASS_STC_001_V2_QUESTION_STUDIO_INTEGRATION");
