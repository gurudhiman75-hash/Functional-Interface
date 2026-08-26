import assert from "node:assert/strict";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import {
  INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  generateIntCp001QuestionStudioBatch,
  listIntCp001QuestionStudioPackages,
} from "./cp001-question-studio-integration-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
let packages = 0;
let lifecycleChecks = 0;
let jsonChecks = 0;
let identityChecks = 0;

const capability = listIntCp001QuestionStudioPackages()[0]!;
assert.equal(capability.permanentQlCount, 21);
assert.deepEqual(capability.permanentQlIds, INT_CP001_FINAL_QL_IDS);
assert.deepEqual(capability.supportedLanguages, LANGUAGES);
assert.equal(capability.questionStudioDiscoverable, true);
assert.equal(capability.registrationStatus, "REGISTERED_REVIEW_ONLY");
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.mockTestEligible, false);
assert.equal(capability.publiclyPublishable, false);

for (const qlId of INT_CP001_FINAL_QL_IDS) {
  for (const language of LANGUAGES) {
    const result = await generateIntCp001QuestionStudioBatch({
      qlId,
      language,
      seed: `cp001-qs-v1:${qlId}:${language}`,
      count: 1,
    });
    assert.equal(result.questionPackages.length, 1);
    assert.equal(result.questions.length, 1);
    assert.equal(result.questionPackages[0]!.qlId, qlId);
    assert.equal(result.questionPackages[0]!.questionStudioDiscoverable, true);
    assert.equal(result.questionPackages[0]!.questionBankWritable, false);
    assert.equal(result.questionPackages[0]!.testEligible, false);
    assert.equal(result.questionPackages[0]!.mockTestEligible, false);
    assert.equal(result.questionPackages[0]!.publiclyPublishable, false);
    assert.equal(result.questions[0]!.questionStudioDiscoverable, true);
    assert.equal(result.questions[0]!.questionBankWritable, false);
    assert.equal(result.questions[0]!.testEligible, false);
    assert.equal(result.questions[0]!.mockTestEligible, false);
    assert.equal(result.questions[0]!.publiclyPublishable, false);
    assert.equal(result.questions[0]!.answer, result.questions[0]!.options[result.questions[0]!.correctIndex]);
    assert.equal(result.integrationVersion, INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION);
    JSON.parse(JSON.stringify(result));
    packages += 1;
    lifecycleChecks += 10;
    jsonChecks += 1;
    identityChecks += 2;
  }
}

const batch = await generateIntCp001QuestionStudioBatch({ language: "en", seed: "cp001-qs-v1:batch", count: 21 });
assert.equal(batch.questions.length, 21);
assert.equal(new Set(batch.questionPackages.map((item: any) => item.qlId)).size, 21);

console.log(JSON.stringify({
  integrationVersion: INT_CP001_QUESTION_STUDIO_INTEGRATION_VERSION,
  permanentQlCount: INT_CP001_FINAL_QL_IDS.length,
  languages: LANGUAGES,
  explicitQlPackages: packages,
  lifecycleChecks,
  jsonChecks,
  identityChecks,
  unfilteredQlReach: 21,
  downstreamDeliveryClosed: true,
}, null, 2));
console.log("PASS_INT_CP001_QUESTION_STUDIO_V1_AUDIT");
