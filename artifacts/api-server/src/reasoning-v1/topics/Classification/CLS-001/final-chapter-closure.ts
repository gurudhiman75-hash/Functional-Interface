import { CLS001_ENGLISH_EDITORIAL_APPROVAL } from "./english-editorial-approval";
import { buildClsCp008OwnershipAudit } from "./CLS-CP-008/ownership-registry";

export const CLS001_FINAL_CHAPTER_CLOSURE = {
  chapterId: "CLS-001",
  productCode: "REAS-CLS",
  status: "CONTENT_REVIEW_CLOSED",
  closedAt: "2026-09-18",
  permanentQlRange: CLS001_ENGLISH_EDITORIAL_APPROVAL.permanentQlRange,
  checkpointCount: 8,
  checkpoints: [
    {
      checkpointId: "CLS-CP-001",
      qlIds: ["CLS-QL-001", "CLS-QL-002", "CLS-QL-003"],
      englishAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      nativeAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      learnerSurfaceAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
    },
    {
      checkpointId: "CLS-CP-002",
      qlIds: ["CLS-QL-004"],
      englishAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      nativeAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      learnerSurfaceAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
    },
    {
      checkpointId: "CLS-CP-003",
      qlIds: ["CLS-QL-005", "CLS-QL-006"],
      englishAuthority: "FROZEN_ENGLISH_RUNTIME_PROOF",
      nativeAuthority: "MULTILINGUAL_REVIEW_FROZEN",
      learnerSurfaceAuthority: "V5_REVIEW_FROZEN",
    },
    {
      checkpointId: "CLS-CP-004",
      qlIds: ["CLS-QL-007"],
      englishAuthority: "FROZEN_ENGLISH_RUNTIME_PROOF",
      nativeAuthority: "MULTILINGUAL_REVIEW_FROZEN",
      learnerSurfaceAuthority: "NATIVE_REVIEW_FROZEN",
    },
    {
      checkpointId: "CLS-CP-005",
      qlIds: ["CLS-QL-008", "CLS-QL-009"],
      englishAuthority: "FROZEN_ENGLISH_RUNTIME_PROOF",
      nativeAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      learnerSurfaceAuthority: "FROZEN_LEARNER_REVIEW_V2",
    },
    {
      checkpointId: "CLS-CP-006",
      qlIds: ["CLS-QL-010", "CLS-QL-011"],
      englishAuthority: "FROZEN_ENGLISH_RUNTIME_PROOF",
      nativeAuthority: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
      learnerSurfaceAuthority: "FROZEN_LEARNER_REVIEW_V2",
    },
    {
      checkpointId: "CLS-CP-007",
      qlIds: ["CLS-QL-012", "CLS-QL-013"],
      englishAuthority: "FROZEN_ENGLISH_RUNTIME_PROOF",
      nativeAuthority: "MULTILINGUAL_REVIEW_FROZEN",
      learnerSurfaceAuthority: "V3_COMPACT_NATIVE_REVIEW_FROZEN",
    },
    {
      checkpointId: "CLS-CP-008",
      qlIds: [],
      englishAuthority: "CLOSED_ZERO_NEW_QL",
      nativeAuthority: "NOT_APPLICABLE",
      learnerSurfaceAuthority: "NOT_APPLICABLE",
    },
  ],
  lifecycle: {
    sourceRuntimeQuestionStudioDiscoverable: false,
    questionStudioReviewIntegrationAuthorized: true,
    questionStudioReviewOnly: true,
    questionBankWritable: false,
    mockTestEligible: false,
    testEligible: false,
    studentDeliveryAuthorized: false,
    publiclyPublishable: false,
    automaticPromotionAuthorized: false,
  },
  reopenOnlyFor: [
    "LOGICAL_OR_MATHEMATICAL_DEFECT",
    "ANSWER_INTEGRITY_DEFECT",
    "AMBIGUITY_DEFECT",
    "SOURCE_COVERAGE_DEFECT",
    "LANGUAGE_OR_EDITORIAL_DEFECT",
    "RENDERING_DEFECT",
    "EXPLICIT_PRODUCT_RELEASE_AUTHORIZATION",
  ],
} as const;

export function buildCls001FinalClosureAudit() {
  const cp008 = buildClsCp008OwnershipAudit();
  const qlIds = CLS001_FINAL_CHAPTER_CLOSURE.checkpoints.flatMap(
    (checkpoint) => [...checkpoint.qlIds],
  );
  return {
    chapterId: CLS001_FINAL_CHAPTER_CLOSURE.chapterId,
    checkpointCount: CLS001_FINAL_CHAPTER_CLOSURE.checkpointCount,
    qlIds,
    cp008,
    lifecycle: CLS001_FINAL_CHAPTER_CLOSURE.lifecycle,
  };
}

export type Cls001FinalChapterClosure =
  typeof CLS001_FINAL_CHAPTER_CLOSURE;
