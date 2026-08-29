import assert from "node:assert/strict";

import {
  DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1,
  DSF_CP017_NEXT_AVAILABLE_QL_ID,
  DSF_CP017_PERMANENT_QL_IDS,
  DSF_CP017_TWO_STATEMENT_LANES,
  generateDsfCp017NormalQuestionStudioBatch,
  isDsfCp017NormalQuestionStudioRequest,
} from "./question-studio-normal-integration-v1.ts";

const pkg = DSF_CP017_NORMAL_QUESTION_STUDIO_PACKAGE_V1;
assert.equal(pkg.packageId, "DSF-001");
assert.equal(pkg.enabled, true);
assert.equal(pkg.questionStudioDiscoverable, true);
assert.equal(pkg.questionStudioGenerationEnabled, true);
assert.equal(pkg.persistenceAllowed, true);
assert.equal(pkg.reviewOnly, true);
assert.equal(pkg.manualApprovalRequired, true);
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.deepEqual([...DSF_CP017_PERMANENT_QL_IDS], ["DSF-QL-001", "DSF-QL-002"]);
assert.equal(DSF_CP017_NEXT_AVAILABLE_QL_ID, "DSF-QL-003");
assert.equal(DSF_CP017_TWO_STATEMENT_LANES.length, 17);
assert(pkg.cpIds.includes("DSF-CP-011"));
assert(pkg.cpIds.includes("DSF-CP-012"));
assert(pkg.cpIds.includes("DSF-CP-013"));
assert(pkg.cpIds.includes("DSF-CP-015"));
assert(pkg.cpIds.includes("DSF-CP-017"));
assert.equal(pkg.canonicalProblems.length, 19);

assert.equal(isDsfCp017NormalQuestionStudioRequest({ packageId: "DSF-001" }), true);
assert.equal(isDsfCp017NormalQuestionStudioRequest({ subtopic: "Data Sufficiency" }), true);
assert.equal(isDsfCp017NormalQuestionStudioRequest({ canonicalProblemId: "DSF-QL-002" }), true);
assert.equal(isDsfCp017NormalQuestionStudioRequest({ packageId: "AVG-001", subtopic: "Average" }), false);

function assertReviewLocked(question: any, expectedQl: "DSF-QL-001" | "DSF-QL-002") {
  assert.equal(question.packageId, "DSF-001");
  assert.equal(question.qlId, expectedQl);
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.questionStudioGenerationEnabled, true);
  assert.equal(question.persistenceAllowed, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.manualApprovalRequired, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.options.length, 5);
  assert.equal(question.optionDetails.filter((option: any) => option.isCorrect).length, 1);
  assert.equal(question.correctIndex >= 0 && question.correctIndex < 5, true);
  assert.equal(typeof question.text, "string");
  assert.equal(typeof question.explanation, "string");
  assert.equal(typeof question.sourceGenerationIdentity, "string");
}

const defaultBatch = generateDsfCp017NormalQuestionStudioBatch({
  packageId: "DSF-001",
  seed: "cp017-default-audit",
  count: 12,
});
assert.equal(defaultBatch.questions.length, 12);
assert(defaultBatch.questions.every((question) => question.qlId === "DSF-QL-001"));
assert(defaultBatch.questions.every((question) => question.statements.length === 2));
defaultBatch.questions.forEach((question) => assertReviewLocked(question, "DSF-QL-001"));
assert(new Set(defaultBatch.questions.map((question) => question.sourceGenerationIdentity)).size === 12);
assert(new Set(defaultBatch.questions.map((question) => question.checkpointId)).size >= 2);
assert(new Set(defaultBatch.questions.map((question) => question.sourceChapterId)).size >= 6);

for (const [canonicalProblemId, checkpointId] of [
  ["DSF-LANE-AVERAGE", "DSF-CP-011"],
  ["DSF-LANE-RANKING", "DSF-CP-012"],
  ["DSF-LANE-CALENDAR", "DSF-CP-013"],
] as const) {
  const result = generateDsfCp017NormalQuestionStudioBatch({
    packageId: "DSF-001",
    canonicalProblemId,
    seed: `cp017-${canonicalProblemId}`,
    count: 1,
  });
  assert.equal(result.questions.length, 1);
  assert.equal(result.questions[0]!.checkpointId, checkpointId);
  assertReviewLocked(result.questions[0], "DSF-QL-001");
}

const ql002 = generateDsfCp017NormalQuestionStudioBatch({
  packageId: "DSF-001",
  canonicalProblemId: "DSF-QL-002",
  seed: "cp017-ql002-audit",
  count: 2,
});
assert.equal(ql002.questions.length, 2);
assert(ql002.questions.every((question) => question.qlId === "DSF-QL-002"));
assert(ql002.questions.every((question) => question.checkpointId === "DSF-CP-015"));
assert(ql002.questions.every((question) => question.statements.length === 3));
ql002.questions.forEach((question) => assertReviewLocked(question, "DSF-QL-002"));

assert.throws(
  () => generateDsfCp017NormalQuestionStudioBatch({ packageId: "DSF-001", canonicalProblemId: "DSF-QL-002", count: 3 }),
  /capped at 2/,
);
assert.throws(
  () => generateDsfCp017NormalQuestionStudioBatch({ packageId: "DSF-001", language: "hi", count: 1 }),
  /currently supports English/,
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP017_NORMAL_QUESTION_STUDIO_INTEGRATION_V1",
  twoStatementLaneCount: DSF_CP017_TWO_STATEMENT_LANES.length,
  canonicalProblemCount: pkg.canonicalProblems.length,
  permanentQlIds: DSF_CP017_PERMANENT_QL_IDS,
  nextAvailableQlId: DSF_CP017_NEXT_AVAILABLE_QL_ID,
  defaultBatchSize: defaultBatch.questions.length,
  defaultCheckpointCount: new Set(defaultBatch.questions.map((question) => question.checkpointId)).size,
  defaultSourceChapterCount: new Set(defaultBatch.questions.map((question) => question.sourceChapterId)).size,
  ql002BatchSize: ql002.questions.length,
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
