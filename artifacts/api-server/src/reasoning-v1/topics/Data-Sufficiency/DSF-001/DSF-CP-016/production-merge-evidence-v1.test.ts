import assert from "node:assert/strict";
import { DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1 } from "./production-merge-evidence-v1.ts";

assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.sourcePullRequest, 1148);
assert.equal(
  DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.validatedStagingHead,
  "418ea5ddc99d201eed7d0e075c9a3978bcdfd234",
);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.validatedStagingRunId, 33226512086);
assert.equal(
  DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionMergeCommit,
  "18c9b5ee52877a15d5c3c9f74f4bc741318626da",
);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.implementationClosureReady, true);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.commonBaseClosureReady, true);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.permanentSemanticRegistryComplete, true);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.reviewOnlyLifecycleLocked, true);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionNewMainMergeComplete, true);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.learnerReleaseReady, false);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionLearnerReleaseAuthorized, false);
assert.equal(DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.documentedExternalSourceHolds.length, 2);

console.log(JSON.stringify({
  status: "PASS_DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1",
  sourcePullRequest: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.sourcePullRequest,
  validatedStagingRunId: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.validatedStagingRunId,
  productionMergeCommit: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionMergeCommit,
  commonBaseClosureReady: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.commonBaseClosureReady,
  productionNewMainMergeComplete: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.productionNewMainMergeComplete,
  learnerReleaseReady: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.learnerReleaseReady,
  externalSourceHoldCount: DSF_CP016_PRODUCTION_MERGE_EVIDENCE_V1.documentedExternalSourceHolds.length,
}, null, 2));
