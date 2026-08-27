import assert from "node:assert/strict";

import {
  generateNumCp013QuestionStudioBatch,
  isNumCp013QuestionStudioRequest,
  listNumCp013QuestionStudioPackages,
  NUM_CP013_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";

assert.equal(isNumCp013QuestionStudioRequest({ packageId: "NUM-002" }), false, "Package-only NUM-002 must not be claimed by CP013");
assert.equal(isNumCp013QuestionStudioRequest({ canonicalProblemId: "NUM-CP-013" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ cpId: "NUM-CP-013" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ patternId: "NUM-CP-013 positional bases" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-237" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-247" }), true);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-236" }), false);
assert.equal(isNumCp013QuestionStudioRequest({ questionLanguageId: "NUM-QL-248" }), false);

const capability = listNumCp013QuestionStudioPackages()[0]!;
assert.equal(capability.packageId, "NUM-002");
assert.deepEqual(capability.cpIds, ["NUM-CP-013"]);
assert.equal(capability.permanentQlCount, 11);
assert.deepEqual(capability.permanentQlIds, Array.from({ length: 11 }, (_, index) => `NUM-QL-${237 + index}`));
assert.deepEqual(capability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(capability.enabled, true);
assert.equal(capability.explanationStandard, "QUESTION_SPECIFIC_HUMAN_V1");
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.mockTestEligible, false);
assert.equal(capability.publiclyPublishable, false);
assert.equal(capability.automaticStudentPublication, false);

let explicitPackages = 0;
for (const qlId of NUM_CP013_QUESTION_STUDIO_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    const request = {
      canonicalProblemId: "NUM-CP-013",
      questionLanguageId: qlId,
      language,
      seed: `cp013-studio:${qlId}:${language}`,
      count: 2,
    };
    const batch = await generateNumCp013QuestionStudioBatch(request);
    const replay = await generateNumCp013QuestionStudioBatch(request);
    const label = `${qlId}/${language}`;

    assert.deepEqual(replay.questionPackages, batch.questionPackages, `${label}: deterministic Studio package replay drift`);
    assert.deepEqual(replay.questions, batch.questions, `${label}: deterministic Studio preview replay drift`);
    const { timestamp: _batchTimestamp, ...stableBatchContext } = batch.generationContext;
    const { timestamp: _replayTimestamp, ...stableReplayContext } = replay.generationContext;
    assert.deepEqual(stableReplayContext, stableBatchContext, `${label}: stable generation context replay drift`);

    assert.equal(batch.generationContext.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(batch.generationContext.canonicalProblemId, "NUM-CP-013", `${label}: checkpoint drift`);
    assert.equal(batch.generationContext.permanentQlCount, 11, `${label}: permanent QL count drift`);
    assert.equal(batch.generationContext.explanationStandard, "QUESTION_SPECIFIC_HUMAN_V1", `${label}: explanation standard drift`);
    assert.equal(batch.generationContext.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(batch.generationContext.testEligible, false, `${label}: test gate opened`);
    assert.equal(batch.generationContext.mockTestEligible, false, `${label}: mock gate opened`);
    assert.equal(batch.generationContext.publiclyPublishable, false, `${label}: public gate opened`);
    assert.equal(batch.generationContext.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
    assert.equal(batch.questions.length, 2, `${label}: question count drift`);

    for (const question of batch.questions) {
      assert.equal(question.canonicalProblemId, "NUM-CP-013", `${label}: preview checkpoint drift`);
      assert.equal(question.qlId, qlId, `${label}: explicit QL drift`);
      assert.equal(question.language, language, `${label}: language drift`);
      assert.equal(question.runtimeMode, "QUESTION_STUDIO_ACTIVE", `${label}: runtime mode drift`);
      assert.equal(question.questionStudioDiscoverable, true, `${label}: Studio discoverability not opened`);
      assert.equal(question.questionBankWritable, false, `${label}: Question Bank write gate opened`);
      assert.equal(question.testEligible, false, `${label}: test gate opened`);
      assert.equal(question.mockTestEligible, false, `${label}: mock gate opened`);
      assert.equal(question.publiclyPublishable, false, `${label}: public gate opened`);
      assert.equal(question.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
      assert.equal(question.options.length, 4, `${label}: option count drift`);
      assert.equal(new Set(question.options).size, 4, `${label}: duplicate options`);
      assert.equal(question.options[question.correctIndex], question.answer, `${label}: answer binding drift`);
      assert.equal(question.validation.ok, true, `${label}: validation not green`);
      assert.equal(question.semanticMetadata.permanentQlId, qlId, `${label}: traceability QL drift`);
      assert.equal(question.semanticMetadata.questionBankWritable, false, `${label}: traceability write gate opened`);
      assert.equal(question.semanticMetadata.testEligible, false, `${label}: traceability test gate opened`);
      assert.equal(question.semanticMetadata.mockTestEligible, false, `${label}: traceability mock gate opened`);
      assert.equal(question.semanticMetadata.publiclyPublishable, false, `${label}: traceability public gate opened`);
      assert.ok(String(question.explanation).length >= 80, `${label}: Studio explanation too thin`);
      assert.ok(String(question.taskKind).length > 0, `${label}: task-kind traceability missing`);
    }
    explicitPackages += batch.questions.length;
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  const batch = await generateNumCp013QuestionStudioBatch({
    canonicalProblemId: "NUM-CP-013",
    language,
    seed: `cp013-studio-breadth:${language}`,
    count: 33,
  });
  assert.equal(batch.questions.length, 33);
  assert.equal(new Set(batch.questions.map((question) => question.qlId)).size, 11, `${language}: not all CP013 QLs reached`);
  assert.ok(new Set(batch.questions.map((question) => question.taskKind)).size >= 18, `${language}: source task breadth too narrow`);
  assert.ok(new Set(batch.questions.map((question) => question.mathematicalFingerprint)).size >= 28, `${language}: mathematical state breadth too narrow`);
}

await assert.rejects(
  () => generateNumCp013QuestionStudioBatch({ canonicalProblemId: "NUM-CP-013", questionLanguageId: "NUM-QL-236" }),
  /not owned by NUM-CP-013/u,
);
await assert.rejects(
  () => generateNumCp013QuestionStudioBatch({ canonicalProblemId: "NUM-CP-012" }),
  /cannot serve canonical problem/u,
);
await assert.rejects(
  () => generateNumCp013QuestionStudioBatch({ canonicalProblemId: "NUM-CP-013", language: "fr" }),
  /does not support Question Studio language/u,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP013_QUESTION_STUDIO_INTEGRATION",
  permanentQlCount: NUM_CP013_QUESTION_STUDIO_QL_IDS.length,
  explicitPackages,
  supportedLanguages: ["en", "hi", "pa"],
  deterministicContentReplay: true,
  observationalTimestampExcludedFromReplayEquality: true,
  packageOnlyNum002Claimed: false,
  questionStudioDiscoverable: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
}, null, 2));
