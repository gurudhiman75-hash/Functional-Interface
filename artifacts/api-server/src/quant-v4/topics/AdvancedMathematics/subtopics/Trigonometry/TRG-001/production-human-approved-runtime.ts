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

function applyHumanApproval(question: any) {
  return {
    ...question,
    reviewStatus: "HUMAN_APPROVED" as const,
    humanReviewStatus: "APPROVED" as const,
    freezeEligible: true,
    humanReview: {
      ...TRG_001_HUMAN_APPROVAL,
      scope: "FINAL_144_PERMANENT_ENGLISH_QLS" as const,
      humanReviewSubstituted: false,
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
