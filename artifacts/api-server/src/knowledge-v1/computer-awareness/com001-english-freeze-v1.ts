import { createHash } from "node:crypto";

import { COM001_EDITORIALLY_APPROVED_FACTS } from "./com001-editorial-review";
import { COM001_MEMORY_STORAGE_QLS } from "./com001-memory-storage-ql-allocation";
import { generateCom001ReviewQuestion } from "./com001-review-synthesis";
import { COM001_STORAGE_DEVICE_PROFILES } from "./com001-storage-device-profiles";

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

function factProjection() {
  return COM001_EDITORIALLY_APPROVED_FACTS
    .map((fact) => ({
      factId: fact.factId,
      entityId: fact.entityId,
      chapterId: fact.chapterId,
      cpId: fact.cpId,
      relation: fact.relation,
      entity: fact.entity,
      value: fact.value,
      contextGroupId: fact.contextGroupId,
      distractorGroupIds: [...(fact.distractorGroupIds ?? [])].sort(),
      difficulty: fact.difficulty,
      examTags: [...fact.examTags].sort(),
      tags: [...fact.tags].sort(),
      source: fact.source,
      review: fact.review,
      freshness: fact.freshness,
    }))
    .sort((left, right) => left.factId.localeCompare(right.factId));
}

function qlProjection() {
  return COM001_MEMORY_STORAGE_QLS.map((ql) => ({
    qlId: ql.qlId,
    cpId: ql.cpId,
    sourceDecisionId: ql.sourceDecisionId,
    name: ql.name,
    learnerTask: ql.learnerTask,
    solveAuthority: ql.solveAuthority,
    relationFamilies: [...ql.relationFamilies],
    runtimeStatus: ql.runtimeStatus,
  }));
}

function storageProfileProjection() {
  return COM001_STORAGE_DEVICE_PROFILES
    .map((profile) => ({
      profileId: profile.profileId,
      label: profile.label,
      medium: profile.medium,
      accessPattern: profile.accessPattern,
      removable: profile.removable,
      persistent: profile.persistent,
      roles: [...profile.roles].sort(),
      sourceRefs: [...profile.sourceRefs]
        .map((source) => ({ ...source }))
        .sort((left, right) =>
          `${left.sourceId}:${left.locator ?? ""}`.localeCompare(
            `${right.sourceId}:${right.locator ?? ""}`,
          ),
        ),
      review: profile.review,
    }))
    .sort((left, right) => left.profileId.localeCompare(right.profileId));
}

function englishCorpusProjection() {
  return COM001_MEMORY_STORAGE_QLS.flatMap((ql) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v1:${ql.qlId}:${index}`;
      const question = generateCom001ReviewQuestion({ qlId: ql.qlId, seed });
      return {
        qlId: question.qlId,
        seed,
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

export function computeCom001EnglishFreezeFingerprintsV1() {
  const facts = factProjection();
  const qls = qlProjection();
  const profiles = storageProfileProjection();
  const corpus = englishCorpusProjection();
  const factFingerprint = fingerprint(facts);
  const qlFingerprint = fingerprint(qls);
  const storageProfileFingerprint = fingerprint(profiles);
  const englishCorpusFingerprint = fingerprint(corpus);
  const combinedFingerprint = fingerprint({
    factFingerprint,
    qlFingerprint,
    storageProfileFingerprint,
    englishCorpusFingerprint,
  });
  return {
    factFingerprint,
    qlFingerprint,
    storageProfileFingerprint,
    englishCorpusFingerprint,
    combinedFingerprint,
    approvedFactCount: facts.length,
    permanentQlCount: qls.length,
    storageProfileCount: profiles.length,
    frozenQuestionCount: corpus.length,
  };
}

export const COM001_ENGLISH_FREEZE_PINS_V1 = {
  factFingerprint: "8c8439aa528bf3fad92fad0b025dae3dd58bb725bd3c04a0919c665bd8231e54",
  qlFingerprint: "d47a1d18449bd8831c55f7d289d952f2c017d23b3a9b28c66eabd16a02a22d1b",
  storageProfileFingerprint: "48c02d729285d489019ddeceb5b3ab41aea5dc2e8e1e661c993c25a98fe1bd6b",
  englishCorpusFingerprint: "56b5f95d3ddc770c19750dbe62a3c072d8e11cd388d2e0f5003b85590c7deda6",
  combinedFingerprint: "986a444f0fec27a47a21471ec98dde426bf1cf5f9fac9905c38900f511bf5bcf",
} as const;

export const COM001_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-ENGLISH-FREEZE-V1" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "ENGLISH_EDITORIAL_AUTHORITY_FROZEN" as const,
  permanentQlRange: "COM-001-QL-001..COM-001-QL-009" as const,
  permanentQlCount: 9,
  approvedFactCount: 73,
  heldFactCount: 3,
  rejectedFactCount: 1,
  exactReviewedAuthority: {
    headSha: "0f79cd080eb8c82f62df35d9c2eaa37eb0ffc444" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 79,
    workflowRunId: 32707689257,
    workflowJobId: 97372211884,
    reviewSynthesisQuestions: 360,
    editorialQualityAuditQuestions: 360,
    reviewVerdict: "APPROVED_NO_REMAINING_ENGLISH_EDITORIAL_BLOCKER_IN_APPROVED_SCOPE" as const,
  },
  fingerprints: COM001_ENGLISH_FREEZE_PINS_V1,
  qls: COM001_MEMORY_STORAGE_QLS.map((ql) => ({
    qlId: ql.qlId,
    name: ql.name,
    solveAuthority: ql.solveAuthority,
    englishReviewSynthesisImplemented: true as const,
    englishEditorialSurfaceFrozen: true as const,
  })),
  proofGuarantees: {
    exactApprovedFactCount: 73,
    exactPermanentQlCount: 9,
    frozenQuestionsPerQl: 40,
    totalFrozenEnglishQuestions: 360,
    deterministicReplay: true,
    exactlyFourUniqueOptions: true,
    canonicalAnswerVerified: true,
    answerPositionSpreadChecked: true,
    stemDiversityChecked: true,
    answerObjectDiversityChecked: true,
    blockedSourcesExcluded: true,
    heldRejectedFactsExcluded: true,
    ambiguousSramLayerRejected: true,
    ambiguousKb1024WordingRejected: true,
    explicitSiIecCapacityConvention: true,
    internalEngineLanguageRejected: true,
    humanFacingExplanationAudit: true,
  },
  lifecycle: {
    englishEditorialAuthorityFrozen: true,
    englishReviewSynthesisFrozen: true,
    questionStudioDiscoverable: false,
    questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
    persistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    hindiPunjabiGeneration: false,
    hindiPunjabiLocalizationFrozen: false,
  },
  invalidationRule:
    "Any material change to approved facts, QL allocation/ownership, storage profiles, stems, options, answers, explanations, provenance, or deterministic generation must change a pinned fingerprint and requires a new English freeze authority version.",
  nextGate: "COM001_HINDI_PUNJABI_LOCALIZATION_AND_REVIEW" as const,
} as const;

export function auditCom001EnglishFreezeV1() {
  const actual = computeCom001EnglishFreezeFingerprintsV1();
  const issues: string[] = [];
  const pins = COM001_ENGLISH_FREEZE_PINS_V1;

  if (actual.approvedFactCount !== 73) {
    issues.push(`APPROVED_FACT_COUNT:${actual.approvedFactCount}`);
  }
  if (actual.permanentQlCount !== 9) {
    issues.push(`PERMANENT_QL_COUNT:${actual.permanentQlCount}`);
  }
  if (actual.storageProfileCount !== 6) {
    issues.push(`STORAGE_PROFILE_COUNT:${actual.storageProfileCount}`);
  }
  if (actual.frozenQuestionCount !== 360) {
    issues.push(`FROZEN_QUESTION_COUNT:${actual.frozenQuestionCount}`);
  }

  for (const key of [
    "factFingerprint",
    "qlFingerprint",
    "storageProfileFingerprint",
    "englishCorpusFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
    }
  }

  return {
    valid: issues.length === 0,
    actual,
    pins,
    issues,
  };
}
