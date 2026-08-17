import { TRG_002_PRODUCTION_EXPANSION_48_IDS } from "./production-96-registry";
import {
  generateFinalEditorialTrg002ProductionExpansionQuestion,
  type Trg002ProductionExpansion48Id,
} from "./production-final-editorial-runtime";

export const TRG_002_PHASE8_HUMAN_APPROVAL = {
  status: "APPROVED" as const,
  approvedQlCount: 48,
  approvedBy: "gurudhiman75-hash",
  approvedAt: "2026-08-17T18:12:00+05:30",
  approvedContentSourceHead: "495f7c99dcb6d5d2b5716ab85f3cdf32a9ad8b49",
  approvedWorkflowRunId: "32027888513",
  approvedReviewArtifactId: "9287752010",
  approvedReviewArtifactDigest: "sha256:e2a6625214aa674a451115650b1d0386f5ba1d8aa6c6ed22202f9bf9c4016f4d",
  approvedContentFingerprintAlgorithm: "sha256(UTF8(JSON.stringify(records, null, 2)))",
  approvedContentFingerprint: "3f3d265a0d14349d1ada055244cb73a7a123f1aa28b4ec33a72c33bfa95cb8fc",
  approvedVisualArtifactId: "9287800342",
  approvedVisualArtifactDigest: "sha256:3f6463c2a986f57e9e02f114d5a0f3c9c26a7f2abaddbd6d7b7e18d6086205f2",
  humanEditorialReview: "APPROVED" as const,
  humanVisualReview: "APPROVED" as const,
  representativeVisualQlCount: 14,
  representativeVisualStrategyCount: 14,
  perGeneratedSeedVisualPassClaimed: false,
} as const;

export const TRG_002_PHASE8_FREEZE = {
  status: "FROZEN" as const,
  frozenBy: "gurudhiman75-hash",
  frozenAt: "2026-08-17T18:12:00+05:30",
  frozenScope: "PHASE8_EXPANSION_48_PERMANENT_ENGLISH_QLS" as const,
  freezeGovernanceBaseHead: TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentSourceHead,
  approvedWorkflowRunId: TRG_002_PHASE8_HUMAN_APPROVAL.approvedWorkflowRunId,
  approvedContentFingerprint: TRG_002_PHASE8_HUMAN_APPROVAL.approvedContentFingerprint,
  approvedVisualArtifactId: TRG_002_PHASE8_HUMAN_APPROVAL.approvedVisualArtifactId,
  perGeneratedSeedVisualPassClaimed: false,
} as const;

function applyPhase8HumanApprovalAndFreeze(question: any) {
  return {
    ...question,
    reviewStatus: "HUMAN_APPROVED" as const,
    humanReviewStatus: "APPROVED" as const,
    humanVisualReviewStatus: "APPROVED" as const,
    freezeEligible: true,
    frozen: true,
    freezeStatus: "FROZEN" as const,
    frozenAt: TRG_002_PHASE8_FREEZE.frozenAt,
    humanReview: {
      ...TRG_002_PHASE8_HUMAN_APPROVAL,
      scope: "PHASE8_EXPANSION_48_PERMANENT_ENGLISH_QLS" as const,
      humanReviewSubstituted: false,
      approvedRepresentativeRealAppVisualEvidence: true,
      perGeneratedSeedVisualPassClaimed: false,
    },
    freeze: {
      ...TRG_002_PHASE8_FREEZE,
      contentChangeRequiresNewHumanApproval: true,
      mergeAuthorized: false,
      activationAuthorized: false,
    },
    activationAuthorized: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  };
}

export function generateHumanApprovedTrg002Phase8ExpansionQuestion(
  qlId: Trg002ProductionExpansion48Id,
  seed: string,
) {
  if (!TRG_002_PRODUCTION_EXPANSION_48_IDS.includes(qlId)) {
    throw new Error(`Unknown human-approved TRG-002 Phase-8 QL ${qlId}.`);
  }
  return applyPhase8HumanApprovalAndFreeze(
    generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, seed),
  );
}

export function generateAllHumanApprovedTrg002Phase8ExpansionQuestions(
  seedPrefix = "trg002-phase8-human-approved",
) {
  return TRG_002_PRODUCTION_EXPANSION_48_IDS.map((qlId, index) =>
    generateHumanApprovedTrg002Phase8ExpansionQuestion(
      qlId,
      `${seedPrefix}-${String(index + 1).padStart(2, "0")}`,
    ),
  );
}
