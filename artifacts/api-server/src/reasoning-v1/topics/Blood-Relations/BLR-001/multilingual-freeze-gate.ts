import { BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION } from "./multilingual-human-review-pack";

export const BLR_001_MULTILINGUAL_FREEZE_GATE_VERSION =
  "blr-001-multilingual-freeze-gate-v2" as const;
export const BLR_001_APPROVED_REVIEW_SOURCE_COMMIT =
  "e7048ed867c8029164bec40aaa4f2f9d79d5151d" as const;
export const BLR_001_APPROVED_REVIEW_ARTIFACT_DIGEST =
  "sha256:b0161cbfb899b72287657647d881107a6f5297221d4c08ba67776511df8518dd" as const;

export interface Blr001MultilingualApprovalReceipt {
  reviewPackVersion: typeof BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION;
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030";
  reviewedSourceCommit: typeof BLR_001_APPROVED_REVIEW_SOURCE_COMMIT;
  reviewArtifactDigest: typeof BLR_001_APPROVED_REVIEW_ARTIFACT_DIGEST;
  approvedBy: "PRODUCT_OWNER";
  approvedAt: "2026-09-19";
  cp001ThroughCp005HindiPunjabiApproved: true;
  cp006EditorialV3TrilingualApproved: true;
}

export function validateBlr001MultilingualApprovalReceipt(
  receipt: Partial<Blr001MultilingualApprovalReceipt> | undefined,
): readonly string[] {
  if (!receipt) return ["PRODUCT_OWNER_APPROVAL_RECEIPT_MISSING"];
  const blockers: string[] = [];
  if (receipt.reviewPackVersion !== BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION) blockers.push("REVIEW_PACK_VERSION_MISMATCH");
  if (receipt.reviewedPermanentQlRange !== "BLR-QL-001..BLR-QL-030") blockers.push("REVIEWED_QL_RANGE_MISMATCH");
  if (receipt.reviewedSourceCommit !== BLR_001_APPROVED_REVIEW_SOURCE_COMMIT) blockers.push("REVIEWED_SOURCE_COMMIT_MISMATCH");
  if (receipt.reviewArtifactDigest !== BLR_001_APPROVED_REVIEW_ARTIFACT_DIGEST) blockers.push("REVIEW_ARTIFACT_DIGEST_MISMATCH");
  if (receipt.approvedBy !== "PRODUCT_OWNER") blockers.push("PRODUCT_OWNER_APPROVAL_MISSING");
  if (receipt.approvedAt !== "2026-09-19") blockers.push("APPROVAL_DATE_MISMATCH");
  if (receipt.cp001ThroughCp005HindiPunjabiApproved !== true) blockers.push("CP001_CP005_HI_PA_APPROVAL_MISSING");
  if (receipt.cp006EditorialV3TrilingualApproved !== true) blockers.push("CP006_EDITORIAL_V3_TRILINGUAL_APPROVAL_MISSING");
  return blockers;
}

export function assertBlr001MultilingualFreezeApproved(
  receipt: Partial<Blr001MultilingualApprovalReceipt> | undefined,
): asserts receipt is Blr001MultilingualApprovalReceipt {
  const blockers = validateBlr001MultilingualApprovalReceipt(receipt);
  if (blockers.length) {
    throw new Error(`BLR-001 multilingual freeze is not approved: ${blockers.join(", ")}`);
  }
}

export function buildBlr001MultilingualFreezeReadiness(
  receipt?: Partial<Blr001MultilingualApprovalReceipt>,
) {
  const approvalBlockers = validateBlr001MultilingualApprovalReceipt(receipt);
  return {
    gateVersion: BLR_001_MULTILINGUAL_FREEZE_GATE_VERSION,
    reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
    reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030" as const,
    reviewedSourceCommit: BLR_001_APPROVED_REVIEW_SOURCE_COMMIT,
    reviewArtifactDigest: BLR_001_APPROVED_REVIEW_ARTIFACT_DIGEST,
    freezeEligible: approvalBlockers.length === 0,
    approvalReceiptAccepted: approvalBlockers.length === 0,
    approvalBlockers,
    releaseState: {
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    } as const,
  } as const;
}
