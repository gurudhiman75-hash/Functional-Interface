import { DSF_CP016_COMMON_BASE_CLOSURE_V1 } from "./common-base-integration-evidence-v1.ts";

/**
 * Post-merge production evidence for the CP011-CP016 DSF expansion.
 *
 * The staging common-base ledger remains immutable historical evidence. This
 * layer records the separate fact that PR #1148 was subsequently squash-merged
 * into production `New-main` as commit 18c9b5ee52877a15d5c3c9f74f4bc741318626da.
 *
 * Production integration does not authorize learner delivery. All learner-facing
 * capabilities remain governed by the review-only lifecycle and a separate
 * explicit release checkpoint.
 */
export const DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1 = Object.freeze({
  status: "PRODUCTION_NEW_MAIN_MERGE_COMPLETE_LEARNER_RELEASE_SEPARATE" as const,
  sourcePullRequest: 1148 as const,
  validatedStagingHead: "418ea5ddc99d201eed7d0e075c9a3978bcdfd234" as const,
  validatedStagingRunId: 33226512086 as const,
  productionMergeCommit: "18c9b5ee52877a15d5c3c9f74f4bc741318626da" as const,
  implementationClosureReady: DSF_CP016_COMMON_BASE_CLOSURE_V1.implementationClosureReady,
  commonBaseClosureReady: DSF_CP016_COMMON_BASE_CLOSURE_V1.commonBaseClosureReady,
  permanentSemanticRegistryComplete:
    DSF_CP016_COMMON_BASE_CLOSURE_V1.permanentSemanticRegistryComplete,
  reviewOnlyLifecycleLocked: DSF_CP016_COMMON_BASE_CLOSURE_V1.reviewOnlyLifecycleLocked,
  productionNewMainMergeComplete: true as const,
  learnerReleaseReady: false as const,
  productionLearnerReleaseAuthorized: false as const,
  documentedExternalSourceHolds:
    DSF_CP016_COMMON_BASE_CLOSURE_V1.documentedExternalSourceHolds,
});
