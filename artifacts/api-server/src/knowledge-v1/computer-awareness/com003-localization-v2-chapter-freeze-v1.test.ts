import { strict as assert } from "node:assert";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_2 } from "./com003-review-synthesis-v16-2";
import {
  COM003_HINDI_LOCALIZATION_V2_CHAPTER,
  COM003_PUNJABI_LOCALIZATION_V2_CHAPTER,
} from "./com003-localization-v2-chapter";
import { COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1 } from "./com003-localization-v2-chapter-freeze-v1";

const freeze = COM003_LOCALIZATION_V2_CHAPTER_FREEZE_AUTHORITY_V1;

assert.equal(freeze.authorityId, "COM-003-LOCALIZATION-V2-CHAPTER-FREEZE-V1");
assert.equal(freeze.sourceEnglishAuthorityId, "COM-003-ENGLISH-FREEZE-V2");
assert.equal(
  freeze.sourceLocalizationCandidateAuthorityId,
  "COM-003-LOCALIZATION-V2-CHAPTER-CANDIDATE-2",
);
assert.equal(freeze.semanticEditorialAudit.conclusion, "success");
assert.equal(freeze.semanticEditorialAudit.workflowRunId, 33967565926);
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16_2.length, 228);
assert.equal(COM003_HINDI_LOCALIZATION_V2_CHAPTER.length, 228);
assert.equal(COM003_PUNJABI_LOCALIZATION_V2_CHAPTER.length, 228);
assert.equal(freeze.questionLanguageArtifactCount, 684);
assert.equal(freeze.qlCount, 19);
assert.equal(freeze.questionsPerQlPerLanguage, 12);

const englishById = new Map(
  COM003_ENGLISH_REVIEW_CORPUS_V16_2.map((question) => [question.questionId, question]),
);

for (const [language, items] of [
  ["hi", COM003_HINDI_LOCALIZATION_V2_CHAPTER],
  ["pa", COM003_PUNJABI_LOCALIZATION_V2_CHAPTER],
] as const) {
  assert.equal(new Set(items.map((item) => item.localizationId)).size, 228, `${language}:unique-localization-ids`);
  for (const item of items) {
    const english = englishById.get(item.sourceQuestionId);
    assert.ok(english, `${item.localizationId}:missing-English-source`);
    assert.equal(item.qlId, english.qlId, `${item.localizationId}:ql-drift`);
    assert.equal(item.targetFactId, english.targetFactId, `${item.localizationId}:target-fact-drift`);
    assert.equal(item.correctIndex, english.correctIndex, `${item.localizationId}:correct-index-drift`);
  }
}

assert.equal(freeze.governance.localizationFrozen, true);
assert.equal(freeze.governance.questionStudioRuntimeAuthorized, true);
assert.equal(freeze.governance.questionStudioReviewOnly, true);
assert.equal(freeze.governance.difficultyAuthorityMayBindToThisCorpus, true);
assert.equal(freeze.governance.questionBankWritesAuthorized, false);
assert.equal(freeze.governance.testEligibilityAuthorized, false);
assert.equal(freeze.governance.mockTestEligibilityAuthorized, false);
assert.equal(freeze.governance.automaticPublicationAuthorized, false);
assert.equal(freeze.governance.publiclyPublishable, false);
assert.equal(freeze.governance.productionReleased, false);

console.log("[COM003-LOCALIZATION-V2-CHAPTER-FREEZE-V1]", {
  authority: freeze.authorityId,
  reviewedHeadSha: freeze.reviewedHeadSha,
  semanticEditorialAuditRun: freeze.semanticEditorialAudit.workflowRunId,
  questionLanguageArtifacts: freeze.questionLanguageArtifactCount,
  governance: freeze.governance,
});
