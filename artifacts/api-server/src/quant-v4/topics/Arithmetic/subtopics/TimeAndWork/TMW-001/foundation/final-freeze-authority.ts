export const TMW_001_FINAL_FREEZE_AUTHORITY = {
  chapterId: "TMW-001",
  status: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
  qlRange: "TMW-QL-001..TMW-QL-228",
  qlCount: 228,
  checkpointCount: 14,
  languages: ["en", "hi", "pa"] as const,
  sourceAuthorityHead: "9caa3abece889d9ab15241335c0f3eee3a995704",
  sourceReviewRun: 31987843896,
  sourceReviewArtifactId: 9274329560,
  sourceReviewArtifactSha256: "ad5dff34e3338bc9ddb18d2ae65eb176bcb42dc01a7036845382d40b861f4b7c",
  auditedPackages: 684,
  multiSeedAuditCases: 5472,
  approval: "USER_EXPLICIT_FREEZE_2026-08-17",
  questionStudioDiscoverable: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
} as const;

export type Tmw001FinalFreezeAuthority = typeof TMW_001_FINAL_FREEZE_AUTHORITY;
