import { createHash } from "node:crypto";

import { COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1 } from "./com002-english-human-review-integrity-v1";
import {
  COM002_LOCALIZATION_VERSION_V2,
  localizeCom002QuestionV2,
} from "./com002-localization-v2";
import { COM002_TERMINOLOGY_REGISTRY_V1 } from "./com002-localization-lexicon-v1";
import {
  COM002_ENGLISH_GENERATOR_VERSION_V3,
  generateCom002ReviewQuestionV3,
  listCom002ReviewV3QlIds,
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

const LANGUAGES = ["hi", "pa"] as const;

function terminologyProjection() {
  return Object.entries(COM002_TERMINOLOGY_REGISTRY_V1)
    .map(([english, localized]) => ({ english, hi: localized.hi, pa: localized.pa }))
    .sort((left, right) => left.english.localeCompare(right.english));
}

function englishCorpusProjectionV3() {
  return listCom002ReviewV3QlIds().flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v3:${qlId}:${index}`;
      const question = generateCom002ReviewQuestionV3({ qlId, seed });
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

function englishHumanReviewProjectionV3() {
  return listCom002ReviewV3QlIds().flatMap((qlId) =>
    (["A", "B"] as const).map((suffix) => {
      const seed = `human-review-wave1:${qlId}:${suffix}`;
      const question = generateCom002ReviewQuestionV3({ qlId, seed });
      return {
        qlId,
        seed,
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
  );
}

function localizedCorpusProjectionV2() {
  return listCom002ReviewV3QlIds().flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v3:${qlId}:${index}`;
      return LANGUAGES.map((language) => {
        const question = localizeCom002QuestionV2({ qlId, seed, language });
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
          localizationV2: question.localizationV2,
          lifecycleV2: question.lifecycleV2,
        };
      });
    }).flat(),
  );
}

function localizedReviewSamplerProjectionV2() {
  return listCom002ReviewV3QlIds().flatMap((qlId) => {
    const seed = `localization-human-review-v2:${qlId}`;
    return LANGUAGES.map((language) => {
      const question = localizeCom002QuestionV2({ qlId, seed, language });
      return {
        qlId,
        seed,
        language,
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

export function computeCom002V3V2FreezeCandidateFingerprints() {
  const terminology = terminologyProjection();
  const englishCorpus = englishCorpusProjectionV3();
  const englishHumanReview = englishHumanReviewProjectionV3();
  const localizedCorpus = localizedCorpusProjectionV2();
  const localizedReviewSampler = localizedReviewSamplerProjectionV2();

  const englishCorpusFingerprint = fingerprint(englishCorpus);
  const englishHumanReviewFingerprint = fingerprint(englishHumanReview);
  const terminologyFingerprint = fingerprint(terminology);
  const localizedCorpusFingerprint = fingerprint(localizedCorpus);
  const localizedReviewSamplerFingerprint = fingerprint(localizedReviewSampler);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
    localizationVersion: COM002_LOCALIZATION_VERSION_V2,
    englishHumanReviewIntegrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.authorityId,
    englishHumanReviewIntegrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.status,
    explicitEnglishApprovalVerified: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.explicitApprovalVerified,
    englishCorpusFingerprint,
    englishHumanReviewFingerprint,
    terminologyFingerprint,
    localizedCorpusFingerprint,
    localizedReviewSamplerFingerprint,
  });

  return {
    englishCorpusFingerprint,
    englishHumanReviewFingerprint,
    terminologyFingerprint,
    localizedCorpusFingerprint,
    localizedReviewSamplerFingerprint,
    combinedFingerprint,
    englishQuestionCount: englishCorpus.length,
    englishHumanReviewQuestionCount: englishHumanReview.length,
    localizedQuestionCount: localizedCorpus.length,
    localizedReviewSamplerQuestionCount: localizedReviewSampler.length,
    qlCount: listCom002ReviewV3QlIds().length,
    languages: LANGUAGES,
  };
}

export const COM002_V3_V2_FREEZE_CANDIDATE_PINS = Object.freeze({
  englishCorpusFingerprint: "PENDING",
  englishHumanReviewFingerprint: "PENDING",
  terminologyFingerprint: "PENDING",
  localizedCorpusFingerprint: "PENDING",
  localizedReviewSamplerFingerprint: "PENDING",
  combinedFingerprint: "PENDING",
} as const);

export const COM002_V3_V2_FREEZE_CANDIDATE = Object.freeze({
  candidateId: "COM-002-V3-V2-FREEZE-CANDIDATE-1" as const,
  chapterId: "COM-002" as const,
  permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
  permanentQlCount: 13,
  status: "HASH_READY_BLOCKED_PENDING_V3_EXECUTION_PACK_AND_EXPLICIT_APPROVAL" as const,
  englishGeneratorVersion: COM002_ENGLISH_GENERATOR_VERSION_V3,
  localizationVersion: COM002_LOCALIZATION_VERSION_V2,
  englishIntegrityAuthorityId: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.authorityId,
  englishIntegrityStatus: COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.status,
  expectedProof: {
    englishQuestions: 520,
    englishHumanReviewQuestions: 26,
    localizedQuestions: 1040,
    localizedHumanReviewQuestions: 26,
    questionsPerQl: 40,
    localizedQuestionsPerQlPerLanguage: 40,
    deterministicReplayRequired: true,
    semanticStateInvariant: true,
    optionOrderInvariant: true,
    correctIndexInvariant: true,
    provenanceInvariant: true,
    ql004SafetyRemediationRequired: true,
    ql013SafeRelationCompositionRequired: true,
  },
  pins: COM002_V3_V2_FREEZE_CANDIDATE_PINS,
  promotionAllowed: false,
  blockers: [
    "V3_520_AUDIT_NOT_EXECUTED_GREEN",
    "V3_26_QUESTION_REVIEW_PACK_NOT_MATERIALIZED",
    "V3_EXPLICIT_PRODUCT_OWNER_APPROVAL_NOT_VERIFIED",
    "NEW_V3_ENGLISH_FREEZE_AUTHORITY_NOT_CREATED",
    "V2_LOCALIZATION_PARITY_NOT_EXECUTED_GREEN",
    "V2_LOCALIZATION_HUMAN_REVIEW_NOT_ACCEPTED",
  ] as const,
  lifecycle: {
    englishV3Frozen: false,
    localizationV2Frozen: false,
    questionStudioDiscoverable: false,
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
  nextGate: "COM002_EXECUTE_V3_V2_AUDITS_AND_MATERIALIZE_EXACT_REVIEW_PACKS" as const,
});

export function auditCom002V3V2FreezeCandidate() {
  const actual = computeCom002V3V2FreezeCandidateFingerprints();
  const issues: string[] = [];

  if (actual.englishQuestionCount !== 520) issues.push(`ENGLISH_COUNT:${actual.englishQuestionCount}`);
  if (actual.englishHumanReviewQuestionCount !== 26) {
    issues.push(`ENGLISH_REVIEW_COUNT:${actual.englishHumanReviewQuestionCount}`);
  }
  if (actual.localizedQuestionCount !== 1040) {
    issues.push(`LOCALIZED_COUNT:${actual.localizedQuestionCount}`);
  }
  if (actual.localizedReviewSamplerQuestionCount !== 26) {
    issues.push(`LOCALIZED_REVIEW_COUNT:${actual.localizedReviewSamplerQuestionCount}`);
  }
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (!COM002_ENGLISH_HUMAN_REVIEW_INTEGRITY_V1.explicitApprovalVerified) {
    issues.push("EXPLICIT_V3_ENGLISH_APPROVAL_NOT_VERIFIED");
  }

  for (const key of [
    "englishCorpusFingerprint",
    "englishHumanReviewFingerprint",
    "terminologyFingerprint",
    "localizedCorpusFingerprint",
    "localizedReviewSamplerFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== COM002_V3_V2_FREEZE_CANDIDATE_PINS[key]) {
      issues.push(
        `FINGERPRINT_MISMATCH:${key}:expected=${COM002_V3_V2_FREEZE_CANDIDATE_PINS[key]}:actual=${actual[key]}`,
      );
    }
  }

  return {
    valid: issues.length === 0,
    promotable: false as const,
    hashProbeComputed: true as const,
    actual,
    pins: COM002_V3_V2_FREEZE_CANDIDATE_PINS,
    issues,
  };
}
