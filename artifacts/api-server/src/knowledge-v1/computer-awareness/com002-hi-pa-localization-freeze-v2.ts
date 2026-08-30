import { createHash } from "node:crypto";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2 } from "./com002-english-human-review-integrity-v2";
import {
  COM002_LOCALIZATION_DRAFT_AUTHORITY_V2,
  COM002_LOCALIZATION_VERSION_V2,
  localizeCom002QuestionV2,
} from "./com002-localization-v2";
import { COM002_TERMINOLOGY_REGISTRY_V1 } from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V3,
  generateCom002ReviewQuestionV3,
} from "./com002-review-synthesis-v3";

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
const LANGUAGES = ["hi", "pa"] as const;

function terminologyProjection() {
  return Object.entries(COM002_TERMINOLOGY_REGISTRY_V1)
    .map(([english, localized]) => ({ english, hi: localized.hi, pa: localized.pa }))
    .sort((left, right) => left.english.localeCompare(right.english));
}

function localizedCorpusProjectionV2() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-v3-localization-v2:${qlId}:${index}`;
      const english = generateCom002ReviewQuestionV3({ qlId, seed });
      return LANGUAGES.map((language) => {
        const question = localizeCom002QuestionV2({ qlId, seed, language });
        return {
          qlId: question.qlId,
          cpId: question.cpId,
          seed,
          language: question.language,
          locale: question.locale,
          englishQuestionId: english.questionId,
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
          localizationV2: question.localizationV2,
          lifecycleV2: question.lifecycleV2,
        };
      });
    }).flat(),
  );
}

function reviewSamplerProjectionV2() {
  return QL_IDS.flatMap((qlId) => {
    const seed = `localization-human-review-v2:${qlId}`;
    const english = generateCom002ReviewQuestionV3({ qlId, seed });
    return LANGUAGES.map((language) => {
      const question = localizeCom002QuestionV2({ qlId, seed, language });
      return {
        qlId,
        language,
        seed,
        englishQuestionId: english.questionId,
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
    });
  });
}

export function computeCom002HiPaLocalizationFreezeFingerprintsV2() {
  const terminology = terminologyProjection();
  const corpus = localizedCorpusProjectionV2();
  const sampler = reviewSamplerProjectionV2();
  const terminologyFingerprint = fingerprint(terminology);
  const localizedCorpusFingerprint = fingerprint(corpus);
  const reviewSamplerFingerprint = fingerprint(sampler);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
    englishHumanReviewIntegrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.authorityId,
    englishHumanReviewIntegrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.status,
    executedWorkflowRunId:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence.workflowRunId,
    explicitEnglishApprovalVerified:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.humanReview.explicitApprovalVerified,
    operationalEnglishFreezeAllowed:
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.operationalEnglishFreezeAllowed,
    localizationVersion: COM002_LOCALIZATION_VERSION_V2,
    terminologyFingerprint,
    localizedCorpusFingerprint,
    reviewSamplerFingerprint,
    qlRange: "COM-002-QL-001..COM-002-QL-013",
    questionsPerQlPerLanguage: 40,
    languages: LANGUAGES,
  });

  return {
    terminologyFingerprint,
    localizedCorpusFingerprint,
    reviewSamplerFingerprint,
    combinedFingerprint,
    localizedQuestionCount: corpus.length,
    reviewSamplerQuestionCount: sampler.length,
    qlCount: QL_IDS.length,
    languages: LANGUAGES,
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
  };
}

export const COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V2 = {
  terminologyFingerprint: "PENDING",
  localizedCorpusFingerprint: "PENDING",
  reviewSamplerFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

/**
 * Executed V3-bound localization hash candidate only.
 *
 * The 1,040-question parity corpus and 26-question bilingual sampler executed
 * green on the canonical runner. Machine fingerprints can now be pinned, but
 * promotion remains blocked until the exact English V3 review pack receives
 * explicit product-owner approval and an operational English V3 freeze exists.
 */
export const COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V2 = Object.freeze({
  candidateId: "COM-002-HI-PA-LOCALIZATION-FREEZE-CANDIDATE-V2" as const,
  chapterId: "COM-002" as const,
  cpRange: "COM-002-CP-001..COM-002-CP-002" as const,
  permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
  permanentQlCount: 13,
  status: "EXECUTED_V3_BOUND_HASH_CANDIDATE_BLOCKED_BY_EXPLICIT_ENGLISH_APPROVAL" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
  localizationVersion: COM002_LOCALIZATION_VERSION_V2,
  draftAuthority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V2,
  englishHumanReviewIntegrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.authorityId,
  englishHumanReviewIntegrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.status,
  exactExecutedEvidence: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.exactExecutedEvidence,
  explicitEnglishApprovalVerified:
    COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.humanReview.explicitApprovalVerified,
  operationalEnglishFreezeAllowed:
    COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.operationalEnglishFreezeAllowed,
  fingerprints: COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V2,
  expectedProof: {
    localizedParityQuestions: 1040,
    reviewSamplerQuestions: 26,
    questionsPerQlPerLanguage: 40,
    deterministicReplayRequired: true,
    v3Ql004SafetyRemediationPreserved: true,
    v3Ql013SafeRelationFamiliesPreserved: true,
    targetScriptRequired: true,
    noSilentEnglishFallback: true,
    semanticStateImmutable: true,
    qlImmutable: true,
    cpImmutable: true,
    surfaceModeImmutable: true,
    targetFactImmutable: true,
    sourceFactsImmutable: true,
    sourceAuthorityImmutable: true,
    solverAuthorityImmutable: true,
    optionOrderImmutable: true,
    correctIndexImmutable: true,
  },
  promotionAllowed: false,
  promotionBlocker:
    "EXPLICIT_PRODUCT_OWNER_APPROVAL_AND_OPERATIONAL_ENGLISH_V3_FREEZE_REQUIRED" as const,
  lifecycle: {
    englishV3CandidateImplemented: true,
    englishV3ExecutedGreen: true,
    englishV3Approved: false,
    operationalEnglishFreezeAllowed: false,
    hindiPunjabiV2GenerationImplemented: true,
    localizationV2ExecutedGreen: true,
    localizationFingerprintsPinned: false,
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
  },
  nextGate: "COM002_EXPLICIT_ENGLISH_V3_APPROVAL_THEN_FREEZE_PROMOTION" as const,
});

export function auditCom002HiPaLocalizationFreezeCandidateV2() {
  const actual = computeCom002HiPaLocalizationFreezeFingerprintsV2();
  const pins = COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V2;
  const issues: string[] = [];

  if (actual.localizedQuestionCount !== 1040) {
    issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  }
  if (actual.reviewSamplerQuestionCount !== 26) {
    issues.push(`REVIEW_SAMPLER_COUNT:${actual.reviewSamplerQuestionCount}`);
  }
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.englishGeneratorVersion !== COM002_ENGLISH_GENERATOR_VERSION_V3) {
    issues.push("ENGLISH_V3_GENERATOR_VERSION_DRIFT");
  }
  if (!COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.operationalEnglishFreezeAllowed) {
    issues.push("ENGLISH_V3_OPERATIONAL_FREEZE_BLOCKED_PENDING_EXPLICIT_APPROVAL");
  }

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

  const fingerprintIssues = issues.filter((issue) =>
    issue.startsWith("FINGERPRINT_MISMATCH:"),
  );

  return {
    machineFingerprintValid: fingerprintIssues.length === 0,
    promotable:
      fingerprintIssues.length === 0 &&
      COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V2.operationalEnglishFreezeAllowed,
    hashProbeComputed: true as const,
    actual,
    pins,
    issues,
  };
}
