import { createHash } from "node:crypto";

import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V6,
  generateCom002ReviewQuestionV6,
} from "./com002-review-synthesis-v6";

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

const QL_IDS = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

function questionProjection(question: ReturnType<typeof generateCom002ReviewQuestionV6>, seed: string) {
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
}

function corpusProjectionV6() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-v6-fingerprint-candidate:${qlId}:${index}`;
      return questionProjection(generateCom002ReviewQuestionV6({ qlId, seed }), seed);
    }),
  );
}

function humanReviewProjectionV6() {
  return QL_IDS.flatMap((qlId) =>
    (["A", "B"] as const).map((suffix) => {
      const seed = `human-review-wave1:${qlId}:${suffix}`;
      return questionProjection(generateCom002ReviewQuestionV6({ qlId, seed }), seed);
    }),
  );
}

function bilingualExportEnglishReferenceProjectionV6() {
  return QL_IDS.map((qlId) => {
    const seed = `localization-human-review-v4:${qlId}`;
    return questionProjection(generateCom002ReviewQuestionV6({ qlId, seed }), seed);
  });
}

export function computeCom002EnglishV6ReviewFingerprints() {
  const corpus = corpusProjectionV6();
  const humanReview = humanReviewProjectionV6();
  const exportEnglishReference = bilingualExportEnglishReferenceProjectionV6();
  const englishCorpusFingerprint = fingerprint(corpus);
  const humanReviewFingerprint = fingerprint(humanReview);
  const exportEnglishReferenceFingerprint = fingerprint(exportEnglishReference);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
    baseEnglishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
    baseEnglishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
    humanReviewAccepted: false,
    englishCorpusFingerprint,
    humanReviewFingerprint,
    exportEnglishReferenceFingerprint,
    qlRange: "COM-002-QL-001..COM-002-QL-013",
    questionsPerQl: 40,
    humanReviewQuestionsPerQl: 2,
    bilingualExportEnglishReferencesPerQl: 1,
  });

  return {
    englishCorpusFingerprint,
    humanReviewFingerprint,
    exportEnglishReferenceFingerprint,
    combinedFingerprint,
    qlCount: QL_IDS.length,
    corpusQuestionCount: corpus.length,
    humanReviewQuestionCount: humanReview.length,
    exportEnglishReferenceCount: exportEnglishReference.length,
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
  };
}

export const COM002_ENGLISH_V6_REVIEW_FINGERPRINT_PINS = {
  englishCorpusFingerprint: "PENDING",
  humanReviewFingerprint: "PENDING",
  exportEnglishReferenceFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

export const COM002_ENGLISH_V6_REVIEW_FINGERPRINT_CANDIDATE = Object.freeze({
  candidateId: "COM-002-ENGLISH-V6-REVIEW-FINGERPRINT-CANDIDATE" as const,
  chapterId: "COM-002" as const,
  status: "V6_EXECUTED_GREEN_HASH_PROBE_AWAITING_PINNING_AND_EXPLICIT_HUMAN_ACCEPTANCE" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V6,
  baseEnglishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
  baseEnglishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
  fingerprints: COM002_ENGLISH_V6_REVIEW_FINGERPRINT_PINS,
  executionEvidence: Object.freeze({
    featureHeadSha: "876dab67a78489b4133e8fd6a786664513c8c160" as const,
    pullRequestNumber: 1019,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 583,
    workflowRunId: 33290190968,
    workflowJobId: 99200373653,
    conclusion: "SUCCESS" as const,
    englishV6CorpusAuditQuestions: 520,
    localizationV5CorpusAuditQuestions: 1040,
    bilingualReviewLocalizedSurfaces: 26,
    semanticProvenancePreserved: true,
    artifactId: 9725746902,
    artifactDigest: "sha256:2268f648700b1b18514f14a492294067510cb217a4ea8478b609be0b8dc33367" as const,
  }),
  humanReview: Object.freeze({
    accepted: false,
    approvalSource: null,
    approvedOn: null,
  }),
  promotionAllowed: false,
  promotionBlocker: "PINNED_V6_FINGERPRINTS_AND_EXPLICIT_HUMAN_ACCEPTANCE_REQUIRED" as const,
  lifecycle: Object.freeze({
    englishV5BaseFrozen: true,
    englishV6Implemented: true,
    englishV6ExecutedGreen: true,
    englishV6FingerprintsPinned: false,
    englishV6HumanReviewAccepted: false,
    englishV6Frozen: false,
    questionStudioActive: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  }),
});

export function auditCom002EnglishV6ReviewFingerprintCandidate() {
  const actual = computeCom002EnglishV6ReviewFingerprints();
  const pins = COM002_ENGLISH_V6_REVIEW_FINGERPRINT_PINS;
  const issues: string[] = [];

  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.corpusQuestionCount !== 520) issues.push(`CORPUS_QUESTION_COUNT:${actual.corpusQuestionCount}`);
  if (actual.humanReviewQuestionCount !== 26) issues.push(`HUMAN_REVIEW_COUNT:${actual.humanReviewQuestionCount}`);
  if (actual.exportEnglishReferenceCount !== 13) issues.push(`EXPORT_REFERENCE_COUNT:${actual.exportEnglishReferenceCount}`);
  if (!COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen) issues.push("BASE_ENGLISH_V5_NOT_FROZEN");
  if (COM002_ENGLISH_V6_REVIEW_FINGERPRINT_CANDIDATE.executionEvidence.conclusion !== "SUCCESS") {
    issues.push("V6_CANONICAL_EXECUTION_NOT_GREEN");
  }
  if (!COM002_ENGLISH_V6_REVIEW_FINGERPRINT_CANDIDATE.executionEvidence.semanticProvenancePreserved) {
    issues.push("SEMANTIC_PROVENANCE_NOT_PRESERVED");
  }
  if (!COM002_ENGLISH_V6_REVIEW_FINGERPRINT_CANDIDATE.humanReview.accepted) {
    issues.push("V6_HUMAN_REVIEW_NOT_ACCEPTED");
  }

  for (const key of [
    "englishCorpusFingerprint",
    "humanReviewFingerprint",
    "exportEnglishReferenceFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
    }
  }

  const fingerprintIssues = issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:"));
  return {
    machineFingerprintValid: fingerprintIssues.length === 0,
    promotable: issues.length === 0 && COM002_ENGLISH_V6_REVIEW_FINGERPRINT_CANDIDATE.promotionAllowed,
    hashProbeComputed: true as const,
    actual,
    pins,
    issues,
  };
}
