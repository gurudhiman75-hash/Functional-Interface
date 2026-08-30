import assert from "node:assert/strict";

import {
  DSF_CP017_LANES,
  DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE,
  DSF_CP017_RUNTIME_DEFERRED_QL_IDS,
  isDsf001NormalQuestionStudioRequest,
  previewDsf001NormalQuestionStudioReview,
} from "./question-studio-review-v1.ts";

assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.packageId, "DSF-001");
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.enabled, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioVisible, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioDiscoverable, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionStudioGenerationEnabled, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.persistenceAllowed, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.reviewOnly, true);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.questionBankWritable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.testEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.mockTestEligible, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.publiclyPublishable, false);
assert.equal(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.automaticStudentPublication, false);
assert.deepEqual(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
assert.deepEqual(DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.generatableQlIds, ["DSF-QL-001"]);
assert.deepEqual(DSF_CP017_RUNTIME_DEFERRED_QL_IDS, ["DSF-QL-002"]);
assert.equal(DSF_CP017_LANES.length, 21);
assert.equal(new Set(DSF_CP017_LANES.map((lane) => lane.laneId)).size, 21);

assert.equal(isDsf001NormalQuestionStudioRequest({ packageId: "DSF-001" } as any), true);
assert.equal(isDsf001NormalQuestionStudioRequest({ topic: "Reasoning", subtopic: "Data Sufficiency" } as any), true);
assert.equal(isDsf001NormalQuestionStudioRequest({ packageId: "AVG-001" } as any), false);

const laneQuestionIds = new Set<string>();
for (const [index, lane] of DSF_CP017_LANES.entries()) {
  const preview = previewDsf001NormalQuestionStudioReview({
    seed: `cp017-lane-${index}`,
    count: 1,
    canonicalProblemId: lane.laneId,
    language: "en",
  });
  assert.equal(preview.questions.length, 1, `${lane.laneId}: expected one preview question`);
  const question = preview.questions[0]!;
  assert.equal(question.packageId, "DSF-001", `${lane.laneId}: package identity`);
  assert.equal(question.qlId, "DSF-QL-001", `${lane.laneId}: QL identity`);
  assert.equal(question.laneId, lane.laneId, `${lane.laneId}: lane identity`);
  assert.equal(question.canonicalProblemId, lane.laneId, `${lane.laneId}: canonical problem identity`);
  assert.equal(question.questionStudioDiscoverable, true, `${lane.laneId}: Studio discovery`);
  assert.equal(question.persistenceAllowed, true, `${lane.laneId}: review persistence`);
  assert.equal(question.reviewOnly, true, `${lane.laneId}: review-only`);
  assert.equal(question.questionBankWritable, false, `${lane.laneId}: Question Bank lock`);
  assert.equal(question.testEligible, false, `${lane.laneId}: scored-test lock`);
  assert.equal(question.mockTestEligible, false, `${lane.laneId}: mock lock`);
  assert.equal(question.publiclyPublishable, false, `${lane.laneId}: public lock`);
  assert.equal(question.automaticStudentPublication, false, `${lane.laneId}: automatic publication lock`);
  assert.equal(question.statements.length, 2, `${lane.laneId}: two statements`);
  assert.equal(question.options.length, 5, `${lane.laneId}: five options`);
  assert.equal(question.optionDetails.filter((option) => option.isCorrect).length, 1, `${lane.laneId}: exactly one correct option`);
  assert(question.correctIndex >= 0 && question.correctIndex < 5, `${lane.laneId}: correct index`);
  assert(question.text.includes("I. ") && question.text.includes("II. "), `${lane.laneId}: standard DS text rendering`);
  assert(question.explanation.length > 20, `${lane.laneId}: non-empty explanation`);
  assert(!question.explanation.includes("[object Object]"), `${lane.laneId}: explanation must preserve human text`);
  assert(!laneQuestionIds.has(question.questionId), `${lane.laneId}: unique normal-workflow question id`);
  laneQuestionIds.add(question.questionId);

  if (lane.domainFamily === "REASONING") {
    assert.equal(question.editorialSurfaceVersion, "DSF_REASONING_COMMON_BASE_EDITORIAL_V3", `${lane.laneId}: CP014 editorial overlay`);
  }
}

const deterministicA = previewDsf001NormalQuestionStudioReview({
  seed: "cp017-determinism",
  count: 3,
  canonicalProblemId: "DSF-QS-RANKING",
});
const deterministicB = previewDsf001NormalQuestionStudioReview({
  seed: "cp017-determinism",
  count: 3,
  canonicalProblemId: "DSF-QS-RANKING",
});
assert.deepEqual(
  deterministicA.questions.map((question) => question.questionId),
  deterministicB.questions.map((question) => question.questionId),
  "normal Question Studio generation must be deterministic for the same seed and filters",
);

const mixed = previewDsf001NormalQuestionStudioReview({ seed: "cp017-mixed", count: 25 });
assert.equal(mixed.questions.length, 25);
assert.equal(new Set(mixed.questions.map((question) => question.sourceGenerationIdentity)).size, 25);
assert.equal(mixed.generationContext.lifecycleStatus, "REVIEW_ONLY");
assert.equal(mixed.generationContext.questionBankWritable, false);
assert.equal(mixed.generationContext.testEligible, false);
assert.equal(mixed.generationContext.mockTestEligible, false);
assert.equal(mixed.generationContext.publiclyPublishable, false);
assert.equal(mixed.generationContext.automaticStudentPublication, false);

assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ patternId: "DSF-QL-002", count: 1 }),
  /permanently allocated.*not exposed/i,
  "QL002 must remain explicitly deferred until a real reviewed batch runtime exists",
);
assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ language: "hi", count: 1 }),
  /English-first/i,
  "new CP011-CP013 breadth must not pretend to have Hindi localization",
);
assert.throws(
  () => previewDsf001NormalQuestionStudioReview({ canonicalProblemId: "DSF-QS-NOT-A-LANE", count: 1 }),
  /Unsupported Data Sufficiency canonical problem/i,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP017_NORMAL_QUESTION_STUDIO_REVIEW_ADAPTER",
  laneCount: DSF_CP017_LANES.length,
  permanentQlIds: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.permanentQlIds,
  generatableQlIds: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.generatableQlIds,
  runtimeDeferredQlIds: DSF_CP017_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeDeferredQlIds,
  mixedBatchSize: mixed.questions.length,
  lifecycle: {
    questionStudioDiscoverable: true,
    persistenceAllowed: true,
    reviewOnly: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
}, null, 2));
