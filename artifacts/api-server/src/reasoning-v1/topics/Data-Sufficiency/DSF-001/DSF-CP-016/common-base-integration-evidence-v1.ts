import {
  assessDsfCp016Closure,
  type DsfCheckpointClosureEvidence,
} from "./closure-policy.ts";
import {
  DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1,
  DSF_CP016_IMPLEMENTATION_EVIDENCE_V1,
  DSF_CP016_REVIEW_ONLY_LIFECYCLE_V1,
} from "./implementation-evidence-ledger-v1.ts";

/**
 * Staging-only common-base coexistence evidence.
 *
 * The feature-branch ledger intentionally keeps mergedToCommonBase=false
 * because those historical branches did not coexist when their evidence was
 * recorded. This integration overlay does not rewrite that history. Instead,
 * it records that the exact reviewed CP011-CP015 implementations now coexist
 * on the dedicated common-base integration tree and can be audited together.
 *
 * `mergedToCommonBase=true` here means merged onto this validated staging
 * common base. It does NOT mean merged into production `New-main`.
 */
export const DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1: readonly DsfCheckpointClosureEvidence[] =
  Object.freeze(
    DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) =>
      Object.freeze({
        checkpointId: entry.checkpointId,
        implementationStatus: entry.implementationStatus,
        executableRunId: entry.executableRunId,
        exactExecutableHead: entry.exactExecutableHead,
        mergedToCommonBase: true,
        externalSourceHolds: entry.externalSourceHolds,
      }),
    ),
  );

export const DSF_CP016_COMMON_BASE_ASSESSMENT_V1 = assessDsfCp016Closure({
  checkpoints: DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1,
  currentPermanentQlIds: DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.permanentQlIds,
  currentNextAvailableQlId: DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.nextAvailableQlId,
  lifecycle: DSF_CP016_REVIEW_ONLY_LIFECYCLE_V1,
});

export const DSF_CP016_COMMON_BASE_CLOSURE_V1 = Object.freeze({
  status: "STAGING_COMMON_BASE_CLOSURE_READY_PRODUCTION_MERGE_SEPARATE" as const,
  implementationClosureReady: DSF_CP016_COMMON_BASE_ASSESSMENT_V1.implementationClosureReady,
  commonBaseClosureReady: DSF_CP016_COMMON_BASE_ASSESSMENT_V1.commonBaseClosureReady,
  permanentSemanticRegistryComplete:
    DSF_CP016_COMMON_BASE_ASSESSMENT_V1.permanentSemanticRegistryComplete,
  reviewOnlyLifecycleLocked: DSF_CP016_COMMON_BASE_ASSESSMENT_V1.reviewOnlyLifecycleLocked,
  learnerReleaseReady: DSF_CP016_COMMON_BASE_ASSESSMENT_V1.learnerReleaseReady,
  productionNewMainMergeComplete: false as const,
  productionLearnerReleaseAuthorized: false as const,
  documentedExternalSourceHolds:
    DSF_CP016_COMMON_BASE_ASSESSMENT_V1.documentedExternalSourceHolds,
});
