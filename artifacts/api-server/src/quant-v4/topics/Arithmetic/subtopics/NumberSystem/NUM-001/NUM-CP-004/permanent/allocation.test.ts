import {
  NUM_CP004_PERMANENT_ALLOCATION,
  NUM_CP004_PERMANENT_QL_IDS,
} from "./allocation";
import {
  NUM_CP004_RETAINED_SOLVE_MODE_IDS,
  NUM_CP004_RETAINED_TEMPLATE_REGISTRY,
} from "../completion/template-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUM_CP004_PERMANENT_QL_IDS.length === 28, "permanent QL count");
assert(NUM_CP004_PERMANENT_ALLOCATION.length === 28, "allocation count");
assert(NUM_CP004_RETAINED_SOLVE_MODE_IDS.length === 28, "solve-mode count");
assert(NUM_CP004_RETAINED_TEMPLATE_REGISTRY.length === 28, "retained-template count");
assert(new Set(NUM_CP004_PERMANENT_QL_IDS).size === 28, "duplicate QL ID");
assert(new Set(NUM_CP004_PERMANENT_ALLOCATION.map((entry) => entry.qlTemplateId)).size === 28, "duplicate QL template ID");
assert(new Set(NUM_CP004_PERMANENT_ALLOCATION.map((entry) => entry.solveModeId)).size === 28, "duplicate solve mode");

for (const [index, entry] of NUM_CP004_PERMANENT_ALLOCATION.entries()) {
  const expectedNumber = 18 + index;
  assert(entry.qlId === `NUM-QL-${String(expectedNumber).padStart(3, "0")}`, `${entry.qlId}: discontinuity`);
  assert(entry.temporaryTemplateId === NUM_CP004_RETAINED_TEMPLATE_REGISTRY[index]!.temporaryTemplateId, `${entry.qlId}: retained mapping`);
  assert(entry.permanentIdentityFrozen, `${entry.qlId}: identity not frozen`);
  assert(!entry.active, `${entry.qlId}: active leak`);
  assert(!entry.questionStudioDiscoverable, `${entry.qlId}: Question Studio leak`);
  assert(!entry.questionBankWritable, `${entry.qlId}: Question Bank leak`);
  assert(!entry.testEligible, `${entry.qlId}: test leak`);
  assert(!entry.publiclyPublishable, `${entry.qlId}: public leak`);
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP004_PERMANENT_ALLOCATION",
  firstQlId: NUM_CP004_PERMANENT_QL_IDS[0],
  lastQlId: NUM_CP004_PERMANENT_QL_IDS.at(-1),
  permanentQlCount: NUM_CP004_PERMANENT_QL_IDS.length,
  frozenSolveModeCount: NUM_CP004_RETAINED_SOLVE_MODE_IDS.length,
  activeQlCount: NUM_CP004_PERMANENT_ALLOCATION.filter((entry) => entry.active).length,
}, null, 2));
