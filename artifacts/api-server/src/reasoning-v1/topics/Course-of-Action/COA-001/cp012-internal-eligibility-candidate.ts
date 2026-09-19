import type { QuestionStudioGenerationRequest, QuestionStudioPackageDefinition } from "../../../../question-studio/engine-types.ts";
import {
  COA_CP011_CHECKPOINT_ID,
  COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  COA_CP011_QUESTION_STUDIO_PACKAGE,
  generateCoaCp011QuestionStudioBatch,
  getCoaCp011SafeSemanticCapacity,
} from "./cp011-final-editorial-diversity.ts";

export const COA_CP012_CHECKPOINT_ID = "COA-CP-012" as const;
export const COA_CP012_ELIGIBILITY_AUTHORITY =
  "COA_CP012_INTERNAL_ELIGIBILITY_CANDIDATE_V1" as const;
export const COA_CP012_STATUS =
  "TECHNICALLY_QUALIFIED_AWAITING_PRODUCT_OWNER_APPROVAL" as const;

export const COA_CP012_ELIGIBILITY_EVALUATION = Object.freeze({
  chapterId: "COA-001" as const,
  checkpointId: COA_CP012_CHECKPOINT_ID,
  sourceFrozenCheckpointId: COA_CP011_CHECKPOINT_ID,
  sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  status: COA_CP012_STATUS,
  contentMutationAllowed: false as const,
  technicalQualificationPassed: true as const,
  recommendedInternalQuestionBankEligibility: true as const,
  recommendedInternalTestEligibility: true as const,
  recommendedInternalMockEligibility: true as const,
  currentInternalQuestionBankEligibilityAuthorized: false as const,
  currentInternalTestEligibilityAuthorized: false as const,
  currentInternalMockEligibilityAuthorized: false as const,
  publicReleaseAuthorized: false as const,
  studentDeliveryAuthorized: false as const,
  automaticStudentPublication: false as const,
  approvalRequiredFrom: "PRODUCT_OWNER" as const,
  approvalStatementRequired: "Approved" as const,
});

type QuestionRecord = Readonly<Record<string, any>>;
type CandidateInput = QuestionStudioGenerationRequest & Readonly<{
  cpId?: string;
  presentationProfile?: string;
}>;

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

function cp011SourceInput(input: CandidateInput): CandidateInput {
  return text(input.cpId).toUpperCase() === COA_CP012_CHECKPOINT_ID
    ? { ...input, cpId: COA_CP011_CHECKPOINT_ID }
    : input;
}

function candidateQuestion(source: QuestionRecord): QuestionRecord {
  return Object.freeze({
    ...source,
    checkpointId: COA_CP012_CHECKPOINT_ID,
    eligibilityEvaluationCheckpointId: COA_CP012_CHECKPOINT_ID,
    sourceFrozenCheckpointId: COA_CP011_CHECKPOINT_ID,
    sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
    eligibilityEvaluationAuthority: COA_CP012_ELIGIBILITY_AUTHORITY,
    eligibilityEvaluationStatus: COA_CP012_STATUS,
    eligibilityEvidence: COA_CP012_ELIGIBILITY_EVALUATION,

    // CP012 evaluation is intentionally non-activating until explicit approval.
    reviewOnly: true as const,
    manualApprovalRequired: true as const,
    persistenceAllowed: false as const,
    canonicalQuestionPersistenceAllowed: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE_PENDING_CP012_APPROVAL" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED_PENDING_CP012_APPROVAL" as const,
  });
}

export function isCoaCp012EligibilityCandidateRequest(
  input: Readonly<Record<string, unknown>>,
): boolean {
  return text(input.cpId).toUpperCase() === COA_CP012_CHECKPOINT_ID;
}

export async function generateCoaCp012EligibilityCandidateBatch(input: CandidateInput) {
  const sourceInput = cp011SourceInput(input);
  const source = await generateCoaCp011QuestionStudioBatch(sourceInput);
  const questions = source.questions.map((question) => candidateQuestion(question as QuestionRecord));

  return {
    ...source,
    checkpointId: COA_CP012_CHECKPOINT_ID,
    authority: COA_CP012_ELIGIBILITY_AUTHORITY,
    questions,
    generationContext: {
      ...source.generationContext,
      checkpointId: COA_CP012_CHECKPOINT_ID,
      eligibilityEvaluationCheckpointId: COA_CP012_CHECKPOINT_ID,
      sourceFrozenCheckpointId: COA_CP011_CHECKPOINT_ID,
      sourceQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
      eligibilityEvaluationAuthority: COA_CP012_ELIGIBILITY_AUTHORITY,
      eligibilityEvaluationStatus: COA_CP012_STATUS,
      eligibilityEvidence: COA_CP012_ELIGIBILITY_EVALUATION,

      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      canonicalQuestionPersistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE_PENDING_CP012_APPROVAL" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED_PENDING_CP012_APPROVAL" as const,
    },
  };
}

export function assertCoaCp012LearnerContentIdentity(
  source: QuestionRecord,
  candidate: QuestionRecord,
): void {
  for (const field of LEARNER_CONTENT_FIELDS) {
    if (JSON.stringify(candidate[field]) !== JSON.stringify(source[field])) {
      throw new Error(`CP012 eligibility candidate changed frozen learner content field ${field}`);
    }
  }
}

export function getCoaCp012CandidateSafeSemanticCapacity(input: CandidateInput): number {
  return getCoaCp011SafeSemanticCapacity(cp011SourceInput(input));
}

export const COA_CP012_ELIGIBILITY_CANDIDATE_PACKAGE = {
  ...COA_CP011_QUESTION_STUDIO_PACKAGE,
  cpIds: [...COA_CP011_QUESTION_STUDIO_PACKAGE.cpIds, COA_CP012_CHECKPOINT_ID],
  metadata: {
    ...(COA_CP011_QUESTION_STUDIO_PACKAGE.metadata ?? {}),
    eligibilityEvaluationCheckpointId: COA_CP012_CHECKPOINT_ID,
    eligibilityEvaluationAuthority: COA_CP012_ELIGIBILITY_AUTHORITY,
    eligibilityEvaluationStatus: COA_CP012_STATUS,
    technicalQualificationPassed: true,
    eligibilityPromotionActivated: false,
  },

  // Keep live lifecycle closed until explicit CP012 product-owner approval.
  currentQuestionStudioAuthority: COA_CP011_EDITORIAL_DIVERSITY_AUTHORITY,
  reviewOnly: true,
  manualApprovalRequired: true,
  persistenceAllowed: false,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
} satisfies QuestionStudioPackageDefinition & Readonly<Record<string, unknown>>;
