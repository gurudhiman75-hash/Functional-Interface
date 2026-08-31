import { createHash } from "node:crypto";

import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com001-english-freeze-v1";
import {
  COM001_LOCALIZATION_AUTHORITY_DRAFT_V1,
  COM001_LOCALIZATION_VERSION_V1,
  COM001_TERMINOLOGY_REGISTRY_V1,
  generateCom001LocalizedReviewQuestionV1,
} from "./com001-localization-v1";
import { listCom001ReviewQlIds } from "./com001-review-synthesis";

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

function terminologyProjection() {
  return Object.entries(COM001_TERMINOLOGY_REGISTRY_V1)
    .map(([english, localized]) => ({ english, hi: localized.hi, pa: localized.pa }))
    .sort((left, right) => left.english.localeCompare(right.english));
}

function localizedCorpusProjection() {
  return listCom001ReviewQlIds().flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `localization-v1:${qlId}:${index}`;
      return (["hi", "pa"] as const).map((language) => {
        const question = generateCom001LocalizedReviewQuestionV1({ qlId, seed, language });
        return {
          qlId: question.qlId,
          seed,
          language: question.language,
          locale: question.locale,
          questionId: question.questionId,
          stem: question.stem,
          options: [...question.options],
          correctIndex: question.correctIndex,
          canonicalAnswer: question.canonicalAnswer,
          explanation: question.explanation,
          sourceIds: [...question.sourceIds].sort(),
          sourceFactIds: [...question.sourceFactIds],
          solverAuthority: question.solverAuthority,
          reviewOnly: question.reviewOnly,
          runtimeRegistered: question.runtimeRegistered,
          localization: question.localization,
          lifecycle: question.lifecycle,
        };
      });
    }).flat(),
  );
}

export function computeCom001HiPaLocalizationFreezeFingerprintsV1() {
  const terminology = terminologyProjection();
  const corpus = localizedCorpusProjection();
  const englishCombinedFingerprint =
    COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint;
  const terminologyFingerprint = fingerprint(terminology);
  const localizedCorpusFingerprint = fingerprint(corpus);
  const combinedFingerprint = fingerprint({
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    englishCombinedFingerprint,
    localizationVersion: COM001_LOCALIZATION_VERSION_V1,
    terminologyFingerprint,
    localizedCorpusFingerprint,
  });
  return {
    terminologyFingerprint,
    localizedCorpusFingerprint,
    combinedFingerprint,
    englishCombinedFingerprint,
    localizedQuestionCount: corpus.length,
    qlCount: listCom001ReviewQlIds().length,
    languages: ["hi", "pa"] as const,
  };
}

export const COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V1 = {
  terminologyFingerprint: "476c735a5ba563e74d416da66db94123e102dd97b9675bbbd835c332b9bd756f",
  localizedCorpusFingerprint: "955aaf7d5050df7035f6b66a9bd403f4b0031b416c5e042c6da92e38fc9c53cb",
  combinedFingerprint: "7bb9c0b308dd8a42362efc7990b7235ff1a189a51334bc437a23de5a613e05aa",
} as const;

export const COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-HI-PA-LOCALIZATION-FREEZE-V1" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "HI_PA_LOCALIZATION_FROZEN" as const,
  permanentQlRange: "COM-001-QL-001..COM-001-QL-009" as const,
  permanentQlCount: 9,
  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  localizationVersion: COM001_LOCALIZATION_VERSION_V1,
  supersedesDraftAuthority: COM001_LOCALIZATION_AUTHORITY_DRAFT_V1,
  englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  englishCombinedFingerprint:
    COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
  fingerprints: COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V1,
  exactReviewedAuthority: {
    headSha: "07f23b50295e85533ea2672fa5f3213a00db486a" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 90,
    workflowRunId: 32710230920,
    workflowJobId: 97379846811,
    localizedParityQuestions: 720,
    questionsPerQlPerLanguage: 40,
    reviewMethod:
      "DETERMINISTIC_HI_PA_PARITY_AUDIT_OVER_FROZEN_ENGLISH_AUTHORITY" as const,
    reviewVerdict:
      "APPROVED_NO_REMAINING_HI_PA_SEMANTIC_OR_SCRIPT_BLOCKER_IN_FROZEN_SCOPE" as const,
  },
  invariants: {
    englishSemanticAuthorityImmutable: true,
    questionIdImmutable: true,
    qlImmutable: true,
    sourceFactsImmutable: true,
    sourceAuthorityImmutable: true,
    solverAuthorityImmutable: true,
    optionOrderImmutable: true,
    correctIndexImmutable: true,
    deterministicReplayRequired: true,
    targetScriptRequired: true,
    crossScriptLeakageRejected: true,
    learnerFacingEnglishProseLeakageRejected: true,
    heldRejectedFactsExcluded: true,
    ambiguousSramLayerExcluded: true,
    siIecCapacityConventionPreserved: true,
  },
  lifecycle: {
    englishFrozen: true,
    hindiPunjabiGeneration: true,
    localizationFrozen: true,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  invalidationRule:
    "Any material change to Hindi/Punjabi terminology, stems, options, answers, explanations, source trace, localization metadata, deterministic generation, or the bound English freeze authority must change a pinned fingerprint and requires a new localization freeze authority version.",
  nextGate: "COM001_REVIEW_ONLY_QUESTION_STUDIO_REGISTRATION_AND_BATCH_AUDIT" as const,
} as const;

export function auditCom001HiPaLocalizationFreezeV1() {
  const actual = computeCom001HiPaLocalizationFreezeFingerprintsV1();
  const pins = COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V1;
  const issues: string[] = [];

  if (actual.localizedQuestionCount !== 720) {
    issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  }
  if (actual.qlCount !== 9) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (
    actual.englishCombinedFingerprint !==
    COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint
  ) {
    issues.push("ENGLISH_FREEZE_FINGERPRINT_DRIFT");
  }

  for (const key of [
    "terminologyFingerprint",
    "localizedCorpusFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(
        `FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`,
      );
    }
  }

  return { valid: issues.length === 0, actual, pins, issues };
}
