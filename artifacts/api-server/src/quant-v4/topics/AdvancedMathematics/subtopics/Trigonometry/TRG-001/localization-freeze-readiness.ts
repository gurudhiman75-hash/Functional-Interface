export const TRG_001_LOCALIZATION_FREEZE_READINESS = Object.freeze({
  manifestVersion: "TRG001_HI_PA_LOCALIZATION_FREEZE_READINESS_V1",
  packageId: "TRG-001",
  candidateVersion: "TRG001_HI_PA_LOCALIZATION_NATIVE_REVIEW_FINAL4",
  candidateSourceHead: "f42b5c6b26edfcb16c07a2b5a3f8620b976ac083",
  mergedViaPullRequest: 1221,
  mergedCommit: "2cce68bc694f3eee79ed1a37c030de93e5d4dac9",
  englishAuthority: {
    qls: 144,
    fingerprint: "31772b314a4d9f1f47b85a54e0596eab9a0dd450a14c380b001376099ac50611",
  },
  localizedScope: {
    qls: 144,
    locales: ["hi-IN", "pa-IN"] as const,
    localizedSurfaces: 288,
  },
  evidence: {
    fiveSeedCrossCheck: {
      workflowRunId: 33298656944,
      artifactId: 9728219257,
      artifactDigest: "sha256:5c149ea3bd15af66c83c1d072aa38bad3f2823a05ad698800f337589aed5677c",
      cases: 1440,
      learnerFacingFields: 19768,
      failures: 0,
    },
    reviewReadiness: {
      workflowRunId: 33298656954,
      artifactId: 9728215685,
      artifactDigest: "sha256:9a0af17bb3682a438ba9f2bb4a6ac109c25c425556511e416157bd152ad1264a",
      reviewRows: 144,
      localizedSurfaces: 288,
      failures: 0,
    },
  },
  engineeringReviewReadiness: "PASS",
  humanLanguageApproval: "PENDING",
  multilingualFreezeGranted: false,
  freezeAuthorized: false,
  activationAuthorized: false,
  questionStudioEnabledForLocalizedSurface: false,
  questionBankWritableForLocalizedSurface: false,
  testBuilderEligibleForLocalizedSurface: false,
  publiclyPublishable: false,
  publicReleaseAuthorized: false,
} as const);

export type Trg001LocalizationFreezeReadiness = typeof TRG_001_LOCALIZATION_FREEZE_READINESS;
