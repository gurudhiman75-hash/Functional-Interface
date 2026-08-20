import assert from "node:assert/strict";

import { SEA001_PERMANENT_QL_IDS } from "../permanent/registry.ts";
import { SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN } from "../review/structural-hardening-english-review-pins.ts";
import { SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE } from "../review/structural-hardening-multilingual-freeze.ts";
import {
  SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  SEA001_QUESTION_STUDIO_PACKAGE,
  generateSea001QuestionStudioBatch,
  type Sea001QuestionStudioLanguage,
} from "./seating-question-studio-runtime.ts";

const packageAuthority = SEA001_QUESTION_STUDIO_PACKAGE;
assert.equal(packageAuthority.sourceEnglishAuthority, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
assert.equal(packageAuthority.sourceLocalizationAuthority, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
assert.equal(packageAuthority.integrationAuthority, SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
assert.equal(packageAuthority.registrationStatus, "REGISTERED");
assert.equal(packageAuthority.questionStudioVisible, true);
assert.equal(packageAuthority.questionStudioDiscoverable, true);
assert.equal(packageAuthority.permanentQlCount, 20);
assert.deepEqual(packageAuthority.qlIds, [...SEA001_PERMANENT_QL_IDS]);
assert.equal(packageAuthority.questionBankStatus, "NOT_STORED");
assert.equal(packageAuthority.questionBankEligible, false);
assert.equal(packageAuthority.testEligible, false);
assert.equal(packageAuthority.mockTestEligible, false);
assert.equal(packageAuthority.productionStagingApproved, false);
assert.equal(packageAuthority.publiclyPublishable, false);
assert.equal(packageAuthority.manualApprovalRequired, true);
assert.equal(packageAuthority.automaticStudentPublication, false);

for (const language of ["en", "hi", "pa"] as const satisfies readonly Sea001QuestionStudioLanguage[]) {
  const batch = generateSea001QuestionStudioBatch({
    language,
    count: 20,
    seed: `sea001-replacement-studio-proof:${language}`,
  });
  assert.equal(batch.questions.length, 20);
  assert.equal(new Set(batch.questions.map((question) => question.qlId)).size, 20);
  assert.equal(batch.generationContext.sourceEnglishFreeze, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
  assert.equal(batch.generationContext.sourceLocalizationFreeze, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
  assert.equal(batch.generationContext.reviewStatus, "UNREVIEWED_DYNAMIC");
  assert.equal(batch.generationContext.registrationStatus, "REGISTERED");
  assert.equal(batch.generationContext.questionBankStatus, "NOT_STORED");
  assert.equal(batch.generationContext.testEligible, false);
  assert.equal(batch.generationContext.mockTestEligible, false);
  assert.equal(batch.generationContext.productionStagingApproved, false);
  assert.equal(batch.generationContext.publiclyPublishable, false);
  assert.equal(batch.generationContext.manualApprovalRequired, true);
  assert.equal(batch.generationContext.automaticStudentPublication, false);

  for (const question of batch.questions) {
    assert.equal(question.language, language);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.solverOracleAgreement, true);
    assert.equal(question.validation.fourOptions, true);
    assert.equal(question.validation.singleCorrectAnswer, true);
    assert.equal(question.validation.frozenQueryContract, true);
    assert.equal(question.validation.canonicalParityPreserved, true);
    assert.equal(question.parameters.sourceEnglishFreeze, SEA001_STRUCTURAL_HARDENING_ENGLISH_REVIEW_PIN.candidateFingerprint);
    assert.equal(question.parameters.sourceLocalizationFreeze, SEA001_STRUCTURAL_HARDENING_MULTILINGUAL_FREEZE.authority);
    assert.equal(question.parameters.questionBankStatus, "NOT_STORED");
    assert.equal(question.parameters.testEligibility, "INELIGIBLE");
    assert.equal(question.parameters.publiclyPublishable, false);
    assert.equal(question.safety.reviewOnly, true);
    assert.equal(question.safety.questionBankEligible, false);
    assert.equal(question.safety.mockTestEligible, false);
    assert.equal(question.safety.productionStagingApproved, false);
    assert.equal(question.safety.publiclyPublishable, false);
    assert.equal(question.options.length, 4);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    if (language !== "en") {
      const learnerSurface = [
        question.sharedPrompt,
        question.stem,
        ...question.options,
        ...question.explanation.steps,
        question.explanation.conclusion,
        ...question.optionDetails.map((option) => option.studentExplanation),
      ].join("\n");
      assert.equal(/[A-Za-z]/u.test(learnerSurface), false, `${question.questionId}: localized Studio surface contains Latin residue`);
    }
  }
}

const replayA = generateSea001QuestionStudioBatch({ language: "en", count: 20, seed: "sea001-replacement-replay-proof" });
const replayB = generateSea001QuestionStudioBatch({ language: "en", count: 20, seed: "sea001-replacement-replay-proof" });
assert.deepEqual(
  replayA.questions.map((question) => question.contentFingerprint),
  replayB.questions.map((question) => question.contentFingerprint),
  "Explicit-seed Studio replay drifted",
);

console.log("PASS_SEA001_QUESTION_STUDIO_REPLACEMENT_AUTHORITY");
console.log("integration authority", SEA001_QUESTION_STUDIO_INTEGRATION_AUTHORITY);
console.log("English authority", packageAuthority.sourceEnglishAuthority);
console.log("localization authority", packageAuthority.sourceLocalizationAuthority);
console.log("QL coverage", SEA001_PERMANENT_QL_IDS.length);
console.log("languages", packageAuthority.supportedLanguages.join(","));
console.log("review only", true);
console.log("Question Bank/mock/public", false, false, false);
