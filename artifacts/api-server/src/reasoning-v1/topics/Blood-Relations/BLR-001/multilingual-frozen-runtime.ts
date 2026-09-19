import {
  buildBlr001MultilingualReviewCorpora,
  BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
} from "./multilingual-human-review-pack";
import {
  assertBlr001MultilingualFreezeApproved,
  type Blr001MultilingualApprovalReceipt,
} from "./multilingual-freeze-gate";

export const BLR_001_MULTILINGUAL_FREEZE_VERSION =
  "blr-001-multilingual-frozen-v1" as const;

const CHECKPOINT_AUTHORITIES = {
  "BLR-CP-001": "BLR_CP001_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-002": "BLR_CP002_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-003": "BLR_CP003_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-004": "BLR_CP004_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-005": "BLR_CP005_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-006": "BLR_CP006_EDITORIAL_V3_MULTILINGUAL_FROZEN_V1",
} as const;

type AnyRecord = Record<string, any>;

function freezeRecord(
  record: AnyRecord,
  receipt: Blr001MultilingualApprovalReceipt,
): AnyRecord {
  const checkpointId = String(record.checkpointId) as keyof typeof CHECKPOINT_AUTHORITIES;
  const authority = CHECKPOINT_AUTHORITIES[checkpointId];
  if (!authority) throw new Error(`Unsupported multilingual freeze checkpoint ${checkpointId}.`);

  const isCp006 = checkpointId === "BLR-CP-006";
  return {
    ...record,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    metadata: {
      ...record.metadata,
      ...(isCp006
        ? {
            editorialAuthority: authority,
            editorialStatus: "TRILINGUAL_FROZEN",
          }
        : {
            localizationAuthority: authority,
            localizationStatus: "MULTILINGUAL_FROZEN",
            reviewStatus: "MULTILINGUAL_FROZEN",
          }),
      multilingualFreezeStatus: authority,
      multilingualFreezeVersion: BLR_001_MULTILINGUAL_FREEZE_VERSION,
      approvedReviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
      approvedBy: receipt.approvedBy,
      approvedAt: receipt.approvedAt,
      humanLanguageReviewRequired: false,
      activeEditorialBlockers: [],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
    multilingualFreezeProof: {
      authority,
      freezeVersion: BLR_001_MULTILINGUAL_FREEZE_VERSION,
      reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
      approvedBy: receipt.approvedBy,
      approvedAt: receipt.approvedAt,
      reviewedPermanentQlRange: receipt.reviewedPermanentQlRange,
      semanticParityPreserved: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}

export function buildBlr001ApprovedMultilingualFrozenBundle(
  receipt: Blr001MultilingualApprovalReceipt,
) {
  assertBlr001MultilingualFreezeApproved(receipt);
  const source = buildBlr001MultilingualReviewCorpora();
  return {
    cp001: {
      hindi: source.cp001.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp001.punjabi.map((record) => freezeRecord(record, receipt)),
    },
    cp002: {
      hindi: source.cp002.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp002.punjabi.map((record) => freezeRecord(record, receipt)),
    },
    cp003: {
      hindi: source.cp003.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp003.punjabi.map((record) => freezeRecord(record, receipt)),
    },
    cp004: {
      hindi: source.cp004.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp004.punjabi.map((record) => freezeRecord(record, receipt)),
    },
    cp005: {
      hindi: source.cp005.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp005.punjabi.map((record) => freezeRecord(record, receipt)),
    },
    cp006: {
      english: source.cp006.english.map((record) => freezeRecord(record, receipt)),
      hindi: source.cp006.hindi.map((record) => freezeRecord(record, receipt)),
      punjabi: source.cp006.punjabi.map((record) => freezeRecord(record, receipt)),
    },
  } as const;
}
