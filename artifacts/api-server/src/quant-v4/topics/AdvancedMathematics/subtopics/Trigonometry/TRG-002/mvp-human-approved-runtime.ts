import type { Trg002Mvp48Id } from "./mvp-48-registry";
import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

export const TRG_002_HUMAN_APPROVAL = {
  status: "APPROVED" as const,
  approvedQlCount: 48,
  approvedBy: "gurudhiman75-hash",
  approvedAt: "2026-08-16T13:44:00+05:30",
  approvedContentSourceHead: "60e289ee6c89a3f595ad75038ac563daf2a5fc5f",
  approvedWorkflowRunId: "31932920092",
  approvedReviewArtifactId: "9259815578",
  approvedReviewArtifactDigest: "sha256:2e49ac250376d38fcd7fa21aa7be4d9906f9fed6d6ccc8a036dfe69bcad2788f",
  approvedContentFingerprintAlgorithm: "sha256(JSON.stringify(TRG-002-MVP-48-RUNTIME-REVIEW.json))",
  approvedContentFingerprint: "b60217f9b29af79435ab065e4c64c40449dc43df2fa9646b055f41763bce04db",
} as const;

export const TRG_002_FREEZE = {
  status: "FROZEN" as const,
  frozenBy: "gurudhiman75-hash",
  frozenAt: "2026-08-17T07:47:00+05:30",
  frozenScope: "MVP_48_PERMANENT_ENGLISH_QLS" as const,
  freezeGovernanceBaseHead: "828782170a15779f6b039668b254ec19647ec9c5",
  browserValidationRunId: "31945456581",
  browserValidationHead: "e0480a63188327fb4a4521f0ade2efc1970557cf",
  approvedContentFingerprint: TRG_002_HUMAN_APPROVAL.approvedContentFingerprint,
  perGeneratedSeedVisualPassClaimed: false,
} as const;

function applyHumanApprovalAndFreeze(question: any) {
  return {
    ...question,
    reviewStatus: "HUMAN_APPROVED" as const,
    humanReviewStatus: "APPROVED" as const,
    freezeEligible: true,
    frozen: true,
    freezeStatus: "FROZEN" as const,
    frozenAt: TRG_002_FREEZE.frozenAt,
    humanReview: {
      ...TRG_002_HUMAN_APPROVAL,
      scope: "MVP_48_PERMANENT_ENGLISH_QLS" as const,
      humanReviewSubstituted: false,
      perGeneratedSeedVisualPassClaimed: false,
    },
    freeze: {
      ...TRG_002_FREEZE,
      contentChangeRequiresNewHumanApproval: true,
      expansionAuthorizedByFreeze: false,
      mergeAuthorized: false,
      activationAuthorized: false,
    },
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateHumanApprovedTrg002Mvp48Question(qlId: Trg002Mvp48Id, seed: string) {
  if (!TRG_002_MVP_48_IDS.includes(qlId)) {
    throw new Error(`Unknown human-approved TRG-002 MVP QL ${qlId}`);
  }
  return applyHumanApprovalAndFreeze(generateFinalEditorialTrg002Mvp48Question(qlId, seed));
}

export function generateAllHumanApprovedTrg002Mvp48Questions(seedPrefix = "trg002-render-review") {
  return TRG_002_MVP_48_IDS.map((qlId, index) => {
    const seed = `${seedPrefix}-${String(index + 1).padStart(2, "0")}`;
    return generateHumanApprovedTrg002Mvp48Question(qlId, seed);
  });
}
