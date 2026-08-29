import assert from "node:assert/strict";
import { DSF_CP016_REQUIRED_CHECKPOINTS } from "./closure-policy.ts";
import {
  DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1,
  DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1,
  DSF_CP016_IMPLEMENTATION_CLOSURE_V1,
  DSF_CP016_IMPLEMENTATION_EVIDENCE_V1,
  DSF_CP016_REVIEW_ONLY_LIFECYCLE_V1,
} from "./implementation-evidence-ledger-v1.ts";

assert.equal(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.length, DSF_CP016_REQUIRED_CHECKPOINTS.length);
assert.deepEqual(
  DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => entry.checkpointId),
  DSF_CP016_REQUIRED_CHECKPOINTS,
);
assert.equal(new Set(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => entry.executableRunId)).size, 5);
assert.equal(new Set(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => entry.exactExecutableHead)).size, 5);
assert.equal(new Set(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => entry.pullRequest)).size, 5);

for (const entry of DSF_CP016_IMPLEMENTATION_EVIDENCE_V1) {
  assert.equal(entry.implementationStatus, "EXECUTABLE_GREEN");
  assert.equal(entry.mergedToCommonBase, false, `${entry.checkpointId} must not be described as merged before actual integration`);
  assert(Number.isInteger(entry.executableRunId) && entry.executableRunId > 0);
  assert.match(entry.exactExecutableHead ?? "", /^[0-9a-f]{40}$/u);
  assert(entry.pullRequest > 0);
  assert(entry.branch.length > 0);
  assert(entry.evidenceScope.length > 40);
}

const byCheckpoint = new Map(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => [entry.checkpointId, entry]));
assert.equal(byCheckpoint.get("DSF-CP-011")?.executableRunId, 32947914900);
assert.equal(byCheckpoint.get("DSF-CP-011")?.exactExecutableHead, "52e2faca0e838e3284c38de8c33c446d7db35067");
assert.equal(byCheckpoint.get("DSF-CP-012")?.executableRunId, 32979622746);
assert.equal(byCheckpoint.get("DSF-CP-012")?.exactExecutableHead, "4e33cdbb645d6a5030a73f1e823f51c779e4832b");
assert.equal(byCheckpoint.get("DSF-CP-013")?.executableRunId, 33049254915);
assert.equal(byCheckpoint.get("DSF-CP-013")?.exactExecutableHead, "718015279183ea81d1d1f4ed0553dc179d457016");
assert.equal(byCheckpoint.get("DSF-CP-014")?.executableRunId, 33057329390);
assert.equal(byCheckpoint.get("DSF-CP-014")?.exactExecutableHead, "45da4eeae73ce3894ccfe20a486e762347a2d568");
assert.equal(byCheckpoint.get("DSF-CP-015")?.executableRunId, 33058818772);
assert.equal(byCheckpoint.get("DSF-CP-015")?.exactExecutableHead, "166b8d691ce0c042d44fbed06295712e6f8ee85a");

assert.deepEqual(DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
assert.equal(DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.nextAvailableQlId, "DSF-QL-003");
assert.equal(DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.commonBaseContainsThisRegistry, false);

assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.implementationEvidenceComplete, true);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.permanentSemanticRegistryComplete, true);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.reviewOnlyLifecycleLocked, true);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.implementationClosureReady, true);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.commonBaseIntegrationComplete, false);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.commonBaseClosureReady, false);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.learnerReleaseReady, false);
assert.deepEqual(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.violations, []);
assert.equal(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.documentedExternalSourceHolds.length, 2);
assert(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.documentedExternalSourceHolds.some((hold) => hold.includes("Geometry")));
assert(DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.documentedExternalSourceHolds.some((hold) => hold.includes("puzzle")));

assert.equal(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.status, "FEATURE_IMPLEMENTATION_COMPLETE_COMMON_BASE_INTEGRATION_PENDING");
assert.equal(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.implementationClosureReady, true);
assert.equal(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.commonBaseClosureReady, false);
assert.equal(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.learnerReleaseReady, false);
assert.equal(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.requiredCommonBaseWork.length, 5);
assert(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.requiredCommonBaseWork.some((item) => item.includes("CP014")));
assert(DSF_CP016_IMPLEMENTATION_CLOSURE_V1.requiredCommonBaseWork.some((item) => item.includes("DSF-QL-003")));

for (const enabled of Object.values(DSF_CP016_REVIEW_ONLY_LIFECYCLE_V1)) assert.equal(enabled, false);

console.log(JSON.stringify({
  status: "PASS_DSF_CP016_IMPLEMENTATION_EVIDENCE_LEDGER_V1",
  checkpointCount: DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.length,
  checkpointRuns: Object.fromEntries(DSF_CP016_IMPLEMENTATION_EVIDENCE_V1.map((entry) => [entry.checkpointId, entry.executableRunId])),
  currentPermanentQlIds: DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.permanentQlIds,
  nextAvailableQlId: DSF_CP016_FEATURE_REGISTRY_EVIDENCE_V1.nextAvailableQlId,
  implementationClosureReady: DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.implementationClosureReady,
  commonBaseClosureReady: DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.commonBaseClosureReady,
  externalSourceHoldCount: DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.documentedExternalSourceHolds.length,
  learnerReleaseReady: DSF_CP016_IMPLEMENTATION_ASSESSMENT_V1.learnerReleaseReady,
}, null, 2));
