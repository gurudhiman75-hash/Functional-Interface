import {
  NUM_CP006_PERMANENT_ALLOCATION,
  NUM_CP006_PERMANENT_QL_IDS,
} from "./allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUM_CP006_PERMANENT_QL_IDS.length === 28, "permanent QL count");
assert(NUM_CP006_PERMANENT_ALLOCATION.length === 28, "allocation count");
assert(new Set(NUM_CP006_PERMANENT_QL_IDS).size === 28, "duplicate QL ID");
assert(new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size === 28, "duplicate QL template");
assert(new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size === 28, "duplicate solve mode");
assert(new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.authorityId)).size === 28, "duplicate authority");

for (const [index, entry] of NUM_CP006_PERMANENT_ALLOCATION.entries()) {
  const expected = `NUM-QL-${String(index + 70).padStart(3, "0")}`;
  assert(entry.qlId === expected, `${entry.qlId}: non-continuous allocation`);
  assert(entry.prototypeIds.length >= 1, `${entry.qlId}: missing prototype ancestry`);
  assert(entry.sourceEvidence.length >= 4, `${entry.qlId}: source evidence`);
  assert(entry.permanentIdentityFrozen, `${entry.qlId}: identity not frozen`);
  assert(entry.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", `${entry.qlId}: maturity`);
  assert(entry.reviewStatus === "PRODUCT_OWNER_COMPLETION_AUTHORISED", `${entry.qlId}: review status`);
  assert(!entry.active, `${entry.qlId}: active leak`);
  assert(!entry.questionStudioDiscoverable, `${entry.qlId}: Question Studio leak`);
  assert(!entry.questionBankWritable, `${entry.qlId}: Question Bank leak`);
  assert(!entry.testEligible, `${entry.qlId}: test leak`);
  assert(!entry.publiclyPublishable, `${entry.qlId}: public leak`);
}

assert(NUM_CP006_PERMANENT_ALLOCATION.at(-1)?.prototypeIds.length === 2, "caselet merge parameterisation");

console.log(JSON.stringify({
  status: "PASS_NUM_CP006_PERMANENT_ALLOCATION",
  permanentQlCount: NUM_CP006_PERMANENT_QL_IDS.length,
  firstQlId: NUM_CP006_PERMANENT_QL_IDS[0],
  lastQlId: NUM_CP006_PERMANENT_QL_IDS.at(-1),
  solveModeCount: new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size,
  authorityCount: new Set(NUM_CP006_PERMANENT_ALLOCATION.map((entry) => entry.authorityId)).size,
  activeCount: NUM_CP006_PERMANENT_ALLOCATION.filter((entry) => entry.active).length,
}, null, 2));
