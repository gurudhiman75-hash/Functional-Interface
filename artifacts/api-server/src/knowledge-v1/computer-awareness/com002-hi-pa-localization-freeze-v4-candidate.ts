import { createHash } from "node:crypto";

import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import {
  COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
  COM002_LOCALIZATION_VERSION_V4,
  localizeCom002QuestionV4,
} from "./com002-localization-v4";
import { COM002_TERMINOLOGY_REGISTRY_V1 } from "./com002-localization-lexicon-v1";
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

function localizedCorpusProjectionV4() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-v5-localization-v4:${qlId}:${index}`;
      const english = generateCom002ReviewQuestionV5({ qlId, seed });
      return LANGUAGES.map((language) => {
        const question = localizeCom002QuestionV4({ qlId, seed, language });
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
          localizationV4: question.localizationV4,
          lifecycleV4: question.lifecycleV4,
        };
      });
    }).flat(),
  );
}

function reviewSamplerProjectionV4() {
  return QL_IDS.flatMap((qlId) => {
    const seed = `localization-human-review-v4:${qlId}`;
    const english = generateCom002ReviewQuestionV5({ qlId, seed });
    return LANGUAGES.map((language) => {
      const question = localizeCom002QuestionV4({ qlId, seed, language });
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

export function computeCom002HiPaLocalizationV4CandidateFingerprints() {
  const terminology = terminologyProjection();
  const corpus = localizedCorpusProjectionV4();
  const sampler = reviewSamplerProjectionV4();
  const terminologyFingerprint = fingerprint(terminology);
  const localizedCorpusFingerprint = fingerprint(corpus);
  const reviewSamplerFingerprint = fingerprint(sampler);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
    englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
    englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
    localizationVersion: COM002_LOCALIZATION_VERSION_V4,
    localizationDraftAuthority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
    localizationHumanReviewAccepted: false,
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
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  };
}

export const COM002_HI_PA_LOCALIZATION_V4_CANDIDATE_PINS = {
  terminologyFingerprint: "PENDING",
  localizedCorpusFingerprint: "PENDING",
  reviewSamplerFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

export const COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4 = Object.freeze({
  candidateId: "COM-002-HI-PA-LOCALIZATION-FREEZE-CANDIDATE-V4" as const,
  chapterId: "COM-002" as const,
  status: "V5_BOUND_V4_HASH_PROBE_AWAITING_CANONICAL_EXECUTION_AND_HUMAN_REVIEW" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V5,
  englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId,
  englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V5.fingerprints.combinedFingerprint,
  localizationVersion: COM002_LOCALIZATION_VERSION_V4,
  draftAuthority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V4,
  fingerprints: COM002_HI_PA_LOCALIZATION_V4_CANDIDATE_PINS,
  humanReview: Object.freeze({
    bilingualSamplerQuestionCount: 26,
    accepted: false,
    approvalSource: null,
    approvedOn: null,
  }),
  expectedProof: Object.freeze({
    localizedParityQuestions: 1040,
    reviewSamplerQuestions: 26,
    questionsPerQlPerLanguage: 40,
    deterministicReplayRequired: true,
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
    optionOrderSemanticInvariant: true,
    correctIndexImmutable: true,
    grammarPolishedV3SurfacePreserved: true,
  }),
  promotionAllowed: false,
  promotionBlocker: "CANONICAL_V4_EXECUTION_PLUS_PINNED_FINGERPRINTS_AND_EXPLICIT_BILINGUAL_HUMAN_ACCEPTANCE_REQUIRED" as const,
  lifecycle: Object.freeze({
    englishV5Frozen: true,
    localizationV4Implemented: true,
    localizationV4ExecutedGreen: false,
    localizationFingerprintsPinned: false,
    localizationHumanReviewAccepted: false,
    localizationFrozen: false,
    questionStudioActive: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    productionReleaseAuthorized: false,
  }),
});

export function auditCom002HiPaLocalizationFreezeCandidateV4() {
  const actual = computeCom002HiPaLocalizationV4CandidateFingerprints();
  const pins = COM002_HI_PA_LOCALIZATION_V4_CANDIDATE_PINS;
  const issues: string[] = [];

  if (actual.localizedQuestionCount !== 1040) issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  if (actual.reviewSamplerQuestionCount !== 26) issues.push(`REVIEW_SAMPLER_COUNT:${actual.reviewSamplerQuestionCount}`);
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.englishGeneratorVersion !== COM002_ENGLISH_GENERATOR_VERSION_V5) issues.push("ENGLISH_V5_GENERATOR_VERSION_DRIFT");
  if (!COM002_ENGLISH_FREEZE_AUTHORITY_V5.lifecycle.englishV5AuthorityFrozen) issues.push("ENGLISH_V5_NOT_FROZEN");
  if (!COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.humanReview.accepted) issues.push("BILINGUAL_HUMAN_REVIEW_NOT_ACCEPTED");

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

  const fingerprintIssues = issues.filter((issue) => issue.startsWith("FINGERPRINT_MISMATCH:"));
  return {
    machineFingerprintValid: fingerprintIssues.length === 0,
    promotable: issues.length === 0 && COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V4.promotionAllowed,
    hashProbeComputed: true as const,
    actual,
    pins,
    issues,
  };
}
