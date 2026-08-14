import assert from "node:assert/strict";
import { WOR_001_ALL_PROTOTYPES } from "./prototype-registry";
import { WOR_001_QUESTION_STUDIO_ADAPTER } from "./question-studio-adapter";

const validStatuses = new Set(["PYQ_SUPPORTED", "PLATFORM_SUPPORTED", "EXPLORATORY_SOURCE_GAP"]);
assert.equal(WOR_001_ALL_PROTOTYPES.length, 24);
assert.ok(WOR_001_ALL_PROTOTYPES.every((prototype) => validStatuses.has(prototype.sourceEvidenceStatus)));

const freezeDecisionFor = (prototype: (typeof WOR_001_ALL_PROTOTYPES)[number]) => {
  if (prototype.allocationDecision === "MERGE_AS_INSTANCE_VARIANT") return "INSTANCE_VARIANT_NO_QL" as const;
  if (prototype.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP") return "DEFER_SOURCE_GAP" as const;
  return "ELIGIBLE_AFTER_EDITORIAL" as const;
};

const cp003 = WOR_001_ALL_PROTOTYPES.filter((prototype) => prototype.checkpointId === "WOR-CP-003");
assert.equal(cp003.length, 6);
assert.ok(cp003.every((prototype) => prototype.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP"));
assert.ok(cp003.every((prototype) => freezeDecisionFor(prototype) === "DEFER_SOURCE_GAP"));

const cp005 = WOR_001_ALL_PROTOTYPES.filter((prototype) => prototype.checkpointId === "WOR-CP-005");
assert.equal(cp005.length, 5);
assert.ok(cp005.every((prototype) => prototype.sourceEvidenceStatus === "PYQ_SUPPORTED"));
assert.deepEqual(cp005.filter((prototype) => prototype.allocationDecision === "RETAIN").map((prototype) => prototype.prototypeId), [
  "WOR-PROT-021",
  "WOR-PROT-022",
  "WOR-PROT-023",
  "WOR-PROT-024",
]);
assert.deepEqual(cp005.filter((prototype) => prototype.allocationDecision === "MERGE_AS_INSTANCE_VARIANT").map((prototype) => prototype.prototypeId), ["WOR-PROT-020"]);

const directPyq = WOR_001_ALL_PROTOTYPES.filter((prototype) => prototype.sourceEvidenceStatus === "PYQ_SUPPORTED");
for (const taskKind of [
  "SELECT_COMPLETE_ORDER",
  "SELECT_FIRST",
  "SELECT_KTH",
  "BANK_SORT_CONCAT_CHAR",
  "BANK_SORT_LOCAL_CHAR",
  "BANK_TRANSFORM_SORT_POSITION",
  "BANK_TRANSFORM_SORT_LOCAL_CHAR",
]) {
  assert.ok(directPyq.some((prototype) => prototype.taskKind === taskKind), `Missing PYQ-backed task ${taskKind}.`);
}

const sourceGaps = WOR_001_ALL_PROTOTYPES.filter((prototype) => prototype.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP");
assert.ok(sourceGaps.every((prototype) => freezeDecisionFor(prototype) !== "ELIGIBLE_AFTER_EDITORIAL"));

const freezeEligible = WOR_001_ALL_PROTOTYPES.filter((prototype) => freezeDecisionFor(prototype) === "ELIGIBLE_AFTER_EDITORIAL");
const sourceDeferred = WOR_001_ALL_PROTOTYPES.filter((prototype) => freezeDecisionFor(prototype) === "DEFER_SOURCE_GAP");
const instanceVariants = WOR_001_ALL_PROTOTYPES.filter((prototype) => freezeDecisionFor(prototype) === "INSTANCE_VARIANT_NO_QL");
assert.deepEqual(freezeEligible.map((prototype) => prototype.prototypeId), [
  "WOR-PROT-001",
  "WOR-PROT-003",
  "WOR-PROT-005",
  "WOR-PROT-006",
  "WOR-PROT-021",
  "WOR-PROT-022",
  "WOR-PROT-023",
  "WOR-PROT-024",
]);
assert.equal(freezeEligible.length, 8);
assert.equal(sourceDeferred.length, 8);
assert.equal(instanceVariants.length, 8);

// Content architecture may be complete, but publication remains blocked by pool and human editorial gates.
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.permanentQlCount, 0);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.questionStudioVisible, false);
assert.equal(WOR_001_QUESTION_STUDIO_ADAPTER.publicReleaseEnabled, false);

console.log("WOR-001 chapter-wide source/governance audit passed.", {
  prototypes: WOR_001_ALL_PROTOTYPES.length,
  freezeEligible: freezeEligible.map((prototype) => prototype.prototypeId),
  sourceDeferred: sourceDeferred.map((prototype) => prototype.prototypeId),
  instanceVariants: instanceVariants.map((prototype) => prototype.prototypeId),
});
