import assert from "node:assert/strict";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry.ts";
import {
  STC_001_QUESTION_STUDIO_PACKAGE_ID,
  STC_001_QUESTION_STUDIO_RELEASE_FREEZE,
  STC_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  assertStc001QuestionStudioPersistenceAllowed,
  previewStc001QuestionStudioReview,
} from "./question-studio-review.ts";
import { STC_QL_IDS, type StcLocale } from "./types.ts";

const LOCALES: readonly StcLocale[] = ["en-IN", "hi-IN", "pa-IN"];

assert.equal(STC_001_QUESTION_STUDIO_RELEASE_FREEZE, "STC-001-V1-SIX-QL-FROZEN");
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlCount, 6);
assert.deepEqual(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, STC_QL_IDS);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.semanticAuthorityCount, 48);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.semanticAuthoritiesPerQl, 8);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.dedicatedFiveWayEitherAuthorityCount, 9);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualChapterFrozen, true);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

for (const [qlIndex, qlId] of STC_QL_IDS.entries()) {
  const seed = 1701 + qlIndex * 997;
  const en = previewStc001QuestionStudioReview({ qlId, locale: "en-IN", seed });
  assert.equal(en.packageId, STC_001_QUESTION_STUDIO_PACKAGE_ID);
  assert.equal(en.freezeId, "STC-001-V1-SIX-QL-FROZEN");
  assert.equal(en.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(en.multilingualFrozen, true);
  assert.equal(en.question.qlId, qlId);
  assert.equal(en.question.metadata.reviewOnly, true);
  assert.equal(en.question.metadata.questionBankWritable, false);
  assert.equal(en.question.metadata.testEligible, false);
  assert.equal(en.question.metadata.mockEligible, false);
  assert.equal(en.question.metadata.publicEligible, false);

  for (const locale of LOCALES) {
    const localized = previewStc001QuestionStudioReview({ qlId, locale, seed });
    assert.equal(localized.question.qlId, qlId, `${qlId}/${locale}: QL drift`);
    assert.equal(localized.question.scenarioId, en.question.scenarioId, `${qlId}/${locale}: scenario drift`);
    assert.equal(localized.question.answerClass, en.question.answerClass, `${qlId}/${locale}: answer-class drift`);
    assert.equal(localized.question.correctIndex, en.question.correctIndex, `${qlId}/${locale}: answer-index drift`);
    assert.equal(localized.question.difficulty, en.question.difficulty, `${qlId}/${locale}: difficulty drift`);
    assert.equal(localized.multilingualFrozen, true, `${qlId}/${locale}: multilingual freeze missing`);
  }
}

const fiveWay = previewStc001QuestionStudioReview({
  qlId: "STC-QL-002",
  locale: "en-IN",
  seed: 0,
  presentationProfile: "FIVE_WAY_EITHER",
});
assert.equal(fiveWay.presentationProfile, "FIVE_WAY_EITHER");
assert.equal(fiveWay.question.answerClass, "EITHER");
assert.equal(fiveWay.question.correctIndex, 2);
assert.equal(fiveWay.question.options.length, 5);

const allPackages = listReasoningV1QuestionStudioReviewPackages();
assert.ok(allPackages.some((entry) => entry.packageId === STC_001_QUESTION_STUDIO_PACKAGE_ID), "shared registry must list STC-001");
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
assert.ok(enabledPackages.some((entry) => entry.packageId === STC_001_QUESTION_STUDIO_PACKAGE_ID), "shared registry must enable STC-001 review package");

const sharedPreview = previewReasoningV1QuestionStudioReview({
  packageId: STC_001_QUESTION_STUDIO_PACKAGE_ID,
  qlId: "STC-QL-003",
  locale: "hi-IN",
  seed: 301,
});
assert.equal(sharedPreview.packageId, STC_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(sharedPreview.freezeId, "STC-001-V1-SIX-QL-FROZEN");
assert.equal(sharedPreview.lifecycleStatus, "REVIEW_ONLY");

assert.throws(
  () => assertStc001QuestionStudioPersistenceAllowed(),
  /review only.*delivery remains locked/i,
);
assert.throws(
  () => persistReasoningV1QuestionStudioReview({
    packageId: STC_001_QUESTION_STUDIO_PACKAGE_ID,
    qlId: "STC-QL-001",
    locale: "en-IN",
    seed: 11,
  }),
  /review only.*delivery remains locked/i,
);

console.log("PASS_STC_001_V1_FROZEN_QUESTION_STUDIO_INTEGRATION");
