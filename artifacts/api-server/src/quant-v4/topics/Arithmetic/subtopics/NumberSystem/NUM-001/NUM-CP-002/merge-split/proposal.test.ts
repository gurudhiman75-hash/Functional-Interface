import { NUM_CP002_WAVE01_PROTOTYPE_IDS } from "../wave01/types";
import { generateNumCp002Wave01Authority } from "../wave01/authority";
import { NUM_CP002_WAVE02_PROTOTYPE_IDS } from "../wave02/types";
import { generateNumCp002Wave02Authority } from "../wave02/authority";
import { NUM_CP002_WAVE03_PROTOTYPE_IDS } from "../wave03/types";
import { generateNumCp002Wave03Final } from "../wave03/authority-final";
import {
  NUM_CP002_DELEGATED_PROTOTYPES,
  NUM_CP002_PROPOSED_AUTHORITIES,
  NUM_CP002_PROTECTED_NON_MERGES,
  NUM_CP002_SOURCE_SATURATION_PROPOSAL,
  type NumCp002PrototypeId,
} from "./proposal";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const allPrototypeIds = [
  ...NUM_CP002_WAVE01_PROTOTYPE_IDS,
  ...NUM_CP002_WAVE02_PROTOTYPE_IDS,
  ...NUM_CP002_WAVE03_PROTOTYPE_IDS,
] as readonly NumCp002PrototypeId[];

assert(allPrototypeIds.length === 32, `prototype inventory ${allPrototypeIds.length}`);
assert(new Set(allPrototypeIds).size === 32, "prototype IDs are not unique");
assert(NUM_CP002_PROPOSED_AUTHORITIES.length === 21, `authority count ${NUM_CP002_PROPOSED_AUTHORITIES.length}`);
assert(new Set(NUM_CP002_PROPOSED_AUTHORITIES.map((a) => a.authorityId)).size === 21, "authority IDs are not unique");
assert(NUM_CP002_DELEGATED_PROTOTYPES.length === 2, "delegated count");

const membership = new Map<string, string[]>();
for (const authority of NUM_CP002_PROPOSED_AUTHORITIES) {
  assert(authority.permanentQlId === null, `${authority.authorityId}: permanent QL allocated in proposal`);
  assert(authority.corePrototypeIds.length >= 1, `${authority.authorityId}: authority has no core prototype`);
  for (const prototypeId of [...authority.corePrototypeIds, ...authority.adapterPrototypeIds]) {
    const owners = membership.get(prototypeId) ?? [];
    owners.push(authority.authorityId);
    membership.set(prototypeId, owners);
  }
}
for (const delegated of NUM_CP002_DELEGATED_PROTOTYPES) {
  const owners = membership.get(delegated.prototypeId) ?? [];
  owners.push(`DELEGATED:${delegated.owner}`);
  membership.set(delegated.prototypeId, owners);
}

for (const prototypeId of allPrototypeIds) {
  const owners = membership.get(prototypeId) ?? [];
  assert(owners.length === 1, `${prototypeId}: expected one disposition, found ${owners.join(",") || "none"}`);
}
assert(membership.size === 32, `disposition inventory ${membership.size}`);

const adapterIds = NUM_CP002_PROPOSED_AUTHORITIES.flatMap((a) => a.adapterPrototypeIds).sort();
assert(JSON.stringify(adapterIds) === JSON.stringify([
  "NUM-CP002-PROT-022",
  "NUM-CP002-PROT-024",
  "NUM-CP002-PROT-029",
]), `adapter inventory ${adapterIds}`);
assert(JSON.stringify(NUM_CP002_DELEGATED_PROTOTYPES.map((d) => d.prototypeId).sort()) === JSON.stringify([
  "NUM-CP002-PROT-027",
  "NUM-CP002-PROT-028",
]), "delegated prototype inventory");

const authorityIds = new Set(NUM_CP002_PROPOSED_AUTHORITIES.map((a) => a.authorityId));
for (const [left, right, reason] of NUM_CP002_PROTECTED_NON_MERGES) {
  assert(authorityIds.has(left as any) && authorityIds.has(right as any), `protected non-merge references unknown authority ${left}/${right}`);
  assert(String(reason).length >= 40, `${left}/${right}: non-merge rationale too weak`);
}
assert(NUM_CP002_PROTECTED_NON_MERGES.length >= 9, "insufficient protected non-merge coverage");

const findAuthority = (prototypeId: string) => NUM_CP002_PROPOSED_AUTHORITIES.find((a) => [...a.corePrototypeIds, ...a.adapterPrototypeIds].includes(prototypeId as any));
assert(findAuthority("NUM-CP002-PROT-002")?.authorityId === findAuthority("NUM-CP002-PROT-003")?.authorityId, "mixed/improper directions not merged");
assert(findAuthority("NUM-CP002-PROT-005")?.authorityId === findAuthority("NUM-CP002-PROT-006")?.authorityId, "pure/mixed recurring reconstruction not merged");
assert(findAuthority("NUM-CP002-PROT-012")?.authorityId === findAuthority("NUM-CP002-PROT-016")?.authorityId, "place-count / power-ten invariant not merged");
assert(findAuthority("NUM-CP002-PROT-013")?.authorityId === findAuthority("NUM-CP002-PROT-014")?.authorityId, "minimal termination intervention not merged");
assert(findAuthority("NUM-CP002-PROT-019")?.authorityId === findAuthority("NUM-CP002-PROT-030")?.authorityId, "numerator cancellation authority not merged");
assert(findAuthority("NUM-CP002-PROT-025")?.authorityId === findAuthority("NUM-CP002-PROT-026")?.authorityId, "missing component inverse not merged");

assert(findAuthority("NUM-CP002-PROT-004")?.authorityId !== findAuthority("NUM-CP002-PROT-007")?.authorityId, "terminating conversion directions over-merged");
assert(findAuthority("NUM-CP002-PROT-005")?.authorityId !== findAuthority("NUM-CP002-PROT-008")?.authorityId, "recurring conversion directions over-merged");
assert(findAuthority("NUM-CP002-PROT-017")?.authorityId !== findAuthority("NUM-CP002-PROT-018")?.authorityId, "count/set answer burdens over-merged");
assert(findAuthority("NUM-CP002-PROT-020")?.authorityId !== findAuthority("NUM-CP002-PROT-021")?.authorityId, "recurring digit/period targets over-merged");
assert(findAuthority("NUM-CP002-PROT-031")?.authorityId !== findAuthority("NUM-CP002-PROT-032")?.authorityId, "statement/DS answer shapes over-merged");

let runtimeSpotChecks = 0;
for (const seed of [0, 1, 7, 19, 53, 97]) {
  for (const prototypeId of NUM_CP002_WAVE01_PROTOTYPE_IDS) {
    const q = generateNumCp002Wave01Authority(prototypeId, seed);
    assert(q.permanentQlId === null && !q.lifecycle.questionStudioDiscoverable && !q.lifecycle.questionBankWritable && !q.lifecycle.testEligible && !q.lifecycle.publiclyPublishable, `${prototypeId}/${seed}: lifecycle opened`);
    runtimeSpotChecks += 1;
  }
  for (const prototypeId of NUM_CP002_WAVE02_PROTOTYPE_IDS) {
    const q = generateNumCp002Wave02Authority(prototypeId, seed);
    assert(q.permanentQlId === null && !q.lifecycle.questionStudioDiscoverable && !q.lifecycle.questionBankWritable && !q.lifecycle.testEligible && !q.lifecycle.publiclyPublishable, `${prototypeId}/${seed}: lifecycle opened`);
    runtimeSpotChecks += 1;
  }
  for (const prototypeId of NUM_CP002_WAVE03_PROTOTYPE_IDS) {
    const q = generateNumCp002Wave03Final(prototypeId, seed);
    assert(q.permanentQlId === null && !q.lifecycle.questionStudioDiscoverable && !q.lifecycle.questionBankWritable && !q.lifecycle.testEligible && !q.lifecycle.publiclyPublishable, `${prototypeId}/${seed}: lifecycle opened`);
    runtimeSpotChecks += 1;
  }
}
assert(runtimeSpotChecks === 192, `runtime spot checks ${runtimeSpotChecks}`);

assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.temporaryPrototypeCount === 32, "proposal prototype count");
assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.inScopePrototypeCount === 30, "proposal in-scope count");
assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.delegatedPrototypeCount === 2, "proposal delegated count");
assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.proposedPermanentAuthorityCount === 21, "proposal permanent count");
assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.permanentQlIdsAllocated === false, "proposal allocated IDs early");
assert(NUM_CP002_SOURCE_SATURATION_PROPOSAL.sourceSaturated === true, "source saturation not closed");
assert(!NUM_CP002_SOURCE_SATURATION_PROPOSAL.questionStudioDiscoverable, "Question Studio opened");
assert(!NUM_CP002_SOURCE_SATURATION_PROPOSAL.questionBankWritable, "Question Bank opened");
assert(!NUM_CP002_SOURCE_SATURATION_PROPOSAL.testEligible, "test gate opened");
assert(!NUM_CP002_SOURCE_SATURATION_PROPOSAL.publiclyPublishable, "public gate opened");

console.log(JSON.stringify({
  status: "PASS_NUM_CP002_SOURCE_SATURATION_MERGE_SPLIT_PROPOSAL",
  temporaryPrototypeCount: allPrototypeIds.length,
  inScopePrototypeCount: 30,
  delegatedPrototypeCount: NUM_CP002_DELEGATED_PROTOTYPES.length,
  adapterPrototypeCount: adapterIds.length,
  proposedPermanentAuthorityCount: NUM_CP002_PROPOSED_AUTHORITIES.length,
  permanentQlIdsAllocated: false,
  protectedNonMergeCount: NUM_CP002_PROTECTED_NON_MERGES.length,
  runtimeSpotChecks,
  nextAvailablePermanentQlId: NUM_CP002_SOURCE_SATURATION_PROPOSAL.firstAvailablePermanentQlId,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
}, null, 2));
