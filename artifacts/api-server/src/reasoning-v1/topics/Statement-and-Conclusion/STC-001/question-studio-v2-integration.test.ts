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
assert.equal(stcPackages.length, 3, "V1, V2.1 and V2.2 review packages should remain available for audit/review");
assert.equal(stcPackages[1]!.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID, "V2.1 should remain immediately behind active V2.2");
assert.ok(stcPackages.some((entry) => entry.packageId === "STC-001-V1-FROZEN-REVIEW"), "V1 audit baseline must remain available");

assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.version, "V2.1");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthorityCount, 48);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.editorialAuthoritiesPerQl, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.requiredDistinctSurfaceArchetypesPerQl, 8);
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.locales, LOCALES);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.localizationStatus, "TRILINGUAL_REVIEW_READY");
assert.deepEqual(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.presentationProfiles, ["FOUR_WAY"]);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.bankingFiveWayEitherStatus, "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.archivedSolverValidatedFiveWayEitherAuthorityCount, 8);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.antiGamingScheduler, "STC_V2_1_NON_PERIODIC_16_SLOT");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.maximumDistinctCuratedPresentationsPerQlBeforeVariableization, 16);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.minimumDistinctQuestionsPerQlForGenerationReady, 1000);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.currentGenerationReady, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.saturationStatus, "BLOCKED_NEEDS_VARIABLEIZED_SURFACE_ENGINE");
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(STC_001_V2_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

for (const qlId of STC_QL_IDS) {
  const answerSequence: string[] = [];
  const presentationKeys = new Set<string>();

  for (let seed = 0; seed < 32; seed += 1) {
    const en = previewStc001V2QuestionStudioReview({ qlId, locale: "en-IN", seed });
    answerSequence.push(en.question.answerClass);
    if (seed < 16) presentationKeys.add(`${en.question.scenarioId}|${en.question.conclusions.join("||")}`);

    for (const locale of LOCALES) {
      const direct = previewStc001V2QuestionStudioReview({ qlId, locale, seed });
      const shared = previewReasoningV1QuestionStudioReview({ packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID, qlId, locale, seed });
      assert.equal(shared.packageId, STC_001_V2_QUESTION_STUDIO_PACKAGE_ID);
      assert.equal(shared.lifecycleStatus, "REVIEW_ONLY");
      assert.equal(shared.generationReady, false);
      assert.equal(shared.saturationStatus, "BLOCKED_NEEDS_VARIABLEIZED_SURFACE_ENGINE");
      assert.equal(shared.localizationStatus, "TRILINGUAL_REVIEW_READY");
      assert.equal(shared.presentationProfile, "FOUR_WAY");
      assert.equal(shared.question.scenarioId, direct.question.scenarioId);
      assert.equal(shared.question.scenarioId, en.question.scenarioId);
      assert.equal(shared.question.answerClass, direct.question.answerClass);
      assert.equal(shared.question.answerClass, en.question.answerClass);
      assert.equal(shared.question.correctIndex, direct.question.correctIndex);
      assert.equal(shared.question.correctIndex, en.question.correctIndex);
      assert.equal(shared.question.surfaceArchetype, direct.question.surfaceArchetype);
      assert.equal(shared.question.surfaceArchetype, en.question.surfaceArchetype);
      assert.equal(shared.question.metadata.conclusionsReversed, en.question.metadata.conclusionsReversed);
      assert.equal(shared.question.metadata.presentationSlot, en.question.metadata.presentationSlot);
      assert.equal(shared.question.metadata.antiGamingScheduler, "STC_V2_1_NON_PERIODIC_16_SLOT");
      assert.equal(shared.question.metadata.saturationReady, false);
      assert.equal(shared.question.metadata.questionBankWritable, false);
      assert.equal(shared.question.metadata.testEligible, false);
      assert.equal(shared.question.metadata.mockEligible, false);
      assert.equal(shared.question.metadata.publicEligible, false);
      assert.equal(shared.question.metadata.automaticPublication, false);
    }
  }

  assert.equal(presentationKeys.size, 16, `${qlId}: first 16 seeds must cover 16 distinct authority/order presentations`);
  assert.notDeepEqual(answerSequence.slice(0, 4), answerSequence.slice(4, 8), `${qlId}: old four-answer seed cycle must not survive`);
  assert.notDeepEqual(answerSequence.slice(0, 8), answerSequence.slice(8, 16), `${qlId}: answer sequence must not repeat every eight seeds`);
}

assert.throws(() => previewStc001V2QuestionStudioReview({ qlId: "STC-QL-002", locale: "en-IN", seed: 0, presentationProfile: "FIVE_WAY_EITHER" as never }), /only the non-syllogistic FOUR_WAY profile/i);

const v1CompatibilityPreview = previewReasoningV1QuestionStudioReview({ packageId: "STC-001-V1-FROZEN-REVIEW", qlId: "STC-QL-001", locale: "en-IN", seed: 0 });
assert.equal(v1CompatibilityPreview.packageId, "STC-001-V1-FROZEN-REVIEW");
assert.equal(v1CompatibilityPreview.lifecycleStatus, "REVIEW_ONLY");

assert.throws(() => assertStc001V2QuestionStudioPersistenceAllowed(), /not saturation-ready.*delivery remains locked/i);
assert.throws(() => persistReasoningV1QuestionStudioReview({ packageId: STC_001_V2_QUESTION_STUDIO_PACKAGE_ID, qlId: "STC-QL-001", locale: "pa-IN", seed: 0 }), /not saturation-ready.*delivery remains locked/i);

console.log("PASS_STC_001_V2_1_ANTIGAMING_SATURATION_BOUNDARY");
