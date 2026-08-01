import { stableHash } from "../foundation/prng";
import {
  BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION,
  generateBlrCp003V10TaskContractGapWave02,
  type BlrCp003V10Record,
} from "./cp003-v10-task-contract-gap-wave-02";

export const BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION =
  "BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_V1" as const;

export type BlrCp003V10CandidateRecord = Omit<BlrCp003V10Record, "metadata"> & {
  metadata: Omit<
    BlrCp003V10Record["metadata"],
    | "structuralStagingApprovalVersion"
    | "approvalScope"
    | "approvedReviewVersion"
    | "approvalDate"
    | "approvedBy"
  > & {
    candidateVersion: typeof BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION;
    approvalInheritanceSanitised: true;
    humanReviewApproved: false;
    wave01StructuralStagingApproved: false;
    taskWave02StructuralStagingApproved: false;
    structuralSaturationApproved: false;
    productionStagingApproved: false;
    semanticFingerprint: string;
  };
};

function sanitise(record: BlrCp003V10Record): BlrCp003V10CandidateRecord {
  const {
    structuralStagingApprovalVersion: _approvalVersion,
    approvalScope: _approvalScope,
    approvedReviewVersion: _approvedReviewVersion,
    approvalDate: _approvalDate,
    approvedBy: _approvedBy,
    ...metadata
  } = record.metadata as BlrCp003V10Record["metadata"] & Record<string, unknown>;

  return {
    ...record,
    metadata: {
      ...metadata,
      candidateVersion: BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION,
      approvalInheritanceSanitised: true,
      humanReviewApproved: false,
      wave01StructuralStagingApproved: false,
      taskWave02StructuralStagingApproved: false,
      structuralSaturationApproved: false,
      productionStagingApproved: false,
      semanticFingerprint: stableHash([
        record.metadata.semanticFingerprint,
        BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_CANDIDATE_VERSION,
        "APPROVAL_INHERITANCE_SANITISED",
      ]),
    } as BlrCp003V10CandidateRecord["metadata"],
  };
}

export function generateBlrCp003V10TaskContractGapWave02Candidates(): readonly BlrCp003V10CandidateRecord[] {
  const records = generateBlrCp003V10TaskContractGapWave02().map(sanitise);
  const fingerprints = new Set<string>();
  for (const record of records) {
    const metadata = record.metadata as Record<string, unknown>;
    if (
      "structuralStagingApprovalVersion" in metadata ||
      "approvalScope" in metadata ||
      "approvedReviewVersion" in metadata ||
      "approvalDate" in metadata ||
      "approvedBy" in metadata
    ) {
      throw new Error(`V10 candidate inherited approval-only metadata for ${record.itemId}.`);
    }
    if (
      record.metadata.humanReviewApproved ||
      record.metadata.wave01StructuralStagingApproved ||
      record.metadata.taskWave02StructuralStagingApproved ||
      record.metadata.structuralSaturationApproved ||
      record.metadata.productionStagingApproved ||
      record.permanentQlId !== null ||
      record.publiclyPublishable ||
      record.questionStudioVisible ||
      record.questionBankEligible ||
      record.mockTestEligible
    ) {
      throw new Error(`V10 task-wave candidate leaked a release flag for ${record.itemId}.`);
    }
    if (fingerprints.has(record.metadata.semanticFingerprint)) {
      throw new Error(`Duplicate V10 candidate fingerprint ${record.metadata.semanticFingerprint}.`);
    }
    fingerprints.add(record.metadata.semanticFingerprint);
  }
  return records;
}

export { BLR_CP003_V10_TASK_CONTRACT_GAP_WAVE_02_VERSION };
