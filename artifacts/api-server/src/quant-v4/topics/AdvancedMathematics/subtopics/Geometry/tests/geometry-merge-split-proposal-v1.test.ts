import assert from "node:assert/strict";
import { GEO_GAP_CLOSURE_LEDGER_V1 } from "../source-audit/geometry-gap-closure-ledger-v1";
import {
  GEO_TEMPORARY_CANDIDATE_IDS_V1,
  GEO_TEMPORARY_CANDIDATE_REGISTRY_V1,
} from "../permanent-review/geometry-temporary-candidate-registry-v1";
import {
  GEO_MERGE_SPLIT_PROPOSAL_STATE_V1,
  GEO_MERGE_SPLIT_PROPOSAL_V1,
} from "../permanent-review/geometry-merge-split-proposal-v1";

assert.equal(GEO_TEMPORARY_CANDIDATE_REGISTRY_V1.length, 81);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_V1.length, 74, "Geometry strict semantic family count drifted");

const mappedIds = GEO_MERGE_SPLIT_PROPOSAL_V1.flatMap((family) => family.candidateIds);
assert.equal(mappedIds.length, 81, "Every temporary candidate must map to exactly one proposed family");
assert.equal(new Set(mappedIds).size, 81, "A temporary candidate is mapped to more than one proposed family");
assert.deepEqual(
  [...new Set(mappedIds)].sort(),
  [...GEO_TEMPORARY_CANDIDATE_IDS_V1].sort(),
  "Merge/split proposal must cover the canonical 81-candidate registry exactly",
);

const keys = GEO_MERGE_SPLIT_PROPOSAL_V1.map((family) => family.proposalKey);
assert.equal(new Set(keys).size, keys.length, "Proposal keys must be unique");

for (const family of GEO_MERGE_SPLIT_PROPOSAL_V1) {
  assert.ok(family.candidateIds.length > 0, `${family.proposalKey} has no candidates`);
  assert.equal(family.solveModes.length, family.candidateIds.length);
  assert.equal(family.permanentQlId, null);
  assert.equal(family.allocationAuthorized, false);
  assert.match(family.cpId, /^GEO-CP-0(0[1-9]|1[0-4])$/);
  assert.ok(family.learnerDecision.length > 3);
  assert.ok(family.mergeRationale.length > 10);
}

const expectedFamiliesByCp = Object.freeze({
  "GEO-CP-001": 4,
  "GEO-CP-002": 3,
  "GEO-CP-003": 7,
  "GEO-CP-004": 4,
  "GEO-CP-005": 6,
  "GEO-CP-006": 9,
  "GEO-CP-007": 3,
  "GEO-CP-008": 5,
  "GEO-CP-009": 7,
  "GEO-CP-010": 5,
  "GEO-CP-011": 6,
  "GEO-CP-012": 5,
  "GEO-CP-013": 3,
  "GEO-CP-014": 7,
} as const);

for (const [cpId, expectedCount] of Object.entries(expectedFamiliesByCp)) {
  const actualCount = GEO_MERGE_SPLIT_PROPOSAL_V1.filter((family) => family.cpId === cpId).length;
  assert.equal(actualCount, expectedCount, `${cpId} strict semantic-family count drifted`);
}

const mergedFamilies = GEO_MERGE_SPLIT_PROPOSAL_V1.filter((family) => family.candidateIds.length > 1);
assert.equal(mergedFamilies.length, 7, "Only seven intentional merge groups are authorized in the strict proposal");
const mergeSavings = mergedFamilies.reduce((sum, family) => sum + family.candidateIds.length - 1, 0);
assert.equal(mergeSavings, 7, "The strict proposal must compress exactly seven duplicate authorities: 81 to 74");
assert.deepEqual(
  mergedFamilies.map((family) => family.proposalKey).sort(),
  [
    "CP004_SELECT_VALID_CONGRUENCE_CRITERION",
    "CP005_PERIMETER_SIDE_SCALE_TRANSFER",
    "CP006_CENTROID_DIRECT_INVERSE",
    "CP006_INCENTRE_ANGLE_DIRECT_INVERSE",
    "CP006_TRIANGLE_CENTRE_IDENTIFICATION",
    "CP013_SECANT_SECANT_DIRECT_REVERSE",
    "CP014_PARALLEL_CONGRUENCE_CPCT_SYNTHESIS",
  ].sort(),
  "Unexpected merge group entered or left the strict proposal",
);

const centreIdentification = GEO_MERGE_SPLIT_PROPOSAL_V1.find((family) => family.proposalKey === "CP006_TRIANGLE_CENTRE_IDENTIFICATION");
assert.deepEqual(
  centreIdentification?.candidateIds,
  ["GEO-TMP-GAP-CP006-CIRCUMCENTRE-IDENTIFY-V1", "GEO-TMP-GAP-W3-CP006-INCENTRE-IDENTIFY-V1"],
  "Generic centre identification must contain only centre-name recognition from defining concurrency",
);
const rightOrthocentre = GEO_MERGE_SPLIT_PROPOSAL_V1.find((family) => family.proposalKey === "CP006_RIGHT_TRIANGLE_ORTHOCENTRE_LOCATION");
assert.deepEqual(
  rightOrthocentre?.candidateIds,
  ["GEO-TMP-GAP-W3-CP006-RIGHT-TRIANGLE-ORTHOCENTRE-V1"],
  "Right-triangle orthocentre location must remain a separate learner authority",
);

const explicitlyDeferred = GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "DEFERRED_SOURCE_EVIDENCE");
assert.equal(explicitlyDeferred.length, 5);
for (const entry of explicitlyDeferred) {
  assert.equal(
    mappedIds.some((candidateId) => candidateId.includes(entry.gapId.split("/")[1] ?? "__NO_MATCH__")),
    false,
    `${entry.gapId} is source-deferred and must not be fabricated into the permanent proposal`,
  );
}

const otherChapter = GEO_GAP_CLOSURE_LEDGER_V1.filter((entry) => entry.state === "OWNED_OTHER_CHAPTER");
assert.equal(otherChapter.length, 1);
assert.match(otherChapter[0]?.gapId ?? "", /MULTI_THEOREM_STATEMENT_COMPARISON_OR_DATA_SUFFICIENCY/);

assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.temporaryCandidateCount, 81);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.proposedSemanticFamilyCount, 74);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.expectedProposedSemanticFamilyCount, 74);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentQlCount, 0);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentQlIdsReserved, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.permanentAllocationAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.solveModeFreezeAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.englishFreezeAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.localizationAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.questionStudioActivationAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.questionBankWriteAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.testEligibilityAuthorized, false);
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.publicPublicationAuthorized, false);

console.log(JSON.stringify({
  status: "PASS_GEOMETRY_STRICT_81_TO_74_MERGE_SPLIT_PROPOSAL_V1",
  temporaryCandidates: mappedIds.length,
  proposedSemanticFamilies: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  intentionalMergeGroups: mergedFamilies.length,
  mergeSavings,
  familiesByCp: expectedFamiliesByCp,
  deferredSourceGaps: explicitlyDeferred.length,
  otherChapterOwnedGaps: otherChapter.length,
  permanentQlCount: 0,
  lifecycle: GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.state,
}, null, 2));
