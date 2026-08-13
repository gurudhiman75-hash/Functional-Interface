import {
  NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
} from "./number-system-current-allocation-registry";
import { NUM_CP001_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-001/permanent/allocation";
import { NUM_CP003_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-003/permanent/allocation";
import { NUM_CP004_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-004/permanent/allocation";
import { NUM_CP005_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-005/permanent/allocation";
import { NUM_CP006_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-006/permanent/allocation";
import { NUM_CP007_PERMANENT_QL_IDS } from "../NUM-002/NUM-CP-007/permanent/allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length === 6, "completed checkpoint count");
assert(NUM_CP003_PERMANENT_QL_IDS.length === 17, "CP-003 QL count");
assert(NUM_CP004_PERMANENT_QL_IDS.length === 28, "CP-004 QL count");
assert(NUM_CP005_PERMANENT_QL_IDS.length === 24, "CP-005 QL count");
assert(NUM_CP006_PERMANENT_QL_IDS.length === 28, "CP-006 QL count");
assert(NUM_CP007_PERMANENT_QL_IDS.length === 26, "CP-007 QL count");
assert(NUM_CP001_PERMANENT_QL_IDS.length === 21, "CP-001 QL count");

const allQlIds = [
  ...NUM_CP003_PERMANENT_QL_IDS,
  ...NUM_CP004_PERMANENT_QL_IDS,
  ...NUM_CP005_PERMANENT_QL_IDS,
  ...NUM_CP006_PERMANENT_QL_IDS,
  ...NUM_CP007_PERMANENT_QL_IDS,
  ...NUM_CP001_PERMANENT_QL_IDS,
];
assert(allQlIds.length === 144, "chapter permanent QL count");
assert(new Set(allQlIds).size === allQlIds.length, "duplicate chapter QL identity");
for (const [index, qlId] of allQlIds.entries()) {
  assert(qlId === `NUM-QL-${String(index + 1).padStart(3, "0")}`, `${qlId}: non-continuous chapter identity`);
}

for (const allocation of NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS) {
  assert(allocation.lastQlNumber - allocation.firstQlNumber + 1 === allocation.permanentQlCount, `${allocation.cpId}: range count`);
  assert(!allocation.active, `${allocation.cpId}: active leak`);
  assert(!allocation.questionStudioDiscoverable, `${allocation.cpId}: Question Studio leak`);
  assert(!allocation.questionBankWritable, `${allocation.cpId}: Question Bank leak`);
  assert(!allocation.testEligible, `${allocation.cpId}: test leak`);
  assert(!allocation.publiclyPublishable, `${allocation.cpId}: public leak`);
}

const cp001 = NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.find((entry) => entry.cpId === "NUM-CP-001");
assert(cp001?.firstQlNumber === 124, "CP-001 first QL");
assert(cp001?.lastQlNumber === 144, "CP-001 last QL");
assert(cp001?.permanentQlCount === 21, "CP-001 permanent count");
assert(cp001?.frozenSolveModeCount === 21, "CP-001 solve-mode count");
assert(cp001?.maturity === "MULTILINGUAL_IMPLEMENTATION_FROZEN", "CP-001 multilingual-freeze maturity");
assert(cp001?.language === "en/hi/pa", "CP-001 frozen language coverage");

assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.first === 1, "chapter first QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.last === 144, "chapter last QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.count === 144, "chapter QL count");
assert(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT === 145, "next chapter QL identity");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_CURRENT_ALLOCATION_AUTHORITY",
  completedCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length,
  completedCheckpoints: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.map((entry) => entry.cpId),
  permanentChapterRange: NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  cp003Range: "NUM-QL-001..NUM-QL-017",
  cp004Range: "NUM-QL-018..NUM-QL-045",
  cp005Range: "NUM-QL-046..NUM-QL-069",
  cp006Range: "NUM-QL-070..NUM-QL-097",
  cp007Range: "NUM-QL-098..NUM-QL-123",
  cp001Range: "NUM-QL-124..NUM-QL-144",
  cp001Maturity: cp001?.maturity,
  cp001Languages: cp001?.language,
  cp001FrozenSolveModeCount: cp001?.frozenSolveModeCount,
  nextPermanentQlNumber: NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
  activeCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.active).length,
}, null, 2));
