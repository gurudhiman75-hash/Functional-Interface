import {
  SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V5,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v5";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4 } from "../foundation/spatial/spatial-permanent-ql-allocation-v4";
import { EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/embedded-figure-product-owner-approval-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.approved, "EMB product-owner approval missing.");
assert(EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlAllocationAllowed, "EMB allocation is not authorized.");
assert(EMBEDDED_FIGURE_PRODUCT_OWNER_APPROVAL_V1.authorization.permanentQlId === "SPA-QL-041", "Approval is not pinned to SPA-QL-041.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.baseAuthorityId === SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V4.authorityId, "V5 does not extend V4.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.verifiedNewMainHeadAtAllocation === "b84e4cbd46f97a2524fc69959ed69898fcd0a42e", "Verified New-main head changed.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.verifiedBaseRange === "SPA-QL-001..SPA-QL-040", "Verified base range changed.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.verifiedBaseNextAvailablePermanentQlId === "SPA-QL-041", "Verified base next ID changed.");
assert(SPATIAL_PERMANENT_QL_ALLOCATIONS_V5.length === 41, `Expected 41 permanent Spatial QLs, got ${SPATIAL_PERMANENT_QL_ALLOCATIONS_V5.length}.`);
assert(new Set(SPATIAL_PERMANENT_QL_ALLOCATIONS_V5.map((item) => item.permanentQlId)).size === 41, "Permanent Spatial QL IDs are not unique in V5.");
assert(SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5.length === 1, "EMB allocation must own exactly one permanent QL.");
const emb = SPATIAL_EMBEDDED_FIGURE_PERMANENT_QL_ALLOCATIONS_V5[0];
assert(emb.permanentQlId === "SPA-QL-041", "EMB permanent QL ID changed.");
assert(emb.proposalId === "EMB-PROP-01" && emb.chapterCode === "EMB-001", "EMB proposal/chapter trace changed.");
assert(emb.skillMode === "FIXED_ORIENTATION_EMBEDDED_SUBGRAPH", "EMB skill mode changed.");
assert(emb.equivalencePolicy === "FIXED_ORIENTATION", "EMB SSC core policy changed.");
assert(emb.baseDifficulty === "MODERATE", "EMB base difficulty changed.");
assert(emb.representationPolicy === "DENSITY_SCALE_CROSSINGS_AND_MOTIF_ARE_PARAMETERS_NOT_QLS", "EMB representation policy changed.");
assert(!emb.active && !emb.questionStudioDiscoverable && !emb.questionBankWritable && !emb.testEligible && !emb.publiclyPublishable, "EMB allocation leaked into downstream product surfaces.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount === 41, "Permanent QL count authority changed.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlRange === "SPA-QL-001..SPA-QL-041", "Permanent QL range authority changed.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId === "SPA-QL-042", "Next free Spatial ID must be SPA-QL-042.");
assert(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.chapterCounts["EMB-001"] === 1, "EMB chapter count is not one.");
assert(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle.questionStudioDiscoverable, "Allocation activated Question Studio prematurely.");
assert(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle.questionBankWritable, "Allocation activated Question Bank prematurely.");
assert(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle.testEligible, "Allocation activated test eligibility prematurely.");
assert(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle.publiclyPublishable, "Allocation activated publication prematurely.");
assert(!SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle.automaticStudentPublication, "Allocation activated automatic publication prematurely.");

console.log(JSON.stringify({
  status: "PASS_EMB_001_PERMANENT_QL_ALLOCATION_V5",
  authorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.authorityId,
  baseAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.baseAuthorityId,
  verifiedNewMainHeadAtAllocation: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.verifiedNewMainHeadAtAllocation,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlCount,
  permanentQlRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.permanentQlRange,
  allocatedQlId: emb.permanentQlId,
  nextAvailablePermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextAvailablePermanentQlId,
  governance: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.lifecycle,
  nextGate: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V5.nextGate,
}, null, 2));
