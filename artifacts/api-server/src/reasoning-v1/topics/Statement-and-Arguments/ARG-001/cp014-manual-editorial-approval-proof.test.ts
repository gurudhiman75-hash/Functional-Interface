import assert from "node:assert/strict";

import {
  ARG_CP013_CHECKPOINT_ID,
  ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  generateArgCp013QuestionStudioBatch,
} from "./cp013-final-editorial-surface.ts";
import {
  ARG_CP014_AUTHORITY,
  ARG_CP014_CHECKPOINT_ID,
  ARG_CP014_LEARNER_RELEASE,
  ARG_CP014_MANUAL_APPROVAL,
  ARG_CP014_QUESTION_STUDIO_AUTHORITY,
  ARG_CP014_QUESTION_STUDIO_PACKAGE,
  ARG_CP014_REVIEW_STATUS,
  ARG_CP014_RUNTIME_MODE,
  generateArgCp014QuestionStudioBatch,
  isArgCp014CurrentRequest,
} from "./cp014-manual-editorial-approval.ts";

type QuestionRecord = Readonly<Record<string, any>>;

assert.equal(ARG_CP014_CHECKPOINT_ID, "ARG-CP-014");
assert.equal(ARG_CP014_AUTHORITY, "ARG_CP014_MANUAL_EDITORIAL_APPROVAL_V1");
assert.equal(ARG_CP014_QUESTION_STUDIO_AUTHORITY, "ARG_CP014_QUESTION_STUDIO_INTERNAL_ELIGIBILITY_V1");
assert.equal(ARG_CP014_RUNTIME_MODE, "APPROVED_CP013_SURFACE_INTERNAL_ELIGIBILITY");
assert.equal(ARG_CP014_REVIEW_STATUS, "QUESTION_STUDIO_CP014_EDITORIALLY_APPROVED_INTERNAL");
assert.equal(ARG_CP014_LEARNER_RELEASE, "INTERNAL_ELIGIBLE");

assert.deepEqual(ARG_CP014_MANUAL_APPROVAL, {
  chapterId: "ARG-001",
  checkpointId: "ARG-CP-014",
  status: "MANUAL_EDITORIAL_APPROVAL_RECORDED",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF_IN_PROJECT_CHAT",
  approvalStatement: "Approved",
  approvedAtUtc: "2026-09-04T03:07:00Z",
  approvedAtIst: "2026-09-04T08:37:00+05:30",
  approvedReviewedCheckpointId: "ARG-CP-013",
  approvedFinalEditorialAuthority: "ARG_CP013_FINAL_EDITORIAL_SURFACE_V1",
  approvedQuestionStudioAuthority: "ARG_CP013_QUESTION_STUDIO_FINAL_EDITORIAL_V1",
  approvedCertifiedRuntimeHead: "ac8850c42dd9ff0b23f5048dffda621dcc5455ce",
  approvedCertificationWorkflowRunId: 33772042174,
  approvedReviewPacketWorkflowRunId: 33772065384,
  approvedReviewPacketPath: "docs/review/ARG-001-CP013-RUNTIME-REVIEW-SAMPLES.md",
  approvedReviewPacketBlobSha: "f3259f9a727844118d63c13bbb3b1d2d1d212e03",
  contentMutationAllowed: false,
  internalQuestionBankEligibilityAuthorized: true,
  internalTestEligibilityAuthorized: true,
  internalMockEligibilityAuthorized: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
});

assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.sourceFinalEditorialCheckpointId, ARG_CP013_CHECKPOINT_ID);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.sourceQuestionStudioAuthority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.reviewOnly, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.manualApprovalRequired, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.persistenceAllowed, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.questionBankStatus, "WRITABLE");
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.questionBankWritable, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.testEligibility, "ELIGIBLE");
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.testEligible, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.mockTestEligible, true);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.publiclyPublishable, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.publicReleaseAuthorized, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.studentDeliveryAuthorized, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.automaticStudentPublication, false);
assert.equal(ARG_CP014_QUESTION_STUDIO_PACKAGE.learnerRelease, "INTERNAL_ELIGIBLE");
assert.equal(isArgCp014CurrentRequest({ packageId: "ARG-001" }), true);
assert.equal(isArgCp014CurrentRequest({ cpId: "ARG-CP-014" }), true);
assert.equal(isArgCp014CurrentRequest({ packageId: "NUM-001" }), false);

function assertApprovedLifecycle(question: QuestionRecord): void {
  assert.equal(question.checkpointId, ARG_CP014_CHECKPOINT_ID);
  assert.equal(question.releaseCheckpointId, ARG_CP014_CHECKPOINT_ID);
  assert.equal(question.sourceFinalEditorialCheckpointId, ARG_CP013_CHECKPOINT_ID);
  assert.equal(question.currentQuestionStudioAuthority, ARG_CP014_QUESTION_STUDIO_AUTHORITY);
  assert.equal(question.supersedesQuestionStudioAuthority, ARG_CP013_QUESTION_STUDIO_AUTHORITY);
  assert.equal(question.runtimeMode, ARG_CP014_RUNTIME_MODE);
  assert.equal(question.reviewStatus, ARG_CP014_REVIEW_STATUS);
  assert.equal(question.lifecycleStatus, "EDITORIALLY_APPROVED_INTERNAL");
  assert.equal(question.manualApprovalRequired, false);
  assert.equal(question.manualEditorialApproval, "APPROVED");
  assert.equal(question.persistenceAllowed, true);
  assert.equal(question.questionBankStatus, "WRITABLE");
  assert.equal(question.questionBankWritable, true);
  assert.equal(question.testEligibility, "ELIGIBLE");
  assert.equal(question.testEligible, true);
  assert.equal(question.mockTestEligible, true);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.publicReleaseAuthorized, false);
  assert.equal(question.studentDeliveryAuthorized, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.learnerRelease, ARG_CP014_LEARNER_RELEASE);
}

const CONTENT_FIELDS = [
  "questionId",
  "contentFingerprint",
  "qlId",
  "templateId",
  "scenarioId",
  "profileMode",
  "examProfile",
  "language",
  "difficulty",
  "text",
  "stem",
  "statement",
  "arguments",
  "argumentStrengths",
  "options",
  "correctIndex",
  "answer",
  "canonicalAnswer",
  "explanation",
] as const;

function assertContentIdentity(source: QuestionRecord, approved: QuestionRecord): void {
  for (const field of CONTENT_FIELDS) {
    assert.deepEqual(approved[field], source[field], `CP014 changed approved CP013 content field ${field}`);
  }
}

const CASES = [
  { qlId: "ARG-QL-001", language: "en", difficulty: "Easy", seed: "CP014-CORE-EN", count: 24 },
  { qlId: "ARG-QL-005", language: "pa", difficulty: "Hard", seed: "CP014-CORE-PA", count: 24 },
  { cpId: "ARG-CP-014", qlId: "ARG-QL-001", language: "hi", difficulty: "Easy", examProfile: "SSC_RECENT_2X4", seed: "CP014-SSC-HI", count: 24 },
  { cpId: "ARG-CP-014", qlId: "ARG-QL-004", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", seed: "CP014-BANK-QL004", count: 30 },
  { cpId: "ARG-CP-014", qlId: "ARG-QL-006", language: "en", difficulty: "Hard", examProfile: "BANKING_COMBO_4X5", seed: "CP014-BANK-QL006", count: 30 },
] as const;

for (const input of CASES) {
  const cp013Input = input.cpId === "ARG-CP-014" ? { ...input, cpId: "ARG-CP-013" as const } : input;
  const source = generateArgCp013QuestionStudioBatch(cp013Input);
  const approved = generateArgCp014QuestionStudioBatch(input);
  assert.equal(approved.questions.length, source.questions.length);
  assert.equal(approved.generationContext.manualApprovalRequired, false);
  assert.equal(approved.generationContext.questionBankWritable, true);
  assert.equal(approved.generationContext.testEligible, true);
  assert.equal(approved.generationContext.mockTestEligible, true);
  assert.equal(approved.generationContext.publiclyPublishable, false);
  assert.equal(approved.generationContext.publicReleaseAuthorized, false);
  assert.equal(approved.generationContext.studentDeliveryAuthorized, false);
  assert.equal(approved.generationContext.automaticStudentPublication, false);
  assert.equal(approved.generationContext.learnerRelease, ARG_CP014_LEARNER_RELEASE);

  for (let index = 0; index < source.questions.length; index += 1) {
    const sourceQuestion = source.questions[index] as unknown as QuestionRecord;
    const approvedQuestion = approved.questions[index] as unknown as QuestionRecord;
    assertContentIdentity(sourceQuestion, approvedQuestion);
    assertApprovedLifecycle(approvedQuestion);

    // Source evidence remains locked and is not rewritten by approval wrapping.
    assert.equal(sourceQuestion.checkpointId, ARG_CP013_CHECKPOINT_ID);
    assert.equal(sourceQuestion.manualApprovalRequired, true);
    assert.equal(sourceQuestion.questionBankWritable, false);
    assert.equal(sourceQuestion.testEligible, false);
    assert.equal(sourceQuestion.mockTestEligible, false);
    assert.equal(sourceQuestion.learnerRelease, "LOCKED");
  }

  const replay = generateArgCp014QuestionStudioBatch(input);
  assert.deepEqual(replay, approved, `CP014 deterministic replay failed for ${JSON.stringify(input)}`);
}

console.log("ARG-001 CP014 manual editorial approval and internal-only lifecycle proof passed.");
