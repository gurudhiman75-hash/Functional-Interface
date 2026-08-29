import assert from "node:assert/strict";
import {
  NUM_CP009_ALLOCATION_STATUS,
  NUM_CP009_PERMANENT_ALLOCATION,
  NUM_CP009_PERMANENT_QL_IDS,
} from "./permanent-allocation.ts";

const expectedQlIds = Array.from(
  { length: 12 },
  (_, index) => `NUM-QL-${String(185 + index).padStart(3, "0")}`,
);

assert.equal(NUM_CP009_PERMANENT_ALLOCATION.length, 12);
assert.deepEqual([...NUM_CP009_PERMANENT_QL_IDS], expectedQlIds);
assert.equal(new Set(NUM_CP009_PERMANENT_ALLOCATION.map((item) => item.qlId)).size, 12);
assert.equal(new Set(NUM_CP009_PERMANENT_ALLOCATION.map((item) => item.authorityId)).size, 12);

const expectedAuthorityLabels = [
  "Unit digit of a single power",
  "Unit digit of a short composed power expression",
  "Unit digit of a bounded power tower",
  "Unit-digit cycle length",
  "Exponent class set from terminal conditions",
  "Bounded exponent count from a terminal condition",
  "Last two digits of a power expression",
  "Last three digits of a power expression",
  "Complete bounded exponent set from a terminal condition",
  "Terminal-digit feasibility",
  "Unit digit with a structured exponent",
  "Unit digit of a long repeated-power sum",
];
assert.deepEqual(NUM_CP009_PERMANENT_ALLOCATION.map((item) => item.label), expectedAuthorityLabels);

const slices = NUM_CP009_PERMANENT_ALLOCATION.flatMap((item) => [...item.sourceSlices]);
assert.equal(slices.length, 18, "P015 must contribute one slice to each terminal-width authority");

const prototypeCounts = new Map<string, number>();
for (const slice of slices) {
  prototypeCounts.set(slice.prototypeId, (prototypeCounts.get(slice.prototypeId) ?? 0) + 1);
}
assert.equal(prototypeCounts.size, 17, "All 17 discovery prototypes must feed permanent authority");
for (let prototypeNumber = 1; prototypeNumber <= 17; prototypeNumber += 1) {
  const prototypeId = `NUM-CP009-PROT-${String(prototypeNumber).padStart(3, "0")}`;
  assert.equal(
    prototypeCounts.get(prototypeId),
    prototypeNumber === 15 ? 2 : 1,
    `${prototypeId}: permanent allocation contribution drift`,
  );
}

const lastTwoAllocation = NUM_CP009_PERMANENT_ALLOCATION.find((item) => item.qlId === "NUM-QL-191")!;
const lastThreeAllocation = NUM_CP009_PERMANENT_ALLOCATION.find((item) => item.qlId === "NUM-QL-192")!;
assert.ok(
  lastTwoAllocation.sourceSlices.some(
    (slice) => slice.prototypeId === "NUM-CP009-PROT-015" && slice.requiredAnswerSemantic === "LAST_TWO_DIGITS",
  ),
  "NUM-QL-191 must own the P015 last-two slice",
);
assert.ok(
  lastThreeAllocation.sourceSlices.some(
    (slice) => slice.prototypeId === "NUM-CP009-PROT-015" && slice.requiredAnswerSemantic === "LAST_THREE_DIGITS",
  ),
  "NUM-QL-192 must own the P015 last-three slice",
);

assert.equal(NUM_CP009_ALLOCATION_STATUS.approvalStatus, "EXPLICIT_COUNT_APPROVAL_RECEIVED");
assert.equal(NUM_CP009_ALLOCATION_STATUS.approvedAuthorityCount, 12);
assert.equal(NUM_CP009_ALLOCATION_STATUS.permanentQlCount, 12);
assert.equal(NUM_CP009_ALLOCATION_STATUS.firstPermanentQl, "NUM-QL-185");
assert.equal(NUM_CP009_ALLOCATION_STATUS.lastPermanentQl, "NUM-QL-196");
assert.equal(NUM_CP009_ALLOCATION_STATUS.nextAvailableQl, "NUM-QL-197");
assert.equal(NUM_CP009_ALLOCATION_STATUS.permanentIdentitiesAllocated, true);
assert.equal(NUM_CP009_ALLOCATION_STATUS.englishRuntimeFrozen, true);
for (const locked of [
  NUM_CP009_ALLOCATION_STATUS.active,
  NUM_CP009_ALLOCATION_STATUS.questionStudioDiscoverable,
  NUM_CP009_ALLOCATION_STATUS.questionBankWritable,
  NUM_CP009_ALLOCATION_STATUS.testEligible,
  NUM_CP009_ALLOCATION_STATUS.publiclyPublishable,
]) assert.equal(locked, false);

console.log(JSON.stringify({
  status: "PASS_NUM_CP009_PERMANENT_ALLOCATION",
  permanentQlCount: NUM_CP009_PERMANENT_ALLOCATION.length,
  firstPermanentQl: NUM_CP009_ALLOCATION_STATUS.firstPermanentQl,
  lastPermanentQl: NUM_CP009_ALLOCATION_STATUS.lastPermanentQl,
  nextAvailableQl: NUM_CP009_ALLOCATION_STATUS.nextAvailableQl,
  sourceSliceCount: slices.length,
  discoveryPrototypeCount: prototypeCounts.size,
  p015SplitSlices: 2,
}, null, 2));
