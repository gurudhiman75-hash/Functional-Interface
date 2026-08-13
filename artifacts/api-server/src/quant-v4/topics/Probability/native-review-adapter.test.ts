import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  listProbabilityNativeReviewCatalog,
  previewProbabilityNativeReview,
  PROBABILITY_NATIVE_REVIEW_AUTHORITY,
  PROBABILITY_NATIVE_REVIEW_PACKAGE,
} from "./native-review-adapter";
import {
  assertProbabilityNativeFreezeReady,
  assertProbabilityNativeStudentDeliveryAllowed,
  getProbabilityNativeFreezeSummary,
} from "./native-review-freeze";
import { buildProbabilityMultilingualManifest } from "./multilingual-foundation";

const catalog = listProbabilityNativeReviewCatalog();
assert.equal(catalog.length, 216);
assert.equal(new Set(catalog.map((entry) => `${entry.packageId}:${entry.qlId}`)).size, 216);
assert.equal(catalog.filter((entry) => entry.packageId === "PRB-001").length, 120);
assert.equal(catalog.filter((entry) => entry.packageId === "PRB-002").length, 96);

assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.permanentQlCount, 216);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.nativeReviewSurfaceCount, 432);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.testEligible, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(PROBABILITY_NATIVE_REVIEW_PACKAGE.releaseFreezeStatus, "PENDING_HUMAN_REVIEW");

let reviewedSurfaceCount = 0;
const reviewIds = new Set<string>();
for (const entry of catalog) {
  for (const language of ["hi", "pa"] as const) {
    const result = previewProbabilityNativeReview({
      language,
      packageId: entry.packageId,
      qlId: entry.qlId,
      count: 1,
      seed: `ml06-review:${entry.packageId}:${entry.qlId}:${language}`,
    });
    assert.equal(result.questions.length, 1);
    const question = result.questions[0]!;
    reviewedSurfaceCount += 1;
    reviewIds.add(question.questionId);

    assert.equal(question.packageId, entry.packageId);
    assert.equal(question.qlId, entry.qlId);
    assert.equal(question.language, language);
    assert.equal(question.reviewStatus, "DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW");
    assert.equal(question.integrationAuthority, PROBABILITY_NATIVE_REVIEW_AUTHORITY);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.releaseFreezeStatus, "PENDING_HUMAN_REVIEW");
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.sourceEnglishValid, true);
    assert.equal(question.validation.nativePresentationValid, true);
    assert.equal(question.validation.optionByteParity, true);
    assert.equal(question.validation.correctIndexParity, true);
    assert.equal(question.validation.answerParity, true);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex], question.answer);
    assert(question.stem.length > 0);
    assert(question.explanation.steps.length > 0);
    assert.equal(question.traceability.answerKeyAuthority, "ENGLISH_RUNTIME");
    assert.equal(question.traceability.solverAuthority, "ENGLISH_RUNTIME");
    assert.equal(question.traceability.mockPolicyAuthority, "ENGLISH_RUNTIME");
  }
}

assert.equal(reviewedSurfaceCount, 432);
assert.equal(reviewIds.size, 432);

const deterministicA = previewProbabilityNativeReview({ language: "hi", count: 5, seed: "ml06-determinism" });
const deterministicB = previewProbabilityNativeReview({ language: "hi", count: 5, seed: "ml06-determinism" });
assert.deepEqual(
  deterministicA.questions.map((question) => [question.qlId, question.questionId, question.stem, question.options, question.correctIndex]),
  deterministicB.questions.map((question) => [question.qlId, question.questionId, question.stem, question.options, question.correctIndex]),
);

const manifest = buildProbabilityMultilingualManifest();
for (const language of ["hi", "pa"] as const) {
  const rows = manifest.filter((entry) => entry.language === language);
  assert.equal(rows.length, 216);
  assert(rows.every((entry) => entry.localizationStatus === "PENDING_NATIVE_EDITORIAL"));
  assert(rows.every((entry) => entry.questionStudioEnabled === false));
  assert(rows.every((entry) => entry.publiclyPublishable === false));
}

const probabilityRouteSource = readFileSync(
  new URL("../../../routes/admin-question-studio-probability.ts", import.meta.url),
  "utf8",
);
const decisionPath = '"/quant/probability/native-review/items/:itemId/decision"';
const decisionStart = probabilityRouteSource.indexOf(decisionPath);
const statusStart = probabilityRouteSource.indexOf('"/quant/probability/native-review/status"', decisionStart);
assert(decisionStart >= 0, "Probability native editorial decision endpoint must exist.");
assert(statusStart > decisionStart, "Probability native editorial decision endpoint boundary is malformed.");
const decisionSource = probabilityRouteSource.slice(decisionStart, statusStart);
assert(decisionSource.includes("assertLockedNativeReviewPayload(row.payload)"));
assert(decisionSource.includes("accepted_question_id"));
assert(decisionSource.includes("questionBankWritePerformed: false"));
assert(decisionSource.includes("releaseFreezeStillRequired: true"));
assert(!decisionSource.includes("convertApprovedGenerationItem"));
assert(!decisionSource.includes("INSERT INTO content.questions"));
assert(!decisionSource.includes("INSERT INTO content.question_versions"));

const contentReviewControllerSource = readFileSync(
  new URL("../../../../admin-app/src/features/content-review/useContentReviewController.ts", import.meta.url),
  "utf8",
);
assert(contentReviewControllerSource.includes("isProbabilityNativeReviewPayload(selectedItem.currentPayload)"));
assert(contentReviewControllerSource.includes("updateProbabilityReviewItem({"));

const freeze = getProbabilityNativeFreezeSummary();
assert.equal(freeze.requiredDecisionCount, 432);
assert.equal(freeze.recordedDecisionCount, 0);
assert.equal(freeze.approvedDecisionCount, 0);
assert.equal(freeze.hindiApprovedCount, 0);
assert.equal(freeze.punjabiApprovedCount, 0);
assert.equal(freeze.freezeReady, false);
assert.equal(freeze.status, "PENDING_HUMAN_REVIEW");
assert.throws(() => assertProbabilityNativeFreezeReady(), /0\/432 explicit human approvals/);
assert.throws(() => assertProbabilityNativeStudentDeliveryAllowed(), /student delivery remains disabled/);

console.log(JSON.stringify({
  status: "PASS",
  checkpoint: "ML-06-REVIEW-READY",
  permanentQlCount: 216,
  nativeReviewSurfaceCount: reviewedSurfaceCount,
  hindiReviewSurfaceCount: 216,
  punjabiReviewSurfaceCount: 216,
  recordedHumanDecisionCount: freeze.recordedDecisionCount,
  nativeQuestionBankWritable: false,
  nativeTestEligible: false,
  nativePubliclyPublishable: false,
  editorialDecisionEndpointLocked: true,
  questionBankConversionOnNativeApproval: false,
}, null, 2));
