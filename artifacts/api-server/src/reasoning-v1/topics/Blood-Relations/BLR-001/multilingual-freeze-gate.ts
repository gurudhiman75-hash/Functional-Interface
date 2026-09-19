import { BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION } from "./multilingual-human-review-pack";

export const BLR_001_MULTILINGUAL_FREEZE_GATE_VERSION =
  "blr-001-multilingual-freeze-gate-v1" as const;

export interface Blr001MultilingualApprovalReceipt {
  reviewPackVersion: typeof BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION;
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030";
  approvedBy: "PRODUCT_OWNER";
  approvedAt: string;
  cp001ThroughCp005HindiPunjabiApproved: true;
  cp006EditorialV3TrilingualApproved: true;
}

export interface Blr001MultilingualFreezeReadiness {
  gateVersion: typeof BLR_001_MULTILINGUAL_FREEZE_GATE_VERSION;
  reviewPackVersion: typeof BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION;
  reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030";
  freezeEligible: boolean;
  approvalReceiptAccepted: boolean;
  approvalBlockers: readonly string[];
  releaseState: {
    questionBankWritable: false;
    testEligible: false;
    mockTestEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  };
}

function validDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validateBlr001MultilingualApprovalReceipt(
  receipt: Partial<Blr001MultilingualApprovalReceipt> | undefined,
): readonly string[] {
  if (!receipt) return ["PRODUCT_OWNER_APPROVAL_RECEIPT_MISSING"];

  const blockers: string[] = [];
  if (receipt.reviewPackVersion !== BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION) {
    blockers.push("REVIEW_PACK_VERSION_MISMATCH");
  }
  if (receipt.reviewedPermanentQlRange !== "BLR-QL-001..BLR-QL-030") {
    blockers.push("REVIEWED_QL_RANGE_MISMATCH");
  }
  if (receipt.approvedBy !== "PRODUCT_OWNER") {
    blockers.push("PRODUCT_OWNER_APPROVAL_MISSING");
  }
  if (!receipt.approvedAt || !validDate(receipt.approvedAt)) {
    blockers.push("APPROVAL_DATE_INVALID");
  }
  if (receipt.cp001ThroughCp005HindiPunjabiApproved !== true) {
    blockers.push("CP001_CP005_HI_PA_APPROVAL_MISSING");
  }
  if (receipt.cp006EditorialV3TrilingualApproved !== true) {
    blockers.push("CP006_EDITORIAL_V3_TRILINGUAL_APPROVAL_MISSING");
  }
  return blockers;
}

export function buildBlr001MultilingualFreezeReadiness(
  receipt?: Partial<Blr001MultilingualApprovalReceipt>,
): Blr001MultilingualFreezeReadiness {
  const approvalBlockers = validateBlr001MultilingualApprovalReceipt(receipt);
  return {
    gateVersion: BLR_001_MULTILINGUAL_FREEZE_GATE_VERSION,
    reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
    reviewedPermanentQlRange: "BLR-QL-001..BLR-QL-030",
    freezeEligible: approvalBlockers.length === 0,
    approvalReceiptAccepted: approvalBlockers.length === 0,
    approvalBlockers,
    releaseState: {
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}

export function assertBlr001MultilingualFreezeApproved(
  receipt: Partial<Blr001MultilingualApprovalReceipt> | undefined,
): asserts receipt is Blr001MultilingualApprovalReceipt {
  const blockers = validateBlr001MultilingualApprovalReceipt(receipt);
  if (blockers.length) {
    throw new Error(
      `BLR-001 multilingual freeze is not approved: ${blockers.join(", ")}`,
    );
  }
}
