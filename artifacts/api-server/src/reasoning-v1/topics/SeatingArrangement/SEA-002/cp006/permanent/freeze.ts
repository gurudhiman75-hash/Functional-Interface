import { canonicalDigest } from "../../../SEA-001/canonical.ts";
import { SEA002_CP006_APPROVED_REVIEW, SEA002_CP006_PREVIOUS_APPROVED_REVIEW } from "../review/approved-review.ts";
import { SEA002_CP006_REOPENED_ENGLISH_REVIEW } from "../review/reopened-review.ts";
import {
  SEA002_CP006_PERMANENT_QL_REGISTRY,
  SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
} from "./registry.ts";

export const SEA002_CP006_FROZEN_QUERY_CONTRACTS = Object.freeze([
  "SEA-QC-003","SEA-QC-006","SEA-QC-008","SEA-QC-010","SEA-QC-011","SEA-QC-012","SEA-QC-014","SEA-QC-015",
] as const);

export const SEA002_CP006_SOLVE_INVENTORY_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  checkpointId: "SEA-CP-006" as const,
  permanentQlCount: SEA002_CP006_PERMANENT_QL_REGISTRY.length,
  retainedAuthorityCount: SEA002_CP006_PERMANENT_QL_REGISTRY.length,
  mergeCount: 0 as const,
  splitCount: 0 as const,
  nextAvailablePermanentQlId: SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID,
  registryFingerprint: canonicalDigest(SEA002_CP006_PERMANENT_QL_REGISTRY.map((entry) => ({
    permanentQlId: entry.permanentQlId,
    blueprintAuthorityId: entry.blueprintAuthorityId,
    solveContract: entry.solveContract,
    definingDiscriminators: entry.definingDiscriminators,
  }))),
});

export const SEA002_CP006_QUERY_MIX_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  checkpointId: "SEA-CP-006" as const,
  childQuestionsPerCaselet: 4 as const,
  contracts: SEA002_CP006_FROZEN_QUERY_CONTRACTS,
  mixFingerprint: canonicalDigest(SEA002_CP006_FROZEN_QUERY_CONTRACTS),
});

export const SEA002_CP006_ENGLISH_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  freezeActive: true as const,
  locale: "en-IN" as const,
  teachingStyle: "PLAIN_TEACHER_POSITION_WORDING" as const,
  learnerTerminology: "POSITION_NOT_COLUMN" as const,
  reviewDecision: SEA002_CP006_APPROVED_REVIEW.decision,
  reviewerId: SEA002_CP006_APPROVED_REVIEW.reviewerId,
  reviewedAt: SEA002_CP006_APPROVED_REVIEW.reviewedAt,
  approvedReviewFingerprint: SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,
  approvedArtifactId: SEA002_CP006_APPROVED_REVIEW.artifactId,
  approvedArtifactSha256: SEA002_CP006_APPROVED_REVIEW.artifactSha256,
  previousApprovedReviewFingerprint: SEA002_CP006_PREVIOUS_APPROVED_REVIEW.approvedReviewFingerprint,
  errataClosureStatus: SEA002_CP006_REOPENED_ENGLISH_REVIEW.status,
  affectedRationaleCount: SEA002_CP006_REOPENED_ENGLISH_REVIEW.affectedRationaleCount,
  currentReviewApproved: true as const,
});

export const SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE = Object.freeze({
  identityStatus: "PERMANENT_IDS_ALLOCATED" as const,
  solveInventoryStatus: "FROZEN" as const,
  queryMixStatus: "FROZEN" as const,
  englishFreezeStatus: "FROZEN" as const,
  permanentQlCount: 4 as const,
  localizationStatus: "REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING" as const,
  localizationFrozen: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  mockTestEligible: false as const,
  productionStaging: false as const,
  publiclyPublishable: false as const,
});

export function assertCp006PermanentLayerStillInactive(): void {
  if (!SEA002_CP006_ENGLISH_FREEZE.freezeActive) {
    throw new Error("SEA-002 CP006 corrected English approval must remain frozen before localization review proceeds.");
  }
  if (SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.localizationFrozen
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.mockTestEligible
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.productionStaging
    || SEA002_CP006_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-002 CP006 must remain product-inactive while Hindi/Punjabi human review is pending.");
  }
}
