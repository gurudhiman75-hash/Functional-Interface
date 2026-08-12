import assert from "node:assert/strict";

import {
  RNK_CP004_EXPECTED_PROJECTION_SHA256,
  RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-004/cp004-permanent-runtime-v1";
import {
  RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-005/cp005-permanent-runtime-v1";
import {
  RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256,
  RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
} from "./RNK-CP-006/cp006-permanent-runtime-v1";
import {
  RNK_HELD_GAPS,
  RNK_IMPLEMENTED_STATE_CONTRACTS,
  RNK_POST_CP006_FROZEN_RANGE,
  RNK_POST_CP006_GAP_DECISION,
  RNK_POST_CP006_INFRASTRUCTURE_FINDINGS,
  RNK_POST_CP006_LIFECYCLE,
} from "./rnk-001-post-cp006-gap-audit";

function qlNumber(id: string): number {
  const match = id.match(/^RNK-QL-(\d{3})$/);
  assert.ok(match, `Invalid RNK QL id: ${id}`);
  return Number(match[1]);
}

assert.equal(RNK_POST_CP006_GAP_DECISION, "NO_NEW_QL_JUSTIFIED_YET");
assert.deepEqual(RNK_POST_CP006_FROZEN_RANGE, {
  first: "RNK-QL-001",
  last: "RNK-QL-041",
  nextAvailable: "RNK-QL-042",
});

const tailAssignments = [
  ...RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS,
  ...RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS,
  ...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS,
];
const tailNumbers = tailAssignments.map((entry) => qlNumber(entry.qlId));
assert.deepEqual(tailNumbers, Array.from({ length: 15 }, (_, index) => 27 + index));
assert.equal(tailAssignments.some((entry) => entry.qlId === "RNK-QL-042"), false);

assert.deepEqual(RNK_IMPLEMENTED_STATE_CONTRACTS.map((entry) => entry.contract), [
  "ONE_UNIQUE_STRICT_TOTAL_ORDER",
  "MULTIPLE_VALID_STRICT_TOTAL_ORDERS",
  "ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY",
]);
assert.equal(new Set(RNK_IMPLEMENTED_STATE_CONTRACTS.map((entry) => entry.contract)).size, 3);

assert.deepEqual(RNK_HELD_GAPS.map((entry) => entry.id), [
  "NUMERIC_POST_TIE_RANK_CONVENTION",
  "MULTIPLE_INDEPENDENT_TIE_GROUPS",
  "TIE_CLASS_SIZE_GTE_3",
  "SHARED_RANKING_CASELETS",
  "MIXED_RANKING_AND_BLOOD_RELATION",
  "ADVANCED_MIXED_TRANSFORMATIONS",
]);
assert.equal(RNK_HELD_GAPS.filter((entry) => entry.status === "HOLD").length, 4);
assert.equal(RNK_HELD_GAPS.filter((entry) => entry.status === "INFRASTRUCTURE").length, 1);
assert.equal(RNK_HELD_GAPS.filter((entry) => entry.status === "OTHER_CHAPTER_BOUNDARY").length, 1);

assert.deepEqual(RNK_POST_CP006_INFRASTRUCTURE_FINDINGS, {
  frozenMathematicsRemainsFit: true,
  frozenProjectionChangeRequired: false,
  objectPoolExpansionRequired: true,
  staleRoadmapDocumentationRequiresCorrection: true,
  cp007QuestionGenerationAuthorized: false,
  permanentQl042Allocated: false,
});
assert.deepEqual(RNK_POST_CP006_LIFECYCLE, {
  questionStudio: "DISABLED",
  persistence: "DISABLED",
  questionBank: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  hindiPunjabi: "NOT_STARTED",
});

assert.equal(RNK_CP004_EXPECTED_PROJECTION_SHA256, "39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f");
assert.equal(RNK_CP005_EXPECTED_PERMANENT_PROJECTION_SHA256, "f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717");
assert.equal(RNK_CP006_EXPECTED_PERMANENT_PROJECTION_SHA256, "7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819");

console.log(JSON.stringify({
  status: "PASS",
  decision: RNK_POST_CP006_GAP_DECISION,
  frozenRange: RNK_POST_CP006_FROZEN_RANGE,
  distinctStateContracts: RNK_IMPLEMENTED_STATE_CONTRACTS.length,
  heldOrRedirectedCandidates: RNK_HELD_GAPS.length,
  ql042Allocated: false,
  objectPoolExpansionRequired: true,
}, null, 2));
