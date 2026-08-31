import assert from "node:assert/strict";
import { INT_001_WAVE03_QL_IDS } from "./int-001-wave03-permanent-allocation-v1";
import {
  INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES,
  INT_001_WAVE05_QUESTION_STUDIO_PACKAGE,
  INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION,
  previewInt001Wave05QuestionStudio,
} from "./int-001-wave05-question-studio-registration-v1";

const SEEDS_PER_QL_LANGUAGE = 100;
const FORBIDDEN = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|growth\s+factor|depreciation\s+factor)\b|गुणक|ਗੁਣਕ/iu;
let questions = 0;
let registrationChecks = 0;
let answerChecks = 0;
let explanationChecks = 0;
let lifecycleChecks = 0;

assert.deepEqual(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE.qlIds, [...INT_001_WAVE03_QL_IDS]);
assert.equal(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE.questionStudioDiscoverable, true);
assert.equal(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(INT_001_WAVE05_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);

for (const qlId of INT_001_WAVE03_QL_IDS) {
  for (const language of INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES) {
    for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
      const seed = `INT-001-WAVE05-QS:${qlId}:${language}:${index}`;
      const result = previewInt001Wave05QuestionStudio({ qlId, language, seed, count: 1 });
      assert.equal(result.questions.length, 1);
      const question = result.questions[0] as any;
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.integrationAuthority, INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION);
      assert.equal(question.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
      assert.equal(question.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
      assert.equal(question.validation.permanentIdentityFrozen, true);
      assert.equal(question.validation.learnerContentFrozen, true);
      registrationChecks += 7;

      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < 4);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.optionDetails.filter((option: any) => option.isCorrect).length, 1);
      answerChecks += 5;

      assert.equal(question.explanation.style, "DIRECT_CALCULATION");
      assert.ok(question.explanation.steps.length >= 3 && question.explanation.steps.length <= 6);
      assert.equal(question.explanation.steps.some((step: string) => FORBIDDEN.test(step)), false);
      assert.ok(question.explanation.steps.every((step: string) => /\d/u.test(step)));
      assert.ok(question.explanation.steps.every((step: string) => /[=×÷+−^/]|₹|%/u.test(step)));
      explanationChecks += 5;

      assert.equal(question.questionBankStatus, "NOT_STORED");
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligibility, "INELIGIBLE");
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.manualApprovalRequired, true);
      assert.equal(question.automaticStudentPublication, false);
      lifecycleChecks += 8;
      questions += 1;
    }
  }
}

assert.equal(questions, 900);
const batch = previewInt001Wave05QuestionStudio({ language: "en", seed: "INT-001-WAVE05-QS:BATCH", count: 50 });
assert.equal(batch.questions.length, 50);
assert.deepEqual(new Set(batch.questions.map((question) => question.qlId)), new Set(INT_001_WAVE03_QL_IDS));

console.log(JSON.stringify({
  version: INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION,
  qls: INT_001_WAVE03_QL_IDS,
  languages: INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  questions,
  registrationChecks,
  answerChecks,
  explanationChecks,
  lifecycleChecks,
  policy: {
    questionStudioDiscoverable: true,
    reviewQueueEnabled: true,
    persistenceAllowed: true,
    questionBankWritable: false,
    testMockPublicDeliveryClosed: true,
  },
}, null, 2));
console.log("PASS_INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_V1_AUDIT");
