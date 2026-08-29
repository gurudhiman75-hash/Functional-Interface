import {
  NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS,
  NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
} from "./number-system-current-allocation-registry";
import {
  NUMBER_SYSTEM_FINAL_CHECKPOINT_COUNT,
  NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS,
  formatNumberSystemQlId,
} from "./number-system-final-allocation-authority";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length === NUMBER_SYSTEM_FINAL_CHECKPOINT_COUNT, "completed checkpoint count");
assert(new Set(NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.map((entry) => entry.cpId)).size === 14, "unique completed CP identity");

const expectedCpIds = Array.from({ length: 14 }, (_, index) => `NUM-CP-${String(index + 1).padStart(3, "0")}`);
const actualCpIds = [...NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.map((entry) => entry.cpId)].sort();
assert(JSON.stringify(actualCpIds) === JSON.stringify(expectedCpIds), "completed CP001..CP014 coverage");

let expectedFirst = 1;
let total = 0;
for (const allocation of NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS) {
  assert(allocation.firstQlNumber === expectedFirst, `${allocation.cpId}: allocation gap/overlap before first QL`);
  assert(allocation.lastQlNumber - allocation.firstQlNumber + 1 === allocation.permanentQlCount, `${allocation.cpId}: range count`);
  assert(allocation.frozenLearnerTemplateCount === allocation.permanentQlCount, `${allocation.cpId}: learner-template count`);
  assert(allocation.frozenSolveModeCount >= 1, `${allocation.cpId}: missing frozen solve modes`);
  assert(allocation.maturity === "PERMANENT_ALLOCATION_MERGED", `${allocation.cpId}: allocation maturity`);
  assert(!allocation.active, `${allocation.cpId}: active leak`);
  assert(!allocation.questionStudioDiscoverable, `${allocation.cpId}: design-registry Question Studio leak`);
  assert(!allocation.questionBankWritable, `${allocation.cpId}: Question Bank leak`);
  assert(!allocation.testEligible, `${allocation.cpId}: test leak`);
  assert(!allocation.publiclyPublishable, `${allocation.cpId}: public leak`);
  expectedFirst = allocation.lastQlNumber + 1;
  total += allocation.permanentQlCount;
}

assert(total === 253, "chapter permanent QL count");
assert(expectedFirst === 254, "chapter next-free identity after contiguous allocation");
assert(NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS.length === 253, "final QL ID inventory size");
assert(new Set(NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS).size === 253, "duplicate final QL identity");
for (const [index, qlId] of NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS.entries()) {
  assert(qlId === formatNumberSystemQlId(index + 1), `${qlId}: non-contiguous final identity`);
}

const expectedRanges = Object.freeze({
  "NUM-CP-003": [1, 17, 17],
  "NUM-CP-004": [18, 45, 28],
  "NUM-CP-005": [46, 69, 24],
  "NUM-CP-006": [70, 97, 28],
  "NUM-CP-007": [98, 123, 26],
  "NUM-CP-001": [124, 144, 21],
  "NUM-CP-002": [145, 165, 21],
  "NUM-CP-008": [166, 184, 19],
  "NUM-CP-009": [185, 196, 12],
  "NUM-CP-010": [197, 212, 16],
  "NUM-CP-011": [213, 225, 13],
  "NUM-CP-012": [226, 236, 11],
  "NUM-CP-013": [237, 247, 11],
  "NUM-CP-014": [248, 253, 6],
} as const);

for (const allocation of NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS) {
  const expected = expectedRanges[allocation.cpId as keyof typeof expectedRanges];
  assert(Boolean(expected), `${allocation.cpId}: missing expected final range`);
  assert(allocation.firstQlNumber === expected[0], `${allocation.cpId}: first QL drift`);
  assert(allocation.lastQlNumber === expected[1], `${allocation.cpId}: last QL drift`);
  assert(allocation.permanentQlCount === expected[2], `${allocation.cpId}: permanent count drift`);
}

assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.first === 1, "chapter first QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.last === 253, "chapter last QL");
assert(NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE.count === 253, "chapter QL count");
assert(NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT === 254, "next chapter QL identity");
assert(!NUMBER_SYSTEM_FINAL_PERMANENT_QL_IDS.includes("NUM-QL-254" as never), "QL254 must remain unallocated");

console.log(JSON.stringify({
  status: "PASS_NUMBER_SYSTEM_FINAL_ALLOCATION_AUTHORITY",
  completedCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.length,
  completedCheckpoints: actualCpIds,
  permanentChapterRange: NUMBER_SYSTEM_CURRENT_PERMANENT_QL_RANGE,
  permanentQlCount: total,
  nextPermanentQlNumber: NUMBER_SYSTEM_NEXT_PERMANENT_QL_NUMBER_CURRENT,
  ql254Allocated: false,
  activeCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.active).length,
  questionBankWritableCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.questionBankWritable).length,
  testEligibleCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.testEligible).length,
  publiclyPublishableCheckpointCount: NUMBER_SYSTEM_COMPLETED_CHECKPOINT_ALLOCATIONS.filter((entry) => entry.publiclyPublishable).length,
}, null, 2));
