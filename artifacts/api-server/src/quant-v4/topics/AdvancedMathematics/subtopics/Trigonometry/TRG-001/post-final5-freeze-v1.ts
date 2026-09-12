import {
  TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE,
  TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1,
} from "./post-final5-human-approval-record-v1";
import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";

export const TRG_001_POST_FINAL5_FREEZE_V1_VERSION = "TRG001_POST_FINAL5_FREEZE_V1" as const;

if (!TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.newEnglishFreezeAuthorizedByRecord) {
  throw new Error("TRG-001 post-Final5 freeze rejected: English freeze is not authorized by the approval record.");
}
if (!TRG_001_POST_FINAL5_APPROVAL_AUTHORIZATION_EVIDENCE.multilingualFreezeAuthorizedByRecord) {
  throw new Error("TRG-001 post-Final5 freeze rejected: multilingual freeze is not authorized by the approval record.");
}

export const TRG_001_POST_FINAL5_FREEZE_V1 = Object.freeze({
  version: TRG_001_POST_FINAL5_FREEZE_V1_VERSION,
  packageId: "TRG-001" as const,
  status: "FROZEN" as const,
  frozenBy: "gurudhiman75-hash" as const,
  frozenAtIso: "2026-08-31T16:50:24+05:30" as const,
  approvalRecord: {
    reviewer: TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1.reviewer,
    approvedAtIso: TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1.approvedAtIso,
    boundaryVersion: TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1.boundaryVersion,
    approvalStatement: TRG_001_POST_FINAL5_HUMAN_APPROVAL_RECORD_V1.approvalStatement,
    mergedApprovalCommit: "cbc89cde637cf9ebff353ba3d043613a45fd6994" as const,
  },
  candidate: TRG_001_POST_FINAL5_FREEZE_READINESS.candidate,
  evidence: TRG_001_POST_FINAL5_FREEZE_READINESS.evidence,
  english: {
    qls: 144 as const,
    changedQlIds: ["TRG-001-QL-093"] as const,
    humanReview: "APPROVED" as const,
    freezeStatus: "FROZEN" as const,
    frozen: true as const,
    historicalFingerprintRetainedAsProvenanceOnly:
      TRG_001_POST_FINAL5_FREEZE_READINESS.historicalEnglishAuthority.approvedFingerprint,
    historicalFreezeInherited: false as const,
  },
  localization: {
    qls: 144 as const,
    locales: ["hi-IN", "pa-IN"] as const,
    localizedSurfaces: 288 as const,
    remediatedQlIds: TRG_001_POST_FINAL5_FREEZE_READINESS.localizedScope.remediatedQlIds,
    humanReview: "APPROVED" as const,
    freezeStatus: "FROZEN" as const,
    frozen: true as const,
  },
  execution: {
    newEnglishFreezeGranted: true as const,
    multilingualFreezeGranted: true as const,
    freezeAuthorized: true as const,
    internalActivationAuthorizedByApproval: true as const,
    internalActivationExecuted: false as const,
    questionStudioEnabled: false as const,
    questionBankWritable: false as const,
    testBuilderEligible: false as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
  },
});
