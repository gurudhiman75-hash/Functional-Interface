import { createHash } from "node:crypto";

import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";

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

const COM002_QL_IDS = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);

function englishCorpusProjection() {
  return COM002_QL_IDS.flatMap((qlId) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v1:${qlId}:${index}`;
      const question = generateCom002ReviewQuestionV2({ qlId, seed });
      return {
        qlId: question.qlId,
        seed,
        questionId: question.questionId,
        surfaceMode: question.surfaceMode,
        stem: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        explanation: question.explanation,
        sourceIds: [...question.sourceIds].sort(),
        sourceFactIds: [...question.sourceFactIds].sort(),
        targetFactId: question.targetFactId,
        solverAuthority: question.solverAuthority,
        reviewOnly: question.reviewOnly,
        runtimeRegistered: question.runtimeRegistered,
      };
    }),
  );
}

function humanReviewProjection() {
  return COM002_QL_IDS.flatMap((qlId) =>
    (["A", "B"] as const).map((suffix) => {
      const seed = `human-review-wave1:${qlId}:${suffix}`;
      const question = generateCom002ReviewQuestionV2({ qlId, seed });
      return {
        qlId,
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
    }),
  );
}

export function computeCom002EnglishFreezeFingerprintsV1() {
  const corpus = englishCorpusProjection();
  const humanReview = humanReviewProjection();
  const englishCorpusFingerprint = fingerprint(corpus);
  const humanReviewFingerprint = fingerprint(humanReview);
  const combinedFingerprint = fingerprint({
    chapterId: "COM-002",
    qlRange: "COM-002-QL-001..COM-002-QL-013",
    englishCorpusFingerprint,
    humanReviewFingerprint,
    humanReviewApproval: "COM002_HUMAN_REVIEW_WAVE1_APPROVED_2026-08-27",
    reviewedFeatureHeadSha: "74127c78c3767415d9d6e9841e9a0e1b8f2ebd65",
    reviewedPullRequestMergeSha: "1fc35f1b102c868f9621f4173d9661b3e0c7fe14",
    reviewedWorkflowRunId: 32986049236,
  });
  return {
    englishCorpusFingerprint,
    humanReviewFingerprint,
    combinedFingerprint,
    qlCount: COM002_QL_IDS.length,
    frozenQuestionCount: corpus.length,
    humanReviewQuestionCount: humanReview.length,
  };
}

export const COM002_ENGLISH_FREEZE_PINS_V1 = {
  englishCorpusFingerprint: "d6a102066f42241cfa9f41538a3a12eb91c809844abb04e735ee9bab1f70893f",
  humanReviewFingerprint: "191a6378299e31f006e04d878358c1d05045b5620dd403a033702fdc26a70e74",
  combinedFingerprint: "37b898c5390467705eea6975b3c55d2421425db118ca84fb8df2f4de17288199",
} as const;

export const COM002_ENGLISH_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-002-ENGLISH-FREEZE-V1" as const,
  chapterId: "COM-002" as const,
  cpRange: "COM-002-CP-001..COM-002-CP-002" as const,
  permanentQlRange: "COM-002-QL-001..COM-002-QL-013" as const,
  permanentQlCount: 13,
  status: "ENGLISH_HUMAN_REVIEWED_V1_AUTHORITY_FROZEN" as const,
  humanReview: {
    status: "APPROVED" as const,
    approvedOn: "2026-08-27" as const,
    approvalSource: "CHAT_OPERATOR_APPROVAL" as const,
    reviewedQuestionCount: 26,
  },
  exactReviewedAuthority: {
    featureHeadSha: "74127c78c3767415d9d6e9841e9a0e1b8f2ebd65" as const,
    pullRequestMergeSha: "1fc35f1b102c868f9621f4173d9661b3e0c7fe14" as const,
    pullRequestNumber: 1019,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 278,
    workflowRunId: 32986049236,
    workflowJobId: 98232038829,
    englishAuditQuestions: 520,
    humanReviewQuestions: 26,
    verdict: "PASS" as const,
  },
  proofGuarantees: {
    deterministicReplay: true,
    exactlyFourUniqueOptions: true,
    canonicalAnswerVerified: true,
    answerPositionSpreadChecked: true,
    stemDiversityChecked: true,
    answerObjectDiversityChecked: true,
    solveModeCoverageChecked: true,
    blockedSourcesExcluded: true,
    heldRejectedFactsExcluded: true,
    jpegAliasAmbiguityProtected: true,
    validatorOnlyDeletionCaveatExcluded: true,
    internalEngineLanguageRejected: true,
    knownGrammarRegressionsRejected: true,
  },
  fingerprints: COM002_ENGLISH_FREEZE_PINS_V1,
  lifecycle: {
    englishV1AuthorityFrozen: true,
    hindiPunjabiLocalizationFrozen: false,
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
  invalidationRule:
    "Any material change to COM-002 English learner-facing text, option order, correct answer index, canonical answer, provenance, solver authority, permanent QL scope, deterministic generation, or the reviewed human-review seeds requires a new English freeze authority version.",
  nextGate: "COM002_HINDI_PUNJABI_LOCALIZATION_V1" as const,
});

export function auditCom002EnglishFreezeV1() {
  const actual = computeCom002EnglishFreezeFingerprintsV1();
  const pins = COM002_ENGLISH_FREEZE_PINS_V1;
  const issues: string[] = [];
  if (actual.qlCount !== 13) issues.push(`QL_COUNT:${actual.qlCount}`);
  if (actual.frozenQuestionCount !== 520) issues.push(`FROZEN_QUESTION_COUNT:${actual.frozenQuestionCount}`);
  if (actual.humanReviewQuestionCount !== 26) issues.push(`HUMAN_REVIEW_COUNT:${actual.humanReviewQuestionCount}`);
  for (const key of ["englishCorpusFingerprint", "humanReviewFingerprint", "combinedFingerprint"] as const) {
    if (actual[key] !== pins[key]) {
      issues.push(`FINGERPRINT_MISMATCH:${key}:expected=${pins[key]}:actual=${actual[key]}`);
    }
  }
  return { valid: issues.length === 0, actual, pins, issues };
}
