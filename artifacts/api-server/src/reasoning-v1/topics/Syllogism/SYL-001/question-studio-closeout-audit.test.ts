import assert from "node:assert/strict";
import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import { SYL_001_CHAPTER_AUTHORITY } from "./manifest";
import {
  SYL_001_QUESTION_STUDIO_PACKAGE,
  SYL_001_QUESTION_STUDIO_PACKAGE_ID,
  SYL_001_QUESTION_STUDIO_QL_IDS,
  previewSyl001QuestionStudio,
} from "./question-studio-adapter";

assert.equal(SYL_001_CHAPTER_AUTHORITY.status, "CLOSED_FOR_QUESTION_STUDIO__DELIVERY_LOCKED");
assert.equal(SYL_001_CHAPTER_AUTHORITY.acceptedGeneratorVersion, "generator-v5");
assert.equal(SYL_001_CHAPTER_AUTHORITY.permanentQlCount, 18);
assert.equal(SYL_001_CHAPTER_AUTHORITY.manualEditorialApproval, true);
assert.equal(SYL_001_CHAPTER_AUTHORITY.humanViewportApproval, true);
assert.equal(SYL_001_CHAPTER_AUTHORITY.questionStudioVisible, true);
assert.equal(SYL_001_CHAPTER_AUTHORITY.questionStudioGenerationEnabled, true);
assert.equal(SYL_001_CHAPTER_AUTHORITY.questionStudioWriteEnabled, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.questionBankWritable, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.testEligible, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.publiclyPublishable, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.chapterFreezeApproved, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.exactHistoricalSourceWeightFreezeApproved, false);
assert.equal(SYL_001_CHAPTER_AUTHORITY.difficultyCalibrationFrozen, false);

assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.enabled, true);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.questionStudioVisible, true);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.questionStudioGenerationEnabled, true);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.persistenceAllowed, false);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.questionBankEligible, false);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(SYL_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(SYL_001_QUESTION_STUDIO_QL_IDS.length, 18);
assert.equal(new Set(SYL_001_QUESTION_STUDIO_QL_IDS).size, 18);

const allPackages = listReasoningV1QuestionStudioReviewPackages();
const enabledPackages = listEnabledReasoningV1QuestionStudioPackages();
assert.equal(allPackages.some((entry) => entry.packageId === SYL_001_QUESTION_STUDIO_PACKAGE_ID), true);
assert.equal(enabledPackages.some((entry) => entry.packageId === SYL_001_QUESTION_STUDIO_PACKAGE_ID), true);

const languages = ["en", "hi", "pa"] as const;
const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
let generatedCount = 0;
let diagramsObserved = 0;

for (const [languageIndex, language] of languages.entries()) {
  for (const [qlIndex, qlId] of SYL_001_QUESTION_STUDIO_QL_IDS.entries()) {
    const result = previewSyl001QuestionStudio({
      language,
      qlId,
      seed: 71000 + languageIndex * 10000 + qlIndex * 101,
      count: 1,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;
    assert.equal(question.packageId, SYL_001_QUESTION_STUDIO_PACKAGE_ID);
    assert.equal(question.qlId, qlId);
    assert.equal(question.locale, locales[languageIndex]);
    assert.equal(question.validation.valid, true);
    assert.equal(question.safety.questionStudioVisible, true);
    assert.equal(question.safety.questionStudioGenerationEnabled, true);
    assert.equal(question.safety.persistenceAllowed, false);
    assert.equal(question.safety.questionBankEligible, false);
    assert.equal(question.safety.mockTestEligible, false);
    assert.equal(question.safety.publiclyPublishable, false);
    assert.ok(question.stem.length > 0);
    assert.ok(question.statements.length > 0);
    // SYL modal-diagnostic QLs intentionally use an exhaustive three-way option space;
    // other approved QLs use four or five options. Do not manufacture distractors for Studio.
    assert.ok(question.options.length >= 3);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length);
    assert.ok(question.explanation.shortReasoning.length > 0);
    assert.ok(question.explanation.conclusion.length > 0);
    if (question.renderer.diagramAvailable) diagramsObserved += 1;
    generatedCount += 1;
  }
}

const registryPreview = previewReasoningV1QuestionStudioReview({
  packageId: SYL_001_QUESTION_STUDIO_PACKAGE_ID,
  language: "en",
  qlId: "SYL-QL-001",
  seed: 99001,
  count: 2,
});
assert.equal(registryPreview.questions.length, 2);
assert.equal(registryPreview.questions.every((question) => question.validation.valid), true);

console.log(JSON.stringify({
  status: "PASS_SYL_001_QUESTION_STUDIO_CLOSEOUT_V1",
  chapterStatus: SYL_001_CHAPTER_AUTHORITY.status,
  qlCount: SYL_001_QUESTION_STUDIO_QL_IDS.length,
  locales: languages.length,
  generatedAuditRecords: generatedCount,
  diagramsObserved,
  questionStudioVisible: SYL_001_QUESTION_STUDIO_PACKAGE.questionStudioVisible,
  questionStudioGenerationEnabled: SYL_001_QUESTION_STUDIO_PACKAGE.questionStudioGenerationEnabled,
  persistenceAllowed: SYL_001_QUESTION_STUDIO_PACKAGE.persistenceAllowed,
  questionBankEligible: SYL_001_QUESTION_STUDIO_PACKAGE.questionBankEligible,
  mockTestEligible: SYL_001_QUESTION_STUDIO_PACKAGE.mockTestEligible,
  publiclyPublishable: SYL_001_QUESTION_STUDIO_PACKAGE.publiclyPublishable,
  exactHistoricalSourceWeightFreezeApproved: SYL_001_CHAPTER_AUTHORITY.exactHistoricalSourceWeightFreezeApproved,
  difficultyCalibrationFrozen: SYL_001_CHAPTER_AUTHORITY.difficultyCalibrationFrozen,
}, null, 2));
