import assert from "node:assert/strict";

import { STA_001_CHAPTER_CLOSEOUT_V1 } from "./chapter-closeout-manifest.ts";
import { STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST } from "./multilingual-freeze-manifest.ts";
import { STA_001_QUESTION_STUDIO_REVIEW_PACKAGE } from "./question-studio-review.ts";

assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.status, "CLOSED_FOR_QUESTION_STUDIO_REVIEW__DELIVERY_LOCKED");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.packageId, "STA-001");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.chapterId, "REAS-STA");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.permanentQlCount, 4);
assert.deepEqual(STA_001_CHAPTER_CLOSEOUT_V1.permanentQlIds, ["STA-QL-001", "STA-QL-002", "STA-QL-003", "STA-QL-004"]);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.multilingualFreezeId, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.freezeId);
assert.deepEqual(STA_001_CHAPTER_CLOSEOUT_V1.languages, ["en", "hi", "pa"]);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.presentationProfileCount, 9);
assert.deepEqual(STA_001_CHAPTER_CLOSEOUT_V1.presentationProfiles, STA_001_MULTILINGUAL_FREEZE_V1_MANIFEST.presentationProfiles);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.semanticAuthority, "FROZEN");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.englishAuthority, "FROZEN_V2");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.hindiAuthority, "FROZEN");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.punjabiAuthority, "FROZEN");

assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.status, "REGISTERED_REVIEW_ONLY");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.stagingStatus, "REVIEW_QUEUE_ENABLED");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.reviewOnly, true);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.manualApprovalRequired, true);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.sourceRuntimeQuestionStudioDiscoverable, false);
assert.equal(STA_001_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);

assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.questionBankStatus, "NOT_STORED");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.questionBankWritable, false);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.testEligibility, "INELIGIBLE");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.testEligible, false);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.mockTestEligible, false);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.publiclyPublishable, false);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.delivery.automaticStudentPublication, false);

for (const dimension of [
  "assumption_count",
  "option_count",
  "coded_answer_style",
  "negative_query_wording",
  "option_order",
  "exam_presentation_profile",
  "language",
]) {
  assert.ok(STA_001_CHAPTER_CLOSEOUT_V1.intentionalNonQlDimensions.includes(dimension as never), `${dimension}: missing non-QL boundary`);
}
assert.deepEqual(
  STA_001_CHAPTER_CLOSEOUT_V1.deferredSemanticExpansions,
  [
    "advertising_or_appeal_assumptions",
    "comparison_measurement_representativeness_assumptions",
  ],
);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.nextFamily.packageId, "STC-001");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.nextFamily.sequence, "STA -> STC -> ARG -> COA -> CAE -> ASM");
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.reopeningRule.length, 3);
assert.equal(STA_001_CHAPTER_CLOSEOUT_V1.doesNotReopenFor.length, 5);

console.log("PASS_STA_001_CHAPTER_CLOSEOUT_V1");
console.log(`status ${STA_001_CHAPTER_CLOSEOUT_V1.status}`);
console.log(`permanent QLs ${STA_001_CHAPTER_CLOSEOUT_V1.permanentQlIds.join(",")}`);
console.log(`languages ${STA_001_CHAPTER_CLOSEOUT_V1.languages.join(",")}`);
console.log(`presentation profiles ${STA_001_CHAPTER_CLOSEOUT_V1.presentationProfileCount}`);
console.log(`Question Studio ${STA_001_CHAPTER_CLOSEOUT_V1.questionStudio.status}`);
console.log(`next family ${STA_001_CHAPTER_CLOSEOUT_V1.nextFamily.packageId}`);
console.log("delivery gates locked");
