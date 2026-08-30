import assert from "node:assert/strict";

import {
  DSF_CP017_CHECKPOINT_ID,
  DSF_CP017_LANES,
  DSF_CP017_PACKAGE_ID,
  DSF_CP017_QUESTION_STUDIO_AUTHORITY,
  DSF_CP017_QUESTION_STUDIO_PACKAGE,
  generateDsfCp017QuestionStudioBatch,
} from "./question-studio-normal-workflow-v1.ts";
import { DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION } from "../DSF-CP-014/reasoning-common-base-editorial-overlay.ts";
import {
  DSF_CURRENT_NEXT_AVAILABLE_QL_ID,
  DSF_CURRENT_PERMANENT_QL_REGISTRY,
} from "../foundation/current-permanent-ql-registry.ts";

assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.packageId, DSF_CP017_PACKAGE_ID);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.integrationCheckpointId, DSF_CP017_CHECKPOINT_ID);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.integrationAuthority, DSF_CP017_QUESTION_STUDIO_AUTHORITY);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.laneCount, 17);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.questionStudioDiscoverable, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.questionStudioGenerationEnabled, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.persistenceAllowed, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.reviewOnly, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.manualApprovalRequired, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.questionBankStatus, "NOT_STORED");
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.questionBankWritable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.testEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.mockTestEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.deepEqual(
  DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds,
  DSF_CURRENT_PERMANENT_QL_REGISTRY.map((entry) => entry.qlId),
);
assert.deepEqual(DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds, ["DSF-QL-001"]);
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.nonGeneratablePermanentQlIds[0]?.qlId, "DSF-QL-002");
assert.equal(DSF_CP017_QUESTION_STUDIO_PACKAGE.nextAvailableQlId, DSF_CURRENT_NEXT_AVAILABLE_QL_ID);

const allIds = new Set<string>();
let generated = 0;
let reasoningCount = 0;
let quantCount = 0;

for (const lane of DSF_CP017_LANES) {
  const result = generateDsfCp017QuestionStudioBatch({
    laneId: lane.id,
    count: 3,
    seed: `cp017-audit:${lane.id}`,
  });
  assert.equal(result.questionCount, 3, `${lane.id}: expected three review questions.`);
  assert.equal(result.integrationCheckpointId, DSF_CP017_CHECKPOINT_ID);
  assert.equal(result.integrationAuthority, DSF_CP017_QUESTION_STUDIO_AUTHORITY);

  for (const question of result.questions) {
    generated += 1;
    if (lane.domainFamily === "REASONING") reasoningCount += 1;
    else quantCount += 1;

    assert.equal(question.packageId, "DSF-001");
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.integrationCheckpointId, DSF_CP017_CHECKPOINT_ID);
    assert.equal(question.integrationAuthority, DSF_CP017_QUESTION_STUDIO_AUTHORITY);
    assert.equal(question.laneId, lane.id);
    assert.equal(question.domainLabel, lane.label);
    assert.equal(question.language, "en");
    assert.equal(question.locale, "en-IN");
    assert.equal(question.statements.length, 2);
    assert.equal(question.options.length, 5);
    assert.equal(question.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(question.options[question.correctIndex]?.isCorrect, true);
    assert.equal(question.validation.valid, true);
    assert.equal(question.validation.semanticTruthPreserved, true);
    assert.equal(question.validation.sourceLifecyclePreserved, true);
    assert.equal(question.validation.questionStudioExposureOwnedByCp017, true);
    assert.equal(question.lifecycle.questionStudioDiscoverable, true);
    assert.equal(question.lifecycle.questionStudioGenerationEnabled, true);
    assert.equal(question.lifecycle.persistenceAllowed, true);
    assert.equal(question.lifecycle.reviewOnly, true);
    assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.mockTestEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);
    assert.equal(question.generationContext.questionBankWritable, false);
    assert.equal(question.generationContext.testEligible, false);
    assert.equal(question.generationContext.mockTestEligible, false);
    assert.equal(question.generationContext.publiclyPublishable, false);
    assert.equal(question.generationContext.automaticStudentPublication, false);
    assert(!question.stem.includes("\n\nStatement I:"), `${lane.id}: review stem must not duplicate statement blocks.`);
    assert(question.explanation.length > 0, `${lane.id}: explanation must be present.`);
    assert(!question.explanation.includes("[object Object]"), `${lane.id}: structured explanation was string-coerced.`);
    assert(!allIds.has(question.sourceGenerationIdentity), `${lane.id}: duplicate source generation identity.`);
    allIds.add(question.sourceGenerationIdentity);

    if (lane.domainFamily === "REASONING") {
      assert.equal(question.editorialSurfaceVersion, DSF_REASONING_COMMON_BASE_EDITORIAL_VERSION);
      assert.equal(question.validation.editorialSurfaceApplied, true);
    } else {
      assert.equal(question.editorialSurfaceVersion, undefined);
      assert.equal(question.validation.editorialSurfaceApplied, false);
    }
  }
}

assert.equal(generated, 51);
assert.equal(reasoningCount, 21);
assert.equal(quantCount, 30);

const deterministicA = generateDsfCp017QuestionStudioBatch({ laneId: "AVERAGE", count: 5, seed: "deterministic" });
const deterministicB = generateDsfCp017QuestionStudioBatch({ laneId: "AVERAGE", count: 5, seed: "deterministic" });
assert.deepEqual(
  deterministicA.questions.map((question) => question.sourceGenerationIdentity),
  deterministicB.questions.map((question) => question.sourceGenerationIdentity),
  "CP017 generation must be deterministic for the same request seed.",
);

for (const semanticClass of [
  "STATEMENT_I_ONLY",
  "STATEMENT_II_ONLY",
  "EACH_STATEMENT_ALONE",
  "BOTH_TOGETHER_ONLY",
  "INSUFFICIENT_EVEN_TOGETHER",
] as const) {
  const result = generateDsfCp017QuestionStudioBatch({
    laneId: "RANKING",
    semanticClass,
    count: 1,
    seed: `class:${semanticClass}`,
  });
  assert.equal(result.questions[0]?.canonicalAnswer, semanticClass);
}

assert.throws(
  () => generateDsfCp017QuestionStudioBatch({ qlId: "DSF-QL-002" as any, count: 1 }),
  /does not yet have a breadth-qualified normal Question Studio generator/i,
);
assert.throws(
  () => generateDsfCp017QuestionStudioBatch({ language: "hi" as any, count: 1 }),
  /English-only/i,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP017_NORMAL_QUESTION_STUDIO_WORKFLOW_V1",
  laneCount: DSF_CP017_LANES.length,
  generatedAuditQuestions: generated,
  permanentQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.currentPermanentQlIds,
  generatableQlIds: DSF_CP017_QUESTION_STUDIO_PACKAGE.generatableQlIds,
  nextAvailableQlId: DSF_CP017_QUESTION_STUDIO_PACKAGE.nextAvailableQlId,
  questionStudioDiscoverable: DSF_CP017_QUESTION_STUDIO_PACKAGE.questionStudioDiscoverable,
  questionStudioGenerationEnabled: DSF_CP017_QUESTION_STUDIO_PACKAGE.questionStudioGenerationEnabled,
  persistenceAllowed: DSF_CP017_QUESTION_STUDIO_PACKAGE.persistenceAllowed,
  questionBankWritable: DSF_CP017_QUESTION_STUDIO_PACKAGE.questionBankWritable,
  testEligible: DSF_CP017_QUESTION_STUDIO_PACKAGE.testEligible,
  mockTestEligible: DSF_CP017_QUESTION_STUDIO_PACKAGE.mockTestEligible,
  publiclyPublishable: DSF_CP017_QUESTION_STUDIO_PACKAGE.publiclyPublishable,
}, null, 2));
