import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";

export const TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1_VERSION =
  "TRG001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1" as const;

if (TRG_001_POST_FINAL5_FREEZE_V1.status !== "FROZEN") {
  throw new Error("TRG-001 Question Studio activation rejected: post-Final5 candidate is not frozen.");
}
if (!TRG_001_POST_FINAL5_FREEZE_V1.execution.newEnglishFreezeGranted) {
  throw new Error("TRG-001 Question Studio activation rejected: new English freeze is not granted.");
}
if (!TRG_001_POST_FINAL5_FREEZE_V1.execution.multilingualFreezeGranted) {
  throw new Error("TRG-001 Question Studio activation rejected: multilingual freeze is not granted.");
}
if (!TRG_001_POST_FINAL5_FREEZE_V1.execution.internalActivationAuthorizedByApproval) {
  throw new Error("TRG-001 Question Studio activation rejected: internal activation is not authorized by the approval record.");
}

export const TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 = Object.freeze({
  version: TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1_VERSION,
  packageId: "TRG-001" as const,
  status: "ACTIVE_INTERNAL_QUESTION_STUDIO" as const,
  activatedBy: "gurudhiman75-hash" as const,
  activatedAtIso: "2026-08-31T20:05:00+05:30" as const,
  activationScope: "QUESTION_STUDIO_ONLY" as const,
  authority: Object.freeze({
    freezeVersion: TRG_001_POST_FINAL5_FREEZE_V1.version,
    englishRemediationVersion: TRG_001_POST_FINAL5_FREEZE_V1.candidate.englishRemediationVersion,
    localizationVersion: TRG_001_POST_FINAL5_FREEZE_V1.candidate.localizationVersion,
    reviewedSourceHead: TRG_001_POST_FINAL5_FREEZE_V1.candidate.reviewedSourceHead,
    mergedRemediationCommit: TRG_001_POST_FINAL5_FREEZE_V1.candidate.mergedCommit,
    evidenceWorkflowRunId: TRG_001_POST_FINAL5_FREEZE_V1.evidence.workflowRunId,
    evidenceArtifactId: TRG_001_POST_FINAL5_FREEZE_V1.evidence.artifactId,
    evidenceArtifactDigest: TRG_001_POST_FINAL5_FREEZE_V1.evidence.artifactDigest,
  }),
  languages: ["en", "hi", "pa"] as const,
  localeMap: Object.freeze({
    en: "en-IN" as const,
    hi: "hi-IN" as const,
    pa: "pa-IN" as const,
  }),
  execution: Object.freeze({
    questionStudioActivationExecuted: true as const,
    questionStudioEnabled: true as const,
    questionStudioDiscoverable: true as const,
    internalReviewRunsWritable: true as const,
    questionBankWritable: false as const,
    testBuilderEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    automaticStudentPublication: false as const,
    contentMutationAuthorized: false as const,
  }),
});
