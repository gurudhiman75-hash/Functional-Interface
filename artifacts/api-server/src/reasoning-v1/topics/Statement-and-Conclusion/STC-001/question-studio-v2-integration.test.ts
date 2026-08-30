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
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const packages = listReasoningV1QuestionStudioReviewPackages();
const stcPackages = packages.filter((entry) => entry.chapterId === "STC-001");
assert.equal(stcPackages.length, 2, "V1 audit baseline and V2 trilingual candidate should both remain reviewable");
assert.equal(stcPackages[0]!.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID, "V2 should be listed before the V1 baseline");
assert.ok(stcPackages.some((entry) => entry.packageId === "STC-001-V1-FROZEN-REVIEW"), "V1 audit baseline must remain available");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthorityCount, 48);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthoritiesPerQl, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.requiredDistinctSurfaceArchetypesPerQl, 8);
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.locales, LOCALES);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus, "TRILINGUAL_REVIEW_READY");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizedReviewSurfaceCount, 144);
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles, ["FOUR_WAY", "FIVE_WAY_EITHER"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.dedicatedFiveWayEitherAuthorityCount, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.fiveWayEitherStatus, "V2_SOLVER_VALIDATED_REVIEW_READY");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

for (const qlId of STC_QL_IDS) {
  for (let seed = 0; seed < 8; seed += 1) {
    const en = previewStc001V2QuestionStudioReview({ qlId, locale: "en-IN", seed });
    for (const locale of LOCALES) {
      const direct = previewStc001V2QuestionStudioReview({ qlId, locale, seed });
      const shared = previewReasoningV1QuestionStudioReview({
        packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
        qlId,
        locale,
        seed,
      });
      assert.equal(shared.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID);
      assert.equal(shared.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(shared.localizationStatus, "TRILINGUAL_REVIEW_READY");
      assert.equal(shared.question.scenarioId, direct.question.scenarioId);
      assert.equal(shared.question.scenarioId, en.question.scenarioId);
      assert.equal(shared.question.answerClass, direct.question.answerClass);
      assert.equal(shared.question.answerClass, en.question.answerClass);
      assert.equal(shared.question.correctIndex, direct.question.correctIndex);
      assert.equal(shared.question.correctIndex, en.question.correctIndex);
      assert.equal(shared.question.surfaceArchetype, direct.question.surfaceArchetype);
      assert.equal(shared.question.surfaceArchetype, en.question.surfaceArchetype);
      assert.equal(shared.question.metadata.questionBankWritable, false);
      assert.equal(shared.question.metadata.testEligible, false);
      assert.equal(shared.question.metadata.mockEligible, false);
      assert.equal(shared.question.metadata.publicEligible, false);
      assert.equal(shared.question.metadata.automaticPublication, false);
    }
  }
}

for (const locale of LOCALES) {
  const directFiveWay = previewStc001V2QuestionStudioReview({
    qlId: "STC-QL-002",
    locale,
    seed: 0,
    presentationProfile: "FIVE_WAY_EITHER",
  });
  const sharedFiveWay = previewReasoningV1QuestionStudioReview({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "STC-QL-002",
    locale,
    seed: 0,
    presentationProfile: "FIVE_WAY_EITHER",
  });
  assert.equal(directFiveWay.presentationProfile, "FIVE_WAY_EITHER");
  assert.equal(sharedFiveWay.presentationProfile, "FIVE_WAY_EITHER");
  assert.equal(sharedFiveWay.question.answerClass, "EITHER");
  assert.equal(sharedFiveWay.question.correctIndex, 2);
  assert.equal(sharedFiveWay.question.options.length, 5);
  assert.equal(sharedFiveWay.question.scenarioId, directFiveWay.question.scenarioId);
}

const v1CompatibilityPreview = previewReasoningV1QuestionStudioReview({
  packageId: "STC-001-V1-FROZEN-REVIEW",
  qlId: "STC-QL-001",
  locale: "en-IN",
  seed: 0,
});
assert.equal(v1CompatibilityPreview.packageId, "STC-001-V1-FROZEN-REVIEW");
assert.equal(v1CompatibilityPreview.lifecycleStatus, "REVIEW_ONLY");

assert.throws(
  () => assertStc001V2QuestionStudioPersistenceAllowed(),
  /trilingual Question Studio review-only.*delivery remains locked/i,
);
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "STC-QL-001",
    locale: "pa-IN",
    seed: 0,
  }),
  /trilingual Question Studio review-only.*delivery remains locked/i,
);

console.log("PASS_STC_001_V2_TRILINGUAL_QUESTION_STUDIO_INTEGRATION");
