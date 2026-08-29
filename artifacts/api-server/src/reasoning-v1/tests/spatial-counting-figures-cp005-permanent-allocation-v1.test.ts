import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1 } from "../foundation/spatial/counting-figures-cp002-saturation-v1";
import { FCT_001_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/counting-figures-product-owner-approval-v1";
import {
  FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2,
  generateCountingFigureCandidateV2,
} from "../foundation/spatial/counting-figures-production-generator-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v5";
import {
  SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V6,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v6";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.retainedCandidate.splitRequiredNow, false);
assert.equal(FCT_001_CP002_QL_MERGE_SPLIT_DECISION_V1.permanentQlDecision.nextAvailableSpatialPermanentQlId, "SPA-QL-042");
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed, true);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlId, "SPA-QL-042");
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.approvedProductionAuthorityId, FCT_001_PRODUCTION_GENERATOR_AUTHORITY_V2.authorityId);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.exactCandidateHeadSha, "675f80d7342356dd2a2c36c7c1d2fbe78edeaa05");
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation.workflowRunId, 33227176144);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation.artifactId, 9707262064);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation.artifactDigest, "sha256:cbc7ed95aef3131c96ed2c44eb600c764b9444a259668bf778336c28505a2879");
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation.directDesktopAuditPassed, true);
assert.equal(FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation.directMobileAuditPassed, true);

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount, 41);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V5.length, 41);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId, "SPA-QL-042");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.baseAuthorityId, SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.verifiedNewMainHeadAtAllocation, "808a5b36efeb30c301700dd206b3b8dbafc71963");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.permanentQlCount, 42);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V6.length, 42);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.permanentQlRange, "SPA-QL-001..SPA-QL-042");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.nextAvailablePermanentQlId, "SPA-QL-043");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.chapterCounts["FCT-001"], 1);
assert.equal(new Set(SPATIAL_PERMANENT_QL_ALLOCATIONS_V6.map((entry) => entry.permanentQlId)).size, 42);

assert.equal(SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6.length, 1);
const allocation = SPATIAL_COUNTING_FIGURES_PERMANENT_QL_ALLOCATIONS_V6[0];
assert.equal(allocation.permanentQlId, "SPA-QL-042");
assert.equal(allocation.proposalId, "FCT-CAND-A-CLOSED-POLYGON-ENUMERATION");
assert.equal(allocation.chapterCode, "FCT-001");
assert.equal(allocation.skillMode, "SYSTEMATIC_CLOSED_FIGURE_ENUMERATION");
assert.equal(allocation.equivalencePolicy, "TARGET_SHAPE_PARAMETERIZED");
assert.equal(allocation.allocationStatus, "PERMANENT_QL_ALLOCATED_ENGLISH_RUNTIME_PENDING");
assert.equal(allocation.englishRuntimeImplemented, false);
assert.equal(allocation.englishImplementationFrozen, false);
assert.equal(allocation.active, false);
assert.equal(allocation.questionStudioDiscoverable, false);
assert.equal(allocation.questionBankWritable, false);
assert.equal(allocation.testEligible, false);
assert.equal(allocation.publiclyPublishable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.lifecycle.automaticStudentPublication, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.invariants.triangleSquareRectangleQuadrilateralRemainOneCoreSkill, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.invariants.lineSegmentCountingHeldOutsideCurrentQl, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.invariants.curvedOrMixedShapeCountingHeldOutsideCurrentQl, true);

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];
const replayQuestions = Array.from({ length: 32 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const seed = `FCT-CP005-REPLAY-${index}`;
  const question = generateCountingFigureCandidateV2({ seed, targetShape });
  assert.equal(question.authority, FCT_001_PRODUCT_OWNER_APPROVAL_V1.approvedProductionAuthorityId);
  assert.equal(question.targetShape, targetShape);
  assert.equal(question.options[question.correctIndex], question.correctCount);
  assert.equal(new Set(question.options).size, 4);
  assert.deepEqual(generateCountingFigureCandidateV2({ seed, targetShape }), question);
  return question;
});
assert.equal(new Set(replayQuestions.map((question) => question.geometryFingerprint)).size, replayQuestions.length);
assert.equal(new Set(replayQuestions.map((question) => question.contentFingerprint)).size, replayQuestions.length);
assert.equal(new Set(replayQuestions.map((question) => question.targetShape)).size, 4);

const evidence = {
  status: "PASS_FCT_001_CP005_PERMANENT_QL_ALLOCATION_V1",
  approvalAuthority: FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorityId,
  productionAuthority: FCT_001_PRODUCT_OWNER_APPROVAL_V1.approvedProductionAuthorityId,
  allocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId,
  verifiedNewMainHead: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.verifiedNewMainHeadAtAllocation,
  permanentQlId: allocation.permanentQlId,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATIONS_V6.length,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.permanentQlRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.nextAvailablePermanentQlId,
  deterministicReplayChecks: replayQuestions.length,
  uniqueReplayGeometryCount: new Set(replayQuestions.map((question) => question.geometryFingerprint)).size,
  targetShapeCount: new Set(replayQuestions.map((question) => question.targetShape)).size,
  pinnedReviewEvidence: FCT_001_PRODUCT_OWNER_APPROVAL_V1.evidence.realismRemediation,
  lifecycle: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.lifecycle,
  governance: {
    questionStudioDiscoverable: allocation.questionStudioDiscoverable,
    persistenceAllowed: false,
    questionBankWritable: allocation.questionBankWritable,
    testEligible: allocation.testEligible,
    publiclyPublishable: allocation.publiclyPublishable,
    automaticStudentPublication: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.lifecycle.automaticStudentPublication,
    mergeAuthorized: FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorization.mergeAllowed,
    deploymentPerformed: false,
  },
  nextGate: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-cp005-permanent-allocation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
