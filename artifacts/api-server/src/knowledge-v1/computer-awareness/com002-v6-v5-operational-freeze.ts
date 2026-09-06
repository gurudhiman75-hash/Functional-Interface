import {
  COM002_V6_V5_APPROVED_FREEZE_CANDIDATE,
  COM002_V6_V5_APPROVED_FREEZE_PINS,
  auditCom002V6V5ApprovedFreezeCandidate,
} from "./com002-v6-v5-approved-freeze-candidate";
import { COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY } from "./com002-v6-v5-human-approval-authority";

const candidateAudit = auditCom002V6V5ApprovedFreezeCandidate();
if (!candidateAudit.promotable) {
  throw new Error(`COM-002 V6/V5 operational freeze cannot be created: ${candidateAudit.issues.join(",")}`);
}

/**
 * Immutable operational content authority for COM-002 after explicit human
 * acceptance and deterministic full-corpus fingerprinting. This freezes the
 * learner-facing V6/V5 content only; Question Studio registration is a
 * separate adapter/integration gate and Question Bank/test/public rights are
 * intentionally not granted here.
 */
export const COM002_V6_V5_OPERATIONAL_FREEZE = Object.freeze({
  authorityId: "COM-002-V6-V5-OPERATIONAL-FREEZE" as const,
  chapterId: "COM-002" as const,
  status: "FROZEN_APPROVED_CONTENT_AWAITING_STANDARD_REVIEW_ONLY_ADAPTER_AUDIT" as const,
  approvalAuthorityId: COM002_V6_V5_HUMAN_APPROVAL_AUTHORITY.authorityId,
  sourceCandidateAuthorityId: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.authorityId,
  englishGeneratorVersion: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.englishGeneratorVersion,
  localizationVersion: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.localizationVersion,
  fingerprints: COM002_V6_V5_APPROVED_FREEZE_PINS,
  humanReviewExecution: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.executionEvidence,
  fingerprintExecution: COM002_V6_V5_APPROVED_FREEZE_CANDIDATE.machineFingerprintEvidence,
  frozenScope: Object.freeze({
    permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
    englishCorpusQuestions: 520,
    hindiCorpusQuestions: 520,
    punjabiCorpusQuestions: 520,
    englishHumanReviewQuestions: 26,
    bilingualReviewQuestionGroups: 13,
    approvedLocalizedReviewSurfaces: 26,
    semanticProvenancePreserved: true,
    optionOrderAndCorrectIndexPreserved: true,
    sourceAuthorityPreserved: true,
  }),
  lifecycle: Object.freeze({
    explicitHumanApprovalVerified: true,
    machineFingerprintsPinned: true,
    englishV6Frozen: true,
    localizationV5Frozen: true,
    operationalContentFreezeCreated: true,
    questionStudioDiscoverable: false,
    questionStudioRegistrationAllowed: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  }),
  invalidationRule:
    "Any English V6 or Hindi/Punjabi V5 learner-facing, answer, option-order, semantic, provenance, solver, source-authority, or deterministic fingerprint drift invalidates this freeze and requires a new reviewed authority before COM-002 can remain registered.",
  nextGate: "AUDIT_COM002_V6_V5_STANDARD_REVIEW_ONLY_ADAPTER" as const,
});

export function auditCom002V6V5OperationalFreeze() {
  const issues: string[] = [];
  const freeze = COM002_V6_V5_OPERATIONAL_FREEZE;
  if (!freeze.lifecycle.explicitHumanApprovalVerified) issues.push("HUMAN_APPROVAL_NOT_VERIFIED");
  if (!freeze.lifecycle.machineFingerprintsPinned) issues.push("FINGERPRINTS_NOT_PINNED");
  if (!freeze.lifecycle.englishV6Frozen) issues.push("ENGLISH_V6_NOT_FROZEN");
  if (!freeze.lifecycle.localizationV5Frozen) issues.push("LOCALIZATION_V5_NOT_FROZEN");
  if (freeze.humanReviewExecution.conclusion !== "SUCCESS") issues.push("HUMAN_REVIEW_EXECUTION_NOT_GREEN");
  if (freeze.fingerprintExecution.conclusion !== "SUCCESS") issues.push("FINGERPRINT_EXECUTION_NOT_GREEN");
  for (const [key, value] of Object.entries(freeze.fingerprints)) {
    if (!/^[a-f0-9]{64}$/.test(value)) issues.push(`INVALID_FINGERPRINT:${key}`);
  }
  if (freeze.lifecycle.questionStudioDiscoverable) issues.push("QUESTION_STUDIO_PREMATURELY_DISCOVERABLE");
  if (freeze.lifecycle.canonicalQuestionPersistenceAllowed) issues.push("CANONICAL_PERSISTENCE_PREMATURELY_ALLOWED");
  if (freeze.lifecycle.questionBankWritable) issues.push("QUESTION_BANK_PREMATURELY_WRITABLE");
  if (freeze.lifecycle.testEligible || freeze.lifecycle.mockTestEligible) issues.push("DOWNSTREAM_TEST_ELIGIBILITY_PREMATURELY_ALLOWED");
  if (freeze.lifecycle.publiclyPublishable || freeze.lifecycle.automaticStudentPublication || freeze.lifecycle.productionReleaseAuthorized) {
    issues.push("PUBLIC_OR_PRODUCTION_RELEASE_PREMATURELY_ALLOWED");
  }
  return { valid: issues.length === 0, issues, freeze };
}
