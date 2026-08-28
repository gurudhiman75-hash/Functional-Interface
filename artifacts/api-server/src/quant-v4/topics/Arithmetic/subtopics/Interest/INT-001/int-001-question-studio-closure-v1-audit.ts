import assert from "node:assert/strict";
import { INT_CP002_FINAL_QL_IDS } from "./cp002-final-registry";
import {
  INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP002_QUESTION_STUDIO_LANGUAGES,
  generateIntCp002QuestionStudioBatch,
  listIntCp002QuestionStudioPackages,
} from "./cp002-question-studio-integration-v1";
import { INT_CP005_V16_1_QL_IDS } from "./cp005-variable-growth-decay-runtime-v16-1-final-v2";
import {
  INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP005_QUESTION_STUDIO_LANGUAGES,
  generateIntCp005QuestionStudioBatch,
  listIntCp005QuestionStudioPackages,
} from "./cp005-question-studio-integration-v1";
import { INT_CP006_QL_IDS } from "./cp006-si-ci-relations-runtime-v4-final";
import {
  INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP006_QUESTION_STUDIO_LANGUAGES,
  generateIntCp006QuestionStudioBatch,
  listIntCp006QuestionStudioPackages,
} from "./cp006-question-studio-integration-v1";
import { INT_CP008_QL_IDS } from "./cp008-instalment-runtime-v1-final";
import {
  INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION,
  INT_CP008_QUESTION_STUDIO_LANGUAGES,
  generateIntCp008QuestionStudioBatch,
  listIntCp008QuestionStudioPackages,
} from "./cp008-question-studio-integration-v1";

const checkpoints = [
  {
    cpId: "INT-CP-002",
    qlIds: INT_CP002_FINAL_QL_IDS,
    languages: INT_CP002_QUESTION_STUDIO_LANGUAGES,
    version: INT_CP002_QUESTION_STUDIO_INTEGRATION_VERSION,
    list: listIntCp002QuestionStudioPackages,
    generate: generateIntCp002QuestionStudioBatch,
  },
  {
    cpId: "INT-CP-005",
    qlIds: INT_CP005_V16_1_QL_IDS,
    languages: INT_CP005_QUESTION_STUDIO_LANGUAGES,
    version: INT_CP005_QUESTION_STUDIO_INTEGRATION_VERSION,
    list: listIntCp005QuestionStudioPackages,
    generate: generateIntCp005QuestionStudioBatch,
  },
  {
    cpId: "INT-CP-006",
    qlIds: INT_CP006_QL_IDS,
    languages: INT_CP006_QUESTION_STUDIO_LANGUAGES,
    version: INT_CP006_QUESTION_STUDIO_INTEGRATION_VERSION,
    list: listIntCp006QuestionStudioPackages,
    generate: generateIntCp006QuestionStudioBatch,
  },
  {
    cpId: "INT-CP-008",
    qlIds: INT_CP008_QL_IDS,
    languages: INT_CP008_QUESTION_STUDIO_LANGUAGES,
    version: INT_CP008_QUESTION_STUDIO_INTEGRATION_VERSION,
    list: listIntCp008QuestionStudioPackages,
    generate: generateIntCp008QuestionStudioBatch,
  },
] as const;

let generatedPackages = 0;
let lifecycleChecks = 0;
let answerChecks = 0;
let jsonChecks = 0;

for (const checkpoint of checkpoints) {
  const capability = checkpoint.list()[0]!;
  assert.equal(capability.cpIds[0], checkpoint.cpId);
  assert.equal(capability.permanentQlCount, checkpoint.qlIds.length);
  assert.deepEqual([...capability.permanentQlIds], [...checkpoint.qlIds]);
  assert.deepEqual([...capability.supportedLanguages], [...checkpoint.languages]);
  assert.equal(capability.questionStudioDiscoverable, true);
  assert.equal(capability.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(capability.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
  assert.equal(capability.questionBankWritable, false);
  assert.equal(capability.testEligible, false);
  assert.equal(capability.mockTestEligible, false);
  assert.equal(capability.publiclyPublishable, false);
  assert.equal(capability.automaticStudentPublication, false);

  for (const qlId of checkpoint.qlIds) {
    for (const language of checkpoint.languages) {
      const result = await checkpoint.generate({
        canonicalProblemId: checkpoint.cpId,
        qlId,
        language,
        seed: `int-001-qs-closure:${checkpoint.cpId}:${qlId}:${language}`,
        count: 1,
      });
      assert.equal(result.integrationVersion, checkpoint.version);
      assert.equal(result.canonicalProblemId, checkpoint.cpId);
      assert.equal(result.questionPackages.length, 1);
      assert.equal(result.questions.length, 1);
      const pkg = result.questionPackages[0]!;
      const preview = result.questions[0]!;
      assert.equal(pkg.qlId, qlId);
      assert.equal(pkg.language, language);
      assert.equal(pkg.questionStudioDiscoverable, true);
      assert.equal(pkg.questionStudioRegistrationStatus, "REGISTERED_REVIEW_ONLY");
      assert.equal(pkg.questionStudioStagingStatus, "REVIEW_QUEUE_ENABLED");
      assert.equal(pkg.questionBankStatus, "NOT_STORED");
      assert.equal(pkg.questionBankWritable, false);
      assert.equal(pkg.testEligibility, "INELIGIBLE");
      assert.equal(pkg.testEligible, false);
      assert.equal(pkg.mockTestEligible, false);
      assert.equal(pkg.publiclyPublishable, false);
      assert.equal(pkg.automaticStudentPublication, false);
      assert.equal(pkg.manualApprovalRequired, true);
      assert.equal(pkg.traceability.permanentIdentityFrozen, true);
      assert.equal(pkg.traceability.learnerContentFrozen, true);
      assert(pkg.stem.trim().length > 0);
      assert.equal(pkg.options.length, 4);
      assert.equal(new Set(pkg.options).size, 4);
      assert.equal(pkg.answer, pkg.options[pkg.correctIndex]);
      assert.equal(preview.answer, preview.options[preview.correctIndex]);
      assert.equal(preview.reviewStatus, pkg.reviewStatus);
      assert.equal(preview.questionBankWritable, false);
      assert.equal(preview.testEligible, false);
      assert.equal(preview.mockTestEligible, false);
      assert.equal(preview.publiclyPublishable, false);
      JSON.parse(JSON.stringify(result));
      generatedPackages += 1;
      lifecycleChecks += 17;
      answerChecks += 2;
      jsonChecks += 1;
    }
  }

  for (const language of checkpoint.languages) {
    const batch = await checkpoint.generate({
      canonicalProblemId: checkpoint.cpId,
      language,
      seed: `int-001-qs-closure:reach:${checkpoint.cpId}:${language}`,
      count: checkpoint.qlIds.length,
    });
    assert.equal(new Set(batch.questionPackages.map((item: any) => item.qlId)).size, checkpoint.qlIds.length);
  }
}

assert.equal(INT_CP002_FINAL_QL_IDS.length, 31);
assert.deepEqual(INT_CP002_QUESTION_STUDIO_LANGUAGES, ["en"]);
await assert.rejects(
  () => generateIntCp002QuestionStudioBatch({ language: "hi", count: 1 }),
  /does not support language 'hi'/u,
);
assert.equal(INT_CP005_V16_1_QL_IDS.includes("INT-QL-094" as never), false);
assert.equal(checkpoints.reduce((sum, checkpoint) => sum + checkpoint.qlIds.length, 0), 62);
assert.equal(generatedPackages, 124);

console.log(JSON.stringify({
  checkpointCount: checkpoints.length,
  newlyRegisteredPermanentQlCount: 62,
  generatedPackages,
  lifecycleChecks,
  answerChecks,
  jsonChecks,
  cp002Languages: INT_CP002_QUESTION_STUDIO_LANGUAGES,
  cp005Languages: INT_CP005_QUESTION_STUDIO_LANGUAGES,
  cp006Languages: INT_CP006_QUESTION_STUDIO_LANGUAGES,
  cp008Languages: INT_CP008_QUESTION_STUDIO_LANGUAGES,
  intentionalVacancyPreserved: "INT-QL-094",
  downstreamDeliveryClosed: true,
}, null, 2));
console.log("PASS_INT_001_QUESTION_STUDIO_CLOSURE_V1_AUDIT");
