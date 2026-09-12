import {
  ARG_CP013_AUTHORITY,
  ARG_CP013_CHECKPOINT_ID,
  ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  ARG_CP013_QUESTION_STUDIO_PACKAGE,
  generateArgCp013QuestionStudioBatch,
  isArgCp013CurrentReviewRequest,
  isArgCp013RealPaperRequest,
  type ArgCp013QuestionStudioInput,
} from "./cp013-final-editorial-surface.ts";

export const ARG_CP014_CHECKPOINT_ID = "ARG-CP-014" as const;
export const ARG_CP014_AUTHORITY = "ARG_CP014_MANUAL_EDITORIAL_APPROVAL_V1" as const;
export const ARG_CP014_QUESTION_STUDIO_AUTHORITY = "ARG_CP014_QUESTION_STUDIO_INTERNAL_ELIGIBILITY_V1" as const;
export const ARG_CP014_RUNTIME_MODE = "APPROVED_CP013_SURFACE_INTERNAL_ELIGIBILITY" as const;
export const ARG_CP014_REVIEW_STATUS = "QUESTION_STUDIO_CP014_EDITORIALLY_APPROVED_INTERNAL" as const;
export const ARG_CP014_LEARNER_RELEASE = "INTERNAL_ELIGIBLE" as const;

export type ArgCp014QuestionStudioInput = ArgCp013QuestionStudioInput;

type QuestionRecord = Readonly<Record<string, any>>;
type MutableQuestion = Record<string, any>;

export const ARG_CP014_MANUAL_APPROVAL = Object.freeze({
  chapterId: "ARG-001" as const,
  checkpointId: ARG_CP014_CHECKPOINT_ID,
  status: "MANUAL_EDITORIAL_APPROVAL_RECORDED" as const,
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF_IN_PROJECT_CHAT" as const,
  approvalStatement: "Approved" as const,
  approvedAtUtc: "2026-09-04T03:07:00Z" as const,
  approvedAtIst: "2026-09-04T08:37:00+05:30" as const,
  approvedReviewedCheckpointId: ARG_CP013_CHECKPOINT_ID,
  approvedFinalEditorialAuthority: ARG_CP013_AUTHORITY,
  approvedQuestionStudioAuthority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  approvedCertifiedRuntimeHead: "ac8850c42dd9ff0b23f5048dffda621dcc5455ce" as const,
  approvedCertificationWorkflowRunId: 33772042174 as const,
  approvedReviewPacketWorkflowRunId: 33772065384 as const,
  approvedReviewPacketPath: "docs/review/ARG-001-CP013-RUNTIME-REVIEW-SAMPLES.md" as const,
  approvedReviewPacketBlobSha: "f3259f9a727844118d63c13bbb3b1d2d1d212e03" as const,
  contentMutationAllowed: false as const,
  internalQuestionBankEligibilityAuthorized: true as const,
  internalTestEligibilityAuthorized: true as const,
  internalMockEligibilityAuthorized: true as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  automaticStudentPublication: false as const,
});

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function approveQuestion(rawQuestion: QuestionRecord): QuestionRecord {
  const question: MutableQuestion = { ...rawQuestion };

  // CP014 is lifecycle-only. The approved CP013 learner-facing content, answer,
  // explanation, content fingerprint and question ID must remain byte-identical.
  question.checkpointId = ARG_CP014_CHECKPOINT_ID;
  question.releaseCheckpointId = ARG_CP014_CHECKPOINT_ID;
  question.sourceFinalEditorialCheckpointId = ARG_CP013_CHECKPOINT_ID;
  question.finalEditorialSurfaceAuthority = ARG_CP013_AUTHORITY;
  question.currentQuestionStudioAuthority = ARG_CP014_QUESTION_STUDIO_AUTHORITY;
  question.supersedesQuestionStudioAuthority = ARG_CP013_QUESTION_STUDIO_AUTHORITY;
  question.runtimeMode = ARG_CP014_RUNTIME_MODE;
  question.reviewStatus = ARG_CP014_REVIEW_STATUS;
  question.lifecycleStatus = "EDITORIALLY_APPROVED_INTERNAL";
  question.manualApprovalRequired = false;
  question.manualEditorialApproval = "APPROVED";
  question.approvalAuthority = ARG_CP014_AUTHORITY;
  question.approvalEvidence = ARG_CP014_MANUAL_APPROVAL;
  question.persistenceAllowed = true;
  question.questionBankStatus = "WRITABLE";
  question.questionBankWritable = true;
  question.testEligibility = "ELIGIBLE";
  question.testEligible = true;
  question.mockTestEligible = true;
  question.publiclyPublishable = false;
  question.publicReleaseAuthorized = false;
  question.studentDeliveryAuthorized = false;
  question.automaticStudentPublication = false;
  question.learnerRelease = ARG_CP014_LEARNER_RELEASE;
  return Object.freeze(question);
}

export function isArgCp014CurrentRequest(input: Readonly<Record<string, unknown>>): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP014_CHECKPOINT_ID || isArgCp013CurrentReviewRequest(input);
}

export function isArgCp014RealPaperRequest(input: ArgCp014QuestionStudioInput): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP014_CHECKPOINT_ID || isArgCp013RealPaperRequest(input);
}

export function generateArgCp014QuestionStudioBatch(input: ArgCp014QuestionStudioInput) {
  const cpId = text(input.cpId).toUpperCase();
  const sourceInput: ArgCp013QuestionStudioInput = cpId === ARG_CP014_CHECKPOINT_ID
    ? { ...input, cpId: ARG_CP013_CHECKPOINT_ID }
    : input;
  const source = generateArgCp013QuestionStudioBatch(sourceInput);
  const questions = Object.freeze(source.questions.map((question) => approveQuestion(question as unknown as QuestionRecord)));

  return Object.freeze({
    ...source,
    checkpointId: ARG_CP014_CHECKPOINT_ID,
    authority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
    questions,
    generationContext: Object.freeze({
      ...source.generationContext,
      checkpointId: ARG_CP014_CHECKPOINT_ID,
      releaseCheckpointId: ARG_CP014_CHECKPOINT_ID,
      authority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
      runtimeMode: ARG_CP014_RUNTIME_MODE,
      reviewStatus: ARG_CP014_REVIEW_STATUS,
      sourceQuestionStudioAuthority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
      sourceFinalEditorialCheckpointId: ARG_CP013_CHECKPOINT_ID,
      finalEditorialSurfaceAuthority: ARG_CP013_AUTHORITY,
      approvalAuthority: ARG_CP014_AUTHORITY,
      approvalEvidence: ARG_CP014_MANUAL_APPROVAL,
      reviewOnly: false as const,
      manualApprovalRequired: false as const,
      persistenceAllowed: true as const,
      questionBankStatus: "WRITABLE" as const,
      questionBankWritable: true as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: ARG_CP014_LEARNER_RELEASE,
    }),
  });
}

export const ARG_CP014_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...ARG_CP013_QUESTION_STUDIO_PACKAGE,
  cpIds: Object.freeze([...ARG_CP013_QUESTION_STUDIO_PACKAGE.cpIds, ARG_CP014_CHECKPOINT_ID] as const),
  currentRealPaperCheckpointId: ARG_CP014_CHECKPOINT_ID,
  sourceFinalEditorialCheckpointId: ARG_CP013_CHECKPOINT_ID,
  currentReleaseCheckpointId: ARG_CP014_CHECKPOINT_ID,
  currentQuestionStudioAuthority: ARG_CP014_QUESTION_STUDIO_AUTHORITY,
  finalEditorialSurfaceAuthority: ARG_CP013_AUTHORITY,
  sourceQuestionStudioAuthority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  approvalAuthority: ARG_CP014_AUTHORITY,
  approvalEvidence: ARG_CP014_MANUAL_APPROVAL,
  runtimeMode: ARG_CP014_RUNTIME_MODE,
  reviewStatus: ARG_CP014_REVIEW_STATUS,
  reviewOnly: false as const,
  manualApprovalRequired: false as const,
  persistenceAllowed: true as const,
  questionBankStatus: "WRITABLE" as const,
  questionBankWritable: true as const,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true as const,
  mockTestEligible: true as const,
  publiclyPublishable: false as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: ARG_CP014_LEARNER_RELEASE,
});
