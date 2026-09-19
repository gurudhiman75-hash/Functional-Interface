import { BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION, buildBlr001MultilingualReviewCorpora } from "./multilingual-human-review-pack";
import { BLR_001_MULTILINGUAL_APPROVAL_RECEIPT } from "./multilingual-freeze-approval";
import {
  assertBlr001MultilingualFreezeApproved,
  type Blr001MultilingualApprovalReceipt,
} from "./multilingual-freeze-gate";

export const BLR_001_MULTILINGUAL_FREEZE_VERSION =
  "blr-001-multilingual-frozen-v2" as const;

export const BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES = Object.freeze({
  "BLR-CP-001": "BLR_CP001_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-002": "BLR_CP002_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-003": "BLR_CP003_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-004": "BLR_CP004_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-005": "BLR_CP005_MULTILINGUAL_FROZEN_V1",
  "BLR-CP-006": "BLR_CP006_EDITORIAL_V3_MULTILINGUAL_FROZEN_V1",
} as const);

type AnyRecord = Record<string, any>;

export function freezeBlr001ApprovedMultilingualRecord(
  record: AnyRecord,
  receipt: Blr001MultilingualApprovalReceipt = BLR_001_MULTILINGUAL_APPROVAL_RECEIPT,
): AnyRecord {
  assertBlr001MultilingualFreezeApproved(receipt);
  const checkpointId = String(record.checkpointId) as keyof typeof BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES;
  const authority = BLR_001_MULTILINGUAL_FREEZE_AUTHORITIES[checkpointId];
  if (!authority) throw new Error(`Unsupported multilingual freeze checkpoint ${checkpointId}.`);

  const cp006 = checkpointId === "BLR-CP-006";
  return {
    ...record,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    metadata: {
      ...record.metadata,
      ...(cp006
        ? { editorialAuthority: authority, editorialStatus: "TRILINGUAL_FROZEN" }
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
      reviewedSourceCommit: receipt.reviewedSourceCommit,
      reviewArtifactDigest: receipt.reviewArtifactDigest,
      humanLanguageReviewRequired: false,
      activeEditorialBlockers: [],
      productDeliveryUnlocked: false,
      productionStagingApproved: false,
    },
    multilingualFreezeProof: {
      authority,
      freezeVersion: BLR_001_MULTILINGUAL_FREEZE_VERSION,
      reviewPackVersion: BLR_001_MULTILINGUAL_REVIEW_PACK_VERSION,
      reviewedSourceCommit: receipt.reviewedSourceCommit,
      reviewArtifactDigest: receipt.reviewArtifactDigest,
      approvedBy: receipt.approvedBy,
      approvedAt: receipt.approvedAt,
      learnerCorpusChanged: false,
      semanticParityPreserved: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}

export function buildBlr001ApprovedMultilingualFrozenBundle() {
  const source = buildBlr001MultilingualReviewCorpora();
  const freeze = (records: readonly AnyRecord[]) =>
    records.map((record) => freezeBlr001ApprovedMultilingualRecord(record));
  return {
    cp001: { hindi: freeze(source.cp001.hindi), punjabi: freeze(source.cp001.punjabi) },
    cp002: { hindi: freeze(source.cp002.hindi), punjabi: freeze(source.cp002.punjabi) },
    cp003: { hindi: freeze(source.cp003.hindi), punjabi: freeze(source.cp003.punjabi) },
    cp004: { hindi: freeze(source.cp004.hindi), punjabi: freeze(source.cp004.punjabi) },
    cp005: { hindi: freeze(source.cp005.hindi), punjabi: freeze(source.cp005.punjabi) },
    cp006: {
      english: freeze(source.cp006.english),
      hindi: freeze(source.cp006.hindi),
      punjabi: freeze(source.cp006.punjabi),
    },
  } as const;
}
