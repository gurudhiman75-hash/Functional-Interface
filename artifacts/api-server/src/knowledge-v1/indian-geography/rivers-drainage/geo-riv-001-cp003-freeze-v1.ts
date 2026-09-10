import {
  GEO_RIV_001_CP003_REVIEW_BATCH_V2,
  auditGeoRiv001Cp003ReviewBatchV2,
} from "./geo-riv-001-cp003-review-batch-v2";

const audit = auditGeoRiv001Cp003ReviewBatchV2();
if (!audit.valid) {
  throw new Error(
    `GEO-RIV-001 CP003 cannot freeze an invalid V2 batch: ${audit.issues.join(", ")}`,
  );
}

export const GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP003-ENGLISH-FREEZE-V1" as const,
  chapterId: "GEO-RIV-001" as const,
  cpId: "GEO-RIV-001-CP003" as const,
  title: "Ganga River System" as const,
  sourceAuthority: "REVIEW-BATCH-V2-WITH-V2-EDITORIAL-HARDENING" as const,
  frozenAt: "2026-09-10" as const,
  approval: Object.freeze({
    status: "APPROVED" as const,
    mode: "EXPLICIT_HUMAN_EDITORIAL_APPROVAL" as const,
    language: "en" as const,
    wordingStandard: "SIMPLE_EXAM_LIKE" as const,
    visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT" as const,
  }),
  corpus: Object.freeze({
    questionCount: GEO_RIV_001_CP003_REVIEW_BATCH_V2.length,
    qlCount: new Set(GEO_RIV_001_CP003_REVIEW_BATCH_V2.map((q) => q.qlId)).size,
    difficultyCounts: Object.freeze({ ...audit.difficultyCounts }),
    semanticUniqueCount: audit.semanticUniqueCount,
    deterministic: true as const,
    sourceProvenanceRequired: true as const,
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
    "Any change to the approved CP003 stems, options, answers, explanations, difficulty labels, source/fact provenance, QL allocation, or editorial wording requires a new governed freeze version." as const,
});

export const GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1 = Object.freeze(
  GEO_RIV_001_CP003_REVIEW_BATCH_V2.map((question) =>
    Object.freeze({
      ...question,
      options: Object.freeze([...question.options]),
      sourceIds: Object.freeze([...question.sourceIds]),
      sourceFactIds: Object.freeze([...question.sourceFactIds]),
      freezeAuthorityId: GEO_RIV_001_CP003_FREEZE_AUTHORITY_V1.authorityId,
      authoringReviewApproved: true as const,
      immutableCorpus: true as const,
    }),
  ),
);

export type GeoRiv001Cp003FrozenQuestionV1 =
  (typeof GEO_RIV_001_CP003_FROZEN_QUESTIONS_V1)[number];
