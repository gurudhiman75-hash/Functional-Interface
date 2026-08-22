import { SEA002_CP006_APPROVED_REVIEW } from "../review/approved-review.ts";
import type { Sea002Cp006BlueprintId } from "../types.ts";

export const SEA002_CP006_PERMANENT_QL_IDS = [
  "SEA-QL-021",
  "SEA-QL-022",
  "SEA-QL-023",
  "SEA-QL-024",
] as const;

export type Sea002Cp006PermanentQlId = (typeof SEA002_CP006_PERMANENT_QL_IDS)[number];

export const SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL = Object.freeze({
  "SEA-PBA-021": "SEA-QL-021",
  "SEA-PBA-022": "SEA-QL-022",
  "SEA-PBA-023": "SEA-QL-023",
  "SEA-PBA-024": "SEA-QL-024",
} as const satisfies Readonly<Record<Sea002Cp006BlueprintId, Sea002Cp006PermanentQlId>>);

const AUTHORITY = Object.freeze({
  "SEA-PBA-021": Object.freeze({
    solveContract: "fixed row membership with opposites",
    definingDiscriminators: Object.freeze(["all row memberships supplied", "opposite-seat link", "same-row positional relation"]),
  }),
  "SEA-PBA-022": Object.freeze({
    solveContract: "row membership partly inferred",
    definingDiscriminators: Object.freeze(["partial row membership", "opposite-seat link", "diagonal relation", "same-row positional relation"]),
  }),
  "SEA-PBA-023": Object.freeze({
    solveContract: "same-row positional chains linked through opposite seats",
    definingDiscriminators: Object.freeze(["same-row positional chain", "opposite-seat bridge", "row identity anchor"]),
  }),
  "SEA-PBA-024": Object.freeze({
    solveContract: "opposite/not-opposite/diagonal/endpoint composition",
    definingDiscriminators: Object.freeze(["opposite relation", "not-opposite relation", "diagonal relation", "endpoint constraint"]),
  }),
} as const satisfies Readonly<Record<Sea002Cp006BlueprintId, { readonly solveContract:string; readonly definingDiscriminators:readonly string[] }>>);

export interface Sea002Cp006PermanentQlRegistryEntry {
  readonly permanentQlId: Sea002Cp006PermanentQlId;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-002";
  readonly checkpointId: "SEA-CP-006";
  readonly blueprintAuthorityId: Sea002Cp006BlueprintId;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly solveInventoryStatus: "FROZEN";
  readonly queryMixStatus: "FROZEN";
  readonly englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly approvalReviewerId: string;
  readonly approvedReviewFingerprint: string;
  readonly localizationStatus: "REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

export const SEA002_CP006_PERMANENT_QL_REGISTRY: readonly Sea002Cp006PermanentQlRegistryEntry[] = Object.freeze(
  (Object.keys(SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL) as Sea002Cp006BlueprintId[]).map((blueprintAuthorityId) => Object.freeze({
    permanentQlId: SEA002_CP006_BLUEPRINT_TO_PERMANENT_QL[blueprintAuthorityId],
    chapterId: "REAS-SEA" as const,
    packageId: "SEA-002" as const,
    checkpointId: "SEA-CP-006" as const,
    blueprintAuthorityId,
    solveContract: AUTHORITY[blueprintAuthorityId].solveContract,
    definingDiscriminators: AUTHORITY[blueprintAuthorityId].definingDiscriminators,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE" as const,
    solveInventoryStatus: "FROZEN" as const,
    queryMixStatus: "FROZEN" as const,
    englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED" as const,
    approvalReviewerId: SEA002_CP006_APPROVED_REVIEW.reviewerId,
    approvedReviewFingerprint: SEA002_CP006_APPROVED_REVIEW.approvedReviewFingerprint,
    localizationStatus: "REVIEW_CANDIDATE_HUMAN_REVIEW_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  })),
);

export const SEA002_NEXT_AVAILABLE_PERMANENT_QL_ID = "SEA-QL-025" as const;
