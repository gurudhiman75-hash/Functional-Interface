import assert from "node:assert/strict";
import {
  DSF_CP016_COMMON_BASE_ASSESSMENT_V1,
  DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1,
  DSF_CP016_COMMON_BASE_CLOSURE_V1,
} from "./common-base-integration-evidence-v1.ts";

assert.equal(DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1.length, 5);
assert(DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1.every((entry) => entry.mergedToCommonBase));
assert(DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1.every((entry) => entry.implementationStatus === "EXECUTABLE_GREEN"));

assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.implementationEvidenceComplete, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.commonBaseIntegrationComplete, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.permanentSemanticRegistryComplete, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.reviewOnlyLifecycleLocked, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.implementationClosureReady, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.commonBaseClosureReady, true);
assert.equal(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.learnerReleaseReady, false);
assert.deepEqual(DSF_CP016_COMMON_BASE_ASSESSMENT_V1.violations, []);

assert.equal(DSF_CP016_COMMON_BASE_CLOSURE_V1.commonBaseClosureReady, true);
assert.equal(DSF_CP016_COMMON_BASE_CLOSURE_V1.productionNewMainMergeComplete, false);
assert.equal(DSF_CP016_COMMON_BASE_CLOSURE_V1.productionLearnerReleaseAuthorized, false);
assert.equal(DSF_CP016_COMMON_BASE_CLOSURE_V1.learnerReleaseReady, false);
assert.equal(DSF_CP016_COMMON_BASE_CLOSURE_V1.documentedExternalSourceHolds.length, 2);

console.log(JSON.stringify({
  status: "PASS_DSF_CP016_STAGING_COMMON_BASE_CLOSURE_EVIDENCE_V1",
  checkpointCount: DSF_CP016_COMMON_BASE_CHECKPOINT_EVIDENCE_V1.length,
  implementationClosureReady: DSF_CP016_COMMON_BASE_CLOSURE_V1.implementationClosureReady,
  commonBaseClosureReady: DSF_CP016_COMMON_BASE_CLOSURE_V1.commonBaseClosureReady,
  productionNewMainMergeComplete: DSF_CP016_COMMON_BASE_CLOSURE_V1.productionNewMainMergeComplete,
  learnerReleaseReady: DSF_CP016_COMMON_BASE_CLOSURE_V1.learnerReleaseReady,
  externalSourceHoldCount: DSF_CP016_COMMON_BASE_CLOSURE_V1.documentedExternalSourceHolds.length,
}, null, 2));
