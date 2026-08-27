import { createHash } from "node:crypto";

import { COM002_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com002-english-freeze-v1";
import { localizeCom002QuestionEditorialV1 } from "./com002-localization-editorial-v1";
import {
  COM002_LOCALIZATION_DRAFT_AUTHORITY_V1,
  COM002_LOCALIZATION_VERSION_V1,
  COM002_TERMINOLOGY_REGISTRY_V1,
} from "./com002-localization-lexicon-v1";

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

function localizedCorpusProjection() {
  return QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v1:${qlId}:${index}`;
      return LANGUAGES.map((language) => {
        const question = localizeCom002QuestionEditorialV1({ qlId, seed, language });
        return {
          qlId: question.qlId,
          cpId: question.cpId,
          seed,
          language: question.language,
          locale: question.locale,
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
          localizationV1: question.localizationV1,
          lifecycleV1: question.lifecycleV1,
        };
      });
    }).flat(),
  );
}

function reviewSamplerProjection() {
  return QL_IDS.flatMap((qlId) => {
    const seed = `localization-human-review-v1:${qlId}`;
    return LANGUAGES.map((language) => {
      const question = localizeCom002QuestionEditorialV1({ qlId, seed, language });
      return {
        qlId,
        language,
        seed,
        surfaceMode: question.surfaceMode,
        stem: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        explanation: question.explanation,
        sourceFactIds: [...question.sourceFactIds].sort(),
        solverAuthority: question.solverAuthority,
      };
    });
  });
}

export function computeCom002HiPaLocalizationFreezeFingerprintsV1() {
  const terminology = terminologyProjection();
  const corpus = localizedCorpusProjection();
  const sampler = reviewSamplerProjection();
  const englishCombinedFingerprint = COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint;
  const terminologyFingerprint = fingerprint(terminology);
  const localizedCorpusFingerprint = fingerprint(corpus);
  const reviewSamplerFingerprint = fingerprint(sampler);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    englishCombinedFingerprint,
    localizationVersion: COM002_LOCALIZATION_VERSION_V1,
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
    englishCombinedFingerprint,
    localizedQuestionCount: corpus.length,
    reviewSamplerQuestionCount: sampler.length,
    qlCount: QL_IDS.length,
    languages: LANGUAGES,
  };
}

export const COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V1 = {
  terminologyFingerprint: "PENDING",
  localizedCorpusFingerprint: "PENDING",
  reviewSamplerFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const;

/**
 * Candidate authority only. It must not be promoted to a frozen localization
 * authority until CI executes the complete parity corpus, prints/pins the exact
 * hashes, and the bilingual review sampler is accepted.
 */
export const COM002_HI_PA_LOCALIZATION_FREEZE_CANDIDATE_V1 = Object.freeze({
  candidateId: "COM-002-HI-PA-LOCALIZATION-FREEZE-CANDIDATE-V1" as const,
  chapterId: "COM-002" as const,
  cpRange: "COM-002-CP-001..COM-002-CP-002" as const,
  permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
  permanentQlCount: 13,
  status: "CANDIDATE_AWAITING_EXECUTED_PARITY_AND_REVIEW" as const,
  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  localizationVersion: COM002_LOCALIZATION_VERSION_V1,
  draftAuthority: COM002_LOCALIZATION_DRAFT_AUTHORITY_V1,
  englishFreezeAuthorityId: COM002_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  englishCombinedFingerprint: COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
  fingerprints: COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V1,
  expectedProof: {
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
    optionOrderImmutable: true,
    correctIndexImmutable: true,
  },
  lifecycle: {
    englishV1Frozen: true,
    hindiPunjabiGenerationImplemented: true,
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
  nextGate: "COM002_LOCALIZATION_EXECUTED_PARITY_AND_HUMAN_REVIEW" as const,
});

export function auditCom002HiPaLocalizationFreezeCandidateV1() {
  const actual = computeCom002HiPaLocalizationFreezeFingerprintsV1();
  const pins = COM002_HI_PA_LOCALIZATION_FREEZE_PINS_V1;
  const issues: string[] = [];
  if (actual.localizedQuestionCount !== 1040) {
    issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  }
  if (actual.reviewSamplerQuestionCount !== 26) {
    issues.push(`REVIEW_SAMPLER_COUNT:${actual.reviewSamplerQuestionCount}`);
  }
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.englishCombinedFingerprint !== COM002_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint) {
    issues.push("ENGLISH_FREEZE_FINGERPRINT_DRIFT");
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
  return { valid: issues.length === 0, actual, pins, issues };
}
