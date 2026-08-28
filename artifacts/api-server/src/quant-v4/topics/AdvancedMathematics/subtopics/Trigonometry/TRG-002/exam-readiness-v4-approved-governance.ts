export const TRG_002_V4_APPROVED_SOURCE_HEAD =
  "fa7e914b8872ba46e7967198322893f4eb31bff5" as const;

export const TRG_002_V4_APPROVED_ARTIFACT = {
  name: "trg-002-exam-readiness-v4",
  id: 9493897530,
  digest: "sha256:947183aabae773268ce04afafeed1bf1127153af5776325eef9e715820477a84",
} as const;

export const TRG_002_V4_HUMAN_APPROVAL = {
  status: "APPROVED",
  approvedAt: "2026-08-23T19:25:00+05:30",
  scope: "TRG002_V4_96_QL_EN_HI_PA_SEMANTIC_PEDAGOGIC_REVIEW",
  approvedQlCount: 96,
  approvedLanguages: ["en", "hi", "pa"],
  approvedSourceHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
  approvedArtifactName: TRG_002_V4_APPROVED_ARTIFACT.name,
  approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
  approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
  exhaustiveGeneratedSeedVisualPassClaimed: false,
  contentChangeRequiresNewHumanApproval: true,
} as const;

export const TRG_002_V4_ACTIVATION = {
  status: "ACTIVE_INTERNAL",
  multilingualFreezeGranted: true,
  activationAuthorized: true,
  questionStudioDiscoverable: true,
  questionBankStatus: "WRITABLE",
  testEligibility: "ELIGIBLE",
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
  freezeStatus: "FROZEN",
  runtimeMode: "RELEASED",
} as const;

export function applyTrg002V4ApprovedLifecycle<T extends Record<string, any>>(question: T): T & Record<string, any> {
  return {
    ...question,
    v4ExamReadiness: {
      ...(question.v4ExamReadiness ?? {}),
      status: "APPROVED",
      multilingualFreezeGranted: true,
      activationAuthorized: true,
      approvedSourceHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
      approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
      approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
    },
    humanReviewStatus: "APPROVED",
    reviewStatus: "HUMAN_APPROVED",
    frozen: true,
    freezeEligible: true,
    freezeStatus: "FROZEN",
    activationAuthorized: true,
    questionStudioDiscoverable: true,
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    humanReview: {
      ...(question.humanReview ?? {}),
      status: "APPROVED",
      scope: TRG_002_V4_HUMAN_APPROVAL.scope,
      approvedAt: TRG_002_V4_HUMAN_APPROVAL.approvedAt,
      approvedSourceHead: TRG_002_V4_APPROVED_SOURCE_HEAD,
      approvedArtifactId: TRG_002_V4_APPROVED_ARTIFACT.id,
      approvedArtifactDigest: TRG_002_V4_APPROVED_ARTIFACT.digest,
      contentChangeRequiresNewHumanApproval: true,
      exhaustiveGeneratedSeedVisualPassClaimed: false,
    },
  };
}
