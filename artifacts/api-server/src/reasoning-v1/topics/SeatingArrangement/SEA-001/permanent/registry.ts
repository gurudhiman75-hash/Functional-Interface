import { SEA001_APPROVED_REVIEW } from "../review/approved-review.ts";
import { SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS } from "../saturation/authority-audits.ts";
import type { Sea001CheckpointId } from "../saturation/corpus.ts";

export const SEA001_PERMANENT_QL_IDS = [
  "SEA-QL-001",
  "SEA-QL-002",
  "SEA-QL-003",
  "SEA-QL-004",
  "SEA-QL-005",
  "SEA-QL-006",
  "SEA-QL-007",
  "SEA-QL-008",
  "SEA-QL-009",
  "SEA-QL-010",
  "SEA-QL-011",
  "SEA-QL-012",
  "SEA-QL-013",
  "SEA-QL-014",
  "SEA-QL-015",
  "SEA-QL-016",
  "SEA-QL-017",
  "SEA-QL-018",
  "SEA-QL-019",
  "SEA-QL-020",
] as const;

export type Sea001PermanentQlId = (typeof SEA001_PERMANENT_QL_IDS)[number];
export type Sea001BlueprintAuthorityId = `SEA-PBA-${string}`;

export const SEA001_BLUEPRINT_TO_PERMANENT_QL = Object.freeze({
  "SEA-PBA-001": "SEA-QL-001",
  "SEA-PBA-002": "SEA-QL-002",
  "SEA-PBA-003": "SEA-QL-003",
  "SEA-PBA-004": "SEA-QL-004",
  "SEA-PBA-005": "SEA-QL-005",
  "SEA-PBA-006": "SEA-QL-006",
  "SEA-PBA-007": "SEA-QL-007",
  "SEA-PBA-008": "SEA-QL-008",
  "SEA-PBA-009": "SEA-QL-009",
  "SEA-PBA-010": "SEA-QL-010",
  "SEA-PBA-011": "SEA-QL-011",
  "SEA-PBA-012": "SEA-QL-012",
  "SEA-PBA-013": "SEA-QL-013",
  "SEA-PBA-014": "SEA-QL-014",
  "SEA-PBA-015": "SEA-QL-015",
  "SEA-PBA-016": "SEA-QL-016",
  "SEA-PBA-017": "SEA-QL-017",
  "SEA-PBA-018": "SEA-QL-018",
  "SEA-PBA-019": "SEA-QL-019",
  "SEA-PBA-020": "SEA-QL-020",
} as const satisfies Readonly<Record<string, Sea001PermanentQlId>>);

export interface Sea001PermanentQlRegistryEntry {
  readonly permanentQlId: Sea001PermanentQlId;
  readonly chapterId: "REAS-SEA";
  readonly packageId: "SEA-001";
  readonly checkpointId: Sea001CheckpointId;
  readonly blueprintAuthorityId: string;
  readonly solveContract: string;
  readonly definingDiscriminators: readonly string[];
  readonly allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE";
  readonly solveInventoryStatus: "FROZEN";
  readonly queryMixStatus: "FROZEN";
  readonly englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED";
  readonly approvalReviewerId: string;
  readonly approvedReviewFingerprint: string;
  readonly localizationStatus: "NOT_STARTED";
  readonly active: false;
  readonly questionStudioDiscoverable: false;
  readonly questionBankWritable: false;
  readonly testEligible: false;
  readonly publiclyPublishable: false;
}

const entries = SEA001_BLUEPRINT_AUTHORITY_DESCRIPTORS.map((descriptor) => {
  const permanentQlId = SEA001_BLUEPRINT_TO_PERMANENT_QL[descriptor.blueprintId as keyof typeof SEA001_BLUEPRINT_TO_PERMANENT_QL];
  if (!permanentQlId) throw new Error(`Missing permanent SEA-001 QL mapping for ${descriptor.blueprintId}`);
  return Object.freeze({
    permanentQlId,
    chapterId: "REAS-SEA",
    packageId: "SEA-001",
    checkpointId: descriptor.checkpointId,
    blueprintAuthorityId: descriptor.blueprintId,
    solveContract: descriptor.contract,
    definingDiscriminators: descriptor.definingDiscriminators,
    allocationStatus: "PERMANENT_ID_ALLOCATED_INACTIVE",
    solveInventoryStatus: "FROZEN",
    queryMixStatus: "FROZEN",
    englishStatus: "ENGLISH_MANUAL_FREEZE_APPROVED",
    approvalReviewerId: SEA001_APPROVED_REVIEW.reviewerId,
    approvedReviewFingerprint: SEA001_APPROVED_REVIEW.approvedReviewFingerprint,
    localizationStatus: "NOT_STARTED",
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  } as const);
});

export const SEA001_PERMANENT_QL_REGISTRY: readonly Sea001PermanentQlRegistryEntry[] = Object.freeze(entries);
export const SEA001_NEXT_AVAILABLE_PERMANENT_QL_ID = "SEA-QL-021" as const;
