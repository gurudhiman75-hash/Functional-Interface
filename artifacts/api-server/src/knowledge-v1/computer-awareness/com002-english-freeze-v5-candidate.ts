import { createHash } from "node:crypto";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4 } from "./com002-english-human-review-integrity-v4";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V5,
  generateCom002ReviewQuestionV5,
} from "./com002-review-synthesis-v5";

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
  return createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex");
}

const QL_IDS = Array.from({ length: 13 }, (_, index) =>
  `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

function corpusProjection() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-v5-freeze-candidate:${qlId}:${index}`;
      const q = generateCom002ReviewQuestionV5({ qlId, seed });
      return {
        qlId: q.qlId,
        cpId: q.cpId,
        seed,
        questionId: q.questionId,
        surfaceMode: q.surfaceMode,
        targetFactId: q.targetFactId,
        stem: q.stem,
        options: [...q.options],
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: [...q.sourceIds].sort(),
        sourceFactIds: [...q.sourceFactIds].sort(),
        solverAuthority: q.solverAuthority,
        reviewOnly: q.reviewOnly,
        runtimeRegistered: q.runtimeRegistered,
      };
    }),
  );
}

function reviewProjection() {
  return QL_IDS.flatMap((qlId) =>
    (["A", "B"] as const).map((suffix) => {
      const seed = `human-review-wave1:${qlId}:${suffix}`;
      const q = generateCom002ReviewQuestionV5({ qlId, seed });
      return {
        qlId,
        seed,
        questionId: q.questionId,
        surfaceMode: q.surfaceMode,
        targetFactId: q.targetFactId,
        stem: q.stem,
        options: [...q.options],
        correctIndex: q.correctIndex,
        canonicalAnswer: q.canonicalAnswer,
        explanation: q.explanation,
        sourceIds: [...q.sourceIds].sort(),
        sourceFactIds: [...q.sourceFactIds].sort(),
        solverAuthority: q.solverAuthority,
      };
    }),
  );
}

export function computeCom002EnglishV5FreezeCandidateFingerprints() {
  const corpus = corpusProjection();
  const reviewPack = reviewProjection();
  const englishCorpusFingerprint = fingerprint(corpus);
  const reviewPackFingerprint = fingerprint(reviewPack);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
    integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.authorityId,
    integrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.status,
    explicitApprovalVerified: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.explicitApprovalVerified,
    approvalSource: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvalSource,
    approvedOn: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedOn,
    approvedSurface: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedSurface,
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
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  };
}

export const COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS = {
  englishCorpusFingerprint: "a481f4899f26ebb7199f565b9683627c43213fba8c358e4a2a151c7811e2bad9",
  reviewPackFingerprint: "c69aaba609b9f1af7b1e120cf679c748ff4adbe51c6d926e1ea1436b5b014921",
  combinedFingerprint: "d5109a528cb753b1c00d23864b709c040595ef91b59e776b5ab3510b9ab93b69",
} as const;

export const COM002_ENGLISH_V5_FREEZE_CANDIDATE = Object.freeze({
  candidateId: "COM-002-ENGLISH-V5-FREEZE-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  status: "EXPLICITLY_APPROVED_CANONICAL_V5_EXECUTED_GREEN_FINGERPRINTS_PINNED" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.authorityId,
  fingerprints: COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS,
  humanReview: {
    explicitApprovalVerified: true,
    approvalSource: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvalSource,
    approvedOn: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedOn,
    approvedSurface: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedSurface,
  },
  executionEvidence: {
    featureHeadSha: "b03f04ef59b5fc34a75b0a2591dfb4244b55049b" as const,
    pullRequestNumber: 1019,
    pullRequestMergeSha: "708d171bb83bc271a597ed4a861db1af96023949" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 502,
    workflowRunId: 33136710464,
    workflowJobId: 98738191160,
    conclusion: "SUCCESS" as const,
    executedOn: "2026-08-28" as const,
    englishV5CorpusQuestions: 520,
    englishV5ReviewQuestions: 26,
    learnerFacingChangedFromV4: 452,
    kernelCoreDescriptionCases: 6,
    semanticProvenancePreserved: true,
    exactApprovedBrowserPackFingerprint: "afbfa579bb22ca0e8a7663bf58c16bef4fc33aab7fec957d04b6082bc00d1ef7" as const,
  },
  promotionAllowed: true,
  promotionBlocker: null,
  lifecycle: {
    englishV5MachineAuditExecuted: true,
    englishV5MachineFingerprintsPinned: true,
    englishV5AuthorityFrozen: false,
    localizationFreezePromotionAllowed: false,
    questionStudioActive: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  },
});

export function auditCom002EnglishV5FreezeCandidate() {
  const actual = computeCom002EnglishV5FreezeCandidateFingerprints();
  const pins = COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS;
  const issues: string[] = [];
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.corpusQuestionCount !== 520) issues.push(`CORPUS_QUESTION_COUNT:${actual.corpusQuestionCount}`);
  if (actual.reviewQuestionCount !== 26) issues.push(`REVIEW_QUESTION_COUNT:${actual.reviewQuestionCount}`);
  if (!COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.explicitApprovalVerified) issues.push("EXPLICIT_APPROVAL_MISSING");
  if (COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.conclusion !== "SUCCESS") issues.push("CANONICAL_EXECUTION_NOT_GREEN");
  if (COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.englishV5CorpusQuestions !== 520) issues.push("CANONICAL_CORPUS_COUNT_MISMATCH");
  if (COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.englishV5ReviewQuestions !== 26) issues.push("CANONICAL_REVIEW_COUNT_MISMATCH");
  if (!COM002_ENGLISH_V5_FREEZE_CANDIDATE.executionEvidence.semanticProvenancePreserved) issues.push("SEMANTIC_PROVENANCE_NOT_PRESERVED");

  for (const key of ["englishCorpusFingerprint", "reviewPackFingerprint", "combinedFingerprint"] as const) {
    if (actual[key] !== pins[key]) issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
  }
  const promotable = issues.length === 0 && COM002_ENGLISH_V5_FREEZE_CANDIDATE.promotionAllowed;
  return { actual, pins, issues, promotable };
}
