import assert from "node:assert/strict";
import { SIF_001_CHAPTER_FREEZE_V1 as freeze } from "./chapter-freeze-v1-manifest.ts";
import { SIF_001_MANIFEST } from "./chapter-manifest.ts";
import { SIF_CP_IDS, type SifLocale } from "./types.ts";
import { buildSifCpReviewPack } from "./review-pack.ts";
import { listSifAuthorities } from "./authorities.ts";
import { assertSifLanguageParity } from "./validators.ts";
import {
  SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  SIF_001_QUESTION_STUDIO_RELEASE_FREEZE,
  assertSif001QuestionStudioPersistenceAllowed,
  previewSif001QuestionStudioReview,
} from "./question-studio-review.ts";

const LOCALES: readonly SifLocale[] = ["en-IN", "hi-IN", "pa-IN"];
assert.equal(freeze.freezeId, "SIF-001-V1-FROZEN-REVIEW-ONLY");
assert.equal(freeze.chapterId, "SIF-001");
assert.equal(freeze.cpCount, 17);
assert.deepEqual(freeze.cpIds, SIF_CP_IDS);
assert.deepEqual(freeze.locales, LOCALES);
assert.equal(freeze.lifecycle.multilingualChapterFrozen, true);
assert.equal(freeze.lifecycle.questionStudioReviewOnly, true);
assert.equal(freeze.lifecycle.questionBankWritable, false);
assert.equal(freeze.lifecycle.testEligible, false);
assert.equal(freeze.lifecycle.mockTestEligible, false);
assert.equal(freeze.lifecycle.publiclyPublishable, false);
assert.equal(freeze.lifecycle.automaticStudentPublication, false);
assert.equal(freeze.lifecycle.separateReleaseApprovalRequired, true);
assert.equal(freeze.lifecycle.noveltyExpansion, "DEFERRED_TO_CROSS_CHAPTER_FINAL_PASS");
assert.equal(SIF_001_MANIFEST.lifecycle.chapterFrozen, true);
assert.equal(SIF_001_MANIFEST.lifecycle.multilingualFrozen, true);
assert.equal(SIF_001_MANIFEST.lifecycle.questionBankWritable, false);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, SIF_001_QUESTION_STUDIO_PACKAGE_ID);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.lifecycleStatus, "REVIEW_ONLY");
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.multilingualFrozen, true);
assert.equal(SIF_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(SIF_001_QUESTION_STUDIO_RELEASE_FREEZE, freeze.freezeId);

for (const cpId of SIF_CP_IDS) {
  assert.ok(listSifAuthorities(cpId).length > 0, `${cpId}: authority pool exists`);
  const seed = 98000 + SIF_CP_IDS.indexOf(cpId) * 97;
  const questions = LOCALES.map((locale) => previewSif001QuestionStudioReview({ cpId, locale, seed }).question);
  assertSifLanguageParity(questions);
  for (const question of questions) {
    assert.equal(question.metadata.reviewOnly, true);
    assert.equal(question.metadata.questionBankWritable, false);
    assert.equal(question.metadata.testEligible, false);
    assert.equal(question.metadata.mockEligible, false);
    assert.equal(question.metadata.publicEligible, false);
    assert.equal(question.validation.every((gate) => gate.passed), true);
  }
}

for (const cpId of freeze.approvedFinalReviewPacks) {
  const packs = LOCALES.map((locale) => buildSifCpReviewPack({ cpId, locale, seed: 91500 }));
  const english = packs[0].questions;
  assert.equal(english.length, 24, `${cpId}: approved review pack size`);
  assert.equal(new Set(english.map((q) => q.scenarioId)).size, 24, `${cpId}: distinct review scenarios`);
  assert.equal(english.filter((q) => q.answerClass === "ONLY_I").length, 12, `${cpId}: inference I balance`);
  assert.equal(english.filter((q) => q.answerClass === "ONLY_II").length, 12, `${cpId}: inference II balance`);
  for (const pack of packs.slice(1)) {
    assert.deepEqual(pack.questions.map((q) => [q.scenarioId, q.answerClass, q.correctIndex]), english.map((q) => [q.scenarioId, q.answerClass, q.correctIndex]), `${cpId}: locale parity`);
  }
}

assert.throws(() => assertSif001QuestionStudioPersistenceAllowed(), /frozen.*review only.*separate release approval/i);
console.log("PASS_SIF_001_V1_FROZEN_REVIEW_ONLY");
