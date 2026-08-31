import { createHash } from "node:crypto";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3 } from "./com002-english-human-review-integrity-v3";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V4,
  generateCom002ReviewQuestionV4,
} from "./com002-review-synthesis-v4";

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, stableValue(entry)]),
    );
  }
  return value;
}

function fingerprint(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(stableValue(value)))
    .digest("hex");
}

const QL_IDS = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

function englishV4CorpusProjection() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-v4-freeze-candidate:${qlId}:${index}`;
      const question = generateCom002ReviewQuestionV4({ qlId, seed });
      return {
        qlId: question.qlId,
        cpId: question.cpId,
        seed,
        questionId: question.questionId,
        surfaceMode: question.surfaceMode,
        targetFactId: question.targetFactId,
        stem: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        explanation: question.explanation,
        sourceIds: [...question.sourceIds].sort(),
        sourceFactIds: [...question.sourceFactIds].sort(),
        solverAuthority: question.solverAuthority,
        reviewOnly: question.reviewOnly,
        runtimeRegistered: question.runtimeRegistered,
      };
    }),
  );
}

function englishV4ReviewProjection() {
  return COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack.questionCount === 26
    ? QL_IDS.flatMap((qlId) =>
        (["A", "B"] as const).map((suffix) => {
          const seed = `human-review-wave1:${qlId}:${suffix}`;
          const question = generateCom002ReviewQuestionV4({ qlId, seed });
          return {
            qlId,
            seed,
            questionId: question.questionId,
            surfaceMode: question.surfaceMode,
            targetFactId: question.targetFactId,
            stem: question.stem,
            options: [...question.options],
            correctIndex: question.correctIndex,
            canonicalAnswer: question.canonicalAnswer,
            explanation: question.explanation,
            sourceIds: [...question.sourceIds].sort(),
            sourceFactIds: [...question.sourceFactIds].sort(),
            solverAuthority: question.solverAuthority,
          };
        }),
      )
    : [];
}

export function computeCom002EnglishV4FreezeCandidateFingerprints() {
  const corpus = englishV4CorpusProjection();
  const reviewPack = englishV4ReviewProjection();
  const englishCorpusFingerprint = fingerprint(corpus);
  const reviewPackFingerprint = fingerprint(reviewPack);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
    integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.authorityId,
    integrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.status,
    executedWorkflowRunId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowRunId,
    executedWorkflowJobId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence.workflowJobId,
    explicitApprovalVerified:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.humanReview.explicitApprovalVerified,
    englishCorpusFingerprint,
    reviewPackFingerprint,
    qlRange: "COM-002-QL-001..COM-002-QL-013",
    questionsPerQl: 40,
    reviewQuestionsPerQl: 2,
  });

  return {
    englishCorpusFingerprint,
    reviewPackFingerprint,
    combinedFingerprint,
    qlCount: QL_IDS.length,
    corpusQuestionCount: corpus.length,
    reviewQuestionCount: reviewPack.length,
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
  };
}

export const COM002_ENGLISH_V4_FREEZE_CANDIDATE_PINS = {
  englishCorpusFingerprint: "PENDING",
  reviewPackFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

export const COM002_ENGLISH_V4_FREEZE_CANDIDATE = Object.freeze({
  candidateId: "COM-002-ENGLISH-V4-FREEZE-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  cpRange: "COM-002-CP-001..COM-002-CP-002" as const,
  permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
  permanentQlCount: 13,
  status: "MACHINE_FINGERPRINT_CANDIDATE_AWAITING_EXPLICIT_PRODUCT_OWNER_APPROVAL" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V4,
  integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.authorityId,
  exactExecutedEvidence: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.exactExecutedEvidence,
  materializedReviewPack: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.reviewPack,
  fingerprints: COM002_ENGLISH_V4_FREEZE_CANDIDATE_PINS,
  proofGuarantees: {
    deterministicReplay: true,
    exactlyFourUniqueOptions: true,
    canonicalAnswerVerified: true,
    ql004ClassificationRoleMismatchRemoved: true,
    ql013SafeRelationFamiliesOnly: true,
    blockedSourcesExcluded: true,
    heldRejectedFactsExcluded: true,
    sourceProvenancePreserved: true,
    solverAuthorityPreserved: true,
  },
  humanReview: {
    explicitApprovalVerified: false,
    approvalSource: null,
    approvedOn: null,
  },
  promotionAllowed: false,
  promotionBlocker: "EXPLICIT_PRODUCT_OWNER_APPROVAL_OF_EXACT_26_QUESTION_V4_PACK_REQUIRED" as const,
  lifecycle: {
    englishV4MachineAuditExecuted: true,
    englishV4MachineFingerprintsPinned: false,
    englishV4AuthorityFrozen: false,
    localizationFreezePromotionAllowed: false,
    questionStudioActive: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
  },
  nextGate: "COM002_EXPLICIT_APPROVAL_THEN_PROMOTE_ENGLISH_V4_FREEZE" as const,
});

export function auditCom002EnglishV4FreezeCandidate() {
  const actual = computeCom002EnglishV4FreezeCandidateFingerprints();
  const pins = COM002_ENGLISH_V4_FREEZE_CANDIDATE_PINS;
  const issues: string[] = [];

  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.corpusQuestionCount !== 520) {
    issues.push(`CORPUS_QUESTION_COUNT:${actual.corpusQuestionCount}`);
  }
  if (actual.reviewQuestionCount !== 26) {
    issues.push(`REVIEW_QUESTION_COUNT:${actual.reviewQuestionCount}`);
  }
  if (actual.englishGeneratorVersion !== COM002_ENGLISH_GENERATOR_VERSION_V4) {
    issues.push("ENGLISH_V4_GENERATOR_VERSION_DRIFT");
  }
  if (!COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.humanReview.explicitApprovalVerified) {
    issues.push("EXPLICIT_PRODUCT_OWNER_APPROVAL_PENDING");
  }

  for (const key of [
    "englishCorpusFingerprint",
    "reviewPackFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
    }
  }

  const fingerprintIssues = issues.filter((issue) =>
    issue.startsWith("FINGERPRINT_MISMATCH:"),
  );

  return {
    machineFingerprintValid: fingerprintIssues.length === 0,
    promotable:
      fingerprintIssues.length === 0 &&
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V3.humanReview.explicitApprovalVerified,
    actual,
    pins,
    issues,
  };
}
