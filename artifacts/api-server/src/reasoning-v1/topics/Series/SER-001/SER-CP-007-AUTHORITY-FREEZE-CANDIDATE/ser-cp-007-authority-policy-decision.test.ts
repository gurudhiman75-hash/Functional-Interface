import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root =
  "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-AUTHORITY-FREEZE-CANDIDATE";
const conservative = readFileSync(
  `${root}/ser-cp-007-authority-compression-candidate-report.md`,
  "utf8",
);
const contractFirst = readFileSync(
  `${root}/ser-cp-007-authority-compression-contract-first-report.md`,
  "utf8",
);
const subtype = readFileSync(
  `${root}/ser-cp-007-position-permutation-subtype-preservation-report.md`,
  "utf8",
);
const policy = readFileSync(
  `${root}/ser-cp-007-authority-policy-decision.md`,
  "utf8",
);

for (const required of [
  "Current provisional authorities: 17",
  "Compression candidate:           14",
  "Proposed merges:                  3",
  "Permanent QLs:                    0",
]) {
  assert.ok(conservative.includes(required), `14-candidate report missing: ${required}`);
}

for (const required of [
  "Current provisional authorities: 17",
  "Conservative compression:        14",
  "Contract-first compression:      13",
  "Contract-first proposed merges:   4",
  "POSITION_PERMUTATION_CLUSTER:     21",
  "Recommend the 13-authority contract-first candidate",
  "Permanent QLs:                    0",
]) {
  assert.ok(contractFirst.includes(required), `13-candidate report missing: ${required}`);
}

for (const required of [
  "candidateAuthorityId",
  "migrationSourceAuthorityId",
  "permutationKind",
  "provenanceClass",
  "examWeightClass",
  "learnerRenderer",
  "permutationOrder",
  "rotationAmount",
  "Question Studio → Question Bank",
  "Question Bank → analytics",
]) {
  assert.ok(subtype.includes(required), `subtype contract missing: ${required}`);
}

for (const required of [
  "Permanent QL identity = mathematical solve contract",
  "Recommendation:                13",
  "Approval state:                RECOMMENDED_NOT_FROZEN",
  "Use the conservative 14-authority model",
  "Question Studio drops subtype or provenance",
  "analytics can report only the merged authority",
  "Policy approval:              PENDING MANUAL DECISION",
  "English discovery freeze:     BLOCKED",
  "Permanent QLs:                0",
  "SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF",
]) {
  assert.ok(policy.includes(required), `policy decision missing: ${required}`);
}

for (const merge of [
  "INTERLEAVED_CLUSTER_SERIES",
  "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  "PERIODIC_BLOCK_COMPLETION",
  "POSITION_PERMUTATION_CLUSTER",
]) {
  assert.ok(policy.includes(merge), `policy merge missing: ${merge}`);
}

for (const subtypeValue of [
  "CYCLIC_ROTATION",
  "PAIRWISE_ADJACENT_SWAP",
  "FULL_REVERSAL",
  "ODD_EVEN_REORDER",
]) {
  assert.ok(policy.includes(subtypeValue), `policy subtype missing: ${subtypeValue}`);
}

assert.doesNotMatch(policy, /Policy approval:\s+(?:APPROVED|COMPLETE|FROZEN)/);
assert.doesNotMatch(policy, /English discovery freeze:\s+(?:COMPLETE|FROZEN)/);
assert.doesNotMatch(policy, /Permanent QLs:\s+[1-9]/);

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_AUTHORITY_POLICY_RECOMMENDS_13_WITH_14_FALLBACK",
      discoveryAuthorities: 17,
      conservativeCandidateAuthorities: 14,
      recommendedCandidateAuthorities: 13,
      recommendedMerges: 4,
      recommendedSplits: 0,
      fallbackCondition: "PRODUCTION_METADATA_PRESERVATION_FAILURE",
      policyApproval: "PENDING_MANUAL_DECISION",
      fullEnglishReview: "PENDING",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      nextAuthority:
        "SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF",
    },
    null,
    2,
  ),
);
