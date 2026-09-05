import { strict as assert } from "node:assert";

import { COM003_QUESTION_STUDIO_ADMIN_PREVIEW_UI_FREEZE_V1 as freeze } from "./com003-question-studio-admin-preview-ui-freeze-v1.ts";

assert.equal(freeze.authorityId, "COM-003-QUESTION-STUDIO-ADMIN-PREVIEW-UI-FREEZE-V1");
assert.equal(freeze.packageId, "COM-003");
assert.equal(freeze.validation.runId, 33421564944);
assert.equal(freeze.validation.jobId, 99584946060);
assert.equal(freeze.validation.conclusion, "success");
assert.equal(freeze.validation.apiBuild, true);
assert.equal(freeze.validation.adminBuild, true);
assert.equal(freeze.validation.uiNoWriteContract, true);
assert.equal(freeze.validation.fullCom003GateChain, true);
assert.equal(freeze.validatedHeadSha, "603682c51d49526b2db9c6c963c4f17c86cace7f");

assert.equal(freeze.corpus.permanentQlCount, 19);
assert.equal(freeze.corpus.englishQuestions, 228);
assert.equal(freeze.corpus.hindiQuestions, 228);
assert.equal(freeze.corpus.punjabiQuestions, 228);
assert.equal(freeze.corpus.frozenQuestionLanguageArtifacts, 684);
assert.deepEqual(freeze.corpus.languages, ["en", "hi", "pa"]);
assert.equal(freeze.corpus.interactivePreviewCap, 12);

assert.equal(freeze.surface.mode, "READ_ONLY_FROZEN_CORPUS_PREVIEW");
assert.equal(freeze.surface.requiresPermission, "content.generation.read");
assert.equal(freeze.surface.endpoints.length, 3);
assert(freeze.surface.endpoints.every((endpoint) => endpoint.startsWith("GET ")));
assert.equal(freeze.surface.deterministicWithoutReplacement, true);
assert.equal(freeze.surface.difficultySelector, false);

for (const [gate, value] of Object.entries(freeze.lifecycleLocks)) {
  assert.equal(value, false, `COM-003 admin preview UI freeze unexpectedly opens lifecycle gate ${gate}.`);
}

for (const [name, blob] of Object.entries(freeze.frozenSourceBlobs)) {
  assert.match(blob, /^[0-9a-f]{40}$/, `Frozen source blob ${name} must be a 40-character Git SHA.`);
}

assert.match(freeze.nextGate, /persistence\/Question Bank registration readiness/i);
assert.match(freeze.replacementRule, /new versioned authority/i);

console.log("[COM003-QUESTION-STUDIO-ADMIN-PREVIEW-UI-FREEZE-V1]", {
  valid: true,
  authorityId: freeze.authorityId,
  validationRun: freeze.validation.runId,
  validationJob: freeze.validation.jobId,
  qlCount: freeze.corpus.permanentQlCount,
  artifactCount: freeze.corpus.frozenQuestionLanguageArtifacts,
  endpoints: freeze.surface.endpoints.length,
  lifecycleLocksClosed: Object.values(freeze.lifecycleLocks).every((value) => value === false),
});
