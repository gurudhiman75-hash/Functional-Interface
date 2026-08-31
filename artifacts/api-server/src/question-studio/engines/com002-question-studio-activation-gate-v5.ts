import { COM002_V6_V5_OPERATIONAL_FREEZE } from "../../knowledge-v1/computer-awareness/com002-v6-v5-operational-freeze";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";
import { COM002_QUESTION_STUDIO_ACTIVATION_GATE_V4 } from "./com002-question-studio-activation-gate-v4";

/**
 * Operational activation authority for frozen COM-002 English V6 + Hindi/
 * Punjabi V5. The frozen content and review-only adapter have both executed
 * green. This authority grants only the standard Question Studio REVIEW_ONLY
 * lifecycle. It does not authorize canonical Question Bank storage, tests,
 * mock tests, public delivery, automatic publication or production release.
 */
export const COM002_QUESTION_STUDIO_ACTIVATION_GATE_V5 = Object.freeze({
  authorityId: "COM-002-QUESTION-STUDIO-ACTIVATION-GATE-V5" as const,
  chapterId: "COM-002" as const,
  packageId: "COM-002" as const,
  engineId: "knowledge-v1" as const,
  supersedes: COM002_QUESTION_STUDIO_ACTIVATION_GATE_V4.authorityId,
  status: "ACTIVE_STANDARD_REVIEW_ONLY" as const,
  operationalFreezeAuthorityId: COM002_V6_V5_OPERATIONAL_FREEZE.authorityId,
  contentAuthority: Object.freeze({
    englishGeneratorVersion: COM002_V6_V5_OPERATIONAL_FREEZE.englishGeneratorVersion,
    localizationVersion: COM002_V6_V5_OPERATIONAL_FREEZE.localizationVersion,
    explicitHumanApprovalVerified: COM002_V6_V5_OPERATIONAL_FREEZE.lifecycle.explicitHumanApprovalVerified,
    machineFingerprintsPinned: COM002_V6_V5_OPERATIONAL_FREEZE.lifecycle.machineFingerprintsPinned,
    englishV6Frozen: COM002_V6_V5_OPERATIONAL_FREEZE.lifecycle.englishV6Frozen,
    localizationV5Frozen: COM002_V6_V5_OPERATIONAL_FREEZE.lifecycle.localizationV5Frozen,
    englishCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.englishV6CombinedFingerprint,
    localizationCombinedFingerprint: COM002_V6_V5_OPERATIONAL_FREEZE.fingerprints.localizationV5CombinedFingerprint,
  }),
  adapterVerification: Object.freeze({
    featureHeadSha: "e24585524bcd9763d572e27d999b3d659e9ad18d" as const,
    workflowName: "COM-002 V6 V5 Freeze Verification One-Off" as const,
    workflowRunId: 33315623350,
    workflowJobId: 99268418330,
    conclusion: "SUCCESS" as const,
    auditedQuestions: 390,
    permanentQlCount: 13,
    languages: ["en", "hi", "pa"] as const,
    deterministicReplayVerified: true,
    standardLifecycleVerified: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.lifecycleId,
  }),
  activation: Object.freeze({
    questionStudioDiscoverable: true,
    questionStudioRegistrationAllowed: true,
    reviewOnlySwitchAllowed: true,
    reviewRunPersistenceAllowed: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.canonicalQuestionPersistenceAllowed,
    questionBankWritable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.questionBankWritable,
    testEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.testEligible,
    mockTestEligible: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.mockTestEligible,
    publiclyPublishable: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.publiclyPublishable,
    automaticStudentPublication: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.automaticStudentPublication,
    productionReleaseAuthorized: QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1.productionReleaseAuthorized,
  }),
  satisfiedEvidence: [
    "COM002_PRODUCT_OWNER_EXPLICIT_V6_V5_APPROVAL_RECORDED_2026_08_30",
    "COM002_V6_V5_CANONICAL_HUMAN_REVIEW_GREEN_RUN_585",
    "COM002_V6_V5_FULL_CORPUS_FINGERPRINTS_PINNED",
    "COM002_V6_V5_OPERATIONAL_FREEZE_CREATED",
    "COM002_V6_V5_REVIEW_ONLY_ADAPTER_390_QUESTION_AUDIT_GREEN_RUN_33315623350",
  ] as const,
  nextLifecycleGate: "STANDARD_MANUAL_REVIEW_AND_EXPLICIT_QUESTION_BANK_ACCEPTANCE" as const,
  invalidationRule:
    "Any frozen V6/V5 content fingerprint drift or adapter semantic/lifecycle drift disables this authority and requires revalidation before COM-002 remains discoverable.",
});
