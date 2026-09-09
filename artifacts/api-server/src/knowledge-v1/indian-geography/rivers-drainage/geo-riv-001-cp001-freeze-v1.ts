import {
  GEO_RIV_001_CP001_REVIEW_BATCH_V2G,
  auditGeoRiv001Cp001ReviewBatchV2G,
} from "./geo-riv-001-cp001-review-batch-v2g";

const audit = auditGeoRiv001Cp001ReviewBatchV2G();
if (!audit.valid) {
  throw new Error(
    `GEO-RIV-001 CP001 cannot freeze an invalid V2G batch: ${audit.issues.join(", ")}`,
  );
}

export const GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1 = Object.freeze({
  authorityId: "GEO-RIV-001-CP001-ENGLISH-FREEZE-V1" as const,
  chapterId: "GEO-RIV-001" as const,
  cpId: "GEO-RIV-001-CP001" as const,
  title: "Drainage Basics & River Classification" as const,
  sourceAuthority: "V2G" as const,
  frozenAt: "2026-09-09" as const,
  approval: Object.freeze({
    status: "APPROVED" as const,
    mode: "EXPLICIT_HUMAN_EDITORIAL_APPROVAL" as const,
    language: "en" as const,
    wordingStandard: "SIMPLE_EXAM_LIKE" as const,
  }),
  corpus: Object.freeze({
    questionCount: GEO_RIV_001_CP001_REVIEW_BATCH_V2G.length,
    qlCount: new Set(GEO_RIV_001_CP001_REVIEW_BATCH_V2G.map((q) => q.qlId)).size,
    difficultyCounts: Object.freeze({ ...audit.difficultyCounts }),
    editorialSemanticUniqueCount: audit.editorialSemanticUniqueCount,
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
    "Any change to the approved V2G stems, options, answers, explanations, difficulty labels, source/fact provenance, or QL allocation requires a new governed freeze version." as const,
});

export const GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1 = Object.freeze(
  GEO_RIV_001_CP001_REVIEW_BATCH_V2G.map((question) =>
    Object.freeze({
      ...question,
      options: Object.freeze([...question.options]),
      sourceIds: Object.freeze([...question.sourceIds]),
      sourceFactIds: Object.freeze([...question.sourceFactIds]),
      freezeAuthorityId: GEO_RIV_001_CP001_FREEZE_AUTHORITY_V1.authorityId,
      authoringReviewApproved: true as const,
      immutableCorpus: true as const,
    }),
  ),
);

export type GeoRiv001Cp001FrozenQuestionV1 =
  (typeof GEO_RIV_001_CP001_FROZEN_QUESTIONS_V1)[number];
