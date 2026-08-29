import assert from "node:assert/strict";

import {
  generateNumCp012QuestionStudioBatch,
  isNumCp012QuestionStudioRequest,
  listNumCp012QuestionStudioPackages,
  NUM_CP012_QUESTION_STUDIO_QL_IDS,
} from "./question-studio-integration.ts";

assert.equal(isNumCp012QuestionStudioRequest({ packageId: "NUM-002" }), false, "Package-only NUM-002 must not be claimed by CP012");
assert.equal(isNumCp012QuestionStudioRequest({ canonicalProblemId: "NUM-CP-012" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ cpId: "NUM-CP-012" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ patternId: "NUM-CP-012 perfect powers" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-226" }), true);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-225" }), false);
assert.equal(isNumCp012QuestionStudioRequest({ questionLanguageId: "NUM-QL-237" }), false);

const capability = listNumCp012QuestionStudioPackages()[0]!;
assert.equal(capability.packageId, "NUM-002");
assert.deepEqual(capability.cpIds, ["NUM-CP-012"]);
assert.equal(capability.permanentQlCount, 11);
assert.deepEqual(capability.permanentQlIds, Array.from({ length: 11 }, (_, index) => `NUM-QL-${226 + index}`));
assert.deepEqual(capability.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(capability.enabled, true);
assert.equal(capability.questionBankWritable, false);
assert.equal(capability.testEligible, false);
assert.equal(capability.mockTestEligible, false);
assert.equal(capability.publiclyPublishable, false);
assert.equal(capability.automaticStudentPublication, false);

let explicitPackages = 0;
for (const qlId of NUM_CP012_QUESTION_STUDIO_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    const request = {
      canonicalProblemId: "NUM-CP-012",
      questionLanguageId: qlId,
      language,
      seed: `cp012-studio:${qlId}:${language}`,
      count: 2,
    };
    const batch = await generateNumCp012QuestionStudioBatch(request);
    const replay = await generateNumCp012QuestionStudioBatch(request);
    const label = `${qlId}/${language}`;

    // Run timestamps are intentionally observational metadata. Deterministic replay
    // is required for generated content and every stable generation-context field,
    // not for the wall-clock timestamp at which the replay call was made.
    assert.deepEqual(replay.questionPackages, batch.questionPackages, `${label}: deterministic Studio package replay drift`);
    assert.deepEqual(replay.questions, batch.questions, `${label}: deterministic Studio preview replay drift`);
    const { timestamp: _batchTimestamp, ...stableBatchContext } = batch.generationContext;
    const { timestamp: _replayTimestamp, ...stableReplayContext } = replay.generationContext;
    assert.deepEqual(stableReplayContext, stableBatchContext, `${label}: stable generation context replay drift`);

    assert.equal(batch.generationContext.packageId, "NUM-002", `${label}: package drift`);
    assert.equal(batch.generationContext.canonicalProblemId, "NUM-CP-012", `${label}: checkpoint drift`);
    assert.equal(batch.generationContext.permanentQlCount, 11, `${label}: permanent QL count drift`);
    assert.equal(batch.generationContext.questionBankWritable, false, `${label}: Question Bank write gate opened`);
    assert.equal(batch.generationContext.testEligible, false, `${label}: test gate opened`);
    assert.equal(batch.generationContext.mockTestEligible, false, `${label}: mock gate opened`);
    assert.equal(batch.generationContext.publiclyPublishable, false, `${label}: public gate opened`);
    assert.equal(batch.generationContext.automaticStudentPublication, false, `${label}: automatic publication gate opened`);
    assert.equal(batch.questions.length, 2, `${label}: question count drift`);
    assert.equal(batch.questionPackages.length, 2, `${label}: package count drift`);

    for (const question of batch.questions) {
      assert.equal(question.canonicalProblemId, "NUM-CP-012", `${label}: preview checkpoint drift`);
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
      assert.equal(question.semanticMetadata.publiclyPublishable, false, `${label}: traceability public gate opened`);
    }
    explicitPackages += batch.questions.length;
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  const batch = await generateNumCp012QuestionStudioBatch({
    canonicalProblemId: "NUM-CP-012",
    language,
    seed: `cp012-studio-breadth:${language}`,
    count: 22,
  });
  assert.equal(batch.questions.length, 22);
  assert.ok(new Set(batch.questions.map((question) => question.qlId)).size >= 10, `${language}: automatic Studio selection too narrow`);
  assert.ok(new Set(batch.questions.map((question) => question.taskKind)).size >= 10, `${language}: source representation breadth too narrow`);
}

await assert.rejects(
  () => generateNumCp012QuestionStudioBatch({ canonicalProblemId: "NUM-CP-012", questionLanguageId: "NUM-QL-225" }),
  /not owned by NUM-CP-012/u,
);
await assert.rejects(
  () => generateNumCp012QuestionStudioBatch({ canonicalProblemId: "NUM-CP-011" }),
  /cannot serve canonical problem/u,
);
await assert.rejects(
  () => generateNumCp012QuestionStudioBatch({ canonicalProblemId: "NUM-CP-012", language: "fr" }),
  /does not support Question Studio language/u,
);

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_QUESTION_STUDIO_INTEGRATION",
  permanentQlCount: NUM_CP012_QUESTION_STUDIO_QL_IDS.length,
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
