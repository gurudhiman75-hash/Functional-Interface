import assert from "node:assert/strict";

import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { DSF_CP002_DOMAINS } from "../DSF-CP-002/question-studio-integration-v1.ts";
import { DSF_CP003_ANSWER_PROFILES } from "../DSF-CP-003/exam-answer-profiles-v1.ts";
import {
  DSF_CP008_LOCALIZATION_AUTHORITY,
  generateDsfLocalizedExamProfileBatch,
} from "../DSF-CP-008/localization-review-v1.ts";
import {
  DSF_CP009_APPROVAL_DATE,
  DSF_CP009_APPROVAL_STATUS,
  DSF_CP009_CHECKPOINT_ID,
  DSF_CP009_LOCALIZATION_APPROVAL,
  DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  DSF_CP009_LOCALIZATION_RELEASE_PACKAGE,
  DSF_CP009_RELEASE_STATUS,
  DSF_CP009_REVIEW_PACK_ID,
  generateDsfApprovedLocalizedExamProfileBatch,
} from "./localization-approval-release-v1.ts";

assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.checkpointId, DSF_CP009_CHECKPOINT_ID);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.authority, DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.status, DSF_CP009_APPROVAL_STATUS);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.releaseStatus, DSF_CP009_RELEASE_STATUS);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.approvedAt, DSF_CP009_APPROVAL_DATE);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.reviewPackId, DSF_CP009_REVIEW_PACK_ID);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.reviewQuestionCount, 62);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.hindiQuestionCount, 31);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.punjabiQuestionCount, 31);
assert.deepEqual(DSF_CP009_LOCALIZATION_APPROVAL.approvedLanguages, ["hi", "pa"]);
assert.deepEqual(DSF_CP009_LOCALIZATION_APPROVAL.approvedLocales, ["hi-IN", "pa-IN"]);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.newPermanentQlAllocated, false);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.canonicalSemanticsReopened, false);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.answerProfileSemanticOrderRewritten, false);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.punjabSpecificAnswerProfileEnabled, false);
assert.equal(DSF_CP009_LOCALIZATION_APPROVAL.automaticStudentPublicationEnabled, false);

let checked = 0;
for (const language of ["hi", "pa"] as const) {
  for (const domain of DSF_CP002_DOMAINS) {
    for (const solveMode of domain.solveModes) {
      const seed = `cp009-mode:${language}:${solveMode}`;
      const reviewed = generateDsfLocalizedExamProfileBatch({
        language,
        seed,
        count: 1,
        solveMode,
        answerProfile: "GENERIC_DS_STANDARD_5_EN",
      }).questions[0]!;
      const released = generateDsfApprovedLocalizedExamProfileBatch({
        language,
        seed,
        count: 1,
        solveMode,
        answerProfile: "GENERIC_DS_STANDARD_5_EN",
      }).questions[0]!;

      assert.equal(released.questionId, reviewed.questionId);
      assert.equal(released.canonicalEnglishProfileQuestionId, reviewed.canonicalEnglishProfileQuestionId);
      assert.equal(released.sourceQuestionId, reviewed.sourceQuestionId);
      assert.equal(released.sourceGenerationIdentity, reviewed.sourceGenerationIdentity);
      assert.equal(released.canonicalAnswer, reviewed.canonicalAnswer);
      assert.equal(released.correctIndex, reviewed.correctIndex);
      assert.deepEqual(released.options, reviewed.options);
      assert.equal(released.localizationAuthority, DSF_CP008_LOCALIZATION_AUTHORITY);
      assert.equal(released.localizationApprovalCheckpointId, DSF_CP009_CHECKPOINT_ID);
      assert.equal(released.localizationApprovalAuthority, DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY);
      assert.equal(released.localization.status, DSF_CP009_APPROVAL_STATUS);
      assert.equal(released.localization.humanLanguageReviewRequired, false);
      assert.deepEqual(released.localization.activeEditorialBlockers, []);
      assert.equal(released.lifecycle.reviewOnly, false);
      assert.equal(released.lifecycle.questionBankStatus, "READY_FOR_STORAGE");
      assert.equal(released.lifecycle.questionBankWritable, true);
      assert.equal(released.lifecycle.questionBankAcceptanceMode, "FULL_RELEASE");
      assert.equal(released.lifecycle.manualQuestionPublicationRequired, true);
      assert.equal(released.lifecycle.testEligibility, "ELIGIBLE");
      assert.equal(released.lifecycle.testEligible, true);
      assert.equal(released.lifecycle.mockTestEligible, true);
      assert.equal(released.lifecycle.publiclyPublishable, true);
      assert.equal(released.lifecycle.manualApprovalRequired, true);
      assert.equal(released.lifecycle.automaticStudentPublication, false);
      checked += 1;
    }
  }

  for (const profile of DSF_CP003_ANSWER_PROFILES) {
    for (const semanticClass of profile.representedSemanticClasses) {
      const question = generateDsfApprovedLocalizedExamProfileBatch({
        language,
        seed: `cp009-profile:${language}:${profile.id}:${semanticClass}`,
        count: 1,
        answerProfile: profile.id,
        semanticClass,
      }).questions[0]!;
      assert.equal(question.answerProfile, profile.id);
      assert.equal(question.canonicalAnswer, semanticClass);
      assert.deepEqual(question.options.map((option) => option.semanticClass), profile.semanticOrder);
      assert.equal(question.options[question.correctIndex]!.semanticClass, semanticClass);
      checked += 1;
    }
  }
}

for (const language of ["hi", "pa"] as const) {
  for (const profile of DSF_CP003_ANSWER_PROFILES.filter((entry) => entry.optionCount === 4)) {
    assert.throws(
      () => generateDsfApprovedLocalizedExamProfileBatch({
        language,
        seed: `cp009-ssc-reject:${language}:${profile.id}`,
        count: 1,
        answerProfile: profile.id,
        semanticClass: "EACH_STATEMENT_ALONE",
      }),
      /cannot render EACH_STATEMENT_ALONE/,
    );
  }
}

for (const semanticClass of SUFFICIENCY_CLASSES) {
  const question = generateDsfApprovedLocalizedExamProfileBatch({
    language: "hi",
    seed: `cp009-class:${semanticClass}`,
    count: 1,
    answerProfile: "GENERIC_DS_STANDARD_5_EN",
    semanticClass,
  }).questions[0]!;
  assert.equal(question.canonicalAnswer, semanticClass);
}

assert.deepEqual(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages, ["en", "hi", "pa"]);
assert.deepEqual(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationReviewLanguages, []);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationStatus, DSF_CP009_APPROVAL_STATUS);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.humanLanguageReviewRequired, false);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizedQuestionBankWritable, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizedTestEligible, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizedMockTestEligible, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizedPubliclyPublishable, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizedAutomaticStudentPublication, false);
assert.deepEqual(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.localizationEditorialBlockers, []);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle.hi.status, "LOCALIZED_PRODUCTION_READY");
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle.pa.status, "LOCALIZED_PRODUCTION_READY");
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle.hi.questionBankWritable, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle.pa.mockTestEligible, true);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.perLanguageLifecycle.hi.automaticStudentPublication, false);
assert.equal(DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.nextAvailableQlId, "DSF-QL-002");

console.log(JSON.stringify({
  status: "PASS_DSF_CP009_HI_PA_LOCALIZATION_APPROVAL_RELEASE",
  authority: DSF_CP009_LOCALIZATION_APPROVAL_AUTHORITY,
  approvalDate: DSF_CP009_APPROVAL_DATE,
  reviewPackId: DSF_CP009_REVIEW_PACK_ID,
  checkedReleaseQuestions: checked,
  productionLanguages: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.productionLanguages,
  questionBankWritable: true,
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: true,
  manualQuestionPublicationRequired: true,
  automaticStudentPublication: false,
  permanentQlIds: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.permanentQlIds,
  nextAvailableQlId: DSF_CP009_LOCALIZATION_RELEASE_PACKAGE.nextAvailableQlId,
}, null, 2));
