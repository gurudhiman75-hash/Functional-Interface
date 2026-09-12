import { TRG_001_POST_FINAL5_FREEZE_V1 } from "./post-final5-freeze-v1";
import { TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1 } from "./post-final5-question-studio-activation-v1";

export const TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1_VERSION =
  "TRG001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1" as const;

const FREEZE = TRG_001_POST_FINAL5_FREEZE_V1;
const QUESTION_STUDIO = TRG_001_POST_FINAL5_QUESTION_STUDIO_ACTIVATION_V1;

if (FREEZE.status !== "FROZEN") {
  throw new Error("TRG-001 full internal activation rejected: post-Final5 candidate is not frozen.");
}
if (!FREEZE.execution.newEnglishFreezeGranted || !FREEZE.execution.multilingualFreezeGranted) {
  throw new Error("TRG-001 full internal activation rejected: English/multilingual freeze is incomplete.");
}
if (!FREEZE.execution.internalActivationAuthorizedByApproval) {
  throw new Error("TRG-001 full internal activation rejected: approval record does not authorize internal activation.");
}
if (QUESTION_STUDIO.status !== "ACTIVE_INTERNAL_QUESTION_STUDIO"
  || !QUESTION_STUDIO.execution.questionStudioEnabled
  || !QUESTION_STUDIO.execution.questionStudioDiscoverable) {
  throw new Error("TRG-001 full internal activation rejected: Question Studio activation is not active.");
}

export const TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1 = Object.freeze({
  version: TRG_001_POST_FINAL5_FULL_INTERNAL_ACTIVATION_V1_VERSION,
  packageId: "TRG-001" as const,
  status: "ACTIVE_INTERNAL_FULL" as const,
  activatedBy: "gurudhiman75-hash" as const,
  activatedAtIso: "2026-08-31T21:21:00+05:30" as const,
  activationScope: "QUESTION_STUDIO_QUESTION_BANK_TEST_BUILDER_INTERNAL" as const,
  authority: Object.freeze({
    freezeVersion: FREEZE.version,
    questionStudioActivationVersion: QUESTION_STUDIO.version,
    englishRemediationVersion: FREEZE.candidate.englishRemediationVersion,
    localizationVersion: FREEZE.candidate.localizationVersion,
    reviewedSourceHead: FREEZE.candidate.reviewedSourceHead,
    mergedRemediationCommit: FREEZE.candidate.mergedCommit,
    evidenceWorkflowRunId: FREEZE.evidence.workflowRunId,
    evidenceArtifactId: FREEZE.evidence.artifactId,
    evidenceArtifactDigest: FREEZE.evidence.artifactDigest,
  }),
  execution: Object.freeze({
    fullInternalActivationExecuted: true as const,
    questionStudioEnabled: true as const,
    questionStudioDiscoverable: true as const,
    internalReviewRunsWritable: true as const,
    questionBankStatus: "WRITABLE" as const,
    questionBankWritable: true as const,
    testEligibility: "ELIGIBLE" as const,
    testEligible: true as const,
    testBuilderEligible: true as const,
    mockTestEligible: true as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    automaticStudentPublication: false as const,
    contentMutationAuthorized: false as const,
  }),
});
