import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4,
  computeCom002HiPaLocalizationV4CandidateFingerprints,
} from "./com002-hi-pa-localization-freeze-v4-candidate";
import {
  COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
  COM002_LOCALIZATION_VERSION_V4,
} from "./com002-localization-v4";

export const COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS = Object.freeze({
  terminologyFingerprint: "7a8d93d463f0812e1f91a8d7fd576d872ba2e14e91520bfc1f6c112d98d5ebfe",
  localizedCorpusFingerprint: "61cb4459b17204283dbcf54554c942d44b7c2be3d456e98b5adfbcbfc05567fd",
  reviewSamplerFingerprint: "fbe537a88b13aa632460c91b149eb5805554224fa725a5cc8cdfa75722f14098",
  combinedFingerprint: "b6e17c5fdfcc5d839e88970d3a0160d6ceca33f25380d9d263cf7fe2f223208b",
});

/**
 * Machine-locked Localization V4 authority.
 *
 * This records the exact deterministic Hindi/Punjabi surface proven green by
 * canonical Content Engine run #530. It is deliberately NOT the final
 * localization freeze: explicit bilingual human acceptance is still required.
 */
export const COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4 = Object.freeze({
  authorityId: "COM-002-HI-PA-LOCALIZATION-MACHINE-LOCK-V4" as const,
  chapterId: "COM-002" as const,
  status: "V4_EXECUTED_GREEN_FINGERPRINTS_PINNED_AWAITING_BILINGUAL_HUMAN_APPROVAL" as const,
  candidateId: COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.candidateId,
  englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
  englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
  localizationVersion: COM002_LOCALIZATION_VERSION_V4,
  localizationDraftAuthority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
  fingerprints: COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS,
  canonicalExecution: Object.freeze({
    featureHeadSha: "daf6ed7bb1abc22b01aaf3ef4e2dd7b8b48c1e5d" as const,
    pullRequestNumber: 1019 as const,
    pullRequestMergeSha: "7c964f16b9e8c4fee26d6edd08e4a0c9855bccd8" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowId: 340594805 as const,
    workflowRunNumber: 530 as const,
    workflowRunId: 33154212289 as const,
    workflowJobId: 98793019865 as const,
    event: "pull_request" as const,
    conclusion: "SUCCESS" as const,
    startedOn: "2026-08-28T08:09:14Z" as const,
    completedOn: "2026-08-28T08:10:02Z" as const,
    localizedCorpusQuestions: 1040 as const,
    bilingualReviewSamplerQuestions: 26 as const,
    permanentQlCount: 13 as const,
  }),
  humanReview: Object.freeze({
    required: true,
    accepted: false,
    approvalSource: null,
    approvedOn: null,
  }),
  lifecycle: Object.freeze({
    englishV5Frozen: true,
    localizationV4ExecutedGreen: true,
    localizationFingerprintsPinned: true,
    localizationMachineLocked: true,
    localizationHumanReviewAccepted: false,
    localizationFrozen: false,
    questionStudioActive: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  nextGate: "EXPLICIT_BILINGUAL_HUMAN_APPROVAL_OF_COM002_LOCALIZATION_V4_REVIEW_SAMPLER" as const,
});

export function auditCom002HiPaLocalizationMachineLockV4() {
  const actual = computeCom002HiPaLocalizationV4CandidateFingerprints();
  const pins = COM002_HI_PA_LOCALIZATION_V4_MACHINE_PINS;
  const issues: string[] = [];

  for (const key of [
    "terminologyFingerprint",
    "localizedCorpusFingerprint",
    "reviewSamplerFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
    }
  }

  if (actual.localizedQuestionCount !== 1040) issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  if (actual.reviewSamplerQuestionCount !== 26) issues.push(`REVIEW_SAMPLER_COUNT:${actual.reviewSamplerQuestionCount}`);
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (!COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen) issues.push("ENGLISH_V5_NOT_FROZEN");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.canonicalExecution.conclusion !== "SUCCESS") issues.push("CANONICAL_EXECUTION_NOT_GREEN");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.humanReview.accepted) issues.push("UNEXPECTED_BILINGUAL_HUMAN_APPROVAL");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.localizationFrozen) issues.push("LOCALIZATION_PREMATURELY_FROZEN");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.questionStudioActive) issues.push("QUESTION_STUDIO_PREMATURELY_ACTIVE");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.questionBankWritable) issues.push("QUESTION_BANK_PREMATURELY_WRITABLE");
  if (COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4.lifecycle.productionReleaseAuthorized) issues.push("PRODUCTION_PREMATURELY_AUTHORIZED");

  return {
    valid: issues.length === 0,
    actual,
    pins,
    authority: COM002_HI_PA_LOCALIZATION_MACHINE_LOCK_V4,
    issues,
  };
}
