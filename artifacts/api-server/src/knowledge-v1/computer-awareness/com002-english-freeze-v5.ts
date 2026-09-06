import { COM002_V5_APPROVED_BROWSER_PACK_FINGERPRINT } from "./com002-approved-simplified-review-v5";
import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4 } from "./com002-english-human-review-integrity-v4";
import {
  COM002_ENGLISH_V5_FREEZE_CANDIDATE,
  COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS,
  auditCom002EnglishV5FreezeCandidate,
} from "./com002-english-freeze-v5-candidate";
import { COM002_ENGLISH_GENERATOR_VERSION_V5 } from "./com002-review-synthesis-v5";

/**
 * Operational English authority for COM-002.
 *
 * This authority is deliberately separate from the immutable product-owner
 * approval record. It binds that exact approved learner-facing surface to the
 * canonical V5 execution and pinned deterministic corpus/review fingerprints.
 */
export const COM002_ENGLISH_FREEZE_AUTHORITY_V5 = Object.freeze({
  authorityId: "COM-002-ENGLISH-FREEZE-V5" as const,
  chapterId: "COM-002" as const,
  status: "ENGLISH_V5_EXPLICITLY_APPROVED_EXECUTED_PINNED_FROZEN" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  supersedesEnglishCandidate: "COM-002-ENGLISH-V4-FREEZE-CANDIDATE" as const,
  preservesFactAuthority: true,
  humanReview: Object.freeze({
    status: "APPROVED" as const,
    approvalAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.authorityId,
    approvalSource: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvalSource,
    approvedOn: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedOn,
    approvedSurface: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedSurface,
    reviewQuestionCount: 26,
    pullRequestNumber: 1019,
    approvalBindingCommentId: 5447757851,
    exactApprovedBrowserPackFingerprint: COM002_V5_APPROVED_BROWSER_PACK_FINGERPRINT,
  }),
  canonicalExecution: Object.freeze({
    featureHeadSha: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.featureHeadSha,
    pullRequestNumber: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.pullRequestNumber,
    pullRequestMergeSha: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.pullRequestMergeSha,
    workflowName: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowName,
    workflowRunNumber: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowRunNumber,
    workflowRunId: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowRunId,
    workflowJobId: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.workflowJobId,
    conclusion: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.conclusion,
    executedOn: COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.executedOn,
    englishCorpusQuestions: 520,
    exactApprovedReviewQuestions: 26,
    learnerFacingChangedFromV4: 452,
    kernelCoreDescriptionCases: 6,
    semanticProvenancePreserved: true,
  }),
  proofGuarantees: Object.freeze({
    permanentQlCount: 13,
    frozenQuestionsPerQl: 40,
    totalFrozenEnglishQuestions: 520,
    deterministicReplay: true,
    exactApprovedReviewSurfaceLocked: true,
    exactlyFourUniqueOptions: true,
    canonicalAnswerVerified: true,
    semanticProvenancePreserved: true,
    sourceFactProvenancePreserved: true,
    solverAuthorityPreserved: true,
    kernelCoreRegressionLocked: true,
    simplifiedLearnerLanguageAudited: true,
  }),
  fingerprints: COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS,
  lifecycle: Object.freeze({
    englishV5AuthorityFrozen: true,
    v5BoundLocalizationCandidateDevelopmentAllowed: true,
    hindiPunjabiV5BoundLocalizationFrozen: false,
    questionStudioActive: false,
    reviewPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  nextGate: "COM002_V5_BOUND_HINDI_PUNJABI_LOCALIZATION_REVIEW_AND_FREEZE" as const,
});

export function auditCom002EnglishFreezeV5() {
  const candidateAudit = auditCom002EnglishV5FreezeCandidate();
  const issues: string[] = [];

  if (!candidateAudit.promotable) issues.push(`V5_CANDIDATE_NOT_PROMOTABLE:${candidateAudit.issues.join("|")}`);
  if (!COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.explicitApprovalVerified) issues.push("EXPLICIT_APPROVAL_MISSING");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.humanReview.exactApprovedBrowserPackFingerprint !== COM002_V5_APPROVED_BROWSER_PACK_FINGERPRINT) {
    issues.push("APPROVED_BROWSER_PACK_FINGERPRINT_MISMATCH");
  }
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.conclusion !== "SUCCESS") issues.push("CANONICAL_EXECUTION_NOT_GREEN");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.englishCorpusQuestions !== 520) issues.push("ENGLISH_CORPUS_COUNT_MISMATCH");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.canonicalExecution.exactApprovedReviewQuestions !== 26) issues.push("REVIEW_PACK_COUNT_MISMATCH");
  if (!COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen) issues.push("ENGLISH_V5_NOT_FROZEN");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.questionStudioActive) issues.push("QUESTION_STUDIO_PREMATURELY_ACTIVE");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.questionBankWritable) issues.push("QUESTION_BANK_PREMATURELY_WRITABLE");
  if (COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.productionReleaseAuthorized) issues.push("PRODUCTION_PREMATURELY_AUTHORIZED");

  return {
    valid: issues.length === 0,
    candidateAudit,
    authority: COM002_ENGLISH_FREEZE_AUTHORITY_V5,
    issues,
  };
}
