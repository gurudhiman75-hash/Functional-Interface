import {
  isSea002Cp008QuestionStudioRequest,
  type Sea002Cp008QuestionStudioRequest,
} from "./question-studio-preintegration-v1.ts";
import {
  generateSea002Cp008QuestionStudioPreviewV2,
  type Sea002Cp008QuestionStudioDifficultyV2,
  type Sea002Cp008QuestionStudioLanguageV2,
} from "./question-studio-preintegration-v2.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
} from "./permanent/registry.ts";
import {
  SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1,
  SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1,
} from "./review/approved-freeze-v1.ts";
import { SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2 } from "./review/certified-evidence-v2.ts";

export const SEA002_CP008_QUESTION_STUDIO_RELEASE_V1 = "SEA-002-CP008-QS-APPROVED-FROZEN-V1" as const;
export const SEA002_CP008_QUESTION_STUDIO_LANGUAGES_V1 = Object.freeze(["en", "hi", "pa"] as const);
export const SEA002_CP008_QUESTION_STUDIO_DIFFICULTIES_V1 = Object.freeze(["Easy", "Medium", "Hard"] as const);

export const SEA002_CP008_QUESTION_STUDIO_INTEGRATION_V1 = Object.freeze({
  adapterId: "SEA-002-CP008-QUESTION-STUDIO-INTEGRATION-V1" as const,
  phase: "question-studio-integration" as const,
  sourceAuthority: SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1,
  sourceAuthorityStatus: "FROZEN" as const,
  runtimeProfile: "SEA-002-CP008-SQUARE-SEATING-V1" as const,
  domain: "Reasoning" as const,
  topic: "Seating Arrangement" as const,
  subtopic: "Square Seating" as const,
  questionFamily: "SEA-002-CP008" as const,
  qlIds: SEA002_CP008_PERMANENT_QL_IDS,
  sourceCheckpoint: "SEA-CP-008" as const,
  languages: SEA002_CP008_QUESTION_STUDIO_LANGUAGES_V1,
  difficulties: SEA002_CP008_QUESTION_STUDIO_DIFFICULTIES_V1,
  enabledForQuestionStudio: true as const,
  questionStudioActive: true as const,
  questionStudioRegistered: true as const,
  canonicalSourceRegistryRemainsInactive: true as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  productionStaging: false as const,
  publiclyPublishable: false as const,
  automaticStudentDelivery: false as const,
});

function assertSea002Cp008QuestionStudioActivationV1(): void {
  const frozen = SEA002_CP008_APPROVED_FROZEN_AUTHORITY_V1;
  if (frozen.productOwnerApprovalStatus !== "APPROVED"
    || frozen.freezeStatus !== "FROZEN"
    || !frozen.questionStudioActivationEligible) {
    throw new Error("SEA-CP-008 Question Studio activation requires the approved frozen authority.");
  }
  if (SEA002_CP008_PERMANENT_QL_REGISTRY.some((entry) =>
    entry.active
    || entry.questionStudioDiscoverable
    || entry.questionBankWritable
    || entry.testEligible
    || entry.mockTestEligible
    || entry.productionStaging
    || entry.publiclyPublishable
    || entry.automaticStudentPublication)) {
    throw new Error("SEA-CP-008 source registry drifted active; Question Studio must use the adapter-only activation boundary.");
  }
}

export function generateSea002Cp008QuestionStudioQuestionsV1(request: Sea002Cp008QuestionStudioRequest) {
  assertSea002Cp008QuestionStudioActivationV1();
  if (!isSea002Cp008QuestionStudioRequest(request)) {
    throw new Error("Request does not explicitly target approved SEA-CP-008 Question Studio routing.");
  }
  const approved = generateSea002Cp008QuestionStudioPreviewV2(request);
  return Object.freeze(approved.map((question) => Object.freeze({
    ...question,
    debugSource: "reasoning-v1-sea-002-cp008-question-studio-v1" as const,
    packageSource: "reasoning-v1-sea-002-cp008-question-studio-v1" as const,
    runtimeMode: "QUESTION_STUDIO_ACTIVE_APPROVED_FROZEN" as const,
    reviewStatus: "APPROVED_FROZEN_V1" as const,
    questionStudioDiscoverable: true as const,
    sourceQuestionStudioRegistered: false as const,
    questionStudioRegistered: true as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    productionStaging: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    traceability: Object.freeze({
      releaseId: SEA002_CP008_QUESTION_STUDIO_RELEASE_V1,
      productOwnerApprovalStatus: "APPROVED" as const,
      approvedAt: SEA002_CP008_EXPLICIT_PRODUCT_APPROVAL_V1.approvedAt,
      freezeStatus: "FROZEN" as const,
      certifiedReviewHeadSha: SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.certifiedReviewHeadSha,
      certifiedReviewArtifactId: SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactId,
      certifiedReviewArtifactDigest: SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.artifactDigest,
      englishReviewFingerprint: SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.englishReviewFingerprint,
      localizationReviewFingerprint: SEA002_CP008_CERTIFIED_REVIEW_EVIDENCE_V2.localizationReviewFingerprint,
    }),
  })));
}

export function generateSea002Cp008QuestionStudioQuestionV1(
  request: Omit<Sea002Cp008QuestionStudioRequest, "count">,
) {
  return generateSea002Cp008QuestionStudioQuestionsV1({ ...request, count: 1 })[0]!;
}

export type Sea002Cp008QuestionStudioLanguageV1 = Sea002Cp008QuestionStudioLanguageV2;
export type Sea002Cp008QuestionStudioDifficultyV1 = Sea002Cp008QuestionStudioDifficultyV2;
export { isSea002Cp008QuestionStudioRequest };
