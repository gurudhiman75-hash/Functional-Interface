import assert from "node:assert/strict";

import {
  DSF_CP017_GENERATABLE_QL_IDS,
  DSF_CP017_LANES,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  previewDsf001NormalQuestionStudioReview,
} from "./question-studio-review-v1.ts";

assert.equal(DSF_CP017_LANES.length, 21);
assert.deepEqual([...DSF_CP017_GENERATABLE_QL_IDS], ["DSF-QL-001"]);
assert.deepEqual([...DSF_CP017_RUNTIME_DEFERRED_QL_IDS], ["DSF-QL-002"]);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);

const forbiddenSurface = /\b(?:TODO|TBD|undefined|null|NaN)\b|\[object Object\]/iu;
const genericInstructionOpeners = /^(?:study|read|consider|analyse|analyze)\s+(?:the\s+)?(?:following|given)\b/iu;
const allSourceIds = new Set<string>();
const allQuestionIds = new Set<string>();
const laneFingerprints = new Map<string, Set<string>>();

for (const lane of DSF_CP017_LANES) {
  const first = previewDsf001NormalQuestionStudioReview({
    laneId: lane.laneId,
    count: 5,
    seed: `cp017-wave01:${lane.laneId}`,
    language: "en",
  });
  const replay = previewDsf001NormalQuestionStudioReview({
    laneId: lane.laneId,
    count: 5,
    seed: `cp017-wave01:${lane.laneId}`,
    language: "en",
  });

  assert.equal(first.questions.length, 5, `${lane.laneId}: expected five review items`);
  assert.deepEqual(
    first.questions.map((q) => [q.questionId, q.sourceGenerationIdentity, q.correctIndex]),
    replay.questions.map((q) => [q.questionId, q.sourceGenerationIdentity, q.correctIndex]),
    `${lane.laneId}: deterministic replay changed`,
  );

  const localSourceIds = new Set<string>();
  const fingerprints = new Set<string>();

  for (const question of first.questions) {
    assert.equal(question.laneId, lane.laneId);
    assert.equal(question.qlId, "DSF-QL-001");
    assert.equal(question.patternId, "DSF-QL-001");
    assert.equal(question.language, "en");
    assert.equal(question.reviewOnly, true);
    assert.equal(question.manualApprovalRequired, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);

    assert.equal(question.statements.length, 2, `${lane.laneId}: requires exactly two statements`);
    assert.ok(question.statements.every((statement) => statement.text.trim().length >= 2));
    assert.equal(question.options.length, 5, `${lane.laneId}: requires five answer choices`);
    assert.equal(question.optionDetails.length, 5);
    assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1);
    assert.ok(question.correctIndex >= 0 && question.correctIndex < 5);
    assert.ok(question.stem.trim().length >= 8, `${lane.laneId}: stem is too thin`);
    assert.ok(question.explanation.trim().length >= 24, `${lane.laneId}: explanation is too thin`);
    assert.doesNotMatch(question.stem, forbiddenSurface);
    assert.doesNotMatch(question.explanation, forbiddenSurface);
    assert.doesNotMatch(question.stem, genericInstructionOpeners);

    assert.ok(question.sourceGenerationIdentity.trim().length > 0);
    assert.ok(question.contentFingerprint.trim().length > 0);
    assert.ok(question.sourceChapterId.trim().length > 0);
    assert.ok(question.sourceCheckpointId.trim().length > 0);

    assert.equal(localSourceIds.has(question.sourceGenerationIdentity), false, `${lane.laneId}: duplicate source identity in one batch`);
    localSourceIds.add(question.sourceGenerationIdentity);

    assert.equal(allQuestionIds.has(question.questionId), false, `${lane.laneId}: duplicate normalized Question Studio id`);
    allQuestionIds.add(question.questionId);
    allSourceIds.add(`${lane.laneId}:${question.sourceGenerationIdentity}`);
    fingerprints.add(question.contentFingerprint);
  }

  assert.ok(fingerprints.size >= 3, `${lane.laneId}: five generated items collapse to fewer than three content fingerprints`);
  laneFingerprints.set(lane.laneId, fingerprints);
}

assert.equal(laneFingerprints.size, 21);
assert.equal(allQuestionIds.size, 21 * 5);
assert.equal(allSourceIds.size, 21 * 5);

const mixed = previewDsf001NormalQuestionStudioReview({
  count: 50,
  seed: "cp017-wave01:mixed-50",
  language: "en",
});
assert.equal(mixed.questions.length, 50);
assert.equal(new Set(mixed.questions.map((question) => question.sourceGenerationIdentity)).size, 50);
assert.equal(new Set(mixed.questions.map((question) => question.questionId)).size, 50);
assert.ok(new Set(mixed.questions.map((question) => question.laneId)).size >= 12);

assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ qlId: "DSF-QL-002", count: 1 }),
  /permanently allocated.*not exposed|semantic\/prototype proof/iu,
);
assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ language: "hi", count: 1 }),
  /English-first|localization/iu,
);
assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ language: "pa", count: 1 }),
  /English-first|localization/iu,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP017_DEEP_AUDIT_WAVE_01",
  lanes: DSF_CP017_LANES.length,
  laneSamples: 21 * 5,
  mixedSamples: mixed.questions.length,
  totalValidatedItems: 21 * 5 + mixed.questions.length,
  generatableQlIds: DSF_CP017_GENERATABLE_QL_IDS,
  runtimeDeferredQlIds: DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  lifecycle: {
    questionStudioDiscoverable: true,
    reviewPersistence: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
}, null, 2));
