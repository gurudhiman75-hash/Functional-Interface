import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  SER_CP007_CANDIDATE_13_COUNTS,
  SER_CP007_CANDIDATE_14_COUNTS,
  SER_CP007_DISCOVERY_AUTHORITY_IDS,
  SER_CP007_TEMPLATE_PROBES,
} from "./authority-compression-contract";

const root =
  "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-AUTHORITY-FREEZE-CANDIDATE";
const report = readFileSync(
  `${root}/authority-compression-candidates-report.md`,
  "utf8",
);
const policy = readFileSync(`${root}/authority-policy-decision.md`, "utf8");

assert.equal(SER_CP007_DISCOVERY_AUTHORITY_IDS.length, 17);
assert.equal(SER_CP007_TEMPLATE_PROBES.length, 140);
assert.equal(Object.keys(SER_CP007_CANDIDATE_14_COUNTS).length, 14);
assert.equal(Object.keys(SER_CP007_CANDIDATE_13_COUNTS).length, 13);
assert.equal(SER_CP007_CANDIDATE_14_COUNTS.PERIODIC_BLOCK_COMPLETION, 4);
assert.equal(SER_CP007_CANDIDATE_13_COUNTS.PERIODIC_BLOCK_COMPLETION, 4);
assert.equal(SER_CP007_CANDIDATE_13_COUNTS.POSITION_PERMUTATION_CLUSTER, 21);

for (const required of [
  "Discovery authorities:          17",
  "Temporary templates:           140",
  "Conservative candidate:         14 authorities",
  "Contract-first candidate:       13 authorities",
  "PERIODIC_BLOCK_COMPLETION",
  "Templates: 4",
  "POSITION_PERMUTATION_CLUSTER",
  "Templates: 21",
  "Generated spot proofs: 420",
  "Recommended candidate: 13 authorities",
  "Fallback candidate:    14 authorities",
  "Permanent QLs:            0",
]) {
  assert.ok(report.includes(required), `candidate report missing: ${required}`);
}

for (const required of [
  "Permanent QL identity = mathematical solve contract",
  "Recommended candidate: 13",
  "Approval state:         RECOMMENDED_NOT_FROZEN",
  "Use the conservative 14-authority model",
  "Question Studio drops subtype or provenance",
  "analytics can report only the merged authority",
  "Policy approval:             PENDING MANUAL DECISION",
  "English discovery freeze:    BLOCKED",
  "Permanent QLs:               0",
  "SER_CP007_13_AUTHORITY_MANUAL_REVIEW_AND_INTEGRATION_METADATA_PROOF",
]) {
  assert.ok(policy.includes(required), `policy missing: ${required}`);
}

for (const merge of [
  "INTERLEAVED_CLUSTER_SERIES",
  "DIRECTIONAL_CONSECUTIVE_CLUSTER",
  "PERIODIC_BLOCK_COMPLETION",
  "POSITION_PERMUTATION_CLUSTER",
]) {
  assert.ok(policy.includes(merge), `policy merge missing: ${merge}`);
}

for (const subtype of [
  "CYCLIC_ROTATION",
  "PAIRWISE_ADJACENT_SWAP",
  "FULL_REVERSAL",
  "ODD_EVEN_REORDER",
]) {
  assert.ok(policy.includes(subtype), `policy subtype missing: ${subtype}`);
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
      temporaryTemplates: 140,
      conservativeCandidateAuthorities: 14,
      recommendedCandidateAuthorities: 13,
      periodicBlockTemplates: 4,
      positionPermutationTemplates: 21,
      recommendedMerges: 4,
      recommendedSplits: 0,
      fallbackCondition: "REAL_METADATA_PRESERVATION_FAILURE",
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
