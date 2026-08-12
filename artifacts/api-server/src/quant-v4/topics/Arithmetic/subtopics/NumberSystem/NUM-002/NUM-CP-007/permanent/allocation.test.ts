import {
  NUM_CP007_PERMANENT_ALLOCATION,
  NUM_CP007_PERMANENT_QL_IDS,
} from "./allocation.ts";
import {
  NUM_CP007_DISCOVERED_PROTOTYPE_IDS,
  NUM_CP007_PROPOSED_AUTHORITIES,
} from "../post-wave04-authority-proposal.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUM_CP007_PERMANENT_QL_IDS.length === 26, "permanent QL count");
assert(NUM_CP007_PERMANENT_ALLOCATION.length === 26, "allocation count");
assert(NUM_CP007_PROPOSED_AUTHORITIES.length === 26, "approved authority count");
assert(new Set(NUM_CP007_PERMANENT_QL_IDS).size === 26, "duplicate QL ID");
assert(new Set(NUM_CP007_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size === 26, "duplicate QL template ID");
assert(new Set(NUM_CP007_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size === 26, "duplicate solve mode ID");
assert(new Set(NUM_CP007_PERMANENT_ALLOCATION.map((entry) => entry.authorityId)).size === 26, "duplicate authority ID");

const coveredPrototypes = new Set<string>();
for (const [index, entry] of NUM_CP007_PERMANENT_ALLOCATION.entries()) {
  const expectedNumber = 98 + index;
  assert(entry.qlId === `NUM-QL-${String(expectedNumber).padStart(3, "0")}`, `${entry.qlId}: discontinuity`);
  assert(entry.authorityId === NUM_CP007_PROPOSED_AUTHORITIES[index]!.authorityId, `${entry.qlId}: authority mapping`);
  assert(entry.prototypeIds.length > 0, `${entry.qlId}: empty prototype ancestry`);
  assert(entry.permanentIdentityFrozen, `${entry.qlId}: identity not frozen`);
  assert(entry.allocationStatus === "PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION", `${entry.qlId}: allocation status`);
  assert(entry.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${entry.qlId}: maturity`);
  assert(entry.reviewStatus === "PRODUCT_OWNER_COMPLETION_AUTHORISED", `${entry.qlId}: review status`);
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

assert(coveredPrototypes.size === NUM_CP007_DISCOVERED_PROTOTYPE_IDS.length, "all discovery prototypes represented exactly once");
for (const prototypeId of NUM_CP007_DISCOVERED_PROTOTYPE_IDS) {
  assert(coveredPrototypes.has(prototypeId), `${prototypeId}: missing permanent disposition`);
}
assert(NUM_CP007_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length === 5, "approved merge-group count");

console.log(JSON.stringify({
  status: "PASS_NUM_CP007_PERMANENT_MULTILINGUAL_ALLOCATION",
  firstQlId: NUM_CP007_PERMANENT_QL_IDS[0],
  lastQlId: NUM_CP007_PERMANENT_QL_IDS.at(-1),
  permanentQlCount: NUM_CP007_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: new Set(NUM_CP007_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  representedPrototypeCount: coveredPrototypes.size,
  mergedAuthorityCount: NUM_CP007_PERMANENT_ALLOCATION.filter((entry) => entry.mergeDisposition === "MERGE_AS_PARAMETERS").length,
  maturity: "MULTILINGUAL_IMPLEMENTATION_FROZEN",
  activeQlCount: NUM_CP007_PERMANENT_ALLOCATION.filter((entry) => entry.active).length,
  nextQlId: "NUM-QL-124",
}, null, 2));
