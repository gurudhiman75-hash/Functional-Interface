import { PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2 } from "./paper-folding-english-freeze-v2";
import { PFC_TPF_LOCALIZATION_AUTHORITY_V2 } from "./paper-folding-localization-v2";
import { PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2 } from "./paper-folding-localization-product-owner-approval-v2";

export const PFC_TPF_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 = Object.freeze({
  authorityId: "PFC-TPF-HI-PA-LOCALIZATION-FREEZE-V2" as const,
  supersedesLegacyFreezeAuthority: "PFC_001_HI_PA_LOCALIZATION_APPROVED_V1" as const,
  localizationAuthorityId: PFC_TPF_LOCALIZATION_AUTHORITY_V2.authorityId,
  localizationEditorialRevision: "V2.1" as const,
  englishFreezeAuthorityId: PFC_TPF_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  productOwnerApprovalAuthorityId: PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2.authorityId,
  status: "PFC_TPF_HINDI_PUNJABI_V2_1_FROZEN" as const,
  exactReviewedLocalization: {
    headSha: PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2.approvedExactHeadSha,
    workflowName: "Validate SPA PFC TPF Hindi Punjabi Localization V2" as const,
    workflowRunId: PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2.approvedWorkflowRunId,
    artifactId: PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2.approvedArtifactId,
    artifactDigest: PFC_TPF_LOCALIZATION_PRODUCT_OWNER_APPROVAL_V2.approvedArtifactDigest,
    reviewFile: "spa-pfc-tpf-localization-review-v2.html" as const,
  },
  frozenCorpus: {
    permanentQlRange: "SPA-QL-035..SPA-QL-040" as const,
    permanentQlCount: 6,
    englishQuestions: 84,
    hindiQuestions: 84,
    punjabiQuestions: 84,
    localizedQuestions: 168,
    supportedLanguages: ["en", "hi", "pa"] as const,
  },
  invariants: {
    geometry: true,
    optionOrder: true,
    answer: true,
    permanentIds: true,
    canonicalIds: true,
    qlIds: true,
    provenance: true,
    representation: true,
    canonicalContentFingerprint: true,
  },
  learnerReview: {
    hindiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    punjabiWording: "APPROVED_SIMPLE_STUDENT_FIRST" as const,
    caseAgreement: "REMEDIATED" as const,
    learnerFacingEnglishJargon: "REMOVED" as const,
    explanationDiversity: "QUESTION_AWARE" as const,
  },
  governance: {
    localizationFrozen: true,
    seededQuestionStudioIntegrationAuthorized: true,
    questionStudioProductionReleaseAuthorized: false,
    questionBankWritesAuthorized: false,
    publicTestEligibilityAuthorized: false,
    automaticPublicationAuthorized: false,
    mergeAuthorized: false,
    deploymentAuthorized: false,
  },
  nextGate: "PFC_TPF_SEEDED_QUESTION_STUDIO_INTEGRATION_V1" as const,
} as const);
