import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "../../knowledge-v1/computer-awareness/com002-english-freeze-v5";
import { COM002_LOCALIZATION_VERSION_V4 } from "../../knowledge-v1/computer-awareness/com002-localization-v4";
import { COM002_ENGLISH_GENERATOR_VERSION_V5 } from "../../knowledge-v1/computer-awareness/com002-review-synthesis-v5";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2 } from "./com002-question-studio-activation-gate-v2";

/**
 * Current fail-closed activation authority for COM-002.
 * English V5 is approved, canonically executed and operationally frozen.
 * The V5-bound Hindi/Punjabi V4 candidate is defined but still requires
 * canonical execution, bilingual human acceptance, fingerprints, freeze and
 * review-only adapter audit before Question Studio can become discoverable.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V3 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V3" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  supersedes: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2.authorityId,
  status: "BLOCKED_PENDING_V5_FREEZE_REVALIDATION_AND_V5_BOUND_LOCALIZATION_V4_FREEZE" as const,
  candidateChain: Object.freeze({
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
    englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
    englishV5ExplicitApprovalVerified: true,
    englishV5CanonicalExecutionGreen: true,
    englishV5FingerprintsPinned: true,
    operationalEnglishV5FreezeExists: true,
    operationalEnglishV5FreezePostAuthorityCanonicalRevalidated: false,
    localizationVersion: COM002_LOCALIZATION_VERSION_V4,
    localizationV4Defined: true,
    localizationV4ExecutedGreen: false,
    localizationV4HumanReviewAccepted: false,
    localizationV4FingerprintsPinned: false,
    localizationV4FreezeExists: false,
    v5V4ReviewOnlyAdapterAudited: false,
  }),
  englishExecutionEvidence: Object.freeze({
    workflowRunNumber: COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowRunNumber,
    workflowRunId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowRunId,
    workflowJobId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.workflowJobId,
    englishCorpusQuestions: COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.englishCorpusQuestions,
    exactApprovedReviewQuestions: COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.exactApprovedReviewQuestions,
    englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
    exactApprovedBrowserPackFingerprint:
      COM002_ENGLISH_FREEZE_AUTHORITY_V5.humanReview.exactApprovedBrowserPackFingerprint,
  }),
  activation: Object.freeze({
    questionStudioDiscoverable: false,
    questionStudioRegistrationAllowed: false,
    reviewOnlySwitchAllowed: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  unlockRequirements: [
    "COM002_OPERATIONAL_ENGLISH_V5_FREEZE_POST_AUTHORITY_CANONICAL_REVALIDATION",
    "COM002_LOCALIZATION_V4_1040_PARITY_AND_26_BILINGUAL_SAMPLER_EXECUTED_GREEN",
    "COM002_LOCALIZATION_V4_26_QUESTION_BILINGUAL_REVIEW_ACCEPTED",
    "COM002_LOCALIZATION_V4_FINGERPRINTS_PINNED",
    "COM002_LOCALIZATION_V4_FREEZE_AUTHORITY_CREATED",
    "COM002_V5_V4_REVIEW_ONLY_ADAPTER_AUDITED",
  ] as const,
  alreadySatisfiedEvidence: [
    "COM002_EXACT_SIMPLIFIED_ENGLISH_V5_REVIEW_PACK_EXPLICITLY_APPROVED_BY_PRODUCT_OWNER",
    "COM002_ENGLISH_V5_520_QUESTION_AUDIT_EXECUTED_GREEN_RUN_502",
    "COM002_EXACT_26_QUESTION_ENGLISH_V5_REVIEW_PACK_EXECUTED_GREEN_RUN_502",
    "COM002_ENGLISH_V5_FINGERPRINTS_PINNED",
    "COM002_OPERATIONAL_ENGLISH_V5_FREEZE_AUTHORITY_CREATED",
  ] as const,
  invalidationRule:
    "Any frozen English V5 semantic/provenance drift, any Hindi/Punjabi V4 learner-facing or semantic drift after human acceptance, or any option-order/correct-index/solver/source-authority drift requires a new authority and keeps COM-002 non-discoverable until all current human and machine gates are re-satisfied.",
});
