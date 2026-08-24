import { createHash } from "node:crypto";

import { COM001_ENGLISH_FREEZE_AUTHORITY_V1 } from "./com001-english-freeze-v1";
import { COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2 } from "./com001-human-review-pyq-evidence-v2";
import { COM001_MEMORY_STORAGE_QLS } from "./com001-memory-storage-ql-allocation";
import { generateCom001ReviewQuestionV2 } from "./com001-review-synthesis-v2";

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

function evidenceProjection() {
  return [...COM001_HUMAN_REVIEW_PYQ_EVIDENCE_V2]
    .map((entry) => ({ ...entry }))
    .sort((left, right) => left.evidenceId.localeCompare(right.evidenceId));
}

function englishV2CorpusProjection() {
  return COM001_MEMORY_STORAGE_QLS.flatMap((ql) =>
    Array.from({ length: 40 }, (_, index) => {
      const seed = `english-freeze-v2:${ql.qlId}:${index}`;
      const question = generateCom001ReviewQuestionV2({ qlId: ql.qlId, seed });
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
        reviewV2Mode: question.reviewV2Mode,
        relationalSurfaceMode: question.relationalSurfaceMode ?? null,
        capacityConvention: question.capacityConvention ?? null,
        reviewOnly: question.reviewOnly,
        runtimeRegistered: question.runtimeRegistered,
      };
    }),
  );
}

export function computeCom001EnglishFreezeFingerprintsV2() {
  const evidence = evidenceProjection();
  const corpus = englishV2CorpusProjection();
  const pyqEvidenceFingerprint = fingerprint(evidence);
  const englishV2CorpusFingerprint = fingerprint(corpus);
  const combinedFingerprint = fingerprint({
    baseV1CombinedFingerprint: COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
    pyqEvidenceFingerprint,
    englishV2CorpusFingerprint,
    humanReviewApproval: "COM001_HUMAN_REVIEW_WAVE1_APPROVED_2026-08-24",
  });
  return {
    pyqEvidenceFingerprint,
    englishV2CorpusFingerprint,
    combinedFingerprint,
    evidenceCount: evidence.length,
    frozenQuestionCount: corpus.length,
  };
}

export const COM001_ENGLISH_FREEZE_PINS_V2 = {
  pyqEvidenceFingerprint: "6a201416818d933953f0127974b5f7076062b224db1feb14080258c40473287e",
  englishV2CorpusFingerprint: "aa5e3039cc12134a098da04cf13cd77415886fe2f0f62521e218da0089264254",
  combinedFingerprint: "fb71a33d70adba10f3aad62a6d5d9f60b0740ed6d3881e832ded585dc4d879e9",
} as const;

export const COM001_ENGLISH_FREEZE_AUTHORITY_V2 = {
  authorityId: "COM-001-ENGLISH-FREEZE-V2" as const,
  chapterId: "COM-001" as const,
  cpId: "COM-001-CP-001" as const,
  status: "ENGLISH_HUMAN_REVIEWED_V2_AUTHORITY_FROZEN" as const,
  supersedesLearnerSurface: "COM-001-ENGLISH-FREEZE-V1" as const,
  preservesBaseFactAuthority: COM001_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  baseFactQlProfileFingerprint:
    COM001_ENGLISH_FREEZE_AUTHORITY_V1.fingerprints.combinedFingerprint,
  humanReview: {
    status: "APPROVED" as const,
    approvedOn: "2026-08-24" as const,
    approvedArtifact: "COM-001-HUMAN-REVIEW-WAVE-1.md" as const,
    prNumber: 1019,
    prCommentId: 5395655002,
  },
  exactReviewedAuthority: {
    headSha: "62d679027b9d13a0e9060f1146b4933b797bf555" as const,
    workflowName: "Validate Question Studio Content Engine Foundation V1" as const,
    workflowRunNumber: 143,
    workflowRunId: 32731323753,
    workflowJobId: 97443979126,
    englishV2AuditQuestions: 360,
    verdict: "PASS" as const,
  },
  semanticChangesFromV1: {
    grammarSafeQl002Ql003Explanations: true,
    ql001To005ForwardInverseOrMatchedPairCoverage: true,
    ql007RdxLearnerSurfaceRemoved: true,
    ql007MagneticTapePyqWeighting: true,
    ql009TraditionalExam1024ConventionAdded: true,
    ql009StrictSiIecModeRetainedSeparately: true,
    answerPositionSpreadHardened: true,
  },
  proofGuarantees: {
    permanentQlCount: 9,
    frozenQuestionsPerQl: 40,
    totalFrozenEnglishQuestions: 360,
    deterministicReplay: true,
    exactlyFourUniqueOptions: true,
    canonicalAnswerVerified: true,
    answerPositionSpreadChecked: true,
    stemDiversityChecked: true,
    answerObjectDiversityChecked: true,
    forwardInverseSurfaceCoverageChecked: true,
    blockedSourcesExcluded: true,
    heldRejectedFactsExcluded: true,
    ambiguousSramLayerExcluded: true,
    ql007RdxExcluded: true,
    ql009ExamAndStandardsConventionsSeparated: true,
    internalEngineLanguageRejected: true,
  },
  fingerprints: COM001_ENGLISH_FREEZE_PINS_V2,
  lifecycle: {
    englishV2AuthorityFrozen: true,
    hindiPunjabiV2LocalizationFrozen: false,
    questionStudioV2Active: false,
    canonicalPersistenceAllowed: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  nextGate: "COM001_HINDI_PUNJABI_LOCALIZATION_V2" as const,
} as const;

export function auditCom001EnglishFreezeV2() {
  const actual = computeCom001EnglishFreezeFingerprintsV2();
  const issues: string[] = [];
  if (actual.evidenceCount !== 3) issues.push(`PYQ_EVIDENCE_COUNT:${actual.evidenceCount}`);
  if (actual.frozenQuestionCount !== 360) {
    issues.push(`FROZEN_QUESTION_COUNT:${actual.frozenQuestionCount}`);
  }
  for (const key of [
    "pyqEvidenceFingerprint",
    "englishV2CorpusFingerprint",
    "combinedFingerprint",
  ] as const) {
    if (actual[key] !== COM001_ENGLISH_FREEZE_PINS_V2[key]) {
      issues.push(
        `FINGERPRINT_MISMATCH:${key}:expected=${COM001_ENGLISH_FREEZE_PINS_V2[key]}:actual=${actual[key]}`,
      );
    }
  }
  return { valid: issues.length === 0, actual, pins: COM001_ENGLISH_FREEZE_PINS_V2, issues };
}
