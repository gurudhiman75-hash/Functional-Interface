import assert from "node:assert/strict";
import {
  NUM_CP008_COUNT_PROPOSAL,
  NUM_CP008_DISCOVERED_PROTOTYPE_IDS,
  NUM_CP008_FINAL_SOURCE_RECHECK,
  NUM_CP008_PROPOSED_AUTHORITIES,
  NUM_CP008_PROTECTED_NON_MERGES,
} from "./post-wave04-authority-proposal.ts";
import { generateNumCp008Wave01 } from "./wave01/runtime.ts";
import { generateNumCp008Wave02 } from "./wave02/runtime.ts";
import { generateNumCp008Wave03 } from "./wave03/runtime.ts";
import { generateNumCp008Wave04Package } from "./wave04/runtime.ts";

assert.equal(NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length, 26);
assert.equal(new Set(NUM_CP008_DISCOVERED_PROTOTYPE_IDS).size, 26);
for (let index = 1; index <= 26; index += 1) {
  const id = `NUM-CP008-PROT-${String(index).padStart(3, "0")}`;
  assert.ok(NUM_CP008_DISCOVERED_PROTOTYPE_IDS.includes(id), `Missing discovered prototype ${id}`);
}

assert.equal(NUM_CP008_PROPOSED_AUTHORITIES.length, 19);
assert.equal(new Set(NUM_CP008_PROPOSED_AUTHORITIES.map((item) => item.authorityId)).size, 19);

const flattened = NUM_CP008_PROPOSED_AUTHORITIES.flatMap((authority) => [...authority.prototypes]);
assert.equal(flattened.length, 26, "Every discovered prototype must be assigned exactly once.");
assert.equal(new Set(flattened).size, 26, "No discovered prototype may appear in two authorities.");
assert.deepEqual([...flattened].sort(), [...NUM_CP008_DISCOVERED_PROTOTYPE_IDS].sort());

const mergedGroups = NUM_CP008_PROPOSED_AUTHORITIES.filter((authority) => authority.prototypes.length > 1);
const singletons = NUM_CP008_PROPOSED_AUTHORITIES.filter((authority) => authority.prototypes.length === 1);
assert.equal(mergedGroups.length, 6);
assert.equal(singletons.length, 13);
assert.equal(26 - 19, 7);

assert.deepEqual(
  mergedGroups.map((authority) => [...authority.prototypes]).sort((a, b) => a[0]!.localeCompare(b[0]!)),
  [
    ["NUM-CP008-PROT-001", "NUM-CP008-PROT-002"],
    ["NUM-CP008-PROT-004", "NUM-CP008-PROT-005"],
    ["NUM-CP008-PROT-007", "NUM-CP008-PROT-015", "NUM-CP008-PROT-020"],
    ["NUM-CP008-PROT-008", "NUM-CP008-PROT-016"],
    ["NUM-CP008-PROT-010", "NUM-CP008-PROT-024"],
    ["NUM-CP008-PROT-011", "NUM-CP008-PROT-026"],
  ],
);

assert.equal(NUM_CP008_PROTECTED_NON_MERGES.length, 6);
const protectedText = NUM_CP008_PROTECTED_NON_MERGES.map((item) => item.reason).join(" ");
assert.match(protectedText, /power/i);
assert.match(protectedText, /Extremum/i);
assert.match(protectedText, /coefficient/i);
assert.match(protectedText, /Data Sufficiency/i);
assert.match(protectedText, /no-solution/i);
assert.match(protectedText, /incompatible/i);

assert.equal(NUM_CP008_FINAL_SOURCE_RECHECK.designDirectionDispositions.length, 8);
assert.equal(NUM_CP008_FINAL_SOURCE_RECHECK.advancedDispositions.length, 4);
assert.equal(NUM_CP008_FINAL_SOURCE_RECHECK.ownershipHolds.length, 5);
assert.equal(NUM_CP008_FINAL_SOURCE_RECHECK.routineSourceGapCount, 0);
assert.match(NUM_CP008_FINAL_SOURCE_RECHECK.cp007Boundary, /DIVISION/);
assert.match(NUM_CP008_FINAL_SOURCE_RECHECK.cp009Boundary, /TERMINAL_DIGIT/);
assert.match(NUM_CP008_FINAL_SOURCE_RECHECK.cp010Boundary, /DIGIT_CONSTRUCTION/);

assert.equal(NUM_CP008_COUNT_PROPOSAL.discoveredPrototypeCount, 26);
assert.equal(NUM_CP008_COUNT_PROPOSAL.proposedAuthorityCount, 19);
assert.equal(NUM_CP008_COUNT_PROPOSAL.mergedAuthorityGroupCount, 6);
assert.equal(NUM_CP008_COUNT_PROPOSAL.singletonAuthorityCount, 13);
assert.equal(NUM_CP008_COUNT_PROPOSAL.prototypeReduction, 7);
assert.equal(NUM_CP008_COUNT_PROPOSAL.routineSourceGapCount, 0);
assert.equal(NUM_CP008_COUNT_PROPOSAL.sourceSaturationForCurrentOrdinaryOwnership, true);
assert.equal(NUM_CP008_COUNT_PROPOSAL.permanentQlCount, 0);
assert.equal(NUM_CP008_COUNT_PROPOSAL.nextAvailableQl, "NUM-QL-166");
assert.equal(NUM_CP008_COUNT_PROPOSAL.candidateRangeIfApproved, "NUM-QL-166..NUM-QL-184");
assert.equal(NUM_CP008_COUNT_PROPOSAL.nextQlIfApproved, "NUM-QL-185");
assert.equal(NUM_CP008_COUNT_PROPOSAL.proposalStatus, "AWAITING_EXPLICIT_COUNT_APPROVAL");
assert.equal(NUM_CP008_COUNT_PROPOSAL.active, false);
assert.equal(NUM_CP008_COUNT_PROPOSAL.questionStudioDiscoverable, false);
assert.equal(NUM_CP008_COUNT_PROPOSAL.questionBankWritable, false);
assert.equal(NUM_CP008_COUNT_PROPOSAL.testEligible, false);
assert.equal(NUM_CP008_COUNT_PROPOSAL.publiclyPublishable, false);
assert.equal(184 - 166 + 1, NUM_CP008_COUNT_PROPOSAL.proposedAuthorityCount);

const wave01Ids = NUM_CP008_DISCOVERED_PROTOTYPE_IDS.slice(0, 8);
const wave02Ids = NUM_CP008_DISCOVERED_PROTOTYPE_IDS.slice(8, 16);
const wave03Ids = NUM_CP008_DISCOVERED_PROTOTYPE_IDS.slice(16, 24);
const wave04Ids = NUM_CP008_DISCOVERED_PROTOTYPE_IDS.slice(24, 26);
const runtimeSamples = [
  ...wave01Ids.map((id) => generateNumCp008Wave01(id as never, 17)),
  ...wave02Ids.map((id) => generateNumCp008Wave02(id as never, 17)),
  ...wave03Ids.map((id) => generateNumCp008Wave03(id as never, 17)),
  ...wave04Ids.map((id) => generateNumCp008Wave04Package(id as never, 17)),
];

assert.equal(runtimeSamples.length, 26);
for (const pkg of runtimeSamples) {
  assert.equal(pkg.permanentQlId, null);
  assert.equal(pkg.lifecycle.active, false);
  assert.equal(pkg.lifecycle.questionStudioDiscoverable, false);
  assert.equal(pkg.lifecycle.questionBankWritable, false);
  assert.equal(pkg.lifecycle.testEligible, false);
  assert.equal(pkg.lifecycle.publiclyPublishable, false);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_FINAL_SOURCE_SATURATION_MERGE_SPLIT",
  discoveredPrototypes: NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length,
  proposedAuthorities: NUM_CP008_PROPOSED_AUTHORITIES.length,
  mergedAuthorityGroups: mergedGroups.length,
  singletonAuthorities: singletons.length,
  prototypeReduction: NUM_CP008_COUNT_PROPOSAL.prototypeReduction,
  designDirectionDispositions: NUM_CP008_FINAL_SOURCE_RECHECK.designDirectionDispositions.length,
  advancedHolds: NUM_CP008_FINAL_SOURCE_RECHECK.advancedDispositions.length,
  ownershipHolds: NUM_CP008_FINAL_SOURCE_RECHECK.ownershipHolds.length,
  routineSourceGaps: NUM_CP008_FINAL_SOURCE_RECHECK.routineSourceGapCount,
  inactiveRuntimeSamples: runtimeSamples.length,
  permanentQlCount: NUM_CP008_COUNT_PROPOSAL.permanentQlCount,
  nextAvailableQl: NUM_CP008_COUNT_PROPOSAL.nextAvailableQl,
  candidateRangeIfApproved: NUM_CP008_COUNT_PROPOSAL.candidateRangeIfApproved,
  proposalStatus: NUM_CP008_COUNT_PROPOSAL.proposalStatus,
}, null, 2));
