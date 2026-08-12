import assert from "node:assert/strict";
import {
  NUM_CP007_COUNT_PROPOSAL,
  NUM_CP007_CROSS_CP_HOLDS,
  NUM_CP007_DISCOVERED_PROTOTYPE_IDS,
  NUM_CP007_POST_WAVE04_GAP_CLOSURES,
  NUM_CP007_PROPOSED_AUTHORITIES,
} from "./post-wave04-authority-proposal.ts";
import { generateNumCp007Wave01Package } from "./wave01/runtime.ts";
import { generateNumCp007Wave02Package } from "./wave02/runtime.ts";
import { generateNumCp007Wave03Package } from "./wave03/runtime.ts";
import {
  buildQuotientZeroEdgeCase,
  generateNumCp007Wave04Package,
  verifyQuotientZeroEdgeCase,
} from "./wave04/runtime.ts";

assert.equal(NUM_CP007_DISCOVERED_PROTOTYPE_IDS.length, 32);
assert.equal(new Set(NUM_CP007_DISCOVERED_PROTOTYPE_IDS).size, 32);

for (let index = 1; index <= 32; index++) {
  const id = `NUM-CP007-PROT-${String(index).padStart(3, "0")}`;
  assert.ok(NUM_CP007_DISCOVERED_PROTOTYPE_IDS.includes(id as never), `Missing discovered prototype ${id}.`);
}

assert.equal(NUM_CP007_PROPOSED_AUTHORITIES.length, 26);
assert.equal(new Set(NUM_CP007_PROPOSED_AUTHORITIES.map((item) => item.authorityId)).size, 26);

const flattened = NUM_CP007_PROPOSED_AUTHORITIES.flatMap((authority) => authority.prototypes);
assert.equal(flattened.length, 32, "Every discovered prototype must be assigned exactly once.");
assert.equal(new Set(flattened).size, 32, "No prototype may appear in two proposed authorities.");
assert.deepEqual([...new Set(flattened)].sort(), [...NUM_CP007_DISCOVERED_PROTOTYPE_IDS].sort());

const mergedGroups = NUM_CP007_PROPOSED_AUTHORITIES.filter((authority) => authority.prototypes.length > 1);
const singletons = NUM_CP007_PROPOSED_AUTHORITIES.filter((authority) => authority.prototypes.length === 1);
const reduction = flattened.length - NUM_CP007_PROPOSED_AUTHORITIES.length;
assert.equal(mergedGroups.length, 5);
assert.equal(singletons.length, 21);
assert.equal(reduction, 6);

assert.deepEqual(
  mergedGroups.map((authority) => [...authority.prototypes]).sort((a, b) => a[0]!.localeCompare(b[0]!)),
  [
    ["NUM-CP007-PROT-006", "NUM-CP007-PROT-009"],
    ["NUM-CP007-PROT-010", "NUM-CP007-PROT-012"],
    ["NUM-CP007-PROT-013", "NUM-CP007-PROT-024", "NUM-CP007-PROT-025"],
    ["NUM-CP007-PROT-020", "NUM-CP007-PROT-032"],
    ["NUM-CP007-PROT-027", "NUM-CP007-PROT-028"],
  ],
);

assert.equal(NUM_CP007_POST_WAVE04_GAP_CLOSURES.length, 9);
for (const closure of NUM_CP007_POST_WAVE04_GAP_CLOSURES) {
  assert.ok(closure.status.startsWith("CLOSED"), `Unclosed Wave 04 finding: ${closure.gap}`);
}

const qZeroClosure = NUM_CP007_POST_WAVE04_GAP_CLOSURES.find((item) => item.gap === "QUOTIENT_ZERO_EDGE_HARDENING");
assert.ok(qZeroClosure);
assert.ok(!qZeroClosure.authorities.includes("CP007-AUTH-003" as never), "Missing-divisor authority must not claim q=0 uniqueness.");
for (let seed = 1; seed <= 120; seed++) {
  assert.ok(verifyQuotientZeroEdgeCase(buildQuotientZeroEdgeCase(seed)), `Invalid quotient-zero proof seed ${seed}.`);
}

assert.equal(NUM_CP007_CROSS_CP_HOLDS.length, 10);
assert.ok(NUM_CP007_CROSS_CP_HOLDS.some((item) => item.form === "N_DIGIT_EXACT_MULTIPLE_EXTREMUM" && item.owner === "NUM-CP-003"));
assert.ok(NUM_CP007_CROSS_CP_HOLDS.some((item) => item.form === "GREATEST_SAME_OR_SPECIFIED_REMAINDER_DIVISOR" && item.owner === "NUM-CP-006"));
assert.ok(NUM_CP007_CROSS_CP_HOLDS.some((item) => item.form === "INDEPENDENT_OR_INCOMPATIBLE_CONGRUENCE_SYSTEM" && item.owner === "NUM-CP-008"));

assert.equal(NUM_CP007_COUNT_PROPOSAL.discoveredPrototypeCount, 32);
assert.equal(NUM_CP007_COUNT_PROPOSAL.proposedAuthorityCount, 26);
assert.equal(NUM_CP007_COUNT_PROPOSAL.mergedAuthorityGroupCount, 5);
assert.equal(NUM_CP007_COUNT_PROPOSAL.singletonAuthorityCount, 21);
assert.equal(NUM_CP007_COUNT_PROPOSAL.prototypeReduction, 6);
assert.equal(NUM_CP007_COUNT_PROPOSAL.routineSourceGapCount, 0);
assert.equal(NUM_CP007_COUNT_PROPOSAL.permanentQlCount, 0);
assert.equal(NUM_CP007_COUNT_PROPOSAL.nextAvailableQl, "NUM-QL-098");
assert.equal(NUM_CP007_COUNT_PROPOSAL.candidateRangeIfApproved, "NUM-QL-098..NUM-QL-123");
assert.equal(NUM_CP007_COUNT_PROPOSAL.nextQlIfApproved, "NUM-QL-124");
assert.equal(NUM_CP007_COUNT_PROPOSAL.proposalStatus, "AWAITING_EXPLICIT_COUNT_APPROVAL");
assert.equal(NUM_CP007_COUNT_PROPOSAL.active, false);
assert.equal(NUM_CP007_COUNT_PROPOSAL.questionStudioDiscoverable, false);
assert.equal(NUM_CP007_COUNT_PROPOSAL.questionBankWritable, false);
assert.equal(NUM_CP007_COUNT_PROPOSAL.testEligible, false);
assert.equal(NUM_CP007_COUNT_PROPOSAL.publiclyPublishable, false);

const candidateStart = 98;
const candidateEnd = 123;
assert.equal(candidateEnd - candidateStart + 1, NUM_CP007_COUNT_PROPOSAL.proposedAuthorityCount);

let inactiveRuntimePackages = 0;
const runtimeSamples = [
  ...(["NUM-CP007-PROT-001", "NUM-CP007-PROT-002", "NUM-CP007-PROT-003", "NUM-CP007-PROT-004", "NUM-CP007-PROT-005", "NUM-CP007-PROT-006", "NUM-CP007-PROT-007", "NUM-CP007-PROT-008"] as const).map((id) => generateNumCp007Wave01Package(id, 7)),
  ...(["NUM-CP007-PROT-009", "NUM-CP007-PROT-010", "NUM-CP007-PROT-011", "NUM-CP007-PROT-012", "NUM-CP007-PROT-013", "NUM-CP007-PROT-014", "NUM-CP007-PROT-015", "NUM-CP007-PROT-016"] as const).map((id) => generateNumCp007Wave02Package(id, 7)),
  ...(["NUM-CP007-PROT-017", "NUM-CP007-PROT-018", "NUM-CP007-PROT-019", "NUM-CP007-PROT-020", "NUM-CP007-PROT-021", "NUM-CP007-PROT-022", "NUM-CP007-PROT-023", "NUM-CP007-PROT-024"] as const).map((id) => generateNumCp007Wave03Package(id, 7)),
  ...(["NUM-CP007-PROT-025", "NUM-CP007-PROT-026", "NUM-CP007-PROT-027", "NUM-CP007-PROT-028", "NUM-CP007-PROT-029", "NUM-CP007-PROT-030", "NUM-CP007-PROT-031", "NUM-CP007-PROT-032"] as const).map((id) => generateNumCp007Wave04Package(id, 7)),
];

for (const pkg of runtimeSamples) {
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
  inactiveRuntimePackages++;
}
assert.equal(inactiveRuntimePackages, 32);

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_POST_WAVE04_SOURCE_GAP_MERGE_SPLIT_AUDIT",
  discoveredPrototypes: NUM_CP007_DISCOVERED_PROTOTYPE_IDS.length,
  proposedAuthorities: NUM_CP007_PROPOSED_AUTHORITIES.length,
  mergedAuthorityGroups: mergedGroups.length,
  singletonAuthorities: singletons.length,
  prototypeReduction: reduction,
  routineSourceGaps: NUM_CP007_COUNT_PROPOSAL.routineSourceGapCount,
  wave04FindingsClosed: NUM_CP007_POST_WAVE04_GAP_CLOSURES.length,
  crossCpHoldsPreserved: NUM_CP007_CROSS_CP_HOLDS.length,
  quotientZeroEdgeProofs: 120,
  inactiveRuntimePackages,
  permanentQlCount: NUM_CP007_COUNT_PROPOSAL.permanentQlCount,
  nextAvailableQl: NUM_CP007_COUNT_PROPOSAL.nextAvailableQl,
  candidateRangeIfApproved: NUM_CP007_COUNT_PROPOSAL.candidateRangeIfApproved,
  proposalStatus: NUM_CP007_COUNT_PROPOSAL.proposalStatus,
}, null, 2));
