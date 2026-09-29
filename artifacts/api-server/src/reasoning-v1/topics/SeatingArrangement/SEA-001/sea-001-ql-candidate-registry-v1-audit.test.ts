import assert from "node:assert/strict";
import {
  SEA_001_QL_CANDIDATES_V1,
  SEA_001_QL_CANDIDATE_REGISTRY_V1,
} from "./sea-001-ql-candidate-registry-v1.ts";

assert.equal(SEA_001_QL_CANDIDATES_V1.length, 9);
assert.equal(SEA_001_QL_CANDIDATE_REGISTRY_V1.candidateCount, 9);
assert.equal(SEA_001_QL_CANDIDATE_REGISTRY_V1.permanentQlAllocationPermittedByThisFile, false);

const runtimeOwner = new Map<string, string>();
const extensionOwner = new Map<string, string>();
for (const candidate of SEA_001_QL_CANDIDATES_V1) {
  for (const queryId of candidate.ownedRuntimeQueryContracts) {
    assert.equal(runtimeOwner.has(queryId), false, `${queryId} has duplicate candidate ownership`);
    runtimeOwner.set(queryId, candidate.candidateQlId);
  }
  for (const kind of candidate.ownedReviewExtensionKinds) {
    assert.equal(extensionOwner.has(kind), false, `${kind} has duplicate candidate ownership`);
    extensionOwner.set(kind, candidate.candidateQlId);
  }
}

for (const queryId of [
  "SEA-QC-001","SEA-QC-003","SEA-QC-005","SEA-QC-006","SEA-QC-008",
  "SEA-QC-009","SEA-QC-010","SEA-QC-020","SEA-QC-022",
]) {
  assert.ok(runtimeOwner.has(queryId), `${queryId} is implemented but unowned`);
}

for (const kind of [
  "EXTREME_END_PAIR",
  "RELATIVE_POSITION_DESCRIPTION",
  "DEFINITELY_TRUE_RELATION_STATEMENT",
  "FACING_DIRECTION_COUNT",
  "END_PERSON_AND_FACING",
]) {
  assert.ok(extensionOwner.has(kind), `${kind} is a review extension but unowned`);
}

assert.equal(runtimeOwner.get("SEA-QC-003"), "SEA-QL-CAND-002");
assert.equal(runtimeOwner.get("SEA-QC-005"), "SEA-QL-CAND-002");
assert.equal(runtimeOwner.get("SEA-QC-022"), "SEA-QL-CAND-002");
assert.equal(extensionOwner.get("RELATIVE_POSITION_DESCRIPTION"), "SEA-QL-CAND-003");
assert.equal(extensionOwner.get("DEFINITELY_TRUE_RELATION_STATEMENT"), "SEA-QL-CAND-003");
assert.equal(extensionOwner.get("FACING_DIRECTION_COUNT"), "SEA-QL-CAND-009");
assert.equal(extensionOwner.get("END_PERSON_AND_FACING"), "SEA-QL-CAND-009");

for (const unused of SEA_001_QL_CANDIDATE_REGISTRY_V1.planningOnlyRuntimeQueryIdsNotAllocated) {
  assert.equal(runtimeOwner.has(unused), false, `${unused} must remain planning-only`);
}

console.log(JSON.stringify({
  status: "PASS_SEA_001_QL_CANDIDATE_REGISTRY_V1",
  candidateCount: SEA_001_QL_CANDIDATES_V1.length,
  runtimeOwnedQueryContracts: runtimeOwner.size,
  reviewExtensionKinds: extensionOwner.size,
  permanentAllocated: false,
}, null, 2));
