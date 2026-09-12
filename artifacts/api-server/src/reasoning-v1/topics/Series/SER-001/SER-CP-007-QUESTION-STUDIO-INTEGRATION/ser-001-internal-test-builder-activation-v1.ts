import {
  SER_001_QUESTION_STUDIO_LANGUAGES,
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review-adapter";
import { SER_CP007_PERMANENT_QL_IDS } from "../SER-PERMANENT-QL-REGISTRY";

const REVIEW = SER_001_QUESTION_STUDIO_REVIEW_PACKAGE;

if (!REVIEW.reviewOnly || REVIEW.questionBankWritable || REVIEW.testEligible || REVIEW.publiclyPublishable) {
  throw new Error("SER-001 internal activation requires the frozen review-only authority as its source boundary.");
}
if (REVIEW.frozenTemplateCount !== 140 || REVIEW.multilingualProofPayloadCount !== 420) {
  throw new Error("SER-001 internal activation requires the complete frozen 140-template / 420-payload corpus.");
}
if (SER_CP007_PERMANENT_QL_IDS.length !== 13) {
  throw new Error("SER-001 internal activation requires all 13 permanent QLs.");
}

export const SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "SER-001-INTERNAL-TEST-BUILDER-ACTIVATION-V1" as const,
  chapterCode: "SER-001" as const,
  canonicalProblemId: "SER-CP-007" as const,
  sourceReviewAuthorityId: REVIEW.integrationAuthority,
  permanentQlIds: Object.freeze([...SER_CP007_PERMANENT_QL_IDS]),
  supportedLanguages: Object.freeze([...SER_001_QUESTION_STUDIO_LANGUAGES]),
  frozenTemplateCount: 140 as const,
  multilingualFrozenPayloadCount: 420 as const,
  status: "ACTIVE_INTERNAL_TEST_BUILDER" as const,
  activationScope: "QUESTION_STUDIO_QUESTION_BANK_AND_INTERNAL_TEST_BUILDER" as const,
  questionStudioDiscoverable: true,
  questionStudioGenerationEnabled: true,
  persistenceAllowed: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true,
  questionBankAcceptanceMode: "FULL_RELEASE" as const,
  manualApprovalRequired: true,
  manualQuestionPublicationRequired: true,
  testEligibility: "ELIGIBLE" as const,
  testEligible: true,
  testBuilderEligible: true,
  questionPublicationTarget: "INTERNAL_TEST_BUILDER" as const,
  mockTestEligible: false,
  publiclyPublishable: true,
  publicReleaseAuthorized: false,
  studentDeliveryAuthorized: false,
  automaticStudentPublication: false,
  contentMutationAuthorized: false,
  nextGate: "SER_001_INTERNAL_MOCK_TEST_ELIGIBILITY_ACTIVATION" as const,
});
