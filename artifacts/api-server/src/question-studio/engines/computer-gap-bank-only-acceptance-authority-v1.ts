import {
  COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1,
} from "../../knowledge-v1/computer-awareness/com001-hardware-gap-extension-v1";
import {
  COM005_GAP_EXTENSION_AUTHORITY_V1,
} from "../../knowledge-v1/computer-awareness/com005-networking-gap-extension-v1";
import {
  COM007_GAP_EXTENSION_AUTHORITY_V1,
} from "../../knowledge-v1/computer-awareness/com007-software-languages-database-gap-extension-v1";
import { QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

const lifecycle = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;

export const COMPUTER_GAP_BANK_ONLY_ACTIVATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "COMPUTER-GAP-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
  status: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  activationReason: "USER_APPROVED_COMPUTER_GAP_REVIEW_AFTER_PR_1503" as const,
  activationScope: "QUESTION_STUDIO_REVIEW_PERSISTENCE_AND_MANUAL_QUESTION_BANK_ACCEPTANCE_ONLY" as const,
  approval: Object.freeze({
    explicitApprovalVerified: true as const,
    approvalSource: "PRODUCT_OWNER_CHAT_EXPLICIT_APPROVAL" as const,
    approvedOn: "2026-09-09" as const,
    scope: "COM001_CP007_COM005_CP002_COM007_CP002_REVIEWED_ENGLISH_HINDI_PUNJABI_CORPUS" as const,
  }),
  sourceAuthorities: Object.freeze({
    com001GapExtensionAuthorityId: COM001_HARDWARE_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    com005GapExtensionAuthorityId: COM005_GAP_EXTENSION_AUTHORITY_V1.authorityId,
    com007GapExtensionAuthorityId: COM007_GAP_EXTENSION_AUTHORITY_V1.authorityId,
  }),
  corpus: Object.freeze({
    cpIds: Object.freeze(["COM-001-CP-007", "COM-005-CP-002", "COM-007-CP-002"] as const),
    permanentQlCount: 13 as const,
    supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
    englishQuestionCount: 56 as const,
    hindiQuestionCount: 56 as const,
    punjabiQuestionCount: 56 as const,
    frozenQuestionLanguageArtifactCount: 168 as const,
    immutable: true as const,
    revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
  }),
  authorization: Object.freeze({
    standardLifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: "COMPUTER-GAP-QUESTION-STUDIO-BANK-ONLY-ACTIVATION-V1" as const,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    supportedDifficulties: Object.freeze(["Easy", "Medium"] as const),
    hardDifficultyAuthorized: false as const,
    productionDifficultyClaimAuthorized: false as const,
  }),
  locks: Object.freeze({
    contentMutationAuthorized: false as const,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    testBuilderEligible: false as const,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  }),
  nextGate: "INDIVIDUAL_QUESTION_BANK_ACCEPTANCE_RECORDS" as const,
  replacementRule:
    "Test-builder eligibility, mock-test eligibility, public publication, production release, Hard-difficulty claims, or frozen-corpus mutation require a separate audited authority." as const,
});

export type ComputerGapBankOnlyActivationAuthorityV1 =
  typeof COMPUTER_GAP_BANK_ONLY_ACTIVATION_AUTHORITY_V1;
