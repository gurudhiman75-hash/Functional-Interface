import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
  BLR_CP003_V9_WAVE_01_SEEDS,
  generateBlrCp003V9TopologyGapWave01ReviewedCandidates,
  type BlrCp003V9ReviewedRecord,
} from "./cp003-v9-topology-gap-wave-01-reviewed";

export const BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION =
  "BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_V1" as const;

export const BLR_CP003_V9_WAVE01_APPROVAL_SCOPE =
  "STRUCTURAL_STAGING_ONLY" as const;

export const BLR_CP003_V9_WAVE01_APPROVAL_DATE = "2026-08-01" as const;

export type BlrCp003V9Wave01StructuralStagingApprovedRecord = Omit<
  BlrCp003V9ReviewedRecord,
  "metadata"
> & {
  metadata: BlrCp003V9ReviewedRecord["metadata"] & {
    structuralStagingApprovalVersion: typeof BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION;
    approvalScope: typeof BLR_CP003_V9_WAVE01_APPROVAL_SCOPE;
    approvedReviewVersion: typeof BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION;
    approvalDate: typeof BLR_CP003_V9_WAVE01_APPROVAL_DATE;
    approvedBy: "PROJECT_OWNER";
    humanReviewApproved: true;
    wave01StructuralStagingApproved: true;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    semanticFingerprint: string;
  };
};

function approveStructuralStaging(
  record: BlrCp003V9ReviewedRecord,
): BlrCp003V9Wave01StructuralStagingApprovedRecord {
  return {
    ...record,
    metadata: {
      ...record.metadata,
      structuralStagingApprovalVersion:
        BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION,
      approvalScope: BLR_CP003_V9_WAVE01_APPROVAL_SCOPE,
      approvedReviewVersion:
        BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
      approvalDate: BLR_CP003_V9_WAVE01_APPROVAL_DATE,
      approvedBy: "PROJECT_OWNER",
      humanReviewApproved: true,
      wave01StructuralStagingApproved: true,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V9_WAVE01_STRUCTURAL_STAGING_APPROVAL_VERSION,
        BLR_CP003_V9_WAVE01_APPROVAL_SCOPE,
        BLR_CP003_V9_WAVE01_APPROVAL_DATE,
      ]),
    },
  };
}

function assertApprovalBoundary(
  record: BlrCp003V9Wave01StructuralStagingApprovedRecord,
): void {
  if (
    record.metadata.humanReviewApproved !== true ||
    record.metadata.wave01StructuralStagingApproved !== true ||
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
      `BLR-CP-003 V9 Wave 01 approval leaked into a forbidden release state for ${record.itemId}.`,
    );
  }
}

export function generateBlrCp003V9Wave01StructuralStagingApprovedRecords(
  seeds: readonly number[] = BLR_CP003_V9_WAVE_01_SEEDS,
): readonly BlrCp003V9Wave01StructuralStagingApprovedRecord[] {
  const records =
    generateBlrCp003V9TopologyGapWave01ReviewedCandidates(seeds).map(
      approveStructuralStaging,
    );
  const fingerprints = new Set<string>();
  for (const record of records) {
    assertApprovalBoundary(record);
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(
        `Duplicate V9 Wave 01 approved fingerprint ${record.metadata.semanticFingerprint}.`,
      );
    }
    fingerprints.add(record.metadata.semanticFingerprint);
  }
  return records;
}
