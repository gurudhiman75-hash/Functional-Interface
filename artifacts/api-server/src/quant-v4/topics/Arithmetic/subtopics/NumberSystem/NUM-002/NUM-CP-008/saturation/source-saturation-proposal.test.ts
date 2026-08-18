import {
  NUM_CP008_ADVANCED_HOLDS,
  NUM_CP008_DISCOVERED_PROTOTYPE_IDS,
  NUM_CP008_PROPOSED_AUTHORITIES,
  NUM_CP008_PROTECTED_NON_MERGES,
  NUM_CP008_SATURATION_PROPOSAL,
} from "./source-saturation-proposal.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedPrototypeIds = Array.from({ length: 28 }, (_, index) => `NUM-CP008-PROT-${String(index + 1).padStart(3, "0")}`);
assert(NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length === 28, `Expected 28 discovered prototypes, got ${NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length}`);
assert(JSON.stringify([...NUM_CP008_DISCOVERED_PROTOTYPE_IDS]) === JSON.stringify(expectedPrototypeIds), "Prototype sequence is not exactly PROT-001..028");

assert(NUM_CP008_PROPOSED_AUTHORITIES.length === 21, `Expected 21 proposed authorities, got ${NUM_CP008_PROPOSED_AUTHORITIES.length}`);
assert(new Set(NUM_CP008_PROPOSED_AUTHORITIES.map((authority) => authority.candidateId)).size === 21, "Duplicate candidate authority IDs");
assert(NUM_CP008_PROPOSED_AUTHORITIES.every((authority) => authority.permanentQlId === null), "Permanent QL allocated inside count proposal");

const ownership = new Map<string, string[]>();
for (const authority of NUM_CP008_PROPOSED_AUTHORITIES) {
  assert(authority.prototypeAncestry.length >= 1, `${authority.candidateId}: empty ancestry`);
  for (const prototypeId of authority.prototypeAncestry) {
    const owners = ownership.get(prototypeId) ?? [];
    owners.push(authority.candidateId);
    ownership.set(prototypeId, owners);
  }
}

for (const prototypeId of expectedPrototypeIds) {
  const owners = ownership.get(prototypeId) ?? [];
  assert(owners.length === 1, `${prototypeId}: expected exactly one disposition, got ${owners.length} (${owners.join(", ")})`);
}
assert(ownership.size === 28, `Expected 28 uniquely disposed prototypes, got ${ownership.size}`);

const requiredMergeGroups = [
  ["NUM-CP008-PROT-001", "NUM-CP008-PROT-002", "NUM-CP008-PROT-017"],
  ["NUM-CP008-PROT-007", "NUM-CP008-PROT-015", "NUM-CP008-PROT-020"],
  ["NUM-CP008-PROT-008", "NUM-CP008-PROT-016"],
  ["NUM-CP008-PROT-023", "NUM-CP008-PROT-026"],
  ["NUM-CP008-PROT-024", "NUM-CP008-PROT-028"],
] as const;

for (const group of requiredMergeGroups) {
  const owner = ownership.get(group[0])?.[0];
  assert(owner, `Missing owner for merge group ${group.join("+")}`);
  for (const prototypeId of group) assert(ownership.get(prototypeId)?.[0] === owner, `${group.join("+")}: required merge not preserved`);
  const authority = NUM_CP008_PROPOSED_AUTHORITIES.find((candidate) => candidate.candidateId === owner)!;
  assert(authority.disposition === "MERGED_PARAMETER_AUTHORITY", `${owner}: required merge not labelled merged`);
}

for (const [left, right] of NUM_CP008_PROTECTED_NON_MERGES) {
  assert(ownership.get(left)?.[0] !== ownership.get(right)?.[0], `Protected non-merge violated: ${left} and ${right}`);
}

assert(NUM_CP008_ADVANCED_HOLDS.length === 4, `Expected four advanced holds, got ${NUM_CP008_ADVANCED_HOLDS.length}`);
assert(NUM_CP008_ADVANCED_HOLDS.every((item) => item.status === "ADVANCED_ENRICHMENT_HOLD"), "Advanced hold promoted into routine authority");
assert(new Set(NUM_CP008_ADVANCED_HOLDS.map((item) => item.id)).size === 4, "Duplicate advanced hold IDs");

assert(NUM_CP008_SATURATION_PROPOSAL.discoveredPrototypeCount === 28, "Proposal prototype count drift");
assert(NUM_CP008_SATURATION_PROPOSAL.proposedAuthorityCount === 21, "Proposal authority count drift");
assert(NUM_CP008_SATURATION_PROPOSAL.prototypeReduction === 7, "Prototype reduction drift");
assert(NUM_CP008_SATURATION_PROPOSAL.routineSourceGaps === 0, "Routine source gap remains open");
assert(NUM_CP008_SATURATION_PROPOSAL.permanentQlCount === 0, "Permanent QL allocated before count approval");
assert(NUM_CP008_SATURATION_PROPOSAL.nextAvailableQl === "NUM-QL-166", "Next permanent identity drift");
assert(NUM_CP008_SATURATION_PROPOSAL.proposalStatus === "AWAITING_EXPLICIT_COUNT_APPROVAL", "Count proposal improperly approved");
assert(!NUM_CP008_SATURATION_PROPOSAL.active, "Checkpoint activated during proposal");
assert(!NUM_CP008_SATURATION_PROPOSAL.questionStudioDiscoverable, "Question Studio opened during proposal");
assert(!NUM_CP008_SATURATION_PROPOSAL.questionBankWritable, "Question Bank opened during proposal");
assert(!NUM_CP008_SATURATION_PROPOSAL.testEligible, "Test eligibility opened during proposal");
assert(!NUM_CP008_SATURATION_PROPOSAL.publiclyPublishable, "Public publication opened during proposal");

console.log(JSON.stringify({
  status: "PASS_NUM_CP008_SOURCE_SATURATION_MERGE_SPLIT_PROPOSAL",
  discoveredPrototypes: NUM_CP008_DISCOVERED_PROTOTYPE_IDS.length,
  proposedAuthorities: NUM_CP008_PROPOSED_AUTHORITIES.length,
  prototypeReduction: NUM_CP008_SATURATION_PROPOSAL.prototypeReduction,
  mergedAuthorityCount: NUM_CP008_PROPOSED_AUTHORITIES.filter((authority) => authority.disposition === "MERGED_PARAMETER_AUTHORITY").length,
  singletonAuthorityCount: NUM_CP008_PROPOSED_AUTHORITIES.filter((authority) => authority.disposition === "SINGLETON_AUTHORITY").length,
  protectedNonMerges: NUM_CP008_PROTECTED_NON_MERGES.length,
  advancedHolds: NUM_CP008_ADVANCED_HOLDS.map((item) => item.id),
  routineSourceGaps: NUM_CP008_SATURATION_PROPOSAL.routineSourceGaps,
  permanentQlCount: NUM_CP008_SATURATION_PROPOSAL.permanentQlCount,
  nextAvailableQl: NUM_CP008_SATURATION_PROPOSAL.nextAvailableQl,
  proposalStatus: NUM_CP008_SATURATION_PROPOSAL.proposalStatus,
}, null, 2));
