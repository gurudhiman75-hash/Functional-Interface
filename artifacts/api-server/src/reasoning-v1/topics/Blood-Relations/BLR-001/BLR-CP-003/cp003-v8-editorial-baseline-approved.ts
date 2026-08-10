import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V8_FULL_BANK_SEEDS,
  BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
  generateBlrCp003LearnerEvidenceV8ReviewedCandidates,
  type BlrCp003V8CandidateRecord,
} from "./cp003-learner-evidence-v8-reviewed";

export const BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION =
  "BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_V1" as const;

export const BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE =
  "EDITORIAL_STAGING_ONLY" as const;

export type BlrCp003V8EditorialBaselineApprovedRecord = Omit<
  BlrCp003V8CandidateRecord,
  "metadata"
> & {
  metadata: BlrCp003V8CandidateRecord["metadata"] & {
    editorialBaselineApprovalVersion: typeof BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION;
    editorialBaselineApproved: true;
    approvalScope: typeof BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE;
    approvedReviewVersion: typeof BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION;
    approvedQualityScore: 9.3;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    semanticFingerprint: string;
  };
};

function approveEditorialBaseline(
  record: BlrCp003V8CandidateRecord,
): BlrCp003V8EditorialBaselineApprovedRecord {
  return {
    ...record,
    metadata: {
      ...record.metadata,
      editorialBaselineApprovalVersion:
        BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION,
      editorialBaselineApproved: true,
      approvalScope: BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE,
      approvedReviewVersion: BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
      approvedQualityScore: 9.3,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_VERSION,
        BLR_CP003_V8_EDITORIAL_APPROVAL_SCOPE,
        9.3,
      ]),
    },
  };
}

function assertApprovalBoundary(
  record: BlrCp003V8EditorialBaselineApprovedRecord,
): void {
  if (
    record.metadata.humanReviewApproved !== false ||
    record.metadata.editorialBaselineApproved !== true ||
    record.metadata.structuralSaturationApproved !== false ||
    record.metadata.productionStagingApproved !== false ||
    record.permanentQlId !== null ||
    record.publiclyPublishable ||
    record.questionStudioVisible ||
    record.questionBankEligible ||
    record.mockTestEligible
  ) {
    throw new Error(
      `BLR-CP-003 V8 scoped editorial approval leaked into a release state for ${record.itemId}.`,
    );
  }
}

export function generateBlrCp003V8EditorialBaselineApprovedRecords(
  seeds: readonly number[] = BLR_CP003_V8_FULL_BANK_SEEDS,
): readonly BlrCp003V8EditorialBaselineApprovedRecord[] {
  const records =
    generateBlrCp003LearnerEvidenceV8ReviewedCandidates(seeds).map(
      approveEditorialBaseline,
    );
  for (const record of records) assertApprovalBoundary(record);
  return records;
}
