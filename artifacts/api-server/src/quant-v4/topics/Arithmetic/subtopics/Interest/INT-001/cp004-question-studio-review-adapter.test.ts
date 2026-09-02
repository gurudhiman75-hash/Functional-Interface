import assert from "node:assert/strict";

import { getGeneratedItemApprovalDisposition } from "../../../../../../lib/admin-question-studio-approval-policy";
import { INT_CP004_QL_IDS } from "./cp004-frequency-math";
import {
  INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp004QuestionStudioReview,
} from "./cp004-question-studio-review-adapter";

assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "INT-001");
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointId, "INT-CP-004");
assert.deepEqual(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds.length, 19);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.enabled, true);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority, INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY);

const DECIMAL_TOKEN = /\d+\.\d+/u;
let payloadCount = 0;
let localizedFormulaFirstChecks = 0;
let localizedDecimalFreeChecks = 0;
let optionSuppressionChecks = 0;
let approvalPolicyChecks = 0;
let qlCoverageChecks = 0;
let englishChecks = 0;

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of INT_CP004_QL_IDS) {
    qlCoverageChecks += 1;
    const preview = previewIntCp004QuestionStudioReview({
      language,
      qlId,
      seed: `int-cp004-current-main-review:${language}:${qlId}`,
      count: 5,
    });
    assert.equal(preview.questions.length, 5);
    assert.equal(preview.generationContext.reviewOnly, true);
    assert.equal(preview.generationContext.questionBankWritable, false);
    assert.equal(preview.generationContext.testEligible, false);
    assert.equal(preview.generationContext.publiclyPublishable, false);
    assert.equal(preview.generationContext.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
    assert.equal(preview.generationContext.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");

    for (const question of preview.questions) {
      payloadCount += 1;
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
      assert.equal(question.optionDetails[question.correctIndex]?.text, question.answer);
      assert.equal(question.integrationAuthority, INT_CP004_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
      assert.equal(question.safety.reviewOnly, true);
      assert.equal(question.safety.questionStudioVisible, true);
      assert.equal(question.safety.questionStudioDiscoverable, true);
      assert.equal(question.safety.questionBankWritable, false);
      assert.equal(question.safety.testEligible, false);
      assert.equal(question.safety.publiclyPublishable, false);
      assert.equal(question.validation.valid, true);
      assert.equal(question.validation.sourceLifecycleLocked, true);
      assert.ok(question.explanation.steps.some((step) => /[=×÷+−^/]/u.test(step)));

      if (language === "en") {
        englishChecks += 1;
        assert.equal(question.traceability.sourceFreezeId, "INT-CP-004-EN-v2-frozen");
      } else {
        localizedFormulaFirstChecks += 1;
        const formulaPrefix = language === "hi" ? "सूत्र:" : "ਸੂਤਰ:";
        assert.ok(question.explanation.steps[0]?.startsWith(formulaPrefix));

        const learnerText = [
          question.stem,
          ...question.options,
          question.answer,
          question.explanation.whatAsked,
          ...question.explanation.steps,
          question.explanation.conclusion,
        ].join("\n");
        localizedDecimalFreeChecks += 1;
        assert.equal(DECIMAL_TOKEN.test(learnerText), false);
      }

      optionSuppressionChecks += question.optionDetails.length;
      for (const option of question.optionDetails) {
        assert.equal(option.studentExplanation, "");
      }

      approvalPolicyChecks += 1;
      assert.deepEqual(
        getGeneratedItemApprovalDisposition({
          ...question,
          generationContext: preview.generationContext,
        }),
        {
          mode: "review_only",
          reason: "Payload explicitly disables Question Bank storage",
        },
      );
    }
  }
}

assert.equal(qlCoverageChecks, 57);
assert.equal(payloadCount, 285);
assert.equal(englishChecks, 95);
assert.equal(localizedFormulaFirstChecks, 190);
assert.equal(localizedDecimalFreeChecks, 190);
assert.equal(optionSuppressionChecks, 1140);
assert.equal(approvalPolicyChecks, 285);

const mixed = previewIntCp004QuestionStudioReview({
  language: "hi",
  seed: "int-cp004-current-main-review:mixed",
  count: 50,
});
assert.equal(mixed.questions.length, 50);
assert.ok(new Set(mixed.questions.map((question) => question.qlId)).size >= 19);
assert.ok(mixed.questions.some((question) => question.difficultyBand === "Easy"));
assert.ok(mixed.questions.some((question) => question.difficultyBand === "Medium"));
assert.ok(mixed.questions.some((question) => question.difficultyBand === "Hard"));

console.log("PASS_INT_CP004_CURRENT_MAIN_QUESTION_STUDIO_REVIEW_ADAPTER", {
  packageId: INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.packageId,
  checkpointId: INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.checkpointId,
  languages: INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.supportedLanguages,
  qlCount: INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE.qlIds.length,
  payloadCount,
  englishChecks,
  localizedFormulaFirstChecks,
  localizedDecimalFreeChecks,
  optionSuppressionChecks,
  approvalPolicyChecks,
  mixedBatchCount: mixed.questions.length,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});
