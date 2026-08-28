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
  englishCorpusFingerprint: "PENDING",
  reviewPackFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

export const COM002_ENGLISH_V5_FREEZE_CANDIDATE = Object.freeze({
  candidateId: "COM-002-ENGLISH-V5-FREEZE-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  status: "EXPLICITLY_APPROVED_HASH_PROBE_AWAITING_CANONICAL_V5_EXECUTION" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  integrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.authorityId,
  fingerprints: COM002_ENGLISH_V5_FREEZE_CANDIDATE_PINS,
  humanReview: {
    explicitApprovalVerified: true,
    approvalSource: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvalSource,
    approvedOn: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedOn,
    approvedSurface: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.approvedSurface,
  },
  promotionAllowed: false,
  promotionBlocker: "CANONICAL_V5_520_AND_EXACT_26_EXECUTION_PLUS_PINNED_FINGERPRINTS_REQUIRED" as const,
  lifecycle: {
    englishV5MachineAuditExecuted: false,
    englishV5MachineFingerprintsPinned: false,
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
  if (COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V4.v5ExecutedGreen) issues.push("INTEGRITY_STATE_SHOULD_REMAIN_PRE_EXECUTION_FOR_HASH_PROBE");

  for (const key of ["englishCorpusFingerprint", "reviewPackFingerprint", "combinedFingerprint"] as const) {
    if (actual[key] !== pins[key]) issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
  }
  return { actual, pins, issues, promotable: false };
}
