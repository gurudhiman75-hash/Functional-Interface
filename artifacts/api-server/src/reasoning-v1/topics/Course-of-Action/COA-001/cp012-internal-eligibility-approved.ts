import type {
  QuestionStudioGenerationRequest,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import {
  COA_CP011_CHECKPOINT_ID,
  COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  COA_CP011_QUESTION_STUDIO_PACKAGE,
  generateCoaCp011QuestionStudioBatch,
  getCoaCp011SafeSemanticCapacity,
  isCoaCp011QuestionStudioRequest,
} from "./cp011-final-editorial-diversity.ts";

export const COA_CP012_APPROVED_CHECKPOINT_ID = "COA-CP-012" as const;
export const COA_CP012_APPROVAL_AUTHORITY =
  "COA_CP012_PRODUCT_OWNER_INTERNAL_ELIGIBILITY_APPROVAL_V1" as const;
export const COA_CP012_QUESTION_STUDIO_AUTHORITY =
  "COA_CP012_QUESTION_STUDIO_INTERNAL_ELIGIBILITY_V1" as const;
export const COA_CP012_RUNTIME_MODE =
  "APPROVED_CP011_SURFACE_INTERNAL_ELIGIBILITY" as const;
export const COA_CP012_REVIEW_STATUS =
  "QUESTION_STUDIO_CP012_INTERNALLY_ELIGIBLE" as const;
export const COA_CP012_LEARNER_RELEASE = "INTERNAL_ELIGIBLE" as const;

export const COA_CP012_PRODUCT_OWNER_APPROVAL = Object.freeze({
  chapterId: "COA-001" as const,
  checkpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
  status: "PRODUCT_OWNER_APPROVAL_RECORDED" as const,
  approvalAuthority: "EXPLICIT_USER_APPROVAL_IN_PROJECT_CHAT" as const,
  approvalStatement: "Approved" as const,
  approvedAtUtc: "2026-09-19T01:15:00Z" as const,
  approvedAtIst: "2026-09-19T06:45:00+05:30" as const,
  approvedSourceCheckpointId: COA_CP011_CHECKPOINT_ID,
  approvedSourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  contentMutationAllowed: false as const,
  internalQuestionBankEligibilityAuthorized: true as const,
  internalTestEligibilityAuthorized: true as const,
  internalMockEligibilityAuthorized: true as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  automaticStudentPublication: false as const,
});

type ApprovedInput = QuestionStudioGenerationRequest & Readonly<{
  cpId?: string;
  presentationProfile?: string;
}>;

type QuestionRecord = Readonly<Record<string, any>>;

const LEARNER_CONTENT_FIELDS = Object.freeze([
  "questionId",
  "contentFingerprint",
  "semanticAuthorityId",
  "qlId",
  "patternId",
  "presentationProfile",
  "language",
  "locale",
  "statement",
  "instruction",
  "courses",
  "text",
  "stem",
  "options",
  "correct",
  "correctIndex",
  "answer",
  "canonicalAnswer",
  "answerClass",
  "answerMask",
  "pairRelation",
  "explanation",
  "difficulty",
  "difficultyLabel",
  "semanticDifficulty",
  "domain",
] as const);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cp011SourceInput(input: ApprovedInput): ApprovedInput {
  return text(input.cpId).toUpperCase() === COA_CP012_APPROVED_CHECKPOINT_ID
    ? { ...input, cpId: COA_CP011_CHECKPOINT_ID }
    : input;
}

function approveQuestion(source: QuestionRecord): QuestionRecord {
  return Object.freeze({
    ...source,
    checkpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
    releaseCheckpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
    sourceFrozenCheckpointId: COA_CP011_CHECKPOINT_ID,
    sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    currentQuestionStudioAuthority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
    supersedesQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    approvalAuthority: COA_CP012_APPROVAL_AUTHORITY,
    approvalEvidence: COA_CP012_PRODUCT_OWNER_APPROVAL,
    runtimeMode: COA_CP012_RUNTIME_MODE,
    reviewStatus: COA_CP012_REVIEW_STATUS,
    lifecycleStatus: "INTERNALLY_ELIGIBLE" as const,
    reviewOnly: false as const,
    manualApprovalRequired: false as const,
    manualEditorialApproval: "APPROVED" as const,
    persistenceAllowed: true as const,
    canonicalQuestionPersistenceAllowed: true as const,
    questionBankStatus: "WRITABLE" as const,
    questionBankWritable: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    mockTestEligible: true as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
    productionReleased: false as const,
    learnerRelease: COA_CP012_LEARNER_RELEASE,
  });
}

export function isCoaCp012ApprovedQuestionStudioRequest(
  input: Readonly<Record<string, unknown>>,
): boolean {
  return (
    text(input.cpId).toUpperCase() === COA_CP012_APPROVED_CHECKPOINT_ID
    || isCoaCp011QuestionStudioRequest(input)
  );
}

export async function generateCoaCp012ApprovedQuestionStudioBatch(input: ApprovedInput) {
  const source = await generateCoaCp011QuestionStudioBatch(cp011SourceInput(input));
  const questions = source.questions.map((question) => approveQuestion(question as QuestionRecord));

  return {
    ...source,
    checkpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
    authority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
    questions,
    generationContext: {
      ...source.generationContext,
      checkpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
      releaseCheckpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
      sourceFrozenCheckpointId: COA_CP011_CHECKPOINT_ID,
      sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      authority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
      approvalAuthority: COA_CP012_APPROVAL_AUTHORITY,
      approvalEvidence: COA_CP012_PRODUCT_OWNER_APPROVAL,
      runtimeMode: COA_CP012_RUNTIME_MODE,
      reviewStatus: COA_CP012_REVIEW_STATUS,
      lifecycleStatus: "INTERNALLY_ELIGIBLE" as const,
      reviewOnly: false as const,
      manualApprovalRequired: false as const,
      persistenceAllowed: true as const,
      canonicalQuestionPersistenceAllowed: true as const,
      questionBankStatus: "WRITABLE" as const,
      questionBankWritable: true as const,
      testEligibility: "ELIGIBLE" as const,
      testEligible: true as const,
      mockTestEligible: true as const,
      publiclyPublishable: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
      learnerRelease: COA_CP012_LEARNER_RELEASE,
    },
  };
}

export function assertCoaCp012ApprovedContentIdentity(
  source: QuestionRecord,
  approved: QuestionRecord,
): void {
  for (const field of LEARNER_CONTENT_FIELDS) {
    if (JSON.stringify(approved[field]) !== JSON.stringify(source[field])) {
      throw new Error(`CP012 approval changed frozen CP011 learner content field ${field}`);
    }
  }
}

export function getCoaCp012ApprovedSafeSemanticCapacity(input: ApprovedInput): number {
  return getCoaCp011SafeSemanticCapacity(cp011SourceInput(input));
}

export const COA_CP012_APPROVED_QUESTION_STUDIO_PACKAGE = {
  ...COA_CP011_QUESTION_STUDIO_PACKAGE,
  cpIds: [...COA_CP011_QUESTION_STUDIO_PACKAGE.cpIds, COA_CP012_APPROVED_CHECKPOINT_ID],
  currentQuestionStudioAuthority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
  sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  currentReleaseCheckpointId: COA_CP012_APPROVED_CHECKPOINT_ID,
  approvalAuthority: COA_CP012_APPROVAL_AUTHORITY,
  approvalEvidence: COA_CP012_PRODUCT_OWNER_APPROVAL,
  runtimeMode: COA_CP012_RUNTIME_MODE,
  reviewStatus: COA_CP012_REVIEW_STATUS,
  reviewOnly: false,
  manualApprovalRequired: false,
  persistenceAllowed: true,
  questionBankStatus: "WRITABLE",
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY",
  questionBankAcceptanceAuthority: COA_CP012_APPROVAL_AUTHORITY,
  testEligibility: "ELIGIBLE",
  testEligible: true,
  mockTestEligible: true,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    ...(COA_CP011_QUESTION_STUDIO_PACKAGE.metadata ?? {}),
    currentQuestionStudioAuthority: COA_CP012_QUESTION_STUDIO_AUTHORITY,
    sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    approvalAuthority: COA_CP012_APPROVAL_AUTHORITY,
    internalEligibilityStatus: "APPROVED",
    internalQuestionBankEligibility: true,
    internalTestEligibility: true,
    internalMockEligibility: true,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
    contentMutationAllowed: false,
  },
} satisfies QuestionStudioPackageDefinition & Readonly<Record<string, unknown>>;
