import { TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import {
  generateAllFinalEditorialTrg001Questions,
  generateFinalEditorialTrg001Question,
} from "./production-final-editorial-runtime";

export const TRG_001_HUMAN_APPROVAL = {
  status: "APPROVED" as const,
  approvedQlCount: 144,
  approvedBy: "gurudhiman75-hash",
  approvedAt: "2026-08-16T21:20:00+05:30",
  approvedContentSourceHead: "7b429306793e7403d024f2090f94f7b9501a4869",
  approvedWorkflowRunId: "31954437996",
  approvedReviewArtifactId: "9265556167",
  approvedReviewArtifactDigest: "sha256:17e1a54dbf3045f749cc0b93d6cdc173ce75e73e02877c57c85e3b2fb1152198",
  approvedContentFingerprint: "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
} as const;

export const TRG_001_FREEZE = {
  status: "FROZEN" as const,
  frozenBy: "gurudhiman75-hash",
  frozenAt: "2026-08-16T21:28:00+05:30",
  frozenScope: "FINAL_144_PERMANENT_ENGLISH_QLS" as const,
  frozenGovernanceBaseHead: "9a1815fc580b3dbc62ced6060a09ca89115e8a2f",
  postApprovalWorkflowRunId: "31957051350",
  approvedPackArtifactId: "9266242308",
  approvedPackArtifactDigest: "sha256:4ef9d06111354862fbb6f705d9277e399bde90a79bd4798f05034ed0338dfb6c",
  executionEvidenceArtifactId: "9266242157",
  executionEvidenceArtifactDigest: "sha256:df04564cd26e11bfbd83866aafa36d6d31ea2dd5d987863036541d7f8c7011f5",
  approvedContentFingerprint: TRG_001_HUMAN_APPROVAL.approvedContentFingerprint,
} as const;

function applyHumanApproval(question: any) {
  return {
    ...question,
    reviewStatus: "HUMAN_APPROVED" as const,
    humanReviewStatus: "APPROVED" as const,
    freezeEligible: true,
    frozen: true,
    freezeStatus: "FROZEN" as const,
    frozenAt: TRG_001_FREEZE.frozenAt,
    humanReview: {
      ...TRG_001_HUMAN_APPROVAL,
      scope: "FINAL_144_PERMANENT_ENGLISH_QLS" as const,
      humanReviewSubstituted: false,
    },
    freeze: {
      ...TRG_001_FREEZE,
      contentChangeRequiresNewHumanApproval: true,
      mergeAuthorized: false,
      activationAuthorized: false,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateHumanApprovedTrg001Question(qlId: string, seed: string) {
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) {
    throw new Error(`Unknown human-approved TRG-001 QL ${qlId}`);
  }
  return applyHumanApproval(generateFinalEditorialTrg001Question(qlId, seed));
}

export function generateAllHumanApprovedTrg001Questions(seed: string) {
  return generateAllFinalEditorialTrg001Questions(seed).map(applyHumanApproval);
}
