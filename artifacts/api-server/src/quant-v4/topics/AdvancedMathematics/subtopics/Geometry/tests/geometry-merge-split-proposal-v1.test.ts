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
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_V1.length, 45, "Geometry semantic family count drifted");

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
assert.equal(GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.proposedSemanticFamilyCount, 45);
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
  status: "PASS_GEOMETRY_MERGE_SPLIT_PROPOSAL_V1",
  temporaryCandidates: mappedIds.length,
  proposedSemanticFamilies: GEO_MERGE_SPLIT_PROPOSAL_V1.length,
  deferredSourceGaps: explicitlyDeferred.length,
  otherChapterOwnedGaps: otherChapter.length,
  permanentQlCount: 0,
  lifecycle: GEO_MERGE_SPLIT_PROPOSAL_STATE_V1.state,
}, null, 2));
