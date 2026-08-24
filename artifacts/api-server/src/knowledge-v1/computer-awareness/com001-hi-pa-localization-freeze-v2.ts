import { createHash } from "node:crypto";

import { COM001_ENGLISH_FREEZE_AUTHORITY_V2 } from "./com001-english-freeze-v2";
import {
  COM001_LOCALIZATION_AUTHORITY_DRAFT_V2,
  COM001_LOCALIZATION_VERSION_V2,
  generateCom001LocalizedReviewQuestionV2,
} from "./com001-localization-v2";
import { COM001_TERMINOLOGY_REGISTRY_V1 } from "./com001-localization-v1";
import { listCom001ReviewV2QlIds } from "./com001-review-synthesis-v2";

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

function localizedV2CorpusProjection() {
  return listCom001ReviewV2QlIds().flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `localization-freeze-v2:${qlId}:${index}`;
      return (["hi", "pa"] as const).map((language) => {
        const question = generateCom001LocalizedReviewQuestionV2({ qlId, seed, language });
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
          sourceFactIds: [...question.sourceFactIds].sort(),
          solverAuthority: question.solverAuthority,
          reviewV2Mode: question.reviewV2Mode,
          relationalSurfaceMode: question.relationalSurfaceMode ?? null,
          capacityConvention: question.capacityConvention ?? null,
          reviewOnly: question.reviewOnly,
          runtimeRegistered: question.runtimeRegistered,
          localizationV2: question.localizationV2,
          lifecycleV2: question.lifecycleV2,
        };
      });
    }).flat(),
  );
}

export function computeCom001HiPaLocalizationFreezeFingerprintsV2() {
  const terminology = terminologyProjection();
  const corpus = localizedV2CorpusProjection();
  const englishCombinedFingerprint =
    COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint;
  const terminologyFingerprint = fingerprint(terminology);
  const localizedV2CorpusFingerprint = fingerprint(corpus);
  const combinedFingerprint = fingerprint({
    englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
    englishCombinedFingerprint,
    localizationVersion: COM001_LOCALIZATION_VERSION_V2,
    terminologyFingerprint,
    localizedV2CorpusFingerprint,
    humanReviewApproval: "COM001_HUMAN_REVIEW_WAVE1_APPROVED_2026-08-24",
  });
  return {
    terminologyFingerprint,
    localizedV2CorpusFingerprint,
    combinedFingerprint,
    englishCombinedFingerprint,
    localizedQuestionCount: corpus.length,
    qlCount: listCom001ReviewV2QlIds().length,
    languages: ["hi", "pa"] as const,
  };
}

export const COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V2 = {
  terminologyFingerprint: "476c735a5ba563e74d416da66db94123e102dd97b9675bbbd835c332b9bd756f",
  localizedV2CorpusFingerprint: "27691272e3bac13bb29a09b9464813ff46b48db008c69d0a301136a3c91ae2ce",
  combinedFingerprint: "5418e3c9f6dac56611fe38fc47b30b84ff005d6ad105a699767d3c90f8776031",
} as const;

export const COM001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V2 = {
  authorityId: "COM-001-HI-PA-LOCALIZATION-FREEZE-V2" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "HI_PA_HUMAN_REVIEWED_V2_LOCALIZATION_FROZEN" as const,
  permanentQlRange: "COM-001-QL-001..COM-001-QL-009" as const,
  permanentQlCount: 9,
  supportedLanguages: ["en", "hi", "pa"] as const,
  locales: ["en-IN", "hi-IN", "pa-IN"] as const,
  localizationVersion: COM001_LOCALIZATION_VERSION_V2,
  supersedesDraftAuthority: COM001_LOCALIZATION_AUTHORITY_DRAFT_V2,
  englishFreezeAuthorityId: COM001_ENGLISH_FREEZE_AUTHORITY_V2.authorityId,
  englishCombinedFingerprint:
    COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint,
  fingerprints: COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V2,
  exactReviewedAuthority: {
    headSha: "e011aa13fadaad9791dd825c30aaa913000bc35d" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 150,
    workflowRunId: 32732205856,
    workflowJobId: 97446838823,
    localizedParityQuestions: 720,
    questionsPerQlPerLanguage: 40,
    reviewMethod:
      "DETERMINISTIC_HI_PA_V2_PARITY_AUDIT_OVER_FROZEN_ENGLISH_V2_AUTHORITY" as const,
    reviewVerdict:
      "APPROVED_NO_REMAINING_HI_PA_V2_SEMANTIC_PARITY_BLOCKER_IN_FROZEN_SCOPE" as const,
  },
  invariants: {
    englishV2SemanticAuthorityImmutable: true,
    questionIdImmutable: true,
    qlImmutable: true,
    sourceFactsImmutable: true,
    sourceAuthorityImmutable: true,
    solverAuthorityImmutable: true,
    reviewV2ModeImmutable: true,
    relationalSurfaceModeImmutable: true,
    capacityConventionImmutable: true,
    optionOrderImmutable: true,
    correctIndexImmutable: true,
    deterministicReplayRequired: true,
    targetScriptRequired: true,
    crossScriptLeakageRejected: true,
    learnerFacingEnglishProseLeakageRejected: true,
    ql007RdxLearnerSurfaceExcluded: true,
    traditionalExam1024ConventionPreserved: true,
    siIecCapacityConventionPreservedSeparately: true,
  },
  lifecycle: {
    englishV2Frozen: true,
    hindiPunjabiV2Generation: true,
    localizationV2Frozen: true,
    questionStudioV2Active: false,
    reviewRunPersistenceAllowed: false,
    canonicalQuestionPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  invalidationRule:
    "Any material change to Hindi/Punjabi V2 terminology, learner-facing text, option order, answer index, provenance, V2 surface metadata, deterministic generation, or the bound English V2 authority must change a pinned fingerprint and requires a new localization freeze authority version.",
  nextGate: "COM001_QUESTION_STUDIO_REVIEW_ONLY_V2_SWITCH" as const,
} as const;

export function auditCom001HiPaLocalizationFreezeV2() {
  const actual = computeCom001HiPaLocalizationFreezeFingerprintsV2();
  const pins = COM001_HI_PA_LOCALIZATION_FREEZE_PINS_V2;
  const issues: string[] = [];

  if (actual.localizedQuestionCount !== 720) {
    issues.push(`LOCALIZED_QUESTION_COUNT:${actual.localizedQuestionCount}`);
  }
  if (actual.qlCount !== 9) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (
    actual.englishCombinedFingerprint !==
    COM001_ENGLISH_FREEZE_AUTHORITY_V2.fingerprints.combinedFingerprint
  ) {
    issues.push("ENGLISH_V2_FREEZE_FINGERPRINT_DRIFT");
  }

  for (const key of [
    "terminologyFingerprint",
    "localizedV2CorpusFingerprint",
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
