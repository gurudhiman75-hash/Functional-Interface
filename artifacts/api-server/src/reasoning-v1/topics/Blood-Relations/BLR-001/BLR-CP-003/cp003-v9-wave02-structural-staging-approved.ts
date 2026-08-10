import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
  BLR_CP003_V9_WAVE_02_SEEDS,
  generateBlrCp003V9TopologyGapWave02ReviewedCandidates,
  type BlrCp003V9Wave02ReviewedRecord,
} from "./cp003-v9-topology-gap-wave-02-reviewed";

export const BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION =
  "BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_V1" as const;

export const BLR_CP003_V9_WAVE02_APPROVAL_SCOPE =
  "STRUCTURAL_STAGING_ONLY" as const;

export const BLR_CP003_V9_WAVE02_APPROVAL_DATE = "2026-08-01" as const;

export type BlrCp003V9Wave02StructuralStagingApprovedRecord = Omit<
  BlrCp003V9Wave02ReviewedRecord,
  "metadata"
> & {
  metadata: BlrCp003V9Wave02ReviewedRecord["metadata"] & {
    structuralStagingApprovalVersion: typeof BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION;
    approvalScope: typeof BLR_CP003_V9_WAVE02_APPROVAL_SCOPE;
    approvedReviewVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION;
    approvalDate: typeof BLR_CP003_V9_WAVE02_APPROVAL_DATE;
    approvedBy: "PROJECT_OWNER";
    approvalDirective: "FINISH_CP";
    humanReviewApproved: true;
    wave02StructuralStagingApproved: true;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    semanticFingerprint: string;
  };
};

function approveStructuralStaging(
  record: BlrCp003V9Wave02ReviewedRecord,
): BlrCp003V9Wave02StructuralStagingApprovedRecord {
  return {
    ...record,
    metadata: {
      ...record.metadata,
      structuralStagingApprovalVersion:
        BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION,
      approvalScope: BLR_CP003_V9_WAVE02_APPROVAL_SCOPE,
      approvedReviewVersion:
        BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_REVIEWED_VERSION,
      approvalDate: BLR_CP003_V9_WAVE02_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      approvalDirective: "FINISH_CP",
      humanReviewApproved: true,
      wave02StructuralStagingApproved: true,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V9_WAVE02_STRUCTURAL_STAGING_APPROVAL_VERSION,
        BLR_CP003_V9_WAVE02_APPROVAL_SCOPE,
        BLR_CP003_V9_WAVE02_APPROVAL_DATE,
        "FINISH_CP",
      ]),
    },
  };
}

function assertApprovalBoundary(
  record: BlrCp003V9Wave02StructuralStagingApprovedRecord,
): void {
  if (
    record.metadata.humanReviewApproved !== true ||
    record.metadata.wave02StructuralStagingApproved !== true ||
    record.metadata.editorialBaselineApproved !== false ||
    record.metadata.structuralSaturationApproved !== false ||
    record.metadata.productionStagingApproved !== false ||
    record.metadata.approvalScope !== "STRUCTURAL_STAGING_ONLY" ||
    record.permanentQlId !== null ||
    record.publiclyPublishable ||
    record.questionStudioVisible ||
    record.questionBankEligible ||
    record.mockTestEligible
  ) {
    throw new Error(
      `BLR-CP-003 V9 Wave 02 approval leaked into a forbidden release state for ${record.itemId}.`,
    );
  }
}

export function generateBlrCp003V9Wave02StructuralStagingApprovedRecords(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_02_SEEDS,
): readonly BlrCp003V9Wave02StructuralStagingApprovedRecord[] {
  const records =
    generateBlrCp003V9TopologyGapWave02ReviewedCandidates(seeds).map(
      approveStructuralStaging,
    );
  const fingerprints = new Set<string>();
  for (const record of records) {
    assertApprovalBoundary(record);
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(
        `Duplicate V9 Wave 02 approved fingerprint ${record.metadata.semanticFingerprint}.`,
      );
    }
    fingerprints.add(record.metadata.semanticFingerprint);
  }
  return records;
}
