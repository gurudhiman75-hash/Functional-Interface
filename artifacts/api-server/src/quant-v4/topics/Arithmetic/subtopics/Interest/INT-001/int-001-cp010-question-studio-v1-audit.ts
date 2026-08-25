import assert from "node:assert/strict";
import {
  INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP010_QUESTION_STUDIO_LANGUAGES,
  generateIntCp010QuestionStudioBatch,
  listIntCp010QuestionStudioPackages,
} from "./cp010-question-studio-integration-v1";

const qlIds = ["INT-QL-130", "INT-QL-131"] as const;
let questions = 0;
let jsonSafeChecks = 0;
let lifecycleChecks = 0;
let languageChecks = 0;
const seenQl = new Set<string>();

for (const language of INT_CP010_QUESTION_STUDIO_LANGUAGES) {
  for (const qlId of qlIds) {
    const batch = await generateIntCp010QuestionStudioBatch({ language, questionLanguageId: qlId, seed: `audit:${language}:${qlId}`, count: 20 });
    assert.equal(batch.questions.length, 20);
    assert.equal(batch.questionPackages.length, 20);
    assert.equal(batch.language, language);
    JSON.stringify(batch);
    jsonSafeChecks += 1;
    for (const question of batch.questions) {
      questions += 1;
      seenQl.add(question.qlId);
      assert.equal(question.qlId, qlId);
      assert.equal(question.language, language);
      assert.equal(question.options.length, 4);
      assert.equal(question.options[question.correctIndex], question.answer);
      assert.equal(question.questionStudioDiscoverable, true);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.testEligible, false);
      assert.equal(question.mockTestEligible, false);
      assert.equal(question.publiclyPublishable, false);
      assert.equal(question.automaticStudentPublication, false);
      assert.equal(question.validation.ok, true);
      assert(question.stem.length > 20);
      assert(question.explanation.length > 20);
      lifecycleChecks += 6;
      languageChecks += 1;
    }
  }
}

const packages = listIntCp010QuestionStudioPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]!.permanentQlCount, 2);
assert.deepEqual([...packages[0]!.permanentQlIds], [...qlIds]);
assert.deepEqual([...packages[0]!.supportedLanguages], ["en", "hi", "pa"]);
assert.deepEqual([...seenQl].sort(), [...qlIds]);

console.log(JSON.stringify({
  integrationVersion: INT_CP010_QUESTION_STUDIO_INTEGRATION_VERSION,
  languages: INT_CP010_QUESTION_STUDIO_LANGUAGES,
  qlIds,
  questions,
  jsonSafeChecks,
  lifecycleChecks,
  languageChecks,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
console.log("PASS_INT_CP010_QUESTION_STUDIO_V1_AUDIT");
