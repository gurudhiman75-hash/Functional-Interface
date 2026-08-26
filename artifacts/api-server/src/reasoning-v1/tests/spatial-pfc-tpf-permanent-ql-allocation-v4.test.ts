import assert from "node:assert/strict";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V2,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V4,
  SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v4";
import { PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/paper-folding-final-combined-product-owner-approval-v1";

assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V2.nextAvailablePermanentQlId, "SPA-QL-035");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V2.length, 34);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.length, 6);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V4.length, 40);
assert.equal(new Set(SPATIAL_PERMANENT_QL_ALLOCATIONS_V4.map((entry) => entry.permanentQlId)).size, 40);
assert.deepEqual(
  SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.map((entry) => entry.permanentQlId),
  ["SPA-QL-035", "SPA-QL-036", "SPA-QL-037", "SPA-QL-038", "SPA-QL-039", "SPA-QL-040"],
);
assert.deepEqual(
  SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.map((entry) => entry.proposalId),
  ["PFC-PROP-01", "PFC-PROP-02", "PFC-PROP-03", "PFC-PROP-04", "PFC-PROP-05", "TPF-PROP-01"],
);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.filter((entry) => entry.chapterCode === "PFC-001").length, 5);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.filter((entry) => entry.chapterCode === "TPF-001").length, 1);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.filter((entry) => entry.skillMode === "FORWARD_UNFOLD").length, 4);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.filter((entry) => entry.skillMode === "REVERSE_INFERENCE").length, 1);
assert.equal(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.filter((entry) => entry.skillMode === "TRANSPARENT_SUPERPOSITION").length, 1);
assert.ok(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.every((entry) => entry.representationPolicy === "REPRESENTATION_AXIS_NOT_QL"));
assert.ok(SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.every((entry) => entry.provenancePolicy === "SOURCE_BACKED_AND_CONTROLLED_NOVEL_ALLOWED_WITH_TAGS"));
assert.equal(PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.approved, true);
assert.equal(PFC_TPF_FINAL_COMBINED_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.verifiedBaseNextAvailablePermanentQlId, "SPA-QL-035");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.nextAvailablePermanentQlId, "SPA-QL-041");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.permanentQlRange, "SPA-QL-001..SPA-QL-040");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.invariants.paperShapeCreatesStandaloneQl, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.invariants.forwardVsReverseCreatesSkillBoundary, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.invariants.opaqueVsTransparentCreatesChapterBoundary, true);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.lifecycle.questionStudioDiscoverable, false);
console.log(JSON.stringify({
  status: "PASS_PFC_TPF_PERMANENT_QL_ALLOCATION_V4",
  authorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId,
  allocatedRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.allocatedRange,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.nextAvailablePermanentQlId,
  allocations: SPATIAL_PFC_TPF_PERMANENT_QL_ALLOCATIONS_V4.map(({ permanentQlId, proposalId, chapterCode, skillMode, name }) => ({ permanentQlId, proposalId, chapterCode, skillMode, name })),
}));
