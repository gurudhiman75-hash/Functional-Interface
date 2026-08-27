import assert from "node:assert/strict";
import {
  DSF_CP016_REQUIRED_CHECKPOINTS,
  assessDsfCp016Closure,
  type DsfCheckpointClosureEvidence,
  type DsfClosureLifecycleState,
} from "./closure-policy.ts";

const LOCKED_LIFECYCLE: DsfClosureLifecycleState = Object.freeze({
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

const FIXTURE_RUNS = Object.freeze({
  "DSF-CP-011": 101,
  "DSF-CP-012": 102,
  "DSF-CP-013": 103,
  "DSF-CP-014": 104,
  "DSF-CP-015": 105,
} satisfies Readonly<Record<(typeof DSF_CP016_REQUIRED_CHECKPOINTS)[number], number>>);

const FIXTURE_HEADS = Object.freeze({
  "DSF-CP-011": "1111111111111111111111111111111111111111",
  "DSF-CP-012": "2222222222222222222222222222222222222222",
  "DSF-CP-013": "3333333333333333333333333333333333333333",
  "DSF-CP-014": "4444444444444444444444444444444444444444",
  "DSF-CP-015": "5555555555555555555555555555555555555555",
} satisfies Readonly<Record<(typeof DSF_CP016_REQUIRED_CHECKPOINTS)[number], string>>);

function greenEvidence(mergedToCommonBase: boolean): readonly DsfCheckpointClosureEvidence[] {
  return DSF_CP016_REQUIRED_CHECKPOINTS.map((checkpointId) => Object.freeze({
    checkpointId,
    implementationStatus: "EXECUTABLE_GREEN" as const,
    executableRunId: FIXTURE_RUNS[checkpointId],
    exactExecutableHead: FIXTURE_HEADS[checkpointId],
    mergedToCommonBase,
    externalSourceHolds: checkpointId === "DSF-CP-011"
      ? Object.freeze(["Geometry: no canonical merged GEO-001/source solver authority"])
      : checkpointId === "DSF-CP-013"
        ? Object.freeze(["Generic floor/box/scheduling puzzle: no standalone merged source solver authority"])
        : Object.freeze([]),
  }));
}

const featureComplete = assessDsfCp016Closure({
  checkpoints: greenEvidence(false),
  currentPermanentQlIds: ["DSF-QL-001", "DSF-QL-002"],
  currentNextAvailableQlId: "DSF-QL-003",
  lifecycle: LOCKED_LIFECYCLE,
});
assert.equal(featureComplete.implementationEvidenceComplete, true);
assert.equal(featureComplete.permanentSemanticRegistryComplete, true);
assert.equal(featureComplete.reviewOnlyLifecycleLocked, true);
assert.equal(featureComplete.implementationClosureReady, true);
assert.equal(featureComplete.commonBaseIntegrationComplete, false);
assert.equal(featureComplete.commonBaseClosureReady, false);
assert.equal(featureComplete.learnerReleaseReady, false);
assert.deepEqual(featureComplete.violations, []);
assert.equal(featureComplete.documentedExternalSourceHolds.length, 2);

const integrated = assessDsfCp016Closure({
  checkpoints: greenEvidence(true),
  currentPermanentQlIds: ["DSF-QL-001", "DSF-QL-002"],
  currentNextAvailableQlId: "DSF-QL-003",
  lifecycle: LOCKED_LIFECYCLE,
});
assert.equal(integrated.implementationClosureReady, true);
assert.equal(integrated.commonBaseIntegrationComplete, true);
assert.equal(integrated.commonBaseClosureReady, true);
assert.equal(integrated.learnerReleaseReady, false, "chapter closure must never silently grant learner release");
assert.deepEqual(integrated.violations, []);

const missingQl002 = assessDsfCp016Closure({
  checkpoints: greenEvidence(true),
  currentPermanentQlIds: ["DSF-QL-001"],
  currentNextAvailableQlId: "DSF-QL-002",
  lifecycle: LOCKED_LIFECYCLE,
});
assert.equal(missingQl002.permanentSemanticRegistryComplete, false);
assert.equal(missingQl002.implementationClosureReady, false);
assert.equal(missingQl002.commonBaseClosureReady, false);
assert(missingQl002.violations.some((violation) => violation.includes("missing DSF-QL-002")));
assert(missingQl002.violations.some((violation) => violation.includes("Next available DSF QL must be DSF-QL-003")));

const pendingCp015Evidence = greenEvidence(false).map((entry) => entry.checkpointId === "DSF-CP-015"
  ? Object.freeze({ ...entry, implementationStatus: "PENDING" as const, executableRunId: undefined, exactExecutableHead: undefined })
  : entry);
const pendingCp015 = assessDsfCp016Closure({
  checkpoints: pendingCp015Evidence,
  currentPermanentQlIds: ["DSF-QL-001", "DSF-QL-002"],
  currentNextAvailableQlId: "DSF-QL-003",
  lifecycle: LOCKED_LIFECYCLE,
});
assert.equal(pendingCp015.implementationEvidenceComplete, false);
assert.equal(pendingCp015.implementationClosureReady, false);
assert(pendingCp015.violations.some((violation) => violation.includes("DSF-CP-015 implementation status is PENDING")));

const accidentallyOpenedLifecycle = assessDsfCp016Closure({
  checkpoints: greenEvidence(true),
  currentPermanentQlIds: ["DSF-QL-001", "DSF-QL-002"],
  currentNextAvailableQlId: "DSF-QL-003",
  lifecycle: Object.freeze({ ...LOCKED_LIFECYCLE, questionStudioDiscoverable: true }),
});
assert.equal(accidentallyOpenedLifecycle.reviewOnlyLifecycleLocked, false);
assert.equal(accidentallyOpenedLifecycle.implementationClosureReady, false);
assert.equal(accidentallyOpenedLifecycle.commonBaseClosureReady, false);
assert(accidentallyOpenedLifecycle.violations.some((violation) => violation.includes("questionStudioDiscoverable=false")));

const duplicateEvidence = [...greenEvidence(true), greenEvidence(true)[0]!];
const duplicateAssessment = assessDsfCp016Closure({
  checkpoints: duplicateEvidence,
  currentPermanentQlIds: ["DSF-QL-001", "DSF-QL-002", "DSF-QL-002"],
  currentNextAvailableQlId: "DSF-QL-003",
  lifecycle: LOCKED_LIFECYCLE,
});
assert.equal(duplicateAssessment.implementationEvidenceComplete, false);
assert.equal(duplicateAssessment.permanentSemanticRegistryComplete, false);
assert(duplicateAssessment.violations.some((violation) => violation.includes("Duplicate checkpoint evidence")));
assert(duplicateAssessment.violations.some((violation) => violation.includes("Duplicate current permanent QL ids")));

console.log(JSON.stringify({
  status: "PASS_DSF_CP016_CLOSURE_POLICY",
  fixtureOnly: true,
  requiredCheckpoints: DSF_CP016_REQUIRED_CHECKPOINTS,
  featureImplementationClosureReady: featureComplete.implementationClosureReady,
  featureCommonBaseClosureReady: featureComplete.commonBaseClosureReady,
  integratedCommonBaseClosureReady: integrated.commonBaseClosureReady,
  externalSourceHoldCount: featureComplete.documentedExternalSourceHolds.length,
  learnerReleaseAlwaysSeparate: true,
}, null, 2));
