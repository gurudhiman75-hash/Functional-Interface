import {
  GEO_RIV_001_CP008_REVIEW_BATCH_V5,
  auditGeoRiv001Cp008ReviewBatchV5,
} from "./geo-riv-001-cp008-review-batch-v5";

const audit = auditGeoRiv001Cp008ReviewBatchV5();
if (!audit.valid) {
  throw new Error(
    `GEO-RIV-001 CP008 cannot freeze an invalid V5 batch: ${audit.issues.join(", ")}`,
  );
}

export const GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP008-ENGLISH-FREEZE-V1" as const,
  chapterId: "GEO-RIV-001" as const,
  cpId: "GEO-RIV-001-CP008" as const,
  title: "Sources, Origins & Mouths" as const,
  sourceAuthority: "REVIEW-BATCH-V5-WITH-EDITORIAL-HARDENING" as const,
  frozenAt: "2026-09-11" as const,
  approval: Object.freeze({
    status: "APPROVED" as const,
    mode: "EXPLICIT_HUMAN_EDITORIAL_APPROVAL" as const,
    language: "en" as const,
    wordingStandard: "SIMPLE_EXAM_LIKE" as const,
    visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT" as const,
  }),
  corpus: Object.freeze({
    questionCount: GEO_RIV_001_CP008_REVIEW_BATCH_V5.length,
    qlCount: new Set(GEO_RIV_001_CP008_REVIEW_BATCH_V5.map((q) => q.qlId)).size,
    difficultyCounts: Object.freeze({ ...audit.difficultyCounts }),
    semanticUniqueCount: new Set(
      GEO_RIV_001_CP008_REVIEW_BATCH_V5.map(
        (q) => `${q.qlId}|${q.stem}|${q.canonicalAnswer}`,
      ),
    ).size,
    deterministic: true as const,
    sourceProvenanceRequired: true as const,
    upstreamFactLineageRequired: true as const,
    cp006HeldOutAtFreeze: true as const,
  }),
  lifecycle: Object.freeze({
    questionStudioDiscoverable: true as const,
    questionStudioGenerationEnabled: true as const,
    runtimeStage: "REVIEW_ONLY" as const,
    frozenCorpusOnly: true as const,
    readOnly: true as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    productionReleaseAuthorized: false as const,
  }),
  replacementRule:
    "Any change to the approved CP008 stems, options, answers, explanations, difficulty labels, source/fact provenance, upstream lineage, QL allocation, or editorial wording requires a new governed freeze version." as const,
});

export const GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1 = Object.freeze(
  GEO_RIV_001_CP008_REVIEW_BATCH_V5.map((question) =>
    Object.freeze({
      ...question,
      options: Object.freeze([...question.options]),
      sourceIds: Object.freeze([...question.sourceIds]),
      sourceFactIds: Object.freeze([...question.sourceFactIds]),
      upstreamFactIds: Object.freeze([...question.upstreamFactIds]),
      freezeAuthorityId: GEO_RIV_001_CP008_FREEZE_AUTHORITY_V1.authorityId,
      authoringReviewApproved: true as const,
      immutableCorpus: true as const,
    }),
  ),
);

export type GeoRiv001Cp008FrozenQuestionV1 =
  (typeof GEO_RIV_001_CP008_FROZEN_QUESTIONS_V1)[number];
