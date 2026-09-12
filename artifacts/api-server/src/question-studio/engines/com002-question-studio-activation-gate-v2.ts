import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2 } from "../../knowledge-v1/computer-awareness/com002-english-human-review-integrity-v2";
import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3 } from "../../knowledge-v1/computer-awareness/com002-english-human-review-integrity-v3";
import { COM002_ENGLISH_GENERATOR_VERSION_V4 } from "../../knowledge-v1/computer-awareness/com002-review-synthesis-v4";
import { COM002_LOCALIZATION_VERSION_V3 } from "../../knowledge-v1/computer-awareness/com002-localization-v3";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1 } from "./com002-question-studio-activation-gate-v1";

/**
 * Final-candidate fail-closed gate for the English V4 / Localization V3 chain.
 *
 * Canonical run #452 proved the exact V4/V3 machine chain and materialized the
 * 26-question English V4 review pack. Execution is therefore no longer a
 * blocker. Explicit English approval, operational freezes and bilingual human
 * acceptance remain independent gates; no runtime/bank/public activation is
 * permitted until every requirement is satisfied.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V2 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V2" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  supersedes: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V1.authorityId,
  status: "BLOCKED_PENDING_ENGLISH_V4_EXPLICIT_APPROVAL_AND_V4_V3_OPERATIONAL_FREEZES" as const,
  candidateChain: {
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
    localizationVersion: COM002_LOCALIZATION_VERSION_V3,
    englishV4ExecutedGreen: true,
    englishV4ReviewPackMaterialized: true,
    englishV4ExplicitApprovalVerified: false,
    operationalEnglishV4FreezeExists: false,
    localizationV3ExecutedGreen: true,
    localizationV3HumanReviewAccepted: false,
    localizationV3FingerprintsPinned: false,
    localizationV3FreezeExists: false,
  },
  currentExecutionEvidence: {
    integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.authorityId,
    workflowRunId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowRunId,
    workflowJobId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowJobId,
    englishV4CorpusQuestions:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.englishV4CorpusQuestions,
    englishV4SamplerQuestions:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.englishV4SamplerQuestions,
    localizationV3ParityQuestions:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.localizationV3ParityQuestions,
    localizationV3SamplerQuestions:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.localizationV3SamplerQuestions,
    preBankCandidateQuestions:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.preBankCandidateQuestions,
    explicitHumanApprovalVerified: false,
  },
  historicalEvidence: {
    executedEnglishV3IntegrityAuthorityId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.authorityId,
    executedEnglishV3WorkflowRunId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.workflowRunId,
    executedEnglishV3WorkflowJobId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.workflowJobId,
    englishV3ExecutedGreen:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.automatedEvidence.v3ExecutedGreen,
    transferableAsV4Approval: false,
  },
  activation: {
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
  },
  unlockRequirements: [
    "COM002_EXACT_ENGLISH_V4_REVIEW_PACK_EXPLICITLY_APPROVED_BY_PRODUCT_OWNER",
    "COM002_OPERATIONAL_ENGLISH_V4_FREEZE_AUTHORITY_CREATED_AND_PINNED",
    "COM002_LOCALIZATION_V3_26_QUESTION_BILINGUAL_REVIEW_ACCEPTED",
    "COM002_LOCALIZATION_V3_FINGERPRINTS_PINNED",
    "COM002_LOCALIZATION_V3_FREEZE_AUTHORITY_CREATED",
    "COM002_V4_V3_REVIEW_ONLY_ADAPTER_AUDITED",
  ] as const,
  alreadySatisfiedEvidence: [
    "COM002_ENGLISH_V4_520_QUESTION_AUDIT_EXECUTED_GREEN",
    "COM002_EXACT_26_QUESTION_ENGLISH_V4_REVIEW_PACK_MATERIALIZED",
    "COM002_LOCALIZATION_V3_1040_PARITY_EXECUTED_GREEN",
    "COM002_LOCALIZATION_V3_26_QUESTION_BILINGUAL_SAMPLER_EXECUTED_GREEN",
    "COM002_V4_V3_FAIL_CLOSED_PREBANK_390_EXECUTED_GREEN",
  ] as const,
  invalidationRule:
    "Any learner-facing V4 English or V3 Hindi/Punjabi change, provenance/solver drift, option-order or correct-index drift, or authority-chain change requires a new exact-head execution and keeps COM-002 non-discoverable until explicit human gates are re-satisfied.",
});
