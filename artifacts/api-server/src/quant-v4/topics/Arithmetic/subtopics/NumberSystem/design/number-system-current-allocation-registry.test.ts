import {
  NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
} from "./number-system-current-allocation-registry";
import { NUM_CP003_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-003/permanent/allocation";
import { NUM_CP004_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-004/permanent/allocation";
import { NUM_CP005_PERMANENT_QL_IDS } from "../NUM-001/NUM-CP-005/permanent/allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length === 3, "completed checkpoint count");
assert(NUM_CP003_PERMANENT_QL_IDS.length === 17, "CP-003 QL count");
assert(NUM_CP004_PERMANENT_QL_IDS.length === 28, "CP-004 QL count");
assert(NUM_CP005_PERMANENT_QL_IDS.length === 24, "CP-005 QL count");

const allQlIds = [
  ...NUM_CP003_PERMANENT_QL_IDS,
  ...NUM_CP004_PERMANENT_QL_IDS,
  ...NUM_CP005_PERMANENT_QL_IDS,
];
assert(allQlIds.length === 69, "chapter permanent QL count");
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

assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.first === 1, "chapter first QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.last === 69, "chapter last QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.count === 69, "chapter QL count");
assert(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT === 70, "next chapter QL identity");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_CURRENT_ALLOCATION_AUTHORITY",
  completedCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length,
  completedCheckpoints: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.map((entry) => entry.cpId),
  permanentChapterRange: NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  cp003Range: "NUM-QL-001..NUM-QL-017",
  cp004Range: "NUM-QL-018..NUM-QL-045",
  cp005Range: "NUM-QL-046..NUM-QL-069",
  nextPermanentQlNumber: NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
  activeCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.active).length,
}, null, 2));
