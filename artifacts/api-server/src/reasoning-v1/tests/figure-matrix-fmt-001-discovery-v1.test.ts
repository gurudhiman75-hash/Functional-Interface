import assert from "node:assert/strict";
import { FIGURE_MATRIX_SOURCE_EVIDENCE_V1 } from "../foundation/spatial/figure-matrix-source-evidence-v1";
import { FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/figure-matrix-source-saturated-discovery-v1";
import {
  FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V12,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v12";

assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.chapterCode, "FMT-001");
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.semanticBoundary.owns, "ROW_AND_COLUMN_RULE_INFERENCE_IN_A_2D_FIGURE_MATRIX");
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.length, 6);
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.decision.allocatePermanentQlCount, 6);
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.decision.proposedPermanentQlRange, "SPA-QL-055..SPA-QL-060");
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.decision.groupingQuestionsRoutedOutOfChapter, true);
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.runtimeContract.independentSolverRequired, true);
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.runtimeContract.correctOptionMustSatisfyAllEvidentialAxes, true);
assert.equal(FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.explanationContract.assertionOnlyExplanationProhibited, true);

assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.records.length, 5);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.repeatedUnaryTransformSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.binaryCompositionSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.quantitativeCountRelationSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.cyclicDistributionSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.orthogonalRowColumnAttributesSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.compoundRuleSupported, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.taxonomyEvidence.groupingIsSeparateSemanticTask, true);
assert.equal(FIGURE_MATRIX_SOURCE_EVIDENCE_V1.conclusion.sourceSaturationSufficientForReviewRuntime, true);

assert.equal(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.length, 6);
assert.deepEqual(
  FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.map((allocation) => allocation.permanentQlId),
  ["SPA-QL-055", "SPA-QL-056", "SPA-QL-057", "SPA-QL-058", "SPA-QL-059", "SPA-QL-060"],
);
assert.equal(new Set(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.map((allocation) => allocation.proposalId)).size, 6);
assert.equal(new Set(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.map((allocation) => allocation.skillMode)).size, 6);
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.chapterCode === "FMT-001"));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.learnerContentFrozen === false));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.questionStudioDiscoverable === false));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.persistenceAllowed === false));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.questionBankWritable === false));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.testEligible === false));
assert.ok(FIGURE_MATRIX_PERMANENT_QL_ALLOCATIONS_V12.every((allocation) => allocation.publiclyPublishable === false));

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V12.length, 60);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.permanentQlCount, 60);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.permanentQlRange, "SPA-QL-001..SPA-QL-060");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.nextAvailablePermanentQlId, "SPA-QL-061");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.chapterCounts["FMT-001"], 6);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.lifecycle.reviewRuntimeImplemented, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.lifecycle.questionStudioDiscoverable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.lifecycle.automaticStudentPublication, false);

console.log(JSON.stringify({
  authority: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  sourceEvidence: FIGURE_MATRIX_SOURCE_EVIDENCE_V1.authorityId,
  taskFamilies: FIGURE_MATRIX_SOURCE_SATURATED_DISCOVERY_V1.canonicalTaskFamilies.map((family) => ({
    proposalId: family.proposalId,
    skillMode: family.skillMode,
  })),
  allocatedQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.allocatedRange,
  nextAvailableQl: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V12.nextAvailablePermanentQlId,
  groupingRoutedToIdfDiscovery: true,
  releaseGatesRemainClosed: true,
}, null, 2));
