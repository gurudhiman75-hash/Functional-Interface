import { canonicalDigest } from "../canonical.ts";
import { SEA001_APPROVED_REVIEW } from "../review/approved-review.ts";
import {
  SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID,
  SEA001_PERMANENT_QL_REGISTRY,
} from "./registry.ts";

export const SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT = Object.freeze({
  "SEA-CP-001": [
    "SEA-QC-001",
    "SEA-QC-002",
    "SEA-QC-003",
    "SEA-QC-005",
    "SEA-QC-007",
    "SEA-QC-008",
    "SEA-QC-014",
    "SEA-QC-015",
    "SEA-QC-016",
    "SEA-QC-017",
    "SEA-QC-019",
    "SEA-QC-020",
    "SEA-QC-021",
  ],
  "SEA-CP-002": ["SEA-QC-003", "SEA-QC-005", "SEA-QC-006", "SEA-QC-008", "SEA-QC-015"],
  "SEA-CP-003": ["SEA-QC-003", "SEA-QC-004", "SEA-QC-006", "SEA-QC-009", "SEA-QC-010", "SEA-QC-015", "SEA-QC-020"],
  "SEA-CP-004": ["SEA-QC-003", "SEA-QC-006", "SEA-QC-009", "SEA-QC-010", "SEA-QC-020"],
  "SEA-CP-005": ["SEA-QC-003", "SEA-QC-005", "SEA-QC-006", "SEA-QC-010", "SEA-QC-020", "SEA-QC-022"],
} as const);

export const SEA001_SOLVE_INVENTORY_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  permanentQlCount: SEA001_PERMANENT_QL_REGISTRY.length,
  retainedAuthorityCount: SEA001_PERMANENT_QL_REGISTRY.length,
  mergeCount: 0 as const,
  splitCount: 0 as const,
  nextAvailablePermanentQlId: SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID,
  registryFingerprint: canonicalDigest(SEA001_PERMANENT_QL_REGISTRY.map((entry) => ({
    permanentQlId: entry.permanentQlId,
    checkpointId: entry.checkpointId,
    blueprintAuthorityId: entry.blueprintAuthorityId,
    solveContract: entry.solveContract,
    definingDiscriminators: entry.definingDiscriminators,
  }))),
});

export const SEA001_QUERY_MIX_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  childQuestionsPerCaselet: 4 as const,
  contractsByCheckpoint: SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT,
  mixFingerprint: canonicalDigest(SEA001_FROZEN_QUERY_CONTRACTS_BY_CHECKPOINT),
});

export const SEA001_ENGLISH_FREEZE = Object.freeze({
  status: "FROZEN" as const,
  locale: "en-IN" as const,
  teachingStyle: "PLAIN_TEACHER" as const,
  reviewDecision: "100_ACCEPT_0_REWRITE_0_REJECT" as const,
  reviewerId: SEA001_APPROVED_REVIEW.reviewerId,
  reviewedAt: SEA001_APPROVED_REVIEW.reviewedAt,
  approvedReviewFingerprint: SEA001_APPROVED_REVIEW.approvedReviewFingerprint,
  approvedArtifactSha256: SEA001_APPROVED_REVIEW.artifactSha256,
});

export const SEA001_PERMANENT_INACTIVE_LIFECYCLE = Object.freeze({
  identityStatus: "PERMANENT_IDS_ALLOCATED" as const,
  solveInventoryStatus: "FROZEN" as const,
  queryMixStatus: "FROZEN" as const,
  englishFreezeStatus: "FROZEN" as const,
  permanentQlCount: 20 as const,
  localizationStatus: "NOT_STARTED" as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function assertSea001PermanentLayerStillInactive(): void {
  if (SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible
    || SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable) {
    throw new Error("SEA-001 permanent English freeze must remain inactive until the downstream activation gate is explicitly approved.");
  }
}
