import {
  NUM_CP005_PERMANENT_ALLOCATION,
  NUM_CP005_PERMANENT_QL_IDS,
} from "./allocation";
import { NUM_CP005_PROPOSED_AUTHORITIES } from "../audit/merge-split-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUM_CP005_PERMANENT_QL_IDS.length === 24, "permanent QL count");
assert(NUM_CP005_PERMANENT_ALLOCATION.length === 24, "allocation count");
assert(NUM_CP005_PROPOSED_AUTHORITIES.length === 24, "approved authority count");
assert(new Set(NUM_CP005_PERMANENT_QL_IDS).size === 24, "duplicate QL ID");
assert(new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size === 24, "duplicate QL template ID");
assert(new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size === 24, "duplicate solve mode ID");
assert(new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.authorityId)).size === 24, "duplicate authority ID");

const coveredPrototypes = new Set<string>();
for (const [index, entry] of NUM_CP005_PERMANENT_ALLOCATION.entries()) {
  const expectedNumber = 46 + index;
  assert(entry.qlId === `NUM-QL-${String(expectedNumber).padStart(3, "0")}`, `${entry.qlId}: discontinuity`);
  assert(entry.authorityId === NUM_CP005_PROPOSED_AUTHORITIES[index]!.proposalId, `${entry.qlId}: authority mapping`);
  assert(entry.prototypeIds.length > 0, `${entry.qlId}: empty prototype ancestry`);
  assert(entry.permanentIdentityFrozen, `${entry.qlId}: identity not frozen`);
  assert(!entry.active, `${entry.qlId}: active leak`);
  assert(!entry.questionStudioDiscoverable, `${entry.qlId}: Question Studio leak`);
  assert(!entry.questionBankWritable, `${entry.qlId}: Question Bank leak`);
  assert(!entry.testEligible, `${entry.qlId}: test leak`);
  assert(!entry.publiclyPublishable, `${entry.qlId}: public leak`);
  for (const prototypeId of entry.prototypeIds) {
    assert(!coveredPrototypes.has(prototypeId), `${prototypeId}: duplicate permanent disposition`);
    coveredPrototypes.add(prototypeId);
  }
}
assert(coveredPrototypes.size === 32, "all discovery prototypes must be represented exactly once");

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_PERMANENT_ALLOCATION",
  firstQlId: NUM_CP005_PERMANENT_QL_IDS[0],
  lastQlId: NUM_CP005_PERMANENT_QL_IDS.at(-1),
  permanentQlCount: NUM_CP005_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: new Set(NUM_CP005_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  representedPrototypeCount: coveredPrototypes.size,
  mergedAuthorityCount: NUM_CP005_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length,
  activeQlCount: NUM_CP005_PERMANENT_ALLOCATION.filter((entry) => entry.active).length,
}, null, 2));
