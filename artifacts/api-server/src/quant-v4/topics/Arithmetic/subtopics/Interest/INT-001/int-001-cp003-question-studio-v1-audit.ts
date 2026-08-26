import assert from "node:assert/strict";
import { INT_CP003_QL_IDS } from "./cp003-exam-model";
import { generateIntCp003QuestionStudioBatch, INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION, listIntCp003QuestionStudioPackages } from "./cp003-question-studio-integration-v1";

const LANGUAGES = ["en", "hi", "pa"] as const;
let explicitQlPackages = 0;
let lifecycleChecks = 0;
let answerChecks = 0;
let jsonChecks = 0;

const capability = listIntCp003QuestionStudioPackages()[0]!;
assert.equal(capability.permanentQlCount, 14);
assert.deepEqual(capability.permanentQlIds, INT_CP003_QL_IDS);
assert.deepEqual(capability.supportedLanguages, LANGUAGES);
assert.equal(capability.questionStudioDiscoverable, true);
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.mockTestEligible, false);
assert.equal(capability.publiclyPublishable, false);

for (const qlId of INT_CP003_QL_IDS) {
  for (const language of LANGUAGES) {
    const result = await generateIntCp003QuestionStudioBatch({ qlId, language, seed: `cp003-qs-v1:${qlId}:${language}`, count: 1 });
    assert.equal(result.questionPackages.length, 1);
    assert.equal(result.questions.length, 1);
    const pkg = result.questionPackages[0]!;
    const preview = result.questions[0]!;
    assert.equal(pkg.qlId, qlId);
    assert.equal(pkg.language, language);
    assert.equal(pkg.questionStudioDiscoverable, true);
    assert.equal(pkg.questionBankWritable, false);
    assert.equal(pkg.testEligible, false);
    assert.equal(pkg.mockTestEligible, false);
    assert.equal(pkg.publiclyPublishable, false);
    assert.equal(preview.answer, preview.options[preview.correctIndex]);
    assert.equal(pkg.answer, pkg.options[pkg.correctIndex]);
    assert(pkg.freezeId.length > 0);
    assert.equal(pkg.traceability.permanentIdentityFrozen, true);
    assert.equal(pkg.traceability.learnerContentFrozen, true);
    assert.equal(result.integrationVersion, INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION);
    JSON.parse(JSON.stringify(result));
    explicitQlPackages += 1;
    lifecycleChecks += 7;
    answerChecks += 2;
    jsonChecks += 1;
  }
}

for (const language of LANGUAGES) {
  const batch = await generateIntCp003QuestionStudioBatch({ language, seed: `cp003-qs-v1:reach:${language}`, count: 14 });
  assert.equal(new Set(batch.questionPackages.map((item) => item.qlId)).size, 14);
}

console.log(JSON.stringify({
  integrationVersion: INT_CP003_QUESTION_STUDIO_INTEGRATION_VERSION,
  permanentQlCount: INT_CP003_QL_IDS.length,
  languages: LANGUAGES,
  explicitQlPackages,
  lifecycleChecks,
  answerChecks,
  jsonChecks,
  unfilteredQlReachPerLanguage: 14,
  downstreamDeliveryClosed: true,
}, null, 2));
console.log("PASS_INT_CP003_QUESTION_STUDIO_V1_AUDIT");
